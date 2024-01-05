import{_ as d,r,o as s,c as l,a as e,b as n,e as i,d as c}from"./app-pwInIdNR.js";const v={},u=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),n(" 声明")],-1),t=e("p",null,"本系列文章内容全部梳理自以下几个来源：",-1),p=e("li",null,"《JavaScript权威指南》",-1),o={href:"https://developer.mozilla.org/zh-CN/docs/Web",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/smyhvae/Web",target:"_blank",rel:"noopener noreferrer"},b={href:"https://github.com/goddyZhao/Translation/tree/master/JavaScript",target:"_blank",rel:"noopener noreferrer"},h=c(`<p>作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。</p><p>PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。</p><h1 id="正文-函数" tabindex="-1"><a class="header-anchor" href="#正文-函数" aria-hidden="true">#</a> 正文-函数</h1><p>在 JavaScript 里用 function 声明的就是函数，函数本质上也是一个对象，不同的函数调用方式有着不同的用途，下面就来讲讲函数。</p><p>函数有一些相关术语： function 关键字、函数名、函数体、形参、实参、构造函数；</p><p>其中，大部分的术语用 Java 的基础来理解即可，就构造函数需要注意一下，跟 Java 里不大一样。在 JavaScript 中，所有的函数，只要它和 new 关键字一起使用的，此时，就可称这个函数为构造函数。</p><p>因为，为了能够在程序中辨别普通函数和构造函数，书中建议需要有一种良好的编程规范，比如构造函数首字母都用大写，普通函数或方法的首字母小写，以人为的手段来良好的区分它们。这是因为，通常用来当做构造函数就很少会再以普通函数形式使用它。</p><h3 id="函数定义" tabindex="-1"><a class="header-anchor" href="#函数定义" aria-hidden="true">#</a> 函数定义</h3><p>函数的定义大体上包含以下几部分：function 关键字、函数对象的变量标识符、形参列表、函数体、返回语句。</p><p>如果函数没有 return 语句，则函数返回的是 undefined。</p><p>函数定义有三种方式：</p><h4 id="函数声明式" tabindex="-1"><a class="header-anchor" href="#函数声明式" aria-hidden="true">#</a> 函数声明式</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>add(1,2); //由于函数声明被提前了，不会出错
function add(x, y) {
    //函数体
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>add 是函数名，由于 JavaScript 有声明提前的处理，以这种方式定义的函数，可以在它之前调用。</p><h4 id="函数定义表达式" tabindex="-1"><a class="header-anchor" href="#函数定义表达式" aria-hidden="true">#</a> 函数定义表达式</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var add = function (x, y) {
    //函数体
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式其实是定义了匿名函数，然后将函数对象赋值给 add 变量，JavaScript 的声明提前处理只将 add 变量的声明提前，赋值操作仍在原位置，因此这种方式的声明，函数的调用需要在声明之后才不会报错。</p><p>注意，即使 function 后跟随了一个函数名，不使用匿名函数方式，但在外部仍旧只能使用 add 来调用函数，无法通过函数名，这是由于 JavaScript 中作用域机制原理导致，在后续讲作用域时会来讲讲。</p><h4 id="function" tabindex="-1"><a class="header-anchor" href="#function" aria-hidden="true">#</a> Function</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var add = new Function(&quot;x&quot;, &quot;y&quot;, &quot;return x*y;&quot;);
//基本等价于
var add = function (x, y) {
    return x*y;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Function 构造函数接收不定数量的参数，最后一个参数表示函数体，前面的都作为函数参数处理。</p><p>注意：以这种方式声明的函数作用域是全局作用域，即使这句代码是放在某个函数内部，相当于全局作用域下执行 eval()，而且对性能有所影响，不建议使用这种方式。</p><h3 id="函数调用" tabindex="-1"><a class="header-anchor" href="#函数调用" aria-hidden="true">#</a> 函数调用</h3><p>跟 Java 不一样的地方，在 JavaScript 中函数也是对象，既然是对象，那么对于函数对象这个变量是可以随意使用的，比如作为赋值语句的右值，作为参数等。</p><p>当被作为函数对象看待时，函数体的语句代码并不会被执行，只有明确是函数调用时，才会触发函数体内的语句代码的执行。</p><p>例如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = function () {
    return 2;
}
var b = a;    //将函数对象a的引用赋值给b
var c = a();  //调用a函数，并将返回值赋值给c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数的调用可分为四种场景：</p><ul><li>作为普通函数被调用</li><li>作为对象的方法被调用</li><li>作为构造函数被调用</li><li>通过 call() 或 apply() 间接的调用</li></ul><p>不同场景的调用所造成的区别就是，函数调用时的上下文（this）区别、作用域链的区别；</p><h4 id="作为普通函数被调用" tabindex="-1"><a class="header-anchor" href="#作为普通函数被调用" aria-hidden="true">#</a> 作为普通函数被调用</h4><p>通常来说，直接使用函数名+() 的形式调用，就可以认为这是作为函数被调用。如果有借助 <code>bind()</code> 时会是个例外的场景，但一般都可以这么理解。</p><p>如果只是单纯作为函数被调用，那么通常是不用去考虑它的上下文、它的this值，因为这个时候，函数的用途倾向于处理一些通用的工作，而不是特定对象的特定行为，所以需要使用 this 的场景不多。</p><p>普通函数被调用时的作用域链的影响因素取决于这个函数被定义的位置，作用域链是给变量的作用域使用的，变量的作用域分两种：全局变量、函数内变量，作用域链决定着函数内的变量取值来源于哪里；</p><p>普通函数被调用时的上下文在非严格模式下，一直都是全局对象，不管这个函数是在嵌套函数内被调用或定义还是在全局内被定义或调用。但在严格模式下，上下文是 undefined。</p><h4 id="作为对象的方法被调用" tabindex="-1"><a class="header-anchor" href="#作为对象的方法被调用" aria-hidden="true">#</a> 作为对象的方法被调用</h4><p>普通的函数如果挂载在某个对象内，作为对象的属性存在时，此时可从对象角度称这个函数为对象的方法，而通过对象的引用访问这个函数类型的属性并调用它时，此时称为方法调用。</p><p>方法调用的上下文（this）会指向挂载的这个对象，作用域链仍旧是按照函数定义的位置生成。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = {
    b: 1,
    c: function () {
        return this.b;
    }
}
a.c();  //输出1，a.c() 称为对象的方法调用
a[&quot;c&quot;](); //对象的属性也可通过[]访问，此种写法也是调用对象a的c方法
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只有明确通过对象的引用访问函数类型的属性并调用它的行为才称为对象的方法调用，并不是函数挂载在对象上，它的调用就是方法调用，需要注意下这点，看个例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var d = a.c;
d();  //将对象的c函数引用赋值给d，调用d，此时d()是普调的函数调用，上下文在非严格模式下是全局对象，不是对象a
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>下面通过一个例子来说明普通函数调用和对象的方法调用：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = 0;
var o = {
    a:1,
    m: function () {
        console.log(this.a); 
        f();  //f() 是函数调用
        function f() {
            console.log(this.a);
        }
    }
}
o.m(); //输出 1 0，因为0.m()是方法调用，m中的this指向对象o，所以输出
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出1 0，因为 <code>o.m()</code> 是方法调用，m 中的 this 指向对象 o，所以输出的 a 是对象 o 中 a 属性的值 1；</p><p>而 m 中虽然内嵌了一个函数 f，它并不挂载在哪个对象像，<code>f()</code> 是对函数 f 的调用，那么它的上下文 this 指向的是全局对象。</p><p>所以，对于函数的不同场景的调用，重要的区别就是上下文。</p><h4 id="作为构造函数被调用" tabindex="-1"><a class="header-anchor" href="#作为构造函数被调用" aria-hidden="true">#</a> 作为构造函数被调用</h4><p>普通函数挂载在对象中，通过对象来调用称方法；而当普通函数结合 new 关键字一起使用时，被称为构造函数。</p><p>构造函数的场景跟其他场景比较不同，区别也比较大一些，除了调用上下文的区别外，在实参处理、返回值方面都有不同。</p><p>如果不需要给构造函数传入参数，是可以省略圆括号的，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var o = new Object();
var o = new Object;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>对于方法调用或函数调用圆括号是不能省略的，一旦省略，就只会将它们当做对象处理，并不会调用函数。</p><p>构造函数调用时，是会创建一个新的空对象，继承自构造函数的 prototype 属性，并且这个新创建的空对象会作为构造函数的上下文，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var o = {
    a:1,
    f:function () {
        console.log(this.a);
    }
}
o.f();  //输出1
new o.f();  //输出undefined
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果是 <code>o.f()</code> 时，此时是方法调用，输出 1;</p><p>而如果是 <code>new o.f()</code> 时，此时 f 被当做构造函数处理，this 指向的是新创建的空对象，空对象没有 a 这个属性，所以输出 undefined。</p><p>构造函数通常不使用 return 语句，默认会创建继承自构造函数 prototype 的新对象返回。但如果硬要使用 return 语句时，如果 return 的是个对象类型，那么会覆盖掉构造函数创建的新对象返回，如果 return 的是原始值时，return 语句无效。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var o = {
    f:function () {
        return [];
    }
}

var b = new o.f();  //b是[] 空数组对象，而不是f
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="间接调用" tabindex="-1"><a class="header-anchor" href="#间接调用" aria-hidden="true">#</a> 间接调用</h4><p><code>call()</code> 和 <code>apply()</code> 是 Function.prototype 提供的函数，所有的函数对象都继承自 Function.prototype，所有都可以使用这两个函数。它们的作用是可以间接的调用此函数。</p><p>什么意思，也就是说，任何函数可以作为任何对象的方法来调用，即使这个函数并不是那个对象的方法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var o = {
    a:1,
    f:function () {
        console.log(this.a);
    }
}
o.f(); //输出1
var o1 = {
    a:2
}
o.f.call(o1); //输出2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数 f 原本是对象 o 的方法，但可以通过 call 来间接让函数 f 作为其他对象如 o1 的方法调用。</p><p>所以间接调用本质上也还是对象的方法调用。应用场景可以是子类用来调用父类的方法。</p><p>那么函数的调用其实按场景来分可以分为三类：作为普通函数被调用，作为对象方法被调用，作为构造函数被调用。</p><p>普通函数和对象方法这两种区别在于上下文不一样，而构造函数与前两者区别更多，在参数处理、上下文、返回值上都有所区别。</p><p>如果硬要类比于 Java 的函数方面，我觉得可以这么类比：</p><ul><li><pre><code>     普通函数的调用 VS 公开权限的静态方法
</code></pre></li><li><pre><code>     对象方法的调用 VS 对象的公开权限的方法
</code></pre></li><li><pre><code>     构造函数的调用 VS 构造函数的调用
</code></pre></li></ul><p>左边 JavaScript，右边 Java，具体实现细节很多不一样，但大体上可以这么类比理解。</p><h3 id="函数参数" tabindex="-1"><a class="header-anchor" href="#函数参数" aria-hidden="true">#</a> 函数参数</h3><p>参数分形参和实参两个概念，形参是定义时指定的参数列表，期望调用时函数所需传入的参数，实参是实际调用时传入的参数列表。</p><p>在 JavaScript 中，不存在 Java 里方法重载的场景，因为 JavaScript 不限制参数的个数，如果实参比形参多，多的省略，如果实参比形参少，少的参数值就是 undefined。</p><p>这种特性让函数的用法变得很灵活，调用过程中，根据需要传入所需的参数个数。但同样的，也带来一些问题，比如调用时没有按照形参规定的参数列表来传入，那么函数体内部就要自己做相对应的处理，防止程序因参数问题而异常。</p><p>同样需要处理的还有参数的类型，因为 JavaScript 是弱类型语言，函数定义时无需指定参数类型，但在函数体内部处理时，如果所期望的参数类型与传入的不一致，比如希望数组，传入的是字符串，这种类型不一致的场景JavaScript虽然会自动根据类型转换规则进行转换，但有时转换结果也不是我们所期望的。</p><p>所以，有些时候，函数体内部除了要处理形参个数和实参个数不匹配的场景外，最好也需要处理参数的类型检查，来避免因类型错误而导致的程序异常。</p><h4 id="arguments" tabindex="-1"><a class="header-anchor" href="#arguments" aria-hidden="true">#</a> arguments</h4><p>函数也是个对象，当定义了一个函数后，它继承自 Function.prototype 原型，在这个原型中定义了所有函数共有的基础方法和属性，其中一个属性就是 arguments。</p><p>这个属性是一个类数组对象，按数组序号顺序存储着实参列表，所以在函数内使用参数时，除了可以使用形参定义的变量，也可以使用 arguments。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = function (x, y) {
    //x 和 arguments[0]等效
    console.log(x);
    console.log(arguments[0]);
	console.log(arguments[1]);
	console.log(arguments[2]);
}

a(5); //输出 5 5 undefined undefined
a(5, 4, 3); //输出 5 5 4 3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，虽然函数定义时声明了三个参数，但使用的时候，并不一定需要传入三个，当传入的实参个数少于定义的形参个数时，相应形参变量对应的值为 undefined；</p><p>相反，当传入实参个数超过形参个数时，可用 arguments 来取得这些参数使用。</p><h4 id="参数处理" tabindex="-1"><a class="header-anchor" href="#参数处理" aria-hidden="true">#</a> 参数处理</h4><p>因为函数不对参数个数、类型做限制，使用时可以传入任意数量的任意类型的实参，所以在函数内部通常需要做一些处理，大体上从三个方面进行考虑：</p><ul><li>形参个数与实参个数不符时处理</li><li>参数默认值处理</li><li>参数类型处理</li></ul><p>下面分别来讲讲：</p><h5 id="形参个数与实参个数不符时处理" tabindex="-1"><a class="header-anchor" href="#形参个数与实参个数不符时处理" aria-hidden="true">#</a> 形参个数与实参个数不符时处理</h5><p>通过 argument.length 可以获取实参的个数，通过函数属性 length 可以获取到形参个数，知道形参个数和实参个数就可以做一些处理。如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = function (x) {
    if (arguments.length !== arguments.callee.length) {
        throw Error(&quot;...&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码表示当传入的实参个数不等于形参个数时，抛异常。</p><p>形参个数用：arguments.callee.length 获取，callee 是一个指向函数本身对象的引用。这里不能直接用 length 或 this.length，因为在函数调用一节说过，当以不同场景使用函数时，上下文 this 的值是不同的，不一定指向函数对象本身。</p><p>在函数体内部要获取一个指向函数本身对象的引用有三种方式：</p><ul><li>函数名</li><li>arguments.callee</li><li>作用域下的一个指向该函数的变量名</li></ul><h5 id="参数默认值处理" tabindex="-1"><a class="header-anchor" href="#参数默认值处理" aria-hidden="true">#</a> 参数默认值处理</h5><p>通常是因为实参个数少于形参的个数，导致某些参数并没有被定义，函数内使用这些参数时，参数值将会是 undefined，为了避免会造成一些逻辑异常，可以做一些默认值处理。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = function (x) {
    //根据形参实参个数做处理
    if (arguments.length !== arguments.callee.length) {
        throw Error(&quot;...&quot;);
    }
    //处理参数默认值
    x = x || &quot;default&quot;; // 等效于 if(x === undefined) x = &quot;default&quot;;

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="参数类型处理" tabindex="-1"><a class="header-anchor" href="#参数类型处理" aria-hidden="true">#</a> 参数类型处理</h5><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = function (x) {
    //根据形参实参个数做处理
    if (arguments.length !== arguments.callee.length) {
        throw Error(&quot;...&quot;);
    }
    //处理参数默认值
    x = x || &quot;default&quot;; // 等效于 if(x === undefined) x = &quot;default&quot;;
    //参数类型处理
    if (Array.isArray(x)) {
        //...   
    }
    if (x instanceof Function) {
        //...   
    } 
    //...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参数类型的处理可能比较常见，通过各种辅助手段，确认所需的参数类型究竟是不是期望的类型。</p><h5 id="多个参数时将其封装在对象内" tabindex="-1"><a class="header-anchor" href="#多个参数时将其封装在对象内" aria-hidden="true">#</a> 多个参数时将其封装在对象内</h5><p>当函数的形参个数比较多的时候，对于这个函数的调用是比较令人头疼的，因为必须要记住这么多参数，每个位置应该传哪个。这个时候，就可以通过将这些参数都封装到对象上，函数调用传参时，就不必关心各个参数的顺序，都添加到对象的属性中即可。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//函数用于复制原始数组指定起点位置开始的n个元素到目标数组指定的开始位置
function arrayCopy(fromArray, fromStart, toArray, toStart, length) {
    //...
}

//外部调用时，传入对象内只要有这5个属性即可，不必考虑参数顺序，同时这种方式也可以实现给参数设置默认值
function arrayCopyWrapper(args) {
    arrayCopy(args.fromArray,
                args.fromStart || 0, 
                args.toArray,
                args.toStart || 0,
                args.length);
}
arrayCopyWrapper({fromArray:[1,2,3], fromStart:0, toArray:a, length:3});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二种方式相比第一种方式会更方便使用。</p><h3 id="函数特性" tabindex="-1"><a class="header-anchor" href="#函数特性" aria-hidden="true">#</a> 函数特性</h3><p>函数既是函数，也是对象。它拥有类似其他语言中函数的角色功能，同时，它本身也属于一个对象，同样拥有对象的相关功能。</p><p>当作为函数来对待时，它的主要特性也就是函数的定义和调用：如何定义、如何调用、不同定义方式有和区别、不同调用方式适用哪些场景等等。</p><p>而当作为对象来看待时，对象上的特性此时也就适用于这个函数对象，如：动态为其添加或删除属性、方法，作为值被传递使用等。</p><p>所以，函数的参数类型也可以是函数，函数对象也可以拥有类型为函数的属性，此时称它为这个对象的方法。</p><p>如果某些场景下，函数的每次调用时，函数体内部都需要一个唯一变量，此时通过给函数添加属性的方式，可以避免在全局作用域内定义全局变量，这是 Java 这类语言做不到的地方。</p><p>类似需要跟踪函数每次的调用这种场景，就都可以通过对函数添加一些属性来实现。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function uniqueCounter() {
    return uniqueCounter.counter++;
}
uniqueCounter.counter = 0;

var a = uniqueCounter();  //a = 0;
var b = uniqueCounter();  //b = 1;
var c = uniqueCounter();  //c = 2;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然定义全局变量的方式也可以实现，但容易污染全局空间的变量。</p><h3 id="函数属性" tabindex="-1"><a class="header-anchor" href="#函数属性" aria-hidden="true">#</a> 函数属性</h3><p>除了可动态对函数添加属性外，由于函数都是继承自 Function.prototype 原型，因此每个函数其实已经自带了一些属性，包括常用的方法和变量，比如上述介绍过的 arguments。</p><p>这里就来学下，一个函数本身自带了哪些属性，不过函数比较特别，下面介绍的一些属性并没有被纳入标准规范中，但各大浏览器却都有实现，不过使用这类属性还是要注意下：</p><h4 id="arguments-1" tabindex="-1"><a class="header-anchor" href="#arguments-1" aria-hidden="true">#</a> arguments</h4><p>上述介绍过，这个属性是个类数组对象，用于存储函数调用时传入的实参列表。</p><p>但有一点需要注意，在严格模式下，不允许使用这个属性了，这个变量被作为一个保留字了。</p><h4 id="length" tabindex="-1"><a class="header-anchor" href="#length" aria-hidden="true">#</a> length</h4><p>上述也提过，这个属性表示函数声明时的形参个数，也可以说是函数期望的参数个数。</p><p>有一点也需要注意，在函数体内不能直接通过 length 或 this.length 来访问这个属性，因为函数会跟随着不同的调用方式有不同的上下文 this，并不一定都指向函数对象本身。</p><p>而 arguments 对象中还有一个属性 callee，它指向当前正在执行的函数，在函数体内部可以通过 arguments.callee 来获取函数对象本身，然后访问它的 length 属性。</p><p>在函数外部，就可以直接通过访问函数对象的属性方式直接获取 length。如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = function (x, y) {
    console.log(arguments.length);
    console.log(arguments.callee.length);
}

a(1); // 输出 1 2，实参个数1个，形参个数2个
a.length;  //2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但需要注意一点，在严格模式下，函数体内部就不能通过 arguments.callee.length 来使用了。</p><h4 id="caller" tabindex="-1"><a class="header-anchor" href="#caller" aria-hidden="true">#</a> caller</h4><p>caller 属性表示指向当前正在执行的函数的函数，也就是当前在执行的函数是在哪个函数内执行的。这个是非标准的，但大多浏览器都有实现。</p><p>在严格模式下，不能使用。</p><p>还有一点需要注意的是，有的书里是说这个 caller 属性是函数的参数对象 arguments 里的一个属性，但某些浏览器中，caller 是直接作为函数对象的属性。</p><p>总之，arguments，caller，callee 这三个属性如果要使用的话，需要注意一下。</p><h4 id="name" tabindex="-1"><a class="header-anchor" href="#name" aria-hidden="true">#</a> name</h4><p>返回函数名，这个属性是 ES6 新增的属性，但某些浏览器在 ES6 出来前也实现了这个属性。即使不通过这个属性，也可以通过函数的 <code>toSring()</code> 来获取函数名。</p><h4 id="bind" tabindex="-1"><a class="header-anchor" href="#bind" aria-hidden="true">#</a> bind()</h4><p>用于将当前函数绑定至指定对象，也就是作为指定对象的方法存在。同时，这个函数会返回一个函数类型的返回值，所以通过 <code>bind()</code> 方式，可以实现以函数调用的方式来调用对象的方法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function f(y) {
    return this.x + y;
}
var o = {x:1}

var g = f.bind(o);
g(2);  //输出 3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时 g 虽然是个函数，但它表示的是对象 o 的方法 f，所以 <code>g()</code> 这种形式虽然是函数调用，但实际上却是调用 o 对象的方法 f，所以方法 f 函数体中的 this 才会指向对象 o。</p><p>另外，如果调用 <code>bind()</code> 时传入了多个参数，第一个参数表示需要到的对象，剩余参数会被使用到当前函数的参数列表。</p><h4 id="prototype" tabindex="-1"><a class="header-anchor" href="#prototype" aria-hidden="true">#</a> prototype</h4><p>该属性名直译就是原型，当函数被当做构造函数使用时才有它的意义，用于当某个对象是从构造函数实例化出来的，那么这个对象会继承自这个构造函数的 prototype 所指向的对象。</p><p>虽然这个属性的中文直译就是原型，但我不喜欢这么称呼它，因为原型应该是指从子对象的角度来看，它们继承的那个对象，称作它们的原型，因为原型就是类似于 Java 里父类的概念。</p><p>虽然，子对象的原型确实由构造函数的 prototype 决定，但如果将这个词直接翻译成原型的话，那先来看下这样的一句表述：通过构造函数创建的新对象继承自构造函数的原型。</p><p>没觉得这句话会有一点儿歧义吗？构造函数本质上也是一个对象，它也有继承结构，它也有它继承的原型，那么上面那句表述究竟是指新对象继承自构造函数的原型，还是构造函数的 prototype 属性值所指向的那个对象？</p><p>所以，你可以看看，在我写的这系列文章中，但凡出现需要描述新对象的原型来源，我都是说，新对象继承自构造函数的 prototype 所指向的那个对象，我不对这个属性名进行直译，因为我觉得它会混淆我的理解。</p><p>另外，在 prototype 指向的原型对象中添加的属性，会被所有从它关联的构造函数创建出来的对象所继承。所有，数组内置提供的一些属性方法、函数内置提供的相关属性方法，实际上都是在 Array.prototype 或 Function.prototype 中定义的。</p><h4 id="call-和-apply" tabindex="-1"><a class="header-anchor" href="#call-和-apply" aria-hidden="true">#</a> call() 和 apply()</h4><p>这两个方法在函数调用一小节中介绍过了，因为在 JavaScript 中的函数的动态的，任意函数都可以作为任意对象的方法被调用，即使这个函数声明在其他对象中。此时，就需要通过间接调用实现，也就是通过 <code>call()</code> 和 <code>apply()</code>。</p><p>一种很常见的应用场景，就是用于调用原型中的方法，类似于 Java 中的 super 调用父类的方法。因为子类可能重写了父类的方法，但有时又需要调用父类的方法，那么可通过这个实现。</p><h4 id="tostring" tabindex="-1"><a class="header-anchor" href="#tostring" aria-hidden="true">#</a> toString()</h4><p>Function.prototype 重写了 Object.prototype 中提供的 toString 方法，自定义的函数会通常会返回函数的完整源码，而内置的函数通常返回 [native code] 字符串。</p><p>借助这个可以获取到自定义的函数名。</p><h3 id="嵌套函数" tabindex="-1"><a class="header-anchor" href="#嵌套函数" aria-hidden="true">#</a> 嵌套函数</h3><p>嵌套函数就是在函数体中继续定义函数，需要跟函数的方法定义区别开来。</p><p>函数的方法定义，是将函数看成对象，定义它的属性，类型为函数，这个函数只是该函数对象的方法，并不是它的嵌套函数。</p><p>而嵌套函数需要在函数体部分再用 function 定义的函数，这些函数称为嵌套函数。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var x = 0;
var a = function () {
    var x = 1;
    function b() {
        console.log(x);
    }

    var c = function () {
        console.log(x);
    }

    b();  //输出：1
    c();  //输出：1
    a.d();//输出：0
}

a.d = function () {
    console.log(x);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数 b 和 c 是嵌套在函数 a 中的函数，称它们为嵌套函数。其实本质就是函数体内部的局部变量。</p><p>函数 d 是函数 a 的方法。</p><p>嵌套函数有些类似于 Java 中的非静态内部类，它们都可以访问外部的变量，Java 的内部类本质上是隐式的持有外部类的引用，而 JavaScript 的嵌套函数，其实是由于作用域链的生成规则形成了一个闭包，以此才能嵌套函数内部可以直接访问外部函数的变量。</p><p>闭包涉及到了作用域链，而继承涉及到了原型链，这些概念后面会专门来讲述。</p><p>这里稍微提下，闭包通俗点理解也就是函数将其外部的词法作用域包起来，以便函数内部能够访问外部的相关变量。</p><p>通常有大括号出现都会有闭包，所以函数都会对应着一个闭包。</p><h3 id="高级应用场景" tabindex="-1"><a class="header-anchor" href="#高级应用场景" aria-hidden="true">#</a> 高级应用场景</h3><p>利用函数的特性、闭包特性、继承等，能够将函数应用到各种场景。</p><h4 id="使用函数作为临时命名空间" tabindex="-1"><a class="header-anchor" href="#使用函数作为临时命名空间" aria-hidden="true">#</a> 使用函数作为临时命名空间</h4><p>JavaScript 中的变量作用域大概就两种：全局作用域和函数内作用域，函数内定义的变量只能内部访问，外部无法访问。函数外定义的变量，任何地方均能访问。</p><p>基于这点，为了保护全局命名空间不被污染，常常利用函数来实现一个临时的命名空间，两种写法：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a;
(function () {
    var a = 1;
    console.log(a);  //输出1
})();
console.log(a);  //输出undefined
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>简单说就是定义一个函数，定义的同时末尾加上 () 顺便调用执行函数体内容，那么这个函数的作用其实也就是创建一个临时的命名空间，在函数体内部定义的变量不用担心与其他人起冲突。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>(function () {
   //...
}());
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>外层括号不能漏掉，末尾函数调用的括号也不能漏掉，这样就可以了，至于末尾的括号是放在外层括号内，还是外都可以。</p><h4 id="使用函数封装内部信息" tabindex="-1"><a class="header-anchor" href="#使用函数封装内部信息" aria-hidden="true">#</a> 使用函数封装内部信息</h4><p>闭包的特性，让 JavaScript 虽然没有类似 Java 的权限控制机制，但也能近似的模拟实现。</p><p>因为函数内的变量外部访问不到，而函数又有闭包的特性，嵌套函数可以包裹外部函数的局部变量，那么外部函数的这些局部变量，只有在嵌套函数内可以访问，这样就可以实现对外隐藏内部一些实现细节。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = function () {
    var b = 1;
    return {
        getB: function () {
            return b;
        }
    }
}
console.log(c.b); //输出 undefined
var c = a();   //输出 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,173);function g(f,x){const a=r("ExternalLinkIcon");return s(),l("div",null,[u,t,e("ul",null,[p,e("li",null,[e("a",o,[n("MDN web docs"),i(a)])]),e("li",null,[e("a",m,[n("Github:smyhvae/web"),i(a)])]),e("li",null,[e("a",b,[n("Github:goddyZhao/Translation/JavaScript"),i(a)])])]),h])}const y=d(v,[["render",g],["__file","前端入门12-JavaScript语法之函数.html.vue"]]);export{y as default};
