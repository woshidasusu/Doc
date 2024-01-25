import{_ as d,r,o as a,c as v,a as e,b as i,e as s,d as l}from"./app-XVH6qKTA.js";const c={},t=e("h1",{id:"题目-promise",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#题目-promise","aria-hidden":"true"},"#"),i(" 题目：Promise")],-1),m={id:"模拟实现一个-promise-finally",tabindex:"-1"},u=e("a",{class:"header-anchor",href:"#模拟实现一个-promise-finally","aria-hidden":"true"},"#",-1),o={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/109",target:"_blank",rel:"noopener noreferrer"},b=e("span",{id:"1"},"模拟实现一个 Promise.finally",-1),h=l(`<p>跟 try-catch-finally 一样，finally 用于不管 Promise 最后状态如何都会执行的操作。而 Promise 只有两种状态变更，Resolved 或 Rejected，所以可以这么实现：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Promise.prototype.finally = function(callback) {
    let P = this.constructor;
    return this.then(
    	value =&gt; P.resolve(callback()).then(() =&gt; value),
        reason =&gt; P.resolve(callback()).then(() =&gt; throw reason)
    );
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只需要理清几个关键点，上面代码就清楚为何这么写了：</p><ul><li>then 方法接收两个参数，都是回调函数，第一个是状态变为 Resolved 时回调，第二个是状态变为 Rejected 时回调；所以，finally 其实就是将 callback 都传给两个参数。</li><li>callback 函数有可能会是返回 Promise 对象的异步工作，所以，内部通过 P.resolve 包装，就可以监听该异步工作的状态，方便监听 finally，如：</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>new Promise().then().finally().then().catch() // 这样的处理
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,5),p={id:"介绍下-promise-all-使用、实现原理及错误处理",tabindex:"-1"},_=e("a",{class:"header-anchor",href:"#介绍下-promise-all-使用、实现原理及错误处理","aria-hidden":"true"},"#",-1),P={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/130",target:"_blank",rel:"noopener noreferrer"},g=e("span",{id:"2"},"介绍下 Promise.all 使用、实现原理及错误处理",-1),f=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Promise.all([Promise.resolve(1), 2]).then(v =&gt; console.log(v)); // [1, 2]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Promise.all 接收一个数组参数，数组成员最好是 Promise 类型，如果不是，会先经过 Promise.resolve 进行转换。</p><p>当数组所有的 Promise 成员状态都变为 fulfilled 时，Promise.all 生成的 Promise 状态才会变成 fulfilled，并回调 then 方法，并把数组所有 Promise 成员的返回值以数组形式传递给 then 参数。</p><p>当数组中有某一个 Promise 成员状态变为 rejected 时，Promise.all 生成的 Promise 状态就会变成 rejected，并回调 catch 方法，并把发生 rejected 的 Promise 成员产生的 reason 传递给 catch 参数。</p><p>注意：then 方法会返回一个新的 Promise 对象，catch 方法其实是 then(undefied, onRejected) 的语法糖；所以，当数组中的 Promise 成员如何有使用 then 或 catch 的场景，那么应该以 then 或 catch 的 Promise 状态为主。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Promise.all = function(promiseArray) {
    if (!(promiseArray instanceof Array)) {
        throw new TypeError(&quot;parameter must be array&quot;)
    }

    let result = []
    let i = 0

    return new Promise((resolve, reject) =&gt; {
        if (promiseArray.length === 0) {
            resolve(result)
        } else {
            promiseArray.forEach((item, index) =&gt; {
                if (item instanceof Promise) {
                    item.then(res =&gt; {
                        result[index] = res
                        i++
                        if (i === promiseArray.length) {
                            resolve(result)
                        }
                    }, err =&gt; {
                         reject(err)
                    })
                } else { // 如果传入的不是promise，则直接作为结果填入结果数组中
                    result[index] = item
                    i++
                    if (i === promiseArray.length) {
                        resolve(result)
                    }
                }
            })
        }
    })
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>错误处理不清楚指的是什么。</p>`,7),j={id:"模拟实现一个-promise-race",tabindex:"-1"},R=e("a",{class:"header-anchor",href:"#模拟实现一个-promise-race","aria-hidden":"true"},"#",-1),E={href:"https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/140",target:"_blank",rel:"noopener noreferrer"},k=e("span",{id:"3"},"模拟实现一个 Promise.race",-1),y=l(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Promise.race([1, 2]).then(v =&gt; console.log(v)); // 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Promise.race 跟 Promise.all 正好相反，它们的含义差不多类似于数组的 every 和 some 遍历，但仅仅是差不多，细节方面有所差异。</p><p>Promise.race 接收一个数组参数，数组成员最好是 Promise 对象，如果不是的话，会先通过 Promise.resolve 进行转换。</p><p>当数组成员中某一个 Promise 状态变更时，Promise.race 生成的 Promise 状态就跟随着变更，且返回状态变更的 Promise 的值。</p><p>可用于一些超时处理的场景，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>let queryPromise = new Promise(); // 网络请求
let timeoutPromise = new Promise((resolve) =&gt; setTimeout(resolve, 5000));  // 定时 5s 的 Promise

Promise.race([queryPromise, timeoutPromise]).then().catch();
// 5s 的网络请求超时处理
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>实现原理</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Promise.race = function(arr) {
    if (!(arr instanceof Array)) {
        throw new TypeError(&quot;parameter must be array&quot;)
    }
    return new Promise((resolve, reject) =&gt; {
       	arr.forEach(p =&gt; {
            if (p instanceof Promise) {
                p.then(resolve, reject);
            } else {
                resolve(v);
            }
        });
    });
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="手写一个-promise" tabindex="-1"><a class="header-anchor" href="#手写一个-promise" aria-hidden="true">#</a> <span id="4">手写一个 Promise</span></h3>`,9),x={href:"https://www.ituring.com.cn/article/66566",target:"_blank",rel:"noopener noreferrer"},w=l(`<p>要手写 Promise，必须先清楚它的基本使用和功能：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var p = new Promise((resolve, reject) =&gt; {
    // do something
})

p.then(v =&gt; console.log(v));
p.then(v =&gt; console.log(v), err =&gt; console.log(err));

p.then(v =&gt; console.log(v)).then(v =&gt; 1).then(v =&gt; Promise.Resolved(1));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Promise 有三种状态：Pending（执行中）、Resolved（成功）、Rejected（失败），状态一旦变更结束就不再改变</li><li>Promise 构造函数接收一个函数参数，可以把它叫做 task 处理函数</li><li>task 处理函数用来处理异步工作，这个函数有两个参数，也都是函数类型，当异步工作结束，就是通过调用这两个函数参数来通知 Promise 状态变更、回调触发、结果传递</li><li>Promise 有一个 then 方法用于注册回调处理，当状态变化结束，注册的回调一定会被处理，即使是在状态变化结束后才通过 then 注册</li><li>then 方法支持调用多次来注册多个回调处理</li><li>then 方法接收两个可选参数，这两个参数类型都是函数，也就是需要注册的回调处理函数，分别是成功时的回调函数，失败时的回调函数</li><li>这些回调函数有一个参数，类型任意，值就是任务结束需要通知给回调的结果，通过调用 task 处理函数的参数（类型是函数）传递过来</li><li>then 方法返回一个新的 Promise，以便支持链式调用，新 Promise 状态的变化依赖于回调函数的返回值，不同类型处理方式不同</li><li>then 方法的链式调用中，如果中间某个 then 传入的回调处理不能友好的处理回调工作（比如传递给 then 非函数类型参数），那么这个工作会继续往下传递给下个 then 注册的回调函数</li><li>Promise 有一个 catch 方法，用于注册失败的回调处理，其实是 <code>then(null, onRejected)</code> 的语法糖</li><li>task 处理函数或者回调函数执行过程发生代码异常时，Promise 内部自动捕获，状态直接当做失败来处理</li><li><code>new Promise(task)</code> 时，传入的 task 函数就会马上被执行了，但传给 then 的回调函数，会作为微任务放入队列中等待执行（通俗理解，就是降低优先级，延迟执行，不知道怎么模拟微任务的话，可以使用 setTimeout 生成的宏任务来模拟）</li></ul><p><strong>因为内部属性可被动态修改，若想预防这点，可用 symbol 作为属性名。</strong></p>`,4),A={href:"http://blog.dasu.fun/2019/12/15/%E9%9D%A2%E8%AF%95%E9%A2%98/%E6%A8%A1%E6%8B%9F%E5%AE%9E%E7%8E%B0promise/",target:"_blank",rel:"noopener noreferrer"},N=l(`<h4 id="class-方式" tabindex="-1"><a class="header-anchor" href="#class-方式" aria-hidden="true">#</a> class 方式</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class Promise {
    /**
     * 构造函数负责接收并执行一个 task 处理函数，并将自己内部提供的两个状态变更处理的函数传递给 task，同时将当前 promise 状态置为 PENDING（执行中）
     */
    constructor(task) {
        /* 三种状态 */
        this.PENDING = &#39;pending&#39;;
        this.RESOLVED = &#39;resolved&#39;;
        this.REJECTED = &#39;rejected&#39;;
        /* 成功的回调 */
        this._resolvedCallback = [];
        /* 失败的回调 */
        this._rejectedCallback = [];

        // 1. 将当前状态置为 PENDING
        this._status = this.PENDING;

        // 参数类型校验
        if (!(task instanceof Function)) {
            throw new TypeError(\`\${task} is not a function\`);
        }
        try {
            // 2. 调用 task 处理函数，并将状态变更通知的函数传递过去，需要注意 this 的处理
            task(this._handleResolve.bind(this), this._handleReject.bind(this));
        } catch (e) {
            // 3. 如果 task 处理函数发生异常，当做失败来处理
            this._handleReject(e);
        }
    }

    /**
     * resolve 的状态变更处理
     */
    _handleResolve(value) {
        if (this._status === this.PENDING) {
            if (value instanceof Promise) {
                // 1. 如果 value 是 Promise，那么等待 Promise 状态结果出来后，再重新做状态变更处理
                try {
                    // 这里之所以不需要用 bind 来注意 this 问题是因为使用了箭头函数
                    // 这里也可以写成 value.then(this._handleResole.bind(this), this._handleReject.bind(this))
                    value.then(v =&gt; {
                            this._handleResolve(v);
                        },
                        err =&gt; {
                            this._handleReject(err);
                        });
                } catch(e) {
                    this._handleReject(e);
                }
            } else if (value &amp;&amp; value.then instanceof Function) {
                // 2. 如果 value 是具有 then 方法的对象时，那么将这个 then 方法当做 task 处理函数，把状态变更的触发工作交由 then 来处理，注意 this 的处理
                try {
                    const then = value.then;
                    then.call(value, this._handleResolve.bind(this), this._handleReject.bind(this));
                } catch(e) {
                    this._handleReject(e);
                }
            } else {
                // 3. 其他类型，状态变更、触发成功的回调
                this._status = this.RESOLVED;
                this._value = value;
                setTimeout(() =&gt; {
                    this._resolvedCallback.forEach(callback =&gt; {
                    callback();
                });
            });
            }
        }
    }

    /**
     * reject 的状态变更处理
     */
    _handleReject(value) {
        if (this._status === this.PENDING) {
            this._status = this.REJECTED;
            this._value = value;
            setTimeout(() =&gt; {
                this._rejectedCallback.forEach(callback =&gt; {
                    callback();
                });
            });
        }
    }

    /**
     * then 方法，接收两个可选参数，用于注册回调处理，所以类型也是函数，且有一个参数，接收 Promise 执行结果，同时可返回任意值，作为新 Promise 的执行结果
     */
    then(onResolved, onRejected) {
        // then 方法返回一个新的 Promise，新 Promise 的状态结果依赖于回调函数的返回值
        return new Promise((resolve, reject) =&gt; {
            // 对回调函数进行一层封装，主要是因为回调函数的执行结果会影响到返回的新 Promise 的状态和结果
            const _onResolved = () =&gt; {
                // 根据回调函数的返回值，决定如何处理状态变更
                if (onResolved &amp;&amp; onResolved instanceof Function) {
                    try {
                        const result = onResolved(this._value);
                        resolve(result);
                    } catch(e) {
                        reject(e);
                    }
                } else {
                    // 如果传入非函数类型，则将上个Promise结果传递给下个处理
                    resolve(this._value);
                }
            };
            const _onRejected = () =&gt; {
                if (onRejected &amp;&amp; onRejected instanceof Function) {
                    try {
                        const result = onRejected(this._value);
                        resolve(result);
                    } catch(e) {
                        reject(e);
                    }
                } else {
                    reject(this._value);
                }
            };
            // 如果当前 Promise 状态还没变更，则将回调函数放入队列里等待执行
            // 否则直接创建微任务来处理这些回调函数
            if (this._status === this.PENDING) {
                this._resolvedCallback.push(_onResolved);
                this._rejectedCallback.push(_onRejected);
            } else if (this._status === this.RESOLVED) {
                setTimeout(_onResolved);
            } else if (this._status === this.REJECTED) {
                setTimeout(_onRejected);
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    static resolve(value) {
        if (value instanceof Promise) {
            return value;
        }
        return new Promise((reso) =&gt; {
            reso(value);
        });
    }
    
    static reject(value) {
        if (value instanceof Promise) {
            return value;
        }
        return new Promise((reso, reje) =&gt; {
            reje(value);
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function D(T,I){const n=r("ExternalLinkIcon");return a(),v("div",null,[t,e("h3",m,[u,i(),e("a",o,[b,s(n)])]),h,e("h3",p,[_,i(),e("a",P,[g,s(n)])]),f,e("h3",j,[R,i(),e("a",E,[k,s(n)])]),y,e("p",null,[e("a",x,[i("Promise/A+规范"),s(n)])]),w,e("p",null,[i("更多实现思路细节介绍，请移除至我的一篇博客： "),e("a",A,[i("模拟实现promise"),s(n)])]),N])}const F=d(c,[["render",D],["__file","Promise.html.vue"]]);export{F as default};
