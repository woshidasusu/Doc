import{_ as d,r as l,o as r,c as a,a as e,b as n,e as s,d as v}from"./app-XVH6qKTA.js";const c={},o=e("h1",{id:"docker-compose-yml-模板",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#docker-compose-yml-模板","aria-hidden":"true"},"#"),n(" docker-compose.yml 模板")],-1),u=e("p",null,"参考资料：",-1),m={href:"https://docs.docker.com/compose/compose-file/",target:"_blank",rel:"noopener noreferrer"},t={href:"https://yeasy.gitbooks.io/docker_practice/content/compose/compose_file.html",target:"_blank",rel:"noopener noreferrer"},b=v(`<p>docker-compose.yml 是用来管理配置多容器，每一项指令都可以在 docker 命令中找到同样的用途，更多的是与 docker run 命令的参数进行对应</p><p>简单说，docker-compose 其实就是将 docker 命令的操作进行了一层封装，然后以更简洁的命令提供给我们使用，让我们可以不用再自行去执行各种 docker 命令操作</p><p>.yml 是一种配置文件，以缩进来决定配置项，所以缩进不能随便搞，同层缩进属于同层配置，内层缩进属于子配置项</p><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h2><p>下面是我服务器上的配置，用到的指令不多，官网有份示例，里面用到的比较多，后续等有接触，再扩展</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>version: &#39;3&#39;

services:
  blog:
    build: ./blog/
    ports:
      - &quot;9000:80&quot;
    restart: always
    volumes:
      - /usr/local/etc/github/woshidasusu.github.io/:/usr/share/nginx/html/:ro
    networks:
      n_nginx:
        ipv4_address: 192.168.5.105
  gitbook:
    build: ./gitbook/
    ports:
      - &quot;9002:80&quot;
    restart: always
    volumes:
      - /usr/local/etc/github/Doc/gitbook/_book/:/usr/share/nginx/html/:ro
    networks:
      n_nginx:
        ipv4_address: 192.168.5.106
  jenkins:
    build: ./jenkins/
    ports:
      - &quot;9001:8080&quot;
      - &quot;50000:50000&quot;
    user: root
    restart: always
    volumes:
      - /usr/local/etc/github/woshidasusu.github.io/:/var/jenkins_home/blog/codes/
      - /usr/local/etc/github/Doc/:/var/jenkins_home/gitbook/codes/
      - /root/.ssh/:/root/.ssh/:ro
      - /etc/localtime:/etc/localtime:ro
    networks:
      n_nginx:
        ipv4_address: 192.168.5.104
  nginx:
    build: ./nginx/
    ports:
      - &quot;80:80&quot;
    restart: always
    networks:
      n_nginx:
        ipv4_address: 192.168.5.103
  db:
    image: postgres
    environment:
      - POSTGRES_PASSWORD=xxx
      - POSTGRES_USER=xxx
    volumes:
      - /usr/local/etc/postgres/data:/var/lib/postgresql/data
    expose:
      - &quot;5432&quot;
    networks:
      n_nginx:
        ipv4_address: 192.168.5.107
  nextcloud:
    image: nextcloud
    ports:
      - 9003:80
    volumes:
      - nextcloud:/var/www/html
    networks:
      n_nginx:
        ipv4_address: 192.168.5.108  

networks:
  n_nginx:
    driver: bridge
    ipam:
      config:
        - subnet: 192.168.5.0/24  ## 宿主机一般会是该网段的 .1，所以不要设置网段为1 i

volumes:
  nextcloud:
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="模板指令" tabindex="-1"><a class="header-anchor" href="#模板指令" aria-hidden="true">#</a> 模板指令</h2><h3 id="version" tabindex="-1"><a class="header-anchor" href="#version" aria-hidden="true">#</a> version</h3><p>docker-compose.yml 配置文件的首行，表示该使用哪个版本的 docker-compose，不同版本都有对 docker 版本的最低支持要求，可在官网查看</p><p>目前（2019）通常使用 3.0 版本就够了</p><h3 id="services" tabindex="-1"><a class="header-anchor" href="#services" aria-hidden="true">#</a> services</h3><p>docker-compose 里面是服务的概念，管理的每个容器对应着一个服务，都配置在 services 内，服务名自己随意取</p><p>每一个容器的配置项，基本包括设置容器基于的镜像，端口映射，数据卷使用，磁盘映射，网络设置，这就是我目前所接触的</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>services
  # 服务名
  jenkins:
    build: ./jenkins/ # 使用 jenkins 目录下的 Dockerfile 进行构建镜像
    ports:  # 端口映射，宿主机:容器
      - &quot;9001:8080&quot;
      - &quot;50000:50000&quot;
    user: root  # 以 root 用户连接容器
    restart: always  # 重启模式，always 挂断就重启
    volumes: # 与宿主机的映射
      - /usr/local/etc/github/woshidasusu.github.io/:/var/jenkins_home/blog/codes/
      - /usr/local/etc/github/Doc/:/var/jenkins_home/gitbook/codes/
      - /root/.ssh/:/root/.ssh/:ro
      - /etc/localtime:/etc/localtime:ro
    networks: # 网络设置
      n_nginx: # 加入 n_nginx 局域网
        ipv4_address: 192.168.5.104 # 设置固定 ip
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="networks" tabindex="-1"><a class="header-anchor" href="#networks" aria-hidden="true">#</a> networks</h3><p>创建网络</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>networks: # 相当于 docker network create
  n_nginx: # 网络名
    driver: bridge # 使用的网络类型
    ipam:
      config: 
        - subnet: 192.168.5.0/24  # 配置子网
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="volumes" tabindex="-1"><a class="header-anchor" href="#volumes" aria-hidden="true">#</a> volumes</h3><p>创建数据卷</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>volumes: # 相当于 docker volume create
  nextcloud:
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,20);function h(p,g){const i=l("ExternalLinkIcon");return r(),a("div",null,[o,u,e("ul",null,[e("li",null,[e("a",m,[n("官方文档"),s(i)])]),e("li",null,[e("a",t,[n("Docker Compose 模板文件"),s(i)])])]),b])}const _=d(c,[["render",h],["__file","docker-compose模板.html.vue"]]);export{_ as default};
