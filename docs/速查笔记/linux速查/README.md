# linux

## 查找

### find

```shell
# / 从根目录下开始搜索， -i：忽略大小写 -name：按名称搜索
find / -iname xxxx  
```

### whereis

```shell
# 快速查找某个文件
whereis nginx
```

### df -h
```shell
# 查看磁盘使用情况
df -h
```

## 权限

### chown

修改文件属主

```shell
# -R：递归处理目录下所有目录文件
chown [-R] user:group file
```

### chmod

修改文件权限，文件权限分三级：属主、群组、其他（user|group|other）

```shell
ls -all
-rw-r--r-- 1 root root    2 Nov 23 13:20 3
drwxr-xr-x 2 root root 4096 Nov 23 17:41 test
```

第一个：d 表示文件夹，- 表示文件

其余三个一组，分别表示 user，group，other 对该文件的权限，r（读），w（写），x（可执行）

- 修改文件权限

```shell
# 7 的二进制：111，所以 777 表示将该文件的设置成所有用户都有全部权限
chmod 777 file
```

### su 或 su -

**su [user]**： 切换到指定用户，默认切到 root 用户，切换过去时，保留当前工作空间

**su - [user]**： 用途跟上面一致，区别在于，切换的时候，当前工作空间也切换到用户的工作空间

```shell
su www -c "whoami;pwd"
# 输出 www  /root

su - www -c "whoami;pwd"
# 输出 www /home/www
```

注意：spring-boot 后端项目如果有配置抽离，那么运行后端项目时，一定不能使用 `su - user -c "nohup ...."`，这是因为，这条命令会让 nohup 执行时的当前工作空间切换到用户空间，导致 spring-boot 在当前目录下找不到 config 里的配置文件从而运行错误

## 文件

文件内容编辑、查看等命令

### vi,vim

通过 vi 命令编辑文本内容，vi 常用命令：[vim 命令速查](../vim速查)

### cat

将文本内容全部输出，可结合 grep 命令进行过滤，文本内容不多时，或需要查找部分内容时常用

### tail

常用来实时查看日志

- 实时查看日志，日志文件有新内容立即输出到终端

```shell
tail -f xxx.log
```

- 查看最后 n 行内容

```shell
# 查看最后 20 行内容
tail -n 20 xxx.log

# 查看第 20 行开始到结束的内容
tail -n -20 xxx.log
```

###less 

常用来浏览文件，打开文件后，通过一些快捷键命令来进行交互

```shell
less [参数] 文件
```

常用参数：

**-N**：显示行号

**-x <数字>**：将 tab 键替换成指定空格显示

快捷键命令：

**/字符串**：向下搜索字符串

**?字符串**：向上搜索字符串

**n**：重复前一个搜索（与 / 或 ? 合用）

**N**：反向重复前一个搜索（与 / 或 ? 合用）

**方向键**：上下左右

**空格|pgDown**：向下翻一页

**pgUp**：向上翻一页

**回车**：向下滚动一行

**y**：向上滚动一行

**F**：效果类似 tail -f 监听文件输入，ctrl+C 停止

**q**：离开

## 服务器交互

服务器的连接、登录、文件上传下载等命令，更详细内容查看：[shell常用命令](http://blog.dasu.fun/2019/11/23/shell脚本/shell常用命令/)

### ssh

连接服务器， -p 参数指定端口号

```shell
ssh -p 22 root@ip
# 输密码
```

### sz,rz

本机通过 XShell 终端连接服务器时，可通过 sz，rz 进行文件的上传下载

```shell
# 上传文件到服务器
rz  # 会弹出文件选择器弹框

# 将服务器上的文件下载到本机
sz xxx.file
```

### scp

若是在服务器之间需要进行文件交互，比如通过跳板机操作目标服务器时，可通过该命令

- 从本地复制到远程

```shell
# 将本地多个文件复制到远程 target 目录下，多个文件间以空格隔开
scp -P 5432 -p xxx.jar xxx1.jar root@ip:target

# 将本地文件 1.mp3 拷贝到远程服务器上的 001.mp3 文件里
scp /home/space/music/1.mp3 root@www.runoob.com:/home/root/others/music/001.mp3
```

**-p**：表示保留原文件修改时间、访问权限

**-P**：大写的P，表示指定端口号，scp 是基于 ssh，输入完同样需要输入密码

- 从远程拷贝到本地

```shell
# 将远程目录拷贝到当前目录下
scp -r root@192.16.1.108:/var/www/blog .
```

**-r**：表示递归复制整个目录内的文件目录

## nohup

[java 命令速查/nohup](../java速查/#nohup)

```shell
# 后台运行 spring-boot 后端项目
nohup java -jar xxx.jar &

# 查看当前后端项目进程
ps aux | grep java
```

## expect

[shell 常用命令/expect](http://blog.dasu.fun/2019/11/23/shell脚本/shell常用命令/)