# 模拟实现 Promise（小白版）

本篇来讲讲如何模拟实现一个 Promise 的基本功能，网上这类文章已经很多，本篇笔墨会比较多，因为想用自己的理解，用白话文来讲讲

Promise 的基本介绍，参考了这篇：[【翻译】Promises/A+规范]( https://www.ituring.com.cn/article/66566 )

但说实话，太多的专业术语，以及基本按照标准规范格式翻译而来，有些内容，如果不是对规范的阅读方式比较熟悉的话，那是很难理解这句话的内容的

我就是属于没直接阅读过官方规范的，所以即使在看这篇中文译版时，有些表达仍旧需要花费很多时间去理解，基于此，才想要写这篇

### Promise 基本介绍

Promise 是一种异步编程方案，通过 then 方法来注册回调函数，通过构造函数参数来控制异步状态

Promise 的状态变化有两种，成功或失败，状态一旦变更结束，就不会再改变，后续所有注册的回调都能接收此状态，同时异步执行结果会通过参数传递给回调函数

#### 使用示例

```js
var p = new Promise((resolve, reject) => {
    // do something async job
    // resolve(data); // 任务结束，触发状态变化，通知成功回调的处理，并传递结果数据
    // reject(err);   // 任务异常，触发状态变化，通知失败回调的处理，并传递失败原因
}).then(value => console.log(value))
.catch(err => console.error(err));

p.then(v => console.log(v), err => console.error(err));
```

上述例子是基本用法，then 方法返回一个新的 Promise，所以支持链式调用，可用于一个任务依赖于上一个任务的执行结果这种场景

对于同一个 Promise 也可以调用多次 then 来注册多个回调处理

通过使用来理解它的功能，清楚它都支持哪些功能后，我们在模拟实现时，才能知道到底需要写些什么代码

所以，这里来比较细节的罗列下 Promise 的基本功能：

- Promise 有三种状态：Pending（执行中）、Resolved（成功）、Rejected（失败），状态一旦变更结束就不再改变
- Promise 构造函数接收一个函数参数，可以把它叫做 task 处理函数
- task 处理函数用来处理异步工作，这个函数有两个参数，也都是函数类型，当异步工作结束，就是通过这两个参数来通知 Promise 状态变更、回调触发、结果传递
- Promise 有一个 then 方法用于注册回调处理，当状态变化结束，注册的回调一定会被处理，即使是在状态变化结束后才通过 then 注册
- then 方法支持调用多次来注册多个回调处理
- then 方法接收两个可选参数，这两个参数类型都是函数，也就是需要注册的回调处理函数，分别是成功时的回调函数，失败时的回调函数
- 这些回调函数有一个参数，类型任意，值就是任务结束需要通知给回调的结果，通过调用 task 处理函数的参数（类型是函数）传递过来
- then 方法返回一个新的 Promise，以便支持链式调用，新 Promise 状态的变化依赖于回调函数的返回值，不同类型处理方式不同
- Promise 有一个 catch 方法，用于注册失败的回调处理，其实是 `then(null, onRejected)` 的语法糖
- task 处理函数或者回调函数执行过程发生代码异常时，Promise 内部自动捕获，状态直接当做失败来处理
- `new Promise(task)` 时，传入的 task 函数就会马上被执行了，但传给 then 的回调函数，会作为微任务放入队列中等待执行（通俗理解，就是降低优先级，延迟执行，不知道怎么模拟微任务的话，可以使用 setTimeout 生成的宏任务来模拟） 

这些基本功能就足够 Promise 的日常使用了，所以我们的模拟实现版的目标就是实现这些功能

### 模拟实现思路

#### 第一步：骨架

Promise 的基本功能清楚了，那我们代码该怎么写，写什么？

从代码角度来看的话，无非也就是一些变量、函数，所以，我们就可以来针对各个功能点，思考下，都需要哪些代码：

1. **变量**上至少需要：三种状态、当前状态（\_status）、传递给回调函数的结果值（\_value）
2. **构造函数**
3. ~~**task 处理函数**~~
4. task 处理函数的**两个用于通知状态变更的函数（handleResolve, handleReject）**
5. **then 方法**
6. then 方法的~~**两个用于注册回调的函数**~~
7. **catch 方法**

task 处理函数和注册的回调处理函数都是使用者在使用 Promise 时，自行根据业务需要编写的代码

那么，剩下的也就是我们在实习 Promise 时需要编写的代码了，这样一来，Promise 的骨架其实也就可以出来了：

```typescript
export type statusChangeFn = (value?: any) => void;
/* 回调函数类型 */
export type callbackFn = (value?: any) => any;

export class Promise {
    /* 三种状态 */
    private readonly PENDING: string = 'pending';
    private readonly RESOLVED: string = 'resolved';
    private readonly REJECTED: string = 'rejected';

    /* promise当前状态 */
    private _status: string;
    /* promise执行结果 */
    private _value: string;
    /* 成功的回调 */
    private _resolvedCallback: Function[] = [];
    /* 失败的回调 */
    private _rejectedCallback: Function[] = [];

    /**
     * 状态从 pending => resolved 的工作处理
     * @param value 使用者传递进来的执行结果
     */
    private _handleResolve(value?: any) {}

    /**
     * 状态从 pending => rejected 的工作处理
     * @param value 使用者传递进来的执行结果
     */ 
    private _handleReject(value?: any) {}

    /**
     * 构造函数，接收一个 task 处理函数，task 有两个可选参数，类型也是函数，给使用者来触发状态变更使用
     */
    constructor(task: (resolve?: statusChangeFn, reject?: statusChangeFn) => void) {}

    /**
     * then 方法，接收两个可选参数，用于注册成功或失败时的回调处理，所以类型也是函数，且有一个参数，接收 Promise 执行结果，同时可返回任意值，作为新 Promise 的执行结果
     */
    then(onResolved?: callbackFn, onRejected?: callbackFn): Promise {
        return null;
    }
    
    catch(onRejected?: callbackFn): Promise {
        return this.then(null, onRejected);
    }
} 
```

注意：骨架这里的代码，我用了 TypeScript，这是一种强类型语言，可以标明各个变量、参数类型，便于讲述和理解，看不懂没关系，下面有编译成 js 版的

所以，我们要补充完成的其实就是三部分：Promise 构造函数都做了哪些事、状态变更需要做什么处理、then 注册一个回调时需要做的处理

#### 第二步：构造函数

Promise 的构造函数做的事，其实很简单，就是马上执行传入的 task 处理函数，并将自己内部提供的两个通知状态变更的函数传递给 task，同时将当前 promise 状态置为 PENDING（执行中）

```js
constructor(task) {
    // 1. 将当前状态置为 PENDING
    this._status = this.PENDING;
        
    // 参数类型校验
	if (!(task instanceof Function)) {
		throw new TypeError(`${task} is not a function`);
	}
        
	try {
        // 2. 调用 task 处理函数，并将状态变更通知的函数传递过去，需要注意 this 的处理
		task(this._handleResolve.bind(this), this._handleReject.bind(this));
	} catch (e) {
        // 3. 如果 task 处理函数发生异常，当做失败来处理
		this._handleReject(e);
	}
}
```

#### 第三步：状态变更

Promise 状态变更的相关处理是我觉得实现 Promise **最难的一部分**，因为需要考虑一些处理，网上看了些 Promise 实现的文章，这部分都存在问题

状态变更分成功和失败两种场景的处理，但做的事基本都一样，所以我把这部分工作都抽离在一个函数内



```js
	/**
     * 状态从 pending => resolved 的工作处理
     * @param value 使用者传递进来的执行结果
     * @private
     */
    _handleResolve(value) {
        if (this._status === this.PENDING) {
            this._handleStatusChange(this.RESOLVED, value);
        }
    }
    /**
     * 状态从 pending => rejected 的工作处理
     * @param value 使用者传递进来的执行结果
     * @private
     */
    _handleReject(value) {
        if (this._status === this.PENDING) {
            this._handleStatusChange(this.REJECTED, value);
        }
    }
    _handleStatusChange(targetStatus, value) {
        if (value instanceof Promise) {
            try {
                value.then(v => {
                    this._handleResolve(v);
                }, err => {
                    this._handleReject(err);
                });
            }
            catch (e) {
                this._handleReject(e);
            }
        }
        else if (value && value.then instanceof Function) {
            try {
                const then = value.then;
                then.call(value, this._handleResolve.bind(this), this._handleReject.bind(this));
            }
            catch (e) {
                this._handleReject(e);
            }
        }
        else {
            this._status = targetStatus;
            this._value = value;
            this._handleCallback();
        }
    }
    _handleCallback() {
        setTimeout(() => {
            if (this._status === this.RESOLVED) {
                this._resolvedCallback.forEach(callback => {
                    callback();
                });
            }
            else if (this._status === this.REJECTED) {
                this._rejectedCallback.forEach(callback => {
                    callback();
                });
            }
        });
    }
```



#### 第四步：then



#### 优化





### 源码





1. 
2. 传递给构造函数的 **task 函数参数**
3. task 函数的**两个用于通知状态变更的函数参数（handleResolve, handleReject）**
4. **then 方法**
5. then 方法的**两个用于注册回调的函数参数**
6. 用于**传递给回调函数结果的回调函数参数**
7. 传递值的类型不一样时，处理不一样

面向使用者：

task 函数参数，回调函数

面向 Promise：

task 函数的两个通知状态变更的函数参数、then 方法、传递给回调函数结果的回调函数参数

- 状态类型：常量
- 当前状态：变量
- 执行结果：变量
- 状态变更：函数
- 触发回调：函数
- then：方法



```typescript
/**
 * 模拟实现 promise
 *
 * 1. promise 三种状态：pending，resolved，rejected，一旦状态变更就无法再更改
 * 2. promise 构造函数接收一个 task 处理函数，该函数有两个可选的参数，类型也是函数，供使用者来触发状态变更和回调使用
 * 3. promise 有个 then 方法，用来注册回调，回调执行时，会往回调函数参数传递 promise 的执行结果
 * 4. then 方法返回一个新的 promise 对象，所以支持链式调用
 * 5. 构造函数内的代码同步执行，then 注册的回调作为微任务延后执行
 * 6. 使用者的代码如果发生异常，就 promise 内部自动捕获并自动走 rejected 流程处理
 * 7. 可以对同一个 promise 调用多次 then 注册多个回调函数
 */

export type statusChangeFn = (value?: any) => void;
export type callbackFn = (value?: any) => any;

export class Promise {
    /* 三种状态 */
    private readonly PENDING: string  = 'pending';
    private readonly RESOLVED: string = 'resolved';
    private readonly REJECTED: string = 'rejected';

    /* promise当前状态 */
    private _status: string;
    /* promise执行结果 */
    private _value: any;
    /* 成功的回调 */
    private _resolvedCallback: Function[] = [];
    /* 失败的回调 */
    private _rejectedCallback: Function[] = [];

    /**
     * 状态从 pending => resolved 的工作处理
     * @param value 使用者传递进来的执行结果
     * @private
     */
    private _handleResolve(value?: any) {
        if (this._status === this.PENDING) {
            this._handleStatusChange(this.RESOLVED, value);
        }
    }

    /**
     * 状态从 pending => rejected 的工作处理
     * @param value 使用者传递进来的执行结果
     * @private
     */
    private _handleReject(value?: any) {
        if (this._status === this.PENDING) {
            this._handleStatusChange(this.REJECTED, value);
        }
    }

    private _handleStatusChange(targetStatus: string, value?: any) {
        if (value instanceof Promise) {
            try {
                value.then(v => {
                    this._handleResolve(v);
                }, err => {
                    this._handleReject(err);
                });
            } catch (e) {
                this._handleReject(e);
            }
        } else if (value && value.then instanceof Function) {
            try {
                const then = value.then;
                then.call(value, [ this._handleResolve, this._handleReject ]);
            } catch (e) {
                this._handleReject(e);
            }
        } else {
            this._status = targetStatus;
            this._value  = value;
            this._handleCallback();
        }
    }

    private _handleCallback() {
        setTimeout(() => {
            if (this._status === this.RESOLVED) {
                this._resolvedCallback.forEach(callback => {
                    callback();
                });
            } else if (this._status === this.REJECTED) {
                this._rejectedCallback.forEach(callback => {
                    callback();
                });
            }
        });
    }

    /**
     * 构造函数，接收一个 task 处理函数，task 有两个可选参数，类型也是函数，给使用者来触发状态变更使用
     * @param {(resolve?: statusChangeFn, reject?: statusChangeFn) => void} task
     */
    constructor(task?: (resolve?: statusChangeFn, reject?: statusChangeFn) => void) {
        this._status = this.PENDING;
        try {
            task(this._handleResolve, this._handleReject);
        } catch (e) {
            this._handleReject(e);
        }
    }

    /**
     * then 方法，接收两个可选参数，用于注册回调，所以类型也是函数，且有一个参数，接收 Promise 执行结果，同时可返回任意值，作为新 Promise 的执行结果
     * @param {callbackFn} onResolved
     * @param {callbackFn} onRejected
     * @returns {Promise}
     */
    then(onResolved?: callbackFn, onRejected?: callbackFn): Promise {
        return new Promise((resolve, reject) => {
            const _onResolved = () => {
                if (onResolved) {
                    try {
                        const result = onResolved(this._value);
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    resolve(this._value);
                }
            };
            const _onRejected = () => {
                if (onRejected) {
                    try {
                        const result = onRejected(this._value);
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(this._value);
                }
            };
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

    catch(onRejected?: callbackFn): Promise {
        return this.then(null, onRejected);
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







测试用例

```js
new Promise(r => {
    r(Promise.resolve(1).then(v => 2).then(v => 3));
}).then(v => console.log('success', v), err => console.error('error', err));

new Promise(r => {
    r(new Promise(a => setTimeout(a, 5000)).then(v => 2).then(v => 3));
}).then(v => console.log('success', v), err => console.error('error', err));

new Promise(r => {
   r(new Promise(a => setTimeout(a, 5000)));
});

new Promise(r => {
   r(new Promise(a => a(111)));
}).then(v => console.log('success', v), err => console.error('error', err));;

new Promise(r => {
    r({
        then: (a, b) => {
        	return a(111);
        }
    });
}).then(v => console.log('success', v), err => console.error('error', err));

new Promise(r => {
    r({
        then: 111
    });
}).then(v => console.log('success', v), err => console.error('error', err));

new Promise(r => {
    r(Promise.resolve(1));
}).then(v => console.log('success', v), err => console.error('error', err));

new Promise((r, j) => {
    j(1111);
}).then(v => console.log('success', v))
  .then(v => console.log('success', v), err => console.error('error', err))
  .catch(err => console.log('error', err));

new Promise(r => {
    r(1);
}).then()
.then(null, err => console.error('error', err))
.then(v => console.log('success', v), err => console.error('error', err));

new Promise((r,j) => {
    j(1);
}).then(2)
.then(v => console.log('success', v), err => console.error('error', err))
.then(v => console.log('success', v), err => console.error('error', err));

new Promise(r => {
    console.log('0.--同步-----');
    r();
}).then(v => console.log('1.-----------------'))
.then(v => console.log('2.-----------------'))
.then(v => console.log('3.-----------------'))
.then(v => console.log('4.-----------------'))
.then(v => console.log('5.-----------------'))
.then(v => console.log('6.-----------------'))
.then(v => console.log('7.-----------------'))


var p = new Promise(r => r(1));
p.then(v => console.log('1-----', v), err => console.error('error', err));
p.then(v => console.log('2-----', v), err => console.error('error', err));
p.then(v => console.log('3-----', v), err => console.error('error', err));
p.then(v => console.log('4-----', v), err => console.error('error', err));

```





```js
class Promise {
    /**
     * 构造函数，接收一个 task 处理函数，task 有两个可选参数，类型也是函数，给使用者来触发状态变更使用
     * @param {(resolve?: statusChangeFn, reject?: statusChangeFn) => void} task
     */
    constructor(task) {
        /* 三种状态 */
        this.PENDING = 'pending';
        this.RESOLVED = 'resolved';
        this.REJECTED = 'rejected';
        /* 成功的回调 */
        this._resolvedCallback = [];
        /* 失败的回调 */
        this._rejectedCallback = [];
        this._status = this.PENDING;
        
        if (!(task instanceof Function)) {
            throw new TypeError(`${task} is not a function`);
        }
        
        try {
            task(this._handleResolve.bind(this), this._handleReject.bind(this));
        }
        catch (e) {
            this._handleReject(e);
        }
    }
    /**
     * 状态从 pending => resolved 的工作处理
     * @param value 使用者传递进来的执行结果
     * @private
     */
    _handleResolve(value) {
        if (this._status === this.PENDING) {
            this._handleStatusChange(this.RESOLVED, value);
        }
    }
    /**
     * 状态从 pending => rejected 的工作处理
     * @param value 使用者传递进来的执行结果
     * @private
     */
    _handleReject(value) {
        if (this._status === this.PENDING) {
            this._handleStatusChange(this.REJECTED, value);
        }
    }
    _handleStatusChange(targetStatus, value) {
        if (value instanceof Promise) {
            try {
                value.then(v => {
                    this._handleResolve(v);
                }, err => {
                    this._handleReject(err);
                });
            }
            catch (e) {
                this._handleReject(e);
            }
        }
        else if (value && value.then instanceof Function) {
            try {
                const then = value.then;
                then.call(value, this._handleResolve.bind(this), this._handleReject.bind(this));
            }
            catch (e) {
                this._handleReject(e);
            }
        }
        else {
            this._status = targetStatus;
            this._value = value;
            this._handleCallback();
        }
    }
    _handleCallback() {
        setTimeout(() => {
            if (this._status === this.RESOLVED) {
                this._resolvedCallback.forEach(callback => {
                    callback();
                });
            }
            else if (this._status === this.REJECTED) {
                this._rejectedCallback.forEach(callback => {
                    callback();
                });
            }
        });
    }
    /**
     * then 方法，接收两个可选参数，用于注册回调，所以类型也是函数，且有一个参数，接收 Promise 执行结果，同时可返回任意值，作为新 Promise 的执行结果
     * @param {callbackFn} onResolved
     * @param {callbackFn} onRejected
     * @returns {Promise}
     */
    then(onResolved, onRejected) {
        return new Promise((resolve, reject) => {
            const _onResolved = () => {
                if (onResolved) {
                    try {
                        const result = onResolved(this._value);
                        resolve(result);
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else {
                    resolve(this._value);
                }
            };
            const _onRejected = () => {
                if (onRejected) {
                    try {
                        const result = onRejected(this._value);
                        resolve(result);
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else {
                    reject(this._value);
                }
            };
            if (this._status === this.PENDING) {
                this._resolvedCallback.push(_onResolved);
                this._rejectedCallback.push(_onRejected);
            }
            else if (this._status === this.RESOLVED) {
                setTimeout(_onResolved);
            }
            else if (this._status === this.REJECTED) {
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

