import{_ as a,r as d,o as l,c as t,a as i,b as e,e as v,d as n}from"./app-dV2aVdq6.js";const r={},u=n('<h1 id="谈谈我用vuex的一些想法" tabindex="-1"><a class="header-anchor" href="#谈谈我用vuex的一些想法" aria-hidden="true">#</a> 谈谈我用vuex的一些想法</h1><h3 id="大纲" tabindex="-1"><a class="header-anchor" href="#大纲" aria-hidden="true">#</a> 大纲</h3><p>本文内容更多的是讲讲使用 vuex 的一些心得想法，所以大概会讲述下面这些点：</p><p><strong>Q1：我为什么会想使用 vuex 来管理数据状态交互？</strong></p><p><strong>Q2：使用 vuex 框架有哪些缺点或者说副作用？</strong></p><p><strong>Q3：我是如何在项目里使用 vuex 的？</strong></p><h3 id="初识-vuex" tabindex="-1"><a class="header-anchor" href="#初识-vuex" aria-hidden="true">#</a> 初识 vuex</h3><p><img src="https://vuex.vuejs.org/vuex.png" alt="引自官方图片https://vuex.vuejs.org/vuex.png"></p>',8),c={href:"https://vuex.vuejs.org/zh/",target:"_blank",rel:"noopener noreferrer"},m=n(`<p>喜欢的人觉得它可以很好的解决复杂的数据交互场景</p><p>反感的人觉得它有各种缺点：</p><ul><li>繁琐冗余的代码编写</li><li>维护性差的字符串形式变量注入</li><li>过于依赖 vue 框架导致异步扩展场景差</li></ul><p>这其中，有一个很模糊的点，复杂的数据交互场景并没有一个衡量标准，每个人都有自己的见解</p><p>再加上不同人有着不同的项目经历，这就造成了经常会出现有趣的现象：你体会不到我为什么非要使用 vuex，他理解不了这种场景何须使用 vuex，我也讲不明白选择 vuex 的缘由</p><p>借用官网文档一句话：</p><blockquote><p>您自会知道什么时候需要它</p></blockquote><p>很玄乎，更通俗来讲就是，多踩点坑，多遭遇些痛点，当你的最后一根稻草被压垮时，自然就会去寻找更好的方案解决</p><p>我一直都不喜欢 vuex，因为我觉得它的 <code>mapMutations</code> 或者 <code>mapState</code> 注入到 vue 里的变量和方法都是字符串，极大的破坏了代码的可读性和维护性，没办法通过 idea 快速的跳转到变量定义的地方</p><p>当然，你也可以定义一些静态变量来替换这些字符串就可以解决跳转问题，但代价就是代码更繁琐了，本来使用 vuex 时就需要写一堆繁琐的代码，这下更麻烦</p><p>还有一个不想使用 vuex 的原因是因为我的项目业务逻辑挺复杂，除了 vue 单文件外，项目里还划分了来负责业务逻辑或异步任务的 js 层代码，而 vuex 是为 vue 框架而设计的，存放在 vuex 数据中心里的变量可以通过它的一些工具方法来注入到 vue 组件的 computed 计算属性里方便直接使用，比如</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// xxx.vue
import { mapState } from &#39;vuex&#39;

export default {
  computed: {
    // 映射 this.count 为 this.$store.state.xxxModule.count
    ...mapState({
    	count: state =&gt; state.xxxModule.count
  	})
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但如果想在 js 文件里使用 vuex 里的数据，就会比较繁琐：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>import store from &#39;store&#39;

// 你需要很清晰的知道模块命名，变量命名
console.log(store.state.xxxModule.count);

// vuex 不建议在外部直接修改数据对象，因此一些异步请求等场景的数据对象赋值操作还需要通过 dispatch，commit 等方式
store.dispatch(&#39;fetchData&#39;);
store.commit(&#39;xxxModule/updateCount&#39;, 0);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基于以上种种原因，我迟迟未在项目里使用 vuex</p><p><strong>那么，我最后为什么又选择使用了 vuex 呢？</strong></p><ol><li><p>项目的一些数据交互场景使用 vue 原生的输入输出方案已经不足以支持我的需求场景了</p></li><li><p>我想办法解决了我没法忍受的 vuex 的几个缺点了</p></li><li><p>这是个新项目，并没有复杂的业务场景，项目基本由 vue 单文件来书写即可</p></li></ol><p>简单来说，就是有个新项目符合适用 vuex 的场景，而且一些组件的数据交互场景使用原生输入输出方案过于繁琐</p><p>vuex 刚好能够解决我的需求场景，虽然 vuex 有一定的使用成本，但 vuex 的这些缺点恰好又被我想了一些法子解决或简化掉</p><p>这样一来，引入 vuex 既能解决我的诉求，又不会引入太多我无法接受的缺点，那自然可以来玩一玩</p><h3 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h3><p>vue 框架是基于组件机制来组装成页面，所以页面数据是分散到各个组件间，而组件间的数据交互使用的是 vue 自带的<strong>输入（props）输出（$emit）机制</strong></p><p>这种数据交互方案有个特点：数据对象都存储在组件内部，交互需要通过输入和输出</p><p>而输入输出机制有个<strong>缺点</strong>：页面复杂时，经常需要层层传递数据，因为非父子组件间的交互，只能寻找最近的祖先组件来做中转</p><p>同时，输入输出机制还有一个<strong>局限性</strong>：当不同页面的组件需要进行数据交互时，它就无能为力了</p><p>平常开发，这种输入输出的方案也基本满足了</p><p>但如果有下面这些场景时，输入输出方案就有点捉襟见肘了：</p><ul><li>需要跨页面的数据交互场景</li><li>需要将数据做内存级的持久化处理的场景</li><li>组件层次复杂，存在 props 和 $emit 层层传递数据的场景</li></ul><p>这时候，如果接受不了输入输出方案的用法，那么就可以研究新方案了</p><p>解决以上这些场景的方案很多，但从本质上来讲，都可以统归为：<strong>数据中心方案</strong></p><p>这种数据中心方案思路就是：将数据对象从组件内部移出到外部存储维护，需要使用哪个数据变量的组件自行去数据中心取</p><p>vue 其实也有机制可以达到这种效果，如：依赖注入。但慎用，太破坏数据流的走向了，一不小心，就不知道数据来自哪里了</p><p>我们也可以自己用 js 来实现一个数据中心，专门建个 js 文件来存储维护数据模型，需要数据变量的组件引入 js 文件来读取</p><p>但每个数据中心都必须解决两个问题：<strong>数据复用和数据污染</strong>，通俗来讲就是数据初始化和重置，也就是数据的生命周期</p><p>数据复用是为了确保不同组件间从数据中心里读取时，是同一份数据副本，这才能达到数据交互目的</p><p>而数据污染是指不同模块间使用同个数据中心时，数据模型是否可以达到相互独立，互不影响的效果，这通常是某个功能在不同模块间被复用时会出现的场景；如果这种场景不好理解，那么也可以想想这种场景：再次加载该页面，组件再次被创建后，从数据中心里读取的数据副本是否是相互独立的</p><p>如果数据存储在 vue 组件内部，那数据的生命周期就是跟随着组件的创建和销毁。这也是为什么 data 通常建议是一个返回对象的函数，因为这样每次创建 vue 实例后，调用一下 data 就可以生成新的一份数据副本挂载到实例对象上，实例内部其他方法也就可以通过 this.xxx 来访问，不同实例数据副本自然相互独立</p><p>但数据从 vue 组件内部移出，存储到数据中心，那么这些处理就需要自己来实现：什么时候创建、什么时候销毁，如何维护这些数据副本等等</p><p>所以，数据中心并不是简单建个 js 类，里面声明下数据对象就完事了的</p><p>基于此，我选择使用 vuex</p><h3 id="vuex-副作用" tabindex="-1"><a class="header-anchor" href="#vuex-副作用" aria-hidden="true">#</a> vuex 副作用</h3><p>先看个使用 vuex 的简单例子：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// 声明
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})

// vue 里使用
import { mapMutations } from &#39;vuex&#39;
import { mapState } from &#39;vuex&#39;

export default {
  // ...
  computed: {
     ...mapState({
         // 将 \`this.count\` 映射为 \`this.$store.state.count\`
         count: state =&gt; state.count
     })   
  },
  methods: {
    ...mapMutations([
      &#39;increment&#39;, // 将 \`this.increment()\` 映射为 \`this.$store.commit(&#39;increment&#39;)\`
    ])
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>仅仅简单定义个数据对象，就需要至少四个步骤：</p><ol><li>声明对象模型 state</li><li>声明对象操作方法 mutation</li><li>然后在相应的 vue 组件内先通过 mapState 注入变量的读方法</li><li>再通过 mapMutations 注入变量的写方法</li></ol><p>而以上这么多繁琐的代码，在原本的 vue 机制里，就是简单的在 data 里声明下变量就完事，这一对比，vuex 的使用上，复杂度和繁琐度很大</p><p>所以很多人不喜欢用它，官方也说简单的页面没有必要去使用它</p><p>这是我觉得 vuex 的第一个缺点，或者说副作用：<strong>繁琐冗余的代码编写</strong></p><p>第二个我觉得 vuex 的缺点就是，<code>mapState</code> 或 <code>mapMutation</code> 注入到 vue 里的变量，都是字符串的</p><p>字符串就意味着，你在 vue 单文件内其他地方通过 <code>this.xxx</code> 使用这些变量时，无法享受代码补全提示、声明位置跳转等快捷工具，因为字符串无法被识别</p><p>这是我特别无法接受的一点，<strong>降低我的维护、开发效率</strong></p><p>不过这点因人而异，有人觉得它不是个问题，或者使用个静态变量来替换字符串也可以解决，但这些我个人是没办法接受</p><p>但 vue 原生输入输出的数据交互又不足够支撑我的一些需求场景，自己用 js 实现个数据中心吧，又担心没强制好规范，后期很容易跑偏掉，被乱用，那就更难维护了，想了想，还是想想办法搞定 vuex 的几个缺点吧</p><h3 id="如何更简易的使用-vuex" tabindex="-1"><a class="header-anchor" href="#如何更简易的使用-vuex" aria-hidden="true">#</a> 如何更简易的使用 vuex</h3><p>先说下，我虽然用了些方法，让我使用 vuex 可以达到我个人的预期：既满足我的需求场景，又不至于引入太多缺点或者说副作用</p><p>但实际上，我的这些设计，相当于对 vuex 制定了不同于官方示例的使用规范，别人不一定能接受我的这种规范用法</p><p>所以，这篇更多的是分享我的一些思路和想法，有一说一，并不通用，欢迎拍砖</p><p>就我个人对于 vuex 的缺点，我所不能接受的就两点：</p><ul><li>繁琐冗余的代码编写</li><li>维护性差、可读性差的字符串变量注入</li></ul><p>那么，就是得想办法解决这两个问题，先来说第一个</p><h4 id="封装工具来自动生成代码解决-vuex-使用繁琐问题" tabindex="-1"><a class="header-anchor" href="#封装工具来自动生成代码解决-vuex-使用繁琐问题" aria-hidden="true">#</a> 封装工具来自动生成代码解决 vuex 使用繁琐问题</h4><p>用 vuex 需要编写很多繁琐的代码，这些代码是少不了的，既然少不了，那换个思路，不用我来编写不就好了</p><p>想办法提取共性，封装个工具方法，让它来生成每次使用 vuex 的那些繁琐代码，这样一来，使用就方便了</p><p>state 里声明的数据对象模型，这些代码是没办法自动生成的，毕竟数据模型都不一样</p><p>而修改数据变量的 mutation 代码就可以想办法来自动生成了，思路就是简化 mutation 职责，让它只负责基本的赋值、拷贝操作即可：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>/**
 * 根据 state 对象属性自动生成 mutations 更新属性的方法，如：
 * state: {
 *  projectId: &#39;&#39;,
 *  searchParams: {
 *      batchId: &#39;&#39;
 *  }
 * }
 *
 * ===&gt;
 *
 * {
 *  updateProjectId: (state, payload) =&gt; { state.projectId = payLoad }
 *  updateSearchParams: (state, payload) =&gt; { state.searchParams = {...state.searchParams, ...payload} }
 *  updateBatchId: (state, payload) =&gt; { state.searchParams.batchId = payload }
 * }
 *
 * 非对像类型的属性直接生成赋值操作，对象类型属性会通过扩展运算符重新生成对象
 * 且会递归处理内部对象的属性，扁平化的生成 updateXXX 方法挂载到 mutations 对象上
 * @param {Object} stateTemplate
 */
export function generateMutationsByState(stateTemplate) {
  let mutations = {};
  // 遍历 state 数据模型对象的属性 key 值
  Object.keys(stateTemplate).forEach(key =&gt; {
    let obj = {};
    let value = stateTemplate[key];
    // 根据 key 值生成对应的 mutation 的方法名。比如 key = count，生成 updateCount 的方法名
    let updateKey = \`update\${key[0].toUpperCase()}\${key.substr(1)}\`;
    if (typeof value === &#39;object&#39; &amp;&amp; value != null &amp;&amp; !Array.isArray(value)) {
      // 如果该属性是对象类型，生成以下的对象浅拷贝的 updateXXX 方法
      obj[updateKey] = (state, payload) =&gt; {
        state[key] = { ...state[key], ...payload };
      };
      // 继续递归处理内部对象的属性，将嵌套对象的属性扁平化生成 updateXXX 方法，所以注意不要有同名的属性，否则这里需要扩展
      handleInnerObjState([key], value, obj);
    } else {
      // 如果该属性是基本数据类型，那生成赋值的 updateXXX 方法
      obj[updateKey] = (state, payload) =&gt; {
        state[key] = payload;
      };
    }
    // 将生成的所有 updateXXX() 方法挂载到 mutations 对象上返回
    Object.assign(mutations, obj);
  });
  return mutations;
}

/** 
* 递归处理内部对象的属性，目的和逻辑跟上面方法基本类似，唯一区别就是变量的使用需要拼接上挂载的父对象，如：
 * state: {
 *  searchParams: {
 *      batchId: &#39;&#39;
 *  }
 * }
 * 内部对象 searchParams 的 batchId 生成的 mutation 方法为：
 * updateBatchId(state, payload) {
 * 	 state.searchParams.batchId = payload;
 * }
*/
function handleInnerObjState(parentKeyPath, innerState, obj) {
    Object.keys(innerState).forEach(key =&gt; {
      let value = innerState[key];
      let updateKey = \`update\${key[0].toUpperCase()}\${key.substr(1)}\`;
      if (typeof value === &#39;object&#39; &amp;&amp; value != null &amp;&amp; !Array.isArray(value)) {
        obj[updateKey] = (state, payload) =&gt; {
          let target = state;
          // 拼接变量挂载的父对象取值操作
          for (let i = 0; i &lt; parentKeyPath.length; i++) {
            target = target[parentKeyPath[i]];
          }
          target[key] = { ...target[key], ...payload };
        };
        handleInnerObjState([...parentKeyPath, key], value, obj);
      } else {
        obj[updateKey] = (state, payload) =&gt; {
          let target = state;
          // 拼接变量挂载的父对象取值操作
          for (let i = 0; i &lt; parentKeyPath.length; i++) {
            target = target[parentKeyPath[i]];
          }
          target[key] = payload;
        };
      }
    });
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再来就是 mapState 和 mapMutation 注入到 vue 组件的这些代码也可以自动生成，思路就是借助 computed 计算属性可以接受 set 和 get 的使用方式</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>export default {
    computed: {
        // 定义 this.count 变量的读和写方法
        count: {
          set(value) {
            // ...
          },
          get() {
            // ...
          }
        },
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，封装个工具方法，自动将 state 数据对象的属性生成 computed 所需的 set 和 get 代码，这样就可以直接替换掉 <code>mapState </code> 和 <code>mapMutation </code> 两个操作，同时注入到 vue 的 computed 里的计算属性变量，使用上更加方便，就跟使用 data 里声明的变量一样，没有什么区别</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>import store from &#39;./index&#39;;
/**
 * 将 store 里指定的 state 转成计算属性 computed 的 set() get()
 * vue 里就可以直接类似操作 data 属性一样使用 state
 *
 * @param {String} moduleName state 所属的 store 的 module 名
 * @param {Array} states 待处理的 states e.g: [&#39;project&#39;, &#39;searchParams.projectName&#39;] 其中，
 * 挂载在 computed 上的属性名，默认等于 state，当 state 结构多层时，取最后一层的属性名
 *
 * ps: state 对应的 mutation 必须以 updateXXX 方式命名
 */
export function storeToComputed(moduleName, states) {
  if (!store) {
    throw new TypeError(&#39;store is null&#39;);
  }
  if (!moduleName) {
    throw new TypeError(&quot;state&#39;s module name is null&quot;);
  }
  if (!states || !Array.isArray(states) || states.length === 0) {
    throw new TypeError(&#39;states is null or not array&#39;);
  }
  let computed = {};
  // 遍历需要注入到 vue 里的 state 数据变量
  states.forEach(state =&gt; {
    if (state.indexOf(&#39;.&#39;) !== -1) {
      // 支持注入 state 内部对象的内层属性变量，挂载到 computed 上的变量名取最后一层的属性名即可
      let _states = state.split(&#39;.&#39;);
      let _key = _states[_states.length - 1];
      computed[_key] = {
        get() {
          // get 方法直接返回 store 里存储的数据变量值
          let res = store.state[moduleName];
          for (let i = 0; i &lt; _states.length; i++) {
            res = res[_states[i]];
          }
          return res;
        },
        set(value) {
          // set 方法交由内部调用 store 的 commit 方法，自动根据属性名来调用对应的 mutation 
          store.commit(
            \`\${moduleName}/update\${_key[0].toUpperCase()}\${_key.substr(1)}\`,
            value
          );
        },
      };
    } else {
      // 处理一层结构的属性变量
      computed[state] = {
        get() {
          return store.state[moduleName][state];
        },
        set(value) {
          store.commit(
            \`\${moduleName}/update\${state[0].toUpperCase()}\${state.substr(1)}\`,
            value
          );
        },
      };
    }
  });

  return computed;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么最终可以达到的效果就是：</p><ul><li>只需在 store 文件里声明 state 数据变量</li><li>然后再需要注入的 vue 组件里注入即可</li></ul><p>如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// store
import { generateMutationsByState } from &#39;./helper&#39;;

// 只需在这里声明并维护数据模型对象即可
const global = {
    state: {
        count: 0
    }
}

// mutations 交由工具方法生成
global.mutations = generateMutationsByState(global.state);

const store = new Vuex.Store({
    modules: {
        global
    }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>// vue里使用
import { storeToComputed } from &#39;@/store/storeToComputed&#39;;

export default {
  // ...
  computed: {
      // 将 this.$store.state.global.count 映射成 this.count
     ...storeToComputed(&#39;global&#39;, [&#39;count&#39;])
  },
  // 通过 storeToComputed 工具方法，就可以将 store 里的 count 变量的写方法和读方法注入进去
  // 其他需要使用的地方直接 this.count 即可
  // this.count 实际内部会调用 store 去 global 模块里取数，相当于 this.$store.state.global.count 操作
  // this.count = &#39;xx&#39; 实际内部会调用 store.commit(&#39;updateCount&#39;, &#39;xx&#39;) 来通知 store 进行写操作
  // 对于 vue 角色来说，无需再与 vuex 进行交互，这些都在工具方法内部封装好，vue 里操作这些数据变量时，跟操作 data 里的变量没有什么区别
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我的这种用法，其实就只是单纯将 vuex 拿来作为数据中心使用而已，在 store 文件里不编写逻辑代码，简化 mutation 职责，也不使用 action</p><p>这种用法的好处，就可以将需要跟 vuex 打交道的工作交给工具方法来处理，这样一来，vue 里使用数据变量时，会跟原本在 vue 的 data 里声明变量后的用法比较类似</p><p>因为就是将原本定义在 data 里的变量换成定义在专门的 store 文件里，然后再多一步将变量通过工具方法注入到 vue 的 computed 里，接下去的使用变量的任何场景，在哪赋值，在哪取值，哪里处理异步请求等等的代码，原本怎么写，现在还是怎么写，完全不影响</p><p>这就意味着，这种方案后续如果有缺陷，或者用不习惯，那么想切换到 vue 原生的输入输出方案非常方便，影响点、改动点都会比较少，就是将 storeToComputed 注入到 computed 的变量换到 data 就完事了</p><p>甚至说，后续想换掉 vuex 也会比较方便，毕竟只是单纯用它当做数据中心而已</p><p>然后再配合上 vuex 的动态挂载和卸载的用法，这个数据中心就可以像 angular 框架那样做到精确控制数据对象的作用域和生命周期，全局共享、模块间共享、页面内共享、组件内共享等都可以很方便做到，这样一来，数据交互就不怕复杂场景了</p><p>这是我之所以会这么使用 vuex 的考虑</p><h4 id="自定义-vscode-插件解决字符串变量的跳转问题" tabindex="-1"><a class="header-anchor" href="#自定义-vscode-插件解决字符串变量的跳转问题" aria-hidden="true">#</a> 自定义 vscode 插件解决字符串变量的跳转问题</h4><p>繁琐的代码编写问题搞定了，接下去就是看看怎么解决字符串变量注入的跳转问题了</p><p>先来说说，我为什么会在意变量支不支持利用 idea 直接跳转到声明的地方</p><p>这是因为，有些页面比较复杂，数据变量比较多，或者时间久了，很容易忘记一些变量的命名、含义</p><p>而我们通常都只会在声明的地方加上一些注释，所以利用 idea 直接快速跳转到声明的地方，对于我而已，有很多好处：</p><ul><li><p>第一，有注释可以快速帮助回忆、理清变量含义</p></li><li><p>第二，忘记变量命名全称可以快速复制使用</p></li><li><p>第三，方便我查看其它数据变量</p></li></ul><p>那么，怎么解决这个问题呢？</p><p>自然就是自己扩展开发个 vscode 插件来支持了，面向百度的话，vscode 插件开发并不困难，看几篇教程，清楚插件的生命周期和一些 API 就可以上手了</p><p>关键是，如何识别 vuex 注入的这些变量？如何跳转到 store 文件里声明数据变量的 state 位置？</p><p>如果想做成通用的插件，那可能需要多花点精力</p><p>但如果只是基于自己当前的项目来解决这个问题，那就简单多了，因为项目有一定的规范，比如 vuex 的 store 文件存放的目录地址，比如注入到 vue 组件里的使用方式，这些都是有规范和规律的，那直接根据这些规范就可以快速找到 vuex 注入的变量以及 store 的文件位置了</p><p>简单说下我的思路：</p><ol><li>先扫描项目 store 目录下文件，识别出有数据模型 (state) 的文件，解析并存储数据模型各个变量名和位置</li><li>注册 vscode 的变量操作响应，当按住 ctrl 并将鼠标移到变量上时，响应我们的插件程序</li><li>判断当前聚焦操作的变量是否是通过工具方法在 computed 里注入的变量，是则继续下一步寻找变量声明的文件位置</li><li>通过变量名和模块名到 store 里匹配变量，匹配到后，记录变量的声明信息和文件位置，当点击左键时，响应跳转行为</li></ol><p><img src="https://img.myysq.com.cn/ylys/customerservice/upload/39fafea7-88e5-180d-e9f4-4e017a95ca39_orig.gif" alt=""></p><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>最后简单总结下，项目里并不是必须要使用 vuex，vuex 所解决的场景，用 vue 原生的输入输出机制想想办法也能解决，区别可能就是代码的可读性、维护性上的区别，数据流走向是否清晰等</p><p>vuex 作为三方库，自然就是一个可选的服务，用不用，怎么用，都因人而异；考虑好自己的诉求，对比好引入前后的影响点，权衡好自己能接受的点就好</p><p>比如我，使用 vuex 的方式上说得难听点，也有点不伦不类，毕竟并没有按照官方示例来使用，反而是自己搞了套使用规范，这也增加了别人的上手成本</p><p>所以写这篇，不在于强推使用 vuex，只是从自己的一些经历分享自己使用一些三方库的心路历程，所思所想</p><p>很多时候，当你开始吐槽某某方案、当你开始无法接受某某用法时，这其实意味着，这是一次绝佳的探索机会</p><p>吐槽完就想办法去优化、去寻找新方案；接受不了时，就想办法去研究看能否解决这些痛点</p><p>人嘛，总是在一次次的踩进坑里，再爬出来</p>`,104);function p(o,b){const s=d("ExternalLinkIcon");return l(),t("div",null,[u,i("p",null,[e("对于 "),i("a",c,[e("vuex"),v(s)]),e("，有人喜欢，有人反感")]),m])}const h=a(r,[["render",p],["__file","谈谈我用vuex的一些想法2.0.html.vue"]]);export{h as default};
