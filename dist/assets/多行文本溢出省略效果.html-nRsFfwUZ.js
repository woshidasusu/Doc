import{_ as d,r as t,o as a,c as r,a as e,b as l,e as s,d as i}from"./app-XVH6qKTA.js";const o={},c=i('<h1 id="题目-如何用-css-或-js-实现多行文本溢出省略效果-考虑兼容性" tabindex="-1"><a class="header-anchor" href="#题目-如何用-css-或-js-实现多行文本溢出省略效果-考虑兼容性" aria-hidden="true">#</a> 题目：如何用 css 或 js 实现多行文本溢出省略效果，考虑兼容性</h1><p>https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/246</p><h1 id="笔记" tabindex="-1"><a class="header-anchor" href="#笔记" aria-hidden="true">#</a> 笔记</h1><p>之所以需要去琢磨如何实现这个效果，是因为，官方只支持单行文本溢出时 ... 的省略效果：</p><p><code>text-overflow: ellipsis</code></p><p>使用该属性需要满足一些前提：</p><ol><li>块级元素</li><li>overflow: 计算值<code>非visible</code>;</li><li>元素宽度：超出时，有一个确切的计算值</li><li>white-space: nowrap | pre;</li></ol><p>至于多行文本的溢出省略效果，Webkit 系列的浏览器倒是自己提供了：</p><ol><li>display: -webkit-box | -webkit-inline-box;</li><li>-webkit-box-orient: vertical | block-axis</li><li>overflow: 计算值<code>非visible</code></li><li>-webkit-line-clamp: N; // 行数</li></ol><p>但这种方式不兼容，因为只适用于 Webkit 内核的浏览器，如 Chrome，Safari，iOS Safari，Chrome for Android，UC Browser for Android，Samsung Internet</p><p>所以，实现需要这种效果，只能另开思路，自己利用 CSS 或 js 来实现了，但目前的方案大多都有各自的一些不足处，没有一种完美的方案。</p><p>所以，遇到这种需求，建议第一步还是尽量跟产品怼一怼，看能不能砍掉吧。</p><p>实在非得做，再选择适用自己场景的方案吧。</p><h3 id="js-实现" tabindex="-1"><a class="header-anchor" href="#js-实现" aria-hidden="true">#</a> JS 实现</h3>',14),v={href:"https://codepen.io/CYSILVER/pen/xxKRKbP?editors=1111",target:"_blank",rel:"noopener noreferrer"},u=i(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>const p = document.querySelector(&#39;p&#39;)
let words = p.innerHTML.split(/(?&lt;=[\\u4e00-\\u9fa5])|(?&lt;=\\w*?\\b)/g)
while (p.scrollHeight &gt; p.clientHeight) {
  words.pop()
  p.innerHTML = words.join(&#39;&#39;) + &#39;...&#39;
}

// &lt;p&gt;这是一段测试文字，this is some test text，测试文字，测试文字测 &lt;/p&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原理就是先用 split + 正则，将文本中的单词和单个文字切割出来存入 words，然后判断 scrollHeight 和 clientHeight，超出的话，就从 words 里 pop 一个出来。</p><p>可以适用于大部分场景，但有一点不足就是，双击全新中文本内容复制时，没办法像原生的 ... 复制时那样将所有文本都复制，而是会复制到处理后带有 ... 的数据。</p><h3 id="css-实现" tabindex="-1"><a class="header-anchor" href="#css-实现" aria-hidden="true">#</a> CSS 实现</h3>`,4),p={href:"https://www.jianshu.com/p/07bcb00aa0ee",target:"_blank",rel:"noopener noreferrer"},b=i(`<div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;style type=&quot;text/css&quot;&gt;
    .ellipsis {
      position: relative;
      width: 200px;
      max-height: 3em;
      line-height: 1.5;
      overflow: hidden;
      outline: 1px solid #ff9900;
    }
    .ellipsis::before {
      content: &#39;...&#39;;
      position: absolute;
      z-index: 1;
      bottom: 0;
      right: 0;
      width: 1.5em;
      padding-left: 3px;
      box-sizing: border-box;
      background-color: white;
    }
    .ellipsis::after {
      content: &#39;&#39;;
      display: inline-block;
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      background-color: white;
    }
  &lt;/style&gt;

&lt;div class=&quot;ellipsis&quot;&gt;这是一串很长的文字&lt;/div&gt;
  &lt;div class=&quot;ellipsis&quot;&gt;这是一串很长的文字，现在开始哦。第二行文字在这&lt;/div&gt;
  &lt;div class=&quot;ellipsis&quot;&gt;这是一串很长的文字，现在开始哦。第二行文字在这里开始了，从“里”字开始，就应该被...省略了。&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://upload-images.jianshu.io/upload_images/2699594-5f6a200e13b4b334.png" alt=""></p><p>原理其实就是用 ... 拼接在文字后面，然后再 ... 上面又盖上一个空白区域，当文字溢出时，空白区域被迫移出区域，... 就显示出来了。</p><p>至于多行，就需要用 height 和 max-height 来控制。</p><p>适用于纯中文或纯英文的场景，因为 ... 的宽度位置是需要通过自行调整出一个较好的效果的，但对于中英混合的场景时， ... 的 size 和 position 很难调整出一个完美值，可能会出现盖住半个字的场景。</p>`,5);function m(h,g){const n=t("ExternalLinkIcon");return a(),r("div",null,[c,e("ul",null,[e("li",null,[e("a",v,[l("正则 + scrollHeight & clientHeight"),s(n)])])]),u,e("ul",null,[e("li",null,[e("a",p,[l("多行文本省略近完美方案"),s(n)])])]),b])}const f=d(o,[["render",m],["__file","多行文本溢出省略效果.html.vue"]]);export{f as default};
