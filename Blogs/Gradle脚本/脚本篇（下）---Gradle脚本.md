# 前言  

上一篇[写个批处理来帮忙干活---遍历&字符串处理](https://www.jianshu.com/p/e0faba864cdd)中，我们已经学习如何写批处理脚本来帮我们做一些简单的重复性工作，本篇继续来学习如何用 Gradle 写脚本，让它也来帮我们干活

# Gradle 脚本 

需求场景跟上一篇一样，只是需要脚本能够帮我们遍历某个目录下的文件，然后分别针对每个文件执行 java 命令，再输出新的命名格式的文件即可，因此脚本涉及的方面仍然是：文件夹的遍历操作、字符串处理、执行 java 命令。下面开始学习吧：  

### 1. 遍历指定文件夹下的文件

##### 1.1 files()  

**命令**：

```  groovy
files(file1, file2, file3, file4...) .each {file ->
	println file.name
}
```

**解释**：files() 方法可以理解成一个集合，通过参数往集合中添加元素，只要能将需要遍历的目录下的所有文件都通过参数，传给 files()，那么就可以直接通过 .each 来遍历集合中的每个元素，达到遍历文件夹的目的

**示例**：  

![完整示例.png](https://upload-images.jianshu.io/upload_images/1924341-a19e2d07e083c304.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)    

```  groovy
def dir = new File("C:\Users\suxq\Desktop\outputs")  
files(dir.listFiles()).each { file ->
    println file.name
}
```

![gradle遍历示例.png](https://upload-images.jianshu.io/upload_images/1924341-38d29c813325b3f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

解释：可以结合 File 的 listFiles() 方法使用，这个方法刚好可以返回整个目录下的文件，刚好作为参数传给 files()，这样一来就可以达到遍历文件夹的目的了。  

**过滤**：如果只想遍历目录下符合规则的文件，那么可以自定义过滤规则：

```  groovy
def outputs = file("C:\\Users\\suxq\\Desktop\\outputs")
files(dir.listFiles(new FilenameFilter() {
        @Override
        boolean accept(File dir, String name) {
            //自定义过滤规则
            return name.endsWith(".apk")
        }
    }))
.each { file ->
    println file.name
}    
```

##### 1.2 fileTree()    

**命令**：  

```  groovy
fileTree(dirPath).each { file ->
	println file.name
}
```

**解释**：fileTree 使用会比 files 更简单，只需要传入目录的路径，即可对目录下的文件进行遍历  

**示例**：  

![完整示例.png](https://upload-images.jianshu.io/upload_images/1924341-a19e2d07e083c304.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

```  
def outputs = file("C:\\Users\\suxq\\Desktop\\outputs")
fileTree(outputs).each { file ->
	println file.name
}
```

![gradle遍历示例.png](https://upload-images.jianshu.io/upload_images/1924341-38d29c813325b3f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

**过滤**：如果不想遍历整个目录，那么 fileTree 方式也很容易自定义过滤规则：  

```  groovy
def outputs = file("C:\\Users\\suxq\\Desktop\\outputs")
fileTree(outputs){
	//自定义过滤规则
	include "*.apk"
}
.each { file ->
	println file.name
}
```

解释：fileTrss 的自定义过滤规则使用也很方便

**注意**：以上示例代码中，涉及到一些 groovy 语言的语法结构，Gradle 是基于 groovy 开发的，groovy 有一个闭包的概念，另外，groovy 支持方法的括号省略，方法的最后一个参数外移等特性，所以，如果上述代码看得不是很懂的话，可以到我之前写的一篇介绍 groovy 基础语法的博客看看：[学点Groovy来理解build.gradle代码](https://www.jianshu.com/p/501726c979b1)  

##### 1.3 java 实现  

由于 Gradle 是基于 groovy 开发的，而 groovy 又是基于 java 开发的，因此，想要遍历指定目录下的文件，你也可以完全用 java 来实现，照样能在 Gradle 脚本中运行，java 实现的就不给示例了

### 2. 字符串处理

由于 Gradle 基于 groovy 开发，而 groovy 又是基于 java 开发的，因此，对字符串的处理完全可以使用 java 的方式，如通过 `+`来拼接，或者通过 StringBuffer 对象来操作，或者直接使用 String 的 api 都可以。

所以，这一节就主要来讲讲，在 groovy 中可以表示为字符串的格式。

java 只支持用 ` "xxx" ` 双引号来表示字符串

groovy 支持使用 ` 'xxx' `, ` "xxx" `, ` '''xxx''' `,  ` """xxx""" `, ` /xxx/ `, ` $/xxx/$ ` 即单引号，双引号等6种方法来表示字符串  
它们之间的区别为：` 'xxx' `, ` "xxx" ` 只支持单行字符串，不支持多行，剩下的四种都支持多行字符串，如下图  
 ![Groovy字符串代码示例](http://upload-images.jianshu.io/upload_images/1924341-cc18ea13326a0918.png)  
 ![控制台输出结果](http://upload-images.jianshu.io/upload_images/1924341-0813184508bcdd70.png)  

斜杠我也很少见，常见的是带有 `${}` 的字符串，比如： ` println "blog's url: ${blogUrl}"  ` 这是 groovy 的 GString 特性，支持字符串插值，有点了类似于变量引用的概念，但注意，在 ` '...' `, ` '''...''' ` 单引号表示的字符串里不支持 `${}`。当然，如果你要使用 java 的方式，用 ` + ` 来拼接也可以。   

### 3. 执行 java 等命令  

在批处理脚本中直接写要运行的命令，终端就会自动去执行，但在 gradle 脚本中，如果也需要执行一些命令行下的指令时，就需要借助 Gradle 提供给我们接口。

##### 3.1 “xxx".execute()

**命令**：  `"xxx".execute()`   

**解释**：  "xxx" 就是需要执行的命令，比如 `svn --version`，`git --version`，`java -version`，`cmd dir` 等等，直接将需要执行的命令用字符串表示后调用 `.execute()` 方法，这个命令就可以执行了。

**切记：** 虽然这种方式很简单，但也很有多问题：

- 首先第一个，你要执行的这条命令必须在你电脑里配置了相关的环境变量，否则会报系统找不到指令的错误。
- 第二点，这种方式下，有时看不到输出的信息，比如 `svn --version` 可以在控制台中看到相关信息输出，但是 `java -version` 这条命令却在控制台中看不到，至于为什么，还没搞懂，有清楚的还望指点一下。

**示例**：  

- 电脑配置了相关的环境变量，控制台可以看到相关信息  

  `println "svn --version".execute().text.trim()`  

  ![svn示例.png](https://upload-images.jianshu.io/upload_images/1924341-0660ab9f51cb6d23.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

  解释：text.trim() 是可以获取到命令执行之后的输出结果，所以可以直接将命令的执行结果打印出来查看命令的执行情况，如果需要这方面的需求的话，不然只需 "svn --version".execute()  命令就会执行了。  

- 电脑配置了相关的环境变量，但控制台却看不到相关输出信息

  `println "java -version".execute().text.trim()`  

  ![java示例.png](https://upload-images.jianshu.io/upload_images/1924341-5115805f251d7924.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

  解释：这点我也搞清楚，不懂为什么通过 text 就可以获取到 svn 命令的执行结果，但就获取不到 java 命令的执行结果。但，虽然控制台看不到信息，命令还是有成功执行的，我们可以测试一下：  

  ```  groovy
  def workDir = "C:\\users\\suxq\\desktop"
  "javac -d . A.java".execute([], new File(workDir))
  ```

  ![java示例1.png](https://upload-images.jianshu.io/upload_images/1924341-5cf0b03fd9e74681.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

  解释：我在桌面放一个 A.java 文件，而通过 `javac -d . A.java` 命令可以在当前路径下生成一个 A.calss 文件。所以，通过 "xxx".execute() 方式确实可以正确执行指定命令，但有时可能在控制台看不到输出信息，至于原因我不清楚。

  另外，execute() 这个方法可以接收两个参数，第一个参数我也不清楚，第二个参数是可以指定命令执行的工作路径，因为我把 A.java 放在桌面，所以我需要指定这条命令的工作路径是在桌面，不然的话，这条命令中的 A.java 就需要给出绝对路径。

- 电脑没有配置相关环境变量，脚本执行报错  

  `"git --version".execute()`  

  ![git命令示例.png](https://upload-images.jianshu.io/upload_images/1924341-637439666e3ad0ef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

  解释：我电脑没有配置 git 的环境变量，因此，通过这种方式来执行命令的时候是会报错的。

##### 3.2  task xxx(type: Exec) {}

**命令**：`task xxx(type: Exec) {}`  

**解释**：这种方式是官方给的教程里介绍的方式，[官方链接跳转](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.Exec.html)

**示例**：  

```  groovy
task sign4(type:Exec) {
    group = sign
	
    //设置工作路径
    workingDir 'C:\\Users\\suxq\\Desktop'
	
    //执行 dir命令， /c 表示 cmd窗口执行完 dir 命令后立即关掉，至于 cmd 后可带哪些参数，可在终端下 cmd /? 查看
    commandLine 'cmd', '/c', 'dir'  
    
    //执行 java -version 命令
    //commandLine 'java', '-version'

    //执行 svn --version 命令
    //commandLine 'svn', '--version'

    //执行 adb devices 命令
    //commandLine 'cmd', '/c', 'adb devices'
}
```

解释：通过 Gradle 提供好的类型为 Exec 的 task，然后通过配置工作路径 workingDir, 需要执行的命令 commandLine，一个 Gradle 脚本就好了，然后通过 android studio 提供的 ui 界面执行或者 Gradle 的命令行形式直接执行这个 task 即可。

稍微介绍下上述一句话带过的 Gradle 脚本执行方式：  

**Android Studio方式**：  

1. 新建 Gradle 脚本文件，如 sign.gradle，放在与你项目的 app 层级的 build.gradle 同级别即可
2. 在 app 层级的 build.gradle 文件开头添加：apply from: 'sign.gradle'  
3. 在你自己建的 gradle 脚本文件中编写你的脚本代码，注意你自定义的 task 最好指定一个 group
4. 此时在 Android Studio 右侧的 Gradle 面板中就可以找到你自行指定的 group 中的所有 task，点击即可执行

![as执行gradle脚本示例.png](https://upload-images.jianshu.io/upload_images/1924341-f33c8b422c613433.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

如果你的 Gradle 脚本文件中的 task 不指定一个 group 的话，那么在 Gradle 面板中就有的你找了

**gradle 命令行方式**：

如果你电脑有配置好 Gradle 的环境变量，那么你直接在终端中输入命令：`gradlew task名` 即可，如上图中有 sign, sign2 等四个 task，终端下输入 `gradlew sign2` 就可以执行 sign2 的工作了。

如果电脑没配置 Gradle 环境变量，那每个项目下都会有一个 Gradle 文件夹，它支持我们执行命令，所以你也可以在 Android Studio 的 Terminal 中直接执行命令即可，打开它的时候路径默认为项目根目录的路径，在这里就可以执行 Gradle 的命令了。  

![命令行执行示例.png](https://upload-images.jianshu.io/upload_images/1924341-d10612f0c937ac09.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

##### 3.3 exec {}

**命令**：`exec {}`   

**解释**：这个命令的用法可以说跟 3.2 介绍的方式一模一样，我个人针对这两个的区别理解就是，3.2 介绍的方式必须通过 task 方式去执行一个命令，但 exec{} 的方式可以通过方法也可以通过 task 方式，比较灵活，这是我的理解。  

**示例**：  

```  groovy
def sign() {
    //设置命令执行结果的输出的地方
    def out = new ByteArrayOutputStream()
    //通过 exec {} 方式来执行命令
    exec {
        workingDir 'C:\\users\\suxq\\desktop'
        commandLine 'cmd', '/c', 'dir'
        //修改命令输出的地方，默认为控制台
        standardOutput = out
    }
    //将命令的执行结果作为方法的返回值
    return out
}
```

解释：def sign() 定义了一个方法，内部就可以通过 exec{} 来执行指定的命令，并且可以通过修改命令结果输出的地方来达到获取命令执行的结果的目的。而且，这个方法可以在你的 Gradle 脚本中在你需要的地方调用即可，而通常 task 之间只有前后依赖关系，而没有内部嵌套调用关系。

### 4. 完整示例

学习完上述内容后，知道了如何遍历操作，如何处理字符串，如何通过 Gradle 执行命令，就差不多可以来写 Gradle 脚本，让它帮我们做些事了，还是跟上一篇相同的场景：    

场景：遍历指定路径目录下的所有 apk 文件，并通过一个 sign.jar 文件，分别对每个 apk 文件执行 java 命令来进行签名工作，sign.jar 接收两个参数，一个是需要签名的 apk，另外一个为输出的 apk，要求签名后的 apk 命名方式为将原文件名中的 unsign 替换成 google，并输出在跟 apk 同一个目录内即可。

![完整示例.png](https://upload-images.jianshu.io/upload_images/1924341-a19e2d07e083c304.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

apk 路径：c:\users\suxq\desktop\outputs

sign.jar 路径：c:\users\suxq\desktop

java 签名命令示例(要求 sign.jar 和 apk 文件都在同一路径下，即可用如下命令)：

`java -jar sign.jar meizi_1_3_0_debug_unsign.apk meizi_1_3_0_debug_google.apk`  

**Gradle 脚本**  

```  groovy
task sign {
    group = sign

    doLast {
        def signJar = "c:\\users\\suxq\\desktop\\sign.jar"
        def apkPath = 'c:\\users\\suxq\\desktop\\outputs\\'

        fileTree(file(apkPath)){
            include "*.apk"
        }
        .each {file ->
            def outApk = file.name.replace("unsign", "google")
            //由于场景是模拟的，因此这里就只是将最后执行的java命令输出，从输出的命令中就可以看出命令是否可以正确执行
            def java = "java -jar ${signJar} ${file.name} ${outApk}"
            println java
            
            //实际场景下，执行这句代码，上面代码只是为了看整合之后的命令
            //"java -jar ${signJar} ${file.name} ${outApk}".execute()
        }
    }
}
```

![完整示例3.png](https://upload-images.jianshu.io/upload_images/1924341-96faf18fdab5b5e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

效果：完美，可以解放双手，让脚本干活去吧~

