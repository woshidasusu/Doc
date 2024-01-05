import{_ as i,r as n,o as s,c as l,a as t,b as e,e as d,d as r}from"./app-pwInIdNR.js";const u={},o=t("h1",{id:"声明",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),e(" 声明")],-1),c=t("p",null,"本系列文章内容全部梳理自以下四个来源：",-1),v=t("li",null,"《HTML5权威指南》",-1),p=t("li",null,"《JavaScript权威指南》",-1),m={href:"https://developer.mozilla.org/zh-CN/docs/Web",target:"_blank",rel:"noopener noreferrer"},h={href:"https://github.com/smyhvae/Web",target:"_blank",rel:"noopener noreferrer"},b=r(`<p>作为一个前端小白，入门跟着这四个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。</p><h1 id="正文-javascript-客户端api-jquery" tabindex="-1"><a class="header-anchor" href="#正文-javascript-客户端api-jquery" aria-hidden="true">#</a> 正文-JavaScript-客户端API &amp; jQuery</h1><p>JavaScript 是用来丰富网站的内容的，让网站支持各种交互行为功能等等。</p><p>JavaScript 是一门脚本语言，自然有它自己的语法标准，这个标准由 ECMAScript 发布，因此相对应的版本标准通常都简写成 ES5、ES6。</p><p>这次入门系列，并不打算先从语法入手学习，而是打算先学学客户端 API，也就是浏览器提供的相关 JS API，用来操作 HTML 文档，毕竟入门学习的话，并不会涉及很多复杂的业务逻辑，相反，大多都是 JS 操作 DOM 的相关操作，因此，先从这方面进行学习。</p><h3 id="基础语法" tabindex="-1"><a class="header-anchor" href="#基础语法" aria-hidden="true">#</a> 基础语法</h3><p>如果有一定的 Java 基础，那么，只需了解下一些基础的 JS 语法，便可开始学习相关的客户端 API，熟悉后，足够编写 JS 代码来操作 DOM，达到动态网页的效果了。</p><ul><li><strong>弱语言类型</strong></li></ul><p>所谓的弱语言类型，就是说，声明变量类型时不必明确声明其类型，只需用 var 声明即可：</p><p>比如 Java 中需要定义如下变量：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>int a;     
float a;
double a;
String a;
boolean a;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而 JavaScript 中，统一用 var 定义一个变量：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><strong>变量的数据类型</strong></li></ul><p>虽然声明变量时，不必指出变量的类型，但也要清楚下，JS 中的基本数据类型 :</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-f00ee7cbc68cca59.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="数据类型"></p><p>在 JavaScript 中，只要是数，就是 Number 数值型的。无论整浮、浮点数、无论大小、无论正负，都是 Number 类型的。</p><p>可以使用内置方法：isNaN()，来判断某个变量是否是数值类型。</p><p>关键字 typeof 可以打出变量的类型，如果需要查看某个变量的类型时。</p><ul><li><strong>类型的强制转换</strong></li></ul><p>转 String:</p><ul><li>变量 + &quot;&quot;</li><li>变量.toString()</li><li>String(变量)</li></ul><p>转 Number:</p><ul><li>parseInt/Float(变量)</li></ul><p>跟 Java 有些类似。</p><ul><li><strong>函数</strong></li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function sum(a, b){
	return a+b;
}

var sum = function(a, b) {
    return a+b;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数声明有两种方式，这两种方式的声明是有一定的区别的，在于 JS 中的声明提前的影响，这部分先不用过多了解，后续详细讲语法时再来讨论。在其他方面，这两种声明方式基本等效。</p><p>当需要有返回值时，直接在最后一行代码里加上 return。函数名也可以省略，此时称匿名函数。</p><p>当定义了函数之后，需要调用函数的时候，直接用函数名()，如 sum(1,2)</p><p>但如果只是想把函数跟某一事件绑定时，此时只需要函数名，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>button.onclick() = sum;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果此时 sum 也带上括号: sum()，那么函数就会被调用，这里需要注意。</p><ul><li><strong>对象</strong></li></ul><p>在 Js 中可以不必像 Java 那样新建个类，然后从这个类 new 出对象。在 Js 中，需要对象时，直接 new Object()，然后赋予想要的属性和行为即可。</p><p>首先创建一个对象：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var obj = new Object();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>向对象中添加属性:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>obj.name = &quot;dasu&quot;;
obj.age = 25;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>对象的属性值可以是任何的数据类型，也可以是个函数：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>obj.sayName = function () {
    console.log(&#39;dasu&#39;);
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建对象的方式也可以用另外一种方式：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var o = {
            name: &quot;dasu&quot;,
            age: 25,
            sayName: function() {
                console.log(this.name);
            }
        };
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然也可以使用类似于 Java 定义类，实例化对象的方式。</p><ul><li><strong>相等比较</strong></li></ul><p>Js 中比较分两种，严格和非严格，对应的操作符：<code>===&amp;!==</code> 和 <code>==&amp;!=</code></p><p>两个等号的比较时，比较的两个变量只要数值上相等，那么就返回 true，三个等号的比较时，需要同时满足类型和数值相等两个条件才会返回 true。</p><p>以上基本的语法了解后，至少就知道如何声明变量、函数、对象，如何使用了，这就足够了，那么接下去就是熟悉下客户端 API，也可以说是浏览器按照标准提供的各 API 的使用。</p><h3 id="dom-概念" tabindex="-1"><a class="header-anchor" href="#dom-概念" aria-hidden="true">#</a> DOM 概念</h3><p>DOM（document object model）：文档对象模型</p><p>了解 JavaScript 基本语法后，就要接着了解 DOM 概念。类似于 CSS 通过选择器来操作 HTML 文档中的元素。那么，同样的道理，js 也需要有个中间媒介来操作 HTML 文档中的元素，这个媒介就是 DOM。</p><h4 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h4><p>那么，什么是 DOM 呢，其实就是浏览器根据 HTML 文档构建出的一颗 DOM 树，树中每个节点对应着 HTML 文档中的每个元素标签，因此树的结构可以很好的表现出各个元素之间的层级关系。</p><p>另外，每个节点都携带着当前元素的所有信息，包括 CSS 作用的样式属性表，设置的类型，id 等等，这些信息可以通过节点的各种属性方法获取到。</p><p>但有一点需要注意下，元素修饰的文本内容也会被创建成一个节点，作为这个元素的子元素加入 DOM 树中。</p><p>这种 DOM 树的概念跟 Android 中的视图树很类似。所以，每份 HTML 文档都会对应一颗 DOM 树。</p><p>JavaScript 可以通过全局变量 document 拿到这个 DOM 树对象，那么之后就可以根据 DOM 提供的各种 API 接口来操纵这颗 DOM 树，包括获取指定节点的元素，动态修改该节点元素的信息，给这个节点元素绑定上事件操作等等。</p><h4 id="模型示例" tabindex="-1"><a class="header-anchor" href="#模型示例" aria-hidden="true">#</a> 模型示例</h4><p>一颗DOM树究竟长什么样子呢？看个例子：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot;&gt;
    &lt;title&gt;博雅&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div&gt;这里&lt;span&gt;行内&lt;/span&gt;不行&lt;/div&gt;
    &lt;p&gt;示例&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述是一份特别简单的 HTML 文档，看看它相对应的 DOM 树 :</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-644928b460e66903.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="DOM"></p><p>这就是对应的 DOM 树，层次分明，各节点都表示相对应的元素信息。但有一点需要注意下，橘色框都是相对应元素的文本内容，它也是 DOM 树中的节点，类型是 Text 对象。并且，并不是一个元素的所有文本内容作为一个 Text 对象，如果文本内容被其他元素标签分割开了，那么这些文本内容会被分割成多份节点，都作为元素的子元素拼接在 DOM 树中。</p><h3 id="兼容性" tabindex="-1"><a class="header-anchor" href="#兼容性" aria-hidden="true">#</a> 兼容性</h3><p>想想，这颗 DOM 树是谁来建模生成的呢？很明显，是浏览器吧，浏览器解析 HTML 文档以及 CSS 后，根据当前的视图建模出一颗 DOM 树出来。并提供了各种 API 接口供 JavaScript 来操纵。</p><p>那么，不同的浏览器厂商实现可能就会有所不同，比如 W3C 规定了一系列操纵 DOM 的 API 接口，但浏览器不想全部实现，就实现了其中核心部分，或者就算实现了，具体表现也有可能有所不同。</p><p>那么，这时就会存在一个问题了，也就是我们通过 JavaScript，然后根据 W3C 规范的 API 接口来操纵 DOM 时，可能在不同浏览器上有不同的变现行为。所以，这时就需要考虑兼容性处理了。</p><p>但有一个更方便的解决方案，那就是使用jQuery，这是一个基于 JavaScript 的框架库，它封装了操纵 DOM 的各种功能，内部对不同浏览器进行了兼容性处理，那么我们使用的时候就可以不用再去考虑那么兼容性的处理了。</p><p>所以，下面会分别介绍 W3C 规范的标准 API 和 jQuery 的使用：</p><h3 id="dom-api" tabindex="-1"><a class="header-anchor" href="#dom-api" aria-hidden="true">#</a> DOM API</h3><h4 id="document" tabindex="-1"><a class="header-anchor" href="#document" aria-hidden="true">#</a> document</h4><p>document 是内置的全局变量，在 JavaScript 可以直接通过该关键字使用，使用时会获取到当前 HTML 文档对应的 Document 对象。</p><p>拿到这个对象后，就可以调用它的一些属性和方法来获取或修改我们想要的数据。</p><table><thead><tr><th>readyState</th><th>查看当前文档的被浏览器加载的状态（加载中等）</th></tr></thead><tbody><tr><td>body/head/title</td><td>直接获取文档的相关元素标签信息</td></tr><tr><td>getElementByXXX()</td><td>根据id，class，tag等在文档中查找指定元素</td></tr><tr><td>createElement(tag)</td><td>创建指定标签的元素节点</td></tr><tr><td>craeteTextNode(text)</td><td>创建指定文本内容的Text对象</td></tr><tr><td>location</td><td>返回当前文档地址的Location对象</td></tr></tbody></table><p>API很多，需要的时候再查就行，主要清楚下，document 是 JavaScript 操纵 DOM 树的入口，从这里开始，可以获取一些关于文档的元数据方面的属性信息，也可以来查找指定的文档中某个节点的元素对象。</p><h4 id="location" tabindex="-1"><a class="header-anchor" href="#location" aria-hidden="true">#</a> location</h4><p>Location 对象提供了细粒度的文档地址信息，也支持导航到其他文档上。当打开新文档在 URL 中有携带了一些信息时，可以通过这个来获取这些信息。</p><table><thead><tr><th>protocol</th><th>获取或设置文档URL的协议部分</th></tr></thead><tbody><tr><td>host</td><td>获取或设置文档URL的主机和端口部分</td></tr><tr><td>href</td><td>获取或设置当前文档的地址</td></tr><tr><td>hostname</td><td>获取或设置文档URL的主机名部分</td></tr><tr><td>port</td><td>获取或设置文档URL的端口部分</td></tr><tr><td>pathname</td><td>获取或设置文档URL的路径部分</td></tr><tr><td>search</td><td>获取或设置文档URL的查询（问号串）部分</td></tr><tr><td>hash</td><td>获取或设置文档URL的锚（#号串）部分</td></tr><tr><td>assign(url)</td><td>导航到指定的URL</td></tr><tr><td>replace(url)</td><td>清除当前文档并导航到新的URL</td></tr><tr><td>reload()</td><td>重新载入当前文档</td></tr><tr><td>resolveURL(url)</td><td>将指定的相对URL解析成绝对URL</td></tr></tbody></table><h4 id="window" tabindex="-1"><a class="header-anchor" href="#window" aria-hidden="true">#</a> window</h4><p>window 直译过来就是窗口，其实也就是表示文档当前所显示的窗口对象，所以一些窗口性的功能都可以通过这个对象来调用。</p><p>比如：调用浏览器弹框、定时器的使用、获取窗口信息包括窗口宽高，屏幕宽高等等、窗口的滑动、操纵浏览器窗口的历史记录、向其他窗口发送消息等等。</p><ul><li>获取窗口相关信息：</li></ul><table><thead><tr><th>innerHeight/Width</th><th>获取窗口内容区域的宽高</th></tr></thead><tbody><tr><td>outerHeight/Width</td><td>获取窗口的宽高，包括边框和菜单栏等等</td></tr><tr><td>screen</td><td>获取描述屏幕的Screen对象</td></tr><tr><td>Screen.width/height</td><td>Screen对象获取屏幕宽高</td></tr><tr><td>Screen.availWidth/Height</td><td>获取屏幕可用的宽高，去掉工具栏菜单栏</td></tr><tr><td>pageX/Yoffset</td><td>获取窗口在水平/垂直方向已滚动过的像素</td></tr><tr><td>document</td><td>获取次窗口关联的Document对象</td></tr><tr><td>history</td><td>访问浏览器历史</td></tr><tr><td>location</td><td>获取当前文档地址的详细信息</td></tr></tbody></table><ul><li>与窗口交互：</li></ul><table><thead><tr><th>blur()</th><th>让窗口失去键盘焦点</th></tr></thead><tbody><tr><td>close()</td><td>关闭窗口（不是所有浏览器都允许js关闭窗口）</td></tr><tr><td>focus()</td><td>让窗口获得键盘焦点</td></tr><tr><td>scrollBy(x, y)</td><td>让文档相对于当前位置进行滚动</td></tr><tr><td>scrollTo(x, y)</td><td>滚动到指定位置</td></tr><tr><td>alert(msg)</td><td>弹出一个对话框</td></tr><tr><td>confirm(msg)</td><td>弹出一个带有确认和取消的对话框</td></tr><tr><td>showModalDialog(url)</td><td>弹出窗口，显示指定的URL</td></tr><tr><td>postMessage(msg, origin)</td><td>给另一个文档发送消息</td></tr><tr><td>set/clearInterval(fun, time)</td><td>创建/撤销周期性的任务</td></tr><tr><td>set/clearTimeout(fun, time)</td><td>创建/撤销延时任务</td></tr></tbody></table><h4 id="htmlelement" tabindex="-1"><a class="header-anchor" href="#htmlelement" aria-hidden="true">#</a> HTMLElement</h4><p>通过 document 获取到 Document 对象，以此来获取操纵 DOM 的入口，根据需要获取所需的文档相关信息，或者搜索指定的 DOM 中节点的元素，此时这个节点的元素对象就是 HTMLElement 对象。</p><p>所有的标签元素的基类对象都是 HTMLElement，这个类定义的公共的、基础的操作元素节点的方法和属性。</p><p>但每个标签实际上都有具体的实现类，比如 body 对应 HTMLBodyElement，script 对应 HTMLScriptElement，具体实现类由这个标签独有的属性和方法。</p><p>基类 HTMLElement 对象定义的基础的方法、属性包括：获取或修改元素的指定属性，添加或移除元素某个 class，查看或修改该标签包装的内容等等。</p><ul><li>元素的元数据属性：</li></ul><table><thead><tr><th>classList</th><th>获取元素设置的class列表，返回DOMTokenList对象，可直接add,remove等操作</th></tr></thead><tbody><tr><td>className</td><td>获取元素设置的class列表，返回字符串</td></tr><tr><td>disabled/hidden/id</td><td>获取或设置disable/hidden/id…</td></tr><tr><td>attributes</td><td>获取元素设置的属性值列表，返回Attr[]对象</td></tr><tr><td>innerHTML</td><td>获取元素标签包装的内容，包括文本内容及子元素</td></tr><tr><td>outerHTML</td><td>获取元素整个内容</td></tr></tbody></table><ul><li>节点元素操纵</li></ul><table><thead><tr><th>get/has/removeAttribute(name)</th><th>获取/判断/移除元素的某个属性</th></tr></thead><tbody><tr><td>setAttribute(name, value)</td><td>设置元素的某个属性</td></tr><tr><td>appendChild(HTMLElement)</td><td>为当前元素添加子元素</td></tr><tr><td>cloneNode(boolean)</td><td>拷贝一份当前的元素，返回新的HTMElement对象，参数设置是否拷贝当前元素的子元素</td></tr><tr><td>isEqualNode(HTMLElement)</td><td>判断指定元素与当前是否相同，具有相同的class，相同的属性，相同的子元素</td></tr><tr><td>isSameNode(HTMLElement)</td><td>判断是否是同一个元素</td></tr><tr><td>removeChild(HTMLElement)</td><td>移除指定的子元素</td></tr><tr><td>replaceChild(HTMLElement, H.)</td><td>替换指定的子元素</td></tr></tbody></table><h3 id="dom-事件" tabindex="-1"><a class="header-anchor" href="#dom-事件" aria-hidden="true">#</a> DOM 事件</h3><p>通过上述一些方法，JavaScript 可以定位找到所需的元素，然后也可以动态的修改相关数据，但通常，这些动态修改的操作都是用户操作了某些事件后去触发的。</p><p>所以，即使找到了元素后，还需要将元素与一些事件进行绑定，比如点击事件等等。</p><p>有两种方式让元素绑定事件和处理的方法：</p><h4 id="addeventlistener" tabindex="-1"><a class="header-anchor" href="#addeventlistener" aria-hidden="true">#</a> addEventListener</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var aElems = document.getElementsByTagName(&quot;a&quot;);
for (var i = 0; i &lt; aElems.length; i++) {
    aElems[i].addEventListener(&quot;click&quot;, function () {
        console.log(&quot;addEventListener:&quot; +  this);
    });
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用 HTMLElement 对象的 <code>addEventListener()</code> 方法，第一个参数传入需要监听的事件名称，第二个参数为事件触发时的响应方法。</p><p>相对应的，还有一个 <code>removeEventListener()</code> 方法，同样接收这两个参数。</p><h4 id="onxxx" tabindex="-1"><a class="header-anchor" href="#onxxx" aria-hidden="true">#</a> onXXX</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var aElems = document.getElementsByTagName(&quot;a&quot;);
for (var i = 0; i &lt; aElems.length; i++) {
    aElems[i].onclick = function () {
        console.log(&quot;onclick:&quot; +  this);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二种方式，是在需要注册的事件类型前面加 on 作为元素的属性来注册事件的监听，这种比较常见。</p><h4 id="所有事件类型" tabindex="-1"><a class="header-anchor" href="#所有事件类型" aria-hidden="true">#</a> 所有事件类型</h4><ul><li>document 的事件</li></ul><table><thead><tr><th>事件类型</th><th>含义</th></tr></thead><tbody><tr><td>readystatechange</td><td>readyState属性值发生变化时触发，也就是文档加载的不同阶段触发</td></tr></tbody></table><ul><li>window 的事件</li></ul><table><thead><tr><th>onabort</th><th>在文档或资源加载过程中被终止时触发</th></tr></thead><tbody><tr><td>onerror</td><td>在文档或资源加载发生错误时触发</td></tr><tr><td>onhaschange</td><td>在锚部分发生变化时触发</td></tr><tr><td>onload</td><td>在文档或资源加载完成时触发</td></tr><tr><td>onresize</td><td>在窗口缩放时触发</td></tr><tr><td>onunload</td><td>在文档从窗口或浏览器中卸载时触发</td></tr></tbody></table><ul><li>鼠标事件</li></ul><table><thead><tr><th>click</th><th>单击，释放时触发</th></tr></thead><tbody><tr><td>dblclick</td><td>双击，释放时触发</td></tr><tr><td>mousedown</td><td>点击鼠标键时触发</td></tr><tr><td>mouseenter</td><td>在光标移入元素或某个后代元素所占据的屏幕区域时触发</td></tr><tr><td>mouseleave</td><td>在光标移出元素及所有后代元素所占据的屏幕区域时触发</td></tr><tr><td>mousemove</td><td>光标在元素上移动时触发</td></tr><tr><td>mouseout</td><td>与mouseleave基本相同，除了当光标仍然在某个后代元素上时也会触发</td></tr><tr><td>mouseenter</td><td>与mouseenter基本相同，除了当光标仍然在某个后代元素上时也会触发</td></tr><tr><td>mouseup</td><td>当释放鼠标时触发</td></tr></tbody></table><p>鼠标事件被触发时，指定的处理方法都会传入一个 MouseEvent 对象，该对象携带一些额外的属性和方法供处理。</p><ul><li>MouseEvent</li></ul><table><thead><tr><th>button</th><th>标明点击的是哪个键，0：鼠标主键，1：中键，2：次键</th></tr></thead><tbody><tr><td>altkey</td><td>事件触发时是否有点击alt键</td></tr><tr><td>clientX</td><td>事件触发时鼠标相对于元素视口的X坐标</td></tr><tr><td>clientY</td><td>事件触发时鼠标相对于元素视口的Y坐标</td></tr><tr><td>screenX</td><td>事件触发时鼠标相对于屏幕坐标系的X坐标</td></tr><tr><td>screenY</td><td>事件触发时鼠标相对于屏幕坐标系的Y坐标</td></tr><tr><td>shiftKey</td><td>事件触发时是否有点击shift键</td></tr><tr><td>ctrlKey</td><td>事件触发时是否有点击ctrl键</td></tr></tbody></table><ul><li>键盘焦点事件</li></ul><table><thead><tr><th>blur</th><th>在元素失去焦点时触发</th></tr></thead><tbody><tr><td>focus</td><td>在元素获得焦点时触发</td></tr><tr><td>focusin</td><td>在元素即将获得焦点时触发</td></tr><tr><td>focusout</td><td>在元素即将失去焦点时触发</td></tr></tbody></table><p>键盘焦点事件传入的是 FocusEvent 对象。</p><ul><li>键盘点击事件</li></ul><table><thead><tr><th>keydown</th><th>在用户按下某个键时触发</th></tr></thead><tbody><tr><td>keypress</td><td>在用户按下并释放某个键时触发</td></tr><tr><td>keyup</td><td>在用户释放某个键时触发</td></tr></tbody></table><p>键盘点击事件传入的是 KeyboardEvent 对象。</p><h3 id="jquery" tabindex="-1"><a class="header-anchor" href="#jquery" aria-hidden="true">#</a> jQuery</h3><h4 id="为什么使用-jquery" tabindex="-1"><a class="header-anchor" href="#为什么使用-jquery" aria-hidden="true">#</a> 为什么使用 jQuery</h4><p>类似于 JVM 隐藏了不同操作系统之间的差异，让开发能够更专注于功能的实现，而不必花费过多时间适配不同操作系统。jQuery 隐藏了不同浏览器之间的差异，减少开发者花费在适配不同浏览器之间的精力。</p><p>举个例子：float 属性</p><p>原生 js 的话，ie 需要通过 styleFloat 获取对象修改，W3C 标准为 cssFloat，jQuery 统一封装成 float，内部会自动根据不同浏览器的实现进行处理。</p><p>同时，它封装了很多基本实用的功能，如 ajax，基本动画等。</p><h4 id="api-中文文档" tabindex="-1"><a class="header-anchor" href="#api-中文文档" aria-hidden="true">#</a> API 中文文档</h4><p>[http://www.css88.com/jqapi-1.9/css/](http://www.css88.com/jqapi-1.9/css/)</p><h4 id="ajax" tabindex="-1"><a class="header-anchor" href="#ajax" aria-hidden="true">#</a> Ajax</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$.ajax({
    url: &quot;https://easy-mock.com/mock/5b592c01e4e04f38c7a55958/ywb/is/version/checkVersion&quot;,
    data: {&quot;key&quot;: 122},
    type: &quot;POST&quot;,
    success: function (data) {
        logUtils(data.content);
        var con = JSON.parse(data.content);
        callback &amp;&amp; callback(con);//通知回调
    },
    error: function (e) {
        logUtils(e);
    }
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="css" tabindex="-1"><a class="header-anchor" href="#css" aria-hidden="true">#</a> CSS</h4><ul><li>修改 display 样式</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//第一种方式
$(&quot;div&quot;).css(&quot;display&quot;, &quot;none&quot;);
$(&quot;span&quot;).css({display:&quot;block&quot;, background: &quot;#f2f&quot;});//好用
$(&quot;span&quot;).css({&quot;display&quot;:&quot;block&quot;, &quot;background&quot;: &quot;#f2f&quot;});//这种也可以
//第2种方式
$(&quot;div&quot;).each(function () {
    this.style.display = &quot;none&quot;;
});
$(&quot;div&quot;)[0].style.display = &quot;none&quot;;
//第3种方式
$(&quot;div&quot;).show();//等效于display:block(inline)
$(&quot;div&quot;).hide();//等效于display:none
$(&quot;div&quot;).toggle();//取相反的值
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>读取样式</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(&quot;div&quot;).css(&quot;display&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="class" tabindex="-1"><a class="header-anchor" href="#class" aria-hidden="true">#</a> class</h4><ul><li>添加 class</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(selector).addClass(&quot;liItem&quot;);  //为指定元素添加类className
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>移除 class</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(selector).removeClass(&quot;liItem&quot;);  //为指定元素移除类 className
$(selector).removeClass();          //不指定参数，表示移除被选中元素的所有类
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>判断有没有指定 class</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(selector).hasClass(&quot;liItem&quot;);   //判断指定元素是否包含类 className
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>切换 class</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(selector).toggleClass(&quot;liItem&quot;);    //为指定元素切换类 className，该元素有类则移除，没有指定类则添加
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>应用场景</li></ul><p>当 js 动态修改的样式较少时，可直接通过 .css() 实现。</p><p>当 js 动态修改的样式比较多时，选择 class 操作较方便，事件将需要的样式写在 css 中，在 js 里直接添加或移除指定 class 实现。</p><p>如果考虑以后维护方便（把 CSS 从 js 中分离出来）的话，推荐使用类的方式来操作。</p><h4 id="html" tabindex="-1"><a class="header-anchor" href="#html" aria-hidden="true">#</a> html</h4><ul><li>创建元素</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//类似于js中: document.createElement(&quot;标签名&quot;)
var node1 = $(&quot;&lt;span&gt;我是一个span元素&lt;/span&gt;&quot;);//返回的是jQuery对象
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>添加子元素</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//方式1:在.main元素的子元素末尾加入新的子元素
$(&quot;.main&quot;).append(node1);
$(&quot;.main&quot;).append(&quot;&lt;span&gt;我是一个span元素&lt;/span&gt;&quot;);
//方式2:在.main元素的子元素开头加入新的子元素
$(&quot;.main&quot;).prepend(&quot;&lt;span&gt;我是第一个span元素&lt;/span&gt;&quot;);
//方式3：替换掉所有子元素内容
$(&quot;.main&quot;).html(&quot;&lt;span&gt;我把所有子元素都替换掉了&lt;/span&gt;&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>添加兄弟元素</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(&quot;.main&quot;).after(&quot;&lt;span&gt;我是兄弟后span元素&lt;/span&gt;&quot;);
$(&quot;.main&quot;).before(&quot;&lt;span&gt;我是兄弟前span元素&lt;/span&gt;&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>移除 html</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//移除所有子元素
$(&quot;.main&quot;).html(&quot;&quot;);
//移除自已，自然子元素也被跟着移除
$(&quot;.main&quot;).remove();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>查看元素内容（包括标签）</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>console.log($(&quot;.main&quot;).html());//下面是元素标签和打出的日志
$(&quot;.main&quot;).prepend(&quot;&lt;span&gt;我是第&lt;a&gt;dsfds&lt;span&gt;23543&lt;/span&gt;&lt;/a&gt;一个span元素&lt;/span&gt;&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://upload-images.jianshu.io/upload_images/1924341-5b6fd09f655b28b3.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="jquery1"></p><ul><li>查看元素的纯文本内容</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>console.log($(&quot;.main&quot;).text());//下面是元素标签和打出的日志
$(&quot;.main&quot;).prepend(&quot;&lt;span&gt;我是第&lt;a&gt;dsfds&lt;span&gt;23543&lt;/span&gt;&lt;/a&gt;一个span元素&lt;/span&gt;&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://upload-images.jianshu.io/upload_images/1924341-068ee7907828bde2.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="jquery2"></p><p>text() 会返回当前元素内的所有文本内容，包括子孙后代元素所包装的文本内容。</p><ul><li>小结</li></ul><p>获取元素的内容（包括标签）可用 <code>html()</code>，创建元素时用 <code>$ (&quot;xxx&quot;)</code>，如果元素只有一个子元素，那么获取文本内容时可直接用 <code>text()</code>，添加子元素时用 <code>append()</code>。</p><h4 id="attr" tabindex="-1"><a class="header-anchor" href="#attr" aria-hidden="true">#</a> attr</h4><ul><li>设置属性</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(selector).attr(&quot;title&quot;, &quot;生命壹号&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>获取属性</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(selector).attr(&quot;title&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>移除属性</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(selector).removeAttr(&quot;title&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,174);function g(q,j){const a=n("ExternalLinkIcon");return s(),l("div",null,[o,c,t("ul",null,[v,p,t("li",null,[t("a",m,[e("MDN web docs"),d(a)])]),t("li",null,[t("a",h,[e("Github:smyhvae/web"),d(a)])])]),b])}const x=i(u,[["render",g],["__file","前端入门6-JavaScript-客户端api_jQurey.html.vue"]]);export{x as default};
