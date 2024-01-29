import{_ as l,r,o as a,c as s,a as e,b as n,e as o,d}from"./app-2pyCoCP5.js";const p={},t=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),n(" 声明")],-1),u=e("p",null,"本系列文章内容梳理自以下来源：",-1),c={href:"https://www.angular.cn/docs",target:"_blank",rel:"noopener noreferrer"},v=d(`<p>官方的教程，其实已经很详细且易懂，这里再次梳理的目的在于复习和巩固相关知识点，刚开始接触学习 Angular 的还是建议以官网为主。</p><p>因为这系列文章，更多的会带有我个人的一些理解和解读，由于目前我也才刚开始接触 Angular 不久，在该阶段的一些理解并不一定是正确的，担心会有所误导，所以还是以官网为主。</p><h1 id="正文-架构概览" tabindex="-1"><a class="header-anchor" href="#正文-架构概览" aria-hidden="true">#</a> 正文- 架构概览</h1><p>接触 Angular 大概一个月吧，期间写了个项目，趁现在稍微有点时间，来回顾梳理一下。</p><p>其实，如果前端网站并不是特别复杂，那么使用 Angular 无非也就是常跟几个重要的知识点打交道，在官网的核心知识的第一节中就将这些知识点罗列出来了，也就是：架构概览。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-1b6c19239aebba6d.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="Angular架构概览.png"></p><p>画了这个图来大概表示下 Angular 的架构概览，基本涉及到一些常见的重要的知识点了，比如：</p><ul><li>模块</li><li>路由</li><li>组件</li><li>模板</li><li>服务</li><li>指令</li><li>管道</li></ul><p>不同的类型，文件名通常会都按照一定的规范来命名，以便直接看出该文件的角色。</p><p>当然，文件命名只是给开发人员来方便维护、辨别，对于 Angular 来说，这些都是一份份的 ts 文件代码，所以，都需要在相对应的文件中加上一些装饰器比如：@Directive，@Pipe，@Component，@NgModel 等这些，才能够让 Angular 识别出该文件的角色、用途。</p><p>基本上，用 Angular 做一个简单的前端项目，就是跟上面这些打交道，理清它们各自的用途及用法，还有之间的联系，基本上，就可以上手进行一些开发了。</p><p>当然，像在 Service 服务中，还会有异步编程、HttpClient 网络编程的相关知识点；</p><p>在 Component 组件中，也还会有表单、动画相关的编程知识点，这些都是需要进一步去深入学习研究，但从总体架构上来看，就是要先了解以上这些知识点了。</p><h3 id="模块" tabindex="-1"><a class="header-anchor" href="#模块" aria-hidden="true">#</a> 模块</h3><p>一个 Angular 项目，至少会有一个模块，即最少都会有一份用 @NgModel 声明的 ts 文件，表明该文件作为模块角色，来管理其他角色。</p><p>其他角色包括：组件、指令、管道、服务等等，这些角色必须在模块文件中声明了，才能够被该模块内的其他角色所使用，而且同一个组件、指令、管道不允许同时在多个模块中进行声明，只能通过模块 exports 给其他模块使用。</p><p>Angular 里的模块，并不等同于 Android 项目中的模块概念。</p><p>在 Android 项目代码中，可能我们会根据功能来进行模块的划分，但这个模块仅仅是抽象上的概念，也就是建个包，把代码都集中管理。</p><p>而 Angular 里的模块，不仅可以在项目结构上集中管理同一个模块的代码文件，还可以为模块内的代码提供一个运行的上下文。</p><p>意思就是说，不同模块在运行期间互不影响，就好像各自运行在各自的沙箱容器中一样。举个简单的例子，在不同模块中声明相同的变量名，或相同的 css 的类选择器，它们之间并不会起冲突。</p><p>当然，模块之间可以有交互，模块可以依赖于另一模块，模块内的可以共享资源等等，所以，NgModel 中有许多需要配置的声明项，比如：</p><ul><li>declarations：声明属于本模块内的组件、指令、管道</li><li>providers：声明属于本模块内的服务</li><li>imports：声明本模块所引用的其他模块，通常是 imports 其他模块在 exports 中声明的项</li><li>exports：声明本模块对外公开的组件、指令、管道等，在这里公开的项才可以被其他模块所使用</li><li>bootstrap：只有根模块才需要配置，用来设置应用主视图，Angular 应用启动后，这里就是入口，类似于 Android 中的入口 Activity</li><li>还有其他一些可选配置，比如应用主题，或者动态的组件声明等等</li></ul><p>在 Angular 中，大多数的模式就是，一个根模块管理着很多功能模块，然后，每个模块管理自己模块内部所使用到的组件、指令、管道、服务、或者需要依赖于其他模块，如果该模块内部的这些角色，有些可以供其他模块使用，那么就需要对外暴露。</p><h3 id="路由" tabindex="-1"><a class="header-anchor" href="#路由" aria-hidden="true">#</a> 路由</h3><p>一个项目这么多模块，Angular 并不会一开始就把所有模块都加载，而是惰性加载，按需加载。</p><p>那么，什么时候会去加载呢？</p><p>就是等某个模块内部的组件被使用的时候会加载，而组件是什么时候会被使用的呢？</p><p>有两个时机，一是组件被直接调用；二是触发了路由去加载；</p><p>路由通常的配置方式是用一个 @NgModel 声明的模块，但只用其中两项配置：imports 和 exports，imports 用来导入当前模块所有组件与 url 的映射表，而 exports 用来将这些映射表信息暴露，以供相对应的模块去引入使用。</p><p>当然，你不想抽离路由配置，直接将其配置在对应模块的 imports 内也可以，抽离的话，相对独立，可维护。</p><p>区别于传统的前端网页的跳转方式，Angular 项目是一个单页应用，所谓的单页应用就是说只有一个页面，所有页面的跳转，其实是将当前页面的显示内容进行替换，页面仍旧只有一个，并不会打开新的页面。</p><p>而页面的跳转，通常有以下几种场景：</p><ul><li>用户输入 url 进行跳转</li><li>用户点击交互按钮进行跳转</li><li>用户操作前进或后退进行跳转</li></ul><p>这些场景，路由的工作机制都能够很好的支持。</p><p>如果网页很简单，只有一个首页，并不存在页面跳转场景，那么可以不用配置路由，只需要在 index.html 中配置根视图，以及在根模块的 bootstrap 中配置根视图组件即可。</p><p>但如果项目划分成了多个功能模块，那么应该交由每个模块管理自己的路由表，而后选择一个上层模块，来统一关联各个模块路由，有两种方式：一是在上层模块的 imports 内按照一定顺序来导入各个功能模块；但这种方式想要按照路由层级来查看路由表就比较麻烦，需要到各个模块内部去查看或者借助一些工具。</p><p>另一种方式是，在上层模块的路由表中使用 loadChildren 加载各个功能模块，然后各个功能模块默认路由都显示成空视图，各自内部再通过配置 children 的路由表方式来管理各个模块内部自己的路由表。</p><h3 id="组件与模板" tabindex="-1"><a class="header-anchor" href="#组件与模板" aria-hidden="true">#</a> 组件与模板</h3><p>在 Angular 中，最常接触的应该就是组件了。</p><p>我是这么理解的，组件可以是你在界面上看到的任何东西，可以是一个页面，可以是页面上的一个按钮。</p><p>而对于浏览器解析并呈现前端页面时，Html、CSS、JavaScript 这三分文件通常都是需要的，而 Angular 是使用了 TypeScript，所以一个组件，其实就包括了：Html，CSS，TypeScript。</p><p>在 Angular 中，可以说，是以组件为单位来组成页面的，组件是核心，因为 Angular 提供的功能基本都是用来为组件服务的。</p><p>以上，是我的理解。</p><p>但要注意，官网教程中，很多地方的组件描述，更多时候是倾向于表示 TypeScript 的那份文件，因为对于组件来说，TypeScript 可以说是它的核心，CSS 只是样式文件，Html 更类似于模板存在。</p><p>所以这里将组件和模板放在一起讲，因为就像开头那张图一样，组件是一份 TypeScript 文件，在该文件中，定义了这个组件的模板（template）来源和 CSS 样式来源。</p><p>模板提供了该组件的呈现结构，而 TypeScript 里定义了组件的数据来源及交互行为，它们两一起组织成一个视图呈现给用户。</p><p>既然，这份 TypeScript 的组件文件和模板文件需要共同合作，那么它们之间就少不了交互，所以就涉及到很多所谓的模板语法，也就是所谓的组件和模板之间的交互方式。</p><p>比如，当要往模板中嵌入 TypeScript 中的变量数据时，可以使用 <code>{{value}}</code> 这种语法形式，同样的，还有模板中标签的属性绑定，事件回调注册的交互方式的语法。</p><p>总之，Angular 支持双向数据绑定，是一种以数据驱动的思想来让页面进行交互刷新的方式，区别于传统的前端模式。在以往，如果需要动态的更新 DOM 上的信息时，需要先获取到相对应的元素实例对象，然后调用相应的 DOM API 来操纵 DOM；</p><p>而使用 Angular 的话，可以直接在模板的相应元素中，将某个属性与 TypeScript 文件中某个变量直接进行绑定，后续这个变量值变化时，Angular 会自动去更新相应 DOM 的属性，也就是说，原本那些操纵 DOM 的代码，Angular 帮我们做了，我们不用再自己去处理了。</p><p>另外，注意，以上出现的 TypeScript 的描述，你可以理解成官网中的组件，我之所以不想用组件的方式来进行描述，是因为，我觉得，组件是一个整体，它本身就包括了 TypeScript 文件和模板文件，所以官网中说的组件和模板的交互，我觉得，换成组件中的 TypeScript 文件与模板文件的交互更为适合。</p><p>当然，这只是我目前阶段的理解。</p><h3 id="服务" tabindex="-1"><a class="header-anchor" href="#服务" aria-hidden="true">#</a> 服务</h3><p>服务是一个广义上的概念，通常用来处理那些跟 UI 交互无关的事情，比如网络请求的工作等。</p><p>所以它也是为组件服务，而且 Angular 有一套依赖注入机制，也就是说，组件只需要告诉 Angular，它需要哪些服务，至于这些服务的实例是什么时候创建，交给谁去管理等这些组件内部都不用自己去处理了。</p><p>Angular 会自动创建相关的服务实例，然后在组件适当的时候，将这个实例注入给组件去使用。</p><p>这种模式跟以前在 Android 端开发时有所区别，在 Android 端中，当需要业务层某个实例对象时，通常都需要自己内部去初始化，或者这个实例是个单例的话，也需要自己去实现单例。</p><p>但在 Angular 中，你可以借助它依赖注入的机制，来让 Angular 帮你去做这些依赖的对象的实例管理的事，如果需要一个全局的单例服务，那么可以将该服务声明成 root 即全局可用；如果需要一个模块内的单例，那么可以在该模块的 providers 中声明该服务；如果需要一个组件自己的实例对象，那么可以在组件的元数据块的 providers 中配置该服务。</p><p>总之，就是，跟 UI 交互无关的工作，可以抽到服务中去处理，而该服务实例的管理，交给 Angular 就可以了，组件只需要告诉 Angular 它需要哪种形式的服务即可。</p><p>那么，组件是怎么告诉 Angular 的呢？</p><p>同样在 Android 项目或者后端项目中，也有一些依赖注入框架，那些通常都是借助注解的方式来实现。</p><p>但在 Angular 中，不用这么麻烦，直接在组件的构造函数的参数中，声明某个服务类型的参数即可。</p><h3 id="指令" tabindex="-1"><a class="header-anchor" href="#指令" aria-hidden="true">#</a> 指令</h3><p>指令也是为组件服务的，但是，是在组件的模板文件中来使用。</p><p>因为组件的模板，其实就是一份 HTML 文件，基于 HTML 的标签之上，加上一些 Angular 的模板语法，而 Angular 在将这份 HTML 文件代码交给浏览器解析之前，会先自行解析一遍，去将模板中不属于 HTML 的那些语法解析出相应的行为。</p><p>而指令分为结构型指令和属性型指令，它们的区别，其实就在于，一个是改变 DOM 的结构，一个是改变 DOM 元素的样式。</p><p>所以说，指令的目的，其实就是简化一些操纵 DOM 的工作，比如你需要让某些按钮都具有统一的行为和样式，当被点击时先做什么，再做什么。</p><p>实现这个，你当然可以在 TypeScript 中去书写这些逻辑，但要应用到每个按钮上，就比较繁琐。</p><p>这个时候，就可以将这些工作都封装到指令内部，然后在每个按钮标签上加上该指令，Angular 在解析模板时，发现了这个指令，就会为每个按钮都加上这么一段程序逻辑。</p><p>我个人觉得，指令的功能，让我们处理一些相同的行为，可以更好的去封装，减少冗余和繁琐。</p><p>当然，上面举的场景，也可以自己封装个按钮组件，然后在其他模板中，不使用原生按钮，而使用封装后的按钮组件，也可以达到目的。</p><p>所以，组件其实也是指令的一种，但组件的实现方式会比较重，有时候，只需要封装一些简单的行为逻辑，就可以直接借助指令的方式封装。</p><p>指令的原理也很简单，在模板中某个元素标签上，添加上某个指令后，解析到这个指令时，会进入这个指令的相关工作，而指令内部，会获取到一个当前指令挂载的元素标签对象，既然都拿到这个对象了，那么，在指令内部想对这个元素做什么，都可以了。</p><p>指令还有另一个通途，通常用来扩展原有的功能，因为可能项目中，在模板里使用的组件或者 HTML 元素的标签因为种种原生无权或不方便进行修改，而又想在其基础上扩展一些功能，此时就可以利用指令来实现。</p><h3 id="管道" tabindex="-1"><a class="header-anchor" href="#管道" aria-hidden="true">#</a> 管道</h3><p>管道同样是为组件服务，也同样是在组件的模板文件中来使用。</p><p>它的用途，在于，将数据按照一定的规则进行转换，比如 Object 对象，转换成 json 格式数据，再比如，long 型的时间，转换成具体的时间日期等等。</p><p>Angular 中已经内置了一些管道，也可以自定义管道。</p><h3 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h3><p>大概了解了 Angular 的架构概览，接下去就来看看一个简单的 Angular 项目结构，以及各个文件、模块的用途，稍微讲一下。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-45fa3c8f2b84e458.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>这是用 WebStrom 创建一个 Angular 项目后，自动生成的简单架构。</p><p>在利用 Angular Cli 工具生成脚手架时，默认就已经生成了很多配置项，而且此时，项目已经是可以运行的，因为也自动生成了一个根模块和根视图，默认页面是 Angular 的欢迎界面。</p><p>挑几个来讲讲。</p><h4 id="angular-json" tabindex="-1"><a class="header-anchor" href="#angular-json" aria-hidden="true">#</a> angular.json</h4><p>这是 Angular-CLI 的配置文件，而 Angular-CLI 是自动化的工程构建工具，也就是利用这个工具，可以帮助我们完成很多工作，比如创建项目、创建文件、构建、打包等等。</p><p>原本的 HTML、CSS、JavaScript 的前端开发模式，并没有工程的概念，只要用浏览器打开 HTML 文件就能够运行。而 Angular 引入了 TypeScript，Scss 等浏览器并不无法识别的语言，自然，要让浏览器运行 Angular 项目之前，需要进行一次编译，一次转换。</p><p>这些工作就可以借助 Angular-CLI 来进行。另外，创建一个模块，创建一个组件，也都可以通过 Angular-CLI 来。</p><p>那么，在创建这些文件或者说，打包编译这些项目文件时，该按照怎样的规则，就是参照 angular.json 这份配置文件。</p><p>大概看一下内容：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>{
  &quot;$schema&quot;: &quot;./node_modules/@angular/cli/lib/config/schema.json&quot;, // 默认的配置项，比如默认配置了 ng g component 生成组件时应该生成哪些文件等等
  &quot;version&quot;: 1,
  &quot;newProjectRoot&quot;: &quot;projects&quot;,
  &quot;projects&quot;: {
    &quot;daView&quot;: {  // 项目的配置
      &quot;root&quot;: &quot;&quot;,
      &quot;sourceRoot&quot;: &quot;src&quot;,  // 源代码路基
      &quot;projectType&quot;: &quot;application&quot;, // 项目的类型，是应用还是三方库（library)
      &quot;prefix&quot;: &quot;app&quot;, // 利用命令生成 component 和 directive 的前缀
      &quot;schematics&quot;: {}, // 替换掉第一行的 schema.json 中的一些默认配置项，不如创建组件时，不要生成spec文件
      &quot;architect&quot;: { // 执行一些构造工作时的配置
        &quot;build&quot;: { // 执行 ng build 时的一些配置项
          &quot;builder&quot;: &quot;@angular-devkit/build-angular:browser&quot;,
          &quot;options&quot;: {
            &quot;outputPath&quot;: &quot;dist/daView&quot;, // 编译后的文件输出的位置
            &quot;index&quot;: &quot;src/index.html&quot;,   // 构建所需的模板 Index.html
            &quot;main&quot;: &quot;src/main.ts&quot;,       // 构建所需的文件
            &quot;polyfills&quot;: &quot;src/polyfills.ts&quot;, // 构建所需的文件
            &quot;tsConfig&quot;: &quot;src/tsconfig.app.json&quot;, // 对 typescript 编译的配置文件 
            &quot;assets&quot;: [ // 构建所需的资源
              &quot;src/favicon.ico&quot;,
              &quot;src/assets&quot;
            ],
            &quot;styles&quot;: [ // 构建所需的样式文件，可以是 scss
              &quot;src/styles.css&quot;
            ],
            &quot;scripts&quot;: [] // 构建所需的三方库，比如 jQuery
          },
          &quot;configurations&quot;: {/*...*/}
        },
        &quot;serve&quot;: {/*...*/}, // 执行 ng serve 时的一些配置项
        &quot;extract-i18n&quot;: {/*...*/},
        &quot;test&quot;: {/*...*/},
        &quot;lint&quot;: {/*...*/}
        }
      }
    },
    &quot;daView-e2e&quot;: {/*...*/},
  &quot;defaultProject&quot;: &quot;daView&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，利用 Angular-CLI 生成的初始项目中，有许多基本的文件，这些文件，基本也都在 angular.json 中被配置使用了，每个配置文件基本都有各自的用途。</p><p>比如，tslint 用来配置 lint 检查，tsconfig 用来配置 TypeScript 的编译配置，其他那些 html，css，ts，js 文件基本都是 Angular 项目运行所需的基础文件。</p><h4 id="package-json" tabindex="-1"><a class="header-anchor" href="#package-json" aria-hidden="true">#</a> package.json</h4><p>对于一个工程项目来说，依赖的三方库管理工具也很重要，在 Android 项目中，通常是借助 Gradle 或 maven 来管理三方库。</p><p>而在 Angular 项目中，是使用 npm 来进行三方库的管理，对应的配置文件就是 package.json。</p><p>在这份配置文件中，配置了项目所需要的三方库，npm 会自动去将这些三方库下载到 <code>node_modules</code> 目录中。然后，再去将一些需要一起打包的三方库在 angular.json 中进行配置。</p><h4 id="app-src-源码" tabindex="-1"><a class="header-anchor" href="#app-src-源码" aria-hidden="true">#</a> app/src 源码</h4><p>以上就是利用 Angular-CLI 创建项目生成的初始架构中各个文件的大概用途，下面讲讲 Angular 项目的大概运行流程。</p><p>在 src 中的 <code>index.html</code> 文件就是单页应用的页面文件，里面的 body 标签内，自动加入了一行根视图的组件：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-573cdd300d4936e7.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p><code>&lt;app-root&gt;&lt;/app-root&gt;</code> 就是根组件 AppComponent （自动生成的）的组件标签，当 Angular 在 HTML 文件中发现有组件标签时，就会去加载该组件所属的模块，并去解析组件的模板文件，将其嵌入到 HTML 文件的组件标签中。</p><p>看一下自动生成的根模块的部分内容：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>//app.module.ts
import { BrowserModule } from &#39;@angular/platform-browser&#39;;
import { NgModule } from &#39;@angular/core&#39;;

import { AppComponent } from &#39;./app.component&#39;;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>//app.component.ts
import { Component } from &#39;@angular/core&#39;;

@Component({
  selector: &#39;app-root&#39;,
  templateUrl: &#39;./app.component.html&#39;,
  styleUrls: [&#39;./app.component.css&#39;]
})
export class AppComponent {
  title = &#39;daView&#39;;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>app.module.ts</code> 文件用 @NgModule 表示该文件角色是模块，并在内部配置了它的组件 AppComponent，这样 AppComponent 组件就只属于该模块了，并能够在该模块内的其他组件中被使用。</p><p>另外，由于该模块是根模块，所以还需要配置 bootstrap，设置应用的根视图，这个配置需要和 <code>index.html</code> 里的 body 标签内的根视图组件是同一个组件，否则运行时就会报错了。</p><p>当项目中模块多了的时候，各模块之间基本是通过路由或者组件来进行相互关联。</p><p>比如，我们新创建个 Home 模块，然后在根模块中创建个 app-routing 路由配置文件：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>//app-routing.module.ts
import { NgModule } from &#39;@angular/core&#39;;
import { Routes, RouterModule } from &#39;@angular/router&#39;;

const routes: Routes = [
  {
    path: &#39;home&#39;, loadChildren: &#39;./home/home.module#HomeModule&#39;
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在 app.module.ts 的 imports 中将该路由配置导入，这样当路由到 home 时，会去加载 home 模块，然后看看 home 模块的路由配置：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>//home-routing.module.ts
import { NgModule } from &#39;@angular/core&#39;;
import { Routes, RouterModule } from &#39;@angular/router&#39;;
import {HomeComponent} from &#39;./home.component&#39;;
import {HomeCenterComponent} from &#39;./component/home-center.component&#39;;

const routes: Routes = [
  {
    path: &#39;&#39;,
    children: [
      {
        path: &#39;&#39;, component: HomeCenterComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>home 模块的默认视图为空，但交由其子视图来控制，所以，当导航到 home 时，home 模块会去加载它内部的 HomeCenterComponent 组件。</p><p>以上，是当项目中有多模块时，我的处理方式。</p><p>当按照这种方式来实现时，对于了解一个 Angular，就有一定的规律可循了：</p><ol><li>先找根视图组件，然后确认根视图组件中的 router-outlet 标签的区域，因为这个区域展示的就是由根模块路由导航到的新的组件内容；</li><li>去根模块的配置中找到根模块的路由配置表，来查看第一个层级的路由分别对应哪些模块；</li><li>去这些相应的模块中，查看它们各自内部的路由配置表，来确定各自模块的默认视图组件是哪个，下一个层级的各个路由所对应的视图组件；</li><li>这样，一个页面的组件层次结构就能够很快的理清。</li></ol>`,116);function m(b,g){const i=r("ExternalLinkIcon");return a(),s("div",null,[t,u,e("ul",null,[e("li",null,[e("a",c,[n("Angular 官方中文版教程"),o(i)])])]),v])}const q=l(p,[["render",m],["__file","Angular学习1-架构概览.html.vue"]]);export{q as default};
