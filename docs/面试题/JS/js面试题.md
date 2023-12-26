# JS 面试题

### <span id="1">1.</span> [['1', '2', '3'].map(parseInt) what & why?](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/4)

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

### <span id="2">2.</span> [什么是防抖和节流？有什么区别？如何实现？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5)

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

### <span id="3">3.</span> [介绍下 Set、Map、WeakSet 和 WeakMap 的区别？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/6)

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

### <span id="4">4.</span> [ES5/ES6 的继承除了写法以外还有什么区别？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/20)

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

### <span id="5">5.</span> [判断数组的几种方式](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/23)

判断某个变量类型是否为数组，有三种方式：

- instanceof
- Object.prototype.toString.call()
- Array.isArray()

下面大概讲讲：

instanceof 是通过判断左边的对象类型数据的原型链上是否存在右边的对象，判断数组时，直接：

```javascript
var a = [];
var b = 1;
a instanceof Array; // true，因为 [].__proto__.contructor.name = Array
b instanceof Array; // false
```

Object.prototype.toString.call() 获取的信息又叫做类属性，可用于判断内置的数据类型，包括 6 种基本数据类型和内置的对象类型（如 RegExp 等）：

```javascript
Object.prototype.toString.call('An') // "[object String]"
Object.prototype.toString.call(1) // "[object Number]"
Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(function(){}) // "[object Function]"
Object.prototype.toString.call({name: 'An'}) // "[object Object]"
Object.prototype.toString.call([])  //[object Array]
```

Array.isArray()  是 ES6 新增的用于判断是否是数组的静态方法，当浏览器不支持时，可用 Object.prototype.toString.call 模拟实现。

### <span id="6">6.</span> [讲讲模块化发展](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/28)

[点击跳转](https://github.com/woshidasusu/Doc/blob/master/Blogs/__%E5%89%8D%E7%AB%AF%E5%85%A5%E9%97%A8/%E5%89%8D%E7%AB%AF%E5%85%A5%E9%97%A822-%E8%AE%B2%E8%AE%B2%E6%A8%A1%E5%9D%97%E5%8C%96.md)

大概来说，是这么一个发展过程：

1. 全局变量、全局函数 =>
2. 对象作为命名空间 =>
3. 立即执行的函数作为临时命名空间（IIFE） + 闭包 =>
4. 动态创建 \<script\> 工具（LAB.js） =>
5. CommonJS 规范和 node.js =>
6. AMD 规范和 Require.js =>
7. CMD 规范和 Sea.js =>
8. ES6 标准

### <span id="7">7.</span> [全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/30)

在 ES3 中，变量的作用域只有全局作用域和函数内作用域两种场景。而它的原理，是基于 EC（执行上下文），每次当执行全局代码或函数代码时，都会创建一个 EC，而 EC 中有一个 VO（变量对象），用来存储当前上下文中的变量。同时还有一个作用域链，用于给当前上下文访问它可使用的外部变量。

具体原理查看这篇：[JavaScript进阶之作用域链](https://github.com/woshidasusu/Doc/blob/master/Blogs/__%E5%89%8D%E7%AB%AF%E5%85%A5%E9%97%A8/%E5%89%8D%E7%AB%AF%E5%85%A5%E9%97%A818-JavaScript%E8%BF%9B%E9%98%B6%E4%B9%8B%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE.md)  

但在 ES6 中，作用域这种概念已被废弃了，取而代之的是词法环境（Lexical environment）。

词法环境，简单点说，就是相应代码块内标识符与值的关联关系的体现，它有两个组成部分：环境记录（Environment Record），用途类似于执行上下文（EC）中的 VO；外部词法环境的引用（outer），用途类似于执行上下文（EC）中的作用域链。

更多内容参考：

[深入JavaScript系列（一）：词法环境](https://juejin.im/post/5c0a398be51d451dcb0400b3)

[彻底搞懂javascript-词法环境(Lexical Environments)](https://juejin.im/post/5c05120be51d4513416d2111)

[ECMA-262-5 词法环境:通用理论（四）--- 环境](https://blog.csdn.net/szengtal/article/details/78722826)

对于这个题目，js 引擎在遇到不同类型代码时会创建相对应的词法环境，这些变量就存储于各自的词法环境中。大体上，有这么几种：

- Global：全局变量，存储于 window 的属性里
- Block：块级作用域，每个有 {} 包含的代码块
- Local：函数内的局部变量，没有闭包的场景下，生命周期同函数
- Catch：try-catch 的代码块
- Script：也可以说是顶级的 Block，全局作用内通过 let 等声明的变量

![](https://user-images.githubusercontent.com/33000154/64755227-fffd2b00-d55c-11e9-8fa2-0e2e809e9cf3.jpg)

所以，在全局作用域内声明的 let 变量，不存在于 window 上，而是存储于一个顶级的 Block 中即 Script，可直接通过变量的引用访问。

### <span id="8">8.</span> [下面的代码打印什么内容，为什么？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/48)  

```javascript
var b = 10;
(function b() {
  b = 20;
  console.log(b)
})()
```

很有意思的一个题目，题目稍微变形下，可以考察很多知识点。

本题主要考察，针对具名函数表达式（Name Function Expression，NFE），函数名变量的作用域。

在 ES3 中，有函数执行上下文、变量对象、作用域的理论概念。这些概念用于说明，当执行一个函数时，函数内部各种类型变量能够使用的原理。

简单说一点，函数执行上下文中包括一个变量对象 VO，变量对象存储着函数内部的变量，如：函数参数、局部变量、this 等。但需要注意一点，不包括具名函数表达式的函数名变量。

什么是具名函数表达式（NFE）？

函数声明有两种方式：

- 函数声明式： function a() {}
- 函数表达式：var a = function() {}

当函数表达式等号右边的函数也带有名字时，就称为具名函数表达式（NFE），如： var a = function b() {}

接下去说些理论（基于 ES3 的执行上下文概念）：

- 当代码执行到函数表达式时，其实就意味着此时已经处于执行上下文的执行阶段了，也就是已经过了解析阶段，当前上下文的变量对象已经创建完毕，也就是变量已经提前声明处理了。
- 在执行阶段，也就只会对变量对象中提前声明的变量进行赋值处理，比如上例中对变量 a 进行赋值，变量 a 是当前上下文的变量对象中的成员。所以在函数内各个地方均可以被使用。
- 而 b 并不在当前上下文的变量对象 VO 成员中，所以在函数内是无法使用变量 b 的，要调用 b 函数，只能通过变量 a，因为函数 b 已经被赋值给变量 a 了。
- 当执行函数表达式时，声明了函数 b 并赋值给变量 a，在这个过程中，会往函数 b 对象赋值一个内部属性 [[Scope]]，值为当前上下文的作用域链。
- 当函数 b 被调用执行时，会创建函数 b 的执行上下文，并进行执行上下文的解析阶段和执行阶段。
- 针对于具名函数表达式（NFE），在创建执行上下文的作用域链时，会有一个额外的处理：
- **具名函数表达式 b 的执行上下文的作用域链的生成规则：函数 b 执行上下的变量对象 VO + {函数名 b 常量}（额外的处理） + [[Scope]]**

简单点说，具名函数表达式的函数名变量会被单独存储于一个特定对象中，且是作为常量存储，即只读。然后将其置于作用域链中，优先级低于变量对象 VO，但高于 [[Scope]]。

这就造成了具名函数表达式的函数名变量具有特定的作用域，即：外部无法访问，函数内可以访问但不能修改，不过会被函数内同名的局部变量覆盖。

想验证，也很简单，看看下面的例子：

```javascript
// 外部无法访问
var a = function b() {}
console.log(a); // function b...
console.log(b); // Uncaught ReferenceError: b is not defined

// 函数内可以访问但不能修改
var a = function b() {
	console.log(b);  // function b...
	b = 1;
    console.log(b);  // function b...
}
a();

// 函数内可以访问但不能修改
var a = function b() {
    'use strict';
	console.log(b);  
	b = 1;
    console.log(b);
}
a(); // Uncaught TypeError: Assignment to constant variable

// 会被函数内同名的局部变量覆盖
var a = function b() {
	var b = 1;
    console.log(b);  // 1
}
a();
```

所以，再回头看看题目：

```javascript
var b = 10;
(function b() {
  b = 20;  // 访问的是函数名 b 变量，因为是常量，所以赋值无效
  console.log(b);  // function b...
})()
```

因为立即执行函数（IIFE）其实本质上是函数表达式，所以题目的输出应该是 fn，这应该就清楚了。

PS：以上讲到的执行上下文、变量对象、作用域概念是在 ES3 规范中提出的，在 ES5 中，这些概念就被词法环境、环境记录、外部引用等新概念取代了。但其实，本质上差别不大，处理规则应该还是类似，只是一些流程以及细节方面变化了，或者新扩展了。

本题稍微修改下，就可以考察其他知识点了：

```javascript
// 考察函数作用域的变量 + 变量声明提前特性
var b = 10;
(function b() {
    console.log(b);  // undefined
  	var b = 20;  
    console.log(b);  // 20
})()

// 考察全局作用域的变量
var b = 10;
(function a() {
  	b = 20;
    c = 20;
  	console.log(b);  // 20
})()
console.log(b);  // 20
console.log(c);  // 20
```

### <span id="9">9.</span> 输出以下代码执行的结果并解释为什么

- [第一题](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/76)

```javascript
var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)
```

考察 push 方法的操作，Array.prototype.push 方法不仅可以用于对数组类型数据进行操作，也可以用于操作对象。

push 方法操作的逻辑：将数据放入 length 指向的下标，length 加 1 后并返回。如果 length 不存在，那么创建它并从 0 开始。

所以，对于该题目，会在下标为 2 的地址开始 push 数据，最终结果就是：

```javascript
obj = {
    '2': 1,
    '3': 2,
    'length': 4,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
```

另外，还考察的一个知识点是，[console 控制台在输出日志时，会对对象进行是否是类数组数据判断，判断逻辑](https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/event_listeners/EventListenersUtils.js#L330)：是否有 length 属性，且具有 splice 方法，满足两者的话，会以数组形式打印，所以题目输出的应该是：

```javascript
console.log(obj) // [empty*2, 1, 2, splice: f, push: f]
```

- [<span id="9.2">第二题</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/93)

```javascript
var a = {n: 1};
var b = a;
a.x = a = {n: 2};

console.log(a.x) 	
console.log(b.x)
```

本题考察运算符优先级问题： `.` 优先级大于 `=`

所以连续赋值时： `a.x = a = {n: 2}`，会先进行 `.` 运算，即在此时 a 指向的对象 {n: 1} 上面创建一个 x 属性，然后进行 `=` 赋值运算，从右至左，所以 a 指向新的对象 {n: 2}，然后该对象赋值给 x 属性。

最后结果就是，a = {n: 2}，b = {n: 1, x: {n: 2}}

所以输出的结果： undefined，{n: 2}

附上运算符优先级顺序：

| 运算符                             | 描述                                         |
| ---------------------------------- | -------------------------------------------- |
| . [] ()                            | 字段访问、数组下标、函数调用以及表达式分组   |
| ++ -- - ~ ! delete new typeof void | 一元运算符、返回数据类型、对象创建、未定义值 |
| * / %                              | 乘法、除法、取模                             |
| + - +                              | 加法、减法、字符串连接                       |
| << >> >>>                          | 移位                                         |
| < <= > >= instanceof               | 小于、小于等于、大于、大于等于、instanceof   |
| == != === !==                      | 等于、不等于、严格相等、非严格相等           |
| &                                  | 按位与                                       |
| ^                                  | 按位异或                                     |
| \|                                 | 按位或                                       |
| &&                                 | 逻辑与                                       |
| \|\|                               | 逻辑或                                       |
| ?:                                 | 条件                                         |
| = oP=                              | 赋值、运算赋值                               |
| ,                                  | 多重求值                                     |

- [<span id="9.3">第三题</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/125)

```javascript
// example 1
var a={}, b='123', c=123;  
a[b]='b';
a[c]='c';  
console.log(a[b]); // c

---------------------
// example 2
var a={}, b=Symbol('123'), c=Symbol('123');  
a[b]='b';
a[c]='c';  
console.log(a[b]); // b

---------------------
// example 3
var a={}, b={key:'123'}, c={key:'456'};  
a[b]='b';
a[c]='c';  
console.log(a[b]);  // c
```

本题考察对象的 key 值本质。

对象的键值 key 只能是字符串类型或 Symbol 类型的数据，所以通过 `[]` 操作时，不是这两种类型的，会先进行一次 String(xx) 的转换。

所以，对于第一个例子，number 类型会被转成 string 类型，导致值被覆盖，输出 c；第二个例子，每个 Symbol 都是唯一的，所以不会被覆盖；第三个例子，对象转成 string 默认都是 [object object]，所以两个的 key 值其实一样，后者覆盖前者。

另外，ES6 中新增了 Map 类型的数据，就是为了扩展对象的键值类型的局限，在 Map 中，键值可以是任意类型，number，string，object 都可以。

- [<span id="9.4">第四题</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/155)

```javascript
function Foo() {
    Foo.a = function() {
        console.log(1)
    }
    this.a = function() {
        console.log(2)
    }
}
Foo.prototype.a = function() {
    console.log(3)
}
Foo.a = function() {
    console.log(4)
}
Foo.a();  // 4
let obj = new Foo();
obj.a();  // 2
Foo.a();  // 1
```

本题考察的是基础知识：对象的创建、继承、原型链、自有属性、继承属性、静态方法、实例方法；

第一个输出 4 是因为代码执行到这里时，为构造函数 Foo 对象定义了输出 4 的 a 方法，那么调用它自然就是输出 4；

然后因为通过 new 调用了构造函数，那么构造函数 Foo 内部的代码就会被执行，此时 Foo 对象的 a 方法被替代为输出 1 的函数了；然后通过 this 添加了一个对象属性 a，类型是输出 2 的函数；

所以调用对象的 a 方法，自然就是输出 2；

可能你会疑惑，不是还通过 Foo.prototype.a 给原型定义了一个 a 方法么？不是说，通过构造函数创建的对象都会继承自 Foo.prototype 么？

是啊，你说的没错啊，所以通过构造函数 Foo 创建的对象是具有 Foo.prototype.a 的继承属性的啊，这点是正确的啊；只是，访问对象 obj.a 属性时，是优先读取对象的自有属性，如果不存在，才会去原型链上寻找。

最后一行代码再次调用 Foo.a() 方法，因为已经被替换掉了，所以输出 1；

以上，就是该题考察的知识点，不难，很基础，理理就清楚了。

- [<span id="9.5">第五题</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/190)

```javascript
var name = 'Tom';
(function() {
  if (typeof name == 'undefined') {
    var name = 'Jack';
    console.log('Goodbye ' + name);
  } else {
    console.log('Hello ' + name);
  }
})(); // Goodbye Jack
```

仍旧考察的是变量的作用域：全局作用域和函数内作用域，且 var 变量的声明有提前的特性。

所以在 IIFE 块内的 name 在代码执行前已经被提前声明了，值为 undefined，所以走 if 分支，所以输出 Goodbye Jack；

题目稍微变形下，输出结果就不一样了，比如：

```javascript
var name = 'Tom';
(function() {
  if (typeof name == 'undefined') {
    name = 'Jack';
    // let name = 'Jack'
    console.log('Goodbye ' + name);
  } else {
    console.log('Hello ' + name);
  }
})(); // Hello Tom
```

- [<span id="9.6">第六题</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/229)

```javascript
1 + "1"  // ‘11’

2 * "2" // 4 

[1, 2] + [2, 1]  //'1,22,1'

"a" + + "b"  // 'aNaN'
```

考察一些运算符隐含的类型转换操作：

`+` 运算符，如果有 string 类型的，那么进行字符串拼接操作；如果有对象类型，先将其转换成 string，即通过 valueOf() 或 toString()，再进行拼接操作；

对于 'a' + + 'b' 相当于 'a' + (+'b') 运算，此时后面的 `+` 被当做一元运算符处理，即将后面的数据转换成 number 的操作，最后再进行字符串拼接；

- [<span id="9.7">第七题</span>](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/251)

```javascript
function wait() {
  return new Promise(resolve =>
    setTimeout(resolve, 10 * 1000)
  )
}

async function main() {
  console.time();
  const x = wait();
  const y = wait();
  const z = wait();
  await x;
  await y;
  await z;
  console.timeEnd();
}
main();  // 10000ms
```

考察 async 和 await 的知识。

async 只是 Generator 函数的异步任务应用和自动流程管理器的语法糖，也就是碰到 await 时，函数会交出执行权，等待后续 Promise 任务的状态变化，再切回继续往下执行。

所以，上述例子中，x，y，z 三个 Promise 任务会并行处理，然后再依次等待每个 Promise 状态变更，总耗时大概 10s，因为一个 Promise 耗时 10s；

但题目可以稍微变形下：

```javascript
async function main() {
  console.time();
  await wait();
  await wait();
  await wait();
  console.timeEnd();
}
```

此时，三个 Promise 任务就是串行处理了，后一个必须等待前一个状态变更后才进行，所以总耗时大概 30s。

### <span id="10">10.</span> [call 和 apply 的区别是什么，哪个性能更好一些](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/84)

以 `Math.max(1, 2, 3, 4)` 举例：

```javascript
// call
Math.max.call(null, 1, 2, 3, 4);

//apply
Math.max.apply(null, [1, 2, 3, 4]);
```

区别其实仅在于接收的参数， call 接收的是不定长的参数，而 apply 接收的是数组；

大部分场景两者并没有什么异同，只是在 ES3 时，还没有 ES6 新增的数组扩展运算符 `...` 运算，所以没法将数组解开成参数列表，那么对于一些只接收不定长参数的方法来说，参数来源刚好是数组时，就很鸡肋，这种场景下，就可以使用 apply 来处理。

比如，求一个数组里的最大值，但 Math.max 方法只接收不定长参数，不接收数组参数，在 ES3 中，就只能通过 apply 来处理，call 处理不了。

但在 ES6 中，因为新增了 `...` 运算，所以 call 基本可以覆盖 apply 的使用场景，而且性能又比 apply 好，所以建议都使用 call。

如： `Math.max.call(null, ...[1, 2, 3, 4]);`

很多资料都说 call 性能比 apply 好，原因不清楚，有的说是因为 apply 内部至少需要额外进行一次数组参数的解构处理。

### <span id="11">11.</span> [箭头函数和普通函数的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/101)

- 箭头函数的 this 会自动绑定在定义时所在的作用域内的 this 值
- 箭头函数的 this 因为已经被自动绑定，所以当通过 call，apply 给函数指定 this 时，会失效
- 箭头函数不能使用 argument，如需该场景，可手动添加 ...reset 参数替代
- 箭头函数不能当做构造函数使用，即不能结合 new 使用

- 箭头函数内部不能有 yield 命令，即不能当做 Generator 函数使用

### <span id="12">12.</span> [为什么 for 循环嵌套顺序会影响性能？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/235)

```javascript
var t1 = new Date().getTime()
for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 1000; j++) {
    for (let k = 0; k < 10000; k++) {
    }
  }
}
var t2 = new Date().getTime()
console.log('first time', t2 - t1)

for (let i = 0; i < 10000; i++) {
  for (let j = 0; j < 1000; j++) {
    for (let k = 0; k < 100; k++) {

    }
  }
}
var t3 = new Date().getTime()
console.log('two time', t3 - t2)  
```

最内层的执行次数虽然都是一样的，但前两层的执行次数就不一样了。

而执行过程的操作包括：变量的初始化、判断语句、自增语句，总是需要耗费性能的。

所以，内层循环次数大的话，就会比较耗时；

当然，理论上是这样子，但不同引擎或许会对这段代码有所优化，所以也并不一定后者就一定最耗时。