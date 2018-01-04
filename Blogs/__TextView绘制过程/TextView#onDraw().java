//英文注释是源码中自带的注释，中文注释是我自己的理解加上的
@Override
    protected void onDraw(Canvas canvas) {
        //重启Marquee如果需要的话
        restartMarqueeIfNeeded();

        // Draw the background for this view
        super.onDraw(canvas);
		
		//计算TextView的文字区域边界，对CompoundPadding不理解的可以查看我之前的博客
        final int compoundPaddingLeft = getCompoundPaddingLeft();
        final int compoundPaddingTop = getCompoundPaddingTop();
        final int compoundPaddingRight = getCompoundPaddingRight();
        final int compoundPaddingBottom = getCompoundPaddingBottom();
        
		//坐标系原点位置，默认为左上角
		final int scrollX = mScrollX;
        final int scrollY = mScrollY;
        
		//TextView的边界
		final int right = mRight;
        final int left = mLeft;
        final int bottom = mBottom;
        final int top = mTop;
		
		//这个就不清楚是干嘛的了
        final boolean isLayoutRtl = isLayoutRtl();
		final int offset = getHorizontalOffsetForDrawables();
        final int leftOffset = isLayoutRtl ? 0 : offset;
        final int rightOffset = isLayoutRtl ? offset : 0 ;
		
		//绘制drawable，如果有设置四周的drawable的话
        final Drawables dr = mDrawables;
        if (dr != null) {
            /*
             * Compound, not extended, because the icon is not clipped
             * if the text height is smaller.
             */

			//vspace(verticalSpace),计算文字区域的高度，同理hspace(horizontalSpace)计算文字区域的宽度
			//比如 bottom - top 计算TextView的高度，compoundPadding则是文字区域与TextView边界之间的距离，
			//所以，vspace就是计算文字区域的高度
            int vspace = bottom - top - compoundPaddingBottom - compoundPaddingTop;
            int hspace = right - left - compoundPaddingRight - compoundPaddingLeft;

			//下面就是分别判断四周的drawable存不存在，存在的话就将他画出来。

            // IMPORTANT: The coordinates computed are also used in invalidateDrawable()
            // Make sure to update invalidateDrawable() when changing this code.
            if (dr.mShowing[Drawables.LEFT] != null) {
                //canvas每一次save()对应一次restore(), save作用类似于photoShop里的Ctrl + J就是将当前画布复制一份
				//在副本上进行画图操作，restore类似于ps里的合并图层。
				//而且因为canvas.translate()是可叠加的，也就是这次平移了坐标系后，下次再调用就是基于平移后的坐标系来平移了，
				//所以通过save()和restore()可以保证在绘制完drawable后恢复原来的坐标系。
				canvas.save();
				//平移画布的坐标系，参数里是计算 drawable 的左上角坐标位置，也就是将画布的原点平移至 drawable
				//最终位置的左上角，然后开始绘制 drawable
                canvas.translate(scrollX + mPaddingLeft + leftOffset,
                                 scrollY + compoundPaddingTop +
                                 (vspace - dr.mDrawableHeightLeft) / 2);
                dr.mShowing[Drawables.LEFT].draw(canvas);
                canvas.restore();
            }

            // IMPORTANT: The coordinates computed are also used in invalidateDrawable()
            // Make sure to update invalidateDrawable() when changing this code.
            if (dr.mShowing[Drawables.RIGHT] != null) {
                canvas.save();
                canvas.translate(scrollX + right - left - mPaddingRight
                        - dr.mDrawableSizeRight - rightOffset,
                         scrollY + compoundPaddingTop + (vspace - dr.mDrawableHeightRight) / 2);
                dr.mShowing[Drawables.RIGHT].draw(canvas);
                canvas.restore();
            }

            // IMPORTANT: The coordinates computed are also used in invalidateDrawable()
            // Make sure to update invalidateDrawable() when changing this code.
            if (dr.mShowing[Drawables.TOP] != null) {
                canvas.save();
                canvas.translate(scrollX + compoundPaddingLeft +
                        (hspace - dr.mDrawableWidthTop) / 2, scrollY + mPaddingTop);
                dr.mShowing[Drawables.TOP].draw(canvas);
                canvas.restore();
            }

            // IMPORTANT: The coordinates computed are also used in invalidateDrawable()
            // Make sure to update invalidateDrawable() when changing this code.
            if (dr.mShowing[Drawables.BOTTOM] != null) {
                canvas.save();
                canvas.translate(scrollX + compoundPaddingLeft +
                        (hspace - dr.mDrawableWidthBottom) / 2,
                         scrollY + bottom - top - mPaddingBottom - dr.mDrawableSizeBottom);
                dr.mShowing[Drawables.BOTTOM].draw(canvas);
                canvas.restore();
            }
        }
		//这里总结一下上面做的事
		//其实就是用canvas绘制TextView四周设置的drawable，既然涉及到绘制，就要确认drawable需要在哪个位置进行绘制，
		//translate()参数里的表达式就是在计算drawable的位置，只要大概理解参数里的各变量意思，我们可以总结出
		//如果是在左边和右边的drawable的话，它的位置水平方向以设置的padding为主，竖直方向就居中放置
		//如果是上边和下边的drawable，则水平方向居中放置，竖直方向以设置的padding为主


		//文字的颜色
        int color = mCurTextColor;

		//mLayout是用来绘制文本数据的，包括文本的换行处理操作等
        if (mLayout == null) {
			//生成一个mLayout对象
            assumeLayout();
        }

        Layout layout = mLayout;

		//如果没有text，而且设置了hint，那么就绘制hint里的数据
        if (mHint != null && mText.length() == 0) {
            if (mHintTextColor != null) {
                color = mCurHintTextColor;
            }

            layout = mHintLayout;
        }

		//配置画笔属性
        mTextPaint.setColor(color);
        mTextPaint.drawableState = getDrawableState();

        canvas.save();
        /*  Would be faster if we didn't have to do this. Can we chop the
            (displayable) text so that we don't need to do this ever?
        */

		//计算实际文字显示部分的上下边界，当文本内容过少，不足以填充满文字区域时，
		//extendedPadding就是计算实际显示出来的这部分文字的上下边界，具体解析可以看我上一篇博客
        int extendedPaddingTop = getExtendedPaddingTop();
        int extendedPaddingBottom = getExtendedPaddingBottom();

		//同上面的vspace，计算文字区域的高度
        final int vspace = mBottom - mTop - compoundPaddingBottom - compoundPaddingTop;
        
		//文本数据根据textSize大小排版以及换行处理后的信息都会保存在Layout里面
		//也就是说mLayout已经知道这段文本数据要显示多少行，每行显示多少个字符，但最终显示在TextView上
		//我们看到的效果需要结合maxLines，ellipsize，TextView的长宽限制等因素
		//mLayout.getHeight计算文本数据总共需要的高度
		
		//下面这些是计算什么的也还是没搞懂，不大清楚
		final int maxScrollY = mLayout.getHeight() - vspace;
        float clipLeft = compoundPaddingLeft + scrollX;
        float clipTop = (scrollY == 0) ? 0 : extendedPaddingTop + scrollY;
        float clipRight = right - left - getCompoundPaddingRight() + scrollX;
        float clipBottom = bottom - top + scrollY -
                ((scrollY == maxScrollY) ? 0 : extendedPaddingBottom);

        if (mShadowRadius != 0) {
            clipLeft += Math.min(0, mShadowDx - mShadowRadius);
            clipRight += Math.max(0, mShadowDx + mShadowRadius);

            clipTop += Math.min(0, mShadowDy - mShadowRadius);
            clipBottom += Math.max(0, mShadowDy + mShadowRadius);
        }

        canvas.clipRect(clipLeft, clipTop, clipRight, clipBottom);

        int voffsetText = 0;
        int voffsetCursor = 0;

        // translate in by our padding
        /* shortcircuit calling getVerticaOffset() */
        if ((mGravity & Gravity.VERTICAL_GRAVITY_MASK) != Gravity.TOP) {
            voffsetText = getVerticalOffset(false);
            voffsetCursor = getVerticalOffset(true);
        }

		//将canvas的坐标移至文字绘制的起点
        canvas.translate(compoundPaddingLeft, extendedPaddingTop + voffsetText);

        final int layoutDirection = getLayoutDirection();
        final int absoluteGravity = Gravity.getAbsoluteGravity(mGravity, layoutDirection);
        //是否开启了跑马灯效果
		if (isMarqueeFadeEnabled()) {
            //如果开启了的话，那就判断下当前情况下是否满足跑马灯运行的要求
			//这部分我在之前的关于TextView的博客里也有介绍过，有兴趣可以查阅。
			if (!mSingleLine && getLineCount() == 1 && canMarquee() &&
                    (absoluteGravity & Gravity.HORIZONTAL_GRAVITY_MASK) != Gravity.LEFT) {
                //计算TextView的宽度
				final int width = mRight - mLeft;
                //计算文字区域两边的与TextView边界的空隙
				final int padding = getCompoundPaddingLeft() + getCompoundPaddingRight();
                //width-padding 计算文字区域的宽度，
				final float dx = mLayout.getLineRight(0) - (width - padding);
                canvas.translate(layout.getParagraphDirection(0) * dx, 0.0f);
            }

			
            if (mMarquee != null && mMarquee.isRunning()) {
                final float dx = -mMarquee.getScroll();
                canvas.translate(layout.getParagraphDirection(0) * dx, 0.0f);
            }
        }

        final int cursorOffsetVertical = voffsetCursor - voffsetText;

        Path highlight = getUpdatedHighlightPath();

		//mEditor是绘制EditText的文本数据的，layout才是绘制TextView的文本数据
        if (mEditor != null) {
            mEditor.onDraw(canvas, layout, highlight, mHighlightPaint, cursorOffsetVertical);
        } else {
            layout.draw(canvas, highlight, mHighlightPaint, cursorOffsetVertical);
        }

		//如果有开启跑马灯效果，并且这段文本数据已经轮放到末尾了，那么就绘制一段空白距离用来
		//表示文本数据已经展示到底，下面就开始重新重头显示。
        if (mMarquee != null && mMarquee.shouldDrawGhost()) {
            final float dx = mMarquee.getGhostOffset();
            canvas.translate(layout.getParagraphDirection(0) * dx, 0.0f);
            layout.draw(canvas, highlight, mHighlightPaint, cursorOffsetVertical);
        }

        canvas.restore();
    }


