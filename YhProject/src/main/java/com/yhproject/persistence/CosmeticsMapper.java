package com.yhproject.persistence;
import com.yhproject.domian.CosmeticsVO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by HYEYOON on 2016-07-03.
 */
public interface CosmeticsMapper {
    void insertCosmetics(CosmeticsVO cosmetics);

    // resources에 xml 파일 추가할것
    @Select("SELECT * FROM COSMETICS WHERE cos_index = #{cos_index}")
    CosmeticsVO findByCosIndex(@Param("cos_index") int cos_index);

    @Select("select * from COSMETICS where cos_name like CONCAT('%', #{cos_name}, '%')")
    List<CosmeticsVO> findCosListByName(@Param("cos_name") String cos_name);

    @Select("select * from COSMETICS where cos_name = #{cos_name}")
    CosmeticsVO findCosByName(@Param("cos_name") String cos_name);

    @Select("SELECT COS_NAME, COS_BRAND, COS_PRICE, COS_PIC, COS_TYPE FROM COSMETICS")
    List<CosmeticsVO> findAll();

    @Select("SELECT * FROM COSMETICS WHERE cos_index = #{cos_index}")
    CosmeticsVO writeReviewByCosIndex(@Param("cos_index") int cos_index);

    @Select("select * from COSMETICS WHERE cos_type = #{cos_type} and cos_brand = #{cos_brand}")
    List<CosmeticsVO> findByType(@Param("cos_type, cos_brand") String cos_type, String cos_brand);

}
