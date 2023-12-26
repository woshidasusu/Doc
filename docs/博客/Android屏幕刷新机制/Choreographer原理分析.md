
不过，要说清楚这点，又得继续跟下去了。不过，应该不用跟的很深，先来看看 ViewRootImpl.performTraversals() 在哪被调用了：  

![doTraversal.png](http://upload-images.jianshu.io/upload_images/1924341-c7a217ddeb882032.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

很好，只有一个被调用的地方，继续跟，doTraversal() 在哪些地方被调用了：  

![TraversalRunnable.png](http://upload-images.jianshu.io/upload_images/1924341-2e74be11b45013cb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

势头很好，还是只有一个地方被调用。emmm，看样子，performTraversals() 里做的事其实都是放在一个 Runnable 里的，而且这个 Runnable 一开始就初始化了，那我们继续看看 mTraversalRunnable 这个变量在哪里使用了：  

![scheduleTraversals.png](http://upload-images.jianshu.io/upload_images/1924341-5c5fb1bdee9498e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

unscheduleTraversals() 我们就不看了，看命名就猜到跟取消遍历有关，我们就看 scheduleTraversals() 就好了。 mTraversalScheduled 这个变量初始值是 false，所以这里会进去 if 里执行。所以关键点就是这个 mChoreographer.postCallback() 了。我们先去看看 Choreographer.postCallback() 看看这个方法做了些什么：  

![postCallback.png](http://upload-images.jianshu.io/upload_images/1924341-ba580c236e965c85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

继续跟进：  

![postCallbackDelayed.png](http://upload-images.jianshu.io/upload_images/1924341-d5f486f7ead10673.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

emmm，继续跟进，这里稍微注意下前面调用这个方法，delayMillis 参数传入的是 0 就可以了：  

![postCallbackDelayedInternal.png](http://upload-images.jianshu.io/upload_images/1924341-aa985bb74ff971d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

emmm，这命名很有艺术，以后可以借鉴学习一下，扯远了，回归正题。是不是很开心，看到了 mHandler，但其实这里走的应该是 `dueTime <= now` 这边，因为我们最开始方法调用时传入的 delayMillis 是 0，那就继续跟进 scheduleFrameLocked() 看看：  

![scheduleFrameLocked.png](http://upload-images.jianshu.io/upload_images/1924341-52c8f6878d802f92.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

继续跟下去之前，我们先来了解一下 Choreographer：

![Choreographer构造函数.png](http://upload-images.jianshu.io/upload_images/1924341-7c18e6d0b80ac5c6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

mHandler 是 Choreographer 内部类 FrameHandler 的一个对象，Choreographer 有一个 mLooper 变量，在构造函数里会对这个 mLooper 变量赋值，同时实例化 FrameHandler 传入 mLooper 参数。所以，mHandler 绑定的 Looper 跟 Choreographer 的变量 mLooper 是同一个。 

![getInstance.png](http://upload-images.jianshu.io/upload_images/1924341-b835ca02ebe05c73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

![sThreadInstance.png](http://upload-images.jianshu.io/upload_images/1924341-d91e6a546fe832a3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

而且，Choreographer 是一个单例类，获取实例化对象时，会先获取当前线程的 Looper，然后传给构造函数，实例化一个 Choreographer 对象，而 mLooper 和 mHandler 绑定的就是当前线程的 Looper。  

而 ViewRootImpl 有一个 mChoreographer 变量，它是在 ViewRootImpl 的构造函数里被实例化的，而 ViewRootImpl 被实例化的时机是在 ActivityThread 调用 handleResumeActivity() 时一步步通知到 WindowManagerGlobal 的 addView() 里执行的 `new ViewRootImpl()`， 所以 `new ViewRootImpl()` 时是在主线程中执行的，也就是说 mChoreographer 持有的 Looper 和它的 mHandler 绑定的就是主线程的 Looper。  

啊啊啊~~~，越跟越深，越跟越复杂，上面的过程我就不贴图了，因为我顶多跟到 ViewRootImpl 在构造函数里实例化 Choreographer 对象之后，就卡住了，后面的流程是看的网上大神的博客讲解的。总之，大伙清楚结论就好，感兴趣的可以自己去跟跟看。  

好了，了解完 Choreographer，我们继续回过头分析 scheduleFrameLocked()：  

![scheduleFrameLocked.png](http://upload-images.jianshu.io/upload_images/1924341-52c8f6878d802f92.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

isRunningOnLooperThreadLocked() 是判断 Choreographer 的变量 mLooper 是不是当前的线程的 Looper，目的嘛，没搞懂，但不影响我们分析啦，因为就算走的是 else 那边，经过 mHander 发完消息后最后也还是会执行的 scheduleVsyncLocked()，代码就在 FrameHandler 里，我就不贴了。所以这里最终都会走到 scheduleVsyncLocked()，我们跟进看看：  

![scheduleVsyncLocked.png](http://upload-images.jianshu.io/upload_images/1924341-52989fcb6b2f529d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

mDisplayEventReceiver 是 FrameDisplayEventReceiver 的实例，FrameDisplayEventReceiver 继承自 DisplayEventReceiver 实现了 Runnable 接口，所以我们主要关注它的 run() 方法就好，调用了 doFrame()，所以我们继续跟进看看：  

![doFrame.png](http://upload-images.jianshu.io/upload_images/1924341-6458fe063a3c8986.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

继续到 doCallbacks() 看看：  

![doCallbacks.png](http://upload-images.jianshu.io/upload_images/1924341-fa1851cdfce5c751.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

感觉快看到结果了，我们在最开始的 ViewRootImpl 里调用 mChoreographer.postCallback() 时，传入了一个常量参数，和遍历 View 树的 Runnable 任务，然后 Choreographer 会根据这个常量参数将 Runnable 经过 CallbackRecord 包装然后保存起来。上面就是根据这个常量参数将缓存的这个 CallbackRecord 取出来了，赶紧再看看它的 run() 方法：  

![CallbackRecord.png](http://upload-images.jianshu.io/upload_images/1924341-5bcd25e4495bda99.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

因为最开始传进来的 token 是 null，所以这里最后走的是 `((Runnable)action).run()` 的方法，而这个 action 就是 mTraversalRunnable，也就是遍历 View 树的任务：performTraversals()。   

哇，太不容易了，**终于看到我们想要的结果了。如果你还没理过来，么事，我们来慢慢的梳理一遍你就清楚了**：  

还记得我们为什么要跟进到 Choreographer 这个类里么，我们在分析 ViewRootImpl.performTraversals() 什么时候被调用的时候跟到了 scheduleTracersals() 里：    

![ViewRootImpl.scheduleTraversals.png](http://upload-images.jianshu.io/upload_images/1924341-49b41ae2275dc9d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这里调用了 mChoreographer.postCallback() ，并将 mTraversalRunnable 作为参数传了进去。而 Choreographer 会根据传入的 Choreographer.CALLBACK_TRAVERSAL 参数将 mTraversalRunnable 经过 CallbackRecord 包装保存起来，然后经过一系列操作之后取出来，调用 Runnable 的 run() 方法。  