import{_ as d,r as l,o as r,c,a as i,b as e,e as s,d as a}from"./app-2pyCoCP5.js";const v={},o=a('<p>这次就来梳理一下 Android 的屏幕刷新机制，把我这段时间因为研究动画而梳理出来的一些关于屏幕刷新方面的知识点分享出来，能力有限，有错的地方还望指点一下。另外，内容有点多，毕竟要讲清楚不容易，所以慢慢看哈。</p><h1 id="提问环节" tabindex="-1"><a class="header-anchor" href="#提问环节" aria-hidden="true">#</a> 提问环节</h1><p>阅读源码还是得带着问题或目的性的去阅读，这样阅读过程中比较有条理性，不会跟偏或太深入，所以，还是先来几个问题吧：</p><p>大伙都清楚，Android 每隔 16.6ms 会刷新一次屏幕。</p><p><strong>Q1：但是大伙想过没有，这个 16.6ms 刷新一次屏幕到底是什么意思呢？是指每隔 16.6ms 调用 onDraw() 绘制一次么？</strong></p><p><strong>Q2：如果界面一直保持没变的话，那么还会每隔 16.6ms 刷新一次屏幕么？</strong></p><p><strong>Q3：界面的显示其实就是一个 Activity 的 View 树里所有的 View 都进行测量、布局、绘制操作之后的结果呈现，那么如果这部分工作都完成后，屏幕会马上就刷新么？</strong></p><p><strong>Q4：网上都说避免丢帧的方法之一是保证每次绘制界面的操作要在 16.6ms 内完成，但如果这个 16.6ms 是一个固定的频率的话，请求绘制的操作在代码里被调用的时机是不确定的啊，那么如果某次用户点击屏幕导致的界面刷新操作是在某一个 16.6ms 帧快结束的时候，那么即使这次绘制操作小于 16.6 ms，按道理不也会造成丢帧么？这又该如何理解？</strong></p><p><strong>Q5：大伙都清楚，主线程耗时的操作会导致丢帧，但是耗时的操作为什么会导致丢帧？它是如何导致丢帧发生的？</strong></p><p>本篇主要就是搞清楚这几个问题，分析的源码基本只涉及 <strong>ViewRootImpl</strong> 和 <strong>Choreographer</strong> 这两个类。</p><h1 id="源码分析" tabindex="-1"><a class="header-anchor" href="#源码分析" aria-hidden="true">#</a> 源码分析</h1><p>ps:本篇分析的源码均是 android-25 版本，版本不一样，源码可能会有些许差异，大伙过的时候注意一下。</p><h2 id="基本概念" tabindex="-1"><a class="header-anchor" href="#基本概念" aria-hidden="true">#</a> 基本概念</h2>',13),t={href:"http://blog.csdn.net/litefish/article/details/53939882",target:"_blank",rel:"noopener noreferrer"},u=a('<blockquote><p>在一个典型的显示系统中，一般包括CPU、GPU、display三个部分， CPU负责计算数据，把计算好数据交给GPU,GPU会对图形数据进行渲染，渲染好后放到buffer里存起来，然后display（有的文章也叫屏幕或者显示器）负责把buffer里的数据呈现到屏幕上。</p><p>显示过程，简单的说就是CPU/GPU准备好数据，存入buffer，display每隔一段时间去buffer里取数据，然后显示出来。display读取的频率是固定的，比如每个16ms读一次，但是CPU/GPU写数据是完全无规律的。</p></blockquote><p>上述内容概括一下，大体意思就是说，屏幕的刷新包括三个步骤：<strong>CPU 计算屏幕数据、GPU 进一步处理和缓存、最后 display 再将缓存中（buffer）的屏幕数据显示出来。</strong></p><p>（ps:开发过程中应该接触不到 GPU、display 这些层面的东西，所以我把这部分工作都称作底层的工作了，下文出现的底层指的就是除了 CPU 计算屏幕数据之外的工作。）</p><p>对于 Android 而言，第一个步骤：<strong>CPU 计算屏幕数据</strong>指的也就是 View 树的绘制过程，也就是 Activity 对应的视图树从根布局 DecorView 开始层层遍历每个 View，分别执行测量、布局、绘制三个操作的过程。</p><p>也就是说，我们常说的 Android 每隔 16.6ms 刷新一次屏幕其实是指：<strong>底层以固定的频率，比如每 16.6ms 将 buffer 里的屏幕数据显示出来。</strong></p><p>如果还不清楚，那再看一张网上很常见的图（摘自上面同一篇文章）：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-d8ebbbd67051dd6b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="image.png"></p><p>结合这张图，再来讲讲 16.6 ms 屏幕刷新一次的意思。</p><p>Display 这一行可以理解成屏幕，所以可以看到，底层是以固定的频率发出 VSync 信号的，而这个固定频率就是我们常说的每 16.6ms 发送一个 VSync 信号，至于什么叫 VSync 信号，我们可以不用深入去了解，只要清楚这个信号就是屏幕刷新的信号就可以了。</p><p>继续看图，Display 黄色的这一行里有一些数字：<code>0, 1, 2, 3, 4</code>，可以看到每次屏幕刷新信号到了的时候，数字就会变化，所以这些数字其实可以理解成每一帧屏幕显示的画面。也就是说，屏幕每一帧的画面可以持续 16.6ms，当过了 16.6ms，底层就会发出一个屏幕刷新信号，而屏幕就会去显示下一帧的画面。</p><p>以上都是一些基本概念，也都是底层的工作，我们了解一下就可以了。接下去就还是看这图，然后讲讲我们 app 层该干的事了：</p><p>继续看图，CPU 蓝色的这行，上面也说过了，CPU 这块的耗时其实就是我们 app 绘制当前 View 树的时间，而这段时间就跟我们自己写的代码有关系了，如果你的布局很复杂，层次嵌套很多，每一帧内需要刷新的 View 又很多时，那么每一帧的绘制耗时自然就会多一点。</p><p>继续看图，CPU 蓝色这行里也有一些数字，其实这些数字跟 Display 黄色的那一行里的数字是对应的，在 Display 里我们解释过这些数字表示的是每一帧的画面，那么在 CPU 这一行里，其实就是在计算对应帧的画面数据，也叫屏幕数据。也就是说，在当前帧内，CPU 是在计算下一帧的屏幕画面数据，当屏幕刷新信号到的时候，屏幕就去将 CPU 计算的屏幕画面数据显示出来；同时 CPU 也接收到屏幕刷新信号，所以也开始去计算下一帧的屏幕画面数据。</p><p>CPU 跟 Display 是不同的硬件，它们是可以并行工作的。要理解的一点是，我们写的代码，只是控制让 CPU 在接收到屏幕刷新信号的时候开始去计算下一帧的画面工作。而底层在每一次屏幕刷新信号来的时候都会去切换这一帧的画面，这点我们是控制不了的，是底层的工作机制。之所以要讲这点，是因为，当我们的 app 界面没有必要再刷新时（比如用户不操作了，当前界面也没动画），这个时候，我们 app 是接收不到屏幕刷新信号的，所以也就不会让 CPU 去计算下一帧画面数据，但是底层仍然会以固定的频率来切换每一帧的画面，只是它后面切换的每一帧画面都一样，所以给我们的感觉就是屏幕没刷新。</p><p>所以，我觉得上面那张图还可以再继续延深几帧的长度，这样就更容易理解了：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-f3938ff87259b9ff.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="屏幕刷新机制.png"></p><p>我在那张图的基础上延长了几帧，我想这样应该可以更容易理解点。</p><p>看我画的这张图，前三帧跟原图一样，从第三帧之后，因为我们的 app 界面不需要刷新了（用户不操作了，界面也没有动画），那么这之后我们 app 就不会再接收到屏幕刷新信号了，所以也就不会再让 CPU 去绘制视图树来计算下一帧画面了。<strong>但是</strong>，底层还是会每隔 16.6ms 发出一个屏幕刷新信号，只是我们 app 不会接收到而已，Display 还是会在每一个屏幕刷新信号到的时候去显示下一帧画面，只是下一帧画面一直是第4帧的内容而已。</p><p>好了，到这里 Q1，Q2，Q3 都可以先回答一半了，<strong>那么我们就先稍微来梳理一下</strong>：</p><ol><li><p><strong>我们常说的 Android 每隔 16.6 ms 刷新一次屏幕其实是指底层会以这个固定频率来切换每一帧的画面。</strong></p></li><li><p><strong>这个每一帧的画面也就是我们的 app 绘制视图树（View 树）计算而来的，这个工作是交由 CPU 处理，耗时的长短取决于我们写的代码：布局复不复杂，层次深不深，同一帧内刷新的 View 的数量多不多。</strong></p></li><li><p><strong>CPU 绘制视图树来计算下一帧画面数据的工作是在屏幕刷新信号来的时候才开始工作的，而当这个工作处理完毕后，也就是下一帧的画面数据已经全部计算完毕，也不会马上显示到屏幕上，而是会等下一个屏幕刷新信号来的时候再交由底层将计算完毕的屏幕画面数据显示出来。</strong></p></li><li><p><strong>当我们的 app 界面不需要刷新时（用户无操作，界面无动画），app 就接收不到屏幕刷新信号所以也就不会让 CPU 再去绘制视图树计算画面数据工作，但是底层仍然会每隔 16.6 ms 切换下一帧的画面，只是这个下一帧画面一直是相同的内容。</strong></p></li></ol><p>这部分虽然说是一些基本概念，但其实也包含了一些结论了，所以可能大伙看着会有些困惑：**为什么界面不刷新时 app 就接收不到屏幕刷新信号了？为什么绘制视图树计算下一帧画面的工作会是在屏幕刷新信号来的时候才开始的？**等等。</p><p>emmm，有这些困惑很棒，这样，我们下面一起过源码时，大伙就更有目的性了，这样过源码我觉得效率是比较高一点的。继续看下去，跟着过完源码，你就清楚为什么了。好了，那我们下面就开始过源码了。</p><h2 id="viewrootimpl-与-decorview-的绑定" tabindex="-1"><a class="header-anchor" href="#viewrootimpl-与-decorview-的绑定" aria-hidden="true">#</a> ViewRootImpl 与 DecorView 的绑定</h2><p>阅读源码从哪开始看起一直都是个头疼的问题，所以找一个合适的切入点来跟的话，整个梳理的过程可能会顺畅一点。本篇是研究屏幕的刷新，那么建议就是从某个会导致屏幕刷新的方法入手，比如 <code>View#invalidate()</code>。</p>',22),m=i("code",null,"View#invalidate()",-1),p={href:"https://www.jianshu.com/p/48317612c164",target:"_blank",rel:"noopener noreferrer"},b=i("code",null,"View#invalidate()",-1),g=a(`<p>想再过一遍的可以再去看看，我们这里就直接说结论了。我们跟着 <code>invalidate()</code> 一步步往下走的时候，发现最后跟到了 <code>ViewRootImpl#scheduleTraversals()</code> 就停止了。而 ViewRootImpl 就是今天我们要介绍的重点对象了。</p><p>大伙都清楚，Android 设备呈现到界面上的大多数情况下都是一个 Activity，真正承载视图的是一个 Window，每个 Window 都有一个 DecorView，我们调用 <code>setContentView()</code> 其实是将我们自己写的布局文件添加到以 DecorView 为根布局的一个 ViewGroup 里，构成一颗 View 树。</p><p>这些大伙都清楚，每个 Activity 对应一颗以 DecorView 为根布局的 View 树，但其实 DecorView 还有 mParent，而且就是 ViewRootImpl，而且每个界面上的 View 的刷新，绘制，点击事件的分发其实都是由 ViewRootImpl 作为发起者的，由 ViewRootImpl 控制这些操作从 DecorView 开始遍历 View 树去分发处理。</p><p>在上一篇动画分析的博客里，分析 <code>View#invalidate()</code> 时，也可以看到内部其实是有一个 do{}while() 循环来不断寻找 mParent，所以最终才会走到 ViewRootImpl 里去，那么可能大伙就会疑问了，<strong>为什么 DecorView 的 mParent 会是 ViewRootImpl 呢？换个问法也就是，在什么时候将 DevorView 和 ViewRootImpl 绑定起来？</strong></p><p>Activity 的启动是在 ActivityThread 里完成的，<code>handleLaunchActivity()</code> 会依次间接的执行到 Activity 的 <code>onCreate()</code>, <code>onStart()</code>, <code>onResume()</code>。在执行完这些后 ActivityThread 会调用 <code>WindowManager#addView()</code>，而这个 <code>addView()</code> 最终其实是调用了 WindowManagerGlobal 的 <code>addView()</code> 方法，我们就从这里开始看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//WindowManagerGlobal#addView
public void addView(View view, ViewGroup.LayoutParams params, Display display, Window parentWindow) {
    ...

    ViewRootImpl root;
    ...

    synchronized (mLock) {
        ...
        //1. 实例化一个 ViewRootImpl对象
        root = new ViewRootImpl(view.getContext(), display);
        ...

        mViews.add(view);
        mRoots.add(root);
        ...
    }

    try {
        //2. 调用ViewRootImpl的setView()，并将DecorView作为参数传递进去
        root.setView(view, wparams, panelParentView);
    }...  
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>WindowManager 维护着所有 Activity 的 DecorView 和 ViewRootImpl。这里初始化了一个 ViewRootImpl，然后调用了它的 <code>setView()</code> 方法，将 DevorView 作为参数传递了进去。所以看看 ViewRootImpl 中的 <code>setView()</code> 做了什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#setView
public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView) {
    synchronized (this) {
        if (mView == null) {
            //1. view 是 DecorView
            mView = view;

            ...
            //2.发起布局请求
            requestLayout();
            ...
            //3.将当前ViewRootImpl对象this,作为参数调用了DecorView的assignParent
            view.assignParent(this);
            ...
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>setView()</code> 方法里调用了 DecorView 的 <code>assignParent()</code> 方法，所以去看看 View 的这个方法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#assignParent
void assignParent(ViewParent parent) {
    if (mParent == null) {
        mParent = null;
    } else if (parent == null) {
        mParent = null;
    } else {
        throw new RunTimeException(&quot;view &quot; + this + &quot; is already has a parent&quot;)
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参数是 ViewParent，而 ViewRootImpl 是实现了 ViewParent 接口的，所以在这里就将 DecorView 和 ViewRootImpl 绑定起来了。每个Activity 的根布局都是 DecorView，而 DecorView 的 parent 又是 ViewRootImpl，所以在子 View 里执行 <code>invalidate()</code> 之类的操作，循环找 parent 时，最后都会走到 ViewRootImpl 里来。</p><p>跟界面刷新相关的方法里应该都会有一个循环找 parent 的方法，或者是不断调用 parent 的方法，这样最终才都会走到 ViewRootImpl 里，也就是说实际上 View 的刷新都是由 ViewRootImpl 来控制的。</p><p>即使是界面上一个小小的 View 发起了重绘请求时，都要层层走到 ViewRootImpl，由它来发起重绘请求，然后再由它来开始遍历 View 树，一直遍历到这个需要重绘的 View 再调用它的 <code>onDraw()</code> 方法进行绘制。</p><p>我们重新看回 ViewRootImpl 的 <code>setView()</code> 这个方法，这个方法里还调用了一个 <code>requestLayout()</code> 方法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#requestLayout
@Override
public void requestLayout() {
    if (!mHandingLayoutInLayoutRequest) {
        //1.检查该操作是否是在主线程中执行
        checkThread();
        mLayoutRequested = true;
        //2.安排一次遍历绘制View树的任务
        scheduleTraversals();
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里调用了一个 <code>scheduleTraversals()</code>，还记得当 View 发起重绘操作 <code>invalidate()</code> 时，最后也调用了 <code>scheduleTraversals()</code> 这个方法么。其实这个方法就是屏幕刷新的关键，它是安排一次绘制 View 树的任务等待执行，具体后面再说。</p><p>也就是说，<strong>其实打开一个 Activity，当它的 onCreate---onResume 生命周期都走完后，才将它的 DecoView 与新建的一个 ViewRootImpl 对象绑定起来，同时开始安排一次遍历 View 任务也就是绘制 View 树的操作等待执行，然后将 DecoView 的 parent 设置成 ViewRootImpl 对象</strong>。</p><p>这也就是为什么在 <code>onCreate---onResume</code> 里获取不到 View 宽高的原因，因为在这个时刻 ViewRootImpl 甚至都还没创建，更不用说是否已经执行过测量操作了。</p><p>还可以得到一点信息是，一个 Activity 界面的绘制，其实是在 <code>onResume()</code> 之后才开始的。</p><h2 id="viewrootimpl-scheduletraversals" tabindex="-1"><a class="header-anchor" href="#viewrootimpl-scheduletraversals" aria-hidden="true">#</a> ViewRootImpl#scheduleTraversals</h2><p>到这里，我们梳理清楚了，调用一个 View 的 <code>invalidate()</code> 请求重绘操作，内部原来是要层层通知到 ViewRootImpl 的 <code>scheduleTraversals()</code> 里去。而且打开一个新的 Activity，它的界面绘制原来是在 <code>onResume()</code> 之后也层层通知到 ViewRootImpl 的 <code>scheduleTraversals()</code> 里去。虽然其他关于 View 的刷新操作，比如 <code>requestLayout()</code> 等等之类的方法我们还没有去看，但我们已经可以大胆猜测，这些跟 View 刷新有关的操作最终也都会层层走到 ViewRootImpl 中的 <code>scheduleTraversals()</code> 方法里去的。</p><p>那么这个方法究竟干了些什么，我们就要好好来分析了：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#scheduleTraversals
void scheduleTraversals() {
    if (!mTraversalScheduled) {
        mTraversalScheduled = true;
        mTraversalBarrier = mHandler.getLooper().getQueue().postSyncBarrier();
        mChoreographer.postCallback(
            Choreograhper.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
        ...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>mTraversalScheduled 这个 boolean 变量的作用等会再来看，先看看 <code>mChoreographer.postCallback()</code> 这个方法，传入了三个参数，第二个参数是一个 Runnable 对象，先来看看这个 Runnable：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl$TraversalRunnable
final class TraversalRunnable implements Runnable {
    @Override
    public void run() {
        doTraversal();
    }
}
//ViewRootImpl成员变量
final TraversalRunnable mTraversalRunnable = new TraversalRunnable();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个 Runnable 做的事很简单，就调用了一个方法，<code>doTraversal()</code>:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#doTraversal
void doTraversal() {
    if (mTraversalScheduled) {
        mTraversalScheduled = false;
        mHandler.getLooper().getQueue().removeSyncBarrier(mTraversalBarrier);
        ...
        
        //1. 遍历绘制View树
        performTraversals();
        ...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看看这个方法做的事，跟 <code>scheduleTraversals()</code> 正好相反，一个将变量置成 true，这里置成 false，一个是 <code>postSyncBarrier()</code>，这里是 <code>removeSyncBarrier()</code>，具体作用等会再说，继续先看看 <code>performTraversals()</code>，这个方法也是屏幕刷新的关键：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#performTraversals
private void performTraversals() {
    //该方法实在太过复杂，所以将无关代码全部都省略掉，只留下关键代码和代码结构
    ...
    if (...) {
        ...
        if (...) {
            if (...) {
                ...
                //1.测量
                performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                ...

                layoutRequested = true;
            }
        }
    } ...

    final boolean didLayout = layoutRequested &amp;&amp; (!mStopped || mReportNextDraw);
    ...

    if (didLayout) {
        //2.布局
        performLayout(lp, mWidth, mHeight);
        ...
    }

    ...

    boolean cancelDraw = mAttachInfo.mTreeObserver.dispatchOnPreDraw() || !isViewVisible;

    if (!cancelDraw &amp;&amp; !newSurface) {
        ...
        //3.绘制
        performDraw();
    }...

    ...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>View 的测量、布局、绘制三大流程都是交由 ViewRootImpl 发起，而且还都是在 <code>performTraversals()</code> 方法中发起的，所以这个方法的逻辑很复杂，因为每次都需要根据相应状态判断是否需要三个流程都走，有时可能只需要执行 <code>performDraw()</code> 绘制流程，有时可能只执行 <code>performMeasure()</code> 测量和 <code>performLayout()</code> 布局流程（一般测量和布局流程是一起执行的）。不管哪个流程都会遍历一次 View 树，所以其实界面的绘制是需要遍历很多次的，如果页面层次太过复杂，每一帧需要刷新的 View 又很多时，耗时就会长一点。</p><p>当然，测量、布局、绘制这些流程在遍历时并不一定会把整颗 View 树都遍历一遍，ViewGroup 在传递这些流程时，还会再根据相应状态判断是否需要继续往下传递。</p><p><strong>了解了 <code>performTraversals()</code> 是刷新界面的源头后，接下去就需要了解下它是什么时候执行的，和 <code>scheduleTraversals()</code> 又是什么关系？</strong></p><p><code>performTraversals()</code> 是在 <code>doTraversal()</code> 中被调用的，而 <code>doTraversal()</code> 又被封装到一个 Runnable 里，那么关键就是这个 Runnable 什么时候被执行了？</p><h2 id="choreographer" tabindex="-1"><a class="header-anchor" href="#choreographer" aria-hidden="true">#</a> Choreographer</h2><p><code>scheduleTraversals()</code> 里调用了 Choreographer 的 <code>postCallback()</code> 将 Runnable 作为参数传了进去，所以跟进去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreograhper#postCallback
public void postCallback(int callbackType, Runnable action, Object token) {
    postCallbackDelayed(callbackType, action, token, 0);
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreograhper#postCallbackDelayed
pubic void postCallbackDelayed(int callbackType, Runnable action, Object token, long delayMillis) {
    ...  

    postCallbackDelayedInternal(callbackType, action, token, delayMillis);
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreograhper#postCallbackDelayedInternal
private void postCallbackDelayedInternal(int callbackType, Object action, Object token, long delayMillis) {
    ...

    synchronized (mLock) {
        //1.获取当前时间戳
        final long now = SystemClock.uptimeMillis();
        final long dueTime = now + delayMillis;
        //2.根据时间戳将Runnable任务添加到指定的队列中
        mCallbackQueues[callbackType].addCallbackLocked(dueTime, action, token);

        //3.因为postCallback默认传入delay = 0,所以代码会走进if里面
        if (dueTime &lt;= now) {
            scheduleFrameLocked(now);
        } else {...}
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为 <code>postCallback()</code> 调用 <code>postCallbackDelayed()</code> 时传了 delay = 0 进去，所以在 <code>postCallbackDelayedInternal()</code> 里面会先根据当前时间戳将这个 Runnable 保存到一个 mCallbackQueue 队列里，这个队列跟 MessageQueue 很相似，里面待执行的任务都是根据一个时间戳来排序。然后走了 <code>scheduleFrameLocked()</code> 方法这边，看看做了些什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreograhper#scheduleFrameLocked
private void scheduleFrameLocked(long now) {
    if (!mFrameScheduled) {
        mFrameScheduled = true;
        //1.系统4.0之后该变量默认为true,所以会走进if里
        if (USE_VSYNC) {
            ...
            
            if (isRunningOnLooperThreadLocked()) {
                scheduleVsyncLocked();
            } else {
                Message msg = mHandler.obtainMessage(MSG_DO_SCHEDULE_VSYNC);
                msg.setAsynchronous(true);
                mHandler.sendMessageAtFrontOfQueue(msg);
            }
        } ...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果代码走了 else 这边来发送一个消息，那么这个消息做的事肯定很重要，因为对这个 Message 设置了异步的标志而且用了<code>sendMessageAtFrontOfQueue()</code> 方法，这个方法是将这个 Message 直接放到 MessageQueue 队列里的头部，可以理解成设置了这个 Message 为最高优先级，那么先看看这个 Message 做了些什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreograhper$FrameHandler#handleMessage
private final class FrameHandler extends Handler {
    public FrameHandler(Looper looper) {
        super(looper);
    }

    @Override
    public void handleMessage(Message msg) {
        switch (msg.what) {
            ...
            case MSG_DO_SCHEDULE_VSYNC:
                doScheduleVsync();
                break;
            ...
        }
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreographer#doScheduleVsync
void doScheduleVsync() {
    synchronized (mLock) {
        if (mFrameScheduled) {
            scheduleVsyncLocked();
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以这个 Message 最后做的事就是 <code>scheduleVsyncLocked()</code>。我们回到 <code>scheduleFrameLocked()</code> 这个方法里，当走 if 里的代码时，直接调用了 <code>scheduleVsyncLocked()</code>，当走 else 里的代码时，发了一个最高优先级的 Message，这个 Message 也是执行 <code>scheduleVsyncLocked()</code>。既然两边最后调用的都是同一个方法，那么为什么这么做呢？</p><p>关键在于 if 条件里那个方法，我的理解那个方法是用来判断当前是否是在主线程的，我们知道主线程也是一直在执行着一个个的 Message，那么如果在主线程的话，直接调用这个方法，那么这个方法就可以直接被执行了，如果不是在主线程，那么 post 一个最高优先级的 Message 到主线程去，保证这个方法可以第一时间得到处理。</p><p>那么这个方法是干嘛的呢，为什么需要在最短时间内被执行呢，而且只能在主线程？</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreographer#scheduleVsyncLocked
private void scheduleVsyncLocked() {
    mDisplayEventReceiver.scheduleVsync();
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//DisplayEventReceiver#scheduleVsync
/**
 * Schedules a single vertical sync pulse to be delivered when the next
 * display frame begins.
 */
public void scheduleVsync() {
    if (mReceiverPtr == 0) {
        Log.w(TAG, &quot;Attempted to schedule a vertical sync pulse but the display event &quot; + &quot;receiver has already been disposed.&quot;);
    } else {
        nativeScheduleVsync(mReceiverPtr);
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用了 native 层的一个方法，那跟到这里就跟不下去了。</p><p>那到这里，我们先来梳理一下：</p><p><strong>到这里为止，我们知道一个 View 发起刷新的操作时，会层层通知到 ViewRootImpl 的 scheduleTraversals() 里去，然后这个方法会将遍历绘制 View 树的操作 performTraversals() 封装到 Runnable 里，传给 Choreographer，以当前的时间戳放进一个 mCallbackQueue 队列里，然后调用了 native 层的一个方法就跟不下去了。所以这个 Runnable 什么时候会被执行还不清楚。那么，下去的重点就是搞清楚它什么时候从队列里被拿出来执行了？</strong></p><p>接下去只能换种方式继续跟了，既然这个 Runnable 操作被放在一个 mCallbackQueue 队列里，那就从这个队列着手，看看这个队列的取操作在哪被执行了：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreographer$CallbackQueue
private final class CallbackQueue {
    private CallbackRecord mHead;

    ...
    //1.取操作
    public CallbackRecord extractDueCallbacksLocked(long now){...}  
    //2.入队列操作
    public void addCallbackLocked(long dueTime, Object action, Object token) {...}
    ...  
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreographer#doCallbacks
void doCallbacks(int callbackType, long frameTimeNanos) {
    CallbackRecord callbacks;
    synchronized(mLock) {
        ...

        //1.这个队列跟MessageQueue很相似，所以取的时候需要传入一个时间戳，因为队头的任务可能还没到设定的执行时间
        callback = mCallbackQueues[callbackType].extractDueCallbacksLocked(now / TimeUtils.NANOS_PER_MS);
        ...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreographer#doFrame
void doFrame(long frameTimeNanos, int frame) {
    ...
    
    try {
        ...
        //1.这个参数跟 ViewRootImpl调用mChoreographer.postCallback()时传进的第一个参数是一致的
        doCallbacks(Choreograhper.CALLBACK_TRAVERSAL, frameTimeNanos);
        ...
    }...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还记得我们说过在 ViewRootImpl 的 <code>scheduleTraversals()</code> 里会将遍历 View 树绘制的操作封装到 Runnable 里，然后调用 Choreographer 的 <code>postCallback()</code> 将这个 Runnable 放进队列里么，而当时调用 <code>postCallback()</code> 时传入了多个参数，这是因为 Choreographer 里有多个队列，而第一个参数 Choreographer.CALLBACK_TRAVERSAL 这个参数是用来区分队列的，可以理解成各个队列的 key 值。</p><p>那么这样一来，就找到关键的方法了：<code>doFrame()</code>，这个方法里会根据一个时间戳去队列里取任务出来执行，而这个任务就是 ViewRootImpl 封装起来的 <code>doTraversal()</code> 操作，而 <code>doTraversal()</code> 会去调用 <code>performTraversals()</code> 开始根据需要测量、布局、绘制整颗 View 树。所以剩下的问题就是 <code>doFrame()</code> 这个方法在哪里被调用了。</p><p>有几个调用的地方，但有个地方很关键：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreographer$FrameDisplayEventReceiver
private final class FrameDisplayEventReceiver extends DisplayEventReceiver implements Runnable {
    ...
    
    @Override
    public void onVsync(long timestampNanos, int builtInDisplayId, int frame) {
        ...

        //1.这个这里的this，该message做的事其实是下面的run()方法
        Message msg = Message.obtain(mHandler, this);
        msg.setAsynchronous(true);
        mHandler.sendMessageAtTime(msg, timestampNanos / TimeUtils.NANOS_PER_MS);
    }

    @Override
    public void run() {
        mHavePendingVsync = false;
        doFrame(mTimestampNanos, mFrame);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关键的地方来了，这个继承自 DisplayEventReceiver 的 FrameDisplayEventReceiver 类的作用很重要。跟进去看注释，我只能理解它是用来接收底层信号用的。但看了网上的解释后，所有的都理解过来了：</p><blockquote><p>FrameDisplayEventReceiver继承自DisplayEventReceiver接收底层的VSync信号开始处理UI过程。VSync信号由SurfaceFlinger实现并定时发送。FrameDisplayEventReceiver收到信号后，调用onVsync方法组织消息发送到主线程处理。这个消息主要内容就是run方法里面的doFrame了，这里mTimestampNanos是信号到来的时间参数。</p></blockquote><p>也就是说，<code>onVsync()</code> 是底层会回调的，可以理解成每隔 16.6ms 一个帧信号来的时候，底层就会回调这个方法，当然前提是我们得先注册，这样底层才能找到我们 app 并回调。当这个方法被回调时，内部发起了一个 Message，注意看代码对这个 Message 设置了 callback 为 this，Handler 在处理消息时会先查看 Message 是否有 callback，有则优先交由 Message 的 callback 处理消息，没有的话再去看看Handler 有没有 callback，如果也没有才会交由 <code>handleMessage()</code> 这个方法执行。</p><p>这里这么做的原因，我猜测可能 <code>onVsync()</code> 是由底层回调的，那么它就不是运行在我们 app 的主线程上，毕竟上层 app 对底层是隐藏的。但这个 <code>doFrame()</code> 是个 ui 操作，它需要在主线程中执行，所以才通过 Handler 切到主线程中。</p><p>还记得我们前面分析 <code>scheduleTraversals()</code> 方法时，最后跟到了一个 native 层方法就跟不下去了么，现在再回过来想想这个 native 层方法的作用是什么，应该就比较好猜测了。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//DisplayEventReceiver#scheduleVsync
/**
 * Schedules a single vertical sync pulse to be delivered when the next
 * display frame begins.
 */
public void scheduleVsync() {
    if (mReceiverPtr == 0) {
        Log.w(TAG, &quot;Attempted to schedule a vertical sync pulse but the display event &quot; + &quot;receiver has already been disposed.&quot;);
    } else {
        nativeScheduleVsync(mReceiverPtr);
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>英文不大理解，大体上可能是说安排接收一个 vsync 信号。而根据我们的分析，如果这个 vsync 信号发出的话，底层就会回调 DisplayEventReceiver 的 <code>onVsync()</code> 方法。</p><p>那如果只是这样的话，就有一点说不通了，<strong>首先上层 app 对于这些发送 vsync 信号的底层来说肯定是隐藏的，也就是说底层它根本不知道上层 app 的存在，那么在它的每 16.6ms 的帧信号来的时候，它是怎么找到我们的 app，并回调它的方法呢？</strong></p><p>这就有点类似于观察者模式，或者说发布-订阅模式。既然上层 app 需要知道底层每隔 16.6ms 的帧信号事件，那么它就需要先注册监听才对，这样底层在发信号的时候，直接去找这些观察者通知它们就行了。</p><p>这是我的理解，所以，这样一来，<code>scheduleVsync()</code> 这个调用到了 native 层方法的作用大体上就可以理解成注册监听了，这样底层也才找得到上层 app，并在每 16.6ms 刷新信号发出的时候回调上层 app 的 onVsync() 方法。这样一来，应该就说得通了。</p><p>还有一点，<code>scheduleVsync()</code> 注册的监听应该只是监听下一个屏幕刷新信号的事件而已，而不是监听所有的屏幕刷新信号。比如说当前监听了第一帧的刷新信号事件，那么当第一帧的刷新信号来的时候，上层 app 就能接收到事件并作出反应。但如果还想监听第二帧的刷新信号，那么只能等上层 app 接收到第一帧的刷新信号之后再去监听下一帧。</p><p>虽然现在能力还不足以跟踪到 native 层，这些结论虽然是猜测的，但都经过调试，对注释、代码理解之后梳理出来的结论，跟原理应该不会偏差太多，这样子的理解应该是可以的。</p><p>本篇内容确实有点多，所以到这里还是继续来先来<strong>梳理一下目前的信息</strong>，防止都忘记上面讲了些什么：</p><ol><li><p><strong>我们知道一个 View 发起刷新的操作时，最终是走到了 ViewRootImpl 的 scheduleTraversals() 里去，然后这个方法会将遍历绘制 View 树的操作 performTraversals() 封装到 Runnable 里，传给 Choreographer，以当前的时间戳放进一个 mCallbackQueue 队列里，然后调用了 native 层的方法向底层注册监听下一个屏幕刷新信号事件。</strong></p></li><li><p><strong>当下一个屏幕刷新信号发出的时候，如果我们 app 有对这个事件进行监听，那么底层它就会回调我们 app 层的 onVsync() 方法来通知。当 onVsync() 被回调时，会发一个 Message 到主线程，将后续的工作切到主线程来执行。</strong></p></li><li><p><strong>切到主线程的工作就是去 mCallbackQueue 队列里根据时间戳将之前放进去的 Runnable 取出来执行，而这些 Runnable 有一个就是遍历绘制 View 树的操作 performTraversals()。在这次的遍历操作中，就会去绘制那些需要刷新的 View。</strong></p></li><li><p><strong>所以说，当我们调用了 invalidate()，requestLayout()，等之类刷新界面的操作时，并不是马上就会执行这些刷新的操作，而是通过 ViewRootImpl 的 scheduleTraversals() 先向底层注册监听下一个屏幕刷新信号事件，然后等下一个屏幕刷新信号来的时候，才会去通过 performTraversals() 遍历绘制 View 树来执行这些刷新操作。</strong></p></li></ol><h2 id="过滤一帧内重复的刷新请求" tabindex="-1"><a class="header-anchor" href="#过滤一帧内重复的刷新请求" aria-hidden="true">#</a> 过滤一帧内重复的刷新请求</h2><p>整体上的流程我们已经梳理出来的，但还有几点问题需要解决。我们在一个 16.6ms 的一帧内，代码里可能会有多个 View 发起了刷新请求，这是非常常见的场景了，比如某个动画是有多个 View 一起完成，比如界面发生了滑动等等。</p><p>按照我们上面梳理的流程，只要 View 发起了刷新请求最终都会走到 ViewRootImpl 中的 <code>scheduleTraversals()</code> 里去，是吧。而这个方法又会封装一个遍历绘制 View 树的操作 <code>performTraversals()</code> 到 Runnable 然后扔到队列里等刷新信号来的时候取出来执行，没错吧。</p><p><strong>那如果多个 View 发起了刷新请求，岂不是意味着会有多次遍历绘制 View 树的操作？</strong></p><p>其实，这点不用担心，还记得我们在最开始分析 <code>scheduleTraverslas()</code> 的时候先跳过了一些代码么？现在我们回过来继续看看这些代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#scheduleTraversals
void scheduleTraversals() {
    if (!mTraversalScheduled) {
        //1.注意这个boolean类型的变量
        mTraversalScheduled = true;
        mTraversalBarrier = mHandler.getLooper().getQueue().postSyncBarrier();
        mChoreographer.postCallback(
            Choreograhper.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
        ...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们上面分析的 <code>scheduleTraversals()</code> 干的那一串工作，前提是 mTraversalScheduled 这个 boolean 类型变量等于 false 才会去执行。那这个变量在什么时候被赋值被 false 了呢：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#doTraversal
void doTraversal() {
    if (mTraversalScheduled) {
        mTraversalScheduled = false;
        ...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只有三个被赋值为 false 的地方，一个是上图的 <code>doTraversal()</code>，还有就是声明时默认为 false，剩下一个是在取消遍历绘制 View 操作 <code>unscheduleTraversals()</code> 里。这两个可以先不去看，就看看 <code>doTraversal()</code>。还记得这个方法吧，就是在 <code>scheduleTraversals()</code> 中封装到 Runnable 里的那个方法。</p><p>也就是说，<strong>当我们调用了一次 <code>scheduleTraversals()</code>之后，直到下一个屏幕刷新信号来的时候，<code>doTraversal()</code> 被取出来执行。在这期间重复调用 <code>scheduleTraversals()</code> 都会被过滤掉的。那么为什么需要这样呢？</strong></p><p>其实，想想就能明白了。View 最终是怎么刷新的呢，就是在执行 <code>performTraversals()</code> 遍历绘制 View 树过程中层层遍历到需要刷新的 View，然后去绘制它的吧。既然是遍历，那么不管上一帧内有多少个 View 发起了刷新的请求，在这一次的遍历过程中全部都会去处理的吧。这也是我们从代码上看到的，每一个屏幕刷新信号来的时候，只会去执行一次 <code>performTraversals()</code>，因为只需遍历一遍，就能够刷新所有的 View 了。</p><p>而 <code>performTraversals()</code> 会被执行的前提是调用了 <code>scheduleTraversals()</code> 来向底层注册监听了下一个屏幕刷新信号事件，所以在同一个 16.6ms 的一帧内，只需要第一个发起刷新请求的 View 来走一遍 <code>scheduleTraversals()</code> 干的事就可以了，其他不管还有多少 View 发起了刷新请求，没必要再去重复向底层注册监听下一个屏幕刷新信号事件了，反正只要有一次遍历绘制 View 树的操作就可以对它们进行刷新了。</p><h2 id="postsyncbarrier-同步屏障消息" tabindex="-1"><a class="header-anchor" href="#postsyncbarrier-同步屏障消息" aria-hidden="true">#</a> postSyncBarrier()---同步屏障消息</h2><p>还剩最后一个问题，<code>scheduleTraversals()</code> 里我们还有一行代码没分析。这个问题是这样的：</p><p>我们清楚主线程其实是一直在处理 MessageQueue 消息队列里的 Message，每个操作都是一个 Message，打开 Activity 是一个 Message，遍历绘制 View 树来刷新屏幕也是一个 Message。</p><p>而且，上面梳理完我们也清楚，遍历绘制 View 树的操作是在屏幕刷新信号到的时候，底层回调我们 app 的 <code>onVsync()</code>，这个方法再去将遍历绘制 View 树的操作 post 到主线程的 MessageQueue 中去等待执行。主线程同一时间只能处理一个 Message，这些 Message 就肯定有先后的问题，那么会不会出现下面这种情况呢：</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-fece980970f1da64.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="同步分隔栏.png"></p><p>也就是说，当我们的 app 接收到屏幕刷新信号时，来不及第一时间就去执行刷新屏幕的操作，这样一来，即使我们将布局优化得很彻底，保证绘制当前 View 树不会超过 16ms，但如果不能第一时间优先处理绘制 View 的工作，那等 16.6 ms 过了，底层需要去切换下一帧的画面了，我们 app 却还没处理完，这样也照样会出现丢帧了吧。而且这种场景是非常有可能出现的吧，毕竟主线程需要处理的事肯定不仅仅是刷新屏幕的事而已，那么这个问题是怎么处理的呢？</p><p>所以我们继续回来看 <code>scheduleTraversals()</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#scheduleTraversals
void scheduleTraversals() {
    if (!mTraversalScheduled) {
        mTraversalScheduled = true;
        //1.注意这行代码，往主线程的消息队列里发送了一个同步屏障消息
        mTraversalBarrier = mHandler.getLooper().getQueue().postSyncBarrier();
        mChoreographer.postCallback(
            Choreograhper.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
        ...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#doTraversal
void doTraversal() {
    if (mTraversalScheduled) {
        mTraversalScheduled = false;
        //1.注意这行代码，移除消息队列里的同步屏障消息
        mHandler.getLooper().getQueue().removeSyncBarrier(mTraversalBarrier);
        ...
        
        performTraversals();
        ...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在逻辑走进 Choreographer 前会先往队列里发送一个同步屏障，而当 <code>doTraversal()</code> 被调用时才将同步屏障移除。这个同步屏障又涉及到消息机制了，不深入了，这里就只给出结论。</p><p>这个同步屏障的作用可以理解成拦截同步消息的执行，主线程的 Looper 会一直循环调用 MessageQueue 的 <code>next()</code> 来取出队头的 Message 执行，当 Message 执行完后再去取下一个。当 <code>next()</code> 方法在取 Message 时发现队头是一个同步屏障的消息时，就会去遍历整个队列，只寻找设置了异步标志的消息，如果有找到异步消息，那么就取出这个异步消息来执行，否则就让 <code>next()</code> 方法陷入阻塞状态。如果 <code>next()</code> 方法陷入阻塞状态，那么主线程此时就是处于空闲状态的，也就是没在干任何事。所以，如果队头是一个同步屏障的消息的话，那么在它后面的所有同步消息就都被拦截住了，直到这个同步屏障消息被移除出队列，否则主线程就一直不会去处理同步屏幕后面的同步消息。</p><p>而所有消息默认都是同步消息，只有手动设置了异步标志，这个消息才会是异步消息。另外，同步屏障消息只能由内部来发送，这个接口并没有公开给我们使用。</p><p>最后，仔细看上面 Choreographer 里所有跟 message 有关的代码，你会发现，都手动设置了异步消息的标志，所以这些操作是不受到同步屏障影响的。这样做的原因可能就是为了尽可能保证上层 app 在接收到屏幕刷新信号时，可以在第一时间执行遍历绘制 View 树的工作。</p><p>因为主线程中如果有太多消息要执行，而这些消息又是根据时间戳进行排序，如果不加一个同步屏障的话，那么遍历绘制 View 树的工作就可能被迫延迟执行，因为它也需要排队，那么就有可能出现当一帧都快结束的时候才开始计算屏幕数据，那即使这次的计算少于 16.6ms，也同样会造成丢帧现象。</p><p>那么，<strong>有了同步屏障消息的控制就能保证每次一接收到屏幕刷新信号就第一时间处理遍历绘制 View 树的工作么？</strong></p><p>只能说，同步屏障是尽可能去做到，但并不能保证一定可以第一时间处理。因为，同步屏障是在 <code>scheduleTraversals()</code> 被调用时才发送到消息队列里的，也就是说，只有当某个 View 发起了刷新请求时，在这个时刻后面的同步消息才会被拦截掉。如果在 <code>scheduleTraversals()</code> 之前就发送到消息队列里的工作仍然会按顺序依次被取出来执行。</p><h2 id="界面刷新控制者-viewrootimpl" tabindex="-1"><a class="header-anchor" href="#界面刷新控制者-viewrootimpl" aria-hidden="true">#</a> 界面刷新控制者--ViewRootImpl</h2><p>最后，就是上文经常说的一点，所有跟界面刷新相关的操作，其实最终都会走到 ViewRootImpl 中的 <code>scheduleTraversals()</code> 去的。</p><p>大伙可以想想，跟界面刷新有关的操作有哪些，大概就是下面几种场景吧：</p><ol><li>invalidate(请求重绘)</li><li>requestLayout(重新布局)</li><li>requestFocus(请求焦点)</li><li>startActivity(打开新界面)</li><li>onRestart(重新打开界面)</li><li>KeyEvent(遥控器事件，本质上是焦点导致的刷新)</li><li>Animation(各种动画，本质上是请求重绘导致的刷新)</li><li>RecyclerView滑动（页面滑动，本质上是动画导致的刷新）</li><li>setAdapter(各种adapter的更新)</li><li>...</li></ol><p>在上一篇分析动画的博客里，我们跟踪了 <code>invalidate()</code>，确实也是这样，至于其他的我并没有一一去验证，大伙有兴趣可以看看，我猜测，这些跟界面刷新有关的方法内部要么就是一个 do{}while() 循环寻找 mParent，要么就是直接不断的调用 mParent 的方法。而一颗 View 树最顶端的 mParent 就是 ViewRootImpl，所以这些跟界面刷新相关的方法，在 ViewRootImpl 肯定也是可以找到的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#requestChildFocus
@Override
public void requestChildFocus(View child, View focused) {
    if (DEBUG_INPUT_RESIZE) {
        Log.v(mTag, &quot;Request child focus: focus now &quot; + focused);
    }
    checkThread();
    //1.这里
    scheduleTraversals();
}

//ViewRootImpl#clearChildFocus
@Override
public void clearChildFocus(View child) {
    if (DEBUG_INPUT_RESIZE) {
        Log.v(mTag, &quot;Clearing child focus&quot;);
    }
    checkThread();
    //2.这里
    scheduleTraversals();
}

//ViewRootImpl#requestLayout
@Override
public void requestLayout() {
    if (!mHandlingLayoutInLayoutRequest) {
        checkThread();
        mLayoutRequested = true;
        //3.这里
        scheduleTraversals();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实，以前我一直以为如果界面上某个小小的 View 发起了 <code>invalidate()</code> 重绘之类的操作，那么应该就只是它自己的 <code>onLayout()</code>, <code>onDraw()</code> 被调用来重绘而已。最后才清楚，原来，即使再小的 View，如果发起了重绘的请求，那么也需要先层层走到 ViewRootImpl 里去，而且还不是马上就执行重绘操作，而是需要等待下一个屏幕刷新信号来的时候，再从 DecorView 开始层层遍历到这些需要刷新的 View 里去重绘它们。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>本篇篇幅确实很长，因为这部分内容要理清楚不容易，要讲清楚更不容易，大伙如果有时间，可以静下心来慢慢看，从头看下来，我相信，多少会有些收获的。如果没时间，那么也可以直接看看总结。</p><ol><li><strong>界面上任何一个 View 的刷新请求最终都会走到 ViewRootImpl 中的 scheduleTraversals() 里来安排一次遍历绘制 View 树的任务；</strong></li><li><strong>scheduleTraversals() 会先过滤掉同一帧内的重复调用，在同一帧内只需要安排一次遍历绘制 View 树的任务即可，这个任务会在下一个屏幕刷新信号到来时调用 performTraversals() 遍历 View 树，遍历过程中会将所有需要刷新的 View 进行重绘；</strong></li><li><strong>接着 scheduleTraversals() 会往主线程的消息队列中发送一个同步屏障，拦截这个时刻之后所有的同步消息的执行，但不会拦截异步消息，以此来尽可能的保证当接收到屏幕刷新信号时可以尽可能第一时间处理遍历绘制 View 树的工作；</strong></li><li><strong>发完同步屏障后 scheduleTraversals() 才会开始安排一个遍历绘制 View 树的操作，作法是把 performTraversals() 封装到 Runnable 里面，然后调用 Choreographer 的 postCallback() 方法；</strong></li><li><strong>postCallback() 方法会先将这个 Runnable 任务以当前时间戳放进一个待执行的队列里，然后如果当前是在主线程就会直接调用一个native 层方法，如果不是在主线程，会发一个最高优先级的 message 到主线程，让主线程第一时间调用这个 native 层的方法；</strong></li><li><strong>native 层的这个方法是用来向底层注册监听下一个屏幕刷新信号，当下一个屏幕刷新信号发出时，底层就会回调 Choreographer 的onVsync() 方法来通知上层 app；</strong></li><li><strong>onVsync() 方法被回调时，会往主线程的消息队列中发送一个执行 doFrame() 方法的消息，这个消息是异步消息，所以不会被同步屏障拦截住；</strong></li><li><strong>doFrame() 方法会去取出之前放进待执行队列里的任务来执行，取出来的这个任务实际上是 ViewRootImpl 的 doTraversal() 操作；</strong></li><li><strong>上述第4步到第8步涉及到的消息都手动设置成了异步消息，所以不会受到同步屏障的拦截；</strong></li><li><strong>doTraversal() 方法会先移除主线程的同步屏障，然后调用 performTraversals() 开始根据当前状态判断是否需要执行performMeasure() 测量、perfromLayout() 布局、performDraw() 绘制流程，在这几个流程中都会去遍历 View 树来刷新需要更新的View；</strong></li></ol><p>再来一张时序图结尾，本篇贴的代码省略了很多细节，因为本篇主要是想带大伙梳理整个流程，所以只需要关注一些关键方法即可，但流程梳理清楚后，大伙有时间还是需要自己去过一遍源码的，这样也才可以将流程里的每个步骤的工作理解清楚，过源码时就可以跟着时序图来，看不清的话可以在电脑上看原图：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-26227e967f4d3506.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="View刷新流程时序图.png"></p><h2 id="qa" tabindex="-1"><a class="header-anchor" href="#qa" aria-hidden="true">#</a> QA</h2><p><strong>Q1：Android 每隔 16.6 ms 刷新一次屏幕到底指的是什么意思？是指每隔 16.6ms 调用 onDraw() 绘制一次么？</strong><br><strong>Q2：如果界面一直保持没变的话，那么还会每隔 16.6ms 刷新一次屏幕么？</strong><br> 答：我们常说的 Android 每隔 16.6 ms 刷新一次屏幕其实是指底层会以这个固定频率来切换每一帧的画面，而这个每一帧的画面数据就是我们 app 在接收到屏幕刷新信号之后去执行遍历绘制 View 树工作所计算出来的屏幕数据。而 app 并不是每隔 16.6ms 的屏幕刷新信号都可以接收到，只有当 app 向底层注册监听下一个屏幕刷新信号之后，才能接收到下一个屏幕刷新信号到来的通知。而只有当某个 View 发起了刷新请求时，app 才会去向底层注册监听下一个屏幕刷新信号。</p><p>也就是说，只有当界面有刷新的需要时，我们 app 才会在下一个屏幕刷新信号来时，遍历绘制 View 树来重新计算屏幕数据。如果界面没有刷新的需要，一直保持不变时，我们 app 就不会去接收每隔 16.6ms 的屏幕刷新信号事件了，但底层仍然会以这个固定频率来切换每一帧的画面，只是后面这些帧的画面都是相同的而已。</p><p><strong>Q3：界面的显示其实就是一个 Activity 的 View 树里所有的 View 都进行测量、布局、绘制操作之后的结果呈现，那么如果这部分工作都完成后，屏幕会马上就刷新么？</strong><br> 答：我们 app 只负责计算屏幕数据而已，接收到屏幕刷新信号就去计算，计算完毕就计算完毕了。至于屏幕的刷新，这些是由底层以固定的频率来切换屏幕每一帧的画面。所以即使屏幕数据都计算完毕，屏幕会不会马上刷新就取决于底层是否到了要切换下一帧画面的时机了。</p><p><strong>Q4：网上都说避免丢帧的方法之一是保证每次绘制界面的操作要在 16.6ms 内完成，但如果这个 16.6ms 是一个固定的频率的话，请求绘制的操作在代码里被调用的时机是不确定的啊，那么如果某次用户点击屏幕导致的界面刷新操作是在某一个 16.6ms 帧快结束的时候，那么即使这次绘制操作小于 16.6 ms，按道理不也会造成丢帧么？这又该如何理解？</strong><br> 答：之所以提了这个问题，是因为之前是以为如果某个 View 发起了刷新请求，比如调用了 <code>invalidte()</code>，那么它的重绘工作就马上开始执行了，所以以前在看网上那些介绍屏幕刷新机制的博客时，经常看见下面这张图：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-d8ebbbd67051dd6b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="image.png"></p><p>那个时候就是不大理解，为什么每一次 CPU 计算的工作都刚刚好是在每一个信号到来的那个瞬间开始的呢？毕竟代码里发起刷新屏幕的操作是动态的，不可能每次都刚刚好那么巧。</p><p>梳理完屏幕刷新机制后就清楚了，代码里调用了某个 View 发起的刷新请求，这个重绘工作并不会马上就开始，而是需要等到下一个屏幕刷新信号来的时候才开始，所以现在回过头来看这些图就清楚多了。</p><p><strong>Q5：大伙都清楚，主线程耗时的操作会导致丢帧，但是耗时的操作为什么会导致丢帧？它是如何导致丢帧发生的？</strong><br> 答：造成丢帧大体上有两类原因，一是遍历绘制 View 树计算屏幕数据的时间超过了 16.6ms；二是，主线程一直在处理其他耗时的消息，导致遍历绘制 View 树的工作迟迟不能开始，从而超过了 16.6 ms 底层切换下一帧画面的时机。</p><p>第一个原因就是我们写的布局有问题了，需要进行优化了。而第二个原因则是我们常说的避免在主线程中做耗时的任务。</p><p>针对第二个原因，系统已经引入了同步屏障消息的机制，尽可能的保证遍历绘制 View 树的工作能够及时进行，但仍没办法完全避免，所以我们还是得尽可能避免主线程耗时工作。</p><p>其实第二个原因，可以拿出来细讲的，比如有这种情况， message 不怎么耗时，但数量太多，这同样可能会造成丢帧。如果有使用一些图片框架的，它内部下载图片都是开线程去下载，但当下载完成后需要把图片加载到绑定的 view 上，这个工作就是发了一个 message 切到主线程来做，如果一个界面这种 view 特别多的话，队列里就会有非常多的 message，虽然每个都 message 并不怎么耗时，但经不起量多啊。后面有时间的话，看看要不要专门整理一篇文章来讲卡顿和丢帧的事。</p><h3 id="推荐阅读-大神博客" tabindex="-1"><a class="header-anchor" href="#推荐阅读-大神博客" aria-hidden="true">#</a> 推荐阅读（大神博客）</h3>`,124),h={href:"https://www.jianshu.com/p/a769a6028e51",target:"_blank",rel:"noopener noreferrer"},w={href:"http://blog.csdn.net/litefish/article/details/53939882",target:"_blank",rel:"noopener noreferrer"},V={href:"https://www.jianshu.com/p/996bca12eb1d",target:"_blank",rel:"noopener noreferrer"};function y(T,R){const n=l("ExternalLinkIcon");return r(),c("div",null,[o,i("p",null,[e("首先，先来过一下一些基本概念，摘抄自网上文章"),i("a",t,[e("android屏幕刷新显示机制"),s(n)]),e("：")]),u,i("p",null,[m,e(" 是请求重绘的一个操作，所以我们切入点可以从这个方法开始一步步跟下去。我们在上一篇博客"),i("a",p,[e("View 动画 Animation 运行原理解析"),s(n)]),e("已经分析过 "),b,e(" 这个方法了。")]),g,i("p",null,[i("a",h,[e("破译Android性能优化中的16ms问题"),s(n)]),i("a",w,[e("android屏幕刷新显示机制"),s(n)]),i("a",V,[e("Android Choreographer 源码分析"),s(n)])])])}const x=d(v,[["render",y],["__file","Android屏幕刷新机制_代码块版.html.vue"]]);export{x as default};
