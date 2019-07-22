#if (${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end

import java.lang.ref.WeakReference;

#parse("File Header.java")

public abstract class BasePresenter<V extends BaseMvpView> {
    
    private WeakReference<V> mViewReference = null;

    public void attachView(V view) {
        mViewReference = new WeakReference<V>(view);
    }

    public V getView() {
        return mViewReference == null ? null : mViewReference.get();
    }

    public boolean isViewAttached() {
        return mViewReference != null && mViewReference.get() != null;
    }

    public void onResume() {}

    public void onPause() {}

    public void onDestory() {}
}