# 声明

本系列文章内容全部梳理自以下几个来源：

- 《JavaScript权威指南》
- [MDN web docs](https://developer.mozilla.org/zh-CN/docs/Web)
- [Github:smyhvae/web](https://github.com/smyhvae/Web)
- [Github:goddyZhao/Translation/JavaScript](https://github.com/goddyZhao/Translation/tree/master/JavaScript)

作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。

PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。

# 正文-原型链

原型链也就是对象的继承结构，举个例子： 

```javascript
var a = []
```

那么 a 对象的原型链： 

`a -> Array.prototype -> Object.prototype -> null`

基本所有对象的原型链顶部都是 Object.prototype，而 Object.prototype 没有原型，手动通过 Object.create(null) 创建的对象也没有原型。但这两点是特例。

原型的用途在于让对象可继承原型上的属性，达到功能复用、代码复用的目的。

面向对象的编程语言中，继承是一大特性，所以在编写 JavaScript 代码时，要能够很明确所创建的对象的一个原型链结构，这样才便于更好的设计，更好的编写代码。

在编写代码过程中，使用的无非就是内置对象，或者自定义对象，所以下面来看看两者的原型链结构：

### 内置对象的原型链结构

其实也就是之前有讲过的默认的原型链结构： 

- 声明的每个函数 -> Function.prototype –> Object.prototype -> null
- 数组对象 -> Array.prototype -> Object.prototype -> null 
- 对象直接量创建的对象 -> Object.prototype -> null
- 日期对象 -> Date.prototype -> Object.prototype -> null
- 正则对象 -> RegExp.prototype -> Object.prototype -> null

  可以用对象的 \__proto__.constructor.name 来测试：

![](https://upload-images.jianshu.io/upload_images/1924341-ddecdb4e8c5ba6be.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

Object.prototype 已经内置定义了一些属性，如：toString()，isPrototypeOf()，hasOwnProperty() 等等；

同样，Array.prototype 内置了如：forEach()，map() 等等。

其他内置原型也都有相对应的一些属性。

所以使用内置对象时，才可以直接使用内置提供的一些属性。

### 自定义对象的原型链结构

不手动修改自定义构造函数的 prototype 属性的话，默认创建的对象的原型链结构：

- 自定义构造函数创建的对象 -> {} -> Object.prototype -> null

比如：

```javascript
function A() {}
var a = new A();
```

在首次使用构造函数 A 时，内部会去对 prototype 属性赋值，所进行的工作类似于：A.prototype = new Object();

所以 A.prototype 会指向一个空对象，但这个空对象继承了 Object.prototype。

那么不修改这条原型链的话，默认通过自定义构造函数创建的对象的继承结构也就是：{} –> Object.prototype –> null。

虽然这条原型链也可以这么表示：A.prototype –> Object.prototype -> null

a 虽然确实继承自 A.prototype，但我不倾向于这种写法来表示，因为自定义构造函数的 prototype 属性值会有很大的可能性被修改掉，当它的属性值重新指向另一个对象后，此时也仍旧可以说 a 对象继承自 A.prototype，个人感觉理解上会有点别扭，无法区别前后原型的不同，毕竟 A.prototype 只是一个 key 值，所以我倾向于直接说 a 继承的实际对象，也就是 key 值对应的 value 值。

虽然 Object.prototype 也是一个 key 值，实际指向的一个内置的对象，但手动修改这些内置构造函数的 prototype 的可能性不高，所以个人觉得对于内置构造函数，可以直接用类似 Object.prototype 来表示。

那么这个时候，如果为这个构造函数的 prototype 添加一些属性：

```javascript
function A() {}
A.prototype.num = 0;
var a = new A();
```

那么，对于对象 a 而言，它的原型链：

a -> {num:0} -> Object.prototype -> null

这是不修改原型链的场景，那么如果手动破坏了默认的原型链呢？

```javascript
var B = [];
B.num = 0; 
function A() {}   
A.prototype.num = 222; 
var a = new A();  //a 的原型链
A.prototype = B;
var b = new A();  //b 的原型链
```

此时对象 b 的原型链又是什么呢？

首先看看对象 B，是一个数组对象，所以 B 对象的原型链：

B –> Array.prototype -> Object.prototype -> null

再来看看对象 a，创建它时，还并没有修改构造函数的 prototype，所以它的原型链：

a -> {num:222} -> Object.prototype -> null

那么这个时候，手动修改掉了构造函数的 prototype 指向，这之后再通过构造函数 A 创建的对象的原型链也就会跟随着变化，所以对象 b 的原型链：

b -> B –> Array.prototype -> Object.prototype -> null

所以，修改构造函数的 prototype，其实相当于将另外一条原型链拿来替换掉原本的原型链。

### 原型链用途

对于对象，它的本质其实也就是一堆属性的集合，所以对象的用途是用来操作对象内的属性的，而当操作对象的属性时，会有一种类似于作用域链机制来寻找属性。

操作无非分两种场景，一是读取对象属性，二是写对象属性，两种所涉及的处理不一样。

当读取对象属性时，是依靠对象的原型链来辅助工作，如果对象内部含有该属性，则直接读取，否则沿着原型链去寻找这个属性。

也就是说，对象继承原型的机制，并不是说，将原型的所有属性拷贝一份到对象内部，而只是简单对对象建立一条原型链而已。这条原型链中保存着各个原型对象的引用，当读取继承的属性时，就可以根据这条原型链上的引用访问到其他原型对象内的属性了。

因为读取继承属性，本质上是读取其他对象的属性，那么，这些原型属性发生变化时，也才会影响到继承他们的子对象。

那么，对于写对象属性的操作：

这点就由对象的特性决定了：当对一个对象的属性进行赋值操作时，如果对象内没有该属性，那么会动态为该对象添加一个属性，如果对象内部有该属性，那么修改属性值。

对象的属性写操作会影响到后续的读操作，因为如果是读取对象的某个继承属性，本来对象内部没有该属性，所以是去读取的原型内的属性值。但经过写操作后，对象内部创建了同名的内部属性，之后再读取时，发现内部已经有了，自然不会再去原型链中读取。

### 获取对象的原型链

掌握了原型链的相关理论，对于代码中某个对象的原型链也就能够很清楚的知道了。无外乎内置对象的默认原型链，或者自定义构造函数手动修改的原型链。

但，初学阶段，如果想借助浏览器的开发者工具的 console 来测试、查看对象的原型链以便验证猜想，可以这么处理：

```javascript
var a = []
```

![](https://upload-images.jianshu.io/upload_images/1924341-ba5f0add9a4e9dac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

虽然 \__proto__ 可以获取原型，但拿到的是对象，所以可以借助对象的某些标识，比如原型的 constructor 的 name 函数名属性标识。 

### 实例

![](https://upload-images.jianshu.io/upload_images/1924341-a789905075da24dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

 网上关于原型链的文章经常会出现这么一张图片，首先我承认，这张图很高级，也基本把原型链的相关理论表示出来了，但我很不喜欢它。因为对于新手来说，很难看懂这张图，我第一次看到也一脸懵逼。

就算现在能够看懂了，我也还是不喜欢它，因为这张图表达的内容太多了：它不仅表示了某个对象的原型链结构，同时，也表示出了实例对象、原型、构造函数三者间的函数，而构造函数本质上也是对象，所以也顺便表示它的原型链结构。

我们一步步来看，它首先定义了一个构造函数 Foo，然后通过它创建了 f1,f2对象，然后从 f1,f2开始出发，先求他们的原型链。 

用代码来说，其实也就是：

```javascript
function Foo() {}
var f1 = new Foo();
//求f1对象的原型链
```

根据我们上述梳理的理论，很简单了吧，原型链其实也就是：

f1 -> {} -> Object.prototype -> null

接着，它表达了可以用 \__proto__ 获取对象的原型，然后每个原型、构造函数、实例对象三者间的关系它也表达出来了，原型的constructor指向构造函数，而构造函数的prototype指向原型。

而这三个角色本质上也都是对象，既然是对象，那么它们本身也有原型，所以也再顺便画出它们的原型链。

总之，就是从 f1 实例对象出发，先找它的原型，通过原型再找构造函数，然后再分别将原型和构造函数看成实例对象，重复之前f1的工作。

另外，又通过 new Object() 创建了对象 o1，求它的原型链。

所以，这张图上，其实表达了一共 5 条原型链，分别是:

- f1 的原型链
- f1 的原型的constructor指向的构造函数Foo对象的原型链
- 函数对象Foo的原型的constructor指向的构造函数Function对象的原型链
- f1 的原型的原型即Object.prototype的constructor指向的构造函数Object 对象的原型链。
- o1 的原型链

如果你能从这张图看出这5条原型链，那么原型链的理论你就基本掌握了。

而且，建议看这张图时，每次都将某条原型链跟踪到底，再去看另一条，这过程不要过多关注在分支上，否则很容易混乱。

对于新手，如果能够对这张稍作备注，而不是直接将这张图放出来，我觉得会更好，如下：

![](https://upload-images.jianshu.io/upload_images/1924341-ed3572ea96c33df5.png)  