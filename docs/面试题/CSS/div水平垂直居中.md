# 题目：怎么让一个 div 水平垂直居中

https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/92

# 笔记

div 默认是一个块级元素，宽度占据一整行。所以需要区分场景：

如果 div 没有设置宽高，而是想让其中的行内元素或文本水平垂直居中，那么应该通过：

- text-align 和 line-height

```html
<div style="text-align: center;height: 40px;line-height: 40px;">
    <span>水平垂直居中</span>
</div>
```

如果 div 有设置宽高，想让 div 水平垂直居中，可以用下面的方法：

  ### 利用父容器

#### flex

- flex + just-content&algin-items

```html
<div style="display: flex;just-content: center;align-items: center;">
    <div style="width: 30px; height: 30px; background-color: blue;">
    </div>
</div>
```

- flex + margin

```html
<div style="display: flex;">
    <div style="margin: auto;width: 30px; height: 30px; background-color: blue;">
    </div>
</div>
```

#### grid

将上面两个示例中的 display: flex 替换成 display: grid，其余不变，也能实现水平垂直居中效果

### 不依赖于父容器

#### margin

某些场景中，直接设置 margin: auto 就能得到效果

#### 绝对定位

- absolute + margin

```html
<div style="position: releative;">
    <div style="position: absolute;left: 50%;top: 50%;width: 30px;height: 30px;margin-left: -15px; margin-top: -15px;">
        
    </div>
</div>
```

left 和 top 相对于父元素偏移 50%，再扣掉自身宽高一半即可。这种只适合于宽高固定的场景，每次修改宽高也需要同步修改 margin

- absolute + transfrom

```html
<div style="position: releative;">
    <div style="position: absolute;left: 50%;top: 50%;width: 30px;height: 30px;transform: translate3d(-50%, -50%, 0);">
        
    </div>
</div>
```

left 和 top 相对于父元素偏移 50%，transform 再相对于自身偏移 50%。这种方式就不要求 div 必须是固定宽高的了。

### 考虑点

实现水平垂直居中有多种方式，要么将 div 变为 inline-block，然后将其包裹在一个块级元素中，利用 text-align 和 line-height 或 vertical-align 来实现居中。

要么，就是利用父容器，将 div 放置在 flex 或 grid 容器中；

再要么，就是利用绝对定位 position: absolute，然后设置好偏移量。

三种方式，各有优缺点，各有各自的适用场景，实际使用中，根据自身场景权衡好即可。

比如，inline-block 方式，会让当前 div 变成行内元素，需要注意对其他元素的排版是否会造成影响。

添加一个 flex 容器，需要注意，div 的其他兄弟元素，是否也会受到 flex 容器的排版规则影响；

使用绝对定位，会导致 div 脱离普通流，导致父元素高度坍塌，需要考虑这种副作用是否会影响其余元素布局。