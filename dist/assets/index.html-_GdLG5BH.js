import{_ as l,r as d,o as v,c as r,a as e,b as n,e as s,d as a}from"./app-xJrSpaa5.js";const u="/assets/i18n1-J-D8Cz32.gif",c="/assets/i18n2--HsPCSlO.gif",o="/assets/i18n3-GoRfz9Tf.gif",t={},m=e("h1",{id:"使用-vve-i18n-cli-来一键式自动化实现国际化",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#使用-vve-i18n-cli-来一键式自动化实现国际化","aria-hidden":"true"},"#"),n(" 使用 vve-i18n-cli 来一键式自动化实现国际化")],-1),b={href:"https://github.com/vue-viewer-editor/vve-i18n-cli",target:"_blank",rel:"noopener noreferrer"},h=e("p",null,"这是我同事开发的国际化自动处理脚本，我进行过一次扩展，让其也支持我们一个 jQuery 老项目的国际化日常维护",-1),q=e("p",null,"至此，我们团队内的国际化均是使用该脚本来进行日常维护",-1),p=e("p",null,"该自动化脚本极大的为我们提效，基本将国际化的词条相关工作降低到 0 了，这意味着我们基本上不用特意留出太多时间来处理国际化方面的工作",-1),f={href:"https://juejin.cn/post/7319674466170093603",target:"_blank",rel:"noopener noreferrer"},g=a('<p>不可否认的是，如果没有这个自动化脚本，根本就没法在领导期望的时间内完成国际化的工作</p><p>自从有了这个脚本后，从以前的跟领导评估说要 4 天的国际化工作量到现在只评估了 1 天工作量，实际上跑下脚本分分钟就解决了，我还可以愉快的滑一天水，领导开心，我也开心~</p><h2 id="自动化脚本能力" tabindex="-1"><a class="header-anchor" href="#自动化脚本能力" aria-hidden="true">#</a> 自动化脚本能力</h2><h3 id="检查项目里是否存在不合理的编程方式-如中文做-key-值等" tabindex="-1"><a class="header-anchor" href="#检查项目里是否存在不合理的编程方式-如中文做-key-值等" aria-hidden="true">#</a> 检查项目里是否存在不合理的编程方式，如中文做 key 值等</h3><p><img src="'+u+`" alt=""></p><p>上述示例命令运行结果呈现：</p><p><code>{&quot;type&quot;:&quot;script-pre&quot;,&quot;text&quot;:&quot;这里也可能有中文，还用不了this上下文&quot;}</code><code>{&quot;type&quot;:&quot;props&quot;,&quot;text&quot;:&quot;这里的中文也用不了this上下文&quot;}</code><br><code>{&quot;type&quot;:&quot;zh-key&quot;,&quot;text&quot;:&quot;中文&quot;}</code></p><p><code>script-pre</code> 场景是说发现有中文存在于 script 标签内，这部分代码运行在 js 模块作用域内，this 指向不是 vue 组件，包裹 <code>this.$t</code> 的话会导致程序异常，所以要先手动处理下，能下沉就下沉，否则就先手动用全局函数包裹，然后忽略这个处理</p><p><code>props</code> 场景是说发现有中文存在于 vue 的 props 字段里，这里也无法访问 this，会报异常，建议这块更改成 computed 用法</p><p><code>zh-key</code> 场景是说发现中文做 key 值，需要用户确认是否能被翻译处理</p><p>这个命令可以提前主动的发现代码里的国际化处理问题，避免将问题遗留到测试或线上阶段</p><h3 id="标记无需处理的词条" tabindex="-1"><a class="header-anchor" href="#标记无需处理的词条" aria-hidden="true">#</a> 标记无需处理的词条</h3><p>总有些场景，你希望这个中文词条不要被国际化处理，这时候可以类似 es-lint 的忽略配置一样，既可以忽略整个文件，也可以忽略文件中的某个词条</p><p>在 <code>vve-i18n-cli.config.js</code> 里增加下忽略配置规则：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// vve-i18n-cli.config.js
module.exports = {
  // 国际化文本包裹相关
  zhWrap: {
    // 需要过滤的文件
    ignoreI18nFileRules: [],
    // 需要处理的文件
    i18nFileRules: [&quot;!(node_modules|config|statsvnTmp)/**/*.+(js|vue)&quot;],
    // 当词条前缀出现以下正则时，该词条过滤不处理
    ignorePreReg: [
      /t\\s*\\([\\s\\n]*$/, //  词条在 t( 方法内的不处理，$t() 符合该规则
      /console\\.(?:log|error|warn|info|debug)\\s*\\(\\s*$/, //  词条在 console.xxx 方法内的不处理，过滤掉日志内的中文处理
      new RegExp(&quot;//.+&quot;), // 注释中的词条不处理
      new RegExp(&quot;i18n-disabled.+&quot;), // 词条前面出现 i18n-disabled 关键词的不处理
    ],
  },
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后代码中这些场景就不被处理了：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>const ZH_KEY = /*i18n-disabled*/ &quot;出现忽略处理的关键词的词条也不会被处理&quot;;
// 注释里中文不会被处理
console.error(&quot;日志里的中文也不会被处理&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自动对各种场景的中文词条包裹翻译函数" tabindex="-1"><a class="header-anchor" href="#自动对各种场景的中文词条包裹翻译函数" aria-hidden="true">#</a> 自动对各种场景的中文词条包裹翻译函数</h3><p>当检查完代码基本没问题，也配置了需要忽略处理的词条文件后，就可以通过命令自动对中文词条进行包裹翻译函数处理了：</p><p><img src="`+c+'" alt=""></p><p>不管你项目文件有成百上千个，都是一个命令就自动完成国际化翻译函数包裹词条处理</p><p>包裹哪些文件、包含的翻译函数名，不同场景（js 里，vue 里）用什么函数包裹，js 里是否需要加入 import 引入包含函数的代码，哪些文件不处理，哪些词条不处理，哪些前缀标记的不处理等等</p><p>以上场景都是通过 <code>vve-i18n-cli.config.js</code> 配置文件处理，详情查看下面章节，有默认的配置，你也可以根据你项目需要进行自己诉求的配置</p><p>脚本不是写死的行为，通过不同配置，可以适应到各种项目里去使用，目前我们团队的老项目，新项目，各种项目就通过各自项目的配置来接入了这个国际化自动处理脚本</p><h3 id="自动将所有词条提取到-json-文件中-按模块维护" tabindex="-1"><a class="header-anchor" href="#自动将所有词条提取到-json-文件中-按模块维护" aria-hidden="true">#</a> 自动将所有词条提取到 json 文件中（按模块维护）</h3><p>当项目完成的国际化包裹词条处理后，就可以接着下一步，把词条提取到 json 文件里了：</p><p><img src="'+o+`" alt=""></p><p>想机翻，可以，默认不翻译，只做提取<br> 想按模块提取到不同 json 文件里，可以，配置下模块规则<br> 想生成多份语言的 json，可以，默认只有 zh.json, en.json</p><hr><p>国际化的词条工作无外乎就是词条包裹处理，词条提取，词条翻译</p><p>这些工作难度不大，但工作量大，借助这类国际化自动处理脚本，就可以极大的提高效率，开心的滑水了</p><h2 id="如何使用" tabindex="-1"><a class="header-anchor" href="#如何使用" aria-hidden="true">#</a> 如何使用</h2><h3 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h3><p><code>npm install vve-i18n-cli -D</code></p><h3 id="package-里添加脚本命令-简化命令使用" tabindex="-1"><a class="header-anchor" href="#package-里添加脚本命令-简化命令使用" aria-hidden="true">#</a> package 里添加脚本命令，简化命令使用</h3><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>{
  &quot;scripts&quot;: {
    &quot;i18n&quot;: &quot;vve-i18n-cli&quot;,
    &quot;i18n-wrap&quot;: &quot;vve-i18n-zh-wrap-cli&quot;,
    &quot;i18n-check&quot;: &quot;vve-i18n-zh-check-cli&quot;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="根目录下创建配置文件-vve-i18n-cli-config-js" tabindex="-1"><a class="header-anchor" href="#根目录下创建配置文件-vve-i18n-cli-config-js" aria-hidden="true">#</a> 根目录下创建配置文件 vve-i18n-cli.config.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// vve-i18n-cli.config.js
module.exports = {
  // 工作目录
  cwd: &quot;.&quot;,
  // 根目录，国际文本所在的根目录
  rootDir: &quot;src&quot;,
  // 默认所有模块，如果有传module参数，就只处理某个模块
  // &#39;**/module-**/**/index.js&#39;
  moduleIndexRules: [&quot;.&quot;],
  // 忽略模块
  ignoreModuleIndexRules: [],
  // 匹配含有国际化文本的文件规则
  i18nFileRules: [&quot;**/*.+(vue|js)&quot;],
  // 不匹配含有国际化文本的文件规则
  ignoreI18nFileRules: [],
  // 国际化文本的正则表达式，正则中第一个捕获对象当做国际化文本
  i18nTextRules: [/(?:[\\$.])t\\([\\s\\n]*[&#39;&quot;](.+?)[&#39;&quot;]/g],
  // 模块的国际化的json文件需要被保留下的key，即使这些组件在项目中没有被引用
  // 规则可以是一个字符串，正则，或者是函数
  keepKeyRules: [
    /^G\\/+/, // G/开头的会被保留
  ],
  // 忽略国际化KEY的规则
  // 规则可以是一个字符串，正则，或者是函数
  ignoreKeyRules: [],
  // 生成的国际化资源包的输出目录
  outDir: &quot;lang&quot;,
  // 生成的国际化的语言
  i18nLanguages: [
    &quot;zh&quot;, // 中文
    &quot;en&quot;, // 英文
  ],
  // 配置文件的路径，没有配置，默认路径是在\${cwd}/vve-i18n-cli.config.js
  config: undefined,
  // 是否取配置文件
  disableConfigFile: false,
  // 是否翻译
  translate: false,
  // 翻译的基础语言，默认是用中文翻译
  translateFromLang: &quot;zh&quot;,
  // 是否强制翻译，即已翻译修改的内容，也重新用翻译生成
  forceTranslate: false,
  // 翻译的语言
  translateLanguage: [&quot;zh&quot;, &quot;en&quot;],
  // 非中文使用拼音来来翻译
  translateUsePinYin: false,
  // 模块下\${outDir}/index.js文件不存在才拷贝index.js
  copyIndex: false,
  // 是否强制拷贝最新index.js
  forceCopyIndex: false,

  // 国际化文本包裹相关
  zhWrap: {
    cwd: &quot;.&quot;,
    // 根目录，国际文本所在的根目录
    rootDir: &quot;.&quot;,
    ignoreI18nFileRules: [],
    i18nFileRules: [&quot;!(node_modules|config|statsvnTmp)/**/*.+(js|vue)&quot;],
    ignorePreReg: [
      /t\\s*\\([\\s\\n]*$/,
      /tl\\s*\\([\\s\\n]*$/,
      /console\\.(?:log|error|warn|info|debug)\\s*\\(\\s*$/,
      /\\/\\/\\s*$/,
      new RegExp(&quot;//.+&quot;),
      new RegExp(&quot;i18n-disabled.+&quot;),
    ],
    ignoreText: [&quot;^[\\\\u4e00-\\\\u9fa5a-zA-Z0-9“._=,&#39;:;*#！”-]+$&quot;],
    // js相关文件需要引入的国际化文件
    i18nImportForJs: &quot;&quot;,
    // js相关文件需要使用国际化方法
    jsI18nFuncName: &quot;$i18n.$t&quot;,
    // vue相关文件需要使用的国际化方法
    vueI18nFuncName: &quot;$t&quot;,
  },
  zhCheck: {
    cwd: &quot;.&quot;,
    // 根目录，国际文本所在的根目录
    rootDir: &quot;.&quot;,
    ignoreI18nFileRules: [],
    i18nFileRules: [&quot;!(node_modules|config|statsvnTmp)/**/*.+(vue|js)&quot;],
    // 反引号中需要忽略的文本规则，可以是正则或者字符串
    ignoreTextInQuoteRules: [/t\\(/],
  },
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="先检查是否存在不合理的代码实现" tabindex="-1"><a class="header-anchor" href="#先检查是否存在不合理的代码实现" aria-hidden="true">#</a> 先检查是否存在不合理的代码实现</h3><p><code>npm run i18n-check</code></p><h3 id="再执行自动对词条包裹翻译函数的命令" tabindex="-1"><a class="header-anchor" href="#再执行自动对词条包裹翻译函数的命令" aria-hidden="true">#</a> 再执行自动对词条包裹翻译函数的命令</h3><p><code>npm run i18n-wrap</code></p><h3 id="最后把这些被翻译函数包裹的词条提取到-json-文件里" tabindex="-1"><a class="header-anchor" href="#最后把这些被翻译函数包裹的词条提取到-json-文件里" aria-hidden="true">#</a> 最后把这些被翻译函数包裹的词条提取到 json 文件里</h3><p><code>npm run i18n</code></p><hr><p>这份脚本很通用化，根据各自配置规则，可以适应到各种项目里面，实在不行，代码也是开源的，拉下来修修改改得了</p><h2 id="扩展" tabindex="-1"><a class="header-anchor" href="#扩展" aria-hidden="true">#</a> 扩展</h2><p>我们团队的翻译不是机翻，而是有专门的翻译团队进行翻译，因此提取完 json 词条后，还需要用 excel 跟翻译团队打交道</p><p>所以可以来扩展下几个脚本</p><h3 id="提取未翻译词条到-excel-文件中" tabindex="-1"><a class="header-anchor" href="#提取未翻译词条到-excel-文件中" aria-hidden="true">#</a> 提取未翻译词条到 excel 文件中</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>/**
 * 抽取未翻译的词条到excel文件中
 */
const map = require(&quot;map-stream&quot;);
const path = require(&quot;path&quot;);
const vfs = require(&quot;vinyl-fs&quot;);
const XLSX = require(&quot;xlsx&quot;);

const ROOT_DIR = path.resolve(&quot;./&quot;);
const fileRules = [
  &quot;**/*/i18n/en.json&quot;,
  // &quot;**/eweb-setting-planningDeployment/i18n/en.json&quot;,
];

const writeExcel = (arr, name = &quot;未翻译词条&quot;) =&gt; {
  const sheet_data = arr.map((v) =&gt; {
    return {
      中文: v,
      English: &quot;&quot;,
    };
  });
  const new_sheet = XLSX.utils.json_to_sheet(sheet_data);
  // // 创新一个新的excel对象，就是workbook
  const new_workbook = XLSX.utils.book_new();
  // // 将表的内容写入workbook
  XLSX.utils.book_append_sheet(new_workbook, new_sheet, &quot;sheet1&quot;);
  XLSX.writeFile(new_workbook, \`\${name}.xlsx\`);
};

function run() {
  const zhList = [];
  console.log(&quot;================================&gt;start&quot;, ROOT_DIR);
  vfs
    .src(
      fileRules.map((item) =&gt; path.resolve(ROOT_DIR, item)),
      {
        ignore: [&quot;node_modules/**/*&quot;, &quot;statsvnTmp/**/*&quot;],
      }
    )
    .pipe(
      map((file, cb) =&gt; {
        console.log(&quot;处理文件 =========================&gt;&quot;, file.path);

        let fileContent = file.contents.toString();
        fileContent = JSON.parse(fileContent);
        Object.keys(fileContent).map((zh) =&gt; {
          if (zh.match(/[\\u4E00-\\u9FFF]/)) {
            if (zh === fileContent[zh]) {
              // 未翻译
              zhList.push(zh);
            }
          }
        });
        cb();
      })
    )
    .on(&quot;end&quot;, () =&gt; {
      const uniZh = Array.from(new Set(zhList));
      writeExcel(uniZh);
      console.log(&quot;未翻译词条数量：&quot;, uniZh.length);
      console.log(
        &quot;================================&gt;end&quot;,
        &quot;根目录下生成 excle 文件&quot;
      );
    });
}

run();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="将-excel-中的词条回填到-json-文件中" tabindex="-1"><a class="header-anchor" href="#将-excel-中的词条回填到-json-文件中" aria-hidden="true">#</a> 将 excel 中的词条回填到 json 文件中</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>/**
 * 将翻译后的内容替换到en.json文件中
 */
const map = require(&quot;map-stream&quot;);
const path = require(&quot;path&quot;);
const vfs = require(&quot;vinyl-fs&quot;);
const fs = require(&quot;fs&quot;);
const XLSX = require(&quot;xlsx&quot;);

const ROOT_DIR = path.resolve(&quot;./&quot;);
const fileRules = [&quot;**/*/i18n/en.json&quot;];
// 文件名称 默认名称 resource.json
const fileName = &quot;resource&quot;;
const fileJsonName = fileName + &quot;.json&quot;;
const fileXlsName = fileName + &quot;.xlsx&quot;;

const excelReader = (exlcePathArray = []) =&gt; {
  if (!Array.isArray(exlcePathArray)) {
    exlcePathArray = [exlcePathArray];
  }
  const obj = {};
  for (const i in exlcePathArray) {
    if (Object.hasOwnProperty.call(exlcePathArray, i)) {
      const excleFilePath = exlcePathArray[i];
      console.log(&quot;读取excle &quot; + excleFilePath);
      const workbook = XLSX.readFileSync(excleFilePath, {
        type: &quot;binary&quot;,
      });
      for (const sheet in workbook.Sheets) {
        const dataArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        obj[sheet] = dataArray;
      }
    }
  }
  return obj;
};

// 如果未找到 resource.json 查找 excel文件
if (!fs.existsSync(path.resolve(ROOT_DIR, fileJsonName))) {
  // 判断resource.excel是否存在
  if (fs.existsSync(path.resolve(ROOT_DIR, fileXlsName))) {
    let fileObj = excelReader(path.resolve(ROOT_DIR, fileXlsName));
    let dataObj = {};
    if (fileObj.sheet1) {
      // 中文列存在 例子： {&quot;中文&quot;:&quot;下载中...&quot;,&quot;English&quot;:&quot;down…&quot;}
      for (let i = 0; i &lt; fileObj.sheet1.length; i++) {
        let itemZhKey = fileObj.sheet1[i][&quot;中文&quot;];
        let itemEnKey = fileObj.sheet1[i][&quot;English&quot;];
        if (itemZhKey &amp;&amp; itemEnKey) {
          dataObj[itemZhKey] = itemEnKey;
        }
      }
    }
    // 获取sheet1的内容
    const data = JSON.stringify(dataObj);
    try {
      fs.writeFileSync(path.resolve(ROOT_DIR, fileJsonName), data);
    } catch (error) {
      console.log(&quot;生成文件 resource.xlsx 异常&quot;);
      throw error;
    }
  } else {
    console.log(&quot;不存在文件 resource.xlsx&quot;);
    throw new Error(&quot;不存在文件 resource.xlsx&quot;);
  }
}

const originResource = require(path.resolve(ROOT_DIR, fileJsonName));
let resource = Object.assign({}, originResource);
Object.keys(originResource).map((key) =&gt; {
  resource[\`\${key}：\`] = \`\${originResource[key]}：\`;
  resource[\`\${key}:\`] = \`\${originResource[key]}:\`;
  resource[\`\${key}）\`] = \`\${originResource[key]}）\`;
  resource[\`\${key})\`] = \`\${originResource[key]})\`;
  resource[\`\${key} \`] = \`\${originResource[key]} \`;
  resource[\` \${key}\`] = \` \${originResource[key]}\`;
  resource[\`(\${key}\`] = \`(\${originResource[key]}\`;
  resource[\`（\${key}\`] = \`（\${originResource[key]}\`;
  resource[\` \${key} \`] = \` \${originResource[key]} \`;
});

function run() {
  console.log(&quot;================================&gt;start&quot;, ROOT_DIR);
  let failedCount = 0;
  let successCount = 0;
  let failedZhs = [];
  vfs
    .src(
      fileRules.map((item) =&gt; path.resolve(ROOT_DIR, item)),
      {
        ignore: [&quot;node_modules/**/*&quot;, &quot;statsvnTmp/**/*&quot;],
      }
    )
    .pipe(
      map((file, cb) =&gt; {
        console.log(&quot;处理文件 =========================&gt;&quot;, file.path);

        let fileContent = file.contents.toString();
        fileContent = JSON.parse(fileContent);
        let hasChange = false;
        Object.keys(fileContent).map((zh) =&gt; {
          if (zh.match(/[\\u4E00-\\u9FFF]/)) {
            if (zh === fileContent[zh]) {
              // 未翻译
              if (resource[zh] &amp;&amp; resource[zh] !== zh) {
                hasChange = true;
                fileContent[zh] = resource[zh];
                successCount++;
              } else {
                failedCount++;
                failedZhs.push(zh);
              }
            }
          }
        });
        if (hasChange) {
          fs.writeFileSync(
            file.path,
            JSON.stringify(fileContent, &quot; &quot;, 2) + &quot;\\n&quot;
          );
        }
        cb();
      })
    )
    .on(&quot;end&quot;, () =&gt; {
      fs.writeFileSync(
        &quot;unHandle.json&quot;,
        JSON.stringify(failedZhs, &quot; &quot;, 2) + &quot;\\n&quot;
      );
      console.log(&quot;本次翻译成功词条数量：&quot;, successCount);
      console.log(&quot;还剩余未翻译词条数量：&quot;, failedCount);
      console.log(&quot;================================&gt;end&quot;);
    });
}

run();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,53);function x(j,y){const i=d("ExternalLinkIcon");return v(),r("div",null,[m,e("p",null,[e("a",b,[n("【Github：vue-viewer-editor/vve-i18n-cli】"),s(i)])]),h,q,p,e("p",null,[n("但是，国际化其实不只有词条相关的工作，至于还有哪些工作，我之前发表过一篇"),e("a",f,[n("《项目国际化的难点痛点是什么》"),s(i)]),n("里面吐槽得很清晰了")]),g])}const k=l(t,[["render",x],["__file","index.html.vue"]]);export{k as default};
