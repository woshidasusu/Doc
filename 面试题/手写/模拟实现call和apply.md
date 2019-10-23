# 模拟实现 call 和 apply

> 本文参考：[深度解析 call 和 apply 原理、使用场景及实现](https://muyiy.cn/blog/3/3.3.html#%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF)

### 基础

首先来认识一下 call 和 apply，它们都是 Function.prototype 上的方法，也就是说，所有函数都拥有的方法。

作用都是用来显示绑定函数内部的上下文 this 的指向，区别仅在于两者对参数的处理不同，一个接收参数列表，一个接收参数数组。列出 MDN 的地址：

> [Function.prototype.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
>
> [Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

#### 示例

```javascript
function b(a, b) {
    console.log(this, a, b);
}
var o = {
    a: 1
}

b.call(null, 1, 2);  // 输出： Window   1   2
b.call(o, 1, 2);  // 输出 {a: 1}   1   2

b.apply(null, [1, 2]);  // 输出： Window   1   2
b.apply(o, [1, 2]);   // 输出：  {a: 1}   1   2
```

所以 call 和 apply 的执行效果其实是一样的，区别就在于接收参数的形式，是参数列表，还是参数数组。

#### 应用场景

- 调用原型方法

```javascript
// 如果某对象覆盖了原型上某个方法，那么调用该方法一直是走对象上的逻辑，此时需要有需求要走父类逻辑，可通过 call，类似于其他语言的 super

// [] 重写了 toString，所以需要的话，可以调用 Object.prototype.toString 原有逻辑
Object.prototype.toString.call([]); // [object Array]
[].toString();  // ''

function A() {
    this.a = 1;
}
function B() {
    A.call(this); // 调用父构造函数，类似于其他语言的 super();
    this.b = 1;
}
```

- 解决参数列表和参数数组问题

```javascript
var a = [1, 2, 3, 5, 3];  // 对数组数据求最大值

Math.max.apply(null, a); // 输出 5
// 因为 Math.max(arg1, arg2, arg3...) 只接收参数列表方式，不接收数组类型参数
// 但 ES6 中的扩展运算符也可以解决这个问题
Math.max(...a);
```

- 显示指定函数内的上下文 this 指向

```javascript
var a = 1;
var o = {
    a: 2
}

function b() {
    console.log(this.a);
}

b(); // 1
b.call(o); // 2
```

### 模拟实现

#### Function.prototype.call(thisArg, arg1, arg2, ...)

要想模拟实现 call，必须得先掌握几个关键点：

- call 接收的参数形式和含义，及 thisArg 对 null，undefined，基本类型的特殊处理
- call 本质上是函数的另一种调用，只是修改了函数内的 this

这两点是关键，展开讲的话，也就是我们要自己实现这些工作：

- 接收不定长的参数列表，第一个参数 thisArg 表示函数内 this 指向
  - 当 thisArg 值为 null 或 undefined 时，在非严格模式下，替换成全局对象，如 window
  - 当 thisArg 值为其他基本类型，如 number，boolean 等时，在非严格模式下，自动进行包装对象转换 Object(thisArg)
- 第二个参数开始的剩余参数列表依次传给函数
- 触发函数的执行
- 修改函数的 this 指向第一个参数经过处理后的值

贴代码前，先来大概讲讲各个工作的实现方案：对第一个参数 thisArg 的处理，也就是进行各种判断各种处理即可；获取剩余参数列表，可以用 ES6 的扩展运算符；触发函数执行，也就是调用一下函数即可；

那么，还剩下最后一点，**如何模拟实现修改函数内的 this 指向呢**？

这就涉及到 this 绑定的各种方式了，文末有推荐文章，感兴趣可以去看看，这里就大概说一说：

- 默认绑定（如普通函数内的 this 默认绑定到 window）
- 隐式绑定（如将函数赋值给某个对象，以对象的方法来调用该函数，this 会绑定到该对象上）
- 显示绑定（call, apply, bind, Reflect.apply）
- new 绑定（当函数和 new 使用时会被当做构造函数，构造函数内部的 this 会绑定到内部新创的对象上）
- 箭头函数的绑定（绑定到箭头函数定义时的上下文）

这五种方式中，可以分成两类：绑定的对象是特定对象或任意对象。其中，隐式绑定和显示绑定属于后者，而我们想要模拟实现 call，自然就不能再使用显示绑定了，那只剩下从隐式绑定方案去解决了。

只要把经过函数挂载到经过处理后的 thisArg 对象上，然后以对象的方法形式调用，就可以完成修改函数内 this 指向的效果了。

```javascript
Function.prototype.call2 = function(thisArg, ...args) {
    // 1. 对 thisArg 的处理
    let context = thisArg != null ? Object(thisArg) : window;
    
    // 2. 将该函数挂载到指定的上下文 this 对象上
    let fn = Symbol();  // Symbol 可以避免属性冲突或被外部修改
    context[fn] = this; // this 调用 call2 的函数
    
    // 3. 以对象的方法形式调用函数，并取得返回值
    let result;
    if(args) {
        result = context[fn](...args);
    } else {
        result = context[fn]();
    }
    
    // 4. 清掉挂载的 fn，并返回
    delete context[fn];
    return result;
}
```

至于如何判断函数内部是否有开启了严格模式，这点就不知道怎么实现了。

#### Function.prototype.apply(thisArg, [argsArray])

apply 跟 call 本质上是一样的，区别仅在于对参数的接收形式不同，直接看模拟实现的代码：

```javascript
Function.prototype.apply2 = function(thisArg, args) {
    // 1. 对 thisArg 的处理
    let context = thisArg != null ? Object(thisArg) : window;
    if (!Array.isArray(args)) {
        throw new TypeError('args is not a Array');
    }
    
    // 2. 将该函数挂载到指定的上下文 this 对象上
    let fn = Symbol();  // Symbol 可以避免属性冲突或被外部修改
    context[fn] = this; // this 调用 call2 的函数
    
    // 3. 以对象的方法形式调用函数，并取得返回值
    let result;
    if(args) {
        result = context[fn](...args);
    } else {
        result = context[fn]();
    }
    
    // 4. 清掉挂载的 fn，并返回
    delete context[fn];
    return result;
}
```