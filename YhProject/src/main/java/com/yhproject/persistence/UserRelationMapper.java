package com.yhproject.persistence;

import com.yhproject.domian.UserRelationVO;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * Created by HYEYOON on 2016-07-14.
 */
public interface UserRelationMapper {
    @Insert("INSERT INTO USER_RELATION(MEMBER_INDEX, RELATED_MEMBER_INDEX, COUNT) VALUES(#{member_index}, #{related_member_index}, #{count})")
    void insertUserRelation(UserRelationVO userRelation);

    @Update("UPDATE USER_RELATION SET COUNT = COUNT + 1 WHERE MEMBER_INDEX=#{member_index} AND RELATED_MEMBER_INDEX=#{related_member_index}")
    void updateUserRelation(UserRelationVO userRelation);

    @Select("SELECT * FROM USER_RELATION WHERE member_index = #{member_index} ORDER BY COUNT desc limit 3")
    List<UserRelationVO> findByMemberIndex(@Param("member_index") int member_index);

    @Select("SELECT MEMBER_INDEX, RELATED_MEMBER_INDEX, COUNT FROM USER_RELATION")
    List<UserRelationVO> findAll();
}
