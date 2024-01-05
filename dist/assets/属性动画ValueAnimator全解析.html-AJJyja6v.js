import{_ as d,r as s,o as r,c as t,a as i,b as e,e as a,d as l}from"./app-pwInIdNR.js";const m={},v=i("h1",{id:"提问环节",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#提问环节","aria-hidden":"true"},"#"),e(" 提问环节")],-1),c={href:"https://www.jianshu.com/p/48317612c164",target:"_blank",rel:"noopener noreferrer"},o=l(`<p><strong>Q1：我们知道，Animation 动画内部其实是通过 ViewRootImpl 来监听下一个屏幕刷新信号，并且当接收到信号时，从 DecorView 开始遍历 View 树的绘制过程中顺带将 View 绑定的动画执行。那么，属性动画（Animator）原理也是这样么？如果不是，那么它又是怎么实现的？</strong></p><p><strong>Q2：属性动画（Animator）区别于 Animation 动画的就是它是有对 View 的属性进行修改的，那么它又是怎么实现的，原理又是什么？</strong></p><p><strong>Q3：属性动画（Animator）调用了 <code>start()</code> 之后做了些什么呢？何时开始处理当前帧的动画工作？内部又进行了哪些计算呢？</strong></p><h1 id="基础" tabindex="-1"><a class="header-anchor" href="#基础" aria-hidden="true">#</a> 基础</h1><p>属性动画的使用，常接触的其实就是两个类 <strong>ValueAnimator</strong>， <strong>ObjectAnimator</strong>。其实还有一个 <strong>View.animate()</strong>，这个内部原理也是属性动画，而且它已经将常用的动画封装好了，使用起来非常方便，但会有一个坑，我们留着下一篇来介绍，本篇着重介绍属性动画的运行原理。</p><p>先看看基本的使用步骤：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//1.ValueAnimator用法  
ValueAnimator animator = ValueAnimator.ofFloat(500);
animator.setDuration(1000);
animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
        @Override
        public void onAnimationUpdate(ValueAnimator animation) {
               float value = (float) animation.getAnimatedValue();
               mView.setX(value);  
        }
 });
animator.start();

//2.ObjectAnimator用法
ObjectAnimator animator = ObjectAnimator.ofFloat(mView, &quot;X&quot;, 500).setDuration(1000).start();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样你就可以看到一个执行了 1s 的平移动画，那么接下去就该开始跟着源码走了，我们需要梳理清楚，这<strong>属性动画是什么时候开始执行，如何执行的，真正生效的地方在哪里，怎么持续 1s 的，内部是如何进行计算的</strong>。</p>`,8),u={href:"https://www.jianshu.com/p/0d00cb85fdf3",target:"_blank",rel:"noopener noreferrer"},b=l(`<blockquote><p>我们知道，Android 每隔 16.6ms 会刷新一次屏幕，也就是每过 16.6ms 底层会发出一个屏幕刷新信号，当我们的 app 接收到这个屏幕刷新信号时，就会去计算屏幕数据，也就是我们常说的测量、布局、绘制三大流程。这整个过程关键的一点是，app 需要先向底层注册监听下一个屏幕刷新信号事件，这样当底层发出刷新信号时，才可以找到上层 app 并回调它的方法来通知事件到达了，app 才可以接着去做计算屏幕数据之类的工作。</p><p>而注册监听以及提供回调接口供底层调用的这些工作就都是由 Choreographer 来负责，Animation 动画的原理是通过当前 View 树的 ViewRootImpl 的 <code>scheduleTraversals()</code> 方法来实现，这个方法的内部逻辑会走到 Choreographer 里去完成注册监听下一个屏幕刷新信号以及接收到事件之后的工作。</p><p>需要跟屏幕刷新信号打交道的话，归根结底最后都是通过 Choreographer 这个类。</p></blockquote><p>那么，当我们在过属性动画（Animator）的流程源码时，我们就有一个初步的目标了，至少我们知道了需要跟踪到 Choreographer 里才可以停下来。至于属性动画的流程原理是跟 Animation 动画流程一样通过 ViewRootImpl 来实现的呢？还是其他的方式？这些就是我们这次过源码需要梳理出来的了，那么下面就开始过源码吧。</p><h1 id="源码解析" tabindex="-1"><a class="header-anchor" href="#源码解析" aria-hidden="true">#</a> 源码解析</h1><p>ps：本篇分析的源码基于 android-25 版本，版本不一样，源码可能会有些差别，大伙自己过的时候注意一下。</p><p>过动画源码的着手点应该都很简单，跟着 <code>start()</code> 一步步追踪下去梳理清楚就可以了。</p><p>我们知道 ObjectAnimator 是继承的 ValueAnimator，那么我们可以直接从 ValueAnimator 的 <code>start()</code> 开始看，等整个流程梳理清楚后，再回过头看看 ObjectAnimator 的 <code>start()</code> 多做了哪些事就可以了：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#start()
public void start() {
    start(false); 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>很简单，调用了内部的 <code>start(boolean)</code> 方法，</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#start(boolean)
private void start(boolean playBackwards) {
    ...
    //1.一些变量初始化工作
    mStarted = true;
    mPaused = false;
    mRunning = false;
    ...

    //2.调用了其他类的方法
    AnimationHandler animationHandler = AnimationHandler.getInstance();
    animationHandler.addAnimationFrameCallback(this, (long)(mStartDelay * sDurationScale));

    if(mStartDelay == 0 || mSeekFraction &gt;= 0) {
        ...
        //3.调用了本类的方法
        startAnimation();
        
        ...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>前面无外乎就是一些变量的初始化，然后调用一些方法，emmm，其实我们并没有必要每一行代码，每一个变量都去搞懂，我们主要是想梳理整个流程，那么单看方法命名也知道，我们下面就跟着 <code>startAnimation()</code> 进去看看（但记得，如果后面跟不下去了，要回来这里看看我们跳过的方法是不是漏掉了一些关键的信息）：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#startAnimation()
private void startAnimation() {
    ...

    //1.也是进行一些初始化工作
    initAnimation();
    ...

    if(mListeners != null) {
        //2.通知动画开始了    
        notifyStartListeners();    
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里调用了两个方法，<code>initAnimation()</code> 和 <code>notifyStartListeners()</code>，感觉这两处也只是一些变量的初始化而已，还是没涉及到流程的信息啊，不管了，也还是先跟进去确认一下看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#initAnimation()
void initAnimation() {
    //1.关键帧的初始化，末尾分析    
    if(!mInitialized) {
        int numValues = mValues.length;
        for(int i=0; i&lt;numValues; ++i) {
            mValues[i].init();    
        }    
        mInitialized = true;
    }    
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>确实只是进行一些初始化工作而已，看看另外一个：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#notifyStartListeners
private void notifyStartListeners() {
    //回调start接口，通知动画开始了    
    if(mListeners != null &amp;&amp; !mStartListenersCalled) {
        ArrayList&lt;AnimatorListener&gt; mListeners.clone();
        int numListeners = tmpListeners.size();
        for(int i=0; i&lt;numListeners; ++i) {
            tmpListeners.get(i).onAnimationStart(this);    
        }    
    }
    mStartListenersCalled = true;    
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里也只是通知动画开始，回调 listener 的接口而已。</p><p>emmm，我们从 <code>start()</code> 开始一路跟踪下来，发现到目前为止都只是在做动画的一些初始化工作而已，而且跟到这里很明显已经是尽头了，下去没有代码了，那么动画初始化之后的下一个步骤到底是在哪里进行的呢？还记得我们前面在 <code>start(boolean)</code> 方法里跳过了一些方法么？也许关键就是在这里，那么再回头过去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#start(boolean)
private void start(boolean playBackwards) {
    ...
    //1.一些变量初始化工作
    ...

    //2.调用了其他类的方法
    AnimationHandler animationHandler = AnimationHandler.getInstance();
    animationHandler.addAnimationFrameCallback(this, (long)(mStartDelay * sDurationScale));

    if(mStartDelay == 0 || mSeekFraction &gt;= 0) {
        ...
        //3.调用了本类的方法
        startAnimation();
        
        ...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们刚才是根据方法命名，想当然的直接跟着 <code>startAnimation()</code> 走下去了，既然这条路走到底没找到关键信息，那么就折回头看看其他方法。这里调用了 AnimationHandler 类的 <code>addAnimationFrameCallback()</code>，新出现了一个类，看命名应该是专门处理动画相关的，而且还是单例类，跟进去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler#addAnimationFrameCallback()
public void addAnimationFrameCallback(final AnimationFrameCallback callback, long delay) {
    //1.通过Choreographer向底层注册下一个屏幕刷新信号监听
    if(mAnimationCallbacks.size == 0) {
        getProvider().postFrameCallback(mFrameCallback);    
    }
    //2.将需要运行的动画添加到列表中
    if(!mAnimationCallbacks.contains(callback)) {
        mAnimationCallbacks.add(callback);    
    }
    //3.如果动画是一个延迟开始的动画，那么加入Delay队列里
    if(delay &gt; 0) {
        mDelayedCallbackStartTime.put(callback, (SystemClock.uptimeMillis() + delay));    
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先第二个参数 delay 取决于我们是否调用了 <code>setStartDelay()</code> 来设置动画的延迟执行，假设目前的动画都没有设置，那么 delay 也就是 0，所以这里着重看一下前面的代码。</p><p>mAnimationCallbacks 是一个 ArrayList，每一项保存的是 AnimationFrameCallback 接口的对象，看命名这是一个回调接口，那么是谁在什么时候会对它进行回调呢？根据目前仅有的信息，我们并没有办法看出来，那么可以先放着，这里只要记住第一个参数之前传进来的是 this，也就是说如果这个接口被回调时，那么 ValueAnimator 对这个接口的实现将会被回调。</p><p>接下去开始按顺序过代码了，当 mAnimationCallbacks 列表大小等于 0 时，将会调用一个方法，很明显，如果动画是第一次执行的话，那么这个列表大小应该就是 0，因为将 callback 对象添加到列表里的操作是在这个判断之后，所以这里我们可以跟进看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler#getProvider()
private AnimationFrameCallbackProvider getProvider() {
    if(mProvider == null) {
        mProvider = new MyFrameCallbackProvider();    
    }    
    return mProvider;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler$MyFrameCallbackProvider#postFrameCallback()
private class MyFrameCallbackProvider implements AnimationFrameCallbackProvider {

    final Choreographer mChoreographer = Choreographer.getInstance();

    @Override
    public void postFrameCallback(Choreographer.FrameCallback callback) {
        mChoreographer.postFrameCallback(callback);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>哇，这么快就看到 Choreographer 了，感觉我们好像已经快接近真相了，继续跟下去：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreographer#postFrameCallback()
public void postFrameCallback(FrameCallback callback) {
    postFrameCallbackDelayed(callback, 0);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Choreographer#postFrameCallbackDelayed()
public void postFrameCallbackDelayed(FrameCallback callback, long delayMillis) {
    ...

    postCallbackDelayedInternal(CALLBACK_ANIMATION, callback, FRAME_CALLBACK_TOKEN, delayMillis);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以内部其实是调用了 <code>postCallbackDelayedInternal()</code> 方法，如果有看过我写的上一篇博客 <em><strong>Android 屏幕刷新机制</strong></em>，到这里是不是已经差不多可以理清了，有时间的可以回去看看，我这里概括性地给出些结论。</p><p>Choreographer 内部有几个队列，上面方法的第一个参数 CALLBACK_ANIMATION 就是用于区分这些队列的，而每个队列里可以存放 FrameCallback 对象，也可以存放 Runnable 对象。Animation 动画原理上就是通过 ViewRootImpl 生成一个 <code>doTraversal()</code> 的 Runnable 对象（其实也就是遍历 View 树的工作）存放到 Choreographer 的队列里的。而这些队列里的工作，都是用于在接收到屏幕刷新信号时取出来执行的。但有一个关键点，Choreographer 要能够接收到屏幕刷新信号的事件，是需要先调用 Choreographer 的 <code>scheduleVsyncLocked()</code> 方法来向底层注册监听下一个屏幕刷新信号事件的。</p><p>而如果继续跟踪 <code>postCallbackDelayedInternal()</code> 这个方法下去的话，你会发现，它最终就是走到了 <code>scheduleVsyncLocked()</code> 里去，这些在上一篇博客 Android 屏幕刷新机制里已经梳理过了，这里就不详细讲了。</p><p><strong>那么，到这里，我们就可以先来梳理一下目前的信息了：</strong></p><p>当 ValueAnimator 调用了 <code>start()</code> 方法之后，首先会对一些变量进行初始化工作并通知动画开始了，然后 ValueAnimator 实现了 AnimationFrameCallback 接口，并通过 AnimationHander 将自身 this 作为参数传到 mAnimationCallbacks 列表里缓存起来。而 AnimationHandler 在 mAnimationCallbacks 列表大小为 0 时会通过内部类 MyFrameCallbackProvider 将一个 mFrameCallback 工作缓存到 Choreographer 的待执行队列里，并向底层注册监听下一个屏幕刷新信号事件。</p><p>当屏幕刷新信号到的时候，Choreographer 的 <code>doFrame()</code> 会去将这些待执行队列里的工作取出来执行，那么此时也就回调了 AnimationHandler 的 mFrameCallback 工作。</p><p>那么到目前为止，我们能够确定，当动画第一次调用 <code>start()</code>，这里的第一次应该是指项目里所有的属性动画里某个动画第一次调用 <code>start()</code>，因为 AnimationHandler 是一个单例类，显然是为所有的属性动画服务的。如果是第一次调用了 <code>start()</code>，那么就会去向底层注册监听下一个屏幕刷新信号的事件。所以动画的处理逻辑应该就是在接收到屏幕刷新信号之后回调到的 mFrameCallback 工作里会去间接的调用到的了。</p><p>那么，接下去就继续看看，<strong>当接收到屏幕刷新信号之后，mFrameCallback 又继续做了什么</strong>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler.mFrameCallback
private final Choreographer.FrameCallback mFrameCallback = new Choreographer.FrameCallback() {
    @Override
    public void doFrame(long frameTimeNanos) {
        //1.处理当前帧的动画
        doAnimationFrame(getProvider().getFrameTime());
        //2.如果列表里还有动画没结束，那么继续向底层注册监听下一个屏幕刷新信号事件，接收到信号时，重复此工作
        if(mAnimationCallbacks.size() &gt; 0) {
            getProvider().postFrameCallback(this);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实就做了两件事，一件是去处理动画的相关工作，也就是说要找到动画真正执行的地方，跟着 <code>doAnimationFrame()</code> 往下走应该就行了。而剩下的代码就是处理另外一件事：继续向底层注册监听下一个屏幕刷新信号。</p><p>先讲讲第二件事，我们知道，动画是一个持续的过程，也就是说，每一帧都应该处理一个动画进度，直到动画结束。既然这样，我们就需要在动画结束之前的每一个屏幕刷新信号都能够接收到，所以在每一帧里都需要再去向底层注册监听下一个屏幕刷新信号事件。所以你会发现，上面代码里参数是 this，也就是 mFrameCallback 本身，结合一下之前的那个流程，这里可以得到的信息是：</p><p>当第一个属性动画调用了 <code>start()</code> 时，由于 mAnimationCallbacks 列表此时大小为 0，所以直接由 <code>addAnimationFrameCallback()</code> 方法内部间接的向底层注册下一个屏幕刷新信号事件，然后将该动画加入到列表里。而当接收到屏幕刷新信号时，mFrameCallback 的 <code>doFrame()</code> 会被回调，该方法内部做了两件事，一是去处理当前帧的动画，二则是根据列表的大小是否不为 0 来决定继续向底层注册监听下一个屏幕刷新信号事件，如此反复，直至列表大小为 0。</p><p>所以，这里可以猜测一点，如果当前动画结束了，那么就需要将其从 mAnimationCallbacks 列表中移除，这点可以后面跟源码过程中来验证。<br> 那么，下去就是跟着 <code>doAnimationFrame()</code> 来看看，属性动画是怎么执行的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler#doAnimationFrame()
private void doAnimationFrame(long frameTime) {
    int size = mAnimationCallbacks.size();
    long currentTime = SystemClock.uptimeMillis();
    //1.循环列表取出每一个正在运行中的动画来处理当前帧的动画工作
    for(int i=0; i&lt;size; i++) {
        final AnimationFrameCallback callback = mAnimationCallbacks.get(i);
        ...
        //2.如要没有设置延迟开始，那么这个方法默认返回true，否则会去判断延迟的时间是否到了
        if(isCallbackDue(callback, currentTime)) {
            //3.ValueAnimator实现了AniamtionFrameCallback接口，所以相关于调用ValueAnimator去进行具体的动画工作
            callback.doAnimationFrame(frameTime);
            ...
        }
    }
    //4.清理工作，如果当前帧是某些动画的最后一帧，那么就将动画移除列表
    cleanUpList();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里概括下其实就做了两件事：</p><p>一是去循环遍历列表，取出每一个 ValueAnimator，然后判断动画是否有设置了延迟开始，或者说动画是否到时间该执行了，如果到时间执行了，那么就会去调用 ValueAnimator 的 <code>doAnimationFrame()</code>；</p><p>二是调用了 <code>cleanUpList()</code> 方法，看命名就可以猜测是去清理列表，那么应该也就是处理掉已经结束的动画，因为 AnimationHandler 是为所有属性动画服务的，同一时刻也许有多个动画正在进行中，那么动画的结束肯定有先后，已经结束的动画肯定要从列表中移除，这样等所有动画都结束了，列表大小变成 0 了，mFrameCallback 才可以停止向底层注册监听下一个屏幕刷新信号事件，AnimationHandler 才可以进入空闲状态，不用再每一帧都去处理动画的工作。</p><p>那么，我们优先看看 <code>cleanUpList()</code>，因为感觉它的工作比较简单，那就先梳理掉：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler#cleanUpList()
private void cleanUpList() {
    if(mListDirty) {
        for(int i=mAnimationCallbacks.size( - 1; i&gt;=0; i--)) {
            if(mAnimationCallbacks.get(i) == null) {
                mAnimationCallbacks.remove(i);
            }
        }
        mListDirty = false;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>猜测正确，将列表中为 null 的对象都移除掉，那么我们就可以继续进一步猜测，动画如果结束的话，会将自身在这个列表中的引用赋值为 null，这点可以在稍微跟踪动画的流程中来进行确认。</p><p>清理的工作梳理完，那么接下去就是继续去跟着动画的流程了，还记得我们上面提到了另一件事是遍历列表去调用每个动画 ValueAnimator 的 <code>doAnimationFrame()</code> 来处理动画逻辑么，那么我们接下去就跟进这个方法看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#doAnimationFrame()
public final void doAnimationFrame(long frameTime) {
    Animationhandler handler = AnimationHandler.getInstance();
    //1.如果当前帧是动画第一帧，那么处理一些第一帧的工作
    if(mLastFrameTime == 0) {
        // First frame
        handler.addOneShotCommitCallback(this);
        ...

        if(mSeekFraction &lt; 0) {
            mStartTime = frameTime;
        } else {
            long seekTime = (long) (getScaledDuration() * mSeekFraction);
            mSeekFraction = -1;
        }
        mStartTimeCommitted = false;
    }
    mLastFrameTime = frameTime;
    ...
    
    //2.根据当前时间计算动画进度
    final long currentTime = Math.max(frameTime, mStartTime);
    boolean finished = animateBaseOnTime(currtenTime);

    //3.如果动画该结束了，那么去做一些清理工作
    if(finished) {
        endAnimation();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面省略了部分代码，省略的那些代码跟动画是否被暂停或重新开始有关，本篇优先梳理正常的动画流程，这些就先不关注了。</p><p>稍微概括一下，这个方法内部其实就做了三件事：<br> 一是处理第一帧动画的一些工作；</p><p>二是根据当前时间计算当前帧的动画进度，所以动画的核心应该就是在 <code>animateBaseOnTime()</code> 这个方法里，意义就类似 Animation 动画的 <code>getTransformation()</code>方法；</p><p>三是判断动画是否已经结束了，结束了就去调用 <code>endAnimation()</code>，按照我们之前的猜测，这个方法内应该就是将当前动画从 mAniamtionCallbacks 列表里移除。</p><p>我们先来看动画结束之后的处理工作，因为上面才刚梳理了一部分，趁着现在大伙还有些印象，而且这部分工作会简单易懂点，先把简单的吃掉：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#endAnimation()
private void endAnimation() {
    ...
    //1.每个要运行的ValueAnimator都会存放在AnimationHandler中一起维护，如果动画该结束了，那么就将其本身从AnimationHandler中移除
    AniamtionHandler handler = AnimationHandler.getInstance();
    handler.removeCallback(this);

    ...
    //2.通知动画结束事件
    if((mStarted || mRunning) &amp;&amp; mListeners != null) {
        ...
        for(int i=0; i&lt; numListeners; i++) {
            tmpListeners.get(i).onAnimationEnd(this);
        }
    }
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>很简单，两件事，一是去通知说动画结束了，二是调用了 AniamtionHandler 的 <code>removeCallback()</code>，继续跟进看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler#removeCallback()
public void removeCallback(AnimationFrameCallback callback) {
    ...
    //1.该方法由ValueAnimator调用，将其自身在AniamtionHander中的列表的引用赋值为Null，方便清理
    int id = mAnimationCallbacks.indexOf(callback);
    if(id &gt;= 0) {
        mAnimationCallbacks.set(id, null);
        mListDirty = true;
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们之前的猜测在这里得到验证了吧，如果动画结束，那么它会将其自身在 AnimationCallbacks 列表里的引用赋值为 null，然后移出列表的工作就交由 AnimationHandler 去做。我们说了，AnimationHandler 是为所有的属性动画服务的，那么当某个动画结束的话，就必须进行一些资源清理的工作，整个清理的流程逻辑就是我们目前梳理出来的这样。</p><p>好，搞定了一个小点了，那么接下去继续看剩下的两件事，先看第一件，<strong>处理动画第一帧的工作问题</strong>：</p><p>参考 Animation 动画的原理，第一帧的工作通常都是为了记录动画第一帧的时间戳，因为后续的每一帧里都需要根据当前时间以及动画第一帧的时间还有一个动画持续时长来计算当前帧动画所处的进度，Animation 动画我们梳理过了，所以这里在过第一帧的逻辑时应该就会比较有条理点。我们来看看，属性动画的第一帧的工作是不是跟 Animation 差不多：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#doAnimationFrame()
public final void doAnimationFrame(long frameTime) {
    Animationhandler handler = AnimationHandler.getInstance();
    //1.如果当前帧是动画第一帧，那么处理一些第一帧的工作
    if(mLastFrameTime == 0) {
        // First frame
        handler.addOneShotCommitCallback(this);
        ...

        if(mSeekFraction &lt; 0) {
            mStartTime = frameTime;
        } else {
            long seekTime = (long) (getScaledDuration() * mSeekFraction);
            mSeekFraction = -1;
        }
        mStartTimeCommitted = false;
    }
    mLastFrameTime = frameTime;
    ...
    
    //2.根据当前时间计算动画进度
    ...

    //3.如果动画该结束了，那么去做一些清理工作
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>emmm，看来比 Animation 动画复杂多了，大体上也是干了两件事：</p><p>一是调用了 AnimationHandler 的 <code>addOneShotCommitCallback()</code> 方法，具体是干嘛的我们等会来分析；</p><p>二就是记录动画第一帧的时间了，mStartTime 变量就是表示第一帧的时间戳，后续的动画进度计算肯定需要用到这个变量。至于还有一个 mSeekFraction 变量，它的作用有点类似于我们用电脑看视频时，可以任意选择从某个进度开始观看。属性动画有提供了一个接口 <code>setCurrentPlayTime()</code>。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ValueAnimator animator = ValueAnimator.ofInt(0, 100);
animator.setDuration(4000);
animator.start();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子，。这是一个持续 4s 从 0 增长到 100 的动画，如果我们调用了 <code>start()</code>，那么 mSeekFraction 默认值是 -1，所以 mStartTime 就是用当前时间作为动画的第一帧时间。如果我们调用了 <code>setCurrentPlayTime(2000)</code>，意思就是说，我们希望这个动画从 2s 开始，那么它就是一个持续 2s(4-2) 的从 50 增长到 100 的动画（假设插值器为线性），所以这个时候，mStartTime 就是以比当前时间还早 2s 作为动画的第一帧时间，后面根据 mStartTime 计算动画进度时，就会发现原来动画已经过了 2s 了。</p><p>就像我们看电视时，我们不想看片头，所以直接选择从正片开始看，类似的道理。</p><p>好了，还记得前面说了处理动画第一帧的工作大体上有两件事，另一件是调用了一个方法么。我们回头来看看，这里又是做了些什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler#addOneShotCommitCallback()
public void addOneShotCommitCallback(final AnimationFrameCallback callback) {
    if(!mCommitCallbacks.contains(callback)) {
        mCommitCallbacks.add(callback);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只是将 ValueAnimator 添加到 AnimationHandler 里的另一个列表中去，可以过滤这个列表的变量名看看它都在哪些地方被使用到了：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler#doAnimationFrame()
private void doAnimationFrame(long frameTime) {
    int size = mAnimationCallbacks.size();
    long currentTime = SystemClock.uptimeMillis();
    //1.循环列表取出每一个正在运行中的动画来处理当前帧的动画工作
    for(int i=0; i&lt;size; i++) {
        final AnimationFrameCallback callback = mAnimationCallbacks.get(i);
        ...
        //2.如要没有设置延迟开始，那么这个方法默认返回true，否则会去判断延迟的时间是否到了
        if(isCallbackDue(callback, currentTime)) {
            //3.ValueAnimator实现了AniamtionFrameCallback接口，所以相关于调用ValueAnimator去进行具体的动画工作
            callback.doAnimationFrame(frameTime);
            
            //看这里看这里
            if(mCommitCallbacks.contains(callback)) {
                getProvider().postCommitCallback(new Runnable() {
                    @Override
                    public void run() {
                        commitAnimationFrame(callback, getProvider().getFrameTime());
                    }
                })
            }
        }
    }
    //4.清理工作，如果当前帧是某些动画的最后一帧，那么就将动画移除列表
    cleanUpList();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这地方还记得吧，我们上面分析的那一大堆工作都是跟着 <code>callback.doAnimationFrame(frameTime)</code> 这行代码走进去的，虽然内部做的事我们还没全部分析完，但我们这里可以知道，等内部所有事都完成后，会退回到 AnimationHandler 的 <code>doAnimationFrame()</code> 继续往下干活，所以再继续跟下去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler$MyFrameCallbackProvider#postFrameCallback()
private class MyFrameCallbackProvider implements AnimationFrameCallbackProvider {

    final Choreographer mChoreographer = Choreographer.getInstance();

    @Override
    public void postFrameCallback(Runnable runnable) {
        mChoreographer.postCallback(Choreographer.CALLBACK_COMMIT, runnable, null);
    }
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面说过，Choreographer 内部有多个队列，每个队列里都可以存放 FrameCallback 对象，或者 Runnable 对象。这次是传到了另一个队列里，传进的是一个 Runnable 对象，我们看看这个 Runnable 做了些什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//AnimationHandler#commitAnimationFrame()
private void commitAnimationFrame(AnimationFrameCallback callback, long frameTime) {
    if(!mDelayedCallbackStartTime.containsKey(callback) &amp;&amp;
        mCommitCallbacks.contains(callback)) {
        callback.commitAnimationFrame(frameTime);
        mCommitCallbacks.remove(callback);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ValueAnimator 实现了 AnimationFrameCallback 接口，这里等于是回调了 ValueAnimator 的方法，然后将其从队列中移除。看看 ValueAnimator 的实现做了些什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#commitAnimationFrame()
public void commitAnimationFrame(long frameTime) {
    //1.修正记录的动画第一帧时间
    if(!mStartTimeCommitted) {
        mStartTimeCommitted = true;
        long adjustment = frameTime - mLastFrameTime;
        if(adjustment &gt; 0) {
            mStartTime += adjustment;
            ...
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>好嘛，这里说穿了其实也是在修正动画的第一帧时间 mStartTime。那么，其实也就是说，ValueAnimator 的 <code>doAnimationFrame()</code> 里处理第一帧工作的两件事全部都是用于计算动画的第一帧时间，只是一件是根据是否 &quot;跳过片头&quot;( <code>setCurrentPlayTime()</code>) 计算，另一件则是这里的修正。</p><p>那么，<strong>这里为什么要对第一帧时间 mStartTime 进行修正呢？</strong></p><p>大伙有时间可以去看看 AnimationFrameCallback 接口的 <code>commitAnimationFrame()</code> 方法注释，官方解释得特别清楚了，我这里就不贴图了，直接将我的理解写出来：</p><p>其实，这跟属性动画通过 Choreographer 的实现原理有关。我们知道，屏幕的刷新信号事件都是由 Choreographer 负责，它内部有多个队列，这些队列里存放的工作都是用于在接收到信号时取出来处理。那么，这些队列有什么区别呢？</p><p>其实也就是执行的先后顺序的区别，按照执行的先后顺序，我们假设这些队列的命名为：1队列 &gt; 2队列 &gt; 3队列。我们本篇分析的属性动画，AnimationHandler 封装的 mFrameCallback 工作就是放到 1队列里的；而之前分析的 Animation 动画，它通过 ViewRootImpl 封装的 <code>doTraversal()</code> 工作是放到 2队列里的；而上面刚过完的修正动画第一帧时间的 Runnable 工作则是放到 3队列里的。</p><p>也就是说，当接收到屏幕刷新信号后，属性动画会最先被处理。然后是去计算当前屏幕数据，也就是测量、布局、绘制三大流程。但是这样会有一个问题，如果页面太过复杂，绘制当前界面时花费了太多的时间，那么等到下一个屏幕刷新信号时，属性动画根据之前记录的第一帧时间戳计算动画进度时，会发现丢了开头的好几帧，明明动画没还执行过。所以，这就是为什么需要对动画第一帧时间进行修正。</p><p>当然，如果动画已经开始了，在动画中间某一帧，就不会去修正了，这个修正，只是针对动画的第一帧时间。因为，如果是在第一帧发现绘制界面太耗时，丢了开头几帧，那么我们可以通过延后动画开始的时机来达到避免丢帧。但如果是在动画执行过程中才遇到绘制界面太耗时，那不管什么策略都无法避免丢帧了。</p><hr><h2 id="小结1" tabindex="-1"><a class="header-anchor" href="#小结1" aria-hidden="true">#</a> 小结1：</h2><p>好了，到这里，大伙先休息下，我们来梳理一下目前所有的信息，不然我估计大伙已经忘了上面讲过什么了：</p><ol><li><p><strong>ValueAnimator 属性动画调用了 <code>start()</code> 之后，会先去进行一些初始化工作，包括变量的初始化、通知动画开始事件；</strong></p></li><li><p><strong>然后通过 AnimationHandler 将其自身 this 添加到 mAnimationCallbacks 队列里，AnimationHandller 是一个单例类，为所有的属性动画服务，列表里存放着所有正在进行或准备开始的属性动画；</strong></p></li><li><p><strong>如果当前存在要运行的动画，那么 AnimationHandler 会去通过 Choreographer 向底层注册监听下一个屏幕刷新信号，当接收到信号时，它的 mFrameCallback 会开始进行工作，工作的内容包括遍历列表来分别处理每个属性动画在当前帧的行为，处理完列表中的所有动画后，如果列表还不为 0，那么它又会通过 Choreographer 再去向底层注册监听下一个屏幕刷新信号事件，如此反复，直至所有的动画都结束。</strong></p></li><li><p><strong>AnimationHandler 遍历列表处理动画是在 <code>doAnimationFrame()</code> 中进行，而具体每个动画的处理逻辑则是在各自，也就是 ValueAnimator 的 <code>doAnimationFrame()</code> 中进行，各个动画如果处理完自身的工作后发现动画已经结束了，那么会将其在列表中的引用赋值为空，AnimationHandler 最后会去将列表中所有为 null 的都移除掉，来清理资源。</strong></p></li><li><p><strong>每个动画 ValueAnimator 在处理自身的动画行为时，首先，如果当前是动画的第一帧，那么会根据是否有&quot;跳过片头&quot;（<code>setCurrentPlayTime()</code>）来记录当前动画第一帧的时间 mStartTime 应该是什么。</strong></p></li><li><p><strong>第一帧的动画其实也就是记录 mStartTime 的时间以及一些变量的初始化而已，动画进度仍然是 0，所以下一帧才是动画开始的关键，但由于属性动画的处理工作是在绘制界面之前的，那么有可能因为绘制耗时，而导致 mStartTime 记录的第一帧时间与第二帧之间隔得太久，造成丢了开头的多帧，所以如果是这种情况下，会进行 mStartTime 的修正。</strong></p></li><li><p><strong>修正的具体做法则是当绘制工作完成后，此时，再根据当前时间与 mStartTime 记录的时间做比较，然后进行修正。</strong></p></li><li><p><strong>如果是在动画过程中的某一帧才出现绘制耗时现象，那么，只能表示无能为力了，丢帧是避免不了的了，想要解决就得自己去分析下为什么绘制会耗时；而如果是在第一帧是出现绘制耗时，那么，系统还是可以帮忙补救一下，修正下 mStartTime 来达到避免丢帧。</strong></p></li></ol><p>好了，休息结束，我们继续，还有一段路要走，其实整个流程目前大体上已经出来了，只是缺少了当前帧的动画进度具体计算实现细节，这部分估计会更让人头大。</p><p>之前分析 ValueAnimator 的 <code>doAnimationFrame()</code> 时，我们将其概括出来主要做了三件事：一是处理第一帧动画的工作；二是根据当前时间计算并实现当年帧的动画工作；三是根据动画是否结束进行一些资源清理工作；一三我们都分析了，下面就来过过第二件事，<code>animateBasedOnTime()</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#animateBasedOnTime()
boolean animateBasedOnTime() {
    boolean done = false;
    if(mRunning) {
        //1. 根据当前时间，动画第一帧时间，动画持续时长计算当前帧动画进度
        final long scaleDuration = getScaledDuration();
        final float fraction = scaleDuration &gt; 0 ?
                    (float)(currentTime - mStartTime) / scaledDuration : 1f;
        ...
        //2. 确保动画进度在 0-1 之间
        mOverallFraction = clampFraction(fraction);
        float currentIterationFraction = getCurrentIterationFraction(mOverallFraction);
        //3. 根据初步计算出来的动画进度再进一步处理，如经过插值器转换等
        animateValue(currentIterationFraction);
    }
    return done;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从这里开始，就是在计算当前帧的动画逻辑了，整个过程跟 Animation 动画基本上差不多。上面的代码里，我省略了一部分，那部分是用于根据是否设置的 mRepeatCount 来处理动画结束后是否需要重新开始，这些我们就不看了，我们着重梳理一个正常的流程下来即可。</p><p>所以，概括一下，这个方法里其实也就是做了三件事：</p><p>一是，根据当前时间以及动画第一帧时间还有动画持续的时长来计算当前的动画进度。</p><p>二是，确保这个动画进度的取值在 0-1 之间，这里调用了两个方法来辅助计算，我们就不跟进去了，之所以有这么多的辅助计算，那是因为，属性动画支持 <code>setRepeatCount()</code> 来设置动画的循环次数，而从始至终的动画第一帧的时间都是 mStrtTime 一个值，所以在第一个步骤中根据当前时间计算动画进度时会发现进度值是可能会超过 1 的，比如 1.5, 2.5, 3.5 等等，所以第二个步骤的辅助计算，就是将这些值等价换算到 0-1 之间。</p><p>三就是最重要的了，当前帧的动画进度计算完毕之后，就是需要应用到动画效果上面了，所以 <code>animateValue()</code> 方法的意义就是类似于 Animation 动画中的 <code>applyTransformation()</code>。</p><p>我们都说，属性动画是通过修改属性值来达到动画效果的，那么我们就跟着 <code>animateValue()</code> 进去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ValueAnimator#animateValue()
void animateValue(float fraction) {
    //1.将初步计算得到的动画进度通过插值器转换，得出实际的动画进度值
    fraction = mInterpolator.getInterpolation(fraction);
    //2.当经过插值器转换后的动画进度保存在成员变量，供外部注册进度监听时，可以获取到当前帧动画进度
    mCurrentFraction = fraction;

    //3.根据关键帧机制，将动画进度值映射到我们所需的值
    int numValues = mValues.length;
    for(int i=0; i&lt;numValues; ++i) {
        mValues[i].calculateValue(fraction);
    }

    //4.回调动画进度接口，通知外部，因为先经过上面的计算步骤，所以当通知外部时，外部此时已经获取到计算之后的动画进度值以及映射之后的数值
    if(mUpdateListeners != null) {
        int numListeners = mUpdateListeners.size();
        for(int i=0; i&lt;numListeners; ++i) {
            mUpdateListeners.get(i).onAnimationUpdate(this);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里干的活我也大概的给划分成了三件事：</p><p>一是，根据插值器来计算当前的真正的动画进度，插值器算是动画里比较重要的一个概念了，可能平时用的少，如果我们没有明确指定使用哪个插值器，那么系统通常会有一个默认的插值器。</p><p>二是，根据插值器计算得到的实际动画进度值，来映射到我们需要的数值。这么说吧，就算经过了插值器计算之后，动画进度值也只是 0-1 区间内的某个值而已。而我们通常需要的并不是 0-1 的数值，比如我们希望一个 0-500 的变化，那么我们就需要自己在拿到 0-1 区间的进度值后来进行转换。第二个步骤，大体上的工作就是帮助我们处理这个工作，我们只需要告诉 ValueAnimator 我们需要 0-500 的变化，那么它在拿到进度值后会进行转换。</p><p>三就只是通知动画的进度回调而已了。</p><p>流程上差不多已经梳理出来了，不过我个人对于内部是如何根据拿到的 0-1 区间的进度值转换成我们指定区间的数值的工作挺感兴趣的，那么我们就稍微再深入去分析一下好了。这部分工作主要就是调用了 <code>mValues[i].calculateValue(fraction)</code> 这一行代码来实现，mValues 是一个 PropertyValuesHolder 类型的数组，所以关键就是去看看这个类的 <code>calculateValue()</code> 做了啥：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PropertyValuesHolder#calculateValue()
void calculateValue(float fraction) {
    //1. 通过mKeyframes.getValue()来进行映射的工作
    Object value = mKeyframes.getValue(fraction);
    
    //2. 将映射之后的数值保存在成员变量里，供外部在进度回调中读取，是一个Object对象，这就是为什么外部在进度回调中通过getAnimationValue()后需要进行强转才能得到当前帧的数值
    mAniamtedValue = mConverter == null ? value : mConverter.convert(value);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们在使用 ValueAnimator 时，注册了动画进度回调，然后在回调里取当前的值时其实也就是取到上面那个 mAnimatedValue 变量的值，而这个变量的值是通过 <code>mKeyframes.getValue()</code> 计算出来的，那么再继续跟进看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Keyframes#getValue()
Object getValue(float fraction);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>KeyFrames 是一个接口，那么接下去就是要找找哪里实现了这个接口：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//PropertyValuesHolder#setIntValues()
public void setIntValues(int... values) {
    mValueType = int.class;
    //1. mKeyframes 是 KeyframeSet的实例，所以是KeyframeSet实现了上述接口
    mKeyframes = KeyframeSet.ofInt(values);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体的找法，可以在 PropertyValuesHolder 这个类里利用 <code>Ctrl + F</code> 过滤一下 <code>mKeyframes = </code>来看一下它在哪些地方被实例化了。匹配到的地方很多，但都差不多，都是通过 KeyframeSet 的 ofXXX 方法实例化得到的对象，那么具体的实现应该就是在 KeyframeSet 这个类里了。</p><p>在跟进去看之前，有一点想提一下，大伙应该注意到了吧，mKeyframes 实例化的这些地方，<code>ofInt()</code>，<code>onFloat()</code> 等等是不是很熟悉。没错，就是我们创建属性动画时相似的方法名， 其实 <code>ValueAnimator.ofInt()</code> 内部会根据相应的方法来创建 mKeyframes 对象，也就是说，在实例化属性动画时，这些 mKeyframes 也顺便被实例化了。想确认的，大伙可以自己去跟下源码看看，我这里就不贴了。</p><p>好了，接下去看看 KeyframeSet 这个类的 <code>ofInt()</code> 方法，看看它内部具体是创建了什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//KeyframeSet#ofInt()
public static KeyframeSet ofInt(int... values) {
    //1. 参数的个数对应着关键帧的数量
    int numKeyframes = values.length;
    IntKeyframe = keyframes[] = new IntKeyframe[Math.max(numKeyframes, 2)];
    
    //2.如果只有一个参数时，即外部是这样使用动画的：ValueAnimator.ofInt(100)。那么，参数值就作为最后一帧。
    if(numKeyframe == 1) {
        keyframes[0] = (IntKeyframe) Keyframe.ofInt(0f);
        keyframes[1] = (IntKeyframe) Keyframe.ofInt(1f, values[0]);
    } else {
        //3.如果超过1个参数，那么就按参数个数创建对应数量的关键帧，每一个关键帧对应在动画进度中的位置，按顺序来平均分配
        keyframes[0] = (IntKeyframe) Keyframe.ofInt(0f, valued[0]);
        for(int i=1; i&lt;numKeyframes; ++i) {
            keyframes[i] = 
                (IntKeyframe) Keyframe.ofInt((float)i / (numKeyframes - 1), values[i]);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里又涉及到新的机制了吧，Keyframe，KeyframeSet，Keyframes 这些大伙感兴趣可以去查查看，我也没有深入去了解。但看了别人的一些介绍，这里大概讲一下。直接从翻译上来看，这个也就是指关键帧，就像一部电影由多帧画面组成一样的道理，动画也是由一帧帧组成的。</p><p>还记得，我们为啥会跟到这里来了么。动画在处理当前帧的工作时，会去计算当前帧的动画进度，然后根据这个 0-1 区间的进度，映射到我们需要的数值，而这个映射之后的数值就是通过 mKeyframes 的 <code>getValue()</code> 里取到的，mKeyframes 是一个 KeyframeSet 对象，在创建属性动画时也顺带被创建了，而创建属性动画时，我们会传入一个我们想要的数值，如 <code>ValueAnimator.ofInt(100)</code> 就表示我们想要的动画变化范围是 0-100，那么这个 100 在内部也会被传给 <code>KeyframeSet.ofInt(100)</code>，然后就是进入到上面代码块里的创建工作了。</p><p>在这个方法里，100 就是作为一个关键帧。那么，对于一个动画来说，什么才叫做关键帧呢？很明显，至少动画需要知道从哪开始，到哪结束，是吧？所以，对于一个动画来说，至少需要两个关键帧，如果我们调用 <code>ofInt(100)</code> 只传进来一个数值时，那么内部它就默认认为起点是从 0 开始，传进来的 100 就是结束的关键帧，所以内部就会自己创建了两个关键帧。</p><p>那么，这些关键帧又是怎么被动画用上的呢？这就是回到我们最初跟踪的 <code>mKeyframes.getValue()</code> 这个方法里去了，看上面的代码块，<code>KeyframeSet.ofInt()</code> 最后是创建了一个 IntKeyframeSet 对象，所以我们跟进这个类的 <code>getValue()</code> 方法里看看它是怎么使用这些关键帧的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//IntKeyframeSet#getValue()
public Object getValue(float fraction) {
    return getIntValue(fraction);
}

//下面代码先全部折叠起来，先看一下整个方法的整体框架，大体都做了哪些事，后面再每个步骤详细分析
@Override
public int getIntValue(float fraction) {
    //1. 当只有两个关键帧时，也就是只指定了第一帧和最后一帧的数值时，如 ValueAnimator.ofInt(0, 100),ValueAnimator.ofInt(100);
    // 这种情况下，单独处理动画进度映射到所需的数值的逻辑
    if(mNumKeyframes == 2) {
        ...
    }

    //2. 当关键帧超过两个时，处理动画进度映射到所需数值的逻辑计算
    if (fraction &lt;= 0f) {
        //2.1 第一帧映射的计算逻辑
        ... 
    } else if(fraction &gt;= 1f) {
        //2.2 最后一帧映射的计算逻辑
        ...
    }
    //2.3 中间帧映射的计算逻辑
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以关键的工作就都在 <code>getIntValue()</code> 这里了，参数传进来还记得是什么吧，就是经过插值器计算之后当前帧的动画进度值，0-1 区间的那个值，<code>getIntValue()</code> 这个方法的代码有些多，我们一块一块来看，先看第一块：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//IntKeyframeSet#getIntValue()
public int getIntValue(float fraction) {
    //1. 当只有两个关键帧时的映射逻辑
    if(mNumKeyframes == 2) {
        //1.1 先获取指定的第一帧和最后一帧的数值
        if(firstTime) {
            firstTime = false;
            firstValue = ((IntKeyframe) mKeyframes.get(0)).getIntValue();
            lastValue = ((IntKeyframe) mKeyframes.get(1)).getIntValue();
            deltaValue = lastValue - firstValue;
        }
        ...
        //1.2 mEvaluator表示估值器
        if(mEvaluator == null) {
            //1.3 如果没有设置估值器，那么按照线性，也就是等比例进行映射
            return firstValue + (int)(fraction * deltaValue);
        } else {
            //1.4 如果有设置估值器，那么按照估值器的规则进行映射
            return ((Number)mEvaluator.evaluate(fraction, firstValue, lastValue)).intValue();
        }
    }

    //2. 当关键帧超过两个时的映射处理逻辑
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当关键帧只有两帧时，我们常使用的 <code>ValueAnimator.ofInt(100)</code>， 内部其实就是只创建了两个关键帧，一个是起点 0，一个是结束点 100。那么，在这种只有两帧的情况下，将 0-1 的动画进度值转换成我们需要的 0-100 区间内的值，系统的处理很简单，如果没有设置估值器，也就是 mEvaluator，那么就直接是按比例来转换，比如进度为 0.5，那按比例转换就是 (100 - 0) * 0.5 = 50。如果有设置估值器，那就按照估值器定的规则来，估值器其实就是类似于插值器，属性动画里才引入的概念，Animation 动画并没有，因为只有属性动画内部才帮我们做了值转换工作。</p><p>上面是当关键帧只有两帧时的处理逻辑，那么当关键帧超过两帧的时候呢：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//IntKeyframeSet#getIntValue()
public int getIntValue(float fraction) {
    //1. 当只有两个关键帧时的映射逻辑
    ...
    
    //2. 当关键帧超过两个时的映射逻辑
    if (fraction &lt;= 0f) {
        //2.1 第一帧映射的计算逻辑
        ... 
    } else if(fraction &gt;= 1f) {
        //2.2 最后一帧映射的计算逻辑
        ...
    }
    //2.3 中间帧映射的计算逻辑
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当关键帧超过两帧时，分三种情况来处理：第一帧的处理；最后一帧的处理；中间帧的处理；</p><p>那么，什么时候关键帧会超过两帧呢？其实也就是我们这么使用的时候：<code>ValueAnimator.ofInt(0, 100, 0, -100, 0)</code>，类似这种用法的时候关键帧就不止两个了，这时候数量就是根据参数的个数来决定的了。</p><p>那么，我们再来详细看看三种情况的处理逻辑，首先是第一帧的处理逻辑：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//IntKeyframeSet#getIntValue()
public int getIntValue(float fraction) {
    //1. 当只有两个关键帧时的映射逻辑
    ...
    
    //2. 当关键帧超过两个时的映射逻辑
    if (fraction &lt;= 0f) {
        //2.1 第一帧映射的计算逻辑

        //2.1.1 获取设定的第一帧和第二帧的数值
        final IntKeyframe prevKeyframe = (IntKeyframe) mKeyframes.get(0);
        final IntKeyframe nextKeyframe = (IntKeyframe) mKeyframes.get(1);
        int prevValue = prevKeyframe.getIntValue();
        int nextValue = nextKeyframe.getIntValue();
        float prevFraction = prevKeyframe.getFraction();
        float nextFraction = nextKeyframe.getFraction();
        ...

        //2.1.2 将动画进度按等比例转换成在第一帧到第二帧之间的进度
        float intervalFraction = (fraction - prevFraction) / (nextFraction - prevFraction);
        //2.1.3 转换之后的进度值就可以看做是只有两帧的场景了，映射逻辑就可以按照只有两帧时来进行处理了
        return mEvaluator == null ?
                prevValue + (int)(intervalFraction * (nextValue - prevValue)) :
                ((Number)mEvaluator.evaluate(intervalFraction, prevValue, nextValue)).intValue();

    } else if(fraction &gt;= 1f) {
        //2.2 最后一帧映射的计算逻辑
        ...
    }
    //2.3 中间帧映射的计算逻辑
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>fraction &lt;= 0f 表示的应该不止是第一帧的意思，但除了理解成第一帧外，我不清楚其他场景是什么，暂时以第一帧来理解，这个应该影响不大。</p><p>处理的逻辑其实也很简单，还记得当只有两个关键帧时是怎么处理的吧。那在处理第一帧的工作时，只需要将第二帧当成是最后一帧，那么第一帧和第二帧这样也就可以看成是只有两帧的场景了吧。但是参数 fraction 动画进度是以实际第一帧到最后一帧计算出来的，所以需要先对它进行转换，换算出它在第一帧到第二帧之间的进度，接下去的逻辑也就跟处理两帧时的逻辑是一样的了。</p><p>同样的道理，在处理最后一帧时，只需要取出倒数第一帧跟倒数第二帧的信息，然后将进度换算到这两针之间的进度，接下去的处理逻辑也就是一样的了。代码我就不贴了。</p><p>但处理中间帧的逻辑就不一样了，因为根据 0-1 的动画进度，我们可以很容易区分是处于第一帧还是最后一帧，无非一个就是 0，一个是 1。但是，当动画进度值在 0-1 之间时，我们并没有办法直接看出这个进度值是落在中间的哪两个关键帧之间，如果有办法计算出当前的动画进度处于哪两个关键帧之间，那么接下去的逻辑也就是一样的了，所以关键就是在于找出当前进度处于哪两个关键帧之间：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//IntKeyframeSet#getIntValue()
public int getIntValue(float fraction) {
    //1. 当只有两个关键帧时的映射逻辑
    ...
    
    //2. 当关键帧超过两个时的映射逻辑
    if (fraction &lt;= 0f) {
        //2.1 第一帧映射的计算逻辑
        ...
    } else if(fraction &gt;= 1f) {
        //2.2 最后一帧映射的计算逻辑（原理同处理第一帧时的一样）
        ...
    }

    //2.3 中间帧映射的计算逻辑
    IntKeyframe prevKeyframe = (IntKeyframe) mKeyframes.get(0);
    //2.3.1 只要找出当前动画进度落于哪两个关键帧之间，那么后面的处理逻辑就同上诉2.1或2.2的步骤是一样的了
    for (int i = 1; i &lt; mNumKeyframes; ++i) {
        IntKeyframe nextKeyframe = (IntKeyframe) mKeyframes.get(i);
        if (fraction &lt; nextKeyframe.getFraction()) {
            ...

            float intervalFraction = (fraction - prevKeyframe.getFraction()) /
                (nextKeyframe.getFraction() - prevKeyframe.getFraction());
            int prevValue = prevKeyframe.getIntValue();
            int nextValue = nextKeyframe.getIntValue();
            return mEvaluator == null ?
                    prevValue + (int)(intervalFraction * (nextValue - prevValue)) :
                    ((Number)mEvaluator.evaluate(intervalFraction, prevValue, nextValue)).intValue();
        }
        prevKeyframe = nextKeyframe;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>系统的找法也很简单，从第一帧开始，按顺序遍历每一帧，然后去判断当前的动画进度跟这一帧保存的位置信息来找出当前进度是否就是落在某两个关键帧之间。因为每个关键帧保存的信息除了有它对应的值之外，还有一个是它在第一帧到最后一帧之间的哪个位置，至于这个位置的取值是什么，这就是由在创建这一系列关键帧时来控制的了。</p><p>还记得是在哪里创建了这一系列的关键帧的吧，回去 KeyframeSet 的 <code>ofInt()</code> 里看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//KeyframeSet#ofInt()
public static KeyframeSet ofInt(int... values) {
    ...
        for(int i=1; i&lt;numKeyframes; ++i) {
            keyframes[i] = 
                (IntKeyframe) Keyframe.ofInt((float)i / (numKeyframes - 1), values[i]);
        }
    
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在创建每个关键帧时，传入了两个参数，第一个参数就是表示这个关键帧在整个区域之间的位置，第二参数就是它表示的值是多少。看上面的代码， i 表示的是第几帧，numKeyframes 表示的是关键帧的总数量，所以 i/(numKeyframes - 1) 也就是表示这一系列关键帧是按等比例来分配的。</p><p>比如说， <code>ValueAnimator.ofInt(0, 50, 100, 200)</code>，这总共有四个关键帧，那么按等比例分配，第一帧就是在起点位置 0，第二帧在 1/3 位置，第三帧在 2/3 的位置，最后一帧就是在 1 的位置。</p><hr><h2 id="小结2" tabindex="-1"><a class="header-anchor" href="#小结2" aria-hidden="true">#</a> 小结2：</h2><p>到这里，我们再来梳理一下后面部分过的内容：</p><ol><li><p><strong>当接收到屏幕刷新信号后，AnimationHandler 会去遍历列表，将所有待执行的属性动画都取出来去计算当前帧的动画行为。</strong></p></li><li><p><strong>每个动画在处理当前帧的动画逻辑时，首先会先根据当前时间和动画第一帧时间以及动画的持续时长来初步计算出当前帧时动画所处的进度，然后会将这个进度值等价转换到 0-1 区间之内。</strong></p></li><li><p><strong>接着，插值器会将这个经过初步计算之后的进度值根据设定的规则计算出实际的动画进度值，取值也是在 0-1 区间内。</strong></p></li><li><p><strong>计算出当前帧动画的实际进度之后，会将这个进度值交给关键帧机制，来换算出我们需要的值，比如 ValueAnimator.ofInt(0, 100) 表示我们需要的值变化范围是从 0-100，那么插值器计算出的进度值是 0-1 之间的，接下去就需要借助关键帧机制来映射到 0-100 之间。</strong></p></li><li><p><strong>关键帧的数量是由 ValueAnimator.ofInt(0, 1, 2, 3) 参数的数量来决定的，比如这个就有四个关键帧，第一帧和最后一帧是必须的，所以最少会有两个关键帧，如果参数只有一个，那么第一帧默认为 0，最后一帧就是参数的值。当调用了这个 ofInt() 方法时，关键帧组也就被创建了。</strong></p></li><li><p><strong>当只有两个关键帧时，映射的规则是，如果没有设置估值器，那么就等比例映射，比如动画进度为 0.5，需要的值变化区间是 0-100，那么等比例映射后的值就是 50，那么我们在 onAnimationUpdate 的回调中通过 animation.getAnimatedValue() 获取到的值 50 就是这么来的。</strong></p></li><li><p><strong>如果有设置估值器，那么就按估值器的规则来进行映射。</strong></p></li><li><p><strong>当关键帧超过两个时，需要先找到当前动画进度是落于哪两个关键帧之间，然后将这个进度值先映射到这两个关键帧之间的取值，接着就可以将这两个关键帧看成是第一帧和最后一帧，那么就可以按照只有两个关键帧的情况下的映射规则来进行计算了。</strong></p></li><li><p><strong>而进度值映射到两个关键帧之间的取值，这就需要知道每个关键帧在整个关键帧组中的位置信息，或者说权重。而这个位置信息是在创建每个关键帧时就传进来的。onInt() 的规则是所有关键帧按等比例来分配权重，比如有三个关键帧，第一帧是 0，那么第二帧就是 0.5， 最后一帧 1。</strong></p></li></ol><p>至此，我们已经将整个流程梳理出来了，<strong>两部分小结</strong>的内容整合起来就是这次梳理出来的整个属性动画从 <code>start()</code> 之后，到我们在 onAnimationUpdate 回调中取到我们需要的值，再到动画结束后如何清理资源的整个过程中的原理解析。</p><p>梳理清楚后，大伙应该就要清楚，属性动画是如何接收到屏幕刷新信号事件的？是如何反复接收到屏幕刷新信号事件直到整个动画执行结束？方式是否是有区别于 Animation 动画的？计算当前帧的动画工作都包括了哪些？是如何将 0-1 的动画进度映射到我们需要的值上面的？</p><p>如果看完本篇，这些问题你心里都有谱了，那么就说明，本篇的主要内容你都吸收进去了。当然，如果有错的地方，欢迎指出来，毕竟内容确实很多，很有可能存在写错的地方没发现。</p><p>来张时序图结尾：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-6d825c6da4d4a7a4.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="VauleAnimatior运行原理时序图.png"></p><p>最后，有一点想提的是，我们本篇只是过完了 ValueAnimator 的整个流程原理，但这整个过程中，注意到了没有，我们并没有看到有任何一个地方涉及到了 ui 操作。在上一篇博客 <em><strong>Android 屏幕刷新机制</strong></em>中，我们也清楚了，界面的绘制其实就是交由 ViewRootImpl 来发起的，但很显然，ValueAnimator 跟 ViewRootImpl 并没有任何交集。</p><p>那么，ValueAnimator 又是怎么实现动画效果的呢？其实，ValueAnimator 只是按照我们设定的变化区间(<code>ofInt(0, 100)</code>)，持续时长(<code>setDuration(1000)</code>)，插值器规则，估值器规则，内部在每一帧内通过一系列计算，转换等工作，最后输出每一帧一个数值而已。而如果要实现一个动画效果，那么我们只能在进度回调接口取到这个输出的值，然后手动应用到某个 View 上面(<code>mView.setX()</code>)。所以，这种使用方式，本质上仍然是通过 View 的内部方法最终走到 ViewRootImpl 去触发界面的更新绘制。</p><p>而 ObjectAnimator 却又不同了，它内部就有涉及到 ui 的操作，具体原理是什么，留待后续再分析。</p><h1 id="遗留问题" tabindex="-1"><a class="header-anchor" href="#遗留问题" aria-hidden="true">#</a> 遗留问题</h1><p>都说属性动画是通过改变属性值来达到动画效果的，计划写这一篇时，本来以为可以梳理清楚这点的，谁知道单单只是把 ValueAnimator 的流程原理梳理出来篇幅就这么长了，所以 ObjectAnimator 就另找时间再来梳理吧，这个问题就作为遗留问题了。</p><p><strong>Q1：都说属性动画是通过改变属性值来达到动画效果的，那么它的原理是什么呢？</strong></p>`,152);function p(g,f){const n=s("ExternalLinkIcon");return r(),t("div",null,[v,i("p",null,[e("之前我们已经分析过 "),i("a",c,[e("View 动画 Animation 运行原理解析"),a(n)]),e("，那么这次就来学习下属性动画的运行原理。")]),o,i("p",null,[e("在之前分析 Animation 动画运行原理后，我们也接着分析了 "),i("a",u,[e("Android 屏幕刷新机制"),a(n)]),e("，通过这两篇，我们知道了 Android 屏幕刷新的关键其实是 Choreographer 这个类，感兴趣的可以再回去看看，这里提几点里面的结论：")]),b])}const h=d(m,[["render",p],["__file","属性动画ValueAnimator全解析.html.vue"]]);export{h as default};
