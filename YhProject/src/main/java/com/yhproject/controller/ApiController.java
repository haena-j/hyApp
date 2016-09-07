package com.yhproject.controller;

import com.yhproject.Constant;
import com.yhproject.domian.*;
import com.yhproject.persistence.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * 최종변경일 : 20160829 15:50
 * 변경자 : 정혜윤
 * memo :
 **/

@RestController
public class ApiController {

    @Autowired
    private MemberMapper memberMapper;
    @Autowired
    private CosmeticsMapper cosmeticsMapper;
    @Autowired
    private MyCosmeticsMapper my_CosmeticsMapper;
    @Autowired
    private UserRelationMapper userRelationMapper;
    @Autowired
    private InterestMapper interestMapper;

    /***************************************혜윤 부분***************************************/
    /**
     * 다음 api이용한 화장품검색결과 (관리자) -혜윤
     * 다음 API를 이용한 상품정보 불러오기
     *
//     * @param query
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "api/daumSearch")
    public List<searchResultVO> getDaumSearch(@RequestBody List<String> query) {
        System.out.println("검색어 : " + query.get(0) + "페이지 : " + query.get(1));

        String url = "https://apis.daum.net/shopping/search?apikey=1516115ec314a5b7745a9deb2e30158a74e3a58e&q=" + query.get(0) + "&output=json&result=20&pageno=" + query.get(1);
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity entity = new HttpEntity(header);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        List<searchResultVO> result_list = null;
        try {
            result_list = JsonParsing(new ArrayList<searchResultVO>(), response.getBody());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        System.out.println("전송객체 확인 : " + result_list.toString());
        return result_list;
    }

    private List<searchResultVO> JsonParsing(List<searchResultVO> result_list, String response) throws ParseException {
        JSONParser parser = new JSONParser();

        JSONObject obj = (JSONObject) parser.parse(response);
        JSONObject channel = (JSONObject) obj.get("channel");
        JSONArray item = (JSONArray) channel.get("item");
        for (int i = 0; i < item.size(); i++) {
            JSONObject imsi = (JSONObject) item.get(i);

            String publish_date = (String) imsi.get("publish_date");
            String title = (String) imsi.get("title");
            String image_url = (String) imsi.get("image_url");
            String description = (String) imsi.get("description");
            String price_min = (String) imsi.get("price_min");
            String brand = (String) imsi.get("brand");
            String price_max = (String) imsi.get("price_max");
            String shoppingmall = (String) imsi.get("shoppingmall");
            String type = (String) imsi.get("category_name");
            String splitStr[] = type.split("&gt;");
            type = splitStr[splitStr.length - 1];
            searchResultVO result_data = new searchResultVO();
            result_data.setPublish_date(publish_date);
            result_data.setTitle(title);
            result_data.setImage_url(image_url);
            result_data.setDescription(description);
            result_data.setPrice_min(price_min);
            result_data.setBrand(brand);
            result_data.setPrice_max(price_max);
            result_data.setShoppingmall(shoppingmall);
            result_data.setType(type);

            result_list.add(result_data);
        }

        return result_list;
    }

    //회원 사진 업데이트 -혜윤
    @RequestMapping(method = RequestMethod.POST, value = "api/updateMemberImage")
    public void updateMemberImage(@ModelAttribute MemberVO member) {
        System.out.println("update Image : " + member);
        File rootFolder = new File(Constant.ROOT_FOLDER + Constant.UPLOAD_FOLDER);
        AttachVO attach;
        try {
            attach = FileUtil.fileUpload(member.getFiles(), rootFolder.getAbsolutePath());
            String url = Constant.UPLOAD_FOLDER + "/" + attach.getUpd_name();
            member.setImage(url);
            memberMapper.updateMemberImage(member);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //신규 member 데이터 db에 저장 -혜윤
    @RequestMapping(method = RequestMethod.POST, value = "api/main")
    public String addMember(@ModelAttribute MemberVO member) {
        System.out.println(member.toString());
        if (member.getFiles() == null) {
            member.setImage(Constant.UPLOAD_FOLDER + "/no_image.jpg");
        } else {
            File rootFolder = new File(Constant.ROOT_FOLDER + Constant.UPLOAD_FOLDER);

            AttachVO attach = null;
            try {
                attach = FileUtil.fileUpload(member.getFiles(), rootFolder.getAbsolutePath());
            } catch (IOException e) {
                e.printStackTrace();
            }
            String url = Constant.UPLOAD_FOLDER + "/" + attach.getUpd_name();
            member.setImage(url);
        }
        memberMapper.insertMember(member);
        return "true";
    }

    //memberList 불러오기 -혜윤
    @RequestMapping(method = RequestMethod.GET, value = "api/memberList")
    public List<MemberVO> getMemberList() {
        return memberMapper.findAll();
    }

    //cosmetics(화장품) 데이터 db에 저장 (관리자) -혜윤
    @RequestMapping(method = RequestMethod.POST, value = "api/cosmetics")
    public Result addCosmetics(@RequestBody CosmeticsVO cosmetics) {
        Result r = new Result();
        CosmeticsVO test = new CosmeticsVO();
        test.setCos_name("");
        System.out.println("test : " + cosmeticsMapper.findCosByName(cosmetics.getCos_name()));
        test = cosmeticsMapper.findCosByName(cosmetics.getCos_name());
        if (test == null) {
            cosmeticsMapper.insertCosmetics(cosmetics);
            System.out.println("DB에 저장할 cosmetics: " + cosmetics.toString());
            r.setResult(0);
            r.setMsg("새로운 화장품 " + cosmetics.getCos_name() + " 이 저장되었습니다.");
        } else {
            r.setResult(1);
            r.setMsg("이미존재하는 화장품정보 입니다.\n" + cosmetics.getCos_name());

        }
        return r;
    }

    //비슷한화장품 갖고있는 회원 상위 3개 리스트 전송 -혜윤
    @RequestMapping(method = RequestMethod.POST, value = "api/getUserRelation")
    public List<UserRelationVO> getUserRelation(@RequestBody int member_idx) {
        return userRelationMapper.findByMemberIndex(member_idx);
    }

    //화장대 엿보기 - 유사한 테이블 상위 3개 리스트 전송  -혜윤
    @RequestMapping(method = RequestMethod.POST, value = "api/getRelatedMemberList")
    public List<RelatedMemberVO> getRelatedMemberList(@RequestBody int member_idx) {
        System.out.println("0.접근 :" + member_idx);
        List<UserRelationVO> userRelationList = getUserRelation(member_idx);
        System.out.println("1.userRelationList :" + userRelationList);
        List<RelatedMemberVO> memberList = new ArrayList<>();
        for (int i = 0; i < userRelationList.size(); i++) {
            int m_idx = userRelationList.get(i).getRelated_member_index();
            System.out.println("2.m_idx :" + m_idx);
            MemberVO mem = memberMapper.findByIndex(m_idx);
            RelatedMemberVO relatedMem = new RelatedMemberVO();
            relatedMem.setMember_index(mem.getMember_index());
            relatedMem.setId(mem.getId());
            relatedMem.setName(mem.getName());
            relatedMem.setBirth(mem.getBirth());
            relatedMem.setImage(mem.getImage());
            relatedMem.setCount(mem.getCount());
            relatedMem.setSame_count(userRelationList.get(i).getCount());
            relatedMem.setLevel(mem.getLevel());
            relatedMem.setLevel_name(mem.getLevel_name());
            My_CosmeticsVO CosVo = my_CosmeticsMapper.findRecentReview(m_idx);
            if(CosVo != null){
                relatedMem.setRecent_review_img(CosVo.getM_cosimage());
                relatedMem.setRecent_review_name(CosVo.getCos_name());
            }else{
                relatedMem.setRecent_review_img(Constant.UPLOAD_FOLDER + "/no_image.jpg");
                relatedMem.setRecent_review_name("최근리뷰가없습니다.");
            }

            System.out.println("3.relatedMem :" + relatedMem.toString());
            memberList.add(relatedMem);
        }
        System.out.println("관련도순 " + memberList);
        return memberList;
    }

    //추천수 ++ -혜윤
    @RequestMapping(method = RequestMethod.POST, value = "api/updateMemberStar")
    public void updateMemberStar(@RequestBody String member_id) {
        memberMapper.updateMemberStar(member_id);
    }

    //화장대엿보기 - 추천수순 전송 -혜윤
    @RequestMapping(method = RequestMethod.POST, value = "api/getHighRankList")
    public List<RelatedMemberVO> getHighRankList(@RequestBody int member_idx) {
        List<RelatedMemberVO> result = memberMapper.findHighRankList();
        for(int i = 0; i < result.size(); i++){
            int m_idx = result.get(i).getMember_index();
            My_CosmeticsVO CosVo = my_CosmeticsMapper.findRecentReview(m_idx);
            if(CosVo != null) {
                result.get(i).setRecent_review_img(CosVo.getM_cosimage());
                if(CosVo.getM_cosimage() == null){
                    result.get(i).setRecent_review_img(Constant.UPLOAD_FOLDER + "/no_image.jpg");
                }
                result.get(i).setRecent_review_name(CosVo.getCos_name());
            }else{
                result.get(i).setRecent_review_img(Constant.UPLOAD_FOLDER + "/no_image.jpg");
                result.get(i).setRecent_review_name("최근리뷰가없습니다.");
            }
        }
        System.out.println("추천수 : " + result);
        return result;
    }

    //로그인 관련 회원id와 pw 확인 -혜윤
    @RequestMapping(method = RequestMethod.POST, value = "api/login")
    public MemberVO checkLoginInfo(@RequestBody MemberVO member) {
        MemberVO result = memberMapper.findById(member.getId());
        System.out.println("login check : " + member.getId() + ", " + memberMapper.findById(member.getId()).toString());
        if (result == null) {
            return null;
        } else if (result.getPassword().equals(member.getPassword())) {
            System.out.println("return id : " + result.getId() + ", index : " + result.getMember_index() + ", image: " + result.getImage());
            return result;
        } else
            return null;
    }
    /***************************************혜윤 부분끝***************************************/
    /***************************************정민 부분***************************************/

    //화장품 선택 후 등록이 된다! 혜윤이가 병합 후 내가 수정한 부분
    @RequestMapping(method = RequestMethod.POST, value = "/api/myCosmetics")
    public void addMyCosmetics2(@ModelAttribute My_CosmeticsVO myCosmetics) {
        System.out.println("add 진입");
        System.out.println("m_open_date :" + myCosmetics);
        File rootFolder = new File(Constant.ROOT_FOLDER + Constant.UPLOAD_FOLDER);
        if (myCosmetics.getFiles() == null) {             //사진등록을 안해서 File 정보가 없을경우
            //방법 1) DB파일에 등록된 사진(no_image)를 저장해준다
//            myCosmetics.setM_cosimage(Constant.UPLOAD_FOLDER + "/no_image.jpg");
            // 방법 2) 등록하려는 화장품의 기본이미지로 저장해준다
            CosmeticsVO cos = cosmeticsMapper.findByCosIndex(myCosmetics.getCos_index()); //myCosmetics의 cos_index값으로 Cosmetics table에서 일치하는 값 검색
            myCosmetics.setM_cosimage(cos.getCos_pic()); //검색한 화장품의 기본이미지를 설정
        } else {
            AttachVO attach;
            try {
                attach = FileUtil.fileUpload(myCosmetics.getFiles(), rootFolder.getAbsolutePath());
                String url = Constant.UPLOAD_FOLDER + "/" + attach.getUpd_name();
                myCosmetics.setM_cosimage(url);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        List<Integer> member_index_list = my_CosmeticsMapper.findByCos(myCosmetics.getCos_index());
        System.out.println("화장품갖고있는회원index List : " + member_index_list);
        for (int i = 0; i < member_index_list.size(); i++) {
            UserRelationVO userRelationVO = new UserRelationVO();
            userRelationVO.setMember_index(myCosmetics.getMember_index());
            userRelationVO.setRelated_member_index(member_index_list.get(i));
            userRelationVO.setCount(1);
            System.out.println("userRelationVO : " + userRelationVO);
            try {
                userRelationMapper.insertUserRelation(userRelationVO);
                userRelationVO.setMember_index(member_index_list.get(i));
                userRelationVO.setRelated_member_index(myCosmetics.getMember_index());
                userRelationMapper.insertUserRelation(userRelationVO);
                System.out.println("insert: " + userRelationVO.toString());
            } catch (Exception e) {
                userRelationMapper.updateUserRelation(userRelationVO);
                userRelationVO.setMember_index(member_index_list.get(i));
                userRelationVO.setRelated_member_index(myCosmetics.getMember_index());
                userRelationMapper.updateUserRelation(userRelationVO);
                System.out.println("update: " + userRelationVO.toString());
            }
        }

        System.out.println("m_open_date :" + myCosmetics);
        my_CosmeticsMapper.insertMyCosmetics(myCosmetics);
    }


    //memeber_index에 따른 내 화장대 불러오기
    @RequestMapping(method = RequestMethod.POST, value = "/api/mycostableList") //member_index, cos_index로 화장대 전체정보 찾기
    public List<AllInfoOfMyCosmeticsVO> findByMemIndex(@RequestBody int member_index) {
//        System.out.println("memberIndex: " + member_index);

        List<AllInfoOfMyCosmeticsVO> allList = new ArrayList<>();
        List<My_CosmeticsVO> mycostable = my_CosmeticsMapper.findByMemIndex(member_index);
        for (int i = 0; i < mycostable.size(); i++) {
            int cos_index = mycostable.get(i).getCos_index();
            CosmeticsVO cosmetics = cosmeticsMapper.findByCosIndex(cos_index);
            AllInfoOfMyCosmeticsVO allInfoOfMyCosmetic = new AllInfoOfMyCosmeticsVO();
            allInfoOfMyCosmetic.setM_index(mycostable.get(i).getM_index());
            allInfoOfMyCosmetic.setM_open_date(mycostable.get(i).getM_open_date());
            allInfoOfMyCosmetic.setM_expire_date(mycostable.get(i).getM_expire_date());
            allInfoOfMyCosmetic.setM_review(mycostable.get(i).getM_review());
            allInfoOfMyCosmetic.setM_cosimage(mycostable.get(i).getM_cosimage());
            allInfoOfMyCosmetic.setCos_brand(cosmetics.getCos_brand());
            allInfoOfMyCosmetic.setCos_name(cosmetics.getCos_name());
            allInfoOfMyCosmetic.setCos_pic(cosmetics.getCos_pic());
            allInfoOfMyCosmetic.setCos_price(cosmetics.getCos_price());
            allInfoOfMyCosmetic.setCos_type(cosmetics.getCos_type());


            allList.add(allInfoOfMyCosmetic);
//            System.out.println("cosmetics name" + allList.get(0).getCos_name());
//            System.out.println("review index" + allList.get(0).getM_index());
        }
        return allList;
    }

    //화장품 인덱스로 화장품 정보 불러오기
    @RequestMapping(method = RequestMethod.POST, value = "/api/cosmeticsinformations")
    public CosmeticsVO getCosInformation(@RequestBody int cos_index) {
//        System.out.println("cos_index: " + cos_index);

        CosmeticsVO cosmeticsInformation = cosmeticsMapper.writeReviewByCosIndex(cos_index);
//        System.out.println("리뷰쓸 화장품 전송값 확인: " + cosmeticsInformation.toString());
        return cosmeticsInformation;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/cosmeticsinformations2")
    public CosmeticsVO getCosInformation2(@RequestBody int cos_index) {
//        System.out.println("cos_index2: " + cos_index);

        CosmeticsVO cosmeticsInformation2 = cosmeticsMapper.writeReviewByCosIndex(cos_index);
//        System.out.println("리뷰쓸 화장품 전송값 확인2: " + cosmeticsInformation2.toString());
        return cosmeticsInformation2;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/api/mCosdetailByMIndex")
    public My_CosmeticsVO findByMIndex(@RequestBody int m_index) {
        System.out.println("리뷰 번호 : " + m_index);

        My_CosmeticsVO my_cosmetics = my_CosmeticsMapper.findByMIndex(m_index);
        System.out.println("수정하려는 리뷰번호에 담긴 my_cosmetics정보 :" + my_cosmetics.getCos_index() +", cosimage : " + my_cosmetics.getM_cosimage());

        return my_cosmetics;
    }


    // 회원 리뷰수정 혜윤이꺼참고로 코딩중!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 오류해결해야해
    @RequestMapping(method = RequestMethod.POST, value = "/api/mCosdetailEdit")
    public void updateReview(@ModelAttribute My_CosmeticsVO my_cosmetics) {
        System.out.println("edit My_cosmetics's m_index: " + my_cosmetics);

        File rootFolder2 = new File(Constant.ROOT_FOLDER + Constant.UPLOAD_FOLDER);
        if (my_cosmetics.getFiles() == null) {
            CosmeticsVO cosmetics = cosmeticsMapper.findByCosIndex(my_cosmetics.getCos_index());
            my_cosmetics.setM_cosimage(cosmetics.getCos_pic());
        } else {
            AttachVO attachVO;
            try {
                attachVO = FileUtil.fileUpload(my_cosmetics.getFiles(), rootFolder2.getAbsolutePath());
                String url = Constant.UPLOAD_FOLDER + "/" + attachVO.getPath();
                my_cosmetics.setM_cosimage(url);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        my_CosmeticsMapper.updateReview(my_cosmetics);
    }

    //회원 리뷰 삭제 작성중
    @RequestMapping(method = RequestMethod.POST, value = "/api/mCosdetailDelete")
    public void deleteReview(@RequestBody My_CosmeticsVO my_cosmetics) {
        System.out.println("삭제");
        System.out.println("삭제할 m_index:" + my_cosmetics.getM_index());

        my_CosmeticsMapper.deleteReview(my_cosmetics);

    }

    //내 화장대에서 회원 정보 불러오기
    @RequestMapping(method = RequestMethod.POST, value="/api/UserInformation")
    public MemberVO findUserByMIndex(@RequestBody int member_index) {
        System.out.println("가져 오려는 member_index: " + member_index);

        MemberVO memberInformation = memberMapper.findByIndex(member_index);
        System.out.println("멤버 잘 가져왔나 확인:" + memberInformation.getName());

        return memberInformation;
    }


    /***************************************정민 부분끝***************************************/


    /***************************************예은 부분***************************************/

    /// 관심리스트 저장
    @RequestMapping(method = RequestMethod.POST, value = "/api/interest")
    public int addInterest(@RequestBody InterestVO interest) {


        List<InterestVO> my_interest = interestMapper.findById(interest.getMember_index());

        for (int i = 0; i < my_interest.size(); i++) {
            if (interest.getCos_index() == my_interest.get(i).getCos_index()) {
                System.out.println("이미저장");
                return 2;
            }
        }

        System.out.println("interest 저장: " + interest);

        interestMapper.insertInterest(interest);

        return 1;
    }

    /// 화장품 검색
    @RequestMapping(method = RequestMethod.POST, value = "/api/search")
    public List<CosmeticsVO> getSearch(@RequestBody String query) {
        System.out.println("검색어: " + query);

        List<CosmeticsVO> r = cosmeticsMapper.findCosListByName(query);
        System.out.println("전송값확인: " + r.toString());
        return r;

    }

    /// 화장품 전체목록 불러오기
    @RequestMapping(method = RequestMethod.GET, value = "/api/cosmeticsList")
    public List<CosmeticsVO> getCosmeticsList() {
        System.out.println("cosList: " + cosmeticsMapper.findAll());

        return cosmeticsMapper.findAll();
    }


    ///관심리스트 가져오기
    @RequestMapping(method = RequestMethod.POST, value = "/api/interestList") //member_index, cos_index로 관심리스트불러오기
    public List<GetInterestVO> getInterestList(@RequestBody int member_index) {
        System.out.println("memberIndex: " + member_index);

        List<GetInterestVO> allList = new ArrayList<>();
        List<InterestVO> my_interest = interestMapper.findById(member_index);
        for (int i = 0; i < my_interest.size(); i++) {
            int cos_index = my_interest.get(i).getCos_index();
            CosmeticsVO cosmetics = cosmeticsMapper.findByCosIndex(cos_index);
            GetInterestVO getInterest = new GetInterestVO();

            getInterest.setCos_index(cos_index);
            getInterest.setCos_brand(cosmetics.getCos_brand());
            getInterest.setCos_name(cosmetics.getCos_name());
            getInterest.setCos_pic(cosmetics.getCos_pic());
            getInterest.setCos_price(cosmetics.getCos_price());
            getInterest.setCos_type(cosmetics.getCos_type());

            allList.add(getInterest);
            System.out.println("cosmetics name" + allList.get(0).getCos_name());
        }
        return allList;
    }


    //관심리스트 삭제하기 -예은
    @RequestMapping(method = RequestMethod.POST, value = "/api/deleteInterest")
    public void deleteInterest(@RequestBody InterestVO interest) {
        System.out.println("삭제");
        System.out.println("cos_index:" + interest.getCos_index());
        System.out.println("member_index:" + interest.getMember_index());

        interestMapper.deleteInterest(interest);
    }

    //GPS이용을 위해 관심리스트의 브랜드이름 가져오기
    @RequestMapping(method = RequestMethod.POST, value = "api/getBrandFromInterestList")
    public List<String> getBrandFromInterestList(@RequestBody int member_index) {
        List<String> result = interestMapper.getBrandFromInterestList(member_index);
        System.out.println(member_index);
        System.out.println("접속");
        return result;
    }

    /***************************************예은 부분끝***************************************/
}

