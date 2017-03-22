老规矩，先上张图  
o，这篇好像是分析篇，没有效果图。不管了，位置占着，老规矩不能坏，下面开始正文。  
***   

这篇博客会讲得比较杂：
> 1. TextView里各部分的大小该怎么测量?  
> 1. 如何计算每行文字的长度?  
> 1. 设置android:maxLines="1"和android:singleLine="true"有什么区别?  
> 1. 为什么设置android:maxLines="1"时TextView的跑马灯效果就不能正常工作？    

# TextView里各部分的大小该怎么测量?  
虽然我们平时只用TextView显示纯文本数据，但其实TextView支持设置Background,四周的drawable小图标，以及Span数据比如文本或图片。在Android里不管是什么控件都是占据一个矩形的空间，那么在一个TextView里该如何计算各个矩形的大小呢？下面是TextView提供的各个获取长度宽度的接口： 
  
> getWidth(), getHeight()  
  getPaddingLeft/Right/Top/Bottom()  
  getCompoundPaddingLeft/Right/Top/Bottom()  
  getExtendedPaddingBottom/Top()  
  getTotalPaddingLeft/Right/Top/Bottom()  

先看一下布局代码：  
![6.png](http://upload-images.jianshu.io/upload_images/1924341-99ada744fe8ebd18.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
@drawable/icon_person_n  
![7.png](http://upload-images.jianshu.io/upload_images/1924341-078785888c6534a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

下面是效果图，做了一些标注：  
![8.png](http://upload-images.jianshu.io/upload_images/1924341-5b763cffae661b64.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

下面来看一下上述获取长度的接口的数据，你可以使用打日志方式，我是比较习惯用调试方式：  
![9.png](http://upload-images.jianshu.io/upload_images/1924341-afbe5725d9479398.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

所以，总结一下：  
**getWidth(), getHeight()**：对应你代码里的layout_width和layout_height。  

**getPaddiingLeft/Right/Top/Bottom()**：对应代码里的Padding。  
以上两个比较容易理解，毕竟经常打交道。  

**getCompoundPaddingLeft/Top/Right/Bottom()**： 翻译成中文就是获取混合的Padding, 既然是混合的，那么它的值也就是padding + 图片的大小 + drawablePadding的值。说得通俗点就是，它是获取文字区域到TextView边界之间的间隔。附上源码：    
![10.png](http://upload-images.jianshu.io/upload_images/1924341-8381c0f04698e797.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  

**getExtendedPaddingTop()**：这个是当有部分文字没有显示出来时，也就是设置了maxLine时，它的值就等于首行文字到TextView顶端的距离。同理，getExtendedPaddingBottom()就是最后一行文字到TextVeiw底部距离。其他情况下，他的值等于getCompoundPaddingTop/Bottom()的值。这个源码不多，但也不怎么好讲解，就贴两张图对比下，就明白了。  

![11.png](http://upload-images.jianshu.io/upload_images/1924341-66ade1367a0641a8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
![12.png](http://upload-images.jianshu.io/upload_images/1924341-a66565322f0cd4bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

 **getTotalPaddingLeft/Right/Top/Bottom()**：翻译下就是获取总的Padding值，看了下源码，左右的值直接就是等于compoundPadding的值，上下的值等于ExtendedPadding的值再加上offset的值（跟Gravity的垂直方向的布局有关。说得通俗点就是，不管有没有maxLines，上下的值都分别等于首行到TextView顶端和末行到TextView底部的值。  

这些接口除了前面两个比较常用外，其他基本很少用吧，我也是因为在看TextView的跑马灯部分的源码才接触到，然后为了弄明白才记录下来的。至于后面那些接口的应用场景，getCompoundPadding()这个的应用场景倒是很明确，可以用来判断相应的drawable是否发生点击事件之类的需求。至于extendedPadding和totalPadding这两个的应用场景，我想了想，觉得应该是涉及需要计算显示出来后的文字高度的相关需求时会用到吧。有对这些接口很熟悉的童鞋可以分享出来哈，一起学习学习。  

**最后用一张图总结一下，我把TextView分成内容区域，内容区域和TextView边界之间的间隔就是padding的值，内容区域包括drawable区域和文字区域，drawable区域和文字区域之间的间隔就是drawablePadding的值，文字区域和TextView之间的间隔就是CompoundPadding的值。**  
  
   

# 如何计算每行文字的长度? 
其实，这里要区分两种概念，文字区域的长度和实际文字的长度，为什么要区分这两种。因为一个TextView不单单只是显示文字而已，他还支持drawable，支持设置padding，所以文字区域的长度就需要减去这些无关的部分。又由于TextView的自动换行策略，每一行显示的文字长度其实不是固定的。再加上，TextView还支持singleLine和maxLines的设置，那么超出显示区域的文字部分长度呢？

# 设置android:maxLines="1"和android:singleLine="true"有什么区别? 

# 为什么设置android:maxLines="1"时TextView的跑马灯效果就不能正常工作？




