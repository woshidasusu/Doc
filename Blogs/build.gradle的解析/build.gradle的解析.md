> apply plugin: 'com.android.application'  

常见的还有另一个就是 apply plugin: 'library'，作用也就是设置当前model是主程序还是库。  
作用清楚了，下面来理解一下，为什么要这样设置。gradle是基于groovy语言的，


参考文献：http://www.jianshu.com/p/d53399cd507b# 


参考文献 
构建神器 http://jiajixin.cn/2015/08/07/gradle-android/
Gradle tip http://blog.csdn.net/lzyzsd/article/category/2795779
Groovy探索GString http://blog.csdn.net/hivon/article/details/2271000
Diff with Java http://www.groovy-lang.org/differences.html
精通Groovy https://www.ibm.com/developerworks/cn/education/java/j-groovy/j-groovy.html
Gradle for Android https://segmentfault.com/a/1190000004229002
Gradle Plugin User Guide http://tools.android.com/tech-docs/new-build-system/user-guide


学习Gradle：
    1.了解groovy基本语法
    2.粗度 Gradle User Guide 和 Gradle Plugin User Guide
    https://docs.gradle.org/current/userguide/userguide.html
    http://tools.android.com/tech-docs/new-build-system/user-guide
    3.实战

Groovy学习：
官方教程 http://www.groovy-lang.org/differences.html
IMB 精通Groovy http://www.ibm.com/developerworks/cn/education/java/j-groovy/j-groovy.html


//获取所有的task, 过滤掉某些task的执行
tasks.whenTaskAdded{task ->
    if (task.name.contains('AndroidTest')) {
        task.enabled = false;
    }
}

gradle执行分三个阶段，初始化阶段（setting.gradle)，配置阶段(build.gradle生成Project和Gradle对象）
执行阶段(执行各个task)。

//afterEvaluate 会在gradle的配置阶段结束时执行
aftertEvaluate {
    android.applicationVariants.each { variant ->
        def dx = tasks.findByName("dex$variant.name.capitalize()}")
        def hello = "hello$variant.name.capitalize()}"
        task(hello) << {
            println "hello"
        }
        tasks.findByName(hello).dependsOn dx.taskDependencies.getDependencies(dx)
        dx.dependsOn tasks.findByName(hello)
    }
    
}


