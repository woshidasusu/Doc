import{_ as e,o as t,c as i,d as r}from"./app-pwInIdNR.js";const a={},p=r('<h3 id="说说-git" tabindex="-1"><a class="header-anchor" href="#说说-git" aria-hidden="true">#</a> 说说 Git</h3><p>Git 是一种代码版本管理工具</p><p>它可以很方便的追踪你代码的各个提交记录，每次提交都修改了哪些文件，回退、比较等也特别方便</p><p>同时，它的强大分支功能也能让你可以很方便的并行开发，管理同一时刻不同走向的分支代码</p><p>标签功能支持我们为每次稳定版本的发版来做标志</p><p>协同开发时，也可以使用它的远程中央仓库以及自带的一系列合并、冲突解决的功能来完成</p><p>下面说几种常见场景的处理：</p><h4 id="场景一-有多次连续的-commit-想合并成一个-去掉无用信息的-commit-时-怎么做" tabindex="-1"><a class="header-anchor" href="#场景一-有多次连续的-commit-想合并成一个-去掉无用信息的-commit-时-怎么做" aria-hidden="true">#</a> 场景一：有多次连续的 commit 想合并成一个，去掉无用信息的 commit 时，怎么做</h4><p><strong>git reset -soft [HEAD]</strong> 命令，将指定的提交 id 之前的所有 commit 的改动都回退到暂存区，此时重新执行 git commit 生成一个提交即可，但这仅限于自己本地仓库的处理</p><p>如果是远程仓库很多无用提交，则需要使用其他方式，要么借助 reset + push -f 来强推覆盖，要么使用 git rebase</p><h4 id="场景二-git-pull-和-git-fetch" tabindex="-1"><a class="header-anchor" href="#场景二-git-pull-和-git-fetch" aria-hidden="true">#</a> 场景二：git pull 和 git fetch</h4><p><strong>git pull</strong> 是将远程代码拉取并合并到本地分支</p><p><strong>git fetch</strong> 只将远程代码拉取，并不做合并操作</p><p>所以，git pull = git fetch + git merge</p><p>使用场景通常是，我们每天都想看一下其他人提交了什么代码，但又想等确认完才决定合不合并到自己本地代码分支上，此时，就可以先执行 git fetch 命令，查阅后，再手动执行 git merge</p><h4 id="场景三-git-stash" tabindex="-1"><a class="header-anchor" href="#场景三-git-stash" aria-hidden="true">#</a> 场景三：git stash</h4><p>该命令用于暂存未提交的修改，后续通过 unstash 还原</p><p>通常是在本地开发到一半时，此时需要切分支解决问题，但又不想让本地的修改直接提交占用提交记录，就可以使用 git stash 将本地修改暂存</p><h4 id="场景四-如何还原已经-push-并公开的提交" tabindex="-1"><a class="header-anchor" href="#场景四-如何还原已经-push-并公开的提交" aria-hidden="true">#</a> 场景四：如何还原已经 push 并公开的提交</h4><p>两种思路，一种是手动还原，然后再重新提交一次 commit 覆盖掉远程的代码，以此来实现还原</p><p>这种方式其实不叫还原，而是手动将代码改回之前的版本，可以借助一些 history 命令来协助查看之前代码的内容</p><p>另一种则是借助 git revert，该命令其实就是干的上面的活，只是不用我们手动去修改代码，它直接将相关 commit 改动的文件回退掉，同时生成一个新的提交，来覆盖这些效果</p><h4 id="场景五-git-reset-和-git-revert-的区别" tabindex="-1"><a class="header-anchor" href="#场景五-git-reset-和-git-revert-的区别" aria-hidden="true">#</a> 场景五：git reset 和 git revert 的区别</h4><p>git reset 是回滚到某个提交，HEAD 是往后走，删除的是本地仓库的提交记录，根据不同参数，可以让这些被删除的提交里的修改有不同的处理，比如 -hard 直接扔掉，-soft 保留暂存区</p><p>但是，远程仓库的这些提交还在，所以没法直接提交，还是得解决合并问题，除非直接 push -f 强推</p><p>除了回滚提交，粒度还可以细到单个文件</p><p>git revert 则是将相关的提交里所做的修改都回撤掉，同时提交一个新的记录来覆盖，所以 HEAD 是往前走的，而且这个命令只能针对提交粒度</p><p>默认只对一个提交进行反撤，当然可以结合其他参数来进行范围性多个提交的反撤</p><h4 id="场景六-git-rebase" tabindex="-1"><a class="header-anchor" href="#场景六-git-rebase" aria-hidden="true">#</a> 场景六：git rebase</h4><p>rebase 变基，也就是修改当前分支的基准，简单理解成，把其他分支的提交再次拉过来放在你当前分支的提交之前，所以不要在主分支上做这件事</p><p>git rebase 是能够将分叉的分支重新合并，有两种场景</p><p>场景一：你与同事同时开发，同时修改到某个相同文件，当你做好需要提交时，同事已经先行提交了，这时你需要先 pull，解决冲突再提交，但默认是会有分叉，因为你和同事的提交属于同级关系，而不是前后关系，所以会有分支自动生成</p><p>这时只要在解决完冲突后，再执行下 git rebase 就可以将分支合并起来</p><p>场景二：当你自己在本地多分支并行开发，需要合并时，同级别的提交仍旧会产生冲突和分叉的分支，这时，需要在你进行合并之前，基于某分支执行 git rebase xxx</p><p>这个命令意思是说，基于 xxx 分支基础上，将当前分支的修改增加过去，然后解决冲突，再执行 git rebase -continue 就完成了合并的操作</p><h4 id="场景七-git-cherry-pick" tabindex="-1"><a class="header-anchor" href="#场景七-git-cherry-pick" aria-hidden="true">#</a> 场景七：git cherry-pick</h4><p>通常合并某分支时，会把那个分支的所有提交都合并过来，但如果只需要合并其中的个别提交呢，就可以使用 git cherry-pick 命令</p><ul><li>git blame：查看谁更改了 xxx 文件的内容和时间</li><li>git clean：删除本地目录中未追踪的文件</li></ul>',38),h=[p];function s(c,g){return t(),i("div",null,h)}const n=e(a,[["render",s],["__file","说说git使用.html.vue"]]);export{n as default};
