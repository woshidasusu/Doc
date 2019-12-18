# 声明

本篇内容摘抄自以下两个来源：

- [BootStrap中文网](http://www.bootcss.com/)

感谢大佬们的分享。

# 正文-响应式布局（BootStrap）

这次想来讲讲一个前端开发框架：BootStrap

BootStrap 目前已经出了 4 个版本，每个版本都有对应的官网教程，先来看看不同版本里的宣传语：

> 简洁、直观、强悍的前端开发框架，让web开发更迅速、简单。--- BootStrap 2.x.x 版本 

> Bootstrap 是最受欢迎的 HTML、CSS 和 JS 框架，用于开发响应式布局、移动设备优先的 WEB 项目。 --- BootStrap 3.x.x 版本

> Bootstrap 是全球最受欢迎的前端组件库，用于开发响应式布局、移动设备优先的 WEB 项目。
>
> Bootstrap 是一套用于 HTML、CSS 和 JS 开发的开源工具集。利用我们提供的 Sass 变量和大量 mixin、响应式栅格系统、可扩展的预制组件、基于 jQuery 的强大的插件系统，能够快速为你的想法开发出原型或者构建整个 app 。 --- BootStrap 4.x.x 版本

那么，什么是响应式布局呢？

通俗的理解，就是在不同的屏幕规格上能够有不同的布局效果，比如在大尺寸屏幕上呈现多列的布局，在小尺寸屏幕上呈现不了这么多，可能就只剩下一列布局了。

那么，当屏幕尺寸发生变化时，在不同屏幕规格上，应该呈现怎样的布局，一般是通过媒体查询 @Media 来实现，但自己在 CSS 中书写的话，需要处理较多工作。

所以，也可以选择一些热门的框架，由它来帮忙处理这些响应式布局的工作，就像 BootStrap，但 BootStrap 功能不仅只有响应式功能，它还内置了很多预制组件等等，总之，很强大，虽然我还没用过。

### 使用

那就来学学如何使用，首先第一步肯定是安装，我直接选择最新版 4.x.x 系列的来作为入手了，旧版本没去了解，有机会再说。

将 BootStrap 引入项目中使用有两种方式：

- 直接使用网上资源
- 将相关资源下载至本地使用

#### 使用网上资源

第一种方式最简单，直接在 HTML 文档中声明 css 和 js 文件来源即可，如：

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.bootcss.com/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.bootcss.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  </body>
</html>
```

使用 BootStrap，上面的 HTML 文档模板是必须的，带有注释的都是在所有使用了 BootStrap 的页面中需要引入的，需要注意的是，由于 BootStrap 一些组件依赖于 jQuery 和 Popper，所以需要引入这两份 js，而且顺序是 jQuery 先，Popper 后，最后再引入 BootStrap 提供的 bootstrap.min.js。

这是第一种方式，也是最省力的。

#### 将资源下载至本地使用

这种方式就比较折腾了，好处就在于资源文件都可以放在自己服务器上，无需依赖他人。下载资源到本地也有两种方式，一是手动到官网下载，下面三个地址：

[下载 BootStrap](https://v4.bootcss.com/docs/4.0/getting-started/download/)

[下载 jQuery](https://jquery.com/download/)

[下载 popper](https://github.com/FezVrasta/popper.js#installation)

二是利用一些工具来下载，如 node.js 的 npm 命令来下载，打开终端，进入项目的根目录：

1. `npm init -y` 

2. `npm install bootstrap`

3. `npm install jquery`

4. `npm install popper.js --save`

如果执行命令过程中报错了，自行去搜索解决吧，我是一次性成功，没出啥问题，都下载结束后，项目里的结构如下，node_modules 文件夹里会有下载好的资源：

![](https://upload-images.jianshu.io/upload_images/1924341-ab7880d54e0f6f7f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

package.json 配置项如下：

![](https://upload-images.jianshu.io/upload_images/1924341-ed196f8679e0e8ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这是我下载使用的版本。

好，不管是手动去下载，还是接着 npm 下载，最后都需要将下载的资源放进项目中，那么，下载下来的这么多东西，该怎么用，哪些是有用的？

可借鉴上面第一种方式里的 HTML 文档，总共需要的其实就四份文件：

- bootstrap.min.css
- jquery.slim.min.js
- popper.min.js
- bootstrap.min.js

分别找下四份文件在哪，我的是在这几个路径下：

```html
<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">

    <title>Hello, world!</title>
</head>
<body>
<h1>Hello, world!</h1>

<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="node_modules/jquery/dist/jquery.slim.min.js"></script>
<script src="node_modules/popper.js/dist/popper.min.js"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
</body>
</html>
```

官方教程说了，上面这是使用 BootStrap 的 HTML 模板，当然也有进行了解释，下面稍微说说：

`<!DOCTYPE html>`

这是 h5 的 HTML 文档的声明，不加这句的话，可能会出现一些奇怪的样式；

```
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
```

这行代码表示的意思是，让网页可以自动适应当前移动设备的屏幕。

所以，使用 BootStrap 除了需要在 HTML 文档中引入所需的资源文件外，别忘了加上上面两个处理。

### 官方示例

BootStrap 4.x.x 版本，官方还没有中文教程，3.x.x 的中文教程倒是很齐全了。但 4.x.x 版本和 3.x.x 版本差别还是蛮大的，首先，4.x.x 选用 Sass 来作为预处理器，选择 flex 来实现它的栅格布局系统等等。

反正，BootStrap 本质就就是一个框架，封装了一系列的属性样式、组件给开发者使用，开发者只要了解有哪些属性样式可以用、有哪些组件可以用、效果怎么样、怎么用就可以了，至于这些，就只能是一步步在实际开发中，一边写一边查文档来慢慢积累了。

所以，本篇也就不会去列举各个组件效果、属性样式效果、还一个个去说明怎么用。

接下去的内容，就是想着，能够读懂官方某个示例项目的代码就足够了。

选择了官方的这个示例：[Album](https://v4.bootcss.com/docs/4.0/examples/album/)

![](https://upload-images.jianshu.io/upload_images/1924341-5c07defdb2056bed.gif?imageMogr2/auto-orient/strip)      

一步步来读懂它的 HTML 代码吧：

- 第一步就是 HTML 的模板了，就上一小节中介绍的，需要进行 H5 声明、meta 声明、引入四个资源文件的那份模板；
- 第二步，来看看 \<body> 内的 \<header> 代码：

```html
<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">

    <title>Hello, world!</title>
</head>
<body>
<!--header 部分-->
<header>
    <div class="collapse bg-dark" id="navbarHeader">
        <div class="container">
            <div class="row">
                <div class="col-sm-8 col-md-7 py-4">
                    <h4 class="text-white">About</h4>
                    <p class="text-muted">Add some information about the album below, the author, or any other background context. Make it a few sentences long so folks can pick up some informative tidbits. Then, link them off to some social networking sites or contact information.</p>
                </div>
                <div class="col-sm-4 offset-md-1 py-4">
                    <h4 class="text-white">Contact</h4>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white">Follow on Twitter</a></li>
                        <li><a href="#" class="text-white">Like on Facebook</a></li>
                        <li><a href="#" class="text-white">Email me</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="navbar navbar-dark bg-dark box-shadow">
        <div class="container d-flex justify-content-between">
            <a href="#" class="navbar-brand d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <strong>Album</strong>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </div>
</header>

<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="node_modules/jquery/dist/jquery.slim.min.js"></script>
<script src="node_modules/popper.js/dist/popper.min.js"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
</body>
</html>
```

看看效果：

![](https://upload-images.jianshu.io/upload_images/1924341-3121815420e6b629.gif?imageMogr2/auto-orient/strip)  

目前的代码里，我们完全没有写过 CSS，只在 HTML 文档中，添加了 \<header> 标签内容，就能够达到这样的页面效果了，所以，其实，BootStrap 已经封装好了一大堆属性样式，我们只要在标签上通过 class 将这些属性样式应用起来就可以了。

示例中使用的 class 很多，基本都是 BootStrap 封装好的，我也没想把所有用到的都搞清楚具体作用，只是想了解个大概，后续在使用中慢慢积累学习吧。

对于这个 \<header> 的效果，我主要想理清楚两点：

- 展开和折叠是怎么实现的？
- 展开时那些列表是如何实现的？

回过头看上面的动图，\<header> 部分是作为导航栏，并且存在两种状态，折叠和展开，所以两种状态对应着两个 \<div>，\<header> 儿子标签里刚好两个 \<div>；

看第一个 \<div> 的 class：`collapse bg-dark`，collapse 是折叠的意思，所以第一个 \<div> 就是一开始被折叠的容器，而控制这个 \<div> 折叠起来，也就是 BootStrap 提供的 collapse 起的作用了；

同层次的第二个 \<div> 的 class：`navbar navbar-dark bg-dark box-shadow`，两个 \<div> 都有同一个 bg-dark，那么这个其实就是用来设置背景的，因为展开后，其实 \<header> 区域是由两个 \<div> 拼接起来的，只是背景色刚好一样，看不出来而已。

所以，页面渲染后，其实有个 \<div> 被 collapse 折叠起来了，此时页面上只呈现第二个 \<div> 内容而已，这个 \<div> 的高度等样式由 navbar、navbar-dark、bg-dark 这些决定。

那么，点击完按钮后，第一个 \<div> 为什么会被展开了呢？

看一下那个按钮：

```html
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
```

\<button> 的子标签 \<span> 里的那个 navbar-toggler-icon 就是按钮的 icon，而之所以点击了后可以展开第一个 \<div> 就是由其他属性来控制。

首先，需要对当前这个按钮添加 navbar-toggler 的 class，然后需要通过 data-target 指明控制展开的区域，这也是为什么第一个 \<div> 中会有一个 id 属性，就是用来给这个按钮控制它的。

所以，梳理一下，通过给 \<div> 添加 collapse 的 class 可以让这个区域折叠隐藏起来，然后给它设置一个 id；然后给控制这个折叠区域的按钮添加 data-toggle 和 data-target 属性，通过 id 来控制指定区域的折叠和展开。

至于其他 class 则是各种样式效果。

那么，展开之后的区域里的列表控件上，出现了一些例如：row，col-sm-8 之类的 class，这些又是什么意思呢？

首先，container 来设定区域的大小，row 用来设置这个容器作为 flex 布局，而弹性布局中，一行会被划分成 12 列，看张图：

![](https://upload-images.jianshu.io/upload_images/1924341-03a91e133e27d79b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

所以 col-sm-8 表示当显示区域 >= 576px 时，该控件占据 8 列，所以，同一个控件里会出现诸如：`col-sm-8 col-md-7` 其实就是响应式布局处理，在不同显示区域大小时，呈现不同的大小。

而 py-4 是 pading-top 的意思，-4 表示不同的大小。

offset 表示在一个 12 列的一行里，前面需要空出几列。

总之，[官方教程里有对栅格系统 Grid](https://getbootstrap.com/docs/4.0/layout/grid/) 做了详细的介绍，虽然是英文的，慢慢啃吧。

只有理清楚了这篇文章中介绍的 Grid，才能够理解，怎么写可以达到响应式的效果。

我们再来看导航栏的一个效果，我再来分析下：

![](https://upload-images.jianshu.io/upload_images/1924341-a4bfb71b4f52e683.gif?imageMogr2/auto-orient/strip)  

当显示区域逐渐变小时，布局从一行变成了两行，这就是响应式布局，来解释下为什么会有这个行为：

看看这两个区域的代码：

```html
<div class="col-sm-8 col-md-7 py-4">
...
</div>

<div class="col-sm-4 offset-md-1 py-4">
...
</div>
```

上面说过，BootStrap 里的 Grid 将每一行划分成 12 列，所以当显示区域大小在 md 范围，即 >= 768px 情况下，第一个 \<div> 的 col-md-7 生效，它占据 7 列的宽度，第二个 \<div> 的 offset-md-1 和 col-sm-4 都生效，所以它前面空着 1 列的宽度，然后它占据着 4 列的宽度，这加起来是不是刚好 12 列，所以在 >= 768 时，一行可以放下这两个 \<div>。

但当显示区域逐渐缩小，当进入 sm 范围，即 >= 576px 时，此时，第一个 \<div> 的 col-sm-8 生效，所以它占据 8 列，而第二个 \<div> 仍旧是 offset-md-1 和 col-sm-4 生效，那么此时加起来一共 13 列，超过了 12 列，一行里已经不足够放这两个 \<div> 了，根据 flex 的弹性布局，此时超过的会自动换行。

以上，就是我对 Grid 的理解，也许有误，如果是错的，等后续用熟悉了再回来改，大伙看的时候，就当个借鉴看一看就好了。

分析到这里，大概清楚了 Grid 还有导航栏的一些用法了，也大体清楚 BootStrap 的响应式原理好像是基于它的栅格系统，通过为不同控件设置诸如 col-(sm/md/ls/xl)-(1/2/3/4/5/6/7/8/9/10/11/12) 来达到在不同显示区域下，不一样的布局效果，实现响应式布局。

所以，剩余的代码不想看了，头有点懵了，我对 BootStrap 唯一的感觉就是，学习成本好高，它提供太多东西了，封装了太多的样式、控件，反而不知道从哪看。

也许，本来就不需要特意去看，学习 BootStrap 应该是当需要时，再来查阅文档，然后逐步，慢慢积累对 BootStrap 的熟悉程度，而不是一开始就来看细看文档，文档当然要看，但快速过一遍，大概清楚提供了哪些东西就好了。 

 



