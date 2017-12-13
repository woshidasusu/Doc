![View.post示例.png](http://upload-images.jianshu.io/upload_images/1924341-11b143b4893d0c0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

emmm，大伙都知道，子线程是不能进行 UI 操作的，或者很多场景下，一些操作需要延迟执行，这些都可以通过 Handler 来解决。但说实话，实在是太懒了，总感觉写 Handler 太麻烦了，一不小心又很容易写出内存泄漏的代码来，所以为了偷懒，我就经常用 **View.post() or View.postDelay()** 来代替 Handler 使用。  

但用多了，总有点心虚，**View.post()** 会不会有什么隐藏的问题？所以趁有点空余时间，这段时间就来梳理一下，**View.post()** 原理到底是什么，内部都做了啥事。  

# 提问  
开始看源码前，先提几个问题，带着问题去看源码应该会比较有效率，防止阅读源码过程中，陷得太深，跟得太偏了。  

**Q1: 为什么 View.post() 的操作是可以对 UI 进行更新操作的呢，即使是在子线程中调用 View.post()？**  

**Q2：网上都说 View.post() 中的操作执行时，View 的宽高已经计算完毕，所以经常遇见在 Activity 的 onCreate() 里调用 View.post() 来解决获取 View 宽高为0的问题，为什么可以这样做呢？**  

**Q3：用 View.postDelay() 有可能导致内存泄漏么？**  

**Q4：View.post() 可以代替 Handler 来使用么？**

ps:本篇分析的源码基于 andoird-25 版本，版本不一样源码可能有些区别，大伙自己过源码时可以注意一下。另，下面分析过程有点长，慢慢看哈。

# 源码分析  
好了，就带着这几个问题来跟着源码走吧。其实，这些问题大伙心里应该都有数了，看源码也就是为了验证心里的想法。第一个问题，之所以可以对 UI 进行操作，那内部肯定也是通过 Handler 来实现了，所以看源码的时候就可以看看内部是如何对 Handler 进行封装的。而至于剩下的问题，那就在看源码过程中顺带看看能否找到答案吧。  

**入口**  

![View.post.png](http://upload-images.jianshu.io/upload_images/1924341-728672bc93262ba8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

View.post() 方法很简单，代码很少。那我们就一行行的来看。  

如果 **mAttachInfo** 不为空，那就调用 **mAttachInfo.mHanlder.post()** 方法，如果为空，则调用 **getRunQueue().post()** 方法。  

那就找一下，**mAttachInfo** 是什么时候赋值的，可以借助 AS 的 `Ctrl + F` 查找功能，过滤一下 `mAttachInfo = `，注意 `=` 号后面还有一个空格，否则你查找的时候会发现全文有两百多处匹配到。我们只关注它是什么时候赋值的，使用的场景就不管了，所以过滤条件可以细一点。这样一来，全文就只有两处匹配：  

![dispatchAttachedToWindow.png](http://upload-images.jianshu.io/upload_images/1924341-53c96cd0e2f72468.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![dispatchDetachedFromWindow.png](http://upload-images.jianshu.io/upload_images/1924341-9bc9b67b6a242837.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

一处赋值，一处置空，刚好又是在对应的一个生命周期里：**attachedToWindow 和 detachedFromWindow**。  

所以，如果 **mAttachInfo** 不为空的时候，走的就是 Handler 的 post()，也就是 View.post() 在这种场景下，实际上就是调用的 Handler.post()，接下去就是搞清楚一点，这个 Handler 是哪里的 Handler，在哪里初始化等等，但这点可以先暂时放一边，因为 **mAttachInfo** 是在 **attachedToWindow** 时才赋值的，所以接下去关键的一点是搞懂 **attachedToWindow** 到 **detachedFromWindow** 这个生命周期分别在什么时候在哪里被调用了。  

虽然我们现在还不清楚，**attachedToWindow** 到底是什么时候被调用的，但看到这里我们至少清楚一点，在 Activity 的 onCreate() 期间，这个 View 的 attachedToWindow 应该是还没有被调用，也就是 **mAttachInfo** 这时候还是为空，但我们在 onCreate() 里执行 **View.post()** 里的操作仍然可以保证是在 View 宽高计算完毕的，也就是开头的问题 Q2，那么这点的原理显然就是在另一个 return 那边的方法里了：**getRunQueue().post()**。  

那么，我们就先解决 Q2 吧，为什么 **View.post()** 可以保证操作是在 View 宽高计算完毕之后呢？跟进 **getRunQueue()** 看看：  

![getRunQueue.png](http://upload-images.jianshu.io/upload_images/1924341-439e91604d6a1132.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

所以调用的其实是 HandlerActionQueue.post() 的方法，那么我们再继续跟进去看看：  

![HandlerActionQueue.png](http://upload-images.jianshu.io/upload_images/1924341-0fa077e45461c89d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们调用 **View.post(Runnable action)** 传进去的 Runnable 操作，实际上是先经过 HandlerAction 包装，然后保存到 HandlerActionQueue 里。先看看 HandlerAction：  

![HandlerAction.png](http://upload-images.jianshu.io/upload_images/1924341-5dda0387f6ca5d2d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

很简单的数据结构，就一个 Runnable 变量和一个 delay 变量。至于为什么经过这样的包装，因为还有 **View.postDelay()** 啊，对吧，延迟的操作要保存下来自然需要一个 delay 变量来保存。    

所以，HandlerActionQueue 先将 **View.post(Runnable action)** 传入的 Runnable 通过 HandlerAction 包装一下，然后再缓存下来。至于缓存的原理，HandlerActionQueue 是通过一个默认大小为4的数组保存这些 Runnable 操作的，当然，如果数组不够用时，就会通过 GrowingArrayUtils 来扩充数组，具体算法就不继续看下去了，不然越来越偏，但感兴趣的可以来这里学学哈。  

**到这里，我们再来梳理下:**  

当我们在 Activity 的 onCreate() 里执行 **View.post(Runnable action)** 时，因为这时候 View 还没有 attachedToWindow，所以这些 Runnable 操作其实并没有被执行，而只是先通过 HandlerActionQueue 缓存起来。  

那么到什么时候这些 Runnable 才会被执行呢？我们可以看看 HandlerActionQueue 这个类，它的代码不多，里面有个 **executeActions()** 方法，看命名就知道，这方法是用来执行这些被缓存起来的 Runnable 操作的。  

![executeActions.png](http://upload-images.jianshu.io/upload_images/1924341-0ee2916520c4c600.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

哇，看到重量级的人物了：**Handler**。看来被缓存起来没有执行的 Runnable 最后也还是通过 Hnadler 来执行的。那么，关键点还是，这个方法什么时候被调用呢？  

![查找调用executeActions的地方.png](http://upload-images.jianshu.io/upload_images/1924341-08af749ee07212dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

借助 AS 的 `Ctrl + Alt + F7` 快捷键，可以查找 SDK 里的某个方法在哪些地方被调用了。  

![mRunQueue.executeActions.png](http://upload-images.jianshu.io/upload_images/1924341-d300abbebda51577.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

很好，找到了，而且只找到这个地方。其实，这个快捷键有时并没有办法找到一些方法被调用的地方，这也是源码阅读过程中令人头疼的一点，因为没法找到这些方法到底在哪些地方被调用了，所以很难把流程梳理下来。如果方法是私有的，那很好办，就用 `Ctrl + F` 在这个类里找一下就可以，如果匹配结果太多，那就像开头那样把过滤条件详细一点。如果方法不是私有的，那真的就很难办了，这也是一开始找到 **dispatchAttachedToWindow()** 后为什么不继续跟踪下去转而来分析Q2，**getRunQueue()** 的原因，因为用 AS 找不到 **dispatchAttachedToWindow()** 到底在哪些地方被谁调用了。哇，好像又扯远了，回归正题回归正题。  

emmm，看来这里也绕回来了，**dispatchAttachedToWindow()** 看来是个关键的节点，**那到这里，我们再次来梳理一下：**  

我们使用 **View.post()** 时，其实内部它自己分了两种情况处理，当 View 还没有 **attachedToWindow** 时，通过 **View.post(Runnable)** 传进来的 Runnable 操作都先被缓存起来，然后等 View 的 **dispatchAttachedToWindow()** 被调用时，就通过 **mAttachInfo.mHandler** 来执行这些被缓存起来的 Runnable 操作。从这以后到 View 被 **detachedFromWindow** 这段期间，如果再次调用 **View.post(Runnable)** 的话，那么这些 Runnable 不用再缓存了，而是直接交给 **mAttachInfo.mHanlder** 来执行。  

以上，就是到目前我们所能得知的信息。这样一来，Q2 是不是也就清楚原理了，**View.post(Runnable)** 的操作之所以可以保证肯定是在 View 宽高计算完毕之后才执行的，是因为这些 Runnable 操作只有在 View 的 **attachedToWindow** 到 **detachedFromWiondow** 这期间才会被执行。  

那么，接下去就还剩两个关键点需要搞清楚了:   

1. **dispatchAttachedToWindow() 是什么时候被调用的？** 
1. **mAttachInfo 是在哪里被初始化的？**  

只借助 AS 的话，很难找到 **dispatchAttachedToWindow()** 到底在哪些地方被调用了。所以，到这里，我又借助了 Source Insight 软件。   
![sourceInsight查找dispatchAttachedToWindow.png](http://upload-images.jianshu.io/upload_images/1924341-65607c3ffd68e29d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

找到了四个被调用的地方，三个在 ViewGroup 里，一个在 ViewRootImpl.performTraversals() 里。找到了就好，接下去继续用 AS 来分析吧，Source Insight 用不习惯，不过分析源码时确实可以结合这两个软件。    

![ViewRootImpl.performTraversals.png](http://upload-images.jianshu.io/upload_images/1924341-c82e3b6e1f6612a1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

哇，懵逼，完全懵逼。我就想看个 **View.post()**，结果跟着跟着，跟到这里来了。ViewRootImpl 我在分析[Android KeyEvent 点击事件分发处理流程](http://www.jianshu.com/p/2f28386706a0)时短暂接触过，但这次显然比上次还需要更深入去接触一下，哎，力不从心啊。  

我只能跟大伙肯定的是，mView 是 Activity 的 DecorView。咦~，等等，这样看来 ViewRootImpl 是调用的 DecorView 的 dispatchAttachedToWindow() ，但我们在使用 **View.post()** 时，这个 View 可以是任意 View，并不是非得用 DecorView。哈哈哈，看来我们找错地方了，那我们就去 ViewGroup 里看看吧。  

hhh，松了一口气，ViewRootImpl 目前能力实在还无法来接触，那我们就去 ViewGroup 里看看：  

![ViewGroup.addViewInner.png](http://upload-images.jianshu.io/upload_images/1924341-3395ff17de45f570.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

addViewInner() 是 ViewGroup 在添加子 View 时的内部逻辑，也就是说当 ViewGroup addView() 时，如果 mAttachInfo 不为空，就都会去调用子 View 的 dispatchAttachedToWindow()，并将自己的 mAttachInfo 传进去。还记得 View 的 dispatchAttachedToWindow() 这个方法么：  

![View.dispatachAttachedToWindow.png](http://upload-images.jianshu.io/upload_images/1924341-8718cc9b8c7877b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

mAttachInfo 唯一被赋值的地方也就是在这里，那么也就是说，子 View 的 mAttachInfo 其实跟父控件 ViewGroup 里的 mAttachInfo 是同一个的。那么，**ViewGroup 在 addViewInner() 时，传进去的 mAttachInfo 是在哪被赋值的呢**？我们来找找看：  

![查找ViewGroup的mAttachInfo.png](http://upload-images.jianshu.io/upload_images/1924341-8a4ca5fd32da1b1c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

咦，利用 AS 的 `Ctrl + 左键` 怎么找不到 mAttachInfo 被定义的地方呢，不管了，那我们用 `Ctrl + F` 搜索一下在 ViewGroup 类里 mAttachInfo 被赋值的地方好了：  

![ViewGroup里查找mAttachInfo被赋值的地方.png](http://upload-images.jianshu.io/upload_images/1924341-0320935717cf131c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

咦，怎么一个地方也没有。难道说，这个 mAttachInfo 是父类 View 定义的变量么，既然 AS 找不到，我们换 Source Insight 试试：  

![用SourceInsight查找mAttachInfo.png](http://upload-images.jianshu.io/upload_images/1924341-3e3b441afb817714.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![View.mAttachInfo.png](http://upload-images.jianshu.io/upload_images/1924341-8d5d5a95c882ba6f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

还真的是，ViewGroup 是继承的 View，并且处于同一个包里，所以可以直接使用该变量，那这样一来，我们岂不是又绕回来了。前面说过，dispatchAttachedToWindow() 在 ViewGroup 里有三处调用的地方，既然 addViewInner() 这里的看不出什么，那去另外两个地方看看：  

![ViewGroup.dispatchAttachedToWindow.png](http://upload-images.jianshu.io/upload_images/1924341-d55e4478f13c55e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

剩下的两个地方就都是在 ViewGroup 重写的 dispatchAttachedToWindow() 方法里了，这代码也很好理解，在该方法被调用的时候，先执行 super 也就是 View 的 dispatchAttachedToWindow() 方法，还没忘记吧，mAttachInfo 就是在这里被赋值的。然后再遍历子 View，分别调用子 View 的 dispatchAttachedToWindow() 方法，并将 mAttachInfo 作为参数传递进去，这样一来，子 View 的 mAttachInfo 也都被赋值了。  

但这样一来，我们就又绕回来了。**我们先来梳理一下吧：**  

目前，我们知道，**View.post(Runnable)** 的这些 Runnable 操作，在 View 被 attachedToWindow 之前会先缓存下来，然后在 dispatchAttachedToWindow() 被调用时，就将这些缓存下来的 Runnable 通过 mAttachInfo 的 mHandler 来执行。在这之后再调用 **View.post(Runnable)** 的话，这些 Runnable 操作就不用再被缓存了，而是直接交由 mAttachInfo 的 mHandler 来执行。  

所以，我们得搞清楚 **dispatchAttachedToWindow()** 在什么时候被调用，以及 **mAttachInfo** 是在哪被初始化的，因为需要知道它的变量如 mHandler 都是些什么。  

然后，我们在跟踪 **dispatchAttachedToWindow()** 被调用的地方时，跟到了 ViewGroup 的 addViewInner() 里。在这里我们得到的信息是如果 mAttachInfo 不为空时，会直接调用子 View 的 **dispatchAttachedToWindow()**，这样新 add 进来的子 View 的 mAttachInfo 就会被赋值了。但 ViewGroup 的 mAttachInfo 是父类 View 的变量，所以为不为空的关键还是回到了 **dispatchAttachedToWindow()** 被调用的时机。  

我们还跟到了 ViewGroup 重写的 **dispatchAttachedToWindow()** 方法里，但显然，ViewGroup 重写这个方法只是为了将 attachedToWindow 这个事件通知给它所有的子 View。  

所以，最后，我们能得到的结论就是，我们还得再回去 ViewRootImpl 里，**dispatchAttachedToWindow()** 被调用的地方，除了 ViewRootImpl，我们都分析过了，得不到什么信息，只剩最后 ViewRootImpl 这里了，所以关键点肯定在这里。看来这次，不行也得上了。  

![ViewRootImpl.performTraversals.png](http://upload-images.jianshu.io/upload_images/1924341-2b17524b6dfa389b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 

这方法代码有八百多行！！不过，我们只关注我们需要的点就行，这样一省略无关代码来看，是不是感觉代码就简单得多了。  

mFirst 初始化为 true，全文只有一处赋值，所以 if(mFirst) 块里的代码只会执行一次。我对 ViewRootImpl 不是很懂，performTraversals() 这个方法应该是通知 Activity 的 View 树开始测量、布局、绘制。而 DevorView 是 Activity 视图的根布局，它继承 FrameLayout，所以也是个 ViewGroup，而我们之前对 ViewGroup 的 dispatchAttachedToWindow() 分析过了吧。也就是说，在 Activity 首次进行 View 树的遍历绘制时，ViewRootImpl 会将自己的 mAttachInfo 通过根布局 DecorView 传递给所有的子 View 。  

那么，我们就来看看 ViewRootImpl 的 mAttachInfo 什么时候被初始化吧：  

![ViewRootImpl构造函数.png](http://upload-images.jianshu.io/upload_images/1924341-e658c8824fe873e6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在构造函数里对 mAttachInfo 进行初始化，传入了很多参数，我们关注的应该是 mHandler 这个变量，所以看看这个变量定义：  

![mHandler.png](http://upload-images.jianshu.io/upload_images/1924341-53c74d20d7d8f735.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

终于找到 new Handler() 的地方了，至于这个自定义的 Handler 类做了啥，我们不关心，反正通过 post() 方式执行的操作跟它自定义的东西也没有多大关系。我们关心的是在哪 new 了这个 Handler。**因为每个 Handler 在 new 的时候都会绑定一个 Looper，这里 new 的时候是无参构造函数，那显然绑定的就是当前线程的 Looper，而这句 new 代码是在主线程中执行的，所以这个 Handler 绑定的也就是主线程的 Looper**。至于这些的原理，就涉及到 Handler 的源码和 ThreadLocal 的原理了，就不继续跟进了，太偏了，大伙清楚结论这点就好。    

**这也就是为什么 View.post(Runnable) 的操作可以更新 UI 的原因，因为这些 Runnable 操作都通过 ViewRootImpl 的 mHandler 切到主线程来执行了。**  

这样 Q1 就搞定了，终于搞定了一个问题，不容易啊，本来以为很简单的来着。  

跟到 ViewRootImpl 这里应该就可以停住了。至于 ViewRootImpl 跟 Activity 有什么关系、什么时候被实例化的、跟 DecroView 如何绑定的就不跟进了，因为我也还不是很懂，感兴趣的可以自己去看看，我在末尾会给一些参考博客。  

至此，我们清楚了 mAttachInfo 的由来，也知道了 mAttachInfo.mHandler，还知道在 Activity 首次遍历 View 树进行测量、绘制时会通过 DecorView 的 dispatchAttachedToWindow() 将 mAttachInfo 传递给所有子 View，并通知所有调用 **View.post(Runnable)** 被缓存起来的 Runable 操作可以执行了。  

但还有一点疑问：**看网上对 ViewRootImpl.performTraversals() 的分析，遍历 View 树进行测量、布局、绘制操作的代码显然是在调用了 dispatchAttachedToWindow() 之后才执行，那这样一来是如何保证 View.post(Runnable) 被缓存的操作可以获取到 View 的宽高呢？明明测量的代码在 dispatchAttachedToWindow() 后面。**  

我在这里卡了很久，一直没想明白。我甚至以为是 PhoneWindow 在加载 layout 布局到 DecorView 时就进行了测量的操作，所以一直跟，跟到 LayoutInflater.inflate()，跟到了 ViewGroup.addView()，最后又绕回到 ViewRootImpl 中去了。  

最后，感谢[通过View.post()获取View的宽高引发的两个问题](http://blog.csdn.net/scnuxisan225/article/details/49815269)这篇博客的作者，解答了我的疑问。  

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

   
  
















