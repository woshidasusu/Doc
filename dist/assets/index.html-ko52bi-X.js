import{_ as s,r as a,o as r,c as t,a as e,b as i,e as l,d}from"./app-PjuKeMiB.js";const o="/assets/uidocdemo-09cDS-oe.gif",c={},v=d('<h1 id="自定义-md-loader-来简单高效的维护组件文档" tabindex="-1"><a class="header-anchor" href="#自定义-md-loader-来简单高效的维护组件文档" aria-hidden="true">#</a> 自定义 md-loader 来简单高效的维护组件文档</h1><p>个人觉得，组件库最难的不是开发，而是使用，怎么才能让组内同事都用起来，这才是关键</p><h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h2><p>虽然现在开源的组件库很多，但每个项目里还是或多或少都会有人封装出一些项目内通用的基础组件、业务组件</p><p>我参与过多个项目，几乎每个项目都会存在这么一种现象：<strong>重复造轮子</strong></p><p>同一个用途的组件被不同人多次实现，导致后续维护的人可能都不知道该用哪个好，或者干脆又自己撸了一个，就又恶性循环了</p><p>至于如何解决，遇到的基本就是强制定规范，但这种靠人为主观意识的约定，很容易松动，不长久</p><h2 id="痛点" tabindex="-1"><a class="header-anchor" href="#痛点" aria-hidden="true">#</a> 痛点</h2><p>其实可以来分析下看看，为什么就会用不起来呢？</p><p>为什么大家乐意去用一些开源组件库，就是不想用项目里别人封装的呢？</p><p>就我个人而言，可能有这么几个原因：</p><ul><li>我不知道原来项目里已经有这么个通用组件了</li><li>我找到组件代码，但我不确定这个组件呈现效果是什么，是不是我想要的，对业务不熟，与其慢慢去捞页面找试用，干脆自己再撸一个</li><li>我找到组件代码，也找到页面呈现效果，但我不知道该怎么使用，需要花时间去看源码</li></ul><p>于是我反思，那我为什么会乐意去用开源组件库，比如 element-ui 组件呢：</p><ul><li>官网可以直接找到所有组件呈现效果和示例代码</li><li>官网的配置项说明足够使用组件，而无需去看源码</li></ul><p>所以对我来说，根源不是不想用同事封装的组件，而是懒得去看源码，去找示例</p><p>我更在意的是<strong>组件呈现效果和示例代码以及参数配置项说明</strong></p><ul><li>示例代码和参数配置项说明可以通过编写 md 文档来实现</li><li>组件呈现效果需要另外开发个 demo 组件来编写示例代码并运行</li></ul><p>这意味着，封装一个组件，除了写文档，还需要再开发一个组件使用 demo，成本有些大，维护也麻烦</p><p>那么，有没有什么办法可以简化呢？</p><h2 id="解决方案-自定义-md-loader" tabindex="-1"><a class="header-anchor" href="#解决方案-自定义-md-loader" aria-hidden="true">#</a> 解决方案：自定义 md-loader</h2><p>md-loader 是一个自定义的 webpack loader，用来解析 md 文件的，简单来说，它做了两件事：</p><ul><li>将 md 解析成 vue 组件，以便 vue 项目里可以直接将 md 当作 vue 组件使用</li><li>自定义 md 语法 <code>::: demo</code>，以便达到只需在 md 中编写组件示例代码，解析后的 vue 代码会自动将组件示例代码运行起来，呈现真实效果</li></ul><p>有了 md-loader 的这两个能力，我们可以再基于 require.context 搞个自动挂载组件路由</p><p>这样一来，我们只要在每个组件目录下搞个 README.md 文档，里面贴上组件示例代码，然后运行项目，打开组件路由就可以像使用 element-ui 组件官网一样来翻看我们的组件文档了</p><p>我们还可以再集成 monaco-editor 就可以实现一个简易的在线编辑调试代码的功能</p>',25),u={href:"http://59.110.12.45:9002/#/rgui/%E5%85%A8%E5%B1%80%E5%BC%B9%E7%AA%97",target:"_blank",rel:"noopener noreferrer"},m=d('<p><img src="'+o+`" alt=""></p><p>上面示例中的组件使用说明文档内容，包括呈现效果和示例代码，全程都只需要在 md 文档里编写即可，而无需额外编写其他 demo 代码，如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 全局弹窗 this.$rgDialog

为了避免每次使用弹窗时需要编写分散各处的片段代码（el-dialog 的模板代码，控制显隐变量，显示关闭函数等），提取封装了挂载在全局函数的弹窗 \`this.$rgDialog\`

直接在点击事件方法里即可完成弹窗的相关代码

## 使用示例

::: demo

\`\`\`vue
&lt;template&gt;
  &lt;div&gt;
    &lt;el-button type=&quot;primary&quot; @click=&quot;showDialog&quot;&gt;点击显示弹窗&lt;/el-button&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
import dialogContent from &quot;@docs/使用说明.md&quot;;
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    showDialog() {
      const rgDialog = this.$rgDialog({
        props: {
          title: &quot;弹窗标题&quot;,
          width: &quot;80vw&quot;,
          &quot;close-on-click-modal&quot;: true
        },
        events: {},
        content: dialogContent,
        contentProps: {},
        contentEvents: {
          cancel: () =&gt; rgDialog.close()
        }
      }).show();
    }
  }
};
&lt;/script&gt;

&lt;style lang=&quot;scss&quot; scoped&gt;&lt;/style&gt;
\`\`\`

:::

## options 参数说明

| 参数          | 说明                                | 类型   | 可选值 | 默认值                                                      |
| ------------- | ----------------------------------- | ------ | ------ | ----------------------------------------------------------- |
| props         | el-dialog 的 props 输入参数         | object | —      | {width: &#39;700px&#39;, top: &#39;5vh&#39;, &#39;close-on-click-modal&#39;: false} |
| events        | el-dialog 的输出事件，如 @opened 等 | string | —      | —                                                           |
| content       | 弹窗内容的 vue 组件                 | object | —      | —                                                           |
| contentProps  | 弹窗内容 vue 组件的 props 输入参数  | object | —      | —                                                           |
| contentEvents | 弹窗内容 vue 组件的输出事件         | object | —      | —                                                           |

## 方法

\`this.$rgDialog()\` 返回的弹窗实例对象的方法：

| 方法名 | 说明     | 参数 |
| ------ | -------- | ---- |
| show   | 显示弹窗 | —    |
| close  | 关闭弹窗 | —    |


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="md-loader-实现原理" tabindex="-1"><a class="header-anchor" href="#md-loader-实现原理" aria-hidden="true">#</a> md-loader 实现原理</h3><p>这个 loader 是我前司一同事自己开发的，这是他的源码仓库和技术实现细节文档：</p>`,5),b={href:"https://github.com/luchx/md-enhance-vue",target:"_blank",rel:"noopener noreferrer"},h={href:"https://www.yuque.com/luchx/ziwg5m/df00sl",target:"_blank",rel:"noopener noreferrer"},p=d(`<p>原理细节和源码可以移步到相关链接查看，这里简单概述下 md-loader 内部原理，一句话解释：</p><p><strong>将 md 转成的 html 包裹到 vue 的 template 标签内，因此 md 可以直接被当作 vue 组件在代码里被引用，同时自定义扩展 md 的 ::: demo 语法，以便支持组件效果和示例代码可以呈现</strong> loader 工作原理：</p><ol><li>基于 markdown-it 系列插件将 md 转成 html</li><li>如果 md 里没有 ::: demo 场景，则直接将转成的 html 放到 vue 的 template 块里，交给 vue-loader 解析</li><li>如果有 ::: demo 场景，进入自定义解析 ::: demo 流程 <ul><li>将 demo 里的 \`\`\`vue 代码块字符串化后放到 <code>&lt;demo-block&gt;</code> 标签里的 highlight 插槽上。 <ul><li>字符串化的过程做了系列代码的高亮、行号等显示处理</li></ul></li><li>再把 \`\`\`vue 代码块封装到单独的 vue 组件里，组件内部自动命名，然后给挂载到 <code>&lt;demo-block&gt;</code> 标签里的 source 插槽上</li><li><code>&lt;demo-block&gt;</code> 组件就可以用 highlight 插槽来把代码块呈现出来，同时用 source 插槽来引用 loader 生成的子组件，以达到代码块运行的效果</li></ul></li></ol><h3 id="require-context-自动注册路由" tabindex="-1"><a class="header-anchor" href="#require-context-自动注册路由" aria-hidden="true">#</a> require.context 自动注册路由</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 递归遍历当前目录下为 .md 结尾的文件
const files = require.context(&quot;.&quot;, true, /\\.md$/);

files.keys().forEach((filePath) =&gt; {
  // 省略根据文件路径名生成路由配置信息
  // 生成路由配置相关信息,路由直接以组件目录名
  const routerConfig = {
    title: fileName,
    path: \`/\${pathParts.join(&quot;/&quot;)}/\${fileName}\`,
    component: files(filePath).default,
  };
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样就不需要每新增一个组件, 都需要手动去注册路由信息了 注: 脚本可以借助 ChartGPT 完成, 描述好诉求就行</p><h3 id="monaco-editor-在线代码编辑器" tabindex="-1"><a class="header-anchor" href="#monaco-editor-在线代码编辑器" aria-hidden="true">#</a> monaco-editor 在线代码编辑器</h3>`,7),g={href:"https://www.yuque.com/luchx/ziwg5m/ryqc71",target:"_blank",rel:"noopener noreferrer"},f=e("h2",{id:"小结",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#小结","aria-hidden":"true"},"#"),i(" 小结")],-1),_=e("p",null,"只需用 md 就能完成组件使用平台的搭建, 而无需再编写额外的 demo 等成本投入, 较低成本换来使用人的直观, 方便, 快捷的使用组件",-1);function x(q,k){const n=a("ExternalLinkIcon");return r(),t("div",null,[v,e("p",null,[i("如："),e("a",u,[i("在线体验下"),l(n)])]),m,e("ul",null,[e("li",null,[e("a",b,[i("https://github.com/luchx/md-enhance-vue"),l(n)])]),e("li",null,[e("a",h,[i("在 Markdown 中 使用 Vue"),l(n)])])]),p,e("p",null,[e("a",g,[i("Vue 实现在线代码编辑和预览"),l(n)])]),f,_])}const E=s(c,[["render",x],["__file","index.html.vue"]]);export{E as default};
