import{_ as e,o as i,c as t,d as a}from"./app-pwInIdNR.js";const o={},n=a('<p>老规矩，先上张图<br> o，这篇好像是分析篇，没有效果图。不管了，位置占着，老规矩不能坏，下面开始正文。</p><hr><p>这篇博客会讲得比较杂：</p><blockquote><ol><li>TextView里各部分的大小该怎么测量?</li><li>如何计算每行文字的长度?</li><li>设置android:maxLines=&quot;1&quot;和android:singleLine=&quot;true&quot;有什么区别?</li><li>为什么设置android:maxLines=&quot;1&quot;时TextView的跑马灯效果就不能正常工作？</li></ol></blockquote><h1 id="textview里各部分的大小该怎么测量" tabindex="-1"><a class="header-anchor" href="#textview里各部分的大小该怎么测量" aria-hidden="true">#</a> TextView里各部分的大小该怎么测量?</h1><p>虽然我们平时只用TextView显示纯文本数据，但其实TextView支持设置Background,四周的drawable小图标，以及Span数据比如文本或图片。在Android里不管是什么控件都是占据一个矩形的空间，那么在一个TextView里该如何计算各个矩形的大小呢？下面是TextView提供的各个获取长度宽度的接口：</p><blockquote><p>getWidth(), getHeight()<br> getPaddingLeft/Right/Top/Bottom()<br> getCompoundPaddingLeft/Right/Top/Bottom()<br> getExtendedPaddingBottom/Top()<br> getTotalPaddingLeft/Right/Top/Bottom()</p></blockquote><p>先看一下布局代码：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-99ada744fe8ebd18.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="6.png"><br> @drawable/icon_person_n<br><img src="http://upload-images.jianshu.io/upload_images/1924341-078785888c6534a4.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="7.png"></p><p>下面是效果图，做了一些标注：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-5b763cffae661b64.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="8.png"></p><p>下面来看一下上述获取长度的接口的数据，你可以使用打日志方式，我是比较习惯用调试方式：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-afbe5725d9479398.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="9.png"></p><p>所以，总结一下：<br><strong>getWidth(), getHeight()</strong>：对应你代码里的layout_width和layout_height。</p><p><strong>getPaddiingLeft/Right/Top/Bottom()</strong>：对应代码里的Padding。<br> 以上两个比较容易理解，毕竟经常打交道。</p><p><strong>getCompoundPaddingLeft/Top/Right/Bottom()</strong>： 翻译成中文就是获取混合的Padding, 既然是混合的，那么它的值也就是padding + 图片的大小 + drawablePadding的值。说得通俗点就是，它是获取文字区域到TextView边界之间的间隔。附上源码：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-8381c0f04698e797.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="10.png"></p><p><strong>getExtendedPaddingTop()</strong>：这个是当有部分文字没有显示出来时，也就是设置了maxLine时，它的值就等于首行文字到TextView顶端的距离。同理，getExtendedPaddingBottom()就是最后一行文字到TextVeiw底部距离。其他情况下，他的值等于getCompoundPaddingTop/Bottom()的值。这个源码不多，但也不怎么好讲解，就贴两张图对比下，就明白了。</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-66ade1367a0641a8.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="11.png"><br><img src="http://upload-images.jianshu.io/upload_images/1924341-a66565322f0cd4bc.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="12.png"></p><p><strong>getTotalPaddingLeft/Right/Top/Bottom()</strong>：翻译下就是获取总的Padding值，看了下源码，左右的值直接就是等于compoundPadding的值，上下的值等于ExtendedPadding的值再加上offset的值（跟Gravity的垂直方向的布局有关。说得通俗点就是，不管有没有maxLines，上下的值都分别等于首行到TextView顶端和末行到TextView底部的值。</p><p>这些接口除了前面两个比较常用外，其他基本很少用吧，我也是因为在看TextView的跑马灯部分的源码才接触到，然后为了弄明白才记录下来的。至于后面那些接口的应用场景，getCompoundPadding()这个的应用场景倒是很明确，可以用来判断相应的drawable是否发生点击事件之类的需求。至于extendedPadding和totalPadding这两个的应用场景，我想了想，觉得应该是涉及需要计算显示出来后的文字高度的相关需求时会用到吧。有对这些接口很熟悉的童鞋可以分享出来哈，一起学习学习。</p><p><strong>最后用一张图总结一下，我把TextView分成内容区域，内容区域和TextView边界之间的间隔就是padding的值，内容区域包括drawable区域和文字区域，drawable区域和文字区域之间的间隔就是drawablePadding的值，文字区域和TextView之间的间隔就是CompoundPadding的值。</strong></p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-5f1d2aaebafe69ac.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="13.png"></p><h1 id="如何计算每行文字的长度" tabindex="-1"><a class="header-anchor" href="#如何计算每行文字的长度" aria-hidden="true">#</a> 如何计算每行文字的长度?</h1><p>Q：每行文字的长度不就等于TextView的宽度吗？直接getWidth()不就好了？<br> A：再看一下上面那部分内容你就清楚了，只有当TextView宽度设置为wrap_content，且没有背景图或drawable时，文字的长度才等于getWidth();当文字很少，没有填充满时，或是溢出时，文字的长度都得另外计算。</p><p>Q：每行文字的长度不一样长吗？<br> A：因为TextView有自己的换行策略，如下图所示，显然每行的文字长度不一样长。<br><img src="http://upload-images.jianshu.io/upload_images/1924341-61e9576369e701af.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="14.png"></p><p>Q：文字的长度是指哪段长度？ A：看需求吧，我觉得通常情况下都是只需要计算显示在屏幕上的可见区域的每行文字的长度即可。还有那么一种需求，当设置了溢出内容用...表示时，那么其实每行文字的实际长度就不止可见区域那么长了。</p><p>那么该如何计算文字的长度呢？单单根据上一部分里的各种Padding值肯定不够，根据各种Padding顶多计算出文字区域的宽度，但实际上每一行文字并不会那么刚刚好占满文字区域的宽度，那么就还得借助其他来进行计算。</p><p><strong>方法1:TextView.getPaint().measureText(String text)</strong></p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-eeba20225c3e044a.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="15.png"><br> 但这种方法只是测试传入的text在该TextView的配置下的总长度，并不是计算每一行的长度。</p><p><strong>方法2：TextView.getLayout().getLineWidth(int line)</strong><br><img src="http://upload-images.jianshu.io/upload_images/1924341-7bd8f71d48b34ed4.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="16.png"><br> TextView对应的是图14，正好，利用方法1验证一下，这个方法计算得到的是不是每行文字的长度。<br><img src="http://upload-images.jianshu.io/upload_images/1924341-a68e6414badcba72.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="17.png"><br> 完全正确，所以说这个方法确实计算得到的是每一行文字的实际长度，注意这里是实际长度，也就是说当设置singleLine属性时，用这个方法测量得到的是一整行文字的长度，包括溢出部分。</p><h1 id="设置android-maxlines-1-和android-singleline-true-有什么区别" tabindex="-1"><a class="header-anchor" href="#设置android-maxlines-1-和android-singleline-true-有什么区别" aria-hidden="true">#</a> 设置android:maxLines=&quot;1&quot;和android:singleLine=&quot;true&quot;有什么区别?</h1><p>官方是推荐说不要再使用singleLine,用maxLines=&quot;1&quot;代替。但其实这两个的效果是不一样的，官方api接口里有说明,都是英文我就不贴图了，大概翻译下：<br> maxLines：限制TextView的最高高度，大概就是指通过限制行数来限制最高高度。<br> singleLine: 强制设置TextView的文字不换行。</p><p>区别就是：maxLines还是会默认自动进行换行策略，假如一段文字自动换行后有5行，maxLines设置为1，那么就只显示第一行的内容，其他行不显示。<br> 但是，如果是设置了singleLine, 那么这段可以有5行的文字将会被强制放在1行里，然后看最多能显示多少字符，剩下的不显示。</p><p>这样的区别就是导致了很多人在使用TextVeiw的跑马灯效果时不能正常工作的状态，所以下面单独列出个问题来讲。</p><h1 id="为什么设置android-maxlines-1-时textview的跑马灯效果就不能正常工作" tabindex="-1"><a class="header-anchor" href="#为什么设置android-maxlines-1-时textview的跑马灯效果就不能正常工作" aria-hidden="true">#</a> 为什么设置android:maxLines=&quot;1&quot;时TextView的跑马灯效果就不能正常工作？</h1><p>明白了maxLines=&quot;1&quot;和singleLine的区别后，只要再明白跑马灯的原理,就很容易理解为什么设置成maxLines=&quot;1&quot;时跑马灯不工作了。我在上一篇博客里写过跑马灯启动的条件，具体的分析可以去上一篇看，这里大概说下。</p><p>跑马灯要启动要同时满足四个条件，其中有一个条件就是这一行的文字长度要大于文字区域的宽度，文字区域的宽度就是TextView的getWidth()扣去ComPoundpaddingLeft再扣去CompoundPaddingRight剩下的长度。 如果是maxLines=&quot;1&quot;的话，那么就像上一问中分析的那样，所有的文字其实已经被自动换行了，只显示第一行，而换行是什么，就是为了让每行文字的长度超过文字区域的宽度才进行的换行，也就是说，如果一段文字经过TextView的换行后，那么每行的文字长度都不会超过文字区域的长度。这样一来，自然就不满足跑马灯的启动条件之一了，跑马灯也就不能正常工作了。<br> singleLine的话，则是不会对一段文字进行换行处理，这样一来，自然就超过了文字区域的长度，所以如果要设置跑马灯效果的话，只能用singleLine不能用maxLines=&quot;1&quot;。</p>',34),g=[n];function d(p,r){return i(),t("div",null,g)}const m=e(o,[["render",d],["__file","TextView各种长度测量.html.vue"]]);export{m as default};
