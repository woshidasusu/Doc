最近基于 [Android StackBlur](https://github.com/kikoso/android-stackblur) 开源库，根据自己碰到的需求场景，封装了个高斯模糊组件，顺便记录一下。  

**为什么要自己重复造轮子？**  

其实也谈不上重头自己造轮子，毕竟是基于大神的开源库，做了二次封装。封装的目的在于，方便外部使用。毕竟有着自己的编程习惯，大神的开源库也只是提供了基础的功能，现实编程中，产品的需求是各种各样的。

导致每次使用时，都蛮麻烦的，需要额外自己处理蛮多东西。而一旦新的项目又需要接入高斯模糊了，又得重新写一些代码，复制粘贴也麻烦，经常由于各种业务耦合报错。

既然如此，干脆花时间抽个基础、公用的高斯模糊组件，需要时直接依赖即可。

# 基础理论  

### 高斯模糊

高斯模糊的原理和算法就不介绍了，我也不懂，没深入，这里就大概讲讲我的粗坯理解：

我们知道，一张图片，本质上其实是一个个像素点构成的，虽然经过计算机处理后，呈现在我们眼前的是具体的图像。但在计算机中，其实就是一堆数组数据。

数组中每个单位就是一个个像素点，那么每个像素点是存储什么内容呢，其实也就是 RGB 或者 ARGB 之类格式的数据。

高斯模糊，大体上就是对这张图片中的每个像素点都重新进行计算，每个像素点的新值等于以它为中心，半径为 r 的周围区域内所有像素点各自按照不同权重相加之和的平均值。

可以粗坯的理解为，**本来这个像素点是要呈现它自己本身的内容，但经过高斯模糊计算后，掺杂进它周围区域像素点的内容了。就像加水稀释类似的道理，既然都掺杂进周围的内容了，那么它呈现的内容相比最初，肯定就不那么清晰了**。

而如果掺杂的半径越大，混合进的内容也就越多，那么它本身的内容就越淡了，是不是这个理。所以，这就是为什么每个开源的高斯模糊组件库，使用时基本都需要我们传入一个 radius 半径的参数。而且，半径越大，越模糊。

这么一粗坯的解释，就理解多了，是吧。

为什么需要大概掌握这个理论基础呢？

想想，高斯模糊是遍历所有像素点，对每个像素点都重新计算。那么，这自然是一个耗时的工作，掌握了理论基础，我们要优化时也才有方向去优化。

### 性能对比

大神的开源库中提供了三种高斯模糊方式，而我在 [Blankj 的 AndroidUtilCode](https://github.com/Blankj/AndroidUtilCode) 开源库中发现了另外一种，所以我将他们都整合起来，一共有四种：

- Google 官方提供的 RenderScript 方式 （RSBlur）
- C 编写的高斯算法 blur.c 方式 （NativeBlur）
- Java 编写的高斯算法方式1（JavaBlur）
- Java 编写的高斯算法方式2（StackBlur）

其实，大体上就三种：Google 官方提供的，大神用 C 写的高斯模糊算法，大神用 Java 写的高斯模糊算法。至于后面两种，看了下，算法的代码不一样，我就把它们当做是两种不同的算法实现了。也许是一样，但我没深入去看，反正代码不一样，我就这么认为了。

下面我们来做个实验，在如下相同条件下，不同高斯模糊方案的耗时比较：

- radius=10, scale=1, bitmap=200*200(11.69KB)

ps: radius 表示高斯算法计算过程中的半径取值，scale=1表示对 bitmap 原图进行高斯模糊。这些前提条件需要了解一下，不然你在看网上其他类似性能比对的文章时，发现它们动不动就优化到几 ms 级别的，然而你自己尝试却始终达不到。这是因为也许所使用的这些前提都不一致，不一致的前提下，耗时根本无从比较。

```java
private void testBlur() {
	int sum = 0;
	for (int i = 0; i < 100; i++) {
		long time = SystemClock.uptimeMillis();
		DBlur.source(this, R.drawable.image).modeRs().radius(10).sampling(1).build().doBlurSync();
		long end = SystemClock.uptimeMillis();
		sum += (end - time);
	}
    Log.e("DBlur", "RSBlur cast " + (sum/100) + "ms");
}
```

代码模板如上，分别运行 100 次后取平均值，四种不同方式的耗时如下表：

|                 前提条件                  | RSBlur | NativeBlur | JavaBlur | StackBlur |
| :---------------------------------------: | :----: | :--------: | :------: | :-------: |
|  radius=**10**, scale=1, bitmap=200*200   |  51ms  |    13ms    |  162ms   |   384ms   |
|  radius=**20**, scale=1, bitmap=200*200   |  56ms  |    12ms    |  164ms   |   435ms   |
|  radius=10, scale=**2**, bitmap=200*200   |  48ms  |    11ms    |   75ms   |   110ms   |
|  radius=10, scale=**8**, bitmap=200*200   |  45ms  |    7ms     |   14ms   |   19ms    |
| radius=10, scale=8, bitmap=**1920\*1180** | 183ms  |   143ms    |  346ms   |   460ms   |
| radius=**20**, scale=8, bitmap=1920*1180  | 204ms  |   145ms    |  353ms   |   510ms   |
| radius=20, scale=**1**, bitmap=1920*1180  | 474ms  |   444ms    |  8663ms  | 内存溢出  |

100 次样本可能不多，但大体上我们也能比较出不同类型的高斯模糊之前的区别，及其适用场景：

- 总体上，NativeBlur 和 RSBlur 的耗时会少于 JavaBlur 和 StackBlur
- JavaBlur 和 StackBlur 方式，如果先对 Bitmap 进行缩小，再高斯模糊，最后再放大，耗时会大大缩短
- radius 增大会增加耗时，但影响不大，但视图呈现效果会越模糊
- scale 对原图缩小倍数越多，耗时越短，但视图呈现效果同样会越模糊
- 分辨率越高的图片，高斯模糊的就越耗时
- 对于大图而言，如果要使用 JavaBlur 或 StackBlur，最好设置 scale 先缩小再模糊，否则将非常耗时且容易内存溢出
- 如果已经通过 scale 方式进行优化，那么最好 radius 值可以相对小一点，否则两者的值都大会对图片的模糊效果特别强烈，也许会过了头

### 性能优化

高斯模糊的优化考虑点，其实就三个：

- 选择不同的高斯模糊方式
- 通过 scale 对原图先缩小，再模糊，最后再放大方式
- 优化高斯模糊算法

最后一点就不考虑了，毕竟难度太大。那么，其实就剩下两种，要么是从高斯模糊的方案上选择，要么从待模糊的图片上做手脚。

虽然有四种高斯模糊方案，但每种都有各自优缺点：

- RSBlur 在低端机上可能无法兼容
- NativeBlur 需要生成对应 CPU 架构的 so 文件支持
- JavaBlur 和 StackBlur 耗时会较长

优化的考虑点大体上这几种：

- 大体上，使用 NativeBlur 或者 RSBlur 即可，如果出现一些问题，那么此时可考虑切到 JavaBlur 或 StackBlur 方案，但记得结合 scale 方式优化处理。
- 如果高斯模糊的图片有实时性要求，要求模糊得同步进行处理，主线程后续的工作需要等待高斯模糊后才能够处理的话，那么尽量选择 scale 方式进行优化，减少耗时。
- 如果对实时性没要求，但对图片模糊程度有要求，那其实，只要后台异步去进行高斯模糊即可，此时 scale 可不用缩小太多，而利用 radius 来控制模糊效果，以达到理想的要求。
- 如果两者都有要求，那就自行尝试寻找折中点吧。

最后说一点，因为已经封装成组件库了，RSBlur 也是引入的 support 包，so 文件也打包好了，那么使用这两种方案足够满足绝大部分场景了，所以，没有特意指定，组件默认的方案为 RSBlur。

# 二次封装

### 需求场景

为什么要二次封装？那肯定是因为有自己的各种需求场景的，我的需求如下：

- 要能够对当前页面（Activity）截图后，进行模糊
- 要能够对 drawable 资源图片进行模糊、或者对指定 View 的视图进行模糊
- 模糊完成后，要能够自动以淡入的动画方式显示在指定的控件上
- 存在这种需求场景：对当前界面截图、并且模糊，模糊后的图片展示的时机可能在其他界面，因此需要支持缓存功能，可以根据指定 cacheKey 值获取缓存
- 当然，可以根据各种配置使用高斯模糊，当不指定配置时，有默认配置

总结一下，其实封装要做的事也就是要实现：

- 截图、缓存、淡入动画、默认配置
- 可以的话，组件最好可以达到，其他人在不看文档，不看源码前提下，以最少的成本接入直接上手使用

### 实现

截图、缓存、动画这些都属于纯功能代码的封装了，具体就不说了。

这里想来讲讲，如何设计，可以让其他人以最少的成本接入直接上手使用。

我的想法是，利用 AndroidStudio 的代码提示功能，具体的说就是，你只需要了解组件的入口是 DBlur 即可，至于后续怎么使用，全靠 AndroidStudio 来提示，跟着 AndroidStudio 走就行。

例如：

![DBlur入口.png](https://upload-images.jianshu.io/upload_images/1924341-7eb4707f967a5577.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

当敲完 DBlur. 时，会弹出代码提示框，入口很少，是吧，就两个，看命名也能猜到作用：`getCacheBitmap()` 明显是用来取缓存的，那么要高斯模糊自然是另外一个入口 `source()`，这个方法有多个重载函数，看参数，其实也能知道，这就对应着要模糊的图片的不同来源类型，如：

- 直接传入 Bitmap 对其进行模糊
- 传入 Activity/View，内部会对这个界面/控件进行截图后再模糊
- 传入 resId，对 drawable 资源图片进行模糊

那么，可能想问了，哪里进行高斯模糊配置，哪里设置同步或异步，哪里注册回调等等。别急，既然只给你开了一个入口，那么就跟着入口走下去，自然会一步步引导你走到最后。如：

![BlurConfigBuilder入口.png](https://upload-images.jianshu.io/upload_images/1924341-9efa2fb81a12cd2d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

第一步、第二步该做什么，我都给你规定好了，你也只能按照步骤一步步来。想要设置高斯模糊配置，你得先指定图片来源，才能进入第二步，在这里，可以进行的配置也都给你列出来了，想要哪个，直接设置即可。如：

- `mode()`，`modeRs()`，`modeNative() ` 等等类似 mode 开头的方法，用于指定要使用哪种高斯模糊方案，一共四种，每种内部都有提供对应的常量标志，但如果你不知道哪里找，那么直接调用 modeXXX 方法即可。
- `radius()` 用于设置高斯模糊计算的半径，内部默认为 4。
- `sampling()` 用于设置对原图的缩小比例，内部默认为 8，即默认先缩小 8 倍，再模糊，最后再放大。
- `cache()` 用于设置缓存此次模糊后的图片，没有调用默认不缓存。
- `animAlpha()` 用于设置使用淡入动画，需要结合 `intoTarget()` 使用，否则不生效。
- `intoTarget()` 用于设置模糊完成后，自动显示到指定控件上。

另外，看每个方法返回的类名，其实这个过程都是在设置配置项，如果有对 Builder 模式了解的话，应该清楚，这个大多用来解决构造函数参数过多的场景，最后一般都会有一个 `build()` 或者 `create()` 类型的方法。参考的是 Android 源码中 AlertDialog。

也就是说，要进入下一个步骤，需要调用 `build()` 方法，如：

![doblur.png](https://upload-images.jianshu.io/upload_images/1924341-96ce20f8a2154350.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

显然，已经到最后一个步骤了，这里就是发起高斯模糊工作的地方了。

- `doBlur()` 会指定此次高斯模糊工作异步进行，所以需要注册回调的在这里传入。
- `doBlurSync()` 指定高斯模糊同步进行，模糊后的 Bitmap 直接返回。

至此，接入结束。

使用这个高斯模糊的组件，只需要知道 DBlur 入口，其他都跟随着 AndroidStudio 代码提示一步步往下走即可，当然你也可以直接看源码，注释里也写得蛮清楚的了。

这个就是我的想法，能力不足，只能想出这种方案，如果有哪里需要改进，哪里不合理，或者有其他思路，欢迎指点一下。

### 使用示例  

```java
compile 'com.dasu.image:blur:0.0.4'
```

```java
//使用默认配置，最短调用链
Bitmap bitmap = DBlur.source(MainActivity.this).build().doBlurSync();

//同步模糊，将imageView控制的视图进行模糊，完成后自动显示到 imageView1 控件上，以淡入动画方式
DBlur.source(imageView).intoTarget(imageView1).animAlpha().build().doBlurSync();

//异步模糊，将drawable资源文件中的图片以 NATIVE 方式进行模糊，注册回调，完成时手动显示到 imageView1 控件上
DBlur.source(this, R.drawable.background).mode(BlurConfig.MODE_NATIVE).build()
      .doBlur(new OnBlurListener() {
            @Override
            public void onBlurSuccess(Bitmap bitmap) {
                imageView1.setImageBitmap(bitmap);
            }

            @Override
            public void onBlurFailed() {
                //do something
            }});
```

### [Github](https://github.com/woshidasusu/base-module/tree/master/blur) 

[DBlur 的 Github 链接：https://github.com/woshidasusu/base-module/tree/master/blur](https://github.com/woshidasusu/base-module/tree/master/blur)  
