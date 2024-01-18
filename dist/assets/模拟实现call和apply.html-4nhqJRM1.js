import{_ as a,r as s,o as r,c as d,a as i,b as e,e as l,d as t}from"./app-dV2aVdq6.js";const c={},v=i("h1",{id:"模拟实现-call-和-apply",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#模拟实现-call-和-apply","aria-hidden":"true"},"#"),e(" 模拟实现 call 和 apply")],-1),u={href:"https://muyiy.cn/blog/3/3.3.html#%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF",target:"_blank",rel:"noopener noreferrer"},o=i("h3",{id:"基础",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#基础","aria-hidden":"true"},"#"),e(" 基础")],-1),b=i("p",null,"首先来认识一下 call 和 apply，它们都是 Function.prototype 上的方法，也就是说，所有函数都拥有的方法。",-1),p=i("p",null,"作用都是用来显示绑定函数内部的上下文 this 的指向，区别仅在于两者对参数的处理不同，一个接收参数列表，一个接收参数数组。列出 MDN 的地址：",-1),h={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply",target:"_blank",rel:"noopener noreferrer"},m={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call",target:"_blank",rel:"noopener noreferrer"},g=t(`<h4 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function b(a, b) {
    console.log(this, a, b);
}
var o = {
    a: 1
}

b.call(null, 1, 2);  // 输出： Window   1   2
b.call(o, 1, 2);  // 输出 {a: 1}   1   2

b.apply(null, [1, 2]);  // 输出： Window   1   2
b.apply(o, [1, 2]);   // 输出：  {a: 1}   1   2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以 call 和 apply 的执行效果其实是一样的，区别就在于接收参数的形式，是参数列表，还是参数数组。</p><h4 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> 应用场景</h4><ul><li>调用原型方法</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 如果某对象覆盖了原型上某个方法，那么调用该方法一直是走对象上的逻辑，此时如果有需求要走父类逻辑，可通过 call，类似于其他语言的 super

// [] 重写了 toString，所以需要的话，可以调用 Object.prototype.toString 原有逻辑
Object.prototype.toString.call([]); // [object Array]
[].toString();  // &#39;&#39;

function A() {
    this.a = 1;
}
function B() {
    A.call(this); // 调用父构造函数，类似于其他语言的 super();
    this.b = 1;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>解决参数列表和参数数组问题</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = [1, 2, 3, 5, 3];  // 对数组数据求最大值

Math.max.apply(null, a); // 输出 5
// 因为 Math.max(arg1, arg2, arg3...) 只接收参数列表方式，不接收数组类型参数
// 但 ES6 中的扩展运算符也可以解决这个问题
Math.max(...a);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>显示指定函数内的上下文 this 指向</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = 1;
var o = {
    a: 2
}

function b() {
    console.log(this.a);
}

b(); // 1
b.call(o); // 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模拟实现" tabindex="-1"><a class="header-anchor" href="#模拟实现" aria-hidden="true">#</a> 模拟实现</h3><h4 id="function-prototype-call-thisarg-arg1-arg2" tabindex="-1"><a class="header-anchor" href="#function-prototype-call-thisarg-arg1-arg2" aria-hidden="true">#</a> Function.prototype.call(thisArg, arg1, arg2, ...)</h4><p>要想模拟实现 call，必须得先掌握几个关键点：</p><ul><li>call 接收的参数形式和含义，及 thisArg 对 null，undefined，基本类型的特殊处理</li><li>call 本质上是函数的另一种调用，只是修改了函数内的 this</li></ul><p>这两点是关键，展开讲的话，也就是我们要自己实现这些工作：</p><ul><li>接收不定长的参数列表，第一个参数 thisArg 表示函数内 this 指向 <ul><li>当 thisArg 值为 null 或 undefined 时，在非严格模式下，替换成全局对象，如 window</li><li>当 thisArg 值为其他基本类型，如 number，boolean 等时，在非严格模式下，自动进行包装对象转换 Object(thisArg)</li></ul></li><li>第二个参数开始的剩余参数列表依次传给函数</li><li>触发函数的执行</li><li>修改函数的 this 指向第一个参数经过处理后的值</li></ul><p>贴代码前，先来大概讲讲各个工作的实现方案：对第一个参数 thisArg 的处理，也就是进行各种判断各种处理即可；获取剩余参数列表，可以用 ES6 的扩展运算符；触发函数执行，也就是调用一下函数即可；</p><p>那么，还剩下最后一点，<strong>如何模拟实现修改函数内的 this 指向呢</strong>？</p><p>这就涉及到 this 绑定的各种方式了，文末有推荐文章，感兴趣可以去看看，这里就大概说一说：</p><ul><li>默认绑定（如普通函数内的 this 默认绑定到 window）</li><li>隐式绑定（如将函数赋值给某个对象，以对象的方法来调用该函数，this 会绑定到该对象上）</li><li>显示绑定（call, apply, bind, Reflect.apply）</li><li>new 绑定（当函数和 new 使用时会被当做构造函数，构造函数内部的 this 会绑定到内部新创的对象上）</li><li>箭头函数的绑定（绑定到箭头函数定义时的上下文）</li></ul><p>这五种方式中，可以分成两类：绑定的对象是特定对象或任意对象。其中，隐式绑定和显示绑定属于后者，而我们想要模拟实现 call，自然就不能再使用显示绑定了，那只剩下从隐式绑定方案去解决了。</p><p>只要把经过函数挂载到经过处理后的 thisArg 对象上，然后以对象的方法形式调用，就可以完成修改函数内 this 指向的效果了。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Function.prototype.call2 = function(thisArg, ...args) {
    // 1. 对 thisArg 的处理
    let context = thisArg != null ? Object(thisArg) : window;
    
    // 2. 将该函数挂载到指定的上下文 this 对象上
    let fn = Symbol();  // Symbol 可以避免属性冲突或被外部修改
    context[fn] = this; // this 调用 call2 的函数
    
    // 3. 以对象的方法形式调用函数，并取得返回值
    let result;
    if(args) {
        result = context[fn](...args);
    } else {
        result = context[fn]();
    }
    
    // 4. 清掉挂载的 fn，并返回
    delete context[fn];
    return result;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于如何判断函数内部是否有开启了严格模式，这点就不知道怎么实现了。</p><h4 id="function-prototype-apply-thisarg-argsarray" tabindex="-1"><a class="header-anchor" href="#function-prototype-apply-thisarg-argsarray" aria-hidden="true">#</a> Function.prototype.apply(thisArg, [argsArray])</h4><p>apply 跟 call 本质上是一样的，区别仅在于对参数的接收形式不同，直接看模拟实现的代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Function.prototype.apply2 = function(thisArg, args) {
    // 1. 对 thisArg 的处理
    let context = thisArg != null ? Object(thisArg) : window;
    if (!Array.isArray(args)) {
        throw new TypeError(&#39;args is not a Array&#39;);
    }
    
    // 2. 将该函数挂载到指定的上下文 this 对象上
    let fn = Symbol();  // Symbol 可以避免属性冲突或被外部修改
    context[fn] = this; // this 调用 call2 的函数
    
    // 3. 以对象的方法形式调用函数，并取得返回值
    let result;
    if(args) {
        result = context[fn](...args);
    } else {
        result = context[fn]();
    }
    
    // 4. 清掉挂载的 fn，并返回
    delete context[fn];
    return result;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="思考" tabindex="-1"><a class="header-anchor" href="#思考" aria-hidden="true">#</a> 思考</h3><h3 id="思考-1" tabindex="-1"><a class="header-anchor" href="#思考-1" aria-hidden="true">#</a> 思考</h3><p><strong>上面的模拟是否有问题？能否100%模拟？</strong></p><p>很难 100% 模拟，我们顶多只能挑一些重要的功能来模拟实现，上面的模拟实现当然也有很多问题，用到 ES6 新特性这点先不讲。其他的问题，比如：</p><ul><li>没有考虑 Node.js 环境，没有考虑严格模式的处理</li><li>未发现的坑</li></ul><p>这些也都是可以解决的，但处理起来就麻烦一些，可以参考文末的文章。反正，大概清楚 call 和 apply 的工作职责，能把主要的工作模拟实现出来，也就差不多了。不过追求 100% 也是好事，望你加油！</p><h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>`,34),f={href:"https://github.com/francecil/leetcode/issues/10",target:"_blank",rel:"noopener noreferrer"};function y(_,x){const n=s("ExternalLinkIcon");return r(),d("div",null,[v,i("blockquote",null,[i("p",null,[e("本文参考："),i("a",u,[e("深度解析 call 和 apply 原理、使用场景及实现"),l(n)])])]),o,b,p,i("blockquote",null,[i("p",null,[i("a",h,[e("Function.prototype.apply()"),l(n)])]),i("p",null,[i("a",m,[e("Function.prototype.call()"),l(n)])])]),g,i("ul",null,[i("li",null,[i("a",f,[e("实现 call, apply, bind"),l(n)])])])])}const A=a(c,[["render",y],["__file","模拟实现call和apply.html.vue"]]);export{A as default};
