emmmm，这次来梳理一下 Activity 切换动画的研究。首先，老规矩，看一下效果图：  

# 效果图  
![效果图.gif](http://upload-images.jianshu.io/upload_images/1924341-48ee346a06f201d3.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这次要实现的动画效果就是类似于上图那样，**点击某个 view，就从那个 view 展开下个 Activity，Activity 退出时原路返回，即缩放到点击的那个 view**。  

# 实现思路  
emmm，如果要你来做这样一个效果，你会怎么做呢？  

我们就一步步的来思考。  

首先来说说，要给 Activity 的切换写动画的话，可以通过什么来实现？也许这种场景比较少，但相信大家多多少少知道一些，嗯，如果你还是不大清楚的话，可以先看看这篇[实现Activity跳转动画的五种方式](http://blog.csdn.net/qq_23547831/article/details/51821159)，这个大神总结了几种方式，大概过一下有哪些方案即可，我也没深入阅读，感兴趣的话再慢慢看就可以了。  

这里就大概总结一下几种方式：  
> 1.使用 style 的方式定义 Activity 的切换动画  
> 2.使用 overridePendingTransition 方法实现 Activity 跳转动画  
> 3.使用 ActivityOptions 切换动画实现 Activity 跳转动画(部分动画可支持到 api >= 16)  
> 4.使用 ActivityOptions 动画共享组件的方式实现跳转 Activity 动画(api >= 21)  

目前我了解的也大概就是以上几种方式，前两种使用方式很简单，只需要在 xml 中写相应的动画（滑进滑出动画、渐变动画、放大动画等），然后应用到相应的 activity 即可。而且还不需要考虑兼容低版本问题。  

```  
<!--style方式-->
<item name="android:activityOpenEnterAnimation">@anim/anim_activity_enter</item>
<item name="android:activityCloseExitAnimation">@anim/anim_activity_exit</item>

//代码方式
startActivity(intent)
overridePendingTransition(R.anim.anim_activity_enter, R.anim.anim_activity_exit);

//anim_activity_enter.xml 和 anim_activity_exit.xml 就是在 xml 中写动画
```    

上述两种方式使用很简单，效果也很好。**缺点就是，不够灵活，只能实现 xml 写出的动画，即平移、渐变、缩放等基本动画的组合，无法实现炫酷的动画。**  

所以，显然，我们开头效果图展示的动画，用这两种 xml 实现的动画方式并没有办法做到，因为**放大动画的中心点位置是需要动态计算的**。xml 中写缩放动画时，中心点只能是写死的。  

这样的话， **style 的动画方案和 overridePendingTransition 的方案就只能先抛弃了**，那么再继续看看其他的方案。  

ActivityOptions 动画实现方案应该是 Google 在 Android 5.0 之后推出 Material Design 系列里的一个转场动画方案。当然，Google 在后续也推出了一些内置动画，方便开发者直接使用。  

![MaterialDesign动画示例.gif](http://upload-images.jianshu.io/upload_images/1924341-2f158d671ad7f419.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上图就是 Google 推出的 Material Design 规范的动画实现里一个示例。关于 Android 5.0 后的动画，网上一大堆相关文章，我也没在这方面里去深入研究过，所以这里就不打算介绍动画要怎么用（不然误导大家就不好了），感兴趣的可以自己去网上找找哈，这里就说下如果要实现开头介绍的动画，用这种方式可行不可行，可行的话又该怎么做。 

## Android 5.0+ Activity 转场动画  
开个小标题，因为觉得下面会讲比较多的东西。  

开头效果图的动画：新的 Activity 在点击的 View 的中心点放大。  

看上图 MaterialDesign 动画示例中，好像动画效果也是某个 View 展开下个 Activity？那这么说的话，这种方式应该就是可行的了？  

对 5.0+ 动画有所了解的话，示例中的动画应该有个名称叫：**共享元素切换动画**。意思就是字面上说的，两个 Activity 切换，可以设置它们的共享元素，也就是可以让上个界面的某个 View 在下个界面上做动画的一种效果。  

既然这样，我们就先来看看 5.0+ 动画，用代码怎么写。  

![5.0后切场动画调用.png](http://upload-images.jianshu.io/upload_images/1924341-0b5886ad9c85137b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

那些动画要怎么实现的我们就不看了，直接看怎么使用。上图的代码是个例子，如果要使用 5.0+ 的 Activity 转场动画，那就不能再继续使用 startActivity(Intent intent) 了，而是要使用 startActivity(Intent intent, Bundle options) 这个方法了。而 options 参数要传入的就通过 ActivityOptions 类指定的一些转场动画了，Google 为我们封装了一些动画接口，我们就来看看它支持哪些转场。  

![ActivityOptions动画接口列表.png](http://upload-images.jianshu.io/upload_images/1924341-a88ab7ebf2dcefc6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

所以，下面就来讲讲 **makeScaleUpAnimation()** 放大动画和 **makeSceneTransitionAnimation()** 共享元素动画。因为好像只有这两个可以实现开头效果图展示的动画效果。  

对了，上上图中的 ActivityOptionsCompat 类作用的 ActivityOptions 一样，只是前者是 Google 为我们提供的一个兼容实现，因为这是 5.0+ 动画，那么在 5.0 以下的版本就不能使用了，所以 Google 提供了兼容处理，让有些动画可以支持更低版本，动画效果都一致，至于内部具体是怎么实现，有兴趣可以去看看。但也不是所有的动画都做到兼容处理的，像 ActivityOptions 提供的几种动画，基本都可以兼容，但共享元素动画就不行了。至于哪些动画可以兼容，哪些不行，打开 ActivityOptionsCompat 类就清楚了，这个类在 support v4包里，下面就贴张图看看：  
![ActivityOptionsCompat.png](http://upload-images.jianshu.io/upload_images/1924341-d7d7fd5e7df1a22d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### makeScaleUpAnimation()  

![makeScaleUpAnimation.png](http://upload-images.jianshu.io/upload_images/1924341-11505ea33d501f89.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

接口参数的作用都在上图里注释了，理解了之后有没有发现，这个接口实现的动画效果就是我们想要的！！从哪放大，宽高从多少开始放大都可以自己设定，完美是不是！

**不是的**，还是别高兴太早了，这个接口确实可以实现点击哪个 View，就从哪个 View 放大的效果。但是返回呢，Activity 退出时要按原路缩小至点击的 View，这个要怎么做？是吧，找遍了所有接口都没有。  

不止这点，还有我们常见的 **setDuration()** 有找到么，**setInterpolator()** 有找到么？没有，都没有，也就是说如果要用这个接口做动画的话，动画的执行时间，还有插值器我们都没办法设置，那这肯定没法满足产品的需求啊，哪里有不修改执行时间和插值器的动画！**所以，这个方案也抛弃**。  

### makeSceneTransitionAnimation()  
共享元素动画就复杂多了，不管是我们要使用它的方式还是它内部做的事。总之，我对这个接触也不多，这里就大概概括一下使用的一些步骤：  

1. 需要对共享的元素设置 transitionName，在 xml 中设置 android:transitionName 或代码里调用 View.setTransitionName()。  

1. startActivity(Intent) 换成 startActivity(Intent intent, Bundle options)，options 需要通过 ActivityOptions.makeSceneTransitionAnimation() 设置。  

优点和缺点一会再说，先看看效果：  
![共享元素动画.gif](http://upload-images.jianshu.io/upload_images/1924341-2fb8d1a9aba1c0bb.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

效果貌似就是我们想要的，那我们就来说说这种方式的优缺点，然后再做决定。  

**优点：**  
1. 进入和退出时的动画都是由内部实现了，我们只需要设置参数就行。  

**缺点：**  
1. 共享的元素需要设置相同的 transitionName，我们点击的 View 和打开的 Activity 是动态的，不确定性的。所以，如果对这些 View 都设置相同的 transitionName 不知道会不会有新的问题产生。  

1. 新 Activity 的起始宽高和位置无法设置，默认位置是共享的 View，也可以理解成点击的 View，这点没问题。但起始宽高默认是点击 View 的大小，上面 gif 图演示可能效果不太好。也就是说，放大动画开始时，新 Activity 是从点击 View 的宽高作为起始放大至全屏，返回时从全屏缩小至点击 View 的宽高。上图中点击的 view 都很小，所以看不出什么，但在 Tv 应用的页面中，经常有那种特别大的 view，如果是这种情况，那动画就很难看了。  

1. 第2点缺点也许可以自己写继续 Transition 写动画来解决，但没研究过共享动画的原理，还不懂怎么修改。  

1. 最大的缺点是只支持 api >= 21 的。

基于目前能力不够，不足以解决以上缺点所列问题，所以**暂时抛弃该方案**，但后期会利用时间来学习下 5.0+ 转场动画原理。  

emmm，这样一来，岂不是就没办法实现效果图所需要的动画了？别急，方案还是有的，继续往下看。  

## Github 开源库方案  
其实，Github 上有很多这种动画效果的开源库，我找了几个把项目下载下来看了下代码，发现有的人思路是这样的：  
> Activity 跳转时，先把当前界面截图，然后将这张图传给下个 Activity，然后下个 Activity 打开时将背景设置成上个界面截图传过来的图片，然后再对根布局做放大动画，动画结束后将背景取消掉。  
>
> Activity 退出时有两种方案：  
>
>方案一：将当前 Activity 背景设置成上个界面的截图（这需要对这张图片进行缓存处理，不然图片很大可能已经被回收了），然后对根布局做缩小动画，动画结束之后再执行真正的 finish() 操作。  
>
>方案二：将当前 Activity 界面截图，然后传给新展示到界面的 Activity，然后做缩小动画。（这需要 Activity 有一个置于顶层的 View 来设置截图为背景，然后对这个 View 做动画。  


## 用 View 动画来实现 Activity 转场动画效果  
**（该集中注意力啦，亲爱的读者们，上面其实都是废话啦，就是我自己在做这个动画效果过程中的一些摸索阶段啦，跟本篇要讲的动画实现方案其实关系不大了，不想看废话的可以略过，但下面就是本篇要讲的 Activity 切换动画的实现方案了）**  

受到了 Github 上大神开源库的启发，我在想，Activity 界面其实也就是个 View，那既然这样我要打开的 Activity 设置成透明的，然后对根布局做放大动画，这样不就行了？  

想到就做，先是在 style.xml 中设置透明：  
```  
<item name="android:windowBackground">@android:color/transparent</item>
```  
然后实例化一个放大动画：  
```  
ScaleAnimation scaleAnimation = new ScaleAnimation(0.0f, 1.0f, 0.0f, 1.0f, x, y);
```  
宽高从 0 开始放大至全屏，x,y 是放大的中心点，这个可以根据点击的 View 来计算，先看看效果行不行，x,y 就先随便传个值。  

动画也有了，那需要找到 Activity 的根布局。想了下，这动画的代码要么是写在基类里，要么是写个专门的辅助类，不管怎样，代码都需要有共用性，那怎么用相同的代码找到所有不同 Activity 的根布局呢？  

规定一个相同的 id，然后设置到每个 Activity 布局文件的第一个 ViewGroup 里？---是可行，但太麻烦了，要改动的地方也太多了。  

别忘了，**每个 Activity 最底层就是一个 DecorView，虽然这个 DecorView 没有 id，但我们可以通过 getWindow().getDecorView() 来获取到它的引用啊**。  

再不然，**我们 setContentLayout() 都是将自己写的布局文件设置到一个 FrameLayout 里，记得吧，这个 FrameLayout 是有 id 的，是 Window 的一个静态常量 ID_ANDROID_CONTENT**, 所以我们可以通过下面方式来获取到：  
```  
View view = activity.findViewById(activity.getWindow().ID_ANDROID_CONTENT);
//View view = activity.getWindow().getDecorView();
```   
透明属性，动画，View 都有了，那接下去就是执行了，在哪里执行好呢，onCreate() 里或 onStart() 里应该都可以。那就先在 onCreate() 里执行试试看好了。  

噢，对了，很重要一点，**别忘了，Activity 转场是有默认动画的，不同系统可能实现的不同，所以得把这个默认动画关掉**，所以可以在 BaseActivity 里重写下 startActivity()，如下：  
```  
@Override
public void startActivity(Intent intent) {
    super.startActivity(intent);
    overridePendingTransition(0, 0);
}
```  
overridePendingTransition(0, 0) 传入 0 表示不执行切换动画，呈现出来的效果就是下个 Activity 瞬间就显示在屏幕上了，而我们又对下个 Activity 设置了宽高从 0 开始放大的效果，那么理想中实现的效果应该是：当前 Activity 呈现在界面上，然后下个 Activity 逐渐放大到覆盖住全屏。  

好，运行，看下效果：  
![Activity放大动画问题.png](http://upload-images.jianshu.io/upload_images/1924341-62a4b5795ee7cec5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

咦~，为什么周围会是黑色的呢，都设置了 windowBackground 是透明的了啊，emmm，上网查了下，发现还需要一个半透明属性 windowIsTranslucent，所以去 style.xml 中再加上：  
```  
<item name="android:windowBackground">@android:color/transparent</item>
<item name="android:windowIsTranslucent">true</item>
```  

再运行试一下，看下效果：  
![Activity放大动画.png](http://upload-images.jianshu.io/upload_images/1924341-404a5dc4fb83aae3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

嗯，效果出来了。那就下去就是退出时的动画了。退出动画跟打开动画其实就是反过程，动画变成缩小动画：
```  
ScaleAnimation scaleAnimation = new ScaleAnimation(1.0f, 0.0f, 1.0f, 0.0f, x, y);
```  
之前从 0 开始放大，现在换成从全屏开始缩小，x,y 就保存在 intent 携带的数据里。那么也就只剩最后一个问题，缩小动画该什么时候执行呢？  

我们退出一个页面时一般都是用 finish() 的吧，既然这样，在基类里重写一下这个方法：  
```  
@Override
public void finish() {
    ActivityAnimationHelper.animScaleDown(this, new AbsAnimationListener() {
        @Override
        public void onAnimationEnd() {
            BaseActivity.super.finish();
        }
    });
}
```  
x,y 的计算，动画的实现、执行我都是写在一个辅助类里，然后在 BaseActivity 里调用。这个不重要，思想比较重要。我们重写了 finish()，然后去执行缩小动画，同样动画是应用在 Activity 的根布局，然后写一个动画进度的回调，但动画结束时再去调用 super.finish()。也就是说，但调用了 finish() 时，实际上 Activity 并没有 finish() 掉，而是先去执行缩小动画，动画执行完毕再真正的去执行 finish() 操作。  

至此，开头所展示的效果图的动画效果已经实现。  

**但你以为事情做完了么？不，填坑之路才刚开始！（哭丧脸）**  

### 优化之路，又名填坑之路

我前面说过，这种方案只能算是一种暂时性的替代方案，知道我什么这么说么？因为这种方案实现是会碰到太多坑了。  

**1.动画的流畅性问题**  

首先是动画的流畅性问题，本篇里演示的 gif 图之所以看起来还很流畅，是因为切换的两个 Activity 界面都太简单了，但界面布局复杂一点时，打开一个 Activity 界面的测量、布局、绘制以及我们在 onCreate() 里写的一些加载数据、网络请求操作跟放大动画都挤到一起去了，甚至网络请求回来后更新界面时动画都还有可能在执行中，这样动画的流畅性就更惨了。  

在优化时，找到一个大神的一篇文章：[一种新的Activity转换动画实现方式](http://codethink.me/2015/06/21/a-new-implementation-of-activity-transition-animations/)  

这篇文章里讲的实现原理正是本篇介绍的方案，而且讲得更详细，可以继续去这篇看一下，相信你对本篇介绍的方案会更理解。  

有一点不同的是，大神的放大动画的执行时机是在 onPreDraw() 时机开启的，如下：  
``` 
view.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
    @Override
    public boolean onPreDraw() {
    view.getViewTreeObserver().removeOnPreDrawListener(this);
        if (view.getAnimation() == animation && !animation.hasEnded()) {
          return false;
        }
         view.startAnimation(animation);
         return true;
     }
});
``` 
emmm，说实话，这个回调第一次见，我也不大清楚它的回调时机是什么，作用是什么，网上的解释也摸棱两可，没看明白，待后续有时间自己看看源码好了。  

但我可以跟你们肯定的是，我看了一部分 5.0+ 动画源码，它内部也是在一个 Activity 的 onStart() 方法里注册了 onPreDraw() 回调监听，然后在回调时执行 5.0+ 的动画。但它内部做的事，远不止这些，实在是太多了，估计是进行的一些优化操作，我目前是还没有能力去搞懂。  
但我们动画执行的时机是需要换一下了，想一下也知道，在 onCreate() 里做动画，听着就感觉有点奇怪。既然大神，还有 Google 官方都是在 onPreDraw() 里执行，那我们当然可以模仿学习。  

看 5.0+ 源码过程中，发现它在动画开始和结束前会调用一个 ViewGroup 的 suppressLayout() 方法，这个方法是隐藏的：  
![suppressLayout.png](http://upload-images.jianshu.io/upload_images/1924341-a7a7aed7e16f2663.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这是一个隐藏的方法，我们要调用的话，就需要通过反射的方式。这个方法的注释大概是说禁止 ViewGroup 进行 layout() 操作。这样的话，我们有一个可以优化的地方，我们可以在动画开始时调用这个方法禁止 layout() 操作，动画结束时恢复。  

这样做的好处是，动画执行过程中，如果网络或本地数据已经回调，通知 adapter 去刷新 view 时，这样会导致动画很卡顿。所以，当我们用 suppressLayout() 做了优化之后，就只有等动画结束的时候界面才会去重新 layout 刷新布局，优化动画流畅性。  

但这样做也有一个问题是，如果你在 onCreate() 或 onResume() 之类的方法发起一个 requestFocus() 操作的话，很有可能这个操作会被丢弃掉，导致界面理应获得焦点的 view 发生错乱问题。  

至于原因，因为对 suppressLayout() 也还不是很理解，打算等对 onPreDraw() 理解了之后一起研究一下。  

**2.windowIsTranslucent 半透明引发的问题**  
哇，这个属性，真的是。。。  
你们好奇的话，就网上搜一下这个半透明属性，一堆各种问题。但其实，网上碰到的那些问题，我基本都没遇到过，但我遇到的是更奇葩，网上没找到解决方案的问题，哭瞎。  

emmm，我是做 Tv 应用开发的，windowIsTranslucent 这个在不同的盒子上表现的效果不一样，简直了。  

在设置了 android:windowIsTranslucent=true 时，有的盒子界面就会是透明的，即使你设置了一张不透明的背景图，但透明度不会很明显。  
有的盒子则是在新的 Activity 打开时，如果 view 没有完全加载出来，则会显示上个 Activity 的界面，造成的现象就是打开新 Activity 时，会一瞬间闪过上个界面的画面。  

还有，Tv 应用一般都会跟视频播放有关，那就涉及到播放器。而播放器需要一个 surfaceview，而 surfaceview 遇到半透明属性时，问题更多。  

原因，都不清楚（哎，可悲）。但只要不使用半透明这个属性，就一切正常了，但如果不用这个属性，本篇介绍的动画方案又没法实现。这真的是鱼和熊掌不可兼得啊。  

所以，我就在想，**既然 windowIsTranslucent 为 false 时，一切正常；为 true 时，动画正常。那是否有办法在动画过程中设置为 true，动画结束之后设置为 false 呢？**如果可以的话，按理来说应该正好解决问题。  

但找了半天，没有找到相关的接口来动态设置这个属性的值，这个半透明属性值是设置在 style.xml 里的。网上有一些介绍说：在代码动态修改 style 的，但打开那些文章你会发现，说的是动态修改，但基本都要求要么在 super.onCreate() 之前调用，要么在 setContentLayout() 之前，要么重写 setTheme()，这么多限制，那哪里有用。  

后来，在找播放器黑屏的问题时，找到一篇大神写的博客：[Android版与微信Activity侧滑后退效果完全相同的SwipeBackLayout](http://www.jianshu.com/p/b6d682e301c2)。  

题目虽然看起来跟本篇一点关系都没有，但作者遇到的问题跟我的问题本质上是一个的，也是 windowIsTranslucent 属性导致的问题。很开心的是，作者介绍了**利用反射去调用 Activity 里的 convertFromTranslucent() 和 convertToTranslucent() 方法来动态修改这个半透明属性值，这两个方法是对外隐藏的**。  

后来，我很好奇 5.0+ 的动画到底是怎么实现的这种动画效果，因为它明明不需要设置 windowIsTranslucent 为 true，但它的动画，Activity 在跳转时，上个 Activity 是可见的，这是怎么做到的。  

我跟踪了一部分源码，也很开心的发现，原来它内部也是用的 Activity 里的这两个方法，在动画开始前将 Activity 设置成半透明的，动画结束后设置回去。当然，内部它有权限调用 Activity 的方法，而我们没有权限，所以只能通过反射来调用。  

开心，问题解决了。我们只要通过反射，在动画开始之前调用 Activity 的 convertToTranslucent() 将 Activity 设置成半透明的，动画结束再调用 convertFromTranslucent() 设置回去，这样动画的效果达到了，又不会因为设置了 windowIsTranslucent 为 true 而引入各种问题。  

**但是，测试时发现，在 api 21 以下的盒子上，这个方法没启作用。**  

我去查看，比较了下 21 以上和以下 Activity 的代码，发现 convertToTranslucent() 这个方法它的内部实现是不一样的，21及以上是一套代码，21以下至19是一套代码，19以下则是没有这两个方法。  

后来又仔细看了上面大神那篇文章，发现说，原来 19-21 的版本，这两个方法要能够生效的话，需要默认在 style.xml 先将 Activity 设置成半透明的，而 21 及以上的，则不需要。至于19以下的，就完全不能用这个方法了。

解决方法也很简单，那就在 style.xml 默认设置 Activity 是半透明的，这样动画结束之后再设回去就可以了。  

**但是，这样播放器就会有问题---黑屏**。原因是因为调用了 convertFromTranslucent() 设置不透明，一旦调用这个方法，如果该界面有播放器，那么就会黑屏。至于具体原因，还是不清楚，上面那个大神的文章里也提到了这个现象，但他也不知道如何解决，我也不知道。  

最后，为了解决黑屏的问题，只能是如果界面有播放器的话，那个这个界面的动画就换另外一种方法来实现，至于是什么方案也可以实现开头介绍的动画效果，我就不说了，Github 上很多，但都有同一个特点，那就是贼麻烦。  

稍微总结一下，本篇提的动画方案适用于以下几种场景：  
1. **如果你的应用设置了 windowIsTranslucent 为 true 时，没有发现什么问题的话，那恭喜你，该动画方案可以兼容各种版本。**  

1. **如果你的应用设置了 windowIsTranslucent 为 true 时会有一些问题，但你的应用里没有播放器的话，那恭喜你，该动画方案可以兼容 19 及以上版本。**  

1. **如果你的应用设置了 windowIsTranslucent 为 true 时会有一些问题，而且应用里也有播放器的话，那如果你实在走投无路想使用该动画方案的话，那你再来找我吧，在研究出其他方案之前，咱们一起来慢慢填坑。**    

**注：本篇侧重点是介绍一种 Activity 动画方案的实现思路，注意，是思路！因为本篇所介绍的动画方案并不成熟，仍有很多坑，所以，学习、探讨就可以，慎用！**

# Github 链接  
上传了一个 demo，如果对这种动画方案感兴趣的话，可以去看看代码。跟动画有关的代码都在 ui/anim 文件夹里。  
[一种 Activity 转场动画----点击哪里从哪放大](https://github.com/woshidasusu/ActivityAnimationDemo)  

![项目.png](http://upload-images.jianshu.io/upload_images/1924341-ab7dc4915dc5ec24.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 遗留问题  
老样子，最后再留几个问题给大家思考一下（其实我也不懂，还望有大神能解答一下）  

**Q1：overridePendingTransition() 实现的转场动画一点都不卡，但用 View 动画方案来实现 Activity 转场动画有时会有些卡顿，感觉是 Activity 启动做的那一大堆事跟动画挤一起了，那 overridePendingTransition() 原理到底是怎么实现？跟着源码跳进去看感觉有点懵，有时间得再研究一下这部分的源码。**  

**Q2：Activity 切换时，一般下个 Activity 直接覆盖在本 Activity 上了，按我的理解，如果对要打开的 Activity 的 window 设置成透明属性，那应该就可以看到下层的 Activity 才对，为什么不行呢？为什么一定要设置 android:windowIsTranslucent = true 才可以呢？android 5.0 的共享元素动画很明显可以看到下个 Activity 在缩放时，上个 Activity 是可见的，那么它又是怎么实现的呢？原理是什么呢？这部分源码看了一部分了，等理解透了点，在梳理出来。**  



