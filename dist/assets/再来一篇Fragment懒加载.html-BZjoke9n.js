import{_ as l,r as a,o as r,c as d,a as e,b as n,e as s,d as v}from"./app-PjuKeMiB.js";const t={},m=v(`<h1 id="效果" tabindex="-1"><a class="header-anchor" href="#效果" aria-hidden="true">#</a> 效果</h1><p>老规矩，先来看看效果图<br><img src="http://upload-images.jianshu.io/upload_images/1924341-d8d1c58ef46e08e6.gif?imageMogr2/auto-orient/strip" alt="演示"></p><p><img src="http://upload-images.jianshu.io/upload_images/1924341-b436975d9592cfcf.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="log"></p><p>没错，我又入坑了，又重新做了个 Gank 客户端，因为之前那个代码写得太烂了，这次有好好的考虑了下架构之类的事，代码应该会更容易读懂了点了，吧。哈哈，再次欢迎来 star 交流哈。</p><p>上面的截图里有注释解析了，稍微认真点看看 log 的内容哈，看看是不是你需要的需求。</p><h1 id="fragment懒加载" tabindex="-1"><a class="header-anchor" href="#fragment懒加载" aria-hidden="true">#</a> Fragment懒加载</h1><p>如果想直接看代码，直接跳到最下面的代码部分和使用介绍即可，如果感兴趣，可以慢慢往下看看我的唠叨。</p><p>之前写过一篇 <a href="">Fragment懒加载和ViewPager的坑</a>，里面分析了 Fragment 结合 ViewPager 使用时会碰到的一些情况，以及为什么要用懒加载，如何用，感兴趣的也可以再回去看看。</p><p>后来发现，我在那篇博客里封装的 Fragment 基类不足以满足大家的懒加载需求，所以决定重新来封装一次，这次封装的支持以下的功能：</p><h3 id="_1-支持数据的懒加载并且只加载一次" tabindex="-1"><a class="header-anchor" href="#_1-支持数据的懒加载并且只加载一次" aria-hidden="true">#</a> 1.支持数据的懒加载并且只加载一次</h3><h3 id="_2-提供-fragment-可见与不可见时回调-支持你在这里进行一些-ui-操作-如显示-隐藏加载框" tabindex="-1"><a class="header-anchor" href="#_2-提供-fragment-可见与不可见时回调-支持你在这里进行一些-ui-操作-如显示-隐藏加载框" aria-hidden="true">#</a> 2.提供 Fragment 可见与不可见时回调，支持你在这里进行一些 ui 操作，如显示/隐藏加载框</h3><h3 id="_3-支持-view-的复用-防止与-viewpager-使用时出现重复创建-view-的问题" tabindex="-1"><a class="header-anchor" href="#_3-支持-view-的复用-防止与-viewpager-使用时出现重复创建-view-的问题" aria-hidden="true">#</a> 3.支持 view 的复用，防止与 ViewPager 使用时出现重复创建 view 的问题</h3><p>第一点应该是比较需要且常用的一点，之前那篇博客里没有考虑到这点应用场景是我的疏忽。稍微讲解一下，有些时候，我们打开一个 Fragment 页面时，希望它是在可见时才去加载数据，也就是不要在后台就开始加载数据，而且，我们也希望加载数据的操作只是第一次打开该 Fragment 时才进行的操作，以后如果再重新打开该 Fragment 的话，就不要再重复的去加载数据了。</p><p>具体点说，Fragment 和 ViewPager 一起用时，由于 ViewPager 的缓存机制，在打开一个 Fragment 时，它旁边的几个 Fragment 其实也已经被创建了，如果我们是在 Fragment 的 <code>onCreat()</code> 或者 <code>onCreateView()</code> 里去跟服务器交互，下载界面数据，那么这时这些已经被创建的 Fragment，就都会出现在后台下载数据的情况了。所以我们通常需要在 <code>setUserVisibleHint()</code> 里去判断当前 Fragment 是否可见，可见时再去下载数据，但是这样还是会出现一个问题，就是每次可见时都会重复去下载数据，我们希望的是只有第一次可见时才需要去下载，那么就还需要再做一些判断。这就是要封装个基类来做这些事了，具体代码见后面。</p><p>即使我们在 <code>setUserVisibleHint()</code> 做了很多判断，实现了可见时加载并且只有第一次可见时才加载，可能还是会遇到其他问题。比如说，我下载完数据就直接需要对 ui 进行操作，将数据展示出来，但有时却报了 ui 控件 null 异常，这是因为 <code>setUserVisibleHint()</code> 有可能在 <code>onCreateView()</code> 创建 view 之前调用，而且数据加载时间很短，这就可能出现 null 异常了，那么我们还需要再去做些判断，保证在数据下载完后 ui 控件已经创建完成。</p><p>除了懒加载，只加载一次的需求外，可能我们还需要每次 Fragment 的打开或关闭时显示数据加载进度。对吧，我们打开一个 Fragment 时，如果数据还没下载完，那么应该给个下载进度或者加载框提示，如果这个时候打开了新的 Fragment 页面，然后又重新返回时，如果数据还没加载完，那么也还应该继续给提示，对吧。这就需要有个 Fragment 可见与不可见时触发的回调方法，并且该方法还得保证是在 view 创建完后才触发的，这样才能支持对 ui 进行操作。</p><p>以上，就是我们封装的 BaseFragment 基类要干的活了。下面上代码。</p><h1 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
/**
 * Created by dasu on 2016/9/27.
 *
 * Fragment基类，封装了懒加载的实现
 *
 * 1、Viewpager + Fragment情况下，fragment的生命周期因Viewpager的缓存机制而失去了具体意义
 * 该抽象类自定义新的回调方法，当fragment可见状态改变时会触发的回调方法，和 Fragment 第一次可见时会回调的方法
 *
 * @see #onFragmentVisibleChange(boolean)
 * @see #onFragmentFirstVisible()
 */
public abstract class BaseFragment extends Fragment {

    private static final String TAG = BaseFragment.class.getSimpleName();

    private boolean isFragmentVisible;
    private boolean isReuseView;
    private boolean isFirstVisible;
    private View rootView;


    //setUserVisibleHint()在Fragment创建时会先被调用一次，传入isVisibleToUser = false
    //如果当前Fragment可见，那么setUserVisibleHint()会再次被调用一次，传入isVisibleToUser = true
    //如果Fragment从可见-&gt;不可见，那么setUserVisibleHint()也会被调用，传入isVisibleToUser = false
    //总结：setUserVisibleHint()除了Fragment的可见状态发生变化时会被回调外，在new Fragment()时也会被回调
    //如果我们需要在 Fragment 可见与不可见时干点事，用这个的话就会有多余的回调了，那么就需要重新封装一个
    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        //setUserVisibleHint()有可能在fragment的生命周期外被调用
        if (rootView == null) {
            return;
        }
        if (isFirstVisible &amp;&amp; isVisibleToUser) {
            onFragmentFirstVisible();
            isFirstVisible = false;
        }
        if (isVisibleToUser) {
            onFragmentVisibleChange(true);
            isFragmentVisible = true;
            return;
        }
        if (isFragmentVisible) {
            isFragmentVisible = false;
            onFragmentVisibleChange(false);
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initVariable();
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        //如果setUserVisibleHint()在rootView创建前调用时，那么
        //就等到rootView创建完后才回调onFragmentVisibleChange(true)
        //保证onFragmentVisibleChange()的回调发生在rootView创建完成之后，以便支持ui操作
        if (rootView == null) {
            rootView = view;
            if (getUserVisibleHint()) {
                if (isFirstVisible) {
                    onFragmentFirstVisible();
                    isFirstVisible = false;
                }
                onFragmentVisibleChange(true);
                isFragmentVisible = true;
            }
        }
        super.onViewCreated(isReuseView ? rootView : view, savedInstanceState);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        initVariable();
    }

    private void initVariable() {
        isFirstVisible = true;
        isFragmentVisible = false;
        rootView = null;
        isReuseView = true;
    }

    /**
     * 设置是否使用 view 的复用，默认开启
     * view 的复用是指，ViewPager 在销毁和重建 Fragment 时会不断调用 onCreateView() -&gt; onDestroyView() 
     * 之间的生命函数，这样可能会出现重复创建 view 的情况，导致界面上显示多个相同的 Fragment
     * view 的复用其实就是指保存第一次创建的 view，后面再 onCreateView() 时直接返回第一次创建的 view
     *
     * @param isReuse
     */
    protected void reuseView(boolean isReuse) {
        isReuseView = isReuse;
    }

    /**
     * 去除setUserVisibleHint()多余的回调场景，保证只有当fragment可见状态发生变化时才回调
     * 回调时机在view创建完后，所以支持ui操作，解决在setUserVisibleHint()里进行ui操作有可能报null异常的问题
     *
     * 可在该回调方法里进行一些ui显示与隐藏，比如加载框的显示和隐藏
     *
     * @param isVisible true  不可见 -&gt; 可见
     *                  false 可见  -&gt; 不可见
     */
    protected void onFragmentVisibleChange(boolean isVisible) {

    }

    /**
     * 在fragment首次可见时回调，可在这里进行加载数据，保证只在第一次打开Fragment时才会加载数据，
     * 这样就可以防止每次进入都重复加载数据
     * 该方法会在 onFragmentVisibleChange() 之前调用，所以第一次打开时，可以用一个全局变量表示数据下载状态，
     * 然后在该方法内将状态设置为下载状态，接着去执行下载的任务
     * 最后在 onFragmentVisibleChange() 里根据数据下载状态来控制下载进度ui控件的显示与隐藏
     */
    protected void onFragmentFirstVisible() {

    }

    protected boolean isFragmentVisible() {
        return isFragmentVisible;
    }
}


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="使用方法" tabindex="-1"><a class="header-anchor" href="#使用方法" aria-hidden="true">#</a> 使用方法</h1><p>使用很简单，新建你需要的 Fragment 类继承自该 BaseFragment，然后重写两个回调方法，根据你的需要在回调方法里进行相应的操作比如下载数据等即可。<br> 例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class CategoryFragment extends BaseFragment {
    private static final String TAG = CategoryFragment.class.getSimpleName();

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_category, container, false);
        initView(view);
        return view;
    }

    @Override
    protected void onFragmentVisibleChange(boolean isVisible) {
        if (isVisible) {
            //更新界面数据，如果数据还在下载中，就显示加载框
            notifyDataSetChanged();
            if (mRefreshState == STATE_REFRESHING) {
                mRefreshListener.onRefreshing();
            }
        } else {
            //关闭加载框
            mRefreshListener.onRefreshFinish();
        }
    }

    @Override
    protected void onFragmentFirstVisible() {
        //去服务器下载数据
        mRefreshState = STATE_REFRESHING;
        mCategoryController.loadBaseData();
    }
}


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p>最后，继续不要脸的贴上我最近在做的 Gank 客户端的项目地址啦，项目没引入什么高级的库，都是用的最基本的代码实现的，项目也按模块来划分，也尽可能的实现ui和逻辑的划分，各模块也严格控制权限，尽量让模块之间，类之间的耦合减少些，之所以这样是为了后面更深入理解mvp做准备，总之，代码应该还是很容易可以看懂的吧，欢迎大家star交流。</p>`,24),u={href:"https://github.com/woshidasusu/GanHuo",target:"_blank",rel:"noopener noreferrer"},b=e("br",null,null,-1),c={href:"https://github.com/woshidasusu/Meizi",target:"_blank",rel:"noopener noreferrer"};function o(g,V){const i=a("ExternalLinkIcon");return r(),d("div",null,[m,e("p",null,[e("a",u,[n("GanHuo:https://github.com/woshidasusu/GanHuo"),s(i)]),b,e("a",c,[n("Meizi:https://github.com/woshidasusu/Meizi"),s(i)])])])}const h=l(t,[["render",o],["__file","再来一篇Fragment懒加载.html.vue"]]);export{h as default};
