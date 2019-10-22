# [模拟实现 new 操作符](https://muyiy.cn/blog/3/3.5.html#%E5%AE%9A%E4%B9%89)

首先需要理解，JavaScript 中的构造函数跟 Java 中的构造函数性质是不一样的。js 不是基于 class 这种静态类模式，而是基于原型对象的模式。

所以，在 js 中，new 操作符，其实可以通俗的理解成一个辅助工具，用来辅助函数构造出一个新对象。所以，我们才能够来模拟实现它，因为它其实通俗理解，就是一个工具函数。

得先明确这点，才能知道，的确是可以模拟 new 操作符的。

### new 的职责

```javascript
function A() {
	this.a = 1;
}
A.prototype.b = 1;
var a = new A(); // {a: 1}
a.b; // 1
```

所以，以上这种场景的 new 操作符其实就是做了几件事：

- **创建一个继承自 A.prototype 的空对象**
- **让空对象作为函数 A 的上下文，并调用 A**
- **返回这个空对象**

这是基本的 new 使用的场景，那么我们要来模拟实现的话，这几件事就得自己处理：

```javascript
function _new(Fn, ...args) {
    // 1. 创建一个继承构造函数.prototype的空对象
    var obj = Object.create(Fn.prototype);
    // 2. 让空对象作为函数 A 的上下文，并调用 A
    Fn.call(obj, ...args);
    // 3. 返回这个空对象
    return obj;
}
```

**这样就结束了吗？并没有**

要模拟实现一个完整的 new 操作符，就还得将它的其他使用场景都考虑进去：

- **当构造函数有返回值时**
- **判断一个函数是否能够作为构造函数使用**

先来考虑第一种：

```javascript
function A() {
    this.a = 1;
    return {b: 1};
}
new A(); // {b: 1}

function B() {
    this.b = 1;
    return 1;
}
new B(); // {b:1}
```

所以，当构造函数返回一个对象时，那么就以这个对象作为构造函数生成的对象；当构造函数返回基本类型数据时，当做没有返回值处理，内部新建个对象返回。

套用 MDN 对 new 的说明：

> new 运算符创建一个用户定义的对象类型的实例**或**具有构造函数的内置对象的实例。 ——（来自于MDN）

其实这句解释就把 new 操作符的所有职责或者说所有使用场景覆盖了：

- 用户定义的对象类型 ==> 当构造函数有返回值时
- 具有构造函数的内置对象 ==> 当前函数可用来作为构造函数，那么返回内部创建的新对象

所以，要完整模拟一个 new 的工作，还得完成上面两点，先来看看对返回值的处理，很简单：

```javascript
function _new(Fn, ...args) {
    // 1. 创建一个继承构造函数.prototype的空对象
    var obj = Object.create(Fn.prototype);
    // 2. 让空对象作为函数 A 的上下文，并调用 A，同时获取它的返回值
    let result = Fn.call(obj, ...args);
    // 3. 如果构造函数返回一个对象，那么直接 return 它，否则返回内部创建的新对象
    return result instanceof Object ? result : obj;
}
```

接下去就剩最后一个处理了：判断一个函数是否可以作为构造函数

#### 如何判断函数是否可以作为构造函数

我们通过 function 定义的普通函数都可以结合 new 来作为构造函数使用，那么到底如何判断一个函数能否作为构造函数呢？

网上有些文章里说了：

> 每个函数都有一些内部属性，如： [[Construct]]  表示可以用来作为构造函数使用，[[Call]] 表示可以用来作为普通函数使用
>
> 所以，当一个函数没有 [[Construct]] 内部属性时，它就不能用来作为构造函数

???

没错，从引擎角度来看，的确是这样处理，但这些内部属性我们并没有办法看到的啊，那对于我们这些写 js 的来说，如何判断一个函数是否能够作为构造函数呢？靠经验积累？

那就先来说说靠经验积累好了：

- 箭头函数不能作为构造函数使用（每篇介绍箭头函数的文章里基本都会说明）
- Generator 函数不能作为构造函数使用（俗称 * 函数，如 `function *A(){}`）
- 对象的简写方法不能作为构造函数使用（`{ A(){} }`）
- 内置方法不能作为构造函数使用（如 Math.min）

靠经验积累只能是这样一条条去罗列，末尾链接的文章里有这么一句话：

> [除非特别说明，es6+ 实现的特定函数都没有实现 [[Construct\]] 内置方法](https://www.stefanjudis.com/today-i-learned/not-every-javascript-function-is-constructable/)
> 简单的说，特定函数设计之初肯定不是为了用来构造的

这大佬是直接去阅读的 ECMA 规范，可靠性很强

那么，经验积累的方式更多是用于面试的场景，但模拟实现 new 是得从代码层面去判断，所以，还有其他方式可以用来判断函数是否能够作为构造函数吗？

有的，末尾链接的文章里，大佬给出了很多种思路，大致列一下：

- 通过构造函数是否有该属性判断 Fn.prototype.constructor，但有局限性，无法处理手动修改的场景
- 通过抛异常方式，局限性是依赖于原有 new 操作符，而且会导致构造函数逻辑被先行处理
- 通过 Reflect.construct，加上 Symbol 的特殊处理后，就没有局限性，推荐方案

每种思路，文章都有讲解，感兴趣可以直接去看看，这里就只挑最后一种来讲讲：

- **通过 `Reflect.construct()` 来判断一个函数是否能够作为构造函数**

```javascript
// 代码来自文末的链接
function is_constructor(f) {
  // 特殊判断，Symbol 能通过检测
  if (f === Symbol) return false;
  try {
    Reflect.construct(String, [], f);
  } catch (e) {
    return false;
  }
  return true;
}
```

其实本质上也是用抛异常方式来判断，但与直接 new A() 的抛异常方式不同的是，它不会触发构造函数的执行。这就得来看看 Reflect.construct 了：

Reflect.construct 方法等同于 new target(...args)，提供了一种不使用 new 来调用构造函数的方法：

```javascript
function A() {
    this.a = 1;
}
new A(); // {a: 1}
// 等价于
Reflect.construct(A, []); // {a: 1}
```

有的可能就好奇了，既然这样，那就直接用 Reflect.construct 来模拟实现 new 不就好了，还需要自己写上面那么多代码，处理那么多场景么？

emmm，你说的很有道理，是可以这样没错，但这样，不就学不到 new 的职责原理了吗，不就回答不了面试官的提问了吗？

Reflect.construct 还可以接收一个可选的第三个参数：

> Reflect.construct(target, argumentsList[, newTarget])
>
> - target: 被调用的构造函数
> - argumentsList：参数列表，类数组类型数据
> - new Target：可选，当有传入时，使用 newTarget.prototype 来作为实例对象的 prototype，否则使用 target.prototype
> - **当 target 或者 newTarget 不能作为构造函数时，抛出 TypeError 异常**

那么，我们可以怎样来利用这些特性呢？先看使用原始 new 的方式：

```javascript
function A(){
    console.log(1);
}
B = () => {
    console.log(2);
}

new A(); // 输出1
new B(); // TypeError，抛异常

// 使用抛异常方式来判断某个函数能否作为构造函数时，如果可以，那么构造函数就会被先执行一遍，如果刚好在构造函数内处理一些业务代码，那么可能就会有副作用影响了
function isConstructor(Fn) {
    try {
   	 	new A();   // 能够判断出 A 可以作为构造函数，但 A 会被先执行一次
    	// new B();  // 能够判断出 B 不能作为构造函数
	} catch(e) {
    	return false;
	}
    return true;
}
```

那么，该如何来使用 Reflect.construct 呢？

关键在于它的第三个参数，是用来指定构造函数生成的对象的 prototype，并不会去执行它，但却会跟第一个参数构造函数一起经过能否作为构造函数（[[Construct]]）检查，看看用法：

```javascript
function A(){
    console.log(1);
}
A.prototype.a = 1;
function B() {
 	console.log(2);   
}
B.prototype.a = 2;

var a = Reflect.construct(A, []); // 输出 1
a.a; // 1，继承自 A.prototype

var b = Reflect.construct(A, [], B); // 输出 1
b.a; // 2, 继承自 B.prototype;
```

我们来大概写一下 Reflect.construct 传入三个参数时的伪代码：

```javascript
Reflect.construct = function(target, args, newTarget) {
    check target has [[Construct]]
    check newTarget has [[Construct]]
    var obj = Object.create(newTarget ? newTarget.prototype : target.prototype)
    var result = target.call(obj, ...args);
    return result instanceof Object ? result : obj;
}
```

第一个参数 target 和第三个参数 newTarget 都会进行是否能作为构造函数使用的检查，虽然 target 会被作为构造函数而调用，但我们可以把待检查的函数传给第三个参数，而第一个参数随便传入一个无关但可用来作为构造函数使用不就好了，所以，代码是这样：

```javascript
// 代码来自文末的链接
function is_constructor(f) {
  // 特殊处理，因为 Symbol 能通过 Reflect.construct 对参数的检测
  if (f === Symbol) return false;
  try {
    // 第一个 target 参数传入无关的构造函数，第三个参数传入待检测函数  
    Reflect.construct(String, [], f);
  } catch (e) {
    return false;
  }
  return true;
}

// 当 f 可作为构造函数使用，Reflect.construct 就会正常执行，那么此时：
// Reflect.construct(String, [], f) 其实相当于执行了:
// var a = new String();
// a.__proto__ = f.prototype
// 既不会让被检测函数先行执行一遍，又可以达到利用引擎层面检测函数是否能作为构造函数的目的
```

# 总结

最终，模拟 new 的实现代码：

```javascript
function _new(Fn, ...args) {
    function is_constructor(f) {
      	if (f === Symbol) return false;
      	try {
        	Reflect.construct(String, [], f);
      	} catch (e) {
        	return false;
      	}
      	return true;
    }
    
    // 1. 参数判断检测
    let isFunction = typeof Fn === 'function';
    if (!isFunction || !is_constructor(Fn)) {
        throw new TypeError(`${Fn.name || Fn} is not a constructor`);
    }
    
    // 2. 创建一个继承构造函数.prototype的空对象
    var obj = Object.create(Fn.prototype);
    // 3. 让空对象作为函数 A 的上下文，并调用 A，同时获取它的返回值
    let result = Fn.call(obj, ...args);
    // 4. 如果构造函数返回一个对象，那么直接 return 它，否则返回内部创建的新对象
    return result instanceof Object ? result : obj;
}
```

几个关键点理清就可以写出来了：

- 如何判断某个函数能否作为构造函数
- 构造函数有返回值时的处理
- 构造函数生成的对象的原型处理

# 参考

[francecil/leetcode：实现 new 操作符](https://github.com/francecil/leetcode/issues/11)