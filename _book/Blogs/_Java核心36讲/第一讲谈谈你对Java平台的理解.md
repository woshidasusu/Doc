# 声明  

本篇所涉及的提问，正文的知识点，全都来自于**杨晓峰的《Java核心技术36讲》**，当然，我并不会全文照搬过来，毕竟这是付费的课程，应该会涉及到侵权之类的问题。

所以，本篇正文中的知识点，是我从课程中将知识点消耗后，用个人的理解、观念所表达出来的文字，参考了原文，但由于是个人理解，因此不保证观点完全正确，也不代表错误的观点是课程所表达的。如果这样仍旧还是侵权了，请告知，会将发表的文章删掉。

当然，如果你对此课程有兴趣，建议你自己也购买一下，新用户立减 30，微信扫码订阅时还可以返现 6 元，相当于 32 元购买 36 讲的文章，每篇文章还不到 1 元，蛮划算的了。

![QQ图片20180703142535.png](https://upload-images.jianshu.io/upload_images/1924341-6ca755c2bd0a6122.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

# 提问

- 谈谈你对 Java 最直观的印象是什么？是它宣传的 “Write once, run anywhere"？
- 谈谈你对 Java 平台的理解？ 
- Java 是解释执行，这句话正确吗？

# 正文

谈谈你对 Java 平台的理解？

一看到这个问题时很懵，对 Java 平台的理解？这是啥问题，面这么广，该说些啥。

一瞬间闪过脑袋的，无外乎：面向对象的高级编程语言？跨平台？三大特性？然后就没了~

然后看了本讲的内容，浏览了评论区各大神的回答，才发现，自己的基础确实很薄弱。这个问题并没有固定的答案，但关键在于考核你对 Java 掌握的系统性？你自己有没有生成关于 Java 知识的大体框架？你是否对每个知识点有深入的了解过？

结合课程的内容和评论区大神的回复，我梳理出了大伙对于这个问题回答后的脑图，也算是在这门课程之后，我所学到的以及生成的对于 Java 知识点的一个大体的认识框架吧。  

当然，这张系统性的知识框架肯定不全，在后续课程的学习中，我会渐渐来完善自己的这张知识框架体系。

![Java平台的认识.png](https://upload-images.jianshu.io/upload_images/1924341-30ac1e463a057717.png)    

### 1. 三大特性  

Java 语言有三大特性：继承、封装、多态

#### 继承

子类继承父类非私有的成员变量和成员方法。

final 声明的类不允许继承。

子类可通过 super 调用父类的有权限的方法。

父类有显示声明构造函数时，子类的构造函数中必须直接或间接的调用 super，另构造函数中使用 super 和 this 关键字必须在首行。

#### 封装

这个特性更倾向于编程思想，将一些细节实现对外隐藏，通过权限控制，让外部仅需要与公开的接口打交道即可。

Java 有四种权限：包权限、私有权限、保护权限、公开权限

![java四大权限.png](https://upload-images.jianshu.io/upload_images/1924341-3b199c0481004968.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### 多态

多态：对象的多种形态

引用多态：父类对象可指向具体子类

方法多态：重写 & 重载

### 2. 语言特性  

Java 语言有很多很多特性：泛型、反射、代理、并发、等等，每个特性我并不是很了解，所以只将目前自己较为熟悉的特性记录下来，其他特性留待后续慢慢完善。

#### 泛型  

- 类

泛型的使用： public class BaseView<T>{}

定义时类型限定：  public class BaseView<T extend Object>{}

使用时类型限定：  private void test(BaseView<? extend Object> o){}

- 方法参数

泛型的使用：public <T> void test(T t){}

类型限定：  public <T extend Object>  void test(T t){}

返回值泛型限定： public <T> T test(){}

####  反射

- 创建构造函数私有化的类对象

```  java
//1. 获取类的无参构造函数
//2. 设置访问权限
//3. 调用 newInstance，创建对象
Constructor<Test> constructor = Test.class.getDeclaredConstructor();
construcotr.setAccessible(true);
Test test = constructor.newInstance();
```

- 调用私有方法

```  java
//1. 先获取类对象
//2. 根据方法名和方法参数获取方法对象
//3. 设置访问权限
//4. 调用 invoke，传入类对象，调用私有方法
Test t = new Test();
Method method = Test.class.getDeclaredMethod("test");
method.setAccessible(true);
method.invoke(t);
```

- 改变私有属性

```  java
//1. 先获取类对象
//2. 根据变量名获取 Field 对象
//3. 设置访问权限
//4. 调用 Field 的 setXXX 方法，传入类对象，修改私有方法
Test t = new Test();
Field field = Test.class.getDeclaredField("m");
field.setAccessible(true);
field.setInt(t, 20);
```

### 3. JDK&JRE  

最开始我只知道，JDK 是 Java 开发者开发所需要的工具，JRE 则是 Java 程序运行所需的运行环境。仅仅只知道这么多了，至于有哪些工具，运行环境又是些什么则不大清楚。

课程里则提到了对于这些最好也要能够深入了解，比如清楚 JDK 中的编译器：javac、sjavac，诊断工具：jmap、jstack、jconsole、jhsdb、jcmd，辅助工具：jlink、jar、jdeps 等等。

对于 JRE 需要清楚 JVM 虚拟机，虚拟机的一些特性：垃圾收集器、运行时、动态编译等等，运行环境的一些基本类库：集合、并发、网络、安全、线程、IO、NIO 等等，对于每个类库都要有所了解。

突然发现，一个简单的知识点，一旦深入的话，是可以挖掘出一大堆知识点的。

目前对于这块，我基本算是没接触，后续慢慢来完善这块的知识点，让自己构建一个系统化、体系化、牢固的知识框架。

### 4. JVM 

Java 跨平台特性的基础其实是依赖于 JVM 虚拟机的，Java 语言本身并没有跨平台的特性，而是借助了 JVM 虚拟机。它就类似于一个中间件，将各个系统平台之间的差异隐藏掉，接收字节码。所以，只要将 Java 源程序编译成字节码，JVM 内部就会对字节码转换成各系统平台的可执行的机器码，做到"编译一次，到处运行"的特性。  

而从 JVM 虚拟机这一点出发，可以挖掘出一系列的知识点：

- 内存管理，包括内存模型、常见的 GC、回收算法、内存泄漏、内存优化等等
- 类加载机制，包括双亲委派等等
- 解释执行与编译执行机制，包括 JIT、AOT 等等

每个点都可以单独开好几篇章来讲，现在也没有系统的掌握，对每个点都是零零散散的印象理解，同样也留待后续慢慢完善。  

最后，针对开头的问题引用原文回答一下：

> 对于“Java是解释执行”这句话，这个说法不太准确。我们开发的 Java的源代码，首先通过 Javac编译成为字节码（bytecode），然后，在运行时，通过 Java虚拟机（JVM）内嵌的解释器将字节码转换成为最终的机器码。但是常见的 JVM，比如我们大多数情况使用的 Oracle JDK提供的 Hospot JVM，都提供了 JIT（Just-In-Time）编译器，也就是通常所说的动态编译器，JIT能够在运行时将热点代码编译成机器码，这种情况下部分热点代码就属于编译执行，而不是解释执行了。 