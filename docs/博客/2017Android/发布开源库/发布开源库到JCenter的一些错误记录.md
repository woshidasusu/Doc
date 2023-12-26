这周末自己瞎折磨了下，如何发布开源库到 JCenter，然后这过程中碰到了一些问题，在此记录分享一下  

本篇是基于上一篇：[教你一步步发布一个开源库到 JCenter](https://www.jianshu.com/p/91a55d8f7055) 介绍的流程、步骤中所遇到的问题，所以没看过上一篇的，可以去看看哈~

1. **Error:No service of type Factory<LoggingManagerInternal> available in ProjectScopeServices.**  

原因：android-maven-gradle-plugin 插件的 bug  

解决：更换版本，本次测试出问题版本 1.3，更改为 1.4.1 后正常

做法：在根目录的 build.gradle 文件中修改插件版本：

```   
dependencies {
	classpath 'com.github.dcendents:android-maven-gradle-plugin:1.4.1'
}
```



2. **Error:Could not get unknown property 'publishedGroupId' for project ':tv' of type org.gradle.api.Project.**  

原因：apply from 'https://raw.githubusercontent.com/nuuneoi/JCenter/master/installv1.gradle' 代码放错位置

解决：由于上述 apply from 代码的意思是使用存储在网上的脚本模板文件，模板文件中使用了很多还未声明的变量，所以 apply from 这行代码应该放置在 ext {} 变量声明代码块之后  

做法：  build.gradle 文件中以下几行代码应该按顺序来，第一行 apply from: 'bintray-config.gradle' 其实就是脚本模板文件中的变量声明，赋值代码，也就是 ext{} 代码块，只是将其单独放置于一个 gradle 文件中，这里也可以直接将 ext{} 代码替换掉   apply from: 'bintray-config.gradle'

```
apply from: 'bintray-config.gradle'
//ext{} 变量声明，赋值代码块必须在以下两个脚本模板文件之前
apply from: 'https://raw.githubusercontent.com/nuuneoi/JCenter/master/installv1.gradle'
apply from: 'https://raw.githubusercontent.com/nuuneoi/JCenter/master/bintrayv1.gradle'
```



3. **Error:Cause: android.compileSdkVersion is missing!**

原因：apply from: 'https://raw.githubusercontent.com/nuuneoi/JCenter/master/bintrayv1.gradle' 代码放错位置  

解决：跟 2 的理由类似，这个脚本是用于将本地生成的 pom，aar 等文件上传至 bintray 仓库，但这个脚本的运行需要依赖于一些 android {} 块的属性配置；所以并不是所有 apply from 的代码都是放置于 build.gradle 的开头，这里建议将 第 2 中的三个 apply from 代码都放置于 build.gradle 文件末尾。  



以上 1-3 问题均是在上一篇中的步骤，第 2 步：配置本地 gradle 脚本插件，的过程中操作不当导致的  



4. **Execution failed for task ':tv :javadoc.**  

原因：执行 `gradlew install` 构建过程中出错，这是由于执行生成 javadoc 过程中出问题，至于为什么出问题可以具体查看日志，例如我这里：  

![GBKerror.png](https://upload-images.jianshu.io/upload_images/1924341-e04345f4c0ee0190.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

我这里是由于在代码中有中文，所以导致的构建错误

解决：有没有其他解决方案我不清楚，我又不想将这些中文注释给删除掉，那么我只能将这个 javadoc 的 task 给关掉了，反正我上传到 JCenter 上的开源库也只是我自己在用，不需要 javadoc 文档  

做法：由于 javadoc 的 task 是在 bintray 提供的脚本模板文件中，所以只能修改这个模板文件，那么在上一篇的第 2 步：配置本地 gradle 脚本插件，就不能用 `apply from 'http://...'` 的形式了，因为这种形式无法修改模板文件。

那么就需要在本地新建一个 **installv1.gradle** 文件，然后将这个脚本文件里的代码拷贝进这个新建的文件中：  

```  
//将下面所有的 javadoc task 注释掉，不用这个功能
apply plugin: 'com.jfrog.bintray'

version = libraryVersion

if (project.hasProperty("android")) { // Android libraries
    task sourcesJar(type: Jar) {
        classifier = 'sources'
        from android.sourceSets.main.java.srcDirs
    }

//1. 这里是第1处
//    task javadoc(type: Javadoc) {
//        source = android.sourceSets.main.java.srcDirs
//        classpath += project.files(android.getBootClasspath().join(File.pathSeparator))
//    }
} else { // Java libraries
    task sourcesJar(type: Jar, dependsOn: classes) {
        classifier = 'sources'
        from sourceSets.main.allSource
    }
}

//2. 这里是第2处
//task javadocJar(type: Jar, dependsOn: javadoc) {
//    classifier = 'javadoc'
//    from javadoc.destinationDir
//}

artifacts {
//3. 这里是第3处
//    archives javadocJar
    archives sourcesJar
}

// Bintray
Properties properties = new Properties()
properties.load(project.rootProject.file('local.properties').newDataInputStream())

bintray {
    user = properties.getProperty("bintray.user")
    key = properties.getProperty("bintray.apikey")
    println user
    println key

    configurations = ['archives']
    pkg {
        repo = bintrayRepo
        name = bintrayName
        desc = libraryDescription
        websiteUrl = siteUrl
        vcsUrl = gitUrl
        licenses = allLicenses
        publish = true
        publicDownloadNumbers = true
        version {
            desc = libraryDescription
            gpg {
                sign = true //Determines whether to GPG sign the files. The default is false
                passphrase = properties.getProperty("bintray.gpg.password")
                //Optional. The passphrase for GPG signing'
            }
        }
    }
}
```

然后在 module 下的 build.gradle 文件的末尾中，将原本的 apply from 代码换成下面的：  

```  
apply from: 'bintray-config.gradle'
apply from: 'bintrayv1.gradle'
apply from: 'https://raw.githubusercontent.com/nuuneoi/JCenter/master/installv1.gradle'
```

上面两个 apply from 是指使用 本地脚本文件，最后一个 apply from 是指使用网络上的脚本文件，本地脚本文件可以任自己修改  



5. **提几点 bintray 网站操作的一些注意事项** 
   - 注册账号的时候 qq 邮箱不能使用，建议使用 gmail 邮箱
   - 在 bintray 上创建完仓库后，也顺便将 package 创建了吧，package 对应着本地项目中一个 module，至于不创建 package，直接在本地执行上传操作能否可行，我没测试过
   -  ext {} 变量声明的代码块里，具体哪些属性值可以不配置，我没测试过，但感觉还是按模板来，将每个属性都进行配置比较好





