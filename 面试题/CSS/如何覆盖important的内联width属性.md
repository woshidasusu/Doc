# 题目：已知如下代码，如何修改才能让图片宽度为 300px ？注意下面代码不可修改

```html
<img src="1.jpg" style="width:480px!important;”>
```

https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/105

# 笔记

当不能修改上述代码的情况下，大概有三种思路有覆盖内联带有 important 的 width 属性：

- 使用更高优先级的方式设置 width
- 使用 js 方式覆盖 width 属性
- 使用缩放等方式来改变实际的内容区域

### 使用更高优先级的方式设置 width

- 动画的样式优先级高于 !important

```css
img {
    animation: test 0s forwards;
}
@keyframes test {
    from {
        width: 300px;
    }
    to {
        width: 300px;
    }
}
```

- max-width 可以限制 width

```css
img {
    max-width: 300px;
}
```

### 使用 js 方式覆盖 width 属性

```javascript
document.getElementsByTagName("img")[0].setAttribute("style","width:300px!important;")
```

### 使用缩放等方式来改变实际的内容区域

- transform: sacle

```css
img {
    transform: sale(0.625);
}
```

- box-sizing

```css
img {
    box-sizing: border-box;
    padding-right: 100px; 
}
```

