import{_ as o,r,o as l,c as s,a as e,b as a,e as i,d as n}from"./app-pwInIdNR.js";const t={},c=e("p",null,"在写这篇博客时，搜索参考了很多资料，网上对于 Groovy 介绍的博客已经特别多了，所以也就没准备再详细的去介绍 Groovy，本来也就计划写一些自己认为较重要的点。后来发现了 Groovy 的官方文档后，发现其实官方的介绍特别的全面，详细。但可惜的是我的英语不好，看英文文档有些费时间，但还是推荐有能力的人去参照官方文档来学习，后期如果有时间的话，我也计划试着翻译一些官方的文档来学习，记录一下。",-1),u=e("p",null,"所以，这篇的侧重点不是在介绍 groovy 的基本语法，而是介绍跟 build.gradle 比较相关的一些知识点吧，另外在末尾会附上一些 groovy 学习链接，有兴趣的可以继续去学习。",-1),v=e("hr",null,null,-1),p=e("h1",{id:"系列索引",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#系列索引","aria-hidden":"true"},"#"),a(" 系列索引")],-1),m={href:"http://www.jianshu.com/p/a3805905a5c7",target:"_blank",rel:"noopener noreferrer"},g=e("br",null,null,-1),b={href:"http://www.jianshu.com/p/501726c979b1",target:"_blank",rel:"noopener noreferrer"},h=e("br",null,null,-1),_=n(`<hr><p>开始学习 Groovy 前，引用徐宜生的《Android群英传：神兵利器》书中的一句话来介绍 Groovy：</p><blockquote><p>Groovy 对于 Gradle，就好比 Java 对于 Android。了解一些基本的 Groovy 知识，对于掌握 Gradle 是非常有必要的。</p></blockquote><h1 id="groovy-是什么" tabindex="-1"><a class="header-anchor" href="#groovy-是什么" aria-hidden="true">#</a> Groovy 是什么</h1><p>Groovy 是一种脚本语言，既然是脚本语言，那么它也就有脚本语言的那些特点：使用动态类型、末尾不用分号等等。另外，它又是基于 Java 上设计的语言，也就是 Groovy 兼容 Java，可以使用 JDK 里的各种方法，你可以在 Groovy 文件里写 Java 代码里，照样可以正常编译运行。</p><h1 id="groovy-语法" tabindex="-1"><a class="header-anchor" href="#groovy-语法" aria-hidden="true">#</a> Groovy 语法</h1><p>关于语法的详细的介绍在末尾有链接，这里就只是挑出我认为比较重要的，而且跟 java 有区别的，在阅读代码时可能会看不懂的一些语法进行记录。</p><h3 id="_1-注释、标识符方面跟-java-基本一样。" tabindex="-1"><a class="header-anchor" href="#_1-注释、标识符方面跟-java-基本一样。" aria-hidden="true">#</a> 1.注释、标识符方面跟 Java 基本一样。</h3><h3 id="_2-基本数据类型-运算方面" tabindex="-1"><a class="header-anchor" href="#_2-基本数据类型-运算方面" aria-hidden="true">#</a> 2.基本数据类型，运算方面</h3><p>这方面在 build.gradle 文件里也不怎么常见到使用，因为 groovy 是动态类型，定义任何类型都可以只使用 def 来定义，所以如果使用具体的比如 char, int 等类型时需要强制转换吧。有需要的可以自己查阅末尾的参考链接。</p><h3 id="_3-字符串方面" tabindex="-1"><a class="header-anchor" href="#_3-字符串方面" aria-hidden="true">#</a> 3.字符串方面</h3><p>java 只支持用 <code>&quot;...&quot;</code> 双引号来表示字符串</p><p>groovy 支持使用 <code>&#39;...&#39;</code>, <code>&quot;...&quot;</code>, <code>&#39;&#39;&#39;...&#39;&#39;&#39;</code>, <code>&quot;&quot;&quot;...&quot;&quot;&quot;</code>, <code>/.../</code>, <code>$/.../$</code> 即单引号，双引号等6种方法来表示字符串<br> 至于各种表示方法有什么区别，具体可以参考末尾的链接，这里简单提提，<code>&#39;...&#39;</code>, <code>&quot;...&quot;</code> 只支持单行字符串，不支持多行，剩下的四种都支持多行字符串，如下图<br><img src="http://upload-images.jianshu.io/upload_images/1924341-cc18ea13326a0918.png" alt="Groovy字符串代码示例"><br><img src="http://upload-images.jianshu.io/upload_images/1924341-0813184508bcdd70.png" alt="控制台输出结果"></p><p>斜杠我也很少见，常见的是带有 <code>\${}</code> 的字符串，比如： <code>println &quot;blog&#39;s url: \${blogUrl}&quot; </code> 这是 groovy 的 GString 特性，支持字符串插值，有点了类似于变量引用的概念，但注意，在 <code>&#39;...&#39;</code>, <code>&#39;&#39;&#39;...&#39;&#39;&#39;</code> 单引号表示的字符串里不支持 <code>\${}</code>。当然，如果你要使用 java 的方式，用 <code>+</code> 来拼接也可以。</p><h3 id="_4-集合方面-list、map" tabindex="-1"><a class="header-anchor" href="#_4-集合方面-list、map" aria-hidden="true">#</a> 4.集合方面（List、Map）</h3><p><strong>定义和初始化</strong><br> 定义很简单，List 的话使用 <code>[]</code> 定义，各项用 <code>,</code> 隔开即可。Map 的话使用 <code>[:]</code>，各项也是用 <code>,</code> 隔开，如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>def numList = [1, 2, 3]  //List
def map [1:&quot;dasu&quot;, dasu:24] //Map, : 前是key，如1， : 后是value, 如dasu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>有一点跟 java 不同的是， groovy 集合里不要求每一项都是同类型，比如可以这样定义 <code>def list = [1, &#39;dasu&#39;, true]</code>，集合里包含数字，字符串，布尔值三种类型。</p><p><strong>使用</strong><br> 通过下标操作符 <code>[]</code> 读写元素值，并使用正索引值访问列表元素或负索引值从列表尾部访问元素，也可以使用范围，或使用左移 <code>&lt;&lt;</code> 追加列表元素，如</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//========= List 使用 ================
println numList[1]  //输出 1
println numList[-1] //输出 3

numList[2] = 4    // println numList[2]将输出 4
numList[3] = 5
numList &lt;&lt; &quot;dasu&quot; //现在numList = [1, 2, 4, 5, &quot;dasu&quot;]

//========== Map 使用 ================
println map[1]       //输出 dasu
println map.dasu     //输出 24, key是字符串的话可以这样访问
map[3] = &quot;I am dasu&quot; // 在map里加入一个[3:&quot;I am dasu&quot;]项
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>跟 java 不同的是， groovy 并不存在下标访问越界，当下标为负数时则从右开始算起，当指定的下标没有存放值时返回 null。</p><h3 id="_5-数组方面" tabindex="-1"><a class="header-anchor" href="#_5-数组方面" aria-hidden="true">#</a> 5.数组方面</h3><p>groovy 其实没有严格区分数组和集合，数组的定义和使用方法跟集合一样，只是你需要强制声明为数组，否则默认为集合，如</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>String[] arrStr = [&#39;Ananas&#39;, &#39;Banana&#39;, &#39;Kiwi&#39;]  
def numArr = [1, 2, 3] as int[] //as 是 groovy 关键字

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的初始化方式是不是跟 java 不一样，这一点需要注意下，java 是用 <code>{}</code> 来初始化，但在 groovy 里面， <code>{}</code> 表示的是闭包，所以这点需要注意一下。</p><hr><p>上面的是 groovy 与 java 不同的一些基本语法，下面介绍一些我自己认为是 groovy 比较重要的特性，如果要看懂 build.gradle 里的代码，明白下面介绍的会比较有帮助。</p><h3 id="_6-方法的简化使用" tabindex="-1"><a class="header-anchor" href="#_6-方法的简化使用" aria-hidden="true">#</a> 6.方法的简化使用</h3><p><strong>方法的括号可以省略</strong></p><p>groovy 定义方法时可以不声明返回类型和参数类型，也可以不需要 return 语句，最后一行代码默认就是返回值。<br> 而在调用方法时可以将括号省略，不省略的时候如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>def add(a, b) {
    a + b
}
println add(1,2)  //输出 3

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的方式不陌生吧，再来看看下面的代码</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>println add 1, 2 //输出 3, add方法同上

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>上面就是调用方法时省略掉圆括号的写法，再来看一种情况</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>def getValue(Map map) {
    map.each {
        println it.key + &quot;:&quot; + it.value
    }
}
def map = [author:&quot;dasu&quot;]
getValue(map) //输出 author:dasu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这次定义一个参数为 map 类型的方法，如果我们在调用方法的时候才对参数进行定义和初始化会是什么样的呢？如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>getValue(author: &quot;dasu&quot;) //输出 author:dasu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>之前说过了，groovy 调用方法时可以将括号省略掉，这样一来再看下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>getValue author: &quot;dasu&quot; //输出 author:dasu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,39),x=e("br",null,null,-1),f=e("img",{src:"http://upload-images.jianshu.io/upload_images/1924341-d28331899147847c.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240",alt:"build.gradle"},null,-1),y=e("br",null,null,-1),q={href:"http://www.jianshu.com/p/a3805905a5c7",target:"_blank",rel:"noopener noreferrer"},w=n(`<p>上图那代码如果把省略的括号补上的话，大家应该就会熟悉点了</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// apply plugin: &#39;com.android.application&#39;  等效于
def map = [plugin: &#39;com.android.application&#39;]
apply(map)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用了 apply() 方法，该方法传入一个 map 参数，我们来看看是不是这样，用as查看下源码，如下<br><img src="http://upload-images.jianshu.io/upload_images/1924341-2f84f2bb58ecc672.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="PluginAware.java"><br> 没错吧，apply() 其实是个方法，参数为 map 类型，而且 key 的取值也给你规定了 <code>from</code>, <code>plugin</code>, <code>to</code> 三种，是不是确实在别人的 build.gradle 代码里也有看见过类似 <code>apply from ***</code>，这样一来就明白多了吧。</p><p>好了，然后你再重新去看一下 build.gradle 里的代码，是不是对每一行的代码都有了新的看法了。</p><p>其实 build.gradle 里的每一行代码都是在调用一个方法，比如下面这些我们常见的：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-f0d802f0be4c01ff.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="build.gradle"><br> 每一行都是在调用一个方法，前面是方法名，后面是方法的参数，只是把括号省略掉了而已，感兴趣的你可以再自己用as点进去看看源码是不是这样。</p><p><strong>方法最后一个参数是闭包可以提取出来接到后面</strong></p><p>闭包是 groovy 的一大特性，我理解也不深，也讲不大清楚，感兴趣的可自行网上查阅学习，简单的说就是一个用 <code>{..}</code> 包起来的代码块，比如 build.gradle 里的 <code>defaultConfig{...}</code>, <code>buildTypes{...}</code>, <code>dependencies{...}</code> 等等这些大括号包起来的代码块就是闭包，闭包代码块最后一句代码作为闭包的返回值。</p><p>当闭包作为方法的最后一个参数，可以将闭包从参数圆括号中提取出来接在最后，如果闭包是唯一的一个参数，则方法参数所在的圆括号也可以省略。对于有多个闭包参数的，只要是在参数声明最后的，均可以按上述方式省略，举个例子。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//定义 add 方法
def add(a, Closure c) {
println a + c.call()
}
//调用方法
add(1, {1+1}) //输出 3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面定义一个 add 方法，最后一个参数为闭包，调用的时候传入一个闭包，闭包的最后一行代码 <code>1+1</code> 作为闭包返回值返回，闭包返回值作为方法的第二个参数传入方法中计算加法，所以最终输出3。上面的调用也可以写成下面的方式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>add(1){
    1+2
} //输出 4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，这是调用 add() 方法，而不是在定义，1 是第一个参数，括号后的闭包 <code>{ 1+2 }</code> 是方法的第二个参数，这就是 groovy 的特性，闭包可以提取出来。那么再想想，如果方法只有一个闭包参数，再结合 groovy 可以省略掉括号的特性，这样子调用一个方法将会是什么样子呢？</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//定义 method 方法
def method(Closure c) {
    println c.call()
}
//调用方法
method {
    I&#39;m dasu
} //输出 I&#39;m dasu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>是不是又感觉很熟悉，对吧，就是 build.gradle 里的 <code>defaultConfig{...}</code>, <code>buildTypes{...}</code>, <code>dependencies{...}</code> 等等这些。</p><p>所以，结合上面讲的两点：可以省略方法括号和闭包可以提取接到括号后面，这样一来， build.gradle 里的代码其实就是在调用各种方法，<code>defaultConfig</code> 是一个方法，<code>compileSdkVersion</code> 也是一个方法。 build.gradle 里的每一行代码前面是方法名，后面则是方法需要的参数，参数有的是基本类型，有的则是闭包类型。</p><p><strong>集合遍历 each/all</strong><br> 就先把上一篇博客里的在一段在 build.gradle 里很常见的代码贴出来</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-bd80909468a07515.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="重名名apk代码"></p><p>这段代码作用就是对打包生成的 apk 按照规定的格式进行重命名，在很多大神的 build.gradle 里都会遇见过，其实这一段代码就是 groovy 代码，<code>all</code> 和 <code>each</code> 是集合的一种操作，<code>all</code> 后面跟着的是一个参数为 <code>variant</code> 的闭包，表示对 <code>applicationVariants</code> 集合里所有的对象都运行后面的闭包，同理 <code>each</code> 后面也是跟着一个参数为 <code>output</code> 的闭包，类似于 java 里的 for 循环操作。所以这里要理解的应该是 <code>applicationVariants</code> 代表的是什么，这点我也还不是很懂，后面如果搞懂了的话会在之后的博客里介绍出来。</p><p>另外，我还有个疑问来着， <code>all</code> 操作和 <code>each</code> 操作有什么区别么，感觉都是对集合里所有的元素进行操作，如果有懂的能够告知就太感谢了，查了挺多资料貌似还不是很明白。</p><h1 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h1>`,20),j={href:"http://www.groovy-lang.org/documentation.html",target:"_blank",rel:"noopener noreferrer"},k=e("br",null,null,-1),G={href:"http://ifeve.com/groovy-syntax/",target:"_blank",rel:"noopener noreferrer"},V=e("br",null,null,-1),L={href:"https://my.oschina.net/wstone/blog/389449",target:"_blank",rel:"noopener noreferrer"};function M(C,I){const d=r("ExternalLinkIcon");return l(),s("div",null,[c,u,v,p,e("p",null,[a("build.gradle系列一："),e("a",m,[a("看不懂的build.gradle代码"),i(d)]),g,a(" build.gradle系列二："),e("a",b,[a("学点Groovy来理解build.gradle代码"),i(d)]),h,a(" ...")]),_,e("p",null,[a("这样子的格式是不是看着觉得很眼熟，没错，就是 build.gradle 里的第一行代码。"),x,f,y,a(" 如果有看过我的上一篇 "),e("a",q,[a("build.gradle"),i(d)]),a(" 博客的话，现在对疑问1是不是就有些理解了呢。")]),w,e("p",null,[e("a",j,[a("官方文档"),i(d)]),k,e("a",G,[a("Groovy语言规范-语法（官方文档翻译）"),i(d)]),V,e("a",L,[a("Groovy操纵集合秘籍"),i(d)])])])}const A=o(t,[["render",M],["__file","groovy介绍.html.vue"]]);export{A as default};
