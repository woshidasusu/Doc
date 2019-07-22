# 声明

本系列文章内容梳理自以下来源：

- [Angular 官方中文版教程](https://www.angular.cn/docs)

官方的教程，其实已经很详细且易懂，这里再次梳理的目的在于复习和巩固相关知识点，刚开始接触学习 Angular 的还是建议以官网为主。

因为这系列文章，更多的会带有我个人的一些理解和解读，由于目前我也才刚开始接触 Angular 不久，在该阶段的一些理解并不一定是正确的，担心会有所误导，所以还是以官网为主。

# 正文- 组件

数据绑定是一种机制，用来协调用户所见和应用数据。 虽然你能往 HTML 推送值或者从 HTML 拉取值， 但如果把这些琐事交给数据绑定框架处理， 应用会更容易编写、阅读和维护。 只要简单地在绑定源和目标 HTML 元素之间声明绑定，框架就会完成这项工作。 

Angular 提供了各种各样的数据绑定，本章将逐一讨论。 先从高层视角来看看 Angular 数据绑定及其语法。

绑定的类型可以根据数据流的方向分成三类： *从数据源到视图*、*从视图到数据源*以及双向的*从视图到数据源再到视图*。



表达式中可以调用像 `getFoo()` 这样的方法。只有你知道 `getFoo()` 干了什么。 如果 `getFoo()` 改变了某个东西，恰好又绑定到个这个东西，你就可能把自己坑了。 Angular 可能显示也可能不显示变化后的值。Angular 还可能检测到变化，并抛出警告型错误。 一般建议是，只绑定数据属性和那些只返回值而不做其它事情的方法。 



指令其实是CSS属性选择器，因为指令就是用在元素或组件标签的属性上，所以是以属性选择器的匹配方式来寻找指令。



这里的方括号(`[]`)表示它的属性型选择器。 Angular 会在模板中定位每个拥有名叫 `appHighlight` 属性的元素，并且为这些元素加上本指令的逻辑。

正因如此，这类指令被称为 **属性选择器** 。



```html
<div *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({{i}}) {{hero.name}}
</div>

<ng-template ngFor let-hero [ngForOf]="heroes" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({{i}}) {{hero.name}}</div>
</ng-template>
```

