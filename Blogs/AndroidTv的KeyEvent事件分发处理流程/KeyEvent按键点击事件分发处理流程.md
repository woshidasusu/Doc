这次打算来梳理一下 Android Tv 中的按键点击事件的分发处理流程。一谈到点击事件机制，网上资料已经非常齐全了，像分发、拦截、处理三大流程啊；或者 dispatchTouchEvent、onInterceptTouchEvent、onTouchEvent 啊；再或者返回 true 表示消费，返回 false 不处理啊；还有说整个流程是个 U 型分发处理，什么总经理发布任务到员工处理反馈啊之类的。前辈们早已为我们梳理了一篇篇干货，也在尽可能的写得通俗、易懂。  

但是今天这篇的主题是：**KeyEvent的分发处理流程**  
说得明白点就是：Tv上的遥控器按键的点击事件分发处理流程，也许你还没反应过来。想想，手机上都是触屏点击事件，而遥控器则是按键点击事件，两种事件类型的分发处理机制自然有所不同，所以，如果不搞清楚这点，很容易在 Tv 应用开发中将这两类事件分发机制混淆起来。  

最简单的区别就是，在 Tv 开发中已经不是再像触屏手机那样通过 dispatchTouchEvent、onInterceptTouchEvent、onTouchEvent 来分发处理了，取而代之的则是需要使用 **dispatchKeyEvent、onKeyDown/Up、onKeyLisenter** 等事件来分发处理。  

#流程  
![dispatchKeyEvent事件分发传递流程图.png](http://upload-images.jianshu.io/upload_images/1924341-3ddcf547d127d6f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这次梳理的就只是 KeyEvent 在一个 View 树内部的分发处理流程，简单点说，也就是，你在某个 Activity 界面点击了某个按键，然后这个按键事件在当前这个 Activity 里是如何分发处理的。  

**流程图涉及的主要方法和类：**  
1. (PhoneWindow$)DecorView  ->  dispatchKeyEvent()  
2. Activity                 ->  dispatchKeyEvent()  
3. ViewGroup                ->  dispatchKeyEvent()  
4. View                     ->  dispatchKeyEvent()  
5. KeyEvent                 ->  dispatch()  
6. View                     ->  onKeyDown/Up()  

硬件层、框架层那些按键事件的获取、分发、处理太深奥了，啃不透。应用层的一部分事件分发流程也还暂时没啃透，这次梳理的是在一个 View 树内部的分发处理流程。我就不边贴源码边解释了，如果想跟着源码梳理的，可以参考我最后贴出来的两篇文章，那两篇里面已经讲解得特别清楚了。我就根据流程图来梳理整个过程。    

当我们在某个 Activity 界面中点击了某个按键时，会有 Action_Down 和 Action_Up 两个 KeyEvent 进行分发处理，分发流程都一样，区别就只是最后交给 Activity 或 View 的 onKeyDown 或 onKeyUp 处理。  



#使用场景  


#遗留问题  
1. 每次按键点击都会有 Action_Down 和 Action_Up 两次事件，目前遇到这样的场景，从 Activity A 打开 Activity B，Action_Down 和 Action_Up 会在 Activity A 中分发处理，然后 Action_Up 又会在 Activity B 中分发处理。  
最开始的想法 Activity A 将 Action_Up 事件传递给 Activity B 进行处理，但是在 Activity A 中将 Action_Up 先消费掉即返回 true，发现 Activity B 中仍然会重新分发处理 Action_Up 事件。因此，目前对于 KeyEvent 事件在两个 Activity 中是如何分发传递的还不大了解，这部分内容应该是在 ViewRootImpl 和 PhoneWindow 中，计划下一篇就来梳理这部分内容。  

2. Tv 开发中最重要也让人头疼的就是焦点问题，通过遥控器方向键点击后可以控制焦点的移动，有时需要根据需求来控制焦点，比如我们经常做的就是在焦点到达边界时重写 dispatchKeyEvent 里返回 true 来停止焦点的移动，为什么可以这么做呢？其实这部分内容也在 DecorView 的 dispatchKeyEvent 里，DecorView 在高的 SDK 里已经抽出来单独一个类了，如果没找到，那么就去 PhoneWindow 里找，旧的 SDK 里，DecorView 是 PhoneWindow 的内部类，这部分内容也留着下次一起梳理吧。  

#参考  
[Android View框架总结（九）KeyEvent事件分发机制](http://www.imooc.com/article/12664)  
[Android按键事件传递流程(二)](http://blog.csdn.net/cheris_cheris/article/details/53290625)  


