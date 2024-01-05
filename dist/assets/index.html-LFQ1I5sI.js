import{_ as n,o as i,c as e,d as s}from"./app-Zf-yBXw2.js";const l="/assets/check-9Y3GF9DK.png",d={},u=s('<h1 id="如何用-vscode-捞出还未国际化的中文词条" tabindex="-1"><a class="header-anchor" href="#如何用-vscode-捞出还未国际化的中文词条" aria-hidden="true">#</a> 如何用 vscode 捞出还未国际化的中文词条</h1><p>做国际化一个很头疼的坑就是，你不知道项目里到底还有哪些中文词条没有国际化处理</p><p>纯靠人工去检查不现实，也不靠谱，而且浪费资源</p><p>所以还是得通过脚本工具来检查，思路是：</p><ol><li>先保存好本地代码变更，准备好一个无文件变更的本地环境</li><li>再通过脚本把代码里的非展示性中文移除掉 <ul><li>注释里的中文、console 里的中文，已经国际化处理过的中文</li></ul></li><li>再用中文正则在 vscode 的全局搜索里匹配，捞出来的就是未国际化处理的中文词条</li><li>最后需要回退本地的更改，毕竟脚本是直接改动本地文件</li></ol><p>脚本仅仅是检查用，用完记得回退代码</p><h2 id="匹配中文词条的正则" tabindex="-1"><a class="header-anchor" href="#匹配中文词条的正则" aria-hidden="true">#</a> 匹配中文词条的正则</h2><ul><li>单个中文： <ul><li><code>[\\u4E00-\\u9FFF]</code></li></ul></li><li>连续中文： <ul><li><code>[\\u4E00-\\u9FFF]+</code></li></ul></li><li>掺杂了各种符号、字母的中文句子： <ul><li><code>[a-zA-Z0-9、：]*[\\u4E00-\\u9FFF]+[\\u4E00-\\u9FFF\\.\\-\\*。,，a-zA-Z0-9/()（）:：”“！？、%_【】《》＞~～ ]*</code></li><li>（这里不建议把 : ： - &#39; &quot; 这几个特殊符号也列到正则里，因为这些符号比较特殊，有的语法层面也支持，列进来反而会引出新问题，所以宁愿这种场景的句子被截成多断）</li></ul></li><li>最好再加上文件的排除： <ul><li><code>*.css,*.scss,*.less,*.json,*.bat,privacyProtocal.html,userProtocal.html,*.md,webpack**.js,*.txt,*.svg,*.properties,*.npmrc,vve-i18n-cli.config.js,baas,config,*.art,demo_index.html,*.sh,*.xml,*.java</code></li></ul></li></ul><p><img src="'+l+`" alt=""></p><h2 id="脚本" tabindex="-1"><a class="header-anchor" href="#脚本" aria-hidden="true">#</a> 脚本</h2><h3 id="移除非展示性中文的脚本" tabindex="-1"><a class="header-anchor" href="#移除非展示性中文的脚本" aria-hidden="true">#</a> 移除非展示性中文的脚本</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// index.js

#!/usr/bin/env node

/**
 * 用来移除掉指定项目里的以下几类场景的中文：
 * - 注释里的中文
 * - 被国际化全局函数包裹的中文 $t
 *
 * 这样子方便借助 vs code 的全局正则搜索中文功能，来快速 review 未国际化的中文
 * 正则： [\\u4E00-\\u9FA5]+
 */

&quot;use strict&quot;;
const program = require(&quot;commander&quot;);
const { loadConfig } = require(&quot;../configuration&quot;);
const core = require(&quot;./core&quot;);
const vfs = require(&quot;vinyl-fs&quot;);
const map = require(&quot;map-stream&quot;);
const path = require(&quot;path&quot;);
const fs = require(&quot;fs&quot;);

function commaSeparatedList(value, split = &quot;,&quot;) {
  return value.split(split).filter((item) =&gt; item);
}

program
  .version(require(&quot;../../package.json&quot;).version)
  .option(&quot;--cwd &lt;path&gt;&quot;, &quot;工作目录&quot;)
  .option(&quot;--root-dir &lt;path&gt;&quot;, &quot;国际文本所在的根目录&quot;)
  .option(
    &quot;--config &lt;path&gt;&quot;,
    &quot;配置文件的路径，没有配置，默认路径是在\${cwd}/vve-i18n-cli.config.js&quot;
  )
  .option(&quot;--no-config&quot;, &quot;是否取配置文件&quot;)
  .option(
    &quot;--i18n-file-rules &lt;items&gt;&quot;,
    &quot;匹配含有国际化文本的文件规则&quot;,
    commaSeparatedList
  )
  .option(
    &quot;--ignore-i18n-file-rules &lt;items&gt;&quot;,
    &quot;不匹配含有国际化文本的文件规则&quot;,
    commaSeparatedList
  )
  .parse(process.argv);

const config = {
  // 工作目录
  cwd: &quot;.&quot;,
  // 根目录，国际文本所在的根目录
  rootDir: &quot;src&quot;,
  // 配置文件的路径，没有配置，默认路径是在\${cwd}/vve-i18n-cli.config.js
  config: undefined,
  // 是否取配置文件
  noConfig: false,
  // 匹配含有国际化文本的文件规则
  i18nFileRules: [&quot;**/*.+(vue|js|html|htm)&quot;],
  // 不匹配含有国际化文本的文件规则
  ignoreI18nFileRules: [&quot;**/node_modules/**&quot;],
};

Object.assign(config, program);

const CONFIG_JS_FILENAME = &quot;vve-i18n-cli.config.js&quot;;

let absoluteCwd = path.resolve(config.cwd);

// 优先判断是否需要读取文件
if (!config.noConfig) {
  let configFilePath = path.join(absoluteCwd, CONFIG_JS_FILENAME);
  if (config.config) {
    configFilePath = path.resolve(config.config);
  }
  if (fs.existsSync(configFilePath)) {
    const conf = loadConfig(configFilePath);
    if (conf &amp;&amp; conf.options &amp;&amp; conf.options.zhCheck) {
      Object.assign(config, conf.options.zhCheck, program);
    }
  }
}

// 制定配置文件后，cwd在配置文件中定义，则cwd就需要重新获取
if (!program.cwd) {
  absoluteCwd = path.resolve(config.cwd);
}

const absoluteRootDir = path.resolve(absoluteCwd, config.rootDir);

function run() {
  console.log(&quot;================================&gt;start&quot;);
  vfs
    .src(
      config.i18nFileRules.map((item) =&gt; path.resolve(absoluteRootDir, item)),
      {
        ignore: config.ignoreI18nFileRules.map((item) =&gt;
          path.resolve(absoluteRootDir, item)
        ),
        dot: false,
      }
    )
    .pipe(
      map((file, cb) =&gt; {
        console.log(&quot;开始解析 =========================&gt;&quot;, file.path);
        const extname = path.extname(file.path);
        let fileContent = file.contents.toString();
        let newFileContent = fileContent;
        if (extname.toLowerCase() === &quot;.vue&quot;) {
          newFileContent = core.removeUnusedZhInVue(fileContent);
        } else if (extname.toLowerCase() === &quot;.js&quot;) {
          newFileContent = core.removeUnusedZhInJs(fileContent);
        } else if ([&quot;.html&quot;, &quot;.htm&quot;].includes(extname.toLowerCase())) {
          newFileContent = core.removeUnusedZhInHtml(fileContent);
        }
        if (newFileContent !== fileContent) {
          console.log(&quot;发现无用的中文，正在移除中...&quot;);
          fs.writeFileSync(file.path, newFileContent);
        }
        console.log(&quot;解析结束 =========================&gt;&quot;, file.path);
        cb();
      })
    )
    .on(&quot;end&quot;, () =&gt; {
      console.log(&quot;================================&gt;end&quot;);
    });
}

run();

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// core.js

// 包含中文
const zhReg = new RegExp(&quot;[\\\\u4E00-\\\\u9FFF]+&quot;, &quot;&quot;);

// 处理 vue 文件
function removeUnusedZhInVue(fileContent) {
  return removeUnusedZh(fileContent);
}
exports.removeUnusedZhInVue = removeUnusedZhInVue;

// 处理 js 文件
function removeUnusedZhInJs(fileContent) {
  return removeUnusedZh(fileContent);
}
exports.removeUnusedZhInJs = removeUnusedZhInJs;

// 处理 html 文件
// 处理 js 文件
function removeUnusedZhInHtml(fileContent) {
  return removeUnusedZh(fileContent);
}
exports.removeUnusedZhInHtml = removeUnusedZhInHtml;

function removeUnusedZh(fileContent) {
  const hasAnnotation = {
    &quot;/*&quot;: false,
    &quot;&lt;!--&quot;: false,
  };

  // 逐行处理
  fileContent = fileContent
    .split(&quot;\\n&quot;)
    .map((line) =&gt; {
      // 移除无用中文
      if (line.match(zhReg)) {
        const regs = [
          new RegExp(&quot;//(.*[\\\\u4E00-\\\\u9FFF]+)&quot;, &quot;&quot;), // 移除 // xx
          new RegExp(&quot;console.log\\\\([&#39;\\&quot;](.*[\\\\u4E00-\\\\u9FFF]+)&quot;, &quot;&quot;), // 移除 console.log(xxx)
          new RegExp(&quot;console.info\\\\([&#39;\\&quot;](.*[\\\\u4E00-\\\\u9FFF]+)&quot;, &quot;&quot;), // 移除 console.info(xxx)
          new RegExp(
            &quot;\\\\$t\\\\([ ]*[&#39;\\&quot;\`](.*?[\\\\u4E00-\\\\u9FFF]+.*?)[&#39;\\&quot;\`]\\\\)&quot;,
            &quot;&quot;
          ), // 移除 $t(&quot;xxx&quot;)
        ];
        regs.forEach((reg) =&gt; {
          let match = line.match(reg);
          while (match &amp;&amp; match[1]) {
            line = line.replace(match[1], &quot;&quot;);
            match = line.match(reg);
          }
        });
      }
      if (!hasAnnotation[&quot;/*&quot;] &amp;&amp; line.indexOf(&quot;/*&quot;) &gt; -1) {
        hasAnnotation[&quot;/*&quot;] = true;
      }
      if (!hasAnnotation[&quot;&lt;!--&quot;] &amp;&amp; line.indexOf(&quot;&lt;!--&quot;) &gt; -1) {
        hasAnnotation[&quot;&lt;!--&quot;] = true;
      }
      return line;
    })
    .join(&quot;\\n&quot;);

  if (hasAnnotation[&quot;/*&quot;]) {
    // 移除 /* xxx */
    const reg = new RegExp(&quot;/\\\\*([\\\\s\\\\S]*?)\\\\*/&quot;, &quot;g&quot;);
    fileContent = fileContent.replace(reg, function (match, key, index) {
      // console.log(&quot;[/**/] ==1 &gt;&quot;, { match, key, index });
      let newKey = key;
      while (newKey.match(zhReg)) {
        newKey = newKey.replace(zhReg, &quot;&quot;);
      }
      return match.replace(key, newKey);
    });
  }
  // 移除 &lt;!--  xxx --&gt;
  if (hasAnnotation[&quot;&lt;!--&quot;]) {
    const reg = new RegExp(&quot;&lt;!--([\\\\s\\\\S]*?)--&gt;&quot;, &quot;g&quot;);
    fileContent = fileContent.replace(reg, function (match, key, index) {
      let newKey = key;
      while (newKey.match(zhReg)) {
        newKey = newKey.replace(zhReg, &quot;&quot;);
      }
      return match.replace(key, newKey);
    });
  }
  return fileContent;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// configuration.js
const buildDebug = require(&quot;debug&quot;);
const path = require(&quot;path&quot;);

const debug = buildDebug(&quot;files:configuration&quot;);

function loadConfig(filepath) {
  try {
    const conf = readConfig(filepath);
    return conf;
  } catch (e) {
    debug(&quot;error&quot;, e);
    return null;
  }
}

function readConfig(filepath) {
  let options;
  try {
    const configModule = require(filepath);
    options =
      configModule &amp;&amp; configModule.__esModule
        ? configModule.default || undefined
        : configModule;
  } catch (err) {
    throw err;
  } finally {
  }
  return {
    filepath,
    dirname: path.dirname(filepath),
    options,
  };
}

module.exports = {
  loadConfig,
  readConfig,
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>{
  &quot;dependencies&quot;: {
    &quot;commander&quot;: &quot;^3.0.2&quot;,
    &quot;debug&quot;: &quot;^4.1.1&quot;,
    &quot;jsonfile&quot;: &quot;^5.0.0&quot;,
    &quot;lodash.uniq&quot;: &quot;^4.5.0&quot;,
    &quot;map-stream&quot;: &quot;0.0.7&quot;,
    &quot;pinyin-pro&quot;: &quot;^3.11.0&quot;,
    &quot;translation.js&quot;: &quot;^0.7.9&quot;,
    &quot;vinyl-fs&quot;: &quot;^3.0.3&quot;,
    &quot;xlsx&quot;: &quot;^0.18.5&quot;
  },
  &quot;devDependencies&quot;: {
    &quot;chai&quot;: &quot;^4.2.0&quot;,
    &quot;mocha&quot;: &quot;^6.2.1&quot;,
    &quot;nyc&quot;: &quot;^14.1.1&quot;,
    &quot;shelljs&quot;: &quot;^0.8.3&quot;,
    &quot;standard-version&quot;: &quot;^7.0.0&quot;
  },
  &quot;version&quot;: &quot;3.2.3&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// vve-i18n-cli.config.js
module.exports = {
  // 工作目录
  cwd: &quot;.&quot;,
  // 根目录，国际文本所在的根目录
  rootDir: &quot;demo&quot;,
  // 默认所有模块，如果有传module参数，就只处理某个模块
  // &#39;**/module-**/**/index.js&#39;
  moduleIndexRules: [&quot;*/pro.properties&quot;],
  // 匹配含有国际化文本的文件规则
  i18nFileRules: [&quot;**/*.+(vue|js)&quot;],
  // 国际化文本的正则表达式，正则中第一个捕获对象当做国际化文本
  i18nTextRules: [/(?:[\\$.])t\\([&#39;&quot;](.+?)[&#39;&quot;]/g],
  // 模块的国际化的json文件需要被保留下的key，即使这些组件在项目中没有被引用
  // key可以是一个字符串，正则，或者是函数
  keepKeyRules: [
    /^G\\/+/, // G/开头的会被保留
  ],
  ignoreKeyRules: [/^el/],
  // 生成的国际化资源包的输出目录
  outDir: &quot;i18n&quot;,
  // 生成的国际化的语言
  i18nLanguages: [
    &quot;zh&quot;, // 中文
    &quot;en&quot;, // 英文
  ],
  // 是否翻译
  translate: false,
  // 翻译的基础语言，默认是用中文翻译
  translateFromLang: &quot;zh&quot;,
  // 是否强制翻译，即已翻译修改的内容，也重新用翻译生成
  forceTranslate: false,
  // 翻译的语言
  translateLanguage: [&quot;zh&quot;, &quot;en&quot;],
  // 模块下\${outDir}/index.js文件不存在才拷贝index.js
  copyIndex: true,
  // 是否强制拷贝最新index.js
  forceCopyIndex: false,
  // 国际化文本包裹相关
  zhWrap: {
    cwd: &quot;.&quot;,
    // 根目录，国际文本所在的根目录
    rootDir: &quot;.&quot;,
    i18nFileRules: [
      &quot;!(node_modules|config)/**/*.+(vue)&quot;,
      // &quot;base/components/login.vue&quot;,
      &quot;base/common/js/httpHandle.js&quot;,
    ],
    ignorePreReg: [
      /t\\s*\\(\\s*$/,
      /tl\\s*\\(\\s*$/,
      /console\\.(?:log|error|warn|info|debug)\\s*\\(\\s*$/,
      new RegExp(&quot;//.+&quot;),
    ],
    // js相关文件需要引入的国际化文件
    i18nImportForJs: &quot;import i18n from &#39;@inap_base/i18n/core&#39;&quot;,
    // js相关文件需要使用国际化方法
    jsI18nFuncName: &quot;i18n.t&quot;,
    // vue相关文件需要使用的国际化方法
    vueI18nFuncName: &quot;$t&quot;,
  },
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="硬替换脚本" tabindex="-1"><a class="header-anchor" href="#硬替换脚本" aria-hidden="true">#</a> 硬替换脚本</h3><p>具体查看 zh-i18n.zip</p>`,18),v=[u];function a(o,t){return i(),e("div",null,v)}const c=n(d,[["render",a],["__file","index.html.vue"]]);export{c as default};
