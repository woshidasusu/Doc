import{_ as p,o as r,c as e,d as a}from"./app-2pyCoCP5.js";const t={},n=a('<h1 id="_2024" tabindex="-1"><a class="header-anchor" href="#_2024" aria-hidden="true">#</a> 2024</h1><h2 id="自我介绍" tabindex="-1"><a class="header-anchor" href="#自我介绍" aria-hidden="true">#</a> 自我介绍</h2><h3 id="技术面" tabindex="-1"><a class="header-anchor" href="#技术面" aria-hidden="true">#</a> 技术面</h3><p>你好，我是 94 年出生，17 年在福州大学本科计算机专业毕业，毕业后就职于厦门的网宿科技，20 年的时候去了深圳的明源云，22 年回到了福州的锐捷网络。到目前接触的项目基本都是 <strong>B 端产品</strong>多一些，都以业务性为主点。但<strong>产品的形态</strong>有多种，PC 后台、公众号 H5，企业微信 H5，跨平台的 Hybrid App 都有涉及过。<strong>技术栈</strong>方面接触过：后端渲染的老项目、Angular、Vue，目前主要以 Vue 为主。<strong>技术方案</strong>上接触过微前端、低代码的项目。平时为了<strong>增效</strong>，也开发过一些 node 脚本，webpack 的 loader，或者是 vscode 的插件，具体在简历上都有罗列。 以上就是我的个人基本情况。</p><h3 id="提问" tabindex="-1"><a class="header-anchor" href="#提问" aria-hidden="true">#</a> 提问</h3><ul><li>能否简单介绍下贵公司主要的产品业务，我们这个岗位是做什么的？</li><li>我们这个团队的大体人员规模情况？</li><li>项目的主要技术栈是哪些？</li><li>对应聘这个岗位的人员会有哪些方面的期待或要求呢？</li></ul><h3 id="hr-面" tabindex="-1"><a class="header-anchor" href="#hr-面" aria-hidden="true">#</a> HR 面</h3><p>你好，我是 94 年出生，老家在泉州，然后 17 年在福州大学本科计算机专业毕业，毕业后就职于厦门的网宿科技，20 年的时候，网宿大裁员，整个部门被优化，刚好也年轻就跑到了深圳的明源云。22 年想到该考虑个人问题，就回来老家了，去了福州的锐捷网络。今年因为女朋友在厦门，打算以后在厦门发展了。目前人还在职，打算年后再去厦门。</p><ul><li>工资的组成结构，公积金等无限一金方面缴纳的比例和基数是多少？</li><li>加班情况怎么样呢？</li></ul><h2 id="谈谈印象最深的一个项目-或者你觉得有难度、有亮点的项目" tabindex="-1"><a class="header-anchor" href="#谈谈印象最深的一个项目-或者你觉得有难度、有亮点的项目" aria-hidden="true">#</a> 谈谈印象最深的一个项目，或者你觉得有难度、有亮点的项目</h2><h3 id="业务介绍" tabindex="-1"><a class="header-anchor" href="#业务介绍" aria-hidden="true">#</a> 业务介绍</h3><p>印象深的项目应该就是在深圳时做的项目了，我在深圳时的公司的主营产品是服务于<strong>地产行业的开发商</strong>的，所以基本都是围绕着地产来提供一系列的服务。我们团队主要负责的是楼房的验收、交付和业主入住后的售后。所以，我们会有一个<strong>移动 APP</strong>，给验房工程师开展验房等相关工作，因为工程师验房的环境基本都是没有网络的，所以我们的 APP 需要支持<strong>离线化能力</strong>，也就是代码和数据都需要离线化，离线化之后就还需要搭配一套更新机制来更新，也就是所谓的热更新机制。具体可以后面展开讲。</p><p>然后验房工程师登记完问题后，数据需要到我们一个<strong>后台系统</strong>进行一个工单的流转、派发，因为不同的问题是由不同的承包商进行负责的，比如门窗、地板等出问题了，需要把工单流转到对应负责人去指派维修。 所以，我们还有一个搭配的后台管理系统，它可以按照一定策略自动进行工单的流转，也支持客服人员手动处理。</p><p>楼房问题都整改完毕，业主入住后，我们还需要提供一个渠道来让业主可以自主报修或者是投诉、咨询等等，所以我们还提供了一个<strong>公众号 H5 产品</strong>，业主上报的这些工单问题也一样会进入后台系统进行流转。</p><p>再来就是我们有个<strong>客服团队</strong>，她们需要跟业主打交道，所以我们基于企业微信基础上，以企业微信提供的内置应用的能力提供了一个辅助客服人员使用的 H5，它嵌套在企业微信聊天框里，就可以帮助客服人员快速的查阅业主相关信息，和高效的聊天服务等</p><p>上面就是在深圳时做的项目的产品业务介绍了，下面是我自己来讲点项目里的技术方案还是你这边来针对性了解？</p><p>那我自己讲一下，刚才说到我们有一个移动 App，首先它是一个跨平台的 App</p><h3 id="跨平台方案" tabindex="-1"><a class="header-anchor" href="#跨平台方案" aria-hidden="true">#</a> 跨平台方案</h3><p>跨平台方案是 Hybrid App 方案，本质上其实就是基于 Cordova 作为中间层来抹平不同系统间的差异，以及操作硬件方面的原生能力，比如文件能力等，然后会运行一个 WebView 容器来给前端代码提供运行环境。</p><h3 id="离线化方案-热更新方案" tabindex="-1"><a class="header-anchor" href="#离线化方案-热更新方案" aria-hidden="true">#</a> 离线化方案（热更新方案）</h3><p>然后刚才也有提到我们 App 是需要有离线化能力，也就是前端打包之后的资源文件是存放在设备本地的，那么 WebView 如何加载本地的前端代码，在 Android 设备里，可以直接使用 <strong>file 协议</strong>来加载，但 ios 不行，于是需要借助相关 Cordova 插件来运行一个本地的 <strong>http 服务</strong>，然后通过 http 协议进行加载。</p><p>这样，代码离线化之后，也能够正常运行起来了。</p><p>但代码离线后，就需要考虑如何更新，毕竟我们会不断迭代发版本。有两种策略，一种是<strong>大版本升级</strong>，一种是<strong>小版本热更新</strong>。</p><p>大版本升级是指我们的 APP 需要在应用商店上架新版本，这时候，会内置对应版本的前端代码资源在 app 里面。对于新用户，直接下载安装使用最新版本没啥问题，但对于在使用旧版本的用户，也一样有不同的策略，比如强制更新，可选更新，或者是放弃版本维护</p><p>小版本热更新则是指只需要更新前端代码资源就行，也就是只需要前端代码发版本，不需要上架新版本 App。 由于前端代码会用到一些硬件原生能力，所以前端的热更新都是跟着 App 的大版本走的，不同 App 版本之间的热更新版本维护维度是不一样的，这样才能避免出现前端代码升级后与原生版本不一致导致的功能异常</p><p>再来就是前端<strong>热更新的检测时机</strong>，我们是放在了用户登录后进入首页时，如果当前有网，才会去进行检测。之所以没有在应用初始化时进行检测的目的在于，我们的热更新其实支持各种维度的<strong>灰度更新</strong>，因为我们是 SaaS 产品，不同大公司客户用的都是同个 App，但有可能某些版本升级只针对某个租户（也就是某个公司客户），又或者我们可能想先灰度一部分用户升级，稳定后再全面升级，所以也支持指定是 Andorid 或 Ios 或者某个固定账号等等维度来进行升级。</p><p>而且登录页基本没有业务逻辑，所以滞后更新我们能接受，综上就放到了进入首页时进行的更新检测。当然，也有手动检测更新的入口等。</p><p>上面介绍的都是代码的离线化和热更新方案，除了代码要离线化之外，<strong>数据也一样要离线化</strong>。</p><p>所以，我们页面数据来源其实都是本地的一个小型数据库，用的 SQLite，包括用户操作过程产生的业务数据等也都是存放在本地数据库里的。而且它是以<strong>账号为维度</strong>进行创建的数据库，这样切换不同账号时，也不会产生数据相互污染问题。</p><p>由于数据是存放本地数据库的，那么也就需要进行相关的升级更新。有两方面，一个是数据库本身的升级，因为有可能增加了表，或者表结构发生变化。数据库的版本升级，维护好各版本之间的升级 SQL 就行。 再来就是数据的更新。 离线化有个最大的问题就是，要确保用户本地的<strong>离线数据不能丢失</strong>，否则会导致工程师工作了一整天都白干了。基于这点原则，我们所有涉及数据更新的场景都是确保必须先上传再更新。</p><p>如果本地产生了离线数据，那么只有等上传完这些数据后，才可以进行服务端数据的更新。这样后端才有办法对用户的本地数据进行备份处理，这样即使发生数据冲突，导致数据丢失的话，还有人工的途径可以去恢复数据</p><p>上传时，如果是把整个本地数据库里的数据都上传，那么量可能很大，还有个后台系统要用这些业务数据，处理起来也麻烦。所以，我们实现上是给各种不同业务操作产生的业务数据都会在<strong>增量表</strong>里打上标志，比如某个房间增加了一个工单，工单id是多少这样子的信息，然后上传时，根据增量表里的记录，去捞取这些增量产生的业务数据进行上传</p><p>而数据下载时，则是分两种策略，一种是基础数据，业务无关的数据，这部分数据量不会多，采用的是<strong>全量下载的覆盖更新</strong> 另一种则是业务数据，用的是<strong>时间戳策略</strong>，也就是我上次下载业务数据的时间戳，从这之后服务端所产生的新的业务数据都下载下来</p><p>然后就是<strong>上传和更新的时机了</strong>，对于业务数据，我们都没有自动进行上传或更新操作，因为业务数据都是增量上传下载的，自动处理容易在某些极端场景出问题。一些业务无关的基础数据，我们会在进入相应页面时进行检测是否需要自动更新，因为是全量更新的，不怕出问题。</p><p>那业务数据虽然没有自动更新，上传。但由于我们提供的服务是给验房工程师，他们工作时都是从某栋楼开发一个个检查某个房间，因此有唯一的功能入口，也就是楼栋或房间，我们在这个入口处做相对应提示，让用户手动去上传和更新</p><p>那么在上传数据时，有可能会跟服务端的<strong>数据产生冲突</strong>，这时候的解决策略则是根据具体业务做处理，由后端负责，但不管是怎样的处理策略，原始上传上来的数据都会做备份，以防止冲突解决异常而导致数据丢失。</p><p>具体解决冲突比如，同个房间，A 工程师上传了 2 个工单，B 工程师也上传了工单，那么从业务角度来看，不存在冲突，就会合并这些工单数据到这个房间内</p><p>比如，A 工程师觉得房间没问题，标志房间状态为验收完毕，但 B 工程师觉得房间有问题，提交了工单，标志房间状态为整改中。那么这时候，后端处理逻辑是去重新走逻辑修订房间状态，由于定义了只要房间有未整改的工单的话，房间就应该处于整改中状态，因为这时候房间状态就是整改中。</p><h3 id="微前端" tabindex="-1"><a class="header-anchor" href="#微前端" aria-hidden="true">#</a> 微前端</h3><p>还有一个就是，我们 APP 用到了微前端。背景是我们公司有多个产品团队，每个产品团队都有自己的一个 App，这就导致客户如果购买了我们全系列的产品时，手机上要安装好几个 App。</p><p>于是，有一年，高层给的战略方向就是要融合各个产品线的 App，客户只需安装一个 App 就能使用全系列产品线</p><p>而我们不同产品团队，开发、发版节奏都是不一样的，甚至有的技术栈也有一些差别，而我们的跨平台 app 本来运行在 webview 上，性能上与原生就有一点距离了，再使用 iframe，性能问题更大。</p><p>所以，SPA 单页应用的微前端就是我们那时最好的解决方案。又能集成融合，各团队还仍旧可以独立开发、发版。</p><p>那时候单页应用的微前端框架只有一个乾坤，还不像现在开源了这么多（什么京东的 micro app，腾讯的无界），而乾坤那个时候其实也才 1.0 版本，不稳定，文档也少，而且乾坤本质上也是基于 single-spa 基础上做的微前端框架，<strong>single-spa</strong> 是一个根据路由来管理不同子应用生命周期的框架，乾坤基于这个基础上增加了子应用的加载和隔离处理</p><p>加载它用的是 <strong>import-html-entry</strong> 框架，这是一个用 fetch 方式获取到应用入口 index.html 代码，然后解析后把里面的外链资源文件都下载下来，如果是样式文件，则包裹到 style 标签回填替换到 html 上去，如果是 js 文件，则先注释掉避免被执行，然后把 js 代码包裹到 with 里并对外暴露 api，等待执行。</p><p>通过这种方式，它就完成了子应用的加载。然后把经过处理的 html 代码直接给挂载到指定的 dom 容器里，这就完成了子应用的加载。</p><p>而由于子应用的 html 是动态挂载到 dom 上去的，如果子应用退出直接销毁 dom。这样子应用的 <strong>css 样式就得到了天然的隔离效果</strong></p><p>这也就是乾坤官网宣称的 html entry 特性的内容</p><p>至于 <strong>js 的运行隔离</strong>，乾坤则是通过将 js 代码块放到 with 里执行，并包裹了一个立即执行的函数，函数传入了参数变量名为 window 的参数，这样子应用内部调用的 window 实际上是乾坤经过代理伪造的一个 window，就能起到相互隔离的效果</p><p>上面是乾坤框架的方案，而这些方案都是乾坤 2.0 之后的方案，1.0 时用的还是一些快照之类的方案来进行隔离</p><p>而我们团队，没有做这么通用的隔离处理，我们更多的是解决了子应用的集成和管理，隔离方面更多依赖团队间约定的规范，因为这些可以快速落地</p><p>所以，子应用管理我们也依赖于 single-spa 框架，至于子应用的集成，因为我们所有 APP 本身就有一个离线和代码热更新的机制，都是统一对接架构组大佬提供的热更新方案，所以这次微前端的主应用也是由架构组来负责主应用，而主应用最大的用途就是管理各个子应用</p><p>具体的集成方式就是，先把所有子产品的 index.html 里依赖的三方静态库和基础配置都汇合到一份 html 里，由主应用负责维护</p><p>至于每个子应用都需要加载哪些 js 的资源文件清单，这个其实在前端打包后会自动塞到 index.html 里，但现在子产品的 html 已经没有用了，所以其实可以借助一个叫做 <strong>stats-webpack-plugin 的插件</strong>，它能够在项目打包后生成一份 manifest.json 的 js 资源清单文件，主应用拿到这份清单就知道每个子应用所依赖的 js 文件有哪些了，就可以去加载他们了。这样就完成了子应用的集成和加载</p><p>然后就是隔离，css 隔离比较简单，加个命名空间。js 隔离就基本上是需要依赖团队间约定的规范了，实在遇到有些场景某个子应用重写了某个原生 api，那么就需要通过快照方式来进行处理了</p><p>微前端大概就是这些内容</p><h2 id="谈谈你最近在做的一个项目" tabindex="-1"><a class="header-anchor" href="#谈谈你最近在做的一个项目" aria-hidden="true">#</a> 谈谈你最近在做的一个项目</h2><p>目前待的公司叫锐捷网络，主营产品其实是硬件，卖交换机设备的。一个园区的网络要能够正常的通网，需要依赖于各种不同角色的交换机按照一定的配置和拓扑关系进行连线后，才能够组建好园区网络，园区内的电脑、手机等才能够正常通网使用</p><p>我们做的就是提供一个后台可以来管理、运维整个园区网络，就像路由器的设置后台，但那个是单机管理，比较简单的场景。</p><p>在这行的专业名称叫做 SDN 控制器。它是用来解决传统的网络工程师需要跑机房里去一台台的维护管理的问题。</p><p>这是大概的产品业务介绍</p><p>然后项目里，比较复杂的一些技术方案就是拓扑图的呈现，需要将整网的各台设备的真实拓扑连线关系给呈现出来，但设备有可能多达上万台，拓扑节点太多时，又需要考虑性能问题</p><p>拓扑的实现又有多种方案，可以粗暴的用 div 自己开发，也可以依赖于一些商用的库，比如 twaver 来进行开发。这些方案，在我们项目里有过进行过尝试</p><h3 id="性能优化" tabindex="-1"><a class="header-anchor" href="#性能优化" aria-hidden="true">#</a> 性能优化</h3><p>然后我们也遇到过一个拓扑节点过多时的页面卡顿的性能问题</p><p>我们用的是商用的 twaver 库开发出来的拓扑，在数量达到小几千时，就已经出现明显的卡顿了。</p><p>那这个性能优化是属于具体场景分析来具体优化，需要找出导致性能瓶颈的因素，再针对性的去解决优化。</p><p>在这个性能优化解决后，我们大概总结出导致瓶颈的因素有这么几种：</p><ul><li><p><strong>无意义的内存占用过高</strong> 经过排查发现其实是 Vue 框架对 twaver 数据对象自动进行的响应式处理导致的问题 那么解决方案就是要绕过 Vue 的响应式处理，去看了下 Vue 的内部实现，发现在 2.7 版本有提供了一个标志位，可以来避免对象被响应式处理。 另外，其实只有修改对象的可扩展属性，也可以避免被响应式处理。但由于拓扑用的是商用三方库，看不到人家实现的源码，不确定他们内部有没有用到这些特性，怕出问题，所以没有通过这种方式解决。 再者，将变量命名改成 _ 或者 $ 开头也可以绕开，这是因为这种格式的变量其实是 VUE 的内部变量，内部处理 data 里的数据时，不会把这种格式的变量挂载到 this 上，所以代码里使用 this 去访问这些变量并进行赋值操作时，其实本质上是动态对 vue 组件实例对象添加了一个属性上去，而动态添加的属性在 vue2 里是不支持响应式的，就正常可以绕过</p></li><li><p><strong>短时间内频繁执行某些其实没意义的操作</strong> 经过排查发现，其实是我们拓扑的每条连线链路的动画都在实时刷新，即使在屏幕外的也在时刻刷新 这是因为最初链路的动画实现方式是每条链路内部自己创建一个动画管理器（twaver 提供的一个动画方案），虽然 twaver 源码是混淆过的，但跟进去简单看了下，它的动画实现是用的 raf 和 setTimeout，那么当一次性有这么多的异步任务造成的内存和性能消耗也是非常巨大的 所以，针对这个的解决方案就是再另外单独提供一个全局的动画管理器，它内部去在每一帧时动态计算获取当前屏幕可视范围内的节点对象，只刷新这部分的链路动画。 这样就能极大的降低性能损耗，其实本质也就是按需使用、懒加载的思想</p></li><li><p><strong>一次性处理的东西过多</strong> 比如一次性就将全部节点都渲染出来了，但这个是因为用的是别人的框架作为基础，看不到源码，没法参与到它内部的节点排版过程，所以很难像上一个问题一样来做到自动的懒加载，按需绘制处理。 虽然技术上做不到，但其实可以通过交互方式来规避。就像表格的分页思想，我可以把超出一定数量的节点先折叠起来，等待用户手动去展开</p><p>还有其他做了一些缓存复用的处理，经过各种手段后，性能瓶颈达到了我们的产品需求</p></li></ul><h3 id="国际化" tabindex="-1"><a class="header-anchor" href="#国际化" aria-hidden="true">#</a> 国际化</h3><p>去年我们业务开始出海，因此要在现有的项目基础上快速的进行国际化改造支持</p><p>国际化本质上不难，无非就是提供一个全局的翻译函数和不同语言的词条翻译清单。但它最大的问题就在于工作量巨大，主要就是处理词条和样式工作</p><p>而且有很多隐藏的坑，比如图片里出现了中文，导入导出的文件里出现了中文等</p><p>样式工作是因为中文排版正常，可能切到英语时，排版会错乱，要么乱换行，要么溢出或者被遮挡等等问题，而样式工作躲不掉，只能人工去处理</p><p>另外就是词条工作，词条工作包括要把需要翻译的词条进行翻译函数包裹处理，包裹后需要把被包裹的词条都提取到一份词条翻译清单文件里，然后如果不能机翻的话，还需要转成 excel 文档格式提交给翻译组进行翻译，等他们翻译结束后再回填到项目的翻译清单文件里</p><p>这里面的每个过程工作量都非常庞大，而且很容易遗漏，也就是很难去人工检查</p><p>那么最好的方案就是让程序自动去处理，所以我们针对这个国际化开发了一个国际化自动处理脚本</p><p>脚本原理上就是遍历项目代码，然后根据不同文件做不同的处理，比如 vue 文件和 js 文件里的中文所使用的翻译函数可能不一样，再比如 vue 文件里面的 tempate 和 script 代码块里的使用翻译函数的语法也不一样，不同文件直接通过后缀名判断区分，vue 代码里就通过正则把 template 和 script 代码块区分开处理</p><p>再然后也是通过正则捞取到中文词条，我们是直接用中文做翻译清单文件的 key 值的，这样脚本才有统一的规则来区分出这些词条</p><p>脚本还支持把项目里所有用翻译函数包裹的词条都提取到指定的 json 文件里，这样词条提取也不用人工进行，工作量直接降低到无工作量</p><p>另外，有了脚本，对于后期的维护也可以降低很多成本。如果没有脚本，如何在一份大量的翻译清单文件里找出还没翻译的词条，都是需要靠对工作量</p><p>有了脚本，直接一秒执行完毕</p><p>当然，脚本也不是万能的，没法解决百分百的场景，因为现有的项目已经历史好几年了，你不知道前人会怎么去写代码</p><p>就像我们发现，有人在 vue 文件里所有涉及到异步函数回调场景时，都没有使用箭头函数，而是直接 function 声明的匿名函数，这就会导致函数内部的 this 指向其实不是指向 vue 组件实例，就会出现问题</p><p>还有，有的人直接用中文做判断，那如果判断两边翻译不一致时，也会出问题</p><p>还有，vue 里面也不是所有地方都能访问 this 的，比如 props 里，或者 script 代码块里的就不行</p><p>所有这种特殊场景，就需要先把代码进行改造后才能够正常使用脚本</p><p>都是历史债务导致的问题</p><h2 id="怎么看待老项目、债务项目-怎么去解决" tabindex="-1"><a class="header-anchor" href="#怎么看待老项目、债务项目-怎么去解决" aria-hidden="true">#</a> 怎么看待老项目、债务项目，怎么去解决</h2><p>老项目是避免不了的，除非是初创团队、初创业务。 我个人对待老项目看法是，不要一味的想着重构重构。</p><p>虽然重构确实是站在开发人员角度比较好的方案，但重构影响面、风险点太大了。 因为重构不是一个人的事，也不是前端自己的事，你要占用后端的资源，占用测试的资源，全回归</p><p>很难有这种时间和机会来全重构的</p><p>而且谁也说不准哪个技术栈会不会什么时候就被淘汰了，像我在深圳的公司，有个项目就是用的 angular1.0 kaifa</p><p>当时这个技术栈相比 jquery 确实很先进，现在呢，angular 2.x，vue， react 出来后不也变成债务项目了</p><p>而且，有的时候老项目也有自己的优势，就比如没有工程化的 jquery 项目，虽然浏览器直接运行远嘛，</p><p>但调试方便啊，如果遇到个内网无法代理的线上问题，这种时候，调试多高效</p><p>所以我个人想法是找出老项目的痛点，看看这个痛点够不够痛，有没有什么方法或手段可以尽可能的降低这个痛点</p><p>jquery 不就是需要响应式框架吗，那就局部引入 vue 不也可以满足日常新需求开发</p><p>像我一个老项目，由于是以前人自己写的 webpack 构建脚本，用了一堆插件，导致项目跑起来特别占用内存，除非高配置的</p><p>不然热更新用不了，写一次重新构建一次，那么可以去研究下这个构建脚本，想办法按需构建减少内存占用</p><p>像老项目还有痛点是兼容性，那万一产品客户范围就不需要考虑兼容性呢</p><p>或者直接给老项目里引入构建工具，不也可以解决</p><p>当然，也不是说就不重构，而是要抓住机会重构</p><p>比如这次需求涉及到较大的老项目某个页面变更，那么是否就可以单独这个模块进行重构</p><p>然后再把两个项目融合起来，用微前端或者纯菜单导航来融合都可以</p><p>总结来说就是，抓住机会重构，想办法降低痛点，可满足日常维护开发即可</p><h2 id="讲讲你做的哪个东西的1-100-不是0-1" tabindex="-1"><a class="header-anchor" href="#讲讲你做的哪个东西的1-100-不是0-1" aria-hidden="true">#</a> 讲讲你做的哪个东西的1-100，不是0-1</h2><p>其实很多方案，0-1并不难，你可以耍点小聪明，网上看些教程，就把基础框架给搞出来，满足第一版需求，这个对于有个三五年经验的应该都不是难事</p><p>但问题是，你搭好的这个东西有没有去持续迭代优化，持续去完善下去，让它满足后续的需求支撑</p><p>很多这种例子</p><p>比如，国际化方案很简单，无非就是翻译函数和词条清单</p><p>但是，你想过如果要在一个已有的项目上去快速国际化，这个工作量有多大吗</p><p>后续某个迭代里，怎么去增量的捞出，检查出还没有国际化的文本，靠人工吗</p><p>词条清单的更新人工去吗，如果词条几百条呢，也一个个手动去吗</p><p>国际化最大的问题上在于使用上，维护上，而不是方案上</p><p>比如组件库，抽象出业务并封装个通用组件不难，但你怎么让别人用起来</p><p>别人用的时候好不好用，知不知道怎么用，这才是关键</p><p>饿了么组件这么多人用，原因之一就是它组件使用说明平台很详细</p><p>那如果你说你也维护一个这种平台，那有没有想过，维护成本大不大</p><p>每个组件都得写示例代码，又得写代码，这个成本有人愿意付出吗</p><p>有没有什么办法可以降低维护成本</p><p>所以这些都是 1-100 要做的事，事情不是满足了当前的需求就完事了的</p>',122),s=[n];function i(o,h){return r(),e("div",null,s)}const g=p(t,[["render",i],["__file","index.html.vue"]]);export{g as default};