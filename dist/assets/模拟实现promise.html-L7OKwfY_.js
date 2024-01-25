import{_ as d,r,o as a,c as v,a as e,b as i,e as s,d as l}from"./app-PjuKeMiB.js";const c={},t=e("h1",{id:"模拟实现-promise-小白版",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#模拟实现-promise-小白版","aria-hidden":"true"},"#"),i(" 模拟实现 Promise（小白版）")],-1),u=e("p",null,"本篇来讲讲如何模拟实现一个 Promise 的基本功能，网上这类文章已经很多，本篇笔墨会比较多，因为想用自己的理解，用白话文来讲讲",-1),m={href:"https://www.ituring.com.cn/article/66566",target:"_blank",rel:"noopener noreferrer"},o=l(`<p>但说实话，太多的专业术语，以及基本按照标准规范格式翻译而来，有些内容，如果不是对规范的阅读方式比较熟悉的话，那是很难理解这句话的内容的</p><p>我就是属于没直接阅读过官方规范的，所以即使在看中文译版时，有些表达仍旧需要花费很多时间去理解，基于此，才想要写这篇</p><h3 id="promise-基本介绍" tabindex="-1"><a class="header-anchor" href="#promise-基本介绍" aria-hidden="true">#</a> Promise 基本介绍</h3><p>Promise 是一种异步编程方案，通过 then 方法来注册回调函数，通过构造函数参数来控制异步状态</p><p>Promise 的状态变化有两种，成功或失败，状态一旦变更结束，就不会再改变，后续所有注册的回调都能接收此状态，同时异步执行结果会通过参数传递给回调函数</p><h4 id="使用示例" tabindex="-1"><a class="header-anchor" href="#使用示例" aria-hidden="true">#</a> 使用示例</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var p = new Promise((resolve, reject) =&gt; {
    // do something async job
    // resolve(data); // 任务结束，触发状态变化，通知成功回调的处理，并传递结果数据
    // reject(err);   // 任务异常，触发状态变化，通知失败回调的处理，并传递失败原因
}).then(value =&gt; console.log(value))
.catch(err =&gt; console.error(err));

p.then(v =&gt; console.log(v), err =&gt; console.error(err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述例子是基本用法，then 方法返回一个新的 Promise，所以支持链式调用，可用于一个任务依赖于上一个任务的执行结果这种场景</p><p>对于同一个 Promise 也可以调用多次 then 来注册多个回调处理</p><p>通过使用来理解它的功能，清楚它都支持哪些功能后，我们在模拟实现时，才能知道到底需要写些什么代码</p><p>所以，这里来比较细节的罗列下 Promise 的基本功能：</p><ul><li>Promise 有三种状态：Pending（执行中）、Resolved（成功）、Rejected（失败），状态一旦变更结束就不再改变</li><li>Promise 构造函数接收一个函数参数，可以把它叫做 task 处理函数</li><li>task 处理函数用来处理异步工作，这个函数有两个参数，也都是函数类型，当异步工作结束，就是通过调用这两个函数参数来通知 Promise 状态变更、回调触发、结果传递</li><li>Promise 有一个 then 方法用于注册回调处理，当状态变化结束，注册的回调一定会被处理，即使是在状态变化结束后才通过 then 注册</li><li>then 方法支持调用多次来注册多个回调处理</li><li>then 方法接收两个可选参数，这两个参数类型都是函数，也就是需要注册的回调处理函数，分别是成功时的回调函数，失败时的回调函数</li><li>这些回调函数有一个参数，类型任意，值就是任务结束需要通知给回调的结果，通过调用 task 处理函数的参数（类型是函数）传递过来</li><li>then 方法返回一个新的 Promise，以便支持链式调用，新 Promise 状态的变化依赖于回调函数的返回值，不同类型处理方式不同</li><li>then 方法的链式调用中，如果中间某个 then 传入的回调处理不能友好的处理回调工作（比如传递给 then 非函数类型参数），那么这个工作会继续往下传递给下个 then 注册的回调函数</li><li>Promise 有一个 catch 方法，用于注册失败的回调处理，其实是 <code>then(null, onRejected)</code> 的语法糖</li><li>task 处理函数或者回调函数执行过程发生代码异常时，Promise 内部自动捕获，状态直接当做失败来处理</li><li><code>new Promise(task)</code> 时，传入的 task 函数就会马上被执行了，但传给 then 的回调函数，会作为微任务放入队列中等待执行（通俗理解，就是降低优先级，延迟执行，不知道怎么模拟微任务的话，可以使用 setTimeout 生成的宏任务来模拟）</li></ul><p>这些基本功能就足够 Promise 的日常使用了，所以我们的模拟实现版的目标就是实现这些功能</p><h3 id="模拟实现思路" tabindex="-1"><a class="header-anchor" href="#模拟实现思路" aria-hidden="true">#</a> 模拟实现思路</h3><h4 id="第一步-骨架" tabindex="-1"><a class="header-anchor" href="#第一步-骨架" aria-hidden="true">#</a> 第一步：骨架</h4><p>Promise 的基本功能清楚了，那我们代码该怎么写，写什么？</p><p>从代码角度来看的话，无非也就是一些变量、函数，所以，我们就可以来针对各个功能点，思考下，都需要哪些代码：</p><ol><li>变量上至少需要：<strong>三种状态、当前状态（_status）、传递给回调函数的结果值（_value）</strong></li><li><strong>构造函数 constructor</strong></li><li><s><strong>task 处理函数</strong></s></li><li>task 处理函数的<strong>两个用于通知状态变更的函数（handleResolve, handleReject）</strong></li><li><strong>then 方法</strong></li><li>then 方法~~<strong>注册的两个回调函数</strong>~~</li><li><strong>回调函数队列</strong></li><li><strong>catch 方法</strong></li></ol><p>task 处理函数和注册的回调处理函数都是使用者在使用 Promise 时，自行根据业务需要编写的代码</p><p>那么，剩下的也就是我们在实现 Promise 时需要编写的代码了，这样一来，Promise 的骨架其实也就可以出来了：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>export type statusChangeFn = (value?: any) =&gt; void;
/* 回调函数类型 */
export type callbackFn = (value?: any) =&gt; any;

export class Promise {
    /* 三种状态 */
    private readonly PENDING: string = &#39;pending&#39;;
    private readonly RESOLVED: string = &#39;resolved&#39;;
    private readonly REJECTED: string = &#39;rejected&#39;;

    /* promise当前状态 */
    private _status: string;
    /* promise执行结果 */
    private _value: string;
    /* 成功的回调 */
    private _resolvedCallback: Function[] = [];
    /* 失败的回调 */
    private _rejectedCallback: Function[] = [];

    /**
     * 处理 resolve 的状态变更相关工作，参数接收外部传入的执行结果
     */
    private _handleResolve(value?: any) {}

    /**
     * 处理 reject 的状态变更相关工作，参数接收外部传入的失败原因
     */ 
    private _handleReject(value?: any) {}

    /**
     * 构造函数，接收一个 task 处理函数，task 有两个可选参数，类型也是函数，其实也就是上面的两个处理状态变更工作的函数（_handleResolve，_handleReject），用来给使用者来触发状态变更使用
     */
    constructor(task: (resolve?: statusChangeFn, reject?: statusChangeFn) =&gt; void) {}

    /**
     * then 方法，接收两个可选参数，用于注册成功或失败时的回调处理，所以类型也是函数，函数有一个参数，接收 Promise 执行结果或失败原因，同时可返回任意值，作为新 Promise 的执行结果
     */
    then(onResolved?: callbackFn, onRejected?: callbackFn): Promise {
        return null;
    }
    
    catch(onRejected?: callbackFn): Promise {
        return this.then(null, onRejected);
    }
} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：骨架这里的代码，我用了 TypeScript，这是一种强类型语言，可以标明各个变量、参数类型，便于讲述和理解，看不懂没关系，下面有编译成 js 版的</p><p>所以，我们要补充完成的其实就是三部分：Promise 构造函数都做了哪些事、状态变更需要做什么处理、then 注册回调函数时需要做的处理</p><h4 id="第二步-构造函数" tabindex="-1"><a class="header-anchor" href="#第二步-构造函数" aria-hidden="true">#</a> 第二步：构造函数</h4><p>Promise 的构造函数做的事，其实很简单，就是马上执行传入的 task 处理函数，并将自己内部提供的两个状态变更处理的函数传递给 task，同时将当前 promise 状态置为 PENDING（执行中）</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>constructor(task) {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第三步-状态变更" tabindex="-1"><a class="header-anchor" href="#第三步-状态变更" aria-hidden="true">#</a> 第三步：状态变更</h4><p>Promise 状态变更的相关处理是我觉得实现 Promise <strong>最难的一部分</strong>，这里说的难并不是说代码有多复杂，而是说这块需要理解透，或者看懂规范并不大容易，因为需要考虑一些处理，网上看了些 Promise 实现的文章，这部分都存在问题</p><p>状态变更的工作，是由传给 task 处理函数的两个函数参数被调用时触发进行，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>new Promise((resolve, reject) =&gt; {
   	resolve(1); 
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>resolve 或 reject 的调用，就会触发 Promise 内部去处理状态变更的相关工作，还记得构造函数做的事吧，这里的 resolve 或 reject 其实就是对应着内部的 _handleResolve 和 _handleReject 这两个处理状态变更工作的函数</p><p>但这里有一点需要注意，是不是 resolve 一调用，Promise 的状态就一定发生变化了呢？</p><p>答案不是的，网上看了些这类文章，他们的处理是 resolve 调用，状态就变化，就去处理回调队列了</p><p>但实际上，这样是错的</p><p>状态的变更，其实依赖于 resolve 调用时，传递过去的参数的类型，因为这里可以传递任意类型的值，可以是基本类型，也可以是 Promise</p><p>当类型不一样时，对于状态的变更处理是不一样的，开头那篇规范里面有详细的说明，但要看懂并不大容易，我这里就简单用我的理解来讲讲：</p><ul><li>resolve(x) 触发的 pending =&gt; resolved 的处理： <ul><li>当 x 类型是 Promise 对象时： <ul><li>当 x 这个 Promise 的状态变化结束时，再以 x 这个 Promise 内部状态和结果（_status 和 _value）作为当前 Promise 的状态和结果进行状态变更处理</li><li>可以简单理解成当前的 Promise 是依赖于 x 这个 Promise 的，即 <code>x.then(this._handleResolve, this._handleReject)</code></li></ul></li><li>当 x 类型是 thenable 对象（具有 then 方法的对象）时： <ul><li>把这个 then 方法作为 task 处理函数来处理，这样就又回到第一步即等待状态变更的触发</li><li>可以简单理解成 <code>x.then(this._handleResolve, this._handleReject)</code></li><li>这里的 x.then 并不是 Promise 的 then 处理，只是简单的一个函数调用，只是刚好函数名叫做 then</li></ul></li><li>其余类型时： <ul><li>内部状态（_status）置为 RESOLVE</li><li>内部结果（_value）置为 x</li><li>模拟创建微任务（setTimeout）处理回调函数队列</li></ul></li></ul></li><li>reject(x) 触发的 pending =&gt; rejected 的处理： <ul><li>不区分 x 类型，直接走 rejected 的处理 <ul><li>内部状态（_status）置为 REJECTED</li><li>内部结构（_value）置为 x</li><li>模拟创建微任务（setTimeout）处理回调函数队列</li></ul></li></ul></li></ul><p>所以你可以看到，其实 resolve 即使调用了，但内部并不一定就会发生状态变化，只有当 resolve 传递的参数类型既不是 Promise 对象类型，也不是具有 then 方法的 thenable 对象时，状态才会发生变化</p><p>而当传递的参数是 Promise 或具有 then 方法的 thenable 对象时，差不多又是相当于递归回到第一步的等待 task 函数的处理了</p><p>想想为什么需要这种处理，或者说，为什么需要这么设计？</p><p>这是因为，存在这样一种场景：有多个异步任务，这些异步任务之间是同步关系，一个任务的执行依赖于上一个异步任务的执行结果，当这些异步任务通过 then 的链式调用组合起来时，then 方法产生的新的 Promise 的状态变更是依赖于回调函数的返回值。所以这个状态变更需要支持当值类型是 Promise 时的异步等待处理，这条异步任务链才能得到预期的执行效果</p><p>当你们去看规范，或看规范的中文版翻译，其实有关于这个的更详细处理说明，比如开头给的链接的那篇文章里有专门一个模块：Promise 的解决过程，也表示成 <code>[[Resolve]](promise, x)</code> 就是在讲这个</p><p>但我想用自己的理解来描述，这样比较容易理解，虽然我也只能描述个大概的工作，更细节、更全面的处理应该要跟着规范来，下面就看看代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>/**
 * resolve 的状态变更处理
 */
_handleResolve(value) {
    if (this._status === this.PENDING) {
        // 1. 如果 value 是 Promise，那么等待 Promise 状态结果出来后，再重新做状态变更处理
        if (value instanceof Promise) {
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
            setTimeout(() = {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第四步-then" tabindex="-1"><a class="header-anchor" href="#第四步-then" aria-hidden="true">#</a> 第四步：then</h4><p>then 方法负责的职能其实也很复杂，既要返回一个新的 Promise，这个新的 Promise 的状态和结果又要依赖于回调函数的返回值，而回调函数的执行又要看情况是缓存进回调函数队列里，还是直接取依赖的 Promise 的状态结果后，丢到微任务队列里去执行</p><p>虽然职能复杂是复杂了点，但其实，实现上，都是依赖于前面已经写好的构造函数和状态变更函数，所以只要前面几个步骤实现上没问题，then 方法也就不会有太大的问题，直接看代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>/**
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="其他方面" tabindex="-1"><a class="header-anchor" href="#其他方面" aria-hidden="true">#</a> 其他方面</h4><p>因为目的在于理清 Promise 的主要功能职责，所以我的实现版并没有按照规范一步步来，细节上，或者某些特殊场景的处理，可能欠缺考虑</p><p>比如对各个函数参数类型的校验处理，因为 Promise 的参数基本都是函数类型，但即使传其他类型，也仍旧不影响 Promise 的使用</p><p>比如为了避免被更改实现，一些内部变量可以改用 Symbol 实现</p><p>但大体上，考虑了上面这些步骤实现，基本功能也差不多了，重要的是状态变更这个的处理要考虑全一点，网上一些文章的实现版，这个是漏掉考虑的</p><p>还有当面试遇到让你手写实现 Promise 时不要慌，可以按着这篇的思路，先把 Promise 的基本用法回顾一下，然后回想一下它支持的功能，再然后心里有个大概的骨架，其实无非也就是几个内部变量、构造函数、状态变更函数、then 函数这几块而已，但死记硬背并不好，有个思路，一步步来，总能回想起来</p><h3 id="源码" tabindex="-1"><a class="header-anchor" href="#源码" aria-hidden="true">#</a> 源码</h3><p>源码补上了 catch，resolve 等其他方法的实现，这些其实都是基于 Promise 基本功能上的一层封装，方便使用</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class Promise {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h3>`,58),b={href:"https://github.com/promises-aplus/promises-tests",target:"_blank",rel:"noopener noreferrer"},h=l(`<p>我这里就举一些基本功能的测试用例：</p><ul><li>测试链式调用</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试链式调用
new Promise(r =&gt; {
    console.log(&#39;0.--同步-----&#39;);
    r();
}).then(v =&gt; console.log(&#39;1.-----------------&#39;))
.then(v =&gt; console.log(&#39;2.-----------------&#39;))
.then(v =&gt; console.log(&#39;3.-----------------&#39;))
.then(v =&gt; console.log(&#39;4.-----------------&#39;))
.then(v =&gt; console.log(&#39;5.-----------------&#39;))
.then(v =&gt; console.log(&#39;6.-----------------&#39;))
.then(v =&gt; console.log(&#39;7.-----------------&#39;))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>0.--同步-----
1.-----------------
2.-----------------
3.-----------------
4.-----------------
5.-----------------
6.-----------------
7.-----------------
</code></pre></details><ul><li>测试多次调用 then 注册多个回调处理</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试多次调用 then 注册多个回调处理
var p = new Promise(r =&gt; r(1));
p.then(v =&gt; console.log(&#39;1-----&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
p.then(v =&gt; console.log(&#39;2-----&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
p.then(v =&gt; console.log(&#39;3-----&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
p.then(v =&gt; console.log(&#39;4-----&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>1----- 1
2----- 1
3----- 1
4----- 1
</code></pre></details><ul><li>测试异步场景</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试异步场景
new Promise(r =&gt; {
    r(new Promise(a =&gt; setTimeout(a, 5000)).then(v =&gt; 1));
})
.then(v =&gt; {
    console.log(v);
    return new Promise(a =&gt; setTimeout(a, 1000)).then(v =&gt; 2);
})
.then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>1  // 5s 后才输出
success 2  // 再2s后才输出
</code></pre></details><p>这个测试，可以检测出 resolve 的状态变更到底有没有根据规范，区分不同场景进行不同处理，你可以网上随便找一篇 Promise 的实现，把它的代码贴到浏览器的 console 里，然后测试一下看看，就知道有没有问题了</p><ul><li>测试执行结果类型为 Promise 对象场景</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试执行结果类型为 Promise 对象场景(Promise 状态 5s 后变化)
new Promise(r =&gt; {
   r(new Promise(a =&gt; setTimeout(a, 5000)));
}).then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>success undefined  // 5s 后才输出
</code></pre></details><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试执行结果类型为 Promise 对象场景(Promise 状态不会发生变化)
new Promise(r =&gt; {
   r(new Promise(a =&gt; 1));
}).then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>// 永远都不输出
</code></pre></details><ul><li>测试执行结果类型为具有 then 方法的 thenable 对象场景</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试执行结果类型为具有 then 方法的 thenable 对象场景（then 方法内部会调用传递的函数参数）
new Promise(r =&gt; {
    r({
        then: (a, b) =&gt; {
        	return a(1);
        }
    });
}).then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>success 1
</code></pre></details><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// // 测试执行结果类型为具有 then 方法的 thenable 对象场景（then 方法内部不会调用传递的函数参数）
new Promise(r =&gt; {
    r({
        then: (a, b) =&gt; {
        	return 1;
        }
    });
}).then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>// 永远都不输出
</code></pre></details><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试执行结果类型为具有 then 的属性，但属性值类型非函数
new Promise(r =&gt; {
    r({
        then: 111
    });
}).then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>success {then: 111}
</code></pre></details><ul><li>测试执行结果的传递</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试当 Promise rejectd 时，reject 的状态结果会一直传递到可以处理这个失败结果的那个 then 的回调中
new Promise((r, j) =&gt; {
    j(1);
}).then(v =&gt; console.log(&#39;success&#39;, v))
  .then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err))
  .catch(err =&gt; console.log(&#39;catch&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>error 1
</code></pre></details><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试传给 then 的参数是非函数类型时，执行结果和状态会一直传递
new Promise(r =&gt; {
    r(1);
}).then(1)
.then(null, err =&gt; console.error(&#39;error&#39;, err))
.then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>success 1
</code></pre></details><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试 rejectd 失败被处理后，就不会继续传递 rejectd
new Promise((r,j) =&gt; {
    j(1);
}).then(2)
.then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err))
.then(v =&gt; console.log(&#39;success&#39;, v), err =&gt; console.error(&#39;error&#39;, err));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details><summary>输出</summary><pre><code>error 1
success undefined
</code></pre></details><p>最后，当你自己写完个模拟实现 Promise 时，你可以将代码贴到浏览器上，然后自己测试下这些用例，跟官方的 Promise 执行结果比对下，你就可以知道，你实现的 Promise 基本功能上有没有问题了</p><p>当然，需要更全面的测试的话，还是得借助一些测试库</p><p>不过，自己实现一个 Promise 的目的其实也就在于理清 Promise 基本功能、行为、原理，所以这些用例能测通过的话，那么基本上也就掌握这些知识点了</p>`,33);function p(g,j){const n=r("ExternalLinkIcon");return a(),v("div",null,[t,u,e("p",null,[i("Promise 的基本规范，参考了这篇："),e("a",m,[i("【翻译】Promises/A+规范"),s(n)])]),o,e("p",null,[i("网上有一些专门测试 Promise 的库，可以直接借助这些，比如："),e("a",b,[i("promises-tests"),s(n)])]),h])}const _=d(c,[["render",p],["__file","模拟实现promise.html.vue"]]);export{_ as default};
