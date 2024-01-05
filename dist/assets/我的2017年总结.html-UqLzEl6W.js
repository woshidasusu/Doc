import{_ as r,r as o,o as d,c as s,a as e,b as a,e as t,d as n}from"./app-pwInIdNR.js";const l={},p=n('<p>2017就这么的过了，最近几天朋友圈里一直在晒18岁的梗，90后彻底退出青少年时代了，不服老不行啊，今天是17年最后一天，大家都去看晚会了，空巢老人还是写篇总结来记录下自己的2017吧。</p><p><strong>先回顾一下17年</strong>：</p><blockquote><p>3月4月偷偷离校满怀憧憬的跑去公司实习；<br> 5月6月回校做毕设、写论文，享受最后的校园时光，同时喜欢上了每天跑3公里，因为有着一个腹肌梦；<br> 6月底找了个基友，啥准备也没有就来了趟毕业旅行，跑到了人生中离开家最远的一次，爬了山，看了水，满足；<br> 7月作为职场小菜鸟步入公司，开始打怪升级，同时找了几个同学一起合租，开始学做菜，每天一下班就想着赶回去练手做菜；<br> 8月用第一次工资给老爸、老妈换了部手机，当然，找老姐资助了点，但功劳都是我的，哈哈哈；<br> 9月用剩余的工资给自己买了很多健身器材，开始了自己的健身梦；<br> 10月发现自己还是职场小菜鸟，经验条太长升级太慢，决定做做支线任务，每月至少写篇技术博客；<br> 10月底写了第一篇源码分析博客，投给了郭神，过了！成就感瞬间充满，开心，又更有动力了；<br> 11月发现小腹肌有了雏形，开心，工作也开始适应了，虽然还是小菜鸟，但多少可以为公司做点贡献了；<br> 11月12月事情开始多了，做菜的事也放一边了，锻炼也放一边了，给自己找了个借口：天冷；<br> 12月底想要总结一下，发现这一年来，喜欢的事很多，尝试的事也很多，但更多的都是没能坚持下去；<br> 18年给自己说了句话：锻炼的事得重新拿起来，不能放，博客的事也不能放，得坚持；</p></blockquote><h1 id="笔记整理" tabindex="-1"><a class="header-anchor" href="#笔记整理" aria-hidden="true">#</a> 笔记整理</h1><p>我平时是会通过 word 来记录一些学习笔记：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-0b7cc7ffe91efb30.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="笔记目录.png"></p><p>这一年零零散散记了有150几页，记的内容很泛，平时遇见一些不熟悉的知识点都会顺手记下来，方便后面查阅。最可惜的是，我这个习惯其实是从大三开始的，大三记了一年，记的内容好像比今年多多了，后面因为电脑坏了重装系统，居然忘记备份，就这么没了，没了！</p><p>其实笔记记多了，反而会懒得去看，时间一久，如果没再次整理一下的话，笔记反而会更乱，当需要时也会忘记自己是否曾经记过某个知识点。所以，感觉还是得来梳理一下这个笔记，好的，那就开始吧。</p><p>归纳了一下，笔记的主要内容大概可以分为以下几类吧：<strong>基础篇</strong>、<strong>进阶篇</strong>、<strong>工具篇</strong>，其他还包括一些热门框架的基本使用记录或一些编程思想，但内容不多。</p><p>那么，这篇就大概把这些笔记内容分类梳理一下吧，方便自己以后查阅，也希望可以帮助到别人。</p><h2 id="工具篇" tabindex="-1"><a class="header-anchor" href="#工具篇" aria-hidden="true">#</a> 工具篇</h2><h3 id="_1-abd-常用命令" tabindex="-1"><a class="header-anchor" href="#_1-abd-常用命令" aria-hidden="true">#</a> 1. abd 常用命令</h3><h4 id="_1-删除系统应用" tabindex="-1"><a class="header-anchor" href="#_1-删除系统应用" aria-hidden="true">#</a> （1）删除系统应用</h4><p>步骤:</p><ol><li><code>mount -o rw,remount /system</code> 卸载系统应用时先运行这句</li><li><code>chome 777 system</code> 添加 system 目录权限</li><li>然后把 <code>/system/app</code> 和 <code>/data/data</code> 下的相关文件删掉</li><li><code>reboot</code> 重启盒子</li><li>然后就可以安装 <code>debug</code> 应用</li></ol><p>场景：<br> 如果开发盒子的系统应用时，当通过 AS 编译运行到盒子时，如果盒子上已装有 release 版，那么 AS 是无法将项目跑到盒子上的，需要先将系统应用删除后才可以正常开发。</p><h4 id="_2-修改host文件" tabindex="-1"><a class="header-anchor" href="#_2-修改host文件" aria-hidden="true">#</a> （2）修改host文件</h4><p>当 pc 跟盒子连接后（通过 usb 或 wifi 连接），在 pc 端的 cmd 窗口中输入下列命令：<br><code>adb remount</code><br><code>adb pull /system/etc/hosts</code> //备份 <code>adb push hosts /system/etc/hosts</code> //将准备好的 hosts 文件 push 进去</p><h4 id="_3-wifi-连接调试" tabindex="-1"><a class="header-anchor" href="#_3-wifi-连接调试" aria-hidden="true">#</a> （3）wifi 连接调试</h4><p><strong>方法一：需要 root 权限</strong><br> 手机端下载超级终端，然后输入下面命令：<br><code>su</code><br><code>setprop service.adb.tcp.port 5555</code><br><code>stop adbd</code><br><code>start adbd</code></p>',19),c={href:"https://github.com/jackpal/Android-Terminal-Emulator",target:"_blank",rel:"noopener noreferrer"},g=n('<p><strong>方法二：需要 usb 线，不需要 root</strong><br> usb 连接手机调试后，在 pc 端的 cmd 窗口中输入下列命令：<br><code>adb kill-server</code><br><code>adb start-server</code><br><code>adb tcpip 5555</code></p><p>场景：盒子应用开发时，经常会出现有的盒子 usb 无法跟 pc 连接，那么此时可以考虑通过 wifi，当 pc 和 盒子在同一个局域网内时可以通过 <code>adb connect &lt;ip address&gt;</code> 来连接盒子，当连接失败时才考虑用上面的方法操作后再次调用 <code>adb connect &lt;ip address&gt;</code> 来连接盒子即可。</p><h4 id="_4-查看目前-activity-栈" tabindex="-1"><a class="header-anchor" href="#_4-查看目前-activity-栈" aria-hidden="true">#</a> （4）查看目前 Activity 栈</h4><p>命令： <code>adb shell dumpsys activity</code></p><h4 id="_5-启动任意-activity" tabindex="-1"><a class="header-anchor" href="#_5-启动任意-activity" aria-hidden="true">#</a> （5）启动任意 Activity</h4>',5),h=e("img",{src:"http://upload-images.jianshu.io/upload_images/1924341-4e7f9fe1239a7327.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240",alt:"启动任意活动.png"},null,-1),u={href:"http://www.jianshu.com/p/54fd9627860a",target:"_blank",rel:"noopener noreferrer"},m=n('<h3 id="_2-chrome-插件" tabindex="-1"><a class="header-anchor" href="#_2-chrome-插件" aria-hidden="true">#</a> 2. Chrome 插件</h3><p>我用的插件不多，但我感觉是都挺实用的，如下：</p><p><strong>Octotree</strong>： 方便 github 项目结构查看</p><p><strong>Postman</strong>： 模拟 http 请求</p><p><strong>ChromeADB</strong>： 发送 adb 命令，没有遥控器的时候可以暂时用这个来控制</p><p><strong>JSON-handle</strong>： json</p><p><strong>AdBlock</strong>： 禁广告</p><p><strong>Agar/Slither Infinity</strong>： 标签页</p><p><strong>crxMouse Chrome™ Gestures</strong>： 手势操作</p><h3 id="_3-as调试工具" tabindex="-1"><a class="header-anchor" href="#_3-as调试工具" aria-hidden="true">#</a> 3. AS调试工具</h3><p><strong>查看当前线程信息</strong><br><img src="http://upload-images.jianshu.io/upload_images/1924341-2cd1f39fe4e43020.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="as调试查看线程信息.png"></p><p><strong>开启显示方法的返回值</strong><br><img src="http://upload-images.jianshu.io/upload_images/1924341-ab266b593ffba593.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="as调试开启方法返回值.png"></p><p><strong>不添加代码临时添加日志输出</strong><br><img src="http://upload-images.jianshu.io/upload_images/1924341-a41269410d692041.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="as调试添加日志输出.png"><img src="http://upload-images.jianshu.io/upload_images/1924341-07e5bbe2560192df.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="as调试日志输出.png"></p><h3 id="_4-as版本管理工具-svn-and-git" tabindex="-1"><a class="header-anchor" href="#_4-as版本管理工具-svn-and-git" aria-hidden="true">#</a> 4. AS版本管理工具（SVN and Git)</h3>',14),b=e("br",null,null,-1),w={href:"http://www.cnblogs.com/dasusu/p/5372840.html",target:"_blank",rel:"noopener noreferrer"},v=e("br",null,null,-1),_={href:"https://www.jianshu.com/p/48fde8a22484",target:"_blank",rel:"noopener noreferrer"},f=n(`<h2 id="基础篇-android" tabindex="-1"><a class="header-anchor" href="#基础篇-android" aria-hidden="true">#</a> 基础篇（Android）</h2><p>ps:以下内容有些是平时记笔记时直接在一些博客里将自己认为的重点直接复制粘贴记录下来的，当时都没有记出处，所以如果这样会有抄袭的侵权，告知下来删。</p><h3 id="_1-xml控件属性" tabindex="-1"><a class="header-anchor" href="#_1-xml控件属性" aria-hidden="true">#</a> 1. xml控件属性</h3><p>####（1）android:clipToPadding android:clipToChildren</p><p>这两个都是 <strong>ViewGroup 的属性</strong>，一般我们在 ViewGroup 里，比如在 LinearLayout 设置 padding = 10dp，那么它的子控件就都会在距离父控件边界 10dp 的内部区域显示。即使我们对子控件设置了 layout_marginTop = -10dp，来将子控件往上移到父控件的上边界，虽然子控件实际位置确实是往上移了，但是在这个 10dp 的区域内是不会绘制的，也就是说子控件上面 10dp 部分是被遮住了，不会显示出来的。而 <strong>android:clipToPadding</strong> 这个属性作用就是允许绘制在 padding 内子控件，这个属性<strong>默认值是 true</strong>，当我们把它设置成 <strong>false</strong> 后，子控件在父控件的 padding 区域内就可以显示出来了。</p><p><strong>adnroid:clipToClildren</strong> 性质是一样的，<strong>默认值也是 true</strong>，只是这个属性是允许绘制超出父控件区域的子控件。正常情况下，如果我们对子控件设置 layout_marginTop 为负来将子控件的一部分区域移出父控件的边界，那么子控件超出父控件边界的这部分是不会被绘制出来的，如果对这个属性设置了 <strong>false</strong>，那么就允许绘制超出的这部分内容了。</p><p>这两个属性一般是在 Tv 应用上比较常用，因为 Tv 应用经常会有一些 View 获取焦点后需要放大的效果，而有时放大后的 View 刚好会在父控件的 padding 区域内，甚至是会超出父控件的边界，如果不用这两个属性来控制，放大后的 View 就会呈现被截断的效果。</p><h4 id="_2-android-drawableright" tabindex="-1"><a class="header-anchor" href="#_2-android-drawableright" aria-hidden="true">#</a> （2）android:drawableRight</h4><p>这个属性是 <strong>TextView</strong> 的属性，Tv 应用里有很多既有小图标又有文字的这种小标题 View，虽然可以用 LinearLayout 内放一个 ImageView 和一个 TextView 来搞定，但也可以直接用一个 TextView 就搞定，就是通过这个属性，这样可以优化一层布局。</p><p><strong>android:drawablePadding</strong>： 是用来设置 drawable 与 text 之间的距离的。</p><p>但使用这个有一些注意事项需要关注一下：</p><p>注意事项：</p><ol><li>TextView 的 padding 作用在 drawable 之外</li><li>TextView 的高度或宽度为 wrap_content 时将是文字和 drawable 中较大的那一个，再加上 padding 和 margin</li><li>gravity只对文字起作用，对 drawable 不起作用</li><li>drawable 会在其所在的维度居中显示，比如 drawableLeft 是上下垂直居中的，以此类推</li></ol><h4 id="_3-xml焦点控制" tabindex="-1"><a class="header-anchor" href="#_3-xml焦点控制" aria-hidden="true">#</a> （3）xml焦点控制</h4><p><strong>android:descendantFocusability</strong>-----父容器和子控件的焦点获取问题</p><p>这个属性定义了当一个焦点要传递给父容器或者子控件时，父容器和子控件之间获得焦点的关系。具体值如下：<br><code>beforeDescendants</code>：父容器会比其子控件率先获得焦点。<br><code>afterDescendants</code>：如果没有任何子控件要获得焦点的话，那么父容器才会获得焦点。<br><code>blocksDescendants</code>：父容器会阻止其子控件获得焦点（也就是说焦点会由父容器获得）。</p><p><strong>android:duplicateParentState</strong></p><p>这个属性指的是当前控件是否跟随父控件的(点击、焦点等)状态。<br> 我一般是结合上面的 <code>blocksDescendants</code> 和这个属性一起用，达到防止子控件获取焦点但同时子控件又能响应父控件焦点的变化状态。</p><p><strong>android:nextFocusRight</strong>------控制下一个焦点</p><h4 id="_4-xml-动画文件里值的含义" tabindex="-1"><a class="header-anchor" href="#_4-xml-动画文件里值的含义" aria-hidden="true">#</a> （4）xml 动画文件里值的含义</h4><p><img src="http://upload-images.jianshu.io/upload_images/1924341-17911cd666ed63fe.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="xml动画里值的含义1.png"></p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-c113668f142ae1d2.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="xml动画里值的含义2.png"></p><p>三种形式<br> 绝对坐标：数字<br> 相对于View本身控件坐标：数字+%<br> 相对于父控件坐标：数字+%p</p><h3 id="_2-单元测试中通过反射测试私有方法" tabindex="-1"><a class="header-anchor" href="#_2-单元测试中通过反射测试私有方法" aria-hidden="true">#</a> 2.单元测试中通过反射测试私有方法</h3><p><img src="http://upload-images.jianshu.io/upload_images/1924341-74b13470d20a0acc.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="代码示例.png"></p><h3 id="_3-ongloballayoutlistener" tabindex="-1"><a class="header-anchor" href="#_3-ongloballayoutlistener" aria-hidden="true">#</a> 3.OnGlobalLayoutListener</h3><p>这个回调可以用于获取 view 宽高：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>private int mViewHeight;
private View mView;
...

//注册监听
mView.getViewTreeObserver().addOnGlobalLayoutListener(
    new OnGlobalLayoutListener() {
        @Override
        public void onGlobalLayout() {
            //获取View高度
            mViewHeight = mView.getHeight();
            //取消监听，否则该方法会不断回调
            mView.getViewTreeObserver().removeGlobalLayoutListener(this);
        }
    }
)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们知道在 onCreate() 中 View.getWidth 和 View.getHeight 无法获得一个 view 的高度和宽度，这是因为 View 组件布局要在 onResume() 回调后完成。所以现在需要使用 getViewTreeObserver().addOnGlobalLayoutListener() 来获得宽度或者高度。这是获得一个 view 的宽度和高度的方法之一。</p><p>但是需要注意的是 OnGlobalLayoutListener 可能会被多次触发，因此在得到了高度之后，要将OnGlobalLayoutListener 注销掉。</p><h3 id="_4-textview设置不同字体样式" tabindex="-1"><a class="header-anchor" href="#_4-textview设置不同字体样式" aria-hidden="true">#</a> 4.TextView设置不同字体样式</h3><p><img src="http://upload-images.jianshu.io/upload_images/1924341-0e963c1ae9078d5b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="效果图.png"></p><p>使用方法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//step1:
SpannableString text = new SpannableString(“输入课程名称，如管理”);  

//step2:
text.setSpan(new ForegroundColorSpan(ContextCompat.getColor(this, R.color.text_color_gray)), 0, 10,Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);  

//step3:
text.setSpan(new AbsoluteSizeSpan(textSize1), 10, 14, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

//step4:
4.TextView.setText(text);  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关键方法：<code>setSpan()</code></p><p>支持设置的字体格式（继承 CharacterSty 均可）：</p><ol><li>字体颜色-------ForegroundColorSpan</li><li>字体大小-------AbsoluteSizeSpan</li><li>背景颜色-------BackgroundColorSpan</li><li>超链接----------URLSpan</li><li>粗体、斜体----StyleSpan</li><li>删除线----------StrikethroughSpan</li><li>下划线----------UnderlineSpan</li><li>图片-------------ImageSpan</li></ol><h3 id="_5-merge-标签注意事项" tabindex="-1"><a class="header-anchor" href="#_5-merge-标签注意事项" aria-hidden="true">#</a> 5.merge 标签注意事项</h3><blockquote><ol><li>merge 必须放在布局文件的根节点上。</li><li>merge 并不是一个 ViewGroup，也不是一个 View，它相当于声明了一些视图，等待被添加。</li><li>merge 标签被添加到 A 容器下，那么 merge 下的所有视图将被添加到 A 容器下。</li><li><strong>因为 merge 标签并不是 View，所以在通过 LayoutInflate.inflate 方法渲染的时候， 第二个参数必须指定一个父容器，且第三个参数必须为 true，也就是必须为 merge 下的视图指定一个父亲节点。</strong></li><li>如果 Activity 的布局文件根节点是 FrameLayout，可以替换为 merge 标签，这样，执行 setContentView之后，会减少一层 FrameLayout 节点。</li><li>自定义 View 如果继承 LinearLayout，建议让自定义 View 的布局文件根节点设置成 merge，这样能少一层结点。</li><li><strong>因为 merge 不是 View，所以对 merge 标签设置的所有属性都是无效的</strong>。</li></ol></blockquote><h3 id="_6-调用系统的安装应用界面" tabindex="-1"><a class="header-anchor" href="#_6-调用系统的安装应用界面" aria-hidden="true">#</a> 6.调用系统的安装应用界面</h3><p>步骤：</p><ol><li>设置 intent 的 dataAndType ，用隐式调用法来启动系统的安装界面</li><li>传入apk的uri路径：file://mnt/sdcard/aa.apk</li><li>和指定的type：application/vnd.android.package-archive</li></ol><p>示例代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Intent intent = new Intent(Intent.ACTION_VIEW);
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//传入apk路径还有设置type
intent.setDataAndType(Uri.fromFile(new File(Config.getAppDir(content), apkName)), &quot;application/vnd.android.package-archive&quot;)  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-坐标基础" tabindex="-1"><a class="header-anchor" href="#_7-坐标基础" aria-hidden="true">#</a> 7.坐标基础</h3><p><strong>View 的坐标系统</strong>是相对于父控件而言的:</p><blockquote><p>getTop(); //获取子View左上角距父View顶部的距离<br> getLeft(); //获取子View左上角距父View左侧的距离<br> getBottom(); //获取子View右下角距父View顶部的距离<br> getRight(); //获取子View右下角距父View左侧的距离</p></blockquote><p><img src="http://upload-images.jianshu.io/upload_images/1924341-83df6c0afac8b284.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="坐标系.png"></p><p><strong>MotionEvent 中 get 和 getRaw 的区别</strong>:</p><blockquote><p>event.getX(); //触摸点相对于其所在组件坐标系的坐标<br> event.getY();<br> event.getRawX(); //触摸点相对于屏幕默认坐标系的坐标<br> event.getRawY();</p></blockquote><p><img src="http://upload-images.jianshu.io/upload_images/1924341-9e1a5bb3d20f1bfc.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="坐标系.png"></p><h3 id="_8-sharepreference监听" tabindex="-1"><a class="header-anchor" href="#_8-sharepreference监听" aria-hidden="true">#</a> 8.SharePreference监听</h3><p><strong>registerOnSharedPreferenceChangeListener(listener)</strong></p><blockquote><p>这个方法才是我要说的重点，因为之前有些需求就是更改了 SharedPreferences 之后，要通知相应的组件做出改变，我以前的处理方式是通过事件订阅实现的，发一个 event 出去，然后目标收到 event 再做出反应，当时觉得特别蛋疼，两边都要做些操作，显的特别啰嗦，当时就在想可不可以在 SharedPreferences 上设置一个观察者，一旦有什么风吹草动，就自动通知目标，不曾想，人家早已经实现了，只是我愚昧无知，今天去看了下源码发现了这个方法，相见恨晚。</p></blockquote><p>代码示例：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SharedPreferences sp1 = getSharedPreferences(getPackageName() + &quot;test&quot;, MODE_PRIVATE);
sp1.registerOnSharedPreferenceChangeListener(
    new SharedPreferences.OnSharedPreferenceChangeListener() { 
        @Override 
        public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
             // do any thing you want 
        }
    });

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-textview各种padding解析、长度测量" tabindex="-1"><a class="header-anchor" href="#_9-textview各种padding解析、长度测量" aria-hidden="true">#</a> 9.TextView各种padding解析、长度测量</h3>`,57),V={href:"https://www.jianshu.com/p/fd9cce7a333f",target:"_blank",rel:"noopener noreferrer"},x=n('<p><img src="http://upload-images.jianshu.io/upload_images/1924341-c31a2f0fa5b2d344.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="TextView.png"></p><p>这部分内容专门写了一篇博客分析，上面这张图概括了链接博客主要分析的内容，感兴趣的可以点进去看看。</p><h2 id="进阶篇-android" tabindex="-1"><a class="header-anchor" href="#进阶篇-android" aria-hidden="true">#</a> 进阶篇（Android）</h2><p>进阶篇主要是自己在这一年里接触的一些源码阅读的笔记，现在已经陆陆续续发表了几篇源码分析的博客了，还有很多都是先简单的记录下来，想等有空闲时间再慢慢组织语言写成博客出来。</p><h3 id="_1-view-post-原理" tabindex="-1"><a class="header-anchor" href="#_1-view-post-原理" aria-hidden="true">#</a> 1.View.post()原理</h3>',5),y={href:"https://www.jianshu.com/p/85fc4decc947",target:"_blank",rel:"noopener noreferrer"},A=e("blockquote",null,[e("p",null,"Q1: 为什么 View.post() 的操作是可以对 UI 进行操作的呢，即使是在子线程中调用 View.post()？"),e("p",null,"Q2：网上都说 View.post() 中的操作执行时，View 的宽高已经计算完毕，所以经常看见在 Activity 的 onCreate() 里调用 View.post() 来解决获取 View 宽高为0的问题，为什么可以这样做呢？"),e("p",null,"Q3：用 View.postDelay() 有可能导致内存泄漏么？")],-1),S=e("p",null,"这是最近发表的一篇关于 View.post() 到底干了些什么事的博客，内容主要是从源码上分析了上述三个问题，投给了郭神了，也过啦，感谢郭神。虽然深度不是特别深，但内容应该还是有些干货的，尤其是那些想开始阅读源码来学习的同学，这篇里有介绍一些如何阅读源码的思路还有工具，因为我也是个新人，也刚刚摸索，也碰到很多问题，所以我清楚作为菜鸟对于阅读源码恐惧的种种，希望可以帮助到大伙。",-1),T=e("h3",{id:"_2-keyevent的点击事件分发机制",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_2-keyevent的点击事件分发机制","aria-hidden":"true"},"#"),a(" 2.KeyEvent的点击事件分发机制")],-1),M={href:"https://www.jianshu.com/p/2f28386706a0",target:"_blank",rel:"noopener noreferrer"},k=e("p",null,[e("img",{src:"https://upload-images.jianshu.io/upload_images/1924341-38bcb57fa4617d95.jpg?imageMogr2/auto-orient/",alt:"KeyEvent流程图"})],-1),L=e("p",null,"手机上的应用多数的触屏点击事件 MotionEvent，而 Tv 上的应用基本都是遥控器的点击事件 KeyEvent，两者虽然都是点击事件，分发消费机制大体上也差不了多少，但还是有些地方是有区别的。",-1),C=e("p",null,"上面那篇博客里我主要是分析了在一个 Activity 界面里的遥控器点击事件 KeyEvent 的分发传递流程，但仍然还有很多遗留问题尚未搞清楚。",-1),j=e("h3",{id:"_3-recyclerview回收复用机制",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_3-recyclerview回收复用机制","aria-hidden":"true"},"#"),a(" 3.RecyclerView回收复用机制")],-1),I={href:"https://www.jianshu.com/p/9306b365da57",target:"_blank",rel:"noopener noreferrer"},q=e("p",null,"RecyclerView 的源码实在是太复杂了，之前项目有个关于滑动的问题，为了定位也去看了RecyclerView的相关源码，但最终还是失败了，因为还是没搞清楚。后来又遇到回收复用的优化需求，所以又过了这部分的源码，硬着头上了，分析到最后稍微有些收获，所以记录下来分享给大伙。",-1),P=e("blockquote",null,[e("p",null,"Q1:如果向下滑动，新一行的5个卡位的显示会去复用缓存的 ViewHolder，第一行的5个卡位会移出屏幕被回收，那么在这个过程中，是先进行复用再回收？还是先回收再复用？还是边回收边复用？也就是说，新一行的5个卡位复用的 ViewHolder 有可能是第一行被回收的5个卡位吗？"),e("p",null,"Q2:在这个过程中，为什么当 RecyclerView 再次向上滑动重新显示第一行的5个卡位时，只有后面3个卡位触发了 onBindViewHolder() 方法，重新绑定数据呢？明明5个卡位都是复用的。"),e("p",null,"Q3:接下去不管是向上滑动还是向下滑动，滑动几次，都不会再有 onCreateViewHolder() 的日志了，也就是说 RecyclerView 总共创建了17个 ViewHolder，但有时一行的5个卡位只有3个卡位需要重新绑定数据，有时却又5个卡位都需要重新绑定数据，这是为什么呢？")],-1),E=e("p",null,"链接给的博客里，我主要是基于滑动的场景，从源码上分析了上述三个问题，问题有结合一些前提和日志，所以如果感觉问题就看的有点懵的可以点进去看看具体的说明。",-1),W=e("h3",{id:"_4-activity切场动画",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_4-activity切场动画","aria-hidden":"true"},"#"),a(" 4.Activity切场动画")],-1),R={href:"https://www.jianshu.com/p/559b5ed973f1",target:"_blank",rel:"noopener noreferrer"},G=e("p",null,"这篇介绍的是如何实现 Activity 的切换动画，只是记录了下实现这个功能的一个思路，以及这过程中碰到的一大堆奇葩问题，尤其是 android:windowIsTranslucent 属性的问题。这段时间的主要经历都放在了动画的原理上，所以后期会渐渐分享这部分的知识。",-1),O=e("h3",{id:"_5-app-launch源码阅读前基础",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_5-app-launch源码阅读前基础","aria-hidden":"true"},"#"),a(" 5.app Launch源码阅读前基础")],-1),H=e("p",null,"startActivity() 打开一个页面时做的事是非常非常多的，这个过程是复杂得要死的，但大体的流程静下心来应该还是可以梳理出来的，但在这之前，需要对一些类或者变量先了解一下，这样阅读源码才不会一脸懵逼，下面的内容不是我整理的，原博客地址会贴出：",-1),N={href:"http://blog.csdn.net/jinzhuojun/article/details/37737439",target:"_blank",rel:"noopener noreferrer"},D=n('<blockquote><p><strong>Activity</strong>：描述一个Activity，它是与用户交互的基本单元。<br><strong>ActivityThread</strong>：每一个App进程有一个主线程，它由ActivityThread描述。它负责这个App进程中各个Activity的调度和执行，以及响应AMS的操作请求等。<br><strong>ApplicationThread</strong>：AMS和Activity通过它进行通信。对于AMS而言，ApplicationThread代表了App的主线程。简而言之，它是AMS与ActivityThread进行交互的接口。注意ActivityThread和ApplicationThread之间的关系并不像Activity与Application。后者的关系是Application中包含了多个Activity，而前者ActivityThread和ApplicationThread是同一个东西的两种&quot;View&quot;，ApplicationThread是在AMS眼中的ActivityThread。<br><strong>ViewRootImpl</strong>：主要责任包括创建Surface，和WMS的交互和App端的UI布局和渲染。同时负责把一些事件发往Activity以便Activity可以截获事件。每一个添加到WMS中的窗口对应一个ViewRootImpl，通过WindowManagerGlobal向WMS添加窗口时创建。大多数情况下，它管理Activity顶层视图DecorView。总得来说，它相当于MVC模型中的Controller。<br><strong>ViewRootImpl::W</strong>：用于向WMS提供接口，让WMS控制App端的窗口。它可看作是个代理，很多时候会调用ViewRootImpl中的功能。这种内嵌类的用法很多，特别是这种提供接口的代理类，如PhoneWindow::DecorView等。<br><strong>Instrumentation</strong>:官方提供的Hook，主要用于测试。如果只关注窗口管理流程的话可以先无视。<br><strong>WindowManagerImpl</strong>：Activity中与窗口管理系统通信的代理类，实现类是WindowManagerGlobal。WindowManagerGlobal是App中全局的窗口管理模块，因此是个Singleton。<br><strong>Window</strong>：每个App虽然都可以做得各不相同，但是作为有大量用户交互的系统，窗口之间必须要有统一的交互模式，这样才能减小用户的学习成本。这些共性比如title, action bar的显示和通用按键的处理等等。Window类就抽象了这些共性。另外，它定义了一组Callback，Activity通过实现这些Callback被调用来处理事件。注意要和在WMS中的窗口区分开来，WMS中的窗口更像是App端的View。<br><strong>PhoneWindow</strong>：PhoneWindow是Window类的唯一实现，至少目前是。这样的设计下如果要加其它平台的Window类型更加方便。每个Activity会有一个PhoneWindow，在attach到ActivityThread时创建，保存在mWindow成员中。<br><strong>Context</strong>：运行上下文，Activity和Service本质上都是一个Context，Context包含了它们作为运行实体的共性，如启动Activity，绑定Service，处理Broadcast和Receiver等等。注意Application也会有Context。Activity的Context是对应Activity的，Activity被杀掉（比如转屏后）后就变了。所以要注意如果有生命周期很长的对象有对Activity的Context的引用的话，转屏、返回这种会引起Activity销毁的操作都会引起内存泄露。而Application的Context生命周期是和App进程一致的。</p></blockquote><h3 id="_6-消息机制messagequeue原理" tabindex="-1"><a class="header-anchor" href="#_6-消息机制messagequeue原理" aria-hidden="true">#</a> 6 消息机制MessageQueue原理</h3><p>这部分内容想等抽个时间整理篇博客出来，下面只是我阅读源码过程中的一些笔记，还没组织语言，大体上记录了 MessageQueue 往队列里插消息和取消息的流程分析：</p><p><strong>插入消息 enqueueMessage()</strong>：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-bb7dbda22cdabc1c.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="enqueueMessage.png"></p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-133c206b28b6601b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="enqueueMessage.png"></p><p>也就是说，我们自己通过 Handler 发送的 Message 的 Target 是绝对不会为空的，因为 Handler 内部会自动将 Message 的 Target 设置为 Handler 自己。然后消息队列其实是根据 when 来排队的。</p><p><strong>读取消息 next()</strong>：<br><img src="http://upload-images.jianshu.io/upload_images/1924341-b95df636e3f77f27.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="next.png"></p><p>读操作要么返回该执行的 message，要么就进入阻塞。当返回 Null 时表示当前 Lopper 已被关闭，如果是主线程，那么就意味着程序退出了。</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-c3a530f62d4733ac.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="next.png"></p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-b1ba568f41c0fe69.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="next.png"></p><p>读取操作本身会伴随着删除操作，读操作会有阻塞，原理好像是通过 Linux 的 epoll 机制，但还不懂。按道理 next() 是会按照消息队列已排好序的取下一个 Message，但如果碰到有同步屏障 Message 时，则后面所有同步的消息都不会取，只会取异步的消息，直到该同步屏障被移除。</p><h3 id="_7-startactivityforresult-失效问题" tabindex="-1"><a class="header-anchor" href="#_7-startactivityforresult-失效问题" aria-hidden="true">#</a> 7.startActivityForResult()失效问题</h3>',12),F=e("br",null,null,-1),B={href:"https://www.jianshu.com/p/2a9fcf3c11e4",target:"_blank",rel:"noopener noreferrer"},U=n('<h3 id="_8-threadlocal-原理" tabindex="-1"><a class="header-anchor" href="#_8-threadlocal-原理" aria-hidden="true">#</a> 8.ThreadLocal 原理</h3><p>我们知道，在 new 一个 Handler 的时候，Handler 会和当前的线程的消息队列绑定，而每个线程都可以有自己单独的消息队列，互不影响，那么它的原理其实是通过 ThreadLocal 实现的，关于这部分内容后期也想单独抽一篇博客来记录下，下面的内容也是简单的记录下 set() 和 get() 方法：</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-916c02ddedd03128.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="get.png"></p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-4d07d12c45240b9e.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="getMap.png"></p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-4019437e50b3c2a7.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="threadLocal.png"></p><p>所以，get() 方法会先获取线程的一个成员变量 threadLocals，这个变量类型是 ThreadLocal 的内部类 ThreadLocalMap 对象，内部有一个 table 数组用于存放数据。所以即使是在不同的线程中使用同一个 ThreadLocal 对象的 get() 方法来获取数据，内部其实只会到当前线程的数组里去取相应数据，所以才能做到线程之间互不影响的存取数据，不是当前线程自然拿不到当前线程的成员变量 threadLocals，也就拿不到数据了。</p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-37145bc39e368a1f.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="set.png"></p><p>set() 方法同理。</p><p>当然，ThreadLocal Map 内部 get()，和 set() 方法并不简单，set() 方法存放每个 value 时，都会将当前的 ThreadLocal 实例作为 key 值来绑定value，也就是说如果使用不同的 ThreadLocal 对同一个线程中做get(), set() 操作的话，虽然操作的是同一个 table 数组，但即使get()，set()的key值一致，实际上获取的数据是相互独立的。</p><hr><p>虽然还有其他一些七七八八的小笔记，但这里就不列出来了，这次梳理的目的一是重新过一遍这一年来所做的笔记，权当复习；二是将这些零散的笔记稍微归类整理一下，毕竟新的一年也还是会记很多笔记，省得到时更乱；三是分享在网上，方便自己后面查阅也希望可以帮助有需要的大伙。</p><p>新的一年来了，大伙一起加油吧~</p>',12);function K(Q,X){const i=o("ExternalLinkIcon");return d(),s("div",null,[p,e("p",null,[a("附 Android 终端下载地址："),e("a",c,[a("https://github.com/jackpal/Android-Terminal-Emulator"),t(i)])]),g,e("p",null,[h,a(" 这位大神的博客有详细说明："),e("a",u,[a("http://www.jianshu.com/p/54fd9627860a"),t(i)])]),m,e("p",null,[a("这部分内容写过两篇简单的博客，记录了下基本使用："),b,e("a",w,[a("Android Studio的git功能的使用介绍"),t(i)]),v,e("a",_,[a("如何用Android Studio同时使用SVN和Git管理项目"),t(i)])]),f,e("p",null,[a("详细说明："),e("a",V,[a("TextView的文字长度测量及各种padding解析"),t(i)])]),x,e("p",null,[a("原文跳转："),e("a",y,[a("【Andorid源码解析】View.post() 到底干了啥"),t(i)])]),A,S,T,e("p",null,[a("原文跳转："),e("a",M,[a("Android KeyEvent 点击事件分发处理流程（一）"),t(i)])]),k,L,C,j,e("p",null,[a("原文跳转："),e("a",I,[a("基于滑动场景解析RecyclerView的回收复用机制原理"),t(i)])]),q,P,E,W,e("p",null,[a("原文跳转："),e("a",R,[a("Activity 切换动画---点击哪里从哪放大"),t(i)])]),G,O,H,e("p",null,[e("a",N,[a(" Android 4.4(KitKat)窗口管理子系统 - 体系框架"),t(i)])]),D,e("p",null,[a("如果项目里的 Activity 有 singleTask 模式的话，而且又用到这个方法的话，那也许有可能你就碰到了这个问题，下面这篇博客里把这个问题讲解得很清楚了："),F,e("a",B,[a("我打赌你一定没搞明白的Activity启动模式"),t(i)])]),U])}const Y=r(l,[["render",K],["__file","我的2017年总结.html.vue"]]);export{Y as default};
