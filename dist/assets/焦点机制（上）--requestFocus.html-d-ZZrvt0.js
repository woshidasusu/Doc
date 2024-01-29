import{_ as e,o as i,c as n,d as s}from"./app-fgtJnIYH.js";const a={},r=s(`<p>很早之前就想好好的来梳理一下焦点机制方面的文章了，一直拖到现在。</p><p>在 Tv 应用上，焦点机制特别重要，也许手机应用并没有那么明显，但不管如何，学习一下总是好的。</p><p>本次也是一个系列的文章，大概会有三篇左右。</p><h1 id="提问" tabindex="-1"><a class="header-anchor" href="#提问" aria-hidden="true">#</a> 提问</h1><p>看源码还是得带着问题去看比较有效率，那么也还是先来提几个问题吧：</p><p>一个 View 在满足什么条件下可以获取到焦点？</p><p>界面上必须至少存在某个焦点控件么？</p><p>界面上只能有一个焦点么？可以同时有两个焦点存在么？</p><p><strong>Q1：requestFocus() 会让子View获取焦点？</strong></p><p>requestFocus(,null) 之前焦点所在对于下个焦点的寻找会有何种影响？</p><p>requestFocus() 当子View不可见时不会获得焦点？那如果只是父类不可见呢？</p><p>一个界面一颗 View 树，树上每个节点会维护当前的焦点 View 么？</p><h1 id="正文" tabindex="-1"><a class="header-anchor" href="#正文" aria-hidden="true">#</a> 正文</h1><p>PS：本篇源码是基于 android-26 版本，版本不一样，源码也许会有些许差别，大伙自己过的时候注意一下。</p><p>本篇着重分析 <strong><code>requestFocus()</code></strong> 原理，那么源码阅读的入口也就很明确了，就从 View 的这个方法开始跟踪下去：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//View#requestFocus()
public final boolean requestFocus() {
	return requestFocus(View.FOCUS_DOWN);
}

public final boolean requestFocus(int direction) {
	return requestFocus(direction, null);
}


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16),d=[r];function c(u,t){return i(),n("div",null,d)}const o=e(a,[["render",c],["__file","焦点机制（上）--requestFocus.html.vue"]]);export{o as default};
