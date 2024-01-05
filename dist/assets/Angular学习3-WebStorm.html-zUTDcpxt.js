import{_ as e,o as i,c as n,d as t}from"./app-pwInIdNR.js";const u={},l=t(`<p>在开始讲 Angular 各个核心知识点之前，想先来讲讲开发工具 WebStorm 的一些配置以及相应配置文件如 tslint.json 的配置。</p><p>因为我个人比较注重代码规范、代码风格，而对于这些规范，我只有一个观点：<strong>一切需要依赖开发人员的主观意识去遵守的规范都没有多大意义。</strong></p><p>以前做 Android 开发时会借助 AndroidStudio 来强制遵守一些规范，现在前端项目我用的是 WebStorm 开发，这两个开发工具本质上同源，所以很多功能都差不多。</p><p>那么，这篇就来讲一讲，如何对 WebStorm 进行一些设置，让它可以更好的辅助我们遵守风格规范，同时，理清一些比如 tslint.json 的配置，来让开发工具实时检测我们写的代码是否有很好的遵守规范。</p><h1 id="风格规范" tabindex="-1"><a class="header-anchor" href="#风格规范" aria-hidden="true">#</a> 风格规范</h1><p>Angular 项目的很多文件都是通过 Angular-CLI 工具的 ng 命令来生成的，生成时就有默认一些代码风格，而且，WebStorm 默认也有一些代码风格，也许有人觉得直接使用默认的风格来即可。</p><p>但对于默认的一些风格规范，我不是很赞同，比如说：</p><p><code>name: string = &#39;dasu&#39;</code></p><p>简单的在某个类中声明这么一个 name 变量，类型是 string，初始值为 dasu，但默认的 tslint.json 配置的代码风格会报错，因为它建议我们，既然已经初始化为字符串类型了，就没有必要再去声明变量的类型了。</p><p>对于这种默认风格，我个人并不赞同，因为个人习惯了 Java 的风格，对于变量的类型声明已经习惯了，更何况，这个初始值有可能在未来被去掉，那么，这时候岂不是还要去加上类型说明？</p><p>所以，我个人还是比较习惯声明变量的类型，不管有没有对其进行初始化。</p><p>以上只是个简单的例子，默认的一些代码风格，我个人都不是很习惯，所以，下面列举我的个人代码风格，供大伙借鉴、参考。</p><p>不多，只有几点而已，因为大多直接使用默认的代码风格，只是默认的一些风格中，我不是很习惯的情况下，才会对其进行修改。</p><h4 id="命名方面" tabindex="-1"><a class="header-anchor" href="#命名方面" aria-hidden="true">#</a> 命名方面</h4><ul><li>私有属性和方法以 <code>_</code> 一个下划线开头，并添加 <code>private</code> 修饰符</li><li>公有属性和方法使用默认的不加修饰符</li><li>与组件对应的模板 html 绑定事件相关的方法，以 <code>on</code> 为前缀</li><li>组件的输出属性（@Output) 不以 <code>on</code> 为前缀</li><li>表格数据的 *ngFor 指令时，建议以 item 命名每一项，如 <code>*ngFor=&quot;let item of page?.result&quot;</code> 这样便于各个页面的代码直接复制粘贴</li></ul><h4 id="格式" tabindex="-1"><a class="header-anchor" href="#格式" aria-hidden="true">#</a> 格式</h4><ul><li>HTML 中使用 <code>&quot;&quot;</code> 双引号，ts 中使用 <code>&#39;&#39;</code> 单引号</li><li>HTML 和 ts 的缩进都使用 4 个空格</li><li>局部变量允许使用 let，并不一定强制使用 const</li><li>所有变量声明时直接指明其类型</li></ul><h1 id="tslint-json" tabindex="-1"><a class="header-anchor" href="#tslint-json" aria-hidden="true">#</a> tslint.json</h1><p>创建一个新的 Angular 项目时，会自动生成项目的脚手架，里面包括了各种各样的文件，其中有一份是 tslint.json 文件，是用来给 WebStorm 实时对代码进行 lint 检测时的代码风格配置。</p><p>我修改了部分默认的配置，下面给出的是所有项的配置，其中带有注释的配置项，就是我增加或修改原本默认的配置项，是基于我上面说的个人的一些习惯风格而进行的修改：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;rules&quot;: {
    &quot;arrow-return-shorthand&quot;: true,
    &quot;adjacent-overload-signatures&quot;: true, // override 函数是否集中放置 (新增)
    &quot;callable-types&quot;: true,
    &quot;class-name&quot;: true,
    &quot;comment-format&quot;: [
      true,
      &quot;check-space&quot;
    ],
    &quot;curly&quot;: true,
    &quot;deprecation&quot;: {
      &quot;severity&quot;: &quot;warn&quot;
    },
    &quot;eofline&quot;: false,  // 文件末尾是否需要空新行 (默认 true)
    &quot;encoding&quot;: true,  // 文件编码是否默认 UTF-8 (新增)
    &quot;forin&quot;: true,
    &quot;import-blacklist&quot;: [
      true,
      &quot;rxjs/Rx&quot;
    ],
    &quot;import-spacing&quot;: true,
    &quot;indent&quot;: [
      true,
      &quot;spaces&quot;
    ],
    &quot;interface-over-type-literal&quot;: true,
    &quot;label-position&quot;: true,
    &quot;max-line-length&quot;: [
      true,
      240 // 默认140，我屏幕挺大的，所以并不反感某一行代码过长，相反，很多代码因为自动换行后，我个人感觉更不习惯，还不如我手动来选择从某个地方换行
    ],
    &quot;member-access&quot;: false,
    &quot;member-ordering&quot;: [
      true,
      {
        &quot;order&quot;: [
          &quot;static-field&quot;,
          &quot;instance-field&quot;,
          &quot;static-method&quot;,
          &quot;instance-method&quot;
        ]
      }
    ],
    &quot;no-arg&quot;: true,
    &quot;no-bitwise&quot;: true,
    &quot;no-console&quot;: [
      true,
      &quot;debug&quot;,
      &quot;info&quot;,
      &quot;time&quot;,
      &quot;timeEnd&quot;,
      &quot;trace&quot;
    ],
    &quot;no-construct&quot;: true,
    &quot;no-consecutive-blank-lines&quot;: [  // 空白行最多几行 (新增)
      true,
      3
    ],
    &quot;no-debugger&quot;: false,
    &quot;no-duplicate-super&quot;: true,
    &quot;no-duplicate-switch-case&quot;: true, // 是否禁止重复 case (新增)
    &quot;no-duplicate-imports&quot;: true,     // 是否禁止重复 import (新增)
    &quot;no-duplicate-variable&quot;: [        // 是否禁止重复变量声明 (新增)
      true,
      &quot;check-parameters&quot;
    ],
    &quot;no-conditional-assignment&quot;: true, // 禁止在分支条件判断中有赋值操作 (新增)
    &quot;no-empty&quot;: false,
    &quot;no-empty-interface&quot;: true,
    &quot;no-eval&quot;: true,
    &quot;no-inferrable-types&quot;: [  // 是否禁止在有初始值的变量声明上，增加类型声明 (默认 true)
      false,
      &quot;ignore-params&quot;
    ],
    &quot;no-mergeable-namespace&quot;: true, // 是否禁止重复的命名空间 (新增)
    &quot;no-misused-new&quot;: true,
    &quot;no-non-null-assertion&quot;: true,
    &quot;no-shadowed-variable&quot;: true,
    &quot;no-string-literal&quot;: false,
    &quot;no-string-throw&quot;: true,
    &quot;no-switch-case-fall-through&quot;: true,
    &quot;no-trailing-whitespace&quot;: false,      // 是否禁止末尾空格 (默认 true)
    &quot;no-unnecessary-initializer&quot;: true,
    &quot;no-unused-expression&quot;: false,  // 是否允许无用的表达式存在 (默认 true)
    &quot;no-unused-variable&quot;: false,   // 是否允许无用的变量存在 (新增)
    &quot;no-use-before-declare&quot;: true,
    &quot;no-unsafe-finally&quot;: true,
    &quot;no-for-in-array&quot;: true,
    &quot;no-var-keyword&quot;: true,
    &quot;object-literal-sort-keys&quot;: false,
    &quot;one-line&quot;: [
      true,
      &quot;check-open-brace&quot;,
      &quot;check-catch&quot;,
      &quot;check-else&quot;,
      &quot;check-whitespace&quot;
    ],
    &quot;prefer-const&quot;: false,  // 不强制使用 const，允许使用 let
    &quot;quotemark&quot;: [  // 引号设置，ts 中单引号
      true,
      &quot;single&quot;,
      &quot;jsx-double&quot;,
      &quot;avoid-escape&quot;,
      &quot;avoid-template&quot;
    ],
    &quot;radix&quot;: true,
    &quot;semicolon&quot;: [
      true,
      &quot;always&quot;,
      &quot;ignore-interfaces&quot;
    ],
    &quot;space-within-parens&quot;: [
      true,
      0
    ],
    &quot;triple-equals&quot;: [
      true,
      &quot;allow-null-check&quot;
    ],
    &quot;typedef-whitespace&quot;: [
      true,
      {
        &quot;call-signature&quot;: &quot;nospace&quot;,
        &quot;index-signature&quot;: &quot;nospace&quot;,
        &quot;parameter&quot;: &quot;nospace&quot;,
        &quot;property-declaration&quot;: &quot;nospace&quot;,
        &quot;variable-declaration&quot;: &quot;nospace&quot;
      }
    ],
    &quot;unified-signatures&quot;: true,
    &quot;variable-name&quot;: false,
    &quot;whitespace&quot;: [
      true,
      &quot;check-branch&quot;,
      &quot;check-decl&quot;,
      &quot;check-operator&quot;,
      &quot;check-separator&quot;,
      &quot;check-type&quot;
    ],
    &quot;no-output-on-prefix&quot;: true,
    &quot;use-input-property-decorator&quot;: true,
    &quot;use-output-property-decorator&quot;: true,
    &quot;use-host-property-decorator&quot;: true,
    &quot;no-input-rename&quot;: true,
    &quot;no-output-rename&quot;: true,
    &quot;use-life-cycle-interface&quot;: true,
    &quot;use-pipe-transform-interface&quot;: true,
    &quot;component-class-suffix&quot;: true,
    &quot;directive-class-suffix&quot;: true
  }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>tslint.json 文件只是用来在执行 <code>ng lint</code> 命令，或者代码编程过程中，开发工具实时检测，当检测到不符合风格规范的代码时，进行报错处理。</p><p>虽然可以在执行 <code>ng lint --fix</code> 时添加 <code>--fix</code> 参数来自动修正一些风格错误，但这种方式很耗时，而是代码编写过程中，也没法应用。</p><p>所以，可以借助 Webstorm 的一些配置，一些小技巧，来进行代码的格式化操作，让开发工具自动帮我们将代码整理成符合规范的风格。</p><h1 id="webstorm-小技巧" tabindex="-1"><a class="header-anchor" href="#webstorm-小技巧" aria-hidden="true">#</a> WebStorm 小技巧</h1><p>下面介绍的这些配置项，都是为代码的格式化操作（快捷键：<code>Ctrl + Alt + L</code>）服务的，意思也就是说，当我们为当前文件进行代码格式化操作时，WebStorm 就会自动按照我们的这些配置项来自动整理代码，将代码整理成遵循规范的风格。</p><h3 id="标点符号-引号-分号-逗号" tabindex="-1"><a class="header-anchor" href="#标点符号-引号-分号-逗号" aria-hidden="true">#</a> 标点符号（引号，分号，逗号）</h3><p>设置路径：<code>Settings -&gt; Editor -&gt; Code Style -&gt; TypeScript -&gt; Punctuation</code></p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-a09aa1367d940f1d.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>这里配置项很少，就三个，分别是配置分号，引号和逗号。</p><ul><li><p>第一行用来配置每行代码末尾是否需要有 <code>;</code> 分号，且格式化时是否对旧代码（已经过格式化的代码）进行处理。</p></li><li><p>第二行用来配置，代码中是使用 <code>&#39;&#39;</code> 单引号，还是 <code>&quot;&quot;</code> 双引号（默认是双引号），且格式化时是否对旧代码（已经过格式化的代码）进行处理。</p></li><li><p>第三行用来配置是否需要保留，还是去掉数组或对象属性列表中，最后一项末尾的逗号。</p></li></ul><p>我的代码风格是 HTML 中使用 <code>&quot;&quot;</code> 双引号，TypeScript 中使用 <code>&#39;&#39;</code> 单引号，但使用工具自动生成 ts 文件时，引号默认是双引号，或者某些时候某些因素下，代码中出现一些双引号，这时候，通过修改这个配置，在每次格式化代码时，就都会自动将双引号转成单引号，方便、高效。</p><h3 id="空格" tabindex="-1"><a class="header-anchor" href="#空格" aria-hidden="true">#</a> 空格</h3><p>设置路径：<code>Settings -&gt; Editor -&gt; Code Style -&gt; TypeScript -&gt; Spaces</code></p><p>格式化操作时，会自动在比如方法的 <code>{</code> 右括号前，赋值语句的 <code>=</code> 等号两侧等等这些位置自动加上一个空格，如果我们写代码时漏掉这些空格时。</p><p>这个功能其实是根据这里的配置项来决定的，这里面默认勾选了很多，基本符合常见的风格规范：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-4444c2d4e47fe1ef.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>对于空格，我没有改掉默认格式化时空格风格，只是增加了几种场景也需要自动进行空格处理，分别是：</p><ul><li>Within -&gt; ES6 import/export braces</li></ul><p>导入语句 <code>{}</code> 距离内容之间增加一个空格，默认是没有的，如：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-f7b4502ca73d1382.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><ul><li>Within -&gt; Object literal braces 勾选</li><li>Within -&gt; Object literal type braces 勾选</li></ul><p>这两个是对象内部的空格处理，默认也是没有的，如：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-58481a48f99c1716.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><h3 id="对齐和换行" tabindex="-1"><a class="header-anchor" href="#对齐和换行" aria-hidden="true">#</a> 对齐和换行</h3><p>设置路径：<code>Settings -&gt; Editor -&gt; Code Style -&gt; TypeScript -&gt; Wrapping and Braces</code></p><p>这里是设置一些对齐或者换行策略：</p><ul><li>Chained method calls 设置为 Wrap always</li><li>Chained method calls -&gt; Align when multiline 勾选</li><li>Chained method calls -&gt; &#39;:&#39; on new line 勾选</li></ul><p>上面三个是用来设置方法链时，代码的整理，默认不做处理，可以改成格式化时，自动将每层的方法调用进行换行，并且对齐处理，个人建议。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-c14c88a54699907b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><ul><li>&#39;if()&#39; statement -&gt; Force braces 设置为 always</li></ul><p>这个是设置，即使 if 代码块内只有简单的一行代码，也要自动为其加上大括号处理，默认是不做处理。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-980fc42055c29eeb.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><ul><li>Ternaty operation 设置为 Chop down if long</li><li>Ternaty operation -&gt; Align when multiline 勾选</li><li>Ternaty operation -&gt; &#39;?&#39; and &#39;:&#39; signs on next line 勾选</li></ul><p>这个是用来设置 <code>? :</code> 运算符的处理，上面的设置意思是，当代码过长时，自动将 <code>?</code> 和 <code>:</code> 的代码换行，并对其处理，默认是不做处理。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-384a716038b37bb3.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><ul><li>Array initializer 设置为 Chop down if long</li><li>Array initializer -&gt; Align when multiline 勾选</li><li>Array initializer -&gt; New line after &#39;[&#39; 勾选</li><li>Array initializer -&gt; Place &#39;]&#39; on new line 勾选</li></ul><p>这个是用来设置数组的处理，以上配置的意思是，当数组过长时，自动将每一项进行换行并对其处理，<code>[]</code> 单独占据一行：</p><p>对于 Angular 中的 @NgModel 的文件来说，经常会有这种风格需要，所以就直接这么配置了。</p><ul><li>Objects -&gt; Align 设置为 On Value</li><li>Variable declarations 设置为 Chop down if long</li><li>Variable declarations -&gt; Align 设置为 when grouped</li></ul><p>这个是用来设置变量或者对象的属性列表的赋值语句的对齐模式，如：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-acbb903450cf5dce.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-5ac7ee768f2b644b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>同理，也可以设置 CSS 的样式属性的对齐方式：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-b30e1b207292d771.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>以上，只是我的个人风格习惯，大体上，我都直接按照默认的风格规范来遵守，但在个把一些项上，个人有不同的看法和习惯，所以修改掉了默认的风格配置。</p><p>另外，我比较习惯使用格式化代码操作，而且一个项目中，代码全是我自己写的可能性也很小，别人写的代码或多或少都存在一些风格规范问题，也没办法强制性要求他人必须遵守，所以，就瞎折腾了下 WebStorm 的相关配置。</p><p>这样，就方便我对别人的代码也直接通过格式化操作来自动进行风格规范处理。</p>`,68),o=[l];function s(a,d){return i(),n("div",null,o)}const c=e(u,[["render",s],["__file","Angular学习3-WebStorm.html.vue"]]);export{c as default};
