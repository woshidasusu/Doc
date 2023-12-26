这次想来讲讲系统应用集成过程中遇到的一些坑，尤其是 so 文件相关的坑。

# 背景  

埋这些坑的最初来源是由于测试人员在集成新终端设备时提了个 bug： app 在这个设备上无法启动。

随后抛来了一份日志，过滤了下，最重要的其实就一条，crash 日志：

```
java.lang.UnsatisfiedLinkError: No implementation found for long com.facebook.imagepipeline.memory.NativeMemoryChunk.nativeAllocate(int) (tried Java_com_facebook_imagepipeline_memory_NativeMemoryChunk_nativeAllocate and Java_com_facebook_imagepipeline_memory_NativeMemoryChunk_nativeAllocate__I)
```

app 使用了 fresco 图片库，最初猜想是不是因为 so 文件没有 push，因为我们的 app 是系统应用，集成的时候是直接将 apk push 到 system/app 下的，因为没有 install 过程，所以 so 文件得自己 push 到 system/lib 下。

但把机子拿过来一看，so 文件有在啊，尝试将其删掉，再运行，又报出了如下异常：

```
java.lang.UnsatisfiedLinkError: dalvik.system.PathClassLoader[DexPathList[[zip file "/system/app/xxxx.apk"],nativeLibraryDirectories=[/system/lib64/xxxx, /vendor/lib64, /system/lib64]]] couldn't find "libimagepipeline.so"
```

看了下日志，它是说，在 system/lib64 目录下没有找到 so 文件，奇怪，以前都是只集成到 system/lib 下就可以了啊，怎么这次多出了个 system/lib64，难道这个机子支持的 CPUABI 不一样？试着运行了下 `getprop | get cpu `：

![cpu.png](https://upload-images.jianshu.io/upload_images/1924341-cdf96c6094281c16.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

果然，这个机子支持的 CPUABI 多了个 arm64-v8a。

那这个机子既支持 arm64-v8a，又支持 armeabi-v7a，我怎么知道，我的 app 该将 so 文件集成在哪里，什么场景该放 system/lib 下，什么时候该集成到 system/lib64 中？还是说，两个地方都放？

应该不至于两个目录都得集成，因为三方应用安装时，从 apk 包中也只会解压一份 so 文件而已，并不会将 lib 下所有 abi 架构的 so 文件都解压。

后来，试着查找相关资料，发现可以在 data/system/packages.xml 文件中找到自己 app 的相关配置信息，这里有明确指出该去哪里加载 so 文件，以及 app 所运行的 CPU 架构，所以我们可以运行如下命令：

```
cat /data/system/packages.xml | grep {你自己app的包名}
```

![packages.png](https://upload-images.jianshu.io/upload_images/1924341-f12da6d74dad2fa3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

后来有些疑惑，这里的 primaryCpuAbi 属性值，系统是如何确定的，因为遇到过，明明这次的值是 armeabi-v7a，但当重启之后，有时候居然变成 arm64-v8a 了，所以就又去查找了相关资料，发现，这个值确定的流程蛮复杂的，影响因素也很多。

那么，就没有办法根据某些条件确定某个场景来确定 so 文件是该放 system/lib，还是 system/lib64 了，只能两个都集成了。于是乎，尝试着直接将 system/lib 下的 so 文件拷贝了一份到 system/lib64，结果发现运行报了如下异常：

```
java.lang.UnsatisfiedLinkError: dlopen failed: "libimagepipeline.so" is 32-bit instead of 64-bit
```

哎，想当然了，不同 CPU 架构的 so 文件肯定不一样，哪里可以直接将 armeabi-v7a 的 so 文件放到 system/lib64 里。因此，重新编译、打包了一份 arm64-v8a 架构的 so 文件，集成到 system/lib64 下，再运行，搞定。

但你以为事情到这里就结束了吗？年轻人，too yang.

由于以前 app 合作的机子，都只有 armabi-v7a 的，所以集成方式就一种，只需要集成到 system/lib 下就可以了，但由于新合作的机子有 arm64-v8a 的了，那么此时就需要修改以前的集成方式，分别将对应的 so 文件集成到对应的 system/lib 和 system/lib64 目录下。

但运维人员表示说，他不懂这些，他怎么判断说，什么时候该用旧的集成方式，什么时候用新的集成方式。我跟他说，你需要先执行 `getprop | grep cpu` 命令，查看当前机子支持的 CPUABI，然后再来决定你如何集成。但运维又说，这好复杂，能否有方法就统一一种集成方式，不必分场景考虑。

emmm，你们都是老大，你们说了算。只能又去瞎搞了，这次去开源库的 issue 里尝试寻找了下，结果发现，哈哈哈，原来这么多人碰到过这个问题： 

![issus.png](https://upload-images.jianshu.io/upload_images/1924341-f21bb63a011b95af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

要相信，你绝对不是第一个遇到问题的人。是吧，这么多人都来这里提问了，开源库的负责人肯定给出解决方案了，所以接下去继续在这些 issues 里过滤一下，找出那些跟你一样的问题就可以了。如下面这篇：

[java.lang.UnsatisfiedLinkError #1552](https://github.com/facebook/fresco/issues/1552)  

![issue.png](https://upload-images.jianshu.io/upload_images/1924341-6806a04f9a6795e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

官方人员已经说了，可以尝试使用 Relinker 或 SoLoader 来解决。

最后，我选择了 ReLinker，发现它的源码并不多，直接将所有源码拷贝到项目中，修改了源码中某个流程的逻辑，用于解决我自己这种场景下的 so 文件加载问题，搞定，具体在下面的埋坑一节讲述。

这整个过程中，遇到了一个又一个问题，一个又一个坑，解决这个异常，出现另一个异常，但整个过程梳理过来，也掌握了很多干货知识点，下面就用自己的理解，将这些相关的知识点梳理一下：

# 知识点  

看完本篇，你能了解到哪些知识点呢，如下：

**P1：了解系统应用集成方式，大概清楚 apk 的 install 过程都做了些什么。**

**P2：知道如何判断系统应用是否安装成功，懂得查看 data/system/packages.xml 文件来得知应用的基础信息，如 so 库地址，primaryCpuAbi 等。**

**P3：掌握 System.load() 和 System.loadlibrary() 的区别。**

**P4：清楚系统寻找 so 文件的大体流程，知道系统什么时候会去 system/lib 下加载 so 文件，什么时候去 system/lib64。**

**P5：了解 ReLinker 和 SoLoder 库的用途和大体原理。**

# 正文 

ps: 由于接触尚浅，还看不懂源码，正文部分大多数是直接从各大神博客中梳理出的结论，再用以自己的理解表达出来，因为并没有结合源码来分析，因此给出的结论观点不保证百分百正确，如有错误，欢迎指点一下。  

ps: 以下知识点梳理基于的设备系统 Android 5.1.1，api 22，不同系统的设备，也许过程会有些许差别。

### 1. install 过程  

要了解 apk 的 install 过程都干了哪些事，先要清楚一个 apk 文件中都有哪些东西，其实 apk 文件就是一个压缩包，后缀改为 zip 就可以直接打开查看内容了，或者 Android Studio 的 Analyze APK 功能也可以查看：  

![apk结构.png](https://upload-images.jianshu.io/upload_images/1924341-ece742cb57173ce0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

classes.dex 是源代码，到时候要加载进内存运行在机器上的；lib 是存放 so 文件；res 是存放资源文件，包括布局文件、图片资源等等；assert 同样存放一些资源文件；AndroidManifest.xml 是清单配置文件；

既然 apk 其实就是个压缩包，将程序运行所需要的东西，比如源代码，比如资源文件等等都打包在一起。那么，install 的过程，其实也就是解压&拷贝&解析的过程。

但不管是哪个过程，首先，这个 apk 文件得先传送到终端设备上，所以，我们开发期间使用的 `adb install` 命令，或者是直接点击 AndroidStudio 的 run 图标指令（本质上也是运行的 `adb install`），这个命令其实就干了两件事：

1. adb push
2. pm install

先将 apk push 到终端设备的临时目录，大多数场景下是：data/local/tmp

![adbinstall.png](https://upload-images.jianshu.io/upload_images/1924341-36511e0bf14d8e53.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

如果你有注意执行完 `adb install` 命令后，会先有一个百分比的进度，这个进度其实并不是安装的进度，而是 `adb push` 的进度，你可以试着直接执行 `adb push` 命令，看一下是否会有一个进度提示。

先将 apk 从电脑上 push 到终端设备，然后调用 `pm install` 命令来安装 apk。

调用了 `pm install` 命令后就会通知系统去安装这个 apk 了，也就是上述说的拷贝、解压、解析这几个过程。

拷贝是因为，存放在 data/local/tmp 下的 apk 文件始终是位于临时目录下，随时可能被删掉，系统会先将这个 apk 拷贝一份到 data/app 目录下。所以，在 data/app 这个目录下，你基本可以看到所有三方 app 的 apk 包，如果三方 app 都没有另外指定安装到 SD 卡的话。

拷贝结束后，就是对这个 apk 文件进行解压操作，获取里面的文件，将相关文件解压到指定目录，如：

- 创建 data/data/{包名} 目录，存放应用运行期间所需的数据
- 扫描 apk 包中 lib 目录的 so 文件结构，解压到应用自身存放 so 库的目录，不同版本系统路径有些不同，我设备的版本是 android 5.1.1，api 22，三方应用的 so 文件存放目录就在 data/app/{包名}-1/lib 下
- class.dex 源代码转换成 odex 格式，缓存到 data/dalvik-cache 目录下，加快应用的代码运行效率
- 解析 AndroidManifext.xml 文件以及其他相关文件，将 app 的相关信息写入 data/system/packages.xml 注册表中    
- 还有其他我不清楚的安装工作

梳理一下，安装 apk 过程中，就是解析 apk 中的内容，然后将不同作用的文件拷贝到指定目录中待用，涉及的目录有：

- data/data/{包名}
- data/dalvik-cache
- data/app/{包名}-1/lib (后缀有可能是 -1,-2)
- data/system/packages.xml

我没有找到存放 res，assert 这些资源文件的目录，所以我猜想，这些资源文件其实并没有解压出来，仍旧是存放在 apk 中。我是这么猜想的：

应用运行期间，类加载器所需的源代码是从 data/dalvik-cache 缓存中加载，如果这里没有缓存，则去 data/app/ 对应的 apk 中解压拿到 class.dex，转换成 odex，再次缓存到 data/dalvik-cache，然后让类加载器去加载。

而代码运行期间所需的数据库数据，xml 数据等则直接从 data/data/{包名} 中读取，如果代码需要 res 或 assert 资源文件，则再去 data/app 下的 apk 中拿取。

这是我的猜想，这也才能解释，为什么一旦将 data/app 下的 apk 删掉，应用就无法运行，而如果将 data/data/{包名} 以及 data/dalvik-cache 缓存的 odex 源代码文件删掉，应用仍旧可以照常运行。

正确性与否不清楚，只是我的猜想，以后有时间翻阅源码验证一下。

**小结一下**

一个三方 apk 的安装过程，不管是通过设备的有界面交互方式下的安装，还是没有交互界面直接通过 `adb install` 命令安装，还是通过 Android Studio 的 run (本质上是执行 adb install 命令) 安装。

这个过程，首先得先将 apk 文件传送到终端设备上，设备上有了这个 apk 后，系统安装应用的过程其实也就是先将这个 apk 拷贝一份到 data/app 目录下，然后对其进行解压工作，将 apk 包中的 so 文件解压出来，将 dex 文件解压之后对其进行优化处理缓存到 data/dalvik-cache 目录，以便加快之后应用的运行，最后解析 AndroidManifext.xml 文件，将这个应用的基本信息写入 data/system/packages.xml  文件中，然后创建 data/data/{包名} 目录供应用运行期间存放数据。

### 2. 系统应用安装 

系统应用的安装方式就不同于三方应用了，系统应用无法通过 install 命令来安装，其实也可以说，`adb install` 安装的都是三方应用，这些 apk 最后都被安装到了 data/app 目录下。

系统应用只能是在出 rom 包时集成，也就是你设备第一次买来开机时就已跟随着 rom 包自带的应用，除非你的应用有 root 权限。这些应用可以升级，但升级后权限会降为三方应用，将不在拥有系统权限，但将升级后的删掉，重启，就又会恢复初始版本的系统应用了。

这是因为，系统应用的安装过程基本都是在系统启动时才去进行的。

常见的集成方式是直接将 apk 手动 push 到 system/app 目录下，同时解压出 apk 里面的 so 文件，手动将其 push 到 system/lib 下（大部分场景，有的需要 push 到 system/lib64）。

当 push 完成时，如果是首次 push，那么 data/system/packages.xml 注册表中是没有这个系统应用的任何信息的，所以需要重启一下，才能够运行这个应用。 

系统在重启的时候，会去扫描 system/app 目录下的 apk 文件，如果发现这个 apk 没有安装，那么会去触发它的安装工作。这也是为什么重启有时候会很耗时，尤其是升级完 rom 包后，因为此时需要安装一些 apk。

而安装过程基本跟三方应用一样，只是因为 apk 已经在 system/app，所以不会将 apk 拷贝到 data/app。其余的，优化 class.dex 格式为 odex 源代码文件缓存到 data/dalvik-cache，写配置到 data/system/packages.xml 中等等过程仍旧一样。

但有一点，三方应用的 so 文件是直接解压到 data/app 目录下，但系统应用已不存在于 data/app 了，所以它并没有解压 so 文件这个过程，如果 apk 中有使用到 so 文件，那么需要自己手动 push 到 system/lib 或者 system/lib64 目录下。

当然，也可以另外一种集成方式：

- apk push 到 system/app/{自己创建的目录}/
- so 文件 push 到 system/app/{自己创建的目录}/lib 中

这种方式的说明，请看后面的后记一章节。

### 3. packages.xml

这份配置文件在 data/system/ 目录下，不要小看这份文件，因为不管系统应用还是三方应用，安装过程中都会将其自身的基本信息写入这份文件中。所以，借助这份文件，可以获取到蛮多信息的。

比如，一般排查系统应用为什么启动不了，就可以借助这份文件。

碰到过这么一个问题，我们做的一些应用是没有界面的，就纯粹在后台干活。如果是三方，也许还可以通过手动去启动这个应用来查看相关日志，但偏偏还有些应用是设备开机时就自启的，所以最怕遇到的问题就是测试人员跟你说，这个应用在某个终端上起不来。

因为这时，不清楚这个应用到底是不是因为代码问题导致一直崩溃，起不来；还是因为根本就没安装成功；所以，遇到这类问题，第一点就是要先确认这一点，而确认这一点，就可以借助 packages.xml 这份配置文件了。

如果能够在这份 packages.xml 配置文件中找到应用的信息，那么说明安装成功了，接下去就往另一个方向排查问题了。

还有一种场景借助这份配置文件分析也是很有帮助的。

我们还遇到这种情况：

首先 system/app 下是系统应用，data/app 下是三方应用，但系统是允许 system/app 和 data/app 下存在相同包名的应用，因为允许系统应用进行升级操作，只是此时系统应用将变成三方应用权限。

某次，有反馈说，system/app 下已集成了最新版本的应用，但为什么，每次启动应用时，运行的都是旧版本。这时候怎么排查，就是根据 packages.xml 中这个应用的基本信息，它包括，这个应用的版本号，apk 的来源目录，so 文件的加载地址，所申请的权限等等。

有了这些信息，足够确认，此刻运行的应用是 data/app 下的 apk，还是 system/app 下的 apk。确认了之后，再进一步去排查。

### 4. System.load 和 System.loadlibrary 

`load()` 和 `loadlibrary()` 都是用来加载 so 文件的，区别仅在于 `load()` 接收的是绝对路径，比如 ”data/data/{包名}/lib/xxx.so“ 这样子，因为是绝对路径，所以最后跟着的是 so 文件全名，包括后缀名。

而 `loadlibrary()` 只需传入 so 文件去头截尾的名字就可以了，如 libblur.so，只需传入 blur 即可，内部会自动补全 so 文件可能存在的路径，以及补全 lib 前缀和 .so 后缀。

所以，下面要讲的，其实就是 `loadlibrary()` 加载 so 文件的流程。

因为之前碰到过这么个问题，有些不大理解：

我们的应用是系统应用，那么 so 文件也就是集成到 system/lib 或者 system/lib64 目录下，但不清楚，程序是根据什么决定是应该去 system/lib 目录下加载 so 文件，还是去 system/lib64 下加载，或者两处都会去？

所以，下个小节就是讲这个。

### 5. so 文件加载流程

这节是本篇的重点，打算亲自过下源码来梳理，但这样篇幅会特别长，基于此，就另起一篇来专门写从源码中梳理 so 文件的加载流程吧，这里就只给出链接和几点结论，感兴趣的可以去看看。

[Android 的 so 文件加载机制](https://www.jianshu.com/p/f243117766f1)  

- 一个应用在安装过程中，系统会经过一系列复杂的逻辑确定两个跟 so 文件加载相关的 app 属性值：nativeLibraryDirectories ，primaryCpuAbi ；
- nativeLibraryDirectories 表示应用自身存放 so 文件的目录地址，影响着 so 文件的加载流程；
- primaryCpuAbi 表示应用应该运行在哪种 abi 上，如（armeabi-v7a），它影响着应用是运行在 32 位还是 64 位的进程上，进而影响到寻找系统指定的 so 文件目录的流程；
- 以上两个属性，在应用安装结束后，可在 data/system/packages.xml 中查看；
- 当调用 System 的 `loadLibrary()` 加载 so 文件时，流程如下：
- 先到 nativeLibraryDirectories 指向的目录中寻找，是否存在且可用的 so 文件，有则直接加载这里的 so 文件；
- 上一步没找到的话，则根据当前进程如果是 32 位的，那么依次去 vendor/lib 和 system/lib 目录中寻找；
- 同样，如果当前进程是 64 位的，那么依次去 vendor/lib64 和 system/lib64 目录中寻找；
- 当前应用是运行在 32 位还是 64 位的进程上，取决于系统的 ro.zygote 属性和应用的 primaryCpuAbi 属性值，系统的 ro.zygote 可通过执行 getprop 命令查看；
- 如果 ro.zygote 属性为 zygote64_32，那么应用启动时，会先在 ro.product.cpu.abilist64 列表中寻找是否支持 primaryCpuAbi 属性，有，则该应用运行在 64 位的进程上；
- 如果上一步不支持，那么会在 ro.product.cpu.abilist32 列表中寻找是否支持 primaryCpuAbi 属性，有，则该应用运行在 32 位的进程上；
- 如果 ro.zygote 属性为 zygote32_64，则上述两个步骤互换；
- 如果应用的 primaryCpuAbi 属性为空，那么以 ro.product.cpu.abilist 列表中第一个 abi 值作为应用的 primaryCpuAbi；
- 运行在 64 位的 abi 有：arm64-v8a，mips64，x86_64
- 运行在 32 位的 abi 有：armeabi-v7a，armeabi，mips，x86
- 通常支持 arm64-v8a 的 64 位设备，都会向下兼容支持 32 位的 abi 运行；
- 但应用运行期间，不能混合着使用不同 abi 的 so 文件；
- 比如，当应用运行在 64 位进程中时，无法使用 32 位 abi 的 so 文件，同样，应用运行在 32 位进程中时，也无法使用 64 位 abi 的 so 文件；

### 6. 三方库 ReLinker 和 Soloder

ReLinker 和 Soloder 都是用于解决一些 so 文件加载失败的场景，比如：

- 嵌套的 so 文件加载异常，如程序引用了三方库，三方库又引用了三方库，各自库中又都存在 so 文件加载，有时候可能会导致 so 文件加载失败。
- so 文件缺失导致加载异常，如程序的 so 文件在设备的 so 目录中不见了之类的异常。
- 等等

它们的 Github 地址：

[SoLoader:https://github.com/facebook/SoLoader](https://github.com/facebook/SoLoader)

[ReLinker:https://github.com/KeepSafe/ReLinker](https://github.com/KeepSafe/ReLinker)

ReLinker 的原理我有去源码梳理了一遍，大体上是这样：

1. 先调用系统 `System.loadlibrary()` 加载 so 文件，如果成功，结束；
2. 如果失败，则重新解压 apk 文件，解析其中的 lib 目录，遍历 so 文件，找到所需的 so 文件时，将其缓存一份至 data/data/{包名}/app-lib 目录下，调用 `System.load()` 加载这份 so 文件；
3. 之后每次应用重启，仍旧先调用系统的 `System.loadlibrary()` 去尝试加载 so 文件，失败，如果 app-lib 下有缓存，且可用，则加载这个缓存的 so 文件，否则重新解压 apk，继续 2 步骤。

- 当然，解压 apk 遍历 so 文件时，如果需要的 so 文件存在于不同的 CPU 架构目录中，并不加以区分，直接拿第一个遍历到的 so 文件。

SoLoder 的原理我只是稍微过了下，并没有详细看，因为我最后选择的是 ReLinker 方案，但也可以大体上说一说：

- 遍历设备所有存放 so 文件的目录，如 system/lib, vendor/lib，缓存其中所有的 so 文件名。
- 如果系统加载 so 文件失败时，则从缓存的所有 so 文件名列表中寻找是否有和当前要加载的 so 文件一致的，有则直接加载这个 so 文件。

原理大体上应该是这样，感兴趣可以自行去看一下。

那么，这两个 so 文件加载的开源库有什么用呢？看你是否有遇到过 so 文件加载异常了，我的应用场景在埋坑一节里细说。

# 埋坑

好了，理论基础都已经有了，那么接下去就是来埋坑了。

针对开头所遇到的 bug，其实原因归根结底就是没有加载到正确的 so 文件，比如程序需要加载的是 system/lib64 下的 so 文件，但运维人员只集成到 system/lib 中；甚至说，运维人员连 so 文件都忘记集成到 system/lib 下了。

另外，运维人员希望，可以有一种统一的集成方法，他不需要去考虑是否还要根据其他条件来判断他是否要集成到  system/lib 还是 system/lib64 还是两者都要。

那么，解决方案其实有两种，一是给他一个新的无需考虑场景的集成方式；二是代码层面做适配，动态去加载所缺失的或不能用的 so 文件。

### 方案一：系统应用集成方式

假设需要集成的应用包名：com.dasu.shuai，apk 文件名：dasu.apk

1. 在 system/app 目录下新建子目录，命名能表示那个应用即可，如：dasu
2. 将 dasu.apk push 到 system/app/dasu/ 目录下
3. 在 system/app/dasu 目录下新建子目录：lib/arm，这个命名是固定的，这样系统才可以识别
4. apk 编译打包时，可以删掉其他 CPU 架构的 so 文件，只保留 armeabi-v7a 即可（根据你们应用的用户设备场景为主）
5. 解压 apk 文件，取出里面的 lib/armeabi-v7a 下的 so 文件，push 到 system/lib 或 system/app/dasu/lib/arm 都可以
6. 重启（如果应用首次集成需重启，否则 packages.xml 中无该应用的任何信息）

以上方案是针对我们应用自己的用户群场景的集成方式，如果想要通用，最好注意一下步骤 3 和 4，上述的这两个步骤目的在于让系统将该应用的 primaryCpuAbi 属性识别成 armeabi-v7a，这样就无需编译多个不同架构的 so 文件，集成也只需集成到 system/lib 目录中即可。

系统在扫描到 lib/arm 有这个目录存在时，会将 app 的 primaryCpuAbi 设置成 armeabi-v7a，相对应的，如果是 lib/arm64，那么就设置成 arm64-v8a，这是在 api22 机子上测试的结果。

### 方案二：代码适配

清楚了 ReLinker 的原理后，其实只要修改其中一个小小的流程即可。当系统加载 so 文件异常，ReLinker 接手来继续寻找 so 文件时，进行到解压 apk 包遍历所有 so 文件时，如果有多个不同 CPU 架构的 so 文件，此时修改原本的以第一个遍历到的 so 文件的逻辑，将其修改成寻找与此时应用的 primaryCpuAbi 一致的架构目录下的 so 文件来使用。

我是两种方案都做了，如果运维能够按照正常步骤集成，那么 so 文件加载异常的概率应该就不会大，即使运维哪个步骤操作失误了，方案二也可以弥补。

# 后记

本来以为这样子的解决方案足够解决这个问题了，也达到了运维人员的需求了。但没想到，事后居然又发现了新的问题：

由于我们是使用 fresco 图片库的，所以我们 app 的 so 文件其实都是来自 fresco 的，但没想到，合作的厂商它们自己的 app 也是使用的 fresco，然后他们也需要集成 so 文件。

但由于都是作为系统应用集成，so 文件都是统一集成在同一个目录中，如 system/lib，那么我们使用的 fresco 的 so 文件肯定就跟他们的 so 文件冲突了，因为文件名都一致，最后集成的时候就只使用他们的 so 文件。

然后，我们使用的 fresco 版本还跟他们不一样，结果就导致了，使用他们的 so 文件，我们的 app 运行时仍旧会报：

```
java.lang.UnsatisfiedLinkError: No implementation found for long com.facebook.imagepipeline.memory.NativeMemoryChunk.nativeAllocate(int) (tried Java_com_facebook_imagepipeline_memory_NativeMemoryChunk_nativeAllocate and Java_com_facebook_imagepipeline_memory_NativeMemoryChunk_nativeAllocate__I)
```

那要确认不同版本的 fresco 的 so 文件究竟有哪些差异，也只能去期待 fresco 官网是否有给出相关的文章。一般来说，新版本应该能兼容旧版本才对，这也就意味着，我们使用的版本其实比合作方他们新，如果集成时，使用的是我们的 so 文件，双方应该就都没问题。但跟他们合作一起集成时，如何来判断谁使用的版本新，谁的旧？都不更新的吗？

毕竟人家是厂商，我们只是需求合作，我们弱势，那还是我们自己再来想解决方案吧。

原本的 ReLinker 方案只能解决 so 文件不存在，加载失败，或者 so 文件 abi 异常的问题，但解决不了，so 文件的版本更新问题。

如果真要从代码层面着手，也不是不行，每次加载 so 文件前，先手动去系统的 so 文件目录中，将即将要加载的 so 文件进行一次 md5 计算，程序中可以保存打包时使用的 so 文件的 md5 值，两者相互比较，来判断 so 文件对应的代码版本是否一致。但这样会导致正常的流程需要额外处理一些耗时工作，自行评估吧。

或者，让运维人员在集成时，干脆不要将 so 文件集成到 system/lib 目录中，直接集成到 system/app/{新建目录}/lib/arm/ 目录下，这样我们就只使用我们自己的 so 文件，不用去担心跟他们共用时，版本差异问题了。

# 参考资料  

[1.APK文件结构和安装过程](https://blog.csdn.net/bupt073114/article/details/42298337)

[2.Android程序包管理(2)--使用adb install执行安装过程](https://blog.csdn.net/leif_/article/details/79494795)

[3.Android 的 so 文件加载机制](https://www.jianshu.com/p/f243117766f1)  