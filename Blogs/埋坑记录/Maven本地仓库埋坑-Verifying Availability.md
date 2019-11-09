# 记一次 Maven 本地仓库埋坑之 Verifying Availability

### 背景

某 Java 后端项目使用 maven 构建，因为某些原因，某些依赖库下载不了，直接找其它人索要了他电脑上的 maven 本地仓库里的依赖包。

然后直接拷贝到我电脑的本地 maven 仓库里，但构建项目时，发现，仍旧报找不到依赖包也下载不了的错误，导致项目构建不起来。

### 异常信息

以上是背景，下面是构建过程出现的一些异常：

- The Pom for xxx.jar is missing, no dependency information available

```
[WARNING] The POM for xxx:jar:5.1-RELEASE is missing, no dependency information available
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 2.992 s
[INFO] Finished at: 2019-11-09T13:21:15+08:00
[INFO] Final Memory: 15M/300M
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal on project xxx-app: Could not resolve dependencies for project xxx: Failure to find xxx:jar:5.1-RELEASE in http://maven.aliyun.com/nexus/content/groups/public was cached in the local repository, resolution will not be reattempted until the update interval of nexus-aliyun has elapsed or updates are forced -> [Help 1]
[ERROR] 
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR] 
```

### 分析

我们知道，maven 仓库有本地仓库、镜像仓库、仓库中心之说。

除了本地仓库，其他都位于远程服务器上，如果远程仓库里确实没有我们需要的依赖包，那自然就下载不了，这点可以理解。

**但为什么明明我们已经从其他地方拿到依赖包，把它放到本地仓库里了，为何构建项目时，不直接去本地仓库里拿依赖包呢？**

可能你会觉得是不是 idea 的问题，相信你也尝试过设置 idea 的 maven 相关配置，比如开启 offline 模式、设置本地仓库地址、配置文件，甚至去 maven 的配置文件中修改各种配置项。

可能你会觉得是不是 idea 缓存了项目的配置问题，然后去重启 idea，去删除 .idea 文件，去重新 import 项目。

但最后，问题还是一样，还是报找不到依赖包错误。

**明明你的同事也是将依赖包放到本地而已啊，明明你的依赖包就是从同事那里拷过来的，为何他项目可以成功构建，而你的不行呢？**

原因其实我也不知道，而且因为异常信息过少，网络上搜索类似 maven 本地依赖包不起作用之类的关键词，也仍旧找不到解决方案。

后来，为了知道更多异常信息，参考上面异常时给出的建议，在执行构建命令时，带上了 -e -X 参数：

```
[DEBUG] Verifying availability of C:\Users\suxq\.m2\repository\com\xxx\5.1-RELEASE\xxx-5.1-RELEASE.pom from [nexus-aliyun (http://maven.aliyun.com/nexus/content/groups/public, default, releases+snapshots)]

[WARNING] The POM for com.chinanetcenter.light:web:jar:5.1-RELEASE is missing, no dependency information available
```

看来，构建过程，确实会先去本地读取依赖包，从上面那个 Verifying availability ... 日志就可以看出。

这条日志说明会去本地 maven 仓库验证依赖包是否可用。

**那么关键就在于，验证本地依赖包是否可用的依据到底是什么呢？**

从整条日志的意思中可以大概猜测，它应该是去远程仓库中读取依赖包的信息来跟本地的进行验证，毕竟日志上有一个 from，很难不让人这么猜测。

那如果真是这样，这里的验证肯定就通不过了，因为远程仓库里并没有这几个依赖包（因为某些原因）。

然后，我在网络上搜索了 Verifying availability 关键词，找到了这么一篇：

[maven创建离线本地仓库的坑之verifying availability](https://blog.csdn.net/jkler_doyourself/article/details/95772945)

文章里说了，将本地仓库的依赖包目录下的 **__remote.repositories** 文件删掉，本地依赖包就可以正常使用了，尝试了下，确实可行，搞定！

好奇之下，搜索了相关资源，找到这些一些文章：

[maven仓库中的LastUpdated文件生成原因及删除](https://blog.csdn.net/u011990675/article/details/80066897)

[使用Maven，即使存在*.lastUpdated文件也能更新jar文件的方法](https://blog.csdn.net/zhu19774279/article/details/8563796)

看了下，大概就是说，maven 在下载依赖包过程中，如果因为某些原因没有成功下载，那么本地就会生成诸如 xxx.repositories 或 xxx.lastUpdated 之类的文件。

一旦本地有这些文件，那么就意味着本地的依赖包可能不完整，需要先进行验证是否可用，才能被使用。

那么，如何验证呢？自然就是再去这些临时文件中记载的远程仓库重新读取一遍依赖包的相关信息来跟本地比对，确认本地依赖包是否可用。

**这也就是为什么，明明开启了 offline 离线模式，明明从其他人那里拷贝了相关依赖包到本地，但构建过程却依据需要联网的原因？因为你本地的依赖包里有这些临时文件，表明本地依赖包可能不是完整包，不能直接被使用，需要先进行验证，自然就需要联网了。**

**这也是本地有依赖包，但每次却又去远程仓库，然后找不到，又报异常的原因。**

所以，结论就一点：

不是说，你本地 Maven 仓库里有依赖包，构建过程就可以优先被使用，你还要确保你本地的依赖包是完整、可用的才行。

如何确认呢？就是依赖包目录中，没有像 xxx.repositories 或 xxx.lastUpdated 之类的文件。

如果你能确保你的本地依赖包是完整、可用的，那手动将这些文件删掉，构建过程就不会再联网去远程仓库验证了，就可以优先使用本地依赖包了。

### 解决方案

本篇的背景所遇到的文件，解决方案就一句话：

将 Maven 本地仓库里，找同事拷过来的那个依赖包目录中，将 **xxx.repositories** 文件删掉，再重新构建项目即可。

至于想知其所以然，看上面分析那个小节的内容即可。

注：解决这类问题时，找准关键词，一般就能在网络上找到解决方案了。

