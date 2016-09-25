package com.yhproject.persistence;

import com.yhproject.domian.CosmeticsVO;
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

    @Select("SELECT COSMETICS.cos_index,cos_name,cos_brand,cos_price,cos_pic,cos_type,cos_starrateAvg FROM COSMETICS join INTEREST on COSMETICS.COS_INDEX=INTEREST.COS_INDEX ORDER BY interest_index DESC ") //메인에서 사용할 전체 관심리스트목록
    List<CosmeticsVO> interestFindAll();
}
