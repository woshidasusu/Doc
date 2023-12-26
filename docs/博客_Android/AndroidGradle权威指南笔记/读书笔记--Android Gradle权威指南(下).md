# 前言  

最近看了一本书《Android Gradle 权威指南》，收获挺多，就想着来记录一些读书笔记，方便后续查阅。

本篇内容是基于上一篇：[读书笔记--Android Gradle权威指南（上）](https://www.jianshu.com/p/718b4927f425)  

上一篇中我们讲了：  

> 1. Groovy 基础
>
> 2. Android 项目中的 Gradle
>
>    2.1 gradle/wrapper 目录
>
>    2.2 gradlew.bat 文件
>
>    2.3 setting.gradle 文件
>
>    2.4 build.gradle 文件
>
> 3. Gradle 基础
>
>    3.1 task 概念
>
>    3.2 gradle 插件概念
>
> 4.    区分 Gradle 和 Android Gradle
>

在上一篇中，我们了解了 Android 项目中每个 gradle 文件的作用是什么，以及 Gradle 和 Android Gradle 插件的区别，也清楚了为什么有时候打开 Github 上的项目时会一直处于构建中，也知道了如何去解决。

那么，本篇，我们继续往下来学习，build.gradle 文件里各个配置项的作用，以及如何用 Gradle 来写脚本帮助我们做一些重复性的手工工作。

# 笔记  

### 5.build.gradle 代码

#### 5.1 `apply plugin: 'com.android.application'`  

apply 是 Gradle 的一个方法，接收 map 类型的参数，map 的 key 值可以有三种：from, plugin, to

`com.android.application` 是 Android Gradle 插件中提供的一个唯一指向某个 Plugin 的 id。在 2.3.3 版本的 Android Gradle 插件中，这个 id 指向的类为 AppPlugin

`apply plugin` 意思是为当前项目的构建应用一个 Gradle 插件，至于应用哪个插件，可以通过指定一个唯一的 id 值即可，也可以直接指定插件类的类名，如：

```
//apply plugin: 'com.android.application'
//等效于
//apply plugin: com.android.build.gradle.AppPlugin  

//同理
//apply plugin: 'com.android.library'
//等效于
//apply plugin: com.android.build.gradle.LibraryPlugin
```

上述代码中两种方式是等效的，因为 Android Gradle 插件已经通过一份配置文件，将这两者绑定在一起，使用者不清楚具体要用哪个插件类的话，那么可以直接使用跟它对应的 id 值即可，而且通过 id 值的方式也会更方便。

**那么，为什么构建 Android 项目时都需要在 build.gradle 开头声明这么一句 `apply plugin` 应用某个插件呢？**  

上一篇中已经提到过了，本篇继续提一下。这之前，需要区分 Gradle 跟 Android Gradle 是两种概念，两个东西。

Android Studio 是采用 Gradle 来构建项目，而 Gradle 并不是为了构建 Android 项目而设计的，它也可以构建 C++ 项目等等，因此，Gradle 它只提供了构建项目的一些基本工作，如配置依赖库等等。

但 Gradle 扩展性很好，它提供了插件的概念，可以根据需要自行去扩展一些构建工作。

因此，Google 基于 Gradle 提供的插件接口，开发了一套 Android Gradle 插件，就是专门用来构建 Android 项目。

build.gradle 文件里的 `android {}` 代码块配置，就是 Android Gradle 插件提供的，而 `dependencies {}` 代码块配置则是 Gradle 原生就提供的了。

所以，如果开头不通过 `apply plugin` 声明需要应用 Android Gradle 的插件，而 build.gradle 里又使用到了 Gradle 没有提供的 `android {}` 配置，当然就会出错了。

当然，不仅仅是这点，构建 Android 项目过程中的很多工作，都是 Gradle 原生没有提供，都需要借助 Google 开发的 Android Gradle 插件。

#### 5.2 android {}  

**官方文档：**[http://google.github.io/android-gradle-dsl/current/](http://google.github.io/android-gradle-dsl/current/)

不同的项目构建时，所需的配置可能不同，那么，设置这些配置项的入口就在 `android {}` 代码块中，一些必配项，在新建项目时，build.gradle 就已经自动生成了。当然，它还提供了很多可选的配置项，具体都有哪些，可以在官方文档中找，也可以直接看源码，还可以去网上搜索大神的博客。  

![官方文档.png](https://upload-images.jianshu.io/upload_images/1924341-fbde13f42d6e2b2e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

上图只截了一部分，官方文档肯定是最全的了，建议还是官方文档里查阅，至于源码方面，也许可以找到一些隐藏配置，也是一个好的选择，com.android.application 插件对应的 android {} 配置的源码是 AppExtension。

#### 5.3 buildTypes {}  

这个是配置什么的呢，其实它最后的效果跟 productFlavors 很像，都是用于根据不同的配置需求，打不同的 apk 包。

但用官方文档里的话来说，这个是专门给**开发人员用于在软件开发的整个周期内根据不同的阶段来配置不同属性，打相对应阶段的 apk 包的**。

说得白点，一个产品从开发到上线过程中，最起码需要经过开发、测试、上线三个阶段。那么，在前两个阶段可以打一些 debug 包，这个 debug 包可以不用正式签名，可以携带一些调试日志，可以使用一些三方检测工具如内存泄漏等等。但等到要上线了，那么就应该打个 release 包，在 debug 包中的配置在这个阶段就可以都关掉了。

当然，在这里，除了配置我们很熟悉的 debug 和 release 两种，还可以根据需要配置类型像 prerelease 预发布等等类型。

#### 5.4 productFlavors {}

这个配置的作用跟 buildTypes 很类似，但它是从产品角度出发来设置不同的配置。

**不同的渠道可能需要不一样的 Logo，不一样的包名，不一样的资源文件，不一样的功能模块等等，那么就可以通过这里来配置**。

之所以提了 buildTypes 和 productFlavors 这两个，是因为想来讲讲，最终打包的时候，总类型的包一共是：buildTypes * productFlavors 

比如在 buildTypes 中定义了 debug 和 release 两种类型，在 productFlavors 中定义了 google，baidu 两种类型，那么打出来的包一共有：google_debug，google_release，baidu_debug，baidu_release，共四个类型的包。但这是通常情况下的配置，如果在 productFlavors 中使用了 dimension 的话，那又是另外一种方式了。

#### 5.5 flavorDimensions

这个是用于将 productFlavors 划分维度的，比如我们打包时不仅需要多个渠道，每个渠道还分收费版、免费版。那么此时，传统的方法就是在 productFlavors 里对每个渠道分别去配置，比如 :  

```
android {
    productFlavors {
        googleFree {
            ...
        }
        googleVip {
            ...
        }
    }
}
```

那么，这种有多维度需求时，如果还是用常规的方式，将会特别麻烦，这种场景下就可以使用 flavorDimensions 来实现了，这个需要跟 dimension 一起使用，如：  

```
android {
	flavorDimensions 'channel', 'pay'
	productFlavors {
    	google {
            dimension 'channel'
    	} 
		build {
            dimension 'channel'
		}   
		free {
            dimension 'pay'
		}
		vip {
            dimension 'pay'
		}
    }
}
```

上述例子中，划分了两个维度：渠道和收费模式，那么这时候打包的时候就是根据 channel + pay + buildTypes。

比如会有 google-free-debug，google-free-release，google-vip-debug，baidu-vip-release 等等。

如果还是用传统方式，那么在 productFlavors 就需要对每个渠道增加 free 和 vip 两种类型了，那么当渠道很多时就特别麻烦了。 

#### 5.6 applicationVariants

![applicationVariant.png](https://upload-images.jianshu.io/upload_images/1924341-36ab19575704812c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

通过这个可以拿到最后要打包时的所有类型，然后可以获取到各种配置信息，或者修改各种配置信息。

比如说通过 buildTypes 和 productFlavors 一共配置了 4 种 apk 包类型，那么我们全都可以在这边拿到，要遍历它的话，需要使用 .all {} 方式，那么具体有哪些信息可以拿到呢，可以直接看源码，也可以借助 AS 左侧的 Structure 面板中查看：  

![structure面板.png](https://upload-images.jianshu.io/upload_images/1924341-a26d055eda038c73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

比如可以拿到 applicationId 包名，拿到 buidlType 类型等等，我们经常会去修改 apk 生成时的命名规则，其实就是通过这个拿到它的 outputs 属性，它是个 List 列表，所以可以通过 .each {} 来遍历，达到自定义 apk 文件的命名格式。

再比如可以通过 mergedFlavor 来拿到 manifest 文件中的一些数据，向占位符输入数据啊等等。

#### 5.7 buildToolsVersion  

这个是用来配置要使用哪个版本的 Android 构建工具。

也许你会有这种疑问，前面都已经配置了 Gradle 的版本，还配置了 Android Gradle 插件的版本了，为什么还要配置一个 Android 构建工具的版本，这个工具又是个什么鬼，为什么需要配置这么多，一个 Gradle 不够么？  

Gradle 和 Android Gradle 插件的区别和概念前面已经反复提过了，而至于为什么要配置 buildToolsVersion？

理解这点，需要清楚一点，即使不使用 Gradle，也有其他办法来构建 Android 项目，像早期 Eclipse 使用 Ant 来构建一样。就算也不使用 Ant，也还是可以自己通过 Google 提供的工具来构建，只是这个过程特别繁琐，而构建一个 Android 项目所需的一些工具，Google 都提供在 SDK 中了。

那么，Android Gradle 插件其实本质上也就是通过使用 SDK 中的工具来构建项目，所以对这三者可以这么理解，**Google 基于 Gradle 提供的插件接口自己开发了一套 Android Gradle 插件来扩展一些构建工作，而这些构建工作使用到了 SDK 中的构建工具**，因此一个 AS 项目，才会需要你配置 Gradle 版本，Android Gradle 插件版本，以及 buildToolsVersion。

#### 5.8 其他

- **adbExecutable**：获取 adb.exe 路径，写脚本的时候可以用

- **useLibrary**：使用共享库，因为高版本的 Android 可能会移除一些库，比如 API 23 之后就将 HttpClient 库移除掉了，这些在高版本被移除掉的库，如果还想再使用，就可以使用 useLibrary 来配置。如：  

  `useLibrary 'org.apache.http.legacy'`  

  另外，官方建议说，即使在 build.gradle 配置了这个，最好也还是在 AndroidManifest.xml 中也配置一下，防止意外。

- **applicationId**：配置包名，没配置的话，默认使用 AndroidManifest.xml 文件中指定的包名。

- **applicationIdSuffix**：配置包名的后缀，使用场景通常是在 debug 中配置，这样 debug 包和 release 包都可以安装在同一台设备上。

- **flavorDimensionList**：获取通过 flavorDimensions 声明的多维度的 productFlavors 信息

- **buildConfigField**：动态配置 BuildConfig 类的常量，这个方法接收三个参数，全是 String 类型，各个参数含义为：type, key, value，示例：  

  ```
  buildConfigField 'String', 'weixin', '"dasuAndroidTv"'
  buildConfigField 'boolean', 'enable', 'false'
  ```

  注意，BuildConfig 里生成的常量的类型，变量名，以及属性值，三者全部是根据这三个参数来生成的，所以如果配置 String 类型时，需要特别注意第三个参数。

- **resValue**：这是 productFlavors 或 buildTypes 里的方法，用法跟 buildConfigField 一模一样，区别仅仅是 buildConfigField 是在 BuildConfig 中生成常量，而 resValue 是在 res/value.xml 中生成对应的字符串资源。

  场景也很多，比如对于同一个控件，在不同渠道上要显示不同的文案，在代码里实现的话，就需要用很多判断逻辑，但如果是直接在 build.gradle 中通过 resValue 来配置的话，那么代码中就完全不用去管渠道问题，它只需要用即可，至于具体是什么文案，交由 resValue 来动态配置。

### 6. Gradle 各种技巧  

#### 6.1 批量修改生成的 apk 文件名  

```  
applicationVariants.all { variant ->
	variant.outputs.each { output ->
		def outputFile = output.outputFile
		if (outputFile != null && outputFile.name.endsWith('.apk')) {
			//def fileName = "自定义命名规则"
			output.outputFile = new File(outputFile.parent, fileName)
		}
	}
}
```

#### 6.2 System.getenv()  

通过这个可以获取到系统的环境变量，所以可以结合这个来将一些工作放在特定服务器上做。

通常都会有一个专门用来自动化打包的服务器，那么我们可以将一些检查工作，如果 Lint 检查，单元测试等等之类的工作放于服务器上执行，因为这类工作通常比较耗时，而且我们本地开发时经常需要调试，打包，也没必要每次都去开启  Lint 检查。

那么在 build.gradle 中就可以结合这个方法，然后在服务器上配置一个特定的环境变量，当检查到当前打包环境在服务器上时，就可以去触发这些本地开发过程中较耗时的构建工作了，尤其打包服务器还可以将这些 Lint 检查，单元测试工作的结果通过邮件发送给开发人员。

#### 6.3 动态配置 AndroidManifest.xml 文件

先在 AndroidManifext.xml 中设置占位符：

```
<meta-data android:value="${CHANNEL}" android:name="CHANNEL" />
```

然后在 build.gradle 中的 productFlavors 中通过 manifestPlaceholders 来改变 manifest 里的占位符：  

```  
android {
    productFlavors {
        google {
            mainfestPlaceholders.put("CHANNEL", "google")
        }
    }
}
```

这种使用场景还可以用于根据不同渠道动态控制不同的权限

#### 6.4 美团黑科技式多渠道打包  

[https://github.com/GavinCT/AndroidMultiChannelBuildTool](https://github.com/GavinCT/AndroidMultiChannelBuildTool)  

[http://tech.meituan.com/mt-apk-packaging.html](http://tech.meituan.com/mt-apk-packaging.html)

#### 6.5 Gradle 性能检测

**命令**：`gradlew build -profile`  

在项目根目录下执行完该命令后，就可以在 build/report 下找到生成的报告文件：  

![性能报告.png](https://upload-images.jianshu.io/upload_images/1924341-e72d98c0987cee73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

在这份报告中，可以看到每个步骤，每个 task 的耗时，那么也就可以针对性的去优化这个构建过程，比如将一些没必要的 task 关闭掉，如 lint 检查，在 debug 过程中不断的打包、调试过程中也许没必要开启这个。

另外，所有的命令只要后面加上 `-profile` 即可生成报告文件，如 `gradlew assemble -profile`。

#### 6.6 关闭指定 task

**方式一**：`gradlew build -x lint`，增加参数 -x，后面跟着要关闭的 task 即可。

**方式二**： `project.gradle.startParameter.excludedTaskNames.add('lint')`，在 build.gradle 中增加这行代码

### 7. gradle 脚本  

**命令：**`apply from: 'xxx.gradle'`  

**解释：**`apply from` 是应用脚本插件，该脚本可以是本地的脚本，也可以是网络上的脚本，本地脚本时，from 后面填写脚本的相对路径名称即可，如果脚本文件跟 build.gradle 在同一层级，直接写脚本文件名即可。

如果是使用网络上的脚本，那么 from 后面填写该网络脚本的 url 地址即可。

**执行：**在项目里应用了一个脚本插件的时候，其实脚本里的代码就被运行了，而 Gradle 有一个 task 的概念，代码里是没办法直接触发某个 task 的执行的，但可以设置各个 task 之间的前后依赖关系。也就是说，脚本中 task 里 doLast{} 代码块里的工作需要外部去触发才会运行，那么这些工作该如何执行呢？两种方式：

- 命令行方式执行：在根目录下，借助 gradlew.bat 文件，执行在终端执行 `gradlew task名` 即可。
- Android Studio 图形界面操作方式：在 AS 右侧的 Gradle 面板里找到脚本中的 task，点击即可运行，这种方式最好给 task 设置 group 属性，这样可以非常方便寻找。

**实例：**可参考之前写的一篇博客：[再写个Gradle脚本干活去，解放双手](https://www.jianshu.com/p/36ecd23191d2)  

# 后记    

整本书介绍的内容确实不错，即使写了两篇笔记，但记录的也仅仅是平常比较常接触的一些知识点，还有一部分内容并没有去深入，比如：  

- 自定义 Gradle 插件
- Lint 检查配置，单元测试配置
- ...  

因为并没有这方面的需求，后续如果有再继续接触，再来慢慢补充。
