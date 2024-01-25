import{_ as i,o as e,c as s,d as a}from"./app-PjuKeMiB.js";const d={},n=a(`<h1 id="题目-已知如下代码-如何修改才能让图片宽度为-300px-注意下面代码不可修改" tabindex="-1"><a class="header-anchor" href="#题目-已知如下代码-如何修改才能让图片宽度为-300px-注意下面代码不可修改" aria-hidden="true">#</a> 题目：已知如下代码，如何修改才能让图片宽度为 300px ？注意下面代码不可修改</h1><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;img src=&quot;1.jpg&quot; style=&quot;width:480px!important;”&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/105</p><h1 id="笔记" tabindex="-1"><a class="header-anchor" href="#笔记" aria-hidden="true">#</a> 笔记</h1><p>当不能修改上述代码的情况下，大概有三种思路有覆盖内联带有 important 的 width 属性：</p><ul><li>使用更高优先级的方式设置 width</li><li>使用 js 方式覆盖 width 属性</li><li>使用缩放等方式来改变实际的内容区域</li></ul><h3 id="使用更高优先级的方式设置-width" tabindex="-1"><a class="header-anchor" href="#使用更高优先级的方式设置-width" aria-hidden="true">#</a> 使用更高优先级的方式设置 width</h3><ul><li>动画的样式优先级高于 !important</li></ul><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>img {
    animation: test 0s forwards;
}
@keyframes test {
    from {
        width: 300px;
    }
    to {
        width: 300px;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>max-width 可以限制 width</li></ul><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>img {
    max-width: 300px;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-js-方式覆盖-width-属性" tabindex="-1"><a class="header-anchor" href="#使用-js-方式覆盖-width-属性" aria-hidden="true">#</a> 使用 js 方式覆盖 width 属性</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>document.getElementsByTagName(&quot;img&quot;)[0].setAttribute(&quot;style&quot;,&quot;width:300px!important;&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="使用缩放等方式来改变实际的内容区域" tabindex="-1"><a class="header-anchor" href="#使用缩放等方式来改变实际的内容区域" aria-hidden="true">#</a> 使用缩放等方式来改变实际的内容区域</h3><ul><li>transform: sacle</li></ul><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>img {
    transform: sale(0.625);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>box-sizing</li></ul><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>img {
    box-sizing: border-box;
    padding-right: 100px; 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18),l=[n];function r(t,c){return e(),s("div",null,l)}const v=i(d,[["render",r],["__file","如何覆盖important的内联width属性.html.vue"]]);export{v as default};
