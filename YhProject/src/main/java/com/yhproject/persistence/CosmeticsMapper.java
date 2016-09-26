package com.yhproject.persistence;

import com.yhproject.domian.AllInfoOfMyCosmeticsVO;
import com.yhproject.domian.CosmeticsVO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * Created by HYEYOON on 2016-07-03.
 */
public interface CosmeticsMapper {
    void insertCosmetics(CosmeticsVO cosmetics);

    // resources에 xml 파일 추가할것
    @Select("SELECT * FROM COSMETICS WHERE cos_index = #{cos_index}")
    CosmeticsVO findByCosIndex(@Param("cos_index") int cos_index);

    @Select("select * from COSMETICS where cos_name like CONCAT('%', #{cos_name}, '%') or cos_type like CONCAT('%', #{cos_name}, '%') or cos_brand like CONCAT('%', #{cos_name}, '%')")
    List<CosmeticsVO> findCosListByName(@Param("cos_name") String cos_name);

    @Select("select * from COSMETICS where cos_name = #{cos_name}")
    CosmeticsVO findCosByName(@Param("cos_name") String cos_name);

    @Select("SELECT COS_NAME, COS_BRAND, COS_PRICE, COS_PIC, COS_TYPE FROM COSMETICS")
    List<CosmeticsVO> findAll();

    @Select("SELECT * FROM COSMETICS WHERE cos_index = #{cos_index}")
    CosmeticsVO writeReviewByCosIndex(@Param("cos_index") int cos_index);

    @Select("SELECT cos_index, cos_name, cos_brand, cos_price, cos_pic, cos_type, cos_starrateAvg FROM COSMETICS WHERE cos_type = #{cos_type} AND cos_brand = #{cos_brand}")
    List<CosmeticsVO> getCosByBrandAndType(@Param("cos_type") String cos_type, @Param("cos_brand") String cos_brand);

    @Select("select distinct COS_BRAND FROM COSMETICS ")
    List<String> getCosBrandName();

    @Select("select cos_starrateAvg FROM COSMETICS WHERE cos_index = #{cos_index}")
    int getCosStarAvg(@Param("cos_index") int cos_index);

    @Update("UPDATE COSMETICS SET cos_starrateAvg = #{result} WHERE COS_INDEX = #{cos_index}")
    void UpdateStarRate(@Param("result") int result, @Param("cos_index") int cos_index);

    @Select("SELECT * FROM COSMETICS where cos_type = #{cos_type} ORDER BY cos_starrateAvg DESC limit 3") //타입별 별점 불러오기
    List<CosmeticsVO> getCosTypeStarAvg(@Param("cos_type") String cos_type);

    @Select("select m_index, m_open_date, m_expire_date, m_review, m_cosimage, member_index, m_starrate, cos_name, cos_brand, cos_price, cos_pic, cos_type, cos_starrateAvg from COSMETICS JOIN MY_COSMETICS on COSMETICS.COS_INDEX = MY_COSMETICS.COS_INDEX where MY_COSMETICS.MEMBER_INDEX = #{member_index} and COSMETICS.COS_TYPE = #{cos_type}")
    List<AllInfoOfMyCosmeticsVO> getCosByType(@Param("member_index") int member_index, @Param("cos_type") String cos_type);


}
