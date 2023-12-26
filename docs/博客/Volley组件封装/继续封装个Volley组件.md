前面已经封装了很多常用、基础的组件了：[base-module](https://github.com/woshidasusu/base-module)， 包括了：  

- crash 处理
- 常用工具类
- apk 升级处理
- log 组件
- logcat 采集
- ftp 文件上传
- blur 高斯模糊
- fresco 图片处理
- 等等

那么，今天继续再来封装一个网络组件，基于 [volley](https://github.com/google/volley) 的二次封装，目的也是为了简化外部使用，以及新项目可快速接入使用。

这样一来，开发一个简单的 app 所需要的公共基础组件基本都已经封装好了，在这些组件基础上，应该可以快速完成第一版迭代，快速出包。

下一次的计划，也许是封装 OkHttp 的组件，也许是封装个播放器的组件，也可能是封装常用的自定义 View，视情况而定吧。

# 前言 

封装了这么多组件，一步步走过来，我已经有了自己一定习惯下的封装思路了，可能代码写得并不是很好，设计得不是很合理，内部职责划分不是很明确。

但，我热衷的封装思想是：**一条调用链使用**。

我喜欢借助 AndroidStudio 的代码提示功能，结合调用链的使用方式，将组件的使用划分成多个步骤，控制每个步骤的 api，让其他人使用的时候，最好可以达到不看文档，不看源码，只需要了解入口，之后都可以通过 AndroidStudio 的代码提示来一步步引导使用的目的。

至于为什么需要二次封装 Volley，这篇就不扯了，反正每个组件的封装肯定是来源于有这方面的需求。

# 二次封装

同样，[DVolley](https://github.com/woshidasusu/base-module/tree/master/volley) 组件你需要了解的入口也就是：DVolley  

![DVolley.png](https://upload-images.jianshu.io/upload_images/1924341-037f8c0bbdced5d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

第一个步骤我开放了三个 api，其实也就是 DVolley 大概支持的功能：

- `url()` 

用于访问服务端的接口

- `enterGlobalConfig()`

用于配置一些公共的请求参数或请求头信息，比如 mac，t 这类通常都是公共的请求参数，不必每次都手动去设置。

- `cancelRequests()`  

内部支持一次性同时发起六条请求，网络问题等等总会导致某些请求在队列中等待，但如果这时页面退出了，那么这些请求应该就要取消掉，甚至已经发出的请求这时候才回来，那也应该不要通知上层 ui。所以，支持对每条请求设置 tag，然后根据 tag 来取消这些请求。

![Volley_url.png](https://upload-images.jianshu.io/upload_images/1924341-2a7ecc88bb8a7a70.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

目前组件只支持三个功能：

- `post()`

post 方式访问网络接口

- `get()`

get 方式访问网络接口

- `asImageFile()`

下载网络中的图片文件到本地指定目录，因为 volley 的设计并不能够很好的支持大文件的下载，所以就不提供这个了，刚好有下载图片文件的需求，所以就封装上了。

虽然 volley 也支持类似 fresco 这种框架对图片的缓存，加载处理，但这些工作一般项目里都选择 fresco 或 glide 来处理了，所以组件也就不提供 volley 的这些功能了。

下面看看下载图片文件的用法：

### 下载图片文件示例

```java
DVolley.url("https://upload-images.jianshu.io/upload_images/1924341-d7190704b160d280.png")
	.asImageFile()
	.downloadTo(new File("/mnt/sdcard/my.png"), new VolleyListener<String>() {
		@Override
		public void onSuccess(String data) {
                //data 是图片文件保存的目录地址
         }

         @Override
         public void onError(int code, String description) {

         }});
```

通常图片框架都默认处理图片下载后的缓存目录、保存格式、文件名等等。这就导致有时如果需要明确指定下载网络上某张图片到指定的本地目录中以指定的文件名存储，使用这些图片框架就有些麻烦了，所以就封装了这个功能。

继续回来看看正常的网络接口访问的使用：

![Volley_get.png](https://upload-images.jianshu.io/upload_images/1924341-64497db49a04aead.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

post 方法支持的 api 跟 get 一样，也就是设置下 tag（用于取消该请求），设置下请求参数，请求头，然后调用 `enqueue()`，内部会根据队列情况自动发起请求，可设置回调，回调接收一个泛型参数，内部会自动根据泛型解析 json 数据后在回调方法中返回实体类数据。

所以，其实，封装的组件做的事并不多，就是将 Volley 的使用流程控制起来，提供调用链的使用方式。

### 使用示例

```
compile 'com.dasu.net:volley:0.0.1'
```
```
//get 方法获取 wanAndroid 网站的公众号列表，内部自动进行 json 解析
DVolley.url("http://wanandroid.com/wxarticle/chapters/json")
        .get()
        .enqueue(new VolleyListener<ArrayList<WanAndroid>>() {
            @Override
            public void onSuccess(ArrayList<WanAndroid> data) {
                Log.w("!!!!!!!", "wan: " + data.size());
                for (WanAndroid wan : data) {
                   Log.e("!!!!!!!!!!", wan.toString());
                }
            }

            @Override
            public void onError(int code, String description) {

            }});

//post 方法请求，设置参数，请求头，tag（用于取消请求使用）
DVolley.url("https://easy-mock.com/mock/5b592c01e4e04f38c7a55958/ywb/is/version/checkVersion")
         .post()
         .tag("VolleyActivity")
         .addParam("name", "dasu")
         .addHeader("weixin", "dasuAndroidTv")
         .enqueue(new VolleyListener<EasyMockReturn>() {
             @Override
             public void onSuccess(EasyMockReturn data) {
                 Log.e("!!!!!", "return: " + data);
             }

             @Override
             public void onError(int code, String description) {

             }
         });

//取消tag为xxx的请求
DVolley.cancelRequests("VolleyActivity");

//下载图片文件到本地指定的目录
DVolley.url("https://upload-images.jianshu.io/upload_images/3537898-445477c7ce870988.png")
        .asImageFile()
        .downloadTo(new File("/mnt/sdcard/abcd.png"), new VolleyListener<String>() {
            @Override
            public void onSuccess(String data) {
                Log.e("!!!!!", "asImageFile: " + data);
            }

            @Override
            public void onError(int code, String description) {
                Log.e("!!!!!", "asImageFile: " + description);
            }
        });

//设置通用的请求参数或请求头
DVolley.enterGlobalConfig()
         .globalParam("t", String.valueOf(System.currentTimeMillis()))
         .globalHeader("os", "android");
```

# [Github地址](https://github.com/woshidasusu/base-module/tree/master/volley)  

[DVolley组件:https://github.com/woshidasusu/base-module/tree/master/volley](https://github.com/woshidasusu/base-module/tree/master/volley)  

组件有如下两个依赖库：

```
compile 'com.android.volley:volley:1.1.1'
compile 'com.google.code.gson:gson:2.7'
```
支持以下功能：

- get  请求
- post 请求
- 图片下载在本地指定目录
- 自动根据泛型解析 json
- 取消指定请求
- 设置通用请求参数或请求头