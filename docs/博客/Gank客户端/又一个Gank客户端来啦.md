# 老规矩，看效果  
![](http://images2015.cnblogs.com/blog/810210/201706/810210-20170601225742555-657783148.gif)  

# 介绍

Gank平台的移动端又来了，非常感谢Gank平台开放接口，让我们这些小白有机会练手、学习。  

本项目在架构方面有稍微花点心思，虽然还是最简单的MVC模式，但基本参考MVP的思想，Activity只负责ui显示逻辑，ui和业务会尽量的分离开，每个包的类权限严格控制，尽量对外部隐藏其实现细节。另外，本项目不像其他热门的Gank客户端那样使用诸如Rx系列的高级开源库，代码应该是可以很容易看懂的，吧。哈哈，有兴趣的可以fork看看，有什么问题可以联系我哈。  

以下是项目所依赖的第三方库：

- Retrofit + Okhttp （网络访问）   
- Gson （Json数据解析）  
- Glide （图片加载）  
- photoview （支持手势缩放的图片查看）  
- Jsoup （Html解析）


# 项目  

[Github地址](https://github.com/woshidasusu/Meizi)  

下图是项目的代码结构图，我分成mode层和ui层，让ui与业务逻辑尽可能解耦，感兴趣的clone项目看看哈，架构方面才刚接触，很多地方考虑不周到，欢迎指点一下哈。过段时间，我会单独写篇博客来介绍项目的架构设计方面的一些想法。  

![项目代码结构图](http://upload-images.jianshu.io/upload_images/1924341-f7fee7ed9f3c98e1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果有clone项目的童鞋，出现了编译失败的问题，可以参考下本项目的开发环境哈：  

- Android Studio： 2.2.3  
- Gradle Version： 2.14.1  
- Android Plugin Version： 2.2.3 （根目录build.gradle里gradle的版本）  
- compileSdkVersion： 25  
- buildToolsVersion： "25.0.2"  

以上设置在两个build.gradle里都可以找到。  

如果把代码下载到本地编译报错的话，有可能是因为gradle的版本不一致，也有可能是因为Android SDK的版本问题，如果有报错的童鞋试着在这几个地方查查看哈。  


# 效果 

效果只展示了部分效果，感兴趣的可以去我Github看看更详细的，或者是下载下来试试看哈。  

![效果展示](http://upload-images.jianshu.io/upload_images/1924341-d1e34d693d8bb058.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# App下载  

[Fir](http://fir.im/dasugankhuo)  

![扫一下下载App](http://upload-images.jianshu.io/upload_images/1924341-760b8778b1b635b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

## 鸣谢

[drakeet](https://github.com/drakeet/Meizhi)  

[CaMnter](https://github.com/CaMnter/EasyGank)  

[burgessjp](https://github.com/burgessjp/GanHuoIO)  

