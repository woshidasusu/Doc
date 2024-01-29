import{_ as a,r as d,o as r,c,a as e,b as s,e as n,d as l}from"./app-fgtJnIYH.js";const t={},o=e("h1",{id:"谈谈动态换肤方案",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#谈谈动态换肤方案","aria-hidden":"true"},"#"),s(" 谈谈动态换肤方案")],-1),v=e("p",null,"最近项目也有动态换肤的需求了，经过跟同事的讨论，网上方案的试验，也有一些心得感悟",-1),u=e("p",null,"所以，本篇就想来谈谈，我在这一次的项目背景下选择动态换肤方案的一些体验感悟",-1),p={href:"https://www.jianshu.com/p/35e0581629d2",target:"_blank",rel:"noopener noreferrer"},m=l(`<blockquote><ul><li>利用 class 命名空间</li><li>准备多套 CSS 主题</li><li>利用 CSS 预处理生成多套主题样式</li><li>动态换肤</li><li>CSS 变量换肤</li></ul></blockquote><p>本篇就不深入介绍了，我就讲讲我们试验的几种方案的思路、优缺点、以及体验感受</p><h3 id="需求背景" tabindex="-1"><a class="header-anchor" href="#需求背景" aria-hidden="true">#</a> 需求背景</h3><p>先来说说我的需求背景是什么</p><p>动态换肤是基本需求，也就是各种 UI 的主题色要能够根据后端配置进行替换，这就意味着需要支持运行时动态换肤</p><p>再来，这个动态换肤功能是需要在一个已经迭代了好几年、经手了各种前端人员的项目上来加入动态换肤功能，也就是说 UI 样式早已完成，而且不同人还有不同的实现规范，有的会用 sass 变量，有的直接干色值</p><p>这就意味着，我需要考虑实现方案的性价比：改动点、影响点以及后期维护性</p><p>以上，就是我对于动态换肤的需求背景</p><h3 id="方案调研" tabindex="-1"><a class="header-anchor" href="#方案调研" aria-hidden="true">#</a> 方案调研</h3><p>基于我对动态换肤的需求背景，首先，编译期的换肤方案就先被淘汰了</p><p>然后先来看看 class 命名空间方案：</p><ul><li><strong>class 命名空间方案</strong></li></ul><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;!-- 在类似 body 的根元素上添加上不同主题标识的 class 来切换主题 --&gt;
&lt;body class=&quot;blue&quot;&gt;
    &lt;span class=&quot;color-primary&quot;&gt;动态换肤&lt;/span&gt;
&lt;/body&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code>// 默认主题色
.color-primary {
    color: #ffffff;
}

// 蓝色主题色
.blue {
    .color-primary {
        color: #1F93FF;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一种利用 css 选择器的优先级特性实现的换肤，思路简单易懂，主题样式的维护也不复杂，缺点就是所有需要设置主题色的 UI 元素都需要添加上定义好的 class，这等于破坏了我们正常编写 CSS 代码的习惯用法，强行将 color 等主题样式属性跟其他的隔离开来</p><p>而且，这种方案在原有项目基础上，改动涉及的范围特别大（每一个用到主题色的 UI 元素都需要改动），而且后期维护成本高，如果没有相关文档说明，交接时没交代清楚，新人维护时也很容易遗漏出问题</p><p>所以，这种方案 pass 掉，不考虑</p><p>继续看看下一个方案：</p><ul><li><strong>多套 CSS 主题方案</strong></li></ul><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;link rel=&quot;stylesheet&quot; href=&quot;blue-theme.css&quot; &gt;&lt;/link&gt;
&lt;!-- 通过动态加载不同 css 主题文件来达到换肤效果 --&gt;
&lt;!-- &lt;link rel=&quot;stylesheet&quot; href=&quot;default-theme.css&quot; &gt;&lt;/link&gt; --&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;div class=&quot;content&quot;&gt;
	一段文字
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>// default-theme.css
.content {
    height: 20px;
    color: #333333;
    background: #1F93FF;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>// green-theme.css
.content {
    height: 20px;
    color: #333333;
    background: #5c887a;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一种根据现有 CSS 文件，再复制多份，只替换掉主题色样式，运行时根据需要加载不同 CSS 文件的方案</p><p>多套自然意味着需要后期进行维护，而手动维护这种思路就直接 pass 掉吧，代价和维护成本太高，不想考虑</p><p>借助 CSS 预处理如 Sass 变量结合一些 webpack 插件来在构建期自动生成多套 CSS 主题，这种方案后期基本没有维护成本，缺点就是首次接入需要配置一系列 webpack 插件，有点学习成本，再来就是打包体积大、有冗余代码，运行时切换主题需要重新加载 CSS 文件</p><p>还有就是使用 Sass 变量，意味着需要先对当前项目进行改造，然后规定好使用规范，每个使用主题色的 CSS 都需要使用 Sass 变量，新人加入时需交代清楚或者有清晰的规范文档指引，否则也容易出问题</p><p>这种方案的副作用有些多，待考虑，再看看其他方案</p><ul><li><strong>CSS 变量方案</strong></li></ul><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;div class=&quot;content&quot;&gt;
	一段文字
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>.content {
    color: var(--color-primary)
}

// 在类似 body 的根元素选择器上对 css 变量 --color-primary 进行赋值实现换肤
body {
    --color-primary: #ffffff;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一种直接利用 CSS 支持变量的特性来实现的换肤方案，这意味着没有任何学习成本，也不需要引入或依赖其他东西，通俗易懂，如果不是因为这种方案存在兼容性问题（IE 不兼容，Android 5.0 及以下的系统设备也不兼容），那这种方案可以算是性价比很高的方案</p><p>在我们的一些不用考虑兼容问题的项目上，我们就选择使用了该方案来实现动态换肤</p><p>在使用这个方案来实现换肤需求时，最大的体验感悟就是：还是需要对当前的项目进行大范围的改动</p><p>毕竟所有设置颜色的 CSS 代码都需要使用 <code>var(--xxx)</code> 变量来处理，而且还需要说明好规范，让其他人以及以后交接的新人也能够清楚的知道，需要怎么处理</p><p>而且，当我在各个文件里去修改替换成 <code>var(--xxx)</code> 的时候，我就在想，万一以后这种方案又不行了，那到时岂不是又得再每个文件去替换修改 <code>var(--xxx)</code> 这段代码？</p><p>所以，其实，我们完全可以综合各种方案的优点，比如在使用 CSS 变量方案的时候，就和 Sass 变量这种预处理语言结合上，这样一来，需要设置颜色的使用 Sass 变量也符合我们目前技术栈的规范，而 CSS 变量 <code>var(--xxx)</code> 的定义只需要在声明 Sass 变量的地方维护即可，即时到时不用 CSS 变量方案，那修改下 Sass 变量的赋值即可:</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code>$color-primary: var(--color-primary);

.content {
  color: $color-primary;
}

body {
  --color-primary: #ffffff;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用了 CSS 变量方案在不兼容的浏览器上显示就会有问题，但也不是没有方案解决，借助 webpack 的 post-css 系列插件，也可以来解决这些兼容问题</p><p>这种方案可以考虑，毕竟性价比还行，再来看种方案：</p><ul><li><strong>element 的换肤方案</strong></li></ul><p>element-ui 组件有提供一种换肤方案，这里有网址可以体验：</p>`,42),b={href:"https://elementui.github.io/theme-preview/#/zh-CN",target:"_blank",rel:"noopener noreferrer"},h=e("p",null,[e("img",{src:"https://minio-test.mysre.cn/kefu/retesting/customerservice/upload/39fb3d3d-e597-7883-d3f5-a014606614b4_orig.gif",alt:""})],-1),g=e("p",null,"初次体验时，会觉得很奇妙，运行时换肤，既不是 CSS 变量，也没有加载多份 CSS 主题，也不是 class 命名方案，那它是如何实现的换肤呢？",-1),S=e("p",null,"有个同事去研究了它的实现原理，然后来给我们讲解，突然觉得这种换肤方案的确挺巧妙，关键它还是一种非侵入性方案，这意味着，即时我现有的项目规范七零八落，颜色样式实现也各种各样，但都没关系，这方案不需要去改动代码，就能实现换肤，虽然有点暴力",-1),_=e("p",null,"所以，下面想专门拿出一节，来看看 element 的换肤方案是怎么做的",-1),f=e("p",null,"当然，还有其他一些换肤方案，只是从一些常见的方案体验下来，就已经找到了足以满足我需求的方案，所以就没有继续去调研、去扩展了解了",-1),x=e("h3",{id:"element-暴力替换-style-方案",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#element-暴力替换-style-方案","aria-hidden":"true"},"#"),s(" element 暴力替换 style 方案")],-1),C={href:"https://github.com/ElementUI/theme-chalk-preview",target:"_blank",rel:"noopener noreferrer"},y=l(`<p>我们可以 clone 下来看看它是怎么做的，主要的实现代码都在 App.vue 文件里：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 这是选取颜色后点击切换调用的方法，我只保留了关键代码：
submitForm() {
  this.$refs.form.validate((valid) =&gt; {
    if (valid) {
      this.themeDialogVisible = false;
      this.primaryColor = this.colors.primary;
      this.colors = objectAssign(
        {},
        this.colors,
        generateColors(this.colors.primary)
      );

      this.canDownload = true;
      this.writeNewStyle();
    } else {
      return false;
    }
  });
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是在选取颜色后，点击确认调用的方法，看代码也就做了几件事：</p><ol><li></li><li>sdf</li><li>sdf</li></ol><p>所以关键还是看看这个 \`\` 是什么东西，它声明在 data 变量里，在组件被的时候进行初始化：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>初始化时，</p><h4 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h4><p>简单来小结下，element 的换肤方案思路其实也很容易理解：</p><ol><li></li><li></li></ol><p>发现了没有，其实 element 的这种换肤方案并不是用了什么新特性或黑科技，本质上仍旧是常见的一些换肤方案思路，只是把这些常见方案柔和起来，取长补短，来达到更好的方案体验</p><p>本质上来说，它也是一种多套 CSS 主题样式的方案，只是它的多套并不是提前备好，而是在运行期动态生成一套新的 CSS 主题样式，然后再利用了相同优先级的 CSS 选择器，以最后加载的为主这种特性来动态添加一个 style 标签重新加载 CSS 主题样式覆盖旧主题</p><p>而为了让 CSS 主题样式都能够在一份文件里维护，实际项目开发中，还需要借助 Scss 这类预处理来定义好主题样式变量</p><p>所以，在 element 的换肤方案上，都能看见常见的换肤方案思路的影子</p><h3 id="方案体验感受" tabindex="-1"><a class="header-anchor" href="#方案体验感受" aria-hidden="true">#</a> 方案体验感受</h3><p>我很喜欢我之前的老大跟我说过的一句话：<strong>一切需要依赖于开发人员的主观意识去遵守的方案，都不是靠谱的方案</strong></p><p>即使制定了一系列非常完善的规范，即使很严格的要求大家去遵守，总会有各种各样的原因导致没能遵守，比如时间长忘了、事情紧急临时开个后门、制定的人离职了、没人花精力去管了、新人交接没清楚、有个特立独行犟脾气的同事等等</p><p>而通常这类需要依赖规范才能达到目的的方案，一旦某个中间人走偏了，甚至说把规范文档丢失了，那对于最后接手的人来说，将会是一个巨坑</p><p>所以我老大都会跟我说，想法很好，可以做，但如果可以继续进一步研究些工具脚本也好、插件也行，借助外在辅助来强制大家遵守，效果会更好</p><p>而除了 element 的换肤方案之外，其他方案都是需要大家遵守一定的规范，class 命名方案需要给每个需要设置主题色的 UI 加上特定的 class、sass 变量和 css 变量的方案也需要遵守设置 color 时使用统一定义好的变量</p><p>有规范自然是希望项目更好维护，但一定要考虑好在现在或者未来，如何让其他人能更好的遵守到这些规范</p><p>而且，element 的这种方案，并不是说就不能没有规范，照样可以制定相关的主题样式使用规范，并不影响它换肤的效果</p><p>另外，我还有个非常有年代的项目，技术栈方面涵盖了旧时代后端模板引擎渲染 + jQuery 的那套，以及经手人逐步渐进式引入的 vue，还有使用了一些不支持换肤的三方 UI 组件库。这就意味着，项目的部分代码没有现代前端工程化的概念，也就无法使用 sass 这类需要依赖于编译期的方案，也用不了 css 变量方案，因为有些代码修改不到源码，那么只能使用样式优先级覆盖方案，而 element 的这个方案就能解决我这个老项目的场景，实现换肤需求</p><p>基于我的项目经历，我的需求背景，我才会更倾向于 element 的换肤方案</p><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>最后，我个人观念是，方案本身并没有什么好的坏的之分，只有适不适用，能不能解决诉求</p><p>也许现在看来有些糟糕的方案，在当时，在某些场景下，确确实实解决了痛点诉求，只是跟不上后来的发展</p><p>element 的换肤方案也存在一些问题，比如太过暴力，比如有可能会误换肤等等</p><p>而且，css 变量方案在不考虑兼容的前提下，也的确是一种性价比很高的方案</p><p>总之，仁者见仁智者见智，大家畅叙己见即可，方案嘛，就是在你一句我一句中诞生出来的</p>`,30);function k(q,w){const i=d("ExternalLinkIcon");return r(),c("div",null,[o,v,u,e("p",null,[s("换肤方案有很多种，网上也有很多文章深入的讲解每种方案，比如这篇文章："),e("a",p,[s("一文总结前端换肤换主题"),n(i)]),s("里就介绍了很多种方案：")]),m,e("p",null,[e("a",b,[s("https://elementui.github.io/theme-preview/#/zh-CN"),n(i)])]),h,g,S,_,f,x,e("p",null,[s("element 提供的换肤在线体验的仓库地址为："),e("a",C,[s("https://github.com/ElementUI/theme-chalk-preview"),n(i)])]),y])}const j=a(t,[["render",k],["__file","谈谈动态换肤方案.html.vue"]]);export{j as default};
