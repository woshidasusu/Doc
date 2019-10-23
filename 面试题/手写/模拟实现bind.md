# 模拟实现 bind

> 本文参考：[深度解析bind原理、使用场景及模拟实现](https://muyiy.cn/blog/3/3.4.html#bind)  

### 基础

老样子，得先知道 bind 的用途、用法，才能来考虑如何去模拟实现它。  

bind 的用途跟 call 和 apply 可以说是基本一样的，都是用来修改函数内部的上下文 this 的指向，但有一个很大的区别，call 和 apply 在修改了函数内部 this 指向的同时，还会触发函数的调用执行。  

而对于 bind 来说，**它只修改了函数内部的 this，并不会触发函数的调用执行，既然不触发函数执行，又不能影响原函数的使用，那也就只能返回一个修改了 this 的新函数了。**  

```javascript
function a() {
    console.log(this);
}

a();  // 输出 window
a.call({a:1});  // 输出 {a: 1}，改变 this 的同时也调用执行了函数

var b = a.bind({a: 2});  // 只是返回了新函数
b();  // 输出： {a: 2}， 调用新函数会去触发原函数的执行，执行的时候，this 修改成绑定时传入的对象

```




### 模拟实现

bind 接收不定长的参数列表，第一个参数跟 call 和 apply 的第一个参数意义，都是为指定的 this 指向，第二个参数开始的剩余参数，会依次传给原函数的参数。  

知道 bind 的用法后，想要模拟实现它，就需要理清它所处理的几点工作：  

- 返回一个新函数，新函数被调用的时候，会触发原函数的执行。  
-    

```javascript
Function.prototype.bind2 = function(thisArg, ...args) {
    let newFn;
    let context = thisArg != null ? Object(thisArg) : window; 
    let fnThis = Symbol();
    context[fnThis] = this;
    let self = this;

    newFn = function(...newArgs) {
        if (!new.target) {
            context[fnThis](...[...args, ...newArgs]);
            delete context[fnThis];
        } else {
            self(...[...args, ...newArgs]);
        }
    };

    newFn.prototype = Object.create(this.prototype);
    return newFn;
}
```  

注意：我这里的模拟实现，借助了 ES6 里的扩展运算符 `...` 和 Symbol 类型数据和 new.target，以及 ES5 中的 Object.create，那么自然就不能兼容一些老版本浏览器。  

解决方案有两种，参考其他文中给出的模拟实现，把上面用到的那几种新特性都用最基本的 ES3 的特性实现，比如 Object.create 就老老实实手动去对 prototype 赋值，扩展运算符就用 arguments 和 Array.prototype.slice 来处理，Symbol 这个就用 call 或 apply 来实现 this 的修改即可，函数是否作为构造函数和 new 使用，在 newFn 内部通过对 this 的判定即可，这样就可以替换掉上面用到的那些新特性。  

再或者，把上面代码借助 babel 这种工具，进行转换处理一下。