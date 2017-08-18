这次打算来梳理一下 Android Tv 中的按键点击事件的分发处理流程。一谈到点击事件机制，网上资料已经非常齐全了，像分发、拦截、处理三大流程啊；或者 dispatchTouchEvent、onInterceptTouchEvent、onTouchEvent 啊；再或者返回 true 表示消费，返回 false 不处理啊；还有说整个流程是个 U 型分发处理，什么总经理发布任务到员工处理反馈啊之类的。前辈们早已为我们梳理了一篇篇干货，也在尽可能的写得通俗、易懂。  

但是今天这篇的主题是：**KeyEvent的分发处理流程**  
说得明白点就是：Tv上的遥控器按键的点击事件分发处理流程，也许你还没反应过来。想想，手机上都是触屏点击事件，而遥控器则是按键点击事件，两种事件类型的分发处理机制自然有所不同，所以，如果不搞清楚这点，很容易在 Tv 应用开发中将这两类事件分发机制混淆起来。  

最简单的区别就是，在 Tv 开发中已经不是再像触屏手机那样通过 dispatchTouchEvent、onInterceptTouchEvent、onTouchEvent 来分发处理了，取而代之的则是需要使用 **dispatchKeyEvent、onKeyDown/Up、onKeyLisenter** 等来分发处理。  

#流程  
![dispatchKeyEvent事件分发传递流程图.jpg](http://upload-images.jianshu.io/upload_images/1924341-38bcb57fa4617d95.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这次梳理的就只是 KeyEvent 在一个 View 树内部的分发处理流程，简单点说，也就是，你在某个 Activity 界面点击了遥控器的某个按键，然后这个按键事件在当前这个 Activity 里是如何分发处理的。  

**流程图涉及的主要方法和类：**  
1. (PhoneWindow$)DecorView  ->  dispatchKeyEvent()  
2. Activity                 ->  dispatchKeyEvent()  
3. ViewGroup                ->  dispatchKeyEvent()  
4. View                     ->  dispatchKeyEvent()  
5. KeyEvent                 ->  dispatch()  
6. View                     ->  onKeyDown/Up()  

硬件层、框架层那些按键事件的获取、分发、处理太深奥了，啃不透。应用层的一部分事件分发流程也还暂时没啃透，这次梳理的是在一个 View 树内部的分发处理流程。    


#流程解析  

ps:当我们在某个 Activity 界面中点击了某个遥控器按键时，会有 Action_Down 和 Action_Up 两个 KeyEvent 进行分发处理，分发流程都一样，区别就是最后交给 Activity 或 View 的 onKeyDown 或 onKeyUp 处理。  

###分发流程  

1. 当接收到 KeyEvent 事件时，首先是交给  (PhoneWindow$)DecorView 的 dispatchKeyEvent() 分发，而 DecorView 会去调用 Activity 的 dispatchKeyEvent()，交给 Activity 继续分发。     
![DecorView_dispatchKeyEvent.png](http://upload-images.jianshu.io/upload_images/1924341-7a0b2f1a106bc1b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


2. Activity 会先获取 PhoneWindow 对象，然后调用 PhoneWindow 的 superDispatchKeyEvent()，PhoneWindow 转而调用 DecorView 的 superDispatchKeyEvent()，而 DecorView 则调用了 super.dispatchKeyEvent() 将事件交给父类分发， DecorView 继承自 FrameLayout，但 FrameLayout 没有实现 dispatchKeyEvent()，所以实际上是交给 ViewGroup 的 dispatchKeyEvent() 来分发。  

![activity_dispatchKeyEvent.png](http://upload-images.jianshu.io/upload_images/1924341-e8cc5298a223bc27.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  
![PhoneWindow_superDispatchKeyEvent.png](http://upload-images.jianshu.io/upload_images/1924341-c9aa9cc3b8e47f80.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

![DecorView_superDispatchKeyEvent.png](http://upload-images.jianshu.io/upload_images/1924341-5b9e0fe8a8010f4b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



3. ViewGroup 分发的逻辑我还不大理解，不过大体上知道 ViewGroup 递归寻找当前焦点的子 View，将事件传给焦点子 View 的 dispatchKeyEvent() 分发，具体是如何递归寻找的这部分代码待研究。  

4. 以上就是一个 KeyEvent 事件的分发流程，跟触屏手机事件传递有些不同的是，如果你没重写以上分发事件的相关类的相关分发方法的话，一个 KeyEvent 事件是肯定会从顶层 DecorView 分发到具体的子 View 的，因为它并没有像 onInterceptTouchEvent 这种在某一层拦截的操作。  

先在这里暂停一下流程解析，有些东西想梳理一下，事件的处理流程等会再继续写。  

不管你是在看触屏的 TouchEvent 点击事件机制，还是遥控器这种 KeyEvent 点击事件机制，总会看到有人这么写：什么上层往下层分发，下层给上层回馈。反正我刚开始接触时一直很懵，什么是上层，什么是下层，还有底层顶层又是什么；  

本来我自己写这篇时是打算不用这些什么层层层的，感觉会有些乱，但真正梳理流程时，发现还是只有用层次描述比较好，但如果你看不明白的话，我这里简单总结一下。  



###处理流程  

ps:KeyEvent 事件的处理只有两个地方，一个是 Activity，另一个则是具体的 View。ViewGroup 只负责分发，不会消耗事件。同 TouchEvent 一样，返回 true 表示事件已消耗掉，返回 false 则表示事件还在。  

1. 当 KeyEvent 事件分到到具体的子 View 的 dispatchKeyEvent() 里时，View 会先去看下有没有设置 OnKeyListener 监听器，有则回调 OnKeyListener.onKey() 方法来处理事件。  

2. 如果 View 没有设置 OnKeyListener 或者 onKey() 返回 false 时，View 会通过调用 KeyEvent 的 dispatch() 方法来回调 View 自己的 onKeyDown/Up() 来处理事件。  

3. 如果没有重写 View 的 onKeyUp 方法，而且事件是 ok（确认）按键的 Action_Up 事件时，View 会再去检查看是否有设置 OnClickListener 监听器，有则调用 OnClickListener.onClick() 来**消费事件**，注意是消费，也就是说如果有对 View 设置 OnClickListener 监听器的话，而且事件没有在上面两个步骤中消费掉的话，那么就一定会在 onClick() 中被消耗掉，OnClickListener.onClick() 虽然并没有 boolean 返回值，但是 View 在内部 dispatchKeyEvent() 里分发事件给 onClick 时已经默认返回 true 表示事件被消耗掉了。  

4. 如果 View 没有处理事件，也就是没有设置 OnKeyListener 也没有设置 OnClickListener，而且 OnKeyDown/Up() 返回的是 false 时，将会通过分发事件的原路返回告知 Activity 当前事件还未被消耗，Activity 接收到 ViewGroup 返回的 false 消息时就会去通过 KeyEvent 的 dispatch() 来调用 Activity 自己的 onKeyDown/Up() 事件，将事件交给 Activity 自己处理。这就是我们常见的在 Activity 里重写 onKeyDown/Up() 来处理点击事件，但注意，这里的处理是最后才会接收到的，所以很有可能事件在到达这里之前就被消耗掉了。  

###小结  

![dispatchKeyEvent事件分发传递流程图_LI.jpg](http://upload-images.jianshu.io/upload_images/1924341-7ae1780f9b29d3da.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

整体的分发处理流程就如上图（手抖了，不然是直线的）所示，有些较重要的点我们可以来总结下：  

1. 如果对 DecorView 不大了解，那么可以只侧重我们较常接触的点，如 Activity、 ViewGroup、 View，基于此：    

2. 事件分发：Activity 最先拿到 KeyEvent 事件，但没办法拦截自己处理（这里你们肯定有反对意见，我下面解释），然后将事件分发给 ViewGroup，而 ViewGroup 就只能是递归不断的分发给子 View，事件绝不会在 ViewGroup 中被消耗掉的，最后子 View 接收到事件，分发流程结束，开始事件的处理。  

3. 事件处理：只有 Activity 和 View 能处理事件，View 根据情况选择是在 OnKeyListener、 OnClickListener 还是在 onKeyDown/Up() 里处理，Activity 只能在 onKeyDown/Up() 里处理。  

4. 事件处理归纳一下其实就是四个地方，按处理顺序排列如下：View 的 OnKeyListener.onKey()、onKeyDown/Up()、 OnClickListener.onClick()、  Activity 的 onKeyDown/Up()。一旦在四个地方的某处，事件被消耗了，也就是返回 true 了，事件将不会传递到后面的处理方法中去了。 

**为什么我说 Activity 不能拦截事件交由自己处理呢？**  
在触屏的 TouchEvent 点击事件机制中，我们可以通过重写 onInterceptTouchEvent() 返回 true 来停止拦截事件的分发并自己处理事件，但在 KeyEvent 中并没有这个方法，所以如果 dispatchKeyEvent() 只干事件分发的事，事件处理都在 onKeyDwon/Up、onKey()、onClick() 中完成，这样的话，Activity 确实没办法拦截事件分发交由自己的 onKeyDown/Up() 来处理。  

但谁规定 dispatchKeyEvent() 只能干事件传递的事呢，所以理论上按标准来说，Activity 无法拦截事件分发自己处理，但实际编程中，我经常碰见有人在 Activity 里重写 dispatchKeyEvent() 来处理事件，然后让其返回 true 或 false，停止事件的分发。  
 


#使用场景  
KeyEvent 事件的分发处理流程大体上知道是怎么走的就行了，有兴趣的可以再去看看源码，然后自己画画流程图，就会更明白了。下面讲些使用场景：  

**1. 在 Activity 里重写 dispatchKeyEvent()----最常用**  


**2. 在 Activity 里重写 onKeyDown/Up()----最常用**  

**3. 为某个具体的 View (如 TextView) 设置 OnKeyListener()----一般常用**  

**4. 为某个具体的 View (如 Button) 设置 OnClickListener()----一般常用**   

**3. 自定义某个 View， 重写它的 onKeyDown/Up()----基本没用过** 

#遗留问题  
1. 每次按键点击都会有 Action_Down 和 Action_Up 两次事件，目前遇到这样的场景，从 Activity A 打开 Activity B，Action_Down 和 Action_Up 会在 Activity A 中分发处理，然后 Action_Up 又会在 Activity B 中分发处理。  
最开始的想法 Activity A 将 Action_Up 事件传递给 Activity B 进行处理，但是在 Activity A 中将 Action_Up 先消费掉即返回 true，发现 Activity B 中仍然会重新分发处理 Action_Up 事件。因此，目前对于 KeyEvent 事件在两个 Activity 中是如何分发传递的还不大了解，这部分内容应该是在 ViewRootImpl 和 PhoneWindow 中，计划下一篇就来梳理这部分内容。  

2. Tv 开发中最重要也让人头疼的就是焦点问题，通过遥控器方向键点击后可以控制焦点的移动，有时需要根据需求来控制焦点，比如我们经常做的就是在焦点到达边界时重写 dispatchKeyEvent 里返回 true 来停止焦点的移动，为什么可以这么做呢？其实这部分内容也在 DecorView 的 dispatchKeyEvent 里，DecorView 在高的 SDK 里已经抽出来单独一个类了，如果没找到，那么就去 PhoneWindow 里找，旧的 SDK 里，DecorView 是 PhoneWindow 的内部类，这部分内容也留着下次一起梳理吧。  

#参考  
[Android View框架总结（九）KeyEvent事件分发机制](http://www.imooc.com/article/12664)  
[Android按键事件传递流程(二)](http://blog.csdn.net/cheris_cheris/article/details/53290625)  


