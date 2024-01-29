import{_ as r,r as t,o as l,c as s,a as n,b as e,e as d,d as i}from"./app-fgtJnIYH.js";const m={},o=i(`<p>这次想来讲讲 <strong>View.animate()</strong>，这是一种超好用的动画实现方式，用这种方式来实现常用的动画效果非常方便，但在某些场景下会有一个坑，所以这次就来梳理一下它的原理。</p><h1 id="基础" tabindex="-1"><a class="header-anchor" href="#基础" aria-hidden="true">#</a> 基础</h1><p>首先，先来看一段代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mView.animate().sacleX(1.2f).scaleY(1.2f).alpha(0.5f).setDuration(1000).start();  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>可以有些人还没接触过这个，但并不妨碍首次理解上述代码。单从方法名上来看，上述代码就是一个实现了持续 1s 的放大 &amp; 透明度结合的动画，是不是发现使用起来特别简单，一行代码就搞定。</p><p>当然，上述的动画效果也可以通过 <strong>ValueAnimator</strong> 或 <strong>ObjectAnimator</strong> 来实现，只是可能没法像上述一样一行代码就搞定。如果用 <strong>Animation</strong> 来实现，那么需要的代码就更多了。</p><p>所以，我们的问题就来了：</p><p><strong>Q1：动画基本可以分为 Animator 和 Animation 两大类，而 View.animate() 返回的是一个 ViewPropertyAnimator 类型的对象，这个类并没有继承自任何类，那么它实现动画的原理又是什么呢？单从命名上看好像是通过 Animator 实现，那么真的是这样么？</strong></p><p><strong>Q2：开头说了，使用这种方式实现的动画在某些场景下会有一个坑，这个坑又是什么，是在什么场景下的呢？</strong></p><p>好了，下面就开始来跟着源码一起学习吧：</p><h1 id="源码解析" tabindex="-1"><a class="header-anchor" href="#源码解析" aria-hidden="true">#</a> 源码解析</h1><p>ps:本篇阅读的源码版本都是 android-25，版本不一样，源码可能会有些许差别，大伙自己过的时候注意一下。</p><p>那么，源码阅读的着手点就跟之前几篇分析动画的一样，从 <code>start()</code> 开始一步步跟踪下去就行了。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#start()
public void start() {
    mView.removeCallbacks(mAnimationStarter);
    startAnimation();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码很少就两行，第二行是调用了一个方法，看方法名可以猜测应该是去处理动画开始的工作，那么在动画开始前还移除了一个回调，但要搞清楚第一行的代码是干嘛用的，我们得先知道两个变量的含义，首先是第一个 mView：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator构造函数
ViewPropertyAnimator(View view) {
    mView = view;
    view.ensureTransformationInfo();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>mView 是一个成员变量，在构造函数中被赋值，还记得吧，要用这种方式实现动画时，都得先调用 <strong>View.animate()</strong> 来创造一个 ViewPropertyAnimator 对象，所以去 View 的 <code>animate()</code> 方法里瞧瞧：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//View#animate() 
public ViewPropertyAnimator animate() {
    if (mAnimator == null) {
        mAnimator = new ViewPropertyAnimator(this);
    }
    return mAnimator;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法里会去创建一个 ViewPropertyAnimator 对象，并将 View 自身 this 作为参数传递进去，也就是说，在 ViewPropertyAnimator 里的 mView 变量其实指向的就是要进行动画的那个 View。</p><p>知道了 mView 其实就是需要进行动画的那个 View 后，接下去来看看另一个变量 mAnimationStarter 是什么了：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator.mAnimationnStarter
private Runnable mAnimationStarter = new Runnable() {
    @Override
    public void run() {
        startAnimation();
    }
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个 Runnable 就是一个启动动画的工作，emmm，这样就有点奇怪了，我们再回过头来看看 <code>start()</code> 方法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#start()
public void start() {
    mView.removeCallbacks(mAnimationStarter);
    startAnimation();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>为什么明明方法的第二行就会去执行 <code>startAnimation()</code> 了，第一行却又要去取消一个执行 <code>startAnimation()</code> 的 Runnable 呢？</strong></p><p>只能说明，在我们调用 <code>start()</code> 之前，ViewPropertyAnimator 内部就已经预先安排了一个会执行 <code>startAnimation()</code> 的 Runnable 进入待执行状态，所以在调用了 <code>start()</code> 之后先去取消这个 Runnable 才会有意义。</p><p>那么，又是哪里会去触发安排一个 Runnable 呢？</p><p>回头再看看我们使用这种方式来实现动画效果是怎么用的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mView.animate().sacleX(1.2f).scaleY(1.2f).alpha(0.5f).setDuration(1000).start();  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>首先，通过 <code>View.animate()</code> 先创建一个 ViewPropertyAnimator 对象，中间设置了一系列动画行为，最后才调用了 <code>start()</code>。那么，有机会去触发安排一个待执行的 Runnable 操作也只能发生在中间的这些方法里了，那么我们选择一个跟进去看看，<code>scaleX()</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#scaleX()
public ViewPropertyAnimator scaleX(float value) {
    animateProperty(SCALE_X, value);
    return this;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>继续跟进去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#animateProperty()
private void animateProperty(int constantName, float toValue) {
    float fromValue = getValue(constantName);
    float deltaValue = toValue - fromValue;
    animatePropertyBy(constantName, fromValue, deltaValue);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于各个参数是什么意思，我们后面再来分析，目前我们是想验证是不是这些封装好的动画接口内部会去触发一个待执行的 Runnable 操作，所以优先继续跟踪下去：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#animatePropertyBy()
private void animatePropertyBy(int constantName, float startValue, float byValue){
    ...
    mView.removeCallbacks(mAnimationStarter);
    mView.postOnAnimation(mAnimationStarter);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>终于找到了，而且不仅仅是 <code>scaleX()</code> 方法，其他封装好的动画接口如 <code>scaleY()</code>，<code>alpha()</code>，<code>translationX()</code> 等等所有这一系列的方法内部最终都会走到 <code>animatePropertyBy()</code> 里去。而在这个方法最后都会先将待执行的 Runnable 先移除掉，再重新 post。</p><p>要理解这么做的用意，得先明白 View 的这两个方法：<code>removeCallbacks()</code>，<code>postOnAnimation()</code> 是干嘛用的。这里我就不跟下去了，直接给大伙说下结论：</p><p>通过 <code>postOnAnimation()</code> 传进去的 Runnable 并不会被马上执行，而是要等到下一个屏幕刷新信号来的时候才会被取出来执行。</p><p>那么，将这些串起来，也就是说，<strong>仅仅只是 <code>View.animate().scaleX()</code> 这样使用时，就算不主动调用 <code>start()</code> ，其实内部也会自动安排一个 Runnable，最迟在下一个屏幕刷新信号来的时候，就会自动去调用 <code>startAnimation()</code> 来启动动画。</strong></p><p><strong>但如果主动调用了 <code>start()</code>，内部就需要先将安排好的 Runnable 操作取消掉，然后直接调用 <code>startAnimation()</code> 来启动动画。</strong></p><p>那么，接下去就来看看是如何启动动画的，<code>startAnimation()</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#startAnimation()
private void startAnimation() {
    //1. 这里我还没搞懂，也不清楚什么场景下会满足这里的条件，直接 return。所以，本篇接下去的分析都是基于假设会直接跳过这里，后面如果搞懂了再来填坑。 
    if (mRTBackend != null &amp;&amp; mRTBackend.startAnimation(this)) {
        return;
    }
    ...
    
    //2. 创建一个 0.0-1.0 变化的 ValueAnimator
    ValueAnimator animator = ValueAnimator.ofFloat(1.0f);

    //3. 将当前 mPengingAnimations 里保存的一系列动画全都取出来，作为同一组一起执行一起结束的动画
    ArrayList&lt;NameValuesHolder&gt; nameValueList =
            (ArrayList&lt;NameValuesHolder&gt;) mPendingAnimations.clone();
    ...

    //4. 创建一个新的 PropertyBundle 来保存这一组动画，以ValueAnimator作为key来区分
    mAnimatorMap.put(animator, new PropertyBundle(propertyMask, nameValueList));
    
    //5. 提供动画开始前，结束后的操作回调
    if (mPendingSetupAction != null) {
        mAnimatorSetupMap.put(animator, mPendingSetupAction);
        mPendingSetupAction = null;
    }
    ...

    //6. 对ValueAnimator进行 Listener、StartDelay、Duration、Interpolator 的设置
    animator.addUpdateListener(mAnimatorEventListener);
    animator.addListener(mAnimatorEventListener);
    ...

    //7. 启用ValueAnimator.start()
    animator.start();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码可以先不用细看，我们稍后再来一块一块慢慢过，我已经将整个方法里做的事大概划分成了 7 件，首先有一点需要提一下，方法内其实是通过 ValueAnimator 来实现的。</p>`,42),v={href:"https://www.jianshu.com/p/46f48f1b98a9",target:"_blank",rel:"noopener noreferrer"},c=i(`<blockquote><p>ValueAnimator 内部其实并没有进行任何 ui 操作，它只是提供了一种机制，可以根据设定的几个数值，如 0-100，内部自己在每一帧内，根据当前时间，第一帧的时间，持续时长，以及插值器规则，估值器规则来计算出在当前帧内动画的进度并映射到设定的数值区间，如 0-100 区间内映射之后的数值应该是多少。</p><p>既然 ValueAnimator 并没有进行任何 ui 操作，那么要用它来实现动画效果，只能自己在 ValueAnimator 提供的每一帧的回调里（AnimatorUpdateListener），自己取得 ValueAnimator 计算出的数值，来自行应用到需要进行动画效果的那个 View 上。</p></blockquote><p>想想自己使用 ValueAnimator 的时候是不是这样，我们并没有将 View 作为参数传递给 ValueAnimator，所以它内部也就没有持有任何 View 的引用，自然做不了任何 ui 操作。</p><p>所以看看 <code>startAnimation()</code> 方法里的，我标出来的第 2、6、7点：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#startAnimation()
private void startAnimation() {
    ...
    
    //2. 创建一个 0.0-1.0 变化的 ValueAnimator
    ValueAnimator animator = ValueAnimator.ofFloat(1.0f);

    ...
    //6. 对ValueAnimator进行 Listener、StartDelay、Duration、Interpolator 的设置
    animator.addUpdateListener(mAnimatorEventListener);
    animator.addListener(mAnimatorEventListener);
    ...

    //7. 启用ValueAnimator.start()
    animator.start();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，ViewPropertyAnimator 其实是通过 <code>ValueAnimator.ofFloat(1.0f)</code>，也就是借助 ValueAnimator 的机制，来计算每一帧动画进度在 0-1 内对应的数值。然后在它的每一帧的回调里再去进行 view 的 ui 操作来达到动画效果，那么 ui 操作也就是在 mAnimatorEventListener 里做的事了，跟进去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator.mAnimatorEventListener
private AnimatorEventListener mAnimatorEventListener = new AnimatorEventListener();  

private class AnimatorEventListener implements Animator.AnimatorListener, ValueAnimator.AnimatorUpdateListener {
    ...

    @Override
    public void onAnimationUpdate(ValueAnimator animation) {
        ...

        //1. 取出 ValueAnimator 计算出的当前帧的动画进度    
        float fraction = animation.getAnimatedFraction();
        
        //2. 根据取得的动画进度，进行一系列view的ui操作，来达到动画效果
        ...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>省略了绝大部分代码，等会会再来慢慢过，这样省略后比较容易梳理出整个流程，优先将流程梳理清楚，再来分析每个步骤具体干的活。</p><p>所以，可以看到，ViewPropertyAnimator 确实是在 ValueAnimator 的每一帧的回调中，取得 VauleAnimator 机制计算出来的动画进度值，然后自行进行 ui 操作来达到动画效果。</p><p>那么，到这里，整个流程就已经梳理出来了，我们先来<strong>梳理一下目前的信息</strong>：</p><ol><li><p><strong>通过 <code>View.animate().scaleX(1.2f).start()</code> 实现的动画，如果外部没有手动调用 <code>start()</code> 方法，那么 ViewPropertyAnimator 内部最迟会在下一帧的时候自动调用 <code>startAnimation()</code> 来启动动画。</strong></p></li><li><p><strong>ViewPropertyAnimator 实现下一帧内自动启动动画是通过 <code>View.postOnAnimation()</code> 实现，View 的这个方法会将传递进来的 Runnable 等到下一帧的时候再去执行。</strong></p></li><li><p><strong>如果外部手动调用了 <code>start()</code>，那么内部会先将第 2 步中安排的自动启动动画的 Runnable 取消掉，然后直接调用 <code>startAnimation()</code> 启动动画。</strong></p></li><li><p><strong><code>startAnimation()</code> 启动动画，实际上是借助 ValueAnimator 的机制，在 <code>onAnimationUpdate()</code> 里取得每一帧内的动画进度时，再自行进行对应的 ui 操作来达到动画效果。</strong></p></li><li><p><strong>ValueAnimator 只是会根据当前时间，动画第一帧时间，持续时长，插值器规则，估值器规则等来计算每一帧内的当前动画进度值，然后根据关键帧机制来映射到设定的范围内的数值，最后通过每一帧的进度回调，供外部使用，它本身并没有任何 ui 操作（详情可看上一篇博客）。</strong></p></li></ol><p>好了，流程上已经梳理清理了，接下去就是细节问题了，ViewPropertyAnimator 取得了每一帧对应的动画进度时又是<strong>如何进行的 ui 操作的呢</strong>？<code>View.animate()</code> 后面是支持一系列的动画操作，如 <code>scaleX()</code>，<code>alpha()</code> 等一起执行的，那么<strong>内部又是如何区分，维护的呢</strong>？</p><p>我们还是按照流程来一步步详细的分析，<strong>View.animate()</strong> 方式实现的动画，流程上是<em><strong>设置动画行为--启动动画--每一帧进度回调中进行ui操作</strong></em>。所以，下面就先看看第一个步骤，跟着 <code>scaleX()</code> 进去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#scaleX()
public ViewPropertyAnimator scaleX(float value) {
    //1. 第一个参数用于区分不同的动画，第二个参数设定动画最后一帧的值
    animateProperty(SCALE_X, value);
    return this;
}

//ViewPropertyAnimator#animateProperty()
private void animateProperty(int constantName, float toValue) {
    //2. 第一步先取得该种动画行为下的默认第一帧值，最后一帧值就是参数传递进来
    float fromValue = getValue(constantName);
    //3. 计算出动画的变化数值
    float deltaValue = toValue - fromValue;
    animatePropertyBy(constantName, fromValue, deltaValue);
}

//ViewPropertyAnimator#getValue()
private float getValue(int propertyConstant) {
    final RenderNode node = mView.mRenderNode;
    switch (propertyConstant) {
        ...
        //4. 直接通过 getScaleX() 取得当前 view 的默认属性值
        case SCALE_X:
            return node.getScaleX();
        ...
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码作用，其实也就只是取得对应动画行为下的第一帧的属性值，然后根据设定的最后一帧属性值来计算出动画变化的数值，最终作为参数传递给 <code>animatePropertyBy()</code>，所以最关键的任务肯定在这个方法里，但要捋清楚这个方法里的代码前，还需要先了解一些变量以及内部类的含义：</p><p>ViewPropertyAnimator 内部有两个数据结构类 <strong>NameValuesHolder</strong> 和 <strong>PropertyBundle</strong>，都是用于存储各种动画信息的，除此之外，还有一系列成员变量的列表，如 <strong>mPendingAnimations</strong>，<strong>mAnimatorMap</strong> 等。要搞清楚这些的含义，还得先搞懂 <code>View.animate()</code> 是支持如何使用的。</p><p>这么说吧，还是拿开头的示例代码来说明：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mView.animate().scaleX(1.2f).scaleY(1.2f).alpha(0.5f).setDuration(1000).start();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>ViewPropertyAnimator 亮点就是支持链式调用一系列不同的动画一起执行，所以需要注意一点，一旦像上述那样使用，那么设定的这一系列动画就会是一起执行一起结束的。</p><p>那么，有可能存在这种场景：先设置了一系列动画执行，如果在这一系列的动画执行结束前，又通过 <code>View.animate()</code> 设置了另外一系列一起执行的动画效果，那么这时就会有两组动画都在运行中，每组动画都可能含有多种类型的动画，所以内部就需要以每组为单位来保存信息，确保每组动画可以互不干扰，这就是 PropertyBundle 这个类的作用了:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator$PropertyBundle
private static class PropertyBundle {
    int mPropertyMask;
    ArrayList&lt;NameValuesHolder&gt; mNameValuesHolder;

    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样解释完，再来看这个类，这样理解两个成员变量的含义就容易多了，首先 mNameValuesHolder 是一个 ArrayList 对象，显然就是用来存储这一组动画里的那一系列不同类型的动画；那具体存在列表里都有哪些类型的动画呢，就是另一个成员变量 mPropertyMask 来进行标志了。</p><p>而列表里存的这一组动画里的不同类型的动画，所以 NamaValuesHolder 这个类的作用就是用于区分各种不同类型的动画了：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator$NameValuesHolder
static class NameValuesHolder {
    int mNameConstant;
    float mFromValue;
    float mDeltaValue;
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一个成员变量 mNameConstant 就是用于区分不同类型的动画，在 ViewPropertyAnimator 内部定义了一系列常用动画的常量，mNameConstant 这个变量的取值就在这些常量中，如开头出现 SCALE_X。而另外两个变量表示的就是这种类型的动画要进行变化的数值信息。</p><p>另外，ViewPropertyAnimator 支持设置一系列不同类型的动画，那么它是以什么为依据来决定哪一系列的动画作为第一组，哪一系列作为第二组呢？其实很简单，就是以 <code>startAnimation()</code> 被调用为依据。那么，成员变量 mPendingAnimations 的作用也就出来了。</p><p>每一次调用 <code>scaleX()</code> 等等之类的方法时，都会创建一个 NameValuesHolder 对象来保存对应这种类型的动画信息，然后保存在 mPendingAnimations 列表中。<code>scaleY()</code> 等这些方法不断被调用，mPendingAnimations 就会保存越来越多的待执行的不同类型的动画。而一旦 <code>startAnimation()</code> 方法被调用时，就会将当前 mPendingAnimations 列表里存的这一系列动画作为同一组一起执行一起结束的动画保存到一个新的 PropertyBundle 对象里。然后清空 mPendingAnimations，直到下一次 <code>startAnimation()</code> 被调用时，再次将 mPendingAnimations 中新保存的一系列动画作为另外一组动画保存到新的 PropertyBundle 中去。</p><p>那么，最后还需要有一个变量来保存并区分这一组一组的动画，这就是 mAnimatorMap 变量的作用了。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>private HashMap&lt;Animator, PropertyBundle&gt; mAnimatorMap = new HashMap&lt;Animator, PropertyBundle&gt;();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>看一下定义，没错吧，PropertyBundle 保存的是一组动画里一起开始一起结束的一系列动画，所以 mAnimatorMap 是以 Animator 为 Key 区分每一组动画的。</p><p>捋清楚了这些内部类和变量的作用，我们下面再来看之前分析的调用了 <code>scaleX()</code> 后，内部跟到了 <code>animatePropertyBy()</code>，那么我们继续跟下去看看：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#animatePropertyBy()
private void animatePropertyBy(int constantName, float startValue, float byValue) {
    //1. mAnimatorMap 存放着一组一组正在运行中的动画
    if (mAnimatorMap.size() &gt; 0) {
        Animator animatorToCancel = null;
        Set&lt;Animator&gt; animatorSet = mAnimatorMap.keySet();
        for (Animator runningAnim : animatorSet) {
            // 2. bundle 保存着当前这一组动画里的一系列正在运行中的不同类型的动画
            PropertyBundle bundle = mAnimatorMap.get(runningAnim);
            if (bundle.cancel(constantName)) {
                if (bundle.mPropertyMask == NONE) {    
                    animatorToCancel = runningAnim;
                    break;
                }
            }
        }
        if (animatorToCancel != null) {
            animatorToCancel.cancel();
        }
    }
    // 3. 所以上述1 2步的工作就是要将当前constantName类型的动画取消掉

    //4. 创建一个 NameValuesHolder 对象用于保存当前constantName类型的动画信息
    NameValuesHolder nameValuePair = new NameValuesHolder(constantName, startValue, byValue);
    //5. 将该类型的动画信息保存到 mPendingAnimations 中
    mPendingAnimations.add(nameValuePair);

    //6. 安排一个自动开启动画的Runnable，最迟在下一帧触发
    mView.removeCallbacks(mAnimationStarter);
    mView.postOnAnimation(mAnimationStarter);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码里从第 4-6 的步骤应该都清楚了吧，每次调用 <code>scaleX()</code> 之类的动画，内部需要先创建一个 NameValuesHolder 对象来保存该类型的动画行为（第4步），然后将该类型动画添加到 mPendingAnimations 列表中（第5步）来作为组成一系列一起开始一起结束的动画，最后会自动安排一个最迟在下一帧内自动启动动画的 Runnable（第6步）。</p><p>那么第 1-3 步又是干嘛的呢？</p><p>是这样的，上面说过，可能会存在一组一组都在运行中的动画，每一组都有一系列不同类型的动画，那么就有可能出现同一种类型的动画，比如 <code>scaleX()</code>，既在第一组里，又在第二组里。很显然，ViewPropertyAnimator 里的所有动画都是作用于同一个 View 上，而不同组的动画又有可能同一时刻都在运行中，那么，一个 View 的同一种类型动画有可能在同一时刻被执行两次么？说得白一点，一个 View 的大小如果在同一帧内先放大 1.2 倍，同时又放大 1.5 倍，那这个 View 呈现出来的效果肯定特别错乱。</p><p>所以，ViewPropertyAnimator 里所有的动画，在同一时刻，同一类型的动画只支持只有一个处于正在运行中的状态，这也就是第 1-3 步的意义，它需要去遍历当前每一组里的每一个动画，如果类型跟当前设定的动画类型一致，那么就将之前的动画取消掉，以最近设定的这次为准。</p><p>好了，<code>scaleX()</code> 这些设定动画的行为，内部实现的细节我们已经分析完了，下面就继续看看下一个流程，启动动画里都干了啥，<code>startAnimation()</code> ：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#startAnimation()
private void startAnimation() {
    //1. 这里我还没搞懂，也不清楚什么场景下会满足这里的条件，直接 return。所以，本篇接下去的分析都是基于假设会直接跳过这里，后面如果搞懂了再来填坑。 
    if (mRTBackend != null &amp;&amp; mRTBackend.startAnimation(this)) {
        return;
    }
    mView.setHasTransientState(true);
    
    //2. 创建一个 0.0-1.0 变化的 ValueAnimator
    ValueAnimator animator = ValueAnimator.ofFloat(1.0f);

    //3. 将当前 mPengingAnimations 里保存的一系列动画全都取出来，作为同一组一起执行一起结束的动画
    ArrayList&lt;NameValuesHolder&gt; nameValueList =
            (ArrayList&lt;NameValuesHolder&gt;) mPendingAnimations.clone();
    mPendingAnimations.clear();
    int propertyMask = 0;
    int propertyCount = nameValueList.size();
    //3.1 遍历这一系列动画，将这些动画都有哪些类型的动画标志出来
    for (int i = 0; i &lt; propertyCount; ++i) {
        NameValuesHolder nameValuesHolder = nameValueList.get(i);
        propertyMask |= nameValuesHolder.mNameConstant;
    }

    //4. 创建一个新的 PropertyBundle 来保存这一组动画，以ValueAnimator作为key来区分
    mAnimatorMap.put(animator, new PropertyBundle(propertyMask, nameValueList));
    
    //5. 提供动画开始前，结束后的操作回调
    if (mPendingSetupAction != null) {
        mAnimatorSetupMap.put(animator, mPendingSetupAction);
        mPendingSetupAction = null;
    }
    if (mPendingCleanupAction != null) {
        mAnimatorCleanupMap.put(animator, mPendingCleanupAction);
        mPendingCleanupAction = null;
    }
    if (mPendingOnStartAction != null) {
        mAnimatorOnStartMap.put(animator, mPendingOnStartAction);
        mPendingOnStartAction = null;
    }
    if (mPendingOnEndAction != null) {
        mAnimatorOnEndMap.put(animator, mPendingOnEndAction);
        mPendingOnEndAction = null;
    }

    //6. 对ValueAnimator进行 Listener、StartDelay、Duration、Interpolator 的设置
    animator.addUpdateListener(mAnimatorEventListener);
    animator.addListener(mAnimatorEventListener);
    if (mStartDelaySet) {
        animator.setStartDelay(mStartDelay);
    }
    if (mDurationSet) {
        animator.setDuration(mDuration);
    }
    if (mInterpolatorSet) {
        animator.setInterpolator(mInterpolator);
    }

    //7. 启用ValueAnimator.start()
    animator.start();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第 1 步我还没搞清楚，就先暂时跳过吧。</p><p>第 2-4 步就是我们上面有说过的，当 <code>startAnimation()</code> 被调用时，将当前保存在 mPendingAnimations 列表里所有的动画都作为同一组一起开始一起结束的动画，保存到一个新的 PropertyBundle 对象中，每一组动画什么时候开始，结束，以及每一帧的进度都是借助 ValueAnimator 机制实现，所以每一组动画就以不同的 ValueAnimator 对象作为 key 值保存到 mAnimatorMap 中相户区分，独立出来。</p><p>第 5 步是 ViewPropertyAnimator 支持的接口，都是供外部根据需要使用，比如 mPendingOnStartAction 就是表示会在这一组动画开始的时候被执行，时机跟 <code>onAnimationStart()</code> 相同，外部使用的时候调用 <code>withStartAction()</code> 就可以了。那么为什么需要提供这样的接口呢？</p><p>这是因为，如果我们想要在动画开始或结束的时候做一些事，如果我们是这样使用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mView.animate().scaleX(1.2f)
    .setListener(new AnimatorListenerAdapter() {
        @Override
        public void onAnimationStart(Animator animation) {
            //do something
        }
    }).start();  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>没错，这样写的话，确实可以实现在动画前去执行我们指定的工作。但这样会有一个问题，因为 ViewPropertyAnimator 动画是支持多组动画同时进行中的，如果像上面这样写的话，那么每一组动画在开始之前就都会去回调这个 <code>onAnimationStart()</code> 方法，去做相同的事。</p><p>如果我们只希望当前一组动画去执行这些动画开始前的工作，其他组动画不用去执行，那么这时候就可以使用 <code>withStartAction()</code> 来实现。</p><p>这就是第 5 步的用意。</p><p>第 6-7 步也就是对 ValueAnimator 做各种配置，如持续时长，延迟开始时间，插值器等等，最后调用 <code>ValueAnimator.start()</code> 来启动。</p><p>好，启动动画的具体的工作我们也分析完了，剩下最后一个流程了，在每一帧的回调中如何进行 ui 操作并且应用一系列的动画。那么，最后就看看 AnimatorEventListener:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator.mAnimatorEventListener

private class AnimatorEventListener implements Animator.AnimatorListener, ValueAnimator.AnimatorUpdateListener {
    ...

    @Override
    public void onAnimationUpdate(ValueAnimator animation) {
        //1. 取出跟当前 ValueAnimator 绑定的那一组动画
        PropertyBundle propertyBundle = mAnimatorMap.get(animation);
        ...

        //省略一堆没看懂的代码，跟硬件加速有关
        ...

        //2. 获取 ValueAnimator 机制计算出的当前帧的动画进度
        float fraction = animation.getAnimatedFraction();
        int propertyMask = propertyBundle.mPropertyMask;
        ...

        //3. 遍历这一组动画里的所有动画，分别根据不同类型的动画进行不同的 ui 操作来实现动画效果
        ArrayList&lt;NameValuesHolder&gt; valueList = propertyBundle.mNameValuesHolder;
        if (valueList != null) {
            int count = valueList.size();
            for (int i = 0; i &lt; count; ++i) {
                //3.1 取出第i个动画
                NameValuesHolder values = valueList.get(i);
                //3.2 根据ValueAnimator计算的当前帧动画进度，以及第i个动画的第一帧的属性值和变化的值来计算出当前帧时的属性值是多少
                float value = values.mFromValue + fraction * values.mDeltaValue;
                
                //3.3 如果是 alpha 动画，通过View的set方法来修改alpha值，否则调用setValue方法
                if (values.mNameConstant == ALPHA) {
                    alphaHandled = mView.setAlphaNoInvalidation(value);
                } else {
                    setValue(values.mNameConstant, value);
                }
            }
        }
        
        //省略alpha动画的一些辅助处理
        ...

        //4. 进度回调，通知外部
        if (mUpdateListener != null) {
            mUpdateListener.onAnimationUpdate(animation);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法做的事也很明确了，上述代码中的注释大概也说完了。也就是说 ViewPropertyAnimator 动画内部在 ValueAnimator 的每一帧回调中，取出跟 ValueAnimator 绑定的那一组动画，以及当前帧的动画进度，然后再遍历当前组的所有动画，分别计算出每个动画当前帧的属性值，如果不是 alpha 动画的话，直接调用 <code>setValue()</code> 方法来进行 ui 操作达到动画效果，如果是 alpha 动画，则调用 view 的一个 set 方法来实现。</p><p>那么，下面再继续看看 <code>setValue()</code> ：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ViewPropertyAnimator#setValue()
private void setValue(int propertyConstant, float value) {
    final View.TransformationInfo info = mView.mTransformationInfo;
    final RenderNode renderNode = mView.mRenderNode;
    switch (propertyConstant) {
        case TRANSLATION_X:
            renderNode.setTranslationX(value);
            break;
        ...
        case SCALE_X:
            renderNode.setScaleX(value);
            break;
        case SCALE_Y:
            renderNode.setScaleY(value);
            break;
        ...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>省略了一堆类似的代码，这个方法里，就全部都是根据不同类型的动画，取得当前 View 的 mRenderNode 对象，然后分别调用相应的 setXXX 方法，如 SCALE_X 动画，就调用 <code>setScaleX()</code> 方法来进行 ui 操作达到动画效果。</p><p>以上，<code>View.animate()</code> 这种方式实现的动画，也就是 ViewPropertyAnimator 动画，的整个流程以及流程里每个步骤的工作，我们到此就全部梳理清楚了。</p><h1 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h1><p>最后，就来进行一下总结：</p><ol><li><p><strong><code>View.animate()</code> 这种方式实现的动画其实是 ViewPropertyAnimator 动画。</strong></p></li><li><p><strong>ViewPropertyAnimator 并不是一种动画，它没有继承自 Animator 或者 Animation，它其实只是一个封装类，将常用的动画封装起来，对外提供方便使用的接口，内部借助 ValueAnimator 机制。</strong></p></li><li><p><strong>ViewPropertyAnimator 动画支持自动启动动画，如果外部没有明确调用了 <code>start()</code>，那么内部会安排一个 Runnable 操作，最迟在下一帧内被执行，这个 Runnable 会去启动动画。</strong></p></li><li><p><strong>当然，如果外部手动调用了 <code>start()</code>，那么自动启动动画就没意义了，内部会自己将其取消掉。</strong></p></li><li><p><strong>ViewPropertyAnimator 对外提供的使用动画的接口非常方便，如 <code>scaleX()</code> 表示 x 的缩放动画，<code>alpha()</code> 表示透明度动画，而且支持链式调用。</strong></p></li><li><p><strong>由于支持链式调用，所以它支持一系列动画一起开始，一起执行，一起结束。那么当这一系列动画还没执行完又重新发起了另一系列的动画时，此时两个系列动画就需要分成两组，每一组动画互不干扰，可以同时执行。</strong></p></li><li><p><strong>但如果同一种类型的动画，如 SCALE_X，在同一帧内分别在多组里都存在，如果都同时运行的话，View 的状态会变得很错乱，所以 ViewPropertyAnimator 规定，同一种类型的动画在同一时刻只能有一个在运行。</strong></p></li><li><p><strong>也就是说，多组动画可以处于并行状态，但是它们内部的动画是没有交集的，如果有交集，比如 SCALE_X 动画已经在运行中了，但是外部又新设置了一个新的 SCALE_X 动画，那么之前的那个动画就会被取消掉，新的 SCALE_X 动画才会加入新的一组动画中。</strong></p></li><li><p><strong>由于内部是借助 ValueAnimator 机制，所以在每一帧内都可以接收到回调，在回调中取得 ValueAnimator 计算出的当前帧的动画进度。</strong></p></li><li><p><strong>取出当前帧的动画进度后，就可以遍历跟当前 ValueAnimator 绑定的那一组动画里所有的动画，分别根据每一个动画保存的信息，来计算出当前帧这个动画的属性值，然后调用 View 的 mRenderNode 对象的 setXXX 方法来修改属性值，达到动画效果。</strong></p></li></ol><p>还有一些细节并没有归纳到总结中，如果只看总结的小伙伴，有时间还是建议可以慢慢跟着本文过一遍。</p><h1 id="遗留问题" tabindex="-1"><a class="header-anchor" href="#遗留问题" aria-hidden="true">#</a> 遗留问题</h1><p><strong>Q1：开头说了，使用这种方式实现的动画在某些场景下会有一个坑，这个坑又是什么，是在什么场景下的呢？</strong></p><p>开头说过使用这种方式实现的动画，在某些场景下会存在一些坑。本来以为这篇里也能顺便说清楚，但单单只是原理梳理下来，篇幅就很长了，那么也当做遗留问题，留到之后的文章中来好好说下吧。可以先说下是什么坑：</p><p>如果当前界面有使用 RecyclerView 控件，然后又对它的 item 通过 <code>View.animate()</code> 方式实现了一些动画效果，比如很常见的 Tv 应用的主页，界面会有很多卡位，然后每个卡位获得焦点时一般都需要放大的动画，此时这个卡位就是 RecyclerView 的 item，放大动画可以通过 <code>View.animate()</code> 方式来实现。</p><p>在这种场景下，可能会存在这么一种现象，当界面刷新时，如果此时有进行遥控器的方向键按键事件，那么可能会有一些卡位的缩放动画被中断的现象。为什么会出现这种现象，再找个时间来梳理清楚。</p><p><strong>Q2：View 的 mRenderNode 对象又是个什么东西？它的 setXXX 方法又是如何修改 View 的属性值来达到动画效果的？</strong></p><p>还有第二个遗留问题，虽然本篇梳理了 ViewPropertyAnimator 动画的流程和原理，但到最后，我们其实只知道它内部借助了 ValueAnimator 机制来计算每一帧的动画进度，然后在每一帧的回调中先获取 View 的 mRenderNode 对象，再调用相应的 setXXX 方法来修改属性值达到动画效果。但这个 mRenderNode 是个什么东西，又是如何修改 view 的状态来达到动画效果的这点就还需要找个时间来梳理了。</p><p>所以到最后，ViewPropertyAnimator 内部的流程和原理虽然已经清楚了，但具体要不要将这个动画归纳到属性动画中，我就不大清楚了。虽然它内部是借助了 ViewAnimator 机制，但 ValueAnimator 其实并没有任何的 ui 操作，ObjectAnimator 才会去通过反射来调用相关的 setXXX 方法来修改属性值，这个过程才是 ui 操作，最后才会有相应的动画效果呈现出来。这点还有待继续研究。</p>`,65);function u(p,b){const a=t("ExternalLinkIcon");return l(),s("div",null,[o,n("p",null,[e("上一篇博客"),n("a",v,[e("属性动画 ValueAnimator 运行原理全解析"),d(a)]),e("中，我们已经将 ValueAnimator 的运行原理分析完了，感兴趣的可以回去看看，这里大概提几点结论：")]),c])}const V=r(m,[["render",u],["__file","View.animate()动画ViewPropertyAnimator原理解析.html.vue"]]);export{V as default};
