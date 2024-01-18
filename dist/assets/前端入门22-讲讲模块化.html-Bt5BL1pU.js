import{_ as l,r,o as a,c as o,a as e,b as i,e as s,d}from"./app-xJrSpaa5.js";const t={},u=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),i(" 声明")],-1),c=e("p",null,"本篇内容摘抄自以下来源：",-1),m={href:"https://github.com/smyhvae/Web",target:"_blank",rel:"noopener noreferrer"},p={href:"https://segmentfault.com/a/1190000011081338",target:"_blank",rel:"noopener noreferrer"},v={href:"https://huangxuan.me/js-module-7day/#/4",target:"_blank",rel:"noopener noreferrer"},b={href:"http://es6.ruanyifeng.com/#docs/module-loader",target:"_blank",rel:"noopener noreferrer"},h={href:"http://javascript.ruanyifeng.com/nodejs/module.html",target:"_blank",rel:"noopener noreferrer"},g=d(`<p>感谢各位大佬的分享，解惑了很多。</p><h1 id="正文-模块化" tabindex="-1"><a class="header-anchor" href="#正文-模块化" aria-hidden="true">#</a> 正文-模块化</h1><p>现在回过头来想想，也许选择以《JavaScript权威指南》一书来作为入门有些不好，因为这本书毕竟是很早之前的，书中所讲的思想、标准也基本都只是 ES5 及那时代的相关技术。</p><p>这也就导致了，在书中看到的很多例子，虽然觉得所用到的思想很奇妙，比如临时命名空间之类的处理，但其实，有些技术到现在已经有了更为强大的技术替代了。</p><p>就像这篇要讲的模块化，目前，以我看到的各资料后，所收获的知识是，大概有四种较为常用且热门的模块化技术，也许还有更新的技术，也许还有我不知道的技术，无所谓，慢慢来，这篇的内容已经够我消化了。</p><p>目前四种模块化技术：</p><ul><li>CommonJS规范&amp;node.js</li><li>AMD规范&amp;Require.js</li><li>CMD规范&amp;Sea.js</li><li>ES6标准</li></ul><p>前面是规范，规范就是类似于 ES5，ES6 只是提出来作为一种标准规范，而不同规范有具体的实现，比如 nodeJS 实现了 CommonJS 规范。</p><h3 id="模块化历程" tabindex="-1"><a class="header-anchor" href="#模块化历程" aria-hidden="true">#</a> 模块化历程</h3><p>在声明部分中的第二、第三链接里那两篇，以时间线介绍了模块化的相关技术的发展历程，我觉得很有必要一看，对于掌握和理解目前的模块化技术挺有帮助的。</p><p>这里，就稍微摘抄其中一些内容，详细内容还是需要到原文阅读。</p><ol><li><strong>全局变量、全局函数（1999年）</strong></li></ol><p>这时候的多个 js 脚本文件之间，直接通过全局变量或全局函数的方式进行通信，这种方式叫做：直接定义依赖。</p><p>虽然做的好一些的会对这些 js 文件做一些目录规划，将资源归类整理，但仍无法解决全局命名空间被大量污染，极其容易导致变量冲突问题。</p><ol start="2"><li><strong>对象作为命名空间（2002年）</strong></li></ol><p>为了解决遍地的全局变量问题，这时候提出一种命名空间模式的思路，即将本要定义成全局变量、全局函数的这些全都作为一个对象的属性存在，这个对象的角色充当命名空间，不同模块的 JS 文件中通过访问这个对象的属性来进行通信。</p><ol start="3"><li><strong>立即执行的函数作为临时命名空间 + 闭包（2003年）</strong></li></ol><p>虽然提出利用一个对象来作为命名空间的思路，一定程度解决了大量的全局变量的问题，但仍旧存在很多局限，比如没有模块的隐藏性，所以针对这些问题，这时候又新提出一种思路：利用立即执行的函数来作为临时命名空间，这样就可以避免污染全局命名空间，同时，结合闭包特性，来实现隐藏细节，只对外暴露指定接口。</p><p>虽然这种思路，解决了很多问题，但仍旧有一些局限，比如，缺乏管理者，什么意思，就是说，在前端里，开发人员得手动将不同 JS 脚本文件按照它们之间的依赖关系，以被依赖在前面的顺序来手动书写 &lt;script&gt; 加载这些文件。</p><p>也就是不同 &lt;script&gt; 的前后顺序实际上表示着它们之间的依赖关系，一旦文件过多，将会很难维护，这是上述方案都存在的问题。</p><ol start="4"><li><strong>动态创建 &lt;script&gt; 工具（2009年）</strong></li></ol><p>针对上述问题，也就衍生出了一些加载 js 文件的工具，先看个例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$LAB.script(&quot;greeting.js&quot;).wait()
    .script(&quot;x.js&quot;)
    .script(&quot;y.js&quot;).wait()
    .script(&quot;run.js&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>LAB.js 这类加载工具的原理实际上是动态的创建 &lt;script&gt;，达到作为不同 JS 脚本文件的管理者作用，来决定 JS 文件的加载和执行顺序。</p><p>虽然我没用过这种工具，但我觉得它的局限还是有很多，其实就是将开发人员本来需要手动书写在 HTML 文档里的 &lt;script&gt; 代码换成写在 JS 文件中，不同 JS 文件之间的依赖关系仍旧需要按照前后顺序手动维护。</p><ol start="5"><li><strong>CommonJS规范&amp;node.js（2009年）</strong></li></ol><p>中间跳过了一些过程，比如 YUI 的沙箱模式等，因为不熟，想了解更详细的可以去原文阅读。</p><p>当 CommonJS 规范出来时，模块化算是进入了真正的革命，因为在此之前的探索，都是基于语言层面的优化，也就是利用函数特性、对象特性等来在运行期间模拟出模块的作用，而从这个时候起，模块化的探索就大量的使用了预编译。</p><p>CommonJS 模块化规范有如下特点：</p><ul><li>所有代码都运行在模块作用域，不会污染全局作用域。</li><li>模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。</li><li>模块加载的顺序，按照其在代码中出现的顺序。</li></ul><p>不同的模块间的依赖关系通过 <code>require</code> 来控制，而每个模块需要对外暴露的接口通过 <code>exports</code> 来决定。</p><p>由于 CommonJS 规范本身就只是为了服务端的 node.js 而考虑的，node.js 实现了 CommonJS 规范，所以运行在 node.js 环境中的 js 代码可以使用 <code>require</code> 和 <code>exports</code> 这两个命令，但在前端里，浏览器的 js 执行引擎并不认识 <code>require</code> 这些命令，所以需要进行一次转换工作，后续介绍。</p><p>再来看看 <code>require</code> 命令的工作原理：</p><p><code>require</code> 命令是 CommonJS 规范之中，用来加载其他模块的命令。它其实不是一个全局命令，而是指向当前模块的 <code>module.require</code> 命令，而后者又调用 Node 的内部命令 <code>Module._load</code>。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Module._load = function(request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的Module实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，
  //    读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载/解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
};

Module.prototype._compile = function(content, filename) {
  // 1. 生成一个require函数，指向module.require
  // 2. 加载其他辅助方法到require
  // 3. 将文件内容放到一个函数之中，该函数可调用 require
  // 4. 执行该函数
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，其实 CommonJS 的模块化规范之所以可以实现控制作用域、模块依赖、模块通信，其实本质上就是将模块内的代码都放在一个函数内来执行，这过程中会创建一个对象 Module，然后将模块的相关信息包括对外的接口信息都添加到对象 Module 中，供其他模块使用。</p>`,36),j={start:"6"},q={href:"https://github.com/amdjs/amdjs-api",target:"_blank",rel:"noopener noreferrer"},f={href:"https://requirejs.org/",target:"_blank",rel:"noopener noreferrer"},x=d("<p>CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS 规范比较适用。</p><p>但是，如果是浏览器环境，这种同步加载文件的模式就会导致浏览器陷入卡死状态，因为网络原因是不可控的。所以，针对浏览器环境的模块化，新提出了一种规范：AMD（Asynchronous Modules Definition）异步模块定义。</p><p>也就是说，对于 Node.js，对于服务端而言，模块化规范就是按照 CommonJS 规范即可。</p><p>但对于浏览器，对于前端而言，CommonJS 不适用，需要看看 AMD 规范。</p><p>AMD 规范中定义：</p><ul><li>定义一个模块时通过 <code>define</code> 命令，通过 <code>return</code> 声明模块对外暴露的接口</li><li>依赖其他模块时，通过 <code>require</code> 命令</li></ul><p>而规范终归只是规范，使用时还是需要有规范的具体实现，针对 AMD 规范，具体的实现是 Require.js，在前端里，如果基于 Require.js 来使用 AMD 规范的模块化技术，后续介绍。</p>",7),S={start:"7"},_={href:"https://github.com/cmdjs/specification",target:"_blank",rel:"noopener noreferrer"},M={href:"https://seajs.github.io/seajs/docs/",target:"_blank",rel:"noopener noreferrer"},w=d(`<p>CMD（Common Module Definition）也是专门针对浏览器、针对前端而提出的一种模块化规范。它跟 AMD 规范都是用途都是一样，用途解决前端里的模块化技术。</p><p>但两种规范各有各的优缺点，各有各的适用场景和局限性吧，我还没使用过这两种规范，所以无从比较，但网上关于这两种规范比较的文章倒是不少。</p><p>CMD 规范中定义：</p><ul><li>使用 <code>define</code> 命令定义一个模块，使用 <code>exports</code> 来暴露模块对外的接口</li><li>使用 <code>require</code> 来同步加载依赖的模块，但也可使用 <code>require.async</code> 来异步加载依赖的模块</li></ul><p>总之，虽然两种规范都是用于解决前端里的模块化技术，但实现的本质上还是有些不同，后续介绍。</p><p>对于 CMD 规范的具体实现是 Sea.js，前端里如果想使用 CMD 规范的模块化技术，需要借助 Sea.js。</p><ol start="8"><li><strong>ES6标准（2015年）</strong></li></ol><p>2015 年发布的 ES6 标准规范中，新增了 Module 特性，也就是官方在 ES6 中，在语言本身层面上，添加了模块的机制支持，让 JavaScript 语言本身终于可以支持模块特性了。</p><p>在 ES6 之前的各种方案，包括 CommonJS，AMD，CMD，本质上其实都是利用函数具有的本地变量的特性进行封装从而模拟出模块机制。也就是说，这些方案都是需要在运行期间，才会动态的创建出某个模块，并暴露模块的相关接口。这种方案其实也存在一些局限性。</p><p>而 ES6 新增了模块的机制后，在代码的解析阶段，就能够确定模块以及模块对外的接口，而不用等到运行期。这种本质上的区别，在借助开发工具写代码阶段的影响很明显就是，终于可以让开发工具智能的提示依赖的模块都对外提供了哪些接口。</p><p>但 ES6 由于是新增的特性，在支持方面目前好像还不是很理想，并不是所有环境都支持 ES6 的模块机制好像，所以会看到某些大佬的文章里会介绍一些诸如：Babel、Browserify。</p><p>Babel 用于将 ES6 转换为 ES5 代码，好让不支持 ES6 特性的环境可以运行 ES5 代码。</p><p>Browserify 用于将编译打包 js，处理 require 这些浏览器并不认识的命令。</p><p>上面只是简单介绍了下模块化的发展历程，而且中间略过一些阶段，想看详细的可以去原文阅读。下面就具体介绍下，目前四个比较稳定的模块技术：</p><h3 id="commonjs规范" tabindex="-1"><a class="header-anchor" href="#commonjs规范" aria-hidden="true">#</a> CommonJS规范</h3><p>由于 CommonJS 是针对服务端设计的模块化规范，对于 Node.js 来说，一个 JS 文件就是一个模块，所以并不需要类似 AMD 或 CMD 中的 <code>define</code> 来声明一个模块。这是我的理解。</p><h4 id="exports" tabindex="-1"><a class="header-anchor" href="#exports" aria-hidden="true">#</a> exports</h4><p>既然在 Node.js 中，每个 JS 文件就是一个模块，那么这个模块文件内的变量都是对外隐藏的，外部无权访问，只能访问 <code>exports</code> 对外暴露的接口，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//module.js
var name = &quot;dasu&quot;;
var wx = &quot;dasuAndroidTv&quot;;
var getBlog = function() {
    return &quot;http://www.cnblogs.com/dasusu/&quot;;
}
//以上变量和函数，外部都无权访问,外部只能访问到下面通过 exports 暴露的接口
module.exports.name = name;
exports.getWx = () =&gt; wx;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模块内，可以通过对 module.exports 或 exports 添加属性来达到对外暴露指定接口的目的，当然，从程序上来说，你可以直接改变 module.exports 的指向，让它指向一个新对象而不是在原本对象上添加属性，这个就类似于对构造函数 prototype 属性的修改。</p><p>但建议使用方式还是尽可能在 exports 对象上添加属性。</p><p>如果有想探究它的原理的话，可以尝试利用 Browserify 来转换这段模块代码，看看最后生成的是什么：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function(require,module,exports){
    //module.js
    var name = &quot;dasu&quot;;
    var wx = &quot;dasuAndroidTv&quot;;
    var getBlog = function() {
        return &quot;http://www.cnblogs.com/dasusu/&quot;;
    }
    //以上变量和函数，外部都无权访问,外部只能访问到下面通过 exports 暴露的接口
    module.exports.name = name;
    exports.getWx = () =&gt; wx;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然，对于 Node.js 来说，它其实对待每个 JS 文件，本质上，会将文件内的代码都放于一个函数内，如果该模块首次被其他模块引用了，那么就会去执行这个函数，也就是执行模块内的代码，由于函数本身有三个参数，其中有两个分别是：module 和 exports，这也是内部为什么可以直接通过 module.exports 或 exports 来操作的原因。</p><p>Module 对象是 Node.js 会为每个模块文件创建的一个对象，模块之间的通信，其实就是通过访问每个 Module 对象的属性来实现。</p><p>所以，说白了，CommonJS 模块化技术的本质，其实就是利用了函数的局部作用域的特性来实现模块作用域，然后结合一个对象作为命名空间的方式，来保存模块内部需要对外暴露的信息方式。最后，通过 <code>require</code> 命令来组织各模块之间的依赖关系，解决以前方案没有管理者角色的局限，解决谁先加载谁后加载的问题。</p><h4 id="require" tabindex="-1"><a class="header-anchor" href="#require" aria-hidden="true">#</a> require</h4><p>每个 JS 文件其实都被当做一个模块处理，也就是文件内的代码都会被放入到一个函数内，那这个函数什么时候执行呢？也就是说，模块什么时候应该被加载呢？</p><p>这就是由 <code>require</code> 命令决定，当某个模块内使用了 require 命令去加载其他模块，那么这时候，被加载的模块如果是首次被调用，它是没有对应的 Module 对象的，所以会去调用它的函数，执行模块内代码，这个过程是同步的，这期间会完善这个模块的 Module 对象信息。之后，其他模块如果也引用了这个模块，因为模块内代码已经被执行过了，已经存在对应的 Module 对象，所以此时就不会再重复去加载这个模块了，直接返回 Module 对象。</p><p>以上，基本也就是模块间依赖的加载处理过程。而 require 命令用法很简单：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//main.js
var module1 = require(&quot;./module&quot;);

module1.name;  //输出=&gt; dasu
module1.getWx(); //输出 =&gt; dasuAndroidTv
//module1.getBlog(); //没有权限访问
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实，Node.js 对 main.js 的处理也是认为它是个模块，所以文件内的代码也都放入一个函数内，还记得函数的第一个参数就是 require 么，这也就是为什么模块内可以直接使用 <code>require()</code> 的原因，require 其实本质上是一个函数，具体的实现是 Node.js 的一个内置方法：Module._load()，主要工作上一节有介绍过了。</p><p>说得稍微严谨点，Node.js 其实才是作为各模块之间的管理者，由它来管控着哪个模块先加载，哪个后加载，维护着各模块对外暴露的信息。</p><p>到这里再来理解，有些文章中对 Module 对象的介绍：</p><blockquote><ul><li><code>module.id</code> 模块的识别符，通常是带有绝对路径的模块文件名。</li><li><code>module.filename</code> 模块的文件名，带有绝对路径。</li><li><code>module.loaded</code> 返回一个布尔值，表示模块是否已经完成加载。</li><li><code>module.parent</code> 返回一个对象，表示调用该模块的模块。</li><li><code>module.children</code> 返回一个数组，表示该模块要用到的其他模块。</li><li><code>module.exports</code> 表示模块对外输出的值。</li></ul></blockquote><p>这时，对于 Module 对象内的各属性用途，理解应该会比较容易点了。</p><p>最后说一点，CommonJS 只是一种模块化的规范，而 Node.js 才是这个规范的具体实现者，但 Node.js 通常用于服务端的运行环境，对于前端而言，对于浏览器而言，因为不存在 Node.js 这东西，所以 require 或 exports 这类在前端里是无法运行的，但可以借助 Browerify 来进行代码转换。</p><h3 id="amd规范" tabindex="-1"><a class="header-anchor" href="#amd规范" aria-hidden="true">#</a> AMD规范</h3>`,38),D={href:"https://github.com/amdjs/amdjs-api",target:"_blank",rel:"noopener noreferrer"},C={href:"https://requirejs.org/",target:"_blank",rel:"noopener noreferrer"},J=d(`<p>前端里没有 Node.js 的存在，即使有类似的存在，但由于 CommonJS 的模块化规范中，各模块的加载行为是同步的，也就是被依赖的模块必须执行结束，当前模块才能继续处理，这对于前端而言，模块的加载就多了一个下载的过程，而网络是不可靠的，所以 CommonJS 并不适用于前端的场景。</p><p>所以，针对前端，提出了另一种模块化规范：AMD，即异步模块加载，通过增加回调处理的方式，来移除被依赖模块和当前模块的前后关联，两个模块可同时下载，执行。当前模块内，需要依赖于其他模块信息的代码放置于回调函数内，这样就可以先行处理当前模块内其他代码。</p><h4 id="define" tabindex="-1"><a class="header-anchor" href="#define" aria-hidden="true">#</a> define</h4><p>前端里是通过 &lt;script&gt; 来加载 JS 文件代码的，不能像 Node.js 那样从源头上处理 JS 文件，所以它多了一个 <code>define</code> 来定义模块，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//module.js
define(function(){
    var name = &quot;dasu&quot;;
    var wx = &quot;dasuAndroidTv&quot;;
    var getBlog = function() {
        return &quot;http://www.cnblogs.com/dasusu/&quot;;
    }
    
    return {
        name: name,
        getWx: function() {
            return wx;
        }
    }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果定义的模块又依赖了其他模块时，此时 define 需要接收两个参数，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//两个参数，第一个参数是数组，数组里是当前模块依赖的所有模块，第二个参数是函数，函数需要参数，参数个数跟数组个数一直，也跟数组里依赖的模块一一对应，该模块内部就是通过参数来访问依赖的模块。
define([&#39;module2&#39;], function(module2){
    //module2.xxx  使用模块 module2 提供的接口
    
    //本模块的内部逻辑
    
    return {
        //对外暴露的接口
    }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>define 有两个参数，第一个参数是数组，数组里是当前模块依赖的所有模块，第二个参数是函数，函数需要参数，参数个数跟数组个数一直，也跟数组里依赖的模块一一对应，该模块内部就是通过参数来访问依赖的模块。</p><h4 id="require-1" tabindex="-1"><a class="header-anchor" href="#require-1" aria-hidden="true">#</a> require</h4><p>如果其他地方有需要使用到某个模块提供的功能时，此时就需要通过 require 来声明依赖关系，但声明依赖前，需要先通过 requirejs.config 来配置各个模块的路径信息，方便 Require.js 能够获得正确路径自动去下载。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>requirejs.config({
    paths: {
        module1: &#39;./module&#39;
    }
})

var module1 = require([&#39;module1&#39;], function(module1){
    console.log(module1.name);    //访问模块内的 name 接口
    console.log(module1.getWx()); //访问模块内的 getWx 接口
});

//其他不依赖于模块的代码
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式的话，require 的第一个数组参数内的值就可以模块的别称，而第二个参数是个函数，同样，函数的参数就是加载后的模块，该 JS 文件内需要依赖到模块信息的代码都可以放到回调函数中，通过回调函数的参数来访问依赖的模块信息。</p><h4 id="使用步骤" tabindex="-1"><a class="header-anchor" href="#使用步骤" aria-hidden="true">#</a> 使用步骤</h4><ol><li>下载 Require.js，并放到项目中</li></ol>`,14),A={href:"https://requirejs.org/docs/download.html#requirejs",target:"_blank",rel:"noopener noreferrer"},E=d(`<ol start="2"><li>新建作为模块的文件，如 module.js，并通过 define 定义模块</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//module.js
define(function(){
    var name = &quot;dasu&quot;;
    var wx = &quot;dasuAndroidTv&quot;;
    var getBlog = function() {
        return &quot;http://www.cnblogs.com/dasusu/&quot;;
    }
    
    return {
        name: name,
        getWx: function() {
            return wx;
        }
    }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>在其他 js 文件内先配置所有的模块来源信息</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//main.js
requirejs.config({
    paths: {
        module1: &#39;./module&#39;
    }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>配置完模块信息后，通过 require 声明需要依赖的模块</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//main.js
var module1 = require([&#39;module1&#39;], function(module1){
    console.log(module1.name);    //访问模块内的 name 接口
    console.log(module1.getWx()); //访问模块内的 getWx 接口
});

//其他不依赖于模块的代码
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5"><li>最后也最重要的一步，在 html 中声明 require.js 和 入口 js 如 main.js 的加载关系</li></ol><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script src=&quot;js/lib/require.js&quot; data-main=&quot;js/src/main.js&quot;&gt;&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>当然，这只是基础用法的步骤，其中第 3 步的模块初始化步骤也可通过其他方式，如直接利用 require 的不同参数类型来实现等等，但大体上需要这几个过程，尤其是最后一步，也是最重要一步，因为 AMD 在前端的具体实现都依靠于 Require.js，所以必须等到 Require.js 下载并执行结束后会开始处理其他 js。</p><p>以上例子的项目结构如图：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-034cd83f8f6c1bd9.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><h4 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h4><p>最后小结一下，AMD 规范的具体实现 Require.js 其实从使用上来看，已经比较容易明白它的原理是什么了。</p><p>本质上，也还是利用了函数的特性，作为模块存在的那些代码本身已经通过 define 规范被定义在函数内了，所以模块内的代码自然对外是隐藏的，外部能访问到的只有函数内 return 的接口，那么这里其实也就利用了闭包的特性。</p><p>所以，模块化的实现，无非就是让函数作为临时命名空间结合闭包或者对象作为命名空间方式， 这种方式即使没有 CommonJS 规范，没有 AMD 规范，自己写代码很可以容易的实现。那么为什么会有这些规范技术的出现呢？</p><p>无非就是为了引入一个管理者的角色，没有管理者的角色，模块之间的依赖关系，哪个文件先加载，哪个后加载，&lt;script&gt; 的书写顺序都只能依靠人工来维护、管理。</p><p>而这些模块化规范，其实目的就在于解决这些问题，CommonJS 是由 Node.js 作为管理者角色，来维护、控制各模块的依赖关系，文件的加载顺序。而 AMD 则是由 Require.js 来作为管理者角色，开发者不用在 HTML 里写那么多 &lt;script&gt;，而且也没必要去关心这些文件谁写前谁写后，Require.js 会自动根据 require 来维护这些依赖关系，自动根据 requirejs.config 的配置信息去决定先加载哪个文件后加载哪个文件。</p><h3 id="cmd规范" tabindex="-1"><a class="header-anchor" href="#cmd规范" aria-hidden="true">#</a> CMD规范</h3><p>CMD 规范，类似于 AMD，同样也是用于解决前端里的模块化技术问题。而有了 AMD 为什么还会有 CMD，我个人的理解是，AMD 的适用场景并没有覆盖整个前端里的需求，或者说 AMD 本身也有一些缺点，导致了新的 CMD 规范的出现。</p><p>比如说，从使用方式上，AMD 就有很多跟 CommonJS 规范不一致的地方，对于从 CommonJS 转过来的这部分人来说，可能就会很不习惯；再比如说，AMD 考虑的场景可能太多，又要适配 jQurey，又要适配 Node 等等；</p><p>总之，CMD 规范总有它出现和存在的理由，下面就大概来看看 CMD 的用法：</p><h4 id="define-exports" tabindex="-1"><a class="header-anchor" href="#define-exports" aria-hidden="true">#</a> define&amp;exports</h4><p>类似于 AMD，CMD 规范中，也是通过 define 定义一个模块：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//module.js
define(function (require, exports, module) {
    var name = &quot;dasu&quot;;
    var wx = &quot;dasuAndroidTv&quot;;
    var getBlog = function() {
        return &quot;http://www.cnblogs.com/dasusu/&quot;;
    }
    
    exports.name = name;
    exports.getWx = () =&gt; wx;
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>跟 AMD 不一样的地方是，CMD 中 define 只接收一个参数，参数类型是一个函数，函数的参数也很重要，有三个，按顺序分别是 require，exports，module，作用就是 CommonJS 规范中三个命令的用途。</p><p>如果当前模块需要依赖其他模块，那么在内部，使用 require 命令即可，所以，函数的三个参数很重要。</p><p>当前模块如果不依赖其他模块，也没有对外提供任何接口，那么，函数可以没有参数，因为有了内部也没有使用。</p><p>而如果当前模块需要依赖其他模块，那么就需要使用到 require，所以函数第一个参数就是必须的；如果当前模块需要对外暴露接口，那么后两个参数也是需要的；</p><p>总之，建议使用 define 定义模块时，将函数三个参数都带上，用不用再说，规范一点总没错。</p><h4 id="require-2" tabindex="-1"><a class="header-anchor" href="#require-2" aria-hidden="true">#</a> require</h4><p>在有需要使用某个模块提供的功能时，通过 require 来声明依赖关系：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//main.js
define(function (require, exports, module) {
    console.log(&quot;=====main.js=======&quot;);

    var module1 = require(&quot;./module&quot;);//同步加载模块
    console.log(module1.name);

    require.async(&quot;./module2&quot;, function (module2) {//异步加载模块
        console.log(module2.wx);
    })
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>require 默认是以同步方式加载模块，如果需要异步加载，需要使用 require.async</p><h4 id="使用步骤-1" tabindex="-1"><a class="header-anchor" href="#使用步骤-1" aria-hidden="true">#</a> 使用步骤</h4><ol><li>下载 Sea.js，并放到项目中</li></ol>`,35),y={href:"https://github.com/seajs/seajs/releases",target:"_blank",rel:"noopener noreferrer"},B=d(`<ol start="2"><li>新建作为模块的文件，如 module.js，并通过 define 定义模块</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//module.js
define(function (require, exports, module) {
    var name = &quot;dasu&quot;;
    var wx = &quot;dasuAndroidTv&quot;;
    var getBlog = function() {
        return &quot;http://www.cnblogs.com/dasusu/&quot;;
    }
    
    exports.name = name;
    exports.getWx = () =&gt; wx;
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>其他需要依赖到该模块的地方通过 require 声明</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//main.js
define(function (require, exports, module) {
    console.log(&quot;=====main.js=======&quot;);

    var module1 = require(&quot;./module&quot;);//同步加载模块
    console.log(module1.name);

    require.async(&quot;./module2&quot;, function (module2) {//异步加载模块
        console.log(module2.wx);
    })
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>最后也最重要的一步，在 html 中先加载 sea.js 并指定主模块的 js</li></ol><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script src=&quot;js/lib/require.js&quot;&gt;&lt;/script&gt;
&lt;script&gt;
     seajs.use(&quot;./js/src/main.js&quot;);
&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用步骤跟 AMD 很类似，首先是需要依赖于 Sea.js，所以必须先下载它。</p><p>然后定义模块、依赖模块、使用模块的方式就跟 CommonJS 很类似，这几个操作跟 AMD 会有些不同，也许这点也正是 CMD 存在的原因之一。</p><p>最后一步也是最重要一步，需要在 HTML 文档中加载 sea.js 文档，并指定入口的 js，注意做的事虽然跟 AMD 一样，但实现方式不一样。</p><h4 id="小结-1" tabindex="-1"><a class="header-anchor" href="#小结-1" aria-hidden="true">#</a> 小结</h4><p>其实，CMD 跟 CommonJS 很类似，甚至在模块化方面的工作，可以很通俗的将 sea.js 理解成 node.js 所做的事，只是有些 node.js 能完成但却无法通过 sea.js 来负责的工作需要开发人员手动处理，比如定义一个模块、通过 &lt;script&gt; 加载 sea.js 和指定主入口的 js 的工作。</p><h3 id="commonjs-amd-cmd-三者间区别" tabindex="-1"><a class="header-anchor" href="#commonjs-amd-cmd-三者间区别" aria-hidden="true">#</a> CommonJS, AMD, CMD 三者间区别</h3><p>下面分别从适用场景、使用步骤、使用方式、特性等几个方面来对比这些不同的规范：</p><h4 id="适用场景" tabindex="-1"><a class="header-anchor" href="#适用场景" aria-hidden="true">#</a> 适用场景</h4><p>CommonJS 用于服务端，基于 Node.js 的运行环境；</p><p>AMD 和 CMD 用于前端，基于浏览器的运行环境；</p><h4 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式" aria-hidden="true">#</a> 使用方式</h4><p>CommonJS 通过 require 来依赖其他模块，通过 exports 来为当前模块暴露接口；</p><p>AMD 通过 define 来定义模块，通过 requirejs.config 来配置模块路径信息，通过 require 来依赖其他模块，通过 retrurn 来暴露模块接口；</p><p>CMD 通过 define 来定义模块，通过 require 来依赖其他模块，通过 exports 来为当前模块暴露接口；</p><h4 id="使用步骤-2" tabindex="-1"><a class="header-anchor" href="#使用步骤-2" aria-hidden="true">#</a> 使用步骤</h4><p>CommonJS 适用的 Node.js 运行环境，无需其他步骤，正常使用模块技术即可；</p><p>AMD 适用的前端浏览器的运行环境没有 Require.js，所以项目中需要先加载 Require.js，然后再执行主入口的 js 代码，需要在 HTML 中使用类似如下命令：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script src=&quot;js/lib/require.js&quot; data-main=&quot;js/src/main.js&quot;&gt;&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>CMD 适用的前端浏览器的运行环境也没有 Sea.js，所以项目中也需要先加载 Sea.js，然后再执行主入口的 js 代码，需要在 HTML 中使用类似如下命令：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script src=&quot;js/lib/sea.js&quot;&gt;&lt;/script&gt;
&lt;script&gt;
    seajs.use(&quot;./js/src/main.js&quot;);
&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="特性" tabindex="-1"><a class="header-anchor" href="#特性" aria-hidden="true">#</a> 特性</h4><p>AMD：依赖前置、提前执行，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>require([&#39;module1&#39;,&#39;module2&#39;], function(m1, m2){
    //...
})
define([&#39;module1&#39;,&#39;module2&#39;], function(m1, m2){
    //...
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要先将所有的依赖的加载完毕后，才会去处理回调中的代码，这叫依赖前置、提前执行；</p><p>CMD：依赖就近、延迟执行，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>define(function(require, exports, module){
    //...
    var module1 = require(&quot;./module1&quot;);
    //...
    require(&quot;./module2&quot;, function(m2){
        //...
    });
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>等代码执行到 require 这行代码时才去加载对应的模块</p><h3 id="es6标准" tabindex="-1"><a class="header-anchor" href="#es6标准" aria-hidden="true">#</a> ES6标准</h3><p>ES6 中新增的模块特性，在上一篇中已经稍微介绍了点，这里也不具体展开介绍了，需要的话开头的声明部分有给出链接，自行查阅。</p><p>这里就简单说下，在前端浏览器中使用 ES6 模块特性的步骤：</p><ol><li><p>定义模块，通过指定 &lt;script type=&quot;module&quot;&gt; 方式</p></li><li><p>依赖其他模块使用 import，模块对外暴露接口时使用 export；</p></li></ol><p>需要注意的一点是，当 JS 文件内出现 import 或者 export 时，这份 JS 文件必须声明为模块文件，即在 HTML 文档中通过指定 &lt;script&gt; 标签的 type 为 module，这样 import 或 export 才能够正常运行。</p><p>也就是说，使用其他模块的功能时，当前的 JS 文件也必须是模块。</p><p>另外，有一点，ES6 的模块新特性，所有作为模块的文件都需要开发人员手动去 HTML 文档中声明并加载，这是与其他方案不同的一点，ES6 中 import 只负责导入指定模块的接口而已，声明模块和加载模块都需要借助 &lt;script&gt; 实现。</p><p>这里不详细讲 ES6 的模块特性，但想来讲讲，一些转换工作的配置，因为：</p><ul><li>有些浏览器不支持 ES6 的语法，写完 ES6 的代码后，需要通过 Babel 将 ES6 转化为 ES5。</li><li>生成了 ES5 之后，里面仍然有 require 语法，而浏览器并不认识 require 这个关键字。此时，可以用 Browserify 编译打包 js，进行再次转换。</li></ul><p>而我是选择使用 WebStrom 作为开发工具的，所以就来讲讲如何配置</p><h4 id="webstrom-的-babel-配置" tabindex="-1"><a class="header-anchor" href="#webstrom-的-babel-配置" aria-hidden="true">#</a> WebStrom 的 Babel 配置</h4>`,44),k={href:"https://github.com/smyhvae/Web/blob/master/10-ES6/03-ES6%E7%9A%84%E4%BB%8B%E7%BB%8D%E5%92%8C%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE.md",target:"_blank",rel:"noopener noreferrer"},N=d(`<ol><li>新建项目</li><li>通过 npm 初始化项目</li></ol><p>在安装 Babel 之前，需要先用 npm 初始化我们的项目。打开终端或者通过 cmd 打开命令行工具，进入项目目录，输入如下命令： <code>npm init -y</code>，命令执行结束后，会在项目根目录下生成 package.json 文件</p><ol start="3"><li>（首次）全局安装 Babel-cli</li></ol><p>在终端里执行如下命令：</p><p><code>npm install -g babel-cli</code></p><ol start="4"><li>本地安装 babel-preset-es2015 和 babel-cli</li></ol><p><code>npm install --save-dev babel-preset-es2015 babel-cli</code></p><p>本地是指在项目的根目录下打开终端执行以上命令，执行结束，项目根目录的 package.json 文件中会多了 devDependencies 选项</p><ol start="5"><li>新建 .babelrc 文件</li></ol><p>在根目录下新建文件 .babelrc，输入如下内容：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>{
    &quot;presets&quot;:[
        &quot;es2015&quot;
    ],
    &quot;plugins&quot;:[]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="6"><li>执行命令转换</li></ol><p><code>babel js/src/main.js -o js/dist/main.js</code></p><p><code>-o</code> 前是原文件，后面是转换后的目标文件</p><p>这是我的项目结构：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-31d87a30a0ebf287.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>.json 文件和 node_modules 文件夹都是操作完上述步骤后会自动生成的，最后执行完命令后，会在 dist 目录下生成目标文件。</p><ol start="7"><li>（可选）如果嫌每次执行的命令太过复杂，可利用 npm 脚本</li></ol><p>将 <code>babel js/src/main.js -o js/dist/main.js</code> 这行代码复制到 package.json 里的 scripts 字段中：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-29092902bb38740b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>以后每次都点一下 build 左边的三角形按钮运行一下脚本就可以了，省去了手动输命令的时间。</p><ol start="8"><li>（可选）如果还嫌每次手动点击按钮运行脚本麻烦，可配置监听文件改动自动进行转换</li></ol><p>打开 WebStrom 的 Setting -&gt; Tools -&gt; File Watchers，然后点击 <code>+</code> 按钮，选择 Babel 选项，然后进行配置：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-eb1db6734321b859.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><ol start="9"><li>最后，以后每次新的项目，除了第 3 步不用了之外，其余步骤仍旧需要进行。</li></ol><h4 id="webstrom-的-browserify-配置" tabindex="-1"><a class="header-anchor" href="#webstrom-的-browserify-配置" aria-hidden="true">#</a> WebStrom 的 Browserify 配置</h4><p>步骤跟上述很类似，区别仅在于一个下载 babel，这里下载的是 browserify，以及转换的命令不同而已：</p><ol><li>新建项目</li><li>通过 npm 初始化项目</li></ol><p>打开终端，进入到项目的根目录，执行 <code>npm init -y</code>，执行结束后会在根目录生成 package.json 文件</p><ol start="3"><li>（首次）全局安装 browserify</li></ol><p>在终端里执行如下命令：</p><p><code>npm install browserify -g</code></p><ol start="4"><li>执行命令转换</li></ol><p><code>browserify js/src/main.js -o js/dist/main.js --debug</code></p><p><code>-o</code> 前是原文件，后面是转换后的目标文件</p><ol start="5"><li>（可选）如果嫌每次执行的命令太过复杂，可利用 npm 脚本</li></ol><p>将 <code>browserify js/src/main.js -o js/dist/main.js --debug</code> 这行代码复制到 package.json 里的 scripts 字段中：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-81403dd08b5a1477.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>以后每次都点一下 build 左边的三角形按钮运行一下脚本就可以了，省去了手动输命令的时间。</p><ol start="6"><li>（可选）如果还嫌每次手动点击按钮运行脚本麻烦，可配置监听文件改动自动进行转换</li></ol><p>打开 WebStrom 的 Setting -&gt; Tools -&gt; File Watchers，然后点击 <code>+</code> 按钮，选择 &lt;custom&gt; 选项，然后进行配置：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-c793bcc1cfc2333a.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><ol start="7"><li>最后，以后每次新的项目，除了第 3 步不用了之外，其余步骤仍旧需要进行。</li></ol>`,43);function W(T,R){const n=r("ExternalLinkIcon");return a(),o("div",null,[u,c,e("ul",null,[e("li",null,[e("a",m,[i("Github:smyhvae/web"),s(n)])]),e("li",null,[e("a",p,[i("JavaScript模块化开发的演进历程"),s(n)])]),e("li",null,[e("a",v,[i("JavaScript模块化七日谈"),s(n)])]),e("li",null,[e("a",b,[i("ES6:Module 的加载实现"),s(n)])]),e("li",null,[e("a",h,[i("CommonJS规范"),s(n)])])]),g,e("ol",j,[e("li",null,[e("strong",null,[e("a",q,[i("AMD规范"),s(n)]),i("&"),e("a",f,[i("Require.js"),s(n)]),i("（2009年）")])])]),x,e("ol",S,[e("li",null,[e("strong",null,[e("a",_,[i("CMD规范"),s(n)]),i("&"),e("a",M,[i("Sea.js"),s(n)]),i("（2013年）")])])]),w,e("p",null,[e("a",D,[i("AMD规范"),s(n)]),i("和规范实现者："),e("a",C,[i("Require.js"),s(n)])]),J,e("p",null,[e("a",A,[i("Require.js:https://requirejs.org/docs/download.html#requirejs"),s(n)])]),E,e("p",null,[e("a",y,[i("Sea.js:https://github.com/seajs/seajs/releases"),s(n)])]),B,e("p",null,[i("教程部分摘抄自："),e("a",k,[i("ES6的介绍和环境配置"),s(n)])]),N])}const V=l(t,[["render",W],["__file","前端入门22-讲讲模块化.html.vue"]]);export{V as default};
