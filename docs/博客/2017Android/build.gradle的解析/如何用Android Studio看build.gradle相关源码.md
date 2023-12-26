上一篇博客里讲过 build.gradle 里的每一行代码基本都是在调用一个方法，既然是这样，我们就可以用 android studio(下面简称as) 去查看它源码的方法注释说明，这样就可以理解每个方法是做什么的了，就算是在大神的 build.gradle 遇见一些没看懂的代码，也可以点进去看方法介绍来理解。就像我们在查看 SDK 里的各种方法一样。    

但是有个问题，应该也有小伙伴跟我一样吧，每次在大神的 build.gradle 看到一堆不懂的代码时，按住 `Ctrl` 键后，鼠标移到代码上时有个跳转的手势时总是很开心，总是心想原来可以看源码啊，那就点进去看看介绍，看这个是干嘛的吧。可是每次一点进去，打开的却是 class 代码文件，顶多就只有方法名，一点注释都没有，而且方法参数命名还混淆过，也猜不出来是干嘛的。又不懂怎么去官方文档里查找，只能去网上用关键字查找，找出来的又跟自己碰到的问题不一样，越找越气干脆不找了，放一边去，以后再说。  

是吧，如果可以直接通过 as 看源码的注释该多好。好了，废话到这，下面开始正文。    

***  

# 系列索引  
build.gradle系列一：[看不懂的build.gradle代码](http://www.jianshu.com/p/a3805905a5c7)  
build.gradle系列二：[学点Groovy来理解build.gradle代码](http://www.jianshu.com/p/501726c979b1)  
build.gradle系列三：[如何用Adnroid Studio查看build.gradle源码]()  
...  

***  

# 正文  
我们来举个例子，就像系列一的博客里介绍的 build.gradle 里有这样一段代码：  
![build.gradle](http://upload-images.jianshu.io/upload_images/1924341-d46a0d67f548a7aa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
咦！这代码是第一次在 build.gradle 里看见过，是什么意思呢？不怕，我有绝招：  
![Ctrl + 左键](http://upload-images.jianshu.io/upload_images/1924341-5d5db8368916117f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
Android Studio大法---看源码，还有什么是不能通过看源码注释解决的么  
![BaseExtension.class](http://upload-images.jianshu.io/upload_images/1924341-4b6cd41069f7fa21.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
是跳到源码了，可是为什么没有方法的注释说明呢，这方法是什么鬼谁知道啊。再仔细看看 as 的提示，原来打开的是个 class 文件啊。  
![as提示](http://upload-images.jianshu.io/upload_images/1924341-c55417ff2530580f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
as 的提示那里应该会有个下载和选择源码位置的按钮的啊，搞不懂为什么不出现。  

另外，我们知道，as 一般会默认先打开 xxx-sources.jar 也就是 xxx 的 java 文件源码，如果没有源码文件，才会打开 xxx.jar 的 class 代码。我们看一下，打开的是什么文件。  
![gradle-2.3.0.jar](http://upload-images.jianshu.io/upload_images/1924341-9692f8b22bf2eda3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
没错，as 打开的是 gradle-2.3.0.jar，说明 as 没有找到 gradle-2.3.0-sources.jar 源码文件，我们看一下到底是不是这样  
![as标题栏](http://upload-images.jianshu.io/upload_images/1924341-53c68923912bf799.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
as 标题栏会显示你当前打开的文件的具体位置，好了，知道了 gradle-2.3.0.jar 在电脑里的位置了，我们到那个目录下看看  
![gradle-2.3.0.jar本地路径](http://upload-images.jianshu.io/upload_images/1924341-f9da8ad2908b540e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
只有一个 gradle-2.3.0.jar 文件和一个 pom 文件，正常的话应该还要有个 xxx-sources.jar 文件才对，就像下面这样  
![三个文件](http://upload-images.jianshu.io/upload_images/1924341-f7700195cd081102.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
因为这里没有 gradle-2.3.0-sources.jar 文件，所以 as 没办法打开带有方法注释的源码文件了。既然知道问题，那么就好解决了，as 的提示条也没有下载的按钮，那我们就自己去下载好了  
![seach.maven.org](http://upload-images.jianshu.io/upload_images/1924341-ac54a39b3846d1d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
打开 maven 网站，在这里可以下载 gradle 插件。在搜索框中输入 `com.android.tools.build`，为什么输入这个，你打开 project 下的 build.gradle 文件看看就知道了    
![com.android.tools.build](http://upload-images.jianshu.io/upload_images/1924341-4796f2199f748565.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
![search result](http://upload-images.jianshu.io/upload_images/1924341-374001fbc95ace5c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这些就是 gradle 插件，我们在根目录下的 build.gradle 配置的 gradle 版本其实就是来这里下载的，应该是吧。  
![下载的文件](http://upload-images.jianshu.io/upload_images/1924341-b9b6f2c35d82ede4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
下载后得到的就是这些文件了，接下去就是找到相应文件的位置，复制一份过去  
![gradle的本地路径](http://upload-images.jianshu.io/upload_images/1924341-139f310de6d6dfc5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
打开相应的插件文件夹，选择相应的版本，最后将下载的 xxx-sources.jar 复制一份进去，最后的样子如下  
![三个文件](http://upload-images.jianshu.io/upload_images/1924341-9dbac486701a27fa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
好了，大功告成，我们再打开 as，记得 ReBuild 一下，然后再试试查看 build.gradle 源码会是什么样子  
![BaseExtension.java](http://upload-images.jianshu.io/upload_images/1924341-327042d04c7edab6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
![LintOptions.java](http://upload-images.jianshu.io/upload_images/1924341-5723f731293b39a7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
翻译一下英文大概就是说， lintOptions.abortOnError = false 是设置即使 lint 检查时发现错误也不停止构建程序的运行。  

这种方法比去官方的 api 文档里查阅方便多了吧。再来看看几个效果。  
![BaseExtension.java](http://upload-images.jianshu.io/upload_images/1924341-19e3e3f8353694db.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
这里就可以看到源码里介绍 Plugin 的值都有哪些，分别对应哪个类，该去哪个类看它的作用是什么，干什么的。  
![AndroidConfig.java](http://upload-images.jianshu.io/upload_images/1924341-3024eb6a6819fd42.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
借助 as，我们甚至可以很容易的查到 `android{...}` 这个括号里能使用的方法都有哪些，如果要看各自的作用是干什么的，再继续点进去查看注释就行了。是不是发现，我们在 build.gradle 里的 `android{...}` 使用过的标签名原来都在这里的啊。  

以后就算是再碰到大神的 build.gradle 文件里各种没看见过的标签名，不用再担心看不懂了。不懂就看源码注释嘛，so easy!  

当然，大神的 build.gradle 文件里还是会出现一些 groovy 代码或者是 task 之类的，这些就不是 gradle 源码里能够查到的了，需要稍微了解一下 groovy 和 gradle 语言的基础，有兴趣的可以继续阅读下我写的这个系列里的相关博客，当然能力不够，如果你希望更好的学习，网上资料也很多。  


