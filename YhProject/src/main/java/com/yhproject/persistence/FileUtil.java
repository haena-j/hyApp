package com.yhproject.persistence;

import com.yhproject.domian.AttachVO;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * Created by HYEYOON on 2016-07-17.
 */
public class FileUtil {
    public static AttachVO fileUpload(MultipartFile files, String path) throws IllegalStateException, IOException {
        File dir = new File(path);

        if(!dir.exists()){
            dir.mkdirs();
        }

                String originalFileName = files.getOriginalFilename();
                String extention = originalFileName.substring(originalFileName.lastIndexOf(".")+1).toLowerCase();
                String uploadFileName = doMakeUniqueFileName(path,extention);
                File saveFile = new File(path, uploadFileName);
                files.transferTo(saveFile);
                AttachVO attach = new AttachVO();
                attach.setOrg_name(originalFileName);
                attach.setUpd_name(uploadFileName);
                attach.setPath(path);


        return attach;
        }
    public static String doMakeUniqueFileName(String path, String extension) {
        String uniqueFileName = null;
        boolean flag = true;
        while (flag) {
            uniqueFileName = getUniqueFileName();
            flag = doCheckFileExists(path,uniqueFileName+"."+extension);
        }
        return uniqueFileName+"."+extension;
    }
    private static String getUniqueFileName() {
        return  UUID.randomUUID().toString();
    }
    private static boolean doCheckFileExists(String path, String filename) {
        return new File(path,filename).exists();
    }
}
