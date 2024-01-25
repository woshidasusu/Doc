import{_ as a,r as n,o as s,c as l,a as e,b as c,e as r,d}from"./app-XVH6qKTA.js";const o={},h=d(`<h1 id="shell-基本语法" tabindex="-1"><a class="header-anchor" href="#shell-基本语法" aria-hidden="true">#</a> shell 基本语法</h1><p>jenkins 上构建项目时，经常需要借助 shell 脚本，最近也经常跟服务器打交道，顺便记录些常用命令，方便查阅</p><h3 id="语法-变量" tabindex="-1"><a class="header-anchor" href="#语法-变量" aria-hidden="true">#</a> 语法-变量</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code># 定义变量
name=&#39;dasu&#39;

# 使用变量
echo $name  # dasu
echo &quot;I am \${name}.&quot;  # I am dasu.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="xxx-dasu" tabindex="-1"><a class="header-anchor" href="#xxx-dasu" aria-hidden="true">#</a> <code>xxx=&#39;dasu&#39;</code></h4><p>用 <code>key=value</code> 形式定义变量，<code>=</code> 等号两边不能有空格</p><h4 id="xxx-或-xxx" tabindex="-1"><a class="header-anchor" href="#xxx-或-xxx" aria-hidden="true">#</a> <code>$xxx 或 \${xxx}</code></h4><p>变量名前加个 <code>$</code> 使用变量，大括号省略也可以</p><h3 id="语法-字符串" tabindex="-1"><a class="header-anchor" href="#语法-字符串" aria-hidden="true">#</a> 语法-字符串</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code># 字符串使用
name=&#39;dasu&#39;
name2=&quot;dasu&quot;
name3=dasu
echo &quot;$name $name2 $name3&quot;  # dasu dasu dasu

# 字符串长度
echo \${#name} #4

# 注意，shell 里都是命令
&#39;dasu&#39; # dasu: command not found

# 获取子字符串
echo \${name:0:2} # da

# 寻找字符
echo \`expr index $name s\` # 3   下标从1开始
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="dasu-dasu-dasu" tabindex="-1"><a class="header-anchor" href="#dasu-dasu-dasu" aria-hidden="true">#</a> <code>&#39;dasu&#39;</code> <code>&quot;dasu&quot;</code> <code>dasu</code></h4><p><strong>单引号</strong>、<strong>双引号</strong>、甚至<strong>不加引号</strong>都会被作为字符串使用</p><p>单引号里的字符串不做任何处理工作，是什么就原样输出</p><p>双引号里如果有表达式、有转义符，有变量，会先进行处理，最后再输出，所以字符串的拼接，可以放在双引号内</p><p>注意，shell 里都是命令，所以只有当在命令参数、或表达式右值时，字符串才会被当做字符串处理，否则都会被认为命令，从而报找不到 xxx 命令错误</p><h4 id="xxx" tabindex="-1"><a class="header-anchor" href="#xxx" aria-hidden="true">#</a> <code>\${#xxx}</code></h4><p>加个 <code>#</code> 号使用，可以用来获取 xxx 变量字符串的长度</p><h4 id="xxx-1-2" tabindex="-1"><a class="header-anchor" href="#xxx-1-2" aria-hidden="true">#</a> <code>\${xxx:1:2}</code></h4><p>用来截取子字符串</p><h4 id="i-expr-index-xxx-x" tabindex="-1"><a class="header-anchor" href="#i-expr-index-xxx-x" aria-hidden="true">#</a> <code>i=\`expr index &quot;$xxx&quot; x\` </code></h4><p>用来查找子字符，expr 表示后面跟着的是表达式，因为 shell 默认每一行都是命令，所以本身不支持表达式</p><p>index 用来查找，后面跟着接收两个参数：原字符串，查找的字符</p><p>注意，只找字符，不是找子字符串</p><h4 id="xxx-和-xxx" tabindex="-1"><a class="header-anchor" href="#xxx-和-xxx" aria-hidden="true">#</a> <code>\`xxx\`</code> 和 <code>$(xxx)</code></h4><p>因为不加引号也可以被认为是字符串处理，所以在某些场景，需要让脚本解释器知道，这是一串命令，而不是字符串，此时就需要通过 <code>\`</code> 反引号，或者 <code>$()</code> 来实现</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>echo ls  # ls，被认为是字符串
echo \`ls\` # 执行 ls 命令，并将结果输出
echo $(ls) # 执行 ls 命令，并将结果输出
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>\`</code> 反引号内部是一个命令，<code>$()</code> 美元符合加小括号形式，括号内也是表示一个命令</p><p>注意，<code>\`</code> 或 <code>$()</code> 内部的命令执行之后的结果，会再次作为输入，被当做下一行 shell 脚本命令执行，所以需要注意这个结果是否可以作为命令被执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>\`whoami\` # root: command not found
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>因为 <code>whoami</code> 命令执行输出 root，root 又被作为命令执行，就报错了</p><p>如果有需求是要将命令执行结果，作为日志输出，这种场景就很适用了</p><h3 id="语法-表达式" tabindex="-1"><a class="header-anchor" href="#语法-表达式" aria-hidden="true">#</a> 语法-表达式</h3><p>编程语言都可以通过各种运算符来实现一个个表达式，如算术表达式、赋值表达式等</p><p>但由于在 shell 内，都被当做命令来处理，所以正常的运算符无法直接使用，需要借助其他命令或语法实现</p><h4 id="expr" tabindex="-1"><a class="header-anchor" href="#expr" aria-hidden="true">#</a> expr</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>a=2 + 2   # +: command not found
a=2+2     # 2+2被认为字符串了
a=\`expr 2 + 2\`  # a=4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code> \`</code> 反引号内的会被当做一个命令来执行，因为上面例子是将 expr 命令放在 <code>=</code> 号右侧，如果不加反引号，expr 会被当做字符串处理</p><p>有些算术运算符需要加转义符，如乘号 *，大于 &gt;，小于 &lt; 等</p><p>算术运算符跟两侧的变量基本都需要以空格隔开，这样才能辨别是字符串还是表达式</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>expr 2 + 2  # 4，加法运算
expr 2+2    # 2+2，整个被当做字符串处理
expr 2 - 2  # 0，减法运算
expr 2 \\* 2 # 4，乘法运算，需要加转义
expr 2 / 2  # 1，除法运算
expr 2 % 2  # 0，取余运算

expr 2 \\&gt; 1 # 1，比较运算，需要加转义
expr 2 \\&lt; 1 # 0，比较运算，需要加转义
expr 2 == 2 # 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="和" tabindex="-1"><a class="header-anchor" href="#和" aria-hidden="true">#</a> (()) 和 $(())</h4><p><code>(())</code> 双括号内，可以执行表达式，多个表达式之间以 <code>,</code> 逗号隔开，最后一个表达式会被作为 <code>(())</code> 运算的结果，可以通过在前面加个 <code>$</code> 提取结果</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>echo $((a=2+2,$a+2))  # 6
echo $a   # 4
((b=$a*2)) # 8, * 号不用加转义符
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>(())</code> 和 expr 有各自优缺点：</p><ul><li><code>(())</code> 支持语句，即形如 <code>((a=2+2))</code>，但 expr 只支持表达式，<code>expr 2 + 2</code></li><li><code>(())</code> 里的乘号，大于号等不需要加转义符，expr 需要加转义符</li><li><code>(())</code> 只支持整数的运算，不支持字符串、小数的计算，expr 支持</li><li>等等其他未遇到的场景</li></ul><h4 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a> $[]</h4><p>简单的算术表达式还有一种写法：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>a=$[2+2]  # a=4
a=$[2*2]  # a=4,不需要加转义符
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>跟 expr 相比，<code>$[]</code> 好处就是一些运算符无需加转义符</p><p><code>$[]</code> 跟 <code>$(())</code> 很像，一样支持语句，一样支持多个表达式，通过 <code>,</code> 逗号隔开，一样会将最后一个表达式的值返回，但 <code>$[]</code> 前的 <code>$</code> 符合不能省略</p><p>**注意：**关于 <code>$[]</code> 和 <code>$(())</code> 的理解可能不是很正确，基本没用过，只是在看资料时遇到，顺手测了些数据梳理出来的知识点，以后有使用到，发现错误的地方再来修改。</p><p>而且，目前碰到的 shell 脚本的需求场景，更多的是参数的获取、变量的使用，因为需要动态生成命令来执行，这种场景比较多，关于表达式运算的场景比较少，所以先不必过多关注。</p><h3 id="语法-条件判断-if" tabindex="-1"><a class="header-anchor" href="#语法-条件判断-if" aria-hidden="true">#</a> 语法-条件判断 if</h3><p>if 的语法：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if condition 
then
  command
  ...
elif condition; then
  command
  ...
else  
fi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>如果想让 then 和 if 同行，那么需要用 <code>;</code> 分号隔开，同理，fi 如果想跟 else 或 then 同行，也需要 <code>;</code> 分号隔开，否则会有语法错误</strong></p><p>if 的本质其实是检测命令的退出状态，虽然我们经常可以看到这种写法：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if [ 2 -eq 2 ]
if [[ 2 == 1 ]]
if (( 1 == 1 ))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上三种，不管是中括号，双中括号，双小括号，其本质都是在运行数学计算命令，既然是命令，就都会有命令的退出状态</p><p>命令退出状态有两种，0 是正常，非 0 是异常，同时，可以用 <code>$?</code> 来获取上个命令的执行退出状态，所以可以来试试看：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>[ 2 -eq 2 ]
echo $?  # 0，正常

[ 2 == 1 ]
echo $?  # 1，非正常

[[ abc == abc ]]
echo $?  # 0，正常

[[ ab == abc ]]
echo $?  # 1，非正常

(( 1 == 1 &amp;&amp; 1 &gt; 0 ))
echo $?  # 0，正常

(( 1 == 1 &amp;&amp; 1 &gt; 1 ))
echo $?  # 1，非正常
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>明白了吗？</p><p>其实， if 检测的是命令的退出状态，这也就意味着，if 后面跟随着的 condition 只要是命令就是符合语法的，不必像其他编程语言那样，必须是类似 <code>if ()</code> 这种语法结构，这也就是为什么，你可能看到别人写的很奇怪的 if 代码，比如:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if test 1 -eq 1; then echo true; fi  # true
if whoami; then echo true; fi # root true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这样一来，即使再看到别人写的 if 代码很奇葩，至少你也知道，它的执行原理是啥了吧，至少也能看懂他那代码的意图了吧</p><p>好，虽然清楚了 if 检测的本质其实是命令的退出状态，但最好还是使用良好的编程风格，使用阅读性较好的写法</p><h4 id="关系运算符-eq-ne-gt-lt-ge-le" tabindex="-1"><a class="header-anchor" href="#关系运算符-eq-ne-gt-lt-ge-le" aria-hidden="true">#</a> 关系运算符 -eq -ne -gt -lt -ge -le</h4><ul><li>等价于 <strong>== != &gt; &lt; &gt;= &lt;=</strong></li></ul><p><strong>这些运算符只能用于比较数值类型的数据，且只能用于 <code>[]</code>， <code>[[]]</code> 这两种</strong>，<code>(())</code> 不能使用这种运算符。</p><p>但使用 <code>[]</code> 和 <code>[[]]</code> 这种语法形式时，有个很重要的点，就是中括号内部两侧必须有空格，然后运算符两侧也需要有空格，否则可能就不是预期的行为了：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if [ 1 -eq 1 ]; then echo true; else echo false; fi  # true 
if [ 1-eq2 ]; then echo true; else echo false; fi  # true，因为 1-eq2 被当做字符串了，运算符左右需要有空格
if [ 1==2 ]; then echo true; else echo false; fi # true，因为 1==2 被当做字符串了，运算符左右需要有空格
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>[]</code> 和 <code>[[]]</code> 内部既可以用类似 <code>-eq</code> 这种形式，也可以直接使用 <code>==</code> 这种方式，后者可以用于比较字符串，前者不能</p><h4 id="布尔运算符-o-a" tabindex="-1"><a class="header-anchor" href="#布尔运算符-o-a" aria-hidden="true">#</a> 布尔运算符 ! -o -a</h4><ul><li>分别对应：非运算，或运算，与运算</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if [ 1 -eq 1 -a 1 -gt 1 ]; then echo true; else echo false; fi # false
if [ 1 -eq 1 -o 1 -gt 1 ]; then echo true; else echo false; fi # true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>这些运算符只能适用于 <code>[]</code>，且只能跟关系运算符（-eq, -ne ...）使用</strong></p><p><code>[[]]</code> 以及 <code>(())</code> 都不能使用，且如果类似这样使用 <code>==</code> 和 <code>-o</code>，也是不起作用的：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if [ 1 &gt; 2 -a 1 == 1 ]; then echo true; else echo false; fi # true，1 &gt; 2 明明不符合，却返回 true 了，所以 -a 这种运算符不能喝 &gt; 这类运算符合用，但使用 -gt 就是正常的了

if [[ 1 -eq 1 -o 1 -gt 2 ]]; then echo true; else echo false; fi 
#sh: syntax error in conditional expression
#sh: syntax error near \`-o&#39;
#异常，[[]] 不支持使用布尔运算符
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="逻辑运算符" tabindex="-1"><a class="header-anchor" href="#逻辑运算符" aria-hidden="true">#</a> 逻辑运算符 &amp;&amp; ||</h4><ul><li>逻辑的 AND 和逻辑的 OR</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if [[ 1 == 1 &amp;&amp; 1 &gt; 2 ]]; then echo true; else echo false; fi # false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>这种运算符只能适用于 <code>[[]]</code></strong>，此时不管是使用 <code>==</code> 这类运算符，还是 <code>-eq</code> 这类，都是允许的</p><p><code>[]</code> 和 <code>(())</code> 都不适用</p><p>当需要有嵌套的判断时，可以拆开，比如：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if [[ 1 == 1 ]] &amp;&amp; [[ 1 &gt; 3 || 1 &gt; 0 ]]; then echo true; else echo false; fi # true
# 相当于 if ((1==1) &amp;&amp; ((1&gt;3)||(1&gt;0)))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="字符运算符-z-n" tabindex="-1"><a class="header-anchor" href="#字符运算符-z-n" aria-hidden="true">#</a> 字符运算符 = != -z -n $</h4><ul><li>= != 用于判断字符串是否相等</li><li>-z 用于判断字符串长度是否为 0，是的话，返回 true</li><li>-n 用于判断字符串长度是否为 0，不是的话，返回 true</li><li>$xxx 用于判断 xxx 字符串是否为空，不为空返回 true</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>a=&#39;abc&#39;
if [ $a == absc ]; then echo true; else echo false; fi  # true 
if [ -n $a ]; then echo true; else echo false; fi  # true ，因为长度不为0
if [ -z $a ]; then echo true; else echo false; fi  # false，因为长度不为0
if [ $a ]; then echo true; else echo false; fi  # true 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>这种运算符适用于 <code>[]</code> 和 <code>[[]]</code> 这两种</strong>，不适用于 <code>(())</code></p><h4 id="文件测试运算符-d-r-w-x-s-e" tabindex="-1"><a class="header-anchor" href="#文件测试运算符-d-r-w-x-s-e" aria-hidden="true">#</a> 文件测试运算符 -d -r -w -x -s -e</h4><ul><li><p>-f 检测文件是否是普通文件（既不是目录，也不是设备文件）</p></li><li><p>-r 检测文件是否可读</p></li><li><p>-w 检测文件是否可写</p></li><li><p>-x 检测文件是否可执行</p></li><li><p>-s 检测文件是否为空</p></li><li><p>-e 检测文件是否存在</p></li><li><p>-d 检测文件是否是目录</p></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>a=test.sh
if [ -e $a ]; then echo true; else echo false; fi # 检测 test.sh 文件是否存在
if [ -d $a ]; then echo true; else echo false; fi # 检测 test.sh 是否存在且是否是目录
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>这类运算符适用于 <code>[]</code> 和 <code>[[]]</code> 这两种</strong>，不适用于 <code>(())</code></p><h4 id="涉及计算的判断条件" tabindex="-1"><a class="header-anchor" href="#涉及计算的判断条件" aria-hidden="true">#</a> 涉及计算的判断条件</h4><p>大部分场景下，if 的条件判断，使用上述的运算符结合 <code>[[]]</code> 使用就可以了，但有某些场景，比如先进行算术运算之后，再判断结果：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if ((1+1&gt;2)); then echo true; else echo false; fi # false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果想使用 <code>[[]]</code> 实现，可以是可以，但有些麻烦：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>if [[ $[1+1] &gt; 2 ]]; then echo true; else echo false; fi # false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>就是需要先让 1+1 当做表达式计算结束，并获取结果，然后再来做判断</p><p><code>(())</code> 有一点需要注意，它只能进行整数运算，不能对小数或字符串进行运算</p><h4 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h4><p>脚本中使用到 if 条件判断的场景肯定也很多，绝大多数情况下，使用 <code>[[]]</code> 就足够覆盖需求场景了</p><p>不管是需要对文件的（目录、存在、大小）判断，还是需要对字符串或命令执行结果的判断，使用 <code>[[]]</code> 都可以实现了</p><p>其实，<code>[[]]</code> 可以说是 <code>[]</code> 的强化版，后者能办到的，前者都行，而对于 <code>(())</code>，更多是整数运算表达式的使用场景，拿来结合 if 使用，纯粹是因为刚好遇见而已，并不是专门给 if 设计的，毕竟 if 只检测命令执行结果，只要是命令，都可以跟它搭</p><h3 id="语法-函数和参数" tabindex="-1"><a class="header-anchor" href="#语法-函数和参数" aria-hidden="true">#</a> 语法-函数和参数</h3><ul><li>函调定义</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>function add() {
	// ...
}

# 省略 function 关键字
add(){
	echo $*
    echo \${12}
	return 1
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>函数调用</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>add 1 2 #sh 1 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>函数调用时，直接函数名即可，如果需要参数，跟其他编程语言不同，定义时不能指明参数，而是函数内部直接通过 $n 来获取参数，需要第几个，n 就是第几</p><p>函数调用时，当需要传参时，直接跟在函数名后面，以空格隔开，函数名不需要带括号</p><h4 id="参数-n-0" tabindex="-1"><a class="header-anchor" href="#参数-n-0" aria-hidden="true">#</a> 参数 <code>$n</code> <code>$0</code> <code>$*</code> <code>$#</code></h4><p>读取参数，参数可以是执行脚本时传递的参数，也可以是执行函数时传递的参数</p><ul><li><p><code>$1</code> 表示第一个参数，以此类推</p></li><li><p><code>\${10}</code> 当参数个数超过 9 个后，需要用大括号来获取</p></li><li><p><code>$*</code> 或 <code>$@</code> 输出所有参数</p></li><li><p><code>$0</code> 输出脚本文件名</p></li><li><p><code>$#</code> 输出参数个数</p></li></ul><p>所以，脚本内部开始，可以用 <code>echo $0 $*</code> 来输出外部使用该脚本时，传递的参数</p><h3 id="语法-脚本文件的-source-和执行" tabindex="-1"><a class="header-anchor" href="#语法-脚本文件的-source-和执行" aria-hidden="true">#</a> 语法-脚本文件的 source 和执行</h3><p>当前 shell 脚本内，可以导入其他脚本文件，也可以直接执行其他脚本文件</p><h4 id="source" tabindex="-1"><a class="header-anchor" href="#source" aria-hidden="true">#</a> source</h4><p>当某个脚本被其他脚本导入时，其实相当于从其他文件拷贝脚本代码过来当前脚本环境内执行，导入有两种命令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>. filename # 注意点号 . 和文件名中间有空格

#或者

source filename
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>被导入的脚本文件不需要是可执行类型的，毕竟执行环境还是当前脚本启动的 shell 进程，只是执行的代码无需再写一遍，直接从其他地方拷贝过来一条条执行而已</p><h4 id="执行" tabindex="-1"><a class="header-anchor" href="#执行" aria-hidden="true">#</a> 执行</h4><p>在当前脚本内，也可以直接执行其他脚本文件，同样有两种类型，如：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>sh ./test.sh
echo $?  # 脚本执行的退出状态

#或者

./test.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>两种的区别就在于：</p><ul><li>前者不需要被执行的脚本是可执行类型的，因为已经手动指定 sh 来作为脚本解释器了，脚本内部开头的 <code>#!</code> 声明也会失效掉</li><li>后者的话，纯粹就是执行一个可执行文件的方式，那就需要这个脚本文件是可执行类型的，同时脚本的解释器由脚本文件内部开头的 <code>#!</code> 声明</li></ul><p>我们通常都会将不同工作职责写在不同脚本文件中，然后某个脚本文件内，来控制其他脚本文件的执行流程，那么，这时候，就需要知道每个流程的脚本是否执行正常，这时候，就可以借助脚本的 exit 命令和 <code>$?</code> 来实现</p><p>每个脚本，如果正常执行结束，那么脚本内部最后应该通过 <code>exit 0</code> 来退出，表示当前脚本正常执行，如果执行过程出异常了，那么应该执行 <code>exit 1</code> 只要是非 0 即可，来表示当前脚本执行异常</p><p>那么，调用执行这个脚本的，就可以通过 <code>$?</code> 来获取脚本执行结果，如：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>sh ./test.sh
if [[ $? -ne 0 ]]; then
  echo &#39;异常&#39;
  exit 1
fi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样就可以来控制脚本执行流程</p><h3 id="语法-其他" tabindex="-1"><a class="header-anchor" href="#语法-其他" aria-hidden="true">#</a> 语法-其他</h3><h4 id="注释" tabindex="-1"><a class="header-anchor" href="#注释" aria-hidden="true">#</a> 注释</h4><ul><li><strong><code>#xxxx</code></strong></li></ul><p>单个 <code>#</code> 用来注释后面内容</p><h4 id="bin-sh" tabindex="-1"><a class="header-anchor" href="#bin-sh" aria-hidden="true">#</a> <code>#!/bin/sh </code></h4><p>脚本文件的顶行，告诉系统，应该去哪里用哪个解释器执行该脚本；</p><p>但如果该脚本不是直接执行，而是作为参数传递给某个解释器，如：</p><p><code>/bin/sh xxx.sh</code>，那，文件顶头的 <code>#!</code> 声明就会被忽视，毕竟已经明确指定解释器了</p><h4 id="for-循环" tabindex="-1"><a class="header-anchor" href="#for-循环" aria-hidden="true">#</a> for 循环</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>for loop in 1 3 4 5 6
do

done
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="-1" tabindex="-1"><a class="header-anchor" href="#-1" aria-hidden="true">#</a> $?</h4><p>用来获取上个命令的执行之后的退出状态，或者获取上个函数执行的返回值，0 表示正常，非0 表示不正常</p><p>所以，脚本如期结束时，脚本内最后应该 exit 0 来退出命令（每个脚本的执行其实就是执行命令）</p><h4 id="read-xxx" tabindex="-1"><a class="header-anchor" href="#read-xxx" aria-hidden="true">#</a> read xxx</h4><p>从标准输入中读取一行，并赋值给 xxx 变量</p><h4 id="printf" tabindex="-1"><a class="header-anchor" href="#printf" aria-hidden="true">#</a> printf</h4><p>输出格式化</p>`,148),u={href:"https://www.runoob.com/linux/linux-shell-printf.html",target:"_blank",rel:"noopener noreferrer"},v=d(`<h4 id="输入输出" tabindex="-1"><a class="header-anchor" href="#输入输出" aria-hidden="true">#</a> 输入输出</h4><p>默认的输入输出都是终端，但可通过 <code>&gt;</code> <code>&lt;</code> 来进行修改，比如</p><ul><li><code>ls &gt; file</code></li></ul><p>将输出写入到文件中，覆盖写入</p><ul><li><code>ls &gt;&gt; file</code></li></ul><p>将输出写入到文件中，追加写入</p><ul><li><code>xxx.sh &lt; file</code></li></ul><p>本来是从键盘输入到终端，转移到从文件读取内容</p><ul><li><code>&lt;&lt;EOF</code></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>xxx.sh&lt;&lt;EOF
....
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将两个 EOF 之间的内容作为输入</p><ul><li><code>ls &gt; /dev/null</code></li></ul><p>如果希望执行某个命令，但又不希望在屏幕上显示，那么可以将输出重定向到 <code>/dev/null</code></p><p>写入 <code>/dev/null</code> 中的内容会被丢弃</p><h3 id="语法-易混淆" tabindex="-1"><a class="header-anchor" href="#语法-易混淆" aria-hidden="true">#</a> 语法-易混淆</h3><p>有些语法很容易混淆，在这里列一列：</p><h4 id="和-和-和" tabindex="-1"><a class="header-anchor" href="#和-和-和" aria-hidden="true">#</a> \${} 和 $[] 和 $() 和 $(())</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>name=dasu
echo \${name}  # dasu，变量的使用

echo $[2+2]       # 4，执行算术表达式，可认为作用跟 expr 类似，但两者有各自局限，expr 支持字符串的关系运算等
echo \`expr 2 + 2\` # 4

echo $((2+2))     # 4，执行整数的算术表达式，可认为作用跟 expr 类似，但两者有各自局限，expr 支持字符串的关系运算等
echo \`expr 2 + 2\` # 4

echo $(whoami)    # root，执行命令，可认为作用跟 \`\` 反引号类似
echo \`whoami\`     # root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然 <code>$</code> 后面可以跟随各种各样符号，来实现不同用途，但其实，都可以归纳为 <code>$</code> 的作用是，提取后面的结果，然后将其作为输入，再次让 shell 解释器处理。</p><p>比如说 <code>\${xxx}</code>，就是将读取变量 xxx 的值，然后输入给解释器：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>name=dasu
\${name} # dasu: command not found
echo \${name} dasu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>是吧，就是提取，然后再输入给解释器，其实也就是变量值的替换，将变量替换为实际的值</p><p>那么，这么理解的话，<code>()</code> 小括号内的其实就是在执行命令，<code>$()</code> 就是将命令执行结果替换命令；<code>(())</code> 两个小括号内的其实就是在执行表达式，<code>$(())</code> 就是将表达式执行结果替换掉表达式；<code>$[]</code> 同理；</p><p>那么，可能你就会有疑问了：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>[1+1] # [1+1]: command not found
((1+1)) # 无报错也无输出
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>知道为什么吗？</p><p>因为 <code>(())</code> 是 shell 解释器可以识别的语法，它知道这不是字符串</p><p>但 <code>[1+1]</code> 却被解释器当做一整个字符串了，自然就找不到这个命令，shell 解释器能识别的 <code>[]</code> 语法应该是，中括号内部两侧需要有空格，此时就不会认为它是字符串了，如：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>[ 1+1 ] # 无报错也无输出
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>当有 <code>$</code> 时，就无需区分字符串的场景了，自然也就可以省略掉空格了，但保留好习惯，都留着空格也是很好的做法</p><h4 id="命令和表达式" tabindex="-1"><a class="header-anchor" href="#命令和表达式" aria-hidden="true">#</a> 命令和表达式</h4><ul><li>命令是指 shell 支持的命令，比如 ls，pwd，whoami 等等</li><li>表达式是指通过运算符组合成的各种表达式，如算术表达式，赋值表达式，关系表达式等等</li></ul><p>shell 内的每一行代码都是在执行命令，所以直接在 shell 内书写表达式是会执行异常，因为表达式不是命令</p><p>一些命令跟传入参数，如 echo xxx，echo 后跟随着会被当做字符串处理，如果想让 xxx 这串被作为命令执行，那需要将 xxx 放置于 <code>\`xxx\`</code> 反引号或者 <code>$(xxx)</code> 内</p><p>如果想让 xxx 被当做表达式处理，则需要借助一些命令，如 expr；</p><p>如果表达式是算术表达式，那可通过 <code>((xxx))</code> 包裹这些表达式，但需要获取表达式结果时，通过 <code>$((xxx))</code> 在前面加个 <code>$</code> 实现</p><hr><p>本篇就先介绍一些基础语法吧，当然并不全面，但足够看懂基本的 shell 脚本代码了</p><p>下一篇会介绍一些常用命令，如 expect，scp，ssh，以及再拿个 jenkins 上构建项目的实例脚本来讲讲</p>`,39);function t(p,b){const i=n("ExternalLinkIcon");return s(),l("div",null,[h,e("p",null,[e("a",u,[c("Shell printf 命令"),r(i)])]),v])}const x=a(o,[["render",t],["__file","shell语法.html.vue"]]);export{x as default};
