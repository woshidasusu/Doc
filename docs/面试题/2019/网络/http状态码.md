# 题目：http 状态码

### [常见状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

注：加黑表示常见错误码

#### 2XX：表示成功

- **200（OK）：** 请求成功

- 201（Created）： 请求已成功，并因此创建了一个新资源。通常是在 POST 请求之后返回的响应
- 202（Accepted）： 请求已经接受到，但还未响应，没有结果。
- 203（Non-Authoritative Information）： 非认证信息
- 204（No Content）： 没有内容
- 205（Reset Content）： 重置内容
- **206（Partial Content）：** 请求部分资源，断点续传时返回的状态码

#### 3XX：表示重定向

- 300（Multiple Choices）： 多路选择
- **301（Moved Permanently）：** 永久性重定向
- **302（Found）：** 临时性重定向
- 303（See Other）： 参加其他
- **304（Not Modified）：** 未修改，客户端可直接使用缓存 
- 305（Ues Proxy）： 使用代理

#### 4XX：表示客户端错误

- **400（Bad Request）：** 语义有误，或请求参数有误
- **401（Unauthorized）：** 未认证
- 402（Payment Required）： 需付费
- **403（Forbidden）：** 没有权限，被禁止
- **404（Not Found）：** 未找到资源，可能地址错误
- 405（Method Not Allowed）： 方法不允许
- 406（Not Acceptable）： 不接受
- 407（Proxy Authentication Required）： 需要代理认证
- 408（Request Time-out）： 请求超时
- 409（Conflict）： 请求资源发生冲突
- 410（Gone）： 失败
- 411（Length Required）： 需要长度
- 412（Precondition Failed）： 条件失败
- 413（Request Entity Too Large）： 请求实体太大
- 414（Request-URL Too Large）： 请求 URL 太长
- 415（Unsupported Media Type）： 不支持媒体类型
- 416（Requested range not satisfiable）： Range 字段指定有误
- 417（Expectation Failed）： Expect 字段指定内容无法被服务器满足
- 421（There are too many connections from your internet address）： 客户端 IP 地址到服务器的连接数超过可允许范围
- 422（Unprocessable Entity）： 请求格式正确，但含有错误语义
- 423（Locked）： 当前资源被锁定

#### 5XX：表示服务端错误

- **500（Internal Server Error）：** 服务器执行程序过程发生异常
- 501（Not Implemented）： 未实现
- 502（Bad Gateway）： 网关或代理服务器没有接收到上游服务器的相应
- **503（Service Unavailable）：** 服务器崩掉了
- 504（Gateway Time-out）： 网关超时
- 505（HTTP Version not supported）： 不支持 HTTP 版本

### [301 和 302 区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/241)

301 是永久性重定向，浏览器接收到这样的响应头时，下次再发起请求时，会直接往新的地址请求，不会再向原地址发请求

302 是临时性重定向，所以浏览器再每次请求时，仍旧会先向原地址发请求