import{_ as i,o as e,c as n,d as a}from"./app-fgtJnIYH.js";const d={},l=a(`<p>这次想来梳理一下 View 动画也就是补间动画（ScaleAnimation, AlphaAnimation, TranslationAnimation...）这些动画运行的流程解析。内容并不会去分析动画的呈现原理是什么，诸如 Matrix 这类的原理是什么，因为我也还没搞懂。本篇主要是分析当调用了 <code>View.startAnimation()</code> 之后，动画从开始到结束的一个运行流程是什么？</p><h1 id="提问环节" tabindex="-1"><a class="header-anchor" href="#提问环节" aria-hidden="true">#</a> 提问环节</h1><p>看源码最好是带着问题去，这样比较有目的性和针对性，可以防止阅读源码时走偏和钻牛角，所以我们就先来提几个问题。</p><p>Animation 动画的扩展性很高，系统只是简单的为我们封装了几个基本的动画：平移、旋转、透明度、缩放等等，感兴趣的可以去看看这几个动画的源码，它们都是继承自 Animation 类，然后实现了 <strong>applyTransformation()</strong> 方法，在这个方法里通过 Transformation 和 Matrix 实现各种各样炫酷的动画，所以，如果想要做出炫酷的动画效果，这些还是需要去搞懂的。</p><p>目前我也还没搞懂，能力有限，所以优先分析动画的一个运行流程。</p><p>首先看看 Animation 动画的基本用法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//1.new Animation
ScaleAnimation animation = new ScaleAnimation(0, 1, 0, 1);
//2.设置 Animation 各种参数配置
animation.setDuration(300);
animation.setFillAfter(true);
//3.启动动画
view.startAnimation(animation);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们要使用一个 View 动画时，一般都是先 new 一个动画，然后配置各种参数，最后调用动画要作用到的那个 View 的 startAnimation()， 将动画实例作为参数传进去，接下去就可以看到动画运行的效果了。</p><p>那么，问题来了：</p><p><strong>Q1：不知道大伙想过没有，当调用了 View.startAnimation() 之后，动画是马上就执行了么？</strong></p><p><strong>Q2：假如动画持续时间 300ms，当调用了 View.startAniamtion() 之后，又发起了一次界面刷新的操作，那么界面的刷新是在 300ms 之后也就是动画执行完毕之后才执行的，还是在动画执行过程中界面刷新操作就执行了呢？</strong></p><p>我们都知道，<strong>applyTransformation()</strong> 这个方法是动画生效的地方，这个方法被回调时参数会传进来当前动画的进度（0.0 ——— 1.0）。就像数学上的画曲线，当给的点越多时画的曲线越光滑，同样当这个方法被回调越多次时，动画的效果越流畅。</p><p>比如一个从 0 放大到 1280 的 View 放大动画，如果这过程该方法只回调 3 次的话，那么每次的跨度就会很大，比如 0 —— 600 —— 1280，那么这个动画效果看起来就会很突兀；相反，如果这过程该方法回调了几十次的话，那么每次跨度可能就只有 100，这样一来动画效果看起来就会很流畅。</p><p>相信大伙也都有过在 <strong>applyTransformation()</strong> 里打日志来查看当前的动画进度，有时打出的日志有十几条，有时却又有几十条。</p><p>那么我们的问题就来了：</p><p><strong>Q3：applyTransformation() 这个方法的回调次数是根据什么来决定的？</strong></p><p>好了，本篇就是主要讲解这三个问题，这三个问题搞明白的话，以后碰到动画卡顿的时候就懂得如何去分析、定位丢帧的地方了，找到丢帧的问题所在后离解决问题也就不远了。</p><h1 id="源码分析" tabindex="-1"><a class="header-anchor" href="#源码分析" aria-hidden="true">#</a> 源码分析</h1><p>ps:本篇分析的源码全都基于 android-25 版本。</p><h2 id="view-startanimation" tabindex="-1"><a class="header-anchor" href="#view-startanimation" aria-hidden="true">#</a> View.startAnimation()</h2><p>刚开始接触源码分析可能不清楚该从哪入手，建议可以从我们使用它的地方来 <code>startAnimation()</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#startAnimation()
public void startAnimation(Animation animation) {
    animation.setStartTime(Animation.START_ON_FIRST_FRAME);
    setAnimation(animation);
    invalidateParentCaches();
    invalidate(true);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码不多，调用了四个方法，那么一个个跟进去看看，先是 <code>setStartTime()</code> ：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Animation#setStartTime()
public void setStartTime(long startTimeMillis) {
    mStartTime = startTimeMillis;
    mStarted = mEnded = false;
    mCycleFlip = false;
    mRepeated = 0;
    mMore = true;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以这里只是对动画的一些变量进行初始化赋值，并没有运行动画的逻辑，继续看看 <code>setAnimation()</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#setAnimation()
public void setAnimation(Animation animation) {
    mCurrentAnimation = animation;

    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>View 里面有一个 Animation 类型的成员变量 mCurrentAnimation，所以这个方法其实是将我们 new 的 ScaleAnimation 动画跟 View 绑定起来而已，也没有运行动画的逻辑，继续往下看看 <code>invalidateParentCached()</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#invalidateParentCaches()
protected void invalidateParentCaches() {
    if (mParent instanceof View) {
        ((View) mParent).mPrivateFlags |= PFLAG_INVALIDATED;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>invalidateParentCaches()</code> 这方法更简单，给 mPrivateFlags 添加了一个标志位，虽然还不清楚干嘛的，但可以先留个心眼，因为 mPrivateFlags 这个变量在阅读跟 View 相关的源码时经常碰到，那么可以的话能搞明白就搞明白，但目前跟我们想要找出动画到底什么时候开始执行的关系好像不大，先略过，继续跟进 <code>invalidate()</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#invalidate()
void invalidate(boolean invalidateCache) {
    invalidateInternal(0, 0, mRight - mLeft, mBottom - mTop, invalidateCache, true);
}

//View#invalidateInternal()
void invalidateInternal(int l, int t, int r, int b, boolean invalidateCache, boolean fullInvalidate) {
    ...

    if (...) {
        ...

        final AttachInfo ai = mAttachInfo;
        //1.mParent 一般是 ViewGroup，下面其实是调用了 ViewGroup 的 invalidateChild()
        final ViewParent p = mParent;
        if (p != null &amp;&amp; ai != null &amp;&amp; l &lt; r &amp;&amp; t &lt; b) {
            final Rect damage = ai.mTmpInvalRect;
            damage.set(l, t, r, b);
            //2.注意这里的第二个参数 damage，后面会用到，在这里注意下它不为null，而且也不是isEmpty即可
            p.invalidateChild(this, damage);
        }

        ...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以 <code>invalidate()</code> 内部其实是调用了 ViewGroup 的 <code>invalidateChild()</code>，再跟进看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewGroup#invalidateChild()  
public final void invalidateChild(View child, final Rect dirty) {
    //1. 注意这里，下面的do{}while()循环会用到
    ViewParent parent = this;

    final AttachInfo attachInfo = mAttachInfo;
    if (attachInfo != null) {
        ...

        do {
            ...  
            //2.第一次循环的时候 parent 是 this 即 ViewGroup 本身，循环终止条件是 parent == null，所以可以猜测这个方法会返回当前ViewGroup的parent，跟进确认一下
            parent = parent.invalidateChildInParent(location, dirty);
            ...
        } while (parent != null);
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里有一个 do{}while() 的循环操作，第一次循环的时候 parent 是 this，即 ViewGroup 本身，所以接下去就是调用 ViewGroup 本身的 <code>invalidateChildInParent()</code> 方法，然后循环终止条件是 patent == null，所以可以猜测这个方法返回的应该是 ViewGroup 的 parent，跟进看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewGroup#invalidateChildInParent()  
public ViewParent invalidateChildInParent(final int[] location, final Rect dirty) {
    //1.当满足if条件时，就会返回 mParent，否则返回 null。
    if ((mPrivateFlags &amp; PFLAG_DRAWN) == PFLAG_DRAWN ||
            (mPrivateFlags &amp; PFLAG_DRAWING_CACHE_VALID) == PFLAG_DRAWING_CACHE_VALID) {

        if (...) {
            ...

            return mParent;

        } else {
            ...

            return mParent;
        }
    }

    return null;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以关键是 PFLAG_DRAWN 和 PFLAG_DRAWING_CACHE_VALID 这两个是什么时候赋值给 mPrivateFlags，因为只要有两个标志中的一个时，该方法就会返回 mParent，具体赋值的地方还不大清楚，但能确定的是动画执行时，它是满足 if 条件的，也就是这个方法会返回 mParent。</p><p>一个具体的 View 的 mParent 是 ViewGroup，ViewGroup 的 mParent 也是 ViewGoup，所以在 do{}while() 循环里会一直不断的寻找 mParent，而一颗 View 树最顶端的 mParent 是 ViewRootImpl，所以最终是会走到了 ViewRootImpl 的 <code>invalidateChildInParent()</code> 里去了。</p><p>至于一个界面的 View 树最顶端为什么是 ViewRootImpl，这个就跟 Activity 启动过程有关了。我们都清楚，<strong>在 onCreate 里 setContentView() 的时候，是将我们自己写的布局文件添加到以 DecorView 为根布局的一个 ViewGroup 里，也就是说 DevorView 才是 View 树的根布局，那为什么又说 View 树最顶端其实是 ViewRootImpl 呢？</strong></p><p>这是因为在 <code>onResume()</code> 执行完后，WindowManager 将会执行 <code>addView()</code>，然后在这里面会去创建一个 ViewRootImpl 对象，接着将 DecorView 跟 ViewRootImpl 对象绑定起来，并且将 DecorView 的 mParent 设置成 ViewRootImpl，而 ViewRootImpl 是实现了 ViewParent 接口的，所以虽然 ViewRootImpl 没有继承 View 或 ViewGroup，但它确实是 DecorView 的 parent。这部分内容应该属于 Activity 的启动过程相关原理的，所以本篇只给出结论，不深入分析了，感兴趣的可以自行搜索一下。</p><p>那么我们继续返回到寻找动画执行的地方，我们跟到了 ViewRootImpl 的 <code>invalidateChildInParent()</code> 里去了，看看它做了些什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ViewRootImpl#invalidateChildInParent()  
public ViewParent invalidateChildInParent(int[] location, Rect dirty) {
    ...

    //1.所有return 都为null
    if (dirty == null) {
        invalidate();
        return null;
    } else if (dirty.isEmpty() &amp;&amp; !mIsAnimating) {
        return null;
    }

    ...
    //2.
    invalidateRectOnScreen(dirty);

    return null;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先第一点，它的所有返回值都是 null，所以之前那个 do{}while() 循环最终就是执行到这里后肯定就会停止了。然后参数 dirty 是在最初 View 的 <code>invalidateInternal()</code> 里层层传递过来的，还记得当初叫大伙要稍微注意一下这个参数么，也就是在这里它不为空，也不是 isEmpty，所以继续跟到 <code>invalidateRectOnScreen()</code> 方法里看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewRootImpl#invalidateRectOnScreen()
private void invalidateRectOnScreen(Rect dirty) {
    ...
    if (!mWillDrawSoon &amp;&amp; (intersected || mIsAnimating)) {
        //1.跟到这里看到这个方法就可以停住了
        scheduleTraversals();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>跟到这里就可以了，<code>scheduleTraversals()</code> 作用是将 <code>performTraversals()</code> 封装到一个 Runnable 里面，然后扔到 Choreographer 的待执行队列里，这些待执行的 Runnable 将会在最近的一个 16.6 ms 屏幕刷新信号到来的时候被执行。而 <code>performTraversals()</code> 是 View 的三大操作：测量、布局、绘制的发起者。</p><p><strong>View 树里面不管哪个 View 发起了布局请求、绘制请求，统统最终都会走到 ViewRootImpl 里的 scheduleTraversals()，然后在最近的一个屏幕刷新信号到了的时候再通过 ViewRootImpl 的 performTraversals() 从根布局 DecorView 开始依次遍历 View 树去执行测量、布局、绘制三大操作。这也是为什么一直要求页面布局层次不能太深，因为每一次的页面刷新都会先走到 ViewRootImpl 里，然后再层层遍历到具体发生改变的 View 里去执行相应的布局或绘制操作。</strong></p><p>这些内容应该是属于 Android 屏幕刷新机制的，这里就先只给出结论，具体分析我会在几天后再发一篇博客出来。</p><p>所以，我们从 <code>View.startAnimation()</code> 开始跟进源码分析的这一过程中，也可以看出，执行动画，其实内部会调用 View 的重绘请求操作 <code>invalidate()</code> ，所以最终会走到 ViewRootImpl 的 <code>scheduleTraversals()</code>，然后在下一个屏幕刷新信号到的时候去遍历 View 树刷新屏幕。</p><p>那么，到这里可以得到的结论是：</p><p><strong>当调用了 View.startAniamtion() 之后，动画并没有马上就被执行，这个方法只是做了一些变量初始化操作，接着将 View 和 Animation 绑定起来，然后调用重绘请求操作，内部层层寻找 mParent，最终走到 ViewRootImpl 的 scheduleTraversals 里发起一个遍历 View 树的请求，这个请求会在最近的一个屏幕刷新信号到来的时候被执行，调用 performTraversals 从根布局 DecorView 开始遍历 View 树。</strong></p><h2 id="动画真正执行的地方" tabindex="-1"><a class="header-anchor" href="#动画真正执行的地方" aria-hidden="true">#</a> 动画真正执行的地方</h2><p>那么，到这里，我们可以猜测，动画其实真正执行的地方应该是在 ViewRootImpl 发起的遍历 View 树的这个过程中。测量、布局、绘制，View 显示到屏幕上的三个基本操作都是由 ViewRootImpl 的 <code>performTraversals()</code> 来控制，而作为 View 树最顶端的 parent，要控制这颗 Veiw 树的三个基本操作，只能通过层层遍历。所以，测量、布局、绘制三个基本操作的执行都会是一次遍历操作。</p><p>我在跟着这三个流程走的时候，最后发现，在跟着绘制流程走的时候，看到了跟动画相关的代码，所以我们就跳过其他两个流程，直接看绘制流程：</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-baa80bd0e507de89.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="绘制流程.png"></p><p>这张图不是我画的，在网上找的，绘制流程的开始是由 ViewRootImpl 发起的，然后从 DecorView 开始遍历 View 树。而遍历的实现，是在 View#draw() 方法里的。我们可以看看这个方法的注释：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#draw(Canvas canvas)
public void draw(Canvas canvas) {
    ...
    /*
     * Draw traversal performs several drawing steps which must be executed
     * in the appropriate order:
     *
     *      1. Draw the background //绘制背景
     *      2. If necessary, save the canvas&#39; layers to prepare for fading 
     *      3. Draw view&#39;s content //调用onDraw()绘制自己
     *      4. Draw children       //调用dispatchDraw()绘制子View
     *      5. If necessary, draw the fading edges and restore layers
     *      6. Draw decorations (scrollbars for instance)
     */
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法里做了上述六件事，而主要的工作就是我大体上翻译出来的 <code>1, 3, 4</code> 三点，也就是 View 会先绘制本身的背景，然后如果本身需要绘制，就会去调用自己的 <code>onDraw()</code>，接着如果有子 View，就会调用<code>dispatchDraw()</code> 将绘制事件通知给子 View。而 ViewGroup 重写了 <code>dispatchDraw()</code> 调用了 <code>drawChild()</code>， <code>drawChild()</code> 又调用了子 View 的 <code>draw(Canvas, ViewGroup, long)</code>，而 <code>draw(Canvas, ViewGroup, long)</code> 这个方法又会去调用到 <code>draw(Canvas)</code> 方法，所以这样就达到了遍历的效果。整个流程就像上上图中画的那样。</p><p>在这个流程中，当跟到 <code>draw(Canvas, ViewGroup, long)</code> 里时，发现了跟动画相关的代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#draw(Canvas canvas, ViewGroup parent, long drawingTime)  
boolean draw(Canvas canvas, ViewGroup parent, long drawingTime) {
    ...

    boolean more = false;
    ...
    //1.获取View绑定的动画
    final Animation a = getAnimation();
    if (a != null) {
        //2.如果View有绑定动画，执行动画相关逻辑
        more = applyLegacyAnimation(parent, drawingTime, a, scalingRequired);
        ...
    } ...
    
    ...

    return more;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还记得我们调用 <code>View.startAnimation(Animation)</code> 时将传进来的 Animation 赋值给 mCurrentAnimation 了么。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#getAnimation()
public Animation getAnimation() {
    return mCurrentAnimation;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以当时传进来的 Animation ，现在拿出来用了，那么动画真正执行的地方应该也就是在 <code>applyLegacyAnimation()</code> 方法里了（该方法在 android-22 版本及之前的命名是 drawAnimation）</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#applyLegacyAnimation()
private boolean applyLegacyAnimation(ViewGroup parent, long drawingTime, Animation a, boolean scalingRequired) {
        
    Transformation invalidationTransform;
    final int flags = parent.mGroupFlags;
    final boolean initialized = a.isInitialized();
    if (!initialized) {
        //1.动画初始化
        a.initialize(mRight - mLeft, mBottom - mTop, parent.getWidth(), parent.getHeight());
        a.initializeInvalidateRegion(0, 0, mRight - mLeft, mBottom - mTop);
        if (mAttachInfo != null) a.setListenerHandler(mAttachInfo.mHandler);
        //2.通知动画开始
        onAnimationStart();
    }

    final Transformation t = parent.getChildTransformation();
    //3.调用动画的getTransfomation()计算动画
    boolean more = a.getTransformation(drawingTime, t, 1f);
    
    ...
        
    return more;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这下确定动画真正开始执行是在什么地方了吧，都看到 <code>onAnimationStart()</code> 了，也看到了对动画进行初始化，以及调用了 Animation 的 <code>getTransformation()</code>，这个方法是动画的核心，再跟进去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Animation#getTransformation()
public boolean getTransformation(long currentTime, Transformation outTransformation) {
    //1.记录动画第一帧时间
    if (mStartTime == -1) {
        mStartTime = currentTime;
    }

    final long startOffset = getStartOffset();//动画延迟开始时间，默认为0
    final long duration = mDuration;//动画持续时间
    float normalizedTime;
    if (duration != 0) {
        //2.计算动画的进度：根据（当前时间 - 动画第一帧时间） / 动画持续时间
        normalizedTime = ((float) (currentTime - (mStartTime + startOffset))) / (float) duration;
    } ...

    //3.确保动画进度在 0.0 ---- 1.0 之间
    if (!mFillEnabled) normalizedTime = Math.max(Math.min(normalizedTime, 1.0f), 0.0f);

    if ((normalizedTime &gt;= 0.0f || mFillBefore) &amp;&amp; (normalizedTime &lt;= 1.0f || mFillAfter)) {
        ...

        if (mFillEnabled) normalizedTime = Math.max(Math.min(normalizedTime, 1.0f), 0.0f);

        ...

        //4.根据插值器计算实际的动画进度
        final float interpolatedTime = mInterpolator.getInterpolation(normalizedTime);
        //5.根据动画进度应用动画效果
        applyTransformation(interpolatedTime, outTransformation);
    }

    ...    

    return mMore;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法里做了几件事：</p><ol><li>记录动画第一帧的时间</li><li>根据当前时间到动画第一帧的时间这之间的时长和动画应持续的时长来计算动画的进度</li><li>把动画进度控制在 0-1 之间，超过 1 的表示动画已经结束，重新赋值为 1 即可</li><li>根据插值器来计算动画的实际进度</li><li>调用 applyTransformation() 应用动画效果</li></ol><p>所以，到这里我们已经能确定 <code>applyTransformation()</code> 是什么时候回调的，动画是什么时候才真正开始执行的。那么 Q1 总算是搞定了，Q2 也基本能理清了。因为我们清楚， <code>applyTransformation()</code> 最终是在绘制流程中的 <code>draw()</code> 过程中执行到的，那么显然在每一帧的屏幕刷新信号来的时候，遍历 View 树是为了重新计算屏幕数据，也就是所谓的 View 的刷新，而动画只是在这个过程中顺便执行的。</p><p>接下去就是 Q3 了，我们知道 <code>applyTransformation()</code> 是动画生效的地方，这个方法不断的被回调时，参数会传进来动画的进度，所以呈现效果就是动画根据进度在运行中。</p><p><strong>但是，我们从头分析下来，找到了动画真正执行的地方，找到了 applyTransformation() 被调用的地方，但这些地方都没有看到任何一个 for 或者 while 循环啊，也就是一次 View 树的遍历绘制操作，动画也就只会执行一次而已啊？那么它是怎么被回调那么多次的？</strong></p><p>我们知道 <code>applyTransformation()</code> 是在 <code>getTransformation()</code> 里被调用的，而这个方法是有一个 boolean 返回值的，我们看看它的返回逻辑是什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Animation#getTransformation()
public boolean getTransformation(long currentTime, Transformation outTransformation) {
    ...
    //1.expired = true 表示动画已经结束或者被取消了
    final boolean expired = normalizedTime &gt;= 1.0f || isCanceled();
    mMore = !expired;

    ...    

    if (expired) {
        //2.如果设置了动画循环的次数，那么当动画结束的时候判断一下循环次数是否已经达到设定的次数，没有的话，重置第一帧时间
        if (mRepeatCount == mRepeated || isCanceled()) {
            ...    
        } else {
            ...

            mStartTime = -1;
            mMore = true;

            ...
        }
    }

    //3.综上，mMore = true 表示动画进度还没超过 1.0，也就是动画还没结束；false 表示动画已经结束或者被取消了

    if (!mMore &amp;&amp; mOneMoreTime) {
        mOneMoreTime = false;
        return true;
    }

    return mMore;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说 <code>getTransformation()</code> 的返回值代表的是动画是否完成，还记得是哪里调用的 <code>getTransformation()</code> 吧，去 <code>applyLegacyAnimation()</code> 里看看取到这个返回值后又做了什么：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#applyLegacyAnimation()  
private boolean applyLegacyAnimation(ViewGroup parent, long drawingTime, Animation a, boolean scalingRequired) {
    ...
    //1.获取返回值来查看动画是否已经结束
    boolean more = a.getTransformation(drawingTime, t, 1f);

    ...
    //2.动画还没结束时
    if (more) {
        if (!a.willChangeBounds()) { //除了 Alpha 动画默认返回 false，其余基础动画都返回 true
            ...
        } else {
            ...
            parent.mPrivateFlags |= PFLAG_DRAW_ANIMATION;

            ...
            //3.调用mParent的请求重绘操作，这个方法在开头分析startAnimation时分析过了
            parent.invalidate(left, top, left + (int) (region.width() + .5f),
                    top + (int) (region.height() + .5f));
        }
    }
    return more;

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当动画如果还没执行完，就会再调用 <code>invalidate()</code> 方法，层层通知到 ViewRootImpl 再次发起一次遍历请求，当下一帧屏幕刷新信号来的时候，再通过 <code>performTraversals()</code> 遍历 View 树绘制时，该 View 的 draw 收到通知被调用时，会再次去调用 <code>applyLegacyAnimation()</code> 方法去执行动画相关操作，包括调用 <code>getTransformation()</code> 计算动画进度，调用 <code>applyTransformation()</code> 应用动画。</p><p>也就是说，动画很流畅的情况下，其实是每隔 16.6ms 即每一帧到来的时候，执行一次 <code>applyTransformation()</code>，直到动画完成。所以这个 <code>applyTransformation()</code> 被回调多次是这么来的，而且这个回调次数并没有办法人为进行设定。</p><p>这就是为什么当动画持续时长越长时，这个方法打出的日志越多次的原因。</p><p>还记得 <code>getTransformation()</code> 方法在计算动画进度时是根据参数传进来的 currentTime 的么，而这个 currentTime 可以理解成是发起遍历操作这个时刻的系统时间（实际 currentTime 是在 Choreographer 的 doFrame() 里经过校验调整之后的一个时间，但离发起遍历操作这个时刻的系统时间相差很小，所以不深究的话，可以像上面那样理解，比较容易明白）。</p><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h2><p>综上，我们稍微整理一下：</p><ol><li><p><strong>首先，当调用了 View.startAnimation() 时动画并没有马上就执行，而是通过 invalidate() 层层通知到 ViewRootImpl 发起一次遍历 View 树的请求，而这次请求会等到接收到最近一帧到了的信号时才去发起遍历 View 树绘制操作。</strong></p></li><li><p><strong>从 DecorView 开始遍历，绘制流程在遍历时会调用到 View 的 draw() 方法，当该方法被调用时，如果 View 有绑定动画，那么会去调用applyLegacyAnimation()，这个方法是专门用来处理动画相关逻辑的。</strong></p></li><li><p><strong>在 applyLegacyAnimation() 这个方法里，如果动画还没有执行过初始化，先调用动画的初始化方法 initialized()，同时调用 onAnimationStart() 通知动画开始了，然后调用 getTransformation() 来根据当前时间计算动画进度，紧接着调用 applyTransformation() 并传入动画进度来应用动画。</strong></p></li><li><p><strong>getTransformation() 这个方法有返回值，如果动画还没结束会返回 true，动画已经结束或者被取消了返回 false。所以 applyLegacyAnimation() 会根据 getTransformation() 的返回值来决定是否通知 ViewRootImpl 再发起一次遍历请求，返回值是 true 表示动画没结束，那么就去通知 ViewRootImpl 再次发起一次遍历请求。然后当下一帧到来时，再从 DecorView 开始遍历 View 树绘制，重复上面的步骤，这样直到动画结束。</strong></p></li><li><p><strong>有一点需要注意，动画是在每一帧的绘制流程里被执行，所以动画并不是单独执行的，也就是说，如果这一帧里有一些 View 需要重绘，那么这些工作同样是在这一帧里的这次遍历 View 树的过程中完成的。每一帧只会发起一次 perfromTraversals() 操作。</strong></p></li></ol><p>以上，就是本篇所有的内容，将 View 动画 Animation 的运行流程原理梳理清楚，但要搞清楚为什么动画会出现卡顿现象的话，还需要理解 Android 屏幕的刷新机制以及消息驱动机制；这些内容将在最近几天内整理成博客分享出来。</p><h1 id="遗留问题" tabindex="-1"><a class="header-anchor" href="#遗留问题" aria-hidden="true">#</a> 遗留问题</h1><p>最后仍然遗留一些尚未解决的问题，等待继续探索：</p><p>Q1：大伙都清楚，View 动画区别于属性动画的就是 View 动画并不会对这个 View 的属性值做修改，比如平移动画，平移之后 View 还是在原来的位置上，实际位置并不会随动画的执行而移动，那么这点的原理是什么？</p><p>Q2：既然 View 动画不会改变 View 的属性值，那么如果是缩放动画时，View 需要重新执行测量操作么？</p>`,84),s=[l];function r(t,v){return e(),n("div",null,s)}const o=i(d,[["render",r],["__file","View动画Animation原理.html.vue"]]);export{o as default};
