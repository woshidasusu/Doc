这篇来讲讲如何在 Android Studio 上同时用 SVN 和 Git 来管理项目。我知道，你肯定会说我吃饱了撑着，没事找事做，为啥要同时用 SVN 和 Git 来管理项目。问题是，我也不想啊，我也很无奈啊（:(哭丧脸）。  

# 为啥要同时用 SVN 和 Git 管理项目  
这小题目也可以叫做使用场景  

是这样的，我之所以要同时用两个工具来管理项目，是因为，项目原先是用 SVN 管理的，SVN 虽然使用简单，但分支功能远没有 Git 那么好用，如果一开始项目就是用 Git 来管理，我就不会去瞎折腾了，但公司项目都是通过 SVN 来管理，所以，我绝对不是因为喜欢瞎折腾才来搞这个的（严肃脸$_$）。  

来说说我的遇到的问题  

有个项目由于种种原因，需要尝试替换图片框架，而这个项目前期开发时并没有考虑到这点，所以，emmm，你知道的，需要改动到的地方太多了。产品想要的是稳定性，所以对于换框架的事也不急，我也就抽空做做。  

然后，这时候还是得并行处理一些 Bug。  

再然后，没多久，新的迭代又开始了，所以我这边是需要并行处理几个工作的，这几个工作肯定是需要单独分开的，都需要开个分支来做，以免影响主分支的代码。  

**而 SVN 开分支，我只知道这相当于对主分支的代码 Copy 了几份过去，所以说，如果我要换分支开发，等于说我要用 Android Studio 打开多个项目**，就像这样：  

![svn开分支.png](http://upload-images.jianshu.io/upload_images/1924341-c4c3e1bc22a67644.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

每次换分支，都要重新打开一个项目，要是分支多了，电脑上就得对应多个文件夹，时间一长不就乱套了，而且你们知道，我们最多就是在项目外再建一个文件夹通过命名来区分不同的分支，但是 AS 的 open recent 里是不会显示外面那层文件夹的，结果就是一个列表下来都是同名的项目，我都不知道哪个是哪个，头疼之下，我突然很想念 Git 的分支功能，所以就瞎搞了半天来看看怎么用 Git 配合 SVN 管理项目。  

# 操作  
我的使用方式是：  
>1. SVN：同步远程仓库代码和提交操作  
>2. Git：本地管理项目，方便开分支  

#### 第1步  
首先，项目已经通过 SVN 在管理了，所以我们只要**去根目录下执行下 `git init` 将项目也添加进 Git 管理**。  

这时候，根目录下是有 .svn 和 .git 的隐藏文件的。  

#### 第2步（重要）  
**新建或找到 .gitignore 文件，将 .svn 添加进 Git 的忽略名单里。**  

SVN 通过 .svn 来管理项目， Git 通过 .git 来管理。如果没有将 .svn 添加进 .gitignore 中的话，那 svn 就会受到 git 回退，切分支等等操作的影响了，我们应该让这两个工具都独立工作，不要影响彼此。所以，你还可以去 svn 的配置里也把 .git 添加进忽略里，但这点不是必要的，如果 SVN 只用于同步和提交操作的话，再说，也很少对通过 SVN 对整个项目进行回退等操作，所以 SVN 对 .git 文件夹的影响不大。  

#### 第3步（重要）  
对 Git 进行如下的配置：  

**git config --global core.autocrlf false**  
**git config --global core.safecrlf false**  

如果你是用 Window 开发的话，这个配置一定要在 `git init` 后，首次执行 `git add` 前配置好，否则你会掉入一个大坑里的，我在这个坑了爬了好久。  

原因是这样的，Window 下换行符是 CRLF，但是 Git bash 是基于 Linux 的，所以它的换行符是 LF，默认情况下，当你执行 `git add`， `git commit`， 的时候，会自动将代码里的 CRLF 替换成 LF 的，所以会出现这样一种情况：  

Local Changes 里是没有任何文件改动记录的，也就是说 SVN 和 Git 当前的工作区间没有改动什么文件，然后你通过 Git 切换到分支上去，开发完后再切回主分支时，按理说，现在的 Local Changes 里应该是要没有任何东西的，但是你会发现，就有一些文件被改动的记录，然后你 show diff 查看这些改动的文件，你会发现两边代码一模一样，没有任何一处是有改动到的，唯一不同的就是 CRLF 和 LF，就想这样：  

![show diff.png](http://upload-images.jianshu.io/upload_images/1924341-99e3029897b4cb79.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

经常使用 AS 的 show diff 应该对这个很熟悉，两边明明没有任何代码上的改动对比，就是因为 CRLF 和 LF 的问题，导致这个文件出现在了 Local Changes 里。  

![Local Changes.png](http://upload-images.jianshu.io/upload_images/1924341-58762b0755ae63f6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

而我们在写完代码提交到远程仓库时，经常都是通过这个 Local Changes 面板来选择一些文件进行提交，很少会对整个文件夹提交，因为可能开发过程中改动到其他地方，所以提交前我都习惯先来这边过一遍。  

但因为这个 CRLF 和 LF 的问题，会导致这边 Local Changes 乱套的。而上面那两句 git 命令就是设置默认文件原本的换行符格式，不对其发起警告也不对其自动替换。  

#### 第4步  
经过上面几步操作后，接下去你就可以执行  
`git add`  
`git commit`  
`git checkout -b XXXbranch`  
`git checkout master`  

等等的 git 分支相关的操作了。  

# AS 上同时使用 SVN 和 Git  
以上可以说只是完成首次使用的配置而已，接下去才是我们想要的。 AS 提供的 Version Control 图形操作界面非常方便和好用，我就是因为喜欢 AS 这点，才想用 Git 来管理项目。如果对 AS 上 Git 的使用不熟悉的话，可以去看看[我之前写的一篇简单介绍的博客](http://www.cnblogs.com/dasusu/p/5372840.html)。AS 上 SVN 的操作跟 Git 基本一致。  

那么，**到底可不可以在 AS 上既用 SVN 又用 Git 呢？可以是可以，但会有点小问题**。  
![settings_versionControl.png](http://upload-images.jianshu.io/upload_images/1924341-b5506a9ec973d81f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

首次打开先去 Settings->Version Control 里配置一下，然后你就会在底部栏发现 AS 提供的各个版本操作工具了。  
![AS的各个VersionControl面板.png](http://upload-images.jianshu.io/upload_images/1924341-e202bb233a852f7f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

以上几个 AS 的面板都非常好用，既可以查看历史提交的代码信息，本地的修改信息，还可以比对各个提交的不同等等。  

但 AS 如果同时使用 SVN 和 Git 的话，Local Changes 这边就只会显示 Git 的本地修改了。也就是说，如果 SVN 记录的本地修改和 Git 不同的话，这里只会显示 Git 记录的信息。而且，如果是只使用 SVN 的情况下，我们可以在这里直接通过右键来提交我们选中的修改到 SVN 上。但如果 SVN 和 Git 同时使用，SVN 的 commit 功能就失效了，就只有 Git 的 commit 和 push 可以用，但我们又不需要 Git 的 push，它只作为本地管理使用而已，所以小问题就是在这里了。  

**至于解决方法，也很简单，但稍微有些麻烦**。也就是你每次要用 SVN 提交代码的时候，再去 Settings->Version Control 里将 Git 管理的目录暂时移除掉，只保留 SVN 的。  

emmm，这样操作还是有点麻烦，每次提交都要去移除。但相对于再打开一个项目来开发分支的操作算是好了一点了。  

**还有一种方法，也是我目前在使用的方法：**  

AS 只添加 SVN，这样 SVN 的功能就能正常使用了。然后 Git 的建分支，切分支等等操作都通过 git bash 命令行方式来执行，搞定。  

这下，再也不用担心 SVN 建分支要重新打开项目了，好棒。