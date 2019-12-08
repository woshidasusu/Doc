# 云服务器

## dockers

云服务上，通过 docker 跑的服务：

- [个人博客站： http://blog.dasu.fun](http://blog.dasu.fun)
- [gitbook速查笔记： http://gitbook.dasu.fun](http://gitbook.dasu.fun)
- [个人网盘： http://nextcloud.dasu.fun](http://nextcloud.dasu.fun)
- [jenkins： http://jenkins.dasu.fun](http://jenkins.dasu.fun)

## hexo

- 生成静态博客网页

```shell
hexo generate
```

- 发布到 github

```shell
hexo deploy
```

- 本地运行

```shell
hexo server
```

## gitbook

安装教程：[GitBook 使用教程](https://www.jianshu.com/p/421cc442f06c)

- 生成静态网页

```shell
gitbook build
```

- 本地调试

```shell
gitbook serve
```

- 3.2.3 版本 bug

> Error: ENOENT: no such file or directory, stat 'xxx\fontsettings.js'  

解决方案：[GitBook运行报错](https://blog.csdn.net/prufeng/article/details/83301895)  
> 1. 用户目录下找到以下文件:  
> user\\.gitbook\versions\3.2.3\lib\output\website\copyPluginAssets.js
>
> 2. Replace all  
> confirm: true => confirm: false

