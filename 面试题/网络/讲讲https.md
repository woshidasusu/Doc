# 讲讲 HTTPS

> 本文参考：[前端面试查漏补缺--(九) HTTP与HTTPS]( https://juejin.im/post/5c6e5803f265da2dc0065437 )

http 有一些缺点：

- 使用明文传输，容易被窃听
- 不验证通信方身份，可能遭遇伪装
- 无法证明报文完整性，可能被篡改

为了解决这些问题，保证通信安全，https 在 http 基础上，增加了一层 ssl/tls 来加密数据包处理

HTTPS = HTTP + TLS/SSL

TLS：Transport Layer Security 安全传输层协议，是介于 TCP 和 HTTP 之间的一层安全协议，不影响原有的 TCP 协议和 HTTP 协议，所以使用 HTTPS 基本上不需要对 HTTP 页面进行太多改造

### HTTPS 双方建立连接过程

http 的通信双方只要经过 TCP 的三次握手建立连接之后，就可以直接进行通信

https 比 http 的过程增加了双方协商加密密钥的过程：

1. 客户端向服务端索要公钥并进行验证
2. 服务端下发数字证书（公钥 + 数字签名）给客户端
3. 客户端通过校验之后，使用公钥加密传输通信的密钥
4. 服务端使用私钥解密得到通信的密钥
5. 双方都持有密钥了，之后的通信使用对称加密传输

这里涉及两种加密策略：非对称加密传输、对称加密传输

非对称加密传输：有公钥、私钥之分，加密解密使用不同的密钥，只要保管好私钥即可

对称加密传输：加密解密都使用同一个密钥进行

只有通信双方使用对称加密，密钥只有他们双方知道，这种场景下，通信才是安全的

如果使用非对称加密，那么服务端用私钥加密的信息，任何得到公钥的均可以解密得到信息，而客户端对于用户又是开放的，任何直接存储在客户端上的密钥都不安全，所以整个过程才会需要先利用非对称加密来协商出双方的通信密钥，再使用对称加密进行通信