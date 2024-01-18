import{_ as d,r,o as l,c as t,a as e,b as i,e as n,d as s}from"./app-dV2aVdq6.js";const c={},v=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),i(" 声明")],-1),p=e("p",null,"本篇内容摘抄自以下来源：",-1),u={href:"https://www.tslang.cn/docs/handbook/namespaces.html",target:"_blank",rel:"noopener noreferrer"},o=s(`<p>只梳理其中部分知识点，更多更详细内容参考官网。</p><h1 id="正文-typescript" tabindex="-1"><a class="header-anchor" href="#正文-typescript" aria-hidden="true">#</a> 正文-TypeScript</h1><p>今天来讲讲有 Java 基础转 JavaScript 的福音：TypeScript</p><h3 id="为什么学习-typescript" tabindex="-1"><a class="header-anchor" href="#为什么学习-typescript" aria-hidden="true">#</a> 为什么学习 TypeScript</h3><p>如果学习 JavaScript 之前已经有了 Java 的基础，那么学习过程中肯定会有很多不习惯的地方，因为 JavaScript 不管是在语法上面、还是编程思想上与 Java 这类语言都有一些差异。</p><p>下面就大概来看几个方面的差异：</p><h4 id="变量声明" tabindex="-1"><a class="header-anchor" href="#变量声明" aria-hidden="true">#</a> 变量声明</h4><p>JavaScript 是弱语言，声明变量时无需指明变量的数据类型，运行期间会自动推断，所以声明方式很简单：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = 1;
var wx = &quot;dasu_Android&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Java 是强类型语言，声明变量时必须明确指出变量数据类型：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>int a = 1;
String wx = &quot;dasu_Android&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>弱类型语言虽然比较灵活，但也很容易出问题，而且需要一些额外的处理工作，比如函数期待接收数组类型的参数，但调用时却传入了字符串类型，此时 js 引擎并不会报错，对于它来说，这是合理的行为，但从程序、从功能角度来看，也许就不会按照预期的执行，所以通常需要在函数内部进行一些额外处理，如果没有额外处理，那么由于这种参数类型导致的问题也很难排查。</p><h4 id="变量作用域" tabindex="-1"><a class="header-anchor" href="#变量作用域" aria-hidden="true">#</a> 变量作用域</h4><p>JavaScript 的变量在 ES5 只有全局作用域和函数内作用域，ES6 新增了块级作用域。</p><p>Java 的变量分：类变量和实例变量，属于类的变量如果是公开权限，那么所有地方都允许访问，属于实例的变量，分成员变量和局部变量，成员变量在实例内部所有地方都可以访问，在实例外部如果是公开权限，可通过对象来访问，局部变量只具有块级作用域。</p><ul><li>变量被覆盖问题</li></ul><p>因为 JavaScript 在 ES5 时并没有块级作用域，有些场景下会导致变量被覆盖的情况，由于这种情况造成的问题也很难排查，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function aaa() {
    var i = -1;
    for (var i = 0; i &lt; 1; i++) {
        for (var i = 1; i &lt; 2; i++) {

        }
        console.log(i);
    }
    console.log(i);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Java 中，两次 i 的输出应该 0, -1，因为三个地方的 i 变量并不是同一个，块级作用域内又生成一个新的局部 i 变量，但在 JavaScript 里，ES5 没有块级作用域，函数内三个 i 都是同一个变量，程序输出的是 2，3。此时就发送变量被覆盖的情况了。</p><ul><li>拼写错误问题</li></ul><p>而且，JavaScript 的全局变量会被作为全局对象的属性存在，而在 JavaScript 里对象的属性是允许动态添加的，这就会导致一个问题：当使用某变量，但拼写错误时，js 引擎并不会报错，对它来说，会认为新增了一个全局对象的属性；但从程序，从功能角度来看，常常就会导致预期外的行为，而这类问题也很难排查，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var main = &quot;type-script&quot;;
function modify(pre) {
    mian = \`\${pre}-script\`;
}
modify(123);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Java 里会找不到 mian 变量报错，但在 JavaScript 里 mian 会被当做全局对象的属性来处理。</p><ul><li>全局变量冲突问题</li></ul><p>而且，JavaScript 的变量允许重复申请，这样一来，全局变量一旦多了，很容易造成变量冲突问题，这类问题即使在运行期间也很难被发现和排查，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//a.js
var a = 1;

//b.js
var a = &quot;js&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在不同文件中，如果全局变量命名一样，会导致变量冲突，但浏览器不会有任何报错行为，因为对它来说，这是正常的行为，但对于程序来说，功能可能就会出现预期外的行为。</p><h4 id="继承" tabindex="-1"><a class="header-anchor" href="#继承" aria-hidden="true">#</a> 继承</h4><p>JavaScript 是基于原型的继承，原型本质上也是对象，所以 JavaScript 中对象是从对象上继承的，同时对象也是由对象创建的，一切都是对象。</p><p>Java 中有 class 机制，对象的抽象模板概念，用于描述对象的属性和行为以及继承结构，而对象是从类实例化创建出来的。</p><p>正是因为 JavaScript 中并没有 class 机制，所以有 Java 基础的可能会比较难理解 JavaScript 中的继承、实例化对象等原理。</p><p>那么在面向对象的编程中，自定义了某个对象，并赋予它一定的属性和行为，这样的描述在 Java 里很容易实现，但在 JavaScript 里却需要通过定义构造函数，对构造函数的 prototype 操作等处理，语义不明确，不怎么好理解，比如定义 Dog 对象：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function Dog() {}
Book.prototype.eat = function () {
    //...
} 
Book.prototype.name = &quot;dog&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于习惯了 Java 的面向对象编程，在 JavaScript 里自定义一个 Dog 对象的写法可能会很不习惯。</p><h4 id="class-机制" tabindex="-1"><a class="header-anchor" href="#class-机制" aria-hidden="true">#</a> Class 机制</h4><p>JavaScript 虽然在 ES6 中加入了 class 写法，但本质上只是语法糖，而且从使用上，仍旧与 Java 的 class 机制有些区别，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>class Animal {
    constructor(theName) {
        this.name = theName;
        this.ll = 23;
    }
    move(distanceInMeters = 0) {
        console.log(\`\${this.name} moved \${distanceInMeters}m.\`);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上是 JavaScript 中 ES6 自定义某个类的用法，与 Java 的写法有如下区别：</p><ul><li>类的属性只能在构造函数内声明和初始化，无法像 Java 一样在构造函数外面先声明成员变量的存在；</li><li>无法定义静态变量或静态方法，即没有 static 语法；</li></ul><h4 id="权限控制" tabindex="-1"><a class="header-anchor" href="#权限控制" aria-hidden="true">#</a> 权限控制</h4><p>JavaScript 里没有 public 这些权限修饰符，对于对象的属性，只能通过控制它的可配置性、可写性、可枚举性来达到一些限制效果，对于对象，可通过控制对象的可扩展性来限制。</p><p>Java 里有 package 权限、publick 权限、protection 权限、private 权限之分，权限修饰符可修饰类、变量、方法，不同权限修饰符可以让被修饰的具有不一样的权限限制。</p><p>在 JavaScript 如果要实现对外部隐藏内部实现细节，大多时候，只能利用闭包来实现。</p><h4 id="抽象类" tabindex="-1"><a class="header-anchor" href="#抽象类" aria-hidden="true">#</a> 抽象类</h4><p>JavaScript 虽然在 ES6 中引入了 class 的写法，但本质上只是语法糖，并没有类似 Java 中抽象类、抽象方法的机制存在，即使要模拟，也只能是定义一些抛异常的方法来模拟抽象方法，子类不实现的话，那么在运行期间就会抛异常，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//不允许使用该构造函数创建对象，来模拟抽象类
function AbstractClass() {
    throw new Error(&quot;u can&#39;t instantiate abstract class&quot;);
}
//没有实现的抽象方法，通过抛异常来模拟
function abstractMethod() {
    throw new Error(&quot;abstract method,u should implement it&quot;);
}
//定义抽象方法，子类继承之后，如果不自己实现，直接使用会抛异常
AbstractClass.prototype.onMearsure = abstractMethod;
AbstractClass.prototype.onLayout = abstractMethod;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://upload-images.jianshu.io/upload_images/1924341-42778af044285005.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>相比于 Java 的抽象类的机制，在编译期间就可以报错的行为，JavaScript 的运行期抛异常行为效果可能没法强制让所有开发者都能正确实现抽象方法。</p><h4 id="对象标识" tabindex="-1"><a class="header-anchor" href="#对象标识" aria-hidden="true">#</a> 对象标识</h4><p>JavaScript 由于没有 class 机制，又是基于原型的继承，运行期间原型还可动态变化，导致了在 JavaScript 里没有一种完美的方式可以用来获取对象的标识，以达到区分不同对象的目的。</p><p>Java 中的对象都是从类实例化创建出来的，因此通过 instanceof 即可判断不同对象所属类别是否一致。</p><p>在 JavaScript 中，只能根据不同使用场景，选择 typeof，instanceof，isPrototypeOf()，对象的类属性，对象的构造函数名等方式来区别不同对象所属类别。</p><h4 id="鸭式辩型" tabindex="-1"><a class="header-anchor" href="#鸭式辩型" aria-hidden="true">#</a> 鸭式辩型</h4><p>正是由于 JavaScript 里没有 class 机制，没有哪种方式可以完美适用所有需要区分对象的场景，因此在 JavaScript 中有一种编程理念：鸭式辩型（只要会游泳且嘎嘎叫的鸟，也可以认为它是鸭子）</p><p>意思就是说，编程中不要从判断对象是否是预期的类别角度出发，而是从判断对象是否具有预期的属性角度出发。</p><h4 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h4><p>所以，对于如果有 Java 基础的，JavaScript 学习过程可能会有些不习惯，那么如果是 TypeScript 的话，可以说是个福利，因为 TypeScript 很多语法和编程思想上都跟 Java 很类似，很容易就理解。</p><p>那么，来认识下，TypeScript 是什么？</p><p>TypeScript 是 JavaScript 的超集，超集是什么意思，就是说，JavaScript 程序可以不加修改就运行在 TypeScript 的环境中，TypeScript 在语法上是基于 JavaScript 进行扩展的。</p><p>那么，TypeScript 在 JavaScript 语法基础上做了哪些扩展呢？其实就是加入了各种约束性的语法，比如加入了类似强类型语言的语法。</p><p>比如说，声明变量时，需要指定变量的数据类型的约束，以此来减少类型错误导致的问题。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let wx:string = &quot;dasu_Android&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其实，本质上是因为 JavaScript 是解释型语言，因为没有编译阶段，很多问题只能是运行期才可能被发现，而运行期暴露的问题也不一定可以很好的排查出来。</p><p>而 TypeScript 语法编写的 ts 文件代码，浏览器并不认识，所以需要经过一个编译阶段，编译成 js 文件，那么 TypeScript 就提供了一个编译过程，加上它语法上的支持，在编译期间编译器就可以帮助开发者找出一些可能出错的地方。</p><p>举个例子：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>var main = &quot;type-script&quot;;
function modify(pre) {
    mian = \`\${pre}-script\`;
}
modify(123);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个例子中，定义了一个全局变量和一个函数，函数本意是接收一个字符串类型的值，然后修改这个全局变量的值，但开发者可能由于粗心，将全局变量的变量名拼写错误了，而且调用方法时并没有传入字符串类型，而是数字类型。</p><p>如果是在 JavaScript 中，这段代码运行期间并不会报错，也不会导致程序异常，js 解释器会认为它是合理的，它会认为这个函数是用来增加全局对象的 mian 属性，同时函数参数它也不知道开发者希望使用的是什么类型，它所有类型都接受。</p><p>由于程序并没有出现异常，即使运行期间，开发者也很难发现这个拼写错误的问题，相反，程序由于拼写错误而没有执行预期的功能时，反而会让开发者花费很多时间来排查原因。</p><p>但这段代码如果是用 TypeScript 来写：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-9a9bc88bd777164f.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>这些基础的语法错误，编译器甚至不用进入编译阶段，在开发者刚写完这些代码就能给出错误提示。而且，一些潜在的可能造成错误的代码，在编译阶段也会给出错误提示。</p><p>虽然 TypeScript 语法上支持了很多类似于 Java 语言的特性，比如强类型约束等，但 JavaScript 本质上并不支持，可以看看上面那段代码最后编译成的 js 代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var main = &quot;type-script&quot;;
function modify(pre) {
    mian = \`\${pre}-script\`;
}
modify(123);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发现没有，编译后的代码其实也就是上述举例的 js 代码段，也就是说，你用 JavaScript 写和用 TypeScript 写，最后的代码都是一样的，区别在于，TypeScript 它有一个编译阶段，借助编译器可以在编译期就能发现可能的语法错误，不用等到运行期。</p><h3 id="webstrom-配置" tabindex="-1"><a class="header-anchor" href="#webstrom-配置" aria-hidden="true">#</a> WebStrom 配置</h3><p>将 TypeScript 编写的 ts 文件编译成 js 文件有两种途径，一是借助命令，二是借助开发工具。</p><p>如果电脑已经有安装了 node.js 环境，那么可以直接执行下述命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install -g typescript
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后打开终端，在命令行执行:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>tsc xxx.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>tsc 命令就可以将 ts 文件编译输出 js 文件了。</p><p>我选择的开发工具是 WebStrom，这个开发工具本身就是支持 TypeScript 的了，如果你有尝试过查看 ES5、ES6 相关 api，你可能会发现：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-e0157b3b4820a9dc.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>.d.ts 文件就是用 TypeScript 编写的，所以如果你熟悉 TypeScript 的语法，这些代码就能很清楚了，.d.ts 是一份声明文件，作用类似于 C++ 中的 .h 文件。</p><p>在 WebStrom 中右键 -&gt; 新建文件中，可以选择创建 TypeScript 的文件，可以设置 FileWatcher 来自动编译，也可以将项目初始化成 node.js 项目，利用 package.json 里的 scripts 脚本命令来手动触发编译。</p>`,86),m={href:"https://www.cnblogs.com/dasusu/p/10105433.html",target:"_blank",rel:"noopener noreferrer"},b=e("p",null,"而编译器在编译过程，类似于 Android 里的 Gradle，可以设置很多配置项，进行不同的编译，而 TypeScript 编译过程对应的配置文件是 tsconfig.json",-1),g=e("h3",{id:"tsconfig-json",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#tsconfig-json","aria-hidden":"true"},"#"),i(" tsconfig.json")],-1),h={href:"https://www.tslang.cn/docs/handbook/tsconfig-json.html",target:"_blank",rel:"noopener noreferrer"},y=s(`<ul><li>不带任何输入文件的情况下调用 tsc，编译器会从当前目录开始去查找 tsconfig.json 文件，逐级向上搜索父目录。</li><li>不带任何输入文件的情况下调用 tsc，且使用命令行参数 --project（或 -p）指定一个包含 tsconfig.json 文件的目录。</li><li>当命令行上指定了输入文件时，tsconfig.json 文件会被忽略。</li></ul><p>示例：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{
  &quot;compilerOptions&quot;: {
    &quot;module&quot;: &quot;commonjs&quot;,     //编译输出的 js 以哪种模块规范实现，有 commonjs,amd,umd,es2015等等
    &quot;target&quot;: &quot;es5&quot;,          //编译输出的 js 以哪种 js 标准实现，有 es3,es5,es6,es2015,es2016,es2017,es2018等
    &quot;sourceMap&quot;: false,       //编译时是否生成对应的 source map 文件
    &quot;removeComments&quot;: false,  //编译输出的 js 文件删掉注释
    &quot;outDir&quot;: &quot;./js/dist&quot;     //编译输出的 js 路径
  },
  &quot;exclude&quot;: [               //编译时排除哪些文件
    &quot;node_modules&quot;
  ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="语法" tabindex="-1"><a class="header-anchor" href="#语法" aria-hidden="true">#</a> 语法</h3><p>最后来看看一些基础语法，你会发现，如果你有 Java 基础，这些是多么的熟悉，用 TypeScript 来编写 js 代码是多么的轻松。</p><h4 id="数据类型" tabindex="-1"><a class="header-anchor" href="#数据类型" aria-hidden="true">#</a> 数据类型</h4><p>ES6 中的数据类型是：number，string，boolean，symbol，null，undefined，object</p><p>TypeScript 在此基础上，额外增加了：any，void，enum，never</p><ul><li>any：表示当前这个变量可以被赋予任何数据类型使用；</li><li>void：表示当前这个变量只能被赋予 null 或 undefined，通常用于函数的返回值声明；</li><li>enum：枚举类型，弥补 JavaScript 中无枚举的数据类型；</li><li>never：表示永不存在的值，常用于死循环函数，抛异常函数等的返回值声明，因为这些函数永远也不会有一个返回值。</li></ul><p>TypeScript 中的数据类型是用于类型声明服务的，类似于 Java 中定义变量或声明方法的返回值时必须指定一个类型。</p><h4 id="类型声明" tabindex="-1"><a class="header-anchor" href="#类型声明" aria-hidden="true">#</a> 类型声明</h4><p>ES5 中声明变量是通过 var，而 ES6 中引入块级作用域后新增了 let 和 const 的声明方式，TypeScript 建议声明变量时，都使用 let，因为 var 会很容易造成很多问题，不管是全局变量还是函数作用域的局部变量。</p><p>先来看看原始类型的声明：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let num:number = 1;      //声明number类型变量
let str:string = &quot;ts&quot;;   //声明string类型变量
let is:boolean = true;   //声明boolean类型变量
function f(name: string, age: number):void {  //函数参数类型和返回值类型的声明
    //...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>声明一个变量时，就可以在变量名后面跟 <code>:</code> 冒号来声明变量的数据类型，如果赋值给变量声明的数据类型之外的类型，编译器会有错误提示；函数的返回值的类型声明方式类似。</p><p>如果某个变量的取值可以是任意类型的，那么可以声明为 any：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let variable:any = 1;    //声明可为任意类型的变量
variable = true;//此时赋值其他类型都不会报错
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果某个变量取值只能是某几个类型之间，可以用 <code>|</code> 声明允许的多个类型：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let numStr:number|string = 1;   //声明可为string或number类型变量
numStr = &quot;str&quot;;
numStr = true;// 报错
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果变量是个数组：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let numArr:number[] = [1, 2]; //声明纯数字数组，如果某个元素不是数字类型，会报错
let anyArr:any[] = [1, &quot;tr&quot;, true];  //数组元素类型不限制
let numStrArr:(number|string)[] = [1, &quot;tr&quot;, 2, 4];  // 数组元素类型限制在只能是 number 和 string
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果变量是个对象：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let obj:object = {};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>但这通常没有什么意义，因为函数，数组，自定义对象都属于 object，所以可以更具体点，比如声明变量是个函数：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let fun:(a:number)=&gt;string = function (a:number):string {    //声明函数类型的变量
    return &quot;&quot;;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>声明 fun 变量是一个函数类型时，还需要将函数的结构声明出来，也就是函数参数，参数类型，返回值类型，通过 ES6 的箭头函数语法来声明。</p><p>但赋值的时候，赋值的函数参数类型，返回值类型可以不显示声明，因为编译器可以根据函数体来自动推断，比如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let fun:(a:number)=&gt;string = function (a) {
    return &quot;&quot;;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果变量是某个自定义的对象：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>class Dog {
    name:string;
    age:number = 0;
}

let dog:Dog = new Dog();  //声明自定义对象类型的变量
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定义类的语法后面介绍，在 JavaScript 里，鸭式辩型的编程理念比较适用，也就说，判断某个对象是否归属于某个类时，并不是看这个对象是否是从这个类创建出来的，而是看这个对象是否具有类的特征，即类中声明的属性，对象是否拥有，有，则认为这个对象是属于这个类的。如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let dog:Dog = {name:&quot;dog&quot;, age:123};  //可以赋值成功，因为对象直接量具有 Dog 类中的属性

let dog1:Dog = {name:&quot;dog&quot;, age:1, sex:&quot;male&quot;}; //错误，多了个 sex
let dog2:Dog = {name:&quot;dog&quot;}; //错误，少了个 age
let dog3:Dog = {name:&quot;dog&quot;, age:&quot;12&quot;}; //错误，age 类型不一样
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上例子中：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let dog1:Dog = {name:&quot;dog&quot;, age:1, sex:&quot;male&quot;};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>从鸭式辩型角度来说，这个应该是要可以赋值成功的，因为目标对象拥有类指定的特征行为了，TypeScript 觉得额外多出的属性可能会造成问题，所以会给一个错误提示。</p><p>针对这种因为额外多出的属性检查而报错的情况，如果想要绕开这个限制，有几种方法：</p><ul><li>类型断言</li></ul><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let dog1:Dog = &lt;Dog&gt;{name:&quot;dog&quot;, age:1, sex:&quot;male&quot;};
let dog1:Dog = {name:&quot;dog&quot;, age:1, sex:&quot;male&quot;} as Dog;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>类型断言就是类似 Java 里的强制类型转换概念，通过 <code>&lt;&gt;</code> 尖括号或者 <code>as</code> 关键字，可以告诉编译器这个值的数据类型。</p><p>类型断言常用于开发者明确知道某个变量的数据类型的情况下。</p><ul><li>用变量做中转赋值</li></ul><p>如果赋值语句右侧是一个变量，而不是对象直接量的话，那么只会检查变量是否拥有赋值语句左侧所声明的类型的特征，而不会去检查变量额外多出来的属性，如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let o = {name:&quot;dog&quot;, age:1, sex:&quot;male&quot;}; 
let dog1:Dog = o;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>剩余属性</li></ul><p>这种方式是最佳的方式，官网中对它的描述是字符串索引签名，但我觉得这个描述很难理解，而且看它实现的方式，有些类似于 ES6 中的函数的剩余参数的处理，所以我干脆自己给它描述成剩余属性的说法了。</p><p>方式是这样的，在类中定义一个用于存储其他没有声明的属性数组：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>class Dog {
    name:string;
    age:number = 0;
    [propName:string]:any;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后一行 <code>[propName:string]:any</code> 就表示：具有 Dog 特征的对象除了需要包含 name 和 age 属性外，还可以拥有其他任何类型的属性。所以：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let dog1:Dog = {name:&quot;dog&quot;, age:1, sex:&quot;male&quot;, s:true};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这样就是被允许的了。</p><p>当然，这三种可以绕开多余属性的检查手段，应该适场景而使用，不能滥用，因为，大部分情况下，当 TypeScript 检查出你赋值的对象多了某个额外属性时，程序会因此而出问题的概念是比较大的。</p><p>鸭式辩型在 TypeScript 里更常用的是利用接口来实现，后续介绍。</p><h4 id="接口" tabindex="-1"><a class="header-anchor" href="#接口" aria-hidden="true">#</a> 接口</h4><p>鸭式辩型其实严格点来讲就是对具有结构的值进行类型检查，而具有结构的值也就是对象了，所以对对象的类型检查，其实也就是在对对象进行类别划分。</p><p>既然是类别划分，那么不同类别当然需要有个标识来相互区分，在 TypeScript 里，接口的作用之一也就是这个，作为不同对象类别划分的依据。</p><p>比如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>interface Dog {
    name:string;
    age:number;
    eat():any;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述就是定义了，对象如果拥有 name, age 属性和 eat 行为，那么就可以将这个对象归类为 Dog，即使创建这个对象并没有从实现了 Dog 接口的类上实例化，如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let dog:Dog = {
    name: &quot;小黑&quot;,
    age:1,
    eat: function () {
        //...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码声明了一个 Dog 类型的变量，那么什么对象才算是 Dog 类型，只要拥有 Dog 中声明的属性和行为就认为这个对象是 Dog，这就是鸭式辩型。（属性和行为是 Java 里面向对象常说的概念，属性对应变量，行为对应方法，在 JavaScript 里变量和方法都属于对象的属性，但既然 TypeScript 也有类似 Java 的接口和类语法，所以这里我习惯以 Java 那边的说法来描述了，反正能理解就行）</p><p>当然，也可以通过定义一个 Dog 类来作为变量的类型声明，但接口相比于类的好处在于，接口里只能有定义，一个接口里具有哪些属性和行为一目了然，而类中常常携带各种逻辑。</p><p>既然接口作用之一是用来定义对象的类别特征，那么，它还有很多其他的用法，比如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>interface Dog {
    name:string;
    age:number;
    eat:()=&gt;any;

    master?:string;  //狗的主人属性，可有可无
    readonly variety:string; //狗的品种，一生下来就固定了
}

let dog1:Dog = {name:&quot;dog1&quot;, age:1, eat:()=&gt;&quot;&quot;, variety:&quot;柯基&quot;};
dog1.age = 2;
dog1.variety = &quot;中华犬&quot;;//报错，variety声明时就被固定了，无法更改

let dog2:Dog = {name:&quot;dog2&quot;, age:1, eat:()=&gt;&quot;&quot;, master: &quot;me&quot;,variety:&quot;柯基&quot;};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在接口里声明属性时，可用 <code>?</code> 问号表示该属性可有也可没有，可用 readonly 来表示该属性为只读属性，那么在定义时初始化后就不能再被赋值。</p><p><code>?</code> 问号用来声明该项可有可无不仅可以用于在定义接口的属性时使用，还可以用于声明函数参数时使用。</p><p>在类型声明一节中说过，声明一个变量的类型时，也可以声明为函数类型，而函数本质上也是对象，所以，如果有需求是需要区分多个不同的函数是否属于同一个类别的函数时，也可以用接口来实现，如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>interface Func {
    (name:string):boolean;
}

let func:Func = function (name) {
    return true;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种使用接口的方式称为声明函数类型的接口，可以简单的理解为，为 Func 类型的变量定义了 <code>()</code> 运算符，需传入指定类型参数和返回指定类型的值。</p><p>如果想让某个类型既可以当做函数被调用，又可以作为对象，拥有某些属性行为，那么可以结合上述声明函数类型的接口方式和正常的接口定义属性行为方式一起使用。</p><p>当对象或函数作为函数参数时，通过接口来定义这些参数的类型，就特别有用，这样可以控制函数调用时传入了预期类型的数据，如果类型不一致时，编译阶段就会报错。</p><p>当然，接口除了用来在鸭式辩型中作为值类型的区分外，也可以像 Java 里的接口一样，定义一些行为规范，强制实现该接口的类的行为，如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>interface Dog {
    name:string;
    age:number;
    eat:()=&gt;any;

    master?:string;  //狗的主人属性，可有可无
    readonly variety:string; //狗的品种，一生下来就固定了
}
class ChinaDog implements Dog{
    age: number = 0;
    eat: () =&gt; any;
    master: string;
    name: string;
    readonly variety: string = &quot;中华犬&quot;;

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ChinaDog 实现了 Dog 接口，那么就必须实现该接口所定义的属性行为，所以，ChinaDog 创建的对象明显就属于 Dog：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>let dog3:Dog = new ChinaDog();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>除了这些基本用法外，TypeScript 的接口还有其他很多用法，比如，定义构造函数：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>interface Dog {
    new (name:string): Dog;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再比如接口的继承：接口可继承自接口，也可继承自类，继承的时候，可同时继承多个等。</p><p>更多高级用法，等有具体的使用场景，碰到的时候再深入去学习，先了解到这程度吧。</p><h4 id="class-语法" tabindex="-1"><a class="header-anchor" href="#class-语法" aria-hidden="true">#</a> Class 语法</h4><p>习惯 Java 代码后，首次接触 ES5 多多少少会很不适应，因为 ES5 中都是基于原型的继承，没有 class 概念，自定义个对象都是写构造函数，写 prototype。</p><p>后来 ES6 中新增了 class 语法糖，可以类似 Java 一样通过 class 自定义对象，但还是有很多区别，比如，ES6 中的 class 语法糖，就无法声明成员变量，成员变量只能在构造函数内定义和初始化；而且，也没有权限控制、也没有抽象方法机制、也不能定义静态变量等等。</p><p>然而，这一切问题，在 TypeScript 中都得到了解决，TypeScript 的 class 语法基本跟 Java 一样，有 Java 基础的，学习 TypeScript 的 class 语法会很轻松。</p><p>看个例子：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>abstract class Animal {  //定义抽象类
    age:number;
    protected abstract eat():void;  //抽象方法，权限修饰符
}

class Dog extends Animal{   //类的继承
    public static readonly TAG:string = &quot;Dog&quot;;  //定义静态常量
    public name:string;
    private isDog:boolean = true;   //定义私有变量

    constructor(name:string) {
        super();
        this.name = name;
        this.age = 0;
    }

    protected eat:()=&gt;any = function () {
        this.isDog;
    }

    get age():number {  //将 age 定义为存取器属性
        return this.age;
    }

    set age(age:number) {  //将 age 定义为存取器属性
        if (age &gt; 0) {
            this.age = age;
        } else {
            age = 0;
        }
    }
}

let dog:Dog = new Dog(&quot;小黑&quot;);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大概有几个地方跟 Java 有些许小差别：</p><ul><li>变量类型的声明</li><li>构造函数不是用类名表示，而是使用 constructor</li><li>如果有继承关系，则构造函数中必须要调用super</li><li>不手动使用权限修饰符，默认是 public 权限</li></ul><p>其余方面，不管是权限的控制、继承的写法、成员变量的定义或初始化、抽象类的定义、基本上都跟 Java 的语法差不多。</p><p>所以说 TypeScript 的 class 语法比 ES6 的 class 语法糖要更强大。</p><p>还有很多细节的方面，比如在构造函数的参数前面加上权限修饰符，此时这个参数就会被当做成员变量来处理，可以节省掉赋值的操作；</p><p>比如在 TypeScript 里，类还可以当做接口来使用。更多用法后续有深入再慢慢记录。</p><h4 id="泛型" tabindex="-1"><a class="header-anchor" href="#泛型" aria-hidden="true">#</a> 泛型</h4><p>Java 里在操作实体数据时，经常会需要用到泛型，但 JavaScript 本身并不支持泛型，不过 TypeScript 支持，比如：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>interface Adapter&lt;T&gt; {
    data:T;
}

class StringAdapter implements Adapter&lt;string&gt;{
    data: string;
}

function f1&lt;Y extends Animal&gt;(arg:Y):Y {
    return;
}

f1(new Dog(&quot;小黑&quot;));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Dog 和 Animal 使用的是上个小节中的代码。</p><p>用法基本跟 Java 类似，函数泛型、类泛型、泛型约束等。</p><h4 id="模块" tabindex="-1"><a class="header-anchor" href="#模块" aria-hidden="true">#</a> 模块</h4><p>JavaScript 跟 Java 很不一样的一点就是，Java 有 class 机制，不同文件都需要有一个 public class，每个文件只是用于描述一个类的属性和行为，类中的变量不会影响其他文件内的变量，即使有同名类，只要类文件路径不一致即可。</p><p>但 JavaScript 所有的 js 文件都是运行在全局空间内，因此如果不在函数内定义的变量都属于全局变量，即使分散在多份不同文件内，这就很容易造成变量冲突。</p><p>所以也才有那么多模块化规范的技术。</p><p>虽然 TypeScript 的 class 语法很类似于 Java，但 TypeScript 最终仍旧是要转换成 JavaScript 语言的，因此即使用 TypeScript 来写 class，只要有出现同名类，那么即使在不同文件内，仍旧会造成变量冲突。</p><p>解决这个问题的话，TypeScript 也支持了模块化的语法。</p><p>而且，TypeScript 模块化语法有一个好处是，你只需掌握 TypeScript 的模块化语法即可，编译阶段可以根据配置转换成 commonJs, amd, cmd, es6 等不同模块化规范的实现。</p><p>TypeScript 的语法跟 ES6 中的模块语法很类似，只要 ts 文件内出现 import 或 export，该文件就会被当做模块文件来处理，即整个文件内的代码都运行在模块作用域内，而不是全局空间内。</p><ul><li>使用 export 暴露当前模块对外接口</li></ul><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>//module.ts
export interface StringValidator {
    isAcceptable(s: string): boolean;
}

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 &amp;&amp; numberRegexp.test(s);
    }
}

class AarCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        //...
    }
}
export { AarCodeValidator };
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>export 的语法基本跟 ES6 中 export 的用法一样。</p><p>如果其他模块需要使用该模块的相关接口：</p><ul><li>使用 import 依赖其他模块的接口</li></ul><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>import { ZipCodeValidator } from &quot;./module&quot;;

let myValidator = new ZipCodeValidator();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果想描述非 TypeScript 编写的类库的类型，我们需要声明类库所暴露出的API。通常需要编写 .d.ts 声明文件，类似于 C++ 中的 .h 文件。</p><p>.d.ts 声明文件的编写，以及引用时需要用到三斜杠指令：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>/// &lt;reference path=&quot;./m2.d.ts&quot;/&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这部分内容我还没理解清楚，后续碰到实际使用掌握后再来说说。</p><h4 id="命名空间" tabindex="-1"><a class="header-anchor" href="#命名空间" aria-hidden="true">#</a> 命名空间</h4><p>命名空间与模块的区别在于，模块会涉及到 import 或 export，而命名空间纯粹就是当前 ts 文件内的代码不想运行在全局命名空间内，所以可以通过 命名空间的语法，让其运行在指定的命名空间内，防止污染全局变量。</p><p>语法：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>namespace Validation {
    //...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="其他" tabindex="-1"><a class="header-anchor" href="#其他" aria-hidden="true">#</a> 其他</h4><p>本篇只讲了 TypeScript 的一些基础语法，还有其他更多知识点，比如引入三方不是用 TypeScript 写的库时需要编写的 .d.ts 声明文件，比如编译配置文件的各种配置项，比如枚举，更多更多的内容，请参考开头声明部分给出的 TypeScript 中文网连接。</p>`,119);function S(q,x){const a=r("ExternalLinkIcon");return l(),t("div",null,[v,p,e("ul",null,[e("li",null,[e("a",u,[i("TypeScript 中文网"),n(a)])])]),o,e("p",null,[i("我选择的是后者，如果你对 package.json 或 FileWatcher 配置不熟悉，可以参考之前"),e("a",m,[i("模块化那篇最后对这些配置的介绍"),n(a)]),i("。")]),b,g,e("p",null,[e("a",h,[i("TypeScript 中文网"),n(a)]),i(" 里对于这份配置文件的描述很清楚了，这里摘抄部分内容：")]),y])}const J=d(c,[["render",S],["__file","前端入门26-学学TypeScript.html.vue"]]);export{J as default};
