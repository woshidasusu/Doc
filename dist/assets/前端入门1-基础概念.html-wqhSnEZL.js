import{_ as i,r as n,o as t,c as d,a as e,b as a,e as l,d as r}from"./app-pwInIdNR.js";const c={},u=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),a(" 声明")],-1),o=e("p",null,"本系列文章内容全部梳理自以下四个来源：",-1),h=e("li",null,"《HTML5权威指南》",-1),v=e("li",null,"《JavaScript权威指南》",-1),m={href:"https://developer.mozilla.org/zh-CN/docs/Web",target:"_blank",rel:"noopener noreferrer"},p={href:"https://github.com/smyhvae/Web",target:"_blank",rel:"noopener noreferrer"},g=r(`<p>作为一个前端小白，入门跟着这四个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。</p><h1 id="正文" tabindex="-1"><a class="header-anchor" href="#正文" aria-hidden="true">#</a> 正文</h1><h3 id="相关概念-html-css-js" tabindex="-1"><a class="header-anchor" href="#相关概念-html-css-js" aria-hidden="true">#</a> 相关概念-HTML CSS JS</h3><ul><li><strong>HTML</strong>: 内容层---表示某个标签在页面中是什么角色</li><li><strong>CSS</strong>: 样式层---表示某个标签在页面中该呈现什么样式</li><li><strong>JavaScript</strong>: 行为层---页面与用户的交互行为</li></ul><p>通俗的讲：Html 只负责文档的语义和结构，它描述了网页的内容和结构。</p><p>内容的呈现则由应用于元素上的 CSS 样式控制，它描述了网页的表现与展示效果。</p><p>JavaScript 则是负责网页的功能与行为，如与用户的交互。</p><h3 id="基础-html" tabindex="-1"><a class="header-anchor" href="#基础-html" aria-hidden="true">#</a> 基础-HTML</h3><p>Html 是一种标记语言，不是编程语言，需要明确这点。</p><p>编程语言，通俗的理解就是向计算机发送指令，通过程序让计算机达到我们想要的功能。</p><p>而标记语言，可以通俗的理解成对文本增加一些标志信息，类似于批注信息来说明文本内容</p><p>更通俗点理解，一大段文本内容，毫无重点，毫无结构，让人不好理解。所以，Html 就通过大伙约定俗成的规范，利用一些标签，来指明，这一段文本是标题，这一段文本是个表格，这一段文本是个列表，这一段文本是导航菜单，这里需要分段，这里需要分行，这几个词是关键词，需要重点标记一下，等等等等。</p><p>Html 可以这么通俗的理解。那么这个大伙约定俗成的规范，其实也就是由 W3C 来作为官方发布的标准规范。</p><p>定了规范，自然是想要让人遵守才有意义。所以，在这里，W3C 所定义的标准规范，遵守方其实也就是各大浏览器。不同的浏览器厂商，根据 W3C 发布的标准规范来解析每一份 HTML 文档，那么相同的 HTML 文档在不同的浏览器上才会有相同的作用。</p><p>而一旦某些浏览器厂商没有遵守这些规范，那么前端开发人员就要为此做一些兼容适配工作，这就跟 Android 系统由 Google 开发并开源一样的道理，手机厂商都可以使用这开源的系统，但不同厂商都喜欢做一些自己的修改，这就导致了 Android 开发人员经常需要面对的适配工作问题。</p><h4 id="基本概念" tabindex="-1"><a class="header-anchor" href="#基本概念" aria-hidden="true">#</a> 基本概念</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;a class=&quot;ddd&quot; href=&quot;index.html&quot;&gt;点击跳转&lt;/a&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>标签</strong>：&lt;&gt; 带有这种符号的称为标签，跟 Android 中的标签一样，分开始标签，结束标签</p><p><strong>内容</strong>：文本内容，上图中的点击跳转四字</p><p><strong>属性</strong>：跟 Android 中的 xml 里的标签一样，每个标签有自己的一些属性，另外，Html 有一些全局属性，比如上述的 class，这个属性所有标签都可以用。</p><p><strong>元素</strong>：标签 + 内容</p><h3 id="基础-css" tabindex="-1"><a class="header-anchor" href="#基础-css" aria-hidden="true">#</a> 基础-CSS</h3><p>CSS 负责文本样式的呈现，既然将 HTML 和 CSS 分离开，各自只负责各自的职责，那么肯定需要某种方式将两者连接在一起。</p><p>更准确的说，是在 HTML 文档中该如何使用 CSS，因为 HTML 文档是互联网的基础，一个个网页就是一份份HTML 文档，既然 HTML 文档是基础，那么就是要明确在 HTML 文档中该如何使用 CSS。</p><p>总共有三种方式：全局属性 style，style 标签，link 标签</p><p>CSS 最终作用的对象其实就是 HTML 文档中的每个元素</p><h4 id="全局属性-style" tabindex="-1"><a class="header-anchor" href="#全局属性-style" aria-hidden="true">#</a> 全局属性 style</h4><p>第一种方式：全局属性 style 是直接作用于指定的标签上了，用法就直接将需要的样式声明即可，如：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;a href=&quot;index.html&quot; style=&quot;background: gray; color: #6a90d9&quot;&gt;点击跳转&lt;/a&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>style 是所有标签都具有的属性，称之为全局属性。</p><p>剩余两种方式，都是集中将所有的 CSS 样式管理存放，因此如果需要作用到具体元素上，要借助选择器来实现，选择器后面再说，先看这两种方式的使用：</p><h4 id="style-标签内嵌方式" tabindex="-1"><a class="header-anchor" href="#style-标签内嵌方式" aria-hidden="true">#</a> style 标签内嵌方式</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;style type=&quot;text/css&quot;&gt;
    a {
        background: gray;
        color: #6a90d9;
    }
&lt;/style&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="link-标签引用外部文件方式" tabindex="-1"><a class="header-anchor" href="#link-标签引用外部文件方式" aria-hidden="true">#</a> link 标签引用外部文件方式</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;link type=&quot;text/css&quot; rel=&quot;stylesheet&quot; href=&quot;css/nms.css&quot;&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>style 标签和 link 标签都是 HTML 文档中的一种标签，两者都可以用来连接 css 代码，区别一种是将 css 代码内嵌在 HTML 文档中，一种是直接引用外部 css 文件。</p><p>但这两种相比较于第一种使用全局属性的方式，它们并没有直接在相关联的元素上书写，因此需要有一种机制，来将这些 css 代码关联到需要作用的元素对象上，这个机制就叫：<strong>选择器</strong>。</p><h3 id="选择器" tabindex="-1"><a class="header-anchor" href="#选择器" aria-hidden="true">#</a> 选择器</h3><p>选择器是专门用来将 css 代码关联到指定的 HTML 文档中的元素对象上的，毕竟 css 已经被抽离出 HTML，各自负责各自的职责，但总归需要一种桥梁将两者关联在一起。</p><p>选择器很多，规则也很多，足够覆盖各种各样的场景，这里只列举几种常见的选择器：</p><h4 id="元素选择器" tabindex="-1"><a class="header-anchor" href="#元素选择器" aria-hidden="true">#</a> 元素选择器</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;a class=&quot;myClass&quot; href=&quot;index.html&quot;&gt;点击跳转&lt;/a&gt;
&lt;span class=&quot;myClass&quot;&gt;另一文本&lt;/span&gt;

&lt;style type=&quot;text/css&quot;&gt;
    a {
        background: gray;
        color: #6a90d9;
    }
&lt;/style&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果：作用于 HTML 文档中的所有 a 标签的元素上</p><h4 id="id选择器" tabindex="-1"><a class="header-anchor" href="#id选择器" aria-hidden="true">#</a> id选择器</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;a id=&quot;myId&quot; href=&quot;index.html&quot;&gt;点击跳转&lt;/a&gt;
&lt;style type=&quot;text/css&quot;&gt;
    #myId {
        background: gray;
        color: #6a90d9;
    }
&lt;/style&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>id 在 HTML 文档中需唯一存在，所有 id 选择器只作用于单个元素</p><h4 id="class-选择器" tabindex="-1"><a class="header-anchor" href="#class-选择器" aria-hidden="true">#</a> class 选择器</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;a class=&quot;myClass&quot; href=&quot;index.html&quot;&gt;点击跳转&lt;/a&gt;
&lt;span class=&quot;myClass&quot;&gt;另一文本&lt;/span&gt;

&lt;style type=&quot;text/css&quot;&gt;
    .myClass {
        background: gray;
        color: #6a90d9;
    }
&lt;/style&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>HTML 文档中可对多个元素应用相同 class，所以 class 可同时作用于多个元素</p><h4 id="属性选择器" tabindex="-1"><a class="header-anchor" href="#属性选择器" aria-hidden="true">#</a> 属性选择器</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;a class=&quot;myClass&quot; href=&quot;index.html&quot;&gt;点击跳转&lt;/a&gt;
&lt;span class=&quot;myClass&quot;&gt;另一文本&lt;/span&gt;

&lt;style type=&quot;text/css&quot;&gt;
    [href] {
        background: gray;
        color: #6a90d9;
    }
&lt;/style&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>作用于所有具有 href 属性的元素，不管有没有使用</p><h4 id="组合选择器" tabindex="-1"><a class="header-anchor" href="#组合选择器" aria-hidden="true">#</a> 组合选择器</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;a class=&quot;myClass&quot; href=&quot;index.html&quot;&gt;点击跳转&lt;/a&gt;
&lt;span class=&quot;myClass&quot;&gt;另一文本&lt;/span&gt;

&lt;style type=&quot;text/css&quot;&gt;
    a.myClass {
        background: gray;
        color: #6a90d9;
    }
&lt;/style&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>元素选择器和 class 选择器组合使用，作用于 a 元素中有声明 myClass 类型的元素</p><h4 id="通用选择器" tabindex="-1"><a class="header-anchor" href="#通用选择器" aria-hidden="true">#</a> 通用选择器</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;style type=&quot;text/css&quot;&gt;
    * {
        background: gray;
      }
&lt;/style&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>作用到所有元素上</p><h3 id="基础-javascript" tabindex="-1"><a class="header-anchor" href="#基础-javascript" aria-hidden="true">#</a> 基础-JavaScript</h3><p>Js 是脚本语言，可用于增加网页的交互功能，及各种行为功能。</p><p>既然是一门语言，那么学习这么脚本语言自然需要先掌握其语法，以及运行方式。</p><p>浏览器解析 HTML 文档是按顺序解析的，也就是说，当遇到脚本语言时，也会按顺序一条条的解释执行，直至将脚本语言执行结束再继续解析文档。这就解释了，为什么一份 HTML 文档里，&lt;script&gt; 标签经常是在各种各样的位置出现的。</p><p>而 HTML 文档使用 js 的方式是通过 &lt;script&gt; 标签来实现，如：</p><h4 id="内嵌" tabindex="-1"><a class="header-anchor" href="#内嵌" aria-hidden="true">#</a> 内嵌</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script&gt;
    console.log(&quot;hello world&quot;)
&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="引用外部-js-文件" tabindex="-1"><a class="header-anchor" href="#引用外部-js-文件" aria-hidden="true">#</a> 引用外部 js 文件</h4><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script src=&quot;js/hello.js&quot;&gt;&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,67);function b(q,y){const s=n("ExternalLinkIcon");return t(),d("div",null,[u,o,e("ul",null,[h,v,e("li",null,[e("a",m,[a("MDN web docs"),l(s)])]),e("li",null,[e("a",p,[a("Github:smyhvae/web"),l(s)])])]),g])}const f=i(c,[["render",b],["__file","前端入门1-基础概念.html.vue"]]);export{f as default};
