package com.yhproject.domian;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by HYEYOON on 2016-06-08.
 */

@Data
public class MemberVO {
    private int member_index;
    private String id;
    private String password;
    private String name;
    private String birth;
    private String image;
    private int count;
    private int level;
    private String level_name;
    private MultipartFile files;
}