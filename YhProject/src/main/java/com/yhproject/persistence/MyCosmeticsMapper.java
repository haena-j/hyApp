package com.yhproject.persistence;

import com.yhproject.domian.My_CosmeticsVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;


/**
 * Created by jungmini on 2016. 7. 9..
 */

@Mapper
public interface MyCosmeticsMapper {
    @Insert("INSERT INTO MY_COSMETICS(M_OPEN_DATE, M_EXPIRE_DATE, COS_INDEX, MEMBER_INDEX) VALUES(#{m_open_date}, #{m_expire_date}, #{cos_index}, #{member_index})")
    void insertMyCosmetics(My_CosmeticsVO myCosmetics);

    @Select("SELECT MEMBER_INDEX FROM MY_COSMETICS WHERE cos_index = #{cos_index}")
    List<Integer> findByCos(@Param("cos_index") int cos_index);

    @Select("SELECT m_open_date, m_expire_date, cos_index, member_index, m_review, m_cosimage FROM MY_COSMETICS")
    List<My_CosmeticsVO> findAll();

    @Select("SELECT * FROM MY_COSMETICS WHERE member_index = #{member_index}")
    List<My_CosmeticsVO> findByMemIndex(@Param("member_index") int member_index);

}
