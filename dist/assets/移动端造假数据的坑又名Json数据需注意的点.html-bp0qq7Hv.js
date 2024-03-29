import{_ as e,o as i,c as n,d as t}from"./app-2pyCoCP5.js";const a={},o=t(`<p>最近在 Json 数据的解析上碰到了一些坑，特此记录一下。</p><h1 id="正文" tabindex="-1"><a class="header-anchor" href="#正文" aria-hidden="true">#</a> 正文</h1><p>迭代开发中，经常出现服务端接口还没开发完成的情况，所以经常需要移动端自己在本地造一些假数据。</p><p>emmm，虽然说好像造假数据也不是什么很难的事，但问题是，我是做 Tv app 的，手机 app 首页的 json 数据结构怎么样我不清楚，但 Tv 应用的主页复杂的要命，服务端下发的 json 数据格式是一层嵌套一层，每次看接口文档都一脸懵逼，接触了半年多了，我甚至对这个 json 数据结构还不是很熟悉，哎~~</p><p>举个例子吧：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-a5848230b7caffc1.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="json示例.png"></p><p>咦，这么一简化，好像感觉也不是很复杂。哎，反正，实际上，整个 json 数据结构特别复杂，每一层里字段就特别多，然后还不断的嵌套。不管了，不管了，这个不是今天的主题，只是顺便抱怨一下而已。</p><p>不说废话了，回到今天的主题，注意看上图中我标箭号的地方，先提个问题：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{
    &quot;aaa&quot;:{...},
    &quot;bbb&quot;:&quot;{...}&quot;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Q1：你们觉得上面的 aaa 字段和 bbb 字段有区别么？</strong></p><p>emmm，大伙不要鄙视我问这么基础的问题，慢慢看下去，你们就清楚我本篇想讲的是什么了。</p><p>首先，先确定下这个答案，aaa 对应的是一个新的 json 结构对象，如果要建模的话，要么直接使用 Object 对象，要么就是根据 {...} 里的结构创建一个对应的实体类；而 bbb 对应的就是一个字符串，不管 {...} 里的结构怎么样，解析的时候它就是一个 String 对象。所以，我们建模时的实体类应该就是这样吧：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class WoZuiShuai {
    private Object aaa;
    private String bbb;
    
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>没错吧，那么，接下去该是造假数据了，我们填充一些值进去：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{
    &quot;aaa&quot;:{&quot;ccc&quot;:&quot;nifangpi&quot;},
    &quot;bbb&quot;:&quot;{&quot;ddd&quot;:&quot;wojiufangpi&quot;}&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样填充没问题吧，然后为了方便，我们不在文件里造假数据，把这个 json 数据复制到代码中：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public static String JSON = &quot;{\\n&quot; +
            &quot;    \\&quot;aaa\\&quot;:{\\&quot;ccc\\&quot;:\\&quot;nifangpi\\&quot;},\\n&quot; +
            &quot;    \\&quot;bbb\\&quot;:\\&quot;{wojiufangpi}\\&quot;\\n&quot; +
            &quot;}&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们只需要先打个 <code>&quot; &quot;</code>，然后在这之间粘贴刚才复制的 json 串，as 会自动将转义符、换行符添加上去，没错吧，那么第二个问题来了：</p><p><strong>Q2:你们觉得直接拿这个 JSON 数据去解析，可以得到结果么？</strong></p><p>禁止逆向思维，不要说什么，如果能得到结果我就不会写了。严肃点，好好想想。我们可以简单的写个单元测试，测一下：<br><img src="https://upload-images.jianshu.io/upload_images/1924341-aa2629755881b10b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="测试.png"></p><p>跑一下，看一下结果：<br><img src="https://upload-images.jianshu.io/upload_images/1924341-8fff7e7c2bc4d31d.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="测试结果.png"></p><p>果然出错了，bbb 解析失败，<strong>那么，想明白为什么会出错了么？</strong></p><p>哎，其实，还是自己对 json 不够了解，如果对 json 格式比较熟悉的话，一眼就看出在哪里出错了。</p><p><strong>其实，在我们填充数据的那个步骤就已经错了。</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{
    &quot;aaa&quot;:{&quot;ccc&quot;:&quot;nifangpi&quot;},
    &quot;bbb&quot;:&quot;{&quot;ddd&quot;:&quot;wojiufangpi&quot;}&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个 json 数据是错误的，拿到网上验证一下就清楚了，我比较习惯用 chrome 的 JSON-handle 插件， <img src="https://upload-images.jianshu.io/upload_images/1924341-d91af8cfd179b2b2.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="验证.png"></p><p><strong>这其实就是涉及到 json 结构如果是多层嵌套的话，内层的 <code>&quot;</code> 冒号必须用转义符标志，这样计算机才能区分这个 <code>&quot;</code> 是跟外层的匹配，还是跟内层的匹配。</strong></p><p>也就是说，下面这样改完后才是正确的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{
    &quot;aaa&quot;:{&quot;ccc&quot;:&quot;nifangpi&quot;},
    &quot;bbb&quot;:&quot;{\\&quot;ddd\\&quot;:\\&quot;wojiufangpi\\&quot;}&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么，对应的复制到代码里的样子是这样的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public static String JSON = &quot;{\\n&quot; +
            &quot;    \\&quot;aaa\\&quot;:{\\&quot;ccc\\&quot;:\\&quot;nifangpi\\&quot;},\\n&quot; +
            &quot;    \\&quot;bbb\\&quot;:\\&quot;{\\\\\\&quot;ddd\\\\\\&quot;:\\\\\\&quot;wojiufangpi\\\\\\&quot;}\\&quot;\\n&quot; +
            &quot;}&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样改完后，再跑下单元测试就发现是正确的了，这个就是最近碰到的一个坑了，现在来反省下自己为什么会跳进这个坑。</p><h1 id="反省" tabindex="-1"><a class="header-anchor" href="#反省" aria-hidden="true">#</a> 反省</h1><ol><li><p>对 json 格式不够理解</p></li><li><p>当初是有想过转义符的问题，但看到 as 已经自动添加了转义符了，就想当然的以为转义符没问题了，其实内嵌的 <code>&quot;</code> 号问题， java 本身就需要一层转义符，然后 json 也需要一层转义符，所以总的来说是需要有两层转义符，就像上图的代码块。</p></li><li><p>然后，服务端也得背点锅，因为你们给我的示例数据里就是没有转义符的，我当然以为你们是对的！！！</p></li><li><p>最后，自己造完数据其实也还是有拿去校验一遍的，但当初没注意看错误提示，插件定位到 bbb 那行结构是错的，然后就想当然的以为是 <code>&quot;{...}&quot;</code> 这外面那两个冒号的问题，想当然的以为这个冒号是多余的，就去掉了。然后更要命的是，去掉了之后的结构刚刚好是正确的，插件可以解析出来。然后拿到代码里测试时，却发现又解析不了，因为 bbb 定义的是 String 类型，但现在已经是一个 Object 类型了。所以，我的大脑就这样进入死锁了，加上冒号，插件验证格式错误，测试也通不过，去掉冒号，插件验证格式正确，但测试却还是通不过。哎，在这里卡了好久的。</p></li></ol><p>以上，仅记录下来，提醒自己不要再犯傻了~~~</p>`,35),u=[o];function s(d,l){return i(),n("div",null,u)}const r=e(a,[["render",s],["__file","移动端造假数据的坑又名Json数据需注意的点.html.vue"]]);export{r as default};
