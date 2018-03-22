#if (${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

#parse("File Header.java")

public class FileUtils {
    /**
     * 复制文件，默认删除原文件
     *
     * @param sourceFile
     * @param destFile
     */
    public static void copyFile(File sourceFile, File destFile) {
        copyFile(sourceFile, destFile, true);
    }

    /**
     * 复制文件
     *
     * @param sourceFile
     * @param destFile
     * @param isDeleteSource
     */
    public static void copyFile(File sourceFile, File destFile, boolean isDeleteSource) {
        FileInputStream is = null;
        FileOutputStream os = null;
        try {
            int byteRead = 0;
            if (sourceFile.exists()) {
                is = new FileInputStream(sourceFile);
                os = new FileOutputStream(destFile);
                byte[] buffer = new byte[1024];
                while ((byteRead = is.read(buffer)) != -1) {
                    os.write(buffer, 0, byteRead);
                }
                if (isDeleteSource) {
                    sourceFile.delete();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if(is != null){
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 删除文件或文件夹
     *
     * @param file
     * @throws IOException
     */
    public static void deleteFile(File file) throws IOException {
        if (file.isDirectory()) {
            for (File f : file.listFiles()) {
                deleteFile(f);
            }
        } else {
            file.delete();
        }
    }
}
