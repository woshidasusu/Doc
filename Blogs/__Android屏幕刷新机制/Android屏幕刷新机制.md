这次就来梳理一下 Android 的屏幕刷新机制，把我这段时间因为研究动画而梳理出来的一些关于屏幕刷新方面的知识点分享出来，能力有限，有错的地方还望指点一下。另外，内容有点多，毕竟要讲清楚不容易，所以慢慢看哈。    

# 提问环节  
阅读源码还是得带着问题或目的性的去阅读，这样阅读过程中比较有条理性，不会跟偏或太深入，所以，还是先来几个问题吧：  

大伙都清楚，Android 每隔 16.6ms 会刷新一次屏幕。  

**Q1：但是大伙想过没有，这个 16.6ms 刷新一次屏幕到底是什么意思呢？是指每隔 16.6ms 调用 onDraw() 绘制一次么？**  

**Q2：如果界面一直保持没变的话，那么还会每隔 16.6ms 刷新一次屏幕么？**  

**Q3：界面的显示其实就是一个 Activity 的 View 树里所有的 View 都进行测量、布局、绘制操作之后的结果呈现，那么如果这部分工作都完成后，屏幕会马上就刷新么？**  

**Q4：网上都说避免丢帧的方法之一是保证每次绘制界面的操作要在 16.6ms 内完成，但如果这个 16.6ms 是一个固定的频率的话，请求绘制的操作在代码里被调用的时机是不确定的啊，那么如果某次用户点击屏幕导致的界面刷新操作是在某一个 16.6ms 帧快结束的时候，那么即使这次绘制操作小于 16.6 ms，按道理不也会造成丢帧么？这又该如何理解？**  

**Q5：大伙都清楚，主线程耗时的操作会导致丢帧，但是耗时的操作为什么会导致丢帧？它是如何导致丢帧发生的？**  

本篇主要就是搞清楚这几个问题，分析的源码基本只涉及 **ViewRootImpl** 和 **Choreographer** 这两个类。  

# 源码分析  
ps:本篇分析的源码均是 android-25 版本，版本不一样，源码可能会有些许差异，大伙过的时候注意一下。  

## 基本概念
首先，先来过一下一些基本概念，摘抄自网上文章[android屏幕刷新显示机制](http://blog.csdn.net/litefish/article/details/53939882)：  

> 在一个典型的显示系统中，一般包括CPU、GPU、display三个部分， CPU负责计算数据，把计算好数据交给GPU,GPU会对图形数据进行渲染，渲染好后放到buffer里存起来，然后display（有的文章也叫屏幕或者显示器）负责把buffer里的数据呈现到屏幕上。  
> 
> 显示过程，简单的说就是CPU/GPU准备好数据，存入buffer，display每隔一段时间去buffer里取数据，然后显示出来。display读取的频率是固定的，比如每个16ms读一次，但是CPU/GPU写数据是完全无规律的。  

上述内容概括一下，大体意思就是说，屏幕的刷新包括三个步骤：**CPU 计算屏幕数据、GPU 进一步处理和缓存、最后 display 再将缓存中（buffer）的屏幕数据显示出来。**  

（ps:开发过程中应该接触不到 GPU、display 这些层面的东西，所以我把这部分工作都称作底层的工作了，下文出现的底层指的就是除了 CPU 计算屏幕数据之外的工作。）

对于 Android 而言，第一个步骤：**CPU 计算屏幕数据**指的也就是 View 树的绘制过程，也就是 Activity 对应的视图树从根布局 DecorView 开始层层遍历每个 View，分别执行测量、布局、绘制三个操作的过程。  

也就是说，我们常说的 Android 每隔 16.6ms 刷新一次屏幕其实是指：**底层以固定的频率，比如每 16.6ms 将 buffer 里的屏幕数据显示出来。**  

如果还不清楚，那再看一张网上很常见的图（摘自上面同一篇文章）：  
![image.png](http://upload-images.jianshu.io/upload_images/1924341-d8ebbbd67051dd6b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

结合这张图，再来讲讲 16.6 ms 屏幕刷新一次的意思。  

Display 这一行可以理解成屏幕，所以可以看到，底层是以固定的频率发出 VSync 信号的，而这个固定频率就是我们常说的每 16.6ms 发送一个 VSync 信号，至于什么叫 VSync 信号，我们可以不用深入去了解，只要清楚这个信号就是屏幕刷新的信号就可以了。  

继续看图，Display 黄色的这一行里有一些数字：`0, 1, 2, 3, 4`，可以看到每次屏幕刷新信号到了的时候，数字就会变化，所以这些数字其实可以理解成每一帧屏幕显示的画面。也就是说，屏幕每一帧的画面可以持续 16.6ms，当过了 16.6ms，底层就会发出一个屏幕刷新信号，而屏幕就会去显示下一帧的画面。  

以上都是一些基本概念，也都是底层的工作，我们了解一下就可以了。接下去就还是看这图，然后讲讲我们 app 层该干的事了：  

继续看图，CPU 蓝色的这行，上面也说过了，CPU 这块的耗时其实就是我们 app 绘制当前 View 树的时间，而这段时间就跟我们自己写的代码有关系了，如果你的布局很复杂，层次嵌套很多，每一帧内需要刷新的 View 又很多时，那么每一帧的绘制耗时自然就会多一点。  

继续看图，CPU 蓝色这行里也有一些数字，其实这些数字跟 Display 黄色的那一行里的数字是对应的，在 Display 里我们解释过这些数字表示的是每一帧的画面，那么在 CPU 这一行里，其实就是在计算对应帧的画面数据，也叫屏幕数据。也就是说，在当前帧内，CPU 是在计算下一帧的屏幕画面数据，当屏幕刷新信号到的时候，屏幕就去将 CPU 在上一帧内计算的屏幕画面数据显示出来；同时 CPU 也接收到屏幕刷新信号，所以也开始去计算下一帧的屏幕画面数据。  

CPU 跟 Display 是不同的硬件，它们是可以并行工作的。要理解的一点是，我们写的代码，只是控制让 CPU 在接收到屏幕刷新信号的时候开始去计算下一帧的画面工作。而底层在每一次屏幕刷新信号来的时候都会去显示下一帧的画面，这点我们是控制不了的，是底层的工作机制。之所以要讲这点，是因为，当我们的 app 界面没有必要再刷新时（比如用户不操作了，当前界面也没动画），这个时候，我们 app 是接收不到屏幕刷新信号的，所以也就不会让 CPU 去计算下一帧画面数据，但是底层仍然会以固定的频率来切换每一帧的画面，只是它后面切换的每一帧画面都一样，所以给我们的感觉就是屏幕没刷新。  

所以，我觉得上面那张图还可以再继续延深几帧的长度，这样就更容易理解了：  
![屏幕刷新机制.png](http://upload-images.jianshu.io/upload_images/1924341-f3938ff87259b9ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我在那张图的基础上延长了几帧，我想这样应该可以更容易理解点。  

看我画的这张图，前三帧跟原图一样，从第三帧之后，因为我们的 app 界面不需要刷新了（用户不操作了，界面也没有动画），那么这之后我们 app 就不会再接收到屏幕刷新信号了，所以也就不会再让 CPU 去绘制视图树来计算下一帧画面了。**但是**，底层还是会每隔 16.6ms 发出一个屏幕刷新信号，只是我们 app 不会接收到而已，Display 还是会在每一个屏幕刷新信号到的时候去显示下一帧画面，只是下一帧画面一直是第4帧的内容而已。  

好了，到这里 Q1，Q2，Q3 都可以先回答一半了，**那么我们就先稍微来梳理一下**：  

1. **我们常说的 Android 每隔 16.6 ms 刷新一次屏幕其实是指底层会以这个固定频率来切换每一帧的画面。**  

1. **这个每一帧的画面也就是我们的 app 绘制视图树（View 树）计算而来的，这个工作是交由 CPU 处理，耗时的长短取决于我们写的代码：布局复不复杂，层次深不深，同一帧内刷新的 View 的数量多不多。**  

1. **CPU 绘制视图树来计算下一帧画面数据的工作是在屏幕刷新信号来的时候才开始工作的，而当这个工作处理完毕后，也就是下一帧的画面数据已经全部计算完毕，也不会马上显示到屏幕上，而是会等下一个屏幕刷新信号来的时候再交由底层将计算完毕的屏幕画面数据显示出来。**  

1. **当我们的 app 界面不需要刷新时（用户无操作，界面无动画），app 就接收不到屏幕刷新信号所以也就不会让 CPU 再去绘制视图树计算画面数据工作，但是底层仍然会每隔 16.6 ms 切换下一帧的画面，只是这个下一帧画面一直是相同的内容。**  

这部分虽然说是一些基本概念，但其实也包含了一些结论了，所以可能大伙看着会有些困惑：为什么界面不刷新时 app 就接收不到屏幕刷新信号了？为什么绘制视图树计算下一帧画面的工作会是在屏幕刷新信号来的时候才开始的？等等。  

emmm，有这些困惑很棒，这样，我们下面一起过源码时，大伙就更有目的性了，这样过源码我觉得效率是比较高一点的。好了，那我们下面就开始过源码了，过完大伙应该就可以清楚了。  

## ViewRootImpl 与 DecorView 的绑定 
阅读源码从哪开始看起一直都是个头疼的问题，所以找一个合适的切入点来跟的话，整个梳理的过程可能会顺畅一点。本篇是研究屏幕的刷新，那么建议就是从某个会导致屏幕刷新的方法入手，比如 `View#invalidate()`。  

`View#invalidate()` 是请求重绘的一个操作，所以我们切入点可以从这个方法开始一步步跟下去。我们在上一篇博客[View 动画 Animation 运行原理解析](https://www.jianshu.com/p/48317612c164)已经分析过 `View#invalidate()` 这个方法了。  

想再过一遍的可以再去看看，我们这里就直接说结论了。我们跟着 `invalidate()` 一步步往下走的时候，发现最后跟到了 `ViewRootImpl#scheduleTraversals()` 就停止了。而 ViewRootImpl 就是今天我们要介绍的重点对象了。  

大伙都清楚，Android 设备呈现到界面上的大多数情况下都是一个 Activity，但其实真正承载视图的是一个 Window，每个 Window 都有一个 DecorView，我们调用 `setContentView()` 其实是将我们自己写的布局文件添加到以 DecorView 为根布局的一个 ViewGroup 里，构成一颗 View 树。  

这些大伙都清楚，每个 Activity 对应一颗以 DecorView 为根布局的 View 树，但其实 DecorView 还有 mParent，而且就是 ViewRootImpl，而且每个界面上的 View 的刷新，绘制，点击事件的分发其实都是由 ViewRootImpl 作为发起者的，由 ViewRootImpl 控制这些操作从 DecorView 开始遍历 View 树去分发处理。  

在上一篇动画分析的博客里，分析 `View#invalidate()` 时，也可以看到内部其实是有一个 do{}while() 循环来不断寻找 mParent，所以最终才会走到 ViewRootImpl 里去，那么可能大伙就会疑问了，**为什么 DecorView 的 mParent 会是 ViewRootImpl 呢？换个问法也就是，在什么时候将 DevorView 和 ViewRootImpl 绑定起来？**  

Activity 的启动是在 ActivityThread 里完成的，`handleLaunchActivity()` 会依次间接的执行到 Activity 的 `onCreate()`, `onStart()`, `onResume()`。在执行完这些后 ActivityThread 会调用 `WindowManager#addView()`，而这个 `addView()` 最终其实是调用了 WindowManagerGlobal 的 `addView()` 方法，所以就从这里开始看：  

![WindowManagerGlobal#addView](http://upload-images.jianshu.io/upload_images/1924341-ed0644ba1b8932da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

WindowManager 维护着所有 Activity 的 DecorView 和 ViewRootImpl。这里初始化了一个 ViewRootImpl，然后调用了它的 `setView()` 方法，将 DevorView 作为参数传递了进去。所以看看 ViewRootImpl 中的 `setView()` 做了什么：
![ViewRootImpl#setView](http://upload-images.jianshu.io/upload_images/1924341-b7826be67afd2fb2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在 `setView()` 方法里调用了 DecorView 的 `assignParent()` 方法，所以去看看 View 的这个方法：
![View#assignParent](http://upload-images.jianshu.io/upload_images/1924341-3135d20601e737e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

参数是 ViewParent，而 ViewRootImpl 是实现了 ViewParent 接口的，所以在这里就将 DecorView 和 ViewRootImpl 绑定起来了。每个Activity 的根布局都是 DecorView，而 DecorView 的 parent 又是 ViewRootImpl，所以在子 View 里执行 `invalidate()` 之类的操作，循环找 parent 时，最后都会走到 ViewRootImpl 里来。

跟界面刷新相关的方法里应该都会有一个循环找 parent 的方法，或者是不断调用 parent 的方法，这样最终才都会走到 ViewRootImpl 里，也就是说实际上 View 的刷新都是由 ViewRootImpl 来控制的。

即使是界面上一个小小的 View 发起了重绘请求时，都要层层走到 ViewRootImpl，由它来发起重绘请求，然后再由它来开始遍历 View 树，一直遍历到这个需要重绘的 View 再调用它的 `onDraw()` 方法进行绘制。

我们重新看回 ViewRootImpl 的 `setView()` 这个方法，这个方法里还调用了一个 `requestLayout()` 方法：
![ViewRootImpl#requestLayout](http://upload-images.jianshu.io/upload_images/1924341-434582ab6f08ff14.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


而 ViewRootImpl 的 `requestLayout()` 里调用了一个 `scheduleTraversals()`。还记得当 View 发起重绘操作 `invalidate()` 时，最后也调用了 `scheduleTraversals()` 这个方法么。其实这个方法就是屏幕刷新的关键，它是安排一次绘制 View 树的任务等待执行，具体后面再说。  

也就是说，**其实打开一个 Activity，当它的 `onCreate---onResume` 生命周期都走完后，才将它的 DecoView 与新建的一个 ViewRootImpl 对象绑定起来，同时开始安排一次遍历 View 任务也就是绘制 View 树的操作等待执行，然后将 DecoView 的 parent 设置成ViewRootImpl 对象**。

这也就是为什么在 `onCreate---onResume` 里获取不到 View 宽高的原因，因为在这个时刻 ViewRootImpl 甚至都还没创建，更不用说是否已经执行过测量操作了。

还可以得到一点信息是，一个 Activity 界面的绘制，其实是在 `onResume()` 之后才开始的。

## ViewRootImpl#scheduleTraversals  
到这里，我们梳理清楚了，调用一个 View 的 `invalidate()` 请求重绘操作，内部原来是要层层通知到 ViewRootImpl 的 `scheduleTraversals()` 里去。而且打开一个新的 Activity，它的界面绘制原来是在 `onResume()` 之后也层层通知到 ViewRootImpl 的 `scheduleTraversals()` 里去。虽然其他关于 View 的刷新操作，比如 `requestLayout()` 等等之类的方法我们还没有去看，但我们已经可以大胆猜测，这些跟 View 刷新有关的操作最终也都会层层走到 ViewRootImpl 中的 `scheduleTraversals()` 方法里去的。  

那么这个方法究竟干了些什么，我们就要好好来分析了：  
![ViewRootImpl#scheduleTraversals](http://upload-images.jianshu.io/upload_images/1924341-66a63c915c2b5613.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

mTraversalScheduled 这个 boolean 变量的作用等会再来看，先看看 `mChoreographer.postCallback()` 这个方法，传入了三个参数，第二个参数是一个 Runnable 对象，先来看看这个 Runnable：  
![TraversalRunnable](http://upload-images.jianshu.io/upload_images/1924341-c626c7dfe285b564.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个 Runnable 做的事很简单，就调用了一个方法，`doTraversal()`:  
![ViewRootImpl#doTraversal](http://upload-images.jianshu.io/upload_images/1924341-464766462e408366.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


看看这个方法做的事，跟 `scheduleTraversals()` 正好相反，一个将变量置成 true，这里置成 false，一个是 `postSyncBarrier()`，这里是 `removeSyncBarrier()`，具体作用等会再说，继续先看看 `performTraversals()`，这个方法也是屏幕刷新的关键：  
![ViewRootImpl#performTraversals](http://upload-images.jianshu.io/upload_images/1924341-55aadc3c3f1b8b80.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

View 的测量、布局、绘制三大流程都是交由 ViewRootImpl 发起，而且还都是在 `performTraversals()` 方法中发起的，所以这个方法的逻辑很复杂，因为每次都需要根据相应状态判断是否需要三个流程都走，有时可能只需要执行 `performDraw()` 绘制流程，有时可能只执行 `performMeasure()` 测量和 `performLayout()` 布局流程（一般测量和布局流程是一起执行的）。不管哪个流程都会遍历一次 View 树，所以其实界面的绘制是需要遍历很多次的，如果页面层次太过复杂，每一帧需要刷新的 View 又很多时，耗时就会长一点。  

当然，测量、布局、绘制这些流程在遍历时并不一定会把整颗 View 树都遍历一遍，ViewGroup 在传递这些流程时，还会再根据相应状态判断是否需要继续往下传递。  

**了解了 `performTraversals()` 是刷新界面的源头后，接下去就需要了解下它是什么时候执行的，和 `scheduleTraversals()` 又是什么关系？**  

`performTraversals()` 是在 `doTraversal()` 中被调用的，而 `doTraversal()` 又被封装到一个 Runnable 里，那么关键就是这个 Runnable 什么时候被执行了？

## Choreographer  
`scheduleTraversals()` 里调用了 Choreographer 的 `postCallback()` 将 Runnable 作为参数传了进去，所以跟进去看看：  
![Choreographer#postCallback](http://upload-images.jianshu.io/upload_images/1924341-b59ba6d6b9789e00.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![Choreographer#postCallbackDelayedInternal](http://upload-images.jianshu.io/upload_images/1924341-1b4f5fb7244d6c4b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

因为 `postCallback()` 调用 `postCallbackDelayed()` 时传了 delay = 0 进去，所以在 `postCallbackDelayedInternal()` 里面会先根据当前时间戳将这个 Runnable 保存到一个 mCallbackQueue 队列里，这个队列跟 MessageQueue 很相似，里面待执行的任务都是根据一个时间戳来排序。然后走了 `scheduleFrameLocked()` 方法这边，看看做了些什么：  
![Choreographer#scheduleFrameLocked](http://upload-images.jianshu.io/upload_images/1924341-67497e732640cb27.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果代码走了 else 这边来发送一个消息，那么这个消息做的事肯定很重要，因为对这个 Message 设置了异步的标志而且用了`sendMessageAtFrontOfQueue()` 方法，这个方法是将这个 Message 直接放到 MessageQueue 队列里的头部，可以理解成设置了这个Message 为最高优先级，那么先看看这个 Message 做了些什么：  
![Choreograhper$FrameHandler#handleMessage](http://upload-images.jianshu.io/upload_images/1924341-bf505ec644d63b29.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![Choreographer#doScheduleVsync](http://upload-images.jianshu.io/upload_images/1924341-9508e47fa74249c1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

所以这个 Message 最后做的事就是 `scheduleVsyncLocked()`。我们回到 `scheduleFrameLocked()` 这个方法里，当走 if 里的代码时，直接调用了 `scheduleVsyncLocked()`，当走 else 里的代码时，发了一个最高优先级的 Message，这个 Message 也是执行 `scheduleVsyncLocked()`。既然两边最后调用的都是同一个方法，那么为什么这么做呢？

关键在于 if 条件里那个方法，我的理解那个方法是用来判断当前是否是在主线程的，我们知道主线程也是一直在执行着一个个的 Message，那么如果在主线程的话，直接调用这个方法，那么这个方法就可以直接被执行了，如果不是在主线程，那么 post 一个最高优先级的 Message 到主线程去，保证这个方法可以第一时间得到处理。

那么这个方法是干嘛的呢，为什么需要在最短时间内被执行呢，而且只能在主线程？  
![Choreographer#scheduleVsyncLocked](http://upload-images.jianshu.io/upload_images/1924341-67d8db7087fb2523.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![DisplayEventReceiver#scheduleVsync](http://upload-images.jianshu.io/upload_images/1924341-f294d32882480e39.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

调用了 native 层的一个方法，那跟到这里就跟不下去了。  

那到这里，我们先来梳理一下：  

**到这里为止，我们知道一个 View 发起刷新的操作时，会层层通知到 ViewRootImpl 的 scheduleTraversals() 里去，然后这个方法会将遍历绘制 View 树的操作 performTraversals() 封装到 Runnable 里，传给 Chorerographer，以当前的时间戳放进一个 mCallbackQueue 队列里，然后调用了 native 层的一个方法就跟不下去了。所以这个 Runnable 什么时候会被执行还不清楚。那么，下去的重点就是搞清楚它什么时候从队列里被拿出来执行了？**  

接下去只能换种方式继续跟了，既然这个 Runnable 操作被放在一个 mCallbackQueue 队列里，那就从这个队列着手，看看这个队列的取操作在哪被执行了：  
![Choreographer$CallbackQueue](http://upload-images.jianshu.io/upload_images/1924341-9f0e770caec64f99.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![Choreographer#doCallbacks](http://upload-images.jianshu.io/upload_images/1924341-cfa351f92bce62d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![Choreographer#doFrame](http://upload-images.jianshu.io/upload_images/1924341-0d00d2ae6a4f1b82.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

还记得我们说过在 ViewRootImpl 的 `scheduleTraversals()` 里会将遍历 View 树绘制的操作封装到 Runnable 里，然后调用 Choreographer 的 `postCallback()` 将这个 Runnable 放进队列里么，而当时调用 `postCallback()` 时传入了多个参数，这是因为 Choreographer 里有多个队列，而第一个参数 Choreographer.CALLBACK_TRAVERSAL 这个参数是用来区分队列的，可以理解成各个队列的 key 值。

那么这样一来，就找到关键的方法了：`doFrame()`，这个方法里会根据一个时间戳去队列里取任务出来执行，而这个任务就是 ViewRootImpl 封装起来的 `doTraversal()` 操作，而 `doTraversal()` 会去调用 `performTraversals()` 开始根据需要测量、布局、绘制整颗 View 树。所以剩下的问题就是 `doFrame()` 这个方法在哪里被调用了。

有几个调用的地方，但有个地方很关键：
