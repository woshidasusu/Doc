import{_ as a,r as s,o as r,c as l,a as e,b as n,e as d,d as c}from"./app-2pyCoCP5.js";const v={},u=e("h1",{id:"docker-命令",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#docker-命令","aria-hidden":"true"},"#"),n(" docker 命令")],-1),o=e("p",null,"参考资料：",-1),t={href:"https://docs.docker.com/engine/reference/run/",target:"_blank",rel:"noopener noreferrer"},m={href:"https://yeasy.gitbooks.io/docker_practice/content/container/",target:"_blank",rel:"noopener noreferrer"},b=c(`<h2 id="命令-镜像相关" tabindex="-1"><a class="header-anchor" href="#命令-镜像相关" aria-hidden="true">#</a> 命令-镜像相关</h2><h3 id="pull" tabindex="-1"><a class="header-anchor" href="#pull" aria-hidden="true">#</a> pull</h3><p>从仓库拉取镜像，命令格式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]

# 简单例子
docker pull alpine
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="images" tabindex="-1"><a class="header-anchor" href="#images" aria-hidden="true">#</a> images</h3><p>列出已经下载下来的镜像：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>docker images
# 输出
REPOSITORY       TAG             IMAGE ID         CREATED             SIZE
alpine           latest        965ea09ff2eb      7 weeks ago         5.55MB
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="image" tabindex="-1"><a class="header-anchor" href="#image" aria-hidden="true">#</a> image</h3><p>对镜像的操作</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code># 相当于 docker images
docker image ls 

# 查看镜像的摘要
docker image ls --digests

# 通过摘要删除镜像
docker image rm [镜像摘要]

# 删除虚悬镜像，也就是镜像名称、标签都为 none 的镜像
docker image prune

# 查看镜像的历史记录
docker image history [镜像名]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="build" tabindex="-1"><a class="header-anchor" href="#build" aria-hidden="true">#</a> build</h3><p>通过 Dockerfile 构建镜像，build 命令会默认去寻找当前目录下的 Dockerfile 文件，也可以手动指定</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code># build 后面还有一个 . 这是因为 build 的工作原理需要一个上下文以方便一些如 COPY 指令的执行，这个 . 表示将当前工作区间作为 build 的上下文
docker build .
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="命令-容器相关" tabindex="-1"><a class="header-anchor" href="#命令-容器相关" aria-hidden="true">#</a> 命令-容器相关</h2><h3 id="run" tabindex="-1"><a class="header-anchor" href="#run" aria-hidden="true">#</a> run</h3><p>基于镜像，启动一个容器</p><p>每次 run 都会创建一个新容器，不手动删除，即使容器停止运行，仍旧存在，所以建议临时操作，带上 --rm 参数</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code># 简单例子，-it 将容器的输入输出重定向到终端， --rm，终端退出容器即销毁
docker run -it --rm alpine sh

# 参数帮助，启动容器时，可以进行各种配置，如端口映射，网络设置，数据卷设置等等
docker run --help
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="container" tabindex="-1"><a class="header-anchor" href="#container" aria-hidden="true">#</a> container</h3><p>对容器的各种操作，比如：停止、暂停、启动、重启、枚举、删除等</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code># 查看正在运行中的容器列表
docker container ls

# 查看所有容器列表
docker container ls -a

# 启动处于停止状态的容器
docker container start -ai [容器ID] sh

# 连接上处于运行中的容器
docker container exec -it [容器id] sh

# 查看后台运行中的容器产生的日志
docker container logs [容器id]

# 删除容器
docker container rm [容器id]

# 删除所有处于终止状态的容器
docker container prune

# 查看进程，容器其实就是进程
docker container ps

# 在宿主机和容器之间拷贝文件
docker container cp [原文件地址] [目标文件地址]
docker container cp ./test [容器id:/root/]   # 将本地文件拷贝到容器内

# 查看容器的详细信息
docker container inspect [容器id]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面一些命令，其实可以省略 container，比如 docker ps 等等，用途一致，下面稍微罗列下操作容器的命令：</p><p><strong>exec</strong>： 连接上正在运行中的容器，通常可携带 -it 参数以及 sh 命令来登录容器，以便操作容器</p><p><strong>logs</strong>： 查看后台运行的容器所产生的日志，因为后台运行，日志不会输出到终端</p><p><strong>stop</strong>： 停止指定容器，通常是为了删除，先停后删</p><p><strong>prune</strong>：删除所有处于终止状态的容器，删通常是为了重建，不新建容器，一些配置的修改不会生效</p><p><strong>inspect</strong>： 查看容器的详细信息，比如端口映射、网络配置、数据卷配置等</p><h2 id="命令-数据卷相关" tabindex="-1"><a class="header-anchor" href="#命令-数据卷相关" aria-hidden="true">#</a> 命令-数据卷相关</h2><p>docker 容器的数据主要有两种方式，一种是数据卷，另一种是跟宿主机的磁盘映射（挂载主机目录）</p><p>docker run 启动的容器，默认都使用匿名数据卷，也就是这些数据只有本容器能够使用，其他容器用不了，容器一删，数据就没了</p><p>当在多容器间需要数据共享时，就可以先创建数据卷，然后这些容器共同使用</p><p>当容器需要和宿主机数据交互，可以跟宿舍机的磁盘做映射，多容器的共享也可以通过宿舍机做中转</p><h3 id="volume" tabindex="-1"><a class="header-anchor" href="#volume" aria-hidden="true">#</a> volume</h3><p>通过该命令对数据卷进行各种操作：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code># 查看所有数据卷
docker volume ls

# 查看指定数据卷的详细信息：名称、在宿主机的挂载点等
docker volume inspect [数据卷名]

# 创建数据卷
docker volume create [数据卷名]

# 删除数据卷
docker volume rm [数据卷名]

# 删除无主的数据卷
docker volume prune
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="命令-网络相关" tabindex="-1"><a class="header-anchor" href="#命令-网络相关" aria-hidden="true">#</a> 命令-网络相关</h2><p>网络的配置支持很多高级的配置：</p><ul><li>可以创建一个局域网，让多个容器间可以互相通信</li><li>可以做端口与宿主机映射，让外部环境可以与容器通信</li><li>等等</li></ul><h3 id="network" tabindex="-1"><a class="header-anchor" href="#network" aria-hidden="true">#</a> network</h3><p>用该命令来进行网络的各种操作：创建网络等</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code># 创建网络, -d 指定网络类型，有 bridge，overlay
docker network create -d bridge my-net

# 查看网络列表
docker network ls

# 删除 
docker network rm/prune
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将容器与网络的绑定，通常是在 run 启动容器时，以参数形式来进行配置，比如 -p 参数指定端口映射，--network 参数指定连接的网络</p><p>但更建议通过 docker-compose 来进行配置</p><h2 id="命令-其他" tabindex="-1"><a class="header-anchor" href="#命令-其他" aria-hidden="true">#</a> 命令-其他</h2><h3 id="system-df" tabindex="-1"><a class="header-anchor" href="#system-df" aria-hidden="true">#</a> system df</h3><p>查看镜像、容器、数据卷占用的空间</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>docker system df
# 输出
TYPE                TOTAL               ACTIVE              SIZE                RECLAIMABLE
Images              17                  5                   1.861GB             925MB (49%)
Containers          6                   6                   2.124MB             0B (0%)
Local Volumes       4                   2                   652.3MB             334.6MB (51%)
Build Cache         0                   0                   0B                  0B
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,47);function h(p,g){const i=s("ExternalLinkIcon");return r(),l("div",null,[u,o,e("ul",null,[e("li",null,[e("a",t,[n("官方文档"),d(i)])]),e("li",null,[e("a",m,[n("操作容器|数据管理|使用网络|等等"),d(i)])])]),b])}const f=a(v,[["render",h],["__file","docker命令.html.vue"]]);export{f as default};
