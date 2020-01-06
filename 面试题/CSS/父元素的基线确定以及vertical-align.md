# 行基线的确定以及 vertical-align

PS：这个知识点确实很乱，建议有能力直接阅读规范，以下是个人见解，不保证正确，仅供参考

### vertical-align

先来看看 vertical-align 这个属性，需要特别注意，它与 text-align 不是可类比的

有的人可能是这么理解，text-align 设置行内元素的水平对齐方式，而 vertical-align 设置行内元素的垂直对齐方式

**这个理解是不对的！**

vertical-align 是设置**当前元素在当前行的排版布局时**的垂直方向上的对齐方式

这个是什么意思呢？

标准文档流在排版布局元素时，是按照块级元素和行内元素来进行排版，块级元素占据一整行，行内元素才有可能在一行中多个并列

所以 vertical-align 其实是行内元素的属性，用来指示当前行内元素在当前行的空间内，垂直方式的对齐方式

而且，vertical-align 里的 middle 跟 text-align 里的 center 也是不一样的！

vertical-align 支持的一些场景值：baseline（默认值），top，middle，bottom 等等

要理解这些，其实很简单，看张图就理解了：

![](https://upload-images.jianshu.io/upload_images/1924341-5ba41e26fd340c0f.jpg)

也就是写英文单词时的四条对标线，x 底部是 baseline，x 顶部是 middle，X 顶部是 top，g 底部是 bottom 这样子

所以，middle 并不是垂直居中的意思，而 text-align 里的 center 是水平居中的意思，需要注意区别

下面看看 vertical-align 各个取值的含义：

- baseline（默认值）：当前元素的 baseline 与当前行的 baseline 重叠对齐
- top：当前元素的 top 与当前行框的顶部重叠对齐
- middle：太复杂，不懂
- bottom：当前元素的 bottom 与当前杭匡的底部重叠对齐

当前还有其他值，类似，不研究了

### 行基线的确定

其实可能根本没有当前行基线这种概念，或说法，我这里这么写，完全是搞个我自己比较能理解的角度

在其他文章里，可能叫做父元素的基线、基准元素的基线等等

总之，不管叫什么，对一行内的多个行内元素在垂直方向上的处理，当轮到某个元素时，它的排版布局肯定是需要有一个基准存在的，也就是说它的 vertical-align 设置的对齐方式，肯定是需要有某个被对齐的来当做基准

至于这个被拿到当基准的究竟是什么，无所谓了

下面看个例子：

```html
   <div style="background: #ffc;">
     <span style="background: #ff22cc">xXg</span>
	 <span style="background: #2222cc">中文</span>
	 xCg
	 <div style="display: inline-block; background: #cc22ff">
	   <p style="margin: 0">xXg</p>
	   <p style="margin: 0">xXg</p>
	   <p style="margin: 0">xXg</p>
	 </div>
	 <div style="height: 10px;"></div>
	 <div style="display: inline-block; background: #cc22ff">
	   <p style="margin: 0">xXg</p>
	   <p style="margin: 0">xXg</p>
	   <p style="margin: 0">xXg</p>
	 </div>
   </div>
```

猜猜这个长什么样子，也就有个块级容器内，从左到右分别是：

1. 行内元素，文本内容 `xXg`
2. 行内元素，文本内容`中文`
3. 当前元素的文本内容 `xCg`
4. 行内块元素，子元素是三个 p 元素
5. 块级元素
6. 行内块元素，子元素是三个 p 元素

按照标准文档流的排版布局方式，我们知道，前 4 部分都会在同一行内并列，然后 5 单独占据一行，6 新起一行，6 个部分都在父元素 div 内

大方向是这样，那细节呢，前 4 个部分会在同一行内并列，但他们高度明显不一样，那在垂直方向上，他们是怎么排版布局的呢？

![](https://upload-images.jianshu.io/upload_images/1924341-c24fbaf1aa221cf3.jpg)

结合上面介绍的 vertical-align 知识，再来分析看看：

前 4 个都是行内元素，所以他们在当前行的垂直方向上的排版是就是由各自的 vertical-align 属性决定，如果没有手动设置，那么 baseline 就是默认值，也就是说每个行内元素都是对其当前行的 baseline

所以，这里就又有个疑问了：

**当前行的 top, middle, baseline, bottom 线是如何确定的？**

我是这么理解的：

当前行的 baseline 是当前行内所有元素里 vertical-align 属性为 baseline 且高度最高的那个元素的 baseline

通常这个元素是行内块元素，因为只有它才有可能具有多行结构，高度才有可能超过一行

那对于这个行内块元素，它的 baseline 就是它内部最后一行的 baseline

