最近看了一本书《Android Gradle 权威指南》，对于 Gradle 理解又更深了，但不想过段时间就又忘光了，所以打算写一篇读书笔记，将书中一些我个人觉得蛮有用的点记录、总结一下。  

# 前言  

首先，先来过一下整书的目录章节，先大概清楚整本书都介绍了哪些知识点：  

> 第 1 章    Gradle 入门
>
> 第 2 章    Groovy 基础
>
> 第 3 章    Gradle 构建脚本基础
>
> 第 4 章    Gradle 任务
>
> 第 5 章    Gradle 插件
>
> 第 6 章    Java Gradle 插件
>
> 第 7 章    Android Gradle 插件
>
> 第 8 章    自定义 Android Gradle 工程
>
> 第 9 章    Android Gradle 高级自定义
>
> 第 10 章  Android Gradle 多项目构建
>
> 第 11 章  Android Gradle 多渠道构建
>
> 第 12 章  Android Gradle 测试
>
> 第 13 章  Android Gradle NDK 支持
>
> 第 14 章  Android Gradle 持续集成  

整本书介绍的内容很全，从 Gradle 的环境配置 --> Groovy 介绍 --> 讲解项目中常见 gradle 文件作用 （setting.gradle, build.gradle） --> 详细讲解 build.gradle 文件内每行代码的含义 --> 各种高级自定义使用。  

看完这本书，对于掌握项目中的 build.gradle 文件应该就不成问题了，虽然将整本书过了一遍，但其实我也只是着重挑了一些自己感兴趣的章节深入阅读，所以就来记录一下，方便后续查阅吧。  

# 笔记  

### 1. Groovy 基础  

首先清楚一点，Gradle 是基于 Groovy 语言的，他们之间的关系就像《Android 群英传：神兵利器》中说的：  

> Groovy 对于 Gradle，就好比 Java 对于 Android

所以，了解一些 Groovy，对于学习 Gradle 来说，肯定是有所帮助的。

关于这方面内容，我之前写过一篇博客：[学点Groovy来理解build.gradle代码](https://www.jianshu.com/p/501726c979b1)  

所以，这里不会再去介绍，但有几个点可以提一下，如果你都还不怎么熟悉，那么可以点开链接去看看：  

- Groovy 中支持用 `'xxx'`,`"xxx"`,`'''xxx'''`,`/xxx/` 等多种方式来定义字符串，所以如果在 build.gradle 里看到既有单引号又有双引号定义的字符串时，不用去疑惑他们到底是不是字符串。
- Groovy 中的方法支持省略括号，也就是说，在 build.gradle 中一行行的代码，大部分都是在调用某个方法。
- Groovy 中有一种特性叫闭包，说白点也就是代码块，支持作为方法参数，结合方法括号省略的特点，在 build.gradle 里 defauleConfig {} 代码块之类的其实也都是在调用一个个方法。

### 2. Android 项目中的 Gradle  

![项目结构.png](https://upload-images.jianshu.io/upload_images/1924341-820acc755f44474b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

新建一个项目时，Android Studio 会自动生成项目的初步结构，这通常会携带一些 gradle 相关的文件，这一节就来学学，各个 gradle 文件都有什么作用

#### 2.1 gradle/wrapper 目录    

就像我们要开发 Java 程序，本地需要配置 JDK 环境，要开发 Android 程序，需要配置 SDK 一样，想要借助 Gradle 来构建项目，那么按理说本地也需要配置相关的 Gradle 环境才对。  

而我们之所以可以省掉这一步，就是 gradle/wrapper 这个目录下的文件的作用了，可以先看看 gradle-wrapper.properties 这个文件的内容：  

```  groovy
#Thu May 24 10:30:42 CST 2018
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-3.3-all.zip
```

内容无非就是一些配置项，而最重要的就是最后一句，指明了当前这个项目要使用哪个版本的 Gradle 来构建，我们在 Android Studio 的 File -> Project Structure -> Project 里配置的 Gradle Version，最终改变的其实就是上述文件里最后一行的 Gradle 版本属性值  

![AS的Gradle版本配置.png](https://upload-images.jianshu.io/upload_images/1924341-ae9ad09aa95697e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

官方说了，提供了 gradle/wrapper 这种方式，可以让你特别灵活的进行配置，想换个 Gradle 版本来构建项目，只需要修改这个配置文件的 Gradle 版本属性值即可，当然也可以直接通过 AS 提供的 UI 界面操作，结果都一样。

由于 Gradle 更新换代特别快，而且新的大版本经常都会提供很多新特性，这就导致了在 clone Github 上一些开源项目到本地构建时经常有报错的问题，本质原因就是因为它使用的 Gradle 版本跟你本地不一样，而由于有堵巨墙的原因，导致一直没法成功下载它配置的 Gradle 版本，进而就无法构建项目，而报错了。

网上说的一些解决方案是让你手动去修改 gradle-wrapper.properties 文件里的 Gradle 版本，改成你本地的版本，但我觉得这种方法不一定适用，这取决于那个项目中是否有用到一些新特性，以及你本地的 Gradle 版本是否兼容项目中用到的 Gradle 新特性。

通常来说，如果你本地的 Gradle 比克隆的项目的 Gradle 版本高的话，那么这种直接修改项目的 Gradle 版本方式应该是可行的，那么怎么知道你本地都有哪些 Gradle 版本呢：

![本地Gradle版本.png](https://upload-images.jianshu.io/upload_images/1924341-d59f514024c18aa2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

默认在 C 盘， C:\Users\suxq\ .gradle 目录下有 Android Studio 自动帮你下载的 Gradle 的各个版本，只要你在 gradle-wrapper.properties 修改了 Gradle 的版本号，那么当你在构建项目时，就会先到你电脑的这个路径下查找相对应版本的 Gradle，如果可用，则直接进行构建项目任务，如果不存在，那么就会自动去下载对应版本的 Gradle。

最后，还有个问题，怎么确定都有哪些 Gradle 版本可用呢？如果想要自己去下载，不借助 Android Studio 可行么？  

当然可以，去官网找到对应版本点击下载即可：[http://services.gradle.org/distributions/](http://services.gradle.org/distributions/)  

下载完成之后，将文件放到上面介绍的 C 盘下的 .gradle 文件里相对应版本的目录下即可。

如果你有自己去尝试下载，你就会体验到，下载速度是有多么的龟速，90M 左右的文件硬是要下载个把小时。同样的道理，你自己下载这么慢，那通过 Android Studio 下载的速度也同样这么慢，两者唯一的区别就只是在于你自己下载时你可以看到速度和进度。

这样一来的话，**明白为什么有时候打开新项目或者打开 Github 上的项目时，Android Studio 会一直卡在构建中的原因了吧？**  

因为这个项目用到了你本地没有的 Gradle 版本，所以 Android Studio 自动去下载了，但由于都懂的原因，下载速度贼慢，因此网上才有一些博客教你说让你要去翻墙，明白为什么了吧。

另外，网上还有一些博客会让你不管它，让你等隔天再去打开这个项目，然后有时候你会发现，隔天打开竟然能正常构建项目了，莫名其妙的就好了，就不一直卡在构建中了。这是由于 Android Studio 会有一个后台构建的功能，也就是说它可以在背后默默的帮你自动去下载 Gradle，虽然速度贼慢，但总有下载完成的时候，当你隔天再去打开这个新项目时，如果已经下载好了，那自然就可以正常构建使用了。

#### 2.2 gradlew.bat 文件

gradlew 文件和 gradlew.bat 文件，两份没有什么差别，它们都是脚本文件，区别只是一个是 shell 脚本，一个是批处理脚本，那么自然一个是用来在 Linux 上运行，一个在 Windows 上运行。

感兴趣的可以去看看这份脚本代码，其中比较关键的代码：  

```  shell
set CLASSPATH=%APP_HOME%\gradle\wrapper\gradle-wrapper.jar

@rem Execute Gradle
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %CMD_LINE_ARGS%
```

大概翻译一下，它借助了 gradle/wrapper 目录下的 gradle-wrapper.jar 文件，并借助了 java 命令，提供了可让我们直接以命令行形式运行一些相应的 gradle 指令，而这些指令在 gradle-wrapper.jar 文件中都提供了相应的实现。

比如：  `gradlew -version`

![gradlew命令示例2.png](https://upload-images.jianshu.io/upload_images/1924341-fb005f14ea7ea957.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

直接在 Android Studio 的 Terminal 面板运行 `gradlew -version` 命令，或者在 Dos 窗口，进到项目的根目录下执行该命令，都可以，前者只是打开时就默认将项目根目录作为当前路径了。

这也是为什么一些资料说，如果没有配置 Gradle 环境，那么在每个项目根目录下也可以运行 gradle 命令的原因，因为每个项目都提供了 gradlew.bat 脚本以及 gradle/wrapper 目录下的 gradle-wrapper.jar 文件支持。你可以试一下，删掉两者中任意一个，就没法正常运行 gradle 命令了。  

**那么，提供了脚本文件来支持直接运行 gradle 命令有什么用呢？**  

用处可多了，我们在构建项目时，基本都是直接借助 Android Studio 的图形界面来操作，点一点就可以了。但有时候，经常会遇见一些构建失败的情况，然后日志中经常会给我们这么一段提示：  

![gradle构建失败日志.png](https://upload-images.jianshu.io/upload_images/1924341-b28003535c5f8c9d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

如果想查看更多的日志信息，需要在执行命令的时候加上一些参数，而这种时候就需要通过命令行的形式来了，那么这时脚本文件也就派上用场了：  

![gradle命令带参数示例.png](https://upload-images.jianshu.io/upload_images/1924341-6ee813b372aff2bd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

![gradle命令异常栈.png](https://upload-images.jianshu.io/upload_images/1924341-1488e157b01b210c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)   

这样一来就可以看到更多的日志信息了，当然我举的这个例子不好，因为可以直接看出问题出在哪了，不需要再去获取更多的辅助信息来定位了。

但有些时候，Gradle 构建时确实就是失败了，然后给的信息又少，让人莫名其妙，不知道为啥失败了，这种时候就可以借助命令行形式来执行这个 task，然后添加一些参数来获取更多的辅助日志。至于要添加哪些参数，执行什么命令，通常情况下，Gradle 构建失败时都会给出建议，跟着来就可以了。

#### 2.3 setting.gradle 文件

setting.gradle 文件通常是当项目涉及到多 Module 的场景。

![setting示例.png](https://upload-images.jianshu.io/upload_images/1924341-2225e33a5c04870c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

只有在 setting.gradle 中 include 的 Module，才会被加入构建中，也就是说，如果一个项目文件夹内，包含了很多子工程，但如果没在 setting.gradle 中将这些子工程 include 进来的话， 这些 Module 是不会参与进构建的。

另外，如果子工程的这些 Module 都直接放在了项目根目录中，那么 setting.gradle 中只需要写 include 就可以了，那如果这些子工程是放在别的地方，那么也可以通过修改 project().projectDir 来指定子工程的具体路径，也就是说，所有的 Module 并不一定需要全部集中放在同一个项目内。 

#### 2.4 build.gradle 文件  

一个项目中可能存在多个子工程，每个子工程构建都应该是相互独立的，也就是说，每个子工程都可以根据自己的需要，配置各种依赖，插件等。那么，Gradle 是如何分开来管理每个子工程的构建任务的呢？  

这就是 build.gradle 文件的作用了，所以你会发现，每个子工程，也就是每个 Module 都会有一个 build.gradle 文件，Gradle 就是以这个文件为根据来构建这个 Module。

那么，如果有些配置项，在所有的子工程中都是一致的话，如果在每个子工程里都去重复粘贴的话，当这个共同的配置项需要发生变化时，维护起来会非常麻烦，这也就是为什么根目录下面还会有一个 build.gradle 文件。

根目录下的这个 build.gradle 是统筹全局的，在这里，你可以配置一些所有工程共同的配置项，比如 Android Gradle 的版本，依赖库的仓库地址这些所有工程的共同配置项。

也就是说，其实将根目录下的 build.gradle 文件里的内容移到每一个工程下的 build.gradle 里，也是可行的。但没必要这样做，吃饱了撑着。

### 3. Gradle 基础  

#### 3.1 task 概念  

task 是 Gradle 中的一种概念，引用书中的解释：  

>  一个 task 其实就是一个操作，一个原子性的操作，比如打个 jar 包，复制一份文件，编译一次 Java 代码，上传一个 jar 到 Maven 中心库等，这就是一个 Task，和 Ant 里的 Target， Maven 中的 goal 是一样的。  

有点类似于 Java 里面的类，但又有很多不同之处。我们要通过 Java 命令来执行某个 java 文件，那么至少需要一个类，类里面需要有 main 方法，这个 java 文件才能运行起来。

同样，要通过 gradle 命令来执行某个构建任务，那么至少需要一个 task，这个构建任务才能跑起来。

但更多的是不同的概念，多个类之间可以有相互依赖的关系，类中持有另一个类的引用等等。

但在 task 方面，多个 task 之间只能有前后依赖关系，即某个 task 的运行是否需要哪个 task 先运行的基础上才允许，也就是说，在 Gradle 的构建工作过程中，多个 task 是构成一条直线的，一个个 task 按顺序的去工作，而不存在某个 task 工作到一半时去调用另一个 task。  

不过，通常情况下，我们并不需要去接触到 task 层面，build.gradle 文件里的代码大多都只是在调用各种方法进行各种配置，而最后，会根据这份文件生成很多 task，比如：  

![Gradle面板.png](https://upload-images.jianshu.io/upload_images/1924341-abac23c1724b329e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

在 Android Studio 右侧的 Gradle 的面板这边，就是一个个的 task，assemble 是一个 task，build 也是一个 task，很多 task 是 Gradle 已经提供的，而有些 task 则是根据 build.gradle 里面的配置项自动生成的，比如 assembleDebug 这一类。

要执行 task 的方式，可以通过 AS 的图形界面点一点即可，也可以通过命令行方式，由于根目录提供了 gradlew 脚本文件，因此可以在根目录下执行 `gradlew task名` 即可。

#### 3.2 gradle 插件概念  

Gradle 是用来构建项目的，但并不是说只能用于构建 Android 的项目，Java 的也行，C++ 的也行，很多很多。

那如果我只是做 Android 开发，我也就只需要 Gradle 构建 Android 项目的功能即可，其他的又不需要，鉴于此，Gradle 封装好了基本的构建工作，然后提供了插件的接口，支持根据各自需要去扩展相应的构建任务。

以上就是我对于 Gradle 插件概念的理解，我认为它是用于给大伙可以根据需要自行去扩展。

就拿 Android 项目来说，来看一份 build.gradle 文件结构：  

```  groovy
apply plugin: 'com.android.application'

android {
    ...
    defaultConfig {
        ....
    }
}

dependencies {
    ...
}
```

如果有点击方法进去看过源码的话，你会发现：  

![dependencies.png](https://upload-images.jianshu.io/upload_images/1924341-0c5957cb23efc34c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

![androidGradle.png](https://upload-images.jianshu.io/upload_images/1924341-6ab837803546b7d8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

发现没有，dependencies 是 Gradle 提供的方法，但 android，defaultConfig 却都是 Android Gradle 插件提供的方法了。

也就是说，其实 Gradle 只提供了构建项目的一些基本功能，如配置依赖库，不管什么项目都需要。但像 android {} 代码块里的配置项，很明显，就只有 Android 项目才需要用到了，所以这些配置并不是由 Gradle 来提供的，而是由 Android Gradle 插件提供的，这也就是为什么在根目录的 build.gradle 文件里会有这么一行代码：  

``` groovy
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.3.3'
    }
}
```

`com.android.tools.build:gradle:2.3.3` 这行代码其实就是声明了我们的项目还需要使用 Android Gradle 插件，版本号为 2.3.3，而插件的下载地址在 jecnter() 仓库。 

所以，得搞清楚，Gradle 和 Android Gradle 是两种概念，也是两个不同的东西，如果有人问说你项目构建的 Gradle 的版本是多少，得搞清楚，他想问的是 Gradle，还是 Android Gradle 插件。

但是我们在根目录的 build.gradle 里是可以配置多个插件的，比如如果有使用 GreenDao，或者使用了 Jcenter 的上传功能：  

```  
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
    	//Google提供的构建Android项目的插件
    	classpath 'com.android.tools.build:gradle:2.3.3'
    	//GreenDao 提供的插件
        classpath 'org.greenrobot:greendao-gradle-plugin:3.2.2'
        //Jcenter提供的插件
        classpath 'com.jfrog.bintray.gradle:gradle-bintray-plugin:1.4'
        //Maven提供的插件
    	classpath 'com.github.dcendents:android-maven-gradle-plugin:1.4.1'
    }
}
```

那么，Gradle 在根据 build.gradle 构建 Module 时，怎么知道要使用哪个插件呢，声明了这么多。

这就是为什么在每个 Module 的 build.gradle 文件的开头有行 `apply plugin` 的代码了。

apply 是 Gradle 的方法，它可以接收一个 map 类型的参数，而在 Groovy 中，map 的定义可以直接 `'key': value`，也就是说：  

```  groovy
apply plugin: 'com.android.application'  
//等效于
// def map = ['plugin':'com.android.application']
// apply(map)
```

每个 build.gradle 开头这行代码，其实是调用了 Gradle 的 apply() 方法，然后传入了一个 map 值，key 为 plugin， value 为 ‘com.android.application'，那么 Gradle 就知道了你这个项目需要使用到一个 id 为 'com.android.application' 的插件来辅助构建了，那么它就会去你在根目录下配置的插件列表里寻找。

也就是说，apply plugin 是 Gradle 规定并提供的，但 'com.android.application' 则是由 Android Gradle 来提供的。

那么，小结一下，要使用一个 Gradle 插件的话，先得在根目录下声明你要用的插件以及版本，当然也得指定插件的下载地址，然后在你具体的 Module 的 build.gradle 的开头通过 apply plugin 方式来应用插件，这个插件得有一个唯一区分开的 id 值。

### 4. 区分 Gradle 和 Android Gradle   

![ProjectStructure.png](https://upload-images.jianshu.io/upload_images/1924341-12857cb2ac1f591b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

先来看张图，这个在 File -> Project Structure -> Project 打开，在这里可以配置 Gradle 和 Android Gradle 插件的版本。

最开始接触的时候，我看到这里是有些迷茫的，怎么有一个 Gradle 版本，又有一个 Android Gradle 版本。当别人问我你 Android Studio 使用的 Gradle 版本是多少时，我也傻乎乎的打开根目录下的 build.gradle 文件里，看到 `com.android.tools.build:gradle:2.3.3`，然后跟他说 2.3.3 版本，当初根本没搞清楚这两个有什么区别，一直以为是同一个东西。

所以，要搞清楚 Android Gradle 其实只是 Gradle 的一个插件，是 Google 基于 Gradle 提供的插件接口所做的一些扩展。  

所以，要查找 Android Gradle 的相关资料，自然就不是去 Gradle 官网了，而是要去 Android 官网找：  

[https://developer.android.google.cn/studio/releases/gradle-plugin](https://developer.android.google.cn/studio/releases/gradle-plugin)  

由于 Gradle 更新换代很快，又经常提供一些新特性，所以 Android Gradle 插件也就跟随着发布了很多版本，所以，Android Gradle 的版本并不是可以任意更改的，因为它是基于每一个 Gradle 版本开发的，因此需要在对应的 Gradle 版本中才能使用。

这也是为什么，我们有时候直接修改根目录下的 build.gradle 中的 Android Gradle 版本时，会报一些错误说需要 Gradle 版本在多少在可以使用的原因，至于这些对应关系，官网当然有给出来了：  

![版本对应关系.png](https://upload-images.jianshu.io/upload_images/1924341-df864d6b49e665b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

举个例子，如果你 Gradle 版本使用的是 3.3，然后你在 Github 上 clone 了某个人的项目，他的项目中使用的 4.4 的 Gradle 版本 和 3.1.0 的 Android Gradle 插件，但是你发现在打开这个项目的时一直处于构建中，一直打不开。

你查了下原因，网上有教程说，让你将项目中的 gradle/wrapper 文件里的 Gradle 版本换成你本地项目中的 Gradle 版本，还跟你说因为它使用的版本你本地没有，而且被墙了，你下载需要很长时间，让你直接改成使用你本地的版本即可。

你改了后，发现，是可以打开项目了，但构建的时候又报错了，说你使用了 3.1.0 的 Android Gradle 插件，需要让你将 Gradle 版本改成 4.4 才可以正常构建，这 MMP 不是又绕回去了。

所以说，别听他放屁，搞清楚了 Gradle 和 Android Gradle 插件的关系之后。那为什么会一直在构建中，为什么会报错我们心里就有数了，要解决，没有其他办法，就是要将对应的版本下载下来。

所以，你应该去搜的是如何下载，Android Gradle 插件并没有被墙，如果想自行下载，可以参考我之前的博客: [如何用Android Studio查看build.gradle源码](https://www.jianshu.com/p/28bb90e565de)，而至于 Gradle 要如何下载，如果官网下载不了，那就去搜搜有没有相关的镜像吧。  

***

本篇就先到这里了，还会有一篇下篇，下篇的内容就是侧重于介绍 build.gradle 里各种配置项的作用和意义了，还有就是如何自己写 Gradle 脚本来运行，敬请期待~

