import{_ as l,r as s,o as d,c as r,a as i,b as e,e as a,d as c}from"./app-pwInIdNR.js";const v={},o=i("h1",{id:"声明",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),e(" 声明")],-1),u=i("p",null,"本系列文章内容全部梳理自以下几个来源：",-1),t=i("li",null,"《JavaScript权威指南》",-1),p={href:"https://developer.mozilla.org/zh-CN/docs/Web",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/smyhvae/Web",target:"_blank",rel:"noopener noreferrer"},b={href:"https://github.com/goddyZhao/Translation/tree/master/JavaScript",target:"_blank",rel:"noopener noreferrer"},h=c(`<p>作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。</p><p>PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。</p><h1 id="正文-作用域" tabindex="-1"><a class="header-anchor" href="#正文-作用域" aria-hidden="true">#</a> 正文-作用域</h1><p>在 ES5 中，变量的作用域只有两类：</p><ul><li><p>全局作用域</p></li><li><pre><code>    函数作用域
</code></pre></li></ul><p>只要不是在函数内部定义的变量，作用域都是全局的，全局的变量在哪里都可以被访问到，即使跨 js 文件。</p><p>函数作用域是指在函数体定义的变量，不管有没有在函数体的开头定义，在函数体的任何地方都可以被使用，因为 JavaScript 中的变量有声明提前的行为。</p><p>函数作用域需要区别于 Java 语言中的块级作用域：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var i = 0;
function A() {
    console.log(i); //输出undefined
    for (var i = 0; i &lt; 1; i++) {}
    console.log(i); //输出1
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Java 中，类似的代码，在 for 循环前后输出的 i 都会是 0，因为都会使用成员变量 i，for循环内定义的 i 由于块级作用域限制，只在for 循环的 {} 大括号中的代码有效。</p><p>但在 JavaScript 中，变量作用域只分函数作用域，而且变量有声明提前的特性，所以在函数体内部第一次输出 i 时，此时变量已经提前声明，但还没初始化，所以会是 undefined。而函数内定义的变量的作用域或者说生命周期是整个函数内，所以即使 for 循环体语句结束，仍旧可以访问到 i 变量。</p><p>由于允许变量的重复定义，所以全局变量很容易起冲突，因为无法确保多份 js 文件中是否已经在全局中定义了该变量，一旦起冲突，浏览器行为仅仅是将后定义的覆盖掉前定义的而已，这对于浏览器角度没什么大问题，但对于程序而已，很容易出现不可控的问题。而且，极难排查。</p><p>所以，实际编程中，建议不要过多的使用全局变量，有多种方法可以避免：</p><ul><li>使用一个全局对象来作为命名空间，将其余不在函数体内部定义的变量，作为该全局对象的属性来定义使用。</li><li>使用一个立即执行的函数来作为临时命名空间，函数执行结束释放临时命名空间。</li><li>如果临时命名空间内的部分变量需要供外部使用，一可以将这部分变量添加到作为命名空间的全局对象上的属性，二可以利用闭包的特性，返回一个新建的对象，为该对象添加一些接口可访问这部分变量。</li></ul><h3 id="全局对象作为命名空间" tabindex="-1"><a class="header-anchor" href="#全局对象作为命名空间" aria-hidden="true">#</a> 全局对象作为命名空间</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var DASU = {};
DASU.num = 1;
function a() {
    console.log(DASU.num);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的全局对象意思是说，数据类型为对象的全局变量，简称全局对象，与前端里说的全局对象window是两个不同概念，区分一下。</p><p>其实也就是一种思想，将所有函数外需要定义的变量，都替换成对指定对象的属性来操作。</p><h3 id="立即执行的函数作为临时命名空间" tabindex="-1"><a class="header-anchor" href="#立即执行的函数作为临时命名空间" aria-hidden="true">#</a> 立即执行的函数作为临时命名空间</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>(function () {
    var num = 1;
    function a() {
        console.log(num);
    }
    a();
}())
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当引入 js 文件到 HTML 时，js 文件中的代码就会被执行，或者声明了 &lt;script&gt; 标签后，在标签内的代码也会立马被执行。但函数只有被调用的时候才会执行，所以，如果我们使用一个立即执行的函数，那这个函数体内部的代码行为就跟正常的 js 文件代码被执行的行为一致了。</p><p>而且，还可以利用函数内作用域这一特点，来保证，在这个立即执行的函数内部定义的变量不会影响到全局变量。</p><p>缺点就是函数内部代码执行结束后，这些在函数内定义的变量就被回收了。所以，如果有些信息需要跨 js 文件通信，此时要么通过全局对象方式，要么通过闭包特性来辅助实现。</p><h3 id="临时命名空间内的变量共享方式" tabindex="-1"><a class="header-anchor" href="#临时命名空间内的变量共享方式" aria-hidden="true">#</a> 临时命名空间内的变量共享方式</h3><p>全局变量可以在任何地方被访问，所以可以将那些需要共享给外部使用的临时命名空间内的变量赋值给全局对象的属性，即结合第一种：全局对象做命名空间方式。</p><p>或者，通过闭包的特性，作为临时命名空间的立即执行的函数需要有一个返回值，当外部持有这个返回值时，这个函数内的变量就不会被回收。</p><p>然后，返回值可以是一个对象，公开一些接口来获取这些需要共享的变量，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var model = (function () {
    var num = 1;
    function a() {
        console.log(num);
    }
    return {
        getNum: function () {
            return num;
        }
    }
}());
model.getNum();

//或者：
var model = (function () {
    var num = 1;
    function a() {
        console.log(num);
    }
    return {
        num:num
    }
}());
model.num;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变量的声明提前原理" tabindex="-1"><a class="header-anchor" href="#变量的声明提前原理" aria-hidden="true">#</a> 变量的声明提前原理</h3><p>看个例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var i = 0;
function A() {
    console.log(i); //输出undefined
    for (var i = 0; i &lt; 1; i++) {}
    console.log(i); //输出1
}
A();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数内第一个输出 undefined 是因为变量的声明提前，第二个输出 1 是因为变量作用域为函数作用域，而不是块级作用域。</p><p>那么，有想过，这些似乎理所当然的基础常识原理是什么吗？</p><p>我们先来看些理论，再结合理论返回来分析这个例子，但只分析变量的声明提前原理，至于作用域的原理留着作用域链一节分析。</p><h4 id="理论" tabindex="-1"><a class="header-anchor" href="#理论" aria-hidden="true">#</a> 理论</h4><p>我们之前有介绍过执行上下文 EC，和变量对象 VO，执行上下文分全局执行上下文和函数执行上下文。在全局执行上下文中，VO 的具体表现是全局对象；在函数执行上下文中，VO 的具体表现是 AO，AO 存储着函数内的变量：形参、局部变量、函数自身引用、this、arguments。</p><p>不管是执行函数代码还是全局代码，js 解释器会分两个过程，有的文章翻译成：进入执行上下文阶段、执行代码阶段（我不怎么喜欢这个翻译）。</p><p>进入执行上下文阶段：其实本质上就是创建一个执行上下文，这个阶段会解析当前上下文内的代码，将声明的变量都保存到 VO 对象上。</p><p>执行代码阶段：就是代码实际运行期，当运行到相对应的变量的赋值语句时，就会将具体的属性值写入 VO 对象上保存的对应变量。</p><p>也就是说，在执行代码阶段，代码实际运行时，js 解释器已经解析了一遍上下文内的代码，并创建了执行上下文，且为其添加了一个 VO 属性，在 VO 对象上添加了上下文内声明的所有变量，这就是变量的声明提前行为。而之后函数体内对各变量的操作，其实是对 VO 上保存的变量进行操作了。</p><p>我看过一篇文章对这两个过程的翻译是：解析阶段、执行阶段。</p><p>我比较喜欢这种翻译，解析阶段主要的工作就是解析上下文内的代码，创建执行上下文，创建变量对象 VO 等，为执行阶段做准备；而执行阶段就是代码实际运行过程。</p><h4 id="分析" tabindex="-1"><a class="header-anchor" href="#分析" aria-hidden="true">#</a> 分析</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var i = 0; 
function A() {
    console.log(i); //输出undefined
    for (var i = 0; i &lt; 1; i++) {}
    console.log(i); //输出1
}
A();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再回过头来看这个简单的例子，假设这段代码放在一份单独的 js 文件中，解释器第一次执行这份代码，那么当执行全局代码时，首先进入全局执行上下文的解析阶段：</p><ol><li>解析代码创建全局执行上下文</li><li>创建VO，并为其添加属性 i、A</li><li>省略该过程其他工作</li><li>将创建的全局EC放入ECS栈内</li></ol><p><img src="https://upload-images.jianshu.io/upload_images/1924341-0b70791ca5fd5fca.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>当实际开始执行第一行全局代码时，js解释器经过了解析阶段已经做了如上的工作，得到了一些基本的信息。之后便是执行全局代码，如果执行的代码是访问全局变量，那么直接读取全局 EC 中 VO 里的对应变量；如果是对全局变量赋值操作，那么写入全局 EC 中的 VO 里对应变量的属性值。</p><p>如果执行的代码是调用某个函数，此时就会为这个函数的执行创建一个函数执行上下文，那么这个过程同样需要两个阶段：解析阶段和执行阶段。</p><p>所以当代码执行到最后一行 <code>A()</code> 时，此时新的函数执行上下文的解析阶段做的工作：</p><ol><li>解析 A() 函数内代码，并创建函数执行上下文 A函数EC</li><li>创建 AO，并为其添加属性</li><li>省略其他工作介绍</li><li>将创建的A函数EC放入ECS栈内</li></ol><p><img src="https://upload-images.jianshu.io/upload_images/1924341-936ac1b48ae4f098.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>所以当执行函数 A 内的代码时，第一行输出才会输出 undefined，因为变量的声明提前特性在调用函数时创建函数执行上下文的过程中，已经解析了函数内的声明语句，并将这些变量添加到函数上下文 EC 的 AO 中了。</p><p>AO 就是变量对象 VO 在函数执行上下文中的具体表现。</p><p>而当执行完 for 循环语句，A 函数 EC 中的 AO 里的i属性已经被赋值为 1 了，而 A 函数 EC 是直到函数执行结束才销毁，所以即使在 for 语句内定义的 i 变量也可以在后面继续使用。</p><p>以上，就是变量声明提前的原理，当然，创建执行上下文的过程中，还涉及到其他很多工作，用来实现例如作用域链等机制，留待后续来说。</p>`,56);function g(f,_){const n=s("ExternalLinkIcon");return d(),r("div",null,[o,u,i("ul",null,[t,i("li",null,[i("a",p,[e("MDN web docs"),a(n)])]),i("li",null,[i("a",m,[e("Github:smyhvae/web"),a(n)])]),i("li",null,[i("a",b,[e("Github:goddyZhao/Translation/JavaScript"),a(n)])])]),h])}const A=l(v,[["render",g],["__file","前端入门17-JavaScript进阶之作用域.html.vue"]]);export{A as default};
