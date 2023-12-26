# 声明

本篇内容梳理自以下几个来源：

- [Github:smyhvae/web](https://github.com/smyhvae/Web)
- [Bootstrap网站的 less 文档](https://less.bootcss.com/) 
- [Sass中文网](https://www.sasscss.com/)

感谢大佬们的分享。

# 正文-CSS预处理（less&Sass）

### CSS预处理

什么是 CSS 预处理？为什么要有 CSS 预处理？

这里就讲讲这两个问题，写过 CSS 应该就会比较清楚，虽然我才刚入门，但在写一些练手时就已经有点感觉了：写 CSS 后，很难维护，维护基本要靠注释来，而且由于 HTML 文档中标签的嵌套层次复杂，导致写 CSS 的选择器时也很费劲，尤其是在后期为某部分标签新增样式时，总会不知道到底应该在 CSS 文件中哪里写这个选择器，这个选择器是否会与前面冲突。

最有感觉的一点是，CSS 代码基本没法复用，一个页面一份 CSS，每次都需要重写，只是很多时候，可以直接去旧的里面复制粘贴。

有这么些问题是因为 CSS 本身并不是一门编程语言，它只是一个标记语言，静态语言，不具备编程语言的特性，所以写容易，但维护会比较难。

这个时候，CSS 预处理器就出现了，其实应该是说 Sass 和 Less 这类语言出现了。

Sass 和 Less 这类语言，其实可以理解成 CSS 的超集，也就是它们是基于 CSS 原本的语法格式基础上，增加了编程语言的特性，如变量的使用、逻辑语句的支持、函数等。让 CSS 代码更容易维护和复用。

但浏览器最终肯定是只认识 CSS 文件的，它并无法处理 CSS 中的那些变量、逻辑语句，所以需要有一个编译的过程，将 Sass 或 Less 写的代码转换成标准的 CSS 代码，这个过程就称为 CSS 预处理。 

所以，CSS 预处理器其实只是一个过程的称呼，主要工作就是将源代码编译并输出标准的 CSS 文件，而这个源代码可以用 Sass 写，也可以用 Less，当然还有其他很多种语言。

那么，到底哪一种语言好，我还没能力来讨论，反正存在即有理，每种语言总它的优缺点、总有它的适用场景。

下面，主要就来介绍下其中的两种语言：Less 和 Sass。

我觉得，掌握 CSS 预处理的关键，其实也就两点，一是掌握语言的语法、二是清楚怎么编译成标准的 CSS 文件；语法基本都不会很难，编译一般需要配置一些环境，因为我使用的开发工具是 WebStrom，所以会介绍下 WebStrom 上的配置。

### Less

#### 使用

Less 写的 CSS 文件后缀名为 `.less`，但浏览器并不认识 less 文件，所以最后需要转换成 css 文件，有两种方式：

- **借助 less.js**，程序运行期间，浏览器会自动借助 less.js 来解析 less 文件内的代码，转成 css 标准语法

这种方式，不需要配置任何其他环境，只需要下载 less.js，并在项目中使用即可，但有几点需要注意：

```html
<head>
    <!--link标签需要设置 rel=stylesheet/less, less.js的加载需要放在所有 link 标签后面-->
    <link rel="stylesheet/less" type="text/css" href="css/src/main.less"/>
    <link rel="stylesheet/less" type="text/css" href="css/src/test.less"/>
    <script src="js/lib/less.js"></script>
</head>
```

HTML 文档通过 link 标签引入 less 文件时，需要将 link 标签的 rel 属性设置为 stylesheet/less，否则无效；

而且，用 \<script> 标签加载 less.js 的代码需要放在最后，即所有用 link 标签引入 less 文件的后面，因为 less.js 文件加载成功后就会去将 less 转成 css 标准样式，在 \<script> 标签后面才用 link 标签引入的那些 less 文件就无法被转换了。

[less.js 下载地址：https://github.com/less/less.js/releases](https://github.com/less/less.js/releases)

- **借助 node.js 环境**，安装完 less 后，执行 lessc 命令

第一种方式，虽然便捷，但会让页面的渲染多了一个转换步骤，延长页面渲染时长，所以，还可以用第二种方式，直接在本地将 less 转成 css 文件后，项目直接使用转换后输出的 css 文件。

假设你已经在电脑上安装了 node.js 了，如果还没有，先去网上自行搜索下教程，很多，也很快。

首次使用需要先安装 less，打开终端，执行下述命令：

`npm install -g less`

安装完后，就可以使用 lessc 命令，如：

`lessc main.less main.css`

这是最简单的用法，将 main.less 文件编译输出 main.css；还有其他高级的用法，比如顺便压缩 css 文件，输出 .min.css 文件等等。

#### WebStorm配置

我是比较习惯使用第二种方式，也就是在本地就将 less 文件转成 css 文件，项目里是直接使用转换后输出的 css 文件了，而且我用的开发工具是 WebStrom，所以可以借助它，省去了每次自己输命令的操作：

第一步：在项目根目录下执行 `npm init -y` 初始化项目，初始化完项目后，根目录会生成 package.json 文件；

第二步：打开 package.json，在里面的 scripts 字段，根据你的项目结构，输入脚本命令；

第三步：点击 scripts 旁边的三角形按钮，就可以自动执行脚本命令，完成转换工作；

第四步：（可选）如果嫌每次都需要自己手动点击按钮麻烦，可以将这项工作添加进 File Watcher 功能中，每次文件改动就会自动执行脚本命令，完成转换，具体参考[上一篇](https://www.cnblogs.com/dasusu/p/10105433.html)，或者自行搜索，很简单。

这是例子的项目结构：

![](https://upload-images.jianshu.io/upload_images/1924341-62c124ed1dbc6c65.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

src 目录中存放 less 文件，dist 目录中存放转换后输出的 css 文件，所以，我的 package.json 里的脚本命令如下：

![](https://upload-images.jianshu.io/upload_images/1924341-9ebc6e6b0af1287e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

具体的脚本命令可根据实际需求，实际项目结构，自行决定。

#### 语法

好了，清楚了 less 文件的两种使用方式后，就可以来学习语法了，这样在学习语法过程中，就可以随时进行转换，查看 less 书写的代码，最终转换的 css 代码是什么样的，这样比较着学习比较容易掌握。

- **变量**

通过 `@变量名:` 来定义变量，通过 `@变量名` 使用变量，其实本质上是常量了，如：

```less
@width: 10px;  /*定义变量*/
@height: @width + 10px; /*使用变量，和逻辑语句*/

#header {
  width: @width;  /*使用变量*/
  height: @height;
}
```

转换成 CSS 文件：

```css
/*定义变量*/
/*使用变量，和逻辑语句*/
#header {
  width: 10px;
  /*使用变量*/
  height: 20px;
}
```

- **注释**

上个例子中，转换后的注释也还保留着，这是因为 less 和 css 都支持 `/* */` 的注释方式，所以这种会保留，但如果是 `//`，这种只有在 less 中支持，css 不支持，那么这种注释就不会保留，验证下：

```less
/*这是注释1*/
//这是注释2
```

转换成 css 文件：

```css
/*这是注释1*/
```

所以，在 less 中使用注释时，需要注意下，哪些是想保留，哪些是不想保留的。

- **Mixins（混合）**

也有的文章里翻译成混入，还有的文章直接保留单词，不做翻译，可能是觉得中文翻译不能够很好的表达意思吧。

先说有这么种场景：有时候写在某个选择器中的属性样式，在其他选择器中也需要，所以通常是直接将那部分复制粘贴过来使用。

而 less 的 Mixins 允许你在某个选择器内，直接使用其他选择器内的属性样式，所以中文翻译才有混合，或混入之说，其实也就是将其他的属性样式混合到当前选择器中。

看个例子就明白了：

```less
.class1 {   //类选择器 class1 的属性样式
  width: 10px;
  height: 20px;
}

.class2(@color: #fff) {  //定义了一个模板样式，类似于函数的作用
  background-color: @color;
}

#id1() {  //定义了一个模板样式，类似于函数作用
  border: 1px solid #ff22ff;
}

.mian { 
  .class1; //直接使用其他选择器定义的属性样式
  .class2(#f2f); //使用模板样式，传入参数
  #id1; //使用模板样式，不传参时，括号可省略
}
```

转换后的 CSS 文件：

```css
.class1 {
  width: 10px;
  height: 20px;
}
.mian {
  width: 10px;
  height: 20px;
  background-color: #f2f;
  border: 1px solid #ff22ff;
}
```

可以注意对比源代码和转换后的代码，原本就定义好的基本选择器，如 `.class1`，可直接在其他选择器内通过 `.calss1` 将它内部的属性样式都复制过来。

也可以在基本选择器后面加上 `()` 括号，这样一来，这个就会被当做模板处理，作用类似于函数，可接收参数，使用时就类似于调用函数那么使用，如果不传参，调用时也可以将括号省略。既然是作为函数使用，那么它们存在的意义就只是被调用，所以转换后的 CSS 中并不会存在这个函数。

另外，有的文章中，对 Mixins 的解释是说，在 class 中使用 class，但上面的例子中也测试了，class 中也是可以使用其他 id 选择器的属性样式的，所以应该不仅限于 class 类选择器，但不能用于组合选择器中。 

- **命名空间**

我对于命名空间的理解：属于 less 自己的命名空间，也就是这些代码并不会在转换后的 CSS 文件中出现，因为它只属于 less。

所以，其实也就是上述例子中，类似函数存在的那些模板选择器，当在书写选择器时，在其后面增加 `()` 括号，则表示这个选择器只属于 less 的命名空间，转成 CSS 后并不会出现。k

- **嵌套**

在写 CSS 时，组合选择器经常写得很复杂，因为 HTML 里的标签嵌套层次本身就很复杂，而且组合选择器写完也不是能够很明显的表示出它的目的，所以 less 允许依据 HTML 中的嵌套层次来书写，不用去记那么多组合选择器的规则，如：

```less
body {
  font-size: 16px;
  .content {
    .banner {
      ul {
        img {
          width: 700px;
          height: 300px;
          &:hover {
            width: 800px;
            height: 300px;
          }
        }
      }
    }
  }
}
```

转换成 CSS 文件：

```css
body {
  font-size: 16px;
}
body .content .banner ul img {
  width: 700px;
  height: 300px;
}
body .content .banner ul img:hover {
  width: 800px;
  height: 300px;
}
```

也就是，子孙后代的组合选择器规则可以不用去记，直接根据 HTML 文档中标签的嵌套层次来书写即可，这样便于后期维护，如果要对某个标签新增某些样式，也知道该去哪里找。

有一点需要注意的是，类似 `a:hover` 这种伪类选择器，需要加一个 `&` 符号。

- **运算**

less 允许在代码中进行一些简单的加、减、乘、除基本运算，结合变量的使用，可进行一些字体、颜色等的动态运算效果。

```less
@border: 1px;
@color: #fff;
#header {
  color: @color * 0.5;
  border-width: @border @border*2 @border*3 @border*4;
}
```

转换成 CSS 后：

```css
#header {
  color: #808080;
  border-width: 1px 2px 3px 4px;
}
```

通常，变量和运算都是用于对颜色、大小等进行计算。

- **内置函数**

less 内置了一些基础函数，可用于转换颜色、处理字符串、算术运算等，这里列举一些函数：

```less
color("#aaa");  //输出 #aaa， 将字符串的颜色值转换为颜色值
image-size("file.png");  //输出 => 10px 10px，获取图片文件的宽高信息
//image-with("file.png"); image-height("file.png"); 获取图片文件宽高
convert(9s, "ms");  //输出 => 9000ms，单位换算，例如对 m,cm,mmin,pt,pc的换算
@size: if((true), 1px, 0px);  //if函数，第一个参数为条件，满足则返回第二个参数，不满足返回第三个参数
if(not (true), 1px, 0px);     //非语句， not
if((true) and (true), 1px, 0px); //逻辑与语句， and 
if((false) or (true), 1px, 0px); //逻辑或语句， or 

//处理数组
@list: "banana", "tomato", "potato", "peach";
length(@list);  // 输出 => 4
extract(@list, 3);  //输出 => potato,注意第一个不是从 0 开始计算

//类型判断
isnumber(#ff0);  // false
isstring("234"); // true
iscolor(#ff0);   // true
isXXX

...
```

内置函数很多，用途也很多，覆盖了基本算术运算、逻辑语句、颜色计算、字符串处理等等，需要用时再查手册吧。

- **作用域**

作用域很好理解，就是类似 JavaScript 中的变量作用域，因为在 less 中都是通过 `@变量名:` 来定义变量的，后定义的会覆盖掉前定义的，但当在不同嵌套层次中定义同一变量时，就存在局部变量和外部变量之分，内部变量并不会覆盖掉外部变量。

而且，less 的变量定义也有类似 JavaScript 中的提前特性，如：

```less
@var: red;

#aaa {
  color: @var;  // yellow，因为后面定义的 @var:yellow 将 @var:red 覆盖掉了
}

#page {
  #header {
    color: @var; // white，内部变量不影响外部变量
  }
  @var: white;
}

@var: yellow;

#ppp {
  color: @var;  //yellow
}
```

看看转换成 CSS 后：

```css
#aaa {
  color: yellow;
}
#page #header {
  color: white;
}
#ppp {
  color: yellow;
}
```

- **import（导入）**

如果某份 less 文件是可以复用的，那么可以使用 `@import` 命令将其全部引入使用。

```less
@import "main";
```

![](https://upload-images.jianshu.io/upload_images/1924341-dc39a7a68fbca83f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

最后在 test.css 里会汇合 main.less 里的代码。

以上，只是介绍 less 的基础语法，还有更多详细、复杂的语法用途，需要时再翻阅文档吧。

### Sass（Scss）

Sass 相比于 Less 功能会更强大，但也更复杂。

Sass 和 Scss 本质是一家，Sass 早期版本的文件后缀名是 `.sass`，从 Sass 3 之后，因为修改了一些特性语法，Sass 更加强大且易使用，从这个版本之后的文件后缀名改成了 `.scss`，所以 Scss 其实 Sass 的新版本的称呼，但两者本质上没太大区别。

Scss 是基于 Sass 的语法基础上，修改了一部分的语法。比如早期的 Sass 是通过换行和缩进如：

```Sass
#sidebar
  width: 30%
  background-color: #faa
```

这种语法格式跟 CSS 不一致，让使用者会很不习惯，Scss 之后就换成用分号和括号了：

```scss
#sidebar {
  width: 30%;
  background-color: #faa;
}
```

#### 使用

Sass 不像 Less 一样可以直接借助 less.js 来进行转换，它是基于 Ruby 运行环境，所以电脑上需要先安装 Ruby，然后才能有办法将 Sass 文件转成 CSS。

[Ruby 下载地址：https://rubyinstaller.org/downloads/](https://rubyinstaller.org/downloads/)  

因为是 exe 文件，下载完直接按提示安装就可以了，安装后打开终端，执行 gem 命名安装 Sass：

`gem install sass`

安装完 Sass 后，就可以通过 scss 命令来进行转换工作了，如：

`scss main.scss main.css`

上述命令中，scss 换成 sass 也可以，但注意，scss 或 sass 命令是基于 Ruby 环境下运行的命令，因为电脑上已经安装过 Ruby 了，也通过 Ruby 安装了 Sass，所以才可以在终端里直接执行 scss 命令。

而类似于 Less 中说到的，WebStrom 可以借助 package.json 里的 scripts 来手动运行脚本命令，这有个前提，就这些脚本命令是运行在 node.js 环境上的，所以如果你直接将上述 scss 命令配置到 package.json 的 script 里，你会发现，是运行不了的。

要解决这个问题，让 WebStrom 能够运行 sass 命令来处理转换工作有两种方式：

- 直接去 WebStrom 配置 File Watcher，program 选择 Ruby 目录中的 sass.bat 或 scss.bat

这种方式下，每次配置的文件变动时，会自动生成对应的 css 文件，转换工作会自动实时进行。但如果不习惯这种方式，想要每次编写完 scss 代码后，手动来触发转换工作，那么可以选择第二种方式：

- 通过 npm 命令安装 sass

在终端里执行 `npm install -g sass`，这样就可以类似配置 less 那样的步骤来使用 sass 命令了，在 package.json 里配置相关命令，然后手动点击脚本的运行即可。

但 npm 安装的 sass 跟在 Ruby 下安装的 sass 是否有和区别，我不清楚，用段时间，如果有啥问题再来说说。

而且，对于选择使用 Sass，刚接触可能会有些困惑，是应该使用哪个后缀名的文件，命令是该用 sass 还是 scss 来进行转换，我也有这个困惑，但感觉好像并没有什么区别，先试着用段时间，以后熟悉了再来讲讲。

最后，Sass 虽然有 `.sass` 和 `.scss` 两种后缀名的文件，但建议使用 `.scss`，因为前者的语法跟 CSS 很不一样，使用起来会有些不习惯，当然如果你有 Ruby 基础的话，可能会比较喜欢这种。我个人会选择后者。

#### 语法

语法方面，大部分类似于 Less，但就细节方面可能有些不一样，还有，支持更多更强大的功能吧。

上面介绍的 Less 的基础语法、基础功能，Sass 也基本全部支持，也差不了多少，所以下面就不一个个来介绍了，详细的到开头声明部分给的中文网链接中去查阅即可。

下面就主要列一些不同的地方：

- **变量**

Sass 中的变量用 `$变量名:` 定义，用 `$变量名` 使用，其余跟 Less 差不了多少。

- **作用域**

Less 中的变量分局部作用域和全局作用域，但在 Sass 中，不同版本，作用域范围并不一样，摘抄一段原文中描述：

> Sass 中变量的作用域在过去几年已经发生了一些改变。直到最近，规则集和其他范围内声明变量的作用域才默认为本地。如果已经存在同名的全局变量，则局部变量覆盖全局变量。从 Sass 3.4 版本开始，Sass 已经可以正确处理作用域的概念，并通过创建一个新的局部变量来代替。 

- **条件语句**

Less 中并不支持条件语句，当然，可以通过内置函数 if 以及 and，or，not 这些来模拟条件语句。

在 Sass 中是支持条件语句的，但也不是像其他编程语言直接 if 这样通过保留字来编写，需要加个 `@` 符合，如：

```scss
@if $support-legacy {
  // …
} @else {
  // …
}
```

教程中给了几条准则要求：

- 除非必要，不然不需要括号；
- 务必在 `@if` 之前添加空行；
- 务必在左开大括号(`{`)后换行；
- `@else` 语句和它前面的右闭大括号(`}`)写在同一行；
- 务必在右闭大括号(`}`)后添加空行，除非下一行还是右闭大括号(`}`)，那么就在最后一个右闭大括号(`}`)后添加空行。

另外，教程中也说了：

> 除非你的代码中有偏复杂的逻辑，否则没必要在日常开发的样式表中使用条件语句。实际上，条件语句主要适用于库和框架。 

其他区别，等用段时间，熟悉了再来讲讲。

#### 框架-[Compass](http://compass-style.org/) 

Sass 有一点比 Less 有优势的就是，目前有很多稳定且热门的基于 Sass 编写的框架库，比如：[Compass](http://compass-style.org/)、[Bourbon](http://bourbon.io/) 和 [Susy](http://susy.oddbird.net/) 等。

这些框架库就类似于 jQurey 和 JavaScript 关系，对 Sass 进行了一层封装，让编写 Sass 代码的人，可以极为简便的开发，我还没用过，就不过多介绍了。