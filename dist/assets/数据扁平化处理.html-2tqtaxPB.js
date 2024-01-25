import{_ as s,r as d,o as r,c as l,a as e,b as i,e as c,d as n}from"./app-XVH6qKTA.js";const v={},t=n(`<h3 id="题目-将数组扁平化处理" tabindex="-1"><a class="header-anchor" href="#题目-将数组扁平化处理" aria-hidden="true">#</a> 题目：将数组扁平化处理</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 输入：
[1, [2, [3, [4, 5]]], 6]

// 输出：
[1, 2, 3, 4, 5, 6]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方案一-flat-es2019" tabindex="-1"><a class="header-anchor" href="#方案一-flat-es2019" aria-hidden="true">#</a> 方案一：flat() - ES2019</h4>`,3),u=e("code",null,"flat()",-1),o={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat",target:"_blank",rel:"noopener noreferrer"},m=e("p",null,[e("code",null,"flat()"),i(" 方法会移除数组中的空项")],-1),b=n(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, , 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方案二-reduce-concat-es2015" tabindex="-1"><a class="header-anchor" href="#方案二-reduce-concat-es2015" aria-hidden="true">#</a> 方案二： reduce + concat - ES2015</h4><p>其实也是递归思想，递归处理每一个元素</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function flatDeep(arr, deep = 1) {
    return deep &gt; 0 ? arr.reduce((arr, item) =&gt; {
        return arr.concat(Array.isArray(item) ? flatDeep(item, deep-1) : item);
    }, []) : arr.slice();
}

var a = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
flatDeep(a, Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方案三-generator-函数-es2015" tabindex="-1"><a class="header-anchor" href="#方案三-generator-函数-es2015" aria-hidden="true">#</a> 方案三： Generator 函数 - ES2015</h4><p>Generator 可生产迭代器对象，可用扩展运算符 <code>...</code> 或者 <code>for of</code> 来取出每个子项，同时，<code>yield *</code> 支持引入其他可迭代对象，所以书写递归会比较方便</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function* flatten(arr) {
    for (const item of arr) {
        if (Array.isArray(item)) {
            yield* flatten(item); 
        } else {
            yield item;
        }
    }
}

var a = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
[...flatten(a)]
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方案四-循环-堆栈" tabindex="-1"><a class="header-anchor" href="#方案四-循环-堆栈" aria-hidden="true">#</a> 方案四： 循环 + 堆栈</h4><p>遍历树结构时，可用递归方案，也可用循环方案，循环比递归好的地方在于不用考虑栈溢出场景</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function flat2(arr) {
    const result = [];
    const stack = [...arr];
    while(stack.length &gt; 0) {
        const item = stack.pop();
        if (Array.isArray(item)) {
            stack.push(...item);
        } else {
            result.push(item);
        }
    }
    return result.reverse();
}

var a = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
flat2(a);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方案五-扩展运算符" tabindex="-1"><a class="header-anchor" href="#方案五-扩展运算符" aria-hidden="true">#</a> 方案五： 扩展运算符</h4><p><code>...</code> 扩展运算符可以展开一层数组，结合循环，可实现扁平化处理数组</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];

while(a.some(v =&gt; Array.isArray(v))) {
    a = [].concat(...a);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13);function h(p,f){const a=d("ExternalLinkIcon");return r(),l("div",null,[t,e("blockquote",null,[e("p",null,[u,i(" 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回 --- "),e("a",o,[i("MDN"),c(a)])]),m]),b])}const _=s(v,[["render",h],["__file","数据扁平化处理.html.vue"]]);export{_ as default};
