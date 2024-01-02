# doc

博客、笔记、面试题等日常积累资源

## 环境准备

```bash
node -v
# v18.17.0

npm install -g pnpm
pnpm -v
# 8.12.1
```

## 构建

1. `pnpm install`
2. `pnpm run build`

## 菜单更新

1. `pnpm run menu`
2. 编辑 docs/.vuepress/configs/navbar/index.js
3. 重新构建

## 一些依赖库说明

- `anywhere` 是一个简单的静态文件服务器，用于在本地快速启动一个 Web 服务器并提供静态文件的访问。
- `sort-package-json` 是一个用于对 package.json 文件进行排序的 Node.js 模块。它可以帮助你规范化和优化 package.json 文件的结构，使其更易读和维护。
- `rimraf` 是一个用于删除文件和目录的 Node.js 模块。它提供了一个简单而强大的方法来递归地删除文件和目录，可以跨平台使用。
