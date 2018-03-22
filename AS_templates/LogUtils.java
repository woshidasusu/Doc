#if (${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end

#parse("File Header.java")

public class LogUtils {
    public static final int VERBOSE = 2;
    public static final int DEBUG = 3;
    public static final int INFO = 4;
    public static final int WARN = 5;
    public static final int ERROR = 6;

    public static final int LEVEL = VERBOSE;
    public static boolean logVerbose = false;

    public static void v(String tag, String msg) {
        if (logVerbose) {
            logInternal(VERBOSE, tag, msg);
        }
    }

    public static void d(String tag, String msg) {
        if (DEBUG >= LEVEL) {
            logInternal(DEBUG, tag, msg);
        }
    }

    public static void i(String tag, String msg) {
        if (INFO >= LEVEL) {
            logInternal(INFO, tag, msg);
        }
    }

    public static void w(String tag, String msg) {
        if (WARN >= LEVEL) {
            logInternal(WARN, tag, msg);
        }
    }

    public static void e(String tag, String msg) {
        if (ERROR >= LEVEL) {
            logInternal(ERROR, tag, msg);
        }
    }

    private static void logInternal(int type, String tag, String msg) {
        String methodName = "";
        try {
            StackTraceElement[] stackTrace = new Throwable().getStackTrace();
            StackTraceElement targetElement = stackTrace[3];
            methodName = targetElement.getMethodName();
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (!TextUtils.isEmpty(methodName)) {
            methodName += "(), ";
        }
        msg = methodName + msg;
        switch (type) {
            case VERBOSE:
                android.util.Log.v("verbose/" + tag, "" + msg);
                break;
            case DEBUG:
                android.util.Log.d(tag, "" + msg);
                break;
            case INFO:
                android.util.Log.i(tag, "" + msg);
                break;
            case WARN:
                android.util.Log.w(tag, "" + msg);
                break;
            case ERROR:
                android.util.Log.e(tag, "" + msg);
                break;
            default:
                break;
        }
    }
}
