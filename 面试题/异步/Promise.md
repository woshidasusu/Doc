# 题目：Promise 

### [模拟实现一个 Promise.finally](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/109)

跟 try-catch-finally 一样，finally 用于不管 Promise 最后状态如何都会执行的操作。而 Promise 只有两种状态变更，Resolved 或 Rejected，所以可以这么实现：

```javascript
Promise.prototype.finally = function(callback) {
    let P = this.constructor;
    return this.then(
    	value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => throw reason)
    );
}
```

只需要理清几个关键点，上面代码就清楚为何这么写了：

- then 方法接收两个参数，都是回调函数，第一个是状态变为 Resolved 时回调，第二个是状态变为 Rejected 时回调；所以，finally  其实就是将 callback 都传给两个参数。
- callback 函数有可能会是返回 Promise 对象的异步工作，所以，内部通过 P.resolve 包装，就可以监听该异步工作的状态，方便监听 finally，如：

```javascript
new Promise().then().finally().then().catch() // 这样的处理
```

