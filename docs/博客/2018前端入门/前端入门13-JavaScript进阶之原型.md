# 声明

本系列文章内容全部梳理自以下几个来源：

- 《JavaScript权威指南》
- [MDN web docs](https://developer.mozilla.org/zh-CN/docs/Web)
- [Github:smyhvae/web](https://github.com/smyhvae/Web)
- [Github:goddyZhao/Translation/JavaScript](https://github.com/goddyZhao/Translation/tree/master/JavaScript)

作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。

PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。

# 正文-原型

JavaScript 中并没有 Java 里的类，但它有构造函数，也有继承，只是它是动态的基于原型的继承。所以，原型有点类似于 Java 中父类的概念。

但是，JavaScript 中的关于实例、继承等这些跟 Java 还是有很大的区别。

先来说说在 Java 里面：

类是静态的，类是可继承的，是对象的抽象模型的表现，每个具体的对象都是从类上实例化出来的，一个类中定义了这类对象的属性和行为，一旦定义完了运行时就无法改变了。

但对于 JavaScript 来说，它并没有类的存在，在 JavaScript 里，除了原始类型外，其余皆是对象。

它是动态的基于原型的继承机制，原型本质上也是对象，也就是说对象是继承自对象而来的。

而对象这个概念是实例化后的每一个具体个体代表，它是运行期动态生成的，再加上 JavaScript 里对象的特性，如可动态添加属性，这就让 JavaScript 里的继承机制非常强大，因为这样一来，它是可动态继承的，原型对象上发生的变化能够同步让继承它的子对象都跟随着变化。

### 原型概念

函数和构造函数的区别就在于，所有的函数，当和 new 关键字一起使用时，此时称它为构造函数。类似的关系，所有的对象，当它被设置为某个构造函数的 prototype 属性值时，此时称它为原型。

也就是说，任何对象都可以当做其他对象的原型。

在 Java 中，对象一般通过 super 关键字指向它的父类，而在 JavaScript 中，对象可通过 \__proto__ 来指向它的原型对象，或者通过构造函数的 prototype 指向对象的原型。

### prototype & \__proto__

这两个虽然指向的是同一个原型对象，但它们的宿主却不一样，需要区分一下，prototype 是构造函数的属性，\__proto__ 是通过构造函数创建出来的对象的属性。

\__proto__ 属性并不在 ES5 标准规范中，但基本大部分浏览器都为引用类型实现了这么一个属性，用于查看当前对象所继承的原型，它的值等于该对象的构造函数的 prototype 属性值。

prototype 是每个函数对象的一个属性，其他对象并没有这个属性，因为基本所有的对象其实都是通过构造函数创建出来的，所以也只有函数才能来实现继承的机制。这个属性值表示着从这个构造函数创建的对象的原型是什么。

对象一节学习过，创建一个对象的三种方式：

```javascript
//对象直接量：
var a = {};//其实是 var a = new Object(); 的语法糖
var a = [];//其实是 var a = new Array(); 的语法糖

//构造函数
var a = new Array();

//Object.crate()
var a = Object.crate(null);
```

所以，对象直接量的方式本质上也是通过构造函数的方式创建对象。

这也是为什么会在对象一节中说，所有通过直接量方式创建的对象都继承自 Object.prototype 的理由。

而通过 Object.create() 方式创建的对象，其原型就是参数指定的对象，可手动传入 null，表示创建的对象没有原型。

所以，在 JavaScript 中，绝大部分的对象都有原型，即使不手动指定，也会有默认的内置原型对象。之所以说绝大部分，是因为原型链顶部的 Object.prototype 对象的原型是 null，或者通过 Object.create() 创建对象时手动指定 null。

### 默认的继承结构

如果不手动指定继承关系，默认的几种引用类型的继承关系（原型链）如下： 

-          声明的每个函数 -> Function.prototype –> Object.prototype -> null
-          数组对象 -> Array.prototype -> Object.prototype -> null 
-          对象直接量创建的对象 -> Object.prototype -> null
-          自定义构造函数创建的对象 -> {} -> Object.prototype -> null

所有对象继承的顶层原型是 Object.prototype。

这也是为什么函数对象、数组对象、普通对象都可以使用一些内置的方法，因为创建这些对象的时候，默认就会有一些继承关系，跟 Java 中所有的类都继承自 Object 的机制类似。

### 构造函数和原型的关系

构造函数本身是一个函数对象，它的属性 prototype 指向的是另一个对象，所以这两个概念本身就是两个不同的东西。

通过一个构造函数创建一个新的对象，不能说，这个对象继承自构造函数，而是应该说，这对象继承自构造函数的属性 prototype 指向的对象。

所以，可以通俗的理解，构造函数只是作为第三方类似于工具的角色，用来创建一个新对象，然后让这个新对象继承自 prototype 属性指向的对象。

不过构造函数和原型之间是相互引用的关联关系，构造函数有个属性 prototype 指向原型，而原型也有一个属性 constructor 指向构造函数。

所以，所有从这个构造函数创建的新对象，都继承了原型的属性，那么这些新对象也就可以通过继承而来的 constructor 的属性访问构造函数。

 如果不手动破坏原型链，那么通过构造函数创建新对象时，三者间的关系：

![三者关系](https://upload-images.jianshu.io/upload_images/1924341-1ed763fe92c0ff3a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

而更多的时候，我们需要借助原型来让对象继承一些公有行为，有两种做法，一种是通过直接在原型对象上动态添加相关属性，这种方式不破坏原型链，比较推荐。

还有一种，定义一个新的原型对象，然后重新赋值构造函数的 prototype 属性值，将它指向新的原型对象。但这种方式会破坏默认的原型链，同时也会破坏构造函数、原型、实例化对象三者间的默认关联关系。

举个例子：

```javascript
function A(){}   //定义构造函数A
A.prototype.c = 1;
var b = new A(); //通过构造函数创建对象b
```

  通过构造函数创建一个新对象b，且在构造函数的 prototype 上手动添加新的属性c，会被 b 继承，由于这种方式是没有破坏原型链的，所以三者间关系如下： 

![构造函数示例](https://upload-images.jianshu.io/upload_images/1924341-79b8440c64a946c3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)    

b.\__proto__ 表示 b 的原型，原型对象的 constructor 属性指向构造函数 A，name 是函数对象的属性，用于输出函数名。

而且对象 b 由于继承自原型 A.prototype，所以也继承它的 constructor 属性，所以也指向构造函数 A。

此时对象 b 的继承关系：b -> {} -> Object.prototype

以上是默认的不破坏原型链下三者的关系，但如果手动破坏了原型链呢：

```javascript
function A(){}   //定义构造函数A
A.prototype.c = 1;
var a = [];      //创建数组对象a
a.c = 0;
A.prototype = a; //手动修改构造函数A的prototype，让其指向 a
var b = new A(); //通过构造函数创建对象b，b继承自原型a
```

上面的代码手动修改了 A.prototype 的属性值，让 b 是继承自手动创建的对象 a，所以这里就破坏了默认的原型链，同时，三者间的关系也被破坏了： 

![修改原型示例](https://upload-images.jianshu.io/upload_images/1924341-e27c1d5f0e5e94df.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

首先，c 属性验证了 b 是继承自对象 a了。

而我们说过，b.\__proto__ 指向 b 的原型，在这里，b 的原型就是对象 a 了。而对象 a 是手动创建的，所以它的 constructor 属性是继承自它的原型对象。数组直接量创建的数组对象，本质上是通过 new Array()，所以a的构造函数是 Array()，对象 a 继承自 Array.prototype。

对于对象 a，我们创建它的方式并没有手动去修改它的原型链，所以按默认的三者间的关系，Array.prototype 的 constructor 属性指向构造函数 Array()，这就是为什么 b.\__proto__.constructor.name 的值会是 Array 了。

而，对象 b 继承自对象 a，所以 b.constructor 的值也才会是 Array。

此时，对象 b 的继承关系： b-> a -> Array.prototype -> Object.prototype

所以，在这个例子中，虽然对象 b 是从构造函数 A 创建的，但它的 constructor 其实并不指向 A，这点也可以稍微说明，构造函数的作用其实更类似于作为第三方协调原型和实例对象两者的角色。

通常是不建议通过这种方式来实现继承，因为这样会破坏默认的三者间的联系，除非手动修复，手动对 a 的 constructor 属性赋值为 A，这样可以手动修复三者间默认的关联。

**来稍微小结一下**：

因为原型本质上也是对象，所以它也具有对象的特性，同时它也有自己的一些特性，总结下： 

- 所有的引用类型（数组、对象、函数），都具有对象特性，都可以自由扩展属性，null除外。
- 所有的引用类型（数组、对象、函数），都有一个 \__proto__ 属性，属性值的数据类型是对象，含义是隐式原型，指向这个对象的原型。
- 所有的函数（不包括数组、对象），都有一个 prototype 属性，属性值的数据类型是对象，含义是显式原型。因为函数都可以当做构造函数来使用，当被用于构造函数创建新对象时，新对象的原型就是指向构造函数的 prototype 值。
- 所有的内置构造函数（Array、Function、Object…），它的 prototype 属性值都是定义好的内置原型对象，所以从这些内置构造函数创建的对象都默认继承自内置原型，可使用内置的属性。
- 所有的自定义函数，它的 prototype 属性值都是 new Object()，所以所有从自定义构造函数创建的对象，默认的原型链为 （空对象）{} ---- Object.prototype。
- 所有的引用类型（数组、对象、函数），\__proto__ 属性指向它的构造函数的prototype值，不手动破坏构造函数、原型之间的默认关系时
- 所有的引用类型（数组、对象、函数），如果不手动破坏原型链，构造函数、原型、实例对象三者之间有默认的关联。

### 对象的标识

在 Java 中，由于对象都是从对应的类实例化出来的，因此类本身就可以做为对象的标识，用于区分不同对象是否同属一个类的实例。运算符是 instanceof。

在 JavaScript 中，虽然也有 instanceof 运算符，但由于并没有类的概念，虽然有类似的构造函数、原型的概念存在，但由于这些本质上也都是对象，所以很难有某个唯一的标识可以来区分 JavaScript 的对象。

下面从多种思路着手，讲解如何区分对象:

#### instanceof

在 Java 中，可以通过 instanceof 运算符来判断某个对象是否是从指定类实例化出来的，也可以用于判断一群对象是否属于同一个类的实例。

在 JavaScript 中有些区别，但也有些类似：

```javascript
var b = {}
function A() {}
A.prototype = b;
var a = new A();
if (a instanceof A) { //符合，因为 a 是从A实例化的，继承自A.prototype即b
    console.log("true"); 
}

function B() {}
B.prototype = b;
var c = new B();
if (c instanceof A) {//符合，虽然c是从B实例化的，但c也同样继承自b，而A.prototype指向b，所以满足
    console.log("true");
}
if (c instanceof Object) {//符合，虽然 c 是继承自 b，但 b 继承自 Object.prototype，所以c的原型链中有 Object.prototype
    console.log("true");
}
```

在 JavaScript 中，instanceof 运算符的左侧是对象，右侧是构造函数。但他们的判断是，只要左侧对象的原型链中包括右侧构造函数的 prototype 指向的原型，那么条件就满足，即使左侧对象不是从右侧构造函数实例化的对象。

也就是说，在 JavaScript 中，判断某些对象是否属于同一个类的实例，不是根据他们是否是从同一个构造函数实例化的，而是根据他们的构造函数的 prototype 指向是不是相同的。

通过这种方式来区分对象有点局限是：在浏览器中多个窗口里，每个窗口的上下文都是相互独立的，无法相互比较。

#### isPrototypeOf

instanceof 是判断的对象和构造函数两者间的关系，但本质上是判断对象与原型的关系，只是刚好通过构造函数的 prototype 属性值做中转。

那么，是否有可以直接判断对象和原型两者的操作呢？

这个就是 isPrototypeOf 的用法了：左边是原型对象，右边是实例对象，用于判断左边的原型是否在右边实例对象的原型链当中：

```javascript
Object.prototype.isPrototypeOf(b);
```

但它跟 instanceof 有个本质上的区别，instanceof 是运算符，而 isPrototypeOf 是 Object.prototype 中的方法，由于基本所有对象都继承自这个，所以基本所有对象都可以使用这个方法。

instanceof 和 isPrototypeOf 更多使用的场景是用于判断语句中，如果需要主动对某个对象获取它的一些标识，可以使用接下来介绍的几种方式：

#### typeof

在 JavaScript 中数据类型大体上分两类：原始类型和引用类型。

原始类型对应的值是原始值，引用类型对应的值为对象。

对于原始值而言，使用 typeof 运算符可以获取原始值所属的原始类型。

对于函数对象，也可以使用 typeof 运算符来区分：

![typeof](https://upload-images.jianshu.io/upload_images/1924341-83e46b310e8e88a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

所以它的局限也很大，基本只能用于区分原始值的标识，对于对象，自定义对象，它的结果都是 object，无法进行区分。 

#### 对象的类属性

在对象一节中，介绍过，对象有一个类属性，其实也就是通过 Object.prototype.toString() 方法可以获取包含原始类型和引用类型名称的字符串，对其进行截取可以获取类属性。

![对象类属性](https://upload-images.jianshu.io/upload_images/1924341-89cac527cb8924f9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

相比于 typeof，它的好处在于可以区别所有的数据类型的本质，包括内置引用对象（数组、函数、正则等），也可以区分 null。

局限在于，需要自己封装个工具方法获取类属性，但这不是难点，问题在于，对于自定义的构造函数，都是返回 Function，而很多对象其实是通过构造函数创建出来的，所以无法区分不同的构造函数所创建的对象。

#### constructor 的 name 属性

constructor 是对象的一个属性，它的值是继承自原型的取值。而原型该属性的取值，在不手动破坏对象的原型链情况下，为创建对象的构造函数。

即，默认情况下，构造函数的 prototype 指向原型，原型的 constructor 指向构造函数，那么从该构造函数创建的对象都继承了原型的这个属性可指向构造函数。

所以，在这些场景下，可用对象的 constructor.name 来获取构造函数的函数名，用函数名作为对象的标识。

```javascript
function A(){}   //定义构造函数A
var a = new A();
var b = {};
```

![函数名](https://upload-images.jianshu.io/upload_images/1924341-5af3808f4d7c8784.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这种方式有个局限，如果手动修改构造函数的 prototype，破坏了对象的原型链，那么此时，新创建的对象的 constructor 就不是指向创建它的构造函数了，此时，这种方式就无法处理了。

由于 JavaScript 不像 Java 这种静态的类结构语言，所以没有一种完美的方式适用于各自场景中来区分对象的标识，只能是在适用的场景选择适合的方式。

所以，在 JavaScript 有一种编程理念：鸭式辩型

### 鸭式辩型

我不是很理解中文翻译为什么是这个词，应该是某个英文词直译过来的。

它的理念是：像鸭子一样走路、游泳、嘎嘎叫的鸟就称它为鸭子。

通俗点说，编程时，不关心对象所属的标识，不关心对象继承自哪个原型、由哪个构造函数创建，只要这个对象含有相同的属性、行为，那么就认为它们归属于同一类。

有个例子就是：类数组对象，它本质并不是数组对象，但由于具有数组对象的特征，所以基本上可以把它当做数组来使用。

对应到编程中，不应用判断对象是否拥有相同的标识来区分对象，而是应该判断对象是否含有期望的属性即可。