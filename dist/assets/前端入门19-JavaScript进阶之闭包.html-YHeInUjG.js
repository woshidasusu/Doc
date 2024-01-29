import{_ as d,r,o as s,c as l,a as e,b as n,e as a,d as c}from"./app-2pyCoCP5.js";const t={},v=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),n(" 声明")],-1),o=e("p",null,"本系列文章内容全部梳理自以下几个来源：",-1),u=e("li",null,"《JavaScript权威指南》",-1),p={href:"https://developer.mozilla.org/zh-CN/docs/Web",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/smyhvae/Web",target:"_blank",rel:"noopener noreferrer"},b={href:"https://github.com/goddyZhao/Translation/tree/master/JavaScript",target:"_blank",rel:"noopener noreferrer"},h=c(`<p>作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。</p><p>PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。</p><h1 id="正文-闭包" tabindex="-1"><a class="header-anchor" href="#正文-闭包" aria-hidden="true">#</a> 正文-闭包</h1><p>在作用域链那篇中，稍微留了个闭包的念想，那么这篇就来讲讲什么是闭包。</p><h3 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h3><p>这个闭包的概念蛮不好理解的，我在阮一峰的某篇文章中看过大概这么句话，闭包是对英文单词的直译，在中文里没有与之对应的句子解释，因此很难理解闭包究竟指的是什么。</p><p>看过很多解释，有说闭包就是函数；也有说闭包就是代码块；还有说函数内的函数就称闭包；还有说当函数返回内部某个函数时，返回的这个函数叫闭包，也有说闭包就是能够读取其他函数内部数据（变量/函数）的函数。</p><p>MDN 网站里不同文章里出现过多种解释：</p><blockquote><ol><li>一个闭包是一个可以自己拥有独立的环境与变量的表达式（通常是函数）</li><li>闭包是函数和声明该函数的词法环境的组合，这个环境包含了这个闭包创建时所能访问的所有局部变量</li></ol></blockquote><p>另外，在某篇文章中，看过这么段话：</p><blockquote><p>2009年发布了ECMAScript-262-5th第五版，不同的是取消了变量对象和活动对象等概念，引入了词法环境（Lexical Environments）、环境记录（EnviromentRecord）等新的概念</p></blockquote><p>所以如果对词法环境这个词不理解的，可以将其理解成执行上下文，或者作用域链。在开头声明给的第四个链接中，是有几篇很早很早之前大佬们翻译的国外的文章，里面对闭包的解释刚好和 MDN 的解释也很类似：</p><blockquote><p>闭包是代码块和创建该代码块的上下文中数据的结合</p></blockquote><p>如果这个代码块是函数，那么利用作用域链那篇中介绍的相关原理，从本质上看闭包：</p><blockquote><p>函数代码，和函数的内部属性 [[Scope]] 两者的结合可称为闭包。 :</p></blockquote><p>对于这么多文章中对闭包的这么多种解释，先不做评价，先来想想，为什么会有闭包，理清了后，你会发现，其实理解闭包没那么难。</p><h3 id="闭包意义" tabindex="-1"><a class="header-anchor" href="#闭包意义" aria-hidden="true">#</a> 闭包意义</h3><p>先看个例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var num = 0;
function a() {
    var num = 1;
    function b() {
        console.log(num);
    }
    return b;
}
var c = a();
c();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用 <code>c()</code> 输出的是 1，这点在作用域链那节已经讲解过了，这里再稍微说下：</p><p>调用 <code>c()</code>，会为 c 函数创建一个函数执行上下文，其中作用域链为：</p><p><code>c函数EC.VO –&gt; a函数EC.VO -&gt; 全局EC.VO</code></p><p>VO 是变量对象，表示存储着当前上下文中所有变量的对象，所以如果以 VO 的实际对象表示作用域链：</p><p><code>c函数{} –&gt; a函数{num:1} -&gt; 全局{num:0}</code></p><p>（忽略 VO 中其他与此例无关变量）</p><p>所以，函数 c 内的代码输出 num 时，到作用域链上寻找时，发现最后使用的是 a 函数内部的 num 变量，最终输出 1。</p><p>但当时也提了个疑问，当代码执行到 <code>c()</code> 时，a 函数已经执行结束，那么 a 函数的 EC 已经从执行环境栈 ECS 中被移出了，c 函数的 EC 里的作用域链为何还会有 <code>a函数EC.VO</code> 存在？</p><p>这就是闭包的典型场景了，闭包的意义之一就是解决这种场景。</p><p>通过作用域链一篇后，我们知道，函数内的变量依赖于函数执行上下文 EC，一般来说，当调用函数时，创建函数执行上下文 EC，并入栈 ECS，当函数执行结束时，就将 EC 从 ECS 中移出，并释放内存空间。</p><p>通常函数的行为的确是这样，但当函数如果有返回值时，情况就不一样了。虽然函数执行结束后它的 EC 确实被移出 ECS，但并没有被回收，JavaScript 解释器的垃圾回收机制也有引用计数的处理。</p><p>既然内存没被回收，那么 EC 就还存在，那么当调用 <code>c()</code> 时，虽然 C 的函数执行上下文是新创建的，上下文的作用域链也是新创建的，但作用域链的取值是当前执行上下文的 VO 拼接上函数对象的内部属性 [[Scope]]。</p><p>这个函数对象的内部属性 [[Scope]] 存储的就是这个函数的外层函数的执行上下文里的作用域链，它的值并不是新创建的，一直保存着外层函数调用时生成的外层函数上下文中的作用域链，通过它可以访问到外层函数变量。</p><h3 id="再谈闭包概念" tabindex="-1"><a class="header-anchor" href="#再谈闭包概念" aria-hidden="true">#</a> 再谈闭包概念</h3><p>所以，实际上，网络上这么多文章里对闭包的各种解释，其实都没错。如果对作用域链的原理理解清楚后，你会发现，其实函数就是闭包，因为由于作用域的机制，让函数内部也持有创建函数的上下文的数据集合，所以函数符合闭包的特性。</p><p>只是在大部分场景下，函数执行结束，函数的 EC 就可以被回收，那么这种场景闭包并没有什么实际应用意义。</p><p>除了函数，如果你可以让某部分代码块持有创建它的上下文的数据集合，那么这也可以称为闭包。</p><p>常见的一种就是在函数内返回一个对象，对象的某些属性使用了对象外层的数据，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var model = (function () {
    var num = 1;
    return {
        num:num
    }
}());
model.num;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时，也可以称返回的这个对象是闭包。</p><p>对于闭包，我对它的理解，更倾向于，闭包并不是一种机制，也不是一种具体的事物（如执行上下文），反而，闭包是对原本存在的事物满足某种场景下的一种称呼。</p><p>也就是说，闭包，它其实是在原有机制，原有事物上的另一种称呼。所以，网上也才有人会说，闭包是函数、闭包是内嵌的函数等等说法。其实，也不是说这是错的，他们有的是从闭包特性角度解释，有的是从闭包现象。</p><p>只是，这原本就存在的事物，你本可以就用它原本的称呼，既然想要用闭包来称呼它，那么自然是这个时候，称呼它为闭包有区别于原本事物的实际意义，所以也才有人会说当函数返回内部函数时，称为闭包，因为这种时候，返回的这个函数就是用到闭包的特性来解决某些问题，所以称这种现象为闭包当然就有实际应用场景意义了。</p><p>所以，我对闭包的理解，它并不是某个固定不变的东西，也不是某个具体的事物，只要符合闭包特性的原有事物，你都可以称它为闭包。所以，对于网上那些对闭包的解释，我的建议是，主谓互换一下，不要说闭包是函数，闭包是内嵌的函数等等，我们可以说，函数是闭包，内嵌的函数也是闭包。只要符合闭包特性的我们都可以称它为闭包，当然如果还有闭包的实际应用意义，那么称它为闭包更可以被人接受。</p><h3 id="闭包的应用" tabindex="-1"><a class="header-anchor" href="#闭包的应用" aria-hidden="true">#</a> 闭包的应用</h3><h4 id="作为外部和函数内部变量通信的桥梁" tabindex="-1"><a class="header-anchor" href="#作为外部和函数内部变量通信的桥梁" aria-hidden="true">#</a> 作为外部和函数内部变量通信的桥梁</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var model = (function () {
    var num = 1;
    function a() {
        console.log(num);
    }
    return {
        num:num
    }
}());
model.num;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>外部是访问不了函数内部的信息，而闭包是指代码块持有创建它的上下文的数据集合。那么，如果在函数内部创建一个闭包，将这个闭包返回给外部，外部是否就可以通过这个闭包作为桥梁来间接与函数内部通信了。</p><h4 id="封装" tabindex="-1"><a class="header-anchor" href="#封装" aria-hidden="true">#</a> 封装</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var Counter = (function() {
    var privateCounter = 0;
    function changeBy(val) {
        privateCounter += val;
    }
    return {
        increment: function() {
            changeBy(1);
        },
        decrement: function() {
            changeBy(-1);
        },
        value: function() {
            return privateCounter;
        }
    }
})();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还是同样的原因，外部是访问不了函数内部的信息，而闭包是指代码块持有创建它的上下文的数据集合。</p><p>那么，是否就可以借助闭包的特性，将一些实现封装在函数内部，通过闭包给外部提供有限的接口使用。</p><p>但要注意，函数本来执行结束，它的 EC 从 ECS 栈内移出时，通常就可被回收了，但如果用到了闭包的特性，导致外部持有着函数内部某个引用，此时函数的 EC 就不会被回收，那么就会占用着内存，使用不当，还会有可能造成内存泄漏。</p>`,52);function _(g,f){const i=r("ExternalLinkIcon");return s(),l("div",null,[v,o,e("ul",null,[u,e("li",null,[e("a",p,[n("MDN web docs"),a(i)])]),e("li",null,[e("a",m,[n("Github:smyhvae/web"),a(i)])]),e("li",null,[e("a",b,[n("Github:goddyZhao/Translation/JavaScript"),a(i)])])]),h])}const E=d(t,[["render",_],["__file","前端入门19-JavaScript进阶之闭包.html.vue"]]);export{E as default};
