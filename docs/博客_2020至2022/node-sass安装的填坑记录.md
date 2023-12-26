# node-sass 埋坑记录

### 背景

原有项目、环境：

node：v8.16.2

npm：v6.4.1

node-sass:：v4.8.0

Angular-CLI：v6.x

本机没有安装 Visual Studio

以上是涉及到的工具的版本，可正常使用，项目运行良好。



后来，接手的新项目中：

Angular-CLI：v8.x

由于升级了 Angular 版本，同样也升级了 Angular-CLI 版本，导致 v8.x 版本的 node 已经无法编译 angular 项目，至少需要使用 node v10.x 版本。

无奈，升级了 node 版本，随之而来的就是 node-sass v4.8.0 版本无法使用，又导致构建失败，所以又得安装新版本 node-sass。

但 node-sass 新版本安装过程却又报找不到 Python 环境错误，导致 install 失败。

好不容易在本地安装了 Python 环境，又报了个 MSB4132：无法识别工具版本 2.0 的错误。

在网上查了半天，跟着改，却又出现新错误 MSB4019：Microsoft.Cpp.Default.props 找不到的错误。

找了下，发现是因为本机没有 VS C++ 的编辑工具，可以借助：

`npm install -g --production windows.build.tools` 

来下载安装，试了下，发现是需要联网才行，办公网络没外网。

官网看了半天，找到了下载离线安装包方式、结果却是 2019 版本，太新，项目仍旧报错。

(what the fuck!

### 相关异常

- **error MSB4019**

```verilog
gyp info spawn xxx
error MSB4019：未找到导入的项目 "E:\Microsoft.Cpp.Default.props"。请确认 <Import> 声明中的路径正确，且磁盘上存在该文件

gyp ERR! stack Error `C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe` failed with exit code: 1
```

- **error MSB4132**

```verilog
gyp verb Not using VS2017: Could not use PowerShell to find VS2017
...
gyp verb could not find "msbuild.exe" in PATH - finding location in registry
...
MSBUILD : error MSB4132: 无法识别工具版本“2.0”。可用的工具版本为 "4.0"。
```

- **python not found**

```verilog
gyp verb check python checking for Python executable "python2" in the PATH
gyp verb `which` failed Error: not found: python2
```

- **a bug in node-gyp**

```verilog
gyp ERR! This is a bug in `node-gyp`.
gyp ERR! Try to update node-gyp and file an Issue if it does not help
```

### 分析

归根结底，就是因为办公网络被限制访问外网导致。

毕竟升级了 angular 大版本，随之而来的一些依赖库也需要跟着升级，这无可厚非，可以理解，所以当让我也升级 node-sass 时，我没啥反感。

但谁知道，node-sass 新版的下载需要依赖 C++ 的编译环境、需要依赖 python 环境，虽然到这里有点烦了，但还好，网上也很多人出现这问题，解决方案不难，如下：

```
npm install --global --production windows-build-tools 
```

windows-build-tools 的介绍可以看看官方网站：

[https://www.npmjs.com/package/windows-build-tools](https://www.npmjs.com/package/windows-build-tools)

这条命令，其实就是会自动去联网下载 Visual C++ Build Tools 和安装 Python 2.7 环境，一键式命令。

但，我的办公网络无法访问外网啊！

虽然有内网的 Npm 仓库，但也只下载了 windows-build-tools 这个包，这包里是一堆去访问外网下载东西的脚本啊，对我来说，这解决方案没用啊！

无奈下，只能自己安装，Python 还好，网上搜一下，安装 + 配置环境变量即可。

问题就在于 Visual C++ Build Tools，这个 Mircosoft 的东西，要搞离线安装，是真的麻烦。

这里有官方的教程（虽然没怎么看懂），以及网上大佬的教程，链接都贴出来，我这里就大概讲讲，感兴趣，自行查阅：

- [创建 Visual Studio 的网络安装](https://docs.microsoft.com/zh-cn/visualstudio/install/create-a-network-installation-of-visual-studio?view=vs-2019)
- [node 安装 windows-build-tools](https://feidao-edu.gitee.io/dingzk/201811291736)

#### 小结

之所以以前正常，新项目出现种种问题，原因在于各环境的版本升级，所以，需要明确，各个环境、框架之间都是有依赖关系的，不是任意版本组合就可以的，比如：

angular v8 版本就需要依赖 angular-cli 到 v8.x 版本；

angular-cli v8.x 版本就需要依赖 node 到 v10.x 版本；

node-sass v4.8 只支持到 node v9 版本；

所以，当需要升级 angular 版本时，请注意这些事项，具体的依赖关系，请到各自的官网中查看说明。

### 解决方案

#### 能联网

1. 先升级 angular 版本，再升级 angular-cli 版本
2. 构建失败时，会提示请升级 node 版本，按提示升级，可通过 nvm 或手动下载新版本 node
3. 继续构建时，node-sass 下载失败
   1. 请先确认是否是镜像问题，可以手动在浏览器地址栏输入 node-sass 下载的地址（可在 package.json.lock 中查看），看是否能够找到对应版本的 node-sass
   2. 出现文章开头说过的几种 node-sass 编译错误时，注意日志，根据不同错误，搜索相关关键词，按网上教程解决，通常来说就是没有 python 环境、没有 c++ 编译工具、vs 版本过高等问题，可以试试通过 npm 安装 windows-build-tools 来自动下载安装这些工具试试

建议多去相关库的 github 的 issue 里找找，通常都能找到你遇到的问题

#### 不能联网

办公网络通常无法访问外网，但都会有自己内部的镜像仓库，所以下载基本的 node 之类的库是没有问题的，上面的解决步骤也一样可以参考执行。

不能访问外网最重要的一点就是，windows 的东西没法下载，比如上面的 windows-build-tools 自动去下载 vs c++ 的编译工具就下载不了。

这时候，如果需要，那就只能在能访问外网的机子上，将 vs studio 相关东西先下载下来，再用离线方式进行安装。

其实，我最后即使离线安装了 vs studio 2019 的版本之后，node-sass 仍旧还是下载失败，最后，实在没时间去研究了，干脆在能访问外网的机子上面，也安装同版本的 node，然后成功下载好 node-sass 之后，将这个 node-sass 包直接拷贝到办公机子上面使用了。

### 参考链接

以下是很多很多的链接，有的有提出解决方案，有的没有，自取：

- [Cannot compile node-sass with Visual Studio 2019 installed](https://github.com/sass/node-sass/issues/2700)
- [Error in build npm install node-sass](https://github.com/nodejs/node-gyp/issues/1960)
- [node-sass 安装失败的各种坑](https://www.jianshu.com/p/92afe92db99f)
- [MSBUILD : error MSB4132: 无法识别工具版本“2.0”。可用的工具版本为 "14.0", "4.0"。 what‘s wrong?](https://github.com/mapbox/node-sqlite3/issues/548)
- [node 安装 windows-build-tools](https://feidao-edu.gitee.io/dingzk/201811291736)
- [创建 Visual Studio 的脱机安装](https://docs.microsoft.com/zh-cn/visualstudio/install/create-an-offline-installation-of-visual-studio?view=vs-2019#use-the-command-line-to-create-a-local-cache)