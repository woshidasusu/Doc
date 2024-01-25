import{_ as r,r as d,o as l,c as t,a as e,b as i,e as n,d as s}from"./app-XVH6qKTA.js";const o={},v=s('<p>最近碰到一些 so 文件问题，顺便将相关知识点梳理一下。</p><h1 id="提问" tabindex="-1"><a class="header-anchor" href="#提问" aria-hidden="true">#</a> 提问</h1><p>本文的结论是跟着 <code>System.loadlibrary()</code> 一层层源码走进去，个人对其的理解所整理的，那么开始看源码之前，先来提几个问题：</p><p><strong>Q1：你知道 so 文件的加载流程吗？</strong></p><p><strong>Q2：设备存放 so 的路径有 system/lib，vendor/lib，system/lib64，vendor/lib64，知道在哪里规定了这些路径吗？清楚哪些场景下系统会去哪个目录下寻找 so 文件吗？还是说，所有的目录都会去寻找？</strong></p><p><strong>Q3：Zygote 进程是分 32 位和 64 位的，那么，系统是如何决定某个应用应该运行在 32 位上，还是 64 位上？</strong></p><p><strong>Q4：如果程序跑在 64 位的 Zygote 进程上时，可以使用 32 位的 so 文件么，即应用的 primaryCpuAbi 为 arm64-v8a，那么是否可使用 armeabi-v7a 的 so 文件，兼容的吗？</strong></p><p>Q2，Q3，Q4，这几个问题都是基于设备支持 64 位的前提下，在旧系统版本中，只支持 32 位，也就没这么多疑问需要处理了。</p><h1 id="源码" tabindex="-1"><a class="header-anchor" href="#源码" aria-hidden="true">#</a> 源码</h1><h3 id="准备工作" tabindex="-1"><a class="header-anchor" href="#准备工作" aria-hidden="true">#</a> 准备工作</h3><p>由于这次的源码会涉及很多 framework 层的代码，包括 java 和 c++，直接在 AndroidStudio 跟进 SDK 的源码已不足够查看到相关的代码了。所以，此次是借助 Source Insight 软件，而源码来源如下：</p>',11),c={href:"https://android.googlesource.com/platform/",target:"_blank",rel:"noopener noreferrer"},u=e("p",null,"我并没有将所有目录下载下来，只下载了如下目录的源码：",-1),p={href:"https://android.googlesource.com/platform/system/core/+archive/android-5.1.1_r24.tar.gz",target:"_blank",rel:"noopener noreferrer"},b={href:"https://android.googlesource.com/platform/bionic/+archive/android-5.1.1_r24.tar.gz",target:"_blank",rel:"noopener noreferrer"},m={href:"https://android.googlesource.com/platform/libcore/+archive/android-5.1.1_r24.tar.gz",target:"_blank",rel:"noopener noreferrer"},g={href:"https://android.googlesource.com/platform/dalvik/+archive/android-5.1.1_r24.tar.gz",target:"_blank",rel:"noopener noreferrer"},y={href:"https://android.googlesource.com/platform/frameworks/base/+archive/android-5.1.1_r24.tar.gz",target:"_blank",rel:"noopener noreferrer"},h={href:"https://android.googlesource.com/platform/frameworks/native/+archive/android-5.1.1_r24.tar.gz",target:"_blank",rel:"noopener noreferrer"},f=s(`<p>我没有下载最新版本的代码，而是选择了 Tags 下的 More 按钮，然后选择 tag 为： <strong>android-5.1.1 r24</strong> 的代码下载。所以，此次分析的源码是基于这个版本，其余不同版本的代码可能会有所不一样，但大体流程应该都是一致的。</p><h3 id="分析" tabindex="-1"><a class="header-anchor" href="#分析" aria-hidden="true">#</a> 分析</h3><p>源码分析的过程很长很长，不想看过程的话，你也可以直接跳到末尾看结论，但就会错失很多细节的分析了。</p><p>那么下面就开始来过下源码吧，分析的入口就是跟着 <code>System.loadlibrary()</code> 走 ：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//System#loadlibrary()
public static void loadLibrary(String libName) {
    Runtime.getRuntime().loadLibrary(libName, VMStack.getCallingClassLoader());
}

//Runtime#loadLibrary()
void loadLibrary(String libraryName, ClassLoader loader) {
    //1. 程序中通过 System.loadlibrary() 方式，这个 loader 就不会为空，流程走这边
    if (loader != null) {
        //2. loader.findLibrary() 这是个重点，这个方法用于寻找 so 文件是否存在
        String filename = loader.findLibrary(libraryName);
        if (filename == null) {
             throw new UnsatisfiedLinkError(loader + &quot; couldn&#39;t find \\&quot;&quot; + System.mapLibraryName(libraryName) + &quot;\\&quot;&quot;);
        }
        //3. 如果 so 文件找到，那么加载它
        String error = doLoad(filename, loader);
        if (error != null) {
            //4. 如果加载失败，那么抛异常
            throw new UnsatisfiedLinkError(error);
        }
        return;
    }
    
	//1.1 以下代码的运行场景我不清楚，但有几个方法可以蛮看一下
    //mapLibraryName 用于拼接 so 文件名的前缀:lib，和后缀.so
    String filename = System.mapLibraryName(libraryName);
    //...省略
    //1.2 mLibPaths 存储着设备存放 so 文件的目录地址
    for (String directory: mLibPaths) {
        String candidate = directory + filename;
        candidates.add(candidate);
        if (IoUtils.canOpenReadOnly(candidate)) 
            // 1.3 调用 native 层方法加载 so 库
            String error = doLoad(candidate, loader);
            if (error == null) {
                return; // We successfully loaded the library. Job done.
            }
            lastError = error;
        }
    }
	//...省略
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，其实 System 的 <code>loadlibrary()</code> 是调用的 Runtime 的 <code>loadLibrary()</code>，不同系统版本，这些代码是有些许差别的，但不管怎样，重点都还是 <code>loadLibrary()</code> 中调用的一些方法，这些方法基本没变，改变的只是其他代码的优化写法。</p><p>那么，要理清 so 文件的加载流程，或者说，要找出系统是去哪些地址加载 so 文件的，就需要梳理清这些方法：</p><ul><li><code>loader.findLibrary()</code></li><li><code>doLoad()</code></li></ul><p>第一个方法用于寻找 so 文件，所涉及的整个流程应该都在这个方法里，如果可以找到，会返回 so 文件的绝对路径，然后交由 <code>doLoad()</code> 去加载。</p><h4 id="java-library-path" tabindex="-1"><a class="header-anchor" href="#java-library-path" aria-hidden="true">#</a> java.library.path</h4><p>但在深入去探索之前，我想先探索另一条分支，loader 为空的场景。loader 什么时候为空，什么时候不为空，我并不清楚，只是看别人的文章分析时说，程序中通过 <code>System.loadlibrary()</code> 方式加载 so，那么 loader 就不会为空。那，我就信你了，不然我也不知道去哪分析为不为空的场景。</p><p>既然程序不会走另一个分支，为什么我还要先来探索它呢？因为，第一个分支太不好探索了，先从另一个分支摸索点经验，而且还发现了一些感觉可以拿来讲讲的方法：</p><ul><li><code>System.mapLibraryName()</code></li></ul><p>用于拼接 so 文件名的前缀 <code>lib</code>，和后缀 <code>.so</code>。</p><ul><li><code>mLibPaths</code></li></ul><p>在其他版本的源码中，可能就没有这个变量了，直接就是调用一个方法，但作用都一样，我们看看这个变量的赋值：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//Runtime.mLibPaths
private final String[] mLibPaths = initLibPaths();

//Runtime#initLibPaths()
private static String[] initLibPaths() {
    String javaLibraryPath = System.getProperty(&quot;java.library.path&quot;);
    //...省略
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后都是通过调用 System 的 <code>getProperty()</code> 方法，读取 <code>java.library.path</code> 的属性值。</p><p>也就是说，通过读取 <code>java.library.path</code> 的系统属性值，是可以获取到设备存放 so 库的目录地址的，那么就来看看在哪里有设置这个属性值进去。</p><p>System 内部有一个类型为 Properties 的静态变量，不同版本，这个变量名可能不一样，但作用也都一样，用来存储这些系统属性值，这样程序需要的时候，调用 <code>getProperty()</code> 读取属性值时其实是来这个静态变量中读取。而变量的初始化地方在类中的 static 代码块中：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//System
static {
    //...省略
    //1.初始化一些不变的系统属性值
    unchangeableSystemProperties = initUnchangeableSystemProperties();
    //2.将上述的属性值以及一些默认的系统属性值设置到静态变量中
    systemProperties = createSystemProperties();
    //...
}

//System#initUnchangeableSystemProperties()
private static Properties initUnchangeableSystemProperties() {
    //...省略一些属性值设置
    p.put(&quot;java.vm.vendor&quot;, projectName);
    p.put(&quot;java.vm.version&quot;, runtime.vmVersion());
    p.put(&quot;file.separator&quot;, &quot;/&quot;);
    p.put(&quot;line.separator&quot;, &quot;\\n&quot;);
    p.put(&quot;path.separator&quot;, &quot;:&quot;);
    //...
	
    //1.这里是重点
    parsePropertyAssignments(p, specialProperties());

    //...
    return p;
}

//System#createSystemProperties()
private static Properties createSystemProperties() {
    //1.拷贝不可变的一些系统属性值
    Properties p = new PropertiesWithNonOverrideableDefaults(unchangeableSystemProperties);
    //2.设置一些默认的属性值
    setDefaultChangeableProperties(p);
    return p;
}

//System#setDefaultChangeableProperties()
private static void setDefaultChangeableProperties(Properties p) {
    p.put(&quot;java.io.tmpdir&quot;, &quot;/tmp&quot;);
    p.put(&quot;user.home&quot;, &quot;&quot;);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>static 静态代码块中的代码其实就是在初始化系统属性值，分两个步骤，一个是先设置一些不可变的属性值，二是设置一些默认的属性值，然后将这些存储在静态变量中。</p><p>但其实，不管在哪个方法中，都没找到有设置 <code>java.library.path</code> 属性值的代码，那这个属性值到底是在哪里设置的呢？</p><p>关键点在于设置不可变的属性时，有调用了一个 native 层的方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//System
/**
* Returns an array of &quot;key=value&quot; strings containing information not otherwise
* easily available, such as #defined library versions.
*/
private static native String[] specialProperties();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这方法会返回 key=value 形式的字符串数组，然后 <code>parsePropertyAssignments()</code> 方法会去遍历这些数组，将这些属性值填充到存储系统属性值的静态变量中。</p><p>也就是说，在 native 层还会设置一些属性值，而 <code>java.library.path</code> 有可能就是在 native 中设置的，那么就跟下去看看吧。</p><p>System 连同包名的全名是：java.lang.System；那么，通常，所对应的 native 层的 cpp 文件名为：java_lang_System.cpp，到这里去看看：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>//platform/libcore/luni/src/main/native/java_lang_System.cpp#System_specialProperties()
static jobjectArray System_specialProperties(JNIEnv* env, jclass) {
    std::vector&lt;std::string&gt; properties;

    //...
	
    //1. 获取 LD_LIBRARY_PATH 环境变量值
    const char* library_path = getenv(&quot;LD_LIBRARY_PATH&quot;);
#if defined(HAVE_ANDROID_OS)
    if (library_path == NULL) {
        //2.如果 1 步骤没获取到路径，那么通过该方法获取 so 库的目录路径
        android_get_LD_LIBRARY_PATH(path, sizeof(path));
        library_path = path;
    }
#endif
    if (library_path == NULL) {
        library_path = &quot;&quot;;
    }
    //3.设置 java.library.path 属性值
    properties.push_back(std::string(&quot;java.library.path=&quot;) + library_path);

    return toStringArray(env, properties);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>没错吧，对应的 native 层的方法是上述这个，它干的事，其实也是设置一些属性值，我们想要的 <code>java.library.path</code> 就是在这里设置的。那么，这个属性值来源的逻辑是这样的：</p><ol><li>先读取 LD_LIBRARY_PATH 环境变量值，如果不为空，就以这个值为准。但我测试过，貌似，程序运行时读取的这个值一直是 null，在 Runtime 的 <code>doLoad()</code> 方法注释中，Google 有解释是说由于 Android 的进程都是通过 Zygote 进程 fork 过来，所以不能使用 LD_LIBRARY_PATH 。应该，大概，可能是这个意思吧，我英文不大好，你们可以自行去确认一下。</li><li>也就是说，第一步读取的 LD_LIBRARY_PATH 值是为空，所以会进入第二步，调用 android_get_LD_LIBRARY_PATH 方法来读取属性值。（进入这个步骤有个条件是定义了 HAVE_ANDROID_OS 宏变量，我就不去找到底哪里在什么场景下会定义了，看命名我直接猜测 Android 系统就都有定义的了）</li></ol><p>那么，继续看看 android_get_LD_LIBRARY_PATH 这个方法做了些什么：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>//platform/libcore/luni/src/main/native/java_lang_System.cpp
#if defined(HAVE_ANDROID_OS)
extern &quot;C&quot; void android_get_LD_LIBRARY_PATH(char*, size_t);
#endif
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>emmm，看不懂，头疼。那，直接全局搜索下这个方法名试试看吧，结果在另一个 cpp 中找到它的实现：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>//platform/bionic/linker/dlfcn.cpp
void android_get_LD_LIBRARY_PATH(char* buffer, size_t buffer_size) {
  ScopedPthreadMutexLocker locker(&amp;g_dl_mutex);
  do_android_get_LD_LIBRARY_PATH(buffer, buffer_size);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一行估计是加锁之类的意思吧，不管，第二行是调用另一个方法，继续跟下去看看：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>//platform/bionic/linker/linker.cpp
void do_android_get_LD_LIBRARY_PATH(char* buffer, size_t buffer_size) {
  //...
  char* end = stpcpy(buffer, kDefaultLdPaths[0]);
  *end = &#39;:&#39;;
  strcpy(end + 1, kDefaultLdPaths[1]);
}

static const char* const kDefaultLdPaths[] = {
#if defined(__LP64__)
  &quot;/vendor/lib64&quot;,
  &quot;/system/lib64&quot;,
#else
  &quot;/vendor/lib&quot;,
  &quot;/system/lib&quot;,
#endif
  nullptr
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还好 Source Insight 点击方法时有时可以支持直接跳转过去，调用的这个方法又是在另一个 cpp 文件中了。开头省略了一些大小空间校验的代码，然后直接复制了静态常量的值，而这个静态常量在这份文件顶部定义。</p><p>终于跟到底了吧，也就是说，如果有定义了 <strong>__LP64__</strong> 这个宏变量，那么就将 <code>java.library.path</code> 属性值赋值为 &quot;/vendor/lib64:/system/lib64&quot;，否则，就赋值为 &quot;/vendor/lib:/system/lib&quot;。</p><p>也就是说，so 文件的目录地址其实是在 native 层通过硬编码方式写死的，网上那些理所当然的说 so 文件的存放目录也就是这四个，是这么来的。那么，说白了，系统默认存放 so 文件的目录就两个，只是有两种场景。</p><p>而至于到底什么场景下会有这个 __LP64__ 宏变量的定义，什么时候没有，我实在没能力继续跟踪下去了，网上搜索了一些资料后，仍旧不是很懂，如果有清楚的大佬，能够告知、指点下就最棒了。</p><p>我自己看了些资料，以及，自己也做个测试：同一个 app，修改它的 primaryCpuAbi 值，调用 System 的 <code>getProperty()</code> 来读取 <code>java.library.path</code>，它返回的值是会不同的。</p><p>所以，以我目前的能力以及所掌握的知识，我是这么猜测的，纯属个人猜测：</p><p>__LP64__ 这个宏变量并不是由安卓系统代码来定义的，而是 Linux 系统层面所定义的。在 Linux 系统中，可执行文件，也可以说所运行的程序，如果是 32 位的，那么是没有定义这个宏变量的，如果是 64 位的，那么是有定义这个宏变量的。</p><p>总之，通俗的联想解释，__LP64__ 这个宏变量表示着当前程序是 32 位还是 64 位的意思。（个人理解）</p><p>有时间再继续研究吧，反正这里清楚了，系统默认存放 so 文件的目录只有两个，但有两种场景。vendor 较少用，就不每次都打出来了。也就是说，如果应用在 system/lib 目录中没有找到 so 文件，那么它是不会再自动去 system/lib64 中寻找的，两者它只会选其一。至于选择哪个，因为 Zygote 是有分 32 位还是 64 位进程的，那么刚好可以根据这个为依据。</p><h4 id="findlibrary" tabindex="-1"><a class="header-anchor" href="#findlibrary" aria-hidden="true">#</a> findLibrary</h4><p>该走回主线了，在支线中的探索已经摸索了些经验了。</p><p>大伙应该还记得吧，System 调用了 <code>loadlibrary()</code> 之后，内部其实是调用了 Runtime 的 <code>loadLibrary()</code> 方法，这个方法内部会去调用 ClassLoader 的 <code>findLibrary()</code> 方法，主要是去寻找这个 so 文件是否存在，如果存在，会返回 so 文件的绝对路径，接着交由 Runtime 的 <code>doLoad()</code> 方法去加载 so 文件。</p><p>所以，我们想要梳理清楚 so 文件的加载流程，<code>findLibrary()</code> 是关键。那么，接下去，就来跟着 <code>findLibrary()</code> 走下去看看吧：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ClassLoader#findLibrary()
protected String findLibrary(String libName) {
    return null;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ClassLoader 只是一个基类，具体实现在其子类，那这里具体运行的是哪个子类呢？</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//System#loadlibrary()
public static void loadLibrary(String libName) {
    Runtime.getRuntime().loadLibrary(libName, VMStack.getCallingClassLoader());
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以这里是调用了 VMStack 的一个方法来获取 ClassLoader 对象，那么继续跟进看看：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>native public static ClassLoader getCallingClassLoader();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>又是一个 native 的方法，我尝试过跟进去，没有看懂。那么，换个方向来找出这个基类的具体实现子类是哪个吧，很简单的一个方法，打 log 输出这个对象本身：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>ClassLoader classLoader = getClassLoader();
Log.v(TAG, &quot;classLoader = &quot; + classLoader.toString());
//输出
// classLoader = dalvik.system.PathClassLoader[dexPath=/data/app/com.qrcode.qrcode-1.apk,libraryPath=/data/app-lib/com.qrcode.qrcode-1]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,57),_={href:"https://my.oschina.net/wolfcs/blog/129696",target:"_blank",rel:"noopener noreferrer"},S=e("code",null,"getCallingClassLoader()",-1),L=s(`<p>或者，你对 Android 的类加载机制有所了解，知道当启动某个 app 时，经过层层工作后，会接着让 LoadedApk 去加载这个 app 的 apk，然后通过 ApplicationLoader 来加载相关代码文件，而这个类内部是实例化了一个 PathClassLoader 对象去进行 dex 的加载。</p><p>不管哪种方式，总之清楚了这里实际上是调用了 PathClassLoader 的 <code>findLibrary()</code> 方法，但 PathClassLoader 内部并没有这个方法，它继承自 BaseDexClassLoader，所以实际上还是调用了父类的方法，跟进去看看：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//platform/libcore/dalvik/src/main/java/dalvik/system/BaseDexClassLoader.java
public String findLibrary(String name) {
    return pathList.findLibrary(name);
}

private final DexPathList pathList;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>内部又调用了 DexPathList 的 <code>findLibrary()</code> 方法，继续跟进看看：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//platform/libcore/dalvik/src/main/java/dalvik/system/DexPathList.java
public String findLibrary(String libraryName) {
    //1. 拼接前缀：lib，和后缀：.so
    String fileName = System.mapLibraryName(libraryName);
    //2. 遍历所有存放 so 文件的目录，确认指定文件是否存在以及是只读文件
    for (File directory: nativeLibraryDirectories) {
        String path = new File(directory, fileName).getPath();
        if (IoUtils.canOpenReadOnly(path)) {
            return path;
        }
    }
    return null;
}

/** List of native library directories. */
private final File[] nativeLibraryDirectories;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到了这里，会先进行文件名补全操作，拼接上前缀：lib 和后缀：.so，然后遍历所有存放 so 文件的目录，当找到指定文件，且是只读属性，则返回该 so 文件的绝对路径。</p><p>所以，重点就是 nativeLibraryDirectories 这个变量了，这里存放着 so 文件存储的目录路径，那么得看看它在哪里被赋值了：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//platform/libcore/dalvik/src/main/java/dalvik/system/DexPathList.java
public DexPathList(ClassLoader definingContext, String dexPath, String libraryPath, File optimizedDirectory) {
    //...
    //1. 唯一赋值的地方，构造函数
    this.nativeLibraryDirectories = splitLibraryPath(libraryPath);
}

private static File[] splitLibraryPath(String path) {
    // Native libraries may exist in both the system and
    // application library paths, and we use this search order:
    //
    //   1. this class loader&#39;s library path for application libraries
    //   2. the VM&#39;s library path from the system property for system libraries
    //   (翻译下，大体是说，so 文件的来源有两处：1是应用自身存放 so 文件的目录，2是系统指定的目录)
    // This order was reversed prior to Gingerbread; see http://b/2933456.
    ArrayList &lt; File &gt; result = splitPaths(path, System.getProperty(&quot;java.library.path&quot;), true);
    return result.toArray(new File[result.size()]);
}

//将传入的两个参数的目录地址解析完都存放到集合中
private static ArrayList &lt; File &gt; splitPaths(String path1, String path2, boolean wantDirectories) {
    ArrayList &lt; File &gt; result = new ArrayList &lt; File &gt; ();
	
    splitAndAdd(path1, wantDirectories, result);
    splitAndAdd(path2, wantDirectories, result);
    return result;
}

private static void splitAndAdd(String searchPath, boolean directoriesOnly, ArrayList &lt; File &gt; resultList) {
    if (searchPath == null) {
        return;
    }
    //因为获取系统的 java.library.path 属性值返回的路径是通过 : 拼接的，所以先拆分，然后判断这些目录是否可用 
    for (String path: searchPath.split(&quot;:&quot;)) {
        try {
            StructStat sb = Libcore.os.stat(path);
            if (!directoriesOnly || S_ISDIR(sb.st_mode)) {
                resultList.add(new File(path));
            }
        } catch(ErrnoException ignored) {}
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，nativeLibraryDirectories 这个变量是在构造函数中被赋值。代码不多，总结一下，构造函数会传入一个 libraryPath 参数，表示应用自身存放 so 文件的路径，然后内部会再去调用 System 的 <code>getProperty(&quot;java.library.path&quot;)</code> 方法获取系统指定的 so 文件目录地址。最后，将这些路径都添加到集合中。</p><p>而且，看添加的顺序，是先添加应用自身的 so 文件目录，然后再添加系统指定的 so 文件目录，也就是说，当加载 so 文件时，是先去应用自身的 so 文件目录地址寻找，没有找到，才会去系统指定的目录。</p><p>而系统指定的目录地址在 native 层的 linker.cpp 文件定义，分两种场景，取决于应用当前的进程是 32 位还是 64 位，32 位的话，则按顺序分别去 vendor/lib 和 system/lib 目录中寻找，64 位则是相对应的 lib64 目录中。</p><p>虽然，so 文件加载流程大体清楚了，但还有两个疑问点：</p><ul><li>构造方法参数传入的表示应用自身存放 so 文件目录的 libraryPath 值是哪里来的；</li><li>应用什么时候运行在 32 位或 64 位的进程上；</li></ul><h4 id="nativelibrarydir" tabindex="-1"><a class="header-anchor" href="#nativelibrarydir" aria-hidden="true">#</a> nativeLibraryDir</h4><p>先看第一个疑问点，应用自身存放 so 文件目录的这个值，要追究的话，这是一个很漫长的故事。</p><p>这个过程，我不打算全部都贴代码了，因为很多步骤，我自己也没有去看源码，也是看的别人的文章，我们以倒着追踪的方式来进行追溯吧。</p><p>首先，这个 libraryPath 值是通过 DexPathList 的构造方法传入的，而 BaseDexClassLoader 内部的 DexPathList 对象实例化的地方也是在它自己的构造方法中，同样，它也接收一个 libraryPath 参数值，所以 BaseDexClassLoader 只是做转发，来源并不在它这里。</p><p>那么，再往回走，就是 LoadedApk 实例化 PathClassLoader 对象的地方了，在它的 <code>getClassLoader()</code> 方法中：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//platform/frameworks/base/core/java/android/app/LoadedApk.java
public ClassLoader getClassLoader() {
    synchronized(this) {
        //...
        final ArrayList &lt; String &gt; libPaths = new ArrayList &lt; &gt;();
        //...
        libPaths.add(mLibDir);
		//...
        final String lib = TextUtils.join(File.pathSeparator, libPaths);
		//...
        mClassLoader = ApplicationLoaders.getDefault().getClassLoader(zip, lib, mBaseClassLoader);
		//...
    }
}

public LoadedApk(ActivityThread activityThread, ApplicationInfo aInfo, CompatibilityInfo compatInfo, ClassLoader baseLoader, boolean securityViolation, boolean includeCode, boolean registerPackage) {
   //...
    mLibDir = aInfo.nativeLibraryDir;
   //...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>无关代码都省略掉了，也就是说，传给 DexPathList 的 libraryPath 值，其实是将要启动的这个 app 的 ApplicationInfo 中的 nativeLibraryDir 变量值。</p><p>可以看看 ApplicationInfo 中这个变量的注释：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ApplicationInfo 
/**
* Full path to the directory where native JNI libraries are stored.
* 存放 so 文件的绝对路径
*/
public String nativeLibraryDir;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通俗点解释也就是，存放应用自身 so 文件的目录的绝对路径。那么问题又来了，传给 LoadedApk 的这个 ApplicationInfo 对象哪里来的呢？</p><p>这个就又涉及到应用的启动流程了，大概讲一下：</p><p>我们知道，当要启动其他应用时，其实是通过发送一个 Intent 去启动这个 app 的 LAUNCHER 标志的 Activity。而当这个 Intent 发送出去后，是通过 Binder 通信方式通知了 ActivityManagerServer 去启动这个 Activity。</p><p>AMS 在这个过程中会做很多事，但在所有事之前，它得先解析 Intent，知道要启动的是哪个 app 才能继续接下去的工作，这个工作在 ActivityStackSupervisor 的 <code>resolveActivity()</code>：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ActivityStackSupervisor.java
ActivityInfo resolveActivity(Intent intent, String resolvedType, int startFlags, ProfilerInfo profilerInfo, int userId) {
    // Collect information about the target of the Intent.
    ActivityInfo aInfo;
    try {
        ResolveInfo rInfo = AppGlobals.getPackageManager().resolveIntent(intent, resolvedType, PackageManager.MATCH_DEFAULT_ONLY | ActivityManagerService.STOCK_PM_FLAGS, userId);
        aInfo = rInfo != null ? rInfo.activityInfo: null;
    } catch(RemoteException e) {
        aInfo = null;
    }
    //...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不同版本，可能不是由这个类负责这个工作了，但可以跟着 ActivityManagerService 的 <code>startActivity()</code> 走下去看看，不用跟很深就能找到，因为这个工作是比较早进行的。</p><p>所以，解析 Intent 获取 app 的相关信息就又交给 PackageManagerService 的 <code>resolveIntent()</code> 进行了，PKMS 的工作不贴了，我直接说了吧：</p><p>PKMS 会根据 Intent 中目标组件的 packageName，通过一个只有包权限的类 Settings 来获取对应的 ApplicationInfo 信息，这个 Settings 类全名：com.android.server.pm.Settings，它的职责之一是存储所有 app 的基本信息，也就是在 data/system/packages.xml 中各 app 的信息都交由它维护缓存。</p><p>所以，一个 app 的 ApplicationInfo 信息，包括 nativeLibraryDir 我们都可以在 data/system/packages.xml 这份文件中查看到。这份文件的角色我把它理解成类似 PC 端上的注册表，所有 app 的信息都注册在这里。</p><p>那这份 packages.xml 文件的数据又是从哪里来的呢，这又得涉及到 apk 的安装机制过程了。</p><p>简单说一下，一个 app 的安装过程，在解析 apk 包过程中，还会结合各种设备因素等等来决定这个 app 的各种属性，比如说 nativeLibraryDir 这个属性值的确认，就需要考虑这个 app 是三方应用还是系统应用，这个应用的 primaryCpuAbi 属性值是什么，apk 文件的地址等等因素后，最后才确定了应用存放 so 文件的目录地址是哪里。</p><p>举个例子，对于系统应用来说，这个 nativeLibraryDir 值有可能最后是 /system/lib/xxx，也有可能是 system/app/xxx/lib 等等；而对于三方应用来说，这值有可能就是 data/app/xxx/lib；</p><p>也就是说，当 app 安装完成时，这些属性值也就都解析到了，就都会保存到 Settings 中，同时会将这些信息写入到 data/system/packages.xml 中。</p><p><strong>到这里，先来小结一下，梳理下前面的内容：</strong></p><p>当一个 app 安装的时候，系统会经过各种因素考量，最后确认 app 的一个 nativeLibraryDir 属性值，这个属性值代表应用自身的 so 文件存放地址，这个值也可以在 data/system/packages.xml 中查看。</p><p>当应用调用了 System 的 <code>loadlibrary()</code> 时，这个 so 文件的加载流程如下：</p><ol><li>先到 nativeLibraryDir 指向的目录地址中寻找这个 so 文件是否存在、可用；</li><li>如果没找到，那么根据应用进程是 32 位或者 64 位来决定下去应该去哪个目录寻找 so 文件；</li><li>如果是 32 位，则先去 vendor/lib 找，最后再去 system/lib 中寻找；</li><li>如果是 64 位，则先去 vendor/lib64 找，最后再去 system/lib64 中寻找；</li><li>系统默认的目录是在 native 层中的 linker.cpp 文件中指定，更严谨的说法，不是进程是不是 32 位或 64 位，而是是否有定义了 __LP64__ 这个宏变量。</li></ol><h4 id="primarycpuabi" tabindex="-1"><a class="header-anchor" href="#primarycpuabi" aria-hidden="true">#</a> primaryCpuAbi</h4><p>我们已经清楚了，加载 so 文件的流程，其实就分两步，先去应用自身存放 so 文件的目录（nativeLibraryDir）寻找，找不到，再去系统指定的目录中寻找。</p><p>而系统指定是目录分两种场景，应用进程是 32 位或者 64 位，那么，怎么知道应用是运行在 32 位还是 64 位的呢？又或者说，以什么为依据来决定一个应用是应该跑在 32 位上还是跑在 64 位上？</p><p>这个就取决于一个重要的属性了 primaryCpuAbi，它代表着这个应用的 so 文件使用的是哪个 abi 架构。</p><p>abi 常见的如：arm64-v8a，armeabi-v7a，armeabi，mips，x86_64 等等。</p><p>我们在打包 apk 时，如果不指定，其实默认是会将所有 abi 对应的 so 文件都打包一份，而通常，为了减少 apk 包体积，我们在 build.gradle 脚本中会指定只打其中一两份。但不管 apk 包有多少种不同的 abi 的 so 文件，在 app 安装过程中，最终拷贝到 nativeLibraryDir 中的通常都只有一份，除非你手动指定了要多份。</p><p>那么，app 在安装过程中，怎么知道，应该拷贝 apk 中的 lib 下的哪一份 so 文件呢？这就是由应用的 primaryCpuAbi 属性决定。</p><p>而同样，这个属性一样是在 app 安装过程中确定的，这个过程更加复杂，末尾有给了篇链接，感兴趣可以去看看，大概来说，就是 apk 包中的 so 文件、系统应用、相同 UID 的应用、设备的 abilist 等都对这个属性值的确定过程有所影响。同样，这个属性值也可以在 data/system/packages.xml 中查看。</p><p>那么，这个 primaryCpuAbi 属性值是如何影响应用进程是 32 位还是 64 位的呢？</p><p>这就涉及到 Zygote 方面的知识了。</p><p>在系统启动之后，系统会根据设备的 ro.zygote 属性值决定启动哪个 Zygote，可以通过执行 <code>getprop | grep ro.zygote</code> 来查看这个属性值，属性值与对应的 Zygote 进程关系如下：</p><ul><li>zygote32：只启动一个 32 位的 Zygote 进程</li><li>zygote32_64：启动两个 Zygote 进程，分别为 32 位和 64 位，32 位的进程名为 zygote，表示以它为主，64 位进程名为 zygote_secondary ，表示它作为辅助</li><li>zygote64：只启动一个 64 位的 Zygote 进程</li><li>zygote64_32：启动两个 Zygote 进程，分别为 32 位和 64 位，64 位的进程名为 zygote，表示以它为主，32 位进程名为 zygote_secondary ，表示它作为辅助</li></ul><p>而 Zygote 进程启动之后，会打开一个 socket 端口，等待 AMS 发消息过来启动新的应用时 fork 当前 Zygote 进程，所以，如果 AMS 是发给 64 位的 Zygote，那么新的应用自然就是跑在 64 位的进程上；同理，如果发给了 32 位的 Zygote 进程，那么 fork 出来的进程自然也就是 32 位的。</p><p>那么，可以跟随着 AMS 的 <code>startProcessLocked()</code> 方法，去看看是以什么为依据选择 32 位或 64 位的 Zygote：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//ActivityManagerService
private final void startProcessLocked(ProcessRecord app, String hostingType, String hostingNameStr, String abiOverride, String entryPoint, String[] entryPointArgs) {
	//...省略
    //1. 获取要启动的 app 的 primaryCpuAbi 属性值，abiOverride 不知道是什么，可能是 Google 开发人员写测试用例用的吧，或者其他一些场景
    String requiredAbi = (abiOverride != null) ? abiOverride: app.info.primaryCpuAbi;
    if (requiredAbi == null) {
        //2. 如果为空，以设备支持的首个 abi 属性值，可执行 getprot ro.product.cpu.abilist 查看
        requiredAbi = Build.SUPPORTED_ABIS[0];
    }
    //...
	
    //3. 调用Precess 的 start 方法，将 requiredAbi 传入
    Process.ProcessStartResult startResult = Process.start(entryPoint, app.processName, uid, uid, gids, debugFlags, mountExternal, app.info.targetSdkVersion, app.info.seinfo, requiredAbi, instructionSet, app.info.dataDir, entryPointArgs);
	//...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AMS 会先获取要启动的 app 的 primaryCpuAbi 属性值，至于这个 app 的相关信息怎么来的，跟上一小节一样，解析 Intent 时交由 PKMS 去它模块内部的 Settings 读取的。</p><p>如果 primaryCpuAbi 为空，则以设备支持的首个 abi 属性值为主，设备支持的 abi 列表可以通过执行 <code>getprot ro.product.cpu.abilist</code> 查看，最后调用 Precess 的 <code>start()</code> 方法，将读取的 abi 值传入：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//Process
public static final ProcessStartResult start(final String processClass, final String niceName, int uid, int gid, int[] gids, int debugFlags, int mountExternal, int targetSdkVersion, String seInfo, String abi, String instructionSet, String appDataDir, String[] zygoteArgs) {
	//...
    return startViaZygote(processClass, niceName, uid, gid, gids, debugFlags, mountExternal, targetSdkVersion, seInfo, abi, instructionSet, appDataDir, zygoteArgs);
	//...
}

private static ProcessStartResult startViaZygote(final String processClass, final String niceName, final int uid, final int gid, final int[] gids, int debugFlags, int mountExternal, int targetSdkVersion, String seInfo, String abi, String instructionSet, String appDataDir, String[] extraArgs) throws ZygoteStartFailedEx {
	//...
    //所以 abi 最终是调用 openZygoteSocketIfNeeded() 方法，传入给它使用
    return zygoteSendArgsAndGetResult(openZygoteSocketIfNeeded(abi), argsForZygote);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>abi 值又是一层传一层，最终交到了 Process 的 <code>openZygoteSocketIfNeeded()</code> 方法中使用，跟进看看：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//Process
private static ZygoteState openZygoteSocketIfNeeded(String abi) throws ZygoteStartFailedEx {
    if (primaryZygoteState == null || primaryZygoteState.isClosed()) {
        try {
            //ZYGOTE_SOCKET值为 zygote,
            //通过 ZygoteState 的 connect 方法，连接进程名为 zygote 的 Zygote 进程
            primaryZygoteState = ZygoteState.connect(ZYGOTE_SOCKET);
        } catch(IOException ioe) {
            throw new ZygoteStartFailedEx(&quot;Error connecting to primary zygote&quot;, ioe);
        }
    }
	//在进程名为 zygote 的 Zygote 进程支持的 abi 列表中，查看是否支持要启动的 app 的需要的 abi
    if (primaryZygoteState.matches(abi)) {
        return primaryZygoteState;
    }

    // The primary zygote didn&#39;t match. Try the secondary.
    if (secondaryZygoteState == null || secondaryZygoteState.isClosed()) {
        try {
             //SECONDARY_ZYGOTE_SOCKET 的值为 zygote_secondary,
            //通过 ZygoteState 的 connect 方法，连接进程名为 zygote_secondary 的 Zygote 进程
            secondaryZygoteState = ZygoteState.connect(SECONDARY_ZYGOTE_SOCKET);
        } catch(IOException ioe) {
            throw new ZygoteStartFailedEx(&quot;Error connecting to secondary zygote&quot;, ioe);
        }
    }
	//在进程名为 zygote_secondary 的 Zygote 进程支持的 abi 列表中，查看是否支持要启动的 app 的需要的 abi
    if (secondaryZygoteState.matches(abi)) {
        return secondaryZygoteState;
    }

    throw new ZygoteStartFailedEx(&quot;Unsupported zygote ABI: &quot; + abi);
}

static ZygoteState primaryZygoteState;
static ZygoteState secondaryZygoteState;
public static final String ZYGOTE_SOCKET = &quot;zygote&quot;;
public static final String SECONDARY_ZYGOTE_SOCKET = &quot;zygote_secondary&quot;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到了这里，是先获取进程名 zygote 的 Zygote 进程，查看它支持的 abi 列表中是否满足要启动的 app 所需的 abi，如果满足，则使用这个 Zygote 来 fork 新进程，否则，获取另一个进程名为 zygote_secondary 的 Zygote 进程，同样查看它支持的 abi 列表中是否满足 app 所需的 abi，如果都不满足，抛异常。</p><p>那么，名为 zygote 和 zygote_secondary 分别对应的是哪个 Zygote 进程呢？哪个对应 32 位，哪个对应 64 位？</p><p>还记得上述说过的，系统启动后，会去根据设备的 ro.zygote 属性决定启动哪个 Zygote 进程吗？对应关系就是这个属性值决定的，举个例子，可以看看 zygote64_32 对应的 Zygote 启动配置文件：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//platform/system/core/rootdir/init.zygote64_32.rc
service zygote /system/bin/app_process64 -Xzygote /system/bin --zygote --start-system-server --socket-name=zygote
    class main
    socket zygote stream 660 root system
    onrestart write /sys/android_power/request_state wake
    onrestart write /sys/power/state on
    onrestart restart media
    onrestart restart netd

service zygote_secondary /system/bin/app_process32 -Xzygote /system/bin --zygote --socket-name=zygote_secondary
    class main
    socket zygote_secondary stream 660 root system
    onrestart restart zygote
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这份代码前半段的意思就表示，让 Linux 启动一个 service，进程名为 zygote，可执行文件位于 /system/bin/app_process64，后面是参数以及其他命令。</p><p>所以，名为 zygote 和 zygote_secondary 分别对应的是哪个 Zygote 进程，就取决于设备的 ro.zygote 属性。</p><p>而，获取 Zygote 支持的 abi 列表是通过 ZygoteState 的 <code>connect()</code> 方法，我们继续跟进看看：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//Process$ZygoteState
public static ZygoteState connect(String socketAddress) throws IOException {
    //...

    String abiListString = getAbiList(zygoteWriter, zygoteInputStream);
    Log.i(&quot;Zygote&quot;, &quot;Process: zygote socket opened, supported ABIS: &quot; + abiListString);

    return new ZygoteState(zygoteSocket, zygoteInputStream, zygoteWriter, Arrays.asList(abiListString.split(&quot;,&quot;)));
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发现没有，源码内部将 Zygote 支持的 abi 列表输出日志了，你们可以自己尝试下，过滤下 TAG 为 Zygote，然后重启下设备，因为如果本来就连着 Zygote，那么是不会走到这里的了，最后看一下相关日志，如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>01-01 08:00:13.509 2818-2818/? D/AndroidRuntime: &gt;&gt;&gt;&gt;&gt;&gt; START com.android.internal.os.ZygoteInit uid 0 &lt;&lt;&lt;&lt;&lt;&lt;
01-01 08:00:15.068 2818-2818/? D/Zygote: begin preload
01-01 08:00:15.081 2818-3096/? I/Zygote: Preloading classes...
01-01 08:00:15.409 2818-3097/? I/Zygote: Preloading resources...
01-01 08:00:16.637 2818-3097/? I/Zygote: ...preloaded 343 resources in 1228ms.
01-01 08:00:16.669 2818-3097/? I/Zygote: ...preloaded 41 resources in 33ms.
01-01 08:00:17.242 2818-3096/? I/Zygote: ...preloaded 3005 classes in 2161ms.
01-01 08:00:17.373 2818-2818/? I/Zygote: Preloading shared libraries...
01-01 08:00:17.389 2818-2818/? D/Zygote: end preload
01-01 08:00:17.492 2818-2818/? I/Zygote: System server process 3102 has been created
01-01 08:00:17.495 2818-2818/? I/Zygote: Accepting command socket connections
01-01 08:00:32.789 3102-3121/? I/Zygote: Process: zygote socket opened, supported ABIS: armeabi-v7a,armeabi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>系统启动后，Zygote 工作的相关内容基本都打日志出来了。</p><p>最后，再来稍微理一理：</p><p>app 安装过程，会确定 app 的一个属性值：primaryCpuAbi，它代表着这个应用的 so 文件使用的是哪个 abi 架构，而且它的确定过程很复杂，apk 包中的 so 文件、系统应用、相同 UID 的应用、设备的 abilist 等都对这个属性值的确定过程有所影响。安装成功后，可以在 data/system/packages.xml 中查看这个属性值。</p><p>每启动一个新的应用，都是运行在新的进程中，而新的进程是从 Zygote 进程 fork 过来的，系统在启动时，会根据设备的 ro.zygote 属性值决定启动哪几个 Zygote 进程，然后打开 socket，等待 AMS 发送消息来 fork 新进程。</p><p>当系统要启动一个新的应用时，AMS 在负责这个工作进行到 Process 类的工作时，会先尝试在进程名为 zygote 的 Zygote 进程中，查看它所支持的 abi 列表中是否满足要启动的 app 所需的 abi，如果满足，则以这个 Zygote 为主，fork 新进程，运行在 32 位还是 64 位就跟这个 Zygote 进程一致，而 Zygote 运行在几位上取决于 ro.zygote 对应的文件，如值为 zygote64_32 时，对应着 init.zygote64_32.rc 这份文件，那么此时名为 zygote 的 Zygote 就是运行在 64 位上的。</p><p>而当上述所找的 Zygote 支持的 abi 列表不满足 app 所需的 abi 时，那么再去名为 zygote_secondary 的 Zygote 进程中看看，它所支持的 abi 列表是否满足。</p><p>另外，Zygote 的相关工作流程，包括支持的 abi 列表，系统都有打印相关日志，可过滤 Zygote 查看，如没发现，可重启设备查看。</p><h4 id="abi-兼容" tabindex="-1"><a class="header-anchor" href="#abi-兼容" aria-hidden="true">#</a> abi 兼容</h4><p>so 文件加载的流程，及应用运行在 32 位或 64 位的依据我们都梳理完了，以上内容足够掌握什么场景下，该去哪些目录下加载 so 文件的判断能力了。</p><p>那么，还有个问题，如果应用运行在 64 位上，那么此时，它是否能够使用 armeabi-v7a 的 so 文件？</p><p>首先，先来罗列一下常见的 abi ：</p><ul><li>arm64-v8a，armeabi-v7a，armeabi，mips，mips64，x86，x86_64</li></ul><p>其中，运行在 64 位的 Zygote 进程上的是：</p><ul><li>arm64-v8a，mips64，x86_64</li></ul><p>同样，运行在 32 位的 Zygote 进程上的是：</p><ul><li>armeabi-v7a，armeabi，mips，x86</li></ul><p>你们如果去网上搜索如下关键字：so 文件，abi 兼容等，你们会发现，蛮多文章里都会说：arm64-v8a 的设备能够向下兼容，支持运行 32 位的 so 文件，如 armeabi-v7a。</p><p>这句话没错，64 位的设备能够兼容运行 32 位的 so 文件，但别只看到这句话啊，良心一些的文章里还有另一句话：<strong>不同 cpu 架构的 so 文件不能够混合使用</strong>，例如，程序运行期间，要么全部使用 arm64-v8a 的 so 文件，要么全部使用 armeabi-v7a 的 so 文件，你不能跑在 64 位进程上，却使用着 32 位的 so 文件。</p><p>我所理解的兼容，并不是说，64 位的设备，支持你运行在 64 位的 Zygote 进程上时仍旧可以使用 32 位的 so 文件。有些文章里也说了，如果在 64 位的设备上，你选择使用 32 位的 so 文件，那么此时，你就丢失了专门为 64 位优化过的性能（ART，webview，media等等 ）。这个意思就是说，程序启动时是从 32 位的 Zygote 进程 fork 过来的，等于你在 64 位的设备上，但却只运行在 32 位的进程上。</p><p>至于程序如何决定运行在 32 位还是 64 位，上面的章节中也分析过了，以 app 的 primaryCpuAbi 属性值为主，而这个属性值的确定因素之一就是含有的 so 文件所属的 abi。</p><p>如果，你还想自己验证，那么可以跟着 Runtime 的 <code>doLoad()</code> 方法跟到 native 层去看看，由于我下载的源码版本可能有些问题，我没找到 Runtime 对应的 cpp 文件，但我找到这么段代码：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>//platform/bionic/linker/linker_phdr.cpp
bool ElfReader::VerifyElfHeader() {
  //...
  //1.读取 elf 文件的 header 的 class 信息
  int elf_class = header_.e_ident[EI_CLASS];
#if defined(__LP64__)
  //2. 如果当前进程是64位的，而 elf 文件属于 32 位的，则报错
  if (elf_class != ELFCLASS64) {
    if (elf_class == ELFCLASS32) {
      DL_ERR(&quot;\\&quot;%s\\&quot; is 32-bit instead of 64-bit&quot;, name_);
    } else {
      DL_ERR(&quot;\\&quot;%s\\&quot; has unknown ELF class: %d&quot;, name_, elf_class);
    }
    return false;
  }
#else
    //3. 如果当前进程是32位的，而 elf 文件属于 64 位的，则报错
  if (elf_class != ELFCLASS32) {
    if (elf_class == ELFCLASS64) {
      DL_ERR(&quot;\\&quot;%s\\&quot; is 64-bit instead of 32-bit&quot;, name_);
    } else {
      DL_ERR(&quot;\\&quot;%s\\&quot; has unknown ELF class: %d&quot;, name_, elf_class);
    }
    return false;
  }
#endif
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>加载 so 文件，最终还是交由 native 层去加载，在 Linux 中，so 文件其实就是一个 elf 文件，elf 文件有个 header 头部信息，里面记录着这份文件的一些信息，如所属的是 32 位还是 64 位，abi 的信息等等。</p><p>而 native 层在加载 so 文件之前，会去解析这个 header 信息，当发现，如果当前进程运行在 64 位时，但要加载的 so 文件却是 32 位的，就会报 <code>xxx is 32-bit instead of 64-bit</code> 异常，同样，如果当前进程是运行在 32 位的，但 so 文件却是 64 位的，此时报 <code>xxx is 64-bit instead of 32-bit</code> 异常。</p><p>这个异常应该也有碰见过吧：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>java.lang.UnsatisfiedLinkError: dlopen failed: &quot;libimagepipeline.so&quot; is 32-bit instead of 64-bit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>所以说，64 位设备的兼容，并不是说，允许你运行在 64 位的进程上时，仍旧可以使用 32 位的 so 文件。它的兼容是说，允许你在 64 位的设备上运行 32 位的进程。</p><p>其实，想想也能明白，这就是为什么三方应用安装的时候，并不会将 apk 包中所有 abi 目录下的 so 文件都解压出来，只会解压一种，因为应用在安装过程中，系统已经确定你这个应用是应该运行在 64 位还是 32 位的进程上了，并将这个结果保存在 app 的 primaryCpuAbi 属性值中。</p><p>既然系统已经明确你的应用所运行的进程是 32 位还是 64 位，那么只需拷贝对应的一份 so 文件即可，毕竟 64 位的 so 文件和 32 位的又不能混合使用。</p><p>以上，是我的理解，如果有误，欢迎指点下。</p><h1 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h1><p>整篇梳理下来，虽然梳理 so 的加载流程不难，但要掌握知其所以然的程度，就需要多花费一点心思了。</p><p>毕竟都涉及到应用的安装机制，应用启动流程，系统启动机制，Zygote 相关的知识点了。如果你是开发系统应用的，建议还是花时间整篇看一下，毕竟系统应用的集成不像三方应用那样在 apk 安装期间自动将相关 so 文件解压到 nativeLibraryDirectories 路径下了。三方应用很少需要了解 so 的加载流程，但开发系统应用还是清楚点比较好。</p><p>不管怎么说，有时间，可以稍微跟着过一下整篇，相信多少是会有些收获的，如果发现哪里有误，也欢迎指点。没时间的话，那就看看总结吧。</p><ul><li>一个应用在安装过程中，系统会经过一系列复杂的逻辑确定两个跟 so 文件加载相关的 app 属性值：nativeLibraryDirectories ，primaryCpuAbi ；</li><li>nativeLibraryDirectories 表示应用自身存放 so 文件的目录地址，影响着 so 文件的加载流程；</li><li>primaryCpuAbi 表示应用应该运行在哪种 abi 上，如（armeabi-v7a），它影响着应用是运行在 32 位还是 64 位的进程上，进而影响到寻找系统指定的 so 文件目录的流程；</li><li>以上两个属性，在应用安装结束后，可在 data/system/packages.xml 中查看；</li><li>当调用 System 的 <code>loadLibrary()</code> 加载 so 文件时，流程如下：</li><li>先到 nativeLibraryDirectories 指向的目录中寻找，是否存在且可用的 so 文件，有则直接加载这里的 so 文件；</li><li>上一步没找到的话，则根据当前进程如果是 32 位的，那么依次去 vendor/lib 和 system/lib 目录中寻找；</li><li>同样，如果当前进程是 64 位的，那么依次去 vendor/lib64 和 system/lib64 目录中寻找；</li><li>当前应用是运行在 32 位还是 64 位的进程上，取决于系统的 ro.zygote 属性和应用的 primaryCpuAbi 属性值，系统的 ro.zygote 可通过执行 getprop 命令查看；</li><li>如果 ro.zygote 属性为 zygote64_32，那么应用启动时，会先在 ro.product.cpu.abilist64 列表中寻找是否支持 primaryCpuAbi 属性，有，则该应用运行在 64 位的进程上；</li><li>如果上一步不支持，那么会在 ro.product.cpu.abilist32 列表中寻找是否支持 primaryCpuAbi 属性，有，则该应用运行在 32 位的进程上；</li><li>如果 ro.zygote 属性为 zygote32_64，则上述两个步骤互换；</li><li>如果应用的 primaryCpuAbi 属性为空，那么以 ro.product.cpu.abilist 列表中第一个 abi 值作为应用的 primaryCpuAbi；</li><li>运行在 64 位的 abi 有：arm64-v8a，mips64，x86_64</li><li>运行在 32 位的 abi 有：armeabi-v7a，armeabi，mips，x86</li><li>通常支持 arm64-v8a 的 64 位设备，都会向下兼容支持 32 位的 abi 运行；</li><li>但应用运行期间，不能混合着使用不同 abi 的 so 文件；</li><li>比如，当应用运行在 64 位进程中时，无法使用 32 位 abi 的 so 文件，同样，应用运行在 32 位进程中时，也无法使用 64 位 abi 的 so 文件；</li></ul><h1 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h1>`,105),A={href:"https://blog.csdn.net/csdn_of_coder/article/details/52892266",target:"_blank",rel:"noopener noreferrer"},P={href:"https://blog.csdn.net/itachi85/article/details/64123035",target:"_blank",rel:"noopener noreferrer"},x={href:"https://blog.csdn.net/hp910315/article/details/51733410",target:"_blank",rel:"noopener noreferrer"},k={href:"https://blog.csdn.net/weixin_40107510/article/details/78138874",target:"_blank",rel:"noopener noreferrer"},q={href:"https://blog.csdn.net/canney_chen/article/details/50633982",target:"_blank",rel:"noopener noreferrer"};function Z(j,I){const a=d("ExternalLinkIcon");return l(),t("div",null,[v,e("p",null,[e("a",c,[i("https://android.googlesource.com/platform/"),n(a)])]),u,e("ul",null,[e("li",null,[e("a",p,[i("system/core"),n(a)])]),e("li",null,[e("a",b,[i("bionic"),n(a)])]),e("li",null,[e("a",m,[i("libcore"),n(a)])]),e("li",null,[e("a",g,[i("dalvik"),n(a)])]),e("li",null,[e("a",y,[i("frameworks/base"),n(a)])]),e("li",null,[e("a",h,[i("frameworks/native"),n(a)])])]),f,e("p",null,[i("以上打 Log 代码是从 "),e("a",_,[i("Java中System.loadLibrary() 的执行过程"),n(a)]),i(" 这篇文章中截取出来的，使用这个方法的前提是你得清楚 VMStack 的 "),S,i(" 含义其实是获取调用这个方法的类它的类加载器对象。")]),L,e("p",null,[e("a",A,[i("1.Android -- 系统进程Zygote的启动分析"),n(a)])]),e("p",null,[e("a",P,[i("2.Android应用程序进程启动过程（前篇）"),n(a)])]),e("p",null,[e("a",x,[i("3.如何查找native方法"),n(a)])]),e("p",null,[e("a",k,[i("4.Android中app进程ABI确定过程"),n(a)])]),e("p",null,[e("a",q,[i("5.Android 64 bit SO加载机制"),n(a)])])])}const C=r(o,[["render",Z],["__file","从源码中梳理 so 文件的加载流程.html.vue"]]);export{C as default};
