import{_ as l,r,o as s,c as o,a,b as e,e as i,d as n}from"./app-2pyCoCP5.js";const c={},t=n(`<p>这次想来讲讲 <strong>ThreadLocal</strong> 这个很神奇的东西，最开始接触到这个是看了主席的《开发艺术探索》，后来是在研究 ViewRootImpl 中又碰到一次，而且还发现 Android 中一个小彩蛋，就越发觉得这个东西很有趣。</p><h1 id="提问" tabindex="-1"><a class="header-anchor" href="#提问" aria-hidden="true">#</a> 提问</h1><p>开始看源码前，还是照例来思考一些问题，带着疑问过源码比较有条理，效率比较高一点。</p><p>大伙都清楚，Android 其实是基于消息驱动机制运行的，主线程有个消息队列，通过主线程对应的 Looper 一直在对这个消息队列进行轮询操作。</p><p>但其实，每个线程都可以有自己的消息队列，都可以有自己的 Looper 来轮询队列，不清楚大伙有接触过 HandlerThread 这东西么，之前看过一篇文章，通过 HandlerThread 这种单线程消息机制来替代线程同步操作的场景，这种思路很让人眼前一亮。</p><p>而 Looper 有一个静态方法：<code>Looper.myLooper()</code></p><p>通过这个方法可以获取到当前线程的 Looper 对象，那么问题来了：</p><p><strong>Q1：在不同线程中调用 <code>Looper.myLooper()</code> 为什么可以返回各自线程的 Looper 对象呢？明明我们没有传入任何线程信息，内部是如何找到当前线程对应的 Looper 对象呢？</strong></p><p>我们再来看一段《开发艺术探索》书中的描述：</p><blockquote><p>ThreadLocal 是一个线程内部的数据存储类，通过它可以在指定的线程中存储数据，数据存储以后，只有在指定线程中可以获取到存储的数据，对于其他线程来说则无法获取到数据。</p><p>虽然在不同线程中访问的是同一个 ThreadLocal 对象，但是它们通过 ThreadLocal 获取到的值却是不一样的。</p><p>一般来说，当某些数据是以线程为作用域并且不同线程具有不同的数据副本的时候，就可以考虑采用 ThreadLocal。</p></blockquote><p>好，问题来了：</p><p><strong>Q2：ThreadLocal 是如何做到同一个对象，却维护着不同线程的数据副本呢？</strong></p><h1 id="源码分析" tabindex="-1"><a class="header-anchor" href="#源码分析" aria-hidden="true">#</a> 源码分析</h1><p><strong>ps：ThreadLocal 内部实现在源码版本 android-24 做了改动，《开发艺术探索》书中分析的源码是 android-24 版本之前的实现原理，本篇分析的源码版本基于 android-25，感兴趣的可以阅读完本篇再去看看《开发艺术探索》，比较一下改动前后的实现原理是否有何不同。</strong></p><p>因为是从 Q1 深入才接触到 ThreadLocal 的，那么这次源码阅读的入口很简单，也就是 <code>Looper.myLopper()</code>：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//Looper#myLooper()
public static @Nullable Looper myLooper() {
	return sThreadLocal.get();
}

static final ThreadLocal&lt;Looper&gt; sThreadLocal = new ThreadLocal&lt;Looper&gt;();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，<code>Looper.myLooper()</code> 实际上是调用的 ThreadLocal 的 <code>get()</code> 方法，也就是说，<code>Looper.myLooper()</code> 能实现即使不传入线程信息也能获取到各自线程的 Looper 是通过 ThreadLocal 实现的。</p><h3 id="get" tabindex="-1"><a class="header-anchor" href="#get" aria-hidden="true">#</a> get()</h3><p>那么，下面就继续跟着走下去吧：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ThreadLocal#get()
public T get() {
    //1. 获取当前的线程
    Thread t = Thread.currentThread();
    //2. 以当前线程为参数，获取一个 ThreadLocalMap 对象
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        //3. map 不为空，则以当前 ThreadLocal 对象实例作为key值，去map中取值，有找到直接返回
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null)
            return (T)e.value;
    }
    //4. map 为空或者在map中取不到值，那么走这里，返回默认初始值
    return setInitialValue();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所有的关键点就是从这里开始看了，到底 ThreadLocal 是如何实现即使调用同一个对象同一个方法，却能自动根据当前线程返回不同的数据，一步步来看。</p><p>首先，获取当前线程对象。</p><p>接着，调用了 <code>getMap()</code> 方法，并传入了当前线程，看看这个 <code>getMap()</code> 方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ThreadLocal#getMap()
ThreadLocalMap getMap(Thread t) {
	return t.threadLocals;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原来直接返回线程的 threadLocals 成员变量，由于 ThreadLocal 与 Thread 位于同一个包中，所以可以直接访问包权限的成员变量。我们接着看看 Thread 中的这个成员变量 threadLocals :</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//Thread.threadLocal
ThreadLocal.ThreadLocalMap threadLocals = null;

//ThreadLocal#createMap()
void createMap(Thread t, T firstValue) {
    t.threadLocals = new ThreadLocalMap(this, firstValue);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Thread 中的 threadLocal 成员变量初始值为 null，并且在 Thread 类中没有任何赋值的地方，只有在 ThreadLocal 中的 <code>createMap()</code> 方法中对其赋值，而调用 <code>createMap()</code> 的地方就两个：<code>set() </code> 和 <code>setInitialValue()</code>，而调用 <code>setInitialValue()</code> 方法的地方只有 <code>get()</code>。</p><p>也就是说，ThreadLocal 的核心其实也就是在 <code>get()</code> 和 <code>set()</code>，搞懂这两个方法的流程原理，那么也就基本理解 ThreadLocal 这个东西的原理了。</p><p>到这里，先暂时停一停，<strong>我们先来梳理一下目前的信息，因为到这里为止应该对 ThreadLocal 原理有点儿眉目了</strong>：</p><p>不同线程调用相同的 <code>Looper.myLooper()</code>，其实内部是调用了 ThreadLocal 的 <code>get()</code> 方法，而 <code>get()</code> 方法则在一开始就先获取当前线程的对象，然后直接通过包权限获取当前线程的 threadLocals 成员变量，该变量是一个 ThreadLocal 的内部类 ThreadLocalMap 对象，初始值为 null。</p><p>以上，是我们到目前所梳理的信息，虽然我们还不知道 ThreadLocalMap 作用是什么，但不妨碍我们对其进行猜测啊。如果这个类是用于存储数据的，那么一切是不是就可以说通了！</p><p><strong>为什么不同线程中明明调用了同一对象的同一方法，却可以返回各自线程对应的数据呢？原来，这些数据本来就是存储在各自线程中了，ThreadLocal 的 <code>get()</code> 方法内部其实会先去获取当前的线程对象，然后直接将线程存储的容器取出来。</strong></p><p>所以，我们来验证一下，ThreadLocalMap 是不是一个用于存储数据的容器类：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ThreadLocal$ThreadLocalMap
static class ThreadLocalMap {
    static class Entry extends WeakReference&lt;ThreadLocal&gt; {
        Object value;
    }
    private Entry[] table;
    
    private void set(ThreadLocal key, Object value) {
    	...
    }
    
    private Entry getEntry(ThreadLocal key) {
     	...   
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>猜对了，很明显，ThreadLocalMap 就是一个用于存储数据的容器类，set 操作，get 操作，连同容器数组都有了，这样一个类不是用于存储数据的容器类还是什么。至于它内部的各种扩容算法，hash 算法，我们就不管了，不深入下去了，知道这个类是干嘛用的就够了。当然，感兴趣你可以自行深入研究。</p><p>那么，好，我们回到最初的 ThreadLocal 的 <code>get()</code> 方法中继续分析：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ThreadLocal#get()
public T get() {
    //1. 获取当前的线程
    Thread t = Thread.currentThread();
    //2. 以当前线程为参数，获取一个 ThreadLocalMap 对象
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        //3. map 不为空，则以当前 ThreadLocal 对象实例作为key值，去map中取值，有找到直接返回
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null)
            return (T)e.value;
    }
    //4. map 为空或者在map中取不到值，那么走这里，返回默认初始值
    return setInitialValue();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第 1 步，第 2 步我们已经梳理清楚了，就是去获取当前线程的数据存储容器，也就是 map。拿到容器之后，其实也就分了两条分支走，一是容器不为 null，一是容器为 null 的场景。我们先来看看容器为 null 场景的处理：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ThreadLocal#setInitialValue()
private T setInitialValue() {
    //1. 获取初始值，默认返回Null，允许重写
    T value = initialValue();
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        //2. 创建线程t的数据存储容器：threadLocals
        createMap(t, value);
    //3. 返回初始值
    return value;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先会通过 <code>initialValue()</code> 去获取初始值，默认实现是返回 null，但该方法允许重写。然后同样去获取当前线程的数据存储容器 map，为null，所以这里会走 <code>createMap()</code>，而 <code>createMap()</code> 我们之前分析过了，就是去创建参数传进去的线程自己的数据存储容器 threadLocals，并将初始值保存在容器中，最后返回这个初始值。</p><p>那么，这条分支到这里就算结束了，我们回过头继续看另一条分支，都跟完了再来小结：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ThreadLocal#get()
public T get() {
    //1. 获取当前的线程
    Thread t = Thread.currentThread();
    //2. 以当前线程为参数，获取一个 ThreadLocalMap 对象
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        //3. map 不为空，则以当前 ThreadLocal 对象实例作为key值，去map中取值，有找到直接返回
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null)
            return (T)e.value;
    }
    //4. map 为空或者在map中取不到值，那么走这里，返回默认初始值
    return setInitialValue();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>另一条分支很简单，也就是如果线程的数据存储容器不为空，那么就以当前 ThreadLocal 对象实例作为 key 值，去这个容器中寻找对应的数据，如果有找到直接返回，没找到，那么就走 <code>setInitialValue()</code>，该方法内部会去取默认的初始值，然后以当前 ThreadLocal 对象实例作为 key 值存入到当前线程的数据存储容器中，并返回初始值。</p><p><strong>到这里，<code>get()</code> 的流程已经梳理完毕了，那就先来小结一下：</strong></p><p>当不同的线程调用同一个 ThreadLocal 对象的 <code>get()</code> 方法时，内部其实是会先获取当前线程的对象，然后通过包权限直接获取对象的数据存储容器 ThreadLocalMap 对象，如果容器为空，那么会新建个容器，并将初始值和当前 ThreadLocal 对象绑定存储进去，同时返回初始值；如果容器不为空，那么会以当前 ThreadLocal 对象作为 key 值去容器中寻找，有找到直接返回，没找到，那么以同样的操作先存入容器再返回初始值。</p><p>这种设计思想很巧妙，首先，容器是各自线程对象的成员变量，也就是数据其实就是交由各自线程维护，那么不同线程即使调用了同一 ThreadLocal 对象的同一方法，取的数据也是各自线程的数据副本，这样自然就可以达到维护不同线程各自相互独立的数据副本，且以线程为作用域的效果了。</p><p>同时，在将数据存储到各自容器中是以当前 ThreadLocal 对象实例为 key 存储，这样，即使在同一线程中调用了不同的 ThreadLocal 对象的 <code>get()</code> 方法，所获取到的数据也是不同的，达到同一线程中不同 ThreadLocal 虽然共用一个容器，但却可以相互独立运作的效果。</p><p>（特别佩服 Google 工程师！）</p><h3 id="set" tabindex="-1"><a class="header-anchor" href="#set" aria-hidden="true">#</a> set()</h3><p><code>get()</code> 方法我们已经梳理完了，其实到这里，ThreadLocal 的原理基本上算是理清了，而且有一点，梳理到现在，其实 ThreadLocal 该如何使用我们也可以猜测出来了。</p><p>你问我为什么可以猜测出来了？</p><p>忘了我们上面梳理的 <code>get()</code> 方法了么，内部会一直先去取线程的容器，然后再从容器中取最后的值，取不到就会一直返回初始值，会有哪种应用场景是需要一直返回初始值的么？肯定没有，既然如此，就要保证在容器中可以取到值，那么，自然就是要先 <code>set()</code> 将数据存到容器中，<code>get()</code> 的时候才会有值啊。</p><p>所以，用法很简单，实例化 ThreadLocal 对象后，直接调用 <code>set()</code> 存值，调用 <code>get()</code> 取值，两个方法内部会自动根据当前线程选择相对应的容器存取。</p><p>我们来看看 <code>set()</code> 是不是这样：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ThreadLocal#set()
public void set(T value) {
    //1. 取当前线程对象
	Thread t = Thread.currentThread();
    //2. 取当前线程的数据存储容器
	ThreadLocalMap map = getMap(t);
	if (map != null)
        //3. 以当前ThreadLocal实例对象为key，存值
		map.set(this, value);
	else
        //4. 新建个当前线程的数据存储容器，并以当前ThreadLocal实例对象为key，存值
		createMap(t, value);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>是吧，<code>set()</code> 方法里都是调用已经分析过的方法了，那么就不继续分析了，注释里也写得很详细了。</p><p>那么，最后来回答下开头的两个问题：</p><p><strong>Q1：在不同线程中调用 <code>Looper.myLooper()</code> 为什么可以返回各自线程的 Looper 对象呢？明明我们没有传入任何线程信息，内部是如何找到当前线程对应的 Looper 对象呢？</strong></p><p>**A：**因为 <code>Looper.myLooper()</code> 内部其实是调用了 ThreadLocal 的 <code>get()</code> 方法，ThreadLocal 内部会自己去获取当前线程的成员变量 threadLocals，该变量作用是线程自己的数据存储容器，作用域自然也就仅限线程而已，以此来实现可以自动根据不同线程返回各自线程的 Looper 对象。</p><p>毕竟，数据本来就只是存在各自线程中，自然互不影响，ThreadLocal 只是内部自动先去获取当前线程对象，再去取对象的数据存储容器，最后取值返回而已。</p><p>但取值之前要先存值，而在 Looper 类中，对 ThreadLocal 的 <code>set()</code> 方法调用只有一个地方： <code>prepare()</code>，该方法只有主线程系统已经帮忙调用了。这其实也就是说，主线程的 Looper 消息循环机制是默认开启的，其他线程默认关闭，如果想要使用，则需要自己手动调用，不调用的话，线程的 Looper 对象一直为空。</p><p><strong>Q2：ThreadLocal 是如何做到同一个对象，却维护着不同线程的数据副本呢？</strong></p><p>**A：**梳理清楚，其实好像也不是很难，是吧。无外乎就是将数据保存在各自的线程中，这样不同线程的数据自然相互不影响。然后存值时再以当前 ThreadLocal 实例对象为 key，这样即使同一线程中，不同 ThreadLocal 虽然使用同一个容器，但 key 不一样，取值时也就不会相互影响。</p><h1 id="小彩蛋" tabindex="-1"><a class="header-anchor" href="#小彩蛋" aria-hidden="true">#</a> 小彩蛋</h1><p>说是小彩蛋，其实是 Android 的一个小 bug，尽管这个 bug 并不会有任何影响，但发现了 Google 工程师居然也写了 bug，就异常的兴奋有没有。</p>`,65),v={href:"https://www.jianshu.com/p/85fc4decc947",target:"_blank",rel:"noopener noreferrer"},u=n(`<p>是这样的，不清楚 <code>View.post()</code> 流程原理的可以先去我那篇博客过过，不过也么事，我简单来说下：</p><p>通过 <code>View.post(Runnable action)</code> 传进来的 Runnable，如果此时 View 还没 attachToWindow，那么这个 Runnable 是会先被缓存起来，直到 View 被 attachToWindow 时才取出来执行。</p><p>而在<strong>版本 android-24</strong> 之前，缓存是交由 ViewRootImpl 来做的，如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//View#post()
public boolean post(Runnable action) {
    //1. mAttachInfo 是当 View 被 attachToWindow 时才会被赋值
    final AttachInfo attachInfo = mAttachInfo;
    if (attachInfo != null) {
        return attachInfo.mHandler.post(action);
    }
    //2. 所以，如果 View 还没被 attachToWindow 时，这些 Runnable 会先被缓存起来
    ViewRootImpl.getRunQueue().post(action);
    return true;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>mAttachInfo 是当 View 被 attachToWindow 时才会被赋值，所以，如果 View 还没被 attachToWindow 时，这些 Runnable 会先被缓存起来，版本 android-24 之前的实现是交由 ViewRootImpl 实现，如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ViewRootImpl#getRunQueue()
static RunQueue getRunQueue() {
    RunQueue rq = sRunQueues.get();
    if (rq != null) {
        return rq;
    }
    rq = new RunQueue();
    sRunQueues.set(rq);
    return rq;
}

//ViewRootImpl.sRunQueues
static final ThreadLocal&lt;RunQueue&gt; sRunQueues = new ThreadLocal&lt;RunQueue&gt;();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的关键点是，sRunQueues 是一个 ThreadLocal 对象，而且我们使用 <code>View.post()</code> 是经常有可能在各种子线程中的，为的就是利用这个方法方便的将 Runnable 切到主线程中执行，但这样的话，其实如果在 View 还没被 attachToWindow 时，这些 Runnable 就是被缓存到各自线程中了，因为使用的是 ThreadLocal。</p><p>而这些被缓存起来的 Runnable 被取出来执行的地方是在 ViewRootImpl 的 <code>performTraversals()</code>，这方法是控制 View 树三大流程：测量、布局、绘制的发起者，而且可以肯定的是，这方法肯定是运行在主线程中的。</p><p>那么，根据我们分析的 ThreadLocal 原理，不同线程调用 <code>get()</code> 方法时数据是相互独立的，存值的时候有可能是在各种线程中，所以 Runnable 被缓存到各自的线程中去，但取值执行时却只在主线程中取，这样一来，就会造成很多缓存在其他子线程中的 Runnable 就被丢失掉了，因为取不到，自然就执行不了了。</p><p>验证方式也很简单，切到 android-24 之前的版本，然后随便在 Activity 的 <code>onCreate()</code> 里写段在子线程中调用 <code>View.post(Runnable)</code>，看看这个 Runnable 会不会被执行就清楚了。</p>`,10),p={href:"https://blog.csdn.net/scnuxisan225/article/details/49815269",target:"_blank",rel:"noopener noreferrer"},h=n('<p>而在 android-24 版本之后，源码将这个实现改掉了，不用 ThreadLocal 来做缓存了，而是直接让各自的 View 内部去维护了，具体不展开了，感兴趣可以去看看我那篇博客和那个大神的博客。</p><p>PS：另外，不知道大伙注意到了没有，<strong>android-24</strong> 版本的源码是不是发生了什么大事，在这个版本好像改动了很多原本内部的实现，比如一开头分析的 ThreadLocal 内部实现在这个版本也改动了，上面看的 <code>View.post()</code> 在这个版本也改动了。</p><h1 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> 应用场景</h1><h3 id="源码中的应用场景" tabindex="-1"><a class="header-anchor" href="#源码中的应用场景" aria-hidden="true">#</a> 源码中的应用场景</h3><p>源码内部很多地方都有 ThreadLocal 的身影，其实这也说明了在一些场景下，使用 ThreadLocal 是可以非常方便的帮忙解决一些问题，但如果使用不当的话，可能会造成一些问题，就像上面说过的在 android-24 版本之前 <code>View.post()</code> 内部采用 ThreadLocal 来做缓存，如果考虑不当，可能会造成丢失一些缓存的问题。</p><ul><li>场景1：<code>Looper.myLooper()</code></li></ul><p>用于不用线程获取各自的 Looper 的需求，具体见上文。</p><ul><li>场景2：<code>View.post()</code></li></ul><p>android-24 版本之前用于缓存 Runnable，具体见上文。</p><ul><li>场景3：<strong>AnimationHandler</strong></li></ul>',10),m={href:"https://www.jianshu.com/p/46f48f1b98a9",target:"_blank",rel:"noopener noreferrer"},b=n(`<div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//AnimationHandler.sAnimatorHandler
public final static ThreadLocal&lt;AnimationHandler&gt; sAnimatorHandler = new ThreadLocal&lt;&gt;();

//AnimationHandler#getInstance()
public static AnimationHandler getInstance() {
    if (sAnimatorHandler.get() == null) {
        sAnimatorHandler.set(new AnimationHandler());
    }
    return sAnimatorHandler.get();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>单例 + ThreadLocal？ 是不是突然又感觉眼前一亮，居然可以这么用！</p><p>那么这种应用场景是什么呢，首先，单例，那么就说明只存在一个实例，希望外部只使用这么一个实例对象。然后，单例又结合了 ThreadLocal，也就是说，希望在同一个线程中实例对象只有一个，但允许不同线程有各自的单例实例对象。</p><p>而源码这里为什么需要这么使用呢，我想了下，觉得应该是这样的，个人观点，还没理清楚，不保证完全正确，仅供参考：</p><p>动画的实现肯定是需要监听 Choreographer 的每一帧 vsync 信息事件的，那么在哪里发起监听，在哪里接收回调，属性动画就则是通过一个单例类 AnimationHandler 来实现。也就是，程序中，所有的属性动画共用一个 AnimationHandler 单例来监听 Choreographer 的每一帧 vsync 信号事件。</p><p>那么 AnimationHandler 何时决定不监听了呢？不是某个动画执行结束就取消监听，而是所有的动画都执行完毕，才不会再发起监听，那么，它内部其实就维护着所有正在运行中的动画信息。所以，在一个线程中它必须也只能是单例模式。</p><p>但是，ValueAnimator 其实不仅仅可以用来实现动画，也可以用来实现一些跟帧率相关的业务场景，也就是说，如果不涉及 ui 的话，也是允许在其他子线程中使用 ValueAnimator 的，那么此时，这些工作就不应该影响到主线程的动画，那么它是需要单独另外一份 AnimationHandler 单例对象来管理了。</p><p>两者结合下，当有在线程内需要单例模式，而又允许不同线程相互独立运作的场景时，也可以使用 ThreadLocal。</p><ul><li>场景4：<strong>Choreographer</strong></li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//Choreographer.sThreadInstance
private static final ThreadLocal&lt;Choreographer&gt; sThreadInstance = new ThreadLocal&lt;Choreographer&gt;() {
    @Override
    protected Choreographer initialValue() {
   	 	Looper looper = Looper.myLooper();
        if (looper == null) {
            throw new IllegalStateException(&quot;The current thread must have a looper!&quot;);
        }
        return new Choreographer(looper);
    }
}
//Choreographer#getInstance()
public static Choreographer getInstance() {
    return sThreadInstance.get();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),L={href:"https://www.jianshu.com/p/0d00cb85fdf3",target:"_blank",rel:"noopener noreferrer"},g=n('<p>具体也就不分析了，在这里也列出这个，只是想告诉大伙，在源码中，单例 + ThreadLocal 这种模式蛮常见的，我们有要求线程安全的单例模式，相对应的自然也会有线程内的单例模式，要求不同线程可以互不影响、独立运作的单例场景，如果大伙以后有遇到，不妨尝试就用 ThreadLocal 来实现看看。</p><ul><li>其他</li></ul><p>源码中，还有很多地方也有用到，View 中也有，ActivityThread 也有，ActivityManagerService 也有，很多很多，但很多地方的应用场景我也还搞不懂，所以也就不列举了。总之，就像主席在《开发艺术探索》中所说的：</p><blockquote><p>一般来说，当某些数据是以线程为作用域并且不同线程具有不同的数据副本的时候，就可以考虑采用 ThreadLocal</p></blockquote><p>精辟，上述源码中不管是用于缓存功能，还是要求线程独立，还是单例 + ThreadLocal 模式，其实本质上都是上面那句话：某些数据如果是以线程为作用域并且不同线程可以互不影响、独立运作的时候，那么就可以采用 ThreadLocal 了。</p><h3 id="《开发艺术探索》中描述的应用场景" tabindex="-1"><a class="header-anchor" href="#《开发艺术探索》中描述的应用场景" aria-hidden="true">#</a> 《开发艺术探索》中描述的应用场景</h3><ul><li>场景1</li></ul><blockquote><p>一般来说，当某些数据是以线程为作用域并且不同线程具有不同的数据副本的时候，就可以考虑采用 ThreadLocal。</p><p>比如对应 Handler 来说，它需要获取当前线程的 Looper，很显然 Looper 的作用域就是线程并且不同线程具有不同的 Looper，这个时候通过 ThreadLocal 就可以轻松实现 Looper 在线程中的存取。如果不采用 ThreadLocal，那么系统就必须提供一个全局的哈希表供 Handler 查找指定线程的 Looper，这样一来就必须提供一个类似于 LooperManager 的类了，但是系统并没有这么做而是选择了 ThreadLocal，这就是 ThreadLocal 的好处</p></blockquote><ul><li>场景2</li></ul><blockquote><p>ThreadLocal 另一个使用场景是复杂逻辑下的对象传递，比如监听器的传递，有些时候一个线程中的任务过于复杂，这可能表现为函数调用栈比较深以及代码入口多样性，在这种情况下，我们又需要监听器能够贯穿整个线程的执行过程，这个时候可以怎么做呢？</p><p>其实这时就可以采用 ThreadLocal，采用 ThreadLocal 可以让监听器作为线程内的全局对象而存在，在线程内部只要通过 get 方法就可以获取到监听器。如果不采用 ThreadLocal，那么我们能想到的可能是如下两种方法：第一种方法是将监听器通过参数的形式在函数调用栈中进行传递，第二种方法就是将监听器作为静态变量供线程访问。上述这两种方法都是有局限性的。第一种方法的问题是当函数调用栈很深的时候，通过函数参数来传递监听器对象这几乎是不可接受的，这会让程序的设计看起来糟糕。第二种方法是可以接受的，但是这种状态是不具有可扩充性的，比如同时有两个线程在执行，那么就需要提供两个静态的监听器对象，如果有 10 个线程在并发执行呢？提供 10 个静态的监听器对象？这显然是不可思议的，而采用 ThreadLocal，每个监听器对象都在自己的线程内部存储，根本就不会有方法 2 的这种问题。</p></blockquote>',10);function T(f,w){const d=r("ExternalLinkIcon");return s(),o("div",null,[t,a("p",null,[e("另外，先说明下，该 bug 并不是我发现的，我以前在写一篇博客分析 "),a("a",v,[e("View.post 源码"),i(d)]),e("时，期间有个问题卡住，然后阅读其他大神的文章时发现他提了这点，bug 是他发现并不是由我发现，只是刚好，我看的源码版本比他的新，然后发现在我看的源码版本上，这个 bug 居然被修复了，那么也就是说， Google 的这一点行为也就表示这确实是一个 bug，所以异常兴奋，特别佩服那个大神。")]),u,a("p",null,[e("更具体的分析看那个大神的博客："),a("a",p,[e("通过View.post()获取View的宽高引发的两个问题"),i(d)])]),h,a("p",null,[e("大伙不清楚对这个熟悉不，我之前写过一篇分析 "),a("a",m,[e("ValueAnimator 运行原理"),i(d)]),e("，所以有接触到这个。先看一下，它内部是如何使用 ThreadLocal 的：")]),b,a("p",null,[e("Choreographer 在 Android 的屏幕刷新机制中扮演着非常重要的角色，想了解的可以看看我之前写的一篇文章："),a("a",L,[e("Android 屏幕刷新机制"),i(d)])]),g])}const j=l(c,[["render",T],["__file","带你了解源码中的ThreadLocal.html.vue"]]);export{j as default};
