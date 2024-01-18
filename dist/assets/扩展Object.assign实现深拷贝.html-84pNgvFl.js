import{_ as l,r as d,o as a,c as r,a as e,b as n,e as s,d as v}from"./app-dV2aVdq6.js";const c={},u=e("h1",{id:"扩展-object-assign-实现深拷贝",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#扩展-object-assign-实现深拷贝","aria-hidden":"true"},"#"),n(" 扩展 Object.assign 实现深拷贝")],-1),t={href:"https://muyiy.cn/blog/4/4.2.html",target:"_blank",rel:"noopener noreferrer"},b=e("h3",{id:"需求场景",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#需求场景","aria-hidden":"true"},"#"),n(" 需求场景")],-1),m={href:"https://github.com/woshidasusu/Doc/blob/master/%E9%9D%A2%E8%AF%95%E9%A2%98/%E6%89%8B%E5%86%99/%E6%89%8B%E5%86%99%E5%AE%9E%E7%8E%B0%E6%B7%B1%E6%8B%B7%E8%B4%9D.md",target:"_blank",rel:"noopener noreferrer"},o=v(`<p>但深拷贝，它是基于一个原对象，完完整整拷贝一份新对象出来，假如我们的需求是要将原对象上的属性完完整整拷贝到另外一个已存在的对象上，这时候深拷贝就有点无能为力了。</p><p>就有点类似于 Object.assign()：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = {
    a: 1,
    b: 2,
    c: {
        a: 1
    }
}

var o = Object.assign(a, {a: 2, c: {b: 2}, d: 3});
o; // {a: 2, b: 2, c: {b: 2}, d: 3}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将一个原对象上的属性拷贝到另一个目标对象上，最终结果取两个对象的并集，如果有冲突的属性，则以原对象上属性为主，表现上就是直接覆盖过去，这是 Object.assign() 方法的用途。</p><p>但很可惜的是，Object.assign 只是浅拷贝，它只处理第一层属性，如果属性是基本类型，则值拷贝，如果是对象类型，则引用拷贝，如果有冲突，则整个覆盖过去。</p><p>这往往不符合我们的需求场景，讲个实际中常接触的场景：</p><p>在一些表单操作页面，页面初始化时可能会先前端本地创建一个对象来存储表单项，对象中可能会有一些初始值，然后访问了后台接口，读取当前页的表单数据，后台返回了 json 对象，这时候我们希望当前页的表单存储对象应该是后台返回的 json 对象和初始创建的对象的并集，有冲突以后台返回的为主，如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = {
    a: {
        a: 1
    }
}

var o = {
    a: {
        b: 2
    }
}

// 我们希望得到的是：
{
    a: {
        a: 1, 
        b: 2
    }
}

Object.assign(a, b);  // {a: {b: 2}}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实，说白了，这种需求就是希望可以进行深拷贝，而且是深拷贝到一个目标对象上。</p><p>上一篇的深拷贝方案虽然可以实现深度拷贝，但却不支持拷贝到一个目标对象上，而 Object.assign 虽然支持拷贝到目标对象上，但它只是浅拷贝，只处理第一层属性的拷贝。所以，两种方案都不适用于该场景。</p><p>但两种方案结合一下，其实也就是该需求的实现方案了，所以要么扩展深拷贝方案，增加与目标对象属性的交集处理和冲突处理；要么扩展 Object.assign，让它支持深拷贝。</p><h3 id="实现方案" tabindex="-1"><a class="header-anchor" href="#实现方案" aria-hidden="true">#</a> 实现方案</h3><p>本篇就选择基于 Object.assign，扩展支持深拷贝：assignDeep。</p><p>这里同样会给出几个方案，因为深拷贝的实现可以用递归，也可以用循环，递归比较好写、易懂，但有栈溢出问题；循环比较难写，但没有栈溢出问题。</p><h4 id="递归版" tabindex="-1"><a class="header-anchor" href="#递归版" aria-hidden="true">#</a> 递归版</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function assignDeep(target, ...sources) {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>要注意的地方，其实也就是模拟实现 Object.assign 的一些细节处理，比如参数校验，参数处理，属性遍历，以及引用关系丢失问题。</p><h4 id="循环版" tabindex="-1"><a class="header-anchor" href="#循环版" aria-hidden="true">#</a> 循环版</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>function assignDeep(target, ...sources) {
    // 1. 参数校验
    if (target == null) {
        throw new TypeError(&#39;Cannot convert undefined or null to object&#39;);
    }

    // 2. 如果是基本类型，则转换包装对象
    let result = Object(target);
    // 3. 缓存已拷贝过的对象
    let hash = new WeakMap();
	
    // 4. 目标属性是否可直接覆盖赋值判断
    function canPropertyCover(node) {
        if (!node.target[node.key]) {
            return true;
        }
        if (node.target[node.key] == null) {
            return true;
        }
        if (!(typeof node.target[node.key] === &#39;object&#39;)) {
            return true;
        }
        if (Array.isArray(node.target[node.key]) !== Array.isArray(node.data)) {
            return true;
        }
        return false;
    }
    
    sources.forEach(v =&gt; {
        let source = Object(v);
        
        let stack = [{
            data: source,
            key: undefined,
            target: result
        }];

        while(stack.length &gt; 0) {
            let node = stack.pop();
            if (typeof node.data === &#39;object&#39; &amp;&amp; node.data !== null) {
                let isPropertyDone = false;
                if (hash.get(node.data) &amp;&amp; node.key !== undefined) {
                	if (canPropertyCover(node)) {
                    	node.target[node.key] = hash.get(node.data);
                        isPropertyDone = true;
                    }
                }
                
                if(!isPropertyDone) {
                    let target;
                    if (node.key !== undefined) {
                        if (canPropertyCover(node)) {
                        	target = Array.isArray(node.data) ? [] : {};
                            hash.set(node.data, target);
                            node.target[node.key] = target;
                        } else {
                            target = node.target[node.key];
                        }
                    } else {
                        target = node.target;
                    }
                    
                    Reflect.ownKeys(node.data).forEach(key =&gt; {
                        // 过滤不可枚举属性
                        if (!Object.getOwnPropertyDescriptor(node.data, key).enumerable) {
                            return;
                        }
                        stack.push({
                            data: node.data[key],
                            key: key,
                            target: target
                        });
                    });
                }
            } else {
                Object.assign(node.target, {[node.key]: node.data});
            }
        }

    });

	return result;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试用例：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>var a = {};
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

o.l = o;
var o1 = assignDeep({}, {m: {b: 2}, n: 1}, o, {n: {a: 1}});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的方案仍旧不是100%完美，仍旧存在一些不足：</p><ul><li>没有考虑 ES6 的 set，Map 等新的数据结构类型</li><li>get，set 存取器逻辑无法拷贝</li><li>没有考虑属性值是内置对象的场景，比如 /sfds/ 正则，或 new Date() 日期这些类型的数据</li><li>为了解决循环引用和引用关系丢失问题而加入的 hash 缓存无法识别一些属性冲突场景，导致同时存在冲突和循环引用时，拷贝的结果可能有误</li><li>等等未发现的逻辑问题坑</li></ul><p>虽然有一些小问题，但基本适用于大多数场景了，出问题时再想办法慢慢填坑，目前这样足够使用了，而且，当目标对象是空对象时，此时也可以当做深拷贝来使用。</p><p>当然，也欢迎指点一下。</p><h4 id="typescript-业务版" tabindex="-1"><a class="header-anchor" href="#typescript-业务版" aria-hidden="true">#</a> TypeScript 业务版</h4><p>根据实际项目中的业务需求，进行的相关处理，就没必要像上面的通用版考虑那么多细节，比如我项目中使用 ts 开发，业务需求是要解决实体类数据的初始化和服务端返回的实体类的交集合并场景。</p><p>另外，只有对象类型的属性需要进行交集处理，其余类型均直接覆盖即可：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>/**
【需求场景】：
export class ADomain {
	name: string = &#39;dasu&#39;;
	wife: B[] = [];
	type: number;
}

export class B {
	count: number = 0;
}

xxxDomain: ADomain;
xxxService.getXXX().subscript(json =&gt; {
	this.xxxDomain = json;
	if (!this.xxxDomain.wife) { // 这个处理很繁琐
		this.xxxDomain.wife = [];
	}
});

假设变量 xxxDomain 为实体类 ADomain 实例，实体类内部对其各字段设置了一些初始值；
但由于 xxxService 从后端接口拿到数据后， json 对象可能并不包含 wife 字段，
这样当将 xxxDomain = json 赋值后，后续再使用到 xxxDomain.wife 时还得手动进行判空处理，
这种方式太过繁琐，一旦实体结构复杂一点，层次深一点，判空逻辑会特别长，特别乱，特别烦

（后端不负责初始化，而之所以某些字段需要初始化，是因为界面上需要该值进行呈现）

基于该需求场景，封装了这个工具类：
【使用示例】：
xxxService.getXXX().subscript(json =&gt; {
	DomainUtils.handleUndefined(json, ADomain);
	this.xxxDomain = json;
});
*/
export class DomainUtils {
    /**
    * 接收两个参数，第一个是服务端返回的 json 对象，第二个是该对象对应的 class 类，内部会自动根据 class 创建一个新的空对象，然后跟 json 对象的每个属性两两比较，如果在新对象中发现有某个字段有初始值，但 json 对象上没有，则复制过去。
    */
    static handleUndefined(domain: object, prop) {
        let o = new prop();
        if (Array.isArray(domain)) {
            domain.forEach(value =&gt; {
                DomainUtils._clone(domain, o);
            });
        } else {
            DomainUtils._clone(domain, o);
        }
        return domain;
    }
    
    private static _clone(target: object, source: object) {
        Object.keys(source).forEach(value =&gt; {
           	if (!Array.isArray(source[value]) &amp;&amp; typeof source[value] === &#39;object&#39; &amp;&amp; source[value] !== null) {
                if (target[value] == null) {
                    target[value] = source[value];
                } else {
                    DomainUtils._clone(target[value] as object, source[value] as object);
                }
            } else {
                if (target[value] == null) {
                    target[value] = source[value];
                }
            }
        });
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为直接基于业务需求场景来进行的封装，所以我很明确参数的结构是什么，使用的场景是什么，很多细节就没处理了，比如参数的校验等。</p><p>而且，这个目的在于解决初始化问题，所以并不是一个深克隆，而是直接在原对象上进行操作，等效于将初始化的值都复制到原对象上，如果原对象同属性没有值的时候。</p>`,31);function p(g,h){const i=d("ExternalLinkIcon");return a(),r("div",null,[u,e("blockquote",null,[e("p",null,[n("本文参考： "),e("a",t,[n("Object.assign 原理及其实现"),s(i)])])]),b,e("p",null,[n("上一篇文章："),e("a",m,[n("手写实现深拷贝"),s(i)]),n("中，我们讲了浅拷贝和深拷贝，也实现了深拷贝方案。")]),o])}const f=l(c,[["render",p],["__file","扩展Object.assign实现深拷贝.html.vue"]]);export{f as default};
