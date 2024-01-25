import{_ as l,r as d,o as r,c as t,a as e,b as n,e as s,d as a}from"./app-PjuKeMiB.js";const c={},o=a(`<p>[TOC]</p><p>注：标题前的【xxx】是指该题主要考察的知识点</p><h1 id="链表" tabindex="-1"><a class="header-anchor" href="#链表" aria-hidden="true">#</a> 链表</h1><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function ListNode(val) {
  this.val = val;
  this.next = null;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="【操作】链表的遍历、插入、删除" tabindex="-1"><a class="header-anchor" href="#【操作】链表的遍历、插入、删除" aria-hidden="true">#</a> 【操作】链表的遍历、插入、删除</h2>`,5),u={href:"https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/",target:"_blank",rel:"noopener noreferrer"},v={href:"https://leetcode.cn/problems/remove-duplicates-from-sorted-list/",target:"_blank",rel:"noopener noreferrer"},p=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定一个已排序的链表的头 head ， 删除原始链表中所有重复数字的节点，只留下不同的数字 。返回 已排序的链表 。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,2,3,3,4,4,5]
输出：[1,2,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>删除链表当前节点、下一个节点</strong></p><p>这道题两种思路，如果找重复节点是通过判断下一个节点和下下个节点，那么在<strong>删除下一个节点</strong>的基础上，加个 while 循环删除下一个重复的节点即可</p><p>删除下一个节点操作：cur.next = cur.next.next</p><p>如果找重复节点是判断当前节点和下一个节点，那么除了通过 while 来删除后续重复节点外，<strong>删除当前节点</strong>需要增加个指针记录上一个节点信息</p><h2 id="【操作】有序链表合并" tabindex="-1"><a class="header-anchor" href="#【操作】有序链表合并" aria-hidden="true">#</a> 【操作】有序链表合并</h2>`,7),h={href:"https://leetcode.cn/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/",target:"_blank",rel:"noopener noreferrer"},m=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：1-&gt;2-&gt;4, 1-&gt;3-&gt;4
输出：1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>链表的遍历</strong></p><h2 id="【双指针】链表的倒数第-n-个节点" tabindex="-1"><a class="header-anchor" href="#【双指针】链表的倒数第-n-个节点" aria-hidden="true">#</a> 【双指针】链表的倒数第 n 个节点</h2>`,4),b={href:"https://leetcode.cn/problems/remove-nth-node-from-end-of-list/",target:"_blank",rel:"noopener noreferrer"},g=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>双指针（快慢指针）</strong></p><p>双指针，间隔 k（慢 k-1 出发），一个到终点时，另一个刚好在倒数 k 个位置上</p><h2 id="【多指针】链表的反转、部分反转" tabindex="-1"><a class="header-anchor" href="#【多指针】链表的反转、部分反转" aria-hidden="true">#</a> 【多指针】链表的反转、部分反转</h2>`,5),x={href:"https://leetcode.cn/problems/reverse-linked-list-ii/",target:"_blank",rel:"noopener noreferrer"},_={href:"https://leetcode.cn/problems/reverse-linked-list/",target:"_blank",rel:"noopener noreferrer"},f=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给你单链表的头指针 head 和两个整数 left 和 right ，其中 left &lt;= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>多指针，链表的操作</strong></p><p>通过多个指针分别指向当前节点、上一个节点、下一个节点，因为反转当前节点和下个节点关系时，还需要知道上一个节点才能操作</p><h2 id="【快慢指针-标记法】链表的环判断-寻找环起点" tabindex="-1"><a class="header-anchor" href="#【快慢指针-标记法】链表的环判断-寻找环起点" aria-hidden="true">#</a> 【快慢指针｜标记法】链表的环判断，寻找环起点</h2>`,5),k={href:"https://leetcode.cn/problems/linked-list-cycle-ii/",target:"_blank",rel:"noopener noreferrer"},y=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>快慢指针</strong></p><p>这道题需要解决两个问题：判断是否有环、如果有，找到环起点位置</p><p>有两种思路：快慢指针和标记法</p><ul><li>快慢指针</li></ul><p>A 指针每次走 1 步，B 指针每次走 2 步，如果有环，那么总会相遇。而且肯定在 A 指针走完第一圈环之前会相遇。</p><p>在相遇的时候，这时候从起点再让 C 指针每次走 1 步，当 C 指针和 A 指针相遇时，就是环起点</p><p>推理过程：2 (a + b) = a + n(b+c) + b =&gt; a = n(b + c) - b</p><ul><li>标记法</li></ul><p>遍历链表过程中，标记经过的每一个节点，当某个已经被标记过的节点再次被遍历到时，有环，且该节点为环起点</p><h1 id="数组" tabindex="-1"><a class="header-anchor" href="#数组" aria-hidden="true">#</a> 数组</h1><p>因为我是做前端的，在 LeetCode 上刷算法题时，用的是 JavaScript，所以一些基本数据结构以及相关操作，偷懒直接用了 js 语言提供的了。这些都是基本东西，掌握其基本思想，除非硬要自己写，否则直接用就好了</p><ul><li>sort((a, b) =&gt; a - b) <ul><li>非排序类题目，又需要排序数组时，直接用了</li></ul></li><li>pop(), push(x) <ul><li>把数组当作栈使用</li></ul></li><li>shift(), unshift(x) <ul><li>与 pop(), push(x) 结合使用，可以当做队列使用</li></ul></li><li>splice(start, deleteCount, ...items) <ul><li>删除数组指定位置的项</li><li>在指定位置插入数据</li></ul></li><li>slice(start, end) <ul><li>复制数组指定范围的数据，不影响原数组</li></ul></li><li>new Array(len).fill(0) <ul><li>创建数组，并设置初始值</li></ul></li></ul><h2 id="【双指针】合并两个有序数组" tabindex="-1"><a class="header-anchor" href="#【双指针】合并两个有序数组" aria-hidden="true">#</a> 【双指针】合并两个有序数组</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>	function mergeNums(nums1, nums2) {
        var res = [];
        while(nums1.length &amp;&amp; nums2.length) {
            if (nums1[0] &lt;= nums2[0]) {
                res.push(nums1.shift());
            } else {
                res.push(nums2.shift());
            }
        }
        if (nums1.length) {
            res.push(...nums1);
        }
        if (nums2.length) {
            res.push(...nums2);
        }
        return res;
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>归并排序时需要用到这个方法</p><h1 id="栈与队列" tabindex="-1"><a class="header-anchor" href="#栈与队列" aria-hidden="true">#</a> 栈与队列</h1><h2 id="【递减栈】o-1-时间获取当前栈里最小值问题" tabindex="-1"><a class="header-anchor" href="#【递减栈】o-1-时间获取当前栈里最小值问题" aria-hidden="true">#</a> 【递减栈】O(1) 时间获取当前栈里最小值问题</h2>`,19),j={href:"https://leetcode.cn/problems/min-stack/",target:"_blank",rel:"noopener noreferrer"},q=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

实现 MinStack 类:

MinStack() 初始化堆栈对象。
void push(int val) 将元素val推入堆栈。
void pop() 删除堆栈顶部的元素。
int top() 获取堆栈顶部的元素。
int getMin() 获取堆栈中的最小元素。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：
[&quot;MinStack&quot;,&quot;push&quot;,&quot;push&quot;,&quot;push&quot;,&quot;getMin&quot;,&quot;pop&quot;,&quot;top&quot;,&quot;getMin&quot;]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]

解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --&gt; 返回 -3.
minStack.pop();
minStack.top();      --&gt; 返回 0.
minStack.getMin();   --&gt; 返回 -2.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察的知识点：<strong>递减辅助栈</strong></p><p>辅助栈栈顶元素表示当前栈内数据的最小值，利用了栈的先进后出特性，如果某个数据是最小值，那么在该数据从栈移出之前，比这个数据还早入栈的数据的最小值都不会比它小</p><p>所以在每次数据入栈时，也需要拿着该数据去辅助栈看是否需要处理，只有比辅助栈栈顶数据小，才需要把当前数据也入栈到辅助栈，否则还是以辅助栈栈顶元素入栈。</p><p>每次数据出栈时，辅助栈栈顶元素同样出栈</p><h2 id="【两个栈】用栈模拟队列" tabindex="-1"><a class="header-anchor" href="#【两个栈】用栈模拟队列" aria-hidden="true">#</a> 【两个栈】用栈模拟队列</h2>`,7),S={href:"https://leetcode.cn/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/",target:"_blank",rel:"noopener noreferrer"},I=e("p",null,"一个栈负责存储输入数据，一个栈负责存储需要输出的数据，当输出栈为空时，把输入栈的数据依次弹出到输出栈",-1),O=e("h2",{id:"【递减队列】滑动窗口里的最大值问题",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#【递减队列】滑动窗口里的最大值问题","aria-hidden":"true"},"#"),n(" 【递减队列】滑动窗口里的最大值问题")],-1),M={href:"https://leetcode.cn/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/",target:"_blank",rel:"noopener noreferrer"},w=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7] 
解释: 

  滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>递减队列</strong></p><p>用一个递减队列来表示当前滑动窗口里数据的最大值，这是利用了队列的先进先出特性。因为当前数据如果是最大值，那么在它从队列里移出前，在它之后入队列的，队列里的最大值都是它。所以只要维护一个递减队列，那么队首就表示着它移出前的最大值</p><p>所以在滑动窗口移动过程中，数据输入和移出窗口都需要去更新这个队列</p><h1 id="树" tabindex="-1"><a class="header-anchor" href="#树" aria-hidden="true">#</a> 树</h1><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 二叉树结点的构造函数
function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="【递归-栈-队列】二叉树的前、中、后序遍历-层次遍历" tabindex="-1"><a class="header-anchor" href="#【递归-栈-队列】二叉树的前、中、后序遍历-层次遍历" aria-hidden="true">#</a> 【递归｜栈｜队列】二叉树的前、中、后序遍历，层次遍历</h2><p>二叉树是指：最多只有左右两个子节点的树</p><ul><li>前序遍历（根、左、右）</li></ul>`,10),N={href:"https://leetcode.cn/problems/binary-tree-preorder-traversal/",target:"_blank",rel:"noopener noreferrer"},C=e("p",null,"递归很简单，如果用迭代来实现前序遍历的话，用栈就能实现，需要注意下，先右节点入栈，再左节点入栈，因为出栈顺序是反的",-1),B=e("ul",null,[e("li",null,"中序遍历（左、根、右）")],-1),A={href:"https://leetcode.cn/problems/binary-tree-inorder-traversal/",target:"_blank",rel:"noopener noreferrer"},L=a(`<p>递归很简单，如果用迭代来实现的话，就与其他两种遍历思路上会有些差异，首先初始状态，栈上空的，不用把根节点放入栈里，入栈操作是在 while 循环里：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>		var stack = [];
    while(root || stack.length) {
        if (root) {
            stack.push(root);
            root = root.left;
        } else {
            root = stack.pop();
            res.push(root.val);
            root = root.right;
        }
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>后序遍历（左、右、根）</li></ul>`,3),T={href:"https://leetcode.cn/problems/binary-tree-level-order-traversal/",target:"_blank",rel:"noopener noreferrer"},V=e("p",null,"递归很简单，如果用迭代实现的话，思路很讨巧，就是往 res 数组里填充数据时，用 unshift，反着来。这样子的话，遍历的顺序是根，右，左，但引入放入数组是反着放，所以数组里顺序是左，右，根，这就获取到后序遍历的数据了",-1),z=e("ul",null,[e("li",null,"层次遍历")],-1),E={href:"https://leetcode.cn/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/",target:"_blank",rel:"noopener noreferrer"},R=e("p",null,"迭代 + 队列 => 广度优先遍历，也就是层序遍历树",-1),J=e("h2",{id:"【二叉查找树】插入、删除、验证、构建",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#【二叉查找树】插入、删除、验证、构建","aria-hidden":"true"},"#"),n(" 【二叉查找树】插入、删除、验证、构建")],-1),D=e("p",null,"二叉查找树是指：左节点的值 < 根节点的值 <= 右节点的值。基于这个概念，当用中序遍历时，可以得到从小到大有序的数组",-1),F={href:"https://leetcode.cn/problems/insert-into-a-binary-search-tree/",target:"_blank",rel:"noopener noreferrer"},G=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定二叉搜索树（BST）的根节点 root 和要插入树中的值 value ，将值插入二叉搜索树。 返回插入后二叉搜索树的根节点。 输入数据 保证 ，新值和原始二叉搜索树中的任意节点值都不同。

注意，可能存在多种有效的插入方式，只要树在插入后仍保持为二叉搜索树即可。 你可以返回 任意有效的结果 。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：root = [4,2,7,1,3], val = 5
输出：[4,2,7,1,3,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>二叉搜索树的查找过程</strong></p><p>根据二叉搜索树的特性：左节点 &lt; 根节点 &lt; 右节点，遍历找到合适的叶子节点，把新增的节点插入到这个位置即可。</p><p>递归实现查找过程</p>`,5),H={href:"https://leetcode.cn/problems/delete-node-in-a-bst/",target:"_blank",rel:"noopener noreferrer"},K=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

一般来说，删除节点可分为两个步骤：

首先找到需要删除的节点；
如果找到了，删除它。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：root = [5,3,6,2,4,null,7], key = 3
输出：[5,4,6,2,null,null,7]
解释：给定需要删除的节点值是 3，所以我们首先找到 3 这个节点，然后删除它。
一个正确的答案是 [5,4,6,2,null,null,7], 如下图所示。
另一个正确答案是 [5,2,6,null,4,null,7]。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>二叉搜索树的节点删除操作</strong></p><p>删除就有点复杂了，首先需要找到需要删除的节点，然后删除掉它，但如果它有子节点，此时还需要去子节点里找出一个节点挪移到这个被删除的位置上</p><p>找子节点有两种思路：要么在左子树里找最大值，要么在右子树里找最小值</p><p>当找到子节点后，因为需要挪移，这其实意味着又发生一次节点删除操作，因为是需要把这个子节点先从原本位置删除，再复制到一开始被删除掉的节点位置上。所以，这个过程又需要重复走一遍删除操作的流程</p><p>所以其实上各种递归，递归查找，递归删除</p><p>如果被删除的节点有子节点，那么至少会发生二次删除节点操作</p>`,8),P={href:"https://leetcode.cn/problems/legal-binary-search-tree-lcci/",target:"_blank",rel:"noopener noreferrer"},Q=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>实现一个函数，检查一棵二叉树是否为二叉搜索树。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入:
    2
   / \\
  1   3
输出: true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>二叉搜索树的特性</strong></p><p>两种思路：一是判断这颗树是否满足：左节点 &lt; 根节点 &lt; 右节点</p><p>另一种思路是，用中序遍历这颗树，如果它是二叉搜索树，那么数据就会满足有序的特性，以此来判断是否是合法的二叉搜索树</p>`,5),U={href:"https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/",target:"_blank",rel:"noopener noreferrer"},W=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给你一个整数数组 nums ，其中元素已经按 升序 排列，请你将其转换为一棵 高度平衡 二叉搜索树。

高度平衡 二叉树是一棵满足「每个节点的左右两个子树的高度差的绝对值不超过 1 」的二叉树。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：nums = [-10,-3,0,5,9]
输出：[0,-3,9,-10,null,5]
解释：[0,-10,5,null,-3,null,9] 也将被视为正确答案：
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>二叉搜索树的构建</strong></p><p>每次取数组中间位置二分递归，就能构建出一颗二叉搜索树了</p><h2 id="【平衡二叉树】验证、构建、左旋、右旋" tabindex="-1"><a class="header-anchor" href="#【平衡二叉树】验证、构建、左旋、右旋" aria-hidden="true">#</a> 【平衡二叉树】验证、构建、左旋、右旋</h2><p>二叉平衡树是指：左右子树的高度差不超过 1 的树</p>`,6),X={href:"https://leetcode.cn/problems/ping-heng-er-cha-shu-lcof/",target:"_blank",rel:"noopener noreferrer"},Y=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左右子树的深度相差不超过1，那么它就是一棵平衡二叉树。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定二叉树 [3,9,20,null,null,15,7]

    3
   / \\
  9  20
    /  \\
   15   7
返回 true 。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>二叉平衡树的特性</strong></p><p>根据二叉平衡树每个节点的左右子树高度差不能超过 1 的特性判断就行</p><p>在递归的回溯过程中，每个节点的高度就已经计算完毕了，这时候就可以去进行判断了</p>`,5),Z={href:"https://leetcode.cn/problems/balance-a-binary-search-tree/",target:"_blank",rel:"noopener noreferrer"},$=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给你一棵二叉搜索树，请你返回一棵 平衡后 的二叉搜索树，新生成的树应该与原来的树有着相同的节点值。如果有多种构造方法，请你返回任意一种。

如果一棵二叉搜索树中，每个节点的两棵子树高度差不超过 1 ，我们就称这棵二叉搜索树是 平衡的 。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：root = [1,null,2,null,3,null,4,null,null]
输出：[2,1,3,null,null,null,4]
解释：这不是唯一的正确答案，[3,1,4,null,2,null,null] 也是一个可行的构造方案。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>二叉平衡树的构建、左旋右旋操作</strong></p><p>两种思路：一种是先中序遍历获取有序数组，然后根据数据来构建二叉平衡树。因为二叉平衡树，其实是特殊的二叉搜索树，所以它也满足二叉搜索树的特性，所以中序遍历后可以得到有序数组。然后每次在数组中间位置递归切分左右子树，得到的就是二叉平衡树</p><p>另一种思路是直接在二叉平衡树上做节点的旋转操作，这就涉及到节点的左旋、右旋操作，总共要处理四种场景：</p><p>如果右子树比左子树高度超过 1:</p><ul><li>如果插入的节点在右叶子节点位置，root 左旋</li><li>如果插入的节点在左叶子节点位置，root.right 先右旋，root 再左旋</li></ul><p>如果左子树比右子树高度超过 1:</p><ul><li>如果插入的节点在左叶子节点位置，root 右旋</li><li>如果插入的节点在右叶子节点位置，root.left 先左旋，root 再右旋</li></ul><h1 id="堆" tabindex="-1"><a class="header-anchor" href="#堆" aria-hidden="true">#</a> 堆</h1><p>堆的数据结构就是完全二叉树</p><p>通常有两种堆，最小堆和最大堆</p><p>最小堆指根节点比左右子树的节点都小，最大堆则相反</p><p>优先队列的实际数据结构就是最大堆，堆顶一直是最大的，所以每次输出就是取堆顶</p><p>取操作就是删除堆顶，然后把最后一个元素放到堆顶，从上到下更新到合适位置</p><p>入操作就是把数据放到最后一个位置，然后从下到上更新到合适位置</p><h1 id="排序" tabindex="-1"><a class="header-anchor" href="#排序" aria-hidden="true">#</a> 排序</h1><p>排序需要掌握几个方面的基本知识：常见的排序算法、排序算法的时间复杂度、稳定性、适用场景、优化思路</p><p>从时间复杂度角度看的话，大概可以分成三类：</p>`,19),ee={href:"https://leetcode.cn/problems/sort-an-array/",target:"_blank",rel:"noopener noreferrer"},ne=a(`<h2 id="o-n-2-冒泡排序、选择排序、插入排序" tabindex="-1"><a class="header-anchor" href="#o-n-2-冒泡排序、选择排序、插入排序" aria-hidden="true">#</a> O(n^2)：冒泡排序、选择排序、插入排序</h2><ul><li>冒泡排序</li></ul><p>最好情况是 O(n)，当经过一次冒泡后数组就排完序时，所以代码实现上，可以加上冒泡过程是否有数据交换操作的标记，没有则表示数组已有序，即可提前终止循环</p><p>因为每次交换数据都是相邻的数据交换，属于稳定性排序</p><ul><li>选择排序</li></ul><p>没有最好的情况，都是 O(n^2)。而且由于数据交换是非相邻的数据，属于非稳定性排序</p><ul><li>插入排序</li></ul><p>最好情况是 O(n)，当数组本身有序时，每次插入直接在末尾插入，遍历一次即可</p><h2 id="o-nlogn-快速排序、归并排序" tabindex="-1"><a class="header-anchor" href="#o-nlogn-快速排序、归并排序" aria-hidden="true">#</a> O(nlogn)：快速排序、归并排序</h2><p>快排和归并的实现都是基于递归，但两个算法对数据的处理思路是相反的</p><p>快排是先对数据处理，分完块后，再继续递归处理块里数据</p><p>归并则是先对数据分块，在最后的回溯过程中，对分块的数据进行合并操作</p><p>所以快排核心是递归+基于基准元素的数据分块，归并的核心是递归+合并两个有序数组</p><p>快排是非稳定性的，因为它有非相邻数据的交换操作，但也可以改造成稳定性，不过要牺牲空间；归并是稳定性排序</p><h2 id="o-n-桶排序、计数排序、基数排序" tabindex="-1"><a class="header-anchor" href="#o-n-桶排序、计数排序、基数排序" aria-hidden="true">#</a> O(n)：桶排序、计数排序、基数排序</h2><p>这三类排序不是通用的排序算法，需要满足一定条件才是它的适用场景，通常排序的数据都需要是数字的场景，比如金额、成绩、年龄、手机号等等</p><p>桶排序：知道排序数据的取值范围，按一定比例划分区间，即分桶，桶之间就是有序，然后桶内的数据再排序</p><p>计数排序：特殊的桶排序，每个桶的区间就是数字本身，桶里只存放该数字出现的个数，通用用于像成绩、年龄这种数值小的排序</p><p>基数排序：像手机号、身份证号这种数字很大的场景，桶排序和计数排序都不适用，但如果不是对数字本身排序，而是对数字上的某一位排序，这个就是基数排序，从个位、十位等依次进行计数排序，所有位排完后，也就等于对数字本身排完序了</p><h1 id="递归、回溯" tabindex="-1"><a class="header-anchor" href="#递归、回溯" aria-hidden="true">#</a> 递归、回溯</h1><h2 id="思路模板" tabindex="-1"><a class="header-anchor" href="#思路模板" aria-hidden="true">#</a> 思路模板</h2><p>在一些像求组合、排列的这类递归问题，有一套思路模板：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function xxx(入参) {
  // 前期的变量定义、缓存等准备工作 
  
  // 定义路径栈
  const path = []
  
  // 进入 dfs
  dfs(起点) 
  
  // 定义 dfs
  dfs(递归参数) {
    if(到达了递归边界) {
      // 结合题意处理边界逻辑，往往和 path 内容有关
      return   
    }
    
    // 注意这里也可能不是 for，视题意决定
    for(遍历坑位的可选值) {
      path.push(当前选中值)
      // 处理坑位本身的相关逻辑
      path.pop()
    }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="【递归】组合、全排列、子集" tabindex="-1"><a class="header-anchor" href="#【递归】组合、全排列、子集" aria-hidden="true">#</a> 【递归】组合、全排列、子集</h2>`,24),ie={href:"https://leetcode.cn/problems/combinations/",target:"_blank",rel:"noopener noreferrer"},se={href:"https://leetcode.cn/problems/permutations/",target:"_blank",rel:"noopener noreferrer"},ae={href:"https://leetcode.cn/problems/subsets/",target:"_blank",rel:"noopener noreferrer"},le=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。

你可以按 任何顺序 返回答案。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：n = 4, k = 2
输出：
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>考察知识点：<strong>递归</strong></p><p>思路就是递归处理数组 [1...n]，每次往 path 里压入一个值，当 path 长度等于 k 时，满足答案条件，获取当前 path 数组，继续递归</p><h1 id="动态规划" tabindex="-1"><a class="header-anchor" href="#动态规划" aria-hidden="true">#</a> 动态规划</h1><p>动态规划其实感觉有点像是跟递归反着来，因为实现上就是几个 for 循环，用迭代的思路，从已知的开始，推算出下一个结果</p><p>所以对于动态规划的题目，找规律，求生那个状态转移方程式是最重要的</p><p>什么是状态转移方程呢，简单举个例子，比如 f(n) = f(n - 1) + f(n - 2)</p><p>通常来说，当题目是求最值问题，子序列问题，01背包问题时，基本就是考察动态规划的了</p>`,9),de={id:"_70-爬楼梯",tabindex:"-1"},re=e("a",{class:"header-anchor",href:"#_70-爬楼梯","aria-hidden":"true"},"#",-1),te={href:"https://leetcode.cn/problems/climbing-stairs/",target:"_blank",rel:"noopener noreferrer"},ce=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>思路：每次只能爬 1 或 2 个台阶，那么当你爬到 n 阶时，你还记得你上一个位置有可能是在哪里吗？n - 1 的位置，或者 n - 2 位置，是吧，只有这两种可能。那这其实状态转移方程就出来了：</p><p>状态转移方程：<strong>dp[n] = dp[n - 1] + dp[n - 2]</strong></p>`,4),oe={id:"剑指-offer-ii-103-最少的硬币数目",tabindex:"-1"},ue=e("a",{class:"header-anchor",href:"#剑指-offer-ii-103-最少的硬币数目","aria-hidden":"true"},"#",-1),ve={href:"https://leetcode.cn/problems/gaM7Ch/",target:"_blank",rel:"noopener noreferrer"},pe=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。

你可以认为每种硬币的数量是无限的。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>思路：当金额是 n，那么凑成总金额的硬币个数的其中一种数量是不是：f(n) = f(n - coins[i]) + 1，举个例子，总金额 11，那么凑成 11 的一种方案是不是等于凑成 10(11 - 1) 的数量再加 1</p><p>状态转移方程：<strong>dp[n] = Math.min(dp[n - coins[i]] + 1, dp[n])</strong>，i 为遍历 coins 数组的下标</p>`,4),he={id:"_300-最长递增子序列",tabindex:"-1"},me=e("a",{class:"header-anchor",href:"#_300-最长递增子序列","aria-hidden":"true"},"#",-1),be={href:"https://leetcode.cn/problems/longest-increasing-subsequence/",target:"_blank",rel:"noopener noreferrer"},ge=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。

子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这题有两种解题思路，贪心或动态规划</p><p><strong>贪心思路</strong>：维护一个递增数组，遍历过程中，当输入的数据不是递增数据时，就倒着遍历递增数组，找到它合适的位置替换掉原位置上的值，最后递增数组的长度就是最长递增子序列的长度</p><p>这个思路网上有种解释很贴切，看你能不能 get 到：对于岗位价值一样的新老员工，公司通常宁愿不要老员工，招个新员工来替代</p><p>举个例子，当遍历上面例子数据时，遍历到 10 时，递增数组为 [10]，遍历到 9 时，发现不是递增的数据，但对于往后要继续找递增子序列这件事来说，9 的价值是不是比 10 更大，能跟 10 组成递增的数，是不是也肯定能跟 9 组成递增，所以 10 在递增数组里的这个位置，是不是越小越好，因此就用 9 来替换掉 10</p><p>这其实就是贪心思想，每一次输入都找最优解，结果自然也是最优解</p><p>**动态规划思路：**其实就是两个循环，遍历到 i 位置时，再去循环更新下 0-i 这些已经遍历过的递增子序列长度，看是否需要更新</p><p>状态转移方程：<strong>dp[i] = Math.max(dp[i], dp[j] + 1)</strong>，i 是外层 for 循环，j 是内层 0 - i 的循环</p><h1 id="贪心" tabindex="-1"><a class="header-anchor" href="#贪心" aria-hidden="true">#</a> 贪心</h1><p>贪心是一种思想，通常在求最大、最小、最值这种问题时，可能可以用到贪心的思想</p><p>也就是最后的最优结果，可以分化成每一个步骤的最优解</p>`,12),xe={id:"_2279-装满石头的背包的最大数量",tabindex:"-1"},_e=e("a",{class:"header-anchor",href:"#_2279-装满石头的背包的最大数量","aria-hidden":"true"},"#",-1),fe={href:"https://leetcode.cn/problems/maximum-bags-with-full-capacity-of-rocks/",target:"_blank",rel:"noopener noreferrer"},ke=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>现有编号从 0 到 n - 1 的 n 个背包。给你两个下标从 0 开始的整数数组 capacity 和 rocks 。第 i 个背包最大可以装 capacity[i] 块石头，当前已经装了 rocks[i] 块石头。另给你一个整数 additionalRocks ，表示你可以放置的额外石头数量，石头可以往 任意 背包中放置。

请你将额外的石头放入一些背包中，并返回放置后装满石头的背包的 最大 数量。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：capacity = [2,3,4,5], rocks = [1,2,4,4], additionalRocks = 2
输出：3
解释：
1 块石头放入背包 0 ，1 块石头放入背包 1 。
每个背包中的石头总数是 [2,3,4,4] 。
背包 0 、背包 1 和 背包 2 都装满石头。
总计 3 个背包装满石头，所以返回 3 。
可以证明不存在超过 3 个背包装满石头的情况。
注意，可能存在其他放置石头的方案同样能够得到 3 这个结果。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>思路：求把额外的石头放进一堆背包里，能够装满书包的最大数量。那么，每一次都优先把石头放在剩最小数量的石头就能装满的书包，直到用完这些石头，这种就是贪心思想</p>`,3);function ye(je,qe){const i=d("ExternalLinkIcon");return r(),t("div",null,[o,e("p",null,[e("a",u,[n("82. 删除排序链表中的重复元素 II"),s(i)]),n("、"),e("a",v,[n("83. 删除排序链表中的重复元素"),s(i)])]),p,e("p",null,[e("a",h,[n("剑指 Offer 25. 合并两个排序的链表"),s(i)])]),m,e("p",null,[e("a",b,[n("19. 删除链表的倒数第 N 个结点"),s(i)])]),g,e("p",null,[e("a",x,[n("92. 反转链表 II"),s(i)]),n("、"),e("a",_,[n("206. 反转链表"),s(i)])]),f,e("p",null,[e("a",k,[n("142. 环形链表 II"),s(i)])]),y,e("p",null,[e("a",j,[n("155. 最小栈"),s(i)])]),q,e("p",null,[e("a",S,[n("剑指 Offer 09. 用两个栈实现队列"),s(i)])]),I,O,e("p",null,[e("a",M,[n("剑指 Offer 59 - I. 滑动窗口的最大值"),s(i)])]),w,e("p",null,[e("a",N,[n("144. 二叉树的前序遍历"),s(i)])]),C,B,e("p",null,[e("a",A,[n("94. 二叉树的中序遍历"),s(i)])]),L,e("p",null,[e("a",T,[n("102. 二叉树的层序遍历"),s(i)])]),V,z,e("p",null,[e("a",E,[n("剑指 Offer 32 - I. 从上到下打印二叉树"),s(i)])]),R,J,D,e("p",null,[e("a",F,[n("701. 二叉搜索树中的插入操作"),s(i)])]),G,e("p",null,[e("a",H,[n("450. 删除二叉搜索树中的节点"),s(i)])]),K,e("p",null,[e("a",P,[n("面试题 04.05. 合法二叉搜索树"),s(i)])]),Q,e("p",null,[e("a",U,[n("108. 将有序数组转换为二叉搜索树"),s(i)])]),W,e("p",null,[e("a",X,[n("剑指 Offer 55 - II. 平衡二叉树"),s(i)])]),Y,e("p",null,[e("a",Z,[n("1382. 将二叉搜索树变平衡"),s(i)])]),$,e("p",null,[e("a",ee,[n("912. 排序数组"),s(i)])]),ne,e("p",null,[e("a",ie,[n("77. 组合"),s(i)]),n("、"),e("a",se,[n("46. 全排列"),s(i)]),n("、"),e("a",ae,[n("78. 子集"),s(i)])]),le,e("h2",de,[re,n(),e("a",te,[n("70. 爬楼梯"),s(i)])]),ce,e("h2",oe,[ue,n(),e("a",ve,[n("剑指 Offer II 103. 最少的硬币数目"),s(i)])]),pe,e("h2",he,[me,n(),e("a",be,[n("300. 最长递增子序列"),s(i)])]),ge,e("h2",xe,[_e,n(),e("a",fe,[n("2279. 装满石头的背包的最大数量"),s(i)])]),ke])}const Ie=l(c,[["render",ye],["__file","index.html.vue"]]);export{Ie as default};
