# 声明

本篇所涉及的提问，正文的知识点，全都来自于**杨晓峰的《Java核心技术36讲》**，当然，我并不会全文照搬过来，毕竟这是付费的课程，应该会涉及到侵权之类的问题。

所以，本篇正文中的知识点，是我从课程中将知识点消耗后，用个人的理解、观念所表达出来的文字，参考了原文，但由于是个人理解，因此不保证观点完全正确，也不代表错误的观点是课程所表达的。如果这样仍旧还是侵权了，请告知，会将发表的文章删掉。

当然，如果你对此课程有兴趣，建议你自己也购买一下，新用户立减 30，微信扫码订阅时还可以返现 6 元，相当于 32 元购买 36 讲的文章，每篇文章还不到 1 元，蛮划算的了。

![QQ图片20180703142535.png](https://upload-images.jianshu.io/upload_images/1924341-6ca755c2bd0a6122.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

# 提问

- Exception 和 Error 有什么区别？
- 运行时异常和一般异常有什么区别？
- 你了解哪些常见的 Error，Exception，RuntimeException？
- NoClassDefFoundError 和 ClassNotFoundException 有什么区别？
- 异常处理的代码有哪些比较良好的规范？

# 正文

对于这个问题，感觉我讲不了很多，顶多都是一些概念性回答而已。

#### Exception

Exception 是程序正常运行时，可以预料到的意外情况，可以被捕获，也应该进行相应异常处理。

Exception 继承自 Throwable，具体又可划分为 RuntimeException 运行时异常和一般异常。两者的区别在于运行时异常在编译阶段可以不用进行捕获，这类异常通常都是在 Lint 检查过程中，或者程序运行期间才暴露出来的异常，因此也可以被归类为非检查型异常。  

一般异常则是在编译期间就必须进行异常捕获，因此也被归类为检查型异常。

#### Error 

Error 也是继承自 Throwable，同样会造成程序崩溃退出，但跟异常不大一样的是，这类错误问题，通常是由于 JVM 运行状态出了问题导致，我们不应捕获处理。要做的，应该是分析该错误出现的原因，尽量避免这类问题的出现。

关于 Exception 和 Error 的区别，可以简单这么理解，我们可以从异常中恢复程序但却不应该尝试从错误中恢复程序。

以上，基本就是我对于该讲问题所能想到的最大限度的点了。看了该讲作者所扩展的点，以及评论区里大神的回复，其实还可以从常见的一些异常，即原因和处理方式扩展；也可以从异常处理代码的规范角度出发扩展讲一讲，我都统一将这些扩展都在开头的提问中列出来了。

#### 常见的 Exception 或 Error

想查阅相关的 Exception 或 Error，如果你记得该异常的名称，那可以直接通过 Android Stduio 查阅相关源码即可。

如果想翻看所有的类别，那么也可通过 AS 的 **Hierarchy**  功能查阅，快捷键 `Ctrl + H`，如下：  

![asHierarchy.png](https://upload-images.jianshu.io/upload_images/1924341-f41de8ab6f297084.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

在这里翻看、过滤你熟悉的，或者想找的异常或错误，点进去查看相关源码说明即可。

至于常见的 Exception，RuntiomeException，Error，我针对个人在项目中较常遇见，目前印象较深的画了张类图：  

![常见异常和错误.png](https://upload-images.jianshu.io/upload_images/1924341-f6dd9d24b4016056.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)    

- ActivityNotFoundException

源码注释里说了，该异常是当调用了 `startActivity()` 之后，找不到匹配的 Activity 时抛出该异常。也就是说，通常通过隐式 Intent 打开 Activity，或者通过广播，URI 等方式，不注意一点的话，可能会出现该异常。

如果有使用到这些场景，可以考虑是否增加异常捕获，防止使用不当造成异常。

- BadTokenException

这里的异常指的是 WindowManager 内部类 BadTokenException，显然，当添加一个新的 window 时，如果 LayoutParams 不合法，就会抛出该异常。

添加 window 的场景，除了手动通过 WindowManager 的 `addView()` 的场景外，其实打开一个新的 Activity，新的 Dialog，内部也是通过 WindowManager 来 `addView()` 的，因此，这些场景下都是有可能发生该异常的。

不过，这个异常的日志会比较详细，因为在 ViewRootImpl 的 `setView()` 中，会去细分参数不合法的类别，附上部分源码：  

```  
//ViewRootImpl#setView()
 
public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView) {
	switch (res) {
            case WindowManagerGlobal.ADD_BAD_APP_TOKEN:
            case WindowManagerGlobal.ADD_BAD_SUBWINDOW_TOKEN:
                throw new WindowManager.BadTokenException(
                        "Unable to add window -- token " + attrs.token
                                + " is not valid; is your activity running?");
            case WindowManagerGlobal.ADD_NOT_APP_TOKEN:
                throw new WindowManager.BadTokenException(
                        "Unable to add window -- token " + attrs.token
                                + " is not for an application");
            case WindowManagerGlobal.ADD_APP_EXITING:
                throw new WindowManager.BadTokenException(
                        "Unable to add window -- app for token " + attrs.token
                                + " is exiting");
            case WindowManagerGlobal.ADD_DUPLICATE_ADD:
                throw new WindowManager.BadTokenException(
                        "Unable to add window -- window " + mWindow
                                + " has already been added");
            case WindowManagerGlobal.ADD_STARTING_NOT_NEEDED:
                // Silently ignore -- we would have just removed it
                // right away, anyway.
                return;
            case WindowManagerGlobal.ADD_MULTIPLE_SINGLETON:
                throw new WindowManager.BadTokenException("Unable to add window "
                        + mWindow + " -- another window of type "
                        + mWindowAttributes.type + " already exists");
            case WindowManagerGlobal.ADD_PERMISSION_DENIED:
                throw new WindowManager.BadTokenException("Unable to add window "
                        + mWindow + " -- permission denied for window type "
                        + mWindowAttributes.type);
}
```

- ClassCastException

父类可以通过强制类型转换成具体某个子类，但如果强转的两个类之间不存在继承关系，那么就会抛出该异常。

如果不确定需要强转的两个类的关系，可以先通过关键字 instanceof 进行判断。

- ConcurrentModificationException

这异常则是由于一些不恰当的集合操作导致，比如遍历集合的过程中，进行了不恰当的删除操作；或者有某个线程正在遍历集合，另外一个线程则对该集合进行的修改操作；

相对应的避免方法网上也很多，比如遍历集合删除的操作通过迭代器来实现等等。

- IndexOutOfBoundsException

数组越界异常，这类异常还蛮经常出现的，避免方式就只能是尽量书写规范的代码，注意一些，或者多让程序跑跑 Lint 检查。

- NullPointerException

空指针异常，这异常算是最令人头疼的异常了，在线上异常的比例中，肯定不少。

而且出现情况有时还很难分析，代码流程上查看，明明不会出现空指针场景，但现实就是有用户的的确确出现了。

解决时，如果可以，尽量不要简单的加个非空判断，在程序中各个地方加非空判断，其实是种特别不优雅的行为。如果能明确为什么会出现为空的场景，如何解决，这是最好的，而不是每次都简单的加个非空判断。

场景很多很多，之前也有写过一篇专门处理实体类的空判断文章，感兴趣的可以看看：  

[分享两个提高效率的AndroidStudio小技巧](https://www.jianshu.com/p/68fd5373effc)

- IOException

IO 异常，属于检查型异常，必须通过 try catch 代码块捕获才能通过编译阶段，这也就没什么好介绍的了。

- OutOfMemoryError

内存溢出错误，这类问题属于 Error，不属于 Exception，所以不要期待解决这类问题仅仅通过捕获就可以处理。

针对 Error 这类问题，我们没法捕获处理，只能是从避免的角度出发，分析出现的原因，尽量不用出现这类问题。

造成内存溢出的问题，有多种，大概就是图片问题、内存泄漏问题。

针对图片使用的优化处理，网上很多，各种压缩、降分辨率等等方式。

针对内存泄漏，一是开发期间遵守规范的代码行为，尽量避免写出有内存泄漏的隐患；二是发生内存泄漏后，借助相应工具进行定位分析。

- StackOverflowError

这类错误很严重，表示程序陷入了死循环当中，原因也就是你写了有问题的代码。

因此，当出现这类问题，最好尽快定位处理。

- NoClassDefFoundError

这类问题，通常出现的场景是：编译阶段没问题，但程序运行期间却出现该问题。

原因一般是由于打包时，jar 出现问题，部分类没有打包进去，导致的问题。

- ClassNotFoundException

这个异常，同样属于相关类找不到的问题，但出现的场景通常是由于程序中使用了反射，或者动态加载之类的方式，使用了错误的类名，导致的问题。

还有可能是由于混淆导致。

#### 异常处理良好规范

- 尽量不要捕获类似 Exception 这样通用的异常，而是应该捕获特定异常

> 这是因为在日常的开发和合作中，我们读代码的机会往往超过写代码，软件工程是门协作艺术，所以我们有义务让自己的代码能够直观的体现出尽量多的信息，而泛泛的 Exception 之类，恰恰隐藏了我们的目的。另外，我们也要保证程序不会捕获到我们不希望捕获的异常。比如，你可能更希望 RuntimeException 被扩散出来，而不是被捕获。
>
> 进一步讲，除非深思熟虑了，否则不要捕获 Throwable 或者 Error，这样很难保证我们能够正确处理异常。

- 不要生吞异常

> 如果我们不把异常抛出来，或者也没有输出到日志之类，程序可能在后续代码以不可控的方式结束。没人能够轻易判断究竟是哪里抛出了异常，以及是什么原因产生了异常。

- try-catch 代码段会产生额外的性能开销

> try-catch 代码段往往会影响 JVM 对代码进行优化，所以建议仅捕获有必要的代码段，尽量不要一个大的 try 包住整段的代码；与此同时，利用异常控制代码流程，也不是一个好主意，远比我们通常意义上的条件语句 （if / else, switch）要低效
>
> Java 每实例化一个 Exception，都会对当时的栈进行快照，这是一个相对比较重的操作，如果发生的非常频繁，这个开销可就不能被忽略了。

- 不要在 finally 代码块中处理返回值

> 按照我们程序员的惯性认知：当遇到 return 语句的时候，执行函数会立刻返回。但是，在 Java 语言中，如果存在 finally 就会有例外。除了 return 语句， try 代码块中的 break 或 continue 语句也可能使控制权进入 finally 代码块。
>
> 请勿在 try 代码块中调用 return, break, continue 语句。万一无法避免，一定要确保 finally 的存在不会改变函数的返回值。
>
> 函数的返回值有两种类型：值类型和对象引用，对于对象引用，要特别小心，如果在 finally 代码块中对函数返回的对象成员属性进行了修改，即使不在 finally 块中显示调用 return 语句，这个修改也会作用于返回值上。

- 当一个 try 后跟了很多个 catch 时，必须先捕获小的异常再捕获大的异常。