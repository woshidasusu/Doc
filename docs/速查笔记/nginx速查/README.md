# nginx

## nginx.conf

### client_max_body_size

nginx 默认请求体不能超过 1M，超过就返回 413（Request Entity Too Large）错误，可通过该配置进行修改

```nginx
server {
    client_max_body_size 1024M;
}
```

### 二级域名转发

不同站点可通过资源根目录不同进行转发，也可通过二级域名进行转发，前者需要配置多个 location，后者则是在单个 location 内，获取二级域名，进行相应的转发：

```nginx
server {
    location / {
        # 正则获取二级域名
        if ($http_host ~* "^(.*?)\.dasu\.fun$") {
			set $domain $1;
	    }
        # 根据不同二级域名进行转发
	    if ($domain ~* "blog") {
			proxy_pass http://192.168.5.105;
	    }
	    if ($domain ~* "gitbook") {
			proxy_pass http://192.168.5.106;
	    }
   		
        # 保持原请求一些信息
	    proxy_set_header Host	$host;
	    proxy_set_header X-Real-IP	$remote_addr;
	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	   	
        # 默认的转发
	    proxy_pass http://192.168.5.106;
    }
}
```