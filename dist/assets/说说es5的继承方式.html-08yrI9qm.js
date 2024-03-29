import{_ as i,o as n,c as e,d as s}from"./app-2pyCoCP5.js";const a={},d=s(`<h1 id="说说-es5-的几种继承方式" tabindex="-1"><a class="header-anchor" href="#说说-es5-的几种继承方式" aria-hidden="true">#</a> 说说 ES5 的几种继承方式</h1><p>在 ES6 还没出来前，让你写个继承，你会怎么写</p><p>比如，给你个场景：父类 A 具有属性 a 和方法 b，子类 B 继承父类 A</p><h3 id="es6-继承" tabindex="-1"><a class="header-anchor" href="#es6-继承" aria-hidden="true">#</a> ES6 继承</h3><p>用 ES6 来写的话，就很简单：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class A {
    constructor() {
        this.a = &quot;A&quot;;
    }
    
    b() {
        console.log(&quot;A&quot;);
    }
}

class B extends A {
    constructor() {
        super();
    }
}

var b = new B(); // {a: &quot;A&quot;}
b.__proto__; // {}
b.__proto__.__proto__; // {b: f}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你仔细去看对象 b 的属性和原型链上的属性，你会发现：</p><ul><li>属性 a 是属于对象 b 的自有属性，并不是原型里的属性</li><li>方法 b 是属于对象 b 的原型的原型里的方法</li></ul><p>之所以这样，是因为，在 js 里，并没有类的概念，对象是基于原型的继承，但却有构造函数这东西，然后构造函数的作用更类似于一个工具方法</p><p>它做的是，其实就是处理 this，同时让 this 继承 prototype 原型</p><p>所以，在 ES6 里，如果是写在 constructor 方法里，通过赋值语句给 this 添加的属性，子类继承时，这些属性都当做实例对象的自有属性，也就是只借用父类 constructor 来加工 this 而已，并不是继承</p><p>而写在 class 内的其他方法，则是会被定义在 prototype 对象上，由子类继承</p><p><strong>其实 ES6 的 class 语法只是语法糖，它的实际实现也是基于 ES5 的构造函数和原型，但如果不好好考虑的话，用 ES5 的写继承，很容易出问题</strong></p><p>比如，下面这些就是欠缺考虑的场景：</p><h3 id="原型链继承-未考虑父类构造可传参的场景" tabindex="-1"><a class="header-anchor" href="#原型链继承-未考虑父类构造可传参的场景" aria-hidden="true">#</a> 原型链继承（未考虑父类构造可传参的场景）</h3><p>所谓原型链继承，就是让子类构造函数的 prototype 指向父类的实例对象</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function A() {
  this.a = &quot;a&quot;;
}
A.prototype.b = function() {
  console.log(&quot;b&quot;);
}

function B() {}
B.prototype = new A();
var b = new B(); // {}
b.__proto__; // {a: &quot;a&quot;}
b.__proto__.__proto__; // {b: f}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种和 es6 的实现有个很大的区别就在于，父类构造函数里通过赋值语句给 this 添加的属性，用这种方式，就归算于原型里了，对于子对象 b 来说，这些就属于继承属性了</p><p>网上对于这种方式的缺陷基本都有说：</p><ul><li>原型共用问题，修改原型属性会影响到所有子对象</li><li>未考虑父构造函数可传参的场景</li></ul><p>个人觉得第一个不是问题，毕竟这就是原型继承语言的特点，倒是第二个在某些场景就有问题了：</p><p>当父构造函数需要参数，且参数来自于调用子构造函数时传递进去的，那显然，只有在子构造函数内才能知道参数是什么，但由于操作原型继承的语句是在构造函数外部的，所以这种场景就无法适用了</p><h3 id="组合继承-多余的原型属性" tabindex="-1"><a class="header-anchor" href="#组合继承-多余的原型属性" aria-hidden="true">#</a> 组合继承（多余的原型属性）</h3><p>不推荐使用该方式</p><p>所谓组合继承，就是在上面原型链继承方式下，在子构造函数内，手动调用父构造函数，并传入子类 this</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function A() {
  this.a = &quot;a&quot;;
}
A.prototype.b = function() {
  console.log(&quot;b&quot;);
}

function B() {
  A.call(this);
}
B.prototype = new A();
var b = new B(); // {a: &quot;a&quot;}
b.__proto__; // {a: &quot;a&quot;}
b.__proto__.__proto__; // {b: f}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种最大的问题在于，父构造函数上的属性既添加到子对象上，也添加到原型对象上了，也就是父构造函数被调用了两次，虽然两次针对的目标并不一样，但针对原型的这次调用是多余的</p><h3 id="寄生组合-推荐" tabindex="-1"><a class="header-anchor" href="#寄生组合-推荐" aria-hidden="true">#</a> 寄生组合（推荐）</h3><p>（这些方式的名字也不知道谁起的）</p><p>寄生组合的方式其实就是改进组合继承法，其实也是 es6 的 class 的实现方式，思路很简单，就是子构造函数调用父构造函数来处理对 this 的加工，然后子构造函数的 prototype 继承父构造函数的 prototype</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function A() {
  this.a = &quot;a&quot;;
}
A.prototype.b = function() {
  console.log(&quot;b&quot;);
}

function B() {
  A.call(this);
}
B.prototype = Object.create(A.prototype);
B.prototype.constructor = B;
var b = new B(); // {a: &quot;a&quot;}
b.__proto__; // {}
b.__proto__.__proto__; // {b: f}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这就和 es6 里的实现是一样的了，当然，如果能考虑到，默认构造函数的原型里会有个 constructor 属性指向构造函数，但当手动修改构造函数的原型时，这个属性就丢失掉了，所以，能够手动加回来，就最好了</p><hr><p>其实，我一直没觉得继承这个面试点要考什么，我觉得每种方式都有使用场景，当然，最后一种的通用法</p><p>但如果没有需要往构造函数里传参的场景的话，那第一种原型链法也是可以用的啊，你说它存在修改原型属性影响子对象的缺陷存在？</p><p>有点懵，这是缺陷吗，这不就是基于原型继承语言的特点，那 es6 的 class 方式，上面寄生组合通用法就没有这个问题吗，不也一样可以改原型上的方法来影响到子对象</p><p>当然，网上还有介绍一种借用构造函数法的，就是全程都通过调用父类构造函数来实现继承，不借用构造函数的 prototype，这种方式，在我看来，就称不上是继承的写法，就是一种错误写法而已，哪有基于原型继承的语言不用原型来实现继承的</p><p>还有组合继承法，这种方式，其实我也觉得是一种粗心下的错误写法而已，既然想到了用构造函数加工子对象的 this，用构造函数原型来实现继承，那继承的时候，干嘛还要去继承父构造函数的实例对象，直接继承父构造函数的原型不就好了</p><p>综上，在我看来，继承其实就两种，一种是通过原型继承父构造函数的实例对象，一种是通过借助父构造函数加工子对象 this 和继承父构造函数原型，前一种写法简单，但使用场景有限，后一种写法通用</p><p>所以，没明白考点是什么，可能就是考，你会不会写错代码，用错方法的吧</p>`,40),l=[d];function r(t,c){return n(),e("div",null,l)}const o=i(a,[["render",r],["__file","说说es5的继承方式.html.vue"]]);export{o as default};
