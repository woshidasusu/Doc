# shell 常用命令

### expect

expect 命令是用来实现自动化交互通信的，比如当你在脚本中通过某些命令登录、连接、上传、下载等和远程服务器的交互时，可能需要让你输入一些账号、密码等信息

如果这个过程是人工手动在终端执行的，那没啥问题，需要交互时，你手动输入即可

但如果这个过程是交由脚本来自动执行的，难不成每次脚本执行时，还需要你在旁边等着来输密码吗？

所以，就可以借助 expect 来实现这个交互过程

可以先用 `whereis` 命令查找看看，是否支持 expect 命令，否则需要自行安装

```shell
whereis expect
# expect: /usr/bin/expect /usr/share/man/man1/expect.1.gz
```

#### 安装

```shell
# Centos 系统的安装，其余的自行查阅
#先下载 tcl，expect 依赖 tcl
yum -y install tcl

#再下载 tcl
yum -y install expect

#安装完执行 expect，查看是否安装成功，失败原因请自行查阅
[root@VM_0_15_centos test]# expect
expect1.1> 
```

#### 基本命令

- **spawn**：用于启动一个子进程来执行后续命令

- **expect eof**：用来退出 spawn 启动的子进程，返回到当前进程环境，与 spawn 成对出现

- **expect**：用于接收进程的输出信息（输出重定向到 expect），如果接收的字符串与期待的不匹配，则一直阻塞，直到匹配上或者超过才继续往下执行

- **send**：用于向进程发送输入信息（输入重定向到 send），通常需要以 `\n` 结尾

- **set timeout 1**：用于设置 expect 命令的超时时间，单位 s，输入 -1 时表示无限长，默认为 10s

- **[lindex $argv n]**：用于获取传入给脚本的参数，n 表示第几个参数，下标从 0 开始

- **set key value**：用于设置变量，通常在脚本文件开头结合上面获取参数使用，来给参数赋值个有意义的变量，如 `set ip [lindex $argv 0]`

- **exp_continue**：用于 expect 中需要复用匹配

- **send_user**：用于打印输出，相当于 echo

- **interact**：结束自动化交互，转入人工交互，如果脚本是纯自动化场景，那么不应该有这条命令，脚本执行结束则退出。如果是半自动化场景，如自动输入账号密码，连接登录操作，登录之后交由人工交互，那可以使用该命令

  expect 命令后面可跟随字符串或对象，如：

```shell
expect "password"
send "xxx"

# 或者

expect {
  "yes" {
  	send "yes\n"
  	exp_continue
  }
  "password" {
  	send "xxx"
  	expect "xxx"
  	send "xxx"
  }
}
```

#### 使用

```shell
#!/usr/bin/expect
# 使用 expect 结合 ssh 登录远程服务器

# 将传给脚本的参数赋值给变量
set sshPort [lindex $argv 0]
set user [lindex $argv 1]
set ip [lindex $argv 2]
set password [lindex $argv 3]

# spawn 命令新启子进程，执行后面的命令
spawn ssh -p $sshPort $user@$ip
expect "password"
send "$password\n"
expect eof
exit 0
```

在当前 shell 里执行:

```shell
/usr/bin/expect login.sh "22" "root" "127.0.0.1" "xxxxx"
```

其实，个人觉得，expect 就是利用了 shell 的输入输出重定向，原先在终端里人工进行交互时，由人工手动将命令输入给终端，命令执行结果输出到终端给用户反馈

而 expect 则是将输入由传统的人工输入给终端重定向到由 send 命令输入，也就是输入信息从 send 读取，而命令执行结果也不是输出给终端，而是输出给 expect 命令，这样一来，就可以实现由脚本来自动化处理交互，毕竟输入输出脚本都可以拿到了

以上，个人理解

### ssh

远程连接工具，用来登录远程服务器

通常来说，借助 XShell 的可视化配置，就足够连接上服务器了，但有些服务器，只能通过跳板机连接，此时就需要先登录上跳板机，然后再跳板机上使用 ssh 命令来连接服务器

当然，XShell 也可以通过 ssh 来连接登录服务器，你不用图形界面的操作也行

#### 使用

```shell
ssh -p 22 root@ip
```

很简单，指定端口，登录用户，ip 地址就可以了，然后再手动输入密码

如果不想每次登录都输入密码，那么需要配置 ssh 私钥、公钥，将公钥放置在服务器上

- `  netstat -lntup | grep ssh`

远程服务器上查看 ssh 端口号，默认是 22

- ` service sshd reload  `

重启 ssh 服务，因为可能需要改配置文件，如修改默认 22 端口

### scp

scp 命令用于 Linux 之间复制文件和目录，也就是直接跟远程服务器进行文件或目录的拷贝

跟 cp 很类似，区别在于一个仅在本机间拷贝，一个是多机子间的拷贝

#### 语法

```shell
usage: scp [-12346BCpqrv] [-c cipher] [-F ssh_config] [-i identity_file]
           [-l limit] [-o ssh_option] [-P port] [-S program]
           [[user@]host1:]file1 ... [[user@]host2:]file2
           
# 简易写法

scp [可选参数] file_source file_target
```

比较重要的也就是最后的 [[user@]host]file，可以指定连接远程的用户，ip，不指定时，将在命令执行时，手动输入

#### 常用参数说明

- -p：保留原文件的修改时间，访问时间和访问权限。

- -r： 递归复制整个目录。
- -v：详细方式显示输出。scp和ssh(1)会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。
- -P：注意是大写的P, port是指定数据传输用到的端口号

#### 实例

- 从本地复制到远程

```shell
# 将本地多个文件复制到远程 target 目录下，多个文件间以空格隔开
scp -P 5432 -p xxx.jar xxx1.jar root@ip:target

# 将本地文件 1.mp3 拷贝到远程服务器上的 001.mp3 文件里
scp /home/space/music/1.mp3 root@www.runoob.com:/home/root/others/music/001.mp3 
```

- 从远程拷贝到本地

```shell
# 将远程目录拷贝到当前目录下
scp -r root@192.16.1.108:/var/www/blog . 
```

当没有指定用户名时，命令输入完毕需要手动输入用户名和密码，指定了用户名后，需要输入密码

密码的输入可以借助 expect 来实现自动交互

当然，也可以通过 -B，以及其他参数来指定 ssh 连接的配置文件，实现无密码方式拷贝，相关信息，自行查阅

### sz, rz

如果是借助 XShell 工具连接上远程服务器后，那么可借助 sz, rz 命令来下载和上传文件

但如果远程服务器没有这两个命令的话，需要先进行安装：

#### 安装

```shell
# CentOs 安装
yum -y install lrzsz

# Ubuntu 安装
sudo apt-get install lrzsz
```

#### 使用

```shell
sz xxx.file
rz
```

下载文件的话，需要指定下载哪个文件，上传则不用，因为会打开文件选择弹框，选中即可

### sftp

也是一个用来跟远程服务器上的文件进行下载、上传的命令

sz,rz 通常是本机上装了个 XShell 工具，然后用于两机之间的文件通信

但有时候，是需要在远程多个服务器之间进行文件通信，这时候就用不了 XShell，也就用不了 sz, rz 命令了

这种场景，可以使用 scp 命令，也可以使用 sftp 命令

#### 使用

```shell
# 先连接,端口跟 ssh 一致
sftp -P 22 root@ip

# help 命令,可以查看 sftp 支持的命令，比如 ls,lls,cd,lcd...
help

# 所有命令前加 l，表示针对本机的操作，不加 l 表示针对远程服务器的操作
# 本机进入 tmp 目录
lcd /tmp/

# 下载远程文件到当前目录下
get /usr/local/xxx.file

# 上传当前目录下的文件到远程指定目录下
put xxx.file /usr/local/
```

有一点需要注意，如果本机是 window 系统，那么在 window 系统和 linux 系统之间是有 sftp 传输文件时，由于文件系统的分隔符不一样，在操作 lcd 命令时，可能会有问题，此时，可以直接输入 lcd，然后会弹窗文件选择框，选中路径后按确定即可，比较方便

### tail

通常用来实时查看日志文件：

```shell
tail -f xxx.log
```

这样，只要有新日志写入，会马上在终端上输出，就可以不用每次都把文件下载下来了


### 实例-jenkins 构建 spring-boot 项目并部署远程服务器上

场景是这样的，本地开发后端 spring-boot 项目，然后有一台专门的 jenkins 服务器，自动或手动触发构建

jenkins 构建时，会自动去拉取代码，然后执行 package.sh 打包脚本，生成 jar 包

再然后，执行 deploy.sh 脚本，将 jar 发送到另一台项目运行的服务器上，先停止旧项目的执行，然后移除旧 jar 包，执行新 jar 包，启动后端项目

#### package.sh

打包脚本

```shell
#!/bin/sh

# 打包的渠道由外部传入
environment=$1
basedir=`pwd`
# 先将旧的打包文件删除， -d 表示判断 target 是否是目录
if [ -d "target" ]; then
	rm -rf $basedir/target
fi

mkdir target

# 定义 mvn 打包的函数
package()
{	
	# mvn packgae打包
	(mvn clean packge -P $environment)
	# 如果 mvn 命令执行异常，将会返回非0，终止脚本，异常退出
	if [ $? -ne 0 ]; then
		exit 1
	fi
}

# 进入项目根目录，执行打包工作
cd $basedir/app
package


exit 0
```

#### deploy.sh

部署脚本

```shell
#!/usr/bin/expect

# 将传给脚本的参数赋值给变量
set ip [lindex $argv 0]
set port [lindex $argv 1]
set user [lindex $argv 2]
set password [lindex $argv 3]
set targetDir [lindex $argv 4]

# 先另起进程，用 scp 命令，将打包好的 jar 包发送到项目运行的服务器上
spawn scp -P $port target/xxx.jar $user@$ip:$targetDir

# 用 expect 解决 scp 需要输入命令的交互，实现自动化
expect {
	"yes/no" {
		send "yes\n"
		exp_continue
	}
	"password" {
		send "$password\n"
	}
}
# jar 发送完毕就退出子进程，返回主进程，继续处理往下命令
expect eof

# 另起进程执行 ssh 连接项目运行的服务器
spawn ssh -p $port -o "StrictHostKeyChecking no" $user@$ip

# 用 expect 解决 ssh 需要输入命令的交互，实现自动化
expect {
	"password" {
		send "$password\n"
	}
}

# 登录成功，则发送需要在远程服务器上执行的命令
expect "login"

# 包括，停止旧项目，执行新项目
send "

# 进入 jar 包存放目录
cd xxx
# 停止运行
kill -9 `ps aux|grep 'xxx.jar'|grep -v grep|awk '{print $2}'`  
# 备份
cp xxx.jar xxx.jar.bak
# 移新包
mv $targetDir/xxx.jar xxx
# 启动项目
su - www -c "nohup java -jar xxx.jar &"

sleep 10s
exit 0
"
expect eof
exit 0
```

#### jenkins - 构建 shell

jenkins 配置里的构建 shell 命令

```shell
#!/bin/sh
source /etc/profile
# 先执行打包脚本，指定打包的渠道
sh jenkins/package.sh online

# 如果打包失败，终止
if [ $? -ne 0 ]; then
   exit 1
fi

# 执行部署脚本，指定项目运行的服务器的连接端口号，ip，登录用户，密码，移包路径
/usr/bin/expect jenkins/deploy.sh "127.0.0.1" "22" "root" "xxxx" "/temp/"
```