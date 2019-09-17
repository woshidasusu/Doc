# JS 面试题

### 1. [['1', '2', '3'].map(parseInt) what & why?](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/4)

首先得明白题目问的是什么，然后才能知道考查的是哪些知识点。

题意表达有些简略，这道题意思是说，对一个数组进行 map 操作，map 参数传入全局方法 parseInt，代码是否会正常执行，如果会，那么经过 map 操作后产生的新数组是什么？为什么是这个值？

所以考查的其实就是 map 方法和 parseInt 方法。

MDN 上有讲解这个注意事项：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map#%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7%E6%A1%88%E4%BE%8B

顺带附上parseInt 方法的讲解：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt

```javascript
// 下面的语句返回什么呢:
["1", "2", "3"].map(parseInt);
// 你可能觉的会是[1, 2, 3]
// 但实际的结果是 [1, NaN, NaN]

// 通常使用parseInt时,只需要传递一个参数.
// 但实际上,parseInt可以有两个参数.第二个参数是进制数.
// 可以通过语句"alert(parseInt.length)===2"来验证.
// map方法在调用callback函数时,会给它传递三个参数:当前正在遍历的元素, 
// 元素索引, 原数组本身.
// 第三个参数parseInt会忽视, 但第二个参数不会,也就是说,
// parseInt把传过来的索引值当成进制数来使用.从而返回了NaN.

function returnInt(element) {
  return parseInt(element, 10);
}

['1', '2', '3'].map(returnInt); // [1, 2, 3]
// 意料之中的结果

// 也可以使用简单的箭头函数，结果同上
['1', '2', '3'].map( str => parseInt(str) );

// 一个更简单的方式:
['1', '2', '3'].map(Number); // [1, 2, 3]
// 与`parseInt` 不同，下面的结果会返回浮点数或指数:
['1.1', '2.2e2', '3e300'].map(Number); // [1.1, 220, 3e+300]
```

所以，["1", "2", "3"].map(parseInt) 实际上等效于 ["1", "2", "3"].map((value, index) => parseInt(value, index));

对于 parseInt 方法来说，第二个参数的取值范围是 2-36，表示如何看待第一个参数值，比如 parseInt(30, 4) 表示说 30 是以四进制格式表示的数值，转换为十进制输出后是 12，所以 parseInt(30, 4) = 12

当第二个参数输入 0 时，效果等同于没输入，其余值均返回 NaN。

- 相似题目

理清上面的知识点后，再遇到其他一些变形的题目，自然就清楚怎么去分析了，比如：

```javascript
let unary = fn => val => fn(val)
let parse = unary(parseInt)
console.log(['1.1', '2', '0.3'].map(parse)) // [1, 2, 0]

['10','10','10','10','10'].map(parseInt); // [10, NaN, 2, 3, 4]
// parseInt(10, 3) = 1 * 3^1 + 0 * 3^0 = 3
```



