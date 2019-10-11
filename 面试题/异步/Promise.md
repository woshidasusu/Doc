# 题目：Promise 

### [<span id="1">模拟实现一个 Promise.finally</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/109)

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

### [<span id="2">介绍下 Promise.all 使用、实现原理及错误处理</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/130)

```javascript
Promise.all([Promise.resolve(1), 2]).then(v => console.log(v)); // [1, 2]
```

Promise.all 接收一个数组参数，数组成员最好是 Promise 类型，如果不是，会先经过 Promise.resolve 进行转换。

当数组所有的 Promise 成员状态都变为 fulfilled 时，Promise.all 生成的 Promise 状态才会变成 fulfilled，并回调 then 方法，并把数组所有 Promise 成员的返回值以数组形式传递给 then 参数。

当数组中有某一个 Promise 成员状态变为 rejected 时，Promise.all 生成的 Promise 状态就会变成 rejected，并回调 catch 方法，并把发生 rejected 的 Promise 成员产生的 reason 传递给 catch 参数。

注意：then 方法会返回一个新的 Promise 对象，catch 方法其实是 then(undefied, onRejected) 的语法糖；所以，当数组中的 Promise 成员如何有使用 then 或 catch 的场景，那么应该以 then 或 catch 的 Promise 状态为主。

```javascript
Promise.all = function(promiseArray) {
    if (!(promiseArray instanceof Array)) {
        throw new TypeError("parameter must be array")
    }

    let result = []
    let i = 0

    return new Promise((resolve, reject) => {
        if (promiseArray.length === 0) {
            resolve(result)
        } else {
            promiseArray.forEach((item, index) => {
                if (item instanceof Promise) {
                    item.then(res => {
                        result[index] = res
                        i++
                        if (i === promiseArray.length) {
                            resolve(result)
                        }
                    }, err => {
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
```

错误处理不清楚指的是什么。

### [<span id="3">模拟实现一个 Promise.race</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/140)

```javascript
Promise.race([1, 2]).then(v => console.log(v)); // 1
```

Promise.race 跟 Promise.all 正好相反，它们的含义差不多类似于数组的 every 和 some 遍历，但仅仅是差不多，细节方面有所差异。

Promise.race 接收一个数组参数，数组成员最好是 Promise 对象，如果不是的话，会先通过 Promise.resolve 进行转换。

当数组成员中某一个 Promise 状态变更时，Promise.race 生成的 Promise 状态就跟随着变更，且返回状态变更的 Promise 的值。

可用于一些超时处理的场景，比如：

```javascript
let queryPromise = new Promise(); // 网络请求
let timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));  // 定时 5s 的 Promise

Promise.race([queryPromise, timeoutPromise]).then().catch();
// 5s 的网络请求超时处理
```

- 实现原理

```javascript
Promise.race = function(arr) {
    if (!(arr instanceof Array)) {
        throw new TypeError("parameter must be array")
    }
    return new Promise((resolve, reject) => {
       	arr.forEach(p => {
            if (p instanceof Promise) {
                p.then(resolve, reject);
            } else {
                resolve(v);
            }
        });
    });
}
```



### 手写一个 Promise

[Promise/A+规范](https://www.ituring.com.cn/article/66566)

```javascript
class Promise {
    constructor() {
        
    }
    
    then() {
        
    }
}
```

