# 目录  

由于本篇篇幅特长，特意做了个目录，让大伙对本篇内容先有个大概的了解。

另外，由于有些平台可能不支持 `[TOC]` 解析，所以建议大伙可借助本篇目录，或平台的目录索引进行快速查阅。  

> 1. **LayoutManager**
>
>    1.1 **LinearLayoutManager**
>
>     - 基本效果介绍
>     - findFirstCompletelyVisibleItemPosition()
>     - findFirstVisibleItemPosition()
>     - findLastCompletelyVisibleItemPosition()
>     - findLastVisibleItemPosition()
>     - setRecycleChildrenOnDetach()
>
>    1.2 **GridLayoutManager**
>     - 基本效果介绍
>     - setSpanSizeLookUp()
>
>    1.3 **StaggeredGridLayoutManager**
>    - 基本效果介绍
>    - setFullSpan()
>    - findXXX() 系列方法介绍
>
> 2. **ViewHolder**
>    - getAdapterPosition()
>    - getLayoutPosition()
>    - setIsRecyclable()
>
> 3. **LayoutParams**
>
> 4. **Adapter**
>
>    - 基本用法介绍
>    - onViewRecycled()
>    - onViewAttachedFromWindow()
>    - onViewDetachedFromWindow()
>    - onAttachedToRecyclerView()
>    - onDetachedFromRecyclerView()
>    - registerAdapterDataObserver()
>    - unregisterAdapterDataObserver()
>
> 5. **RecyclerView**
>
>    - addOnItemTouchListener()
>    - addOnScrollListener()
>    - setHasFixedSize()
>    - setLayoutFrozen()
>    - setPreserveFocusAfterLayout()
>    - findChildViewUnder()
>    - findContainingItemView()
>    - findContainingViewHolder()
>    - findViewHolderXXX()
>
> 6. **Recycler**
>
>    - setItemViewCacheSize()
>    - setViewCacheExtension()
>    - setRecycledViewPool()
>    - setRecyclerListener()
>
> 7. **ItemAnimator**
>
>    7.1 **SimpleItemAnimator**
>
>    7.2 **DefaultItemAnimator**
>
> 8. **ItemDecoration**
>
>    8.1 **DividerItemDecoration**
>
>    8.2 **ItemTouchHelper**
>
>    8.3 **FastScroller**
>
>    8.4 **自定义 ItemDecoration**
>
>    - getItemOffsets() 
>    - onDraw()
>
> 9. **OnFlingListener**
>
>    9.1 **SnapHelper**
>
>    9.2 **LinearSnapHelper**
>
>    9.3 **PagerSnapHelper**


# 正文

阅读须知：

- 本篇力求列举 RecyclerView 所有功能的使用示例，由于篇幅原因，并不会将实现代码全部贴出，只贴出关键部分的代码。
- 本篇所使用的 RecyclerView 的版本是 26.0.0。
- 下列标题中，但凡是斜体字，表示该知识点目前暂时没理清楚，留待后续继续补充。
- 第 1 章至第 5 章节内容在上一篇中：[关于RecyclerView你知道的不知道的都在这了（上）](https://www.jianshu.com/p/aff499a5953c)

### 6. Recycler

Recycler 是 RecyclerView 的一个内部类，主要职责就是处理回收复用相关工作的。

回收复用的单位是 ViewHolder，至于 Item 移出屏幕是怎样回收，回收到哪里，Item 移进屏幕时是怎样复用，整个流程是先复用再回收，还是先回收再复用，还是两边同时进行等等一系列的工作都是交由 Recycler 来处理。

关于回收复用机制的部分原理，之前已经梳理过一篇文章了：[基于滑动场景解析RecyclerView的回收复用机制原理](https://www.jianshu.com/p/9306b365da57)，感兴趣的可以先去看看。

本篇侧重点是介绍各个接口的含义和使用场景，至于回收复用机制，后续肯定还会继续深入去分析，敬请期待。

#### 6.1 setItemViewCacheSize()

有看到上面链接那篇文章的应该就清楚，当 item 被移出屏幕外时，其实这个 item 的 ViewHolder 会被回收掉，而 Recycler 里有一种分级缓存的概念。

分级缓存，说得白点，就是不同的容器，容器之间有优先级，回收时先将 ViewHolder 缓存到高优先级的容器中，容器满了的话，那就将容器腾出个位置来，被腾出来的 ViewHolder 这时就可以放到优先级较低的容器中。分级缓存的概念就是这样。

移出屏幕的 ViewHolder 会被缓存到两个容器中，按优先级高到低分别是：**mCachedViews**  和 **mRecyclerPool** 

该方法就是用于设置 **mCachedViews** 容器的大小，默认值为 2，可通过该方法随时改变缓存容器的大小。

**应用场景**：

要搞清楚应用场景，那得先明白 **mCachedViews** 这一级的缓存有什么作用，建议还是到上面给出的链接的那篇文章看一看，就明白了。

这里大概说一下，个人对于 **mCachedViews** 这一级缓存的理解：这一级的缓存仅仅就只是用来缓存而已，里面存储的 ViewHolder 并没有通用的能力。换句话说也就是，只有原来位置的 Item 可复用这级容器里的 ViewHolder，其他位置的 Item 没办法使用。效果就好像是 ViewPager 之类的缓存一样，所以我才说它仅仅只有缓存的功能。

这样能达到的效果就是：当某个 Item 刚被移出屏幕外，下一步又立马移进屏幕时，此时并不会去触发到 Adapter 的 onBindXXX 的调用，也就是说，这一级缓存里的 ViewHolder 可直接 addView 到 RecyclerView 上面，不需要重新去设置数据，因为它原本携带的数据都还处于正常状态，并没有被重置掉。 

#### 6.2 setViewCacheExtension()

当 Item 要被移进屏幕时，Recycler 会先去那些不需要重新调用 onBindViewHolder() 的缓存容器中寻找是否有可直接复用的 Item，如果没找到，那么会接着调用开发者自定义扩展的复用工作，如果在这里也没找到，那么才会去 RecyclerViewPool 中根据 type 来寻找可复用的，再没找到最后就直接调用 onCreateViewHolder() 新建一个来使用。

先来看看开发者要怎么自定义扩展：  

```  java
/**
 * 我删了一些注释，留下一些困惑的点
 * 1. Note that, Recycler never sends Views to this method to be cached. It is developers
 * responsibility to decide whether they want to keep their Views in this custom cache
 * or let the default recycling policy handle it.
 */
public abstract static class ViewCacheExtension {
	/**
	 * 2.This method should not create a new View. Instead, it is expected to return
	 * an already created View that can be re-used for the given type and position.
	 */
	public abstract View getViewForPositionAndType(Recycler recycler, int position, int type);
}
```

看着好像很简单是吧，就只需要实现一个方法，返回指定 position 和 type 下的 Item 的 View 即可，网上所有分析到回收复用机制时也全部都是这么一笔带过。

**但实际上，存在很多困惑点，这个到底该怎么用？**  

注释 1 里说了，Recycler 永远也不会将 ItemView 发送到这个类里来缓存，然后还说由开发者自行决定是要自己维护这些缓存还说交由 Recycler 来处理。

**困惑1：**交由 Recycler 来处理我能理解，毕竟 Recycler 只在复用的过程中开了个接口给开发者扩展使用，但回收的过程并没有开任何接口给开发者扩展。也正是基于这点，我就不理解官方说的让开发者自行维护，怎么维护？

注释 2 中，官方告诉我们在这个方法中，不要去新建一个新的 ItemView，而是直接从旧的里面拿一个复用。

**困惑2：**我又不知道怎么自己去维护 ViewHolder，那不新建一个 ItemView 又该如何使用，直接借助 Recycler？但 Recycler 不是只开放了 getViewForPosition()？本来内部在复用时就是自己调了这个方法，我们在这个方法内部走到开发者扩展自定义扩展的流程时再重新调一下？那不是就陷入嵌套循环里了？有什么意义或者应用场景么？

最最困惑的一点，国内居然找不到任何一篇讲解如何使用这个自定义缓存的相关文章！？

不清楚是由于他们文章的标题太过抽象没加入我的关键词过滤中，还是我关键词提取太烂，总之就是找不到任何一篇相关文章。所以，这小节先埋个坑，我打算后续抽时间自己来研究一下，到底应该如何使用自定义 RecyclerView 的缓存策略，到底都有哪些应用场景。

#### 6.3 setRecycledViewPool()

最后一级缓存就是 RecyclerViewPool，这个容器有三个特性：

- 缓存到 RecyclerViewPool 中的 ViewHolder，携带的信息都会被重置，因此从这个容器中取 ViewHolder 去复用时，都会触发 `onBindViewHolder()` 重新绑定数据。
- 多个 RecyclerView 可共用同一个 RecyclerViewPool 容器。
- 该容器以 Item 的 type 区分缓存，每种 type 的默认存储容量为 5。

一般当我们需要修改这个缓存容器的大小，或者需要设置多个 RecyclerView 共用一个 RecyclerViewPool 时才需要调用到该方法。并且，官方在注释中也给出一种应用场景：使用 ViewPager 时各页面中的 RecyclerView 有相同的 Item 布局结构。

**应用场景：**

我们来举个例子，就不用官方给的例子了，我额外补充一种场景：界面上存在多行可分别左右滑动的列表控件，即每行是一个 RecyclerView，每行里的 Item 布局样式一致，这时候就可以让每一行的 RecyclerView 共用一个 RecyclerViewPool 缓存池了，如下：  

![多行可局部滑动.png](https://upload-images.jianshu.io/upload_images/1924341-9e528ee638e837a5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

以上布局的实现是外层一个竖直方向的 RecyclerView，它的每一个 Item 都是占据一行的水平方向的 RecyclerView，也就是嵌套 RecyclerView 的方式，实现可上下滑动且每一行均可左右滑动的效果。

这里的每一行的 RecyclerView 里的每个 Item 项的样式均一致，那么这种场景下，可以让每一行的 RecyclerView 都共用同一个 RecyclerViewPool 缓存池。这样的好处是，当某一行被移出屏幕时，可以将这一行的每个卡位都回收起来，供其他行使用，而不至于每一行每次都是重新创建。

但有些**注意事项**：

- 外层 RecyclerView 缓存复用的应该仅仅是每一行的 RecyclerView 控件而已，不应该包括每一行 RecyclerView 内部的卡位控件，因为各行卡位的个数并不一定相同。
- 对于外层 RecyclerView 来说，它的 Item 是每一行的 RecyclerView 控件，所以当某一行被移出屏幕时，它仅仅是将这一行的 RecyclerView 控件从它本身 remove 掉，并回收起来。因此，此时这一行的 RecyclerView 还是携带着它的卡位子 View 的，所以需要我们手动去将这些卡位回收、并从父控件上 remove 掉。
- 这个操作可以在外层 RecyclerView 的 adapter 的 `onViewRecycled()` 回调中进行，也可以在内层每个 RecyclerView 的 adapter 的 `onViewDetachedFromWindow()` 回调中进行。
- 移除并回收卡位可通过 `setAdapter(null)` 配合 RecyclerView 本身的 `removeAllView()` 或者 LayoutManager 的 `removeAllView()` 实现 。或者直接使用 LinearLayoutManager 的 `setRecycleChildrenOnDetach()` 功能。

#### 6.4 setRecyclerListener()  

```  java
//RecyclerView$Recycler#
void dispatchViewRecycled(ViewHolder holder) {
	if (mRecyclerListener != null) {
		mRecyclerListener.onViewRecycled(holder);
	}
	if (mAdapter != null) {
		mAdapter.onViewRecycled(holder);
	}
    ...
}
```

所以，这个方法设置的监听 Item 的回收，回调的时机跟 adapter 的 onViewRecycled() 一模一样，都是在 mCachedViews 容器满了之后，放入 RecyclerViewPool 之前被回调。

### 7. ItemAnimator

RecyclerView 是支持对每个 item 做各种各样动画的，那么什么时候才该去执行这些 item 动画呢？说白了，也就是 adapter 数据源发生变化的时候，那么变化的方式无外乎就是四种：add, remove, change, move。相对应的，也就是这些状态时的 item 动画。

所以当要自定义实现 ItemAnimator 时，需要实现的方法如下：  

```  java
public abstract boolean animateAppearance(@NonNull ViewHolder viewHolder, @Nullable ItemHolderInfo preLayoutInfo, @NonNull ItemHolderInfo postLayoutInfo);  
public abstract boolean animateDisappearance(@NonNull ViewHolder viewHolder, @Nullable ItemHolderInfo preLayoutInfo, @NonNull ItemHolderInfo postLayoutInfo);
public abstract boolean animatePersistence(@NonNull ViewHolder viewHolder, @NonNull ItemHolderInfo preLayoutInfo, @NonNull ItemHolderInfo postLayoutInfo);
public abstract boolean animateChange(@NonNull ViewHolder oldHolder, @NonNull ViewHolder newHolder, @NonNull ItemHolderInfo preLayoutInfo, @NonNull ItemHolderInfo postLayoutInfo);
public abstract void runPendingAnimations();
public abstract void endAnimation(ViewHolder item);
public abstract void endAnimations();
public abstract boolean isRunning();
```

看起来，要实现一个自定义的 Item 好像很复杂，要实现这么多方法。网上这方面的文章已经非常多了，也都跟你说清了每个方法的含义是什么，在这里写些什么，甚至流程都帮你列出来了。

但大伙会不会好奇，这帮牛人是咋这么清楚的呢？

其实，Google 内部已经封装好了一个默认动画的实现，有时间大伙可以自己过一下源码，看看默认动画是怎么做的，理解清楚了后，举一反三下，其实也就懂了。

我目前也不懂，但我就是带着这么一种想法，也是打算这么去做的。虽然跟着大神的文章，最后确实能实现想要的效果，但其实掌握并不是很牢，并不大清楚为什么需要这么写，只是因为大神说这里这么写，然后就这么写了。

所以，有时间有精力，还是建议深入源码中去学习，自己梳理出来的知识终归是自己的。

#### 7.1 SimpleItemAnimator

当 adapter 数据源发生变化，通知了 RecyclerView 去刷新界面时，RecyclerView 会去通知 ItemAnimaotr 此时相应的动画行为。

比如 add 了一个 Item，那么就会去触发 ItemAnimator 的 `animateAppearance()` 方法，并将这个 ItemView 在刷新前后不同的信息，如默认携带的信息是 RecyclerView 内部类 ItemHolderInfo，这个类里有关于这个 Item 的坐标信息。

那么，开发者就可以在这些回调方法里自行判断刷新前后的 Item 的不同信息来决定是否需要进行相对应的动画。

**而 SimpleItemAnimator 其实就是帮忙处理这件事，也就是说，它在四个回调中，如 `animateAppearance()` 中，根据 Item 前后的坐标信息来判断该 Item 需要进行的动画类型**。

比如 `animateAppearance()`：

```  java
@Override
public boolean animateAppearance(@NonNull ViewHolder viewHolder, @Nullable ItemHolderInfo preLayoutInfo, @NonNull ItemHolderInfo postLayoutInfo) {
	if (preLayoutInfo != null && (preLayoutInfo.left != postLayoutInfo.left
		|| preLayoutInfo.top != postLayoutInfo.top)) {
         // slide items in if before/after locations differ
         return animateMove(viewHolder, preLayoutInfo.left, preLayoutInfo.top,
                postLayoutInfo.left, postLayoutInfo.top);
    } else {
		 return animateAdd(viewHolder);
    }
}
```

对于 RecyclerView 回调了 `animateAppearance()` 方法后，SimpleItemAnimator 内部对其进行的分类，根据参数判断，最终是要执行 `animateMove()` 类型的动画，还是执行 `animateAdd()` 类型的动画。

同理，对于另外三个回调方法，SimpleItemAnimator 内部同样对其进行了封装处理，简单的通过刷新前后 Item 的坐标信息来进行动画类型的区分。

所以，这个类并没有实现任何动画的逻辑，它只是将动画的准备工作做好，简化开发者开发。所以，如果想要自定义 ItemAnimator，其实没必要从零开始继承自 ItemAnimator 自己写，是可以借助 SimpleItemAnimator 这个类的。

#### 7.2 DefaultItemAnimator

RecyclerView 默认有提供 Item 的动画，而 SimpleItemAnimator 只是处理跟动画无关的准备工作，那么具体的默认动画的实现就是在 DefaultItemAnimator 这个类中实现的了。

先看一下这个类的结构：  

![DefaultItemAnimagtor结构.png](https://upload-images.jianshu.io/upload_images/1924341-06de56724562ea79.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

它是继承自 SimpleItemAnimator 的，我们如果想要自定义实现一些 Item 动画，需要写的东西，大概就跟上图类似。

想要自定义 Item 动画，真的可以来参考、借鉴这个类的实现，能学到的东西很多。

我也还没深入去仔细学习，大概过了一眼，这里就大概说下：

这个类用了很多集合来维护各种不同类型的动画，在四个 `animateXXX()` 方法中通过集合记录相对应类型的动画和做了动画的初始化工作。

然后在 `runPendingAnimations()` 方法中，依次遍历这些集合，将记录的动画取出来执行，动画的实现方式是通过 `View.animate()` 方式实现，这种方式的动画本质上是借助了 ValueAnimator 机制，在每帧的回调过程中手动调用 `setXXX()` 来实现的动画效果。具体分析可参考我之前写的一篇文章：[View.animate()动画ViewPropertyAnimator原理解析](https://www.jianshu.com/p/b43cf452afc1)。  

大体上的流程原理就是这样，当然，这个类做的事肯定不止这些，还包括了集合的清理维护工作，动画的维护等等，所以很值得去借鉴学习一番。但这里就只给出大概的流程，本篇重点不在这里。

下面就来列举下，默认实现的各类型的动画分别是什么：  

**animateAdd** -> 透明度 0 ~ 1 的动画，默认动画时长 120 ms

**animateChange** -> 涉及两个 ItemView，旧的跟新的，默认动画时长 250ms

旧 ItemView：透明度从原有值 ~ 0，位置从原坐标移动到新 ItemView 坐标的动画组合

新 ItemView：透明度从 0 ~ 1，位置从旧 ItemView 坐标移动到新坐标的动画组合

**animateMove** -> 从原坐标位置移动到新坐标位置的移动动画，默认动画时长 250 ms

**animateRemove** -> 从原有透明度 ~ 0 的动画，默认动画时长 120 ms

所以，RecyclerView 默认的 Item 动画其实也就透明度和移动动画两种，而且大多数情况下都只是单一的动画，只有 change 类型时才会是组合动画。

**效果展示：**

首先，可通过下列方式修改动画时长，这里将动画时长延长，方便查看效果

```  
mRecyclerView.getItemAnimator().setAddDuration(1000);
```

![20180702_162126.gif](https://upload-images.jianshu.io/upload_images/1924341-baf6b6217218ae9f.gif?imageMogr2/auto-orient/strip)  

可以看到，动画基本就只有透明度动画跟移动动画两种。

另外，只有通过 `notifyItemXXX()` 方式更新数据源时才会触发动画行为，如果是通过 `notifyDataSetChange()` 方式，则不会触发动画。

### 8. ItemDecoration

RecyclerView 支持为每个 Item 之间自定义间隔样式，是要空段距离，还是要以分割线隔开，还是要唯美唯幻的边框，想长啥样都行，自己写得出来就可以了，它给我们提供了这个接口。

本节就先介绍下系统内置的几种样式，内置里一共有三个类继承该类，分别是 DividerItemDecoration，ItemTouchHelper，FastScroller。前两个都是 public 权限，最后一个包权限，下面分别看看它们都有哪些效果，最后再来看看如何自定义。

#### 8.1 DividerItemDecoration

看一下这个类的注释：  

```  java
/**
 * DividerItemDecoration is a {@link RecyclerView.ItemDecoration} that can be used as a divider
 * between items of a {@link LinearLayoutManager}. It supports both {@link #HORIZONTAL} and
 * {@link #VERTICAL} orientations.
 * <pre>
 *     mDividerItemDecoration = new DividerItemDecoration(recyclerView.getContext(),
 *             mLayoutManager.getOrientation());
 *     recyclerView.addItemDecoration(mDividerItemDecoration);
 * </pre>
 */
public class DividerItemDecoration extends RecyclerView.ItemDecoration {
    /**
     * Sets the {@link Drawable} for this divider.
     *
     * @param drawable Drawable that should be used as a divider.
     */
    public void setDrawable(@NonNull Drawable drawable) {
        if (drawable == null) {
            throw new IllegalArgumentException("Drawable cannot be null.");
        }
        mDivider = drawable;
    }
    ...
}
```

怎么用，类注释也给我们示例了，有点可惜的是，它只能用于 LinearLayoutManager 这种布局，而 GridLayoutManager 继承自 LinearLayoutManager，所以它也可以用，但需要注意的是，它只有一个方向会生效。来看看如何使用和效果：  

```  java
DividerItemDecoration itemDecoration = new DividerItemDecoration(mContext, LinearLayoutManager.HORIZONTAL);
itemDecoration.setDrawable(getResources().getDrawable(R.drawable.divider_space));
mRecyclerView.addItemDecoration(itemDecoration);

//R.drawable.divider_space
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <size android:width="20dp" android:height="20dp"/>
</shape>
```

我们在 xml 中写宽度为 20dp 的空隙，然后调用 `setDrawable()` 应用，看看效果：  

![空隙示例.png](https://upload-images.jianshu.io/upload_images/1924341-02ae65a7f2cce81d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这样就可以达到将 item 隔离开的效果了，中间这个空隙的样式你可以自己通过 xml 写，也可以直接使用图片，都可以，只要是 Drawable 类型的即可。

虽然说，RecyclerView 不像 ListView 只要设置个属性就可以达到设置 Item 之间空隙的样式，但它也内置了基本的实现，其实也已经方便了我们的使用。

#### 8.2 *ItemTouchHelper*

这是一个工具类，也是 Google 为了方便开发人员实现 item 的拖拽和移动等等效果所提供的一个辅助工具类。借助这个类可以很容易实现 item 的侧滑删除、长按拖拽等功能。

由于这部分我没有研究过，日常也较少接触，所以暂时先从网上搜索一篇文章，以下的效果图来自大神的博客，会给出链接，侵权删。后续有接触相关需求时再自行来研究一番。  

[推荐博客： ItemTouchHelper源码分析 ](https://blog.csdn.net/wuyuxing24/article/details/78985026)  

![20180105202851329.gif](https://upload-images.jianshu.io/upload_images/1924341-470540d87bab3787.gif?imageMogr2/auto-orient/strip)  

![20180105202823469.gif](https://upload-images.jianshu.io/upload_images/1924341-36ecbcb6385c86cc.gif?imageMogr2/auto-orient/strip)  

#### 8.3 *FastScroller*

这个类也是继承自 ItemDecoration，但它的类权限只是包权限，不开放给外部使用，稍微看了下注释，说是用来处理动画以及快速滑动相关的支持，具体原理是什么，如何生效，留待后续深入研究时再来分析。

#### 8.4 自定义ItemDecoration 

上面说过系统默认提供的 DividerItemDecoration 只支持用于 LinearLayoutManager，而如果用于 GridLayoutManager 时，只有一个方向会生效，那么下面我们就以 GridLayoutManager 为例，来看看，如何自定义写 ItemDecoration。

用 GridLayoutManager 实现一个四列的布局，然后让除了四个边的 Item 外，内部的每个 Item 之间相互间隔 20 dp 的空隙。为了能更明显看出，将 20dp 的空隙用红色绘制出来。

先来看下效果：

- 4 列布局 & 2 行布局

![20180619_200035.gif](https://upload-images.jianshu.io/upload_images/1924341-4c6b0f5f95f53602.gif?imageMogr2/auto-orient/strip)    

代码：  

```  java
public class MyItemDecoration extends RecyclerView.ItemDecoration {
    private int spanCount;//几行或几列
    private int orientation;//方向
    private int itemSpace;//空隙大小
    
    private Rect mBounds = new Rect();
    private Paint mPaint;//用来将空隙绘制成红色的画笔

    public MyItemDecoration(GridLayoutManager gridLayoutManager) {
        spanCount = gridLayoutManager.getSpanCount();
        orientation = gridLayoutManager.getOrientation();
        initPaint();
    }

    private void initPaint() {
        mPaint = new Paint();
        mPaint.setAntiAlias(true);
        mPaint.setColor(Color.RED);
    }

    public void setItemSpace(int space) {
        itemSpace = space;
    }

    @Override
    public void onDraw(Canvas c, RecyclerView parent, RecyclerView.State state) {
        c.save();
        final int childCount = parent.getChildCount();
        for (int i = 0; i < childCount; i++) {
            final View child = parent.getChildAt(i);
            parent.getLayoutManager().getDecoratedBoundsWithMargins(child, mBounds);
            c.drawRect(mBounds, mPaint);
        }
        c.restore();
    }

    @Override
    public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
        //获取当前view的layoutPosition
        int itemPosition = parent.getChildLayoutPosition(view);
        //计算该View位于哪一行哪一列
        int positionOfGroup = itemPosition % spanCount;
        int itemGroup = itemPosition / spanCount;
		
        //根据不同方向进行不同处理，最终效果都要实现除四周的View 外，内部的View之间横竖都以相同空隙间隔开
        //实现方式，以水平方向为例：
        //每个view的left和bottom都设置相同间隙
        //去掉第1列的left，和最后一行的bottom，也就实现了除四周外内部view都以相同间隙空隔开
        if (orientation == LinearLayoutManager.HORIZONTAL) {
            outRect.set(itemSpace, 0, 0, itemSpace);
            if (itemGroup == 0) {
                outRect.left = 0;
            }
            if (positionOfGroup == (spanCount - 1)) {
                outRect.bottom = 0;
            }
        } else if (orientation == LinearLayoutManager.VERTICAL) {
            outRect.set(0, itemSpace, itemSpace, 0);
            if (itemGroup == 0) {
                outRect.top = 0;
            }
            if (positionOfGroup == (spanCount - 1)) {
                outRect.right = 0;
            }
        }
    }
}
```

**注意事项**：由于 GridLayoutManager 会根据设置的 Orientation 方向，默认为 VERTICAL 数值方向，以及 RecyclerView 的宽高模式来决定是否自动将某一方向的空隙平均分配给各 Item，这点需要注意一下。

以上的例子想说明，如果要自定义写 Iiem 间的空隙，那么关键点在于重写两个方法：  

- `getItemOffsets() ` 
- `onDraw()`

第 1 个方法会携带很多参数，最重要的是 outRect 这个参数，它是一个 Rect 类型的对象，重写这个方法并设置了这个 outRect 的 left, top, right, bottom，就相当于设置了对应这个 view 的四周分别有多大的空隙。

其他的参数是用来给我们辅助使用，如果不需要区分对待，每个 item 的四周都是同样的间隔空隙，那直接设置 outRect 即可。

如果需要像上述例子那样，要求四周的 Item 的间隙要区别于内部 item 的间隙，那么就需要判断出这个 View 的位置，因此可以通过其他参数辅助配合实现。

`onDraw()` 这个方法就是用于绘制，注意这个方法参数只给了 RecyclerView，而绘制 item 的 Decoration 是针对于每个 item 而言的，所以内部需要通过遍历子 View 来对每个 item 进行绘制操作。

当然，我这里写得很粗糙，考虑到性能优化方面，绘制过度方面等等因素，通常是需要使用到 canvas.clipRect()。这部分代码建议可以参考 DividerItemDecoration 内部的实现。

### 9. *OnFlingListener*

RecyclerView 是可滑动控件，在平常使用过程中，我们可能就是上滑，下滑，左边滑滑，右边滑滑，能够刷新更多列表即可，通常都没太过去注意到滑动的细节。

但其实，滑动策略也是支持多样化的。

比如，如果想要实现不管以多大的加速度滑动，滑多长距离，最终停下来时都系统有个 ItemView 是居中显示的效果。

再比如，只希望翻页滑动，当手指滑动距离小于翻页时，自动滑回原位进行翻页等等。

这些滑动策略其实就可以直接借助内置的两个类来实现：LinearSnapHelper 和 PagerSnapHelper

**ps：本来以为这种滑动策略也是支持由焦点触发的滑动行为的，最后测试时才发现，原来只支持手指触摸式的滑动行为。由于我是搞 Tv 应用开发的，Tv 应用没有触摸事件，只有遥控器事件，滑动是由于焦点的变化触发的滑动行为。而在 Tv 上，Item 居中的需求也非常常见，但利用这个是无法实现的。所以，我就先不打算深入了解这块了，后续有时间再来慢慢研究。附上鸿神公众号中的一篇文章，大伙看这篇就行了。**  

[Android中使用RecyclerView + SnapHelper实现类似ViewPager效果](https://www.jianshu.com/p/ef3a3b8d0a77)  

![](https://upload-images.jianshu.io/upload_images/3513995-aafe6c4113148c23.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)  

#### 9.1 *SnapHelper*

#### 9.2 *LinearSnapHelper* 

#### 9.3 *PagerSnapHelper*