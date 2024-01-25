import{_ as d,r as l,o as s,c as t,a as e,b as i,e as n,d as r}from"./app-XVH6qKTA.js";const p={},o=e("p",null,"今天想来分享下，如何一步步自己发布一个开源库到 JCenter",-1),u=e("p",null,"这方面的博客网上已经特别多了，所以本篇并不打算仅仅只是记录流程步骤而已，而是尽可能讲清楚，为什么需要有这个步骤，让大伙知其然的同时还知其所以然，那么掌握就会更深刻一点，所以本篇篇幅会很长。另外，本篇是参考、引用、借鉴了以下文章中的内容：",-1),c={href:"https://inthecheesefactory.com/blog/how-to-upload-library-to-jcenter-maven-central-as-dependency/en",target:"_blank",rel:"noopener noreferrer"},b=r('<p>虽然是英文版，但有四级基础就可以基本看懂了，文章写得很全，很详</p><p>实在不想看英文版的，国内有中文版翻译，在***《Android高级进阶》***的第 9 章有完整版的中文翻译</p><h1 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h1><p>首先得想清楚一件事：<strong>是不是只有写得很牛的开源库，或者只有牛人、大神才可以发布开源库到 JCenter呢？</strong></p><p>可能有些人觉得自己不是大神，自己写不出啥牛逼的开源库，所以不用发布到 JCenter 上给别人用。所以，得先想清楚，你为什么要发布一个开源库到 JCenter 上去？</p><p>学习也行；分享也行；自己用也行；总之，没什么规定说只有大神才可以发布；</p><p>其实，这里之所以叫做开源库，是因为发布到 JCenter 上之后，大伙都可以使用的原因。我更喜欢在《Android高级进阶》里的说法：函数库</p><p>我是带着这么一种想法的：</p><p>作为一个懒人，一些可以在多个项目中使用的公共基础模块，实在不想每次新建项目都手动去复制粘贴，或者手动去导 Module，所以就想着将这些公共基础模块打包发布到 JCenter，以后新建项目时只要配置下 build.gradle 就可以了</p><p>Q：你问我为啥不上传到私服？</p><p>A：没钱</p><p>Q：你问我那不怕代码被盗用？</p><p>A：又不是什么牛逼的开源库，就是一些基本的公共模块如工具类，网络层封装等等，别人想用，我高兴还来不及，怕啥</p><p>Q：你问我那这些基础模块为啥不用别人开源的，还要自己造轮子？</p><p>A：自己的用着顺手，自己的想怎么改就可以怎么改</p><p>Q：你问我那不怕发布的开源库代码太槽糕，被人骂？</p><p>A：老哥，我又不是大神，我要不写这篇博客，都没人知道我发布了个开源库，反正就我自己使用，怕啥</p><p>Q：你问我...</p><p>A：老哥，别问了，赶快去发布一个试试看吧，万一以后你就是大神了呢，省得到时再现学</p><p>好了，接下去就开始讲发布的步骤了</p><h1 id="步骤" tabindex="-1"><a class="header-anchor" href="#步骤" aria-hidden="true">#</a> 步骤</h1><p>先盗用开头分享的链接里的一张图</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-3cb9b85a3c2d7efb.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="流程.png"></p><p>整个流程其实就是上图中介绍的这样，先本地打包成 jar 或 aar 文件，然后上传到 bintray 自己的仓库中，最后发布到 jcenter 上去就可以了。</p><p>除了第一步是在本地自己操作外，剩下的操作都是在网页上移移鼠标点一点就可以了</p><h3 id="第-0-步-jcenter-网址" tabindex="-1"><a class="header-anchor" href="#第-0-步-jcenter-网址" aria-hidden="true">#</a> 第 0 步：JCenter 网址</h3>',26),v={href:"https://bintray.com/",target:"_blank",rel:"noopener noreferrer"},m={href:"https://jcenter.bintray.com/",target:"_blank",rel:"noopener noreferrer"},g=e("p",null,"为什么会有两个呢？那是因为，第一个是提供给我们可 ui 交互操作的网站，注册账号、配置仓库、发布等等操作都是在第一个网址上面操作，我们也只要记住第一个网站就可以了",-1),h=e("p",null,"第二个是存放这些开源库的网址，如果你想手动下载某个开源库的 jar，那么你可以直接在第二个网址后面加上开源库的路径即可",-1),y={href:"https://www.jianshu.com/p/28bb90e565de",target:"_blank",rel:"noopener noreferrer"},_=r(`<p>但现在新版的 Android Studio 已经改成默认配置 JCenter 作为开源库的来源了，举个例子：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>compile &#39;com.squareup.okhttp:okhttp:2.4.0&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果想手动下载 okhttp 的 jar 包，那么就是访问：https://jcenter.bintray.com/com/squareup/okhttp/okhttp/2.4.0/</p><p>以此类推</p><h3 id="第-1-步-注册账号-创建仓库" tabindex="-1"><a class="header-anchor" href="#第-1-步-注册账号-创建仓库" aria-hidden="true">#</a> 第 1 步：注册账号 &amp; 创建仓库</h3><h5 id="_1-1-注册账号" tabindex="-1"><a class="header-anchor" href="#_1-1-注册账号" aria-hidden="true">#</a> 1.1 注册账号</h5>`,6),f={href:"https://bintray.com/",target:"_blank",rel:"noopener noreferrer"},x=r(`<h5 id="_1-2-创建仓库" tabindex="-1"><a class="header-anchor" href="#_1-2-创建仓库" aria-hidden="true">#</a> 1.2 创建仓库</h5><p>登录账号后，跟 Github 操作类似，bintray 允许你在网站上创建自己的仓库，可 public，可 private。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-ba409ef729313a17.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="创建模块.png"></p><p>创建仓库的操作跟 Github 是类似的，我就不演示了，我这里创建了一个叫 base-module 的空仓库。</p><p>接下去就跟 Github 的概念有点不一样了，在 Github 上我们一个仓库通常对应一个具体的项目，本地项目长啥样，Github 上的仓库基本也就长啥样。</p><p>在 bintray 这里，一个仓库我更倾向于把它就理解成仓库的意思，也就是作为容器的作用。创建完一个空仓库后，页面右下角会有一个 <strong>Add New Package</strong> 按钮，也就是仓库下面还有一层 package 的概念。</p><p>一个 package 就是一个可发布到 JCenter 上的开源包，而发布到 JCenter 上的内容是一些 pom，aar，jar 之类的文件，并不是整个项目。所以我们需要先创建一个 package 来准备给本地需要打包发布的 module 生成 pom，aar 等文件的存放地了。</p><h3 id="第-2-步-配置本地-gradle-脚本插件" tabindex="-1"><a class="header-anchor" href="#第-2-步-配置本地-gradle-脚本插件" aria-hidden="true">#</a> 第 2 步：配置本地 gradle 脚本插件</h3><p>上传到 Github 上的是整个项目的源码，而上传到 bintray 上的是 pom， jar，arr 这类文件。</p><p>所以，在发布开源库到 JCenter 之前，我们需要先在本地将要发布的 Module 打包成 jar, aar。那么，在本地要怎么操作呢？就像 Google 提供了 Android Gradle 插件来方便开发者直接对项目进行编译一样，bintray 也提供了相对应的 gradle 插件，来方便我们直接在本地打包成 jar。</p><p>同样，Github 支持通过 Git 来将本地项目上传到 Github 上，而 bintray 也提供了对应的 gradle 脚本来让开发者将本地打包后的 jar 等上传至 bintray 网站上的仓库中。</p><p>这就是为什么我们需要在本地配置一些 gradle 插件的原因，一者方便开发者对项目进行编译、打包成所需的文件；二者通过它提供的桥梁上传至 bintray 网站上的仓库。</p><h5 id="_2-1-配置-gradle-插件地址" tabindex="-1"><a class="header-anchor" href="#_2-1-配置-gradle-插件地址" aria-hidden="true">#</a> 2.1 配置 gradle 插件地址</h5><p>使用 Android Gradle 插件，需要在根项目的 build.gradle 文件中配置：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>dependencies {
	classpath &#39;com.android.tools.build:gradle:2.3.3&#39;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样的道理，要使用 bintray gradle 插件，同样也得在<strong>根项目的 build.gradle 文件中配置</strong>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> dependencies {
	//Android Gradle 插件
	classpath &#39;com.android.tools.build:gradle:2.3.3&#39;
	//bintray 插件
	classpath &#39;com.jfrog.bintray.gradle:gradle-bintray-plugin:1.4&#39;
	classpath &#39;com.github.dcendents:android-maven-gradle-plugin:1.4.1&#39;
	//android-maven-gradle-plugin:1.3版本有bug，网上很多例子用的这个版本，编译的时候可能会出错，改一下版本就好了
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上，只是配置了插件的路径，那么使用插件的地方肯定就是在对应 module 下的 build.gradle 文件中了</p><h5 id="_2-2-使用-gradle-插件" tabindex="-1"><a class="header-anchor" href="#_2-2-使用-gradle-插件" aria-hidden="true">#</a> 2.2 使用 gradle 插件</h5><p>gradle 插件使用的地方都是在<strong>每个具体 module 下的 build.gradle 文件</strong>中：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apply plugin: &#39;com.android.library&#39;

android {
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上是常见的 build.gradle 文件，这表示的是，将会使用 Android gradle 插件中 id 为 com.android.library 的 gradle 插件来将该 Module 构建成一个 library，而 build.gradle 里其他配置项如 android 等则表示构建该项目所需的一些配置，这是我对 gradle 的理解（不知道对不对）。</p><p>同样，因为上传到 bintray 的是一些 pom, jar 文件，所以我们也需要在这个 build.gradle 中使用 bintray 提供的插件来编译，打包项目：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//切记：以下代码必须放在 build.gradle 文件末尾
apply from: &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/installv1.gradle&#39;
apply from: &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/bintrayv1.gradle&#39;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上 apply from 指的是该 module 需要使用一个存储于网上的 gradle 脚本文件来根据各种配置项来编译、打包项目。</p><p>之所以这个 gradle 脚本文件存储在网络上，纯粹是因为 bintray 担心我们不知道怎么使用它提供的 gradle 插件来生成 pom, jar 等文件，所以连模板脚本都提供给我们了（这是我的理解）。</p><p>所以，你可以将 apply from 后面的链接在网页上输入看看，你会看到以下脚本：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//以下代码大概瞄一眼即可，不用细看
apply plugin: &#39;com.github.dcendents.android-maven&#39;

group = publishedGroupId //开源库的 groupId

install {
    repositories.mavenInstaller {
        // This generates POM.xml with proper parameters
        pom {
            project {
                packaging &#39;aar&#39;//将项目打包成 aar
                groupId publishedGroupId
                artifactId artifact

                // Add your description here
                name libraryName
                description libraryDescription
                url siteUrl

                // Set your license
                licenses {
                    license {
                        name licenseName
                        url licenseUrl
                    }
                }
                developers {
                    developer {
                        id developerId
                        name developerName
                        email developerEmail
                    }
                }
                scm {
                    connection gitUrl
                    developerConnection gitUrl
                    url siteUrl

                }
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一个将项目打包成 arr，并生成项目的 pom.xml 文件的脚本，这些文件都是要上传到 bintray 网站上你的仓库中去的。</p><p>所以，如果你知道使用 bintray gradle 插件都需要进行哪些配置的话，你完全可以自己在 build.gradle 将上述脚本中所需的配置直接写上就好，不用使用 apply from；或者，你根据 apply from 后面的链接将脚本代码复制粘贴到 build.grale 文件中也行。</p><p>同样的道理，另外一个 apply from 所提供的 gradle 脚本内容我就不截图了，那个脚本的作用是用于将生成的 pom, aar 等文件上传至你的 bintray 网站的仓库中去的。</p><p>也就是说，<strong>bintray 提供了两个 gradle 插件，一个用于将本地项目编译，打包成 aar，并生成所需的 pom.xml 等文件；另一个用于将生成的这些文件都上传至你的 bintray 仓库中去。同时，bintray 还提供了两份脚本配置模板，如果不懂得怎么使用，就参照这两份模板来就行了</strong>。</p><h5 id="_2-3-修改-gradle-脚本模板文件中的配置项" tabindex="-1"><a class="header-anchor" href="#_2-3-修改-gradle-脚本模板文件中的配置项" aria-hidden="true">#</a> 2.3 修改 gradle 脚本模板文件中的配置项</h5><p>既然提供的仅仅是模板文件，那么具体的配置项肯定是需要我们根据自己的实际项目来进行配置的。有两种方式：</p><ul><li>不使用 apply from，直接将脚本模板文件里的代码拷贝至 build.gradle 中，然后根据具体项目，手动修改每一个配置项（略麻烦，不推荐）</li><li>脚本模板文件中，每一个配置项都使用了对应的变量来配置，那么我们只需在 build.gradle 中声明这些变量，并对变量进行赋值，就可以了</li></ul><p>Android Gradle 编译项目的用法其实就是第一种，但由于我们对 android 项目编译要配置的项都挺熟悉了，加上 Android Studio 会自动生成一些必要的配置项，所以并不麻烦。但由于对 bintray gradle 插件的配置项不熟，个人不建议这里也使用这种方式。</p><p>而第二种方式，如果你有兴趣再去网上搜索下其他的这类教程的文章，可能你会发现，很多文章都会让你在 build.gradle 文件中写这么一段代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//下一步会具体来看每个配置项含义
ext {
    bintrayRepo = &#39;maven&#39;
    bintrayName = &#39;fb-like&#39;

    publishedGroupId = &#39;com.inthecheesefactory.thecheeselibrary&#39;
    libraryName = &#39;FBLike&#39;
    artifact = &#39;fb-like&#39;

    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在可以理解，为什么他们要你写这段代码了吧。因为 bintray 提供的脚本模板文件中，对它所需的配置项都使用了相对应的变量，那么我们如果直接使用脚本模板文件，就需要对这些变量进行声明并赋值，也就是说在 ext 中 声明的 bintrayRepo, libraryName 等等这些变量，其实都是因为它们在 bintray 提供的脚本模板文件中被使用了。</p><p>另外，由于 gradle 脚本是按顺序执行代码，所以声明这些变量的代码必须在 apply from 代码之前，否则如果先执行了 apply from，会报找不到相对应的变量错误。</p><p>还有一点，bintray gradle 插件源码我没去深入看，但要让项目生成对应的 pom 项目说明文件，以及打包成 aar，所以我猜测，这表明 bintray gradle 插件内部除了脚本模板上所列的各种配置项外，还需要 Android Gradle 插件的一些配置项，比如 build.gradle 里的 android 块配置项。</p><p>这也是为什么其他文章里提到说，要将 apply from 这几行代码放在 build.gradle 最后的原因。因为 gradle 脚本是按顺序执行代码，而 bintray gradle 插件的运行又依赖于一些 android 配置项，所以如果将 apply from 放在开头的话，会报找不到一些变量的错误。</p><h5 id="_2-3-2-将变量的声明赋值代码写在单独的脚本文件中-可选" tabindex="-1"><a class="header-anchor" href="#_2-3-2-将变量的声明赋值代码写在单独的脚本文件中-可选" aria-hidden="true">#</a> 2.3.2 将变量的声明赋值代码写在单独的脚本文件中（可选）</h5><p>如果不想让 build.gradle 文件中有太多跟编译项目本身无关的代码，那么可以将跟 bintray gradle 插件相关的代码都单独写在另外一个 gradle 文件中，然后在该 build.gradle 开头通过 apply from 将那个 gradle 文件应用进来即可，有点类似于 import 的概念。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//build.gradle 文末
//bintray-config.gradle 就是跟 build.gradle 同层目录下的一个 gradle 文件，里面就是单纯将 exe {} 这块代码里的变量声明和赋值拷贝至 bintray-config.gradle 文件里
apply from: &#39;bintray-config.gradle&#39;
apply from: &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/bintrayv1.gradle&#39;
apply from: &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/installv1.gradle&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="第-3-步-设置-gradle-插件中各种配置项" tabindex="-1"><a class="header-anchor" href="#第-3-步-设置-gradle-插件中各种配置项" aria-hidden="true">#</a> 第 3 步：设置 gradle 插件中各种配置项</h3><p>第 2 步在于配置各种所需的 gradle 插件以及如何使用，至于脚本模板的每一行代码，感兴趣的可以去深究，但不去管也么事，反正大概知道两个脚本都干了什么事就行，怎么干的就不用去管了。</p><p>那么接下去就该了解一下，都需要对项目进行哪些属性的配置，这些插件才可以正常运行，才可以正常的将开源库上传至 bintray 上的仓库去：</p><h5 id="_3-1-各种基本配置项" tabindex="-1"><a class="header-anchor" href="#_3-1-各种基本配置项" aria-hidden="true">#</a> 3.1 各种基本配置项</h5><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ext {
    //bintray 网站上你创建的仓库的名字（必配项）
    bintrayRepo = &#39;base-module&#39;
    //在这个仓库下的 package name（必配项）
    bintrayName = &#39;tv&#39;
    //以上两项均只是指向 bintray 网站上你的仓库和仓库下的package

    //publishedGroupId:artifact:libraryVersion 构成你开源库的唯一路径
    //例如：com.dasu.tv:tv:0.0.1，在build.gradle里就可以根据这个路径来compile依赖库了
    //以下三项均是必配项
    publishedGroupId = &#39;com.dasu.tv&#39;
    artifact = &#39;tv&#39;
    libraryVersion = &#39;0.0.1&#39;

    //以下三项只是对开源库的描述（应该不是必配项吧，没尝试过）
    libraryName = &#39;tv&#39;
    libraryDescription = &#39;dasu 封装的常用，可公用的 tvui 库&#39;
    siteUrl = &#39;https://github.com/woshidasusu/base-module/tree/master/tv&#39;

    //开源库对应的 github 地址，不知道可不可以不配，应该也是必配
    gitUrl = &#39;https://github.com/woshidasusu/base-module.git&#39;

    //开发者信息，也是必配的吧
    developerId = &#39;dasu&#39;
    developerName = &#39;dasu&#39;
    developerEmail = &#39;295207731@qq.com&#39;

    //这部分可以不用改，我也不大懂这些开源协议，但应该都一样
    licenseName = &#39;The Apache Software License, Version 2.0&#39;
    licenseUrl = &#39;http://www.apache.org/licenses/LICENSE-2.0.txt&#39;
    allLicenses = [&quot;Apache-2.0&quot;]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就像 build.gradle 文件一样，有些属性必须配置后项目才可以正常编译，运行。要使用 bintray gradle 插件来进行生成对应的 pom，aar 文件，上传到 bintray 仓库等功能，也必须进行一些属性配置才行。</p><p>总之，对应在 bintray 仓库的信息肯定需要配置，发布到 JCenter 后的唯一路径也需要配置，开发者信息当然也需要，其他还需要一些开源库的描述信息以及开源协议信息。</p><h5 id="_3-2-配置身份验证信息-敏感信息" tabindex="-1"><a class="header-anchor" href="#_3-2-配置身份验证信息-敏感信息" aria-hidden="true">#</a> 3.2 配置身份验证信息（敏感信息）</h5><p>经常使用 Github 肯定还觉得需要关键的用户跟秘钥信息是不是，否则使用 Git 上传项目到 Github 上时没办法进行身份验证。</p><p>同样的道理，要将经过 bintray gradle 插件生成的 pom，aar 等上传到 bintray 仓库，同样需要进行身份验证，那么就配置一些用户名和 key 的关键信息，但这些信息又极其敏感，隐私，所以只能配置在本地文件中。</p><p>如果不修改那两份脚本模板文件的话，那么这些信息就需要配置在项目的根目录下面的 <strong>local.properties</strong> 文件中：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//根目录下的local.properties文件 
bintray.user= woshidasusu
bintray.apikey= XXXXXXX
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>bintray.user 就是你的 bintray 网站的登录账号，如果你用 Github 授权登录，就是你的 Github 账号。</p><p>bindtray.apikey 需要进入 bintray 网站你的设置里去查看：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-807b30b8f74afb82.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="APIkey.png"></p><p>可能你在看别人写的教程文章时，会发现他们在这里还配置了一个</p><p>bintray.gpg.password=YOUR_GPG_PASSWORD</p><p>这个应该是用于将 bintray 上的开源库同步发布到 mavenCentral 仓库里的验证信息吧，反正我测试过，我没配置这个，还是可以正常将本地开源库上传至 bintray 并发布到 JCenter 上面去。</p><h3 id="第-4-步-执行-gradle-脚本" tabindex="-1"><a class="header-anchor" href="#第-4-步-执行-gradle-脚本" aria-hidden="true">#</a> 第 4 步：执行 gradle 脚本</h3><p>好了，bintray gradle 插件我们配置好了，它运行所需的各种属性我们也配置好了，那么接下去就只是执行它而已了</p><p>如果本地有配置 gradle 环境的话，那么直接在 cmd 中以命令行的形式执行脚本即可。</p><p>如果没有配置 gradle 环境，那么每个项目的根目录下都有个 gradle 文件夹，里面有 gradle 命名行执行所需的文件，所以可以直接在 Android Studio 的 Terminal 里直接以命令行的形式执行对应脚本即可，如下：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-bcb056d29fd6ba08.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="terminal.png"></p><p>那么如何运行 bintray gradle 插件的脚本呢？只需记录两条命令即可：</p><ul><li><strong>gradlew install</strong></li><li><strong>gradlew bintrayUpload</strong></li></ul><p><code>gradlew install</code> 用于将项目编译、打包生成 pom，aar 等文件；</p><p><code>gradlew bintrayUpload</code> 用于将生成的 pom，aar 等文件上传至 bintray 仓库中；</p><p>跟编译、运行项目一样，当按顺序分别执行上述两条脚本命名时，如果运行成功，你可以在日志中看到 <code>BUILD SUCCESSFUL</code> 信息，同样，如果脚本运行出错，那么就需要根据日志查看是哪里的问题了，通常就是第 2 步跟第 3 步出了一些问题。</p><p>另外，你还可以通过在 build 文件夹下面查看是否有生成对应的文件来判断 <code>gradlew install</code> 脚本有没有成功执行。然后直接在 bintray 网站你的仓库里查看文件是否有上传来判断 <code>gradlew bintrayUpload</code> 脚本是否有成功执行。</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-863b87d875c2f1c5.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="outputs.png"></p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-ac6c8f515f4f35dc.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="upload.png"></p><h3 id="第-5-步-在-bintray-网站上将-package-发布到-jcenter" tabindex="-1"><a class="header-anchor" href="#第-5-步-在-bintray-网站上将-package-发布到-jcenter" aria-hidden="true">#</a> 第 5 步：在 bintray 网站上将 package 发布到 JCenter</h3><p><img src="https://upload-images.jianshu.io/upload_images/1924341-f9e6538346985144.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="发布到JCenter.png"></p><p>接下去就是最后一步了，登录你的 bintray 账号，进入你的仓库里，找到上传的开源库，然后在页面右下角找到 <strong>Add to JCenter</strong> 按钮，点击进去，按照要求填写一下开源库说明，然后就静等几个小时，等收到 JCenter 发给你的审核通过邮件，那么就成功了。</p><p>那么这时候，你就可以愉快的在你的新项目中的 build.gradle 文件里直接通过 compile 来将你的开源库依赖到你项目中就可以了。</p><h1 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h1><p>以上，就是怎么一步步的将自己的开源库打包发布到 JCenter 的步骤，小结一下，无外乎以下几点：</p><ol><li>注册 bintray 账号（可用 Github 授权登录）</li><li>在 bintray 上创建仓库，在仓库下创建 package</li><li>准备好本地需要打包发布的项目</li><li>在项目中配置 bintray gradle 插件，有两个，一个用于生成 aar，pom 等文件；一个用于将这些文件上传至 bintray 仓库；两个插件均在项目根目录下的 build.gradle 配置插件的 classPath 路径即可</li><li>在要打包发布的那个 Module 下的 build.grale 文件中配置两种插件的使用，可直接使用 apply from 配置存储在网上的脚本文件，也可将这脚本模板文件下载到本地使用</li><li>apply from 必须要在 build.gradle 文件末尾，另外 exe 代码块需要在 apply from 前面，因为脚本模板文件使用的各种变量需要在 exe 块中先进行声明，赋值</li><li>理解 exe 块中的各种配置项的含义</li><li>在 Android Studio 的 Terminal 面板直接执行 gradlew install, gradlew bintrayUpload 命令来执行脚本</li><li>脚本成功执行结束后，即可在 bintray 网站中找到 Add to JCenter 按钮发布到 JCenter，然后静等邮件消息</li></ol>`,83);function w(C,k){const a=l("ExternalLinkIcon");return s(),t("div",null,[o,u,e("blockquote",null,[e("p",null,[e("a",c,[i("How to distribute your own Android library through jCenter and Maven Central from Android Studio"),n(a)])])]),b,e("p",null,[e("a",v,[i("https://bintray.com/"),n(a)])]),e("p",null,[e("a",m,[i("https://jcenter.bintray.com/"),n(a)])]),g,h,e("p",null,[i("比如，我之前写过一篇 "),e("a",y,[i("如何用Android Studio查看build.gradle源码"),n(a)]),i("，某些情况下，Android Studio 并没有成功将 Android Gradle 插件的源码下载下来，我们又想去查看源码时，只能自己去下载。写那篇博客的时候 Android Studio 还是默认配置的 mavenCentral 作为开源库拉取来源的。")]),_,e("p",null,[i("打开 "),e("a",f,[i("https://bintray.com/"),n(a)]),i(" 网站，注册一个账号，也可以选择直接 Github 账号授权登录，很简单，不贴图了。")]),x])}const j=d(p,[["render",w],["__file","一步步发布一个开源库到JCenter.html.vue"]]);export{j as default};
