import{_ as a,r as t,o as r,c as s,a as e,b as i,e as p,d as n}from"./app-pwInIdNR.js";const d={},o=e("h1",{id:"从输入-url-到页面加载都发生了什么",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#从输入-url-到页面加载都发生了什么","aria-hidden":"true"},"#"),i(" 从输入 URL 到页面加载都发生了什么")],-1),c={href:"https://github.com/ljianshu/Blog/issues/24",target:"_blank",rel:"noopener noreferrer"},h=n('<p>这面试题简直神了，也不知道第一个想出这道题的是哪位大佬，这题说好答也好答，说难答也很难答</p><p>好答是因为，由于这题在面试中的高频出现，网上已经有一大堆讲这个的文章，比如现在又多了我这篇</p><p>难答是因为，这题涉及了前端里绝大部分的领域了</p><p>你想想，仅一道题，就把前端各领域的知识点都囊括了，每个知识点，面试官跟你深入的话，都可以单独作为一个面试点了</p><p>一句话来回答这道题的话，这过程中一共发生了这么几件事：</p><ol><li>URL 解析</li><li>浏览器缓存机制工作</li><li>DNS 域名解析</li><li>TCP 三次握手建立连接</li><li>HTTP 请求</li><li>服务端响应</li><li>浏览器解析 HTML 页面，进行渲染</li><li>TCP 四次挥手断开连接</li></ol><p>可能你会觉得这跟你在其他文章里看到的不大一样，其实差不了多少，我这里列得更详细了点，大多数文章讲的都是主要流程，比如：DNS，TCP 连接，HTTP 请求，页面渲染这四个过程，我把其中一些额外的工作也列出来了而已</p><p>就这个流程，从大的方面来看，就几个工作而已，但深入了来看的话，可以考你一大堆不同领域的知识点掌握情况，比如：</p><ul><li>浏览器的缓存机制清不清楚 <ul><li>什么是强缓存、什么是协商缓存</li><li>Service Worker 知不知道</li><li>HTTP2 的 Push Cache 呢</li></ul></li><li>网络基础牢不牢固（TCP，HTTP 一大堆可以考的） <ul><li>讲讲 TCP 的三次握手，为什么需要三次握手，顺道讲讲四次挥手</li><li>讲讲 TCP 有哪些特点，为什么 TCP 是可靠传输，超时重传是什么，快速重传又是什么，拥塞控制也讲讲</li><li>HTTP 几个版本的区别、特点讲讲</li><li>HTTP 常见头部、常见响应码讲讲 <ul><li>206 知道吗，知道那讲讲断点续传</li><li>重定向知道吗，知道那讲讲 301,302,303,307,308 的区别和场景</li><li>401 知道吗，知道那讲讲你们是怎么鉴权的，单点登录流程也讲讲</li></ul></li><li>HTTP 有哪些请求方法，各自应用场景是什么，POST 和 PUT 有什么区别</li><li>HTTPS 也讲讲，TLS 是如何实现安全连接的，密钥协商流程讲讲</li><li>常见的网络攻击讲讲，什么是 XSS，CSRF，中间人攻击，该怎么预防</li></ul></li><li>浏览器的同源策略知不知道，知道那讲讲跨域请求的方案有哪些</li><li>页面渲染流程了解吗，讲讲 <ul><li>知道浏览器的事件循环机制吗，HTML 解析在哪个阶段、页面渲染呢</li><li>那顺道讲讲宏任务、微任务</li><li>要不再顺道讲讲任务源有哪些</li></ul></li><li>你们页面首屏渲染时长怎么样，做过哪些优化处理</li><li>...</li></ul><p>不用意外，上面的知识点，完全都是可以从这一道面试题来深入考你的，所以你说这题神不神</p><p>而且，上面的知识点，还只是我个人这种小白层面能想到、也提前准备准备的知识点，对于那些大佬面试官，能往深了考到你怀疑人生</p><p>当回答面试官时，可以先大概从广的角度就简单介绍下，这个过程涉及到几个步骤，每个步骤的目的简单说说</p><p>至于深入的问题，就等待面试官，看他想在哪个知识点着重展开时，再去相应回答</p><h3 id="_1-url-解析" tabindex="-1"><a class="header-anchor" href="#_1-url-解析" aria-hidden="true">#</a> 1. URL 解析</h3><p>我之所以列出了这个过程，是因为，浏览器的 URL 里能输入的不一定非得是 http 或 https 地址，也可以输入 <code>file://</code> 来访问本地资源</p><p>当使用 file 来访问本地的网页资源时，这种场景，下面那些涉及网络的步骤就都没有了，直接进入到页面解析、渲染步骤了</p><h3 id="_2-浏览器缓存机制工作" tabindex="-1"><a class="header-anchor" href="#_2-浏览器缓存机制工作" aria-hidden="true">#</a> 2. 浏览器缓存机制工作</h3><p>服务端的资源是可以通过响应头来让浏览器进行缓存的，如果是首次访问，那自然是找不到缓存，直接继续往下处理去向服务端请求</p><p>但如果本地有缓存时，那么，是有可能不需要重新发起请求的，直接使用本地缓存资源即可，这个时候，也同样就跳过下面那些网络相关的步骤，进入页面解析、渲染步骤了</p><p>而浏览器缓存分强缓存和协商缓存，通常是用 http 1.1 版本新增的 cache-control 头部字段来进行控制，不同取值时，有不同的缓存策略</p><p>涉及到缓存相关的 http 头部字段还有：expires，last-modified，if-modified-since，etag，if-none-match</p><p>Service Worker 是一种可以让开发者自行决定缓存行为的机制，想缓存什么资源，缓存多久，都交由开发者决定，通常用来实现离线缓存功能</p><p>Push Cache 是 HTTP2 中的一种新特性，允许服务端主动向客户端推送缓存</p>',23),T={href:"http://gitbook.dasu.fun/%E9%9D%A2%E8%AF%95%E9%A2%98%E7%A7%AF%E7%B4%AF/",target:"_blank",rel:"noopener noreferrer"},u=n('<h3 id="_3-dns-域名解析" tabindex="-1"><a class="header-anchor" href="#_3-dns-域名解析" aria-hidden="true">#</a> 3. DNS 域名解析</h3><p>DNS 域名解析是指域名到 ip 的映射工作</p><p>http 是应用层协议、基于传输层的 tcp 协议，而 tcp 基于网络层的 ip 协议，ip 报文包里，首部有个字段是目标 ip 地址，需要知道 ip 地址，才能知道要跟谁建立连接通信</p><p>DNS 解析其实就是去一张映射表中寻找域名和 ip 的映射关系，而这个过程涉及到很多缓存，比如浏览器本身就有 DNS 缓存，接着去本地电脑的 host 文件里寻找映射，再然后路由也有缓存，否则就去提供商查询了，当然提供商又分了很多层级</p><h3 id="_4-tcp-三次握手建立连接" tabindex="-1"><a class="header-anchor" href="#_4-tcp-三次握手建立连接" aria-hidden="true">#</a> 4. TCP 三次握手建立连接</h3><p>当 DNS 解析了 ip 地址后，就可以与对方建立连接，这过程是通过 TCP 的三次握手</p><p>所谓的三次握手，也就是：</p><ul><li>客服端发生 SYN 包给服务端</li><li>服务端返回 ACK 给客户端</li><li>客户端返回 ACK 给服务端</li></ul><p>连接建立</p><p>SYN 是请求连接的意思，ACK 是表示已经接收到对方发送的请求</p><p>因为需要明确告知对方，我是接收到你发的哪个请求，所以每个请求都会携带 seq 信息</p><p>那么，为什么需要三次握手呢？</p><p>这是因为，三次是双方都能明确对方已经接收到我发送的信息的最小交互次数</p><p>至于 TCP 还可以扩展考一下 TCP 知识点内容，比如</p><p>TCP 因为有超时重传机制、请求应答机制，保证了可靠的传输</p><p>重传是指一个请求发送出去后，如果一段时间后，仍旧没有接收到对方的应答响应，那么就会重发该请求</p><p>快速重传机制是指，TCP 因为可以流线式发请求，如果第一个请求丢失，那么发送方是有可能连续接收到同一个应答，当连续三次时，即使还没到超时时间，就可以重发丢失的请求</p><p>应答机制是指，发送方发送的每个请求都会携带 seq，表示此次请求中携带的数据开始的序列号，接收方接收该请求后，会返回一个 ACK 值为 seq + content-length + 1 的序号，表示该序号前面的数据我都接收了，你可以发送下个序号的数据了</p><p>如果接收方想要接收的序列号为 1，但发送方发送的序列号为 1 的请求丢失了，同时也发送了后续的请求，那么接收方接收到很多请求，但就是没有序列号为 1 的，那么它都会返回 ACK = 1，表明你应该发的是这个请求，不是其他的，但接收到的其他请求并不会丢掉，而是放入接收窗口中，等待前面丢失的接收到后，一次性应答给发送方</p><p>发送方接到多个相同的 ACK 就知道它的这个请求丢失了，就会重发了</p><p>拥塞控制是指，当 TCP 发现经常重传时，会认为是网络状态不好，就会降低发送速率</p>',21),_={href:"http://gitbook.dasu.fun/%E9%9D%A2%E8%AF%95%E9%A2%98%E7%A7%AF%E7%B4%AF/",target:"_blank",rel:"noopener noreferrer"},P=n(`<h3 id="_5-http-请求" tabindex="-1"><a class="header-anchor" href="#_5-http-请求" aria-hidden="true">#</a> 5. HTTP 请求</h3><p>TCP 连接建立后，就可以发送 HTTP 请求了，在 HTTP 1.0 版本，默认是短链接，意思就是一次 HTTP 请求结束后就断开 TCP 连接，下次请求需要重新建立</p><p>在 HTTP 1.1 版本时，默认就是长链接了，也就是 connection: keep-aive，一个 TCP 连接可以发送多个 HTTP 请求</p><p>到了 HTTP 2.0 版本时，已经支持一个 TCP 连接并行发送多个 HTTP 请求</p><p>HTTP 请求其实指请求报文，请求报文由请求行、请求头、请求体三部分组成</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code>POST /home/msg/data/personalcontent HTTP/1.1
Host: www.baidu.com
Connection: keep-alive
Pragma: no-cache
Content-Type: application/json

{
  a: 1
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一行就是请求行，包括请求方法、请求URL、HTTP 版本</p><p>接下去是请求头，键值对形式，不同头部字段有各种功能</p><p>请求头和请求体以换行隔开，请求体的数据类型可以有多种，由 Content-Type 字段控制</p>`,9),C={href:"http://gitbook.dasu.fun/%E9%9D%A2%E8%AF%95%E9%A2%98%E7%A7%AF%E7%B4%AF/",target:"_blank",rel:"noopener noreferrer"},v=n(`<h3 id="_6-服务端响应" tabindex="-1"><a class="header-anchor" href="#_6-服务端响应" aria-hidden="true">#</a> 6. 服务端响应</h3><p>一次完整的 HTTP 请求的过程是包括，客户端发送请求报文，服务端返回响应报文</p><p>响应报文由响应行、响应头、响应体三部分组成</p><div class="language-http line-numbers-mode" data-ext="http"><pre class="language-http"><code>HTTP/1.1 200 OK
Cache-Control: private
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html;charset=utf-8

...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一行就是响应行，包括 HTTP 版本，状态码，状态信息三者</p><p>接下去就是响应头，然后跟响应体以换行隔开</p><p>HTTP 请求时，客户端其实跟服务端在很多场景下是可以进行协商的，通过头部字段来进行协商，协商结果通常以不同响应码呈现</p><p>比如客户端通过 Cache-Control，if-None-Match，Last-Modified-Since 字段来跟服务端协商是否可以使用缓存，如果可用，那么服务端会返回 304 的状态码，告知客户端可直接使用缓存，否则返回 200 状态码，并下发新资源，以及新资源的 ETag 和 Last-Modified</p><p>响应码是有分类的，2xx 表示成功、3xx 表示资源需要再多个步骤去获取、4xx 表示客户端的问题、5xx 表示服务端的问题</p><p>常见的比如：</p><ul><li>206 表示请求的是部分资源，也就是断点续传，涉及的头部字段有 Range，If-Range，Content-Range 等</li><li>304 表示缓存资源可用</li><li>301 表示永久重定向，302 临时重定向，303，307，308 也都是重定向，对前两个的扩展</li><li>400 表示参数错误，401 表示未鉴权，403 表示无权限，404 表示资源不存在</li><li>500 表示服务器内部错误</li><li>等等</li></ul><p>另外，如果使用 HTTPS 协议的话，那么在 TCP 连接建立后，还会有一个 TLS 层的密钥协商过程，最后才发送 HTTP 请求</p><p>密钥协商过程其实是这样：</p><ul><li>客户端请求公钥证书并进行验证</li><li>验证通过则随机生成一个密钥，并用公钥加密发送给服务端</li><li>服务端用私钥解密得到客户端发送的密钥</li><li>之后双方就使用对称加密策略即相同密钥来加密解密传输的数据</li></ul><p>在密钥协商的过程，存在中间人攻击的风险，即中间人会分别连接客户端和服务端，对于客户端来说，中间人就相当于它的服务端，它会下发假的公钥给客户端，对于服务端，中间人就相当于它的客户端</p><p>每次客户端发送的数据都先经过中间人，中间人解密就可以窃取到信息，甚至可以篡改后再发送给服务端，这就是中间人攻击</p><p>避免这种被攻击的风险就是客户端需要对公钥进行验证，如何验证呢，也就是引入三方的权威机构</p><p>还有一个考点就是浏览器接收到响应了，但如果发现这是一个跨域请求，就是拦截数据，也就是浏览器的同源限制策略</p><p>同源是协议、域名、端口三者都需要一致才能算是同源，浏览器会对 XMLHttpRequest，fetch 请求，CSS 中的 @font-face 加载的字体资源等做同源限制，对于 script 标签，img 标签等并不会限制</p><p>但有些时候，资源并不都是放置于同一个域中的，这时候就需要能够跨域请求，所以有响应的跨域请求方案，比较常用的是 nginx + CORS</p>`,20),H={href:"http://gitbook.dasu.fun/%E9%9D%A2%E8%AF%95%E9%A2%98%E7%A7%AF%E7%B4%AF/",target:"_blank",rel:"noopener noreferrer"},f=n('<h3 id="_7-浏览器解析-html-页面-进行渲染" tabindex="-1"><a class="header-anchor" href="#_7-浏览器解析-html-页面-进行渲染" aria-hidden="true">#</a> 7. 浏览器解析 HTML 页面，进行渲染</h3><p>当浏览器接收到 HTML 文档资源时，就进入了 HTML 的解析渲染工作了</p><p>网上介绍 HTML 解析流程的基本都会说是这么个流程：</p><ul><li>解析 HTML 建立 DOM 树</li><li>解析 CSS 建立 CSSOM 树</li><li>合并 DOM 和 CSSOM，生成渲染树 Render Tree</li><li>layout（布局），计算每个节点在页面呈现的信息</li><li>paint（绘制），绘制呈现</li></ul><p>当页面刷新时，还会涉及两个概念：重绘、回流</p><ul><li>重绘：重新进行 paint 过程，通常是指元素的背景、颜色发生变化时，不影响整体布局</li><li>回流：因为影响了页面元素的布局，需要重新计算渲染树</li></ul><p>这就是大体上的整个流程，但细节上还有很多可以考，比如说</p><p>这些步骤其实是流水线形式进行的，并不是需要 HTML 文档全部解析完，创建完 DOM 才进行下一步，而是解析 HTML 过程中，识别了某个元素节点，就可以转交下一步处理</p><p>而且，解析 HTML 过程中，是还有可能去下载一些资源的，比如脚本</p><p>这个时候，HTML 的解析是会被阻塞的，因为需要等脚本下载并执行完才能继续往下解析</p><p>另外，CSS 的解析是会阻塞 JS 脚本的执行</p><p>而 HTML 的解析是一个任务源，会创建一个 task 放置到队列里等待浏览器主线程的事件循环去处理</p><p>而浏览器的事件循环在每一轮里，会依次先处理 task，再处理 mircotask，最后才进行渲染工作</p><p>所以，加载网页时，有时会出现一段时间的白屏，最后才呈现，其实就是因为需要等待等个 HTML 解析工作都进行完，才轮到渲染工作，页面也才会被绘制出来</p><p>但有时加载网页时，加载进度并没有完成，网页却已经提前绘制出了部分元素内容了</p><p>这是因为，事件循环在处理 HTML 解析工作时，当解析到某个脚本，这个脚本还没下载完，或者被 CSS 阻塞住了，那么就会暂存当前 task，继续执行 eventloop，也就是处理渲染工作，后续再恢复 task 继续解析 HTML</p><p>还有，当 HTML 解析过程中，遇到需要下载的资源，转而去下载资源，且阻塞 HTML 的解析，虽然解析工作不进行，但还是会进行一些预扫描处理的，也就是扫描后面那些需要下载的资源，并发起下载</p><p>所以，HTML 里的资源并不是一个个同步下载，而是可以并行下载的，这样才能以最快效率完成解析</p><p>这一块的知识点都记得零零散散，因为确实不好理解，我也是看了很多篇博客，一篇参考一点过来，有错误再来改正</p><h3 id="_8-tcp-四次挥手断开连接" tabindex="-1"><a class="header-anchor" href="#_8-tcp-四次挥手断开连接" aria-hidden="true">#</a> 8. TCP 四次挥手断开连接</h3><p>当一段时间后，不需要发送请求了，就会断开连接，TCP 连接的断开需要四次交互：</p><ul><li>发送方发送 FIN 给接收方</li><li>接收方返回 ACK</li><li>一段时间后，接收方发送 FIN 给发送方</li><li>发送方返回 ACK，接收方接收到后关闭连接，发送方一段时间后也断开连接</li></ul><p>FIN 表示想要断开连接，这里之所以用发送方接收方，是因为，断开连接哪方都可以主动断开</p><p>而之所以需要四次交互，之所以比连接时的三次还多一次，是因为，并不是每时每刻双方都准备好要断开连接了</p><p>也就是说，发送方想断开连接表示它已没什么数据需要发送，随时可断，但接收方此时有可能还处于发送数据阶段，所以它只能先告知发送方说知道了，再等等</p><p>等到接收方也没数据需要发送了，此时再告知发送方说，好了，现在就可以断了</p><p>发送方接收到就回说，好，你断吧，这样接收方就可以断开连接了，然后一段时间后，发送方也自己断开了</p><p>所以，当接收方接到发送方想要端口连接的请求时，如果它此时也随时可断的状态，那么 ACK 和 FIN 是可以一起返回的，也就是可以简化成三次交互了</p>',28);function m(b,S){const l=t("ExternalLinkIcon");return r(),s("div",null,[o,e("blockquote",null,[e("p",null,[i("本文参考："),e("a",c,[i("从URL输入到页面展现到底发生什么？"),p(l)])])]),h,e("p",null,[i("具体内容的，我有在"),e("a",T,[i("面试题系列"),p(l)]),i("里写过一篇，在网络分类下，自行查阅")]),u,e("p",null,[i("具体内容的，我有在"),e("a",_,[i("面试题系列"),p(l)]),i("里写过一篇，在网络分类下，自行查阅")]),P,e("p",null,[i("具体请求头字段用途内容的，我有在"),e("a",C,[i("面试题系列"),p(l)]),i("里写过一篇，在网络分类下，自行查阅")]),v,e("p",null,[i("HTTP 相关内容的，我有在"),e("a",H,[i("面试题系列"),p(l)]),i("里写了好几篇，在网络分类下，自行查阅")]),f])}const L=a(d,[["render",m],["__file","从输入URL到页面加载这过程都发生了什么.html.vue"]]);export{L as default};
