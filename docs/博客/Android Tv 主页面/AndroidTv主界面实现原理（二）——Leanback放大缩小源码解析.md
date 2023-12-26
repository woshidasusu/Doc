先看个效果图：  

![效果图.png](http://upload-images.jianshu.io/upload_images/1924341-e4905bba8db493da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


上一篇中，我们留了问题，在 Tv Home 界面这种很常见聚焦卡位放大动画效果，我们这一篇就来看看 Leanback 库是怎么实现的。  

如果要我们自己实现的话，思路应该不难，就是写个放大、缩小动画，然后在卡位获得焦点时应用放大动画，失去焦点时应用缩小动画，所以关键点只是在于如何进行封装。那下面就来学学 **Google Leanback 库的 ItemView 缩放动画的实现思路。**  

#源码分析  
看源码时，我习惯带着目的性地去阅读，这样只要专注于理解跟目的相关的代码即可，不用每行代码地去分析，毕竟好多代码目前能力有限，还啃不透。  

那么，我们这次阅读源码的目的就是要搞清楚：**卡位获得焦点时放大、缩小动画是如何实现的？**  

**阅读源码时经常会碰到一个问题，那就是该从哪入手，从哪开始看？**  

这就是为什么我习惯带着目的去阅读，因为我们可以从目的分析，猜测我们需要的代码应该在哪里，然后找到我们该从哪里阅读，再一步步的去分析。  

比如我们这次的任务，我们该从哪里入手阅读源码呢？首先，你得先了解一下 Leanback 库的基本使用，这就是为什么我第一篇博客先简单介绍了 Leanback 库的使用。在上一篇博客里，可以看到，我们跟 Leanback 库打交道的也就是下面这几个类：  

- **ArrayObjectAdapter**：作用类似于 List，装填着整个页面的数据，页面数据其实是分两级，以行为单位和以每一行中的 Item 为单位，所以整个页面有一个 ArrayObjectAdapter(mRowsAdapter) 对象，它由许多行数据 ArrayObjectAdapter(rowAdapter) 对象组成，每行数据 rowAdapter 由许多 Item 组成。初始化一个 ArrayObjectAdapter 对象时，必须提供一个 Presenter 对象与它关联。      
- **ListRowPresenter**：Leanback 库中的 Presenter 作用都有些类似于 RecyclerView.Adapter，用于创建 ItemView 以及将数据绑定到 ItemView 上。    
- **ListRow**：可以理解成一个 Mode，也就是把每一行抽象封装成一个 ListRow  
- **BrowerFragment**：用来展示可左右上下滑动的视频列表界面，Leanback 已高度封装，我们只需提供一个页面的 ArrayObjectAdapter(mRowsAdapter) 对象，通过 ` setAdapter() ` 将数据设置进去，Leanback 会自动根据 ArrayObjectAdapter 里的数据以及和它关联的 Presenter 将界面显示出来。    

既然我们跟 Leanback 打交道只有这么几点，那么切入点应该就在这些，毕竟我们对 Leanback 并不熟，那么只能从我们接触到的地方来着手。  

那么，再来想想，既然是要实现卡位获得焦点和失去焦点时放大和缩小动画，那么肯定是需要监听 ItemView 的焦点变化，对吧？那我们通常是怎么做的，无外乎就是在 RecyclerView.Adapter 里的 ` onCreateViewHolder() ` 或 ` onBindViewHolder() ` 里监听 ItemView 的焦点变化吧。  

既然方向有了，那么就是要寻找 Leanback Home 界面对应的 RecyclerView.Adapter 是由哪个类实现的吧。我们也知道了在 Leanback 中 Presenter 的作用就是类似于 RecyclerView.Adapter，那么我们就先到 Presenter 里看一下。   

![ListRowPresenter.png](http://upload-images.jianshu.io/upload_images/1924341-bfa25dac0ead8e70.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

ListRowPresenter 继承自 RowPresenter 继承自 Presenter，那么我们通过 Android Studio 跳到 Presenter 里看看。  

![Presenter.png](http://upload-images.jianshu.io/upload_images/1924341-e5d9d3b3774a571b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Presenter 是个抽象类，有三个抽象方法， ` onCreateViewHolder()、onBindViewHolder()、onUnbindViewHolder() `，跟 RecyclerView.Adapter 很像吧。根据我们之前的分析， ItemView 焦点的监听通常是在 ` onCreateViewHolder() ` 或 ` onBindViewHolder() ` 里实现的，那么我们就去它的实现类 ListRowPresenter 里看一看。  

ListRowPresenter 里找不到这三个方法的实现，那么就是由它的父类 RowPresenter 实现了，我们继续通过 AS 跳到 RowPresenter 里看看。  

![RowPresenter.onCreateVIewHolder.png](http://upload-images.jianshu.io/upload_images/1924341-44f99bbd6458682b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

` onCreateViewHolder() ` 里的代码我们不用去理解，当然你有时间有能力也可以，但现在主要是想搞懂它的卡位缩放动画实现，所以我们只要看有没有跟焦点监听相关的代码即可。很显然，这里面并没有找打，里面调用了几个方法，有些方法一看就知道作用是创建某个对象的，你们也可以点进去看看，这里我们着重看一下 ` initializeRowViewHolder() ` 这个方法。  

![RowPresenter.initializeRowViewHolder.png](http://upload-images.jianshu.io/upload_images/1924341-d3f2d3c674917cc2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

好像也没找到跟焦点监听的相关代码，但是左边有个标志，说明子类 ListRowPresenter 有复写这个方法，那么代码运行时实际上是调用的之类的方法，那么我们就点进去看看。  

![ListRowPresenter.initializeRowViewHolder.png](http://upload-images.jianshu.io/upload_images/1924341-2489b0465dc8509b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

代码很多，截图也没截完，但是我们发现了一个关键，找到了一个看名字就觉得跟焦点有关的方法 ` FocusHighlightHelper.setupBrowseItemFocusHighlight() `，那么到底是不是呢？我们继续点击去看一下。  

![FocusHighlightHelper.setupBrowseItemFocusHighlight.png](http://upload-images.jianshu.io/upload_images/1924341-f639ea3bc48c35f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个方法的介绍大意就是说设置每行的 ItemView 即卡位获得焦点时的行为，这不就是指卡位的缩放动画嘛，看来我们找到了。看代码，是调用了 ItemBridgeAdapter 的 ` setFocusHighlight() ` 方法，继续跟进看一下。  

![ItemBridgeAdapter.setFocusHighlight.png](http://upload-images.jianshu.io/upload_images/1924341-74d52504a0a3de89.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![ItemBridgeAdapter.png](http://upload-images.jianshu.io/upload_images/1924341-3f189aa143303b74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

方法就只是设置了 mFocusHighlight 变量的值，而 ItemBridgeAdapter 是继承 RecyclerView.Adapter 的，看来卡位的焦点监听就是在这里实现了。看一下 ` onCreateViewHolder() ` 方法就知道是不是了。  

![ItemBridgeAdpater.onCreateViewHolder.png](http://upload-images.jianshu.io/upload_images/1924341-f62dfded698ce22a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

presenterView 其实就是在 Presenter 里创建出来的 ItemView，所以这里其实就是对卡位设置焦点的变化监听，viewHolder.mFocusChangeListener 应该是 View.OnFocusChangeListener 的对象，我们看一下。  

![ViewHolder.mFocusChangeListenre.png](http://upload-images.jianshu.io/upload_images/1924341-13c4d3aef07c3565.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

mFocusChangeListener 初始化通过实例化一个类对象赋值，那么这个类应该就是实现 View.OnFocusChangeListener 接口的，我们继续看一下。  

![ItemBridgeAdapter.onFocusChangeListener.png](http://upload-images.jianshu.io/upload_images/1924341-c03816ee664176ad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这下清楚了吧，焦点发生变化时，会去调用 mFcousHightlight 的 ` onItemFocused() ` 方法。而 mFcousHightlight 是之前 ` FocusHighlightHelper.setupBrowseItemFocusHighlight() ` 里调用了 ItemBridgeAdapter 的 ` setFocusHighlight() ` 方法传进来的，我们再看看它传进来的是什么。  

![FocusHighlightHelper.setupBrowseItemFocusHighlight2.png](http://upload-images.jianshu.io/upload_images/1924341-8ab0db29c1a8709a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

看一下 BrowseItemFocusHighlight 这个类做了什么。  

![OnItemFocused.png](http://upload-images.jianshu.io/upload_images/1924341-f68721b680b3f6fe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

所以，在 ItemBridgeAdapter 里注册了焦点变化监听，当焦点变化时，通知 mFcousHightlight 执行  ` onItemFocused() ` 方法，而 mFcousHightlight 是 BrowseItemFocusHighlight 类的实例，所以实际上是来执行上图里的逻辑。看代码也很容易明白，设置 ItemView 的选中状态，并且去运行一个焦点动画，那么卡位的缩放动画应该就是在这里实现了。继续看一下是不是。  

![getOrCreateAnimator.png](http://upload-images.jianshu.io/upload_images/1924341-8b5a86a4b08ea6d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

该方法其实就是创建一个动画对象，如果该对象有缓存的话，那么就从缓存中取出，没有的话，就 new 一个，这种缓存的思想很值得学习。  

![FocusAnimator.png](http://upload-images.jianshu.io/upload_images/1924341-87e267f9f8d837c6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

该类就是实现了缩放的动画效果了，通过实现 TimeAnimator.TimeListener 接口来实现的属性动画，当然缩放动画也可以用其他方式实现，无非就是对 View 进行放大、缩小而已，这里就不具体去分析了，感兴趣的可以自己来这里看看 Google 是如何实现缩放动画的，后期有时间的话我可以再来分析一下这个类。  

好了，到这里基本就分析完了，Leanback 库关于卡位的缩放动画的实现，从我们要从哪里着手开始阅读源码到找到焦点监听实现的相关代码到动画实现的代码整个过程基本就是这样。以后大家在想看源码的某个功能是如何实现时，可以参考这种思路来进行分析，一步步的去跟进，只找我们目标相关的代码，这样可以不至于被整个源码的复杂性混乱掉。  

最后，我想再总结一下上面的过程。  

# 总结 

- 卡位缩放动画的实现在类 FocusHighlightHelper 的内部类 FocusAnimator 里实现。  
- 缩放动画跟 ItemView 的绑定过程：  
    RowPresenter#onCreateViewHoler()   
    -> RowPresenter#initializeRowViewHolder()   
    -> ListRowPresenter#initializeRowViewHolder()   
    -> FocusHighlightHelper#setupBrowseItemFocusHighlight()  
    -> ItemBridgeAdapter#setFocusHighlight()  
- 简单点说就是，当每一行的 View 要创建时，会注册一个焦点监听器，该行里的 ItemView 焦点发生变化时会从 ItemViwe 的 Tag 里取出缩放动画对象，如果没有则 new 一个，然后应用缩放动画。  