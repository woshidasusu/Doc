# 声明

本系列文章内容全部梳理自以下几个来源：

- 《JavaScript权威指南》
- [MDN web docs](https://developer.mozilla.org/zh-CN/docs/Web)
- [Github:smyhvae/web](https://github.com/smyhvae/Web)
- [Github:goddyZhao/Translation/JavaScript](https://github.com/goddyZhao/Translation/tree/master/JavaScript)

作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。

PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。

# 正文-对象

在 JavaScript 除了原始数据类型外，其余均是对象，函数是对象，数组也是对象；继承通过对象来实现，构造函数也通过对象来实现，所以对象在 JavaScript 里有着很重要的角色，理解和掌握对象的一些特性，对于掌握 JavaScript 这门语言有着很大的帮助。

Java 里对象有属性和方法之分，但在 JavaScript 中，只存在属性，变量是属性，方法也是属性，对于 JavaScript 来说，对象，其实只是一堆属性的无序集合而已，外部可通过对象来操作各种属性，只不过有的属性，它的值是函数类型，所以这时可叫它为对象的方法。

对象的每个属性，都是一个 key-value 的形式，属性名和属性值。而属性，又分自有属性和继承属性，自有属性是指对象本身自己拥有的属性，而继承属性是指继承的属性。

### 对象分类

一般来说，有三类对象，分别是内置对象、宿主对象、自定义对象：

- 内置对象：是指语法标准规范中内置实现的一些对象，例如函数、数组、正则、日期等这些内置对象；
- 宿主对象：是指 JavaScript 解释器所嵌入的宿主环境，在前端里，一般来说宿主环境就是浏览器，浏览器也会定义一些内置对象，比如 HTMLElement 等；
- 自定义对象：开发人员自行实现的对象。

### 创建对象

创建对象有三种方式：对象直接量、构造函数、Object.create() 

#### 对象直接量

这是最简单的一种创建对象的方式，在代码中，直接通过 {} 形式创建一个对象，如：

```javascript
var book = {
    "main title": "JavaScript",
    'sub-title': "The Definitive Guide",
    "pages": 900,
    author: {
        firstname: "David",
        surname: "Flanagan"
    }
};
```

上述代码中，等号右侧 {} 代码块形式定义的对象方式，就叫对象直接量。代码中，每出现一次对象直接量，会直接创建一个新的对象，对象的属性就是对象直接量中定义的。

定义属性时，有几点需要注意一下，属性名也就是 key 值，可加引号也可不加引号，但如果属性名使用到一些保留字时，就肯定需要加引号。

属性值可以是 JavaScript 中的任意类型，原始类型、对象类型都可以。

#### 构造函数

构造函数就是通过 `new` 关键字和函数一起使用时，此时的函数就称构造函数，用途在于创建一个新的对象。具体在后续讲函数时会详细讲解。

这里可以看个例子：

```javascript
var o = new Object();
var o1 = new Object;
var a = new Array();

function Book() {}
var b = new Book();
```

通过 new 关键字和函数一起使用时，就可以创建新对象，例子中的 Object 和 Array 是内置的构造函数，也可以自定义构造函数，其实就是自定义一个函数，让它和 new 关键字一起使用就可以了。

通过构造函数方式如何给新创建的对象添加一些初始化的属性，这些细节和原理在函数一节中再讲，这里需要注意一点的就是，当不往构造函数传参数时，此时括号是允许可以省略的。

另外，第一种对象直接量的方式创建对象，其实，本质上也是通过构造函数：

```javascript
var o = {name:"dasu"} 
//等效于
var o = new Object();
o.name = "dasu";
```

对象直接量其实是一种语法糖，可以通俗的理解，JavaScript 为方便我们创建对象，封装的一层工具，其内部的本质实现也是通过构造函数。

#### Object.create()

你可以把 Object.create() 理解成 Java 中的静态方法。

通过这种方式，可以创建一个新的对象，参数是指定对象要继承的目标对象，这个被继承的对象，在 JavaScript 里被称为原型。

举个例子：

```javascript
var o = Object.create(new Object());  //创建一个新对象，让它继承自一个空对象
```

通过构造函数创建的对象，其继承关系是由构造函数决定的，而 Object.create() 方式，可自己手动指定继承关系。当然，并不是说，构造函数就无法自己指定继承关系。

### 原型

原型可以理解成 Java 中的父类概念。

在 JavaScript 中，对象也存在继承关系，继承的双方都是对象，对象是从对象上继承的，被继承的那个对象称作原型。所以，有一种描述说，JavaScript 是基于原型的继承。

在 Java 中，是通过 extends 关键字实现继承关系，那么在 JavaScript 里呢？

自然也有类似的用来指定对象的继承关系，这就取决于创建对象的方式，上面说过，创建对象有三种方式：对象直接量、构造函数、Object.create()，但由于对象直接量本质上也是通过构造函数，所以其实就两种。

对于构造函数创建的对象来说，因为每个函数都有一个 prototype 属性，prototype 是它的属性名，属性值是一个对象，这个对象就是原型，就是通过该构造函数创建出来的新对象的继承来源。

我们可以通过修改构造函数的 prototype 属性值来达到指定对象继承关系的目的，如果不修改，那么内置的构造函数如 Object 或 Array 这些都已经有默认指定的 prototype 属性值了，也就是创建内置对象时，这个对象已经具有一定的默认继承结构了。

对于 Object.create() 方式创建对象，参数传入的就是子对象的原型，想让创建出来的对象继承自哪里，就传入那个对象就可以了。这个方法必须传入一个参数，否则运行时会抛异常，但可以传入 null，表示不继承任何对象，所以，JavaScript 里，是允许对象没有原型，允许对象不具有继承结构的。

对于原型，在后续会专门有一篇来讲讲，这里大概清楚些概念即可。

### 添加属性

JavaScript 里的对象，其实可以通俗的理解成属性的集合，既然是作为容器的存在，那么其实创建完对象只是第一步，后续就是往这个集合中添加属性，所以 JavaScript 里，对象是允许在运行期间动态添加属性的。

添加属性的方式，可以通过对象直接量方式，在创建对象之时，就写在对象直接量中，或者运行期间动态添加，如：

```javascript
var o = {name:"dasu"}
o.age = 24;
o.sex = "man";
o.love = "girl";
```

![添加属性](https://upload-images.jianshu.io/upload_images/1924341-e6e42a025ff67fcf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

但需要注意一点的是，不像 Java 中在编写类代码，为类添加成员变量时，可以只声明却初始化。在 JavaScript 中，是不允许这样的。

也就是说，为对象添加某个属性时，需要直接将属性名和属性值都设置好，其实想想也能明白，对象无非就是属性的集合，你见过对哪个集合进行添加数据时，是可以只对该集合设置一个 key 值的吗？

### 查询属性

访问对象的属性方式很简单，两种：`.` 运算符或 `[]` 运算符；

两种方式都可以访问对象的属性，但有一个区别：

- `.` 运算符访问属性的话，后面跟着的是属性名
- `[]` 运算符访问属性的话，中括号内跟着的是属性名的**字符串**

仍旧以上面例子中的代码为例：

![查询属性](https://upload-images.jianshu.io/upload_images/1924341-8163a1c99dbd078b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

由于通过 `[]` 运算符访问对象的属性，需要的是一个属性名的字符串形式，所以这种方式会特别灵活，你可以再 `[]` 内放一个表达式也可以，只要表达式最后的结果是字符串，或者说可以自动类型转换为属性名的字符串即可，特别灵活。

而 `.` 运算符可能会比较习惯，但它就只能明明确确的通过属性名来访问了，如果你想通过某种拼接规则来生成属性名，就只能用 `[]` 不能使用 `.`。

如果访问对象中某个不存在的属性时，并不会抛异常，会输出 undefined，但如果继续访问不存在的属性的属性时，等价于访问 undefined 原始类型值的属性，这就会抛异常了：

![查询不存在的属性](https://upload-images.jianshu.io/upload_images/1924341-feafbdc52fe83374.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

ps：是不是发现，对对象的操作很像 Java 中对集合的操作？所以，有人解释说对象是属性的集合，这不是没根据的。

### 删除属性

delete 是用来删除对象上的属性的，但它只是将该属性名从对象上移除，并不删除属性值，举个例子：

```javascript
var a = [1,2,3];
var o = {name:"dasu", arr:a};

delete o.arr;
console.log(a[0]);  //输出 => 1
console.log(o.arr); //输出 => undefined
```

新键一个对象 o，它有个属性 aar 存储着数组 a，当通过 delete 删除对象 o 上的 aar 属性后，再去访问这个 aar 属性，获取的是 undefined，表明这个属性确实被删除了，但本质上只是将其与这个对象 o 的关联删除掉，并不会删除属性值，所以输出数组 a 的值时还是可以访问到的。

不过，delete 有一些局限，它并不是什么属性都可以删除：

- 只能删除自由属性，无法删除继承属性
- 不能删除那些可配置性为 false 的属性

属性拥有一些特性，在下面会讲，其中有一个是可配置性，当将这个特性设置为 false 时，就无法通过 delete 来删除。

而之前说过的，通过 var 声明的全局变量，虽然它最后是作为全局对象的属性存在，但它的可配置性被设为 false，所以这些全局变量才无法通过 delete 被删除。

尝试删除那些无法删除的属性，并不会让程序出问题，delete 表达式有一个返回值，true 表示删除成功，false 表示删除失败，仅此而已，没有其他什么副作用。

### 检测属性

因为 JavaScript 中对象的属性太过动态性了，在运行期间，都无法确定某个属性到底存不存在，某个到底是不是指定对象的属性，所以这种场景，一般都需要进行属性的检测。

也就是检测对象内是否含有某个属性，有多种方式，下面分别来介绍：

#### 查询属性的方式

之前说过，访问对象内不存在的属性时，会返回 undefined，可以利用这点来判断对象是否含有要访问的属性。

这种方式有个缺点，如果属性值刚好被人为的手动设置成 undefined 时，就无法区别对象究竟有没有这个属性。

#### in 运算符方式

in 运算符左侧是属性名的字符串格式，右侧是对象，当右侧对象含有左侧字符串同名的属性时，返回 true，用这种方式就可以很好的判断对象是否含有某个属性。

![检测属性](https://upload-images.jianshu.io/upload_images/1924341-94131cc6cfd87924.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

注意，左侧必须是属性名的字符串格式，跟 `[]` 运算符访问对象属性一样的限制要求。

但这种方式有个局限，就是无法区分这个属性究竟是自有属性还是继承属性，也就是说，继承自原型的属性通过该操作符同样会返回 true。

#### hasOwnProperty()

上面说过，通过构造函数创建的对象，默认都会存在内置的继承结构，不管什么对象，这个默认的继承结构顶端都是构造函数 Object 的 prototype 属性值，由于它的属性值是一个内置的匿名对象，所以，通常都直接这么表达，对象都会继承自 Object.prototype，直接用 Object.prototype 的描述来代表这个属性所指向的具体对象。

所以，以后在看到诸如某某对象继承自 Function.prototype 或 Array.prototype 之类的描述，我们要能够清楚，它表示的是，对象的原型是 xxxx.prototype 这属性所指向的具体对象。

Object.prototype 属性值指向的对象中，定义了一个 `hasOwnProperty()` 方法，所以基本所有对象都可以使用，它是用来判断，对象是否含有指定的自有属性的。

![检测属性](https://upload-images.jianshu.io/upload_images/1924341-b27735c8b4bbf681.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

首先利用上小节介绍的 in 方式来检测，o 对象的默认继承结构顶端是 Object.prototype，所以 o 对象继承了它的 hasOwnProperty 属性，第一行代码返回 true。

这个 hasOwnProperty 属性是个方法，调用它可以来检测对象是否含有指定的自有属性，参数也需要传入属性名的字符串格式，所以第二行代码返回 false，第三行返回 true。

hasOwnProperty  是继承自 Object.prototype 的属性，由于 `hasOwnProperty()` 方法只能检测自有属性，所以第四行返回 false。

#### propertyIsEnumerable()

这个方法同样是 Object.prototype 中所定义的方法，所以，同样基本所有对象都能够使用。

它是 `hasOwnProperty()` 的增强版，也就是，用于检测对象的自有属性且该属性是可枚举性的，才会返回 true。

可枚举性是属性的另一个特性，用来标识该属性是否允许被遍历，下面会讲解。

因为有一些内置属性是不希望被枚举出来的，所以可通过该方法来判断。

### 遍历属性

遍历属性也称枚举属性，也就是类似于对集合进行遍历操作，将其所含有的属性一个个读取出来。

遍历对象属性的方式也有多种，也一一来介绍：

#### for-in 遍历

```javascript
var o = {name:"dasu"}
var o1 = Object.create(o);  //o1 继承自 o
o1.age = 24;
o1.sex = "man";
o1.love = "girl";

for(p in o1) {
	console.log(p);    
}
```

看看输出的结果：

![遍历属性](https://upload-images.jianshu.io/upload_images/1924341-d794f2c34ddaa11f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

o1 继承自 o，在 o1 内有三个自有属性，有一个继承属性，通过 for-in 方式遍历对象 o1 的属性时，不管是自有属性，还是继承属性，都会被输出。

同时，输出的是属性名，并不是属性值，所以 for-in 方式只是遍历对象的属性（包括继承属性），并返回属性名，注意是属性名。

通常 for-in 这种方式，可以结合 `hasOwnProperty()` 方法一起使用，来过滤掉继承的属性。

#### Object.keys()

这又是一个类似静态方法的存在，注意这个方法跟上述 Object.create() 都是构造函数 Object 上的方法，而普通对象继承的是构造函数 Object.prototype 属性值所指向的那个原型对象，这是两个相互独立的对象，也就是说，通过构造函数创建出来的子对象并不是继承构造函数对象本身。

所以在子对象中，无法使用 Object.keys() 这类构造函数对象本身的属性，这点需要注意一下，在后续专门讲继承时会再拿出来讲讲。

![Object.keys()](https://upload-images.jianshu.io/upload_images/1924341-8a1df1551b7080d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

 参数传入需要遍历属性的对象，通过该方法，可以获得一个数组对象，数组内就存储着参数传入的对象的自有属性且属性是可枚举性的，相当于 for-in 方式结合 `hasOwnProperty()` 的效果。

#### Object.getOwnPropertyNames()

该方法也是遍历对象的自有属性，只是它是将参数传入的对象所拥有的所有属性都输出，包括那些被设置为不可枚举的属性，看个例子：

![Object.getOwnPropertyNames](https://upload-images.jianshu.io/upload_images/1924341-70bac64732196a20.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

Object.prototype 指向了一个内置的对象，内置对象中定义了很多属性，继承这个原型的子对象们都可以使用这些属性，但这些属性都被设置为不可枚举性，所以通过 Object.keys() 遍历它时，得到的是一个空数组，子对象通过 for-in 方式遍历时也读取不到这些属性。

这种设计是好的，但考虑到如果有某些场景是需要读取对象自身的所有属性，包括那些不可枚举的，此时，就可通过 Object.getOwnPropertyNames() 来达到目的了。

### 属性的特性

上面介绍中，或多或少有提到属性的特性，属性特性是指，属性的一些特有行为。

属性的特性一共有三个：可写性、可配置性、可枚举性

- 可写性：表示这个属性是否允许被更改，当设置成 false 时，这就是一个只读属性
- 可配置性：表示这个属性是否允许被动态的添加或删除，当设置成 false 时，就不允许通过 delete 来删除
- 可枚举性：表示这个属性是否允许在遍历属性过程中被读取，当设置成 false 时，通过 for-in 或 Object.keys 都无法遍历到这个属性

那么，如果知道对象的某个属性的这三种特性都是什么配置呢？

针对这种情况，内置了一个叫做属性描述符的对象，这个对象本身含有四个属性来描述属性：value、writable、enumerable、configurable。

- value：描述属性值，即 key-value 中的 value
- writable：描述属性的可写性
- enumerable：描述属性的可枚举性
- configurable：描述属性的可配置性

用来描述属性的数据结构有了，接下去就是如何操作了，先看一下，如果获取对象某个属性的描述信息：

#### Object.getOwnPropertyDescriptor()

还是通过Object 的一个方法，接收两个参数，第一个参数是对象，第二个参数是对象内的某个自有属性，将会返回一个属性描述符对象：

![Object.getOwnPropertyDescriptor](https://upload-images.jianshu.io/upload_images/1924341-52c1683d86e34258.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

内置对象的很多属性都会针对属性的使用场景进行了不同的配置了，比如 Object.prototype 中所有属性的 enumerable 可枚举性都配置成 false。

但对于在代码中，通过对象直接量创建的对象，或者自定义构造函数创建的对象等，对这些非内置对象添加的属性，默认这三个特性都为 true，即对象添加的属性默认都是可写、可枚举、可配置的。

#### Object.getOwnPropertyDescriptors()

这个方法也是用来获取对象属性的描述信息的，只是它只需一个参数即可，就是对象，然后会输出所有自有属性的描述信息：

![Object.getOwnPropertyDescriptors](https://upload-images.jianshu.io/upload_images/1924341-6a71633ded56e3d7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这两个方法都是只能获取对象的自有属性的描述信息，如果想要获取继承属性的描述信息，需要先获取原型对象，再调用这两个方法处理原型。获取原型对象后续讲原型时会介绍，这里知道思路就可以了。

#### Object.defineProperty()

有获取对象属性的描述信息的方法，自然有设置对象属性的描述信息方法，所以与上面两个方法相对应的就是 Object.defineProperty() 方法和 Object.definproperties()。

Object.defineProperty() 接收三个参数，第一参数是对象，第二个参数是需要修改属性描述信息的属性，第三个参数是含有属性描述符结构的对象：

```javascript
var o = {name:"dasu"}
var o1 = Object.create(o);  //o1 继承自 o
o1.age = 24;
o1.sex = "man";
o1.love = "girl";

Object.defineProperty(o1, "age", {writable:false});
Object.defineProperty(o1, "love", {enumerable:false, configurable:false});
```

第三个参数，你可以将四个属性值都指定，没指定的仍旧会使用默认的配置，再用 Object.getOwnPropertyDescriptors() 看下修改后的配置：

![Object.defineProperty](https://upload-images.jianshu.io/upload_images/1924341-3ab9658894cf819a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### Object.defineProperties()

这方法作用跟上面一样，只是它是批量处理的方法，接收两个参数，第一个是对象，第二个是需要修改的属性集合，如：

```javascript
var o = {name:"dasu"}
var o1 = Object.create(o);  //o1 继承自 o
o1.age = 24;
o1.sex = "man";
o1.love = "girl";

Object.defineProperties(o1, {
    age: {writable:false},
    love:  {enumerable:false, configurable:false}
})
```

#### 规则

有一些规则需要注意一下：

- 如果属性是不可配置的，那么不能修改它的可配置性和可枚举性，对于可写性，只能将 true 改为 false，不能将 false 改为 true
- 如果属性是不可配置且不可写的，那么不能修改这个属性的值
- 如果属性是可配置但不可写的，那么可以先将属性修改成可写，这时就可以修改属性值

###属性的setter和getter

正常来说，对象的属性由属性的三种特性来控制属性的操纵限制，但有一种情况是例外的，那就是通过 setter 和 getter 添加的属性，这类属性通常叫做存取器属性，为了区分，将正常使用的那些属性叫做数据属性。

之所以叫做存取器属性，是因为，通过这种方式添加的属性，它的读写是交由 setter 和 getter 控制，并不是由属性描述符的三种特性控制。

先来看下，如何定义一个存取器属性：

```javascript
var o = {
    set name(value) {},
    get name() {return "dasu"},
    
    get age() {return 24}
}
```

虽然看起来有点像 Java 中的 set 方法和 get 方法，但完全是两种不一样的东西，首先，这里的 set 和 get 虽然类似方法，但外部是不能通过方法来调用，第二，外部访问这些存取器属性，仍旧是使用 `.` 或 `[]` ，如 o.age 或 o["name"]。

相比于数据属性，存取器属性的区别就在于，读和写是通过 set 和 get 控制，在定义存取器属性时，如果没有定义 get，那么这个属性就是无法读取的，如果没有定义 set，那么这个属性就是不可写的。其余的，可枚举性和可配置性都跟数据属性一样。

也一样是通过 Object.defineProperty() 和 Object.getOwnPropertyDescriptor() 来设置或查看存取器属性的描述信息，唯一需要注意的是，对于数据属性，描述符对象有四个属性：value，writable，enumerable，configurable；但对于存取器属性来说，没有 value 和 writable 属性，与之替换的是 get 和 set 两个属性，所以看个例子：

```javascript
var o = {
    set name(value) {},
    get name() {return "dasu"},  //存取器属性，可读，可写，但读写逻辑得自己实现
    
    get age() {return 24},  //存取器属性，只读，读的逻辑得自己写
    
    sex: "man"  //数据属性
}
```

假设定义了这么个对象，有两个存取器属性，一个数据属性，通过 Object.getOwnPropertyDescriptors() 看一下这些属性的描述：

![存取器属性](https://upload-images.jianshu.io/upload_images/1924341-f4f405f946c58724.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

所以存取器属性和数据属性就在于读和写这两方面的不同，看下修改描述的方式：

![存取器属性.png](https://upload-images.jianshu.io/upload_images/1924341-6e8a7667bf08a93d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)      

存取器属性是可以换成数据属性，同样，数据属性也是可以换成存取器属性的，通过 Object.defineProperty() 在修改属性描述信息时，使用的如果是 set 和 get，那就将数据属性换成存取器属性了，使用的如果是 value 和 writable，原本如果是存取器属性，就将存取器属性转换成数据属性了。

另外，它也有一些规则需要注意一下：

- 如果存取器属性是不可配置的，则不能修改 set 和 get 方法，也不能将它转换为数据属性
- 如果数据属性是不可配置的，则不能将它转换为存取器属性

### 对象的特性

对象的属性有它的几种特性，而对象本身也有一些特性，主要是三个：原型属性、类属性、可扩展性

原型属性：表示对象继承自哪个对象，被继承的对象称为子对象们的原型

类属性：表示对象的类型信息，是一个字符串，比如数字的类属性为 Number

可扩展性：表示是否允许对象可动态的添加属性

原型留着后续讲原型时再来细讲，大概清楚对象是有继承结构，被他继承的对象称作它的原型，所以通常说 JavaScript 是基于原型的继承这些概念即可。

#### 类属性

类属性，本质上就是通过调用 Object.toString() 方法来输出对象的一些信息，这些信息中，包括了对象所属类型的信息，对这串文本信息进行截取处理，就可以只获取对象所属类型的信息，所以称这些信息为对象的类属性。

类属性所呈现的信息很类似于 typeOf 运算符所获取的信息，只是类属性会比 typeOf 更有用一些，它能够区分所有的内置对象，以及区分 null，这些是 typeOf 所做不到的，如：

![类属性](https://upload-images.jianshu.io/upload_images/1924341-5b25a754fad5b582.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### 可扩展性

类似于属性有可配置性、可写性、可枚举性来控制属性的操纵限制，对象也具有可扩展性来限制对象的一些行为。

当将对象的可扩展性设置为 false 时，就无法再动态的为对象添加属性。默认创建的新对象，都是具有可扩展性的。

不像属性的特性那样，还专门定义了一个属性描述符对象来控制属性的特性，对于对象的可扩展性，操作很简单：

#### Object.isExtensible()

使用 Object.isExtensible() 来获取对象的可扩展性描述，返回 true，表示对象是可扩展的，即可动态添加属性。

 #### Object.preventExtensions()

同样，可使用 Object.preventExtensions() 来设置对象的不可扩展，参数传入对象即可。这样，这个对象就不可动态添加属性了。

但有几点需要注意：

- 一旦将对象设置为不可扩展，就无法再将其转换回可扩展了
- 可扩展性只限制于对象本身，对对象的原型并不影响，在原型上添加的属性仍可动态同步到子对象上

针对于对象的可扩展性，对象属性的可写性、可配置性、可枚举性这些操作，Object 内封装了一些便捷的方法，如：

- Object.seal()：将对象设置为不可扩展，同时，将对象所有自有属性都设置为不可配置，通常称封闭对象。可用 Object.isSealed() 来检测对象是否被封闭。
- Object.freeze()：将对象设置为不可扩展，同时，将对象所有自有属性不可配置且只读，通常称冻结对象。可用 Object.isFrozen() 来检测对象是否被冻结。