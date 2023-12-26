![View.post示例.png](http://upload-images.jianshu.io/upload_images/1924341-11b143b4893d0c0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

emmm，大伙都知道，子线程是不能进行 UI 操作的，或者很多场景下，一些操作需要延迟执行，这些都可以通过 Handler 来解决。但说实话，实在是太懒了，总感觉写 Handler 太麻烦了，一不小心又很容易写出内存泄漏的代码来，所以为了偷懒，我就经常用 **View.post() or View.postDelay()** 来代替 Handler 使用。  

但用多了，总有点心虚，**View.post()** 会不会有什么隐藏的问题？所以趁有点空余时间，这段时间就来梳理一下，**View.post()** 原理到底是什么，内部都做了啥事。  

# 提问  
开始看源码前，先提几个问题，带着问题去看源码应该会比较有效率，防止阅读源码过程中，陷得太深，跟得太偏了。  

**Q1: 为什么 View.post() 的操作是可以对 UI 进行更新操作的呢，即使是在子线程中调用 View.post()？**  

**Q2：网上都说 View.post() 中的操作执行时，View 的宽高已经计算完毕，所以经常遇见在 Activity 的 onCreate() 里调用 View.post() 来解决获取 View 宽高为0的问题，为什么可以这样做呢？**  

**Q3：用 View.postDelay() 有可能导致内存泄漏么？**  


ps:本篇分析的源码基于 **andoird-25** 版本，版本不一样源码可能有些区别，大伙自己过源码时可以注意一下。另，下面分析过程有点长，慢慢看哈。

# 源码分析  
好了，就带着这几个问题来跟着源码走吧。其实，这些问题大伙心里应该都有数了，看源码也就是为了验证心里的想法。第一个问题，之所以可以对 UI 进行操作，那内部肯定也是通过 Handler 来实现了，所以看源码的时候就可以看看内部是如何对 Handler 进行封装的。而至于剩下的问题，那就在看源码过程中顺带看看能否找到答案吧。  

## View.post()  

![View.post.png](http://upload-images.jianshu.io/upload_images/1924341-728672bc93262ba8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

View.post() 方法很简单，代码很少。那我们就一行行的来看。  

如果 **mAttachInfo** 不为空，那就调用 **mAttachInfo.mHanlder.post()** 方法，如果为空，则调用 **getRunQueue().post()** 方法。  

那就找一下，**mAttachInfo** 是什么时候赋值的，可以借助 AS 的 `Ctrl + F` 查找功能，过滤一下 `mAttachInfo = `，注意 `=` 号后面还有一个空格，否则你查找的时候会发现全文有两百多处匹配到。我们只关注它是什么时候赋值的，使用的场景就不管了，所以过滤条件可以细一点。这样一来，全文就只有两处匹配：  

![dispatchAttachedToWindow.png](http://upload-images.jianshu.io/upload_images/1924341-53c96cd0e2f72468.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![dispatchDetachedFromWindow.png](http://upload-images.jianshu.io/upload_images/1924341-9bc9b67b6a242837.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

一处赋值，一处置空，刚好又是在对应的一个生命周期里： 

1. **dispatchAttachedToWindow() 下文简称 attachedToWindow**  
1. **dispatchDetachedFromWindow() 下文简称 detachedFromWindow**。  

所以，如果 **mAttachInfo** 不为空的时候，走的就是 Handler 的 post()，也就是 View.post() 在这种场景下，实际上就是调用的 Handler.post()，接下去就是搞清楚一点，这个 Handler 是哪里的 Handler，在哪里初始化等等，但这点可以先暂时放一边，因为 **mAttachInfo** 是在 **attachedToWindow** 时才赋值的，所以接下去关键的一点是搞懂 **attachedToWindow** 到 **detachedFromWindow** 这个生命周期分别在什么时候在哪里被调用了。  

虽然我们现在还不清楚，**attachedToWindow** 到底是什么时候被调用的，但看到这里我们至少清楚一点，在 Activity 的 onCreate() 期间，这个 View 的 **attachedToWindow** 应该是还没有被调用，也就是 **mAttachInfo** 这时候还是为空，但我们在 onCreate() 里执行 **View.post()** 里的操作仍然可以保证是在 View 宽高计算完毕的，也就是开头的问题 Q2，那么这点的原理显然就是在另一个 return 那边的方法里了：**getRunQueue().post()**。  

那么，我们就先解决 Q2 吧，为什么 **View.post()** 可以保证操作是在 View 宽高计算完毕之后呢？跟进 **getRunQueue()** 看看：  

## getRunQueue().post()  

![getRunQueue.png](http://upload-images.jianshu.io/upload_images/1924341-439e91604d6a1132.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

所以调用的其实是 HandlerActionQueue.post() 方法，那么我们再继续跟进去看看：  

![HandlerActionQueue.png](http://upload-images.jianshu.io/upload_images/1924341-0fa077e45461c89d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

post(Runnable) 方法内部调用了 postDelayed(Runnable, long)，postDelayed() 内部则是将 Runnable 和 long 作为参数创建一个 HandlerAction 对象，然后添加到 mActions 数组里。下面先看看 HandlerAction：  

![HandlerAction.png](http://upload-images.jianshu.io/upload_images/1924341-5dda0387f6ca5d2d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

很简单的数据结构，就一个 Runnable 成员变量和一个 long 成员变量。这个类作用可以理解为用于包装 **View.post(Runnable)** 传入的 Runnable 操作的，当然因为还有 **View.postDelay()** ，所以就还需要一个 long 类型的变量来保存延迟的时间了，这样一来这个数据结构就不难理解了吧。    

所以，我们调用 **View.post(Runnable)** 传进去的 Runnable 操作，在传到 HandlerActionQueue 里会先经过 HandlerAction 包装一下，然后再缓存起来。至于缓存的原理，HandlerActionQueue 是通过一个默认大小为4的数组保存这些 Runnable 操作的，当然，如果数组不够用时，就会通过 GrowingArrayUtils 来扩充数组，具体算法就不继续看下去了，不然越来越偏。  

**到这里，我们先来梳理下:**  

当我们在 Activity 的 onCreate() 里执行 **View.post(Runnable)** 时，因为这时候 View 还没有 **attachedToWindow**，所以这些 Runnable 操作其实并没有被执行，而是先通过 HandlerActionQueue 缓存起来。  

那么到什么时候这些 Runnable 才会被执行呢？我们可以看看 HandlerActionQueue 这个类，它的代码不多，里面有个 **executeActions()** 方法，看命名就知道，这方法是用来执行这些被缓存起来的 Runnable 操作的：  

![executeActions.png](http://upload-images.jianshu.io/upload_images/1924341-0ee2916520c4c600.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

哇，看到重量级的人物了：**Handler**。看来被缓存起来没有执行的 Runnable 最后也还是通过 Hnadler 来执行的。那么，这个 Handler 又是哪里的呢？看来关键点还是这个方法在哪里被调用了，那就找找看：   

![查找调用executeActions的地方.png](http://upload-images.jianshu.io/upload_images/1924341-08af749ee07212dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

借助 AS 的 `Ctrl + Alt + F7` 快捷键，可以查找 SDK 里的某个方法在哪些地方被调用了。  

![mRunQueue.executeActions.png](http://upload-images.jianshu.io/upload_images/1924341-d300abbebda51577.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

很好，找到了，而且只找到这个地方。其实，这个快捷键有时并没有办法找到一些方法被调用的地方，这也是源码阅读过程中令人头疼的一点，因为没法找到这些方法到底在哪些地方被调用了，所以很难把流程梳理下来。如果方法是私有的，那很好办，就用 `Ctrl + F` 在这个类里找一下就可以，如果匹配结果太多，那就像开头那样把过滤条件详细一点。如果方法不是私有的，那真的就很难办了，这也是一开始找到 **dispatchAttachedToWindow()** 后为什么不继续跟踪下去转而来分析Q2：**getRunQueue()** 的原因，因为用 AS 找不到 **dispatchAttachedToWindow()** 到底在哪些地方被谁调用了。哇，好像又扯远了，回归正题回归正题。  

emmm，看来这里也绕回来了，**dispatchAttachedToWindow()** 看来是个关键的节点。  

**那到这里，我们再次来梳理一下：**  

我们使用 **View.post()** 时，其实内部它自己分了两种情况处理，当 View 还没有 **attachedToWindow** 时，通过 **View.post(Runnable)** 传进来的 Runnable 操作都先被缓存在 HandlerActionQueue，然后等 View 的 **dispatchAttachedToWindow()** 被调用时，就通过 **mAttachInfo.mHandler** 来执行这些被缓存起来的 Runnable 操作。从这以后到 View 被 **detachedFromWindow** 这段期间，如果再次调用 **View.post(Runnable)** 的话，那么这些 Runnable 不用再缓存了，而是直接交给 **mAttachInfo.mHanlder** 来执行。  

以上，就是到目前我们所能得知的信息。这样一来，Q2 是不是渐渐有一些头绪了：**View.post(Runnable)** 的操作之所以可以保证肯定是在 View 宽高计算完毕之后才执行的，是因为这些 Runnable 操作只有在 View 的 **attachedToWindow** 到 **detachedFromWiondow** 这期间才会被执行。  

那么，接下去就还剩两个关键点需要搞清楚了:   

1. **dispatchAttachedToWindow() 是什么时候被调用的？** 
1. **mAttachInfo 是在哪里初始化的？**  

## dispatchAttachedToWindow() & mAttachInfo

只借助 AS 的话，很难找到 **dispatchAttachedToWindow()** 到底在哪些地方被调用。所以，到这里，我又借助了 Source Insight 软件。   
![sourceInsight查找dispatchAttachedToWindow.png](http://upload-images.jianshu.io/upload_images/1924341-65607c3ffd68e29d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

很棒！找到了四个被调用的地方，三个在 ViewGroup 里，一个在 ViewRootImpl.performTraversals() 里。找到了就好，接下去继续用 AS 来分析吧，Source Insight 用不习惯，不过分析源码时确实可以结合这两个软件。    

![ViewRootImpl.performTraversals.png](http://upload-images.jianshu.io/upload_images/1924341-c82e3b6e1f6612a1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

哇，懵逼，完全懵逼。我就想看个 **View.post()**，结果跟着跟着，跟到这里来了。ViewRootImpl 我在分析[Android KeyEvent 点击事件分发处理流程](http://www.jianshu.com/p/2f28386706a0)时短暂接触过，但这次显然比上次还需要更深入去接触，哎，力不从心啊。  

我只能跟大伙肯定的是，mView 是 Activity 的 DecorView。咦~，等等，这样看来 ViewRootImpl 是调用的 DecorView 的 **dispatchAttachedToWindow()** ，但我们在使用 **View.post()** 时，这个 View 可以是任意 View，并不是非得用 DecorView 吧。哈哈哈，这是不是代表着我们找错地方了？不管了，我们就去其他三个被调用的地方： ViewGroup 里看看吧：   

![ViewGroup.addViewInner.png](http://upload-images.jianshu.io/upload_images/1924341-3395ff17de45f570.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

addViewInner() 是 ViewGroup 在添加子 View 时的内部逻辑，也就是说当 ViewGroup addView() 时，如果 mAttachInfo 不为空，就都会去调用子 View 的 dispatchAttachedToWindow()，并将自己的 mAttachInfo 传进去。还记得 View 的 dispatchAttachedToWindow() 这个方法么：  

![View.dispatachAttachedToWindow.png](http://upload-images.jianshu.io/upload_images/1924341-8718cc9b8c7877b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

mAttachInfo 唯一被赋值的地方也就是在这里，那么也就是说，子 View 的 mAttachInfo 其实跟父控件 ViewGroup 里的 mAttachInfo 是同一个的。那么，关键点还是这个 **mAttachInfo** 什么时候才不为空，也就是说 **ViewGroup 在 addViewInner() 时，传进去的 mAttachInfo 是在哪被赋值的呢**？我们来找找看：  

![查找ViewGroup的mAttachInfo.png](http://upload-images.jianshu.io/upload_images/1924341-8a4ca5fd32da1b1c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

咦，利用 AS 的 `Ctrl + 左键` 怎么找不到 mAttachInfo 被定义的地方呢，不管了，那我们用 `Ctrl + F` 搜索一下在 ViewGroup 类里 mAttachInfo 被赋值的地方好了：  

![ViewGroup里查找mAttachInfo被赋值的地方.png](http://upload-images.jianshu.io/upload_images/1924341-0320935717cf131c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

咦，怎么一个地方也没有。难道说，这个 mAttachInfo 是父类 View 定义的变量么，既然 AS 找不到，我们换 Source Insight 试试：  

![用SourceInsight查找mAttachInfo.png](http://upload-images.jianshu.io/upload_images/1924341-3e3b441afb817714.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![View.mAttachInfo.png](http://upload-images.jianshu.io/upload_images/1924341-8d5d5a95c882ba6f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

还真的是，ViewGroup 是继承的 View，并且处于同一个包里，所以可以直接使用该变量，那这样一来，我们岂不是又绕回来了。前面说过，**dispatchAttachedToWindow()** 在 ViewGroup 里有三处调用的地方，既然 addViewInner() 这里的看不出什么，那去另外两个地方看看：  

![ViewGroup.dispatchAttachedToWindow.png](http://upload-images.jianshu.io/upload_images/1924341-d55e4478f13c55e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

剩下的两个地方就都是在 ViewGroup 重写的 dispatchAttachedToWindow() 方法里了，这代码也很好理解，在该方法被调用的时候，先执行 super 也就是 View 的 dispatchAttachedToWindow() 方法，还没忘记吧，mAttachInfo 就是在这里被赋值的。然后再遍历子 View，分别调用子 View 的 dispatchAttachedToWindow() 方法，并将 mAttachInfo 作为参数传递进去，这样一来，子 View 的 mAttachInfo 也都被赋值了。  

但这样一来，我们就绕进死胡同了。  

**我们还是先来梳理一下吧：**  

目前，我们知道，**View.post(Runnable)** 的这些 Runnable 操作，在 View 被 **attachedToWindow** 之前会先缓存下来，然后在 **dispatchAttachedToWindow()** 被调用时，就将这些缓存下来的 Runnable 通过 **mAttachInfo** 的 mHandler 来执行。在这之后再调用 **View.post(Runnable)** 的话，这些 Runnable 操作就不用再被缓存了，而是直接交由 mAttachInfo 的 mHandler 来执行。  

所以，我们得搞清楚 **dispatchAttachedToWindow()** 在什么时候被调用，以及 **mAttachInfo** 是在哪被初始化的，因为需要知道它的变量如 mHandler 都是些什么以及验证 mHandler 执行这些 Runnable 操作是在 measure 之后的，这样才能保证此时的宽高不为0。  

然后，我们在跟踪 **dispatchAttachedToWindow()** 被调用的地方时，跟到了 ViewGroup 的 addViewInner() 里。在这里我们得到的信息是如果 **mAttachInfo** 不为空时，会直接调用子 View 的 **dispatchAttachedToWindow()**，这样新 add 进来的子 View 的 **mAttachInfo** 就会被赋值了。但 ViewGroup 的 **mAttachInfo** 是父类 View 的变量，所以为不为空的关键还是回到了 **dispatchAttachedToWindow()** 被调用的时机。  

我们还跟到了 ViewGroup 重写的 **dispatchAttachedToWindow()** 方法里，但显然，ViewGroup 重写这个方法只是为了将 attachedToWindow 这个事件通知给它所有的子 View。  

所以，最后，我们能得到的结论就是，我们还得再回去 ViewRootImpl 里，**dispatchAttachedToWindow()** 被调用的地方，除了 ViewRootImpl，我们都分析过了，得不到什么信息，只剩最后 ViewRootImpl 这里了，所以关键点肯定在这里。看来这次，不行也得上了。  

## ViewRootImpl.performTraversals()

![ViewRootImpl.performTraversals.png](http://upload-images.jianshu.io/upload_images/1924341-2b17524b6dfa389b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 

这方法代码有八百多行！！不过，我们只关注我们需要的点就行，这样一省略无关代码来看，是不是感觉代码就简单得多了。  

mFirst 初始化为 true，全文只有一处赋值，所以 if(mFirst) 块里的代码只会执行一次。我对 ViewRootImpl 不是很懂，performTraversals() 这个方法应该是通知 Activity 的 View 树开始测量、布局、绘制。而 DevorView 是 Activity 视图的根布局、View 树的起点，它继承 FrameLayout，所以也是个 ViewGroup，而我们之前对 ViewGroup 的 **dispatchAttachedToWindow()** 分析过了吧，在这个方法里会将 mAttachInfo 传给所有子 View。也就是说，在 Activity 首次进行 View 树的遍历绘制时，ViewRootImpl 会将自己的 **mAttachInfo** 通过根布局 DecorView 传递给所有的子 View 。  

那么，我们就来看看 ViewRootImpl 的 **mAttachInfo** 什么时候初始化的吧：  

![ViewRootImpl构造函数.png](http://upload-images.jianshu.io/upload_images/1924341-e658c8824fe873e6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在构造函数里对 mAttachInfo 进行初始化，传入了很多参数，我们关注的应该是 mHandler 这个变量，所以看看这个变量定义：  

![mHandler.png](http://upload-images.jianshu.io/upload_images/1924341-53c74d20d7d8f735.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

终于找到 **new Handler()** 的地方了，至于这个自定义的 Handler 类做了啥，我们不关心，反正通过 post() 方式执行的操作跟它自定义的东西也没有多大关系。我们关心的是在哪 new 了这个 Handler。**因为每个 Handler 在 new 的时候都会绑定一个 Looper，这里 new 的时候是无参构造函数，那默认绑定的就是当前线程的 Looper，而这句 new 代码是在主线程中执行的，所以这个 Handler 绑定的也就是主线程的 Looper**。至于这些的原理，就涉及到 Handler 的源码和 ThreadLocal 的原理了，就不继续跟进了，太偏了，大伙清楚结论这点就好。    

**这也就是为什么 View.post(Runnable) 的操作可以更新 UI 的原因，因为这些 Runnable 操作都通过 ViewRootImpl 的 mHandler 切到主线程来执行了。**  

这样 Q1 就搞定了，终于搞定了一个问题，不容易啊，本来以为很简单的来着。  

跟到 ViewRootImpl 这里应该就可以停住了。至于 ViewRootImpl 跟 Activity 有什么关系、什么时候被实例化的、跟 DecroView 如何绑定的就不跟进了，因为我也还不是很懂，感兴趣的可以自己去看看，我在末尾会给一些参考博客。  

至此，我们清楚了 **mAttachInfo** 的由来，也知道了 **mAttachInfo.mHandler**，还知道在 Activity 首次遍历 View 树进行测量、绘制时会通过 DecorView 的 **dispatchAttachedToWindow()** 将 ViewRootImpl 的 **mAttachInfo** 传递给所有子 View，并通知所有调用 **View.post(Runnable)** 被缓存起来的 Runnable 操作可以执行了。  

但不知道大伙会不会跟我一样还有一点疑问：**看网上对 ViewRootImpl.performTraversals() 的分析：遍历 View 树进行测量、布局、绘制操作的代码显然是在调用了 dispatchAttachedToWindow() 之后才执行，那这样一来是如何保证 View.post(Runnable) 的 Runnable 操作可以获取到 View 的宽高呢？明明测量的代码 performMeasure() 是在 dispatchAttachedToWindow() 后面才执行。**  

![performTraversals.png](http://upload-images.jianshu.io/upload_images/1924341-155a2652da011069.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我在这里卡了很久，一直没想明白。我甚至以为是 PhoneWindow 在加载 layout 布局到 DecorView 时就进行了测量的操作，所以一直跟，跟到 LayoutInflater.inflate()，跟到了 ViewGroup.addView()，最后发现跟测量有关的操作最终都又绕回到 ViewRootImpl 中去了。  

最后，感谢[通过View.post()获取View的宽高引发的两个问题](http://blog.csdn.net/scnuxisan225/article/details/49815269)这篇博客的作者，解答了我的疑问。  

原来是自己火候不够，对 Android 的消息机制还不大理解，这篇博客前前后后写了一两个礼拜，就是在不断查缺补漏，学习、理解相关的知识点。  

大概的来讲，就是我们的 app 都是基于消息驱动机制来运行的，主线程的 Looper 会无限的循环，不断的从 MessageQueue 里取出 Message 来执行，当一个 Message 执行完后才会去取下一个 Message 来执行。而 Handler 则是用于将 Message 发送到 MessageQueue 里，等轮到 Message 执行时，又通过 Handler 发送到 Target 去执行，等执行完再取下一个 Message，如此循环下去。  

**清楚了这点后，我们再回过头来看看：**  

performTraversals() 会先执行 dispatchAttachedToWindow()，这时候所有子 View 通过 **View.post(Runnable)** 缓存起来的 Runnable 操作就都会通过 mAttachInfo.mHandler 的 post() 方法将这些 Runnable 封装到 Message 里发送到 MessageQueue 里。mHandler 我们上面也分析过了，绑定的是主线程的 Looper，所以这些 Runnable 其实都是发送到主线程的 MessageQueue 里排队，等待执行。然后 performTraversals() 继续往下工作，相继执行 performMeasure()，performLayout() 等操作。等全部执行完后，表示这个 Message 已经处理完毕，所以 Looper 才会去取下一个 Message，这时候，才有可能轮到这些 Runnable 执行。所以，这些 Runnable 操作也就肯定会在 performMeasure() 操作之后才执行，宽高也就可以获取到了。画张图，帮助理解一下：  

![Handler消息机制.png](http://upload-images.jianshu.io/upload_images/1924341-143abd8e262ac64f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  

哇，Q2的问题终于也搞定了，也不容易啊。本篇也算是结束了。  

# 总结  
分析了半天，最后我们来稍微小结一下：  

1. **View.post(Runnable) 内部会自动分两种情况处理，当 View 还没 attachedToWindow 时，会先将这些 Runnable 操作缓存下来；否则就直接通过 mAttachInfo.mHandler 将这些 Runnable 操作 post 到主线程的 MessageQueue 中等待执行。**  

1. **如果 View.post(Runnable) 的 Runnable 操作被缓存下来了，那么这些操作将会在 dispatchAttachedToWindow() 被回调时，通过 mAttachInfo.mHandler.post() 发送到主线程的 MessageQueue 中等待执行。**  

1. **mAttachInfo 是 ViewRootImpl 的成员变量，在构造函数中初始化，Activity View 树里所有的子 View 中的 mAttachInfo 都是 ViewRootImpl.mAttachInfo 的引用。**  

1. **mAttachInfo.mHandler 也是 ViewRootImpl 中的成员变量，在声明时就初始化了，所以这个 mHandler 绑定的是主线程的 Looper，所以 View.post() 的操作都会发送到主线程中执行，那么也就支持 UI 操作了。**  

1. **dispatchAttachedToWindow() 被调用的时机是在 ViewRootImol 的 performTraversals() 中，该方法会进行 View 树的测量、布局、绘制三大流程的操作。**  

1. **Handler 消息机制通常情况下是一个 Message 执行完后才去取下一个 Message 来执行（异步 Message 还没接触），所以 View.post(Runnable) 中的 Runnable 操作肯定会在 performMeaure() 之后才执行，所以此时可以获取到 View 的宽高。**  

好了，就到这里了。至于开头所提的问题，前两个已经在上面的分析过程以及总结里都解答了。而至于剩下的问题，这里就稍微提一下：  

使用 **View.post()**，还是有可能会造成内存泄漏的，Handler 会造成内存泄漏的原因是由于内部类持有外部的引用，如果任务是延迟的，就会造成外部类无法被回收。而根据我们的分析，mAttachInfo.mHandler 只是 ViewRootImpl 一个内部类的实例，所以使用不当还是有可能会造成内存泄漏的。  

# 参考链接  
虽然只是过一下 View.post() 的源码，但真正过下去才发现，要理解清楚，还得理解 Handler 的消息机制、ViewRootImpl 的作用、ViewRootImpl 和 Activity 的关系，何时绑定等等。所以，需要学的还好多，也感谢各个前辈大神费心整理的博客，下面列一些供大伙参考：  

1. [scnuxisan225#通过View.post()获取View的宽高引发的两个问题](http://blog.csdn.net/scnuxisan225/article/details/49815269)  

1. [kc专栏#Activity WMS ViewRootImpl三者关系](http://blog.csdn.net/kc58236582/article/details/52088224)  

1. [废墟的树#从ViewRootImpl类分析View绘制的流程](http://blog.csdn.net/feiduclear_up/article/details/46772477)  

1. [凶残的程序员#Android 消息机制——你真的了解Handler？](http://blog.csdn.net/qian520ao/article/details/78262289?locationNum=2&fps=1)





   
  
















