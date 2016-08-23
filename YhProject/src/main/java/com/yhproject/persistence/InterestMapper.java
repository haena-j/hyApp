package com.yhproject.persistence;

import com.yhproject.domian.InterestVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by Yeeun Jung on 2016-07-17.
 */

@Mapper
public interface InterestMapper {
    @Insert("INSERT INTO INTEREST(MEMBER_INDEX, COS_INDEX) " +
                "VALUES(#{member_index}, #{cos_index})")
    void insertInterest(InterestVO interest);

    @Select("select * from INTEREST where member_index = #{member_index}")
    List<InterestVO> findById(@Param("member_index") int member_index);

    @Delete("delete from INTEREST where cos_index = #{cos_index}")
    void deleteInterest(InterestVO interest);

    @Select("SELECT distinct COS_BRAND FROM COSMETICS join INTEREST on COSMETICS.COS_INDEX=INTEREST.COS_INDEX where INTEREST.MEMBER_INDEX = #{member_index}")
    List<String> getBrandFromInterestList(@Param("member_index") int member_index);
}
