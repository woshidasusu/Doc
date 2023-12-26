# 讲讲 XSS、CSRF、中间人攻击等

> 本文参考：[前端面试查漏补缺--(七) XSS攻击与CSRF攻击]( https://juejin.im/post/5c6d142151882503b3271f4b)

###  XSS 攻击

#### 概念

XSS：Cross-Site Script 跨站脚本攻击，是一种**代码注入攻击**

顾名思义，XSS 攻击就是将非源站的脚本注入到网页中执行来进行攻击，只要能将外部脚本注入到网页并让脚本代码运行，那么就可以通过 js 来获取一些隐私如 Cookie 等信息，甚至让网页重定向到危险网站或者直接让网页瘫痪

所以，XSS 攻击的关键在于代码注入

那么，什么地方会存在代码被注入且执行的场景呢？

无外乎就是用户可以输入的地方，且输入的信息又会被显示到页面的时候

输入提供了注入的方式，显示则提供了脚本的运行，常见的功能有评论区

#### 原理

那么它是如何将代码注入并运行来进行攻击的呢？

假如有个输入框，输入的内容会被显示到页面上，那如果我们输入：

```
"/> <script>alert(1)</script>
```

 类似于 sql 注入攻击一样，通过输入提前结束符，让后续的 script 能够被作为一个 html 标签识别运行，那么后面这段脚本代码就会被执行，而这个脚本代码并非本站，而是来自其他恶意源站，所以这种攻击叫跨站脚本攻击

除了提前结束符外，也可以利用标签的 src 或者 onerror 等这些可以执行 js 代码的机制，来注入脚本

#### 预防

预防措施分两方面，一是避免被攻击，二是被攻击了，但尽可能减少危害

要避免攻击，其实就是要阻止代码的注入，所以对那些用户的输入都应该做处理，比如对输入做过滤、做检查、是否符合格式要求，如果是 HTML，那么对其进行转义，避免直接在页面上显示 HTML 代码，如果是有富文本需求，那么可以结合白名单的机制

其实，现在前端的开发基本都会基于三大框架，而这些处理，在框架层面已经帮忙做了，所以现在很少需要自己再去做这些安全防范工作，但框架仍旧会留有原生接口，所以一旦使用到，还是需要知道这些思路的

再来，如果没考虑全，被攻击了，那么应该尽量将危害降到最低，说白了，就是不能让攻击者可以获取到一些隐私信息，比如将 Cookie 设置成 HttpOnly，这样 js 就读取不到了

### CSRF 攻击

#### 概念

CSRF：Cross-site request forgery 跨站请求伪造攻击，是一种利用后端程序漏洞的攻击

顾名思义，跨站请求伪造攻击，就是利用伪造成真实用户对服务器发起请求来进行攻击

那么，要如何伪造成真实用户呢？

其实，也就是利用了 HTTP 在发请求时，会自动携带上 Cookie 的机制，而后端通常又是通过 Cookie 来保存一个用户的登录状态

所以攻击者甚至都不用去窃取 Cookie，只要用户登录过目标网站，那么浏览器就会保存 Cookie，在过期前，恶意网站内部可以隐式的对目标网站接口发起请求，就可以伪装成真实用户去访问了

因为对于后端来说，他并无法区分此次的请求是用户自己操作的，还是恶意网站内部发起的请求

#### 原理

> 下图来自：[浅谈CSRF攻击方式](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)，侵权删

![](https://pic002.cnblogs.com/img/hyddd/200904/2009040916453171.jpg)

所以，完成一次 CSRF 攻击，必须有两个步骤：

- 登录网站 A
- 在不登出网站 A 情况下，访问危险网站 B

#### 预防

这种攻击其实可以算是后端程序的漏洞，后端对接口请求者的身份验证存在漏洞

所以预防这种攻击，需要后端对接口请求者的身份加强认证

但这肯定会造成一些性能问题，所以，通常是涉及一些敏感接口时，来加强二次认证

认证方式可以是验证码、或者 token、或者检查请求来源

### 中间人攻击

#### 概念

本来正常的用户使用网站的流程是，用户的客户端与服务端双方建立连接，进行通信

而中间人攻击，就是攻击者分别与客户端和服务端建立连接，用户访问的实际上攻击者伪造的网站，然后攻击者将用户的请求转发给真正的服务端，再将服务端返回的信息丢给用户的客户端

也就是中间人攻击的情况下：用户客户端 <=> 攻击者 <=> 服务端

这样一来，攻击者其实就完全监视了双方的通信，就可以窃取一些隐私，甚至是伪造、修改通信信息

#### 预防

网络的请求可能经过很多代理，所以很难从避免请求被中间人监听这方面去预防

但可以从攻击者有哪些攻击角度来预防，对于中间人攻击，它能进行的攻击无外乎两者：一是窃取隐式、二是伪造、修改通信信息

对于第一点，就需要对通信的信息进行加密处理，可以客户端服务端双方自行实现加密机制，也可以直接使用 HTTPS 协议

对于第二点，则是保证请求响应的完整性、一致性，通常可以用 token 来处理，但其实，只要对通信信息进行加密后，攻击者也就无从去伪造了

### [MDN web安全]( https://developer.mozilla.org/zh-CN/docs/Web/Security)

这里介绍下 MDN web 安全系列里的一些内容

#### 内容安全策略（CSP）

- 概念

内容安全策略（CSP）是一个额外的安全层，可以用来检测并削弱某些特定类型的攻击，比如跨站脚本工具（XSS）和数据注入攻击等

CSP 是通过指定有效域来让浏览器明确知道，只有哪些认可的域的脚本是信任的，是可以执行的，其他域的脚本浏览器一概忽略不执行

- 使用方式

有两种使用方式，一是通过响应头中的 Content-Security-Policy 字段来启用，二是通过 html 的 meat 标签，如：

```
// 所有内容只允许来自站点的同一个源，不包括其子域名
Content-Security-Policy: default-src 'self'
```

```
// 允许内容来自信任的域名及其子域名
Content-Security-Policy: default-src 'self' *.trusted.com
```

```
// 允许图片来自任何源，但音视频和脚本只能来自信任的源
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com
```

```
// 该服务器仅允许通过HTTPS方式并仅从onlinebanking.jumbobank.com域名来访问文档
Content-Security-Policy: default-src https://onlinebanking.jumbobank.com
```

```
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
```

可以配置各种策略，如：

default-src：默认策略，下面这些策略的默认配置

child-src：文档里 iframe 嵌套的源配置

connect-src：指定 XMLHttpRequest、WebSocket、EventSource 的连接来源

font-src：指定通过 @font-face 加载字体的来源

img-src：指定能被 img 标签加载的来源

media-src：指定能被 audio 和 video 加载的来源

object-src：指定能被 object 和 embed 和 applet 加载的来源

script-src：禁止使用内联 script 脚本和 eval，除非设置 unsafe-inline 和 unsafe-eval 来开启，且指定可执行脚本的来源

- 发送报告

如果被攻击了，还可以设置 report-uri 来发送报告到指定的 uri

```
Content-Security-Policy: default-src 'self'; report-uri http://reportcollector.example.com/collector.cgi
```

#### 子资源完整性（SRI）

SRI：Subresource Integrity 子资源完整性

是一种允许浏览器检查其获得的资源是否被篡改的安全特性，通过获取文件的 hash 值和提供的 hash 值比对来判断

缓存在 CDN 上的资源存在被攻击、篡改、替换的危险，可以通过该安全特性，来让浏览器在使用这些资源前进行完整性检测

- 使用

```html
<script src="https://example.com/example-framework.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>
```

浏览器在 script 或 link 标签中遇到 integrity 属性后，会在执行脚本或应用样式表之前比对所加载的文件 hash 值与期望的是否一致，当不一致时，浏览器会拒绝使用，并报告错误

#### X-Frame-Options

这是响应头中的字段，虽然非标准，但被广泛浏览器支持，用来指示是否允许页面被使用到 frame，iframe，embed，object 中，即可以确保网站有没有被嵌入到别人的网页中，这样可以来避免一些点击劫持攻击

CSP 中的 Content-Security-Policy 也有支持该功能

- 使用

```
X-Frame-Options: deny
X-Frame-Options: sameorigin
X-Frame-Options: allow-from https://example.com/
```

deny：表示该页面不允许在 frame 中展示

sameorigin：表示该页面允许在同域页面的 frame 中展示

allow-from xxx：表示页面可以在指定来源的 frame 中展示

#### HTTP Strict Transport Security（HSTS）

这是一种安全功能，用来告诉浏览器只能通过 HTTPS 访问当前资源

通过在响应头中使用 Strict-Transport-security 字段来启用

- 使用方式

```
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
```

max-age：过期时间

includeSubDomains：此规则适用于该网站所有子域名