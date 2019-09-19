# JS 面试题

### 1. [['1', '2', '3'].map(parseInt) what & why?](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/4)

首先得明白题目问的是什么，然后才能知道考查的是哪些知识点。

题意表达有些简略，这道题意思是说，对一个数组进行 map 操作，map 参数传入全局方法 parseInt，代码是否会正常执行，如果会，那么经过 map 操作后产生的新数组是什么？为什么是这个值？

所以考查的其实就是 map 方法和 parseInt 方法。

MDN 上有讲解这个注意事项：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map#%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7%E6%A1%88%E4%BE%8B

顺带附上parseInt 方法的讲解：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt

```javascript
// 下面的语句返回什么呢:
["1", "2", "3"].map(parseInt);
// 你可能觉的会是[1, 2, 3]
// 但实际的结果是 [1, NaN, NaN]

// 通常使用parseInt时,只需要传递一个参数.
// 但实际上,parseInt可以有两个参数.第二个参数是进制数.
// 可以通过语句"alert(parseInt.length)===2"来验证.
// map方法在调用callback函数时,会给它传递三个参数:当前正在遍历的元素, 
// 元素索引, 原数组本身.
// 第三个参数parseInt会忽视, 但第二个参数不会,也就是说,
// parseInt把传过来的索引值当成进制数来使用.从而返回了NaN.

function returnInt(element) {
  return parseInt(element, 10);
}

['1', '2', '3'].map(returnInt); // [1, 2, 3]
// 意料之中的结果

// 也可以使用简单的箭头函数，结果同上
['1', '2', '3'].map( str => parseInt(str) );

// 一个更简单的方式:
['1', '2', '3'].map(Number); // [1, 2, 3]
// 与`parseInt` 不同，下面的结果会返回浮点数或指数:
['1.1', '2.2e2', '3e300'].map(Number); // [1.1, 220, 3e+300]
```

所以，["1", "2", "3"].map(parseInt) 实际上等效于 ["1", "2", "3"].map((value, index) => parseInt(value, index));

对于 parseInt 方法来说，第二个参数的取值范围是 2-36，表示如何看待第一个参数值，比如 parseInt(30, 4) 表示说 30 是以四进制格式表示的数值，转换为十进制输出后是 12，所以 parseInt(30, 4) = 12

当第二个参数输入 0 时，效果等同于没输入，其余值均返回 NaN。

- 相似题目

理清上面的知识点后，再遇到其他一些变形的题目，自然就清楚怎么去分析了，比如：

```javascript
let unary = fn => val => fn(val)
let parse = unary(parseInt)
console.log(['1.1', '2', '0.3'].map(parse)) // [1, 2, 0]

['10','10','10','10','10'].map(parseInt); // [10, NaN, 2, 3, 4]
// parseInt(10, 3) = 1 * 3^1 + 0 * 3^0 = 3
```

### 2. [什么是防抖和节流？有什么区别？如何实现？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5)

该题考查的主要还是概念问题，防抖和节流都是用于处理高频事件的优化。

**防抖：**高频事件在短时间内不断被触发时，只执行最后一次的触发，过滤前面的事件。即，事件被触发时，延迟 n 秒后再执行，在延迟的这段时间内，如果再次被触发，那么移除之前延迟的事件，以新事件为主，但新事件继续延迟。

- 应用场景

对输入框的内容需要进行校验处理时

- 实现

利用 setTimeout，每次执行前先 clearTimeout，再发起新事件的延迟处理

**节流：**高频事件在短时间内不断触发时，只执行第一次。即，当事件被触发时，先去处理，但在 n 秒内，如果事件再次被触发，那么直接过滤掉，直到 n 秒后。

- 应用场景

Android 的屏幕刷新机制，每 16.6 ms 内，只响应第一次的 UI 刷新请求即可，其余的 UI 刷新操作都会被过滤掉。

- 实现

利用标志位控制事件是否能够执行，或者利用时间戳判断首次和当前次的时间戳。

- 两者区别

防抖能让高频事件在短时间内只响应一次；节流则是让高频事件在短时间内以固定频率响应

### 3. [介绍下 Set、Map、WeakSet 和 WeakMap 的区别？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/6)

这些是 ES6 中新增的数据结构，用于弥补数组和对象的不足之处。

- Set

类似于数组的集合，只有键值，成员不能重复，与数组能够相互转换，所以可以很方便的用于数组去重。其他应用场景还有进行交集、并集、差集的计算。

- WeakSet

在 Set 基础上增加更多的限制，如成员只能是对象类型，不允许遍历。优点则是，成员都是弱引用，随时可能消失，因此不容易造成内存泄漏。

- Map

一种字典的数据结构，即键值对（key - value）的集合，对象同样也是键值对的集合，但对象的键名 key 只能是字符串类型或 Symbol，Map 允许键名 key 可以是任意类型。

比如用对象作为 key 值。

- WeakMap

与 Map 相比较，不能遍历，健名 key 只能是对象类型，成员是弱引用，随时可能被回收，可以防止内存泄漏。

### 4. [ES5/ES6 的继承除了写法以外还有什么区别？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/20)

ES5 通过原型 prototype 实现继承；

ES6 新增 class 语法，可通过 extends 实现类的继承；

js 是基于原型的语言，虽然 class 的语法实际上只是语法糖，本质实现仍旧是通过原型实现继承，但直接通过 prototype 的继承和 class 语法的 extends 继承还是有一些区别。

- 父类属性的继承

在 ES5 中：

```javascript
function A(){
    this.a = 1;
}
function B(){
    this.b = 2;
}
B.prototype = new A();

var b = new B(); // b: {b: 2}
b.a; // 1
```

通过构造函数 B 创建实例 b 时，直接在 B 内部先创建 this，然后通过构造函数 B 内部对 this 进行加工，最后得到实例 b 对象：{b: 2}。

所以，b 实际上只有自有属性，但实例 b 的原型会指向 B.prototype 即 A 的实例，所以可能通过原型链访问到 a 属性。

在 ES6 中：

```javascript
class A {
	constructor(){
        this.a = 1;
    }
}

class B extends A {
    constructor(){
        super();
        this.b = 2;
    }
}

var b = new B(); // b: {a: 1, b: 2}
```

通过 class B 来创建实例对象 b 时，必须先创建父类 A 的实例对象，然后再创建类 B 的 this，然后通过 super 来调用父类构造函数对 this 进行加工，最后再执行类 B 构造函数对 this 继续加工。

所以最后 b 对象，实际上就已经含有父类中定义的 a 对象了

