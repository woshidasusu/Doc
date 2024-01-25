import{_ as i,r as s,o as l,c as d,a as e,b as t,e as o,d as r}from"./app-PjuKeMiB.js";const a={},u=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),t(" 声明")],-1),c=e("p",null,"本系列文章内容梳理自以下来源：",-1),p={href:"https://www.angular.cn/docs",target:"_blank",rel:"noopener noreferrer"},v=r(`<p>官方的教程，其实已经很详细且易懂，这里再次梳理的目的在于复习和巩固相关知识点，刚开始接触学习 Angular 的还是建议以官网为主。</p><p>因为这系列文章，更多的会带有我个人的一些理解和解读，由于目前我也才刚开始接触 Angular 不久，在该阶段的一些理解并不一定是正确的，担心会有所误导，所以还是以官网为主。</p><h1 id="正文-angular-cli-命令" tabindex="-1"><a class="header-anchor" href="#正文-angular-cli-命令" aria-hidden="true">#</a> 正文- Angular-CLI 命令</h1><p>Angular 的项目其实相比老旧的前端项目模式或者是 Vue 的项目来说，都会比较重一点，因为它包括了： 模块 @NgModel， 组件 @Component， 指令 @Directive 等各种各样的东西，而每一种类型的 ts 文件，都需要有一些元数据的配置项。</p><p>这就导致了，如果是手工创建 ts 文件，需要自己编写很多重复代码，因此，可以借助 Angular-CLI 命令来创建这些文件，自动生成所需的这些重复代码。</p><p>而且，不仅在创建文件方面，在对项目的编译、打包等各种操作中也需要借助 Angular-CLI。</p><p>所以，日常开发中，不管是借助 WebStrom 的图形操作，还是直接自己使用命令方式，都需要跟 Angular-CLI 打交道，了解一些基本的配置和命令也是有好处的。</p><p>安装的方式就不讲了，要么直接使用 WebStrom 内置的，要么借助 npm 下载一个，要么通过 WebStrom 创建的 Angular 项目的 package.json 中就会自动配置一个 cli 依赖库。</p><h3 id="概览" tabindex="-1"><a class="header-anchor" href="#概览" aria-hidden="true">#</a> 概览</h3><p>命令格式：ng commandNameOrAlias arg [optionalArg] [options]</p><p>也就是 ng 之后带相应命令或命令的别名，接着带命令所需的参数，如果有多个参数就紧接着，最后是一些选项配置，选项的格式都加 <code>--</code> 前缀，如 <code>--spec=false</code></p><p>示例：ng g component --flat --spec=false</p><p>g 是 generate 命令的别名，component 是 g 命令的参数，表示要创建组件，--flat 和 --spec 是选项配置，具体意思后面说。</p><p>Angular-CLI 大体上两种类型的命令，一是创建或修改文件，二是类似运行某个脚本来编译、构建项目。</p><p>比如创建项目生成初始骨架的命令、创建组件、指令、服务这类文件命令；</p><p>或者是执行 build 编译命令，或者是 server 构建命令等等。</p><p>以下是概览，粗体字是我较为常接触的：</p><table><thead><tr><th style="text-align:center;">命令</th><th style="text-align:center;">别名</th><th style="text-align:center;">说明</th></tr></thead><tbody><tr><td style="text-align:center;"><strong>generate</strong></td><td style="text-align:center;"><strong>g</strong></td><td style="text-align:center;">创建相应的文件，如组件、指令、管道、服务、模块、路由、实体类等</td></tr><tr><td style="text-align:center;"><strong>build</strong></td><td style="text-align:center;"><strong>b</strong></td><td style="text-align:center;">编译项目，并输出最后的文件到指定目录，可以配置很多参数来达到各种效果，比如实时更新等目的</td></tr><tr><td style="text-align:center;"><strong>server</strong></td><td style="text-align:center;"><strong>s</strong></td><td style="text-align:center;">编译项目，并让它运行起来，且默认支持实时更新修改</td></tr><tr><td style="text-align:center;">new</td><td style="text-align:center;">n</td><td style="text-align:center;">创建新项目，生成项目初始骨架，默认包括根模块、根视图，还有基本的各种配置文件</td></tr><tr><td style="text-align:center;">e2e</td><td style="text-align:center;">e</td><td style="text-align:center;">编译并运行项目，跑起来后，运行 e2e 测试</td></tr><tr><td style="text-align:center;">lint</td><td style="text-align:center;">l</td><td style="text-align:center;">对项目进行 lint 检查</td></tr><tr><td style="text-align:center;">test</td><td style="text-align:center;">t</td><td style="text-align:center;">运行单元测试</td></tr><tr><td style="text-align:center;">help</td><td style="text-align:center;"></td><td style="text-align:center;">查看命令的帮助信息</td></tr><tr><td style="text-align:center;">...</td><td style="text-align:center;">...</td><td style="text-align:center;">还有一些没用过，也不大清楚的命令，后续再补充</td></tr></tbody></table><h3 id="常见命令" tabindex="-1"><a class="header-anchor" href="#常见命令" aria-hidden="true">#</a> 常见命令</h3><p>其实，这么多命令中，我最常使用的，就只有 <code>ng g</code> 命令，也就是 generate 命令，用来生成各种类型的文件代码，比如生成组件、生成服务等。</p><p>因为项目开发过程中，就是在编写组件，编写服务，而这些文件又都需要一些元数据配置，自己创建 ts 文件再去写那么代码有些繁琐，借助命令比较方便。</p><p>还有，运行项目时，会使用 build 或 server 命令。</p><p>所以，下面就只介绍这三个命令，其他命令，等到后续有接触，深入了解后再补充。</p><h4 id="ng-g-component" tabindex="-1"><a class="header-anchor" href="#ng-g-component" aria-hidden="true">#</a> ng g component</h4><p><code>ng g component xxx</code> 是用来创建组件的，直接使用该命令，会默认在当前目录下创建一个 xxx 文件夹，并在内部创建以下几个文件：</p><ul><li>xxx.component.css</li><li>xxx.component.html</li><li>xxx.component.spec.ts</li><li>xxx.component.ts</li></ul><p>每个文件内都会自动生成一些所需的代码，另外，还会在当前目录所属的模块文件中，将该 xxxComponent 组件声明在相应的 declarations 列表中。</p><p>以上是命令的默认行为，如果要改变这个默认行为，有两种方式，一是使用命令时携带一些选项配置，二是直接修改 angular.json 配置文件来替换掉默认行为。</p><p>先介绍第一种方式，使用命令时，加上一些选项配置：</p><table><thead><tr><th>选项配置</th><th>说明</th></tr></thead><tbody><tr><td><strong>--export=true|false</strong></td><td>生成的组件在对应的模块文件中，是否自动在 exports 列表中声明该组件好对外公开，默认值 false。</td></tr><tr><td><strong>--flat=true|false</strong></td><td>当为 true 时，生成的组件不自动创建 xxx 的文件夹，直接在当前目录下创建那几份文件，默认值 false。</td></tr><tr><td><strong>--spec=true|false</strong></td><td>当为 false 时，不自动创建 .spec.ts 文件，默认值为 true。</td></tr><tr><td><strong>--skipTests=true|false</strong></td><td>当为 true 时，不自动创建 .spec.ts 文件，默认值 false。该选项配置是新版才有，旧版就使用 --spec 配置。</td></tr><tr><td><strong>--styleext=css|scss|sass|less|styl</strong></td><td>设置组件是否使用预处理器，旧版接口</td></tr><tr><td><strong>--style=css|scss|sass|less|styl</strong></td><td>设置组件是否使用预处理器，新版接口</td></tr><tr><td><strong>--entryComponent=true|false</strong></td><td>当为 true 时，生成的组件自动在其对应的模块内的 entryComponents 列表中声明，默认 false。</td></tr><tr><td><strong>--inlineStyle=true|false</strong></td><td>当为 true 时，组件使用内联的 style，不创建对应的 css 文件，默认 false。</td></tr><tr><td><strong>--inlineTemplate=true|false</strong></td><td>当为 true 时，组件使用内联的模板，不创建对应的 html 文件，默认 false。</td></tr><tr><td>--lintFix=true|false</td><td>当为 true 时，组件创建后，自己进行 lintFix 操作，默认 false。</td></tr><tr><td>--module=module</td><td>指定组件归属的模块，默认当前目录所属的模块。</td></tr><tr><td>--prefix=prefix</td><td>指定组件 selector 取值的前缀，默认 app。</td></tr><tr><td>--project=project</td><td>指定组件归属的 project。</td></tr><tr><td>--selector=selector</td><td>指定组件的 selector 名。</td></tr><tr><td>--skipImport=true|false</td><td>当为 true，生成的组件不在对应的模块中声明任何信息，默认 false。</td></tr><tr><td>--changeDetection=Default|OnPush</td><td>设置改变组件的检测策略，默认 Default。</td></tr></tbody></table><p>以上，是使用 ng g component 命令时，可以携带的一些选项配置，来修改默认的行为，其中，如果选项配置为 true，那么 value 值可以省略，如 <code>--flat=true</code> 可以简写成 <code>--flat</code>。</p><p>比如：<code>ng g component xxx --flat --inlineStyle --inlineTemplate --spec=false --export</code></p><p>另外，其实这些选项配置中，除了前面几项可能比较常用外，其他的我基本都还没怎么接触过。</p><p>下面，讲讲第二种方式，修改 angular.json 配置文件来修改默认行为：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-644a7544a3b0e38f.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>也就是在 projects 里选择当前项目，然后再其 schematics 下进行配置，至于 <code>@schematics/angular:component</code> 这串怎么来的，可以去开头第一行所指的那份 schema.json 文件中查找。</p><p>其实，这份 schema.json 文件，就是 Angular-CLI 的默认配置，当忘记都有哪些命令或参数，除了可以借助 help 命令或到官网查阅外，也可以到这份文件中查阅。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-cbbce632792906e2.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>除了组件外，也还有指令、模块等命令的默认配置，可以看下其中一项默认配置：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>{
    &quot;@schematics/angular:component&quot;: {
        &quot;type&quot;: &quot;object&quot;,
        &quot;properties&quot;: {
            &quot;changeDetection&quot;: {
                &quot;description&quot;: &quot;Specifies the change detection strategy.&quot;,
                &quot;enum&quot;: [
                    &quot;Default&quot;,
                    &quot;OnPush&quot;
                ],
                &quot;type&quot;: &quot;string&quot;,
                &quot;default&quot;: &quot;Default&quot;,
                &quot;alias&quot;: &quot;c&quot;
            },
            &quot;entryComponent&quot;: {
                &quot;type&quot;: &quot;boolean&quot;,
                &quot;default&quot;: false,
                &quot;description&quot;: &quot;Specifies if the component is an entry component of declaring module.&quot;
            },
            &quot;export&quot;: {
                &quot;type&quot;: &quot;boolean&quot;,
                &quot;default&quot;: false,
                &quot;description&quot;: &quot;Specifies if declaring module exports the component.&quot;
            },
            &quot;flat&quot;: {
                &quot;type&quot;: &quot;boolean&quot;,
                &quot;description&quot;: &quot;Flag to indicate if a directory is created.&quot;,
                &quot;default&quot;: false
            },
            &quot;inlineStyle&quot;: {
                &quot;description&quot;: &quot;Specifies if the style will be in the ts file.&quot;,
                &quot;type&quot;: &quot;boolean&quot;,
                &quot;default&quot;: false,
                &quot;alias&quot;: &quot;s&quot;
            },
            &quot;inlineTemplate&quot;: {
                &quot;description&quot;: &quot;Specifies if the template will be in the ts file.&quot;,
                &quot;type&quot;: &quot;boolean&quot;,
                &quot;default&quot;: false,
                &quot;alias&quot;: &quot;t&quot;
            },
            &quot;module&quot;: {
                &quot;type&quot;: &quot;string&quot;,
                &quot;description&quot;: &quot;Allows specification of the declaring module.&quot;,
                &quot;alias&quot;: &quot;m&quot;
            },
            &quot;prefix&quot;: {
                &quot;type&quot;: &quot;string&quot;,
                &quot;format&quot;: &quot;html-selector&quot;,
                &quot;description&quot;: &quot;The prefix to apply to generated selectors.&quot;,
                &quot;alias&quot;: &quot;p&quot;
            },
            &quot;selector&quot;: {
                &quot;type&quot;: &quot;string&quot;,
                &quot;format&quot;: &quot;html-selector&quot;,
                &quot;description&quot;: &quot;The selector to use for the component.&quot;
            },
            &quot;skipImport&quot;: {
                &quot;type&quot;: &quot;boolean&quot;,
                &quot;description&quot;: &quot;Flag to skip the module import.&quot;,
                &quot;default&quot;: false
            },
            &quot;spec&quot;: {
                &quot;type&quot;: &quot;boolean&quot;,
                &quot;description&quot;: &quot;Specifies if a spec file is generated.&quot;,
                &quot;default&quot;: true
            },
            &quot;styleext&quot;: {
                &quot;description&quot;: &quot;The file extension to be used for style files.&quot;,
                &quot;type&quot;: &quot;string&quot;,
                &quot;default&quot;: &quot;css&quot;
            },
            &quot;viewEncapsulation&quot;: {
                &quot;description&quot;: &quot;Specifies the view encapsulation strategy.&quot;,
                &quot;enum&quot;: [
                    &quot;Emulated&quot;,
                    &quot;Native&quot;,
                    &quot;None&quot;,
                    &quot;ShadowDom&quot;
                ],
                &quot;type&quot;: &quot;string&quot;,
                &quot;alias&quot;: &quot;v&quot;
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，在官网中看到的关于 component 的各个选项配置的信息，其实在这份文件中也全列出来了，每一项配置的值类型，描述，默认值都清清楚楚在文件中了。</p><h4 id="ng-g-directive" tabindex="-1"><a class="header-anchor" href="#ng-g-directive" aria-hidden="true">#</a> ng g directive</h4><p>这个是创建指令的命令，组件其实是指令的一种，所以，上面介绍的关于组件命令中的各种选项配置，在指令这里也基本都可以使用，这里不列举了，清楚相关默认文件来源后，不懂的，去翻阅下就可以了。</p><p>因为指令并没有对应的 Template 模板和 CSS 样式文件，所以，默认生成的文件中，只有 xxx.directive.ts 和 xxx.spec.ts 两份文件。</p><h4 id="ng-g-pipe" tabindex="-1"><a class="header-anchor" href="#ng-g-pipe" aria-hidden="true">#</a> ng g pipe</h4><p>这个是创建管道的命令，它支持的选项配置跟指令的命令基本一样。</p><p>所以，同样的，它生成的也只有两份文件，ts 文件和测试文件。</p><h4 id="ng-g-service" tabindex="-1"><a class="header-anchor" href="#ng-g-service" aria-hidden="true">#</a> ng g service</h4><p>这个是创建服务类的命令，支持的选项配置参考上面几种命令。</p><p>默认生成的有两份文件，ts 和 测试文件。</p><h4 id="ng-g-class-interface-enum" tabindex="-1"><a class="header-anchor" href="#ng-g-class-interface-enum" aria-hidden="true">#</a> ng g class/interface/enum</h4><p>创建实体类，接口，或枚举的命令，因为这些类型的文件，默认需要的代码模板并不多，即使不用命令创建，手动创建也行。</p><h4 id="ng-g-module" tabindex="-1"><a class="header-anchor" href="#ng-g-module" aria-hidden="true">#</a> ng g module</h4><p>创建一个模块，这个命令有几个比较常用的选项配置：</p><ul><li><strong>--flat=true|false</strong></li></ul><p>当为 true 时，在当前目录下创建指定的 xxx.module.ts 和 xxx-routing.module.ts 文件，默认 false，会自动创建 xxx 的文件夹。</p><ul><li><strong>--routing=true|false</strong></li></ul><p>当为 true 时，会自动创建对应的 routing 路由模块，默认 false。</p><ul><li><strong>--routingScope=Child|Root</strong></li></ul><p>创建路由模块时，配置项是 Child 还是 Root，默认 Child。</p><p>以上，是 <code>ng generate</code> 命令的常见用法，它还可以用来创建其他东西，但我常用的就这几种，而且，很多时候，都不是使用默认的行为，因此常常需要配置选项配置一起使用。</p><p>另外，为什么非得用 Angular-CLI 命令来创建文件，用 WebStrom 自己创建个 ts 文件不行吗？</p><p>借助 CLI 工具其实就是为了高效开发，减少繁琐的处理，比如，创建一个 xxx.component.ts 文件：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>import { Component, OnInit } from &#39;@angular/core&#39;;

@Component({
  selector: &#39;app-cc&#39;,
  template: \`
    &lt;p&gt;
      cc works!
    &lt;/p&gt;
  \`,
  styles: []
})
export class CcComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面就是执行了 <code>ng g component cc --inlineStyle --inlineTemplate</code> 命令后创建的 cc.component.ts 文件的内容，如果不借助 CLI 工具，那么这些代码就需要自己手动去输入，即使复制黏贴也比较繁琐。</p><h4 id="ng-server" tabindex="-1"><a class="header-anchor" href="#ng-server" aria-hidden="true">#</a> ng server</h4><p>使用该命令，可以编译我们的项目，并在本地某个端口上运行该项目，默认还可以做到实时更新修改，不用重新编译，是本地调试项目常用的命令。</p><p>目前对该命令的使用，只接触到默认配置，还不清楚一些选项配置的适用场景，后续有了解再补充。</p><h4 id="ng-build" tabindex="-1"><a class="header-anchor" href="#ng-build" aria-hidden="true">#</a> ng build</h4><p>该命令用来将 Angular 项目编译、打包输出到指定目录下，最终输出的文件就是些 HTML，CSS，JavaScript 这些浏览器能够识别、运行的文件。</p><p>有时候，前端和后端的工作都由同一个人开发，此时在本地调试时，前端就没必要造假数据，可以直接将 Angular 项目编译输出到后端项目的容器中，直接在本地调试后端接口。</p><p>那么，这种时候就不能用 <code>ng server</code> 命令了，只能使用 <code>ng build</code> 命令，但该命令，默认只是编译项目，那么岂不是每次代码发生修改，都得重新跑一次 <code>ng build</code> 命令？当项目有些复杂时，岂不是需要浪费很多时间？</p><p>这种时候，就该来了解了解这个命令的一些选项配置了，经过配置，它也可以达到类似 <code>ng server</code> 命令一样自动检测文件变更并增量更新部署，提高开发效率。</p><table><thead><tr><th>选项配置</th><th>说明</th></tr></thead><tbody><tr><td><strong>--watch=true|false</strong></td><td>当为 true 时，会自动检测文件变更，并同步更新，默认 false</td></tr></tbody></table><p>还有其他配置项，没使用过，就用过这个，因为我们是直接前端后端一起做，后端用了 spring boot，所以 Angular 项目使用 <code>ng build</code> 命令编译输出到后端项目的容器中，后端跑起来，就可以直接在本地调试了。</p><h4 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h4>`,76);function g(m,q){const n=s("ExternalLinkIcon");return l(),d("div",null,[u,c,e("ul",null,[e("li",null,[e("a",p,[t("Angular 官方中文版教程"),o(n)])])]),v])}const h=i(a,[["render",g],["__file","Angular学习2-CLI命令.html.vue"]]);export{h as default};
