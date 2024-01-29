import{_ as n,o as e,c as i,d}from"./app-fgtJnIYH.js";const a={},s=d(`<h1 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx" aria-hidden="true">#</a> nginx</h1><h2 id="nginx-conf" tabindex="-1"><a class="header-anchor" href="#nginx-conf" aria-hidden="true">#</a> nginx.conf</h2><h3 id="client-max-body-size" tabindex="-1"><a class="header-anchor" href="#client-max-body-size" aria-hidden="true">#</a> client_max_body_size</h3><p>nginx 默认请求体不能超过 1M，超过就返回 413（Request Entity Too Large）错误，可通过该配置进行修改</p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code>server {
    client_max_body_size 1024M;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二级域名转发" tabindex="-1"><a class="header-anchor" href="#二级域名转发" aria-hidden="true">#</a> 二级域名转发</h3><p>不同站点可通过资源根目录不同进行转发，也可通过二级域名进行转发，前者需要配置多个 location，后者则是在单个 location 内，获取二级域名，进行相应的转发：</p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code>server {
    location / {
        # 正则获取二级域名
        if ($http_host ~* &quot;^(.*?)\\.dasu\\.fun$&quot;) {
			set $domain $1;
	    }
        # 根据不同二级域名进行转发
	    if ($domain ~* &quot;blog&quot;) {
			proxy_pass http://192.168.5.105;
	    }
	    if ($domain ~* &quot;gitbook&quot;) {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),r=[s];function t(l,c){return e(),i("div",null,r)}const v=n(a,[["render",t],["__file","index.html.vue"]]);export{v as default};
