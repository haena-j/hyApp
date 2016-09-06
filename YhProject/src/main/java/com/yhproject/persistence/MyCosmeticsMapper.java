package com.yhproject.persistence;

import com.yhproject.domian.My_CosmeticsVO;
import org.apache.ibatis.annotations.*;

import java.util.List;


/**
 * Created by jungmini on 2016. 7. 9..
 */

@Mapper
public interface MyCosmeticsMapper {
    @Insert("INSERT INTO MY_COSMETICS(m_open_date, m_expire_date, cos_index, member_index, m_review, m_cosimage) VALUES(#{m_open_date}, #{m_expire_date}, #{cos_index}, #{member_index}, #{m_review}, #{m_cosimage})")
    void insertMyCosmetics(My_CosmeticsVO myCosmetics);

    @Select("SELECT MEMBER_INDEX FROM MY_COSMETICS WHERE cos_index = #{cos_index}")
    List<Integer> findByCos(@Param("cos_index") int cos_index);

    @Select("SELECT * FROM MY_COSMETICS")
    List<My_CosmeticsVO> findAll();

    @Select("SELECT * FROM MY_COSMETICS WHERE member_index = #{member_index}")
    List<My_CosmeticsVO> findByMemIndex(@Param("member_index") int member_index);

    @Select("SELECT * FROM MY_COSMETICS WHERE m_index = #{m_index}")
    My_CosmeticsVO findByMIndex(@Param("m_index") int m_index);

    @Select("SELECT COSMETICS.cos_name, MY_COSMETICS.m_cosimage FROM COSMETICS join MY_COSMETICS on COSMETICS.cos_index = MY_COSMETICS.cos_index WHERE member_index = #{member_index} ORDER BY m_index DESC limit 1")
    My_CosmeticsVO findRecentReview(@Param("member_index") int member_index);

    @Update("UPDATE MY_COSMETICS SET M_OPEN_DATE = #{m_open_date}, M_EXPIRE_DATE = #{m_expire_date}, M_REVIEW = #{m_review}, M_COSIMAGE = #{m_cosimage} WHERE M_INDEX = #{m_index}")
    void updateReview(My_CosmeticsVO my_cosmetics);

    //    @Update("UPDATE MEMBER SET IMAGE = #{image} WHERE ID = #{id}")
//    void updateMemberImage(MemberVO member);
    @Delete("DELETE FROM MY_COSMETICS WHERE m_index = #{m_index}")
    void deleteReview(My_CosmeticsVO my_cosmetics);
}
