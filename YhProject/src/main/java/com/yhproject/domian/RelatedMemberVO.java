package com.yhproject.domian;

import lombok.Data;

/**
 * Created by HYEYOON on 2016-07-14.
 */
@Data
public class RelatedMemberVO {
    private int member_index;
    private String id;
    private String name;
    private String birth;
    private String image;
    private int level;
    private String level_name;
    private int count;
    private int same_count; //같은화장품갯수
    private String recent_review_name; //최근등록리뷰관련
    private String recent_review_img; //최근등록리뷰관련
}
