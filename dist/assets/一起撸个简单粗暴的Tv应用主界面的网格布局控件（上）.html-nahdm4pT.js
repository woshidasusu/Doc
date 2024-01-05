import{_ as i,o as e,c as n,d as a}from"./app-Zf-yBXw2.js";const d={},l=a(`<p>这一篇是真的隔了好久了~~，也终于可以喘口气来好好写博客了，这段时间实在是忙不过来了，迭代太紧。好，废话不多说，进入今天的主题。</p><h1 id="效果" tabindex="-1"><a class="header-anchor" href="#效果" aria-hidden="true">#</a> 效果</h1><p><img src="https://upload-images.jianshu.io/upload_images/1924341-51acf54f0bda9948.gif?imageMogr2/auto-orient/strip" alt="当贝市场.gif"></p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-218524f08ceefb17.gif?imageMogr2/auto-orient/strip" alt="TvGridLayout示例"></p><p>图一是Tv应用：当贝市场的主页</p><p>图二是咱自己撸的简单粗暴的 Tv 应用主界面网格控件：TvGridLayout 的示例</p><p>今天这篇就不讲源码，不讲原理了，来讲讲怎么简单粗暴的撸个网格控件出来。</p><p>如果要你实现类似当贝市场主页的这种布局，你会怎么做？顶部的 Tab 栏先不管，就每个 Tab 下的卡位列表是不止一屏的，注意看，在同一个 Tab 下是可以左右切屏的；而且每个 Tab，每一屏下的卡位样式、大小是不一样的；</p><p>以前在 Github clone 别人开源的主页网格布局的项目时，发现，他们好多都是将网格的布局写死的，就直接在 xml 中写死第一个卡位小卡位，第二个卡位中卡位...</p><p>写死肯定是不行的，那么多 Tab，每个 Tab 下还可能会是多屏的，所以最好是要能够根据布局数据来动态计算网格的位置和大小。</p><h1 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h1><p>你问我为啥不用系统自带的 GridLayout 实现，为啥要自己撸一个？</p><p>原因1：我忘记了，忘记有这个控件了~~</p><p>原因2：事后大概过了下 GridLayout 基本使用，发现它比较适用于卡位样式是固定的场景，比如某个 Tab 下个网格布局，每个卡位的位置、大小都是固定的，那么用它就很容易实现。</p><p>原因3：反正我就是想自己撸一个~</p><p>好了，开始分析，要怎么来撸这么一个网格控件呢？</p><h4 id="第一步-定义布局数据结构" tabindex="-1"><a class="header-anchor" href="#第一步-定义布局数据结构" aria-hidden="true">#</a> 第一步：定义布局数据结构</h4><ul><li>ElementEntity</li></ul><p>首先，第一步，因为我们的网格控件是要支持根据布局数据来动态计算每个卡位的大小、位置信息的，那么布局数据就需要提供每个卡位的位置信息以及每屏的横纵，所以每个卡位的数据结构可以像下面这么定义：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>public class ElementEntity implements Serializable {
    private int x;//卡位坐标
    private int y;//卡位坐标
    private int row;//卡位长度
    private int column;//卡位宽度

    private String imgUrl;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为咱撸的网格控件是要动态来计算卡位的大小、位置的，计算的方式有很多种，我们采取的是<strong>将当前屏按照布局数据平均划分成 n 个小格，统一以每个小格的左上角作为坐标起点，那么每个卡位就需要提供 x,y 的坐标起点，用于计算它的位置，以及 row, column 表示当前这个卡位横向占据了 row 个小格，竖直方向占据了 column 个小格。</strong></p><p>只要每个卡位提供了这些数据，那么就可以根据卡位各自不同的数据实现不同的卡位样式、大小了。</p><ul><li>ScreenEntity</li></ul><p>然后卡位是属于每个 Tab 下的其中一屏里的，所以每一屏的所有卡位构成一组卡位列表，不同屏卡位列表应该是独立的，所以每一屏的数据结构可以这么定义：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>public class ScreenEntity implements Serializable {
    private int row;//横向划分成几行
    private int column;//竖直方向划分成几列
    //row, column 用于将当前屏平均划分成 row * column 个小格

    private List&lt;ElementEntity&gt; elementList;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即使是同一个 Tab 下的每一屏的样式都是不一样的，所以每一屏要平均划分成几个小格，由每屏自己决定。</p><ul><li>MenuEntity</li></ul><p>每个 Tab 可以表示一个菜单，Tab 下有多屏的卡位，所以它的数据结构可以像下面这么定义：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>public class MenuEntity implements Serializable {
    private List&lt;ScreenEntity&gt; screenList;//一个Tab 下可能有多屏
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>LayoutEntity</li></ul><p>主页是可能含有多个 Tab 的，所以主页的布局数据可以像下面这么定义：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>public class LayoutEntity {
    private List&lt;MenuEntity&gt; menuList;//可能含有多个 Tab 菜单
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>json</li></ul><p>综上，汇总一下，主页的布局数据结构可以是长这个样子的：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>{
    &quot;menuList&quot;: [
        {
            &quot;menuName&quot;: &quot;影视娱乐&quot;,
            &quot;screenList&quot;: [
                {
                    &quot;row&quot;: 6,
                    &quot;column&quot;: 4,
                    &quot;elementList&quot;: [
                        {
                            &quot;x&quot;: 3,
                            &quot;y&quot;: 1,
                            &quot;row&quot;: 3,
                            &quot;column&quot;: 1
                        },
                        {
                            &quot;x&quot;: 4,
                            &quot;y&quot;: 1,
                            &quot;row&quot;: 6,
                            &quot;column&quot;: 1
                        },
                        {
                            &quot;x&quot;: 2,
                            &quot;y&quot;: 4,
                            &quot;row&quot;: 3,
                            &quot;column&quot;: 2
                        },
                        {
                            &quot;x&quot;: 1,
                            &quot;y&quot;: 1,
                            &quot;row&quot;: 6,
                            &quot;column&quot;: 1
                        },
                        {
                            &quot;x&quot;: 2,
                            &quot;y&quot;: 1,
                            &quot;row&quot;: 3,
                            &quot;column&quot;: 1
                        }
                    ]
                }
            ]
        }
    ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这第一步很关键，尤其是每个卡位的数据结构和每一屏的数据结构定义，因为网格布局的动态实现就是根据这些数据来计算的。</p><h4 id="第二步-自定义-tvgridlayout" tabindex="-1"><a class="header-anchor" href="#第二步-自定义-tvgridlayout" aria-hidden="true">#</a> 第二步：自定义 TvGridLayout</h4><p>想想，咱要撸的网格控件，一是要支持动态计算卡位大小、位置；二是支持卡位超出一屏，在屏幕外也能绘制，这样当切屏时就可以直接滑到下一屏显示了。</p><p>基于这两点，我们就不继承自 ViewGroup 然后全部自己写了，简单粗暴点，我们继承自 FrameLayout 就行，然后只要将计算出来的卡位位置通过 FrameLayout 的 LayoutParams 来指定在绝对坐标系下的位置，最后跟卡位样式的 View 一起添加进 FrameLayout 就可以了。</p><p>好，开工：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>public class TvGridLayout extends FrameLayout {
	...
    private Adapter mAdapter;
    
    public TvGridLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }
    
    public void setAdapter(Adapter adapter) {
        mAdapter = adapter;
        ...
        
        	layoutChildren();//动态计算每个卡位大小、位置进行布局
    }
    
    //卡位信息来源
    public static abstract class Adapter { 
    	...
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>想想，撸了一个网格控件，我们要怎么使用方便呢</p><p>这里参考了 RecyclerView 的思路，TvGridLayout 网格控件就只提供纯粹的布局功能，至于每个卡位长啥样，大小、位置等都交由 Adapter 去实现。</p><p>也就是说，要使用 TvGridLayout 网格控件时，我们只要像使用 RecyclerView 那样写一个继承自 TvGridLayout.Adapter 的 Adapter，然后实现它的抽象方法，向 TvGridLayout 提供必要的布局数据即可。</p><h4 id="第三步-自定义-adapter" tabindex="-1"><a class="header-anchor" href="#第三步-自定义-adapter" aria-hidden="true">#</a> 第三步：自定义 Adapter</h4><p>那么，TvGridLayout 需要哪些必要的布局数据呢，换句话说，我们该怎么来定义 Adapter 的抽象方法呢？</p><p>想想，我们的网格控件是支持多屏的，而每一屏下都可以有多个卡位，所以我们需要总屏数和每屏下面的卡位数量：</p><ul><li><code>public abstract int getPageCount()</code></li><li><code>public abstract int getChildCount(int pageIndex)</code></li></ul><p>而且每一屏的样式是可以不一样的，换句话说，每一屏具体要平均划分成多少个小格，也就是几行几列，这些数据也是需要的，所以：</p><ul><li><code>public abstract int getPageRow(int pageIndex)</code>​</li><li><code>public abstract int getPageColumn(int pageIndex)</code></li></ul><p>大局的样式搞定了，接下去就是每个卡位了，卡位需要什么信息呢？其实就三点，位置、大小、长啥样。为了方便，我们可以将位置和大小信息经过一层转换后封装起来，那么：</p><ul><li><code>public abstract ItemCoordinate getChildCoordinate(int pageIndex, int childIndex)</code></li><li>​<code>public abstract View getChildView(int groupPosition, int childPosition, int childW, int childH);</code></li></ul><p>好，这样一来，TvGridLayout 所需的布局数据就都有了，使用过程中，只要继承 TvGridLayout.Adapter 然后实现相应的抽象方法，根据我们第一步里定义的数据结构，提供相对应的布局数据，那么布局的工作就都交由 TvGridLayout 内部去实现就好了。</p><p>来看一下整个代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>public static abstract class Adapter {
    public abstract int getPageRow(int pageIndex);
    public abstract int getPageColumn(int pageIndex);
    public abstract ItemCoordinate getChildCoordinate(int pageIndex, int childIndex);
    public abstract View getChildView(int groupPosition, int childPosition, int childW, int childH);
    public abstract int getChildCount(int pageIndex);
    public abstract int getPageCount();
    protected void onSwitchAdapter(Adapter newAdapter, Adapter oldAdapter) {}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用方式跟 RecyclerView 很类似，简单粗暴。有一点不同的是，在 RecyclerView.Adapter 里，我们的 item View 的大小是交由自己决定的，想多大就多大。但在这里，item View 的大小位置都是由服务端下发的布局数据决定的，而这些数据直接就交由 TvGridLayout 内部处理了，所以可以看到，<code>getChildView()</code> 方法的参数里，我们将当前卡位的大小传给 Adapter 了，这点跟平时使用中可能有点不一样。</p><h4 id="第四步-动态布局" tabindex="-1"><a class="header-anchor" href="#第四步-动态布局" aria-hidden="true">#</a> 第四步：动态布局</h4><p>布局数据的数据结构定好了，TvGridLayout 也通过 Adapter 拿到所需的布局数据了，那么接下去就是要根据这些数据来进行动态计算，完成布局工作了。这些工作都是在 TvGridLayout 内部完成，触发布局工作的时机可以是在 <code>setAdapter()</code> 中，当外部传进来一个 Adapter 时，我们就可以进行布局工作了，方法命名为 <code>layoutChildren()</code></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>private void layoutChildren() {
    //方便优化
    layoutChildrenOfPages(0, mAdapter.getPageCount());
}

private void layoutChildrenOfPages(int fromPage, int toPage) {
    //1. 获取网格控件的宽度和高度（即每屏的大小）
	int contentWidth = mWidth - getPaddingLeft() - getPaddingRight();
	int contentHeight = mHeight - getPaddingTop() - getPaddingBottom();
    //2. 遍历每一屏
	for (int j = fromPage; j &lt; toPage; j++) {
        //3. 获取第j屏的行数和列数
     	int column = mAdapter.getPageColumn(j);//列数
    	int row = mAdapter.getPageRow(j);//行数
        //4. 根据行数和列数以及网格控件的大小，将当前j屏平均划分成 column * row 个小格
     	float itemWidth = (contentWidth) * 1.0f / column;//每个小格的宽度
        float itemHeight = (contentHeight) * 1.0f / row;//每个小格的高度

        int pageWidth = 0;//每屏的宽度不一定是充满网格控件的宽度的，有可能当前屏宽度只有一半，所以需要记录当前屏的宽度具体是多少
        
         //5. 遍历当前j屏下的每个卡位
        for (int i = 0; i &lt; mAdapter.getChildCount(j); i++) {
            //6. 获取当前卡位的位置、大小信息
            ItemCoordinate childCoordinate = mAdapter.getChildCoordinate(j, i);
            if (childCoordinate == null) {
                //7. 如果当前卡位没有对应的位置大小信息
                continue;
            }
            int pointStartX = childCoordinate.start.x;
            int pointStartY = childCoordinate.start.y;
            int pointEndX = childCoordinate.end.x;
            int pointEndY = childCoordinate.end.y;

            //8. 根据卡位的布局信息（位置，长度）计算卡位的大小
            int width = (int) ((pointEndX - pointStartX) * itemWidth);
            int height = (int) ((pointEndY - pointStartY) * itemHeight);
            
            //9. 根据卡位的布局信息（位置，长度）计算卡位的位置，直接计算处于父控件坐标系下的绝对位置
            int marginLeft = (int) (pointStartX * itemWidth + contentWidth * j);
            int marginTop = (int) (pointStartY * itemHeight);

            if (marginLeft &lt; 0) {
                marginLeft = 0;
            }
            if (marginTop &lt; 0) {
                marginTop = 0;
            }

            //10. 获取卡位的样式，想长啥样，Adapter 自己决定
            View view = mAdapter.getChildView(j, i, width, height);
            if (view == null) {
                //11. 如果当前位置的卡位没有配置，那么就不参与布局中
                continue;
            }

            //12. 通过 LayoutParams 来进行布局，参数传进卡位大小，
            LayoutParams params = new LayoutParams(width - mItemSpace * 2, height - mItemSpace * 2);//扣除间距
            
            //13. 通过 leftMargin,topMargin 来决定卡位的位置
            params.topMargin = marginTop + mItemSpace;
            params.leftMargin = marginLeft + mItemSpace;
            //14. 将卡位信息直接存储在卡位的 LayoutParams 中，方便后续直接使用
            params.itemCoordiante = childCoordinate;
            params.pageIndex = j;

            //15. 记录当前屏的长度，因为每一屏不一定会充满整个父控件，可能一个Tab下有三屏，但第二屏只配置了一半的卡位
            int maxWidth = marginLeft + width - contentWidth * j;
            pageWidth = Math.max(pageWidth, maxWidth);
			
            //16. 记录这个 Tab 下的网格控件的总长度
            int maxRight = marginLeft + width;
            mRightEdge = Math.max(mRightEdge, maxRight);
			
            //17. 记录每一屏的第一个卡位，方便后续如果需要操作默认焦点
            if (childCoordinate.start.x == 0 &amp;&amp; childCoordinate.start.y == 0) {
                mFirstChildOfPage.put(j, view);
            }
			
            //18. 添加进父容器中，完成布局
            if (j == 0 &amp;&amp; childCoordinate.start.x == 0 &amp;&amp; childCoordinate.start.y == 0) {
                addView(view, 0, params);
            } else {
                addView(view, params);
            }   
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>动态计算的布局逻辑看代码注释吧，注释很详细了~</p><p>另外，我们将卡位的位置、大小信息封装到 ItemCoordinate 中去了，这是为了方便使用：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>static class ItemCoordinate {
	public Point start;//左上角坐标
	public Point end;//右下角坐标
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只要有左上角和有下角坐标，就可以确定卡位的位置和大小了。另外，这里的坐标系并不是 Android 意义上的坐标系，它是以每个小格为单元的坐标系，并不是具体的 px 数值，画张图看看就容易理解了：</p><p><img src="https://upload-images.jianshu.io/upload_images/1924341-083c7683c7f8c27f.png?imageMogr2/auto-orient/strip|imageView2/2/w/1240" alt="坐标系.png"></p><p>还有，我们自定义了一个 LayoutParams 继承自 FrameLayout.LayoutParams，没什么特别的，就单纯是为了将一些卡位的信息直接跟卡位绑定存储起来，方便后续需要的时候直接使用，而不至于还得自己创建一个 map 来维护管理:</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>private static class LayoutParams extends FrameLayout.LayoutParams {
	ItemCoordinate mItemCoordinate;//卡位的位置、大小信息
	int pageIndex;//卡位属于哪一屏的

	...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第五步-初步使用" tabindex="-1"><a class="header-anchor" href="#第五步-初步使用" aria-hidden="true">#</a> 第五步：初步使用</h4><p>好了，到这里，一个简单粗暴的网格控件就实现了，支持根据布局数据动态计算卡位位置、大小；支持一个 Tab 下有多屏，每屏的大小、样式都可以由自己决定；</p><p>想想，其实实现很简单，就是要定义好布局数据的数据结构，然后服务端需要提供每一屏以及每一个卡位的位置、大小信息，最后类似于 RecyclerView 的用法，使用时自己写一个 Adapter 来提供对应数据以及卡位的 View，就没了。</p><p>但到这里，其实控件是不支持滑动的。</p><p>因为我们到这里写的 TvGridLayout 并没有去处理滑动的工作，当然滑不了了，那想要让它滑动，也特别简单，修改一下 xml 布局文件，在 TvGridLayout 外层放一个 HorizontalScrollView 控件，那么它就可以滑动了。</p><p>不过，这种滑动有一些不足是，滑动的策略只能按照系统的来，滑动的时长不能修改。这样的话，可能会没法满足产品那刁钻的口味。既然，网格控件都自己撸了，那干脆滑动也自己实现好了，这样想怎么滑就怎么滑，想滑多远就滑多远，想滑多久就多久，还怕伺候不好产品么。</p><p>不过，本篇篇幅已经很长了，怎么自己实现滑动，就放到下一篇再来讲吧。</p><h1 id="小结" tabindex="-1"><a class="header-anchor" href="#小结" aria-hidden="true">#</a> 小结</h1><p>最后，再总结一下咱自己撸出来的这个网格控件：</p><ul><li>优点：简单、粗暴，支持多屏，支持动态设置不同屏的样式、大小，支持动态设置卡位的位置、大小</li><li>优点：等下篇讲完自己撸个滑动的功能，那么就支持想怎么滑就怎么滑，不怕伺候不了产品</li><li>优点：支持每屏卡位不一定要全部充满屏，屏大小不一定要充满父控件</li><li>缺点：不成熟、不稳定，可能存在一些问题</li><li>缺点：还没有复用之类的考量，所有屏的所有的卡位都是在设置完 <code>setAdapter()</code> 之后就全部绘制出来了</li><li>缺点：需要服务端提供布局数据</li></ul><p>不管了，反正先撸个简单、粗暴的控件出来再说，以后再一步步慢慢优化~</p><p>等后面找时间梳理完自定义 View 的测量、布局、绘制流程原理，ViewGroup 的原理，焦点机制原理，这些要是都梳理清楚之后，这个控件肯定能得到极大的升华的，期待中~~</p>`,78),s=[l];function t(r,v){return e(),n("div",null,s)}const c=i(d,[["render",t],["__file","一起撸个简单粗暴的Tv应用主界面的网格布局控件（上）.html.vue"]]);export{c as default};
