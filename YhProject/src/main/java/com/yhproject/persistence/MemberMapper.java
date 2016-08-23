package com.yhproject.persistence;
import com.yhproject.domian.RelatedMemberVO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import com.yhproject.domian.MemberVO;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * Created by HYEYOON on 2016-06-08.
 */
public interface MemberMapper {

    void insertMember(MemberVO member);

//    @Insert("INSERT INTO ATTACH(member_index, path, org_name, upd_name) VALUES(#{member_index}, #{path}, #{org_name}, #{upd_name})")
//    void insertAttach(AttachVO attach);

    @Select("SELECT * FROM MEMBER")
    List<MemberVO> findAll();

    @Select("SELECT * FROM MEMBER WHERE member_index = #{member_index}")
    MemberVO findByIndex(@Param("member_index") int member_index);

    @Select("SELECT * FROM MEMBER WHERE id = #{id}")
    MemberVO findById(@Param("id") String id);

    @Update("UPDATE MEMBER SET COUNT = COUNT + 1 WHERE ID = #{member_id}")
    void updateMemberStar(@Param("member_id") String member_id);

    @Update("UPDATE MEMBER SET IMAGE = #{image} WHERE ID = #{id}")
    void updateMemberImage(MemberVO member);
    @Select("SELECT MEMBER_INDEX, ID, NAME, BIRTH, IMAGE, COUNT FROM MEMBER ORDER BY COUNT DESC limit 3")
    List<RelatedMemberVO> findHighRankList();
}
