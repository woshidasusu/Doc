老规矩，先上图看效果。  


# 说明  
TextView的跑马灯效果也就是指当你只想让TextView单行显示，可是文本内容却又超过一行时，自动从左往右慢慢滑动显示的效果就叫跑马灯效果。  

其实，TextView实现跑马灯效果很简单，因为官方已经实现了，你只需要通过设置几个属性即可。而且，相关的资料其实网上也有一大堆了，之所以还写这篇博客出来是因为，网上好多人的博客都是只贴代码的啊，好一点的就是附带几张图片，可是这是动画效果啊，不动起来，谁知道跑马灯效果到底长什么样，到底是不是自己想要的效果啊（不会只有题主不知道跑马灯是什么效果吧，我不信！！！）。

所以，轻度强迫症的题主实在忍不住了，自己写一篇记录一下。另外，最近在学习竖直方向循环滚动显示的TextView，等理解掌握透了后也会记录下来。好了，话不多说，看代码。  

# 实现  
## xml方式  
> android:maxLines="1"  
  android:ellipsize="marquee"  
  android:marqueeRepeatLimit="-1"



## java代码方式 
> mMarqueeTv = (TextView) findViewById(R.id.tv_marquee_content);  
  mMarqueeTv.setEllipsize(TextUtils.TruncateAt.MARQUEE)  
  mMarqueeTv.setMaxLines(1);  
  mMarqueeTv.setMarqueeRepeatLimit(-1);

