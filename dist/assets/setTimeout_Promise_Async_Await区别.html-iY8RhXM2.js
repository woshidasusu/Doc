import{_ as l,r,o as d,c,a as e,b as n,e as i,d as a}from"./app-PjuKeMiB.js";const o={},t={id:"题目-settimeout、promise、async-await-的区别",tabindex:"-1"},v=e("a",{class:"header-anchor",href:"#题目-settimeout、promise、async-await-的区别","aria-hidden":"true"},"#",-1),m={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/33",target:"_blank",rel:"noopener noreferrer"},u=a(`<p>本题主要考察这三者在循环队列中被处理的区别，看道题：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>async function async1() {
    console.log(&#39;async1 start&#39;);
    await async2();
    console.log(&#39;async1 end&#39;);
}
async function async2() {
    console.log(&#39;async2&#39;);
}
console.log(&#39;script start&#39;);
setTimeout(function() {
    console.log(&#39;setTimeout&#39;);
}, 0)
async1();
new Promise(function(resolve) {
    console.log(&#39;promise1&#39;);
    resolve();
}).then(function() {
    console.log(&#39;promise2&#39;);
});
console.log(&#39;script end&#39;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>理清这题，需要清楚，浏览器的 JS 引擎是单线程的循环队列模式，队列里有宏观任务和微观任务之分，只有当前任务被执行完，才轮到后面的任务执行，每个任务其实就是一段代码块。</p><p>对于 setTimeout，参数传递进去的函数，会被作为宏观任务放进队列中等待执行，即使第二个参数没传或者传 0。</p><p>所以，setTimeout 的表现就是，当前的代码块全部执行完，才会去执行参数里的函数。至于当前的代码块范围究竟是什么，在浏览器上，没理解错，应该是以 script 标签作为界限。</p><p>对于 Promise，构造方法的参数传递进去的函数会被立马执行，但 then 参数传递进去的函数会被作为微观任务被放进队列中等待执行。</p><p>微观任务和宏观任务的区别就是：</p><ul><li>微观任务会被放置在当前任务的末尾等待执行；而宏观任务，会被放置在下一个任务中等待执行；</li><li>从优先级角度看，微观任务比宏观任务优先级高；</li></ul><p>比如看这么段代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>console.log(1);
setTimeout(()=&gt;{
    console.log(2);
}, 0);
console.log(3);
new Promise((resolve)=&gt;{
    console.log(4);
    resolve();
}).then(()=&gt;{
   	console.log(5); 
});

// 输出： 1 3 4 5 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码执行的优先级顺序：当前同步代码块 &gt; 微观任务 &gt; 宏观任务</p><p>所以，即使 setTimeout 的任务比 Promise 更早被放进队列，但它仍旧是最晚被执行的。</p><p>以上，就是一些基础的理论知识。</p><p>对于 Async/Await，本质上是基于 Promise 实现的自动流程管理。</p><p>当代码执行到 await 命令时，代码执行权会移交出去，直到 await 后面跟着的 Promise 状态发生变更，那么就在 then 中把执行权回收。</p><p>如果 await 后面不是跟着 Promise 对象，那么会通过 Promose.resolve() 进行转换处理。</p><p>所以，对于开头的题目，输出：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你以为到这里就结束了么？年轻~</p><p>当你自己试试去浏览器上执行一遍看看（我的浏览器版本 chrome 69)：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>script start
async1 start
async2
promise1
script end
promise2
async1 end
setTimeout
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么 promise2 跟 async1 end 的输出顺序跟我们的不一样？</p>`,22),p={href:"https://juejin.im/post/5c3cc981f265da616a47e028",target:"_blank",rel:"noopener noreferrer"},b=a("<p>其实，关键点在于，async/await 的规范：</p><ol><li>Promise 的链式 then() 是怎样执行的</li><li>async 函数的返回值</li><li>await 做了什么</li><li>PromiseResolveThenableJob：浏览器对 <code>new Promise(resolve =&gt; resolve(thenable))</code> 的处理</li></ol><p>理清这四点，也就知道是什么原因了，关键点在于 async2() 这个函数，如果把这个函数前的 async 删掉，结果就是一开始分析的那样。</p><p>但如果 async2 函数前的 async 命令保留，那么，由于 async 会将后面跟随的函数返回一个 Promose.resolve 对象，而 new Promise(resolve =&gt; resolve(thenable)) 时，又会创建一个 Promise.resolve 来降低优先级。</p><p>综上，await async2() 就会被封装了好几层 Promise，所以必须等到最后的 Promise 状态变更了才往下执行，这就是为什么 async1 end 会晚于 promise2 输出的原因。</p><p>具体分析，可跳转至以上链接那篇，很详细，看完就懂了。</p>",6);function g(_,y){const s=r("ExternalLinkIcon");return d(),c("div",null,[e("h1",t,[v,n(" 题目： "),e("a",m,[n("setTimeout、Promise、Async/Await 的区别"),i(s)])]),u,e("p",null,[n("可以看看这篇："),e("a",p,[n("令人费解的 async/await 执行顺序"),i(s)])]),b])}const w=l(o,[["render",g],["__file","setTimeout_Promise_Async_Await区别.html.vue"]]);export{w as default};
