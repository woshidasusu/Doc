# Dockerfile

参考资料：  
- [官方文档](https://docs.docker.com/engine/reference/builder/)
- [Dockerfile 指令详解](https://yeasy.gitbooks.io/docker_practice/content/image/dockerfile/)  

Dockerfile 是用来定制构建镜像，每一行命令就会创建一层容器存储层，有些命令可以写成一行命令就不要分开多行写

最后可以通过 `docker build .` 来进行基于这份文件构建镜像，但建议结合 docker-compose 使用，就不用自己执行 build 命令了

## 示例

```dockerfile
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

## 指令

### FROM

指定基础镜像，在基础镜像上做定制

基础镜像可以是官方提供的最基础的镜像，也可以是自己或三方已经定制化过的镜像

[比如：nginx，jenkins，postgres，alpine（轻型 linux）](https://yeasy.gitbooks.io/docker_practice/content/image/build.html#from-指定基础镜像)

### COPY

将宿主机内的文件拷贝进镜像内

比如：

```dockerfile
COPY hom* /mydir/
```

### EXPOSE

声明容器提供的服务端口

注意，只是容器对外的端口，并不是宿主机对外的端口，如果需要，可以在启动时，配置宿主机和容器的端口映射

### RUN

执行命令行命令，当有多个命令需要执行时，可借助 `\ &&` 来拼成一条命令，避免使用多个 RUN，因为每一行命令都会创建一层存储层，层次是有限制的

[比如](https://yeasy.gitbooks.io/docker_practice/content/image/build.html#run-执行命令)：

```dockerfile
RUN echo 'hello' \
    && echo 'docker' \
```