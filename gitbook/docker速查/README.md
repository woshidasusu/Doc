# docker

参考资料：

- [官方文档](https://docs.docker.com/compose/reference/overview/)
- [Docker - 从入门到实践](https://yeasy.gitbooks.io/docker_practice/content/)

## 基本概念  

- **镜像**：存于 docker 仓库里的基础镜像，相当于一个文件系统，比如 nginx，alpine（最轻量级 linux 系统）  
- **容器**：基于镜像，通过 docker 命令启动的叫容器，可以通俗理解成一个独立虚拟机，各个容器都是独立的环境  
- **服务**：服务是 docker-compose 里的概念，用于方便管理容器  
- **Dockerfile**：用于定制镜像的脚本文件  
- **docker-compose.yml**：用于管理启动多个容器的配置文件

## Dockerfile

Dockerfile 文件是用于定制镜像使用的脚本文件  

简单说，我们可以基于某个基础的镜像，修改镜像的某些内容  

再或者说，镜像其实也就是个文件系统，我们可以往这个系统里预先丢一些文件进去，或者设置一些环境变量等等，这样来定制化制作一个符合我们需求的镜像  

这些操作，原本是可以通过在基础镜像上启动一个容器，然后进入该容器后，就类似于 ssh 一个服务器，接下去就可以做一些类似新服务器的基础搭建、如设置环境变量，预置一些文件等等  

这之后如果还有需求搭建一个新的服务器，具有相同的配置，这就是定制化镜像的优点所在

所以，本质上，新的镜像其实是由基础镜像和容器的存储层构成  

## docker 命令


## docker-compose.yml

## docker-compose 命令