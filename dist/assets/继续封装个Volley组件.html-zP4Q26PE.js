import{_ as s,r as a,o,c as t,a as e,b as i,e as l,d}from"./app-Zf-yBXw2.js";const r={},u={href:"https://github.com/woshidasusu/base-module",target:"_blank",rel:"noopener noreferrer"},c=e("ul",null,[e("li",null,"crash 处理"),e("li",null,"常用工具类"),e("li",null,"apk 升级处理"),e("li",null,"log 组件"),e("li",null,"logcat 采集"),e("li",null,"ftp 文件上传"),e("li",null,"blur 高斯模糊"),e("li",null,"fresco 图片处理"),e("li",null,"等等")],-1),v={href:"https://github.com/google/volley",target:"_blank",rel:"noopener noreferrer"},m=d('<p>这样一来，开发一个简单的 app 所需要的公共基础组件基本都已经封装好了，在这些组件基础上，应该可以快速完成第一版迭代，快速出包。</p><p>下一次的计划，也许是封装 OkHttp 的组件，也许是封装个播放器的组件，也可能是封装常用的自定义 View，视情况而定吧。</p><h1 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h1><p>封装了这么多组件，一步步走过来，我已经有了自己一定习惯下的封装思路了，可能代码写得并不是很好，设计得不是很合理，内部职责划分不是很明确。</p><p>但，我热衷的封装思想是：<strong>一条调用链使用</strong>。</p><p>我喜欢借助 AndroidStudio 的代码提示功能，结合调用链的使用方式，将组件的使用划分成多个步骤，控制每个步骤的 api，让其他人使用的时候，最好可以达到不看文档，不看源码，只需要了解入口，之后都可以通过 AndroidStudio 的代码提示来一步步引导使用的目的。</p><p>至于为什么需要二次封装 Volley，这篇就不扯了，反正每个组件的封装肯定是来源于有这方面的需求。</p><h1 id="二次封装" tabindex="-1"><a class="header-anchor" href="#二次封装" aria-hidden="true">#</a> 二次封装</h1>',8),p={href:"https://github.com/woshidasusu/base-module/tree/master/volley",target:"_blank",rel:"noopener noreferrer"},b=d(`<p><img src="https://upload-images.jianshu.io/upload_images/1924341-037f8c0bbdced5d3.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="DVolley.png"></p><p>第一个步骤我开放了三个 api，其实也就是 DVolley 大概支持的功能：</p><ul><li><code>url()</code></li></ul><p>用于访问服务端的接口</p><ul><li><code>enterGlobalConfig()</code></li></ul><p>用于配置一些公共的请求参数或请求头信息，比如 mac，t 这类通常都是公共的请求参数，不必每次都手动去设置。</p><ul><li><code>cancelRequests()</code></li></ul><p>内部支持一次性同时发起六条请求，网络问题等等总会导致某些请求在队列中等待，但如果这时页面退出了，那么这些请求应该就要取消掉，甚至已经发出的请求这时候才回来，那也应该不要通知上层 ui。所以，支持对每条请求设置 tag，然后根据 tag 来取消这些请求。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-2a7ecc88bb8a7a70.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="Volley_url.png"></p><p>目前组件只支持三个功能：</p><ul><li><code>post()</code></li></ul><p>post 方式访问网络接口</p><ul><li><code>get()</code></li></ul><p>get 方式访问网络接口</p><ul><li><code>asImageFile()</code></li></ul><p>下载网络中的图片文件到本地指定目录，因为 volley 的设计并不能够很好的支持大文件的下载，所以就不提供这个了，刚好有下载图片文件的需求，所以就封装上了。</p><p>虽然 volley 也支持类似 fresco 这种框架对图片的缓存，加载处理，但这些工作一般项目里都选择 fresco 或 glide 来处理了，所以组件也就不提供 volley 的这些功能了。</p><p>下面看看下载图片文件的用法：</p><h3 id="下载图片文件示例" tabindex="-1"><a class="header-anchor" href="#下载图片文件示例" aria-hidden="true">#</a> 下载图片文件示例</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>DVolley.url(&quot;https://upload-images.jianshu.io/upload_images/1924341-d7190704b160d280.png&quot;)
	.asImageFile()
	.downloadTo(new File(&quot;/mnt/sdcard/my.png&quot;), new VolleyListener&lt;String&gt;() {
		@Override
		public void onSuccess(String data) {
                //data 是图片文件保存的目录地址
         }

         @Override
         public void onError(int code, String description) {

         }});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通常图片框架都默认处理图片下载后的缓存目录、保存格式、文件名等等。这就导致有时如果需要明确指定下载网络上某张图片到指定的本地目录中以指定的文件名存储，使用这些图片框架就有些麻烦了，所以就封装了这个功能。</p><p>继续回来看看正常的网络接口访问的使用：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-64497db49a04aead.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="Volley_get.png"></p><p>post 方法支持的 api 跟 get 一样，也就是设置下 tag（用于取消该请求），设置下请求参数，请求头，然后调用 <code>enqueue()</code>，内部会根据队列情况自动发起请求，可设置回调，回调接收一个泛型参数，内部会自动根据泛型解析 json 数据后在回调方法中返回实体类数据。</p><p>所以，其实，封装的组件做的事并不多，就是将 Volley 的使用流程控制起来，提供调用链的使用方式。</p><h3 id="使用示例" tabindex="-1"><a class="header-anchor" href="#使用示例" aria-hidden="true">#</a> 使用示例</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>compile &#39;com.dasu.net:volley:0.0.1&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//get 方法获取 wanAndroid 网站的公众号列表，内部自动进行 json 解析
DVolley.url(&quot;http://wanandroid.com/wxarticle/chapters/json&quot;)
        .get()
        .enqueue(new VolleyListener&lt;ArrayList&lt;WanAndroid&gt;&gt;() {
            @Override
            public void onSuccess(ArrayList&lt;WanAndroid&gt; data) {
                Log.w(&quot;!!!!!!!&quot;, &quot;wan: &quot; + data.size());
                for (WanAndroid wan : data) {
                   Log.e(&quot;!!!!!!!!!!&quot;, wan.toString());
                }
            }

            @Override
            public void onError(int code, String description) {

            }});

//post 方法请求，设置参数，请求头，tag（用于取消请求使用）
DVolley.url(&quot;https://easy-mock.com/mock/5b592c01e4e04f38c7a55958/ywb/is/version/checkVersion&quot;)
         .post()
         .tag(&quot;VolleyActivity&quot;)
         .addParam(&quot;name&quot;, &quot;dasu&quot;)
         .addHeader(&quot;weixin&quot;, &quot;dasuAndroidTv&quot;)
         .enqueue(new VolleyListener&lt;EasyMockReturn&gt;() {
             @Override
             public void onSuccess(EasyMockReturn data) {
                 Log.e(&quot;!!!!!&quot;, &quot;return: &quot; + data);
             }

             @Override
             public void onError(int code, String description) {

             }
         });

//取消tag为xxx的请求
DVolley.cancelRequests(&quot;VolleyActivity&quot;);

//下载图片文件到本地指定的目录
DVolley.url(&quot;https://upload-images.jianshu.io/upload_images/3537898-445477c7ce870988.png&quot;)
        .asImageFile()
        .downloadTo(new File(&quot;/mnt/sdcard/abcd.png&quot;), new VolleyListener&lt;String&gt;() {
            @Override
            public void onSuccess(String data) {
                Log.e(&quot;!!!!!&quot;, &quot;asImageFile: &quot; + data);
            }

            @Override
            public void onError(int code, String description) {
                Log.e(&quot;!!!!!&quot;, &quot;asImageFile: &quot; + description);
            }
        });

//设置通用的请求参数或请求头
DVolley.enterGlobalConfig()
         .globalParam(&quot;t&quot;, String.valueOf(System.currentTimeMillis()))
         .globalHeader(&quot;os&quot;, &quot;android&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,28),g={id:"github地址",tabindex:"-1"},h=e("a",{class:"header-anchor",href:"#github地址","aria-hidden":"true"},"#",-1),_={href:"https://github.com/woshidasusu/base-module/tree/master/volley",target:"_blank",rel:"noopener noreferrer"},q={href:"https://github.com/woshidasusu/base-module/tree/master/volley",target:"_blank",rel:"noopener noreferrer"},y=d(`<p>组件有如下两个依赖库：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>compile &#39;com.android.volley:volley:1.1.1&#39;
compile &#39;com.google.code.gson:gson:2.7&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>支持以下功能：</p><ul><li>get 请求</li><li>post 请求</li><li>图片下载在本地指定目录</li><li>自动根据泛型解析 json</li><li>取消指定请求</li><li>设置通用请求参数或请求头</li></ul>`,4);function f(V,w){const n=a("ExternalLinkIcon");return o(),t("div",null,[e("p",null,[i("前面已经封装了很多常用、基础的组件了："),e("a",u,[i("base-module"),l(n)]),i("， 包括了：")]),c,e("p",null,[i("那么，今天继续再来封装一个网络组件，基于 "),e("a",v,[i("volley"),l(n)]),i(" 的二次封装，目的也是为了简化外部使用，以及新项目可快速接入使用。")]),m,e("p",null,[i("同样，"),e("a",p,[i("DVolley"),l(n)]),i(" 组件你需要了解的入口也就是：DVolley")]),b,e("h1",g,[h,i(),e("a",_,[i("Github地址"),l(n)])]),e("p",null,[e("a",q,[i("DVolley组件:https://github.com/woshidasusu/base-module/tree/master/volley"),l(n)])]),y])}const S=s(r,[["render",f],["__file","继续封装个Volley组件.html.vue"]]);export{S as default};
