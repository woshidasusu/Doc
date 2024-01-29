import{_ as l,r as d,o as a,c as r,a as e,b as i,e as s,d as v}from"./app-fgtJnIYH.js";const c={},u=e("h1",{id:"手写实现深度拷贝",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#手写实现深度拷贝","aria-hidden":"true"},"#"),i(" 手写实现深度拷贝")],-1),t={href:"https://muyiy.cn/blog/4/4.3.html",target:"_blank",rel:"noopener noreferrer"},b=v(`<h3 id="基础理论" tabindex="-1"><a class="header-anchor" href="#基础理论" aria-hidden="true">#</a> 基础理论</h3><p>拷贝的基础是赋值，在 js 中，将一个变量赋值给另一个变量时，有两种场景：</p><ul><li>基本类型数据的值拷贝</li><li>引用类型数据的引用拷贝</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = 1;
var b = {a: 1};

var a1 = a;
var b1 = b;
var b2 = b;

a1 = 2;
a; // 1   原始类型的赋值是值拷贝，两不影响

b1 = null;
b; // {a: 1}  对象类型的赋值是引用拷贝，修改引用指向，对原变量无影响
b2.a = 2; 
b; // {a: 2}  对象类型的赋值是引用拷贝，指向同一份对象，修改对象属性，会对原变量指向的对象有所影响
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么，对一个对象进行拷贝，无非就是对对象的属性进行拷贝，按照拷贝处理的方式不同，可分为浅拷贝和深拷贝：</p><ul><li>浅拷贝是只拷贝对象的第一层属性</li><li>深拷贝则是无限层次的拷贝对象的属性，只要属性值不是基本类型，就继续深度遍历进去</li></ul><p>浅拷贝的双方仍旧有所关联，因为有些属性只是引用拷贝而已，都是指向同一份数据，一方修改就会影响到另一方；</p><p>深拷贝的双方则是相互独立，互不影响。</p><p>在 js 中，内置的各种复制、拷贝的 API，都是浅拷贝，比如：Object.assign()，{...a}，[].slice() 等等。</p><p>如果项目中有需要使用到深拷贝，那么就只能是自行实现，或者使用三方库。</p><h3 id="实现深拷贝" tabindex="-1"><a class="header-anchor" href="#实现深拷贝" aria-hidden="true">#</a> 实现深拷贝</h3><p>有人可能会觉得自己实现个深拷贝很简单，毕竟都已经知道浅拷贝只拷贝一层，那深拷贝不就等效于浅拷贝 + 递归？</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function cloneDeep(source) {
    let target = {};
    for (let key in source) {
        if (typeof source[key] === &#39;object&#39;) {
            target[key] = cloneDeep(source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么，<strong>上面的深拷贝实现有问题吗？</strong></p><p>虽然从概念上，深拷贝就是需要层层遍历对象属性，只拷贝基本类型数据，对象类型再继续深入遍历，反应到代码上，的确也就是像上面的处理：基本类型值拷贝 + 对象类型递归处理。</p><p><strong>但上例的代码，欠缺各种细节和场景的处理。</strong></p><p>比如说：</p><ul><li>参数 source 的校验</li><li>typeof null 也是 object 的过滤处理</li><li>属性 key 值类型是 Symbol 的场景</li><li>source 是数组时的兼容处理</li><li>循环引用的场景</li><li>引用关系丢失问题</li><li>递归栈溢出的场景</li><li>等等</li></ul><p>所以，本篇想讲的深拷贝实现，就是希望能把这些细节和特殊场景考虑进去，同时，也会介绍一些不同的实现方案。</p><h4 id="通用版" tabindex="-1"><a class="header-anchor" href="#通用版" aria-hidden="true">#</a> 通用版</h4><p>想要实现通用版，其实也就是要将上面列出来的细节和各自场景考虑进行，思考每个问题该如何解决：</p><ul><li><strong>参数 source 的校验 &amp; null 的过滤处理</strong></li></ul><p>毕竟如果不是对象的话，也就没有什么拷贝的意义了，直接原值返回即可，所以这里需要对参数进行是否是对象的判断处理。</p><p>使用 typeof 的话，由于 null 也是 object，所以还需要将 null 的场景过滤掉；</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function isObject(o) {
    return typeof o === &#39;object&#39; &amp;&amp; o !== null;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>Symbol 的处理</strong></li></ul><p>symbol 是 ES6 中新增的特性，使用 for in 方式遍历不到，所以需要 ES6 中新增的遍历方式：</p><ul><li>Object.getOwnPropertySymbols()</li><li>Reflect.ownKeys()</li></ul><p>前者是单独遍历对象键值类型为 Symbol 的属性，使用这种方式的话，等于是分两次处理对象，先深拷贝一次 Symbol 属性，再深拷贝一次其他属性。</p><p>后者 Reflect.ownKeys() 可以遍历到对象所有的自有属性，包括 Symbol 属性，它相当于 Object.getOwnPropertyNames() 和 Object.getOwnPropertySymbols() 的并集。使用这种方式的话，等于替换掉 for in 的遍历方式。</p><ul><li><strong>数组的兼容处理</strong></li></ul><p>这个的意思是说，需要区分当前拷贝的对象是数组还是对象，毕竟总不能将数组的数据拷贝到对象里把，所以 target 的初始化需要处理一下，区分数组的场景：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>let target = Array.isArray(source) ? [] : {};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><strong>循环引用 &amp; 引用关系丢失问题</strong></li></ul><p>这种场景还是用代码来解释比较清晰：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = {};
var o = {
    a: a,
    b: a
}
o.c = o; 
o; // {a: {}, b: {}, c: {a: {}, b: {}, c:{...}}}
o.a === o.b; // true

var o1 = cloneDeep(o); // 栈溢出异常，Maximum call stack size
// 把 o.c = o 注释掉， o1.a === o1.b  输出 false，原本的引用关系丢失了
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>循环引用指的是，对象的某个属性又指向了对象本身，这样就造成了具有无限深层次的结构，递归时自然就会栈溢出了。</p><p>引用关系丢失指的是，对象的多个属性都指向同一个某对象，但经过深拷贝后，这多个属性却都指向了不同的对象，虽然被指向的这些对象的值是一致的。</p><p>造成这两个问题的根本原因，其实就是，对于对象数据，每次都会重新创建一个新对象来存储拷贝过来的值。</p><p>所以，解决这两个问题，其实也很简单，就是不要每次都重新创建新的对象，复用已创建的对象即可。</p><p>比如说，在遍历拷贝 o.a 时，先创建一个新对象拷贝了 o.a，之后再处理 o.b 时，发现 o.b 也指向 o.a，那么就不要重新创建对象来拷贝了，直接将引用指向之前拷贝 o.a 时创建的对象即可，这样引用关系就保留下来了。</p><p>这样即使遇到循环引用，就将引用指向拷贝生成的新对象即可，就不会有栈溢出的场景了。</p><p>代码上的话，可以利用 ES6 的 map 数据结构，因为可以直接让 source 对象作为 key 来存储。</p><p>否则就得自己用数组存储，但由于数组 key 值也只能是字符串和 Symbol，所以映射关系只能自己用对象存，这么一来，还得自己写寻找的逻辑。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function cloneDeep(source, hash = new WeakMap()) {
    // ... 省略
    if (hash.get(source)) {
        return hash.get(source)
    }
    let target = Array.isArray(source) ? [] : {};
    hash.set(source, target);
    
    // target[key] = cloneDeep(source[key], hash); // 对象类型递归调用时，将 hash 传递进去 
    // .., 省略
}

function cloneDeep(source, hash = []) {
    // ... 省略
    let cache = hash.find(v =&gt; v.source === source);
    if (cache) {
        return cache.target;
    }
    let target = Array.isArray(source) ? [] : {};
    hash.push({ source: source, target: target });
    
    // target[key] = cloneDeep(source[key], hash); // 对象类型递归调用时，将 hash 传递进去
    // ... 省略
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>栈溢出问题</strong></li></ul><p>递归的最大问题，就是怕遇到栈溢出，一旦递归层次多的话。</p><p>循环引用会导致递归层次过多而栈溢出，但可以通过已拷贝对象的缓存来解决这个问题。</p><p>但如果对象的结构层次过多时，这种现象就无法避免了，就必须来解决栈溢出问题了。</p><p>解决栈溢出两种思路：</p><ul><li>尾递归优化</li><li>不用递归，改成循环实现</li></ul><p><strong>尾递归优化</strong>是指函数的最后一行代码都是调用自身函数，如果可以修改成这种模式，就可以达到尾递归优化。而这种方式之所以可以解决栈溢出，是因为，函数的最后一行都是调用自身函数，那其实就意味着当前函数执行上下文其实没必要保留了，之所以会栈溢出，就是执行上下文栈中存在过多函数执行上下文。</p><p>每次调用函数都会创建一个函数执行上下文（EC），并放入执行上下文栈（ECS）中，当函数执行结束时，就将函数执行上下文移出栈。</p><p>所以，函数内部嵌套调用函数时，就会造成 ECS 中有过多的 EC，递归是不断的在函数内调用自己，所以一旦层次过多，必然导致 ECS 爆表，栈溢出。</p><p>而尾递归，让递归函数的最后一行执行的代码都是调用自身，这就意味着，在递归调用自身时，当前函数的职责已结束，那么 EC 其实就可以从 ECS 中移出了，这样一来，不管递归层次多深，始终都只有一个递归函数的 EC 在 ECS 中，自然就不会造成栈溢出。</p><p>不过尾递归优化有个局限性，只在严格模式下才开启，因为非严格模式下，函数内部有 arguments 和 caller 两个变量会追踪调用栈，尾递归优化会导致这两变量失真报错，所以只在严格模式下才开启。</p><p>而且，正常递归函数改写成尾递归，基本操作都是将局部变量变成参数，保证最后执行的一行代码是调用自身。但由于深拷贝场景，是在遍历属性过程中递归调用自身，调用完自身后面肯定还需要遍历处理其他属性，所以无法做到最后一行调用自身的要求，也就无法改写成尾递归形式。</p><p>所以，尾递归优化这种方案放弃。</p><p><strong>用循环替代递归</strong>是另外一种解决栈溢出方案，这种方式其实就是思考，原本需要使用递归的方式，有没有办法通过循环来实现。循环的话，也就不存在什么嵌套调用函数，也就不存在栈溢出的问题了。</p><p>对象的属性结构，其实就是一颗树结构，递归方案的深拷贝，其实也就是以深度优先来遍历对象的属性树。</p><p>但遍历树结构数据，除了使用递归方案外，也可以使用循环来遍历，但是需要借助相应的数据结构。</p><p>当使用循环来遍历树，且深度优先时，那么就需要借助栈；如果是广度优先时，则是需要借助队列。</p><p>具体做法则是，一次只处理一个节点，处理节点时遍历取出它所有子节点，代码上也就是双层循环，比如说：</p><ol><li>从树根节点开始，遍历它的第一层子节点，把这些节点都放入栈或队列中，结束本次循环；</li><li>下次循环开始，取出栈顶或队头节点处理：若该节点还有子节点，那么遍历取出所有子节点，放入栈或队列中，结束本次循环；</li><li>重复第2步，直至栈或队列中无节点；</li><li>如果是用栈辅助，则对应深度优先遍历；如果是用队列辅助，则对应广度优先。</li></ol><p>所以，这里用循环遍历对象属性树的方式来解决栈溢出问题。</p><ul><li><strong>代码</strong></li></ul><p>最后就看看实现的代码，这里给出两个版本，分别是未处理栈溢出场景（递归方案）、循环替代递归：</p><p><strong>未处理栈溢出版（递归方案）：</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 递归遍历对象的属性树
function cloneDeep(source, hash = new WeakMap()) {
    // 1. 非对象类型数据，直接返回
    if (!(typeof source === &#39;object&#39; &amp;&amp; source !== null)) {
        return source;
    }
    // 2. 复用已拷贝的对象，解决引用关系丢失和循环引用问题
    if (hash.get(source)) {
        return hash.get(source);
    }
    
    // 3. 区分对象和数组
    let target = Array.isArray(source) ? [] : {};
    hash.set(source, target);  // 缓存已拷贝的对象
    
    // 4. 遍历对象所有自有属性，包括 Symbol
    Reflect.ownKeys(source).forEach(key =&gt; {
        // 跳过自有的不可枚举的属性
        if (!Object.getOwnPropertyDescriptor(source, key).enumerable) {
            return;
        }
       	// 对象类型再继续递归遍历，其他类型直接赋值拷贝
        if (typeof source === &#39;object&#39; &amp;&amp; source !== null) {
            target[key] = cloneDeep(source[key], hash);
        } else {
            target[key] = source[key];
        }
    });
    
    return target;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>循环替代递归版（循环方案）：</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 循环遍历对象的属性树，跟递归方案中相同代码用途是一样的，这里就不注释了
function cloneDeep(source) {
    if (!(typeof source === &#39;object&#39; &amp;&amp; source !== null)) {
        return source;
    }
    let target = Array.isArray(source) ? [] : {};
    let hash = new WeakMap();
    
    // 将根节点放入栈中，节点结构说明：data 存储当前属性值，key 存储属性名，target 含义：target[key] = data
    let stack = [{
        data: source,
        key: undefined,
        target: target
    }];
    
    // 因为是借助 stack 栈辅助，所以是深度优先遍历，每次循环只处理一个节点
    while(stack.length &gt; 0) {
        let node = stack.pop();
        if (typeof node.data === &#39;object&#39; &amp;&amp; node.data !== null) {
            // 当前对象有已拷贝过的缓存，则直接用缓存，解决引用关系丢失问题
            if (hash.get(node.data)) {
                node.target[node.key] = hash.get(node.data);
            } else {
                let target;
                // 构建拷贝对象的属性层次结构
                if (node.key !== undefined) {
                    target = Array.isArray(node.data) ? [] : {};
                    node.target[node.key] = target;
                } else {
                    target = node.target;
                }
                hash.set(node.data, target);
                Reflect.ownKeys(node.data).forEach(v =&gt;{
                    if (!Object.getOwnPropertyDescriptor(node.data, v).enumerable) {
                        return;
                    }
                    stack.push({
                        data: node.data[v],
                        key: v,
                        target: target
                    }) 
                });
            }
        } else {
            // 当前节点是非对象类型，直接拷贝
            node.target[node.key] = node.data;
        }
    }
    return target;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试用例：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 测试用例
var a = {};
var o = {
    a: a,
    b: a,
    c: Symbol(),
	[Symbol()]: 1,
	d: function() {},
	e(){},
	f: () =&gt; {},
	get g(){},
	h: 1,
	i: &#39;sdff&#39;,
	j: null,
	k: undefined,
	o: /sdfdf/,
	p: new Date()
}

var o1 = cloneDeep(o);
o1;
/**
{
    a: {}
    b: {}
    c: Symbol()
    d: ƒ ()
    e: ƒ e()
    f: () =&gt; {}
    g: undefined
    h: 1
    i: &quot;sdff&quot;
    j: null
    k: undefined
    l: {l: {…}, p: {…}, o: {…}, k: undefined, j: null, …}
    o: {}
    p: {}
    Symbol(): 1
}
*/
// 正则的数据和 Date 数据都丢失了，这是因为判断对象的逻辑导致，typeof xx === &#39;object&#39; 无法区别内置对象，想要解决，可以修改判断对象的逻辑，比如使用 Object.prototype.toString.call(xxx) 结合 Array.isArray 来只筛选出基本对象和数组类型
// get 存取器也只能拷贝到读取的时，无法拷贝 get 方法


// 测试栈溢出场景可借助该方法
function createData(deep, breadth) {
    var data = {};
    var temp = data;

    for (var i = 0; i &lt; deep; i++) {
        temp = temp[&#39;data&#39;] = {};
        for (var j = 0; j &lt; breadth; j++) {
            temp[j] = j;
        }
    }

    return data;
}

var a = createData(10000);

cloneDeep(a); // 是否会栈溢出
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实，这通用版也不是100%通用，它仍旧有一些局限性，比如：</p><ul><li>没有考虑 ES6 的 set，Map 等新的数据结构类型</li><li>拷贝后的对象的原型链结构，继承关系丢失问题</li><li>get，set 存取器逻辑无法拷贝</li><li>没有考虑属性值是内置对象的场景，比如 /sfds/ 正则，或 new Date() 日期这些类型的数据</li><li>等等</li></ul><p>虽然如此，但这种方案已经大体上适用于绝大多数的场景了，如有问题，或者有新的需求，再根据需要进行扩展就可以了，欢迎指点一下。</p><h4 id="json-parse-stringify-版" tabindex="-1"><a class="header-anchor" href="#json-parse-stringify-版" aria-hidden="true">#</a> JSON.parse/stringify 版</h4><p>这是实现深拷贝最简单的一种方案，但是有很大局限性，只适用于部分场景：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var o = {
    a: 1,
    b: [1, 2, {a: 1}]
}

var o1 = JSON.parse(JSON.stringify(o));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它的原理很简单，就是借助现有工具 JSON，先将对象序列化，再反序列化得到一个新对象，这样一来，新对象跟原对象就是两个相互独立，互不影响的对象了，以此来实现深拷贝。</p><p>但它有很大的局限性，因为需要依赖于 JSON 的序列化和反序列化基础，比如说：</p><ul><li>不能序列化函数，属性值是函数的会丢失掉</li><li>不能处理 Symbol 数据，不管是属性名还是属性值是 Symbol 的，都会丢失掉</li><li>不能识别属性值手动设置为 undefined 的场景，会被认为是访问一个不存在的属性，从而导致丢失</li><li>不能解决循环引用问题</li><li>不能处理正则</li><li>等等</li></ul><p>使用这种方案，还是有很多局限性，看个代码就清楚了：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var o = {
    a: 1,
    [Symbol()]: 1,
    c: Symbol(),
    d: null,
    e: undefined,
    f: function() {},
    g() {},
    h: /sdfd/
}
var o1 = JSON.parse(JSON.stringify(o));
o1; // {a: 1, d: null, h: {}}
// 属性 c, e, f, g 都丢失掉了，h 属性值为正则表达式，也无法正常处理
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么，这种方案的深拷贝就没有什么用处吗？</p><p>也不是，它有它适用的场景，想想 JSON 是什么，是处理 json 对象的工具啊，而 json 对象通常是用来跟服务端交互的数据结构，在这种场景里，你一个 json 对象里，会有那些 Symbol、正则、函数奇奇怪怪的属性吗？显然不会。</p><p>所以，对于规范的 json 对象来说，如果需要进行深拷贝，那么就可以使用这种方案。</p><p>通俗点说，在项目中的使用场景也就是对后端接口返回的 json 数据需要深拷贝时，就可以使用这种方案。</p><p>（以上个人理解，有误的话，欢迎指点一下）</p><h4 id="object-assign-版" tabindex="-1"><a class="header-anchor" href="#object-assign-版" aria-hidden="true">#</a> Object.assign 版</h4><p>上面的深拷贝方案只是将一个对象完完整整拷贝一份出来，新对象数据和原对象数据都是一模一样的，算是副本。</p><p>但如果，需求是要类似 Object.assign 这种，将一个原对象完完整整拷贝到另一个已存在的目标对象上面呢？这种场景，拷贝后的新对象就跟原对象不是一样的了，而是两者的交集，冲突的拷贝的原对象为主。</p><p>这种场景上面的深拷贝方案就不适用了，这里参考 Object.assign 原理扩展实现 assignDeep，实现可将指定的原对象们，拷贝到已存在的目标对象上：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 递归版
function assignDeep(target, ...sources) {
    // 1. 参数校验
    if (target == null) {
        throw new TypeError(&#39;Cannot convert undefined or null to object&#39;);
    }

    // 2. 如果是基本类型数据转为包装对象
    let result = Object(target);
	
    // 3. 缓存已拷贝过的对象，解决引用关系丢失问题
    if (!result[&#39;__hash__&#39;]) {
        result[&#39;__hash__&#39;] = new WeakMap();
    }
    let hash  = result[&#39;__hash__&#39;];

    sources.forEach(v =&gt; {
        // 4. 如果是基本类型数据转为对象类型
        let source = Object(v);
        // 5. 遍历原对象属性，基本类型则值拷贝，对象类型则递归遍历
        Reflect.ownKeys(source).forEach(key =&gt; {
            // 6. 跳过自有的不可枚举的属性
            if (!Object.getOwnPropertyDescriptor(source, key).enumerable) {
                return;
            }
            if (typeof source[key] === &#39;object&#39; &amp;&amp; source[key] !== null) {
                // 7. 属性的冲突处理和拷贝处理
                let isPropertyDone = false;
                if (!result[key] || !(typeof result[key] === &#39;object&#39;) 
                    || Array.isArray(result[key]) !== Array.isArray(source[key])) {
                    // 当 target 没有该属性，或者属性类型和 source 不一致时，直接整个覆盖
                    if (hash.get(source[key])) {
                    	result[key] = hash.get(source[key]);
                        isPropertyDone = true;
                    } else {
                        result[key] = Array.isArray(source[key]) ? [] : {};
                        hash.set(source[key], result[key]);
                    }
                }
                if (!isPropertyDone) {
                    result[key][&#39;__hash__&#39;] = hash;
                    assignDeep(result[key], source[key]);
                }
            } else {
                Object.assign(result, {[key]: source[key]});
            }
        });
    });

    delete result[&#39;__hash__&#39;];
    return result;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,94),m={href:"https://github.com/woshidasusu/Doc/blob/master/%E9%9D%A2%E8%AF%95%E9%A2%98/%E6%89%8B%E5%86%99/%E6%89%8B%E5%86%99%E5%AE%9E%E7%8E%B0%E6%B7%B1%E6%8B%B7%E8%B4%9D.md",target:"_blank",rel:"noopener noreferrer"};function o(p,g){const n=d("ExternalLinkIcon");return a(),r("div",null,[u,e("blockquote",null,[e("p",null,[i("本文参考："),e("a",t,[i("面试题之如何实现一个深拷贝"),s(n)])])]),b,e("p",null,[i("上面只给了递归版，存在栈溢出可能性，但基本没这种对象层次太深的场景，想了解其他实现如循环版以及详细内容的，可以去我另一篇文章查阅："),e("a",m,[i("扩展 Object.assign 实现深拷贝"),s(n)])])])}const y=l(c,[["render",o],["__file","手写实现深拷贝.html.vue"]]);export{y as default};
