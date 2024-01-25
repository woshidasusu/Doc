import{_ as a,r as l,o as s,c as d,a as i,b as e,e as t,d as o}from"./app-PjuKeMiB.js";const c={},r={href:"https://github.com/apache/commons-net",target:"_blank",rel:"noopener noreferrer"},v=o(`<p>但碰到一些问题，并不是说是开源库的 bug，可能锅得算在产品头上吧，各种奇怪需求。</p><h1 id="问题" tabindex="-1"><a class="header-anchor" href="#问题" aria-hidden="true">#</a> 问题</h1><p>当将网络限速成 1KB/S 时，使用 commons-net 开源库中的 FTPClient 上传本地文件到 FTP 服务器上，FTPClient 源码内部是通过 Socket 来实现传输的，当终端和服务器建立了连接，调用 <code>storeFile()</code> 开始上传文件时，由于网络限速问题，一直没有接收到是否传输结束的反馈，导致此时，当前线程一直卡在 <code>storeFile()</code>，后续代码一直无法执行。</p><p>如果这个时候去 FTP 服务器上查看一下，会发现，新创建了一个 0KB 的文件，但本地文件中的数据内容就是没有上传上来。</p><p>产品要求，需要有个超时处理，比如上传工作超过了 30s 就当做上传失败，超时处理。但我明明调用了 FTPClient 的相关超时设置接口，就是没有一个会生效。</p><p>一句话简述下上述的场景问题：</p><p><strong>网络限速时，为何 FTPClient 设置了超时时间，但文件上传过程中超时机制却一直没生效？</strong></p><p>一气之下，干脆跟进 FTPClient 源码内部，看看为何设置的超时失效了，没有起作用。</p><p>所以，本篇也就是梳理下 FTPClient 中相关超时接口的含义，以及如何处理上述场景中的超时功能。</p><h1 id="源码跟进" tabindex="-1"><a class="header-anchor" href="#源码跟进" aria-hidden="true">#</a> 源码跟进</h1><p>先来讲讲对 FTPClient 的浅入学习过程吧，如果不感兴趣，直接跳过该节，看后续小节的结论就可以了。</p><p>ps:本篇所使用的 commons-net 开源库版本为 3.6</p><h3 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h3><p>首先，先来看看，使用 FTPClient 上传文件到 FTP 服务器大概需要哪些步骤：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//1.与 FTP 服务器创建连接
ftpClient.connect(hostUrl, port);
//2.登录
ftpClient.login(username, password);
//3.进入到指定的上传目录中
ftpClient.makeDirectory(remotePath);
ftpClient.changeWorkingDirectory(remotePath);
//4.开始上传文件到FTP
ftpClient.storeFile(file.getName(), fis);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，中间省略其他的配置项，比如设置主动模式、被动模式，设置每次读取本地文件的缓冲大小，设置文件类型，设置超时等等。但大体上，使用 FTPClient 来上传文件到 FTP 服务器的步骤就是这么几个。</p><p>既然本篇主要是想理清超时为何没生效，那么也就先来看看都有哪些设置超时的接口：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-a8baa120eab99727.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="setTimeout"></p><p>粗体字是 FTPClient 类中提供的方法，而 FTPClient 的继承关系如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>FTPClient extends FTP extends SocketClient
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>非粗体字的方法都是 SocketClient 中提供的方法。</p><p>好，先清楚有这么几个设置超时的接口存在，后面再从跟进源码过程中，一个个来了解它们。</p><h3 id="跟进" tabindex="-1"><a class="header-anchor" href="#跟进" aria-hidden="true">#</a> 跟进</h3><h4 id="_1-connect" tabindex="-1"><a class="header-anchor" href="#_1-connect" aria-hidden="true">#</a> 1. connect()</h4><p>那么，就先看看第一步的 <code>connect()</code>：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//SocketClient#connect()
public void connect(String hostname, int port) throws SocketException, IOException {
	_hostname_ = hostname;
	_connect(InetAddress.getByName(hostname), port, null, -1);
}

//SocketClient#_connect()
private void _connect(InetAddress host, int port, InetAddress localAddr, int localPort) throws SocketException, IOException {
    //1.创建socket
    _socket_ = _socketFactory_.createSocket();
    //2.设置发送窗口和接收窗口的缓冲大小
    if (receiveBufferSize != -1) {
        _socket_.setReceiveBufferSize(receiveBufferSize);
    }
    if (sendBufferSize != -1) {
        _socket_.setSendBufferSize(sendBufferSize);
    }
    //3.socket（套接字：ip 和 port 组成）
    if (localAddr != null) {
        _socket_.bind(new InetSocketAddress(localAddr, localPort));
    }
    //4.连接，这里出现 connectTimeout 了
    _socket_.connect(new InetSocketAddress(host, port), connectTimeout);
    _connectAction_();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以， FTPClient 调用的 <code>connect()</code> 方法其实是调用父类的方法，这个过程会去创建客户端 Socket，并和指定的服务端的 ip 和 port 创建连接，这个过程中，出现了一个 connectTimeout，与之对应的 FTPClient 的超时接口：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//SocketClient#setConnectTimeout()
public void setConnectTimeout(int connectTimeout) {
	this.connectTimeout = connectTimeout;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于内部是如何创建计时器，并在超时后是如何抛出 SocketTimeoutException 异常的，就不跟进了，有兴趣自行去看，这里就看一下接口的注释：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>   /**
     * Connects this socket to the server with a specified timeout value.
     * A timeout of zero is interpreted as an infinite timeout. The connection
     * will then block until established or an error occurs.
     * (用该 socket 与服务端创建连接，并设置一个指定的超时时间，如果超时时间是0，表示超时时间为无穷大，
     *  创建连接这个过程会进入阻塞状态，直到连接创建成功，或者发生某个异常错误）
     * @param   endpoint the {@code SocketAddress}
     * @param   timeout  the timeout value to be used in milliseconds.
     * @throws  IOException if an error occurs during the connection
     * @throws  SocketTimeoutException if timeout expires before connecting
     * @throws  java.nio.channels.IllegalBlockingModeException
     *          if this socket has an associated channel,
     *          and the channel is in non-blocking mode
     * @throws  IllegalArgumentException if endpoint is null or is a
     *          SocketAddress subclass not supported by this socket
     * @since 1.4
     * @spec JSR-51
     */
public void connect(SocketAddress endpoint, int timeout) throws IOException {
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注释有大概翻译了下，总之到这里，先搞清一个超时接口的作用了，虽然从方法命名上也可以看出来了：</p><p><strong><code>setConnectTimeout()</code></strong>： 用于设置终端和服务器建立连接这个过程的超时时间。</p><p>还有一点需要注意，当终端和服务端建立连接这个过程中，当前线程会进入阻塞状态，即常说的同步请求操作，直到连接成功或失败，后续代码才会继续进行。</p><p>当连接创建成功后，会调用 <code>_connectAction_()</code>，看看：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//SocketClient#_connectAction_()
protected void _connectAction_() throws IOException {
	_socket_.setSoTimeout(_timeout_);
    //...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里又出现一个 _timeout_ 了，看看它对应的 FTPClient 的超时接口：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//SocketClient#setDefaultTimeout()
public void setDefaultTimeout(int timeout){
    _timeout_ = timeout;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>setDefaultTimeout()</code></strong> ：用于当终端与服务端创建完连接后，初步对用于传输控制命令的 Socket 调用 <code>setSoTimeout()</code> 设置超时，所以，这个超时具体是何作用，取决于 Socket 的 <code>setSoTimeout()</code>。</p><p>另外，还记得 FTPClient 也有这么个超时接口么：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//SocketClient#setSoTimeout()
public void setSoTimeout(int timeout) throws SocketException {
	_socket_.setSoTimeout(timeout);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，对于 FTPClient 而言，<code>setDefaultTimeout()</code> 超时的工作跟 <strong><code>setSoTimeout()</code></strong> 是相同的，区别仅在于后者会覆盖掉前者设置的值。</p><h4 id="_2-login" tabindex="-1"><a class="header-anchor" href="#_2-login" aria-hidden="true">#</a> 2. login()</h4><p>接下去看看其他步骤的方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//FTPClient#login()
public boolean login(String username, String password) throws IOException {
	//...
    user(username);
	//...
    return FTPReply.isPositiveCompletion(pass(password));
}

//FTP#user()
public int user(String username) throws IOException {
	return sendCommand(FTPCmd.USER, username);
}

//FTP#pass()
public int pass(String password) throws IOException {
	return sendCommand(FTPCmd.PASS, password);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，login 主要是发送 FTP 协议的一些控制命令，因为连接已经创建成功，终端发送的 FTP 控制指令给 FTP 服务器，完成一些操作，比如登录，比如创建目录，进入某个指定路径等等。</p><p>这些步骤过程中，没看到跟超时相关的处理，所以，看看最后一步上传文件的操作：</p><h4 id="_3-storefile" tabindex="-1"><a class="header-anchor" href="#_3-storefile" aria-hidden="true">#</a> 3. storeFile</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//FTPClient#storeFile()
public boolean storeFile(String remote, InputStream local) throws IOException {
	return __storeFile(FTPCmd.STOR, remote, local);
}

//FTPClient#__storeFile()
private boolean __storeFile(FTPCmd command, String remote, InputStream local) throws IOException {
    return _storeFile(command.getCommand(), remote, local);
}

//FTPClient#_storeFile()
protected boolean _storeFile(String command, String remote, InputStream local) throws IOException {
    //1. 创建并连接用于传输 FTP 数据的 Socket
    Socket socket = _openDataConnection_(command, remote);
    //...
    //2. 设置传输监听，这里出现了一个timeout
    CSL csl = null;
    if (__controlKeepAliveTimeout &gt; 0) {
        csl = new CSL(this, __controlKeepAliveTimeout, __controlKeepAliveReplyTimeout);
    }

    // Treat everything else as binary for now
    try {
        //3.开始发送本地数据到FTP服务器
        Util.copyStream(local, output, getBufferSize(), CopyStreamEvent.UNKNOWN_STREAM_SIZE, __mergeListeners(csl), false);
    }
    //...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们在学习 FTP 协议的端口时，还记得么，通常 20 端口是数据端口，21 端口是控制端口，当然这并不固定。但总体上，整个过程分两步：一是先建立用于传输控制命令的连接，二是再建立用于传输数据的连接。</p><p>所以，当调用 <code>_storeFile()</code> 上传文件时，会再通过 <code>_openDataConnection_()</code> 创建一个用于传输数据的 Socket，并与服务端连接，连接成功后，就会通过 Util 的 <code>copyStream()</code> 将本地文件 copy 到用于传输数据的这个 Socket 的 OutputStream 输出流上，此时，Socket 底层会自动去按照 TCP 协议往发送窗口中写数据来发给服务器。</p><p>这个步骤涉及到很多超时处理的地方，所以就来看看，首先是 <code>_openDataConnection_()</code> :</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//FTPClient#_openDataConnection_()
protected Socket _openDataConnection_(String command, String arg) throws IOException {
    //...
    Socket socket;
    //...
    //1. 根据被动模式或主动模式创建不同的 Socket 配置
    if (__dataConnectionMode == ACTIVE_LOCAL_DATA_CONNECTION_MODE) {
        //...
    } else { // We must be in PASSIVE_LOCAL_DATA_CONNECTION_MODE
        //...
        //2. 我项目中使用的是被动模式，所以我只看这个分支了
        //3. 创建用于传输数据的 Socket
        socket = _socketFactory_.createSocket();
        //...
        //4. 对这个传输数据的 Socket 设置了 SoTimeout 超时
        if (__dataTimeout &gt;= 0) {
            socket.setSoTimeout(__dataTimeout);
        }

        //5. 跟服务端建立连接，指定超时处理
        socket.connect(new InetSocketAddress(__passiveHost, __passivePort), connectTimeout);
        //...        
    }

    //...
    return socket;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，创建用于传输数据的 Socket 跟传输控制命令的 Socket 区别不是很大，当跟服务端建立连接时也都是用的 FTPClient 的 <code>setConnectTimeout()</code> 设置的超时时间处理。</p><p>有点区别的地方在于，传输控制命令的 Socket 是当在与服务端建立完连接后才会去设置 Socket 的 SoTimeout，而这个超时时间则来自于调用 FTPClient 的 <code>setDefaultTimeout()</code> ，和 <code>setSoTimeout()</code>，后者设置的值优先。</p><p>而传输数据的 Socket 则是在与服务端建立连接之前就设置了 Socket 的 SoTimeout，超时时间值来自于 FTPClient 的 <code>setDataTimeout()</code>。</p><p>那么，<strong><code>setDataTimeout()</code></strong> 也清楚一半了，设置用于传输数据的 Socket 的 SoTimeout 值。</p><p>所以，只要能搞清楚，Socket 的 <code>setSoTimeout()</code> 超时究竟指的是对哪个工作过程的超时处理，那么就能够理清楚 FTPClient 的这些超时接口的用途：<code>setDefaultTimeout()</code>，<code>setSoTimeout()</code>，<code>setDataTimeout()</code>。</p><p>这个先放一边，继续看 <code>_storeFile()</code> 流程的第二步：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//FTPClient#_storeFile()
protected boolean _storeFile(String command, String remote, InputStream local) throws IOException {
    //...
    //2. 设置传输监听
    CSL csl = null;
    if (__controlKeepAliveTimeout &gt; 0) {
        csl = new CSL(this, __controlKeepAliveTimeout, __controlKeepAliveReplyTimeout);
    }
    // Treat everything else as binary for now
    try {
        //3.开始发送本地数据到FTP服务器
        Util.copyStream(local, output, getBufferSize(), CopyStreamEvent.UNKNOWN_STREAM_SIZE, __mergeListeners(csl), false);
    }
}

//FTPClient#setControlKeepAliveTimeout()
public void setControlKeepAliveTimeout(long controlIdle){
	__controlKeepAliveTimeout = controlIdle * 1000;
}
//FTPClient#setControlKeepAliveReplyTimeout()
public void setControlKeepAliveReplyTimeout(int timeout) {
	__controlKeepAliveReplyTimeout = timeout;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>FTPClient 的最后两个超时接口也找到使用的地方了，那么就看看 CSL 内部类是如何处理这两个 timeout 的：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//FTPClient$CSL
private static class CSL implements CopyStreamListener {
    CSL(FTPClient parent, long idleTime, int maxWait) throws SocketException {
        this.idle = idleTime;
        //...
        parent.setSoTimeout(maxWait);
    }
	
    //每次读取文件的过程，都让传输控制命令的 Socket 发送一个无任何操作的 NOOP 命令，以便让这个 Socket keep alive
    @Override
    public void bytesTransferred(long totalBytesTransferred,
        int bytesTransferred, long streamSize) {
        long now = System.currentTimeMillis();
        if ((now - time) &gt; idle) {
            try {
                parent.__noop();
            } catch (SocketTimeoutException e) {
                notAcked++;
            } catch (IOException e) {
                // Ignored
            }
            time = now;
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>CSL 是监听 <code>copyStream()</code> 这个过程的，因为本地文件要上传到服务器，首先，需要先读取本地文件的内容，然后写入到传输数据的 Socket 的输出流中，这个过程不可能是一次性完成的，肯定是每次读取一些、写一些，默认每次是读取 1KB，可配置。而 Socket 的输出流缓冲区也不可能可以一直往里写的，它有一个大小限制。底层的具体实现其实也就是 TCP 的发送窗口，那么这个窗口中的数据自然需要在接收到服务器的 ACK 确认报文后才会清空，腾出位置以便可以继续写入。</p><p>所以，<code>copyStream()</code> 是一个会进入阻塞的操作，因为需要取决于网络状况。而 <code>setControlKeepAliveTimeout()</code> 方法命名中虽然带有 timeout 关键字，但实际上它的用途并不是用于处理传输超时工作的。它的用途，其实将方法的命名翻译下就是了：</p><p><strong><code>setControlKeepAliveTimeout()</code></strong>：用于设置传输控制命令的 Socket 的 alive 状态，注意单位为 s。</p><p>因为 FTP 上传文件过程中，需要用到两个 Socket，一个用于传输控制命令，一个用于传输数据，那当处于传输数据过程中时，传输控制命令的 Socket 会处于空闲状态，有些路由器可能监控到这个 Socket 连接处于空闲状态超过一定时间，会进行一些断开等操作。所以，在传输过程中，每读取一次本地文件，传输数据的 Socket 每要发送一次报文给服务端时，根据 <code>setControlKeepAliveTimeout()</code> 设置的时间阈值，来让传输控制命令的 Socket 也发送一个无任何操作的命令 NOOP，以便让路由器以为这个 Socket 也处于工作状态。这些就是 <code>bytesTransferred()</code> 方法中的代码干的事。</p><p><strong><code>setControlKeepAliveReplyTimeout()</code></strong>：这个只有在调用了 <code>setControlKeepAliveTimeout()</code> 方法，并传入一个大于 0 的值后，才会生效，用于在 FTP 传输数据这个过程，对传输控制命令的 Socket 设置 SoTimeout，这个传输过程结束后会恢复传输控制命令的 Socket 原本的 SoTimeout 配置。</p><p>那么，到这里可以稍微来小结一下：</p><p>FTPClient 一共有 6 个用于设置超时的接口，而终端与 FTP 通信过程会创建两个 Socket，一个用于传输控制命令，一个用于传输数据。这 6 个超时接口与两个 Socket 之间的关系：</p><p><code>setConnectTimeout()</code>：用于设置两个 Socket 与服务器建立连接这个过程的超时时间，单位 ms。</p><p><code>setDefaultTimeout()</code>：用于设置传输控制命令的 Socket 的 SoTimeout，单位 ms。</p><p><code>setSoTimeout()</code>：用于设置传输控制命令的 Socket 的 SoTimeout，单位 ms，值会覆盖上个方法设置的值。</p><p><code>setDataTimeout()</code>：被动模式下，用于设置传输数据的 Socket 的 SoTimeout，单位 ms。</p><p><code>setControlKeepAliveTimeout()</code>：用于在传输数据过程中，也可以让传输控制命令的 Socket 假装保持处于工作状态，防止被路由器干掉，注意单位是 s。</p><p><code>setControlKeepAliveReplyTimeout()</code>：只有调用上个方法后，该方法才能生效，用于设置在传输数据这个过程中，暂时替换掉传输控制命令的 Socket 的 SoTimeout，传输过程结束恢复这个 Socket 原本的 SoTimeout。</p><h4 id="_4-sotimeout" tabindex="-1"><a class="header-anchor" href="#_4-sotimeout" aria-hidden="true">#</a> 4. SoTimeout</h4><p>大部分超时接口最后设置的对象都是 Socket 的 SoTimeout，所以，接下来，学习下这个是什么：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>//Socket#setSoTimeout()
   /**
     *  Enable/disable {@link SocketOptions#SO_TIMEOUT SO_TIMEOUT}
     *  with the specified timeout, in milliseconds. With this option set
     *  to a non-zero timeout, a read() call on the InputStream associated with
     *  this Socket will block for only this amount of time.  If the timeout
     *  expires, a &lt;B&gt;java.net.SocketTimeoutException&lt;/B&gt; is raised, though the
     *  Socket is still valid. The option &lt;B&gt;must&lt;/B&gt; be enabled
     *  prior to entering the blocking operation to have effect. The
     *  timeout must be {@code &gt; 0}.
     *  A timeout of zero is interpreted as an infinite timeout.
     *  （设置一个超时时间，用来当这个 Socket 调用了 read() 从 InputStream 输入流中
     *    读取数据的过程中，如果线程进入了阻塞状态，那么这次阻塞的过程耗费的时间如果
     *    超过了设置的超时时间，就会抛出一个 SocketTimeoutException 异常，但只是将
     *    线程从读数据这个过程中断掉，并不影响 Socket 的后续使用。
     *    如果超时时间为0，表示无限长。）
     *  （注意，并不是读取输入流的整个过程的超时时间，而仅仅是每一次进入阻塞等待输入流中
     *    有数据可读的超时时间）
     * @param timeout the specified timeout, in milliseconds.
     * @exception SocketException if there is an error
     * in the underlying protocol, such as a TCP error.
     * @since   JDK 1.1
     * @see #getSoTimeout()
     */
public synchronized void setSoTimeout(int timeout) throws SocketException {
    //...
}

//SocketOptions#SO_TIMEOUT
   /** Set a timeout on blocking Socket operations:
     * （设置一个超时时间，用于处理一些会陷入阻塞的 Socket 操作的超时处理，比如：）
     * &lt;PRE&gt;
     * ServerSocket.accept();
     * SocketInputStream.read();
     * DatagramSocket.receive();
     * &lt;/PRE&gt;
     *
     * &lt;P&gt; The option must be set prior to entering a blocking
     * operation to take effect.  If the timeout expires and the
     * operation would continue to block,
     * &lt;B&gt;java.io.InterruptedIOException&lt;/B&gt; is raised.  The Socket is
     * not closed in this case.
     * （设置这个超时的操作必须要在 Socket 那些会陷入阻塞的操作之前才能生效，
     *   当超时时间到了，而当前还处于阻塞状态，那么会抛出一个异常，但此时 Socket 并没有被关闭）
     *
     * &lt;P&gt; Valid for all sockets: SocketImpl, DatagramSocketImpl
     *
     * @see Socket#setSoTimeout
     * @see ServerSocket#setSoTimeout
     * @see DatagramSocket#setSoTimeout
     */
@Native public final static int SO_TIMEOUT = 0x1006;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上的翻译是基于我的理解，我自行的翻译，也许不那么正确，你们也可以直接看英文。</p>`,78),m={href:"https://www.cnblogs.com/renhui/p/7389820.html",target:"_blank",rel:"noopener noreferrer"},u=o(`<blockquote><p><strong>读取数据时阻塞链路的超时时间</strong></p></blockquote><p>我再基于他的基础上理解一波，我觉得他这句话中有两个重点，一是：读取，二是：阻塞。</p><p>这两个重点是理解 SoTimeout 超时机制的关键，就像那篇文中所说，很多人将 SoTimeout 理解成链路的超时时间，或者这一次传输过程的总超时时间，但这种理解是错误的。</p><p>第一点，SoTimeout 并不是传输过程的总超时时间，不管是上传文件还是下载文件，服务端和终端肯定是要分多次报文传输的，我对 SoTimeout 的理解是，它是针对每一次的报文传输过程而已，而不是总的传输过程。</p><p>第二点，SoTimeout 只针对从 Socket 输入流中读取数据的操作。什么意思，如果是终端下载 FTP 服务器的文件，那么服务端会往终端的 Socket 的输入流中写数据，如果终端接收到了这些数据，那么 FTPClient 就可以去这个 Socket 的输入流中读取数据写入到本地文件的输出流。而如果反过来，终端上传文件到 FTP 服务器，那么 FTPClient 是读取本地文件写入终端的 Socket 的输出流中发送给终端，这时就不是对 Socket 的输入流操作了。</p><p>总之，<strong><code>setSoTimeout()</code></strong> 用于设置从 Socket 的输入流中读取数据时每次陷入阻塞过程的超时时间。</p><p>那么，在 FTPClient 中，所对应的就是，<code>setSoTimeout()</code> 对下述方法有效：</p><ul><li><code>retrieveFile()</code></li><li><code>retrieveFileStream()</code></li></ul><p>相反的，下述这些方法就无效了：</p><ul><li><code>storeFile()</code></li><li><code>storeFileStream()</code></li></ul><p>这样就可以解释得通，开头我所提的问题了，在网络被限速之下，由于 <code>sotreFile()</code> 会陷入阻塞，并且设置的 <code>setDataTimeout()</code> 超时由于这是一个上传文件的操作，不是对 Socket 的输入流的读取操作，所以无效。所以，也才会出现线程进入阻塞状态，后续代码一直得不到执行，UI 层迟迟接收不到上传成功与否的回调通知。</p><p>最后我的处理是，在业务层面，自己写了超时处理。</p><p>注意，以上分析的场景是：FTP 被动模式的上传文件的场景下，相关接口的超时处理。所以很多表述都是基于这个场景的前提下，有一些源码，如 Util 的 <code>copyStream()</code> 不仅在文件上传中使用，在下载 FTP 上的文件时也同样使用，所以对于文件上传来说，这方法就是用来读取本地文件写入传输数据的 Socket 的输出流；而对于下载 FTP 文件的场景来说，这方法的作用就是用于读取传输数据的 Socket 的输入流，写入到本地文件的输出流中。以此类推。</p><h1 id="结论" tabindex="-1"><a class="header-anchor" href="#结论" aria-hidden="true">#</a> 结论</h1><p>总结来说，如果是对于网络开发这方面领域内的来说，这些超时接口的用途应该都是基础，但对于我们这些很少接触 Socket 的来说，如果单凭接口注释文档无法理解的话，那可以尝试翻阅下源码，理解下。</p><p>梳理之后，FTPClient 一共有 6 个设置超时的接口，而不管是文件上传或下载，这过程，FTP 都会创建两个 Socket，一个用于传输控制命令，一个用于传输文件数据，超时接口和这两个 Socket 之间的关系如下：</p><ul><li><code>setConnectTimeout()</code> 用于设置终端 Socket 与 FTP 服务器建立连接这个过程的超时时间。</li><li><code>setDefaultTimeout()</code> 用于设置终端的传输控制命令的 Socket 的 SoTimeout，即针对传输控制命令的 Socket 的输入流做读取操作时每次陷入阻塞的超时时间。</li><li><code>setSoTimeout()</code> 作用跟上个方法一样，区别仅在于该方法设置的超时会覆盖掉上个方法设置的值。</li><li><code>setDataTimeout()</code> 用于设置终端的传输数据的 Socket 的 Sotimeout，即针对传输文件数据的 Socket 的输入流做读取操作时每次陷入阻塞的超时时间。</li><li><code>setControlKeepAliveTimeout()</code> 用于设置当处于传输数据过程中，按指定的时间阈值定期让传输控制命令的 Socket 发送一个无操作命令 NOOP 给服务器，让它 keep alive。</li><li><code>setControlKeepAliveReplyTimeout()</code>：只有调用上个方法后，该方法才能生效，用于设置在传输数据这个过程中，暂时替换掉传输控制命令的 Socket 的 SoTimeout，传输过程结束恢复这个 Socket 原本的 SoTimeout。</li></ul><p>超时接口大概的用途明确了，那么再稍微来讲讲该怎么用：</p><p>针对使用 FTPClient 下载 FTP 文件，一般只需使用两个超时接口，一个是 <code>setConnectTimeout()</code>，用于设置建立连接过程中的超时处理，而另一个则是 <code>setDataTimeout()</code>，用于设置下载 FTP 文件过程中的超时处理。</p><p>针对使用 FTPClient 上传文件到 FTP 服务器，建立连接的超时同样需要使用 <code>setConnectTimeout()</code>，但文件上传过程中，建议自行利用 Android 的 Handler 或其他机制实现超时处理，因为 <code>setDataTimeout()</code> 这个设置对上传的过程无效。</p><p>另外，使用 <code>setDataTimeout()</code> 时需要注意，这个超时不是指下载文件整个过程的超时处理，而是仅针对终端 Socket 从输入流中，每一次可进行读取操作之前陷入阻塞的超时。</p><p>以上，是我所碰到的问题，及梳理的结论，我只以我所遇的现象来理解，因为我对网络编程，对 Socket 不熟，如果有错误的地方，欢迎指证一下。</p><h1 id="常见异常" tabindex="-1"><a class="header-anchor" href="#常见异常" aria-hidden="true">#</a> 常见异常</h1><p>最后附上 FTPClient 文件上传过程中，常见的一些异常，便于针对性的进行分析：</p><h3 id="_1-storefile-上传文件超时-该超时时间由-linux-系统规定" tabindex="-1"><a class="header-anchor" href="#_1-storefile-上传文件超时-该超时时间由-linux-系统规定" aria-hidden="true">#</a> 1.storeFile() 上传文件超时，该超时时间由 Linux 系统规定</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>org.apache.commons.net.io.CopyStreamException: IOException caught while copying.
        at org.apache.commons.net.io.Util.copyStream(Util.java:136)
        at org.apache.commons.net.ftp.FTPClient._storeFile(FTPClient.java:675)
        at org.apache.commons.net.ftp.FTPClient.__storeFile(FTPClient.java:639)
        at org.apache.commons.net.ftp.FTPClient.storeFile(FTPClient.java:2030)
        at com.chinanetcenter.component.log.FtpUploadTask.run(FtpUploadTask.java:121)
Caused by: java.net.SocketException: sendto failed: ETIMEDOUT (Connection timed out)
        at libcore.io.IoBridge.maybeThrowAfterSendto(IoBridge.java:546)
        at libcore.io.IoBridge.sendto(IoBridge.java:515)
        at java.net.PlainSocketImpl.write(PlainSocketImpl.java:504)
        at java.net.PlainSocketImpl.access$100(PlainSocketImpl.java:37)
        at java.net.PlainSocketImpl$PlainSocketOutputStream.write(PlainSocketImpl.java:266)
        at java.io.BufferedOutputStream.write(BufferedOutputStream.java:174)
        at
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析：异常的关键信息：ETIMEOUT。</p><p>可能的场景：由于网络被限速 1KB/S，终端的 Socket 发给服务端的报文一直收不到 ACK 确认报文（原因不懂），导致发送缓冲区一直处于满的状态，导致 FTPClient 的 <code>storeFile()</code> 一直陷入阻塞。而如果一个 Socket 一直处于阻塞状态，TCP 的 keeplive 机制通常会每隔 75s 发送一次探测包，一共 9 次，如果都没有回应，则会抛出如上异常。</p><p>可能还有其他场景，上述场景是我所碰到的，FTPClient 的 <code>setDataTimeout()</code> 设置了超时，但没生效，原因上述已经分析过了，最后过了十来分钟自己抛了超时异常，至于为什么会抛了一次，看了下篇文章里的分析，感觉对得上我这种场景。</p>`,29),p={href:"https://www.cnblogs.com/promise6522/archive/2012/03/03/2377935.html",target:"_blank",rel:"noopener noreferrer"},b=o(`<h3 id="_2-retrievefile-下载文件超时" tabindex="-1"><a class="header-anchor" href="#_2-retrievefile-下载文件超时" aria-hidden="true">#</a> 2. retrieveFile 下载文件超时</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>org.apache.commons.net.io.CopyStreamException: IOException caught while copying.
        at org.apache.commons.net.io.Util.copyStream(Util.java:136)
        at org.apache.commons.net.ftp.FTPClient._retrieveFile(FTPClient.java:1920)
        at org.apache.commons.net.ftp.FTPClient.retrieveFile(FTPClient.java:1885)
        at com.chinanetcenter.component.log.FtpUploadTask.run(FtpUploadTask.java:143)
Caused by: java.net.SocketTimeoutException
        at java.net.PlainSocketImpl.read(PlainSocketImpl.java:488)
        at java.net.PlainSocketImpl.access$000(PlainSocketImpl.java:37)
        at java.net.PlainSocketImpl$PlainSocketInputStream.read(PlainSocketImpl.java:237)
        at java.io.InputStream.read(InputStream.java:162)
        at java.io.BufferedInputStream.fillbuf(BufferedInputStream.java:149)
        at java.io.BufferedInputStream.read(BufferedInputStream.java:234)
        at java.io.PushbackInputStream.read(PushbackInputStream.java:146)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析：该异常注意跟第一种场景的异常区分开，注意看异常栈中的第一个异常信息，这里是由于 read 过程的超时而抛出的异常，而这个超时就是对 Socket 设置了 <code>setSoTimeout()</code>，归根到 FTPClient 的话，就是调用了 <code>setDataTimeout()</code> 设置了传输数据用的 Socket 的 SoTimeout，由于是文件下载操作，是对 Socket 的输入流进行的操作，所以这个超时机制可以正常运行。</p><h3 id="_2-socket-建立连接超时异常" tabindex="-1"><a class="header-anchor" href="#_2-socket-建立连接超时异常" aria-hidden="true">#</a> 2. Socket 建立连接超时异常</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>java.net.SocketTimeoutException: failed to connect to /123.103.23.202 (port 2121) after 500ms
        at libcore.io.IoBridge.connectErrno(IoBridge.java:169)
        at libcore.io.IoBridge.connect(IoBridge.java:122)
        at java.net.PlainSocketImpl.connect(PlainSocketImpl.java:183)
        at java.net.PlainSocketImpl.connect(PlainSocketImpl.java:456)
        at java.net.Socket.connect(Socket.java:882)
        at org.apache.commons.net.SocketClient._connect(SocketClient.java:243)
        at org.apache.commons.net.SocketClient.connect(SocketClient.java:202)
        at com.chinanetcenter.component.log.FtpUploadTask.run(FtpUploadTask.java:93)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析：这是由于 Socket 在创建连接时超时的异常，通常是 TCP 的三次握手，这个连接对应着 FTPClient 的 <code>connect()</code> 方法，其实关键是 Socket 的 <code>connect()</code> 方法，在 FTPClient 的 <code>stroreFile()</code> 方法内部由于需要创建用于传输的 Socket，也会有这个异常出现的可能。</p><p>另外，这个超时时长的设置由 FTPClient 的 <code>setConnectTimeout()</code> 决定。</p><h3 id="_3-其他-tcp-错误" tabindex="-1"><a class="header-anchor" href="#_3-其他-tcp-错误" aria-hidden="true">#</a> 3. 其他 TCP 错误</h3>`,8),S={href:"https://www.ibm.com/support/knowledgecenter/zh/SSEPGG_10.5.0/com.ibm.db2.luw.messages.doc/doc/r0058740.html",target:"_blank",rel:"noopener noreferrer"},T=i("p",null,[i("img",{src:"https://upload-images.jianshu.io/upload_images/1924341-40f90d402ddbf4eb.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240",alt:"常见错误.png"})],-1);function h(k,g){const n=l("ExternalLinkIcon");return s(),d("div",null,[i("p",null,[e("apache 有个开源库："),i("a",r,[e("commons-net"),t(n)]),e("，这个开源库中包括了各种基础的网络工具类，我使用了这个开源库中的 FTP 工具。")]),v,i("p",null,[e("或者是看看这篇文章："),i("a",m,[e("关于 Socket 设置 setSoTimeout 误用的说明"),t(n)]),e("，文中有一句解释：")]),u,i("p",null,[e("具体原理参数："),i("a",p,[e("浅谈TCP/IP网络编程中socket的行为"),t(n)])]),b,i("p",null,[e("参考："),i("a",S,[e("TCP/IP错误列表"),t(n)]),e(" ，下面是部分截图：")]),T])}const C=a(c,[["render",h],["__file","记录apache的FTPClient一些问题.html.vue"]]);export{C as default};
