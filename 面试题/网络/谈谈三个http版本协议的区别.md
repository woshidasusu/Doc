# 题目：[介绍下 http 1.0 1.1 2.0 协议的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/232)

### http 1.0

- 无状态：服务器不跟踪不记录请求过的状态
- 无连接：每次请求都需要建立 tcp 连接

### http 1.1

- 默认开启长连接：keep-alive
- 增强缓存处理：If-Match 等等
- 新增断点续传：Range，Content-Range

### http 2.0

- 二进制协议：不再传输文本数据，而是传输二进制数据
- 多路复用
- 头部压缩：双端共同维护常见请求头列表
- 服务器推送