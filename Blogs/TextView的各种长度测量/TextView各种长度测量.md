老规矩，先上张图  


虽然我们平时只用TextView显示纯文本数据，但其实TextView正如上图所示一样，可以设置Background,四周的drawable小图标，以及Span数据比如文本或图片。在Android里不管是什么控件都是占据一个矩形的空间，那么在一个TextView该如何计算各个矩形的大小呢？或者说，TextView提供的各种获取长度的接口又改怎么用呢？本文主要就是来写写这些。  

# 主要的API(TextView)  
> getWidth(), getHeight()  
  getPadding(), getPaddingLeft/Right/Top/Bottom()  
  getCompoundDrawablePadding(), getCompoundPaddingLeft/Right/Top/Bottom()  
  getLayout().getLineWidth(int line)  
  getExtendedPaddingBottom/Top()  
  getTotalPaddingLeft/Right/Top/Bottom()  


# 主要应用场景  
1. 计算Text的长度  


# 扩展  
在上一篇中的TextView跑马灯的实现中，为什么设置android:maxLines(1)不能启动跑马灯效果，而必须使用android:singleLine="true"才行呢？  


