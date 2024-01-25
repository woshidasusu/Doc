import{_ as d,r as l,o as r,c as s,a as e,b as n,e as t,d as a}from"./app-XVH6qKTA.js";const o={},c=a('<p>这次想来讲讲断点续传，以前没相关需求，所以一直没去接触，近阶段了解了之后，其实并不复杂，那么也便来写一篇记录一下，分享给大伙，也方便自己后续查阅。</p><h1 id="提问" tabindex="-1"><a class="header-anchor" href="#提问" aria-hidden="true">#</a> 提问</h1><p><strong>Q1：如果你的 app 需要下载大文件，那么是否有方法可以缩短下载耗时？</strong></p><p><strong>Q2：如果你的 app 在下载大文件时，程序因各种原因被迫中断了，那么下次再重启时，文件是否还需要重头开始下载？</strong></p><p><strong>Q3：你的 app 下载大文件时，支持暂停并恢复下载么？即使这两个操作分布在程序进程被杀前后。</strong></p><h1 id="理论基础" tabindex="-1"><a class="header-anchor" href="#理论基础" aria-hidden="true">#</a> 理论基础</h1><p>讲之前，先来通俗的解释下什么是<strong>断点续传</strong>：</p><p>说得白一点，其实也就是下载文件时，不必重头开始下载，而是从指定的位置继续下载，这样的功能就叫做断点续传。</p><p>既然如此，那么要实现断点续传的关键点其实也就是两点：</p><ul><li><strong>如何告知服务端，从指定的位置下载</strong></li><li><strong>如何知道客户端想要的指定位置是多少</strong></li></ul><p>是吧，理论上来讲，当这两点都可以做到的时候，自然就可以实现断点续传了。那么，要如何做到呢？</p><p>其实，也很简单，并不需要我们自己去写一些什么，HTTP 协议本身就支持断点续传了，所以借助它就可以实现告知服务端，从指定位置下载的功能了。</p><p>而另一点，就更简单了，文件是下载到客户端设备上的，那么只要获取到这份下载到一半的文件，看一下它目前的大小，也就知道需要让服务端从哪开始继续下载了。</p><p>那么，下面就介绍一下涉及到的相关理论：</p><p><strong>Range &amp; Content-Length &amp; Content-Range &amp; If-Range</strong></p><p>这些都是 HTTP 包中 Header 头部的一些字段信息，其中 Range 和 If-Range 是请求头中的字段，Content-Length 和 Content-Range 是响应头中的字段。</p><h3 id="range" tabindex="-1"><a class="header-anchor" href="#range" aria-hidden="true">#</a> Range</h3><p>当请求头中出现 Range 字段时，表示告知服务端，客户端下载该文件想要从指定的位置开始下载，至于 Range 字段属性值的格式有以下几种：</p><table><thead><tr><th>格式</th><th>含义</th></tr></thead><tbody><tr><td>Range:bytes=0-500</td><td>表示下载从0到500字节的文件，即头500个字节</td></tr><tr><td>Range:bytes=501-1000</td><td>表示下载从500到1000这部分的文件，单位字节</td></tr><tr><td>Range:bytes=-500</td><td>表示下载最后的500个字节</td></tr><tr><td>Range:bytes=500-</td><td>表示下载从500开始到文件结束这部分的内容</td></tr></tbody></table><p>当 app 想实现缩短大文件的下载耗时，可以开启多个下载线程，每个线程只负责文件的一部分下载，当所有线程下载结束后，将每个线程下载的文件按顺序拼接成一个完整的文件，这样就可以达到缩短下载大文件的耗时目的了。</p><p>那么，此时，就可以使用 <code>Range:bytes=501-1000</code> 这种格式了，每个线程在各自的请求头字段中，以这种格式加入相对应的信息即可达到目的了。</p><p>如果 app 想实现断点续传，文件下载到一半被迫中断，下次启动还可以继续接着上次进度下载时，那么此时可以使用 <code>Range:bytes=500-</code> 这种格式了，只要先获取本地那份文件目前的大小，通过在请求头中加入 Range 字段信息即可。</p><h3 id="content-length" tabindex="-1"><a class="header-anchor" href="#content-length" aria-hidden="true">#</a> Content-Length</h3><p>Content-Length 字段出现在响应头中，用于告知客户端此次下载的文件大小。</p><p>一般，如果客户端需要实现下载进度实时更新时，就需要知道文件的总大小和目前下载的大小，后者可以通过对本地文件的操作得知，前者一般就是通过响应头中的 Content-Length 字段得知。</p><p>另外，如果想要实现多线程同时分段下载大文件功能时，显然在下载前，客户端需要先知道文件总大小，才可以做到动态进行分段，因此一般在下载前都会先发送一个不需要携带 body 信息请求，用于先获取响应头中的 Content-Length 字段来得知文件总大小。</p><p><strong>但有一点需要注意：Content-Length 只表示此链接中下载的文件大小</strong></p><p>什么意思，也就是说，如果这条链接是一次性将整个文件下载下来的，那么 Content-Length 就表示这个文件的总大小。</p><p>但，如果这条链接指定了 Range，表明了只是下载文件的指定部分的内容，那么此时 Content-Length 表示的就只是这一部分的大小。</p><p>所以，如果客户端实现了下载进度实时更新功能时，需要注意一下。因为如果文件是断点续传的，那么进度条的分母就不能用每次 HTTP 链接中的 Content-Length。要么下载前先发一条获取用于文件总大小的请求，然后一直维护着这个数据，要么就使用 Content-Range 字段。</p><h3 id="content-range" tabindex="-1"><a class="header-anchor" href="#content-range" aria-hidden="true">#</a> Content-Range</h3><p>Content-Range 字段也是出现在响应头中，用于告知客户端此链接下载的文件是哪个部分的，以及文件的总大小。</p><p>比如，当客户端在请求头中指定了 <code>Range:bayes=501-1000</code> 来下载一个总大小为 2000 字节文件的中间一部分内容时，此时，响应头中的 Content-Range 字段信息如下：</p><p><code>Content-Range:bytes 501-1000/2000</code></p><p>斜杠前表示此链接下载的文件是哪一部分，斜杠后表示文件的总大小。</p><h3 id="if-range" tabindex="-1"><a class="header-anchor" href="#if-range" aria-hidden="true">#</a> If-Range</h3><p>断点续传，说白点也就是分多次下载，既然不是一次性下载，那么就无法保证多次下载的间隔。</p><p>也就是说，有可能出现这种场景，这次由于某些原因只下载的一部分，而下次重启继续下载，但可能等到过了很多天后才重启去继续下载，如果在这期间，服务端的这份文件更新了怎么办？</p><p>只要不是一次性下载的，那么就有可能会出现这种场景，显然，这时候，就不希望断点续传了，而是要让客户端直接重头开始下载，毕竟文件都已经发生更新了，不是同一份了，再继续恢复下载也没有什么意义。</p><p>那么，客户端要如何知道服务端的文件是否发生变化，要重头下载呢？</p><p>这时就可以结合 If-Range 字段来实现了，这个也是在请求头中的字段，跟 Range 字段一起使用，它的作用是给 Range 字段生效设置了一些条件，只有满足这些条件，Range 才能生效。</p><p>也就是说，只有先满足 If-Range，那么才能通过 Range 来实现断点续传。</p><p>那它的条件值可以设置为哪些呢？有两种，Last-Modified 或者 ETag，这两个也都是响应头中的字段。</p>',43),p={href:"https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/If-Range",target:"_blank",rel:"noopener noreferrer"},u=a(`<h3 id="抓包示例" tabindex="-1"><a class="header-anchor" href="#抓包示例" aria-hidden="true">#</a> 抓包示例</h3><p>以上就是断点续传相关的理论基础，下面抓个包，看看请求头和响应头中的信息，来总结一下理论基础。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-e01bee6c8b81e0e5.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="断点续传.png"></p><p>首先先发起一个请求，设置了不携带 BODY 信息，这样就可以在下载前先获取到文件的总大小。至于怎么设置不携带 BODY 信息，不同的网络框架不同，具体下节代码示例中说明。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-91495ddefb8b2eb7.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="断点续传2.png"></p><p>这是下载中断后，重启想要继续下载时发起的请求信息，请求头中指定了 <code>Range:bytes=12341380-</code> 表示本地已经下载了这么多，需要从这里开始继续往下下载。</p><p>响应头中返回了这部分的内容，并在 Content-Length 和 Content-Range 字段中给出了相关信息。</p><h1 id="代码示例" tabindex="-1"><a class="header-anchor" href="#代码示例" aria-hidden="true">#</a> 代码示例</h1><p>理论基础掌握了，那么下面就是来看看代码怎么实现。不管用什么语言，使用了什么网络框架，要写的代码都有两个部分：</p><ul><li><strong>文件处理操作</strong></li><li><strong>添加请求头信息操作</strong></li></ul><p>文件处理操作有两个关键点，一是获取文件大小，二是以追加的方式写文件。添加请求头的操作则是参考各自网络框架的指示即可。</p><p>下面介绍了三种示例，分别是 C++&amp;libcurl，Android&amp;HttpURLConnection，Android&amp;OkHttp。&amp;前面是语言，后面是所使用的网络框架。</p><h3 id="c-libcurl" tabindex="-1"><a class="header-anchor" href="#c-libcurl" aria-hidden="true">#</a> C++&amp;libcurl</h3><div class="language-C++ line-numbers-mode" data-ext="C++"><pre class="language-C++"><code>//引入libcurl库
#include &lt;curl\\curl.h&gt;
#pragma comment(lib,&quot;libcurl.lib&quot;) 
//文件操作库
#include &lt;sys/stat.h&gt;
#include &lt;fstream&gt;

char* mLocalFilePath;//下载到本地的文件

//获取已下载部分的大小，如果没有则返回0
curl_off_t getLocalFileLength()
{
	curl_off_t ret = 0;
	struct stat fileStat;
	ret = stat(mLocalFilePath, &amp;fileStat);
	if (ret == 0)
	{
		return fileStat.st_size;//返回本地文件已下载的大小
	}
	else
	{
		return 0;
	}
}

//下载前先发送一次请求，获取文件的总大小
double getDownloadFileLength()
{
	double rel = 0, downloadFileLenth = 0;
	CURL *handle = curl_easy_init();
	curl_easy_setopt(handle, CURLOPT_URL, mDownloadFileUrl);
	curl_easy_setopt(handle, CURLOPT_HEADER, 1);    //只需要header头
	curl_easy_setopt(handle, CURLOPT_NOBODY, 1);    //不需要body
	if (curl_easy_perform(handle) == CURLE_OK) {
		curl_easy_getinfo(handle, CURLINFO_CONTENT_LENGTH_DOWNLOAD, &amp;downloadFileLenth);
	}
	else {
		downloadFileLenth = -1;
	}
	rel = downloadFileLenth;
	curl_easy_cleanup(handle);
	return rel;
}

//文件下载
CURLcode downloadInternal()
{
    //1. 获取本地已下载的大小，有则断点续传
	curl_off_t localFileLenth = getLocalFileLength();
    //2. 以追加的方式写入文件
	FILE *file = fopen(mLocalFilePath, &quot;ab+&quot;);
	CURL* mHandler = curl_easy_init();
	if (mHandler &amp;&amp; file)
	{
         //3. 设置url
		curl_easy_setopt(mHandler, CURLOPT_URL, mDownloadFileUrl);
		//4. 设置请求头 Range 字段信息，localFileLength 不等于0时，值大小就表示从哪开始下载 
		curl_easy_setopt(mHandler, CURLOPT_RESUME_FROM_LARGE, localFileLenth);
		
		//5. 设置接收数据的处理函数和存放变量
		curl_easy_setopt(mHandler, CURLOPT_WRITEFUNCTION, writeFile);
		curl_easy_setopt(mHandler, CURLOPT_WRITEDATA, file);
		// 6. 发起请求
		CURLcode rel = curl_easy_perform(mHandler);
		fclose(file);
		return rel;
	}
	curl_easy_cleanup(mHandler);
	return CURLE_FAILED_INIT;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>writeFile 函数和下载进度通知的函数我都没贴，用过 libcurl 的应该都知道怎么写，或者网上搜一下，资料很多。上面就是将断点续传的几个关键函数贴出来，理清楚了即可。</p><h3 id="android-httpurlconnection" tabindex="-1"><a class="header-anchor" href="#android-httpurlconnection" aria-hidden="true">#</a> Android&amp;HttpURLConnection</h3><h3 id="android-okhttp" tabindex="-1"><a class="header-anchor" href="#android-okhttp" aria-hidden="true">#</a> Android&amp;OkHttp</h3><p>由于最近都在忙 C++ 的项目了，Android 暂时还没时间自己写个 demo 测试一下，所以先给几篇网上找的链接占个坑，后续抽个时间自己再来写个 demo。</p><p>之所以列了这两点，是因为感觉目前 Android 中网络框架大多都是用的 OkHttp 了，而下载文件还有很多都是用的 HttpURLConnection，所以这两个都想研究一下，怎么写断点续传。</p>`,19),v={href:"https://www.jianshu.com/p/2b82db0a5181",target:"_blank",rel:"noopener noreferrer"},h={href:"https://blog.csdn.net/cfy137000/article/details/54838608",target:"_blank",rel:"noopener noreferrer"},m=e("p",null,"两篇我都有大概过了下，其实断点续传原理不难，真的蛮简单的，所以实现上基本也大同小异，就是不同的网络框架的 api 用法不同而已。以及，如何维护本地已下载文件的大小的思路，有的是直接去获取文件对象查看，有的则是手动自己建个数据库维护。",-1);function b(g,_){const i=l("ExternalLinkIcon");return r(),s("div",null,[c,e("p",null,[n("具体可以参考这篇文章："),e("a",p,[n("MDN If-Range"),t(i)])]),u,e("p",null,[e("a",v,[n("Android多线程断点续传下载"),t(i)])]),e("p",null,[e("a",h,[n("Android使用OKHttp3实现下载(断点续传、显示进度)"),t(i)])]),m])}const f=d(o,[["render",b],["__file","讲讲断点续传那点事.html.vue"]]);export{f as default};
