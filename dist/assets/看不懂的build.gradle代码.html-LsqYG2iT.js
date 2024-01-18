import{_ as s,r,o as a,c as v,a as n,b as i,e as l,d}from"./app-xJrSpaa5.js";const o={},u=d('<p>Android Studio 这么强大的工具，就算我们不懂 gradle, groovy， 也照样能借助AS对 Android 项目进行编译、调试、运行、打包等操作。build.gradle 这个文件接触这么久了，基本的项目配置也基本很熟悉了，毕竟每次自动创建的 build.gradle 里的代码就那么几项配置，看一下那些英文单词也基本猜到是什么配置。</p><p><strong>但是，不知道你们会不会跟我一样，在 github 上 clone 大神的项目后，总会发现他们的 build.gradle 里多了很多平常没看见过的代码，而且还看不懂代码要做什么；</strong></p><p>或者是比如当需要进行签名时，网上资料会让你在 Android 标签内加个 signingConfigs， 然后在它里面进行各种配置，比如 storeFile, keyAlias 等等之类的。还有其他类似这种情况，比如当需要打包时，在哪个地方加个什么标签再对它进行各种配置之类的。<strong>不知道你们会不会也跟我一样会有这样的疑问，这个标签名怎么来的，为什么要放在这个位置，它里面有哪些属性可以进行配置？</strong></p><p>疑惑久了，总想去了解下这是为什么，所以花了一段时间来学习 gradle 的相关知识，这次在这里记录也分享一下，如果有错的地方，还望指点一下。</p><p>本次计划是写个 gradle 系列博客，大概会有3-4篇，第一篇只是简单的针对某个具体的 build.gradle 文件代码进行注释解释以及抛出一些疑问，当然这个 build.gradle 不会是AS自动创建的那么简单的代码。然后再写1-2篇介绍 gradle, groovy， 相关的资料网上很多，所以不会写得很基础，大概是挑选一些我认为比较重要的知识点进行介绍。最后在前面的基础上，对 build.gradle 里面的代码进行分析讲解，比如介绍说都有哪些标签，哪里去找这些标签等等。</p><p>好了，废话就唠叨到这，下面就开始正文。</p><hr><h1 id="build-gradle" tabindex="-1"><a class="header-anchor" href="#build-gradle" aria-hidden="true">#</a> build.Gradle</h1>',8),t={href:"https://github.com/drakeet/Meizhi",target:"_blank",rel:"noopener noreferrer"},c=n("br",null,null,-1),m=d(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//Model都有各自的build.gradle，这里声明该Model作为主项目，常见的还有另一个取值：
//apply plugin: &#39;com.android.library&#39; 声明该Model作为库使用，当然还有其他取值，后面博客会介绍
apply plugin: &#39;com.android.application&#39;

//这里是在as里引入一个retrolambda插件，具体我也不大懂，可以看看这篇博客： 
//http://blog.csdn.net/zhupumao/article/details/51934317?locationNum=12
apply plugin: &#39;me.tatarka.retrolambda&#39;

//这里是groovy的代码了，定义了一个获取时间的方法，groovy是兼容java，它可以直接使用jdk里的方法
def releaseTime() {
    return new Date().format(&quot;yyyy-MM-dd&quot;, TimeZone.getTimeZone(&quot;UTC&quot;))
}

//file()是Project.java里的一个方法，这里定义一个File类型的对象，Project后面博客会介绍到
def keyStore = file(&#39;meizhi.keystore&#39;)

android {

    //这个大家应该很熟悉了，有疑问的应该是后面的代码，这里表示获取一些全局变量
    //这些变量的值在根目录下的build.gradle中定义，具体可以看看这篇博客：
    //http://blog.csdn.net/fwt336/article/details/54613419
    compileSdkVersion rootProject.ext.android.compileSdkVersion
    buildToolsVersion rootProject.ext.android.buildToolsVersion

    //同理，这里都是通过获取全局设置的变量值来进行相关配置，这样做的好处在于当
    //你的项目里有多个model时，可以方便修改这些公共的配置，只需要修改一个地方就可以同步了
    defaultConfig {
        applicationId rootProject.ext.android.applicationId
        minSdkVersion rootProject.ext.android.minSdkVersion
        targetSdkVersion rootProject.ext.android.targetSdkVersion
        versionCode rootProject.ext.android.versionCode
        versionName rootProject.ext.android.versionName
    }

    //这里应该是设置打包后的apk里的META-INF移除指定的文件吧
    packagingOptions {
        exclude &#39;META-INF/DEPENDENCIES.txt&#39;
        //省略部分exclude 代码...
    }

    //关闭指定的lint检查
    lintOptions {
        disable &#39;MissingTranslation&#39;, &#39;ExtraTranslation&#39;
    }

    //lint检查到错误时不中断编译，好像是说lint检查是为优化代码，发现的错误其实并不会导致程序异常
    //所以有的时候及时发现Lint检查错误还是可以直接运行查看效果
    lintOptions {
        abortOnError false
    }

    //签名的相关配置
    signingConfigs {
        //这个标签名可以随意命名，这里的作用大概类似于定义一个对象，该对象里设置好了签名需要的各种配置
        //可以定义不止一种配置的签名对象，例如常见的还有 debug{...}, release{...}，然后在buildTypes{}里
        //通过 signingConfigs.app1 进行调用
        app1 {
            //签名的相关配置，网上资料很多，STOREPASS, KEYALIAS, KEYPASS 这些常量是定义在
            //gradle.properties 文件里，如果没有该文件手动创建即可，这样可以保证安全
            //只有定义在 gradle.properties 里的常量才可以直接通过常量名引用
            storeFile file(&#39;meizhi.keystore&#39;)
            storePassword project.hasProperty(&#39;STOREPASS&#39;) ? STOREPASS : &#39;&#39;
            keyAlias project.hasProperty(&#39;KEYALIAS&#39;) ? KEYALIAS : &#39;&#39;
            keyPassword project.hasProperty(&#39;KEYPASS&#39;) ? KEYPASS : &#39;&#39;
        }
    }

    //编译，打包的项目配置
    buildTypes {

        debug {
            //在 BuildConfig 里自定义一个 boolean 类型的常量
            //更多资料可以查看：http://stormzhang.com/android/2015/01/25/gradle-build-field/ 
            buildConfigField &quot;boolean&quot;, &quot;LOG_DEBUG&quot;, &quot;true&quot;
            
            debuggable true
            applicationIdSuffix &quot;.debug&quot;
        }

        release {
            buildConfigField &quot;boolean&quot;, &quot;LOG_DEBUG&quot;, &quot;false&quot;

            debuggable false
            
            //开启混淆
            minifyEnabled true
            //删除无用的资源
            shrinkResources true
            //混淆文件
            proguardFiles getDefaultProguardFile(&#39;proguard-android.txt&#39;), &#39;proguard-rules.pro&#39;
            if (keyStore.exists()) {
                println &quot;Meizhi: using drakeet&#39;s key&quot;
                //根据在signingConfigs.app1里的签名配置进行签名
                signingConfig signingConfigs.app1
            } else {
                println &quot;Meizhi: using default key&quot;
            }

            //这段代码应该会在大神的项目里挺常见的，我在很多项目里都看见过了
            //这也是groovy的代码，这里的代码作用是重命名最后打包出来的apk
            //根据 def fileName 设置的格式来命名，\${}表示的是某个变量的引用
            //例如根据设置的格式最后apk命名可能是： Meizhi_v1.0.0_2017-03-28_fir.apk
            //至于 applicationVariants 这些变量含义后面博客会介绍
            applicationVariants.all { variant -&gt;
                variant.outputs.each { output -&gt;
                    def outputFile = output.outputFile
                    if (outputFile != null &amp;&amp; outputFile.name.endsWith(&#39;.apk&#39;)) {
                        def fileName = &quot;Meizhi_v\${defaultConfig.versionName}_\${releaseTime()}_\${variant.productFlavors[0].name}.apk&quot;
                        output.outputFile = new File(outputFile.parent, fileName)
                    }
                }
            }
        }

        //这里的作用跟 singingConfigs 差不多，只是为不同的 flavor 设置一些属性
        //常见的设置比如设置不同的渠道编号，设置不同的 api 服务器等等
        productFlavors {
            fir {
                //这个的作用是将 AndroidManifest.xml 里的占位符 ￥{UMENG_CHANNEL_VALUE} 的值替换成fir
                manifestPlaceholders = [UMENG_CHANNEL_VALUE: &quot;fir&quot;]
            }
            GooglePlay {
                manifestPlaceholders = [UMENG_CHANNEL_VALUE: &quot;GooglePlay&quot;]
            }
            Umeng {
                manifestPlaceholders = [UMENG_CHANNEL_VALUE: &quot;Umeng&quot;]
            }
        }
    }

    //设置JDK的版本通过compileOptions
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    //lint的相关配置吧
    lintOptions {
        disable &quot;InvalidPackage&quot;
        lintConfig file(&quot;lint.xml&quot;)
    }
}

//这里就不用说了
dependencies {
    compile fileTree(dir: &#39;libs&#39;, include: [&#39;*.jar&#39;])
    compile project(&quot;:libraries:headsupcompat&quot;)
    compile project(&quot;:libraries:smooth-app-bar-layout&quot;)
    //as默认会去下载传递依赖，下面是指定不需要去下载传递依赖
    compile (&#39;com.squareup.retrofit2:retrofit:2.1.0&#39;) {
        exclude module: &#39;okhttp&#39;
    }
    retrolambdaConfig &#39;net.orfjackal.retrolambda:retrolambda:2.3.0&#39;
    //省略部分compile代码...
}



</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="疑问" tabindex="-1"><a class="header-anchor" href="#疑问" aria-hidden="true">#</a> 疑问</h1><p>1.apply plugin: &#39;com.android.application&#39; 听说这是调用一个方法？</p><p>2.rootProject.ext.android.compileSdkVersion, 不用 ext 来设置全局变量是否可以？</p><p>3.defaultConfig{}, packagingOptions{}, signingConfigs{}, buildTypes{} 等等这些，我怎么知道 Android{} 里都有哪些可以使用？</p><p>...</p><h1 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h1>`,7),b=n("br",null,null,-1),p={href:"http://blog.csdn.net/zhupumao/article/details/51934317?locationNum=12",target:"_blank",rel:"noopener noreferrer"},g=n("br",null,null,-1),f={href:"http://blog.csdn.net/fwt336/article/details/54613419",target:"_blank",rel:"noopener noreferrer"},h=n("br",null,null,-1),_={href:"http://stormzhang.com/android/2015/01/25/gradle-build-field/",target:"_blank",rel:"noopener noreferrer"};function k(q,E){const e=r("ExternalLinkIcon");return a(),v("div",null,[u,n("p",null,[i("这个 build.Gradle 文件来自 drakeet 大神的 "),n("a",t,[i("Meizi"),l(e)]),i(" 项目"),c,i(" 我直接在代码上加注释，参照着注释看代码就行，是不是发现有很多代码平时都没看见过。")]),m,n("p",null,[i("·徐宜生写的《Android群英传：神兵利器》第4章：与Gradle的爱恨情仇"),b,i(" ·"),n("a",p,[i("retrolambda使用教程"),l(e)]),g,i(" ·"),n("a",f,[i("Gradle配置全局变量"),l(e)]),h,i(" ·"),n("a",_,[i("GRADLE自定义你的BUILDCONFIG"),l(e)])])])}const S=s(o,[["render",k],["__file","看不懂的build.gradle代码.html.vue"]]);export{S as default};
