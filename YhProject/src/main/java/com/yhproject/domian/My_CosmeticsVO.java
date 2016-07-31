package com.yhproject.domian;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by jungmini on 2016. 7. 9..
 */

@Data
public class My_CosmeticsVO {
    private String m_open_date;
    private String m_expire_date;
    private int cos_index;
    private int member_index;
    private String m_review;
    private String m_cosimage;
    private MultipartFile files;
}
