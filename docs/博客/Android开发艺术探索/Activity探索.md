最近在看《Android开发艺术探索》这本书籍，学习中也将一些知识点记录下来好了，虽然内容基本都是从书中摘取，不管怎样，自己也是看完、总结、再手动敲打，有苦劳的同时也能巩固自己的基础，还可以分享给各位一起学习的童鞋们，写博客真好。  

***  

# Activity 生命周期  

当前 Activity 为 A，如果重新打开一个Activity B，那么 B 的 onResume() 和 A 的 onPause() 调用顺序是怎么样的？  
答：A 先 onPause()，B 再 onResume()

onPause()，onStop() 中不能做重量级操作，尤其是 onPause()，因为新的 Activity 必须得等旧的 Activity 的 onPause() 操作完后才会显示出来。

onResume() 和 onPause() 配对，从 Activity 是否处于前台的角度来看的。是否处于前台的意思是指当前 Activity 是否可进行交互，所以这两个生命函数会随着用着的交互操作和屏幕的里亮灭而调用多次。  

同理，onStart() 和 onStop()配对，这是从 Activity 是否处于可见状态的角度。这里需要与前台的概念区分开，Activity 处于可见时也有可能是不能交互的。比如在一个 Activity 上面有个弹窗或着有个透明的 Activity，那么这个旧的 Activity 在屏幕上就仍然是有部分是可以见到的，这就是处于可见状态，但是它并不能进行交互，因为在它的上面正有一个 Activity 处于可交互状态。所以，这两个生命函数也会随着屏幕的亮灭等而调用多次。  

onCreate() 和 onDestory() 只会调用一次。  

当系统配置发生变化，比如说从横屏到竖屏，

当 Activity 被异常销毁再重建时会调用 onSavaInstanceState() 和 onRestoreInstanceState()，异常情况指内存不足 Activity 被回收，或者被强制关闭，或者横竖屏切换等。另外，系统会默认实现一些保存和恢复操作，比如恢复 TextView 里输入的数据，光标的位置，ListView 的滑动位置等。  

如果一个进程没有四大组件在执行，则很容易被系统杀死，因此，一些后天的工作建议是放在 Service 中从而保证进程有一定的优先级。 


# Activity 启动模式  


# IntentFilter的匹配规则  
