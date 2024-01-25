import{_ as r,r as s,o as t,c as d,a as e,b as a,e as n,d as p}from"./app-PjuKeMiB.js";const l={},o=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),a(" 声明")],-1),c=e("p",null,"本系列文章内容全部梳理自以下几个来源：",-1),v=e("li",null,"《JavaScript权威指南》",-1),u={href:"https://developer.mozilla.org/zh-CN/docs/Web",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/smyhvae/Web",target:"_blank",rel:"noopener noreferrer"},b={href:"https://github.com/goddyZhao/Translation/tree/master/JavaScript",target:"_blank",rel:"noopener noreferrer"},g=p(`<p>作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。</p><p>PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。</p><h1 id="正文-继承" tabindex="-1"><a class="header-anchor" href="#正文-继承" aria-hidden="true">#</a> 正文-继承</h1><p>继承是面向对象编程语言中一大特性，Java 中的继承是静态的，通过在编写 class 代码过程中指定，一旦继承关系确定了，就无法在运行期间去修改了。</p><p>子类默认继承父类的所有非私有的属性和方法。</p><p>但在 JavaScript 中，由于并不存在类的机制，而且它是动态的基于原型的继承，所以在很多方面与 Java 的继承并不一样。</p><p>下面从多个方面来进行比较：</p><h3 id="用法" tabindex="-1"><a class="header-anchor" href="#用法" aria-hidden="true">#</a> 用法</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//Java
class MyTask extends Thread {}

//JavaScript
var a = Object.create({b:1});//Object.create方式指定继承的对象
function A() {}
A.prototype.b = 2;  //构造函数的prototype方式指定继承的对象
var a = new A();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Java 中只能通过 extends 关键字声明继承的关系。</p><p>在 JavaScript 中有两种方式指定继承的原型对象，一种用 Object.create()，一种通过构造函数的 prototype 属性。</p><p>当在声明一个自定义的构造函数时，内部会自动创建一个空的对象（new Object()），然后赋值给构造函数的 prototype 属性，之后通过该构造函数创建的对象，就都默认继承自 prototype 指向的空对象，所以可在这个空对象上直接动态的添加属性，以便让创建的对象都可以继承这些属性。</p><h3 id="继承的内容" tabindex="-1"><a class="header-anchor" href="#继承的内容" aria-hidden="true">#</a> 继承的内容</h3><ul><li>Java</li></ul><p>在 Java 中，存在：类，实例对象两种概念。</p><p>因此，也就有了类属性、类方法、对象属性、对象方法的说法，这些的区别在于是否有 static 关键字声明。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>public class Animal {
    public int age; //对象属性
    public void eat(){}//对象方法
    public static void dead(){}//类方法
}
public class Dog extends Animal {
    public void growUp(){
	eat();//子类可直接使用父类的非私有方法
        dead();//包括类方法
    }
}

//使用
Dog dog = new Dog();
dog.age = 15; //对象属性和方法需通过实例对象才可进行操作
dog.eat();
dog.dead();//类属性和类方法不实例化对象也可使用，通过对象也可使用
Dog.dead();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对象属性和对象方法必须经过类的实例化操作，创建出一个对象来时，才可以通过对象操作这些属性和方法。</p><p>而类属性和类方法在子类中可以直接使用，子类实例化的对象也可直接调用。</p><ul><li>JavaScript</li></ul><p>在 JavaScript 中只有对象的概念，被继承的对象称为原型。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function Animal() {}
Animal.prototype.age = 0; //为原型添加属性
Animal.prototype.eat = function () {console.log(&quot;eat&quot;)}

function Dog() {}
//Dog构造函数的prototype继承自Animal.prototype
Dog.prototype = Object.create(Animal.prototype); 
Dog.prototype.constructor = Dog; //由于手动修改了原型链，破坏了默认的三者关联，手动修补
Dog.prototype.growUp = function () {console.log(&quot;growUp&quot;)}

//dog 对象的原型链：dog -&gt; Dog.prototype -&gt; Animal.prototype -&gt; Object.prototype -&gt; null
var dog = new Dog();
dog.age;
dog.eat();
dog.growUp();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>先定义个 Animal 构造函数，然后注意，JavaScript 是基于原型继承的，此时如果要定义一些可继承的属性，需要在 Animal.prototype 对象上添加，不可在构造函数本身上添加。</p><p>然后再定义一个 Dog 构造函数，让它继承自 Animal.prototype，注意，因为在这里手动修改了原型链，所以最好手动补上 Dog.prototype.constructor = Dog 这行代码，让构造函数、实例对象、原型三者间仍旧可以保持默认的关联关系。</p><p>最后，通过构造函数 Dog 创建的对象，就可使用继承而来的属性。</p><p>还有另一种写法：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function Animal() {
    this.age = 0;
    this.eat = function () {console.log(&quot;eat&quot;)}
}
function Dog() {}
Dog.prototype = Object.create(new Animal());
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以直接在构造函数 Animal 中添加相关属性，但涉及要继承时，需要使用 new Animal() 作为原型参数，如果直接使用 Animal，那么将会误认将函数对象本身作为原型。</p><p>不过这种方式，需要注意，当涉及多个对象需要继承自同一个原型时，原型对象的实例应该只有一个，这样才能保证对原型对象动态修改的属性能同步到所有继承的子对象上。</p><h3 id="权限控制" tabindex="-1"><a class="header-anchor" href="#权限控制" aria-hidden="true">#</a> 权限控制</h3><p>Java 中有权限修饰符，子类可以使用父类中非私有的属性和方法。</p><p>但在 JavaScript 中，没有公有、私有权限之说，所有定义在原型中的属性，子对象中都可以使用。但可以利用对象属性的特性，在原型中控制它的属性的可枚举性、可配置性、可写性，以此来达到控制子对象访问原型属性的一些限制。</p><p>修改对象属性的特性用：Object.defineProperty()</p><p>同理，对象本身也有一些特性可利用，比如 Object.freeze()，Object.seal() 这类方法可以限制对原型对象进行扩展等操作。</p><h3 id="动态同步" tabindex="-1"><a class="header-anchor" href="#动态同步" aria-hidden="true">#</a> 动态同步</h3><p>Java 中，每个从类实例化出来的对象之间都是相互独立的，不会相互影响，而类属性，类方法只是它们可以用来共享、通信的渠道而已。</p><p>而且，类机制是静态的，在Java中，并不会存在在运行期，修改类相关属性而影响子类的场景。</p><p>但在 JavaScript 中，由于继承的两者都是对象，而 JavaScript 的对象又具有运行期动态添加属性等特性，所以，如果修改原型上的属性，是会同步到继承该原型的子对象上的。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function A() {}
A.prototype.num = 1;
var a = new A();
var b = new A();
a.num;  //输出1
b.num;  //输出1，因为都是继承的 A.prototype
A.prototype.num = 5;
a.num;   //输出5，原型的属性动态的变化可同步到子对象上
b.__proto__.num = 0;
a.num;   //输出0，因为可通过b对象获取原型对象，对原型的操作会同步到子对象上
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上代码，首先定义了一个构造函数A，通过它创建了两个新的子对象a,b，这两个子对象都继承自A.prototype，所以当访问 a.num 时会输出 1。</p><p>然后动态修改 A.prototype 对象的 num 属性，将其改成5，这时会发现，子对象 a 和 b 访问 num 时都输出 5 了，也就是说对原型对象的动态修改属性可同步到它的子对象上。</p><p>而子对象又可以通过 _<em>proto</em>_ 属性或者符合默认关系下 constructor.prototype 来获取原型对象，之后对原型对象的操作也可影响到所有继承该原型的子对象。</p><p>这点就是 JavaScript 与 Java 这种有类机制语言的很大不同之处。</p><p>另外，对原型对象的修改之所以可以同步到子对象上，其实是因为原型链的原理。a，b对象虽然继承自 A.prototype，但其实它们两内部中并没有 num 这个属性，而当访问 num 属性时，在它们内部没找到时，会去沿着原型链中寻找，所以原型对象的属性发生变化时才会影响到子对象。</p><p>清楚这点原理后，应该就能理解，有些文章说，原型对象的属性只有读操作会同步到子对象上，写操作无效的原因了吧。</p><p>看个例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function A() {}
A.prototype.num = 1;
var a = new A();
var b = new A();
a.num = 5;  
b.num;    //输出1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面说过，虽然 a 对象继承自 A.prototype，但其实 a 对象内部并没有 num 属性，使用 a.num 时其实会去原型链上寻找这个 num 属性是否存在。</p><p>现在，执行了 a.num = 5，因为 a 对象内部没有这个 num 属性，所以这行代码作用等效于动态给 a 对象添加了 num 属性，那这个属性自然也就只属于 a 对象，自然不会对 b 对象造成任何影响，b.num 还是去b的原型链上寻找 num。</p><h3 id="改变继承关系" tabindex="-1"><a class="header-anchor" href="#改变继承关系" aria-hidden="true">#</a> 改变继承关系</h3><p>Java 中，类是继承结构一旦编写完毕，在运行期间是不可改变的了。</p><p>但在 JavaScript 中，由于对象的属性是可运行期间动态添加、修改的，所以在运行期间是可改变对象的继承结构的。</p><p>有两种不同的场景，一是修改构造函数的 prototype 属性，二是修改对象的 _<em>proto</em>_ 属性。</p><h4 id="修改构造函数-prototype" tabindex="-1"><a class="header-anchor" href="#修改构造函数-prototype" aria-hidden="true">#</a> 修改构造函数 prototype</h4><p>对象的创建大部分都是通过构造函数，所以，在构造函数创建这个对象时，它的继承关系就确定了。</p><p>看个例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var B = [];  //定义一个数组对象

function A() {}  //定义构造函数
var a = new A(); //创建一个对象，该对象继承自 A.prototype 
a.__proto__.constructor.name;  //应该输出什么
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认不手动破坏原型链的话，构造函数、原型两者间是相关关联的关系，所以通过实例对象 a 的原型 _<em>proto</em>_ 访问与它关联的构造函数，输出函数名，这里就应该是 “A”。</p><p>这也是之前讲过，可用来获取对象的标识—构造函数名的方法，但有前提，就是构造函数、原型、实例对象三者关系满足默认的关联关系。</p><p>那么，如果这个时候再手动修改 A 的 prototype 属性呢？</p><p>举个例子，在上面代码基础上，继续执行下述代码：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var C = A.prototype;   //先将 A.prototype 保存下来
A.prototype = B;       //手动修改A.prototype
var b = new A();
b.__proto__.constructor.name;  //应该输出什么
a.__proto__.constructor.name; //应该输出什么
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>手动修改了构造函数的 prototype 属性，然后又新创建了 b 对象，那么此时 a 对象和 b 对象都是通过构造函数 A 创建的。</p><p>但 a 对象创建时是继承自 A.prototype，这是一个继承自 Object.prototype 的空对象，后续手动修改了构造函数 A 的 prototype，会让 a 对象的继承关系自动跟随着发生变化吗？</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-5ee9c18d8473a687.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="修改构造函数prototype"></p><p>我们看一下输出，a 对象仍旧是之前的继承结构，它的原型链并没有因为构造函数的 prototype 发生变化而跟随着变化。</p><p>而 b 对象则是在修改了构造函数 prototype 属性后创建的，所以它的原型链就是新的结构了，跟 a 就会有所不同了。这里之所以会输出 Array，是因为 b 的原型是数组对象 B，而数组对象 B 是由 new Array() 创建的，所以 B 继承了 Array.prototype 的 constructor 属性指向了 Array。这也是之前有说过，不建议手动修改原型链结构，否则会破坏默认的构造函数、原型、实例对象三者间的关系。</p><p>如果对原型和构造函数的概念还不是很理解，那么我们换个方式验证：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-9bda1e35adb049d0.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="验证"></p><p>instanceof 表示如果左边的对象是继承自右边构造函数的 prototype 的话，表达式为 true。</p><p>isPrototypeOf 表示，左边的对象如果在右边对象的原型链上的话，表达式为 true。</p><p>所以，修改构造函数的 prototype 属性，并不会对原本从构造函数创建的对象的原型链，继承结构有所影响。这其实也再次验证，构造函数在 JavaScript 中的角色类似于作为第三方牵手原型和实例对象，修改原型会影响实例对象，但修改构造函数并不会对原本的实例对象有何影响。</p><p>但构造函数之后创建的对象，新对象的继承结构跟之前的就不一样了。</p><h4 id="修改对象的-proto-属性" tabindex="-1"><a class="header-anchor" href="#修改对象的-proto-属性" aria-hidden="true">#</a> 修改对象的 _<em>proto</em>_ 属性</h4><p>对象有办法直接获取到它的原型对象，一种是通过 _<em>proto</em>_，这是通用方式，所有对象都有，唯一的弊端在于 ES5 中并不是标准规范中的属性，虽然基本所有浏览器中都有实现，所以在一些开发工具中可能不会提示对象含有这个属性。</p><p>另一种获取对象原型的方式是，通过 constructor 的 prototype，这也是通用方式，弊端在于，对象的 constructor 属性可能指向的并不是创建它的构造函数，因为这个属性其实是继承自原型对象的属性，所以关键还取决于原型和构造函数之间是否满足默认的相互引用关系。另外，有些对象可能并没有 constructor 属性。</p><p>既然对象有属性是指向它的原型，那么手动修改这个属性的指向，会有怎样的影响？</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var B = {num:0}   //定义一个对象，含有 num 属性
function A() {}   //定义一个构造函数
A.prototype.num = 222; //为构造函数prototype添加一个 num 属性
var a = new A();
a.num;    //应该输出什么

a.__proto__ = B;  //手动修改了 a 对象的原型对象
a.num;   //此时应该输出什么
var b = new A();  //b对象跟 a 对象一样通过构造函数 A 创建
b.num;  //这里又应该输出什么
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>a 对象刚被创建来时，是继承的构造函数 A.prototype，所以第一次 a.num 输出 A.prototype.num 的值：222，这里应该没疑问。</p><p>然后手动修改了对象 a 的原型，让它的原型指向了 B 对象，那么此时对象 a 的原型链会发生变化吗？它的继承结构会发生变化吗？测试一下：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-28830e388b592116.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>所以，手动修改对象的 _<em>proto</em>_ 属性是会影响到对象的原型链的，虽然对象在创建时会根据构造函数的 prototype 生成一条原型链，但运行期间，手动修改对象的原型指向，会重新让对象推翻原本原型链，再重新生成一条新的原型链的。</p><p>那么，会影响到之后构造函数创建的新对象的原型链吗？测试一下：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-b2134240a1e4698b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>所以，手动修改某个对象的原型指向，只会让这个对象的原型链重建，并不会影响到创建它的构造函数之后创建的新对象的继承关系。</p><p><strong>最后来小结一下：</strong></p><ul><li>在 JavaScript 中，由于对象继承自原型，但原型本质上也是对象，所以，如果在运行期间动态修改原型对象上的属性，会影响到继承它的子对象们读取相关原型属性的结果。</li><li>由于继承关系通常是在构造函数创建新对象时，由构造函数的 prototype 属性值决定，而构造函数本质上也是对象，也可在运行期间，动态修改属性值。但如果运行期间，手动修改构造函数的 prototype 属性值，并不会影响到原先通过该构造函数创建的对象的继承结构（原型链），但之后通过该构造函数创建的新对象的继承结构（原型链）就跟之前的不一样了。</li><li>也就是即使同一个构造函数，但如果有修改过构造函数的 prototype 指向，那么该构造函数前后创建的对象的继承结构（原型链）也是会不一样的。</li><li>对象有相关的属性指向它的原型，比如 _<em>proto</em>_ ，当运行期间，手动修改对象的原型指向，那么会让这个对象的继承结构（原型链）重建，但不会影响到创建该对象的构造函数原本的行为。</li><li>总之，对象的继承结构（原型链）可动态发生变化。</li></ul><h3 id="重写" tabindex="-1"><a class="header-anchor" href="#重写" aria-hidden="true">#</a> 重写</h3><p>重写：子类覆盖父类的同名方法称为重写。</p><p>在JavaScript中，重写跟 Java 很类似，使用某个属性时，先在当前对象内部寻找，如果没找到，才往它的原型链上寻找。</p><p>但 JavaScript 中并没有 Java 中的类静态机制，所以定义对象的某个属性时，通常都是动态的写操作来进行，一旦在对象中出现对某个原型属性的写操作，那么就会在该对象内部创建一个同名的属性，之后对这个属性的读写，都是对对象内部这个属性的操作，原型上的同名属性的变化也不会影响到它了。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function A() {}   //定义一个构造函数
A.prototype.num = 222; //为构造函数prototype添加一个 num 属性
var a = new A();
a.num;    //输出222,
a.num = 0;
A.prototype.num = 5;
a.num; //输出0, 因为num属性已经被重写了
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="抽象方法" tabindex="-1"><a class="header-anchor" href="#抽象方法" aria-hidden="true">#</a> 抽象方法</h3><p>在 Java 中可以定义抽象类，接口，在其中定义一些抽象的方法，子类必须实现这些抽象方法。</p><p>但在 JavaScript 中并没有相关的机制，但可以自己通过 throw Error 抛异常形式来模拟这种机制。</p><p>比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//不允许使用该构造函数创建对象，来模拟抽象类
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://upload-images.jianshu.io/upload_images/1924341-8159fcf06d6b58a6.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>//定义一个继承抽象构造函数的
function MyClass() {}
MyClass.prototype = Object.create(AbstractClass.prototype);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://upload-images.jianshu.io/upload_images/1924341-559216cb50361b88.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-31dcc74fc0edb1d1.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>子类继承后，如果不实现直接调用这些方法，会抛异常。</p><p>说白了，就是通过抛异常方式来模拟 Java 中的抽象方法机制，这种方式无法让开发工具在编写代码期间就检测出来，需要代码实际运行期间才能发现。</p>`,103);function h(_,y){const i=s("ExternalLinkIcon");return t(),d("div",null,[o,c,e("ul",null,[v,e("li",null,[e("a",u,[a("MDN web docs"),n(i)])]),e("li",null,[e("a",m,[a("Github:smyhvae/web"),n(i)])]),e("li",null,[e("a",b,[a("Github:goddyZhao/Translation/JavaScript"),n(i)])])]),g])}const j=r(l,[["render",h],["__file","前端入门14-JavaScript进阶之继承.html.vue"]]);export{j as default};
