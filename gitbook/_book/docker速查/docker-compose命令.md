# docker-compose 命令

参考资料：  
- [官方文档](https://docs.docker.com/compose/compose-file/)
- [Docker Compose 命令说明](https://yeasy.gitbooks.io/docker_practice/content/compose/commands.html)  

docker-compose 命令是用来操作 docker-compose.yml 创建的各服务

而服务是 docker-compose 里的概念，docker 只有镜像和容器的概念，所以这里的服务，其实就类似于容器，命令基本也都跟 docker container 一致，用途也差不多

## 命令

### up

这是最重要命令，它是一键式命令，通过它，将尝试自动构建镜像、创建容器、启动容器、进行各种容器配置

等于说，我只要执行这个命令，docker-compose.yml 里所有的容器就都会从构建到运行全部都完成，我 docker 跑的各容器环境就好了

```shell
# 一键创建、启动后台运行的容器, -d 表示后台运行
docker-compose up -d 
```

首次搭建可以执行这个命令，但后续如果只是修改了某些个别容器的配置，一般就需要带一些参数来执行了，不然这个命令默认会重新创建已经存在且运行中的容器

```shell
# 重新创建指定的服务容器，其他服务容器不受影响
docker-compose up -d --force-recreate [服务名]

# 启动处于终止状态的服务容器，不存在的容器会进行创建，处于运行中的不受影响
docker-compose up -d --no-recreate
```

虽然还有很多其他参数，但目前我这两种就够用了

注意，当修改了 docker-compose.yml 里某个服务的配置，需要让这个服务容器重新构建，配置才能生效，如果只是 stop 再启动，那容器还是原先那个

如果修改了服务容器的镜像 Dockerfile 文件，那需要让镜像重新构建，虽然也可以用参数，但我习惯用其他命令

### config

检查 docker-compose.yml 文件是否合法，修改完后，最好执行这个命令检查看看

```shell
# 检查 docker-compose.yml 是否合法，合法则输出配置内容
docker-compose config
```

### build

构建指定的服务容器依赖的镜像，即使该镜像已经存在，一般当 Dockerfile 文件修改过时需要执行

```shell
docker-compose build [服务名]
```

### down

停止 up 命令启动的所有容器，并移出网络，慎用

### images

列出 docker-compose.yml 文件中所有的镜像，是 docker images 的子集

```shell
docker-compose images
```

### logs

查看容器的输出，跟 docker logs 的区别在于，这里会以颜色来区分不同的服务

```shell
docker-compose logs [服务名]
```

### ps

列出 docker-compose 管理的所有容器进程，是 docker ps 的自己

```shell
docker-compose ps
```

### top

查看各个服务容器内运行的进程，ps 是查看宿主机，top 是查看容器内

```shell
docker-compose top
```

### stop

停止处于运行中的服务容器

```shell
docker-compose stop [服务名]
```

### rm

删除停止状态的服务容器

```shell
docker-compose rm [服务名]
```

