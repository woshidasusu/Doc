这一年来陆陆续续写了 6 篇 Gradle 相关的博客，本篇便来做一下汇总梳理，方便查阅，也分享给大伙。

# 系列博客  

1. [看不懂的 build.gradle 代码](https://www.jianshu.com/p/a3805905a5c7)

   [https://www.jianshu.com/p/a3805905a5c7](https://www.jianshu.com/p/a3805905a5c7)

   

2. [学点Groovy来理解build.gradle代码](https://www.jianshu.com/p/501726c979b1)  

   [https://www.jianshu.com/p/501726c979b1](https://www.jianshu.com/p/501726c979b1)  



3. [如何用Android Studio查看build.gradle源码](https://www.jianshu.com/p/28bb90e565de)

   [https://www.jianshu.com/p/28bb90e565de](https://www.jianshu.com/p/28bb90e565de)



4. [读书笔记--Android Gradle权威指南（上）](https://www.jianshu.com/p/718b4927f425)

   [https://www.jianshu.com/p/718b4927f425](https://www.jianshu.com/p/718b4927f425)

   

5. [读书笔记--Android Gradle权威指南（下）](https://www.jianshu.com/p/238eecc9c08d) 

   [https://www.jianshu.com/p/238eecc9c08d](https://www.jianshu.com/p/238eecc9c08d)

   

6. [再写个Gradle脚本干活去，解放双手](https://www.jianshu.com/p/36ecd23191d2)

   [https://www.jianshu.com/p/36ecd23191d2](https://www.jianshu.com/p/36ecd23191d2)

# 博客概要  

### 1. 看不懂的 build.gradle 代码

本篇是以 drakeet 大神的 [Meizi](https://link.jianshu.com/?t=https%3A%2F%2Fgithub.com%2Fdrakeet%2FMeizhi) 项目里的 build.gradle 为例来初步接触 build.gradle，因为大神的 build.gradle 用到了挺多平常不常用到的特性，而且是很实用的功能。

以此为敲门砖来开始学习 Gradle 相关知识点。

### 2. 学点 Groovy 来理解 build.gradle 代码

由于 Gradle 是基于 Groovy 语言的，了解一下 Groovy 语言的语法特性，对于理解 build.gradle 里的代码有一定的帮助，因此第二篇就是来介绍 Groovy 的相关特性。

但由于 Groovy 又是基于 Java，而且完美兼容 Java，所以本篇重点在于介绍 Groovy 与 Java 之间的不同点，学完本篇也就清楚为什么说 build.gradle 里一行行的代码大部分都是在调用对应的方法。

### 3. 如何用 Android Studio 查看 build.gradle 源码  

学完第二篇，我们就清楚了原来 build.gradle 里一行行的配置项，其实都是在调用某个方法，那么如果可以直接看到对应源码的注释说明，对于一些没看过的配置项也可以直接去看注释来理解，或者通过源码来搜索是否还有其他可选配置项。

说了是源码，其实分两部分，一部分是 Android Gradle 插件的源码，但由于某些原因，可能 Android Studio 并没有将源码下载下来，那么就需要自己去下载了，所以本篇介绍的如何自行去下载 Android Gradle 插件的源码。

还有一部分是 Gradle 的源码，但这个通常都会下载成功，这个通常不用过多关注。

另外，本篇正文中介绍的下载方法，目前已经下载不到新版的 Android Gradle 插件的源码了，只能下载旧版本的源码，新版本的下载方法来评论区有人已经给出，在文章开头也有提到。

### 4. 读书笔记--Androoid Gradle 权威指南（上）  

前三篇都是基于 build.gradle 为入手点，来学习相关知识。第四篇开始，通过《Android 权威指南》一书来较为系统的学习相关知识点，所以第四篇和第五篇都是针对这本书所做的笔记内容，记录一些自己的理解和较为重要的点。

### 5. 读书笔记--Android Gradle 权威指南（下）  

本篇和上一篇的内容是前后衔接，分两篇对《Android Gradle》一书来做总结，总结的点如下：  

> 1. Groovy 基础
>
> 2. Android 项目中的 Gradle
>    2.1 gradle/wrapper 目录
>    2.2 gradlew.bat 文件
>    2.3 setting.gradle 文件
>    2.4 build.gradle 文
>
> 3. Gradle 基础
>    3.1 task 概念
>    3.2 gradle 插件概念
>
> 4. 区分 Gradle 和 Android Gradle
>
> 5. build.gradle 代码
>
>    5.1 apply plugin: 'com.android.application'
>
>    5.2 android {}
>
>    5.3 buildTypes {}
>
>    5.4 productFlavors {}
>
>    5.5 flavorDimensions
>
>    5.6 applicationVariants
>
>    5.7 buildToolsVersion
>
>    5.8 其他
>
> 6. Gradle 各种技巧
>
>    6.1 批量修改生成的 apk 文件名
>
>    6.2 System.getenv()
>
>    6.3 动态配置 AndroidManifest.xml 文件
>
>    6.4 美团黑科技多渠道打包
>
>    6.5 Gradle 性能检测
>
>    6.6 关闭指定 task
>
> 7. gradle 脚本

通过这两篇，应该要学习到 Gradle 和 Android Gradle 插件这两个概念，以及清楚为什么需要这些配置，以及搞懂为什么有时候打开一个 Github 上的新项目时会一直卡在构建中，以及掌握 build.gradle 中各种配置项的作用。

### 6. 再写个 Gradle 脚本干活去，解放双手  

基于前面所学到的 Gradle 的基础知识，本篇就可以来应用到一些具体场景中，比如通过写 Gradle 脚本来做一些重复性，手工性的工作。

那么脚本所涉及到的工作，大概就是文件的遍历工作，java 命令的执行，以及字符串的处理。

# 后记  

Gradle 系列的相关博客就暂时到此告一段落了，虽然仍然还有一部分知识没涉及到，比如如何自定义 Gradle 插件等等，由于没有相关方面的需求，等待后续有接触时再来继续补充。

