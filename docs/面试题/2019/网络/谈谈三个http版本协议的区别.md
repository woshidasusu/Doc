# 题目：[介绍下 http 1.0 1.1 2.0 协议的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/232)

### http 1.0

- 无状态：服务器不跟踪不记录请求过的状态
- 无连接：每次请求都需要建立 tcp 连接

### http 1.1

- 默认开启长连接：keep-alive，一个 TCP 连接就允许多个 HTTP 请求复用，但一个时刻，只能处理一个请求，且 Chrome 规定，同个域名下，只允许同时建立 6 个 TCP 持久连接，也就是说，同一个时刻最多只能同时发送 6 个 HTTP 请求，其余均需要排队等待
- 增强缓存处理：If-Match 等等
- 新增断点续传：Range，Content-Range

缺点：

- 由于无状态特性，导致 header 部分数据经常很大，因为 Cookie 需要传送一堆内容，但 header 又是不支持压缩，耗费网络资源
- 延迟大，由于不能并行发送 HTTP 请求，造成队头阻塞情况存在，即正在请求中的资源卡住会严重影响后续资源下载
- 明文传输，不安全

### http 2.0

- 二进制传输：不再传输文本数据，而是传输二进制数据
- 多路复用：同个域名只需一个 TCP 连接，并行发送多个请求和响应
- 头部压缩：双端共同维护头部列表，发送时采用哈夫曼编码压缩
- 服务器推送：Server Push，服务端主动把资源推送给浏览器

优点：

解决了 HTTP1.1 的问题，不安全的明文传输改用二进制传输，虽然也是明文，但二进制至少经过编码

header 过大且占用网络资源问题，通过头部压缩解决

延迟大的问题，通过多路复用使得任意请求都允许并行发送

缺点：

由于依赖于 TCP 协议，所以受限于 TCP 一些行为导致的问题，比如

需要三次握手建立连接的延迟，如果使用了 HTTPS，还需要 TLS 的握手过程

TCP 由于丢包重传机制，会导致丢失包的后续包都必须等待重新接受到丢失包后，才能使用