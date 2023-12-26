# 题目：分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景

https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/100

# 笔记

**Q：用 CSS 隐藏页面上一个元素有哪几种方法？**

- display: none
- visibility: hiden
- opacity: 0
- 设置 fixed，并设置足够大的负距离 left
- 用层叠关系 z-index 把元素叠在最底层
- 用 text-indent: -9999px 使其文字隐藏

这里比较一下前三种方式的优劣和适用场景：

### 本质

- display: none 会让元素从渲染树 Render Tree 中消失，但元素仍会在 DOM 结构中，页面上不占空间，不能点击，类似于 Android 中的 Visible.GONE
- visibility: hiden 不会将元素移出渲染树，页面上仍旧占据空间，不可点击，类似于 Android 中的 Visible.INVISIBLE
- opacity: 0 让元素透明，页面上因为透明不可见，但仍占据空间，仍可响应点击事件

简单的说下浏览器渲染流程：

生成 DOM 树 -> 生成 CSSOM 树 -> 生成 Render Tree 树 -> Layout（计算元素位置等） -> Paint（渲染）

这是一个页面初始化时的大概流程，整个过程是类似于流水线进行的，比如解析到一个 div 元素时，将其添加到 DOM 树后，就会去解析该 div 的 CSSOM 树中的对应节点，两个完成后，就会去合并到 Render Tree 树中，然后计算元素位置等相关信息，最后渲染呈现到页面上。

也就是说，不是等 HTML 中所有元素都解析完，DOM 树构建完再进行下一步，不是这样的。记住是流水线进行。

当页面渲染结束后，后续根据用户交互等导致的界面更新大概分两种场景：

- ReFlow：DOM 树信息发生变化，需要重新 Layout -> Paint
- RePaint：DOM 树信息没有发生变化，只是元素样式如颜色等发生变化，只需要重新 Paint 即可

### 性能

基于上述理论知识：

- display: none 因为会导致 DOM 树中节点信息发生变化，比如元素之间的 margin 等，所以会触发 ReFlow，相比较而言比较耗性能
- visibility: hiden 只是将元素隐藏起来，没有导致 DOM 发生变化，所以只需 RePaint 即可，相比较而言，性能较好
- opacity: 0 只是将元素透明化，也只是会触发 RePaint，性能相对而言，最好

### 后代元素

三种方式隐藏某个元素时，其子孙元素也都会被隐藏，但本质上有所不同：

- display: none 直接将元素移出渲染树，子孙元素也被连带移出，所以不可见
- visibility: hiden 并没有将元素移出渲染树，但该属性会被后代元素继承，所以后代元素也就都具有 visibility: hiden 属性而隐藏起来，因为可以通过修改后代元素的该属性来让后代元素显示出来
- opacity: 0 直接将整个元素区域透明化，所以后代元素也就都看不见了