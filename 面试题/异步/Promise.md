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

要手写 Promise，必须先清楚它的基本使用和功能：

```javascript
var p = new Promise((resolve, reject) => {
    // do something
})

p.then(v => console.log(v));
p.then(v => console.log(v), err => console.log(err));

p.then(v => console.log(v)).then(v => 1).then(v => Promise.Resolved(1));
```

- Promise 有三种状态，状态一旦变更就确定下来不再可变
- 构造函数接收一个 task 处理函数，该函数有两个参数，是由 Promise 内部在调用 task 函数时传递进去的，两个参数也都是函数类型，用于改变 Promise 状态和通知 then 回调
- Promise 有一个 then 方法，接收两个可选的回调函数参数，在状态改变后，内部会根据最终状态来选择回调成功或失败的函数，并将最终值作为参数传递给回调函数
- then 方法支持调用多次，注册多个回调处理，内部会维护这些回调函数队列
- then 方法返回一个新的 Promise，以便支持链式调用
- 根据传给 then 方法的回调函数的返回值的不同场景（undefined，基本类型，Promise，thenable），生成新的 Promise 对象的处理过程也不一样

**因为内部属性可被动态修改，若想预防这点，可用 symbol 作为属性名。**

#### class 方式

```javascript
const PENDING = 1;
const RESOLVED = 2;
const REJECTED = 3;

class Promise {
    constructor(task) {
        // 1. 初始化状态、回调队列
        this._status = PENDING;
        this._resolveCallbacks = [];
        this._rejectCallbacks = [];
        this._value = null;
        
        // 2. 声明状态变化函数
        onResolved = (value) => {
            // 状态一旦变更就不再变化
            if (this._status === PENDING) {
                this._status = RESOLVED;
                this._value = value;
                this._resolveCallbacks.forEach(callback => {
                   	setTimeout(() => { // 因为无法从引擎层面上实现微任务，这里用宏任务来模拟，确保 then 回调在当前任务的同步代码结束才被处理
                        callback(this._value);
                    }) 
                });
            }
        }
        onRejected = (value) => {
            // 状态一旦变更就不再变化
            if (this._status === PENDING) {
                this._status = REJECTED;
                this._value = value;
                this._rejectCallbacks.forEach(callback => {
                   	setTimeout(() => { // callbacks不用清理的原因是因为这里只会执行一次
                        callback(this._value);
                    }) 
                });
            }
        }
        
        // 3. 执行 tssk 处理函数
        try {
            task && task(onResolved, onRejected);
        } catch(e) {
            onRejected(e);
        }
        
        // 4. 定义resolvePromise 处理函数
        this.resolvePromise = (data, resolve, reject) => {
            if (data === undefined) {
                // 1. data 为 undefined 时，即 then 回调没有返回值时，以上个 Promise 的结果传递
                resolve(this._value);
            } else if (data instanceof Promise) {
                // 2. data 为 Promise 类型
                data.then(v => this.resolvePromise(v, resolve, reject));
            } else if (typeof data === 'object') {
              	// 3. data 为 thenable 对象
                let then = data.then;
                if (then instanceof Function) {
                    try {
                        then.call(data, v => {
                            this.resolvePromise(v, resolve, reject);
                        }, reject);
                    } catch(e) {
                        reject(e);
                    }
                } else {
                    resolve(data);
                }
            } else {
                // 4. 其余类型数据
                resolve(data);
            }
        };
    }
    
    then(resolveCallback, rejectCallback) {
        // 省略参数类型判断处理
        let promise;
        if (this._tatus === PENDING) {
            // 1. 如果Promise状态还没变更，则先把回调函数放进队列中等待
           	promise = new Promise((resolve, reject) => {
               	this._resolveCallbacks.push(() => {
                    try { // 先处理回调函数，根据回调函数返回值类型来决定何时改变返回的 Promise 状态
                        let value = resolveCallback && resolveCallback(this._value);
                    	this.resolvePromise(value, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
                
                this._rejectCallbacks.push(() => {
                    try {
                        let value = resolveCallback(this._value);
                   		 this.resolvePromise(value, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        } else if (this._status === RESOLVED) {
            // 2. 如果 Promise 状态为 RESOLVED，那么处理回调，并根据回调决定返回的 Promise 状态变更		  
            promise = new Promise((resolve, reject) => {
                try {
                    setTimeout(() => {
                        let value = resolveCallback && resolveCallback(this._value);
                        resolvePromise(value, resolve, reject);
                    });
                } catch (e) {
                    reject(e);
                }
            });
            
        } else if (this._status === REJECTED) {
            promise = new Promise((resolve, reject) => {
                try {
                    setTimeout(() => {
                        let value = rejectCallback && rejectCallback(this._value);
                        resolvePromise(value, resolve, reject);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }
        return promise;
    }
        
    static resolve(value) {
        if (value instanceof Promise) {
            return value;
        }
        return new Promise((reso) => {
           	reso(value);
        });
    }
        
    static reject(value) {
        if (value instanceof Promise) {
            return value;
        }
        return new Promise((reso, reje) => {
           	reje(value); 
        });
    }
}
```

#### function 方式