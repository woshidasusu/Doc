import{_ as e,o as i,c as n,d as s}from"./app-pwInIdNR.js";const l="/assets/2-i7jOiATn.gif",d="/assets/1-udHkHJNp.png",a="/assets/2-6Ms2Dylu.png",r={},t=s('<p>老规矩，先上图看效果。</p><p><img src="'+l+'" alt="2.gif"></p><h1 id="说明" tabindex="-1"><a class="header-anchor" href="#说明" aria-hidden="true">#</a> 说明</h1><p>TextView的跑马灯效果也就是指当你只想让TextView单行显示，可是文本内容却又超过一行时，自动从左往右慢慢滑动显示的效果就叫跑马灯效果。</p><p>其实，TextView实现跑马灯效果很简单，因为官方已经实现了，你只需要通过设置几个属性即可。而且，相关的资料其实网上也有一大堆了，之所以还写这篇博客出来是因为，网上好多人的博客都是只贴代码的啊，好一点的就是附带几张图片，可是这是动画效果啊，不动起来，谁知道跑马灯效果到底长什么样，到底是不是自己想要的效果啊（不会只有题主不知道跑马灯是什么效果吧，我不信！！！）。</p><p>所以，轻度强迫症的题主实在忍不住了，自己写一篇记录一下。另外，最近在学习竖直方向循环滚动显示的TextView，等理解掌握透了后也会记录下来。好了，话不多说，看代码。</p><h1 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h1><blockquote><p><strong>android:ellipsize=&quot;marquee&quot;</strong> //设置超出显示区域的内容以跑马灯效果呈现，该值还可以设置成END, START等，就是我们常见的在末尾&quot;...&quot;显示。<br> **android:singleLine=&quot;true&quot; ** //跑马灯启动的条件之一，另外官方推荐说该方法已废弃推荐使用maxLines=&quot;1&quot;, 不用去鸟他，用maxLines的话跑马灯效果也不会启动。<br><strong>android:focusable=&quot;true&quot;</strong> //跑马灯启动的条件之一<br><strong>android:marqueeRepeatLimit=&quot;-1&quot;</strong> //设置循环几次，-1表示无限循环</p></blockquote><p><img src="'+d+'" alt="1.png"></p><h1 id="跑马灯不能启动的问题" tabindex="-1"><a class="header-anchor" href="#跑马灯不能启动的问题" aria-hidden="true">#</a> 跑马灯不能启动的问题</h1><p>如果对TextView的跑马灯不熟悉的话，第一次使用应该会碰到各种跑马灯效果不工作的状态。其实这是因为跑马灯的启动有多个条件，也就是上面的属性除了最后一条设置循环次数的除外，其他的均必须进行设置。TextView得是单行显示，还必须可以获取焦点，这样当TextView获取焦点后跑马灯效果才会启动，如最上面动图里的第二个TextView。</p><p>看下TextView关于跑马灯启动的相关源码你就会更清楚</p><p><img src="'+a+`" alt="2.png"></p><p>#扩展<br> 其实，跑马灯更常见于TV应用上，因为只有在TV应用上才需要区分获取焦点时的状态以及点击的状态，毕竟TV应用都不支持触屏模式，都是有遥控操作，焦点状态的提示就显得很重要。</p><p>而对于触屏手机来说，当触摸时，也就同时获取点击状态和焦点状态了，所以在触屏手机上，跑马灯更常见的应用场景则是，不管TextView有没有获取焦点，都让跑马灯效果一直处于启动状态，正如最上面动图里的第一个TextView。如果要实现这个效果，只需要继承TextView，重写几个方法就好了。代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/**
 * 跑马灯效果的TextView, 使用方式：
 * 启动/关闭：{@link #setMarqueeEnable(boolean)}
 * xml文件中记得设置：android:focusable=&quot;true&quot;, android:singleLine=&quot;true&quot;
 *
 * Created by dasu on 2017/3/21.
 * http://www.jianshu.com/u/bb52a2918096
 */

public class MarqueeTextView extends TextView {

    private boolean isMarqueeEnable = false;

    public MarqueeTextView(Context context) {
        super(context);
    }

    public MarqueeTextView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public MarqueeTextView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setMarqueeEnable(boolean enable) {
        if (isMarqueeEnable != enable) {
            isMarqueeEnable = enable;
            if (enable) {
                setEllipsize(TextUtils.TruncateAt.MARQUEE);
            } else {
                setEllipsize(TextUtils.TruncateAt.END);
            }
            onWindowFocusChanged(enable);
        }
    }

    public boolean isMarqueeEnable() {
        return isMarqueeEnable;
    }

    @Override
    public boolean isFocused() {
        return isMarqueeEnable;
    }

    @Override
    protected void onFocusChanged(boolean focused, int direction, Rect previouslyFocusedRect) {
        super.onFocusChanged(isMarqueeEnable, direction, previouslyFocusedRect);
    }

    @Override
    public void onWindowFocusChanged(boolean hasWindowFocus) {
        super.onWindowFocusChanged(isMarqueeEnable);
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="最后" tabindex="-1"><a class="header-anchor" href="#最后" aria-hidden="true">#</a> 最后</h1><p>以上就是使用TextView跑马灯的记录，那么，如果不用官方提供的有没有办法实现呢，答案肯定是有的，怎么做呢，不知道，最近正好没事，自己试试看去。</p>`,18),u=[t];function c(v,o){return i(),n("div",null,u)}const m=e(r,[["render",c],["__file","TextView实现跑马灯效果.html.vue"]]);export{m as default};
