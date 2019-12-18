在写这篇博客时，搜索参考了很多资料，网上对于 Groovy 介绍的博客已经特别多了，所以也就没准备再详细的去介绍 Groovy，本来也就计划写一些自己认为较重要的点。后来发现了 Groovy 的官方文档后，发现其实官方的介绍特别的全面，详细。但可惜的是我的英语不好，看英文文档有些费时间，但还是推荐有能力的人去参照官方文档来学习，后期如果有时间的话，我也计划试着翻译一些官方的文档来学习，记录一下。  

所以，这篇的侧重点不是在介绍 groovy 的基本语法，而是介绍跟 build.gradle 比较相关的一些知识点吧，另外在末尾会附上一些 groovy 学习链接，有兴趣的可以继续去学习。

***  
# 系列索引  
build.gradle系列一：[看不懂的build.gradle代码](http://www.jianshu.com/p/a3805905a5c7)  
build.gradle系列二：[学点Groovy来理解build.gradle代码](http://www.jianshu.com/p/501726c979b1)  
...  
***  

开始学习 Groovy 前，引用徐宜生的《Android群英传：神兵利器》书中的一句话来介绍 Groovy：  
> Groovy 对于 Gradle，就好比 Java 对于 Android。了解一些基本的 Groovy 知识，对于掌握 Gradle 是非常有必要的。  

# Groovy 是什么  
Groovy 是一种脚本语言，既然是脚本语言，那么它也就有脚本语言的那些特点：使用动态类型、末尾不用分号等等。另外，它又是基于 Java 上设计的语言，也就是 Groovy 兼容 Java，可以使用 JDK 里的各种方法，你可以在 Groovy 文件里写 Java 代码里，照样可以正常编译运行。  

# Groovy 语法  
关于语法的详细的介绍在末尾有链接，这里就只是挑出我认为比较重要的，而且跟 java 有区别的，在阅读代码时可能会看不懂的一些语法进行记录。  

### 1.注释、标识符方面跟 Java 基本一样。  

### 2.基本数据类型，运算方面  
这方面在 build.gradle 文件里也不怎么常见到使用，因为 groovy 是动态类型，定义任何类型都可以只使用 def 来定义，所以如果使用具体的比如 char, int 等类型时需要强制转换吧。有需要的可以自己查阅末尾的参考链接。  

### 3.字符串方面  
java 只支持用 ` "..." ` 双引号来表示字符串

groovy 支持使用 ` '...' `, ` "..." `, ` '''...''' `,  ` """...""" `, ` /.../ `, ` $/.../$ ` 即单引号，双引号等6种方法来表示字符串  
至于各种表示方法有什么区别，具体可以参考末尾的链接，这里简单提提，` '...' `, ` "..." ` 只支持单行字符串，不支持多行，剩下的四种都支持多行字符串，如下图  
 ![Groovy字符串代码示例](http://upload-images.jianshu.io/upload_images/1924341-cc18ea13326a0918.png)  
 ![控制台输出结果](http://upload-images.jianshu.io/upload_images/1924341-0813184508bcdd70.png)  

斜杠我也很少见，常见的是带有 `${}` 的字符串，比如： ` println "blog's url: ${blogUrl}"  ` 这是 groovy 的 GString 特性，支持字符串插值，有点了类似于变量引用的概念，但注意，在 ` '...' `, ` '''...''' ` 单引号表示的字符串里不支持 `${}`。当然，如果你要使用 java 的方式，用 ` + ` 来拼接也可以。  

### 4.集合方面（List、Map）  
**定义和初始化**  
定义很简单，List 的话使用 `[]` 定义，各项用 `,` 隔开即可。Map 的话使用 `[:]`，各项也是用 `,` 隔开，如： 
```  
def numList = [1, 2, 3]  //List
def map [1:"dasu", dasu:24] //Map, : 前是key，如1， : 后是value, 如dasu
```  
有一点跟 java 不同的是， groovy 集合里不要求每一项都是同类型，比如可以这样定义 `def list = [1, 'dasu', true]`，集合里包含数字，字符串，布尔值三种类型。  

**使用**  
通过下标操作符 `[]` 读写元素值，并使用正索引值访问列表元素或负索引值从列表尾部访问元素，也可以使用范围，或使用左移 `<<` 追加列表元素，如  
```  
//========= List 使用 ================
println numList[1]  //输出 1
println numList[-1] //输出 3

numList[2] = 4    // println numList[2]将输出 4
numList[3] = 5
numList << "dasu" //现在numList = [1, 2, 4, 5, "dasu"]

//========== Map 使用 ================
println map[1]       //输出 dasu
println map.dasu     //输出 24, key是字符串的话可以这样访问
map[3] = "I am dasu" // 在map里加入一个[3:"I am dasu"]项
```  
跟 java 不同的是， groovy 并不存在下标访问越界，当下标为负数时则从右开始算起，当指定的下标没有存放值时返回 null。  

### 5.数组方面  
groovy 其实没有严格区分数组和集合，数组的定义和使用方法跟集合一样，只是你需要强制声明为数组，否则默认为集合，如  
```  
String[] arrStr = ['Ananas', 'Banana', 'Kiwi']  
def numArr = [1, 2, 3] as int[] //as 是 groovy 关键字

```  
上面的初始化方式是不是跟 java 不一样，这一点需要注意下，java 是用 `{}` 来初始化，但在 groovy 里面， `{}` 表示的是闭包，所以这点需要注意一下。  

***  
上面的是 groovy 与 java 不同的一些基本语法，下面介绍一些我自己认为是 groovy 比较重要的特性，如果要看懂 build.gradle 里的代码，明白下面介绍的会比较有帮助。  

### 6.方法的简化使用  

**方法的括号可以省略**  

groovy 定义方法时可以不声明返回类型和参数类型，也可以不需要 return 语句，最后一行代码默认就是返回值。  
而在调用方法时可以将括号省略，不省略的时候如下    
```  
def add(a, b) {
    a + b
}
println add(1,2)  //输出 3

```  
上面的方式不陌生吧，再来看看下面的代码  
```  
println add 1, 2 //输出 3, add方法同上

```  
上面就是调用方法时省略掉圆括号的写法，再来看一种情况  
```  
def getValue(Map map) {
    map.each {
        println it.key + ":" + it.value
    }
}
def map = [author:"dasu"]
getValue(map) //输出 author:dasu
```  
这次定义一个参数为 map 类型的方法，如果我们在调用方法的时候才对参数进行定义和初始化会是什么样的呢？如下  
```  
getValue(author: "dasu") //输出 author:dasu
```  
之前说过了，groovy 调用方法时可以将括号省略掉，这样一来再看下  
```  
getValue author: "dasu" //输出 author:dasu
```  
这样子的格式是不是看着觉得很眼熟，没错，就是 build.gradle 里的第一行代码。  
![build.gradle](http://upload-images.jianshu.io/upload_images/1924341-d28331899147847c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
如果有看过我的上一篇 [build.gradle](http://www.jianshu.com/p/a3805905a5c7) 博客的话，现在对疑问1是不是就有些理解了呢。  

上图那代码如果把省略的括号补上的话，大家应该就会熟悉点了  
```  
// apply plugin: 'com.android.application'  等效于
def map = [plugin: 'com.android.application']
apply(map)

```    
调用了 apply() 方法，该方法传入一个 map 参数，我们来看看是不是这样，用as查看下源码，如下  
![PluginAware.java](http://upload-images.jianshu.io/upload_images/1924341-2f84f2bb58ecc672.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
没错吧，apply() 其实是个方法，参数为 map 类型，而且 key 的取值也给你规定了 `from`, `plugin`, `to` 三种，是不是确实在别人的 build.gradle 代码里也有看见过类似 `apply from ***`，这样一来就明白多了吧。  

好了，然后你再重新去看一下 build.gradle 里的代码，是不是对每一行的代码都有了新的看法了。  

其实 build.gradle 里的每一行代码都是在调用一个方法，比如下面这些我们常见的：  
![build.gradle](http://upload-images.jianshu.io/upload_images/1924341-f0d802f0be4c01ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
每一行都是在调用一个方法，前面是方法名，后面是方法的参数，只是把括号省略掉了而已，感兴趣的你可以再自己用as点进去看看源码是不是这样。  

**方法最后一个参数是闭包可以提取出来接到后面**  

闭包是 groovy 的一大特性，我理解也不深，也讲不大清楚，感兴趣的可自行网上查阅学习，简单的说就是一个用 `{..}` 包起来的代码块，比如 build.gradle 里的 `defaultConfig{...}`, `buildTypes{...}`, `dependencies{...}` 等等这些大括号包起来的代码块就是闭包，闭包代码块最后一句代码作为闭包的返回值。  

当闭包作为方法的最后一个参数，可以将闭包从参数圆括号中提取出来接在最后，如果闭包是唯一的一个参数，则方法参数所在的圆括号也可以省略。对于有多个闭包参数的，只要是在参数声明最后的，均可以按上述方式省略，举个例子。  
```  
//定义 add 方法
def add(a, Closure c) {
println a + c.call()
}
//调用方法
add(1, {1+1}) //输出 3
```  
上面定义一个 add 方法，最后一个参数为闭包，调用的时候传入一个闭包，闭包的最后一行代码 `1+1` 作为闭包返回值返回，闭包返回值作为方法的第二个参数传入方法中计算加法，所以最终输出3。上面的调用也可以写成下面的方式：  
```  
add(1){
    1+2
} //输出 4
```  
注意，这是调用 add() 方法，而不是在定义，1 是第一个参数，括号后的闭包 `{ 1+2 }` 是方法的第二个参数，这就是 groovy 的特性，闭包可以提取出来。那么再想想，如果方法只有一个闭包参数，再结合 groovy 可以省略掉括号的特性，这样子调用一个方法将会是什么样子呢？  
```  
//定义 method 方法
def method(Closure c) {
    println c.call()
}
//调用方法
method {
    I'm dasu
} //输出 I'm dasu
```  
是不是又感觉很熟悉，对吧，就是 build.gradle 里的 `defaultConfig{...}`, `buildTypes{...}`, `dependencies{...}` 等等这些。  

所以，结合上面讲的两点：可以省略方法括号和闭包可以提取接到括号后面，这样一来， build.gradle 里的代码其实就是在调用各种方法，`defaultConfig` 是一个方法，`compileSdkVersion` 也是一个方法。 build.gradle 里的每一行代码前面是方法名，后面则是方法需要的参数，参数有的是基本类型，有的则是闭包类型。  

**集合遍历 each/all**  
就先把上一篇博客里的在一段在 build.gradle 里很常见的代码贴出来  

![重名名apk代码](http://upload-images.jianshu.io/upload_images/1924341-bd80909468a07515.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这段代码作用就是对打包生成的 apk 按照规定的格式进行重命名，在很多大神的 build.gradle 里都会遇见过，其实这一段代码就是 groovy 代码，`all` 和 `each` 是集合的一种操作，`all` 后面跟着的是一个参数为 `variant` 的闭包，表示对 `applicationVariants` 集合里所有的对象都运行后面的闭包，同理 `each` 后面也是跟着一个参数为 `output` 的闭包，类似于 java 里的 for 循环操作。所以这里要理解的应该是 `applicationVariants` 代表的是什么，这点我也还不是很懂，后面如果搞懂了的话会在之后的博客里介绍出来。  

另外，我还有个疑问来着， `all` 操作和 `each` 操作有什么区别么，感觉都是对集合里所有的元素进行操作，如果有懂的能够告知就太感谢了，查了挺多资料貌似还不是很明白。  


# 参考资料 
[官方文档](http://www.groovy-lang.org/documentation.html)  
[Groovy语言规范-语法（官方文档翻译）](http://ifeve.com/groovy-syntax/)  
[Groovy操纵集合秘籍](https://my.oschina.net/wstone/blog/389449)