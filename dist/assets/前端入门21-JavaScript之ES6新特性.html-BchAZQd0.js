import{_ as d,r as l,o as r,c,a as e,b as n,e as a,d as s}from"./app-dV2aVdq6.js";const v={},t=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),n(" 声明")],-1),u={href:"http://es6.ruanyifeng.com/",target:"_blank",rel:"noopener noreferrer"},o=s(`<p>阮一峰的这本书，我个人觉得写得挺好的，不管是描述方面，还是例子，都讲得挺通俗易懂，每个新特性基本都还会跟 ES5 旧标准做比较，说明为什么会有这个新特性，这更于理解。</p><p>所以，后续不会再写个关于 ES6 系列的文章了，就在这篇里大概的列举一下，大体清楚都有哪些新特性就好了，以后需要用时再去翻一翻阮一峰的书。</p><h1 id="正文-es6新特性" tabindex="-1"><a class="header-anchor" href="#正文-es6新特性" aria-hidden="true">#</a> 正文-ES6新特性</h1><p>ES6 新标准规范相比于 ES5 旧标准规范中，无非就三个方面的改动：新增、更新、废弃。</p><p>由于更新和废弃需要考虑到兼容性问题，所以这两方面的内容应该并不多，那么大部分基本都是新增的特性。对于新增的特性来说，大体上也还可以再分两类：完全新增的特性和基于旧标准扩展的特性。</p><p>下面就大概来过一下，ES6 中新增的特性。</p><h3 id="symbol" tabindex="-1"><a class="header-anchor" href="#symbol" aria-hidden="true">#</a> Symbol</h3><p>这是新增的一种原始数据类型，ES5 中原始类型有 5 种，在 ES6 中新引入了一种后，现在就是有 6 种原始数据类型了：Number、String、Boolean、null、undefined、Symbol</p><p>这个单词中文直译是：符号、标志等，但好像并没有在书中有这种叫法，书中都是直接使用 Symbol 来描述，可能中文翻译不能够很好的表示出这种原始数据类型的含义吧。</p><h4 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h4><p>之所以新增了这种原始数据类型，是为了解决：</p><blockquote><p>ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入<code>Symbol</code>的原因。</p></blockquote><h4 id="基础用法" tabindex="-1"><a class="header-anchor" href="#基础用法" aria-hidden="true">#</a> 基础用法</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var s1 = Symbol(&#39;s1&#39;); //参数只是用来描述当前 s1 变量，跟其他 Symbol 数据类型的变量相区分，在调用 toString 或 typeOf 时会输出当前数据类型跟描述信息

//第一种
var o = {};
o[s1] = &quot;dasu&quot;;

//第二种
var o = {
    [s1]: &quot;dasu&quot;
};

//第三种
var o = {}
Object.defineProperty(o, s1, {value: &quot;dasu&quot;});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>给一个对象定义一个属性名用 Symbol 数据类型来表述的方法有上述三种，如果使用 <code>o.s1 = &quot;dasu&quot;</code> 这种方式，是给 o 对象定义了一个属性名为 s1 且数据类型为字符串的属性，字符串就存在相等与否的场景。而使用上述三种方式，是给对象定义了一个属性名为 s1 但数据类型为 Symbol 的属性，如果后期又定义了另一个属性名为 s1 的 Symbol 原始值的属性，并不会覆盖之前定义的属性。</p>`,15),m={href:"http://es6.ruanyifeng.com/#docs/symbol",target:"_blank",rel:"noopener noreferrer"},b=s('<h3 id="块作用域-let-和-const" tabindex="-1"><a class="header-anchor" href="#块作用域-let-和-const" aria-hidden="true">#</a> 块作用域 let 和 const</h3><h4 id="背景-1" tabindex="-1"><a class="header-anchor" href="#背景-1" aria-hidden="true">#</a> 背景</h4><p>ES5 中变量的作用域只分全局作用域和函数内作用域，且全局变量本质上是全局对象的属性，书中是这么评价的：</p><blockquote><p>顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。这样的设计带来了几个很大的问题，首先是没法在编译时就报出变量未声明的错误，只有运行时才能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错）；最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程。另一方面，<code>window</code>对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的。</p></blockquote><p>为了解决这些问题，ES6 中新增了块级作用域的变量，通过关键字：let 和 const 声明的变量，作用域是块级作用域，同时，这些变量不属于顶层对象的属性。</p><p>const 定义的变量是常量，除此外，这个变量跟用 let 定义的变量没有其他方面的区别了。而通过 let 和 const 定义的变量行为、作用域类似于 Java 语言中定义的变量行为。</p><p>换句话说，let 和 const 定义的变量已经不包含 var 定义的变量的各种特性行为了，比如：没有变量的声明提前特性、存在暂时性死区（在定义之前不能使用，只能在定义变量位置之后使用）、不允许重复声明、作用域只有块级作用域等。</p>',7),p={href:"http://es6.ruanyifeng.com/#docs/let",target:"_blank",rel:"noopener noreferrer"},h=s(`<h3 id="module-模块机制" tabindex="-1"><a class="header-anchor" href="#module-模块机制" aria-hidden="true">#</a> Module 模块机制</h3><h3 id="背景-2" tabindex="-1"><a class="header-anchor" href="#背景-2" aria-hidden="true">#</a> 背景</h3><p>ES5 中并没有模块机制，常见的方式是：前端里通过 &lt;script&gt; 加载各种不同的 js 文件代码，在 js 文件代码内部中提供一些全局变量或全局函数供其他 &lt;script&gt; 使用。</p><p>说白了，就是不同 js 文件通过全局对象作为通信的桥梁来相互访问。而为了解决不同 js 文件共享全局对象造成的变量冲突问题，通常作为模块的 js 里的代码都会放在一个立即执行的函数内。</p><p>而 ES6 中，引入了模块的机制。</p><h4 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用" aria-hidden="true">#</a> 基本使用</h4><p>当在 HTML 文档中，通过指定 &lt;script&gt; 标签的 type 属性为 module 时，如：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script type=&quot;module&quot; src=&quot;./foo.js&quot;&gt;&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>浏览器会按照模块的处理方式来加载这份 js 文件，与模块脚本的处理方式与正常 js 脚本文件处理方式最不同的地方在于，模块内的代码都是在模块作用域中执行，也就是在模块 js 文件中的全局变量这些并不会被添加到全局对象的属性中，其他 js 文件无法访问。</p><p>那么，其他 js 文件如何使用这份模块 js 文件呢？</p><p>有三点要求：</p><ol><li>模块 js 文件内，需要通过 export 声明该模块对外开放的接口</li><li>当前 js 文件内，需要通过 import 来引入模块对外开放的接口，想使用哪些接口，就需要引入哪些</li><li>当前 js 也必须是模块脚本文件，即 type=module 才行</li></ol><p>import 命令和 export 命令是模块机制的关键，但只两个命令只能在 type=module 的 js 文件内生效，如果某个 js 文件声明了 type=text/javascript，然后代码里又使用到 import 或 export，那么运行期间会报错。</p><ul><li>对外提供功能的模块</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//module.js
//...
//以上省略模块内部功能代码

//一般对外的接口可放在文件底部，方便一览无余
//第一种：
export var name = &quot;dasu&quot;;
export function getName() {return &quot;dasuAndroidTv&quot;};

//第二种：
var name = &quot;dasu&quot;
var getName = function() {return &quot;dasuAndroidTv&quot;};
export {name, getName}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>使用其他模块功能的当前脚本</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//第一种：from后跟js的相对路径或绝对路径
import {name, getName} from &#39;module.js&#39;

//第二种：
import * as Module from &#39;module.js&#39;
//使用
Module.name;
Module.getName();
//...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后，记住，模块脚本文件中，自动以严格模式运行，限制也很多，更多用法、细节说明参考：</p>`,18),g={href:"http://es6.ruanyifeng.com/#docs/module",target:"_blank",rel:"noopener noreferrer"},f={href:"http://es6.ruanyifeng.com/#docs/module-loader",target:"_blank",rel:"noopener noreferrer"},j=s(`<h3 id="变量解构" tabindex="-1"><a class="header-anchor" href="#变量解构" aria-hidden="true">#</a> 变量解构</h3><p>ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。</p><p>以前，为变量赋值，只能直接指定值。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = 1;
var b = 2;
var c = 3;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ES6 允许写成下面这样。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var [a, b, c] = [1, 2, 3];
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上面代码表示，可以从数组中提取值，按照对应位置，对变量赋值。</p><p>本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。</p><p>这种特性可以带来很多便捷：</p><ul><li>函数可以返回多个值</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 返回一个数组
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>对象取值时很方便</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//解析服务端返回的数据对象，提取其中的各字段值
var o = {
    code: 1,
  	msg: &quot;success&quot;,
    content: {...}
};

var {code, msg, content} = o;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),x={href:"http://es6.ruanyifeng.com/#docs/destructuring",target:"_blank",rel:"noopener noreferrer"},y=s(`<h3 id="字符串的扩展" tabindex="-1"><a class="header-anchor" href="#字符串的扩展" aria-hidden="true">#</a> 字符串的扩展</h3><p>ES6 中对字符串的处理扩展了很多新特性，让字符串的处理更加强大，下面看一个很强大的特性：</p><h4 id="模板字符串" tabindex="-1"><a class="header-anchor" href="#模板字符串" aria-hidden="true">#</a> 模板字符串</h4><p>传统的 JavaScript 语言，输出模板通常是这样写的（下面使用了 jQuery 的方法）。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(&#39;#result&#39;).append(
  &#39;There are &lt;b&gt;&#39; + basket.count + &#39;&lt;/b&gt; &#39; +
  &#39;items in your basket, &#39; +
  &#39;&lt;em&gt;&#39; + basket.onSale +
  &#39;&lt;/em&gt; are on sale!&#39;
);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这种写法相当繁琐不方便，ES6 引入了模板字符串解决这个问题。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>$(&#39;#result&#39;).append(\`
  There are &lt;b&gt;\${basket.count}&lt;/b&gt; items
   in your basket, &lt;em&gt;\${basket.onSale}&lt;/em&gt;
  are on sale!
\`);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模板字符串（template string）是增强版的字符串，用反引号（\`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。</p>`,8),S={href:"http://es6.ruanyifeng.com/#docs/string",target:"_blank",rel:"noopener noreferrer"},_=s(`<h3 id="函数的扩展" tabindex="-1"><a class="header-anchor" href="#函数的扩展" aria-hidden="true">#</a> 函数的扩展</h3><p>ES6 中，对于函数的处理也增加了很多新特性，让函数变得更强大。</p><h4 id="参数默认值" tabindex="-1"><a class="header-anchor" href="#参数默认值" aria-hidden="true">#</a> 参数默认值</h4><p>ES6 之前，不能直接为函数的参数指定默认值，只能采用变通的方法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function log(x, y) {
    x = x || &#39;dasu&#39;;
  	y = y || &#39;Android&#39;;
  	console.log(x, y);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function log(x=&quot;dasu&quot;, y=&quot;Android&quot;) {
  	console.log(x, y);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，参数默认值还有更多细节，比如默认参数的作用域是单独的、有默认参数值的函数 length 属性含义会变化等等。</p><h4 id="剩余参数-reset" tabindex="-1"><a class="header-anchor" href="#剩余参数-reset" aria-hidden="true">#</a> 剩余参数 reset</h4><p>ES6 引入 rest 参数（形式为<code>...变量名</code>），用于获取函数的多余参数，这样就不需要使用<code>arguments</code>对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3) // 10
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="箭头函数" tabindex="-1"><a class="header-anchor" href="#箭头函数" aria-hidden="true">#</a> 箭头函数</h4><p>ES6 允许使用“箭头”（<code>=&gt;</code>）定义函数。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var f = v =&gt; v;

// 等同于
var f = function (v) {
  return v;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>箭头前面是参数，后面的函数体，如果超过 1 个参数，那么用圆括号将多个参数圈起，如果没有参数，就用一个空圆括号 () 表示，如果函数体超过 1 行语句，那么用 {} 大括号包住。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var f = () =&gt; 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) =&gt; num1 + num2;
// 等同于
var sum = function(num1, num2) {
  return num1 + num2;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当函数作为另一个函数的参数时，箭头函数的写法会让代码变得很便捷，如：</p><ul><li>箭头函数的一个用处是简化回调函数。</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 正常函数写法
[1,2,3].map(function (x) {
  return x * x;
});

// 箭头函数写法
[1,2,3].map(x =&gt; x * x);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>嵌套的箭头函数</li></ul><p>箭头函数内部，还可以再使用箭头函数。下面是一个 ES5 语法的多重嵌套函数。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function insert(value) {
  return {into: function (array) {
    return {after: function (afterValue) {
      array.splice(array.indexOf(afterValue) + 1, 0, value);
      return array;
    }};
  }};
}

insert(2).into([1, 3]).after(1); //[1, 2, 3]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这个函数，可以使用箭头函数改写。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>let insert = (value) =&gt; ({into: (array) =&gt; ({after: (afterValue) =&gt; {
  array.splice(array.indexOf(afterValue) + 1, 0, value);
  return array;
}})});

insert(2).into([1, 3]).after(1); //[1, 2, 3]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但使用箭头函数有一些注意点：</p><ul><li>函数体内的 <code>this</code> 对象，就是定义时所在的对象，而不是使用时所在的对象。</li><li>不可以当作构造函数，也就是说，不可以使用 <code>new</code> 命令，否则会抛出一个错误。</li><li>不可以使用 <code>arguments</code> 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。</li><li>不可以使用 <code>yield</code> 命令，因此箭头函数不能用作 Generator 函数。</li></ul>`,26),E={href:"http://es6.ruanyifeng.com/#docs/function",target:"_blank",rel:"noopener noreferrer"},q=s(`<h3 id="class-类" tabindex="-1"><a class="header-anchor" href="#class-类" aria-hidden="true">#</a> class 类</h3><p>JavaScript 语言中，生成实例对象的传统方法是通过构造函数。下面是一个例子。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return &#39;(&#39; + this.x + &#39;, &#39; + this.y + &#39;)&#39;;
};

var p = new Point(1, 2);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这种写法跟传统的面向对象语言（比如 C++ 和 Java）差异很大，很容易让新学习这门语言的程序员感到困惑。</p><p>ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过<code>class</code>关键字，可以定义类。</p><p>基本上，ES6 的<code>class</code>可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的<code>class</code>写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。上面的代码用 ES6 的<code>class</code>改写，就是下面这样。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//定义类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return &#39;(&#39; + this.x + &#39;, &#39; + this.y + &#39;)&#39;;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面代码定义了一个“类”，可以看到里面有一个<code>constructor</code>方法，这就是构造方法，而<code>this</code>关键字则代表实例对象。也就是说，ES5 的构造函数<code>Point</code>，对应 ES6 的<code>Point</code>类的构造方法。</p><p><code>Point</code>类除了构造方法，还定义了一个<code>toString</code>方法。注意，定义“类”的方法的时候，前面不需要加上<code>function</code>这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。</p><p>ES6 的类，完全可以看作构造函数的另一种写法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class Point {
  // ...
}

typeof Point // &quot;function&quot;
Point === Point.prototype.constructor // true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面代码表明，类的数据类型就是函数，类本身就指向构造函数。</p><p>使用的时候，也是直接对类使用<code>new</code>命令，跟构造函数的用法完全一致。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class Bar {
  doStuff() {
    console.log(&#39;stuff&#39;);
  }
}

var b = new Bar();
b.doStuff() // &quot;stuff&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>构造函数的<code>prototype</code>属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的<code>prototype</code>属性上面。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在类的实例上面调用方法，其实就是调用原型上的方法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class B {}
let b = new B();

b.constructor === B.prototype.constructor // true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更多细节内容参考：</p>`,19),k={href:"http://es6.ruanyifeng.com/#docs/class",target:"_blank",rel:"noopener noreferrer"},P={href:"http://es6.ruanyifeng.com/#docs/class-extends",target:"_blank",rel:"noopener noreferrer"},B=s('<h3 id="其他" tabindex="-1"><a class="header-anchor" href="#其他" aria-hidden="true">#</a> 其他</h3><p>阮一峰好歹专门为 ES6 新增的特性写了一整本书，想用一个章节来介绍太不可能了，很多我也没有去细看。</p><p>本篇的主旨就在于大体上列出一些新特性，知道原来 ES6 新增了这些东西，后续有时间再去细看这本书，或者当用到的时候再去查。</p><p>最后，就列举下，其他上面没有讲到的特性吧：</p><ul><li>ArrayBuffer：大概同于操作二进制数据</li><li>set 和 map：新增是数据结构，类似于数组，可以类比 Java 中的 Set 和 Map</li><li>Proxy：修改某些默认行为，等同于在语言层面做出修改，所以属于&quot;元编程&quot;，即对编程语言进行编程。</li><li>Reflect：同样是用于操作对象，修改默认行为。Proxy 更多是在原本行为上增加新的行为，而 Reflect 则是直接修改原本行为。</li><li>Iterator 和 for..of 循环：为不同的数据结构提供各自的遍历访问操作</li><li>Promise：异步编程的解决方案，比传统的解决方案（回调和事件）更合理强大</li><li>Generator 函数：异步编程的解决方案</li><li>async：Generator 函数的语法糖</li><li>正则的扩展、数组的扩展、数值的扩展、对象的扩展等</li></ul>',5);function N(V,J){const i=l("ExternalLinkIcon");return r(),c("div",null,[t,e("p",null,[n("本篇内容全部摘自阮一峰的："),e("a",u,[n("ECMAScript 6 入门"),a(i)])]),o,e("p",null,[n("其他内容，包括关于 Symbol 属性的遍历、Symbol 自带的方法、Symbol 应用场景等见："),e("a",m,[n("Symbol"),a(i)])]),b,e("p",null,[n("更多的参考："),e("a",p,[n("let 和 const 命令"),a(i)])]),h,e("p",null,[e("a",g,[n("module 的语法"),a(i)])]),e("p",null,[e("a",f,[n("module 的加载实现"),a(i)])]),j,e("p",null,[n("解构时，还可以设置默认值，更多用法，参考："),e("a",x,[n("变量的解构赋值"),a(i)])]),y,e("p",null,[n("更多字符串扩展的特性介绍参见："),e("a",S,[n("字符串的扩展"),a(i)])]),_,e("p",null,[n("其他还有很多扩展，包括在 ES5 中，函数有个 name 属性并在标准规范中，但在 ES6 中加入了标准规范中，还有其他新增的一些特性，具体参考："),e("a",E,[n("函数的扩展"),a(i)])]),q,e("p",null,[e("a",k,[n("class 的基本语法"),a(i)])]),e("p",null,[e("a",P,[n("class 的继承"),a(i)])]),B])}const M=d(v,[["render",N],["__file","前端入门21-JavaScript之ES6新特性.html.vue"]]);export{M as default};
