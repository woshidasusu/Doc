import{_ as i,r as a,o as l,c as d,a as e,b as s,e as r,d as c}from"./app-xJrSpaa5.js";const t={},o=c(`<h1 id="声明" tabindex="-1"><a class="header-anchor" href="#声明" aria-hidden="true">#</a> 声明</h1><p>本篇所涉及的提问，正文的知识点，全都来自于<strong>杨晓峰的《Java核心技术36讲》</strong>，当然，我并不会全文照搬过来，毕竟这是付费的课程，应该会涉及到侵权之类的问题。</p><p>所以，本篇正文中的知识点，是我从课程中将知识点消耗后，用个人的理解、观念所表达出来的文字，参考了原文，但由于是个人理解，因此不保证观点完全正确，也不代表错误的观点是课程所表达的。如果这样仍旧还是侵权了，请告知，会将发表的文章删掉。</p><p>当然，如果你对此课程有兴趣，建议你自己也购买一下，新用户立减 30，微信扫码订阅时还可以返现 6 元，相当于 32 元购买 36 讲的文章，每篇文章还不到 1 元，蛮划算的了。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-6ca755c2bd0a6122.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="QQ图片20180703142535.png"></p><h1 id="提问" tabindex="-1"><a class="header-anchor" href="#提问" aria-hidden="true">#</a> 提问</h1><ul><li>谈谈 final、finally、finalize 有什么不同？</li><li>为什么局部内部类和匿名内部类只能访问局部final变量？</li></ul><h1 id="正文" tabindex="-1"><a class="header-anchor" href="#正文" aria-hidden="true">#</a> 正文</h1><p>emmm，说实话，感觉这一讲好像没什么实质性内容。而且，就像评论区里有人提到的，搞不懂为啥总有人喜欢拿这三者来比较，它们有个毛的关系？仅仅就是因为单词相近就拿来比较？</p><p>但课程小结还是要做下，梳理梳理下相关面试知识点也好，那也不说废话了，结合原文和评论区，以及一些扩展，尽量多总结一些知识点吧。</p><h4 id="final" tabindex="-1"><a class="header-anchor" href="#final" aria-hidden="true">#</a> final</h4><p>final 是 java 中的关键字，可用于修饰类，方法，变量。</p><p>当修饰类时，表明这个类不可被继承。Java 中有一些核心类都被 final 修饰了，比如 String，System。当考虑到安全性原因时，可以将该类设计成 final。</p><p>当修饰方法时，表明该方法不可被重写。一般是某些流程控制不希望被修改掉时，可以将这些方法声明成 final，比如 View 中的 <code>measure()</code>，<code>requestFocus()</code>，<code>findViewById()</code>。</p><p>当修饰变量时，表明该变量为常量，不允许被重新赋值，因此声明成 final 的变量都需要显示的进行赋值，否则编译会报错。</p><h4 id="finally" tabindex="-1"><a class="header-anchor" href="#finally" aria-hidden="true">#</a> finally</h4><p>finally 是确保 try-catch 方式最后执行的一种机制，通常的用法都是在 finally 里进行一些资源的关闭，回收。比如 IO 流的关闭等等。</p><p>建议最好不要利用 finally 来控制流程，也不要在 finally 中有返回值，否则很容易影响正常流程，导致流程结构特别杂乱。</p><p>另外，有些特殊情况下，finally 中的代码并不会被执行到，比如：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//1.try-catch异常退出
try {
    System.exit(1)
} catch {
    ....
} finally {
	//不会执行到这里
    Log.d(&quot;finally&quot;, &quot;finally&quot;);
}

//2.无限循环
try {
    while(true) {
        ...
    }
} finally {
    //不会执行到这里
    Log.d(&quot;finally&quot;, &quot;finally&quot;);
}

//3. 线程被杀死
//当执行 try-catch 时，线程被杀死了，那么 finally 里的代码也无法被执行到
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>总之，finally 通常情况下都会最后被执行到，所以最好不要在这里有 return 之类的语句来影响正常流程。但在某些特殊的场景下，finally 并不会被执行到，了解一下即可。</p><h4 id="finalize" tabindex="-1"><a class="header-anchor" href="#finalize" aria-hidden="true">#</a> finalize</h4><p>这个是 Object 中的一个方法，方法注释说了很多，大概就是讲这个方法是由垃圾收集器即将要回收该对象时会调用该方法，用户可在这里做一些最后的资源释放工作。</p><p>以上是概念定义，但说实话，没用过该方法，而且作者也说了，不推荐使用 finalize 机制来做资源回收，并且在 JDK 9，这个方法已经被标志为 deprecated 废弃的方法了。</p><p>作者有提到说，因为我们无法保证 finalize 什么时候执行，执行是否符合预期，使用不当还会影响性能，导致程序死锁、挂起等问题。</p><p>那么，有其他方案来替代 finalize 处理回收资源的工作么？有，Cleaner 机制，这个我没接触过，作者提了这个替代方案。另外，作者也说了，回收资源最好就是资源用完后就随手清除，或者结合 try-catch-finally 机制回收。不管是 finalize 或者 Cleaner 机制，最好都只将它看成是最后一道防线，一旦将主要的回收工作依赖于这两个机制的话，很容易出现各种问题。</p><h3 id="扩展" tabindex="-1"><a class="header-anchor" href="#扩展" aria-hidden="true">#</a> 扩展</h3><p><strong>为什么局部内部类和匿名内部类只能访问局部final变量？</strong></p><p>先来看这么段代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//参数 msg 必须声明为 final 类型
public void notifyChange(final String msg) {
    mTextView.post(new Runnable() {
        @Override
        public void run() {
            mTextView.setText(msg);
        }
    })
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这里，<code>post()</code> 方法的参数是一个匿名内部类，在内部类中如果要使用外部 <code>notifyChange()</code> 方法的参数 msg，那么必须将 msg 类型声明成 final，否则编译器会保错。</p><p>这种场景非常常见的吧，不管是类似上述的 Ui 场景，还有网络访问时也经常需要通过回调通知上层，此时也就经常出现这种场景了。</p><p>那么，<strong>有考虑过，为什么内部类只能访问局部 final 变量么？</strong></p><p>如果懂得反编译 class 文件的，那么应该就很清楚了。我也不懂，理解这点是通过阅读其他大神分析的文章，以下是我的理解：</p><p>首先，变量都是有生命周期的，成员变量的生命周期就跟随着对象的整个生命周期，而局部变量的生命周期则是非常有限。</p><p>比如方法内部的局部变量，它的生命周期就是在这个方法执行结束就终止。同样，方法的参数也是局部变量，它是生命周期也同样是到该方法执行结束。</p><p>另外，内部类的执行时机有时是会在外部方法执行结束之后。就拿上述例子来说，<code>post()</code> 中 Runnable 的执行时机，肯定是在外部 <code>notifyChange()</code> 方法执行完之后的。</p><p>那么，问题来了。内部类 Runnable 的执行需要使用到外部方法 <code>notifyChange()</code> 的参数，但当它执行的时候，这个参数的生命周期早已结束，已经被回收掉了。既然已经被回收了，内部类又是怎么使用外部的这个局部变量呢？</p><p>有大神反编译了 class 文件后，给出了结论，<strong>原来内部类使用外部的局部变量时，是通过 copy 一份过来</strong>。也就是说，其实内部类此时使用的是自己内部定义的局部变量了，只是这个变量的值是复制外部那个局部变量的而已。</p><p>这也就解释了，为什么外部的局部变量明明已经被回收了，内部类仍旧可以使用，因为内部类此时使用的并不是外部类的局部变量引用了。</p><p>但到这里，<strong>新的问题就来了</strong>：既然内部类使用的局部变量本质上跟外部的局部变量是相互独立的两个变量，那如果在内部类中修改了这个局部变量的值会出现什么情况？是吧，数据的不一致性。</p><p>基于此，java 编译器就直接限定死，内部类使用外部的局部变量时，必须将其限制为 final 类型，确保该变量不允许进行更改。</p><p>这样一来，其实也就顺便理解了，为什么成员变量可以直接在内部类中使用，因为成员变量的声明周期很长，不存在局部变量的问题。</p><p>以上内容，是在大神的文章里被醍醐灌顶了，感谢大神，原文链接放出来：</p>`,44),p={href:"https://www.cnblogs.com/dolphin0520/p/3811445.html",target:"_blank",rel:"noopener noreferrer"};function v(u,f){const n=a("ExternalLinkIcon");return l(),d("div",null,[o,e("p",null,[e("a",p,[s("Java内部类详解"),r(n)])])])}const m=i(t,[["render",v],["__file","谈谈final_finally_finalize有什么不同.html.vue"]]);export{m as default};
