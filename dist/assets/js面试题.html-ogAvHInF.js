import{_ as a,r as d,o as t,c as r,a as e,b as n,e as s,d as l}from"./app-pwInIdNR.js";const o={},c=e("h1",{id:"js-面试题",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#js-面试题","aria-hidden":"true"},"#"),n(" JS 面试题")],-1),v={id:"_1-1-2-3-map-parseint-what-why",tabindex:"-1"},u=e("a",{class:"header-anchor",href:"#_1-1-2-3-map-parseint-what-why","aria-hidden":"true"},"#",-1),p=e("span",{id:"1"},"1.",-1),b={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/4",target:"_blank",rel:"noopener noreferrer"},m=l(`<p>首先得明白题目问的是什么，然后才能知道考查的是哪些知识点。</p><p>题意表达有些简略，这道题意思是说，对一个数组进行 map 操作，map 参数传入全局方法 parseInt，代码是否会正常执行，如果会，那么经过 map 操作后产生的新数组是什么？为什么是这个值？</p><p>所以考查的其实就是 map 方法和 parseInt 方法。</p><p>MDN 上有讲解这个注意事项：</p><p>https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map#%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7%E6%A1%88%E4%BE%8B</p><p>顺带附上parseInt 方法的讲解：</p><p>https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 下面的语句返回什么呢:
[&quot;1&quot;, &quot;2&quot;, &quot;3&quot;].map(parseInt);
// 你可能觉的会是[1, 2, 3]
// 但实际的结果是 [1, NaN, NaN]

// 通常使用parseInt时,只需要传递一个参数.
// 但实际上,parseInt可以有两个参数.第二个参数是进制数.
// 可以通过语句&quot;alert(parseInt.length)===2&quot;来验证.
// map方法在调用callback函数时,会给它传递三个参数:当前正在遍历的元素, 
// 元素索引, 原数组本身.
// 第三个参数parseInt会忽视, 但第二个参数不会,也就是说,
// parseInt把传过来的索引值当成进制数来使用.从而返回了NaN.

function returnInt(element) {
  return parseInt(element, 10);
}

[&#39;1&#39;, &#39;2&#39;, &#39;3&#39;].map(returnInt); // [1, 2, 3]
// 意料之中的结果

// 也可以使用简单的箭头函数，结果同上
[&#39;1&#39;, &#39;2&#39;, &#39;3&#39;].map( str =&gt; parseInt(str) );

// 一个更简单的方式:
[&#39;1&#39;, &#39;2&#39;, &#39;3&#39;].map(Number); // [1, 2, 3]
// 与\`parseInt\` 不同，下面的结果会返回浮点数或指数:
[&#39;1.1&#39;, &#39;2.2e2&#39;, &#39;3e300&#39;].map(Number); // [1.1, 220, 3e+300]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，[&quot;1&quot;, &quot;2&quot;, &quot;3&quot;].map(parseInt) 实际上等效于 [&quot;1&quot;, &quot;2&quot;, &quot;3&quot;].map((value, index) =&gt; parseInt(value, index));</p><p>对于 parseInt 方法来说，第二个参数的取值范围是 2-36，表示如何看待第一个参数值，比如 parseInt(30, 4) 表示说 30 是以四进制格式表示的数值，转换为十进制输出后是 12，所以 parseInt(30, 4) = 12</p><p>当第二个参数输入 0 时，效果等同于没输入，其余值均返回 NaN。</p><ul><li>相似题目</li></ul><p>理清上面的知识点后，再遇到其他一些变形的题目，自然就清楚怎么去分析了，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>let unary = fn =&gt; val =&gt; fn(val)
let parse = unary(parseInt)
console.log([&#39;1.1&#39;, &#39;2&#39;, &#39;0.3&#39;].map(parse)) // [1, 2, 0]

[&#39;10&#39;,&#39;10&#39;,&#39;10&#39;,&#39;10&#39;,&#39;10&#39;].map(parseInt); // [10, NaN, 2, 3, 4]
// parseInt(10, 3) = 1 * 3^1 + 0 * 3^0 = 3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14),h={id:"_2-什么是防抖和节流-有什么区别-如何实现",tabindex:"-1"},_=e("a",{class:"header-anchor",href:"#_2-什么是防抖和节流-有什么区别-如何实现","aria-hidden":"true"},"#",-1),g=e("span",{id:"2"},"2.",-1),f={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5",target:"_blank",rel:"noopener noreferrer"},j=l("<p>该题考查的主要还是概念问题，防抖和节流都是用于处理高频事件的优化。</p><p>**防抖：**高频事件在短时间内不断被触发时，只执行最后一次的触发，过滤前面的事件。即，事件被触发时，延迟 n 秒后再执行，在延迟的这段时间内，如果再次被触发，那么移除之前延迟的事件，以新事件为主，但新事件继续延迟。</p><ul><li>应用场景</li></ul><p>对输入框的内容需要进行校验处理时</p><ul><li>实现</li></ul><p>利用 setTimeout，每次执行前先 clearTimeout，再发起新事件的延迟处理</p><p>**节流：**高频事件在短时间内不断触发时，只执行第一次。即，当事件被触发时，先去处理，但在 n 秒内，如果事件再次被触发，那么直接过滤掉，直到 n 秒后。</p><ul><li>应用场景</li></ul><p>Android 的屏幕刷新机制，每 16.6 ms 内，只响应第一次的 UI 刷新请求即可，其余的 UI 刷新操作都会被过滤掉。</p><ul><li>实现</li></ul><p>利用标志位控制事件是否能够执行，或者利用时间戳判断首次和当前次的时间戳。</p><ul><li>两者区别</li></ul><p>防抖能让高频事件在短时间内只响应一次；节流则是让高频事件在短时间内以固定频率响应</p>",13),y={id:"_3-介绍下-set、map、weakset-和-weakmap-的区别",tabindex:"-1"},E=e("a",{class:"header-anchor",href:"#_3-介绍下-set、map、weakset-和-weakmap-的区别","aria-hidden":"true"},"#",-1),x=e("span",{id:"3"},"3.",-1),A={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/6",target:"_blank",rel:"noopener noreferrer"},w=l("<p>这些是 ES6 中新增的数据结构，用于弥补数组和对象的不足之处。</p><ul><li>Set</li></ul><p>类似于数组的集合，只有键值，成员不能重复，与数组能够相互转换，所以可以很方便的用于数组去重。其他应用场景还有进行交集、并集、差集的计算。</p><ul><li>WeakSet</li></ul><p>在 Set 基础上增加更多的限制，如成员只能是对象类型，不允许遍历。优点则是，成员都是弱引用，随时可能消失，因此不容易造成内存泄漏。</p><ul><li>Map</li></ul><p>一种字典的数据结构，即键值对（key - value）的集合，对象同样也是键值对的集合，但对象的键名 key 只能是字符串类型或 Symbol，Map 允许键名 key 可以是任意类型。</p><p>比如用对象作为 key 值。</p><ul><li>WeakMap</li></ul><p>与 Map 相比较，不能遍历，健名 key 只能是对象类型，成员是弱引用，随时可能被回收，可以防止内存泄漏。</p>",10),k={id:"_4-es5-es6-的继承除了写法以外还有什么区别",tabindex:"-1"},S=e("a",{class:"header-anchor",href:"#_4-es5-es6-的继承除了写法以外还有什么区别","aria-hidden":"true"},"#",-1),I=e("span",{id:"4"},"4.",-1),F={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/20",target:"_blank",rel:"noopener noreferrer"},q=l(`<p>ES5 通过原型 prototype 实现继承；</p><p>ES6 新增 class 语法，可通过 extends 实现类的继承；</p><p>js 是基于原型的语言，虽然 class 的语法实际上只是语法糖，本质实现仍旧是通过原型实现继承，但直接通过 prototype 的继承和 class 语法的 extends 继承还是有一些区别。</p><ul><li>父类属性的继承</li></ul><p>在 ES5 中：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function A(){
    this.a = 1;
}
function B(){
    this.b = 2;
}
B.prototype = new A();

var b = new B(); // b: {b: 2}
b.a; // 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过构造函数 B 创建实例 b 时，直接在 B 内部先创建 this，然后通过构造函数 B 内部对 this 进行加工，最后得到实例 b 对象：{b: 2}。</p><p>所以，b 实际上只有自有属性，但实例 b 的原型会指向 B.prototype 即 A 的实例，所以可能通过原型链访问到 a 属性。</p><p>在 ES6 中：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class A {
	constructor(){
        this.a = 1;
    }
}

class B extends A {
    constructor(){
        super();
        this.b = 2;
    }
}

var b = new B(); // b: {a: 1, b: 2}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过 class B 来创建实例对象 b 时，必须先创建父类 A 的实例对象，然后再创建类 B 的 this，然后通过 super 来调用父类构造函数对 this 进行加工，最后再执行类 B 构造函数对 this 继续加工。</p><p>所以最后 b 对象，实际上就已经含有父类中定义的 a 对象了</p>`,12),B={id:"_5-判断数组的几种方式",tabindex:"-1"},D=e("a",{class:"header-anchor",href:"#_5-判断数组的几种方式","aria-hidden":"true"},"#",-1),N=e("span",{id:"5"},"5.",-1),O={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/23",target:"_blank",rel:"noopener noreferrer"},Q=l(`<p>判断某个变量类型是否为数组，有三种方式：</p><ul><li>instanceof</li><li>Object.prototype.toString.call()</li><li>Array.isArray()</li></ul><p>下面大概讲讲：</p><p>instanceof 是通过判断左边的对象类型数据的原型链上是否存在右边的对象，判断数组时，直接：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = [];
var b = 1;
a instanceof Array; // true，因为 [].__proto__.contructor.name = Array
b instanceof Array; // false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Object.prototype.toString.call() 获取的信息又叫做类属性，可用于判断内置的数据类型，包括 6 种基本数据类型和内置的对象类型（如 RegExp 等）：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Object.prototype.toString.call(&#39;An&#39;) // &quot;[object String]&quot;
Object.prototype.toString.call(1) // &quot;[object Number]&quot;
Object.prototype.toString.call(Symbol(1)) // &quot;[object Symbol]&quot;
Object.prototype.toString.call(null) // &quot;[object Null]&quot;
Object.prototype.toString.call(undefined) // &quot;[object Undefined]&quot;
Object.prototype.toString.call(function(){}) // &quot;[object Function]&quot;
Object.prototype.toString.call({name: &#39;An&#39;}) // &quot;[object Object]&quot;
Object.prototype.toString.call([])  //[object Array]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Array.isArray() 是 ES6 新增的用于判断是否是数组的静态方法，当浏览器不支持时，可用 Object.prototype.toString.call 模拟实现。</p>`,8),M={id:"_6-讲讲模块化发展",tabindex:"-1"},C=e("a",{class:"header-anchor",href:"#_6-讲讲模块化发展","aria-hidden":"true"},"#",-1),J=e("span",{id:"6"},"6.",-1),T={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/28",target:"_blank",rel:"noopener noreferrer"},V={href:"https://github.com/woshidasusu/Doc/blob/master/Blogs/__%E5%89%8D%E7%AB%AF%E5%85%A5%E9%97%A8/%E5%89%8D%E7%AB%AF%E5%85%A5%E9%97%A822-%E8%AE%B2%E8%AE%B2%E6%A8%A1%E5%9D%97%E5%8C%96.md",target:"_blank",rel:"noopener noreferrer"},G=e("p",null,"大概来说，是这么一个发展过程：",-1),z=e("ol",null,[e("li",null,"全局变量、全局函数 =>"),e("li",null,"对象作为命名空间 =>"),e("li",null,"立即执行的函数作为临时命名空间（IIFE） + 闭包 =>"),e("li",null,"动态创建 <script> 工具（LAB.js） =>"),e("li",null,"CommonJS 规范和 node.js =>"),e("li",null,"AMD 规范和 Require.js =>"),e("li",null,"CMD 规范和 Sea.js =>"),e("li",null,"ES6 标准")],-1),L={id:"_7-全局作用域中-用-const-和-let-声明的变量不在-window-上-那到底在哪里-如何去获取",tabindex:"-1"},P=e("a",{class:"header-anchor",href:"#_7-全局作用域中-用-const-和-let-声明的变量不在-window-上-那到底在哪里-如何去获取","aria-hidden":"true"},"#",-1),R=e("span",{id:"7"},"7.",-1),U={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/30",target:"_blank",rel:"noopener noreferrer"},W=e("p",null,"在 ES3 中，变量的作用域只有全局作用域和函数内作用域两种场景。而它的原理，是基于 EC（执行上下文），每次当执行全局代码或函数代码时，都会创建一个 EC，而 EC 中有一个 VO（变量对象），用来存储当前上下文中的变量。同时还有一个作用域链，用于给当前上下文访问它可使用的外部变量。",-1),H={href:"https://github.com/woshidasusu/Doc/blob/master/Blogs/__%E5%89%8D%E7%AB%AF%E5%85%A5%E9%97%A8/%E5%89%8D%E7%AB%AF%E5%85%A5%E9%97%A818-JavaScript%E8%BF%9B%E9%98%B6%E4%B9%8B%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE.md",target:"_blank",rel:"noopener noreferrer"},K=e("p",null,"但在 ES6 中，作用域这种概念已被废弃了，取而代之的是词法环境（Lexical environment）。",-1),X=e("p",null,"词法环境，简单点说，就是相应代码块内标识符与值的关联关系的体现，它有两个组成部分：环境记录（Environment Record），用途类似于执行上下文（EC）中的 VO；外部词法环境的引用（outer），用途类似于执行上下文（EC）中的作用域链。",-1),Y=e("p",null,"更多内容参考：",-1),Z={href:"https://juejin.im/post/5c0a398be51d451dcb0400b3",target:"_blank",rel:"noopener noreferrer"},$={href:"https://juejin.im/post/5c05120be51d4513416d2111",target:"_blank",rel:"noopener noreferrer"},ee={href:"https://blog.csdn.net/szengtal/article/details/78722826",target:"_blank",rel:"noopener noreferrer"},ne=e("p",null,"对于这个题目，js 引擎在遇到不同类型代码时会创建相对应的词法环境，这些变量就存储于各自的词法环境中。大体上，有这么几种：",-1),ie=e("ul",null,[e("li",null,"Global：全局变量，存储于 window 的属性里"),e("li",null,"Block：块级作用域，每个有 {} 包含的代码块"),e("li",null,"Local：函数内的局部变量，没有闭包的场景下，生命周期同函数"),e("li",null,"Catch：try-catch 的代码块"),e("li",null,"Script：也可以说是顶级的 Block，全局作用内通过 let 等声明的变量")],-1),se=e("p",null,[e("img",{src:"https://user-images.githubusercontent.com/33000154/64755227-fffd2b00-d55c-11e9-8fa2-0e2e809e9cf3.jpg",alt:""})],-1),le=e("p",null,"所以，在全局作用域内声明的 let 变量，不存在于 window 上，而是存储于一个顶级的 Block 中即 Script，可直接通过变量的引用访问。",-1),ae={id:"_8-下面的代码打印什么内容-为什么",tabindex:"-1"},de=e("a",{class:"header-anchor",href:"#_8-下面的代码打印什么内容-为什么","aria-hidden":"true"},"#",-1),te=e("span",{id:"8"},"8.",-1),re={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/48",target:"_blank",rel:"noopener noreferrer"},oe=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var b = 10;
(function b() {
  b = 20;
  console.log(b)
})()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>很有意思的一个题目，题目稍微变形下，可以考察很多知识点。</p><p>本题主要考察，针对具名函数表达式（Name Function Expression，NFE），函数名变量的作用域。</p><p>在 ES3 中，有函数执行上下文、变量对象、作用域的理论概念。这些概念用于说明，当执行一个函数时，函数内部各种类型变量能够使用的原理。</p><p>简单说一点，函数执行上下文中包括一个变量对象 VO，变量对象存储着函数内部的变量，如：函数参数、局部变量、this 等。但需要注意一点，不包括具名函数表达式的函数名变量。</p><p>什么是具名函数表达式（NFE）？</p><p>函数声明有两种方式：</p><ul><li>函数声明式： function a() {}</li><li>函数表达式：var a = function() {}</li></ul><p>当函数表达式等号右边的函数也带有名字时，就称为具名函数表达式（NFE），如： var a = function b() {}</p><p>接下去说些理论（基于 ES3 的执行上下文概念）：</p><ul><li>当代码执行到函数表达式时，其实就意味着此时已经处于执行上下文的执行阶段了，也就是已经过了解析阶段，当前上下文的变量对象已经创建完毕，也就是变量已经提前声明处理了。</li><li>在执行阶段，也就只会对变量对象中提前声明的变量进行赋值处理，比如上例中对变量 a 进行赋值，变量 a 是当前上下文的变量对象中的成员。所以在函数内各个地方均可以被使用。</li><li>而 b 并不在当前上下文的变量对象 VO 成员中，所以在函数内是无法使用变量 b 的，要调用 b 函数，只能通过变量 a，因为函数 b 已经被赋值给变量 a 了。</li><li>当执行函数表达式时，声明了函数 b 并赋值给变量 a，在这个过程中，会往函数 b 对象赋值一个内部属性 [[Scope]]，值为当前上下文的作用域链。</li><li>当函数 b 被调用执行时，会创建函数 b 的执行上下文，并进行执行上下文的解析阶段和执行阶段。</li><li>针对于具名函数表达式（NFE），在创建执行上下文的作用域链时，会有一个额外的处理：</li><li><strong>具名函数表达式 b 的执行上下文的作用域链的生成规则：函数 b 执行上下的变量对象 VO + {函数名 b 常量}（额外的处理） + [[Scope]]</strong></li></ul><p>简单点说，具名函数表达式的函数名变量会被单独存储于一个特定对象中，且是作为常量存储，即只读。然后将其置于作用域链中，优先级低于变量对象 VO，但高于 [[Scope]]。</p><p>这就造成了具名函数表达式的函数名变量具有特定的作用域，即：外部无法访问，函数内可以访问但不能修改，不过会被函数内同名的局部变量覆盖。</p><p>想验证，也很简单，看看下面的例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 外部无法访问
var a = function b() {}
console.log(a); // function b...
console.log(b); // Uncaught ReferenceError: b is not defined

// 函数内可以访问但不能修改
var a = function b() {
	console.log(b);  // function b...
	b = 1;
    console.log(b);  // function b...
}
a();

// 函数内可以访问但不能修改
var a = function b() {
    &#39;use strict&#39;;
	console.log(b);  
	b = 1;
    console.log(b);
}
a(); // Uncaught TypeError: Assignment to constant variable

// 会被函数内同名的局部变量覆盖
var a = function b() {
	var b = 1;
    console.log(b);  // 1
}
a();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，再回头看看题目：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var b = 10;
(function b() {
  b = 20;  // 访问的是函数名 b 变量，因为是常量，所以赋值无效
  console.log(b);  // function b...
})()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为立即执行函数（IIFE）其实本质上是函数表达式，所以题目的输出应该是 fn，这应该就清楚了。</p><p>PS：以上讲到的执行上下文、变量对象、作用域概念是在 ES3 规范中提出的，在 ES5 中，这些概念就被词法环境、环境记录、外部引用等新概念取代了。但其实，本质上差别不大，处理规则应该还是类似，只是一些流程以及细节方面变化了，或者新扩展了。</p><p>本题稍微修改下，就可以考察其他知识点了：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 考察函数作用域的变量 + 变量声明提前特性
var b = 10;
(function b() {
    console.log(b);  // undefined
  	var b = 20;  
    console.log(b);  // 20
})()

// 考察全局作用域的变量
var b = 10;
(function a() {
  	b = 20;
    c = 20;
  	console.log(b);  // 20
})()
console.log(b);  // 20
console.log(c);  // 20
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-输出以下代码执行的结果并解释为什么" tabindex="-1"><a class="header-anchor" href="#_9-输出以下代码执行的结果并解释为什么" aria-hidden="true">#</a> <span id="9">9.</span> 输出以下代码执行的结果并解释为什么</h3>`,22),ce={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/76",target:"_blank",rel:"noopener noreferrer"},ve=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var obj = {
    &#39;2&#39;: 3,
    &#39;3&#39;: 4,
    &#39;length&#39;: 2,
    &#39;splice&#39;: Array.prototype.splice,
    &#39;push&#39;: Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察 push 方法的操作，Array.prototype.push 方法不仅可以用于对数组类型数据进行操作，也可以用于操作对象。</p><p>push 方法操作的逻辑：将数据放入 length 指向的下标，length 加 1 后并返回。如果 length 不存在，那么创建它并从 0 开始。</p><p>所以，对于该题目，会在下标为 2 的地址开始 push 数据，最终结果就是：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>obj = {
    &#39;2&#39;: 1,
    &#39;3&#39;: 2,
    &#39;length&#39;: 4,
    &#39;splice&#39;: Array.prototype.splice,
    &#39;push&#39;: Array.prototype.push
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),ue={href:"https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/event_listeners/EventListenersUtils.js#L330",target:"_blank",rel:"noopener noreferrer"},pe=e("div",{class:"language-javascript line-numbers-mode","data-ext":"js"},[e("pre",{class:"language-javascript"},[e("code",null,`console.log(obj) // [empty*2, 1, 2, splice: f, push: f]
`)]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"})])],-1),be={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/93",target:"_blank",rel:"noopener noreferrer"},me=e("span",{id:"9.2"},"第二题",-1),he=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = {n: 1};
var b = a;
a.x = a = {n: 2};

console.log(a.x) 	
console.log(b.x)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本题考察运算符优先级问题： <code>.</code> 优先级大于 <code>=</code></p><p>所以连续赋值时： <code>a.x = a = {n: 2}</code>，会先进行 <code>.</code> 运算，即在此时 a 指向的对象 {n: 1} 上面创建一个 x 属性，然后进行 <code>=</code> 赋值运算，从右至左，所以 a 指向新的对象 {n: 2}，然后该对象赋值给 x 属性。</p><p>最后结果就是，a = {n: 2}，b = {n: 1, x: {n: 2}}</p><p>所以输出的结果： undefined，{n: 2}</p><p>附上运算符优先级顺序：</p><table><thead><tr><th>运算符</th><th>描述</th></tr></thead><tbody><tr><td>. [] ()</td><td>字段访问、数组下标、函数调用以及表达式分组</td></tr><tr><td>++ -- - ~ ! delete new typeof void</td><td>一元运算符、返回数据类型、对象创建、未定义值</td></tr><tr><td>* / %</td><td>乘法、除法、取模</td></tr><tr><td>+ - +</td><td>加法、减法、字符串连接</td></tr><tr><td>&lt;&lt; &gt;&gt; &gt;&gt;&gt;</td><td>移位</td></tr><tr><td>&lt; &lt;= &gt; &gt;= instanceof</td><td>小于、小于等于、大于、大于等于、instanceof</td></tr><tr><td>== != === !==</td><td>等于、不等于、严格相等、非严格相等</td></tr><tr><td>&amp;</td><td>按位与</td></tr><tr><td>^</td><td>按位异或</td></tr><tr><td>|</td><td>按位或</td></tr><tr><td>&amp;&amp;</td><td>逻辑与</td></tr><tr><td>||</td><td>逻辑或</td></tr><tr><td>?:</td><td>条件</td></tr><tr><td>= oP=</td><td>赋值、运算赋值</td></tr><tr><td>,</td><td>多重求值</td></tr></tbody></table>`,7),_e={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/125",target:"_blank",rel:"noopener noreferrer"},ge=e("span",{id:"9.3"},"第三题",-1),fe=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// example 1
var a={}, b=&#39;123&#39;, c=123;  
a[b]=&#39;b&#39;;
a[c]=&#39;c&#39;;  
console.log(a[b]); // c

---------------------
// example 2
var a={}, b=Symbol(&#39;123&#39;), c=Symbol(&#39;123&#39;);  
a[b]=&#39;b&#39;;
a[c]=&#39;c&#39;;  
console.log(a[b]); // b

---------------------
// example 3
var a={}, b={key:&#39;123&#39;}, c={key:&#39;456&#39;};  
a[b]=&#39;b&#39;;
a[c]=&#39;c&#39;;  
console.log(a[b]);  // c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本题考察对象的 key 值本质。</p><p>对象的键值 key 只能是字符串类型或 Symbol 类型的数据，所以通过 <code>[]</code> 操作时，不是这两种类型的，会先进行一次 String(xx) 的转换。</p><p>所以，对于第一个例子，number 类型会被转成 string 类型，导致值被覆盖，输出 c；第二个例子，每个 Symbol 都是唯一的，所以不会被覆盖；第三个例子，对象转成 string 默认都是 [object object]，所以两个的 key 值其实一样，后者覆盖前者。</p><p>另外，ES6 中新增了 Map 类型的数据，就是为了扩展对象的键值类型的局限，在 Map 中，键值可以是任意类型，number，string，object 都可以。</p>`,5),je={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/155",target:"_blank",rel:"noopener noreferrer"},ye=e("span",{id:"9.4"},"第四题",-1),Ee=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function Foo() {
    Foo.a = function() {
        console.log(1)
    }
    this.a = function() {
        console.log(2)
    }
}
Foo.prototype.a = function() {
    console.log(3)
}
Foo.a = function() {
    console.log(4)
}
Foo.a();  // 4
let obj = new Foo();
obj.a();  // 2
Foo.a();  // 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本题考察的是基础知识：对象的创建、继承、原型链、自有属性、继承属性、静态方法、实例方法；</p><p>第一个输出 4 是因为代码执行到这里时，为构造函数 Foo 对象定义了输出 4 的 a 方法，那么调用它自然就是输出 4；</p><p>然后因为通过 new 调用了构造函数，那么构造函数 Foo 内部的代码就会被执行，此时 Foo 对象的 a 方法被替代为输出 1 的函数了；然后通过 this 添加了一个对象属性 a，类型是输出 2 的函数；</p><p>所以调用对象的 a 方法，自然就是输出 2；</p><p>可能你会疑惑，不是还通过 Foo.prototype.a 给原型定义了一个 a 方法么？不是说，通过构造函数创建的对象都会继承自 Foo.prototype 么？</p><p>是啊，你说的没错啊，所以通过构造函数 Foo 创建的对象是具有 Foo.prototype.a 的继承属性的啊，这点是正确的啊；只是，访问对象 obj.a 属性时，是优先读取对象的自有属性，如果不存在，才会去原型链上寻找。</p><p>最后一行代码再次调用 Foo.a() 方法，因为已经被替换掉了，所以输出 1；</p><p>以上，就是该题考察的知识点，不难，很基础，理理就清楚了。</p>`,9),xe={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/190",target:"_blank",rel:"noopener noreferrer"},Ae=e("span",{id:"9.5"},"第五题",-1),we=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var name = &#39;Tom&#39;;
(function() {
  if (typeof name == &#39;undefined&#39;) {
    var name = &#39;Jack&#39;;
    console.log(&#39;Goodbye &#39; + name);
  } else {
    console.log(&#39;Hello &#39; + name);
  }
})(); // Goodbye Jack
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>仍旧考察的是变量的作用域：全局作用域和函数内作用域，且 var 变量的声明有提前的特性。</p><p>所以在 IIFE 块内的 name 在代码执行前已经被提前声明了，值为 undefined，所以走 if 分支，所以输出 Goodbye Jack；</p><p>题目稍微变形下，输出结果就不一样了，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var name = &#39;Tom&#39;;
(function() {
  if (typeof name == &#39;undefined&#39;) {
    name = &#39;Jack&#39;;
    // let name = &#39;Jack&#39;
    console.log(&#39;Goodbye &#39; + name);
  } else {
    console.log(&#39;Hello &#39; + name);
  }
})(); // Hello Tom
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),ke={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/229",target:"_blank",rel:"noopener noreferrer"},Se=e("span",{id:"9.6"},"第六题",-1),Ie=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>1 + &quot;1&quot;  // ‘11’

2 * &quot;2&quot; // 4 

[1, 2] + [2, 1]  //&#39;1,22,1&#39;

&quot;a&quot; + + &quot;b&quot;  // &#39;aNaN&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察一些运算符隐含的类型转换操作：</p><p><code>+</code> 运算符，如果有 string 类型的，那么进行字符串拼接操作；如果有对象类型，先将其转换成 string，即通过 valueOf() 或 toString()，再进行拼接操作；</p><p>对于 &#39;a&#39; + + &#39;b&#39; 相当于 &#39;a&#39; + (+&#39;b&#39;) 运算，此时后面的 <code>+</code> 被当做一元运算符处理，即将后面的数据转换成 number 的操作，最后再进行字符串拼接；</p>`,4),Fe={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/251",target:"_blank",rel:"noopener noreferrer"},qe=e("span",{id:"9.7"},"第七题",-1),Be=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function wait() {
  return new Promise(resolve =&gt;
    setTimeout(resolve, 10 * 1000)
  )
}

async function main() {
  console.time();
  const x = wait();
  const y = wait();
  const z = wait();
  await x;
  await y;
  await z;
  console.timeEnd();
}
main();  // 10000ms
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察 async 和 await 的知识。</p><p>async 只是 Generator 函数的异步任务应用和自动流程管理器的语法糖，也就是碰到 await 时，函数会交出执行权，等待后续 Promise 任务的状态变化，再切回继续往下执行。</p><p>所以，上述例子中，x，y，z 三个 Promise 任务会并行处理，然后再依次等待每个 Promise 状态变更，总耗时大概 10s，因为一个 Promise 耗时 10s；</p><p>但题目可以稍微变形下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>async function main() {
  console.time();
  await wait();
  await wait();
  await wait();
  console.timeEnd();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时，三个 Promise 任务就是串行处理了，后一个必须等待前一个状态变更后才进行，所以总耗时大概 30s。</p>`,7),De={id:"_10-call-和-apply-的区别是什么-哪个性能更好一些",tabindex:"-1"},Ne=e("a",{class:"header-anchor",href:"#_10-call-和-apply-的区别是什么-哪个性能更好一些","aria-hidden":"true"},"#",-1),Oe=e("span",{id:"10"},"10.",-1),Qe={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/84",target:"_blank",rel:"noopener noreferrer"},Me=l(`<p>以 <code>Math.max(1, 2, 3, 4)</code> 举例：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// call
Math.max.call(null, 1, 2, 3, 4);

//apply
Math.max.apply(null, [1, 2, 3, 4]);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>区别其实仅在于接收的参数， call 接收的是不定长的参数，而 apply 接收的是数组；</p><p>大部分场景两者并没有什么异同，只是在 ES3 时，还没有 ES6 新增的数组扩展运算符 <code>...</code> 运算，所以没法将数组解开成参数列表，那么对于一些只接收不定长参数的方法来说，参数来源刚好是数组时，就很鸡肋，这种场景下，就可以使用 apply 来处理。</p><p>比如，求一个数组里的最大值，但 Math.max 方法只接收不定长参数，不接收数组参数，在 ES3 中，就只能通过 apply 来处理，call 处理不了。</p><p>但在 ES6 中，因为新增了 <code>...</code> 运算，所以 call 基本可以覆盖 apply 的使用场景，而且性能又比 apply 好，所以建议都使用 call。</p><p>如： <code>Math.max.call(null, ...[1, 2, 3, 4]);</code></p><p>很多资料都说 call 性能比 apply 好，原因不清楚，有的说是因为 apply 内部至少需要额外进行一次数组参数的解构处理。</p>`,8),Ce={id:"_11-箭头函数和普通函数的区别",tabindex:"-1"},Je=e("a",{class:"header-anchor",href:"#_11-箭头函数和普通函数的区别","aria-hidden":"true"},"#",-1),Te=e("span",{id:"11"},"11.",-1),Ve={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/101",target:"_blank",rel:"noopener noreferrer"},Ge=e("ul",null,[e("li",null,[e("p",null,"箭头函数的 this 会自动绑定在定义时所在的作用域内的 this 值")]),e("li",null,[e("p",null,"箭头函数的 this 因为已经被自动绑定，所以当通过 call，apply 给函数指定 this 时，会失效")]),e("li",null,[e("p",null,"箭头函数不能使用 argument，如需该场景，可手动添加 ...reset 参数替代")]),e("li",null,[e("p",null,"箭头函数不能当做构造函数使用，即不能结合 new 使用")]),e("li",null,[e("p",null,"箭头函数内部不能有 yield 命令，即不能当做 Generator 函数使用")])],-1),ze={id:"_12-为什么-for-循环嵌套顺序会影响性能",tabindex:"-1"},Le=e("a",{class:"header-anchor",href:"#_12-为什么-for-循环嵌套顺序会影响性能","aria-hidden":"true"},"#",-1),Pe=e("span",{id:"12"},"12.",-1),Re={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/235",target:"_blank",rel:"noopener noreferrer"},Ue=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var t1 = new Date().getTime()
for (let i = 0; i &lt; 100; i++) {
  for (let j = 0; j &lt; 1000; j++) {
    for (let k = 0; k &lt; 10000; k++) {
    }
  }
}
var t2 = new Date().getTime()
console.log(&#39;first time&#39;, t2 - t1)

for (let i = 0; i &lt; 10000; i++) {
  for (let j = 0; j &lt; 1000; j++) {
    for (let k = 0; k &lt; 100; k++) {

    }
  }
}
var t3 = new Date().getTime()
console.log(&#39;two time&#39;, t3 - t2)  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最内层的执行次数虽然都是一样的，但前两层的执行次数就不一样了。</p><p>而执行过程的操作包括：变量的初始化、判断语句、自增语句，总是需要耗费性能的。</p><p>所以，内层循环次数大的话，就会比较耗时；</p><p>当然，理论上是这样子，但不同引擎或许会对这段代码有所优化，所以也并不一定后者就一定最耗时。</p>`,5);function We(He,Ke){const i=d("ExternalLinkIcon");return t(),r("div",null,[c,e("h3",v,[u,n(),p,n(),e("a",b,[n("['1', '2', '3'].map(parseInt) what & why?"),s(i)])]),m,e("h3",h,[_,n(),g,n(),e("a",f,[n("什么是防抖和节流？有什么区别？如何实现？"),s(i)])]),j,e("h3",y,[E,n(),x,n(),e("a",A,[n("介绍下 Set、Map、WeakSet 和 WeakMap 的区别？"),s(i)])]),w,e("h3",k,[S,n(),I,n(),e("a",F,[n("ES5/ES6 的继承除了写法以外还有什么区别？"),s(i)])]),q,e("h3",B,[D,n(),N,n(),e("a",O,[n("判断数组的几种方式"),s(i)])]),Q,e("h3",M,[C,n(),J,n(),e("a",T,[n("讲讲模块化发展"),s(i)])]),e("p",null,[e("a",V,[n("点击跳转"),s(i)])]),G,z,e("h3",L,[P,n(),R,n(),e("a",U,[n("全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？"),s(i)])]),W,e("p",null,[n("具体原理查看这篇："),e("a",H,[n("JavaScript进阶之作用域链"),s(i)])]),K,X,Y,e("p",null,[e("a",Z,[n("深入JavaScript系列（一）：词法环境"),s(i)])]),e("p",null,[e("a",$,[n("彻底搞懂javascript-词法环境(Lexical Environments)"),s(i)])]),e("p",null,[e("a",ee,[n("ECMA-262-5 词法环境:通用理论（四）--- 环境"),s(i)])]),ne,ie,se,le,e("h3",ae,[de,n(),te,n(),e("a",re,[n("下面的代码打印什么内容，为什么？"),s(i)])]),oe,e("ul",null,[e("li",null,[e("a",ce,[n("第一题"),s(i)])])]),ve,e("p",null,[n("另外，还考察的一个知识点是，"),e("a",ue,[n("console 控制台在输出日志时，会对对象进行是否是类数组数据判断，判断逻辑"),s(i)]),n("：是否有 length 属性，且具有 splice 方法，满足两者的话，会以数组形式打印，所以题目输出的应该是：")]),pe,e("ul",null,[e("li",null,[e("a",be,[me,s(i)])])]),he,e("ul",null,[e("li",null,[e("a",_e,[ge,s(i)])])]),fe,e("ul",null,[e("li",null,[e("a",je,[ye,s(i)])])]),Ee,e("ul",null,[e("li",null,[e("a",xe,[Ae,s(i)])])]),we,e("ul",null,[e("li",null,[e("a",ke,[Se,s(i)])])]),Ie,e("ul",null,[e("li",null,[e("a",Fe,[qe,s(i)])])]),Be,e("h3",De,[Ne,n(),Oe,n(),e("a",Qe,[n("call 和 apply 的区别是什么，哪个性能更好一些"),s(i)])]),Me,e("h3",Ce,[Je,n(),Te,n(),e("a",Ve,[n("箭头函数和普通函数的区别"),s(i)])]),Ge,e("h3",ze,[Le,n(),Pe,n(),e("a",Re,[n("为什么 for 循环嵌套顺序会影响性能？"),s(i)])]),Ue])}const Ye=a(o,[["render",We],["__file","js面试题.html.vue"]]);export{Ye as default};
