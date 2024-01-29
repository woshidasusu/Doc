import{_ as a,r as d,o as l,c as r,a as n,b as i,e as s,d as t}from"./app-2pyCoCP5.js";const c={},v=t('<p>这次想来讲讲网络安全通信这一块，也就是网络层封装的那一套加密、解密，编码、解码的规则，不会很深入，但会大概将这一整块的讲一讲。</p><p>之所以想写这篇，是因为，最近被抽过去帮忙做一个 C++ 项目，在 Android 中，各种编解码、加解密算法官方都已经封装好了，我们要使用非常的方便，但在 C++ 项目中很多都要自己写。</p><p>然而，自己写是不可能的了，没这么牛逼也没这么多时间去研究这些算法，网上自然不缺少别人写好的现成算法。但不同项目应用场景自然不一样，一般来说，都需要对其进行修修改改才能拿到项目中来用。</p><p>踩的坑实在有点儿多，所以想写一篇来总结一下。好了，废话结束，开始正文。</p><h1 id="提问" tabindex="-1"><a class="header-anchor" href="#提问" aria-hidden="true">#</a> 提问</h1><p><strong>Q1: 你的 app 与后台各接口通信时有做身份校验吗？</strong></p><p><strong>Q2: 你的 app 与后台各接口通信的数据有涉及敏感数据吗？你是如何处理的？</strong></p><p><strong>Q3: MD5 了解过吗？</strong></p><p><strong>Q4: AES(16位密钥 + CBC + PKCS5Padding) 呢？</strong></p><p><strong>Q5: BASE64 呢？或者 UTF-8?</strong></p><h1 id="理论" tabindex="-1"><a class="header-anchor" href="#理论" aria-hidden="true">#</a> 理论</h1><h3 id="身份校验-md5-算法" tabindex="-1"><a class="header-anchor" href="#身份校验-md5-算法" aria-hidden="true">#</a> 身份校验 -- MD5 算法</h3><p>第一点：<strong>为什么需要身份校验？</strong></p><p>身份校验是做什么，其实也就是校验访问接口的用户合法性。说得白一点，也就是要过滤掉那些通过脚本或其他非正常 app 发起的访问请求。</p><p>试想一下，如果有人破解了服务端某个接口，然后写个脚本，模拟接口所需的各种参数，这样它就可以伪装成正常用户从这个接口拿到他想要的数据了。</p><p>更严重点的是，如果他想图摸不轨，向服务端发送了一堆伪造的数据，如果这些数据会对服务端造成损失怎么办。</p><p>所以，基本上服务端的接口都会有身份校验机制，来检测访问的对象是否合法。</p><p>第二点：<strong>MD5 算法是什么？</strong></p><p>通俗的讲，MD5 算法能对一串输入生成一串唯一的不可逆的 128 bit 的 0 和 1 的二进制串信息。</p><p>通常 app 都会在发起请求前根据自己公司所定义的规则做一次 MD5 计算，作为 token 发送给服务端进行校验。</p><p>MD5 有两个特性：唯一性和不可逆性。</p><p>唯一性可以达到防止输入被篡改的目的，因为一旦第三方攻击者劫持了这个请求，篡改了携带的参数，那么服务端只要再次对这些输入做一次 MD5 运算，比较计算的结果与 app 上传的 token 即可检测出输入是否有被修改。</p><p>不可逆的特点，则是就算第三方攻击者劫持了这次请求，看到了携带的参数，以及 MD5 计算后的 token，那么他也无法从这串 token 反推出我们计算 MD5 的规则，自然也就无法伪造新的 token，那么也就无法通过服务端的校验了。</p><p>第三点：<strong>理解 16 位和 32 位 MD5 值的区别</strong></p>',24),p={href:"http://www.cmd5.com/",target:"_blank",rel:"noopener noreferrer"},u=t(`<p><code>I am dasu</code> 和 <code>I&#39;m dasu</code> 看一下经过 MD5 运算后的结果：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-66628f61bc02489e.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="MD5.png"></p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-03059a86616e8391.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="MD5_.png"></p><p>首先确认一点，不同的输入，输出就会不一样，即使只做了细微修改，两者输出仍旧毫无规律而言。</p><p>另外，因为经过 MD5 计算后输出是 128 bit 的 0 和 1 二进制串，但通常都是用十六进制来表示比较友好，1个十六进制是 4 个 bit，128 / 4 = 32，所以常说的 32 位的 MD5 指的是用十六进制来表示的输出串。</p><p>那么，为什么还会有 16 位的 MD5 值？其实也就是嫌 32 位的数据太长了，所以去掉开头 8 位，末尾 8 位，截取中间的 16 位来作为 MD5 的输出值。</p><p>所以，MD5 算法的输出只有一种：128 bit 的二进制串，而通常结果都用十六进制表示而已，32 位与 16 位的只是精度的区别而已。</p><p>第四点：<strong>MD5 的应用</strong></p><p>应用场景很多：数字签名、身份校验、完整性（一致性）校验等等。</p><p>这里来讲讲 app 和服务端接口访问通过 MD5 来达到身份校验的场景。</p><p>app 持有一串密钥，这串密钥服务端也持有，除此外别人都不知道，因此 app 就可以跟服务端协商，两边统一下交互的时候都有哪些数据是需要加入 MD5 计算的，以怎样的规则拼接进行 MD5 运算的，这样一旦这些数据被三方攻击者篡改了，也能检查出来。</p><p>也就是说，密钥和拼接规则都是关键点，不可以泄漏出去。</p><h3 id="敏感数据加密-aes-base64" tabindex="-1"><a class="header-anchor" href="#敏感数据加密-aes-base64" aria-hidden="true">#</a> 敏感数据加密 -- AES + BASE64</h3><p>MD5 只能达到校验的目的，而 app 与服务端交互时，数据都是在网络中传输的，这些请求如果被三方劫持了，那么如果交互的数据里有一些敏感信息，就会遭到泄漏，存在安全问题。</p><p>当然，如果你的 app 与服务端的交互都是 HTTPS 协议了的话，那么自然就是安全的，别人抓不到包，也看不到信息。</p><p>如果还是基于 HTTP 协议的话，那么有很多工具都可以劫持到这个 HTTP 包，app 与服务端交互的信息就这样赤裸裸的展示在别人面前。</p><p>所以，通常一些敏感信息都会经过加密后再发送，接收方拿到数据后再进行解密即可。</p><p>而加解密的世界很复杂，对称加密、非对称加密，每一种类型的加解密算法又有很多种，不展开了，因为实在展开不了，我门槛都没踏进去，实在没去深入学习过，目前只大概知道个流程原理，会用的程度。</p><p>那么，本篇就介绍一种网上很常见的一整套加解密、编解码流程：</p><h4 id="utf-8-aes-base64" tabindex="-1"><a class="header-anchor" href="#utf-8-aes-base64" aria-hidden="true">#</a> UTF-8 + AES + BASE64</h4><p>UTF-8 和 BASE64 都属于编解码，AES 属于对称加密算法。</p><p>信息其实本质上是由二进制串组成，通过各种不同的编码格式，来将这段二进制串信息解析成具体的数据。比如 ASCII 编码定义了一套标准的英文、常见符号、数字的编码；UTF-8 则是支持中文的编码。目前大部分的 app 所使用的数据都是基于 UTF-8 格式的编码的吧。</p><p>AES 属于对称加密算法，对称的意思是说，加密方和解密方用的是同一串密钥。信息经过加密后会变成一串毫无规律的二进制串，此时再选择一种编码方式来展示，通常是 BASE64 格式的编码。</p><p>BASE64 编码是将所有信息都编码成只用大小写字母、0-9数字以及 + 和 / 64个字符表示，所有称作 BASE64。</p><p>不同的编码所应用的场景不同，比如 UTF-8 倾向于在终端上呈现各种复杂字符包括简体、繁体中文、日文、韩文等等数据时所使用的一种编码格式。而 BASE64 编码通常用于在网络中传输较长的信息时所使用的一种编码格式。</p><p>基于以上种种，目前较为常见的 app 与服务端交互的一套加解密、编解码流程就是：UTF-8 + AES + BASE64</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-e12adc004153766d.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="加解密流程.png"></p><p>上图就是从 app 端发数据给服务端的一个加解密、编解码过程。</p><p>需要注意的是，因为 AES 加解密时输入和输出都是二进制串的信息，因此，在发送时需先将明文通过 UTF-8 解码成二进制串，然后进行加密，再对这串二进制密文通过 BASE64 编码成密文串发送给接收方。</p><p>接收方的流程就是反着来一遍就对了。</p><h1 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h1><p>理论上基本清楚了，那么接下去就是代码实现了，Android 项目中要实现很简单，因为 JDK 和 SDK 中都已经将这些算法封装好了，直接调用 api 接口就可以了。</p><h3 id="java" tabindex="-1"><a class="header-anchor" href="#java" aria-hidden="true">#</a> Java</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>public class EncryptDecryptUtils {
    private static final String ENCODE = &quot;UTF-8&quot;;
    //AES算法加解密模式有多种，这里选择 CBC + PKCS5Padding 模式，CBC 需要一个AES_IV偏移量参数，而AES_KEY 是密钥。当然，这里都是随便写的，这些信息很关键，不宜泄露
    private static final String AES = &quot;AES&quot;;
    private static final String AES_IV = &quot;aaaaaaaaaaaaaaaa&quot;;
    private static final String AES_KEY = &quot;1111111111111111&quot;;//16字节，128bit，三种密钥长度中的一种
    private static final String CIPHER_ALGORITHM = &quot;AES/CBC/PKCS5Padding&quot;;

    /**
    * AES加密后再Base64编码，输出密文。注意AES加密的输入是二进制串，所以需要先将UTF-8明文转成二进制串
    */
    public static String doEncryptEncode(String content) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(AES_KEY.getBytes(ENCODE), AES);
        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, new IvParameterSpec(AES_IV.getBytes(ENCODE)));
        //1. 先获取二进制串，再进行AES（CBC+PKCS5Padding)模式加密
        byte[] result = cipher.doFinal(content.getBytes(ENCODE));
        //2. 将二进制串编码成BASE64串
        return Base64.encodeToString(result, Base64.NO_WRAP);
    }

    /**
    * Base64解码后再进行AES解密，最后对二进制明文串进行UTF-8编码输出明文串
    */
    public static String doDecodeDecrypt(String content) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(AES_KEY.getBytes(ENCODE), AES);
        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, new IvParameterSpec(AES_IV.getBytes(ENCODE)));
        //1. 先将BASE64密文串解码成二进制串
        byte[] base64 = Base64.decode(content, Base64.NO_WRAP);
        //2. 再将二进制密文串进行AES(CBC+PKCS5Padding)模式解密
        byte[] result = cipher.doFinal(base64);
        //3. 最后将二进制的明文串以UTF-8格式编码成字符串后输出
        return new String(result, Charset.forName(ENCODE)); 
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Java 的实现代码是不是很简单，具体算法的实现都已经封装好了，就是调一调 api 的事。</p><p>这里需要稍微知道下，AES 加解密模式分很多种，首先，它有三种密钥形式，分别是 128 bit，192 bit，256 bit，注意是 bit，Java 中的字符串每一位是 1B = 8 bit，所以上面例子中密钥长度是 16 位的字符串。</p><p>除了密钥外，AES 还分四种模式的加解密算法：ECB，CBC，CFB，OFB，这涉及到具体算法，我也不懂，就不介绍了，清楚上面是使用了 CBC 模式就可以了。</p><p>最后一点，使用 CBC 模式进行加密时，是对明文串进行分组加密的，每组的大小都一样，因此在分组时就有可能会存在最后一组的数量不够的情况，那么这时就需要进行填充，而这个填充的概念就是 PKCS5Padding 和 PKCS7Padding 两种。</p><p>这两种的填充规则都一样，具体可看其他的文章，区别只在于分组时规定的每组的大小。在PKCS5Padding中，明确定义 Block 的大小是 8 位，而在 PKCS7Padding 定义中，对于块的大小是不确定的，可以在 1-255 之间。</p><p>稍微了解下这些就够了，如果你不继续往下研究 C++ 的写法，这些不了解也没事，会用就行。</p><h3 id="c" tabindex="-1"><a class="header-anchor" href="#c" aria-hidden="true">#</a> C++</h3><p>c++ 坑爹的地方就在于，这整个流程，包括 UTF-8 编解码、AES 加解密、BASE64 编解码都得自己写。</p><p>当然，不可能自己写了，网上轮子那么多了，但问题就在于，因为 AES 加解密模式太多了，网上的资料大部分都只是针对其中一种进行介绍，因此，如果不稍微了解一下相关原理的话，就无从下手进行修改了。</p><p>我这篇，自然也只是介绍我所使用的模式，如果你刚好跟我一样，那也许可以帮到你，如果跟你不一样，至少我列出了资料的来源，整篇下来也稍微讲了一些基础性的原理，掌握这些，做点儿修修补补应该是可以的。</p><p>贴代码前，先将我所使用的模式列出来：</p><p><strong>UTF-8 + AES(16位密钥 + CBC + PKCS5Padding) + BASE64</strong></p><p>其实这些都类似于工具类，官方库没提供，那网上找个轮子就好了，都是一个 h 和 cpp 文件而已，复制粘贴下就可以了。重点在于准备好了这些工具类后，怎么用，怎么稍微修改。</p><p>如果你不想自己网上找，那下面我已经将相关链接都贴出来了，去复制粘贴下就可以了。</p>`,48),m={href:"https://blog.csdn.net/yinshi_blog/article/details/6731809",target:"_blank",rel:"noopener noreferrer"},b={href:"https://blog.csdn.net/csdn49532/article/details/50686222",target:"_blank",rel:"noopener noreferrer"},o=t(`<p>我最开始就是拿的第二篇来用的，然后才发现他所采用的模式是：AES(16位密钥 + CBC + PKCS7Padding) + BASE64</p><p>也就是说，他的例子中不支持中文的加解密，而且填充模式采用的是 PKCS7Padding，跟我的不一致。一开始我也不了解相关原理基础，怎么调都调不出结果，无奈只能先去学习下原理基础。</p><p>还好后面慢慢的理解了，也懂得该改哪些地方，也增加了 UTF-8 编解码的处理。下面贴的代码中注释会写得很清楚，整篇看下来，我相信，就算你模式跟我的也不一样，你的密钥是24位的、32位的，没关系，稍微改一改就可以了。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>//EncryptDecryptUtils.h
#pragma once
#include &lt;string&gt;

using namespace std;

#ifndef AES_INFO
#define AES_INFO

#define AES_KEY &quot;1111111111111111&quot;  //AES 16B的密钥
#define AES_IV &quot;aaaaaaaaaaaaaaaa&quot; //AES CBC加解密模式所需的偏移量

#endif 

class EncryptDecryptUtils {
public:
    //解码解密
	static string doDecodeDecrypt(string content);
	//加密编码
    static string doEncryptEncode(string content);
	EncryptDecryptUtils();
    ~EncryptDecryptUtils();
private:
    //去除字符串中的空格、换行符
	static string removeSpace(string content);
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以下才是具体实现，其中在头部 include 的 AES.h，Base64.h，UTF8.h 需要先从上面给的博客链接中将相关代码复制粘贴过来。这些文件基本都是作为工具类使用，不需要进行改动。可能需要稍微改一改的就只是 AES.h 文件，因为不同的填充模式需要改一个常量值。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>//EncryptDecryptUtils.cpp
#include &quot;EncryptDecryptUtils.h&quot;
#include &quot;AES.h&quot;
#include &quot;Base64.h&quot;
#include &quot;UTF8.h&quot;

EncryptDecryptUtils::EncryptDecryptUtils()
{
}
~EncryptDecryptUtils::EncryptDecryptUtils()
{
}

/**
* 流程：服务端下发的BASE64编码的密文字符串 -&gt; 去除字符串中的换行符 -&gt; BASE64解码 -&gt; AES::CBC模式解密 -&gt; 去掉AES::PKCS5Padding 填充 -&gt; UTF-8编码 -&gt; 明文字符串
*/
string EncryptDecryptUtils::doDecodeDecrypt(string content)
{	
	//1.去掉字符串中的\\r\\n换行符
 	string noWrapContent = removeSpace(string);
	//2. Base64解码
	string strData = base64_decode(noWrapContent);
	size_t length = strData.length();

    //3. new些数组，给解密用
	char *szDataIn = new char[length + 1];
	memcpy(szDataIn, strData.c_str(), length + 1);
	char *szDataOut = new char[length + 1];
	memcpy(szDataOut, strData.c_str(), length + 1);

	//4. 进行AES的CBC模式解密
	AES aes;
    //在这里传入密钥，和偏移量，以及指定密钥长度和iv长度，如果你的密钥长度不是16字节128bit，那么需要在这里传入相对应的参数。
	aes.MakeKey(string(AES_KEY).c_str(), string(AES_IV).c_str(), 16, 16);
    //这里参数有传入指定加解密的模式，AES::CBC，如果你不是这个模式，需要传入相对应的模式，源码中都有注释说明
	aes.Decrypt(szDataIn, szDataOut, length, AES::CBC);

	//5.去PKCS5Padding填充:解密后需要将字符串中填充的去掉，根据填充规则进行去除，感兴趣可去搜索相关的填充规则
	if (0x00 &lt; szDataOut[length - 1] &lt;= 0x16)
	{
		int tmp = szDataOut[length - 1];
		for (int i = length - 1; i &gt;= length - tmp; i--)
		{
			if (szDataOut[i] != tmp)
			{
				memset(szDataOut, 0, length);
				break;
			}
			else
				szDataOut[i] = 0;
		}
	}

	//6. 将二进制的明文串转成UTF-8格式的编码方式，输出
	string srcDest = UTF8_To_string(szDataOut);
	delete[] szDataIn;
	delete[] szDataOut;
	return srcDest;
}

/**
* 流程：UTF-8格式的明文字符串 -&gt; UTF-8解码成二进制串 -&gt; AES::PKCS5Padding 填充 -&gt; AES::CBC模式加密 -&gt; BASE64编码 -&gt; 密文字符串
*/
string EncryptDecryptUtils::doEncryptEncode(string content)
{
	//1. 先获取UTF-8解码后的二进制串
	string utf8Content = string_To_UTF8(content);
	size_t length = utf8Content.length();
	int block_num = length / BLOCK_SIZE + 1;
	
    //2. new 些数组供加解密使用
	char* szDataIn = new char[block_num * BLOCK_SIZE + 1];
	memset(szDataIn, 0x00, block_num * BLOCK_SIZE + 1);
	strcpy(szDataIn, utf8Content.c_str());

	//3. 进行PKCS5Padding填充：进行CBC模式加密前，需要填充明文串，确保可以分组后各组都有相同的大小。
	// BLOCK_SIZE是在AES.h中定义的常量，PKCS5Padding 和 PKCS7Padding 的区别就是这个 BLOCK_SIZE 的大小，我用的PKCS5Padding，所以定义成 8。如果你是使用 PKCS7Padding，那么就根据你服务端具体大小是在 1-255中的哪个值修改即可。
    int k = length % BLOCK_SIZE;
	int j = length / BLOCK_SIZE;
	int padding = BLOCK_SIZE - k;
	for (int i = 0; i &lt; padding; i++)
	{
		szDataIn[j * BLOCK_SIZE + k + i] = padding;
	}
	szDataIn[block_num * BLOCK_SIZE] = &#39;\\0&#39;;

	char *szDataOut = new char[block_num * BLOCK_SIZE + 1];
	memset(szDataOut, 0, block_num * BLOCK_SIZE + 1);

	//4. 进行AES的CBC模式加密
	AES aes;
     //在这里传入密钥，和偏移量，以及指定密钥长度和iv长度，如果你的密钥长度不是16字节128bit，那么需要在这里传入相对应的参数。
	aes.MakeKey(string(AES_KEY).c_str(), string(AES_IV).c_str(), 16, 16);
    //这里参数有传入指定加解密的模式，AES::CBC，如果你不是这个模式，需要传入相对应的模式，源码中都有注释说明
	aes.Encrypt(szDataIn, szDataOut, block_num * BLOCK_SIZE, AES::CBC);
	
    //5. Base64编码
	string str = base64_encode((unsigned char*)szDataOut, block_num * BLOCK_SIZE);
	delete[] szDataIn;
	delete[] szDataOut;
	return str;
}

//去除字符串中的空格、换行符
string EncryptDecryptUtils::formatText(string src)
{
	int len = src.length();
	char *dst = new char[len + 1];
	int i = -1, j = 0;
	while (src[++i])
	{
		switch (src[i])
		{
		case &#39;\\n&#39;:
		case &#39;\\t&#39;:
		case &#39;\\r&#39;:
			continue;
		}
		dst[j++] = src[i];
	}
	dst[j] = &#39;\\0&#39;;
	string rel = string(dst);
	delete dst;
	return rel;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再列个在线验证 AES 加解密结果的网站，方便调试：</p>`,7),g={href:"http://www.seacha.com/tools/aes.html",target:"_blank",rel:"noopener noreferrer"},E=n("p",null,[n("strong",null,"Java 实现那么方便，为什么还需要用 C++ 的呢？")],-1),h=n("p",null,"想一想，密钥信息那么重要，你要放在哪？像我例子那样直接写在代码中？那只是个例子，别忘了，app 混淆的时候，字符串都是不会参与混淆的，随便反编译下你的 app，密钥就暴露给别人了。",-1),S=n("p",null,"那么，有其他比较好的方式吗？我只能想到，AES 加解密相关的用 C++ 来写，生成个 so 库，提供个 jni 接口给 app 层调用，这样密钥信息就可以保存在 C++ 中了。",-1),_=n("p",null,"也许你会觉得，哪有人那么闲去反编译 app，而且正在写的 app 又没有什么价值让别人反编译。",-1),C=n("p",null,"emmm，说是这么说，但安全意识还是要有的，至少也要先知道有这么个防护的方法，以及该怎么做，万一哪天你写的 app 就火了呢？",-1);function D(A,B){const e=d("ExternalLinkIcon");return l(),r("div",null,[v,n("p",null,[i("网上有很多在线进行 MD5 计算的工具，如 "),n("a",p,[i("http://www.cmd5.com/"),s(e)]),i("，这里演示一下，尝试一下分别输入：")]),u,n("p",null,[n("a",m,[i("c++ string、UTF8相互转换方法"),s(e)])]),n("p",null,[n("a",b,[i("C++使用AES+Base64算法对文本进行加密"),s(e)])]),o,n("p",null,[n("a",g,[i("http://www.seacha.com/tools/aes.html"),s(e)])]),E,h,S,_,C])}const K=a(c,[["render",D],["__file","加密解密那点事.html.vue"]]);export{K as default};
