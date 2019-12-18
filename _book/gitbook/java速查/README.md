# java

java 后端（spring-boot）项目，部署常用命令：

## jar

```shell
# jar命令格式
jar {ctxuf} 文件名
```

其中，{ctxu} 是个参数必选其一，表示此次 jar 命令要处理的事情，其余为可选参数，通常都会携带 -vf 参数，输出此次命令的报告，且可指定操作的文件

**-c**： 创建一个 jar 包

**-t**： 显示 jar 中内容列表

**-x**： 解压 jar 包

**-u**： 添加文件到 jar 包中

**-f**： 指定 jar 包的文件名

**-v**： 生成详情报告，并输出至标准设备

### 解压 jar 包

```shell
# 解压 jar 包内容至当前目录
jar xvf xxx.jar
```

### 打包 jar 包

```shell
# 将当前目录下的文件，打包进 jar 包
jar cvf xxx.jar ./
```

### 添加文件至 jar 包

```shell
# 将application.yml文件添加进 jar 包，外部文件的目录层级需与 jar 包内一致
jar uf xxx.jar BOOT-INF/classes/application.yml
```

### 提取 jar 包中的文件

```shell
# jar 命令只能全部解压，想要只解压某个文件，可用 unzip 命令
unzip -j xxx.jar BOOT-INF/classes/application.yml

# unzip 命令也可用来解压 jar 包，有 -d 参数时指定解压的目录
unzip xxx.jar -d xxx
```

## nohup

nohup 是 linux 命令，后端 jar 包的运行，通常可用 nohup 命令来执行

nohup 开始，& 结尾，表示后台运行该命令，否则就会在前台运行

### jar 包运行

```shell
# 后台运行jar包
nohup java -jar xxx.jar & 
```

### 输出重定向

当用 & 设置后台运行时，此时日志就不会再前台输出，如果想看日志，可以利用输出重定向

操作系统中有三个常用的流：

- 0：标准输入流 stdin
- 1：标准输出流 stdout
- 2：标准错误流 stderr

一般当我们用 `> console.txt`，实际是 `1>console.txt` 的省略用法；

`< console.txt` ，实际是 `0 < console.txt` 的省略用法。

```shell
# 日志写入 xxx.log 文件，同时执行 tail -f 将日志输出到前台终端
nohup java -jar xxx.jar >> xxx.log 2>&1 & tail -f xxx.log
```

`>> xxx.log` 表示将执行日志以追加的方式写入 xxx.log 文件

`2>&1` 表示将标准错误流重定向到标准输出流

### 查看 jar 程序运作状况

```shell
# grep 可根据关键字过滤程序,a:显示所有程序 u:以用户为主的格式来显示 x:显示所有程序，不以终端机来区分
ps aux | grep java
```

### 杀死 jar 程序进程

grep 过滤的结果，最后一条记录总会是 grep 本身的进程，可用 `grep -v gerp` 过滤掉，再结合 awk 提取进程号，就可直接用 kill 杀掉

```shell
kill -9 `ps aux|grep 'xxx'|grep -v grep|awk '{print $2}'`      
```

