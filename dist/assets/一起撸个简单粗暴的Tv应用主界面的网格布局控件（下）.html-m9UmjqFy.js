import{_ as r,r as d,o as a,c as t,a as i,b as e,e as s,d as n}from"./app-2pyCoCP5.js";const c={},o=n('<p>上一篇中我们已经一起学了怎么简单粗暴的撸个支持动态布局的网格控件出来，但在上一篇的介绍中，并没有学习实现网格控件的滑动效果，所以本篇就来讲讲，要如何让我们的网格控件可以支持自定义滑动策略。</p><h1 id="效果" tabindex="-1"><a class="header-anchor" href="#效果" aria-hidden="true">#</a> 效果</h1><p><img src="https://upload-images.jianshu.io/upload_images/1924341-51acf54f0bda9948.gif?imageMogr2/auto-orient/strip" alt="当贝市场.gif"></p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-218524f08ceefb17.gif?imageMogr2/auto-orient/strip" alt="TvGridLayout示例"></p><p>图一是Tv应用：当贝市场的主页</p><p>图二是咱自己撸的简单粗暴的 Tv 应用主界面网格控件：TvGridLayout 的示例，每个 Tab 下，每一屏的卡位大小、位置都是动态计算出来的。</p><h1 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h1><h4 id="第一步-定义布局数据结构" tabindex="-1"><a class="header-anchor" href="#第一步-定义布局数据结构" aria-hidden="true">#</a> 第一步：定义布局数据结构</h4><h4 id="第二步-自定义-tvgridlayout" tabindex="-1"><a class="header-anchor" href="#第二步-自定义-tvgridlayout" aria-hidden="true">#</a> 第二步：自定义 TvGridLayout</h4><h4 id="第三步-自定义-adapter" tabindex="-1"><a class="header-anchor" href="#第三步-自定义-adapter" aria-hidden="true">#</a> 第三步：自定义 Adapter</h4><h4 id="第四步-动态布局" tabindex="-1"><a class="header-anchor" href="#第四步-动态布局" aria-hidden="true">#</a> 第四步：动态布局</h4><h4 id="第五步-初步使用" tabindex="-1"><a class="header-anchor" href="#第五步-初步使用" aria-hidden="true">#</a> 第五步：初步使用</h4>',12),v={href:"https://www.jianshu.com/p/9deba60113f7",target:"_blank",rel:"noopener noreferrer"},u=n(`<h4 id="第六步-内嵌-overscroller-自定义滑动策略" tabindex="-1"><a class="header-anchor" href="#第六步-内嵌-overscroller-自定义滑动策略" aria-hidden="true">#</a> 第六步：内嵌 OverScroller 自定义滑动策略</h4><p>首先，我们的网格控件是继承自 FrameLayout，那么它本身就是没有支持滑动的效果的，但是我们的网格控件又需要支持多屏显示，那么当焦点滑到当前屏之外时，自然就需要将下一屏的卡位滑动到屏幕内进行显示。</p><p>而实现滑动效果的方式有两种：</p><ul><li>将网格控件嵌套在 HorizontalScrollView</li><li>自己在网格控件内部实现滑动效果</li></ul><p>第一种方式实现最简单，我们只要将自己的网格控件 TvGridLayout 嵌套在 HorizontalScrollView 中，就可以实现滑动效果了。</p><p>虽然实现最简单，但缺点也很明显，就是滑动的策略只能按照 HorizontalScrollView 规则来，我们并没有办法进行修改。比如说，滑动的持续时长，滑动的距离，什么时候触发滑动等等。</p><p>产品的口味可是很刁钻的，单单使用默认的滑动策略，通常是很难满足产品的，虽然也可以通过一些反射等手段来修改 HorizontalScrollView 的默认实现，但有点复杂，且容易出问题。</p><p>本着不怕瞎折腾的精神，网格控件既然都已经自己撸了，那滑动的实现干脆也来自己撸好了。</p><h5 id="_6-1-实现滑动的方式" tabindex="-1"><a class="header-anchor" href="#_6-1-实现滑动的方式" aria-hidden="true">#</a> 6.1 实现滑动的方式</h5><p>想要让一个控件滑动起来的方式很多很多：</p><ul><li>动画</li><li>ViewGroup#onLayout()</li><li>View#scrollTo(), View#scrollBy()</li><li>OverScroller</li><li>...</li></ul><p>动画也行，重新对子 View 布局，修改子 View 位置也行，调用 View 自带的 scrollTo(), scrollBy() 也行，或者直接用系统提供的滑动辅助类 OverScroller 也行，都行，方式很多，只要能够让控件动起来就行。所以，<strong>让 View 动起来一直就不是个问题，问题是要怎么滑，什么时候滑，滑多长，滑多久，这些问题才是撸个滑动功能的问题所在。</strong></p><h5 id="_6-2-horizontalscrollview-滑动原理" tabindex="-1"><a class="header-anchor" href="#_6-2-horizontalscrollview-滑动原理" aria-hidden="true">#</a> 6.2 HorizontalScrollView 滑动原理</h5><p>既然滑动要自己撸，那当然是要先参考一下 Google 大神的实现思路了，所以首先就先来看看 HorizontalScrollView 的滑动原理是怎样的？</p><p>有一点需要先提一下的是，由于我们是着重分析 Tv 应用的滑动效果，也就是说是由遥控器来触发的滑动效果，那么 HorizontalScrollView 内部跟手指触摸相关的滑动原理就不分析了，着重分析跟 Tv 相关的滑动原理即可。</p><p>而 Tv 应用由于都是通过遥控器事件即 KeyEvent 来进行 ui 的交互，那么，理所当然，要查看 HorizontalScrollView 的滑动原理的话，就需要跟着 <code>dispatchKeyEvent()</code> 走下去应该就可以了。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//HorizontalScrollView#dispatchKeyEvent()
public boolean dispatchKeyEvent(KeyEvent event) {
	// 1. 如果事件没有被消耗掉，那么就交由滑动去处理
	return super.dispatchKeyEvent(event) || executeKeyEvent(event);
}

public boolean executeKeyEvent(KeyEvent event) {
	...

	boolean handled = false;
	if (event.getAction() == KeyEvent.ACTION_DOWN) {
	switch (event.getKeyCode()) {
         //2. 事件是方向键左键时，那么就向左滑动
		case KeyEvent.KEYCODE_DPAD_LEFT:
			if (!event.isAltPressed()) {
				handled = arrowScroll(View.FOCUS_LEFT);
			}
            ...
		}
	}
	return handled;
}

public boolean arrowScroll(int direction) {
	...
	//3. 先寻找下个焦点的 view
	View nextFocused = FocusFinder.getInstance().findNextFocus(this, currentFocused, direction);
	
	if (nextFocused != null &amp;&amp; isWithinDeltaOfScreen(nextFocused, maxJump)) {
        //4. 根据下个焦点的位置，去计算是否需要进行滑动，需要的话那么计算滑动多长的距离
		nextFocused.getDrawingRect(mTempRect);
		offsetDescendantRectToMyCoords(nextFocused, mTempRect);
		int scrollDelta = computeScrollDeltaToGetChildRectOnScreen(mTempRect);
        //5. 根据计算出来的滑动距离去处理滑动逻辑
		doScrollX(scrollDelta);
		nextFocused.requestFocus(direction);
	} 
    ...
	return true;
}

private void doScrollX(int delta) {
	if (delta != 0) {
        //6. HorizontalScrollView默认是开启了平衡滑动，但可也通过接口关掉
		if (mSmoothScrollingEnabled) {
			smoothScrollBy(delta, 0);
		} else {
			scrollBy(delta, 0);
		}
	}
}

public final void smoothScrollBy(int dx, int dy) {
    ...
	if (duration &gt; ANIMATED_SCROLL_GAP) {
        //7. 如果处于边界情况，那么需要对计算出来的滑动长度进行修正，确保边界情况不会出问题
		final int width = getWidth() - mPaddingRight - mPaddingLeft;
		final int right = getChildAt(0).getWidth();
		final int maxX = Math.max(0, right - width);
		final int scrollX = mScrollX;
		dx = Math.max(0, Math.min(scrollX + dx, maxX)) - scrollX;
		//8. 上述步骤均只是用于计算需要滑动的距离值，计算出来后滑动的实现交由mScroller处理
		mScroller.startScroll(scrollX, mScrollY, dx, 0);
		postInvalidateOnAnimation();
	}
    ...
}

//9. mScroller是OverScroller的实例
private OverScroller mScroller;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>HorizontalScrollView 的滑动原理，例如是如何计算滑动距离的以及都有哪些会触发滑动的场景等等，就不深入去分析了，这不是本篇的目的，以后有时间再抽空来梳理。</p><p>所以，只需要跟着遥控器事件 <code>dispatchKeyEvent()</code> 走下去后，就可以找到原来 HorizontalScrollView 内部是通过 OverScroller 来实现的滑动效果。</p><p>而且，梳理了 HorizontalScrollView 从接收到遥控器事件到最终实现滑动的一个整体的流程后，我们再自己撸滑动的功能时，也可以参考这个思路、这个流程来写，所以这也是阅读源码的好处，大伙有时间得多抽抽时间来阅读源码多学习学习。</p><h5 id="_6-3-overscroller-原理" tabindex="-1"><a class="header-anchor" href="#_6-3-overscroller-原理" aria-hidden="true">#</a> 6.3 OverScroller 原理</h5><p>既然 HorizontalScrollView 内部是通过 OverScroller 来处理滑动的相关逻辑的，那么，我们也用 OverScroller 来做好了，向 Google 大佬模仿借鉴。</p><p>网上关于 OverScroller 的使用教程很多，本篇就不着重讲了，要理解一点的是，OverScroller 只是一个滑动辅助类。</p><p>说得白一点也就是，<strong>我们只需要告诉 OverScroller 我们想滑动多长的距离，多久时间滑完，那么，OverScroller 内部就会根据每一帧的时间去计算当前帧时滑动的进度</strong>。然后，我们再每一帧通过 OverScroller 计算出的滑动进度，去作用到需要滑动的 View 上面来达到滑动的效果。</p><p>如果有看过我前面几篇关于动画的博客分析的话，那么上面这点就会很清楚了。OverScroller 实现滑动的整个流程原理跟属性动画的 ValueAnimator 非常相似，两个类内部都没有任何涉及 ui 的操作，两个类的作用都是用于根据当前帧的时间计算当前帧时的进度值。</p><p>唯一有区别的点就是，ValueAnimator 内部会自己通过 Choreographer 去监听每一帧的屏幕刷新信号，然后内部在接收到每一帧信号时就会自动去根据当前帧时间计算；而 <strong>OverScroller 内部并没有任何监听屏幕刷新信号的逻辑，也就是说，如果要使用 OverScroller 的话，我们需要在接收到每一帧的屏幕刷新信号时手动去通知 OverScroller，它才可以正确去工作</strong>。</p><p>这就是为什么，大伙在网上搜 OverScroller 的使用教程时，基本每一篇都会提到说 OverScroller 需要跟 View 的 <code>computeScroll()</code> 一起使用的原因。</p><p><code>computeScroll()</code> 是 View 中的一个空方法，在 <code>draw()</code> 方法中被调用。所以，只要我们能够让需要滑动的 View 在滑动的这段时间内，每一帧都通知 View 进行重绘刷新，那么它每一帧就都会走到 <code>computeScroll()</code>，这样我们就可以在 <code>computeScroll()</code> 中手动去通知 OverScroller，它内部就可以根据当前帧时间去计算滑动的工作了。</p><p>这也是为什么，大伙搜 OverScroller 的使用教程时，基本每篇也说了，在调用了 <code>startScroll()</code> 之后需要紧接着调用 View 的 <code>postInvalidateOnAnimation()</code> ，否则滑动就会失效的原因。因为我们只有通知了 View 需要重绘，<code>computeScroll()</code> 才会被调用，才可以再手动去通知 OverScroller 进行工作。</p><h5 id="_6-4-触发滑动的时机" tabindex="-1"><a class="header-anchor" href="#_6-4-触发滑动的时机" aria-hidden="true">#</a> 6.4 触发滑动的时机</h5><p>搞清了 OverScroller 的原理后，那么如果要在我们自己的网格控件里撸滑动逻辑的话，也可以大概清楚需要撸哪些代码了。</p><p>因为 OverScroller 只负责根据我们指定的滑动距离和持续时长，在每一帧里去计算滑动进度的工作。那么，到底需要滑动多长的距离，持续多久，什么时候触发滑动，这三者就是自定义有滑动效果控件需要撸出来的代码了。</p><p>我们只针对 Tv 应用的话，显然，滑动的时机就在于遥控器事件了，这是第一点。</p><p>HorizontalScorllView 是在 <code>dispatchKeyEvent()</code>中，每次都去检查是否需要滑动，而满足滑动的条件则是下个焦点的 View 是否在屏幕上是可见的，而滑动的距离则是将这个不可见的 View 滑动到刚刚好全部可见。当然，它内部还有其它滑动策略，比如整页滑等等，但这些就需要手动去调用相关接口。</p><p>仅仅使用 HorizontalScrollView 默认的滑动效果很难满足产品需求，就像开头的当贝市场的示例图，很明显，它的滑动策略跟 HorizontalScrollView 就是不一样的，它是焦点快接近边缘时，就会去触发滑动了，即使下个焦点的 View 还是全部可见时。</p><h5 id="_6-5-自定义滑动策略" tabindex="-1"><a class="header-anchor" href="#_6-5-自定义滑动策略" aria-hidden="true">#</a> 6.5 自定义滑动策略</h5><p>滑动的时机、滑动的策略、滑动的距离，这些并不是一成不变的，而是取决于业务场景需求；也是因为这样，才想到要自己撸个滑动的功能出来。</p><p>下面我会举个例子，将代码思路讲一下，但并不一定适用于你，所以大伙根据自己的需求自己撸一个就行了。</p><p>由于 Tv 应用都是通过遥控器控制，因此滑动的时机就在 <code>dispatchKeyEvent()</code>中进行检测就行了：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>@Override
public boolean dispatchKeyEvent(KeyEvent event) {
    //1. 事件如果没有被消耗掉，那么就交由滑动去处理
	return super.dispatchKeyEvent(event) || executeKeyEvent(event);
}

//这里的滑动策略：
//如果下个焦点的 View 属于另外一屏的话，那么就触发滑动
//滑动的距离为下一屏的宽度
//这里的下一屏是指上一篇提到的 ScreenEntity 数据模型，因为每个 Tab 下可能存在多屏数据，以屏作为单位来进行滑动，两焦点在两屏之间切换时，就触发滑动
private boolean executeKeyEvent(KeyEvent event) {
	int keyCode = event.getKeyCode();
	if (event.getAction() == KeyEvent.ACTION_DOWN) {
		...
		if (keyCode == KeyEvent.KEYCODE_DPAD_LEFT) {
            //2. 检测下个焦点的 View 是否是属于另一屏中，是的话，将当前切换的这两屏的下标保存在 sTwoInt中
			if (checkIfOnBorder(FOCUS_LEFT, sTwoInt)) {
				...
                  //3. 对外提供屏边界回调，当焦点在两屏之间切换时，触发回调
				if (mBorderListener != null &amp;&amp; mBorderListener.onLeft(sTwoInt[0], sTwoInt[1])) {
					return true;
				}
                 //4. 如果外部在接收到屏切换回调时，没有拦截，那么就去触发滑动
                 scrollToPage(sTwoInt[1]);
             }
        } 
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述是提供了一种滑动策略的思路，滑动策略并不一定需要按照系统默认的来，也不一定要按照上述来，适合自己的业务场景就行，不然干嘛要瞎折腾来自己撸这个滑动。</p><p>上述的滑动策略思路是当焦点在两屏之间切换时触发滑动，滑动的距离为下一屏的宽度。这种策略就完全不同于系统默认的策略，因此 HorizontalScrollView 就排不上用场了，那么就自己撸吧，不就是滑动的时机和滑动的距离计算要自己撸嘛，不难。</p><h5 id="_6-6-完工" tabindex="-1"><a class="header-anchor" href="#_6-6-完工" aria-hidden="true">#</a> 6.6 完工</h5><p>以上，就将需要撸一个滑动的控件的思路讲完了。</p><p>小结一下，如果大伙想要自己撸个滑动的功能的话，很简单，可以用动画、scrollTo() 等方式；</p><p>如果大伙选择使用 OverScroller 的话，那么有几点需要注意：</p><ul><li>OverScroller 只负责根据指定的滑动距离，持续时长来计算每一帧内的滑动进度</li><li>因此我们需要在每一帧的屏幕刷新信号事件中手动去通知 OverScroller 进行工作，并取得经过它计算得到的当前帧的滑动进度来手动应用到 View 上</li><li>这就是为什么使用 OverScroller 需要结合 <code>View#computeScroll()</code>一起使用，并且在调用了 <code>startScroll()</code> 之后需要紧接着调用 <code>View#postInvalidateOnAnimation()</code>的原因</li><li>一个完整的滑动功能需要包括：触发滑动的时机、滑动策略、滑动距离的计算、OverScroller 辅助计算、应用到 View 上</li><li>触发滑动的时机可以在 <code>dispatchKeyEvent()</code> 中进行检查是否满足滑动条件</li><li>满足滑动的条件和滑动策略以及滑动距离的计算基于具体业务需求而实现</li><li>整个流程设计可以参考 HorizontalScrollView 的源码</li></ul>`,47);function m(p,b){const l=d("ExternalLinkIcon");return a(),t("div",null,[o,i("p",null,[e("以上内容是在上一篇中讲解的内容，所以如果还没有看过上一篇的，建议先阅读上一篇"),i("a",v,[e("一起撸个简单粗暴的Tv应用主界面的网格布局控件（上）"),s(l)]),e("。那么下面就开始我们今天的内容了：")]),u])}const S=r(c,[["render",m],["__file","一起撸个简单粗暴的Tv应用主界面的网格布局控件（下）.html.vue"]]);export{S as default};
