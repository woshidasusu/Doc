Android Studio 这么强大的工具，就算我们不懂 gradle, groovy， 也照样能借助AS对 Android 项目进行编译、调试、运行、打包等操作。build.gradle 这个文件接触这么久了，基本的项目配置也基本很熟悉了，毕竟每次自动创建的 build.gradle 里的代码就那么几项配置，看一下那些英文单词也基本猜到是什么配置。  

但是，不知道你们会不会跟我一样，在 github 上 clone 大神的项目后，总会发现他们的 build.gradle 里多了很多平常没看见过的代码，而且还看不懂代码要做什么；  

或者是比如当需要进行签名时，网上资料会让你在 Android 标签内加个 signingConfigs， 然后在它里面进行各种配置，比如 storeFile, keyAlias 等等之类的。还有其他类似这种情况，比如当需要打包时，在哪个地方加个什么标签再对它进行各种配置之类的。不知道你们会不会也跟我一样会有这样的疑问，这个标签名怎么来的，为什么要放在这个位置，它里面有哪些属性可以进行配置？  

疑惑久了，总想去了解下这是为什么，所以花了一段时间来学习 gradle 的相关知识，这次在这里记录也分享一下，如果有错的地方，还望指点一下。  

本次计划是写个 gradle 系列博客，大概会有3-4篇，第一篇只是简单的针对某个具体的 build.gradle 文件代码进行注释解释以及抛出一些疑问，当然这个 build.gradle 不会是AS自动创建的那么简单的代码。然后再写1-2篇介绍 gradle, groovy， 相关的资料网上很多，所以不会写得很基础，大概是挑选一些我认为比较重要的知识点进行介绍。最后在前面的基础上，对 build.gradle 里面的代码进行分析讲解，比如介绍说都有哪些标签，哪里去找这些标签等等。  

好了，废话就唠叨到这，下面就开始正文。  

***  

# build.Gradle  
这个 build.Gradle 文件来自 drakeet 大神的 [Meizi](https://github.com/drakeet/Meizhi) 项目  
我直接在代码上加注释，参照着注释看代码就行，是不是发现有很多代码平时都没看见过。  

```  
//Model都有各自的build.gradle，这里声明该Model作为主项目，常见的还有另一个取值：
//apply plugin: 'com.android.library' 声明该Model作为库使用，当然还有其他取值，后面博客会介绍
apply plugin: 'com.android.application'

//这里是在as里引入一个retrolambda插件，具体我也不大懂，可以看看这篇博客： 
//http://blog.csdn.net/zhupumao/article/details/51934317?locationNum=12
apply plugin: 'me.tatarka.retrolambda'

//这里是groovy的代码了，定义了一个获取时间的方法，groovy是兼容java，它可以直接使用jdk里的方法
def releaseTime() {
    return new Date().format("yyyy-MM-dd", TimeZone.getTimeZone("UTC"))
}

//file()是Project.java里的一个方法，这里定义一个File类型的对象，Project后面博客会介绍到
def keyStore = file('meizhi.keystore')

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
        exclude 'META-INF/DEPENDENCIES.txt'
        exclude 'META-INF/LICENSE.txt'
        exclude 'META-INF/NOTICE.txt'
        exclude 'META-INF/NOTICE'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/notice.txt'
        exclude 'META-INF/license.txt'
        exclude 'META-INF/dependencies.txt'
        exclude 'META-INF/LGPL2.1'
    }

    //关闭指定的lint检查
    lintOptions {
        disable 'MissingTranslation', 'ExtraTranslation'
    }

    //lint检查到错误时不中断编译
    lintOptions {
        abortOnError false
    }

    //签名的相关配置
    signingConfigs {
        app1 {
            storeFile file('meizhi.keystore')
            storePassword project.hasProperty('STOREPASS') ? STOREPASS : ''
            keyAlias project.hasProperty('KEYALIAS') ? KEYALIAS : ''
            keyPassword project.hasProperty('KEYPASS') ? KEYPASS : ''
        }
    }

    //编译的项目配置
    buildTypes {
        debug {
            buildConfigField "boolean", "LOG_DEBUG", "true"
            debuggable true
            applicationIdSuffix ".debug"
        }

        release {
            buildConfigField "boolean", "LOG_DEBUG", "false"

            debuggable false
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            if (keyStore.exists()) {
                println "Meizhi: using drakeet's key"
                signingConfig signingConfigs.app1
            } else {
                println "Meizhi: using default key"
            }

            //这段代码应该会在大神的项目里挺常见的，我在很多项目里都看见过了
            //这也是groovy的代码，这里的代码作用是重命名最后打包出来的apk
            //根据 def fileName 设置的格式来命名，${}表示的是某个变量的引用
            applicationVariants.all { variant ->
                variant.outputs.each { output ->
                    def outputFile = output.outputFile
                    if (outputFile != null && outputFile.name.endsWith('.apk')) {
                        def fileName = "Meizhi_v${defaultConfig.versionName}_${releaseTime()}_${variant.productFlavors[0].name}.apk"
                        output.outputFile = new File(outputFile.parent, fileName)
                    }
                }
            }
        }

        productFlavors {
            fir {
                manifestPlaceholders = [UMENG_CHANNEL_VALUE: "fir"]
            }
            GooglePlay {
                manifestPlaceholders = [UMENG_CHANNEL_VALUE: "GooglePlay"]
            }
            Umeng {
                manifestPlaceholders = [UMENG_CHANNEL_VALUE: "Umeng"]
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
        disable "InvalidPackage"
        lintConfig file("lint.xml")
    }
}

//这里就不用说了
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile project(":libraries:headsupcompat")
    compile project(":libraries:smooth-app-bar-layout")
    compile ('com.squareup.retrofit2:retrofit:2.1.0') {
        exclude module: 'okhttp'
    }
    retrolambdaConfig 'net.orfjackal.retrolambda:retrolambda:2.3.0'
    //省略部分compile代码...
}



```









# 参考资料  
[1] 徐宜生写的《Android群英传：神兵利器》第4章：与Gradle的爱恨情仇  