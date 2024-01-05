import{_ as r,r as l,o as s,c as d,a as e,b as i,e as n,d as o}from"./app-Zf-yBXw2.js";const t={},c={href:"https://github.com/woshidasusu/base-module/tree/master/fresco",target:"_blank",rel:"noopener noreferrer"},u=o(`<h1 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h1><p>Fresco 图片库很强大，我们项目中就是使用的 Fresco，但有一点就是，不怎么好使用，略麻烦。不同项目中，多多少少都需要对 Fresco 进行一层封装才能在 ui 里快速使用。</p><p>这就导致了，不同项目都根据自己的业务需求场景来进行封装，每次有新项目，复制粘贴时又得解决好多业务耦合的错误，麻烦，是真的麻烦~</p><p>而且，首次接触 Fresco，接入上手的成本相比其他图片库，如 Glide，成本都要大很多。</p><p>举个例子，假如你有这么个需求：加载一张网络上的 gif 图片，为了防止内存占用过多，需要设置分辨率压缩，最后显示到圆形控件上，同时，需要设置占位图，错误图，拉伸方式等。</p><p>那么此时，你的代码可能就是这样的：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>ImageDecodeOptions imageDecodeOptions = ImageDecodeOptions.newBuilder()
    	.setDecodePreviewFrame(true).build();
ImageRequestBuilder builder = ImageRequestBuilder.newBuilderWithSource(mUri)
   		.setProgressiveRenderingEnabled(true)
    	.setImageDecodeOptions(imageDecodeOptions);
if (mWidth &gt; 0 &amp;&amp; mHeight &gt; 0) {
    builder.setResizeOptions(new ResizeOptions(mWidth, mHeight));
}

ImageRequest request = builder.build();
AbstractDraweeController controller = Fresco.newDraweeControllerBuilder()
    		.setImageRequest(request)
   		 	.setControllerListener(listener)
    		.setOldController(draweeView.getController())
    		.setAutoPlayAnimations(true).build();
draweeView.setController(controller);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同时，你可能还需要在 xml 中对 SimpleDrawwView 控件进行占位图等等的配置：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>&lt;com.facebook.drawee.view.SimpleDraweeView
        android:id=&quot;@+id/sdv_fresco&quot;
        android:layout_width=&quot;500dp&quot;
        android:layout_height=&quot;500dp&quot;
        fresco:actualImageScaleType=&quot;centerCrop&quot;
        fresco:fadeDuration=&quot;3000&quot;
        fresco:failureImage=&quot;@mipmap/ic_launcher&quot;
        fresco:failureImageScaleType=&quot;centerCrop&quot;
        fresco:placeholderImage=&quot;@mipmap/ic_launcher&quot;
        fresco:placeholderImageScaleType=&quot;centerCrop&quot;
        fresco:progressBarAutoRotateInterval=&quot;1000&quot;
        fresco:progressBarImage=&quot;@drawable/ani_rotate&quot;
        fresco:progressBarImageScaleType=&quot;centerCrop&quot;
        fresco:retryImage=&quot;@mipmap/ic_launcher&quot;
        fresco:retryImageScaleType=&quot;centerCrop&quot;
        fresco:backgroundImage=&quot;@mipmap/ic_launcher&quot;
        fresco:overlayImage=&quot;@mipmap/ic_launcher&quot;
        fresco:pressedStateOverlayImage=&quot;@mipmap/ic_launcher&quot;
        fresco:roundAsCircle=&quot;false&quot;
        fresco:roundingBorderWidth=&quot;2dip&quot;
        fresco:roundingBorderColor=&quot;@color/colorPrimary&quot;/&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果忘记了某个自定义属性名是什么的时候，还得到网上搜索下资料，是吧。</p><p>小结一下，使用 Fresco，你的接入学习成本至少需要知道 Fresco 的如下信息：</p><ul><li>SimpleDraweeView 的自定义属性</li><li>ImageRequestBuilder 用法及大概用途</li><li>AbstractDraweeController 用法及大概用途</li><li>GenericDraweeHierarchy 用法及大概用途</li></ul><p>如果涉及到一些网络下载监听，缓存之类的，那么你还要了解：</p><ul><li>Imagepipeline 用法及大概用途</li></ul><p>总之，Fresco 强大是强大，但使用起来不方便，不得不封装一层。</p><p>既然要封装，那么就直接借鉴 Glide 的使用思想来进行封装好了，如果有使用过 Glide 的应该很清楚，要实现以上功能，全程一个调用链即可。</p><h1 id="二次封装" tabindex="-1"><a class="header-anchor" href="#二次封装" aria-hidden="true">#</a> 二次封装</h1><p>封装要达到的目的有两点：</p><ul><li>使用简洁、方便</li><li>其他人接入直接上手的成本尽可能少，最好不用去看文档，去看源码</li></ul><p>第一点可以参考 Glide 的使用方式来设计，那么第二点我的想法是借助 AndroidStudio 的代码提示功能来实现。</p><p>比如，你只需知道，组件的入口是 DFresco 即可，其他都通过 AndroidStudio 来给你提示，如：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-a5f473375cac6cf7.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="Dfresco入口.png"></p><p>当你在 AndroidStudio 上输入 <code>DFresco.</code> 后，界面上会弹出你可用 api，这些就是我开放给你的入口，我将这个使用过程划分成几个步骤，每个步骤能做什么，该做什么，我都给你规定好了，你参照着提示，直接从方法命名上就能够知道该如何使用了，AndroidStudio 会一步步引导你。</p><p>这里就两个入口，一个是用来初始化 Fresco 的：</p><ul><li><code>init(Context)</code></li></ul><p>这个内部封装了一些默认的初始化配置，比如内存大小配置，内部日志配置等等。</p><ul><li><code>init(Context, ImagePipelineConfig)</code></li></ul><p>这个是开放给你的自定义配置，如果你不想使用默认的配置的话。</p><ul><li><code>source(String url)</code> ：加载网络上的图片</li><li><code>source(File localFile)</code> ：加载磁盘上的图片</li><li><code>source(Context context, int resId)</code> ：加载 res 内的 drawable 资源图片</li><li><code>source(Uri uri)</code> ：通用的加载方式</li></ul><p>我将常用的几种图片来源单独封装出来使用，方便。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-a0cfd99084357ca6.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="DFresco第二步.png"></p><p>当调用了 <code>source()</code> 后就进入了第二个步骤，这个步骤中，我将图片相关的配置设计到另外一个步骤中去，否则连同图片配置的 api 也都在这里的话，会搞得蛮乱的，可能让使用者到这里后不清楚该调用哪些接口了。</p><p>所以，我会把控每个步骤的 api，尽量让每个步骤的 api 做的事都比较相近，比如这里：</p><ul><li><code>intoTarget(SimpleDraweeView)</code> 加载图片显示到控件上</li><li><code>intoTarget(SimpleDraweeView，ControllerListener)</code> 加载图片显示到控件上，允许监听这个过程</li><li><code>intoTarget(BaseBitmapDataSubscriber)</code> 只加载图片到内存中，以 Bitmap 形式存在</li></ul><p>我的需求场景大概就是直接加载图片显示到控件上，或者有时候只是需要将图片加载到内存中，但不用显示到某个控件上，反而要取得图片的 Bitmap 对象，所以我将这些都封装起来了。</p><ul><li><code>resize(int width, int height)</code></li></ul><p>这个实际上就是对 Fresco 中的 ResizeOptions 的一层封装而已，简化使用，不至于像以前那么麻烦。</p><ul><li><code>enterImageConfig()</code></li></ul><p>如果你都使用默认配置的话，那么是不用再去调用那些各种配置的接口的，所以我才将图片配置封装到另外一个步骤中，这个步骤你可进，可不进，如果有需求，那么通过这个方法进入图片配置步骤：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-849966a1a62a8598.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="ImageConfig.png"></p><p>这里的配置项很多，也是因为这个原因，所以才不想让这些接口跟上一个步骤放一起，不然很容易让使用者懵掉。而进入了图片配置这个步骤后，这里提供的 api 其实就是对 GenericDraweeHierarchy 的用途进行了一层封装，或者说对 SimpleDraweeView 的自定义属性进行了一层封装。</p><p>如果你不熟悉，没关系，其实就是一些常用的功能，如设置控件为圆形、圆角、边框，设置占位图、失败图、进度图、图片拉伸方式、淡入淡出动画时长等等。</p><p>这样封装的目的在于，你可以通过一条调用链的形式就设置完所有的配置，就像 Glide 的使用一样，而不用再去 new 很多 Fresco 的类，再去拼接。</p><p>进入图片配置步骤只是一个可选的步骤，进来之后当然就要出去，所以当完成了你的配置后，需要调用：<code>finishImageConfig()</code>，如：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-1a196e6efa920365.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="第三部.png"></p><p>这样就完成了图片配置，将流程切回主线了，就可以继续根据你的需要设置图片显示的目标了。</p><p>当然，为了防止再次进入图片配置步骤这样造成之前的配置项失效的场景，我借鉴了 Fresco 的 <code>init</code> 处理方法，即，如果一次使用过程中，重复进入图片配置步骤，那么程序会抛异常来提醒你不能这么做。</p><p>以上，就是 DFresco 组件的封装思想，欢迎指点一下哈~</p><p>另外，参考了 Glide 的一些处理，当你的 intoTarget 是传入了 SimpleDraweeView 控件时，DFresco 内部会自动根据控件的大小对图片进行一次分辨率压缩，降低图片占用内存，当然，如果你有手动调用了 <code>resize()</code>，那么以你的为主。</p><h1 id="使用示例" tabindex="-1"><a class="header-anchor" href="#使用示例" aria-hidden="true">#</a> 使用示例</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>compile &#39;com.dasu.image:fresco:0.0.1&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用之前，需先初始化，建议在 Application 中进行：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DFresco.init(this);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//加载 res 中的 drawable 图片到 SimpleDraweeView 控件上（默认支持 gif 图，并且会自动根据控件宽高进行分辨率压缩，降低内存占用
DFresco.source(mContext, R.drawable.weixin).intoTarget(mSimpleDraweeView);

//加载磁盘中的图片，手动设置分辨率的压缩，并获取 bitmap 对象，监听回调，手动显示到 ImageView 控件上
DFresco.source(new File(&quot;/mnt/sdcard/weixin.jpg&quot;))
        .resize(500, 500)
        .intoTarget(new BaseBitmapDataSubscriber() {
                @Override
                protected void onNewResultImpl(Bitmap bitmap) {
                    Log.w(&quot;!!!!!!&quot;, &quot;bitmap：ByteCount = &quot; + bitmap.getByteCount() + &quot;:::bitmap：AllocationByteCount = &quot; + bitmap.getAllocationByteCount());
                    Log.w(&quot;!!!!!!&quot;, &quot;width:&quot; + bitmap.getWidth() + &quot;:::height:&quot; + bitmap.getHeight());
                    mImageView.setImageBitmap(bitmap);
                }

                @Override
                protected void onFailureImpl(DataSource&lt;CloseableReference&lt;CloseableImage&gt;&gt; dataSource) {
                    Log.e(&quot;!!!!!!&quot;, &quot;onFailureImpl&quot;);
                }
            });

//加载网络图片，进行各种配置，如缩放方式，占位图，圆形，圆角，动画时长等等，最后自动显示到 SimpleDraweeView 控件上
DFresco.source(&quot;https://upload-images.jianshu.io/upload_images/1924341-9e528ee638e837a5.png&quot;)
                    .enterImageConfig() //进入配置步骤
                    .allFitXY()  //所有图片，包括占位图等等的拉伸方式
                    .animFade(3000) //淡入淡出动画时长
                    .placeholderScaleType(ScalingUtils.ScaleType.CENTER_INSIDE) //设置占位图的拉伸方式，后面设置的会覆盖前面的
                    .actualScaleType(ScalingUtils.ScaleType.CENTER)
//                    .asRound(50) //设置圆角，（圆角和圆形不能同时设置）
                    .asCircle() //设置控件显示为圆形控件
                    .roundBorderColor(Color.RED) //设置圆角或圆形的边框颜色
                    .roundBorderWidth(20)  //设置圆角或圆形的边框宽度
                    .failure(R.drawable.timg) //设置失败图
                    .progressBar(R.drawable.aaaa) //设置加载进度图
                    .retry(R.drawable.weixin) //设置重试时的图
                    .placeholder(R.drawable.image) //设置占位图
                    .finishImageConfig() //退出配置步骤
                    .intoTarget(mSimpleDraweeView);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,54),m={id:"github-地址",tabindex:"-1"},p=e("a",{class:"header-anchor",href:"#github-地址","aria-hidden":"true"},"#",-1),v={href:"https://github.com/woshidasusu/base-module/tree/master/fresco",target:"_blank",rel:"noopener noreferrer"},g={href:"https://github.com/woshidasusu/base-module/tree/master/fresco",target:"_blank",rel:"noopener noreferrer"};function b(h,w){const a=l("ExternalLinkIcon");return s(),d("div",null,[e("p",null,[i("最近封装了个 Fresco 的组件库："),e("a",c,[i("DFresco"),n(a)]),i("，就顺便来讲讲。")]),u,e("h1",m,[p,i(),e("a",v,[i("Github 地址"),n(a)])]),e("p",null,[e("a",g,[i("DFresco：https://github.com/woshidasusu/base-module/tree/master/fresco"),n(a)])])])}const f=r(t,[["render",b],["__file","借鉴Glide二次封装Fresco.html.vue"]]);export{f as default};
