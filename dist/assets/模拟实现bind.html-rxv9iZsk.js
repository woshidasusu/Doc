import{_ as a,r as d,o as r,c as t,a as n,b as e,e as l,d as s}from"./app-Zf-yBXw2.js";const c={},o=n("h1",{id:"模拟实现-bind",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#模拟实现-bind","aria-hidden":"true"},"#"),e(" 模拟实现 bind")],-1),v={href:"https://muyiy.cn/blog/3/3.4.html#bind",target:"_blank",rel:"noopener noreferrer"},b=s(`<h3 id="基础" tabindex="-1"><a class="header-anchor" href="#基础" aria-hidden="true">#</a> 基础</h3><p>老样子，得先知道 bind 的用途、用法，才能来考虑如何去模拟实现它。</p><p>bind 的用途跟 call 和 apply 可以说是基本一样的，都是用来修改函数内部的上下文 this 的指向，但有一个很大的区别，call 和 apply 在修改了函数内部 this 指向的同时，还会触发函数的调用执行。</p><p>而对于 bind 来说，<strong>它只修改了函数内部的 this，并不会触发函数的调用执行，既然不触发函数执行，又不能影响原函数的使用，那也就只能返回一个修改了 this 的新函数了。</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function a() {
    console.log(this);
}

var b = a.bind({a: 2});  // 只是返回了新函数
b();  // 输出： {a: 2}， 调用新函数会去触发原函数的执行，执行的时候，this 修改成绑定时传入的对象

a();  // 输出 window， bind 不影响原函数
a.call({a:1});  // 输出 {a: 1}，改变 this 的同时也调用执行了函数
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以发现，通过 bind 返回的新函数 b，当它执行的时候，逻辑跟原函数 a 是一样的，也就是会去触发 a 函数的执行，但内部 this 值却已经发生了改变。而且，之后对原函数 a 的操作仍旧保持原先行为，也就是不会对原函数 a 造成副作用影响。</p><p>还有一些点需要注意下的是，原函数 a 可以是普通函数、对象的方法、箭头函数、经过 bind 后新生成的函数等等。只要是函数，那它就可以调用 bind 方法。</p><p><strong>但是，对于不同类型函数，bind 并不是都可以修改函数内部 this 值的：</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 比如说箭头函数
var a = () =&gt; {console.log(this)}

var b = a.bind({a: 1});
b();  // 输出： window，   因为箭头函数的 this 本质上是一个在作用域链寻值的变量
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>另外，还有一点：因为 bind 执行后是返回一个新的普通函数，既然是普通函数，也就可以当做构造函数和 new 使用。当它作为构造函数使用时，构造的过程跟直接对原函数结合 new 使用的过程没有什么大区别：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function a() {
    this.a = 1;
}
a.prototype.b = 2;
var b = a.bind({a: 2});

var c = new b(); // {a: 1}
var d = new a(); // {a: 1}
c.b; // 2
d.b; // 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面代码中，经过 bind 之后的新函数 b，当作为构造函数使用时，构造出的新对象，新对象的原型继承等都跟原函数 a 作为构造函数时是一致的。</p><p>以上，就是 bind 的基本用法和概念，MDN 上有句解释蛮通俗易懂的：</p>`,13),u=n("p",null,"bind 就是返回一个原函数的拷贝，并拥有指定的 this 值和初始参数",-1),p={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind",target:"_blank",rel:"noopener noreferrer"},m=s(`<p>所以，bind 的应用场景：可以用来设定初始参数；可以用来绑定 this，在一些异步回调的场景中等等；</p><h3 id="模拟实现" tabindex="-1"><a class="header-anchor" href="#模拟实现" aria-hidden="true">#</a> 模拟实现</h3><p>接下去讲讲模拟实现：</p><p>bind 接收不定长的参数列表，第一个参数跟 call 和 apply 的第一个参数一样，都是用来指定 this 的指向，第二个参数开始的剩余参数，会依次传给原函数的参数，作为初始参数，并返回一个新函数；</p><p>新函数调用的时候，参数列表还会继续传递给原函数，同时触发原函数的执行，执行过程中，函数内的 this 以 bind 时为主，如果能够生效的话。</p><p>那么，模拟实现 bind，我们主要就要关注这几点：</p><ul><li><strong>如何修改函数的 this 指向</strong>（可直接用 call/apply，或者模拟实现 call/apply 时用到的挂载到对象上的方式）</li><li><strong>如何区分返回的新函数是否被用作构造函数使用</strong>（ES6 中的 new.target 即可，或者对 this 进行原型检测）</li><li><strong>如何实现构造出的新对象保持原函数构造对象时的原型继承</strong>（拷贝原函数的 prototype 到返回的新函数上）</li><li>对参数的处理工作</li></ul><p>主要的工作清楚了，各个工作的模拟实现方案也有了，那么就看看代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Function.prototype.bind2 = function(thisArg, ...args) {
    // 1. 对 thisArg 参数的特殊处理，因为下面不用 call 来实现 this 的修改，那么就需要模拟实现 call，具体可看之前模拟实现 call 的文章
    let context = thisArg != null ? Object(thisArg) : window; 
    let fnSymbol = Symbol();  // 避免属性冲突或被外部修改
    
    // 2. 保存当前函数，并声明返回的新函数，新函数内部会根据是否作为构造函数使用的场景来调用原函数
    let self = this;
    let newFn = function(...newArgs) {
        let curContext;
        if (!new.target) {
            curContext = context;
        } else {
            curContext = this;
        }
        curContext[fnSymbol] = self;  
        let result = curContext[fnSymbol](...[...args, ...newArgs]);
        delete curContext[fnSymbol];
        return result;
    };
	
    // 3. 拷贝原函数的 prototype，用于实现实例对象的原型继承，多创建一层是可以避免外部直接对新函数 newFn.prototype 的修改影响到原函数
    if (this.prototype) {
        newFn.prototype = Object.create(this.prototype);
    }
    return newFn;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：我这里的模拟实现，借助了 ES6 里的扩展运算符 <code>...</code> 和 Symbol 类型数据和 new.target，以及 ES5 中的 Object.create，那么自然就不能兼容一些老版本浏览器。</p><p>解决方案有两种，参考其他文章给出的模拟实现，把上面用到的那几种新特性都用最基本的 ES3 的特性实现，比如 Object.create 就老老实实手动去对 prototype 赋值，扩展运算符就用 arguments 和 Array.prototype.slice 来处理，Symbol 这个就用 call 或 apply 来实现 this 的修改即可，函数是否作为构造函数和 new 使用，在 newFn 内部通过对 this 的判定即可，这样就可以替换掉上面用到的那些新特性。</p><p>再或者，把上面代码借助 babel 这种工具，进行转换处理一下。</p><h3 id="思考" tabindex="-1"><a class="header-anchor" href="#思考" aria-hidden="true">#</a> 思考</h3><p><strong>上面的模拟是否有问题？能否100%模拟？</strong></p><p>很难 100% 模拟，我们顶多只能挑一些重要的功能来模拟实现，上面的模拟实现当然也有很多问题，用到 ES6 新特性这点先不讲。其他的问题，比如：</p><ul><li>bind 返回的函数，name 属性，length 属性都不符合规范了</li><li>无法处理箭头函数 bind 返回的新函数和 new 使用需要抛异常的场景</li><li>未发现的坑</li></ul><p>这些也都是可以解决的，但处理起来就麻烦一些，可以参考文末的文章。反正，大概清楚 bind 的工作职责，能把主要的工作模拟实现出来，也就差不多了。不过追求 100% 也是好事，望你加油！</p><h3 id="推荐阅读" tabindex="-1"><a class="header-anchor" href="#推荐阅读" aria-hidden="true">#</a> 推荐阅读</h3>`,18),h={href:"https://github.com/francecil/leetcode/issues/10",target:"_blank",rel:"noopener noreferrer"};function g(_,f){const i=d("ExternalLinkIcon");return r(),t("div",null,[o,n("blockquote",null,[n("p",null,[e("本文参考："),n("a",v,[e("深度解析bind原理、使用场景及模拟实现"),l(i)])])]),b,n("blockquote",null,[u,n("p",null,[n("a",p,[e("Function.prototype.bind()"),l(i)])])]),m,n("ul",null,[n("li",null,[n("a",h,[e("实现 call, apply, bind"),l(i)])])])])}const x=a(c,[["render",g],["__file","模拟实现bind.html.vue"]]);export{x as default};
