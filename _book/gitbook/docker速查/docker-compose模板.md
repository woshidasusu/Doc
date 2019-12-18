# docker-compose.yml 模板

参考资料：  
- [官方文档](https://docs.docker.com/compose/compose-file/)
- [Docker Compose 模板文件](https://yeasy.gitbooks.io/docker_practice/content/compose/compose_file.html)  

docker-compose.yml 是用来管理配置多容器，每一项指令都可以在 docker 命令中找到同样的用途，更多的是与 docker run 命令的参数进行对应

简单说，docker-compose 其实就是将 docker 命令的操作进行了一层封装，然后以更简洁的命令提供给我们使用，让我们可以不用再自行去执行各种 docker 命令操作

.yml 是一种配置文件，以缩进来决定配置项，所以缩进不能随便搞，同层缩进属于同层配置，内层缩进属于子配置项

## 示例

下面是我服务器上的配置，用到的指令不多，官网有份示例，里面用到的比较多，后续等有接触，再扩展

```yaml
version: '3'

services:
  blog:
    build: ./blog/
    ports:
      - "9000:80"
    restart: always
    volumes:
      - /usr/local/etc/github/woshidasusu.github.io/:/usr/share/nginx/html/:ro
    networks:
      n_nginx:
        ipv4_address: 192.168.5.105
  gitbook:
    build: ./gitbook/
    ports:
      - "9002:80"
    restart: always
    volumes:
      - /usr/local/etc/github/Doc/gitbook/_book/:/usr/share/nginx/html/:ro
    networks:
      n_nginx:
        ipv4_address: 192.168.5.106
  jenkins:
    build: ./jenkins/
    ports:
      - "9001:8080"
      - "50000:50000"
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
      - "80:80"
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
      - "5432"
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
```

## 模板指令

### version

docker-compose.yml 配置文件的首行，表示该使用哪个版本的 docker-compose，不同版本都有对 docker 版本的最低支持要求，可在官网查看

目前（2019）通常使用 3.0 版本就够了

### services

docker-compose 里面是服务的概念，管理的每个容器对应着一个服务，都配置在 services 内，服务名自己随意取

每一个容器的配置项，基本包括设置容器基于的镜像，端口映射，数据卷使用，磁盘映射，网络设置，这就是我目前所接触的

``` shell
services
  # 服务名
  jenkins:
    build: ./jenkins/ # 使用 jenkins 目录下的 Dockerfile 进行构建镜像
    ports:  # 端口映射，宿主机:容器
      - "9001:8080"
      - "50000:50000"
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
```

### networks

创建网络

```shell
networks: # 相当于 docker network create
  n_nginx: # 网络名
    driver: bridge # 使用的网络类型
    ipam:
      config: 
        - subnet: 192.168.5.0/24  # 配置子网
```

### volumes

创建数据卷

```shell
volumes: # 相当于 docker volume create
  nextcloud:
```