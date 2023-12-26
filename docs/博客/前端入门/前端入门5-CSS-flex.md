# 声明

本系列文章内容全部梳理自以下四个来源：

- 《HTML5权威指南》
- 《JavaScript权威指南》
- [MDN web docs](https://developer.mozilla.org/zh-CN/docs/Web)
- [Github:smyhvae/web](https://github.com/smyhvae/Web)

作为一个前端小白，入门跟着这四个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。

# 正文-弹性布局flex

弹性布局的作用有点儿类似 Android 中 LinearLayout 和 RelativeLayout 两者的合成版，即：支持横向布局，纵向布局，start，end，center 布局，宽高按比例瓜分等等，当然它还有很多其他功能，比如自动换行，按指定 order 排列等。总之有了 Android 基础，理解弹性布局 flex 蛮容易的。

可以这么的理解，传统的网页布局方式是通过 display 和 position 以及 float 三者完成的，借助块级元素，行内元素特性，结合 position 指定的相对布局、绝对布局、固定布局方式来实现各种排版效果。如果需要浮动，则借助 float。

但这种传统的方式，一来使用较复杂，二来某些排版效果不好实现，如列表、居中、响应式布局等效果。

而 flex 则能够很好的完成传统的布局工作，而且，它还可以支持响应式布局。

### 1.基础概念

#### 两根轴线

当使用 flex 布局时，首先想到的是两根轴线：主轴和交叉轴。主轴由 flex-direction 定义，另一根轴垂直于它。我们使用 flexbox 的所有属性都跟这两根轴线有关, 所以有必要在一开始首先理解它。 

![flex](https://upload-images.jianshu.io/upload_images/1924341-08cdf2e794ab15ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

理解主轴和交叉轴的概念对于对齐 flexbox 里面的元素是很重要的；因为 flexbox 的特性是沿着主轴或者交叉轴对齐之中的元素。 

#### 布局空白

布局空白：available space，大概来说，flex 容器大小扣掉 items 的 flex-basis 指定的占据的空间大小之外剩余的区域，flex-basis 通常是指 item 本身的大小，当然也可以手动设置。

flex 的一些属性就是通过改变 flex 容器中的布局空白分配来达到对齐等效果的。

比如 items 的 flex-grow 拉伸或者 flex 容器的 justify-content 主轴对齐等，其实就是将这些布局空白按照不同算法分配给各个 item，分给 item 时，是要直接填充进 item 的内容里达到拉伸效果，还是就简单的将空白围绕在 item 周围达到类似 margin 效果来实现 item 的居中、靠左、靠右、均分等对齐方式。

具体属性不了解没关系，下面的章节会讲，知道概念即可。

### 2.flex相关属性

对任意块级元素标签设置 display: flex 即可让这个元素作为 flex 容器存在，也就可以使用 flex 的相关属性了。

flex 的属性并不多，目前只有 13 个，其中有 7 个是 flex 弹性盒子容器本身所使用的属性，6 个是 flex-item 弹性盒子的子项使用的属性。其中，有些属性只是将其他属性的集中简化使用，因此，真正具有布局用途的属性并不多，很好掌握。

作用于 flex 弹性盒子容器身上的属性：

#### flex-direction

语法格式：

```
flex-direction: row(default) | row-reverse | column | column-reverse
```

用于设置主轴的方向，flex 分主轴和交叉轴两个概念，items 布局时，默认延主轴方向进行，因此通过设置主轴是水平方向还是垂直方向就可以实现 items 的水平或垂直布局。

- row：默认值，设置主轴为水平方向
- column：设置主轴为垂直方向

其他属性就不介绍了，因为主轴方向就两个，要么水平，要么垂直，其他的区别仅在于水平时是从左到右，还是从右到左，所以这个属性的影响因素之一的 LTR 和 RTL，但没必要考虑这么多，这些场景应该不多，知道这个是用来设置主轴方向就够了，我觉得。

示例：

![flex-direction](https://upload-images.jianshu.io/upload_images/1924341-fc89a44d228d398d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### flex-wrap

语法格式：

```
flex-wrap: nowrap(default) | wrap | wrap-reverse
```

用于设置是否允许换行，默认值 nowrap。

当设置了 wrap 时，允许 items 在主轴方向溢出时自动进行换行布局，这点可以很好的用来实现响应式布局，比如当空间逐渐缩小时，原本水平排列的控件换成垂直方向排版。

示例：

![flex-wrap](https://upload-images.jianshu.io/upload_images/1924341-9a74643008a31410.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### flex-flow

语法格式：

```
flex-flow: <'flex-direction'> || <'flex-wrap'>
```

这个属性并没有另外的含义，它只是 flex-direction 和 flex-wrap 的简写用法而已。

如果你不想单独使用上述两个属性，可以将它们一起在 flex-flow 使用，如：

```
flex-flow: row wrap
//等效于
flex-direction: row;
flex-wrap: wrap;
```

#### justify-content

语法格式：

```
justify-content: normal(default) | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]
where 
<content-distribution> = space-between | space-around | space-evenly | stretch
<overflow-position> = unsafe | safe
<content-position> = center | start | end | flex-start | flex-end
```

用于设置 items 在主轴方向上的对齐方式，可以靠左，靠右，居中或者按比例均分等效果。

需要先明确一点概念，对齐是指 items 在 flex 容器中的排版对齐方式，那么要想 flex 容器可以控制 items 的对齐方式，那主轴方向上自然就还需要有布局空白，如果都没有布局空白了，不就表明 items 已充满 flex 容器了，那谈何对齐。

那么，如果存在至少一个 item，它的 flex-grow 属性不等于 0，justify-content 这个属性就失效了，因为 flex-grow 表示允许 item 按照比例瓜分布局空白，这样一来布局空白被瓜分完了，flex 容器在主轴方向上已被 items 充满， 也就没有对齐一说了。

所以要能够正确的使用该属性来控制 items 在主轴方向的对齐方式，那么就需要注意 item 中会影响布局空白的属性，如 flex-grow，flex-basis 这些的使用。

下面看看各属性值介绍（下面的介绍不考虑 RTL 的情况，默认都以 LTR 为主）：

- start：主轴是水平方向的话，左对齐方式排版；主轴是垂直方向的话，上对齐方式排版；
- end：主轴是水平方向的话，右对齐方式排版；主轴是垂直方向的话，下对齐方式排版； 
- center：居中方式排版；
- space-between：等比例瓜分布局空白，每行首元素对齐，末元素对齐，每行各元素间距一致； 
- space-around：与上述的类似效果，区别仅在于，每行首元素并不是在 flex 容器内容区域左边就开始布局，它距离 flex 容器左边的距离等于各个元素之间间距的一半。说白点，就是行首元素和末尾元素的周边有类型 margin 值存在。 

剩余的属性值不介绍了，因为我也还没有搞懂它们的含义和应用场景。

示例：

![justify-content](https://upload-images.jianshu.io/upload_images/1924341-196cce807ce5f660.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

(ps：flex 容器设置了 padding，所以 start 和 end 才没有贴靠边界 )

#### align-items

语法格式：

```
align-items: normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ]
where 
<baseline-position> = [ first | last ]? baseline
<overflow-position> = unsafe | safe
<self-position> = center | start | end | self-start | self-end | flex-start | flex-end
```

用于控制 items 在交叉轴方向上的排版布局方式，justify-content 是能控制主轴上的排版，而这个属性则是用于控制交叉轴，通常两个都会一起使用，相互结合，可以达到一些类似页面居中效果。

看看属性值：

- flex-start：交叉轴方向，从起点开始布局排版
- flex-end：交叉轴方向，从末尾开始布局排版
- center：交叉轴方向，从中间开始布局排版
- stretch：交叉轴方向，如果 items 在交叉轴方向没有设置大小，那么让 items 在交叉轴的方向充满 flex 容器的高度。

其他属性不介绍了，不熟悉。

示例：

![align-items](https://upload-images.jianshu.io/upload_images/1924341-6ce0c20a2721cd63.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)    

(ps：flex 容器设置了 padding，所以 start 和 end 才没有贴靠边界 )

stretch 要能够生效，需要在 items 在交叉轴方向的不设置大小，如上图中主轴是水平方向，那么 items 需要不设置 height，此时 stretch 才能够让 items 拉伸占据交叉轴的高度。

有一点需要注意，当 flex 容器的 items 在主轴方向上只有一行时，可以很明确的使用这个属性来控制在交叉轴的排版方式。但，如果 items 在主轴上超过一行，那么最终的效果可能就不是想要的了，比如下图：

![align-items2](https://upload-images.jianshu.io/upload_images/1924341-bac610aee3b3dddc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

如果是想实现多行的 items 都作为一个整体居中，那么用 align-items 就无法实现了，针对这种有多行的情况，需要用另外一个属性来控制：align-content。

#### align-content

语法格式：

```
align-content: normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>
where 
<baseline-position> = [ first | last ]? baseline
<content-distribution> = space-between | space-around | space-evenly | stretch
<overflow-position> = unsafe | safe
<content-position> = center | start | end | flex-start | flex-end
```

当 flex 容器的 items 设置了溢出换行属性，且当前在交叉轴方向上存在多行 item 的情况下，该属性才会生效。

网上有种翻译，说这个属性是用于轴对齐，我不是很理解，我自己粗俗的分两种情况理解：

当需要进行 start, center, end 这些排版时，是将这些多行的 items 都看成一个整体，然后进行交叉轴方向上的排版控制。此时，将多行 item 看成一行之后，那么这个 align-content 之后的排版布局就跟 align-items 一样的效果了。

其他的 space-around，space-between 究竟是如何计算排版的，不熟悉。

属性值含义不看了，跟 align-items 一样的效果，直接看示例：

![align-content](https://upload-images.jianshu.io/upload_images/1924341-a4b4b11bb9799c85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

(ps：flex 容器设置了 padding，所以 start 和 end 才没有贴靠边界 )

#### place-content

语法格式：

```
place-content: <'align-content'> <'justify-content'>?
```

这个属性并没有另外的含义，它只是 align-content 和 justify-content 的简写用法而已。

如果你不想单独使用上述两个属性，可以将它们一起在 place-content 使用，如：

```
place-content: center center
//等效于
align-content: center;
justify-content: center;
```

作用于 flex-item 弹性盒子的子项身上的属性：

#### flex-basis

语法格式：

```
flex-basis: content | <'width'>

where 
<'width'> = [ <length> | <percentage> ] && [ border-box | content-box ]? | available | min-content | max-content | fit-content | auto

```

用于设置 items 在主轴方向的大小，如果主轴是水平方向，相当于设置 width，此时，该属性值会覆盖掉 width 设置的大小。

![ps](https://upload-images.jianshu.io/upload_images/1924341-abb7feeb207f305d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

尝试了下，在 chorme 浏览器上 content 属性不生效，不清楚，可能不同浏览器行为还不一样，既然这样，就先暂时不深入了解这个属性了，大概知道用于设置主轴方向上的 item 大小即可。

就算要使用，先直接用指定数值大小的方式好了。

#### flex-grow

语法格式：

```
flex-grow: <number>
```

用于设置 item 在主轴方向上的拉伸因子，即如果 flex 容器还有剩余空间，会按照各 item 设置的拉伸因子比例关系分配。默认值为 0，即不拉伸。

作用很像 Andorid 中的 LinearLayout 的 child 里设置了 layout_weight 用途一样。

示例：

![flex-grow](https://upload-images.jianshu.io/upload_images/1924341-28701dfa2bfefc3d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### flex-shrink

语法格式：

```
flex-shrink: <number>
```

用于设置 item 在主轴方向上的收缩因子，跟 flex-grow 刚好反着来。当 flex 容器空间不够，item 要溢出时，设置次属性可控制 item 按比例进行相应收缩，以便不让 item 溢出，默认 1，值越大收缩倍数越大，最后 item 就越小，0 表示不收缩，负值无效。

另外，如果设置了换行属性，那么这个就无效了。换行和收缩都是用于解决 item 在主轴方向上溢出的问题，既然是互斥，且换行优先级高，那么设置了换行，就不会再对 item 进行收缩了。

示例：

![flex-shrink](https://upload-images.jianshu.io/upload_images/1924341-456ce486db29b432.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### flex

语法格式：

```
flex: none | auto | initial | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
```

这属性是 flex-grow，flex-shrink，flex-basis 三个属性的简化使用，有三种属性值：

- none：元素会根据自身宽高来设置尺寸。它是完全非弹性的：既不会缩短，也不会伸长来适应flex容器。相当于将属性设置为 `flex: 0 0 auto`。 
- auto：元素会根据自身的宽度与高度来确定尺寸，但是会自行伸长以吸收flex容器中额外的自由空间，也会缩短至自身最小尺寸以适应容器。这相当于将属性设置为 `flex: 1 1 auto`. 
- initial：属性默认值， 元素会根据自身宽高设置尺寸。它会缩短自身以适应容器，但不会伸长并吸收flex容器中的额外自由空间来适应容器 。相当于将属性设置为"`flex: 0 1 auto`"。 

flex 属性可以指定 1 个，2 个或 3 个值。

**单值语法**: 值必须为以下其中之一:

- 一个无单位**数(\<number\>)**: 它会被当作 `<flex-grow>的值。`
- 一个有效的**宽度(width)**值: 它会被当作 `<flex-basis>的值。`
- 关键字 `none, auto`,或`initial`.

**双值语法**: 第一个值必须为一个无单位数，并且它会被当作`<flex-grow>的值。第二个值必须为以下之一：`

- 一个无单位数：它会被当作`<flex-shrink>的值。`
- 一个有效的宽度值: 它会被当作`<flex-basis>的值。`

**三值语法:**

- 第一个值必须为一个无单位数，并且它会被当作`<flex-grow>的值。`
- 第二个值必须为一个无单位数，并且它会被当作 `<flex-shrink>的值。`
- 第三个值必须为一个有效的宽度值， 并且它会被当作`<flex-basis>的值。`

#### align-self

语法格式：

```
align-self: auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position>
where 
<baseline-position> = [ first | last ]? baseline
<overflow-position> = unsafe | safe
<self-position> = center | start | end | self-start | self-end | flex-start | flex-end
```

用于给单个 item 设置交叉轴方向上的排版布局方式，属性值和作用跟 align-items 一样，区别仅在于 align-items 是 flex 容器的属性，它会作用于所有的 items 上；而 align-self 允许对单个 item 设置，该值会覆盖 align-items 设置的属性值。

这样就可以实现控制交叉轴上的每个 item 的不同布局方式，如下：

![align-items](https://upload-images.jianshu.io/upload_images/1924341-5ee64d58ee132497.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### order

语法格式：

```
order: <integer>
```

用于控制 items 的排版顺序，item 将按照 order 属性值的增序进行布局。拥有相同 order 属性值的元素按照它们在源代码中出现的顺序进行布局。默认值为 0，可设置负值，排序将在默认不设置的 item 前面。 

示例：

![order](https://upload-images.jianshu.io/upload_images/1924341-326dd86eb0d1ee85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 小结

我觉得，这些属性大体记得每个属性的主要用途即可，至于每个属性值如何设置，如何相互结合使用可以达到什么样的效果，写代码的时候再调就是了。

### 3.应用场景

以下场景中，如没有特别指明，flex 容器基本样式和 item 基本样式如下：

```css
.flex
{
    width: 200px;
    height: 200px;
    border-radius: 20px;
    background-color: #FFFFFF;
}

.dot {
    width: 50px;
    font-size: 28px;
    line-height: 50px;
    text-align: center;
    color: #FFFFFF;
    height: 50px;
    border-radius: 25px;
    background-color: black;
}
```

长这个样子：

![基本样式](https://upload-images.jianshu.io/upload_images/1924341-9f2db5850a9a9d61.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

白色区域是 flex 容器，黑色圆圈是 item。

#### 场景1:

在页面中把一个元素居中：item 水平、垂直方向都居中

```css
.flex
{
    display: flex;/* 声明这个元素作为 flex 容器 */
    flex-direction: row;/*主轴为水平方向*/
    justify-content: center;/*水平居中*/
    align-items: center;/*垂直居中*/
}
```

![场景1](https://upload-images.jianshu.io/upload_images/1924341-a51d6aced1b8644f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### 场景2：

前后有固定大小 item，中间区域自动拉伸占据可用空间。

```html
<style >
.flex
{
    display: flex;/* 声明这个元素作为 flex 容器 */
    flex-direction: row;/*主轴为水平方向*/
}
</style>

<div class="flex">
    <div class="dot" >1</div>
    <div class="dot" style="flex-grow: 1">2</div>
    <div class="dot" >3</div>
</div>
```

![场景2](https://upload-images.jianshu.io/upload_images/1924341-bbf735fb6e50cfbb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### 场景3：

响应式布局，在屏幕尺寸允许的情况下呈水平布局，但是在屏幕不允许的情况下可以水平折叠。 

```
.flex
{
    display: flex;/* 声明这个元素作为 flex 容器 */
    flex-direction: row;/*主轴为水平方向*/
    flex-wrap: wrap;/*溢出时换行*/
}
```

![场景3](https://upload-images.jianshu.io/upload_images/1924341-2624d00b8b06428e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

#### 场景4：

水平排列的一组 item 中，前几个左对齐，后几个右对齐。

这个需要结合块级元素的 margin 属性使用，当设置 margin: auto 时表示，将尽可能占据足够多的空间。

```html
<style >
.flex
{
    display: flex;/* 声明这个元素作为 flex 容器 */
    flex-direction: row;/*主轴为水平方向*/
}
</style>

<div class="flex">
    <div class="dot" >1</div>
    <div class="dot" >2</div>
    <div class="dot" margin-left="auto">3</div>
</div>
```

![场景4](https://upload-images.jianshu.io/upload_images/1924341-43f4d7ec238e1ad8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)