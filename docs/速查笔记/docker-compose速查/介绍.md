# docker-compose

当准备好镜像之后，镜像是死的，需要通过 docker run 命令来启动一个容器，这两者关系有些类似于编程语言中的类和实例

而 run 命令启动一个容器时，是可以携带各种各样的参数，比如设置端口映射，设置网络、设计磁盘映射等等

当这些配置项过于复杂时，维护就会很麻烦，所以，为了提高效率，衍生出了 docker-compose

而 docker-compose.yml 则是用来维护 run 启动个容器时，所需要的各种各样配置参数、环境等

这样一来，就不用每次启动容器时，自己输入一堆配置参数了，把这些都维护在 docker-compose.yml 文件中，通过 docker-compose 命令来操作，docker-compse 就会自动去启动容器了

简单的说，docker-compose 就是对 docker 命令进行了一层封装

本来我们可能需要自己用 docker 命令去拉镜像、创建数据卷、网络、设置环境变量等等，然后再手动启动容器，输入一堆配置参数

现在有了 docker-compose，就可以把这一系列操作维护在 docker-compose.yml 文件中，一句 docker-compose 命令就可以让 docker-compose 为我们将这些工作全部处理掉，方便、高效

docker-compose.yml 里的每一项配置语法都对应着 docker 的某个命令、某个参数，只要对 docker 命令熟悉，掌握 docker-compose.yml 是很快的

- Dockerfile 和 docker-compose.yml 区别

注意，Dockerfile 是用来构建镜像，经过 build 之后，得到的只是一个死的镜像

docker-compose.yml 则是用来管理容器，经过 up 之后，得到的是一些正在运行中的容器

两者针对的对象和场景都不一样，但后者可以依赖前者，两个一起使用，来构建 docker 容器，会特别方便

