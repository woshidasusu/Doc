很早之前就想好好的来梳理一下焦点机制方面的文章了，一直拖到现在。  

在 Tv 应用上，焦点机制特别重要，也许手机应用并没有那么明显，但不管如何，学习一下总是好的。

本次也是一个系列的文章，大概会有三篇左右。  

# 提问  

看源码还是得带着问题去看比较有效率，那么也还是先来提几个问题吧：  

一个 View 在满足什么条件下可以获取到焦点？

界面上必须至少存在某个焦点控件么？

界面上只能有一个焦点么？可以同时有两个焦点存在么？

**Q1：requestFocus() 会让子View获取焦点？**

requestFocus(,null) 之前焦点所在对于下个焦点的寻找会有何种影响？

requestFocus() 当子View不可见时不会获得焦点？那如果只是父类不可见呢？

一个界面一颗 View 树，树上每个节点会维护当前的焦点 View 么？  

# 正文  

PS：本篇源码是基于 android-26 版本，版本不一样，源码也许会有些许差别，大伙自己过的时候注意一下。  

本篇着重分析 **`requestFocus()`** 原理，那么源码阅读的入口也就很明确了，就从 View 的这个方法开始跟踪下去：  

```java
//View#requestFocus()
public final boolean requestFocus() {
	return requestFocus(View.FOCUS_DOWN);
}

public final boolean requestFocus(int direction) {
	return requestFocus(direction, null);
}


```

