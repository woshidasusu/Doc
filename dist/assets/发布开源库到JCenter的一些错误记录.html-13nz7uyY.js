import{_ as r,r as a,o as s,c as l,a as i,b as e,e as d,d as t}from"./app-XVH6qKTA.js";const o={},c=i("p",null,"这周末自己瞎折磨了下，如何发布开源库到 JCenter，然后这过程中碰到了一些问题，在此记录分享一下",-1),v={href:"https://www.jianshu.com/p/91a55d8f7055",target:"_blank",rel:"noopener noreferrer"},u=t(`<ol><li><strong>Error:No service of type Factory&lt;LoggingManagerInternal&gt; available in ProjectScopeServices.</strong></li></ol><p>原因：android-maven-gradle-plugin 插件的 bug</p><p>解决：更换版本，本次测试出问题版本 1.3，更改为 1.4.1 后正常</p><p>做法：在根目录的 build.gradle 文件中修改插件版本：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>dependencies {
	classpath &#39;com.github.dcendents:android-maven-gradle-plugin:1.4.1&#39;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><strong>Error:Could not get unknown property &#39;publishedGroupId&#39; for project &#39;:tv&#39; of type org.gradle.api.Project.</strong></li></ol><p>原因：apply from &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/installv1.gradle&#39; 代码放错位置</p><p>解决：由于上述 apply from 代码的意思是使用存储在网上的脚本模板文件，模板文件中使用了很多还未声明的变量，所以 apply from 这行代码应该放置在 ext {} 变量声明代码块之后</p><p>做法： build.gradle 文件中以下几行代码应该按顺序来，第一行 apply from: &#39;bintray-config.gradle&#39; 其实就是脚本模板文件中的变量声明，赋值代码，也就是 ext{} 代码块，只是将其单独放置于一个 gradle 文件中，这里也可以直接将 ext{} 代码替换掉 apply from: &#39;bintray-config.gradle&#39;</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apply from: &#39;bintray-config.gradle&#39;
//ext{} 变量声明，赋值代码块必须在以下两个脚本模板文件之前
apply from: &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/installv1.gradle&#39;
apply from: &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/bintrayv1.gradle&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li><strong>Error:Cause: android.compileSdkVersion is missing!</strong></li></ol><p>原因：apply from: &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/bintrayv1.gradle&#39; 代码放错位置</p><p>解决：跟 2 的理由类似，这个脚本是用于将本地生成的 pom，aar 等文件上传至 bintray 仓库，但这个脚本的运行需要依赖于一些 android {} 块的属性配置；所以并不是所有 apply from 的代码都是放置于 build.gradle 的开头，这里建议将 第 2 中的三个 apply from 代码都放置于 build.gradle 文件末尾。</p><p>以上 1-3 问题均是在上一篇中的步骤，第 2 步：配置本地 gradle 脚本插件，的过程中操作不当导致的</p><ol start="4"><li><strong>Execution failed for task &#39;:tv :javadoc.</strong></li></ol><p>原因：执行 <code>gradlew install</code> 构建过程中出错，这是由于执行生成 javadoc 过程中出问题，至于为什么出问题可以具体查看日志，例如我这里：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-e04345f4c0ee0190.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="GBKerror.png"></p><p>我这里是由于在代码中有中文，所以导致的构建错误</p><p>解决：有没有其他解决方案我不清楚，我又不想将这些中文注释给删除掉，那么我只能将这个 javadoc 的 task 给关掉了，反正我上传到 JCenter 上的开源库也只是我自己在用，不需要 javadoc 文档</p><p>做法：由于 javadoc 的 task 是在 bintray 提供的脚本模板文件中，所以只能修改这个模板文件，那么在上一篇的第 2 步：配置本地 gradle 脚本插件，就不能用 <code>apply from &#39;http://...&#39;</code> 的形式了，因为这种形式无法修改模板文件。</p><p>那么就需要在本地新建一个 <strong>installv1.gradle</strong> 文件，然后将这个脚本文件里的代码拷贝进这个新建的文件中：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//将下面所有的 javadoc task 注释掉，不用这个功能
apply plugin: &#39;com.jfrog.bintray&#39;

version = libraryVersion

if (project.hasProperty(&quot;android&quot;)) { // Android libraries
    task sourcesJar(type: Jar) {
        classifier = &#39;sources&#39;
        from android.sourceSets.main.java.srcDirs
    }

//1. 这里是第1处
//    task javadoc(type: Javadoc) {
//        source = android.sourceSets.main.java.srcDirs
//        classpath += project.files(android.getBootClasspath().join(File.pathSeparator))
//    }
} else { // Java libraries
    task sourcesJar(type: Jar, dependsOn: classes) {
        classifier = &#39;sources&#39;
        from sourceSets.main.allSource
    }
}

//2. 这里是第2处
//task javadocJar(type: Jar, dependsOn: javadoc) {
//    classifier = &#39;javadoc&#39;
//    from javadoc.destinationDir
//}

artifacts {
//3. 这里是第3处
//    archives javadocJar
    archives sourcesJar
}

// Bintray
Properties properties = new Properties()
properties.load(project.rootProject.file(&#39;local.properties&#39;).newDataInputStream())

bintray {
    user = properties.getProperty(&quot;bintray.user&quot;)
    key = properties.getProperty(&quot;bintray.apikey&quot;)
    println user
    println key

    configurations = [&#39;archives&#39;]
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
                passphrase = properties.getProperty(&quot;bintray.gpg.password&quot;)
                //Optional. The passphrase for GPG signing&#39;
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在 module 下的 build.gradle 文件的末尾中，将原本的 apply from 代码换成下面的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apply from: &#39;bintray-config.gradle&#39;
apply from: &#39;bintrayv1.gradle&#39;
apply from: &#39;https://raw.githubusercontent.com/nuuneoi/JCenter/master/installv1.gradle&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面两个 apply from 是指使用 本地脚本文件，最后一个 apply from 是指使用网络上的脚本文件，本地脚本文件可以任自己修改</p><ol start="5"><li><strong>提几点 bintray 网站操作的一些注意事项</strong><ul><li>注册账号的时候 qq 邮箱不能使用，建议使用 gmail 邮箱</li><li>在 bintray 上创建完仓库后，也顺便将 package 创建了吧，package 对应着本地项目中一个 module，至于不创建 package，直接在本地执行上传操作能否可行，我没测试过</li><li>ext {} 变量声明的代码块里，具体哪些属性值可以不配置，我没测试过，但感觉还是按模板来，将每个属性都进行配置比较好</li></ul></li></ol>`,26);function p(m,b){const n=a("ExternalLinkIcon");return s(),l("div",null,[c,i("p",null,[e("本篇是基于上一篇："),i("a",v,[e("教你一步步发布一个开源库到 JCenter"),d(n)]),e(" 介绍的流程、步骤中所遇到的问题，所以没看过上一篇的，可以去看看哈~")]),u])}const y=r(o,[["render",p],["__file","发布开源库到JCenter的一些错误记录.html.vue"]]);export{y as default};
