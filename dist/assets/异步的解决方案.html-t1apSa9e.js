import{_ as i,r as s,o as d,c as r,a as e,b as a,e as l,d as c}from"./app-xJrSpaa5.js";const t={},v={id:"题目-js异步解决方案的发展历程以及优缺点",tabindex:"-1"},o=e("a",{class:"header-anchor",href:"#题目-js异步解决方案的发展历程以及优缺点","aria-hidden":"true"},"#",-1),u={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/11",target:"_blank",rel:"noopener noreferrer"},p=c(`<h3 id="_1-回调函数-callback" tabindex="-1"><a class="header-anchor" href="#_1-回调函数-callback" aria-hidden="true">#</a> 1. 回调函数（callback）</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function loadData(callback) {
    $.ajax({
        success: function (data) {
            callback || callback();  // 通知回调
        }
    });
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>优点：语义明确，使用简单、便捷；</p><p>缺点：回调地狱（当函数嵌套调用层次很深时，需要层层通过参数传递）</p><h3 id="_2-发布-订阅" tabindex="-1"><a class="header-anchor" href="#_2-发布-订阅" aria-hidden="true">#</a> 2. 发布/订阅</h3><p>也称观察者模式，是一种设计模式的编程思想，即：某个事件发生时，由它来通知所有的观察者，观察者接收到通知，就可以去做相应处理。</p><p>本质上也是回调的思想，只是换了种编程角度，将所有需要回调的函数集中管理，称之为观察者，订阅了被观察者的某个事件（异步任务），当事件发生时（异步任务结束），由事件来统一发布通知。</p><p>优点：解决了回调函数的回调地狱问题</p><p>缺点：观察者一旦在事件发生之后才订阅，就会丢失本次事件。</p><h3 id="_3-promise" tabindex="-1"><a class="header-anchor" href="#_3-promise" aria-hidden="true">#</a> 3. Promise</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>new Promise((resolve) =&gt; {
    $.ajax({
       	success: function (data) {
            resolve(data);
        }
    });
}).then(data =&gt; {
   	// todo 
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Promise 是为了解决 callback 回调函数方式存在的问题而产生的，类似于观察者模式，但它的状态一旦变更之后，就不会再发生改变，订阅它的观察者不管是在它状态变化前还是变化后均能接收到通知。</p><p>优点：解决了回调地狱的问题以及观察者模式的订阅事件丢失问题</p><p>缺点：无法取消 Promise，错误需要通过回调函数捕获，then 代码块冗余影响语义</p><h3 id="_4-generator-函数的异步应用" tabindex="-1"><a class="header-anchor" href="#_4-generator-函数的异步应用" aria-hidden="true">#</a> 4. Generator 函数的异步应用</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function* openPage() {
    let v = yield initVariable();   // 初始化变量工作
    yield handleRequest();  // 处理请求数据工作
    yield setupPage();      // 填充页面工作
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Generator 函数是生成器函数，它可以通过 yield 命令生成一系列步骤流程，因为符合迭代器规范，也被称作迭代器生成函数。</p><p>通过 Generator 创建的对象，并不会执行函数内部的代码，而是返回一个迭代器对象，当每次调用 next() 方法时，才会执行到函数内部的下一个 yield 命令的地方。</p><p>next() 方法返回值是 yield 命令后面跟随的数据，而 next(&#39;xxx&#39;) 方法参数传递进去的数据会赋值给函数内部执行时的上一个 yield 语句的返回值。</p><p>所以，Generator 函数本身能够很好的进行内外部交互，可以被用于异步编程场景。</p><p>当用于同步编程场景时，只需遍历 Generator 函数生成的迭代器对象，即可让内部流程依次执行，所以可以用于一些简单的状态机场景。</p><p>但当用于异步场景时，就需要自己监听每个 yield 后面的异步任务执行情况，在异步结束时机手动调用 next() 来切换下个步骤，代码比较繁琐，但可以写一个通用的自动流程管理器工具。</p><p>优点：代码语义明了，同步编程的思想来写异步编程场景</p><p>缺点：需要自己写流程管理工具</p><h3 id="_5-async-await" tabindex="-1"><a class="header-anchor" href="#_5-async-await" aria-hidden="true">#</a> 5. async/await</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>async openPage() {
    await initVariable();   // 初始化变量工作
    await handleRequest();  // 处理请求数据工作
    await setupPage();      // 填充页面工作
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>async/await 其实是 Generator 函数异步编程 + 自动流程管理器 + Promise 包装的语法糖。</p>`,27);function m(h,b){const n=s("ExternalLinkIcon");return d(),r("div",null,[e("h1",v,[o,a(" 题目："),e("a",u,[a("JS异步解决方案的发展历程以及优缺点"),l(n)])]),p])}const g=i(t,[["render",m],["__file","异步的解决方案.html.vue"]]);export{g as default};
