# 题目： [setTimeout、Promise、Async/Await 的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/33)

本题主要考察这三者在循环队列中被处理的区别，看道题：

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');
```

理清这题，需要清楚，浏览器的 JS 引擎是单线程的循环队列模式，队列里有宏观任务和微观任务之分，只有当前任务被执行完，才轮到后面的任务执行，每个任务其实就是一段代码块。

对于 setTimeout，参数传递进去的函数，会被作为宏观任务放进队列中等待执行，即使第二个参数没传或者传 0。

所以，setTimeout 的表现就是，当前的代码块全部执行完，才会去执行参数里的函数。至于当前的代码块范围究竟是什么，在浏览器上，没理解错，应该是以 script 标签作为界限。

对于 Promise，构造方法的参数传递进去的函数会被立马执行，但 then 参数传递进去的函数会被作为微观任务被放进队列中等待执行。

微观任务和宏观任务的区别就是：

- 微观任务会被放置在当前任务的末尾等待执行；而宏观任务，会被放置在下一个任务中等待执行；
- 从优先级角度看，微观任务比宏观任务优先级高；

比如看这么段代码：

```javascript
console.log(1);
setTimeout(()=>{
    console.log(2);
}, 0);
console.log(3);
new Promise((resolve)=>{
    console.log(4);
    resolve();
}).then(()=>{
   	console.log(5); 
});

// 输出： 1 3 4 5 2
```

代码执行的优先级顺序：当前同步代码块 > 微观任务 > 宏观任务

所以，即使 setTimeout 的任务比 Promise 更早被放进队列，但它仍旧是最晚被执行的。

以上，就是一些基础的理论知识。

对于 Async/Await，本质上是基于 Promise 实现的自动流程管理。

当代码执行到 await 命令时，代码执行权会移交出去，直到 await 后面跟着的 Promise 状态发生变更，那么就在 then 中把执行权回收。

如果 await 后面不是跟着 Promise 对象，那么会通过 Promose.resolve() 进行转换处理。

所以，对于开头的题目，输出：

```javascript
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

你以为到这里就结束了么？年轻~

当你自己试试去浏览器上执行一遍看看（我的浏览器版本 chrome 69)：

```
script start
async1 start
async2
promise1
script end
promise2
async1 end
setTimeout
```

为什么 promise2 跟 async1 end 的输出顺序跟我们的不一样？

可以看看这篇：[令人费解的 async/await 执行顺序](https://juejin.im/post/5c3cc981f265da616a47e028)

其实，关键点在于，async/await 的规范：

1. Promise 的链式 then() 是怎样执行的
2. async 函数的返回值
3. await 做了什么
4. PromiseResolveThenableJob：浏览器对 `new Promise(resolve => resolve(thenable))` 的处理

理清这四点，也就知道是什么原因了，关键点在于 async2() 这个函数，如果把这个函数前的 async 删掉，结果就是一开始分析的那样。

但如果 async2 函数前的 async 命令保留，那么，由于 async 会将后面跟随的函数返回一个 Promose.resolve 对象，而 new Promise(resolve => resolve(thenable)) 时，又会创建一个 Promise.resolve 来降低优先级。

综上，await async2() 就会被封装了好几层 Promise，所以必须等到最后的 Promise 状态变更了才往下执行，这就是为什么 async1 end 会晚于 promise2 输出的原因。

具体分析，可跳转至以上链接那篇，很详细，看完就懂了。