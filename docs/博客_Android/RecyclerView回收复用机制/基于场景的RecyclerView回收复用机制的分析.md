最近在研究 RecyclerView 的回收复用机制，顺便记录一下。我们知道，RecyclerView 在 layout 子 View 时，都通过回收复用机制来管理。网上关于回收复用机制的分析讲解的文章也有一大堆了，分析得也都很详细，什么四级缓存啊，先去 mChangedScrap 取再去哪里取啊之类的；但其实，我想说的是，RecyclerView 的回收复用机制确实很完善，覆盖到各种场景中，但并不是每种场景的回收复用时都会将机制的所有流程走一遍的。举个例子说，在 setLayoutManager、setAdapter、notifyDataSetChanged 或者滑动时等等这些场景都会触发回收复用机制的工作。但是如果只是 RecyclerView 滑动的场景触发的回收复用机制工作时，其实并不需要四级缓存都参与的。  

emmm，应该讲得还是有点懵，那就继续看下去吧，会一点一点慢慢分析。本篇不会像其他大神的文章一样，把回收复用机制源码一行行分析下来，我也没那个能力，所以我会基于一种特定的场景来分析源码，这样会更容易理解的。废话结束，开始正题。  

# 正题  
RecyclerView 的回收复用机制的内部实现都是由 Recycler 内部类实现，下面就都以这样一种页面的滑动场景来讲解 RecyclerView 的回收复用机制。  

![RecyclerView页面.png](http://upload-images.jianshu.io/upload_images/1924341-2c4220087dee4a6a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
相应的版本：
RecyclerView:  recyclerview-v7-25.1.0.jar
LayoutManager:  GridLayoutManager extends LinearLayoutManager (recyclerview-v7-25.1.0.jar)

这个页面每行可显示5个卡位，每个卡位的 item 布局 type 一致。

开始分析回收复用机制之前，先提几个问题：

#### Q1:如果向下滑动，新一行的5个卡位的显示会去复用缓存的 ViewHolder，第一行的5个卡位会移出屏幕被回收，那么在这个过程中，是先进行复用再回收？还是先回收再复用？还是边回收边复用？也就是说，新一行的5个卡位复用的 ViewHolder 有可能是第一行被回收的5个卡位吗？

第二个问题之前，先看几张图片：  

![先向下再向上滑动.png](http://upload-images.jianshu.io/upload_images/1924341-b92c5bdf40d5c973.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
黑框表示屏幕，RecyclerView 先向下滑动，第三行卡位显示出来，再向上滑动，第三行移出屏幕，第一行显示出来。我们分别在 Adapter 的 onCreateViewHolder()  和  onBindViewHolder()  里打日志，下面是这个过程的日志：

![日志.png](http://upload-images.jianshu.io/upload_images/1924341-d53948d61444967d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

红框1是 RecyclerView 向下滑动操作的日志，第三行5个卡位的显示都是重新创建的 ViewHolder ；红框2是再次向上滑动时的日志，第一行5个卡位的重新显示用的 ViewHolder 都是复用的，因为没有 create viewHolder 的日志，然后只有后面3个卡位重新绑定数据，调用了onBindViewHolder()；那么问题来了：

#### Q2: 在这个过程中，为什么当 RecyclerView 再次向上滑动重新显示第一行的5个卡位时，只有后面3个卡位触发了 onBindViewHolder() 方法，重新绑定数据呢？明明5个卡位都是复用的。

在上面的操作基础上，我们继续往下操作：  

![先向下再向下.png](http://upload-images.jianshu.io/upload_images/1924341-303c949a54504fb4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
 
在第二个问题操作的基础上，目前已经创建了15个 ViewHolder，此时显示的是第1、2行的卡位，那么继续向下滑动两次，这个过程的日志如下：  
![日志.png](http://upload-images.jianshu.io/upload_images/1924341-d4eddb89b0254056.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
红框1是第二个问题操作的日志，在这里截出来只是为了显示接下去的日志是在上面的基础上继续操作的；  

红框2就是第一次向下滑时的日志，对比问题2的日志，这次第三行的5个卡位用的 ViewHolder 也都是复用的，而且也只有后面3个卡位触发了 onBindViewHolder() 重新绑定数据；  

红框3是第二次向下滑动时的日志，这次第四行的5个卡位，前3个的卡位用的 ViewHolder 是复用的，后面2个卡位的 ViewHolder 则是重新创建的，而且5个卡位都调用了 onBindViewHolder() 重新绑定数据；

那么，

#### Q3：接下去不管是向上滑动还是向下滑动，滑动几次，都不会再有 onCreateViewHolder() 的日志了，也就是说 RecyclerView 总共创建了17个 ViewHolder，但有时一行的5个卡位只有3个卡位需要重新绑定数据，有时却又5个卡位都需要重新绑定数据，这是为什么呢？

如果明白 RecyclerView 的回收复用机制，那么这三个问题也就都知道原因了；反过来，如果知道这三个问题的原因，那么理解 RecyclerView 的回收复用机制也就更简单了；所以，带着问题，在特定的场景下去分析源码的话，应该会比较容易。

# 源码分析
其实，根据问题2的日志，我们就可以回答问题1了。在目前显示1、2行，
ViewHolder 的个数为10个的基础上，第三行的5个新卡位要显示出来都需要重新创建 ViewHolder，也就是说，在这个向下滑动的过程，是5个新卡位的复用机制先进行工作，然后第1行的5个被移出屏幕的卡位再进行回收机制工作。

那么，就先来看看复用机制的源码

## 复用机制
#### getViewForPosition()  

![Recycler.getViewForPosition()](http://upload-images.jianshu.io/upload_images/1924341-0219f140e17d330a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
  
![Recycler.getViewForPosition()](http://upload-images.jianshu.io/upload_images/1924341-c66cd4f84f487f35.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![Recycler.tryGetViewHolderForPositionByDeadline](http://upload-images.jianshu.io/upload_images/1924341-062fc4ed24ce8cc3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


这个方法是复用机制的入口，也就是 Recycler 开放给外部使用复用机制的api，外部调用这个方法就可以返回想要的 View，而至于这个 View 是复用而来的，还是重新创建得来的，就都由 Recycler 内部实现，对外隐藏。
 
 
 
#### tryGetViewHolderForPositionByDeadline()
所以，Recycler 的复用机制内部实现就在这个方法里。
分析逻辑之前，先看一下 Recycler 的几个结构体，用来缓存 ViewHolder 的。
 
![Recycler](http://upload-images.jianshu.io/upload_images/1924341-514b75b8ac9f01a7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**mAttachedScrap:** 用于缓存显示在屏幕上的 item 的 ViewHolder，场景好像是 RecyclerView 在 onLayout 时会先把 children 都移除掉，再重新添加进去，所以这个 List 应该是用在布局过程中临时存放 children 的，反正在 RecyclerView 滑动过程中不会在这里面来找复用的 ViewHolder 就是了。  

**mChangedScrap：** 这个没理解是干嘛用的，看名字应该跟 ViewHolder 的数据发生变化时有关吧，在 RecyclerView 滑动的过程中，也没有发现到这里找复用的 ViewHolder，所以这个可以先暂时放一边。  

**mCachedViews：**这个就重要得多了，滑动过程中的回收和复用都是先处理的这个 List，这个集合里存的 ViewHolder 的原本数据信息都在，所以可以直接添加到 RecyclerView 中显示，不需要再次重新 onBindViewHolder()。  

**mUnmodifiableAttachedScrap：** 不清楚干嘛用的，暂时跳过。  

**mRecyclerPool：**这个也很重要，但存在这里的 ViewHolder 的数据信息会被重置掉，相当于 ViewHolder 是一个重创新建的一样，所以需要重新调用 onBindViewHolder 来绑定数据。  

**mViewCacheExtension：**这个是留给我们自己扩展的，好像也没怎么用，就暂时不分析了。  

那么接下去就看看复用的逻辑：
 
![第1步](http://upload-images.jianshu.io/upload_images/1924341-dd0abac988209aac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

第一步很简单，position 如果在 item 的范围之外的话，那就抛异常吧。继续往下看
 
![第2步](http://upload-images.jianshu.io/upload_images/1924341-5955fa256f00749d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果是在 isPreLayout() 时，那么就去 mChangedScrap 中找。
那么这个 isPreLayout 表示的是什么？，有两个赋值的地方。
 
![延伸](http://upload-images.jianshu.io/upload_images/1924341-0ad8abab6a21751d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![延伸](http://upload-images.jianshu.io/upload_images/1924341-7cb20c36f5dce0f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 
emmm，看样子，在 LayoutManager 的 onLayoutChildren 前就会置为
 false，不过我还是不懂这个过程是干嘛的，滑动过程中好像
 mState.mInPreLayou = false，所以并不会来这里，先暂时跳过。继续往下。
 
![第3步](http://upload-images.jianshu.io/upload_images/1924341-95f3949e0eb31034.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

跟进这个方法看看
 
![第3.1步 getScrapOrHiddenOrCachedHolderForPosition()](http://upload-images.jianshu.io/upload_images/1924341-fd4004b2d8ace021.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

首先，去 mAttachedScrap 中寻找 position 一致的 viewHolder，需要匹配一些条件，大致是这个 viewHolder 没有被移除，是有效的之类的条件，满足就返回这个 viewHolder。  

所以，这里的关键就是要理解这个 mAttachedScrap 到底是什么，存的是哪些 ViewHolder。  

一次遥控器按键的操作，不管有没有发生滑动，都会导致 RecyclerView 的重新 onLayout，那要 layout 的话，RecyclerView 会先把所有 children 先 remove 掉，然后再重新 add 上去，完成一次 layout 的过程。那么这暂时性的 remove 掉的 viewHolder 要存放在哪呢，就是放在这个 mAttachedScrap 中了，这就是我的理解了。  

所以，感觉这个 mAttachedScrap 中存放的 viewHolder 跟回收和复用关系不大。  

**网上一些分析的文章有说，RecyclerView 在复用时会按顺序去 mChangedScrap, mAttachedScrap 等等缓存里找，没有找到再往下去找，从代码上来看是这样没错，但我觉得这样表述有问题。因为就我们这篇文章基于 RecyclerView 的滑动场景来说，新卡位的复用以及旧卡位的回收机制，其实都不会涉及到mChangedScrap 和 mAttachedScrap，所以我觉得还是基于某种场景来分析相对应的回收复用机制会比较好。就像mChangedScrap 我虽然没理解是干嘛用的，但我猜测应该是在当数据发生变化时才会涉及到的复用场景，所以当我分析基于滑动场景时的复用时，即使我对这块不理解，影响也不会很大。**

继续往下看
 
![第3.2步](http://upload-images.jianshu.io/upload_images/1924341-3f3d614ebc2bb4d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

emmm，这段也还是没看懂，但估计应该需要一些特定的场景下所使用的复用策略吧，看名字，应该跟 hidden 有关？不懂，跳过这段，应该也没事，滑动过程中的回收复用跟这个应该也关系不大。
 
![第3.3步](http://upload-images.jianshu.io/upload_images/1924341-1acce2d9f2295352.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这里就要画重点啦，记笔记记笔记，滑动场景中的复用会用到这里的机制。  

mCachedViews 的大小默认为2。遍历 mCachedViews，找到 position 一致的 ViewHolder，之前说过，mCachedViews 里存放的 ViewHolder 的数据信息都保存着，**所以 mCachedViews 可以理解成，只有原来的卡位可以重新复用这个 ViewHolder，新位置的卡位无法从 mCachedViews 里拿 ViewHolder出来用**。  

找到 viewholder 后
 
![第4步](http://upload-images.jianshu.io/upload_images/1924341-33c21c465f1a5f0e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

就算 position 匹配找到了 ViewHolder，还需要判断一下这个 ViewHolder 是否已经被 remove 掉，type 类型一致不一致，如下。
 
![第4.1步](http://upload-images.jianshu.io/upload_images/1924341-80dabf9da20a7c61.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

以上是在 mCachedViews 中寻找，没有找到的话，就继续再找一遍，刚才是通过 position 来找，那这次就换成id，然后重复上面的步骤再找一遍，如下


![第5步](http://upload-images.jianshu.io/upload_images/1924341-752a669b3dd132e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 
getScrapOrCachedViewForId() 做的事跟 getScrapOrHiddenOrCacheHolderForPosition() 其实差不多，只不过一个是通过 position 来找 ViewHolder，一个是通过 id 来找。而这个 id 并不是我们在 xml 中设置的 android:id， 而是 Adapter 持有的一个属性，默认是不会使用这个属性的，所以这个第5步其实是不会执行的，除非我们重写了 Adapter 的 setHasStableIds()，既然不是常用的场景，那就先略过吧，那就继续往下。  


![第6步](http://upload-images.jianshu.io/upload_images/1924341-1f1f95bc355341cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个就是常说扩展类了，RecyclerView 提供给我们自定义实现的扩展类，我们可以重写 getViewForPositionAndType() 方法来实现自己的复用策略。不过，也没用过，那这部分也当作不会执行，略过。继续往下
 
![第7步](http://upload-images.jianshu.io/upload_images/1924341-7ada33cd0a3be804.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这里也是重点了，记笔记记笔记。  

这里是去 RecyclerViewPool 里取 ViewHolder，ViewPool 会根据不同的 item type 创建不同的 List，每个 List 默认大小为5个。看一下去 ViewPool 里是怎么找的
 
![第7.1步](http://upload-images.jianshu.io/upload_images/1924341-896c18cd0add29e9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

之前说过，ViewPool 会根据不同的 viewType 创建不同的集合来存放 ViewHolder，那么复用的时候，只要 ViewPool 里相同的 type 有 ViewHolder 缓存的话，就将最后一个拿出来复用，不用像 mCachedViews 需要各种匹配条件，**只要有就可以复用**。  

继续看"图第7步"后面的代码，拿到 ViewHolder 之后，还会再次调用 resetInternal() 来重置 ViewHolder，这样 ViewHolder 就可以当作一个全新的 ViewHolder 来使用了，**这也就是为什么从这里拿的 ViewHolder 都需要重新 onBindViewHolder() 了**。  

那如果在 ViewPool 里还是没有找到呢，继续往下看
 
![第8步](http://upload-images.jianshu.io/upload_images/1924341-f7703cc224f0e0c4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果 ViewPool 中都没有找到 ViewHolder 来使用的话，那就调用 Adapter 的 onCreateViewHolder 来创建一个新的 ViewHolder 使用。

上面一共有很多步骤来找 ViewHolder，不管在哪个步骤，只要找到 ViewHolder 的话，那下面那些步骤就不用管了，然后都要继续往下判断是否需要重新绑定数据，还有检查布局参数是否合法。如下：

![最后1步](http://upload-images.jianshu.io/upload_images/1924341-f9652f153a1c720b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
到这里，tryGetViewHolderForPositionByDeadline() 这个方法就结束了。这大概就是 RecyclerView 的复用机制，中间我们跳过很多地方，因为 RecyclerView 有各种场景可以刷新他的 view，比如重新 setLayoutManager()，重新 setAdapter()，或者 notifyDataSetChanged()，或者滑动等等之类的场景，只要重新layout，就会去回收和复用 ViewHolder，所以这个复用机制需要考虑到各种各样的场景。  

把代码一行行的啃透有点吃力，所以我就只借助 RecyclerView 的滑动的这种场景来分析它涉及到的回收和复用机制。

下面就分析一下回收机制  

# 回收机制
回收机制的入口就有很多了，因为 Recycler 有各种结构体，比如mAttachedScrap，mCachedViews 等等，不同结构体回收的时机都不一样，入口也就多了。

所以，还是基于 RecyclerView 的滑动场景下，移出屏幕的卡位回收时的入口是：
 
![Recycler.recyclerView()](http://upload-images.jianshu.io/upload_images/1924341-8d193a934e418fa8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

本篇分析的滑动场景，在 RecyclerView 滑动时，会交由 LinearLayoutManager 的 scrollVerticallyBy() 去处理，然后 LayoutManager 会接着调用 fill() 方法去处理需要复用和回收的卡位，最终会调用上述 recyclerView() 这个方法开始进行回收工作。  


![recycleViewHolderInternal()](http://upload-images.jianshu.io/upload_images/1924341-834a4aab4895b4c8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![上图第一个红框中的代码](http://upload-images.jianshu.io/upload_images/1924341-f1f4e8224cf9c988.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![从 mCacheViews 中扔 ViewHolder 到 ViewPool中去](http://upload-images.jianshu.io/upload_images/1924341-83988040a9be33b0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![addViewHolderToRecycledViewPool](http://upload-images.jianshu.io/upload_images/1924341-413caf31ef770f40.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![putRecycledView()](http://upload-images.jianshu.io/upload_images/1924341-c63dd51c788f895e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  
回收的逻辑比较简单，由 LayoutManager 来遍历移出屏幕的卡位，然后对每个卡位进行回收操作，回收时，都是把 ViewHolder 放在 mCachedViews 里面，如果 mCachedViews 满了，那就在 mCachedViews 里拿一个 ViewHolder 扔到 ViewPool 缓存里，然后 mCachedViews 就可以空出位置来放新回收的 ViewHolder 了。

## 总结一下：
RecyclerView 滑动场景下的回收复用涉及到的结构体两个：
**mCachedViews 和 RecyclerViewPool**

mCachedViews 优先级高于 RecyclerViewPool，回收时，最新的 ViewHolder 都是往 mCachedViews 里放，如果它满了，那就移出一个扔到 ViewPool 里好空出位置来缓存最新的 ViewHolder。   

复用时，也是先到 mCachedViews 里找 ViewHolder，但需要各种匹配条件，概括一下就是只有原来位置的卡位可以复用存在 mCachedViews 里的 ViewHolder，如果 mCachedViews 里没有，那么才去 ViewPool 里找。  

在 ViewPool 里的 ViewHolder 都是跟全新的 ViewHolder 一样，只要 type 一样，有找到，就可以拿出来复用，重新绑定下数据即可。  

整体的流程图如下：（可放大查看）
 

![滑动场景下的回收复用流程图.png](http://upload-images.jianshu.io/upload_images/1924341-0868f1fe3dcf17b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



最后，解释一下开头的问题

#### Q1:如果向下滑动，新一行的5个卡位的显示会去复用缓存的 ViewHolder，第一行的5个卡位会移出屏幕被回收，那么在这个过程中，是先进行复用再回收？还是先回收再复用？还是边回收边复用？也就是说，新一行的5个卡位复用的 ViewHolder 有可能是第一行被回收的5个卡位吗？

答：先复用再回收，新一行的5个卡位先去目前的 mCachedViews 和 ViewPool 的缓存中寻找复用，没有就重新创建，然后移出屏幕的那行的5个卡位再回收缓存到 mCachedViews 和 ViewPool 里面，所以新一行5个卡位和复用不可能会用到刚移出屏幕的5个卡位。


#### Q2: 在这个过程中，为什么当 RecyclerView 再次向上滑动重新显示第一行的5个卡位时，只有后面3个卡位触发了 onBindViewHolder() 方法，重新绑定数据呢？明明5个卡位都是复用的。

答：滑动场景下涉及到的回收和复用的结构体是 mCachedViews 和 ViewPool，前者默认大小为2，后者为5。所以，当第三行显示出来后，第一行的5个卡位被回收，回收时先缓存在 mCachedViews，满了再移出旧的到 ViewPool 里，所有5个卡位有2个缓存在 mCachedViews 里，3个缓存在 ViewPool，至于是哪2个缓存在 mCachedViews，这是由 LayoutManager 控制。  

上面讲解的例子使用的是 GridLayoutManager，滑动时的回收逻辑则是在父类 LinearLayoutManager 里实现，回收第一行卡位时是从后往前回收，所以最新的两个卡位是0、1，会放在 mCachedViews 里，而2、3、4的卡位则放在 ViewPool 里。  

所以，当再次向上滑动时，第一行5个卡位会去两个结构体里找复用，之前说过，mCachedViews 里存放的 ViewHolder 只有原本位置的卡位才能复用，所以0、1两个卡位都可以直接去 mCachedViews 里拿 ViewHolder 复用，而且这里的 ViewHolder 是不用重新绑定数据的，至于2、3、4卡位则去 ViewPool 里找，刚好 ViewPool 里缓存着3个 ViewHolder，所以第一行的5个卡位都是用的复用的，而从 ViewPool 里拿的复用需要重新绑定数据，才会这样只有三个卡位需要重新绑定数据。

#### Q3：接下去不管是向上滑动还是向下滑动，滑动几次，都不会再有 onCreateViewHolder() 的日志了，也就是说 RecyclerView 总共创建了17个 ViewHolder，但有时一行的5个卡位只有3个卡位需要重新绑定数据，有时却又5个卡位都需要重新绑定数据，这是为什么呢？

答：有时一行只有3个卡位需要重新绑定的原因跟Q2一样，因为 mCachedView 里正好缓存着当前位置的 ViewHolder，本来就是它的 ViewHolder 当然可以直接拿来用。而至于为什么会创建了17个 ViewHolder，那是因为再第四行的卡位要显示出来时，ViewPool 里只有3个缓存，而第四行的卡位又用不了 mCachedViews 里的2个缓存，因为这两个缓存的是6、7卡位的 ViewHolder，所以就需要再重新创建2个 ViewHodler 来给第四行最后的两个卡位使用。