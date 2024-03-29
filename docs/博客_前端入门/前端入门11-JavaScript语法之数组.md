# 声明

本系列文章内容全部梳理自以下几个来源：

- 《JavaScript权威指南》
- [MDN web docs](https://developer.mozilla.org/zh-CN/docs/Web)
- [Github:smyhvae/web](https://github.com/smyhvae/Web)
- [Github:goddyZhao/Translation/JavaScript](https://github.com/goddyZhao/Translation/tree/master/JavaScript)

作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。

PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。

# 正文-数组

数据的有序集合称为数组。

其实也就是个容器，但与 Java 中的数组不同的是，JavaScript 里的数组不限制元素类型、本身就是个对象，因此不管在使用方面、语法方面、概念上都会一些区别。

那么本章其实也就是学习 JavaScript 中数组的用法：

### 相关术语

#### 稀疏数组

稀疏数组就是指不连续索引的数组，数组容器中某些索引是空的、无值。相反，正常的连续索引的数组就是非稀疏数组，容器中各元素紧密堆放，如：

稀疏数组：

![稀疏数组](https://upload-images.jianshu.io/upload_images/1924341-05fc0ee50d65e82a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

非稀疏数组：

  ![非稀疏数组](https://upload-images.jianshu.io/upload_images/1924341-40a22a29d1264791.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

数组内每个元素紧密排列。 

#### 多维数组

JavaScript 不支持真正的多维数组，但可以用数组的数组来近似。

以二维数组举例，在 Java 中可直接声明：

```java
int[][] a = new int[][]{};
```

但在 JavaScript 中无法定义二维数据，会报语法错误：

![多维数组定义](https://upload-images.jianshu.io/upload_images/1924341-4abf875af9df9b3f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

但由于数组在 JavaScript 中也是对象，数组中的元素也可以是数组，因此可以用数组的数组来实现多维数组：

![多维数组定义1](https://upload-images.jianshu.io/upload_images/1924341-a27a49fbaa6187e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### 类数组对象

理解类数组对象概念可以将这个词补充解释完整，即：类似数组的对象。

所以，这个概念的主语是对象，而对象如果是通过 [] 来操作它的属性时，属性值可以很灵活，不是必须满足标识符规定，只要最后能计算出一个字符串值即可。因此，当如果定义了某个对象，其属性值是非负整数：0,1,2,3…，此外再给这个对象定义了一个 length 属性，那么此时就可称这个对象为类数组对象。

因为对这种对象的操作，跟数组很类似，而且 Array.prototype 中提供的很多操作数组的方法都可以直接用来操作这些类数组对象。  

### 数组属性-length

每个数组都有一个 length 属性，这个属性是使数组区别于常规的 JavaScript 对象的关键。

需要注意，length 并不是表示数组的元素个数。

length 表示的是数组里最大索引 + 1，因为 JavaScript 分稀疏数组和非稀疏数组。

如果是非稀疏数组，各元素都紧密堆放，那么此时 length = 最大索引 + 1，能够表示数组元素的个数。

但如果是稀疏数组，由于中间有些索引位置其实是空的，并没有元素，索引 length = 最大索引 + 1，此时并不表示数组元素个数。

而且，数组索引是基于 32 位数值的，所以 length 的取值范围：

0 ~ 2^32 - 1  =>  0 ~ 4294967295 

另外，由于 length 属性默认是可读可写的，所以它有一些特殊功能：

- 当添加或删除数组元素时，length 会自动更新。
- 并不是所有删除数组元素的操作都会让 length 更新，有些删除操作只是移除索引里保存数据，并不移除数组这个索引所占的坑位。
- length 可写性，当设置 length 比当前数组长度小的值时，会自动删除那些索引值大于等于 length 的元素。
- 反过来将 length 设置比当前数组长度大，会让数组变成稀疏数组，并不会实际添加一些元素进去。

### 数组特性

虽然数组也是对象，但它有一些特性是其他对象所没有的： 

- 当有新元素添加到数组中时，自动更新 length 属性
- 设置 length 为一个较小值将截断数组
- 继承了 Array.prototype 一些操作数组的便捷方法
- 类属性为 "Array"
- 不限制元素类型，一个数组中可以同时存储各种类型的数据

### 创建数组

数组的创建，或者说定义数组，初始化数组一共有两种方式： 

#### 数组直接量

```javascript
var a = [];  //空数组
var b = [1, "2", true, [1+2, {}]]; //不同类型的数组元素，数组直接量中甚至可以是表达式
var c = [,,,3];  //省略的索引，读取时为 undefined
```

#### 构造函数 Array()

```javascript
var a = new Array();  //通过构造函数创建数组
a[0] = 1;
```

### 数组元素的读写

跟 Java 语言的数组读写一样，同是通过 [] 中括号来操作。

但 JavaScript 更灵活，[] 里可以是任何表达式，不限制于非负整数，如：

```javascript
a[2] = 0;    //常规操作
a["23"] = 0; //自动将 "23" 字符串转成数值类型 23，等效于 a[23]=0
a[-23] = 0;  //当[]中不是非负整数时，此操作变成对象的属性读写，因为数组也是对象
a[5+6];      //[] 中可以是表达式，先计算表达式值后，再操纵数组，等效于 a[11]
```

因为数组也是对象，所以 JavaScript 中的数组操作不存在越界的场景，当试图查询不存在的属性时，只会返回 undefinded。

### 数组元素的添加

添加元素都数组最简单的方式是通过 [] 操作符，另外也可借助 Array.prototype 的一些方法： 

```javascript
var a = [];  //a 是空数组
a[0] = 0;    //指定索引位置添加元素
a.push(1);   //等效于 a[length] = 1，在数组末尾添加元素
a.unshift(-1); //在数组头部添加元素，原本数组中的元素依次向后移
a.splice(0, 0, "0", "1");  //插入删除操作通用的方法，这里等效于 a.unshift("0", "1");
```

[] 方式来添加元素的前提是，中括号里的索引位置原先并没有元素存在，如果索引位置有元素存在，则该操作变成赋值操作。

如果想在末尾添加元素，直接使用 push 即可；

如果想在开头添加元素，并让其他元素自动后移，可用 unshift；

splice 是个通用的方法，可在数组指定的任何位置添加元素，并让这位置之后的元素自动后移，同时它也可用来删除指定位置元素，并让后续元素自动前移补上被删除的位置。具体参数含义后面介绍。

### 数组元素的删除

数组元素的删除分两种场景：

1. 单纯将指定位置的元素删除，不会触发高索引元素往下移的填充行为，也不会触发 length 的长度减少；
2. 删除指定位置的元素，同时后面元素会往前移来填充被删除元素留下的空白位置，同时 length 会跟随着减少。

所以，当有涉及数组元素删除操作时，需特别注意下，根据自己的需求场景，选择对应的方法进行操作。

#### 场景1对应的删除操作

```javascript
var a = [1,2,3];  //数组 length = 3;
delete a[1];      //此时数组：[1,,3]，length 仍旧=3
```

使用 delete 可用于删除数组内的元素内容，但并不影响数组的长度。

#### 场景2对应的删除操作

```javascript
var a = [1,2,3,4,5,6,7,8];  //数组 length = 8;
a.pop();          //数组：[1,2,3,4,5,6,7]  length = 7;
a.shift();        //数组：[2,3,4,5,6,7]  length = 6
a.splice(2, 2);   //数组：[2,3,6,7]  length = 4
a.length = 2;     //数组：[2,3]  length = 2
```

除了使用 Array.prototype 内置的方法来删除元素，对 length 的赋值操作也可以达到删除末尾的多个元素，超过 length 的索引位置的元素就都被清空掉。

### 遍历数组

#### for 循环语句

数组的遍历也是很常见的场景，常规的用法类似 Java 的 for 循环语句：

```javascript
var a = [1,2,,,,6,7,8];  //数组 length = 8;
for (var i = 0; i < a.length; i++) {
    console.log(a[i]);
}
```

当数组是稀疏数组时，那些索引位置没有元素存在的也仍旧需要遍历，读取的值是 undefined，所以需要根据需要做相应判断处理：

```javascript
var a = [1,2,,,,6,7,8];  //数组 length = 8;
for (var i = 0; i < a.length; i++) {
    if (!a[i]) continue; //跳过 null，undefined 和不存在的元素
    //...
}
for (var i = 0; i < a.length; i++) {
    if (a[i] === undefined) continue; //跳过undefined 和不存在的元素
    //...
}
for (var i = 0; i < a.length; i++) {
    if (!(i in a)) continue; //跳过不存在的元素
    //...
}
```

#### for-in 循环语句

除了使用常规的 for 循环外，还可以使用 for-in 的方式： 

```javascript
var a = [1,2,,,,6,7,8];  //数组 length = 8;
for(var i in a) {
    console.log(a[i]);
}
```

因为数组实际上也是对象，数组的索引从对象角度来看，其实也就是属性，那么就可以用 for-in 这种方式遍历属性，这种方式可以跳过稀疏数组中那些不存在的元素，但有个缺点，它也会遍历那些继承属性，所以如果需要，可做一些过滤判断： 

```javascript
var a = [1,2,,,,6,7,8];  //数组 length = 8;
for(var i in a) {
    if (!a.hasOwnProperty(i)) continue;  //跳过继承的属性 
    //...
}
```

注意：虽然 for-in 也可以达到遍历的效果，但不建议使用在遍历数组的场景，因为遍历顺序并不一定按照索引顺序。 

#### forEach 方法

上述两种遍历方案都需要自行处理很多情况，那么，有没有一种方便一点的遍历方法，有的：forEach

```javascript
var a = [1,2,,,,6,7,8];  //数组 length = 8;
a.forEach(function (x) { //x即数组a中存在的元素
    console.log(x); 
});
```

这种方式可以遍历数组中存在的元素，不需做额外的判断处理。如果函数中需要数组元素的索引信息、数组本身的对象引用信息，此时，可增加额外参数实现: 

```javascript
//x:数组元素, i:元素的索引, a:数组的引用
a.forEach(function (x, i, a) { 
    console.log(a[i] + " = " + x); 
});
```

### 数组方法

Array.prototype 中定义了一些很有用的操作数组的函数，可用于作为数组的方法调用，足够满足开发中所需的数组相关的操作需求，列举一些常见的，更多可参考 API：

#### join()

将数组各元素按照指定字符串拼接起来后输出字符串： 

```javascript
var a = [1,,2,3];
a.join();    //输出：1,,2,3  没有参数默认以逗号,拼接
a.join(" ")  //输出：1  2 3  以空格拼接
```

不存在的元素也会占据一个拼接符，所以可以结合其他方法过滤使用，后续介绍。 

#### reverse()

颠倒数组，将原数组进行逆序操作： 

```javascript
var a = [1,,2,3];
a.reverse();
a.join();    //输出：3,2,,1  原数组被逆序
```

#### sort()

将原数组按照指定规则对元素进行排序，默认以字母表顺序排序： 

```javascript
var a = [22,,3,0,1];
a.sort();
a.join();    //输出：0,1,22,3,,
```

注意：默认排序行为是将所有元素按照字符串形式处理，一个字符一个字符的排序，所有 22 的首字符 2 在 3 前面，排序结果才会是 22 在 3 前面，因为它并不是按照数值的大小来排序。

另外，不存的元素都排在末尾。

所以可以自行指定排序规则，如从小大到排序：

```javascript
var a = [22,,3,0,1];
a.sort(function (a, b) {
     return a - b; //根据顺序返回：负数，0，正数
});
a.join();    //输出：0,1,3,22,
```

#### concat()

将参数传入的数值拼接到数组末尾，但不是在原数组上操作，而是会新建一个数组，此方法的拼接操作不会影响到原数组内容。 

```javascript
var a = [1,2,3];
a.concat(4,5);   //返回 [1,2,3,4,5]
a.concat([4,5]); //返回 [1,2,3,4,5]  因为上述操作没有影响到原数组
a.concat([4,5], [6,[7,8]]); //返回 [1,2,3,4,5,6,[7,8]]
```

注意：如果传入的参数是数组，那么会解析一层数组，拼接数组的元素内容，那如果数组是多维数组，也只拼接第一维的数组元素，不会进一步解析数组。

#### slice()

截取原数组的某个片段，返回一个子数组，不会在原数组上操作，返回的是新数组： 

```javascript
var a = [1,2,3,4,5];
a.slice(0, 3);  //返回 [1,2,3] 两个参数指定起始和终点位置，关系是[),即左包含右不包含
a.slice(3);    //返回 [4,5] 只有一个参数时，表示指定起点到末尾    
a.slice(1, -1);//返回 [2,3,4] 负数表示倒数第n个元素，
```

#### splice()

通用的在数组的指定位置插入或删除元素，插入会让后面的元素自动往后移空出位置，删除会让后面的元素自动往前移填补空白，length 会跟随着变化。

如果有包含删除操作，那么删除的数组会被返回，否则返回空数组；

```javascript
var a = [1,2,3,4,5,6,7,8]; //第一个参数选择操作的起始位置，第二个参数指定要删除的个数
a.splice(4);   //返回 [5,6,7,8]  原数组 a：[1,2,3,4]
a.splice(1,2); //返回 [2,3]  原数组 a：[1,4]
a.splice(1,1); //返回 [4]  原数组 a：[1]
```

第一个参数选择要操作的起始位置，第二个参数指定要删除的元素个数，如果只有一个参数，那么就删除从起始位置到末尾的元素。被删除的元素会组成新数组返回，删除操作是直接在原数组上进行的。 

```javascript
var a = [1,2,3,4,5];  //第三个参数开始之后的任意参数都会被插入到指定的位置
a.splice(2,0,'a','b');  //返回 []  原数组 a：[1,2,'a','b',3,4,5]
a.splice(2,2,[1,2],3);  //返回 ['a','b'] 原数组 a：[1,2,[1,2],3,3,4,5]
```

第三个参数开始之后的任意数量的参数都会被插入的第一个参数指定的位置，先进行删除操作，再进行添加操作。 

#### push() 和 pop()

在数组末尾添加或移除元素，`pop()` 时，被移除的元素会返回。 

#### unshift() 和 shift()

在数组开头添加或移除元素，都会触发数组元素进行迁移行为。

#### toString() 

数组的 `toString()` 行为跟 `join()` 输出的一致。

#### forEach()

遍历数组内每个元素，每遍历一个元素，会调用一次指定的函数，并将元素的相关信息通过参数传入函数内。 

#### map()

原数组按照指定规则映射到新数组的操作，跟 `forEach()` 很类似，遍历数组内的每个元素时，都会调用一次指定的函数，并将元素相关信息通过参数传入函数内。但这个函数需要有一个返回值，用于生产新的数组的元素。 

```javascript
var a = [1,2,3];
var b = a.map(function (value, index, array) {
    return value + index;
}); //b：[1,3,5]
```

新数组与原数组的映射关系为：新数组元素 = 原数组元素 + 元素索引；

当有需要对原数组根据某种规则换算出新数组时，可用此方法。

#### filter()

原数组元素根据某种规则进行过滤操作，过滤完后的元素作为新数组返回。跟 `forEach()` 也类似，都一样是在遍历每个元素时调用指定的方法，并将元素进行传入。这个方法需要一个 boolean 返回值，用来表示是否可以加入新数组。

```javascript
var a = [1,2,3,4,5];
var b = a.filter(function (x) {
    return x > 3;
}); //b：[4,5]
```

用此方法也将稀疏数组转成非稀疏数组，函数内默认返回 true 即可，因为这些方法的遍历是只遍历数组内存在的元素。 

#### every() 和 some()

用于检测数组的元素是否满足指定的条件，这两个方法都返回 boolean 值。检测行为就命名表示的意思，`every()` 表示数组里每个元素都需要满足条件，最终才会返回 true，一旦某个元素不满足，后续元素不会再进行检测，方法直接返回 false。`some()` 则刚好相反，只要有一个元素满足条件，后续元素不用检测，方法直接返回 true。 

```javascript
var a = [1,2,3,4,5];
a.some(function (value, index, array) {
    return value > 3;  //返回 true，因为存在大于3的元素
});
a.every(function (value, index, array) {
    return value > 3;  //返回false，因为不是所有元素都大于3
});
```

#### reduce() 和 reduceRight()

依次对数组里每个元素按照指定规则进行计算，计算之后的结果继续跟下一个元素按照规则计算，常用于求和，最大值之类的场景。 

```javascript
var a = [1,2,3,4,5];
a.reduce(function (x,y) {  //数组求和
    return x + y;
}, 0);
```

区别上述几个方法，这个的参数需要有两个参数，第一参数是函数，用于指定按照某种规则计算，这个函数也需要有两个参数，以及返回值，它的返回值会和下一个元素再一次传入该函数中计算。reduce 的第二个参数会和数组第一个元素被传入函数内计算，这里是求和，所以初始值传 0，求积可以传1，以此类推。

如果不传第二个参数，那么默认以数组第一个元素的值作为第二个参数的值。

reduceRight 和 reduce 用途，用法一致，唯一的区别，它是从数组的末尾往前一个个处理元素的。一个左到右处理数组，一个右到左。

#### indexOf() 和 lastIndexOf()

在数组内搜索指定元素，返回找到的第一个元素的索引位置，没有找到返回 -1

两个方法，一个从左往右寻找，一个从右往左寻找。

#### Array.isArray()

用于判断某个对象是否是数组类型。 