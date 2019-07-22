# 声明

本系列文章内容全部梳理自以下四个来源：

- 《HTML5权威指南》
- 《JavaScript权威指南》
- [MDN web docs](https://developer.mozilla.org/zh-CN/docs/Web)
- [Github:smyhvae/web](https://github.com/smyhvae/Web)

作为一个前端小白，入门跟着这四个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。

# 正文-HTML标签

本文接着来学习 HTML 的基本标签，下面是我自己对标签进行的划分，《HTML权威指南》中将标签类别划分成了很多种，比如：内容分组，文档分节，表单七七八八等等。

但我按照自己个人的理解习惯，对总的标签划分成三类：修饰文档结构的标签、修饰文本内容标签、容器类标签。

修饰文档结构的标签大多用于表示一份标准、完整的HTML文档的一些标签，以及可放于\<head\> 内的一些标签。

修饰文本内容标签，大意是说，这些标签是直接用于标记文本内容，赋予文本内容某些语义行为，比如 \<a\> 赋予超链接语义，\<h1\> 赋予了一级标题语义等等。这个类别有些类似于 Android 中表示某个 View 的标签，通俗来讲，这些标签可直接使用在文本内容上了。

容器类标签，并不是真正意义上的容器，而是说，这类标签主要的作用是用来包含其他标签的，但并不是说，只能用来包含其他标签，也可直接对文本内容标记。如 \<nav\>, \<header\> 这类表示某一块区域的标签。

我自己个人将其常用的标签划分成三大类，当然不是很准确，书中划分得更细，但结合 Android 中一些共性的概念，我个人觉得划分成这三类后，我较容易理解各个标签用途：

### 1. 修饰文档结构

首先来看份 HTML 的大体上的基本结构：

```html
<!DOCTYPE html>   <!--声明这是一份H5文档-->
<html >           <!--HTML文档内容开始-->
<head>
	<!--在<head>标签中声明文档的各种元数据-->
	<!--该部分内容是给浏览器看的-->	
</head> 
<body>
	<!--<body>标签内为文档的文本内容-->	
	<!--该部分内容是给用户看的-->
</body>
</html>
```

所以，这些标签用途基本就是用于构建一份基本的 HTML 文档结构，下面看看具体介绍：

#### \<!DOCTYPE\>

准确的说，\<!DOCTYPE\> 并不是 HTML 标签，它是声明 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。

在 HTML 4.01 中，\<!DOCTYPE\> 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。

[HTML5](https://www.html5tricks.com/) 不基于 SGML，所以不需要引用 DTD。

如 H5中用法：

```html
<!DOCTYPE html>
```

HTML 4 中用法：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

#### \<html\>

每一份 HTML 文档内容的根节点，表示文档内容的开始

文档内容包括两部分：头部声明 \<head\> 和文本内容 \<body\>

#### \<head\>

HTML 文档的头部声明，用于声明该文档的一些属性，以及一些元数据，\<head\> 内部的内容是用于给浏览器看的，并不是用于给用户看的，浏览器通过 \<head\> 信息，知晓这份文档引用了哪些外部资源文件，使用的哪些属性。

可在 \<head\> 中使用的标签并不多：

```html
<head>
<base href="http://www.dasu.">         <!--设置基准URL-->
    <meta charset="UTF-8">             <!--声明文档所使用的编码-->
    <title>Title</title>               <!--声明文档的标题-->
    <base href="http://www.baidu.com"> <!--声明文档全局的基准URL-->
    <style type="text/css"></style>    <!--声明内嵌类型的css样式-->
    <link type="text/css" rel="stylesheet" href="css/nms.css">   <!--外部css-->
<script></script>          <!--JavaScript脚本-->
    <noscript></noscript>  <!--浏览器不支持JS情况下的处理-->
</head>
```

#### \<body\>

\<body\> 标签用于声明文本内容，该标签内的内容都是用于展示给用户看的，所以基本所有标签都可以在 \<body\> 内，浏览器解析相应的标签，并根据 CSS 作用到每个对象上，生成网页呈现给用户。 

#### \<meta\>

元数据标签，可用于声明文档所使用的一些元数据，用途蛮多，如下： 

```html
<meta charset="utf-8"/>       <!--声明文档编码格式-->
<meta http-equiv="refresh" content="5"/>   <!--往Http头部中增加key-value-->
<meta http-equiv="content-type" content="text/html charset=UTF-8"/>  
```

#### \<link\>

\<link\> 标签用于指定 HTML 文档使用了哪些外部资源文件，可以是外部的 CSS 文件，或者网页图标，或者说明文档等等，如下： 

```html
<link rel=”stylesheet” type=”text/css” href=”styles.css”/> --外部CSS
<link rel=”shortcut icon” href=”favicon.ico” type=”image/x-icon”/>-网页图标
<link rel=”prefetch” href=”/page2.html”> --预先加载page2.html文件
…
```

### 2. 修饰文本内容 

#### \<a\>

\<a\> 标签的作用是引导用户从一张页面链接到另一张页面，互联网说到底就是一张张网页通过超链接 \<a\> 互相关联起来的。

所以，只要不是单个页面，只要页面支持跳转，那么 HTML 文档中就肯定有  \<a\> 标签的存在，用于指定下个页面的跳转。

- **用法**

```html
<a href="http://www.baidu.com">百度</a>
<a href="index.html">首页</a>
<a href="#myId">标题5</a>
```

以上是 \<a\> 标签的三种用法，指定绝对路径的链接，指定相对路径的链接，指定文档内的链接。

也就是说，\<a\> 标签既可以用于指定页面间的跳转关联，也可以指定页面内的跳转。

\<base\> 标签设置的基准 url 会影响到相对路径的拼接，默认以当前 HTML 文档的路径作为基准路径。

另外新页面的打开方式也支持多种形式配置，如：

```html
<a href="http://www.baidu.com" target="_blank">百度</a>
```

通过 target 属性来声明新页面的打开方式，target可以取值如下： 

| target    | 含义                             |
| :-------- | -------------------------------- |
| _blank    | 在新页面或标签页中打开文档       |
| _parent   | 在父窗框组（frameset）中打开文档 |
| _self     | 在当前窗口中打开文档（默认行为） |
| _top      | 在顶层窗口打开文档               |
| \<frame\> | 在指定窗框中打开文档             |

#### \<b\> & \<wbr\> 

换行标签

\<br\> :表示将后续内容转移到新行上

\<wbr\> :H5 新增的，表示当长度超过当前浏览器窗口的内容适合在此换行。

两者都是换行，前者是强制换行，后者是建议在这里换行，但什么时候换行，由浏览器根据当前窗口大小决定，后者通常用于指定单词的换行。

- **用法**

```html
<p>
    I am dasu, <wbr> and i am coding.<wbr>
    <br/>
    I am ...
</p>
```

#### \<p\>

\<p\> 标签用于表示段落，标签围起来的文本内容表示一个段落。

因为浏览器会忽略所有的空格、缩进、换行，最多只会解析成一个空格，所以，即使文本内容的段落结构很好，但经由浏览器解析出来后的文本内容全部都挤到一堆。

因此，\<p\> 段落标签还是很有必要的。

可以用此来标记哪些文本内容作为一个段落。

用法见上例。

#### \<pre\> & \<code\>

\<pre\> 标签用于保留源文档中的格式。

\<code\> 标签用于表示代码块。

由于浏览器会合并空白字符，忽略掉换行，导致如果文档中含有代码块时显示不符合开发工具下的代码格式风格。

此时，可以借助 \<pre\> 标签和 \<code\> 一起使用，来阻止浏览器合并空白字符，达到保留代码格式的目的。

- **用法**

```html
<pre><code>
	protected final void setMeasuredDimension(int measuredWidth, int measuredHeight) {
        boolean optical = isLayoutModeOptical(this);
        if (optical != isLayoutModeOptical(mParent)) {
            Insets insets = getOpticalInsets();
            int opticalWidth  = insets.left + insets.right;
            int opticalHeight = insets.top  + insets.bottom;

            measuredWidth  += optical ? opticalWidth  : -opticalWidth;
            measuredHeight += optical ? opticalHeight : -opticalHeight;
        }
        setMeasuredDimensionRaw(measuredWidth, measuredHeight);
	}
</code></pre>
```

#### \<ol\> & \<li\>

\<ol\> 标签用于表示有序列表，\<li\> 标签用于表示列表中的每一项。 

- **用法**

![ol1](https://upload-images.jianshu.io/upload_images/1924341-40656ce80410b923.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

既然是有序列表项，那么序号的起始以及样式是支持通过属性设定的，如下：

![ol2](https://upload-images.jianshu.io/upload_images/1924341-c45c98cd7b3a9d53.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

通过 start 属性设置起始的编号，通过 type 属性设置编号的样式，可设置的 type 样式如下 :

![ol3](https://upload-images.jianshu.io/upload_images/1924341-c0afbbc16ea03ad5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

如果要实现编号是非连续的，那么可以借助 \<li\> 标签的 value 属性实现 ：

![ol4](https://upload-images.jianshu.io/upload_images/1924341-a468692536faec94.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

注：每个 ol 列表项都是独立存在，编号默认都从 0 开始，如果想实现不同列表项的编号连贯，或者想以跨度 2 或其他数递增，那么只用标签属性实现局限很多。这时，可考虑通过 CSS 的 ::before 选择器实现，具体实现后续再说。

#### \<ul\> & \<li\>

\<ul\> 标签用于表示无序列表，\<li\> 标签表示列表里的每一项.

- **用法**

![ul](https://upload-images.jianshu.io/upload_images/1924341-514765765728f14d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

因为是无序列表，所以用法比起有序列表 \<ol\> 简单很多，无需使用任何属性，直接用无序标签 \<ul\> 包含一系列子项 \<li\> 即可。

至于，每一项前的样式，可通过 CSS 样式，通过 list-style-type 属性实现，以上样式对应的 CSS：

```css
ul { list-style-type: disc}
```

#### \<h1\> ~ \<h6\>

标题标签，对应一级到六级标题。

![p](https://upload-images.jianshu.io/upload_images/1924341-81a791b20daa77e9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

至于每个标题具体字号样式如何，取决于各个浏览器或者网站。

#### \<table\>

表格标签，但貌似现在不常用了。

HTML 文档做一个表格挺复杂的，涉及的标签很多，如 \<thead\>, \<tfoot\>, \<tbody\> 等等。

但根节点总是 \<table\>，一份表格无外乎就是各种单元格组成，而单元格标签为 \<td\>，另外，浏览器解析表格文本时，是以行为单位来构建表格，并不是列，所以每个单元格都需要指定位于哪一行中，行标签为 \<tr\>。而所有行的单元格都是表格的主要内容，因此都在 \<tbody\> 标签中。

以上是表格的最基本要素，因此一张最简单的表格，至少需要 \<table\>，\<tbody\>，\<tr\>，\<td\> 三种标签。

![table](https://upload-images.jianshu.io/upload_images/1924341-a3820a20db1e38e8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

有时候，写表格标签时，如果没有其他表头 \<thead\> 部分，或者表脚 \<tfoot\> 时，会将 \<tbody\> 省略，但这并不是说就可以不用 \<tbody\> 标签，而是很多浏览器会自动将 \<tbody\> 填补上，所以如果有省略 \<tbody\> 的场景下，使用 css 选择器时得稍微注意一下。

- **\<tr\> & \<th\> & \<td\>**

由于浏览器是以行为单位构建表格，所以一个表格有多少行就是通过 \<tr\> 标签来控制，哪些单元格属于哪一行，就放在那一行的 \<tr\> 标签中。

虽然说表格都是由一个个的单元格组成，但单元格之间还可以继续划分含义，有些单元格是表示内容，而有些单元格则是表示属性值，或者说列头或行头。

通常来说，这些标题类型的表格都是在第一行或第一列的单元格：

![table1](https://upload-images.jianshu.io/upload_images/1924341-02979bedc029609b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这是一个很常见的二维表格，通过 \<th\> 和 \<td\> 来将表格的单元格含义区分开。

\<th\> ：标签用于表示单元格的表头

\<td\> ：标签用于表格单元格的内容

既然是单元格，那么就会存在合并单元格的现象，通俗的讲也就是有些表格的大小并不是只占据一格，而是有可能多行多列。此时，可通过属性来实现：

| 属性    | 含义                     |
| ------- | ------------------------ |
| colspan | 单位数值，如1表示占据1列 |
| rowspan | 单位数值，如2表示占据2行 |

- **\<thead\> & \<tfoot\> & \<tbody\>**

类似于 HTML 文档有一些专门用于表明文档结构的标签，表格同样有一些用于指示表格结构的标签。引入表格结构标签，是为了更好的区分出各个单元格的含义。

比如，\<th\> 标签用来表示表头类型的单元格，但不管是第一行的表头，还是第一列的表头，用的都是 \<th\>，那如果还想继续划分这个表头是属于第一行或者第一列时该怎么做呢？

所以，引入了一些结构性标签有便于对表格各个单元格更加具体的细分，以满足各种复杂场景。

![table2](https://upload-images.jianshu.io/upload_images/1924341-b85422526dd8e3e1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

\<table\> : 是表格的根节点

\<thead\> : 用来标记表格的标题行

\<tfoot\> : 用来标记组成脚的行。

不用 \<thead\>，表格最终效果也一样，但用了 \<thead\> 之后，如果 CSS 想分别作用第一行，或者第一列，这时就可以很容易的通过 thread th 以及 tbody th 来达到目的了。

所以，结合表格结构性标签的使用，可以让表格的结构更加明确。

- **\<caption\>**

表格除了一张表格内容外，通常还会需要有表格的标题，此时用 \<caption\> 标签来标记。

- **完整示例**

![table示例](https://upload-images.jianshu.io/upload_images/1924341-a8b3371b647ae8cf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

```html
<table border="1">
    <caption>工作记录表</caption>
    <thead>
    <tr>
        <th>日期</th><th>姓名</th><th>记录</th>
    </tr>
    </thead>

    <tbody>
    <tr>
        <th>2018-07-24</th><td rowspan="2">suxq</td><td>单元格</td>
    </tr>
    <tr>
        <th>2018-07-25</th><td>单元格</td>
    </tr>
    </tbody>
</table>
```

#### \<form\> 

表单标签。

表单在网页中的角色很重要，因为表单是用来接收用户输入的信息并提交发送给服务器的中间角色。

表单并不是说，流程器就呈现给用户一张表单，反而通常呈现给用户的只是各自输入控件，比如输入框，或者勾选控件之类的。

表单，我的理解是，浏览器会将用户输入的这些数据收集起来生成一张表单提交给服务端。

\<form\> 标签则是表单的根节点。

因为表单需要收集用户输入的信息，以及提交服务端的时机，因此，一般来说，表单还需要有 \<input\> 标签以及\<button\> 标签。

一份基本的表单如下：

![form1](https://upload-images.jianshu.io/upload_images/1924341-971b85c9d6ede5ea.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

\<form\> 标签的属性 method 用来指明发送表单数据时使用哪种方式，有两种 get, post。

action 属性用于指明表单数据要发送到哪里，如果没有设置，则默认发送到所在 HTML 文档的地址。

- **\<fieldset\>**

如果表单过于复杂，需要将各个 \<input\> 收集的信息进行归类，可以使用 \<fieldset\> 标签。而 \<fieldset\> 有个子标签 \<legend\>，是用来对这个分组提供相关说明使用。 

示例：

```html
<form method="get">
    <fieldset>
        <legend>第一个</legend>
        <p>name: <input name="name"/></p>
        <p>city: <input name="city"/></p>
    </fieldset>

    <fieldset>
        <legend>第二个</legend>
        <p>name2: <input name="name1"/></p>
        <p>city2: <input name="city1"/></p>
    </fieldset>

    <button>提交</button>
</form>
```

![form2](https://upload-images.jianshu.io/upload_images/1924341-5dee9603d9329ce0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

- **\<button\>**

\<button\> 标签用来标记在表单中的按钮，但按钮的作用有三类，可通过属性值 type 来设置。如下： 

| type属性值 | 含义                                   |
| ---------- | -------------------------------------- |
| submit     | 默认值，表示按钮的用途是提交表单       |
| reset      | 表示按钮用途是重置表单                 |
| button     | 表示按钮是一个普通的按钮，没有任何语义 |

如果 \<button\> 标签不放在 \<form\> 标签内，那么它就需要指定绑定的是哪个 \<form\> 表单，通过 form 属性绑定 form 表单的 id，所以这种场景下，form 表单必须设置 id 属性值。 

- **\<input\>**

\<input\> 标签是用于收集用户输入的标签，因此它的形态有各自各样，可通过属性 type 来设置。

另外，它有很多属性，每个属性都有各自的含义，一些基本的属性需要了解一下。

name 属性，用于设置该 \<input\> 的 key 值，value 值就是用户的输入，key 和 value 组合成表单中的一项用于发送给服务端。如 :

![input](https://upload-images.jianshu.io/upload_images/1924341-e94a11e310f6b297.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

表明有两个 \<input\> 控件，一个 key 值为 name，一个 key 值为 city，收集用户输入后组成表单上传。

不同 type 的 \<input\> 作用不同，分别来看下：

- **type="text"**

默认的 \<input\> 的 type 值，在浏览器中呈现一个单行文本输入框。

这种类型下，还可以配合一些属性使用，如

placeholder: 数据提示，类似于 hint 功能

list: 结合 \<datalist\> 标签使用，用于给出一系列输入提示

其他还有一些属于用于设置 \<input\> 是否可用，是否聚焦，宽度，输入最大长度等等。

示例：

![input2](https://upload-images.jianshu.io/upload_images/1924341-b30f28628389921e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

- **type="password"**

这类型的 \<input\> 在浏览器上的呈现跟 type=”text” 类型一致，功能也基本一致，唯一的区别就是这是个密码框，也就是当用户输入数据时，在浏览器上是以掩饰字符替换，如··· 

![input3](https://upload-images.jianshu.io/upload_images/1924341-a0b2e974310216c5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

- **type="submit"**
- **type="reset"**
- **type="button"**

这三种类型的用途跟 \<button\> 标签一样，所以想要设置按钮，用 \<input\> 也可以，唯一的区别就是，\<input\> 是虚元素，也就是它没有标记任何文本内容，而 \<button\> 是可以标记文本内容的 。

![input4](https://upload-images.jianshu.io/upload_images/1924341-f75bdfd0cd0bc213.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

- **type="hidden"**

该类型 \<input\> 浏览器会将其隐藏，不显示在网页上。通常是用于一些需要传给服务端的数据，但又没有必要让用户知道的场景下的使用。如： 

```html
<input type="hidden" name="name_id" value="123456"/>	
<input name="name"/>
```

如上，用户只需输入名字信息，但提交给服务端时还需要一个 name_id 信息，这个数据没必要让用户知道，此时可以通过 hidden 来实现。 

- **type="image"**

该类型的 \<input\> 其实就是个图片按钮。跟 \<img\> 标签的区别也就是，这个是可点击的，\<img\> 只是将图片嵌入进来：

```html
<input type="image" src="https://upload-images.jianshu.io/upload_images/5687349-d9d7ce1fec758d8c.png"/>
```

![input5](https://upload-images.jianshu.io/upload_images/1924341-6c6b1fb10a9fd7cc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

当在 form 表单中有 type=”image” 类型的 \<input\> 时，点击这张图片，发送给服务端的信息是点击的坐标点。 

- **type="file"**

该类型的 \<input\> 可以让用户选择本地文件：

![input6](https://upload-images.jianshu.io/upload_images/1924341-98bb257ad98cef85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

- **type="checkbox"**

复选框，示例：

![input7](https://upload-images.jianshu.io/upload_images/1924341-049314aab9d7639f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

- **type="radio"**

多选框，通常配合 \<fieldset\> 一起使用，将同类型的集合管理在一起。当然，不用也可以。

![input8](https://upload-images.jianshu.io/upload_images/1924341-31f737ee406f88f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

- **type="number"**
- **type="email"**
- **type="tel"**
- **type="url"**
- **type="color"**
- ...

这类 type 的 \<input\>，用途只是用于限定用户的输入格式，比如 number，这个输入框就只能输入数字。 

#### \<iframe\>

HTML 文档中是可以嵌入其他 HTML 文档的，通过 \<iframe\> 标签标记。 

```html
<iframe src="index.html" width="500" height="500"></iframe>
```

通过src属性设定目标HTML文档地址，width,height设置区域大小。 

#### \<img\>

基本每个网页都会有图片，在 HTML 中嵌入一张图片用 \<img\> 标签，跟 Android 中的 ImageView 控件很类似，同样需要指定图片来源，区域宽高。 

```html
<img src="https://upload-images.jianshu.io/upload_images/5687349-d9d7ce1fec758d8c.png" width="300" height="300">
```

### 3. 容器类

容器类标签是我自行对其进行的划分，并不是说，这类标签只能用于当容器使用，只能用于包含其他标签，而是说，常见的用法，这类标签基本都是表示具有某种含义的某一块区域，具体这块区域内既可以包含各种标签，也可以直接是文本内容。

#### \<span\> & \<div\>

都是通用标签，没什么具体的语义

\<span\> : 标签通常用于标记段落中的某块文本内容，然后通过该标签，可以单独为这块文本内容增加 CSS 样式

\<div\> : 标签一般用于，将屏幕某块区域划分出来后，用该标签标记后可通过选择器作用自定义的 CSS 样式。

#### \<section\>

\<section\> 标签用于表示文档中的某一节，其实也就是某一块区域，这块区域有自己单独独立的含义。通俗的理解，有些类似于第一节，第二节的概念。

每一节 \<section\> 都是相互独立的，因此方便各节里面独自使用 \<headler\> 和 \<footer\>。

![section](https://upload-images.jianshu.io/upload_images/1924341-9abbb7b71aad550b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### \<header\> & \<footer\>

\<header\> : 标签表示某一节的首部，像某些网页通常会有一些 Logo 之类的首部信息。

\<footer\> : 标签表示某一节的尾部，最常见的基本每个网页尾部都会有版权信息，作者介绍，相关链接，免责声明等信息，这部分信息都适用于放在尾部标签 \<footer\> 里。

例如：\<header\>

![header](https://upload-images.jianshu.io/upload_images/1924341-0c8810920aadaeb1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

\<footer\>

![footer](https://upload-images.jianshu.io/upload_images/1924341-04f81df75431acca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### \<nav\>

\<nav\> 标签表示文档中某一个区域，它包含着到其他页面或者同一页面的其他部分的链接。

直译其实也就是导航的作用。

![nav](https://upload-images.jianshu.io/upload_images/1924341-19b2ce4990c394e1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

### 小结

常见的标签基本就这些了，当然，这里并没有列出一些 HTML5 新增的标签，因为刚入门，对于那些标签的使用场景也不熟悉，总之，了解以上的标签，基本足够查看任意个网站的源代码了。

另外，如有需要，再去查找具体标签即可：

[https://developer.mozilla.org/zh-CN/docs/Web/HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML)