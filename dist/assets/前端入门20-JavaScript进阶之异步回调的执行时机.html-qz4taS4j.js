import{_ as a,r as l,o,c as r,a as e,b as i,e as s,d as n}from"./app-pwInIdNR.js";const d={},c=e("h1",{id:"声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#声明","aria-hidden":"true"},"#"),i(" 声明")],-1),u=e("p",null,"本系列文章内容全部梳理自以下几个来源：",-1),p=e("li",null,"《JavaScript权威指南》",-1),v={href:"https://developer.mozilla.org/zh-CN/docs/Web",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/smyhvae/Web",target:"_blank",rel:"noopener noreferrer"},g={href:"https://github.com/goddyZhao/Translation/tree/master/JavaScript",target:"_blank",rel:"noopener noreferrer"},b=n(`<p>作为一个前端小白，入门跟着这几个来源学习，感谢作者的分享，在其基础上，通过自己的理解，梳理出的知识点，或许有遗漏，或许有些理解是错误的，如有发现，欢迎指点下。</p><p>PS：梳理的内容以《JavaScript权威指南》这本书中的内容为主，因此接下去跟 JavaScript 语法相关的系列文章基本只介绍 ES5 标准规范的内容、ES6 等这系列梳理完再单独来讲讲。</p><h1 id="正文-异步回调的执行时机" tabindex="-1"><a class="header-anchor" href="#正文-异步回调的执行时机" aria-hidden="true">#</a> 正文-异步回调的执行时机</h1><p>本篇会讲到一个单线程事件循环机制，但并不是网络上对于 js 执行引擎介绍中的单线程机制，也没有涉及宿主环境浏览器的各种线程，如渲染线程、js 引擎执行线程、后台线程等等这些内容。</p><p>严谨来讲，应该不属于 JavaScript 自身的单线程机制，而是宿主对象，如浏览器处理执行 js 代码的单线程事件循环机制。</p><p>回到正题，本篇所要讲的，就是<strong>类比于 Android 中的主线程消息队列循环机制，来讲讲在 JavaScript 中，如果设置了某个异步任务后，当异步任务执行完成需要回调通知时，这个回调任务的执行时机</strong>。</p><p>如果还不清楚要讲的是什么，那么先来看个问题：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script type=&quot;text/javascript&quot;&gt;
    $.ajax({
        url: &quot;https://easy-mock.com/mock/5b592c01e4e04f38c7a55958/ywb/is/version/checkVersion&quot;,
        data: {&quot;key&quot;: 122},
        type: &quot;POST&quot;,
        success: function (data) {
            console.log(&quot;----------success-----------&quot;);  //什么时候会执行回调
        },
        error: function (e) {
            console.log(&quot;----------error-----------&quot;);
        }
    });

	//...
&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是用 jQuery 写的 ajax 网络请求的示例，这条请求自然是异步进行的，但当请求结果回来后，会去触发 success 或 error 回调，那么，问题来了：</p><p><strong>Q：想过没有，如果请求结果回来后，这个回调的代码是在什么时机会被执行的？是立马就执行吗，不管当前是否正在执行某个函数内的代码？还是等当前的函数执行结束？又或者是？</strong></p><p>也许你还没看懂这个问题要问的是什么，没关系，下面举例分析时，会讲得更细，到时你就知道这个问题要问的是什么了。</p><h3 id="android-消息队列循环机制" tabindex="-1"><a class="header-anchor" href="#android-消息队列循环机制" aria-hidden="true">#</a> Android 消息队列循环机制</h3><p>先来看看 Android 中的主线程消息队列循环机制，当然如果你不是从 Android 转前端，那可以跳过这趴：</p><p><img src="https://upload-images.jianshu.io/upload_images/652037-8523323f2946a1d8.png" alt=""></p>`,14),h={href:"https://www.jianshu.com/p/8656bebc27cb",target:"_blank",rel:"noopener noreferrer"},q=n(`<p>在 Android 里有个主线程，因为只能在主线程中进行 UI 操作，所以也叫 UI 线程，这个主线程在应用启动时就进入一个死循环中，类似于执行了 <code>while(true){...}</code> 这样的代码，等到应用退出时，退出该死循环。而死循环之所以不会卡死 CPU，是因为利用了 Linux 的 epoll 机制，通俗的来将，就是，主线程会一直循环往消息队列中取消息执行，如果队列中没有消息，那么会进入阻塞状态，等有新的消息到来时，唤醒继续处理。而阻塞和唤醒就是利用了 Linux 的 epoll 机制。</p><p>所以，在 Android 中，打开页面是一个 message，触摸屏幕也是一个 message，message 中指示着当前应该执行的代码段，只有当前的 message 执行结束后，下会轮到下个 message 执行。</p><p>所以，在 Android 中的异步任务的回调工作，比如同样异步发起一个网络请求，请求结果回来后，需要回调到主线程中处理，那么这个回调工作的代码段会被封装到 message 中，发送到消息队列中排队，直到轮到它来执行。</p><p>而 message 发送到消息队列是基于 Handler 来传输，所以，在 Android 中，如果想要查看 message 是以什么为粒度，查找在哪里通过 Handler 发送了 message 即可。</p><h3 id="javascript-中的单线程事件循环机制" tabindex="-1"><a class="header-anchor" href="#javascript-中的单线程事件循环机制" aria-hidden="true">#</a> JavaScript 中的单线程事件循环机制</h3><p>那么，在 JavaScript 中，又是如何处理异步工作的回调任务的呢？</p><p>查了一些相关的资料，发现讲的都是 JavaScript 的单线程，事件循环机制等之类理论，但却没看到，事件的粒度是什么？</p><p>看完我能理解，JavaScript 也是类似 Android，一样执行了某段类似 <code>while(true){...}</code> 的代码来循环处理事件，但看完我仍旧无法理解，这个事件的粒度是什么，怎么查看事件的粒度？</p><p>再举个例子来说明我的疑问好了：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script type=&quot;text/javascript&quot;&gt;
    console.log(&quot;----------1-----------&quot;);
    $.ajax({
        url: &quot;https://easy-mock.com/mock/5b592c01e4e04f38c7a55958/ywb/is/version/checkVersion&quot;,
        data: {&quot;key&quot;: 122},
        type: &quot;POST&quot;,
        success: function (data) {
            console.log(&quot;----------success-----------&quot;);  //什么时候会执行回调
        },
        error: function (e) {
            console.log(&quot;----------error-----------&quot;);
        }
    });

    console.log(&quot;----------2-----------&quot;);
    alert(&quot;2&quot;);  //第一个卡点
    console.log(&quot;----------2.1-----------&quot;);
    function A() {
        console.log(&quot;------------2.2-----------&quot;);
        alert(&quot;A&quot;);  //第二个卡点
    }
    A();
    console.log(&quot;---------------2.3---------------&quot;)
&lt;/script&gt;

&lt;script type=&quot;text/javascript&quot;&gt;
    console.log(&quot;----------3-----------&quot;);
&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>alert()</code> 会阻塞当前程序，当 js 执行到 <code>alert()</code> 的代码时卡在这里，后续代码不会被执行，直到取消弹窗。所以，我们可以通过注释上例中相对应的 <code>alert()</code> 来模拟异步请求的结果在什么时候接收到，而这个回调任务又是在哪个时机被执行的。</p><p>好，那么疑问来了：</p><p>假设，程序卡在 <code>alert(&quot;2&quot;)</code> 这里，这时候，异步的请求结果回来了，那么回调任务是会被接到哪个时机执行？等我取消 alert 的弹窗后就先执行回调任务然后再继续处理 <code>alert(&quot;2&quot;)</code> 后的代码吗？</p><p>我们将 <code>alert(&quot;A&quot;)</code> 注释掉，运行一下，测试看看：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-0028e6328d2f23f0.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>当前程序确实卡在 <code>alert(&quot;2&quot;)</code>，而且我们等到请求结果回来了，这时，我们把 alert 弹窗取消掉，看看日志：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-890bdc61aa8a1c47.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>回调任务中输出的 success 在 <code>alert(&quot;2&quot;)</code> 后续代码输出的 2.1 下面，那么就是先继续执行 <code>alert(&quot;2&quot;)</code> 后面的代码，然后才会执行回调任务的代码了，那么这个后面的代码究竟包括哪些代码？</p><p>好，这个时候，我们把 <code>alert(&quot;2&quot;)</code> 代码注释掉，让程序卡在 <code>alert(&quot;A&quot;)</code> 这行代码。</p><p>假设，当前程序正在执行某个函数内的代码，这个时候异步请求的结果回来了，那么这个回调任务会接在这个函数执行结束后吗？也就是，我们现在来验证下事件的粒度是否是以函数为粒度？</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-05f8354f1cd853ef.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-2287621ae0801726.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>程序确实卡在函数 A 内部的代码 <code>alert(&quot;A&quot;)</code>，输出的日志上也能看到现在已经输出到 2.2，且异步请求的结果也回来了，那么这个回调任务的代码会在函数调用执行结束后，就被处理吗？如果是的话，那么日志 2.2 接下去应该要输出 success 才对，如果不是，那么就会输出 2.3，看看日志：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-6ca6ff8ed9b74334.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>也就是说，即使异步请求结果回来了，回调任务也不能在当前函数执行完后立马被处理，它还是得继续等待，等到函数后面的代码也执行完了，那这个后面的代码到底是什么呢？也就是事件的粒度到底是什么呢？</p><p>我们试过了以每行代码为粒度做测试，也试过了以函数为粒度做测试，那还能以什么作为粒度呢？或者是以 &lt;script&gt; 为粒度，只有等当前 &lt;script&gt; 标签内的代码都执行完，才轮到下个代码段执行？</p><p>从上面两种场景下，所得到的日志来看，似乎确实也是这么个结论，success 的日志都是在 2.3 和 3 之间输出，2.3 表示当前 &lt;script&gt; 标签里的最后一行代码，而 3 表示下个 &lt;script&gt; 标签内的第一行代码。</p><p>既然这样，我们再来做个测试：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script type=&quot;text/javascript&quot;&gt;
    console.log(&quot;----------1-----------&quot;);
    $.ajax({
        url: &quot;https://easy-mock.com/mock/5b592c01e4e04f38c7a55958/ywb/is/version/checkVersion&quot;,
        data: {&quot;key&quot;: 122},
        type: &quot;POST&quot;,
        success: function (data) {
            console.log(&quot;----------success-----------&quot;);  //什么时候会执行回调
        },
        error: function (e) {
            console.log(&quot;----------error-----------&quot;);
        }
    });
    /*
    console.log(&quot;----------2-----------&quot;);
    alert(&quot;2&quot;);  //第一个卡点
    console.log(&quot;----------2.1-----------&quot;);
    function A() {
        console.log(&quot;------------2.2-----------&quot;);
        alert(&quot;A&quot;);  //第二个卡点
    }
    A();
    console.log(&quot;---------------2.3---------------&quot;) */
&lt;/script&gt;

&lt;script type=&quot;text/javascript&quot;&gt;
    console.log(&quot;----------3-----------&quot;);
    alert(&quot;3&quot;); //第三个卡点
    console.log(&quot;----------3.1---------&quot;)
&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们把第一个 &lt;script&gt; 标签内那些用于上面两种场景测试的代码注释掉，只留一个异步请求的代码，然后在第二个 &lt;script&gt; 标签内，加个 <code>alert(&quot;3&quot;)</code> 来模拟程序是在第一个 &lt;script&gt; 中发起异步请求，但直到程序运行到第二个 &lt;script&gt; 时，异步请求结果才回来，这种场景下回调任务的执行时机会是在哪？</p><p>如果当程序卡在 <code>alert(&quot;3&quot;)</code>，异步请求结果回来了，这时候还没有取消 alert 弹窗，或者一取消的时候，就先输出 success，再输出 3.1，则表示，回调任务的代码块是被安排到发起异步请求的这个 &lt;script&gt; 里代码都执行结束就去处理。</p><p>如果 success 是在 3.1 之后才输出，那么，就可以说明，浏览器处理 js 代码，是以 &lt;script&gt; 作为事件粒度，放入事件循环队列中去处理。看看日志：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-4f03da685302f2cd.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>好了，现在可以确认了，success 是在 3.1 之后才输出的，那么来整理下结论吧。</p><h3 id="结论" tabindex="-1"><a class="header-anchor" href="#结论" aria-hidden="true">#</a> 结论</h3><p><strong>看到这里的话，你一定要继续看最后的一小节的内容，一定！</strong></p><p>之后问了一些前端同学，然后我基于对 Android 那边的类似理解，我自行梳理了下面的这些结论，因为涉及底层运行机制、浏览器行为的这些知识我还没开始去看，所以下面结论不保证正确，只能说是，基于我目前的能力，针对于做实验所得到的现象，我梳理出一些可以解释得通的结论。</p><ul><li>浏览器解析 html 文档时，是按顺序一行一行进行解析，当处理到 &lt;script&gt; 标签时，会暂停当前页面的渲染，进入 js 代码的执行。</li><li>在执行当前 &lt;script&gt; 标签内的代码时，是以整个标签内的代码块作为事件粒度，放入事件队列中进行处理。</li><li>如果在当前 &lt;script&gt; 标签里的代码发起了某些异步工作，如异步网络请求，并设置了回调，那么回调任务的代码块会被单独作为一个事件，等到异步工作结束后，插入当前事件队列中。</li><li>所以，如果回调任务在执行当前 &lt;script&gt; 标签内的代码时就已经加入队列了，那么等到当前 &lt;script&gt; 里的代码都执行结束后，就可以轮到回调任务的执行。</li><li>如果回调任务直到当前 &lt;script&gt; 里的代码都执行结束也还没被加入事件队列，那么这时浏览器会接着去解析 html 文档，如果又碰到下个 &lt;script&gt; 标签，那么会将这个 &lt;script&gt; 标签内的代码块放入事件队列中处理。</li><li>所以，如果这时候第一个 &lt;script&gt; 标签内的代码发起的异步任务才结束，才将回调工作加入事件队列中，那么这个回调工作的代码只能等到第二个 &lt;script&gt; 标签内的代码都执行结束后才会被处理。</li></ul><h3 id="碰到的问题" tabindex="-1"><a class="header-anchor" href="#碰到的问题" aria-hidden="true">#</a> 碰到的问题</h3><p>为啥会想要梳理这个结论呢，是因为我碰到这么一种场景：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>&lt;script type=&quot;text/javascript&quot;&gt;
    document.location.href = &quot;http://www.baidu.com&quot;
    //...
&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>之前有个 h5 项目中，有类似的代码，就是满足一定条件下，需要将页面跳转至其他页面。</p><p>修改 <code>location.href</code> 貌似不是同步操作，我猜测应该是这行跳转代码会告诉浏览器，当前页面准备跳转，这时候，浏览器再生成一个跳转事件，接入事件队列中等待执行的吧。</p><p>因为，最初我以为这是个同步操作，所以我认为当程序执行到 <code>document.location.href = xx</code> 这行代码之后，页面就会发生跳转，然后这行代码下面的那些代码都不会被执行，但最后实际运行时，却发现，这行代码下面的代码也都被执行了。</p><p>后来经过测试，发现，跳转语句这行代码所在的 &lt;script&gt; 里的代码会被全部执行完，然后才发起页面跳转，下个 &lt;script&gt; 里的代码不会被执行，所以，那个时候，就有个疑惑了，在 js 中发起一个异步操作的话，这个异步工作的回调任务的执行时机到底在哪里？</p><p>后来稍微查了相关资料，发现了个词说 JavaScript 是单线程机制，联想到 Android 中的主线程消息循环机制，这才想来理一理。</p><h3 id="卧槽" tabindex="-1"><a class="header-anchor" href="#卧槽" aria-hidden="true">#</a> 卧槽</h3><p>卧槽，卧槽，卧槽~</p><p>不要怪我连骂粗话，这篇文章是挺早之前就写好的了，只是一直还没发表，待在草稿箱中。而最后这一小节，是等到我差不多要发表时才新增的内容。</p><p>为什么要骂粗话，因为我发现，我上面所梳理的结论，好像全部都是错误的了，但也不能说全部错误，我实在不想把辛辛苦苦写好的都删掉，也不想直接就发出来误导大伙，所以我在最后加了这一小节，来说明情况，大伙看这篇的结论时，看看就好，讨论讨论一下就好，不要太当真哈。</p><p>事情是这样的，我一些前端同学觉得我的理解有误，所以尝试将我上文中的例子在他的电脑上运行测试了下，结果你们看一下：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-617ee21406a6fd11.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>这是对应上文中第一个测试，即让程序卡在 <code>alert(&quot;2&quot;)</code> 这里，然后等到请求结果回来后，取消 alert 弹窗，这种场景，按照我们上面梳理的结论，回调任务在当前 &lt;script&gt; 执行结束之前就被插入事件队列中了，所以回调任务应该会在第二个 &lt;script&gt; 代码之前先被处理，但我同学的情况却是，回调任务等到所有 &lt;script&gt; 都处理完才被执行？？？</p><p>一脸懵逼？？？</p><p>然后，我怀疑是不是不同浏览器会有不同的行为，所以同样的测试步骤我在 IE 浏览器上测试了一下：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-da3ecbbdf1bdcbbd.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt=""></p><p>是不是更懵逼，明明程序卡在 <code>alert(&quot;2&quot;)</code> 这行代码这里，但异步请求回来后，回调任务居然直接被处理了，不等当前 &lt;script&gt; 代码块执行结束就先行处理了回调任务？</p><p>最后，我让我一些同事帮忙测试了一下，在 chrome 上测试、在 jsfiddle 上测试，测试结果，基本上全部都是我上文中梳理的结论。</p><p>只有个别情况，行为比较特异，对前端我才刚入门，为什么会有这种情况发生，有两个猜想：</p><ul><li>不同浏览器对于执行 js 代码块的行为不一致？</li><li>不同浏览器对于 <code>alert()</code> 的处理不一致？</li></ul><p>总之，最后，我还是觉得我本篇梳理出的结论比较符合大多数情况下的解释，当然，没有能力保证结论是正确的，大伙当个例子看就好，后续等能力有了，搞懂了相关的原理，再来重新梳理。</p><p>最后，如果你有不同的看法，欢迎指点一下哈~</p>`,62);function _(f,j){const t=l("ExternalLinkIcon");return o(),r("div",null,[c,u,e("ul",null,[p,e("li",null,[e("a",v,[i("MDN web docs"),s(t)])]),e("li",null,[e("a",m,[i("Github:smyhvae/web"),s(t)])]),e("li",null,[e("a",g,[i("Github:goddyZhao/Translation/JavaScript"),s(t)])])]),b,e("blockquote",null,[e("p",null,[i("这张图来自 "),e("a",h,[i("Android消息机制（一）：概述设计架构 "),s(t)]),i("这篇文章中，我懒得自己画了，借大佬图片一用，如果不允许使用，麻烦告知下，我再来自己画。")])]),q])}const w=a(d,[["render",_],["__file","前端入门20-JavaScript进阶之异步回调的执行时机.html.vue"]]);export{w as default};
