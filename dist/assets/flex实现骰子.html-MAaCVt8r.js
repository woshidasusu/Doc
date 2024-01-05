import{_ as e,o as n,c as t,d as i}from"./app-pwInIdNR.js";const s={},l=i(`<h1 id="flex-实现骰子布局" tabindex="-1"><a class="header-anchor" href="#flex-实现骰子布局" aria-hidden="true">#</a> flex 实现骰子布局</h1><div style="display:flex;width:80px;height:80px;background:gray;justify-content:center;align-items:center;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>// justify-content:center + align-items: center
&lt;div style=&quot;display:flex;justify-content:center;align-items:center;&quot;&gt;
    &lt;span&gt;&lt;/span&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div style="display:flex;width:80px;height:80px;background:gray;justify-content:space-around;align-items:center;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>// justify-content:space-between + align-items: center
&lt;div style=&quot;display:flex;justify-content:space-between;align-items:center;&quot;&gt;
    &lt;span&gt;&lt;/span&gt;
    &lt;span&gt;&lt;/span&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div style="display:flex;justify-content:center;width:80px;height:80px;background:gray;"><span style="align-self:flex-start;width:20px;height:20px;background:black;border-radius:20px;"></span><span style="align-self:center;width:20px;height:20px;background:black;border-radius:20px;"></span><span style="align-self:flex-end;width:20px;height:20px;background:black;border-radius:20px;"></span></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>// align-self: flex-start/center/flex-end
&lt;div style=&quot;display:flex;justify-content:space-between;align-items:center;&quot;&gt;
    &lt;span&gt;&lt;/span&gt;
    &lt;span&gt;&lt;/span&gt;
    &lt;span&gt;&lt;/span&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div style="display:flex;flex-direction:column;justify-content:space-around;width:80px;height:80px;background:gray;"><div style="display:flex;justify-content:space-around;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div><div style="display:flex;justify-content:space-around;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>// 爷：flex-direction: column;justify-content: space-around;
// 爸：justify-content:space-between * 2
&lt;div style=&quot;display:flex;flex-direction: column;justify-content: space-around;&quot;&gt;
    &lt;div style=&quot;display:flex;justify-content: space-around;&quot;&gt;
        &lt;span&gt;&lt;/span&gt;
        &lt;span&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;div style=&quot;display:flex;justify-content: space-around;&quot;&gt;
        &lt;span&gt;&lt;/span&gt;
        &lt;span&gt;&lt;/span&gt;
    &lt;/div&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div style="display:flex;flex-direction:column;justify-content:space-around;width:80px;height:80px;background:gray;"><div style="display:flex;justify-content:space-around;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div><span style="align-self:center;width:20px;height:20px;background:black;border-radius:20px;"></span><div style="display:flex;justify-content:space-around;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>// 爷：flex-direction: column;justify-content: space-around;
// 爸：justify-content:space-between * 2 + align-self: center;
&lt;div style=&quot;display:flex;flex-direction: column;justify-content: space-around;&quot;&gt;
    &lt;div style=&quot;display:flex;justify-content: space-around;&quot;&gt;
        &lt;span&gt;&lt;/span&gt;
        &lt;span&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;span style=&quot;align-self:center;&quot;&gt;&lt;/span&gt;
    &lt;div style=&quot;display:flex;justify-content: space-around;&quot;&gt;
        &lt;span&gt;&lt;/span&gt;
        &lt;span&gt;&lt;/span&gt;
    &lt;/div&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div style="display:flex;flex-direction:column;justify-content:space-around;width:80px;height:80px;background:gray;"><div style="display:flex;justify-content:space-around;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div><div style="display:flex;justify-content:space-around;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div><div style="display:flex;justify-content:space-around;"><span style="width:20px;height:20px;background:black;border-radius:20px;"></span><span style="width:20px;height:20px;background:black;border-radius:20px;"></span></div></div><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>// 爷：flex-direction: column;justify-content: space-around;
// 爸：justify-content:space-between * 3
&lt;div style=&quot;display:flex;flex-direction: column;justify-content: space-around;&quot;&gt;
    &lt;div style=&quot;display:flex;justify-content: space-around;&quot;&gt;
        &lt;span&gt;&lt;/span&gt;
        &lt;span&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;div style=&quot;display:flex;justify-content: space-around;&quot;&gt;
        &lt;span&gt;&lt;/span&gt;
        &lt;span&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;div style=&quot;display:flex;justify-content: space-around;&quot;&gt;
        &lt;span&gt;&lt;/span&gt;
        &lt;span&gt;&lt;/span&gt;
    &lt;/div&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),a=[l];function d(r,c){return n(),t("div",null,a)}const p=e(s,[["render",d],["__file","flex实现骰子.html.vue"]]);export{p as default};
