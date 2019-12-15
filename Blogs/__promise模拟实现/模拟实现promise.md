# 模拟实现 Promise（小白版）

本篇来讲讲如何模拟实现一个 Promise 的基本功能，网上这类文章已经很多，本篇笔墨会比较多，因为想用自己的理解，用白话文来讲讲

Promise 的基本规范，参考了这篇：[【翻译】Promises/A+规范]( https://www.ituring.com.cn/article/66566 )

但说实话，太多的专业术语，以及基本按照标准规范格式翻译而来，有些内容，如果不是对规范的阅读方式比较熟悉的话，那是很难理解这句话的内容的

我就是属于没直接阅读过官方规范的，所以即使在看中文译版时，有些表达仍旧需要花费很多时间去理解，基于此，才想要写这篇

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
- task 处理函数用来处理异步工作，这个函数有两个参数，也都是函数类型，当异步工作结束，就是通过调用这两个函数参数来通知 Promise 状态变更、回调触发、结果传递
- Promise 有一个 then 方法用于注册回调处理，当状态变化结束，注册的回调一定会被处理，即使是在状态变化结束后才通过 then 注册
- then 方法支持调用多次来注册多个回调处理
- then 方法接收两个可选参数，这两个参数类型都是函数，也就是需要注册的回调处理函数，分别是成功时的回调函数，失败时的回调函数
- 这些回调函数有一个参数，类型任意，值就是任务结束需要通知给回调的结果，通过调用 task 处理函数的参数（类型是函数）传递过来
- then 方法返回一个新的 Promise，以便支持链式调用，新 Promise 状态的变化依赖于回调函数的返回值，不同类型处理方式不同
- then 方法的链式调用中，如果中间某个 then 传入的回调处理不能友好的处理回调工作（比如传递给 then 非函数类型参数），那么这个工作会继续往下传递给下个 then 注册的回调函数
- Promise 有一个 catch 方法，用于注册失败的回调处理，其实是 `then(null, onRejected)` 的语法糖
- task 处理函数或者回调函数执行过程发生代码异常时，Promise 内部自动捕获，状态直接当做失败来处理
- `new Promise(task)` 时，传入的 task 函数就会马上被执行了，但传给 then 的回调函数，会作为微任务放入队列中等待执行（通俗理解，就是降低优先级，延迟执行，不知道怎么模拟微任务的话，可以使用 setTimeout 生成的宏任务来模拟） 

这些基本功能就足够 Promise 的日常使用了，所以我们的模拟实现版的目标就是实现这些功能

### 模拟实现思路

#### 第一步：骨架

Promise 的基本功能清楚了，那我们代码该怎么写，写什么？

从代码角度来看的话，无非也就是一些变量、函数，所以，我们就可以来针对各个功能点，思考下，都需要哪些代码：

1. 变量上至少需要：**三种状态、当前状态（\_status）、传递给回调函数的结果值（\_value）**
2. **构造函数 constructor**
3. ~~**task 处理函数**~~
4. task 处理函数的**两个用于通知状态变更的函数（handleResolve, handleReject）**
5. **then 方法**
6. then 方法~~**注册的两个回调函数**~~
7. **回调函数队列**
8. **catch 方法**

task 处理函数和注册的回调处理函数都是使用者在使用 Promise 时，自行根据业务需要编写的代码

那么，剩下的也就是我们在实现 Promise 时需要编写的代码了，这样一来，Promise 的骨架其实也就可以出来了：

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
    constructor(task: (resolve?: statusChangeFn, reject?: statusChangeFn) => void) {}

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
```

注意：骨架这里的代码，我用了 TypeScript，这是一种强类型语言，可以标明各个变量、参数类型，便于讲述和理解，看不懂没关系，下面有编译成 js 版的

所以，我们要补充完成的其实就是三部分：Promise 构造函数都做了哪些事、状态变更需要做什么处理、then 注册回调函数时需要做的处理

#### 第二步：构造函数

Promise 的构造函数做的事，其实很简单，就是马上执行传入的 task 处理函数，并将自己内部提供的两个状态变更处理的函数传递给 task，同时将当前 promise 状态置为 PENDING（执行中）

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

Promise 状态变更的相关处理是我觉得实现 Promise **最难的一部分**，这里说的难并不是说代码有多复杂，而是说这块需要理解透，或者看懂规范并不大容易，因为需要考虑一些处理，网上看了些 Promise 实现的文章，这部分都存在问题

状态变更的工作，是由传给 task 处理函数的两个函数参数被调用时触发进行，如：

```js
new Promise((resolve, reject) => {
   	resolve(1); 
});
```

resolve 或 reject 的调用，就会触发 Promise 内部去处理状态变更的相关工作，还记得构造函数做的事吧，这里的 resolve 或 reject 其实就是对应着内部的 _handleResolve 和 _handleReject 这两个处理状态变更工作的函数

但这里有一点需要注意，是不是 resolve 一调用，Promise 的状态就一定发生变化了呢？

答案不是的，网上看了些这类文章，他们的处理是 resolve 调用，状态就变化，就去处理回调队列了

但实际上，这样是错的

状态的变更，其实依赖于 resolve 调用时，传递过去的参数的类型，因为这里可以传递任意类型的值，可以是基本类型，也可以是 Promise

当类型不一样时，对于状态的变更处理是不一样的，开头那篇规范里面有详细的说明，但要看懂并不大容易，我这里就简单用我的理解来讲讲：

- resolve(x) 触发的 pending => resolved 的处理：
  - 当 x 类型是 Promise 对象时：
    - 当 x 这个 Promise 的状态变化结束时，再以 x 这个 Promise 内部状态和结果（\_status 和 \_value）作为当前 Promise 的状态和结果进行状态变更处理
    - 可以简单理解成当前的 Promise 是依赖于 x 这个 Promise 的，即 `x.then(this._handleResolve, this._handleReject)`
  - 当 x 类型是 thenable 对象（具有 then 方法的对象）时：
    - 把这个 then 方法作为 task 处理函数来处理，这样就又回到第一步即等待状态变更的触发
    - 可以简单理解成 `x.then(this._handleResolve, this._handleReject)`
    - 这里的 x.then 并不是 Promise 的 then 处理，只是简单的一个函数调用，只是刚好函数名叫做 then
  - 其余类型时：
    - 内部状态（_status）置为 RESOLVE
    - 内部结果（_value）置为 x
    - 模拟创建微任务（setTimeout）处理回调函数队列
- reject(x) 触发的 pending => rejected 的处理：
  - 不区分 x 类型，直接走 rejected 的处理
    - 内部状态（_status）置为 REJECTED
    - 内部结构（_value）置为 x
    - 模拟创建微任务（setTimeout）处理回调函数队列

所以你可以看到，其实 resolve 即使调用了，但内部并不一定就会发生状态变化，只有当 resolve 传递的参数类型既不是 Promise 对象类型，也不是具有 then 方法的 thenable 对象时，状态才会发生变化

而当传递的参数是 Promise 或具有 then 方法的 thenable 对象时，差不多又是相当于递归回到第一步的等待 task 函数的处理了

想想为什么需要这种处理，或者说，为什么需要这么设计？

这是因为，存在这样一种场景：有多个异步任务，这些异步任务之间是同步关系，一个任务的执行依赖于上一个异步任务的执行结果，当这些异步任务通过 then 的链式调用组合起来时，then 方法产生的新的 Promise 的状态变更是依赖于回调函数的返回值。所以这个状态变更需要支持当值类型是 Promise 时的异步等待处理，这条异步任务链才能得到预期的执行效果

当你们去看规范，或看规范的中文版翻译，其实有关于这个的更详细处理说明，比如开头给的链接的那篇文章里有专门一个模块：Promise 的解决过程，也表示成 `[[Resolve]](promise, x)` 就是在讲这个

但我想用自己的理解来描述，这样比较容易理解，虽然我也只能描述个大概的工作，更细节、更全面的处理应该要跟着规范来，下面就看看代码：

```js
/**
 * resolve 的状态变更处理
 */
_handleResolve(value) {
    if (this._status === this.PENDING) {
        // 1. 如果 value 是 Promise，那么等待 Promise 状态结果出来后，再重新做状态变更处理
        if (value instanceof Promise) {
            try {
                // 这里之所以不需要用 bind 来注意 this 问题是因为使用了箭头函数
                // 这里也可以写成 value.then(this._handleResole.bind(this), this._handleReject.bind(this))
                value.then(v => {
                    this._handleResolve(v);
                },
                err => {
                    this._handleReject(err);
                });
            } catch(e) {
                this._handleReject(e);
            }
        } else if (value && value.then instanceof Function) {
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
                this._resolvedCallback.forEach(callback => {
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
        setTimeout(() => {
            this._rejectedCallback.forEach(callback => {
                callback();
            });
        });
    }
}
```

#### 第四步：then

then 方法负责的职能其实也很复杂，既要返回一个新的 Promise，这个新的 Promise 的状态和结果又要依赖于回调函数的返回值，而回调函数的执行又要看情况是缓存进回调函数队列里，还是直接取依赖的 Promise 的状态结果后，丢到微任务队列里去执行

虽然职能复杂是复杂了点，但其实，实现上，都是依赖于前面已经写好的构造函数和状态变更函数，所以只要前面几个步骤实现上没问题，then 方法也就不会有太大的问题，直接看代码：

```js
/**
 * then 方法，接收两个可选参数，用于注册回调处理，所以类型也是函数，且有一个参数，接收 Promise 执行结果，同时可返回任意值，作为新 Promise 的执行结果
 */
then(onResolved, onRejected) {
    // then 方法返回一个新的 Promise，新 Promise 的状态结果依赖于回调函数的返回值
    return new Promise((resolve, reject) => {
        // 对回调函数进行一层封装，主要是因为回调函数的执行结果会影响到返回的新 Promise 的状态和结果
        const _onResolved = () => {
        	// 根据回调函数的返回值，决定如何处理状态变更
            if (onResolved && onResolved instanceof Function) {
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
        const _onRejected = () => {
            if (onRejected && onRejected instanceof Function) {
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
```

#### 其他方面

因为目的在于理清 Promise 的主要功能职责，所以我的实现版并没有按照规范一步步来，细节上，或者某些特殊场景的处理，可能欠缺考虑

比如对各个函数参数类型的校验处理，因为 Promise 的参数基本都是函数类型，但即使传其他类型，也仍旧不影响 Promise 的使用

比如为了避免被更改实现，一些内部变量可以改用 Symbol 实现

但大体上，考虑了上面这些步骤实现，基本功能也差不多了，重要的是状态变更这个的处理要考虑全一点，网上一些文章的实现版，这个是漏掉考虑的

还有当面试遇到让你手写实现 Promise 时不要慌，可以按着这篇的思路，先把 Promise 的基本用法回顾一下，然后回想一下它支持的功能，再然后心里有个大概的骨架，其实无非也就是几个内部变量、构造函数、状态变更函数、then 函数这几块而已，但死记硬背并不好，有个思路，一步步来，总能回想起来

### 源码

源码补上了 catch，resolve 等其他方法的实现，这些其实都是基于 Promise 基本功能上的一层封装，方便使用

```js
class Promise {
    /**
     * 构造函数，接收一个 task 处理函数，task 有两个可选参数，类型也是函数，给使用者来触发状态变更使用
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

### 测试

网上有一些专门测试 Promise 的库，可以直接借助这些，比如：

我这里就举一些基本功能的测试用例：

- 测试链式调用



- 测试多次调用 then 注册多个回调处理





- 测试异步场景



- 测试执行结果类型为 Promise 对象场景





- 测试执行结果类型为具有 then 方法的 thenable 对象场景





- 测试执行结果为其他场景



- 测试传给 then 非函数类型参数时的场景

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

