这次想来讲讲系统应用集成过程中遇到的一些坑，尤其是 so 文件相关的坑。

# 背景  

埋这些坑的最初来源是由于测试人员在集成新终端设备时提了个 bug： app 在这个设备上无法启动。

随后抛来了一份日志，过滤了下，最重要的其实就一条，crash 日志：

```
java.lang.UnsatisfiedLinkError: No implementation found for long com.facebook.imagepipeline.memory.NativeMemoryChunk.nativeAllocate(int) (tried Java_com_facebook_imagepipeline_memory_NativeMemoryChunk_nativeAllocate and Java_com_facebook_imagepipeline_memory_NativeMemoryChunk_nativeAllocate__I)
```

app 使用了 fresco 图片库，最初猜想是不是因为 so 文件没有 push，因为我们的 app 是系统应用，集成的时候是直接 push 到 system/app 下的，因为没有 install 过程，所以 so 文件得自己 push 到 system/lib 下。

但把机子拿过来一看，so 文件有在啊，尝试将其删掉，再运行，又报出了如下异常：

```
java.lang.UnsatisfiedLinkError: dalvik.system.PathClassLoader[DexPathList[[zip file "/system/app/xxxx.apk"],nativeLibraryDirectories=[/system/lib64/xxxx, /vendor/lib64, /system/lib64]]] couldn't find "libimagepipeline.so"
```

看了下日志，



遇到这种开源库的异常问题，最简单的方式就是去开源库的 issue 里找一找：

![issus.png](https://upload-images.jianshu.io/upload_images/1924341-f21bb63a011b95af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

要相信，你绝对不是第一个遇到这个问题的人。是吧，这么多人都来这里提问了，开源库的负责人肯定给出解决方案了，所以接下去继续在这些 issues 里过滤一下，找出那些跟你一样的问题就可以了。如下面这篇：

[java.lang.UnsatisfiedLinkError #1552](https://github.com/facebook/fresco/issues/1552)  

![issue.png](https://upload-images.jianshu.io/upload_images/1924341-6806a04f9a6795e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

官方人员已经说了，可以尝试使用 Relinker 或 SoLoader 来解决。



```
java.lang.UnsatisfiedLinkError: dlopen failed: "libimagepipeline.so" is 32-bit instead of 64-bit
```



最后，这个 bug 怎么解决的呢？可以继续往下看，过完知识点后，在埋坑一节里有说明。



# 知识点  

看完本篇，你能了解到哪些知识点呢，如下：

**P1：了解系统应用集成方式，大概清楚 apk 的 install 过程都做了些什么。**

**P2：知道如何判断系统应用是否安装成功，懂得查看 data/system/packages.xml 文件来得知应用的基础信息，如 so 库地址，primaryCpuAbi 等。**

**P3：掌握 System.load() 和 System.loadlibrary() 的区别。**

**P4：清楚系统寻找 so 文件的大体流程。**

**P5：了解 ReLinker 和 SoLoder 库的用途和大体原理。**

# 正文 

ps: 由于接触尚浅，还看不懂源码，正文部分大多数是直接从各大神博客中梳理出的结论，再用以自己的理解表达出来，因为并没有结合源码来分析，因此给出的结论观点不保证百分百正确，如有错误，欢迎指点一下。  

### 1. install 过程  

要了解 apk 的 install 过程都干了哪些事，先要清楚一个 apk 文件中都有哪些东西，其实 apk 文件就是一个压缩包，后缀改为 zip 就可以直接打开查看内容了，或者 Android Studio 的 Analyze APK 功能也可以查看：  

![apk结构.png](https://upload-images.jianshu.io/upload_images/1924341-ece742cb57173ce0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

classes.dex 是源代码，到时候要加载进内存运行在机器上的；lib 是存放 so 文件；res 是存放资源文件，包括布局文件、图片资源等等；assert 同样存放一些资源文件；AndroidManifest.xml 是清单配置文件；

既然 apk 其实就是个压缩包，将程序运行所需要的东西，比如源代码，比如资源文件等等都打包在一起。那么，install 的过程，其实也就是解压&拷贝&解析的过程。

解压完后自然是拷贝，拷贝的目的就是将这个 apk 包内的东西拷到系统指定的路径，这样便于系统集中管理。涉及的路径有：  

- data/app
- data/data/{包名}
- data/dalvik-cache
- data/system/packages.xml

以上是三方 app 正常安装过程中需要涉及到的一些系统目录，一个个来讲：

data/app：不同系统版本，这个目录下的内容结构可能不一样，但它都是用来拷贝一份 apk 文件到这个目录里的。

data/data/{包名}：这个就很熟悉了吧，用于存放应用运行期间所需的数据，包括 xml，sqlite 等等。这里的数据是不是就是位于内存中的呢？另外，so 文件也会拷贝一份到这里，但并不清楚，有什么作用？因为删掉

data/dalvik-cache：

data/system/packages.xml：这是一份类似于注册表的文件，app 只要安装成功，那么就会在这份文件中写入这个 app 的基本信息，这些信息也就是从 apk 包中解析了 AndroidManifest.xml 文件读取的。

**小结一下**

一个三方 apk 的安装过程，不管是通过设备的有安装界面交互方式下的安装，还是没有交互界面直接通过 adb install 命令安装，还是通过 Android Studio 的 run (本质上是执行 adb install 命令) 安装。

系统在这个安装过程做的事其实也就是先将这个 apk 拷贝一份到 data/app 目录下，然后对其进行解压工作，将 apk 包中的 so 文件解压出来，将 dex 文件解压之后对其进行优化处理缓存到 data/dalvik-cache 目录，以便加快之后应用的运行，最后解析 AndroidManifext.xml 文件，将这个应用的基本信息写入 data/system/packages.xml  文件中，然后创建 data/data/{包名} 目录供应用运行期间存放数据。

那么，有想过，这些目录哪些能删，哪些不能删么？尝试一下：





adb install 命令内部其实干了两件事：1. 将 apk 从电脑 push 进目标设备；2. 在终端设备执行 pm install 命令安装。



### 2. 系统应用集成 

有一点需要注意一下，系统应用的安装方式与三方应用不一样，系统应用无法通过 install 命令来安装，常见的方式是直接将 apk 手动 push 到 system/app 目录下。

系统在重启的时候，会去扫描这个目录下的 apk 文件，如果发现这个 apk 没有安装，那么会去触发它的安装工作。但不同于三方 apk，这里



### 3. packages.xml

这份配置文件在 data/system/ 目录下，不要小看这份文件，一般排查系统应用为什么启动不了，借助这份配置文件可以得到蛮多信息的。

因为我们做的一些应用是没有界面的，就纯粹在后台干活。如果是三方，也许还可以通过手动去启动这个应用来查看相关日志，但偏偏还有些应用是设备开机时就自启的，所以最怕遇到的问题就是测试人员跟你说，这个应用在某个终端上起不来。

因为这时，不清楚这个应用到底是不是因为代码问题导致一直崩溃，起不来；还是因为根本就没安装成功；所以，遇到这类问题，第一点就是要先确认这一点，而确认这一点，就可以借助 packages.xml 这份配置文件了。

如果能够在这份 packages.xml 配置文件中找到应用的信息，那么说明安装成功了，接下去就往另一个方向排查问题了。

还有一种场景借助这份配置文件分析也是很有帮助的。

我们还遇到这种情况：

首先 system/app 下是系统应用，data/app 下是三方应用，但系统是允许 system/app 和 data/app 下存在相同包名的应用的

### 4. System.load 和 System.loadlibrary 

System.mapLibraryName() 

将 xxx 转换成 libxxx.so，就是拼接上前缀和后缀

### 5. so 文件加载流程



### 6. 三方库 ReLinker 和 Soloder



# 埋坑

好了，理论基础都已经有了，那么接下去就是来埋坑了。



针对开头所遇到的 bug，其实原因归根结底就是









那么，解决方案其实有两种，一是，二是代码层面做适配，动态去加载所缺失的或不能用的 so 文件。



### 方案一：修改集成方式



### 方案二：代码适配





# 参考  

[1.Android中app进程ABI确定过程](https://blog.csdn.net/weixin_40107510/article/details/78138874)  

[2.Android 64 bit SO加载机制](https://blog.csdn.net/canney_chen/article/details/50633982)

[3.APK文件结构和安装过程](https://blog.csdn.net/bupt073114/article/details/42298337)

[4.Android程序包管理(2)--使用adb install执行安装过程](https://blog.csdn.net/leif_/article/details/79494795)

[5.System.loadLibrary分析](https://blog.csdn.net/rockstore/article/details/79490465)

[6.Java中System.loadLibrary() 的执行过程](https://my.oschina.net/wolfcs/blog/129696)

感谢以上大神们的分享，博客是写的真的好，膜拜ing