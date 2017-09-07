接下去应该是梳理一下 Android Tv 主界面实现原理及解析的一个系列博客了，大体上的安排是先介绍 Google 官方提供的 Leanback 库的使用，如何使用该库来实现简单的 Home 界面，然后再去分析 Leanback 主界面实现的相关源码，了解完 Google 是如何实现之后就可以扔掉 Leanback 自己来尝试实现，毕竟 Leanback 的可定制不高。  

***  

# 效果图  
首先贴几张常见的 Home 界面效果：  

![爱奇艺主界面.png](http://upload-images.jianshu.io/upload_images/1924341-64f13e93d9d03f25.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![hejunlin2013TVSample.png](http://upload-images.jianshu.io/upload_images/1924341-fc109dd36197541e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  


![google sample.png](http://upload-images.jianshu.io/upload_images/1924341-f4a6081ada785119.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


第一张是爱奇艺 Tv 应用的 Home 界面，第二张是一个[开源 Demo 的 Home 界面](https://github.com/hejunlin2013/TVSample)，第三张是 [Google 官方 Tv Sample 的 Home 界面](https://github.com/googlesamples/leanback-showcase)。  

比较常见的 Home 界面风格应该是第一张和第二张的形式，这两种的 ui 实现也不一样，因此我就想搞懂这两种界面分别是如何实现的！！  

目前重点研究第一张的实现方式吧，毕竟 Google 的 Leanback 库实现出来的效果跟第一张有一些共同点，因此可以从 Leanback 入手来学习它是如何实现的。而至于第二张的实现原理，目前还没有思路，也暂时找不到相关资料来学习，Github 上面的 demo 都是忽悠人，控件全都是在 xml 中直接写死的，所以第二张图的 Home 界面实现原理以后再慢慢研究吧，或者有读者可以指点一二，非常感激。  

# 分析  
先大概的来分析一下第一张爱奇艺 Home 界面的实现：  


![Tab标签栏.png](http://upload-images.jianshu.io/upload_images/1924341-8ea60dcd367acc58.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



这个是 Tab 标签栏，选中不同的 Tab，内容区会显示不同的视频列表，这里的实现应该是 **TabLayout + Fragment** 的形式，或者 **TabLayout + ViewPager**,但 ViewPager 在 Tv 上使用好像会出很多坑。  

![可左右上下滑动的视频列表.png](http://upload-images.jianshu.io/upload_images/1924341-c252e89b372c0af2.png)

这个是内容区域即可左右滑动又可上下滑动的视频列表区域，主页最复杂的实现应该就是这个地方了。要我实现的话，思路就是 **RecyclerView 嵌套 RecyclerView** 来实现，先不谈 RecyclerView 这种滑动的控件在 Tv 上会出问题，嵌套这个坑就足够你填的了。  

在 Tv 上，可以用 **HorizontalGridView 和 VerticalGridView** 替代 **RecyclerView** 使用。但要实现左右单行滑动，上下整体滑动的效果，我只能想到上下用 VerticalGridView 来实现，每一行是它 itemView，而每一行的实现则用 HorizontalGridView 来实现。也就是 **1 个 VerticalGridView + 多个 HorizontalGridView** 来实现。  

但这样的嵌套仍会有许多问题出现，比如快速移动时的焦点丢失、性能问题、每一行的 View 如何缓存、复用等。

有大佬清楚解决方案，或者有其他实现思路的小伙伴们欢迎指点一下，实在没有，那就只能自己慢慢去啃 Leanback 的相关源码，然后再来梳理一下了。  

# 使用  
不出意外，接下去的空闲时间应该就是啃 Leanback Home 界面实现的相关源码，在此之前，先了解一下 Leanback 如何使用，哪些类是重点，后面分析时才方便入手。  

以下是我觉得应该理解的类：  

- **BrowerFragment**：用来展示可左右上下滑动的视频列表界面    
- **ArrayObjectAdapter**：作用类似于 List，可以用于装每一行的数据，也可以用于装一行里的每一个 item 数据    
- **ListRowPresenter**：Leanback 库中的 Presenter 作用都有些类似于 RecyclerView.Adapter  
- **ListRow**：可以理解成一个 Mode，也就是把每一行抽象封装成一个 ListRow  

用法跟 RecyclerView 很像，就是可能单独从命名上来理解会有些乱。只要你自己尝试去利用 Leanback 去实现个最简单的 Home 界面，大体就能理解了。比如，要实现下面这个 Home 界面：  

![简单的Home界面.png](http://upload-images.jianshu.io/upload_images/1924341-2c5cdd9751777165.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

首先，界面显示的数据都存在 ArrayObjectAdapter 里面，在 RecyclerView 时我们是存在 ArrayList 里：  

![相关代码.png](http://upload-images.jianshu.io/upload_images/1924341-90269fa003ceafb6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

初始化 ArrayObjectAdapter 对象时需传入一个 Presenter 进去，这里跟 RecyclerView 的使用有些不同，在 RecyclerView 里，我们是将 List 对象传给 Adapter，让 Adapter 去将数据和 itemView 绑定。这里虽然反过来将 Adapter(Presenter) 传入 List(ArrayObjectAdapter) 里，但其实作用也差不多，也是将两者关联起来。只是多了一个步骤，通过一个桥梁类 ItemBridgeAdapter 来将 ArrayObjectAdapter 里的数据传给 Presenter 。之后 Presenter 的工作就跟 RecyclerView.Adapter 一样了。   

前面说了 Presenter 作用类似于 Adapter，它是个抽象类，继承它的之类需要实现三个方法：` onCreateViewHolder()、onBindViewHolder()、onUnbindViewHolder() `，同 RecyclerView.Adapter 一样，在 ` onCreateViewHolder() ` 里面创建 itemView，然后在 ` onBindViewHolder() ` 里面将数据和 itemView 绑定，比如：  

![GridItemPresenter.png](http://upload-images.jianshu.io/upload_images/1924341-262c7a2b3426bcde.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最后调用 BrowerFragment 的 setAdapter() 将总的 ArrayObjectAdapter 对象设置进去，就可以了。使用很简单，如果你第一次接触，然后直接来看这篇，也许看不懂，建议你去看看[这篇博客](http://corochann.com/android-tv-application-hands-on-tutorial-2-85.html)，或者自己去看一下 [Google 官方的 Tv demo](https://github.com/googlesamples/leanback-showcase)，然后再回来看，相信你理解就会跟深刻了。  


# 思考  
1. 学会初步使用 Leanback 实现一个简单的 Home 界面后，你会发现，我们只需要提供每一行的数据，以及每行自己 itemView 的布局和数据绑定方式即可。但这完全没有涉及到 HorizontalGridView 和 VerticalGridView ，那么它内部的实现原理又是什么呢？  

1. 如果你运行了 Google 官方 Tv sample 或者自己利用 Leanback 实现了简单的 Home 界面的话，你会发现，我们焦点在某个 item 上时，这个 item 会放大，焦点离开又恢复正常，这个 Leacback 又是怎么实现的呢？  

1. 如果你运行了爱奇艺的 Tv 应用，你会发现，它焦点在移动到边界时 item 会有抖动的效果，这又要如何实现呢？  

本系列梳理博客大概就是要理清上面的问题，后两个比较简单，看了 Leanback 的源码，已基本明白。所以难啃的点还是在于 Home 界面的 ui 实现原理，目前只能大体上明白每一行是一个 HorizontalGridView，上下滑动是由什么实现还没啃透。下一篇等啃得差不多了，再来梳理一下。     
