import{_ as e,o as i,c as n,d}from"./app-fgtJnIYH.js";const l={},s=d(`<p>最近在研究 RecyclerView 的回收复用机制，顺便记录一下。我们知道，RecyclerView 在 layout 子 View 时，都通过回收复用机制来管理。网上关于回收复用机制的分析讲解的文章也有一大堆了，分析得也都很详细，什么四级缓存啊，先去 mChangedScrap 取再去哪里取啊之类的；但其实，我想说的是，RecyclerView 的回收复用机制确实很完善，覆盖到各种场景中，但并不是每种场景的回收复用时都会将机制的所有流程走一遍的。举个例子说，在 setLayoutManager、setAdapter、notifyDataSetChanged 或者滑动时等等这些场景都会触发回收复用机制的工作。但是如果只是 RecyclerView 滑动的场景触发的回收复用机制工作时，其实并不需要四级缓存都参与的。</p><p>emmm，应该讲得还是有点懵，那就继续看下去吧，会一点一点慢慢分析。本篇不会像其他大神的文章一样，把回收复用机制源码一行行分析下来，我也没那个能力，所以我会基于一种特定的场景来分析源码，这样会更容易理解的。废话结束，开始正题。</p><h1 id="正题" tabindex="-1"><a class="header-anchor" href="#正题" aria-hidden="true">#</a> 正题</h1><p>RecyclerView 的回收复用机制的内部实现都是由 Recycler 内部类实现，下面就都以这样一种页面的滑动场景来讲解 RecyclerView 的回收复用机制。</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-2c4220087dee4a6a.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="RecyclerView页面.png"></p><p>相应的版本： RecyclerView: recyclerview-v7-25.1.0.jar LayoutManager: GridLayoutManager extends LinearLayoutManager (recyclerview-v7-25.1.0.jar)</p><p>这个页面每行可显示5个卡位，每个卡位的 item 布局 type 一致。</p><p>开始分析回收复用机制之前，先提几个问题：</p><h4 id="q1-如果向下滑动-新一行的5个卡位的显示会去复用缓存的-viewholder-第一行的5个卡位会移出屏幕被回收-那么在这个过程中-是先进行复用再回收-还是先回收再复用-还是边回收边复用-也就是说-新一行的5个卡位复用的-viewholder-有可能是第一行被回收的5个卡位吗" tabindex="-1"><a class="header-anchor" href="#q1-如果向下滑动-新一行的5个卡位的显示会去复用缓存的-viewholder-第一行的5个卡位会移出屏幕被回收-那么在这个过程中-是先进行复用再回收-还是先回收再复用-还是边回收边复用-也就是说-新一行的5个卡位复用的-viewholder-有可能是第一行被回收的5个卡位吗" aria-hidden="true">#</a> Q1:如果向下滑动，新一行的5个卡位的显示会去复用缓存的 ViewHolder，第一行的5个卡位会移出屏幕被回收，那么在这个过程中，是先进行复用再回收？还是先回收再复用？还是边回收边复用？也就是说，新一行的5个卡位复用的 ViewHolder 有可能是第一行被回收的5个卡位吗？</h4><p>第二个问题之前，先看几张图片：</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-b92c5bdf40d5c973.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="先向下再向上滑动.png"></p><p>黑框表示屏幕，RecyclerView 先向下滑动，第三行卡位显示出来，再向上滑动，第三行移出屏幕，第一行显示出来。我们分别在 Adapter 的 onCreateViewHolder() 和 onBindViewHolder() 里打日志，下面是这个过程的日志：</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-d53948d61444967d.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="日志.png"></p><p>红框1是 RecyclerView 向下滑动操作的日志，第三行5个卡位的显示都是重新创建的 ViewHolder ；红框2是再次向上滑动时的日志，第一行5个卡位的重新显示用的 ViewHolder 都是复用的，因为没有 create viewHolder 的日志，然后只有后面3个卡位重新绑定数据，调用了onBindViewHolder()；那么问题来了：</p><h4 id="q2-在这个过程中-为什么当-recyclerview-再次向上滑动重新显示第一行的5个卡位时-只有后面3个卡位触发了-onbindviewholder-方法-重新绑定数据呢-明明5个卡位都是复用的。" tabindex="-1"><a class="header-anchor" href="#q2-在这个过程中-为什么当-recyclerview-再次向上滑动重新显示第一行的5个卡位时-只有后面3个卡位触发了-onbindviewholder-方法-重新绑定数据呢-明明5个卡位都是复用的。" aria-hidden="true">#</a> Q2: 在这个过程中，为什么当 RecyclerView 再次向上滑动重新显示第一行的5个卡位时，只有后面3个卡位触发了 onBindViewHolder() 方法，重新绑定数据呢？明明5个卡位都是复用的。</h4><p>在上面的操作基础上，我们继续往下操作：</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-303c949a54504fb4.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="先向下再向下.png"></p><p>在第二个问题操作的基础上，目前已经创建了15个 ViewHolder，此时显示的是第1、2行的卡位，那么继续向下滑动两次，这个过程的日志如下：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-d4eddb89b0254056.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="日志.png"></p><p>红框1是第二个问题操作的日志，在这里截出来只是为了显示接下去的日志是在上面的基础上继续操作的；</p><p>红框2就是第一次向下滑时的日志，对比问题2的日志，这次第三行的5个卡位用的 ViewHolder 也都是复用的，而且也只有后面3个卡位触发了 onBindViewHolder() 重新绑定数据；</p><p>红框3是第二次向下滑动时的日志，这次第四行的5个卡位，前3个的卡位用的 ViewHolder 是复用的，后面2个卡位的 ViewHolder 则是重新创建的，而且5个卡位都调用了 onBindViewHolder() 重新绑定数据；</p><p>那么，</p><h4 id="q3-接下去不管是向上滑动还是向下滑动-滑动几次-都不会再有-oncreateviewholder-的日志了-也就是说-recyclerview-总共创建了17个-viewholder-但有时一行的5个卡位只有3个卡位需要重新绑定数据-有时却又5个卡位都需要重新绑定数据-这是为什么呢" tabindex="-1"><a class="header-anchor" href="#q3-接下去不管是向上滑动还是向下滑动-滑动几次-都不会再有-oncreateviewholder-的日志了-也就是说-recyclerview-总共创建了17个-viewholder-但有时一行的5个卡位只有3个卡位需要重新绑定数据-有时却又5个卡位都需要重新绑定数据-这是为什么呢" aria-hidden="true">#</a> Q3：接下去不管是向上滑动还是向下滑动，滑动几次，都不会再有 onCreateViewHolder() 的日志了，也就是说 RecyclerView 总共创建了17个 ViewHolder，但有时一行的5个卡位只有3个卡位需要重新绑定数据，有时却又5个卡位都需要重新绑定数据，这是为什么呢？</h4><p>如果明白 RecyclerView 的回收复用机制，那么这三个问题也就都知道原因了；反过来，如果知道这三个问题的原因，那么理解 RecyclerView 的回收复用机制也就更简单了；所以，带着问题，在特定的场景下去分析源码的话，应该会比较容易。</p><h1 id="源码分析" tabindex="-1"><a class="header-anchor" href="#源码分析" aria-hidden="true">#</a> 源码分析</h1><p>其实，根据问题2的日志，我们就可以回答问题1了。在目前显示1、2行， ViewHolder 的个数为10个的基础上，第三行的5个新卡位要显示出来都需要重新创建 ViewHolder，也就是说，在这个向下滑动的过程，是5个新卡位的复用机制先进行工作，然后第1行的5个被移出屏幕的卡位再进行回收机制工作。</p><p>那么，就先来看看复用机制的源码</p><h2 id="复用机制" tabindex="-1"><a class="header-anchor" href="#复用机制" aria-hidden="true">#</a> 复用机制</h2><h4 id="getviewforposition" tabindex="-1"><a class="header-anchor" href="#getviewforposition" aria-hidden="true">#</a> getViewForPosition()</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//入口在这里
public View getViewForPosition(int position) {
    return getViewForPosition(position, false);
}

View getViewForPosition(int position, boolean dryRun) {
    return tryGetViewHolderForPositionByDeadline(position, dryRun, FOREVER_NS).itemView;
}

ViewHolder tryGetViewHolderForPositionByDeadline(int position,
            boolean dryRun, long deadlineNs) { 
    //复用机制工作原理都在这里
    //...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法是复用机制的入口，也就是 Recycler 开放给外部使用复用机制的api，外部调用这个方法就可以返回想要的 View，而至于这个 View 是复用而来的，还是重新创建得来的，就都由 Recycler 内部实现，对外隐藏。</p><h4 id="trygetviewholderforpositionbydeadline" tabindex="-1"><a class="header-anchor" href="#trygetviewholderforpositionbydeadline" aria-hidden="true">#</a> tryGetViewHolderForPositionByDeadline()</h4><p>所以，Recycler 的复用机制内部实现就在这个方法里。 分析逻辑之前，先看一下 Recycler 的几个结构体，用来缓存 ViewHolder 的。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
 public final class Recycler {
    final ArrayList&lt;ViewHolder&gt; mAttachedScrap = new ArrayList&lt;&gt;();
    ArrayList&lt;ViewHolder&gt; mChangedScrap = null;
    //这个是本篇的重点
    final ArrayList&lt;ViewHolder&gt; mCachedViews = new ArrayList&lt;ViewHolder&gt;();

    private final List&lt;ViewHolder&gt;
            mUnmodifiableAttachedScrap = Collections.unmodifiableList(mAttachedScrap);

    private int mRequestedCacheMax = DEFAULT_CACHE_SIZE;
    int mViewCacheMax = DEFAULT_CACHE_SIZE;
    //这个也是本篇的重点
    RecycledViewPool mRecyclerPool;

    private ViewCacheExtension mViewCacheExtension;

    static final int DEFAULT_CACHE_SIZE = 2;
 }

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>mAttachedScrap:</strong> 用于缓存显示在屏幕上的 item 的 ViewHolder，场景好像是 RecyclerView 在 onLayout 时会先把 children 都移除掉，再重新添加进去，所以这个 List 应该是用在布局过程中临时存放 children 的，反正在 RecyclerView 滑动过程中不会在这里面来找复用的 ViewHolder 就是了。</p><p><strong>mChangedScrap：</strong> 这个没理解是干嘛用的，看名字应该跟 ViewHolder 的数据发生变化时有关吧，在 RecyclerView 滑动的过程中，也没有发现到这里找复用的 ViewHolder，所以这个可以先暂时放一边。</p><p>**mCachedViews：**这个就重要得多了，滑动过程中的回收和复用都是先处理的这个 List，这个集合里存的 ViewHolder 的原本数据信息都在，所以可以直接添加到 RecyclerView 中显示，不需要再次重新 onBindViewHolder()。</p><p><strong>mUnmodifiableAttachedScrap：</strong> 不清楚干嘛用的，暂时跳过。</p><p>**mRecyclerPool：**这个也很重要，但存在这里的 ViewHolder 的数据信息会被重置掉，相当于 ViewHolder 是一个重创新建的一样，所以需要重新调用 onBindViewHolder 来绑定数据。</p><p>**mViewCacheExtension：**这个是留给我们自己扩展的，好像也没怎么用，就暂时不分析了。</p><p>那么接下去就看看复用的逻辑：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    if (position &lt; 0 || position &gt;= mState.getItemCount()) {
        throw new IndexOutOfBoundsException(&quot;Invalid item position &quot; + position
                + &quot;(&quot; + position + &quot;). Item count:&quot; + mState.getItemCount());
    }
    //...省略代码
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一步很简单，position 如果在 item 的范围之外的话，那就抛异常吧。继续往下看</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    //...省略看过的代码
    boolean fromScrapOrHiddenOrCache = false;
    ViewHolder holder = null;
    // 0) If there is a changed scrap, try to find from there
    //上面是Google留的注释，大意是...(emmm，这里我也没理解)
    if (mState.isPreLayout()) {
        holder = getChangedScrapViewForPosition(position);
        fromScrapOrHiddenOrCache = holder != null;
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果是在 isPreLayout() 时，那么就去 mChangedScrap 中找。 那么这个 isPreLayout 表示的是什么？，共5有个赋值的地方。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//只显示相关代码，无关代码省略
protected void onMeasure(int widthSpec, int heightSpec) {
    if (mLayout.mAutoMeasure) {
        //...
    } else {
        // custom onMeasure
        if (mAdapterUpdateDuringMeasure) {
            if (mState.mRunPredictiveAnimations) {
                mState.mInPreLayout = true;
            } else {
                // consume remaining updates to provide a consistent state with the layout pass.
                mAdapterHelper.consumeUpdatesInOnePass();
                mState.mInPreLayout = false;
            }
        } 
    }
    //...
    mState.mInPreLayout = false; // clear
}

private void dispatchLayoutStep1() {
    //...
    mState.mInPreLayout = mState.mRunPredictiveAnimations;
    //...
}

private void dispatchLayoutStep2() {
    //...
    mState.mInPreLayout = mState.mRunPredictiveAnimations;
    mLayout.onLayoutChildren(mRecycler, mState);
    //...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>emmm，看样子，在 LayoutManager 的 onLayoutChildren 前就会置为 false，不过我还是不懂这个过程是干嘛的，滑动过程中好像 mState.mInPreLayou = false，所以并不会来这里，先暂时跳过。继续往下。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    //...省略看过的代码
    // 1) Find by position from scrap/hidden list/cache
    if (holder == null) {
        //这里是第一次找可复用的ViewHolder了，得跟进去看看
        holder = getScrapOrHiddenOrCachedHolderForPosition(position, dryRun);
        //...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>跟进这个方法看看</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder getScrapOrHiddenOrCachedHolderForPosition(int position,boolean dryRun) {
    final int scrapCount = mAttachedScrap.size();

    // Try first for an exact, non-invalid match from scrap.
    for (int i = 0; i &lt; scrapCount; i++) {
        //首先去mAttachedScrap中遍历寻找，匹配条件也很多
        final ViewHolder holder = mAttachedScrap.get(i);
        if (!holder.wasReturnedFromScrap() &amp;&amp; holder.getLayoutPosition() == position
                &amp;&amp; !holder.isInvalid() &amp;&amp; (mState.mInPreLayout || !holder.isRemoved())) {
            holder.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP);
            return holder;
        }
    }
    //省略代码...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先，去 mAttachedScrap 中寻找 position 一致的 viewHolder，需要匹配一些条件，大致是这个 viewHolder 没有被移除，是有效的之类的条件，满足就返回这个 viewHolder。</p><p>所以，这里的关键就是要理解这个 mAttachedScrap 到底是什么，存的是哪些 ViewHolder。</p><p>一次遥控器按键的操作，不管有没有发生滑动，都会导致 RecyclerView 的重新 onLayout，那要 layout 的话，RecyclerView 会先把所有 children 先 remove 掉，然后再重新 add 上去，完成一次 layout 的过程。那么这暂时性的 remove 掉的 viewHolder 要存放在哪呢，就是放在这个 mAttachedScrap 中了，这就是我的理解了。</p><p>所以，感觉这个 mAttachedScrap 中存放的 viewHolder 跟回收和复用关系不大。</p><p><strong>网上一些分析的文章有说，RecyclerView 在复用时会按顺序去 mChangedScrap, mAttachedScrap 等等缓存里找，没有找到再往下去找，从代码上来看是这样没错，但我觉得这样表述有问题。因为就我们这篇文章基于 RecyclerView 的滑动场景来说，新卡位的复用以及旧卡位的回收机制，其实都不会涉及到mChangedScrap 和 mAttachedScrap，所以我觉得还是基于某种场景来分析相对应的回收复用机制会比较好。就像mChangedScrap 我虽然没理解是干嘛用的，但我猜测应该是在当数据发生变化时才会涉及到的复用场景，所以当我分析基于滑动场景时的复用时，即使我对这块不理解，影响也不会很大。</strong></p><p>继续往下看</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder getScrapOrHiddenOrCachedHolderForPosition(int position,boolean dryRun) {
    //...省略看过的代码
    if (!dryRun) {//dryRun一直为false
        //这段代码可看可不看
        View view = mChildHelper.findHiddenNonRemovedView(position);
        if (view != null) {
            // This View is good to be used. We just need to unhide, detach and move to the
            // scrap list.
            final ViewHolder vh = getChildViewHolderInt(view);
            mChildHelper.unhide(view);
            int layoutIndex = mChildHelper.indexOfChild(view);
            if (layoutIndex == RecyclerView.NO_POSITION) {
                 throw new IllegalStateException(&quot;layout index should not be -1 after &quot;
                        + &quot;unhiding a view:&quot; + vh);
            }
            mChildHelper.detachViewFromParent(layoutIndex);
            scrapView(view);
            vh.addFlags(ViewHolder.FLAG_RETURNED_FROM_SCRAP
                    | ViewHolder.FLAG_BOUNCED_FROM_HIDDEN_LIST);
            return vh;
        }
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>emmm，这段也还是没看懂，但估计应该需要一些特定的场景下所使用的复用策略吧，看名字，应该跟 hidden 有关？不懂，跳过这段，应该也没事，滑动过程中的回收复用跟这个应该也关系不大。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder getScrapOrHiddenOrCachedHolderForPosition(int position,boolean dryRun) {
    //...省略看过的代码
    // Search in our first-level recycled view cache.
    //下面就是重点了，去mCachedViews里遍历
    final int cacheSize = mCachedViews.size();
    for (int i = 0; i &lt; cacheSize; i++) {
        final ViewHolder holder = mCachedViews.get(i);
        // invalid view holders may be in cache if adapter has stable ids as they can be
        // retrieved via getScrapOrCachedViewForId
        // 上面的大意是即使是失效的holser也有可能可以拿来复用，但需要我们重写adapter的setHasStadleId并且提供一个id时，在getScrapOrCachedViewForId()里就可以再去mCachedViews里找一遍。  
        if (!holder.isInvalid() &amp;&amp; holder.getLayoutPosition() == position) {
            if (!dryRun) { //dryRun一直为false
                mCachedViews.remove(i);//所以，如果position匹配，那么就将这个ViewHolder移除mCachedViews
            }
            if (DEBUG) {
                Log.d(TAG, &quot;getScrapOrHiddenOrCachedHolderForPosition(&quot; + position
                        + &quot;) found match in cache: &quot; + holder);
            }
            return holder;
        
    }
    return null;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里就要画重点啦，记笔记记笔记，滑动场景中的复用会用到这里的机制。</p><p>mCachedViews 的大小默认为2。遍历 mCachedViews，找到 position 一致的 ViewHolder，之前说过，mCachedViews 里存放的 ViewHolder 的数据信息都保存着，<strong>所以 mCachedViews 可以理解成，只有原来的卡位可以重新复用这个 ViewHolder，新位置的卡位无法从 mCachedViews 里拿 ViewHolder出来用</strong>。</p><p>找到 viewholder 后</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    //...省略看过的代码
    // 1) Find by position from scrap/hidden list/cache
    if (holder == null) {
        //这里是第一次找可复用的ViewHolder了，得跟进去看看
        holder = getScrapOrHiddenOrCachedHolderForPosition(position, dryRun);
        //之前分析跟进了上面那个方法，找到ViewHolder后
        if (holder != null) {
            //需要再次验证一下这个ViewHodler是否可以拿来复用
            if (!validateViewHolderForOffsetPosition(holder)) {
                // recycle holder (and unscrap if relevant) since it can&#39;t be used
                if (!dryRun) {
                    // we would like to recycle this but need to make sure it is not used by
                    // animation logic etc.
                    //如果不能复用，就把它要么仍到mAttachedScrap或者扔到ViewPool里
                    holder.addFlags(ViewHolder.FLAG_INVALID);
                    if (holder.isScrap()) {
                        removeDetachedView(holder.itemView, false);
                        holder.unScrap();
                    } else if (holder.wasReturnedFromScrap()) {
                        holder.clearReturnedFromScrapFlag();
                    }
                    recycleViewHolderInternal(holder);
                }
                holder = null;
            } else {
                fromScrapOrHiddenOrCache = true;
            }
        }
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就算 position 匹配找到了 ViewHolder，还需要判断一下这个 ViewHolder 是否已经被 remove 掉，type 类型一致不一致，如下。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
boolean validateViewHolderForOffsetPosition(ViewHolder holder) {
    // if it is a removed holder, nothing to verify since we cannot ask adapter anymore
    // if it is not removed, verify the type and id.
    if (holder.isRemoved()) {
        if (DEBUG &amp;&amp; !mState.isPreLayout()) {
            throw new IllegalStateException(&quot;should not receive a removed view unless it&quot;
                    + &quot; is pre layout&quot;);
        }
        return mState.isPreLayout();
    }
    if (holder.mPosition &lt; 0 || holder.mPosition &gt;= mAdapter.getItemCount()) {
        throw new IndexOutOfBoundsException(&quot;Inconsistency detected. Invalid view holder &quot;
                + &quot;adapter position&quot; + holder);
    }
    //如果type类型不一样，那就不能复用
    if (!mState.isPreLayout()) {
        // don&#39;t check type if it is pre-layout.
        final int type = mAdapter.getItemViewType(holder.mPosition);
        if (type != holder.getItemViewType()) {
            return false;
        }
    }
    if (mAdapter.hasStableIds()) {
        return holder.getItemId() == mAdapter.getItemId(holder.mPosition);
    }
    return true;    
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上是在 mCachedViews 中寻找，没有找到的话，就继续再找一遍，刚才是通过 position 来找，那这次就换成id，然后重复上面的步骤再找一遍，如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    //...省略看过的代码
    if (holder == null) {
        final int offsetPosition = mAdapterHelper.findPositionOffset(position);
        if (offsetPosition &lt; 0 || offsetPosition &gt;= mAdapter.getItemCount()) {
            throw new IndexOutOfBoundsException(&quot;//省略...&quot;);
        }

        final int type = mAdapter.getItemViewType(offsetPosition);
        // 2) Find from scrap/cache via stable ids, if exists
        if (mAdapter.hasStableIds()) {//如果有设置stableIs，就再从Scrap和cached里根据id找一次
            holder = getScrapOrCachedViewForId(mAdapter.getItemId(offsetPosition),
                   type, dryRun);
            if (holder != null) {
                // update position
                holder.mPosition = offsetPosition;
                fromScrapOrHiddenOrCache = true;
            }
        }
        //省略之后步骤，后续分析...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>getScrapOrCachedViewForId() 做的事跟 getScrapOrHiddenOrCacheHolderForPosition() 其实差不多，只不过一个是通过 position 来找 ViewHolder，一个是通过 id 来找。而这个 id 并不是我们在 xml 中设置的 android:id， 而是 Adapter 持有的一个属性，默认是不会使用这个属性的，所以这里其实是不会执行的，除非我们重写了 Adapter 的 setHasStableIds()，既然不是常用的场景，那就先略过吧，那就继续往下。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    //...省略看过的代码
    if (holder == null) {
        final int offsetPosition = mAdapterHelper.findPositionOffset(position);
        //省略无关代码...
        final int type = mAdapter.getItemViewType(offsetPosition);
        //省略上述步骤跟getScrapOrCachedViewForId()相关的代码...
        //这里开始就又去另一个地方找了，ViewCacheExtension
        if (holder == null &amp;&amp; mViewCacheExtension != null) {
            // We are NOT sending the offsetPosition because LayoutManager does not
            // know it.
            final View view = mViewCacheExtension
                    .getViewForPositionAndType(this, position, type);
            if (view != null) {
                holder = getChildViewHolder(view);
                if (holder == null) {
                    throw new IllegalArgumentException(&quot;getViewForPositionAndType returned&quot; + &quot; a view which does not have a ViewHolder&quot;);
                } else if (holder.shouldIgnore()) {
                    throw new IllegalArgumentException(&quot;getViewForPositionAndType returned&quot; + &quot; a view that is ignored. You must call stopIgnoring before&quot; + &quot; returning this view.&quot;);
                }
            }
        }
        //省略之后步骤，后续分析...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个就是常说扩展类了，RecyclerView 提供给我们自定义实现的扩展类，我们可以重写 getViewForPositionAndType() 方法来实现自己的复用策略。不过，也没用过，那这部分也当作不会执行，略过。继续往下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    //...省略看过的代码
    if (holder == null) {
        final int offsetPosition = mAdapterHelper.findPositionOffset(position);
        //省略无关代码...
        final int type = mAdapter.getItemViewType(offsetPosition);
        //省略看过的的代码...
        //这里开始就又去另一个地方找了，RecycledViewPool
        if (holder == null) { // fallback to pool
            if (DEBUG) {
                Log.d(TAG, &quot;tryGetViewHolderForPositionByDeadline(&quot;+ position + &quot;) fetching from shared pool&quot;);
            }
            //跟进这个方法看看
            holder = getRecycledViewPool().getRecycledView(type);
            if (holder != null) {
                //如果在ViewPool里找到可复用的ViewHolder，那就重置ViewHolder的数据，这样ViewHolder就可以当作全新的来使用了
                holder.resetInternal();
                if (FORCE_INVALIDATE_DISPLAY_LIST) {
                    invalidateDisplayListInt(holder);
                }
            }
        }
        //省略之后步骤，后续分析...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里也是重点了，记笔记记笔记。</p><p>这里是去 RecyclerViewPool 里取 ViewHolder，ViewPool 会根据不同的 item type 创建不同的 List，每个 List 默认大小为5个。看一下去 ViewPool 里是怎么找的</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
public ViewHolder getRecycledView(int viewType) {
    //根据type，只要不为空，就将最后一个ViewHolder移出来复用
    final ScrapData scrapData = mScrap.get(viewType);
    if (scrapData != null &amp;&amp; !scrapData.mScrapHeap.isEmpty()) {
        final ArrayList&lt;ViewHolder&gt; scrapHeap = scrapData.mScrapHeap;
        return scrapHeap.remove(scrapHeap.size() - 1);
    }
    return null;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>之前说过，ViewPool 会根据不同的 viewType 创建不同的集合来存放 ViewHolder，那么复用的时候，只要 ViewPool 里相同的 type 有 ViewHolder 缓存的话，就将最后一个拿出来复用，不用像 mCachedViews 需要各种匹配条件，<strong>只要有就可以复用</strong>。</p><p>拿到 ViewHolder 之后，还会再次调用 resetInternal() 来重置 ViewHolder，这样 ViewHolder 就可以当作一个全新的 ViewHolder 来使用了，<strong>这也就是为什么从这里拿的 ViewHolder 都需要重新 onBindViewHolder() 了</strong>。</p><p>那如果在 ViewPool 里还是没有找到呢，继续往下看</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    //...省略看过的代码
    if (holder == null) {
        final int offsetPosition = mAdapterHelper.findPositionOffset(position);
        //省略无关代码...
        final int type = mAdapter.getItemViewType(offsetPosition);
        //省略看过的的代码...
        //都没找到的话，就调用Adapter.onCreateAdapter()来新建一个ViewHolder了
        if (holder == null) {
            //省略无关代码...
            holder = mAdapter.createViewHolder(RecyclerView.this, type);//新建一个ViewHolder
            //省略无关代码...
        }
    }
    //省略之后步骤，后续分析
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果 ViewPool 中都没有找到 ViewHolder 来使用的话，那就调用 Adapter 的 onCreateViewHolder 来创建一个新的 ViewHolder 使用。</p><p>上面一共有很多步骤来找 ViewHolder，不管在哪个步骤，只要找到 ViewHolder 的话，那下面那些步骤就不用管了，然后都要继续往下判断是否需要重新绑定数据，还有检查布局参数是否合法。如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
ViewHolder tryGetViewHolderForPositionByDeadline(int position,
                boolean dryRun, long deadlineNs) {
    //...省略上述分析的找ViewHolder的代码...
    //代码执行到这里，ViewHolder肯定不为Null了，因为就算在各个缓存里没找到，最后一步也会重新创建一个
    boolean bound = false;
    if (mState.isPreLayout() &amp;&amp; holder.isBound()) {
        // do not update unless we absolutely have to.
        holder.mPreLayoutPosition = position;
    } else if (!holder.isBound() || holder.needsUpdate() || holder.isInvalid()) {
        if (DEBUG &amp;&amp; holder.isRemoved()) {
            throw new IllegalStateException(&quot;Removed holder should be bound and it should&quot; + &quot; come here only in pre-layout. Holder: &quot; + holder);
        }
        final int offsetPosition = mAdapterHelper.findPositionOffset(position);
        //调用Adapter.onBindViewHolder()来重新绑定数据
        bound = tryBindViewHolderByDeadline(holder, offsetPosition, position, deadlineNs);
    }
    //下面是验证itemView的布局参数是否可用，并设置可用的布局参数
    final ViewGroup.LayoutParams lp = holder.itemView.getLayoutParams();
    final LayoutParams rvLayoutParams;
    if (lp == null) {
        rvLayoutParams = (LayoutParams) generateDefaultLayoutParams();
        holder.itemView.setLayoutParams(rvLayoutParams);
    } else if (!checkLayoutParams(lp)) {
        rvLayoutParams = (LayoutParams) generateLayoutParams(lp);
        holder.itemView.setLayoutParams(rvLayoutParams);
    } else {
        rvLayoutParams = (LayoutParams) lp;
    }
    rvLayoutParams.mViewHolder = holder;
    rvLayoutParams.mPendingInvalidate = fromScrapOrHiddenOrCache &amp;&amp; bound;
    return holder;
    //结束
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这里，tryGetViewHolderForPositionByDeadline() 这个方法就结束了。这大概就是 RecyclerView 的复用机制，中间我们跳过很多地方，因为 RecyclerView 有各种场景可以刷新他的 view，比如重新 setLayoutManager()，重新 setAdapter()，或者 notifyDataSetChanged()，或者滑动等等之类的场景，只要重新layout，就会去回收和复用 ViewHolder，所以这个复用机制需要考虑到各种各样的场景。</p><p>把代码一行行的啃透有点吃力，所以我就只借助 RecyclerView 的滑动的这种场景来分析它涉及到的回收和复用机制。</p><p>下面就分析一下回收机制</p><h1 id="回收机制" tabindex="-1"><a class="header-anchor" href="#回收机制" aria-hidden="true">#</a> 回收机制</h1><p>回收机制的入口就有很多了，因为 Recycler 有各种结构体，比如mAttachedScrap，mCachedViews 等等，不同结构体回收的时机都不一样，入口也就多了。</p><p>所以，还是基于 RecyclerView 的滑动场景下，移出屏幕的卡位回收时的入口是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//回收入口之一
public void recycleView(View view) {
    // This public recycle method tries to make view recycle-able since layout manager
    // intended to recycle this view (e.g. even if it is in scrap or change cache)
    ViewHolder holder = getChildViewHolderInt(view);
    if (holder.isTmpDetached()) {
        removeDetachedView(view, false);
    }
    if (holder.isScrap()) {
        holder.unScrap();
    } else if (holder.wasReturnedFromScrap()){
        holder.clearReturnedFromScrapFlag();
    }
    //回收的内部实现，跟进看看
    recycleViewHolderInternal(holder);
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本篇分析的滑动场景，在 RecyclerView 滑动时，会交由 LinearLayoutManager 的 scrollVerticallyBy() 去处理，然后 LayoutManager 会接着调用 fill() 方法去处理需要复用和回收的卡位，最终会调用上述 recyclerView() 这个方法开始进行回收工作。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
void recycleViewHolderInternal(ViewHolder holder) {
    //省略代码...
    if (forceRecycle || holder.isRecyclable()) {
        //mViewCacheMax大小默认为2
        if (mViewCacheMax &gt; 0 /*省略其他条件*/) {
            // Retire oldest cached view
            int cachedViewSize = mCachedViews.size();
            //回收时，先将ViewHolder缓存在mCachedViews里，如果满了，调用recycleCachedViewAt(0)移除一个，好空出位置来
            if (cachedViewSize &gt;= mViewCacheMax &amp;&amp; cachedViewSize &gt; 0) {
                recycleCachedViewAt(0);
                cachedViewSize--;
            }

            //省略无关代码...

            //将最近刚刚回收的ViewHolder放在mCachedViews里
            mCachedViews.add(targetCacheIndex, holder);
            cached = true;
        }
        if (!cached) {
            //如果设置不用mCachedViewd缓存的话，那回收时就扔进ViewPool里等待复用
            addViewHolderToRecycledViewPool(holder, true);
            recycled = true;
        }
    } 
    //省略无关代码...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>跟进 recycleCachedViewAt(0) 方法看看</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>void recycleCachedViewAt(int cachedViewIndex) {
    if (DEBUG) {
        Log.d(TAG, &quot;Recycling cached view at index &quot; + cachedViewIndex);
    }
    ViewHolder viewHolder = mCachedViews.get(cachedViewIndex);
    if (DEBUG) {
        Log.d(TAG, &quot;CachedViewHolder to be recycled: &quot; + viewHolder);
    }
    //将mCachedViews里缓存的ViewHolder取出来，扔进ViewPool里缓存
    addViewHolderToRecycledViewPool(viewHolder, true);
    mCachedViews.remove(cachedViewIndex);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>继续跟进 addViewHolderToRecycledViewPool() 里看看，这个方法在上上代码块里也出现</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>void addViewHolderToRecycledViewPool(ViewHolder holder, boolean dispatchRecycled) {
    clearNestedRecyclerViewIfNotNested(holder);
    ViewCompat.setAccessibilityDelegate(holder.itemView, null);
    if (dispatchRecycled) {
        //这个方法会去回调Adapter里的onViewRecycle()，所以Adapter接收到该回调时是ViewHolder被扔进ViewPool里才会触发的
        //如果ViewHolder只是被mCachedViews缓存了，那Adapter的onViewRecycle()是不会回调的，所以不是所有被移出屏幕的item都会触发onViewRecycle()方法的
        dispatchViewRecycled(holder);
    }
    holder.mOwnerRecyclerView = null
    //在扔进ViewPool前回调一些方法，并对ViewHolder的一些标志置位，然后继续跟进看看
    getRecycledViewPool().putRecycledView(holder);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 ViewHolder 扔进 ViewPool 里之前，会先去回调 Adapter 里的 onViewRecycle()，所以 Adapter 接收到该回调时是 ViewHolder 被扔进 ViewPool 里才会触发的。如果 ViewHolder 只是被 mCachedViews 缓存了，那 Adapter 的 onViewRecycle() 是不会回调的，所以不是所有被移出屏幕的 item 都会触发 onViewRecycle() 方法的，这点需要注意一下。继续跟进看看</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public void putRecycledView(ViewHolder scrap) {
    final int viewType = scrap.getItemViewType();
    final ArrayList scrapHeap = getScrapDataForType(viewType).mScrapHeap;
    if (mScrap.get(viewType).mMaxScrap &lt;= scrapHeap.size()) {
        //如果ViewPool满了，就不缓存了，默认大小为5
        return;
    }
    if (DEBUG &amp;&amp; scrapHeap.contains(scrap)) {
        throw new IllegalArgumentException(&quot;this scrap item already exists&quot;);
    }
    //缓存前先将ViewHolder的信息重置，这样ViewHolder下次被拿出来复用时就可以当作全新的ViewHolder来使用了
    scrap.resetInternal();
    scrapHeap.add(scrap);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，ViewHolder 在扔进 ViewPool 前会先 reset，这里的重置指的是 ViewHolder 保存的一些信息，比如 position，跟它绑定的 RecycleView 啊之类的，并不会清空 itemView，所以复用时才会经常出现 itemView 显示之前卡位的图片信息之类的情况，这点需要区分一下。</p><p>回收的逻辑比较简单，由 LayoutManager 来遍历移出屏幕的卡位，然后对每个卡位进行回收操作，回收时，都是把 ViewHolder 放在 mCachedViews 里面，如果 mCachedViews 满了，那就在 mCachedViews 里拿一个 ViewHolder 扔到 ViewPool 缓存里，然后 mCachedViews 就可以空出位置来放新回收的 ViewHolder 了。</p><h2 id="总结一下" tabindex="-1"><a class="header-anchor" href="#总结一下" aria-hidden="true">#</a> 总结一下</h2><p>RecyclerView 滑动场景下的回收复用涉及到的结构体两个： <strong>mCachedViews 和 RecyclerViewPool</strong></p><p>mCachedViews 优先级高于 RecyclerViewPool，回收时，最新的 ViewHolder 都是往 mCachedViews 里放，如果它满了，那就移出一个扔到 ViewPool 里好空出位置来缓存最新的 ViewHolder。</p><p>复用时，也是先到 mCachedViews 里找 ViewHolder，但需要各种匹配条件，概括一下就是只有原来位置的卡位可以复用存在 mCachedViews 里的 ViewHolder，如果 mCachedViews 里没有，那么才去 ViewPool 里找。</p><p>在 ViewPool 里的 ViewHolder 都是跟全新的 ViewHolder 一样，只要 type 一样，有找到，就可以拿出来复用，重新绑定下数据即可。</p><p>整体的流程图如下：（可放大查看）</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-0868f1fe3dcf17b6.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="滑动场景下的回收复用流程图.png"></p><p>最后，解释一下开头的问题</p><h4 id="q1-如果向下滑动-新一行的5个卡位的显示会去复用缓存的-viewholder-第一行的5个卡位会移出屏幕被回收-那么在这个过程中-是先进行复用再回收-还是先回收再复用-还是边回收边复用-也就是说-新一行的5个卡位复用的-viewholder-有可能是第一行被回收的5个卡位吗-1" tabindex="-1"><a class="header-anchor" href="#q1-如果向下滑动-新一行的5个卡位的显示会去复用缓存的-viewholder-第一行的5个卡位会移出屏幕被回收-那么在这个过程中-是先进行复用再回收-还是先回收再复用-还是边回收边复用-也就是说-新一行的5个卡位复用的-viewholder-有可能是第一行被回收的5个卡位吗-1" aria-hidden="true">#</a> Q1:如果向下滑动，新一行的5个卡位的显示会去复用缓存的 ViewHolder，第一行的5个卡位会移出屏幕被回收，那么在这个过程中，是先进行复用再回收？还是先回收再复用？还是边回收边复用？也就是说，新一行的5个卡位复用的 ViewHolder 有可能是第一行被回收的5个卡位吗？</h4><p>答：先复用再回收，新一行的5个卡位先去目前的 mCachedViews 和 ViewPool 的缓存中寻找复用，没有就重新创建，然后移出屏幕的那行的5个卡位再回收缓存到 mCachedViews 和 ViewPool 里面，所以新一行5个卡位和复用不可能会用到刚移出屏幕的5个卡位。</p><h4 id="q2-在这个过程中-为什么当-recyclerview-再次向上滑动重新显示第一行的5个卡位时-只有后面3个卡位触发了-onbindviewholder-方法-重新绑定数据呢-明明5个卡位都是复用的。-1" tabindex="-1"><a class="header-anchor" href="#q2-在这个过程中-为什么当-recyclerview-再次向上滑动重新显示第一行的5个卡位时-只有后面3个卡位触发了-onbindviewholder-方法-重新绑定数据呢-明明5个卡位都是复用的。-1" aria-hidden="true">#</a> Q2: 在这个过程中，为什么当 RecyclerView 再次向上滑动重新显示第一行的5个卡位时，只有后面3个卡位触发了 onBindViewHolder() 方法，重新绑定数据呢？明明5个卡位都是复用的。</h4><p>答：滑动场景下涉及到的回收和复用的结构体是 mCachedViews 和 ViewPool，前者默认大小为2，后者为5。所以，当第三行显示出来后，第一行的5个卡位被回收，回收时先缓存在 mCachedViews，满了再移出旧的到 ViewPool 里，所有5个卡位有2个缓存在 mCachedViews 里，3个缓存在 ViewPool，至于是哪2个缓存在 mCachedViews，这是由 LayoutManager 控制。</p><p>上面讲解的例子使用的是 GridLayoutManager，滑动时的回收逻辑则是在父类 LinearLayoutManager 里实现，回收第一行卡位时是从后往前回收，所以最新的两个卡位是0、1，会放在 mCachedViews 里，而2、3、4的卡位则放在 ViewPool 里。</p><p>所以，当再次向上滑动时，第一行5个卡位会去两个结构体里找复用，之前说过，mCachedViews 里存放的 ViewHolder 只有原本位置的卡位才能复用，所以0、1两个卡位都可以直接去 mCachedViews 里拿 ViewHolder 复用，而且这里的 ViewHolder 是不用重新绑定数据的，至于2、3、4卡位则去 ViewPool 里找，刚好 ViewPool 里缓存着3个 ViewHolder，所以第一行的5个卡位都是用的复用的，而从 ViewPool 里拿的复用需要重新绑定数据，才会这样只有三个卡位需要重新绑定数据。</p><h4 id="q3-接下去不管是向上滑动还是向下滑动-滑动几次-都不会再有-oncreateviewholder-的日志了-也就是说-recyclerview-总共创建了17个-viewholder-但有时一行的5个卡位只有3个卡位需要重新绑定数据-有时却又5个卡位都需要重新绑定数据-这是为什么呢-1" tabindex="-1"><a class="header-anchor" href="#q3-接下去不管是向上滑动还是向下滑动-滑动几次-都不会再有-oncreateviewholder-的日志了-也就是说-recyclerview-总共创建了17个-viewholder-但有时一行的5个卡位只有3个卡位需要重新绑定数据-有时却又5个卡位都需要重新绑定数据-这是为什么呢-1" aria-hidden="true">#</a> Q3：接下去不管是向上滑动还是向下滑动，滑动几次，都不会再有 onCreateViewHolder() 的日志了，也就是说 RecyclerView 总共创建了17个 ViewHolder，但有时一行的5个卡位只有3个卡位需要重新绑定数据，有时却又5个卡位都需要重新绑定数据，这是为什么呢？</h4><p>答：有时一行只有3个卡位需要重新绑定的原因跟Q2一样，因为 mCachedView 里正好缓存着当前位置的 ViewHolder，本来就是它的 ViewHolder 当然可以直接拿来用。而至于为什么会创建了17个 ViewHolder，那是因为再第四行的卡位要显示出来时，ViewPool 里只有3个缓存，而第四行的卡位又用不了 mCachedViews 里的2个缓存，因为这两个缓存的是6、7卡位的 ViewHolder，所以就需要再重新创建2个 ViewHodler 来给第四行最后的两个卡位使用。</p>`,114),a=[s];function r(o,v){return i(),n("div",null,a)}const t=e(l,[["render",r],["__file","【代码版】基于场景的RecyclerView回收复用机制的分析.html.vue"]]);export{t as default};
