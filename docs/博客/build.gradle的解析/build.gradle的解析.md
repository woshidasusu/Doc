> apply plugin: 'com.android.application'  

�����Ļ�����һ������ apply plugin: 'library'������Ҳ�������õ�ǰmodel���������ǿ⡣  
��������ˣ����������һ�£�ΪʲôҪ�������á�gradle�ǻ���groovy���Եģ�


�ο����ף�http://www.jianshu.com/p/d53399cd507b# 


�ο����� 
�������� http://jiajixin.cn/2015/08/07/gradle-android/
Gradle tip http://blog.csdn.net/lzyzsd/article/category/2795779
Groovy̽��GString http://blog.csdn.net/hivon/article/details/2271000
Diff with Java http://www.groovy-lang.org/differences.html
��ͨGroovy https://www.ibm.com/developerworks/cn/education/java/j-groovy/j-groovy.html
Gradle for Android https://segmentfault.com/a/1190000004229002
Gradle Plugin User Guide http://tools.android.com/tech-docs/new-build-system/user-guide 
Gradle����ָ�� http://www.jianshu.com/p/9df3c3b6067a# 


ѧϰGradle��
    1.�˽�groovy�����﷨
    2.�ֶ� Gradle User Guide �� Gradle Plugin User Guide
    https://docs.gradle.org/current/userguide/userguide.html
    http://tools.android.com/tech-docs/new-build-system/user-guide
    3.ʵս

Groovyѧϰ��
�ٷ��̳� http://www.groovy-lang.org/differences.html
IMB ��ͨGroovy http://www.ibm.com/developerworks/cn/education/java/j-groovy/j-groovy.html


//��ȡ���е�task, ���˵�ĳЩtask��ִ��
tasks.whenTaskAdded{task ->
    if (task.name.contains('AndroidTest')) {
        task.enabled = false;
    }
}

gradleִ�з������׶Σ���ʼ���׶Σ�setting.gradle)�����ý׶�(build.gradle����Project��Gradle����
ִ�н׶�(ִ�и���task)��

//afterEvaluate ����gradle�����ý׶ν���ʱִ��
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


