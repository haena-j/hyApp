angular.module('starter.controllers', [])
  /*
최종 변경일 : 20160727 16:40
변경자 : 정혜윤
memo : 사용자 정보가져올땐 AuthService 사용해주세요
            ex) 사용자 Id -> AuthService.id();   사용자 index -> AuthService.index();
*/
/*******************혜윤부분*******************/
//App 실행시 사용자 인증 -> 저장된 ID 있을경우 바로 접속, 없을 경우 login.html 로 이동 등....
  .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService,  AUTH_EVENTS, $location) {
    $scope.searchCosmetics = function (cos_name) { //검색부분
      $location.path('/tab/search').search({param: cos_name});
      location.reload();
    };

    $scope.id = AuthService.id();

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
      $ionicPopup.alert({
        title: 'Unauthorized!',
        template: 'You are not allowed to access this resource.'
      });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('login');
      $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    });
    $scope.setCurrentUserId = function(id) {
      $scope.id = id;
    };
  })

  //로그인 관련 Ctrl (login.html)
  .controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService, $location) {
    $scope.data = {};
    if(AuthService.isAuthenticated() == true){
      $state.go('tab.main');
    }
    $scope.login = function(data) {
      AuthService.login(data.id, data.password).then(function(authenticated) {
        $state.go('tab.main', {}, {reload: true});

        $scope.setCurrentUserId(data.id);
      }, function(err) {
        $ionicPopup.alert({
          title: '로그인 실패!',
          template: '아이디와 비밀번호를 확인해주세요.'
        });
      });
    };
    $scope.signIn = function(){
      $state.go('join');
    };
  })

  //회원가입관련 Ctrl (join.html)
  .controller('JoinCtrl', function($scope, $ionicPopup, HOST, Upload, $timeout, $location){
    $scope.submit = function(join) {
      //사진 파일 업로드를위해 Upload 이용. 값들을 data에 담아 전송
      var file = Upload.upload({
        url: HOST + "/api/main",
        method: "POST",
        data: {
          id: join.id,
          password: join.password,
          name: join.name,
          birth: join.birth,
          files: join.picFile
        }
      }).then(function (response) {
        $timeout(function () {
          $ionicPopup.alert({
            title: '회원가입 완료',
            template: '로그인 해주세요.'
          });
        });
      }, function (evt) {
        alert("error");
        // Math.min is to fix IE which reports 200% sometimes
        join.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      $location.path('/login');    //가입완료시 login.html 로 이동
    };

  })

  //화장대엿보기 - 관련수순, 추천수순 상위 3개씩보여줌 (tab-userSharedPage.html)
  .controller('RelatedMemberListCtrl', function ($scope, HttpSvc, $rootScope, HOST, $state, AuthService, $location) {
    $scope.host = HOST;
    //추천 버튼 누를 경우 추천수 증가해주는 함수
    $scope.giveStar = function (result) {
      var member_id = result.id;
      HttpSvc.updateMemberStar(member_id)
        .success(function () {
          alert("★");
          location.reload();     //화면 refresh 해줌 -> 추천수 증가시킨 것이 바로 반영되도록!
        })
        .error(function (values) {alert(values);})
    };

    //클릭한 회원의 화장대 상세페이지로 이동
    $scope.goToDetail = function (result) {
      $location.path('/userSharedPage-detail').search({param: result.member_index});
      //파라미터로 클릭한회원의 index값을 같이 보내주면서 페이지 이동

    };

    //페이지 접속했을 경우 바로 실행되는 함수 Test 정의
    $scope.Test = function () {
      HttpSvc.getRelatedMemberList(AuthService.index())     //관련순 상위 3개 회원 List 가져옴
        .success(function (values) {
          $scope.RelationList=values;
        }).error(function (values) {
        alert("related table error : " + values);
      });

      HttpSvc.getHighRankList(AuthService.index())      //추천수순 상위 3개 회원 List 가져옴
        .success(function (values) {
          $scope.highRankList = values;
        }).error(function (values, status) {alert("High error " + values + " , status : " + status);});

    };
    $scope.Test();   //함수 Test 실행
  })

  //화장대엿보기 상세페이지 (userSharedPage-detail.html)
  .controller('SharedPageDetailCtrl', function ($scope, $location, HttpSvc, HOST) {
    $scope.host = HOST;
    var member_index = $location.search().param;
    HttpSvc.getMyCosmeticsByMemberIndex(member_index)
      .success(function (values) {
        $scope.cosmeticsInfoList = values;
      })
      .error(function (values) {alert("error" + values);});
  })


  //설정 (settings.html)
  .controller('SettingCtrl', function ($scope, AuthService, $location,HOST, Upload, $timeout, $ionicPopup) {
    $scope.pic = HOST.toString() + AuthService.image();
    $scope.logout = function () {     //로그아웃기능
      AuthService.logout();
      $location.path('/login');
    };
    $scope.changePhoto = function (param) {
      var file = Upload.upload({
        url: HOST + "/api/updateMemberImage",
        method: "POST",
        data: {
          id: AuthService.id(),
          files: param
        }
      }).then(function (response) {
        $timeout(function () {
          $ionicPopup.alert({
            title: '프로필 사진 변경',
            template: '변경 되었습니다'
          });
        });
        location.reload();
      }, function (evt) {
        alert("error");
        // Math.min is to fix IE which reports 200% sometimes
        param.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    };
  })

  //메인 (tab-main.html) -  로그인시 바로 뜨는 화면
  .controller('MainCtrl', function($scope, HttpSvc, $location, $rootScope, HOST, AuthService) {
    $scope.pic = HOST.toString() + AuthService.image();
    $scope.id = AuthService.id();
    $scope.getMemberList = function() {
      HttpSvc.getMemberList()
        .success(function (values) {
          $scope.memberList = values;
        })      .error(function(values, status) {
      });
    };
    $scope.getMemberList();
    $scope.goToSettings= function(){
      $location.path('/settings');
    };
  })
/******* 관리자 로그인시 가능한 기능 부분*******/
//관리자 - 화장품 검색
  .controller('ApiCtrl', function ($scope, $location) {
    $scope.getResult = function (query) {
      $location.path('/searchApi').search({param: query});
      //검색어(query)와 같이 페이지 이동 -> searchApiCtrl 참고
    };
  })

  //관리자 - 화장품 검색결과
  .controller('searchApiCtrl', function ($scope, HttpSvc, $location) {

    //보내온 파라미터(검색어) 와 페이지번호 를 str에 저장
    var str=[$location.search().param, '1'];

    //검색어와 페이지번호가 들어있는 str을 parameter로, HttpSvc를 이용해 검색결과를 가져온다
    HttpSvc.getSearchResultList(str)
      .success(function (values) {
        $scope.searchList=values;   //가져온 값을 searchList에 저장
      })      .error(function (values, status) {
    });

    //다음 페이지를 불러오는 함수
    $scope.getNextResult = function () {
      str[1] = parseInt(str[1]) + 1;   //str에 저장되있던 페이지번호를 +1 해줌
      HttpSvc.getSearchResultList(str)
        .success(function (values) {
          $scope.searchList=values;
        })      .error(function (values, status) {
      });
    };

    //선택한 화장품정보를  Cosmetics Table 에 저장
    $scope.showSelected = function(result){
      var cosmeticsVO={
        cos_name: result.title,
        cos_brand:result.brand,
        cos_price:result.price_min,
        cos_pic:result.image_url,
        cos_type:result.type
      };
      HttpSvc.addCosmetics(cosmeticsVO)
        .success(function(values){alert(values.msg);

        })    .error(function(values, status){alert(status);});
    };
  })
  /*******관리자 끝*********/
/*******************혜윤부분끝*******************/

  /*******************정민부분*******************/
  .controller('WriteCtrl', function($scope, $ionicPopup, $log, HOST, Upload, $timeout, $location, AuthService){ //추가
    console.log("writeController");

    $scope.searchCosByBrand = function () {
      $location.path('/tab/search');
    };
  })
  .controller('MycostableCtrl', function ($scope, HttpSvc, $location, $rootScope, $ionicPopup, AuthService) { // 추가 4 html파일에서 submit 버튼이 있을때만 $scope쓴다
    var member_index = AuthService.index();
    HttpSvc.findByMemIndex(member_index)
      .success(function (values) { //success하면 function으로 넘어오는 파라미터를 values라고 하겠다
        $scope.mycosmeticsList = values;

      }) .error(function (values) { //오류나면 오류창 띄우겠다
      var alertPopup = $ionicPopup.alert({
        title: '내 화장대 가져오기 실패',
        template: 'fail : fail to get my cosmetics table \n' + values
      });
    });
    $scope.submit = function () {
      $location.path('/tab/write');
    };
  })

  // 검색 후 화장품 등록 페이지
  .controller ('WriteAfterSearchCtrl', function ($scope, $location, HttpSvc, HOST, $rootScope, $ionicPopup, AuthService, $log, Upload, $timeout) {
    var cos_index = $location.search().param;
    console.log("writeAfterSearchCtrl 에서 등록 전 cos_index" + cos_index)

    $scope.writeAfterSearch = function() {
      console.log("param: " + cos_index);
      HttpSvc.getCosInformation2(cos_index)
        .success(function (values) {
          $scope.cosmeticsinformList = values;
          console.log("cosmeticsinform: " + $scope.cosmeticsinformList.cos_brand);
        })
        .error(function (values) {
          alert("Wrong access");
        });
    };
    $scope.writeAfterSearch();

    var member_index3 = AuthService.index();
    $scope.submit2 = function(write) {
      var file = Upload.upload({
        url: HOST + '/api/myCosmetics2',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {
          m_open_date: write.m_open_date,
          m_expire_date: write.m_expire_date,
          cos_index: cos_index,
          member_index: member_index3,
          m_review: write.m_review,
          files: write.picFile
        }
      });

      file.then(function(response) {
        $timeout(function() {
          alert("새로운 화장품 등록 완료!");
        });
      }, function(evt) {
        write.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total))
      });
    };


    $scope.reSearchCosByBrand = function() {
      $location.path('/tab/search');
      location.reload();
    };
  })

  .controller('MycoslistCtrl', function ($scope, HttpSvc) { //추가
    $scope.getMy_Cosmetics = function () {
      HttpSvc.getMy_Cosmetics()
        .success(function (values, status, headers) {
          $scope.mycosmeticsList = values;
        })
        .error(function (values, status) {
        });
    };
    $scope.getMy_Cosmetics();
  })
  /*******************정민부분끝*******************/

/*******************예은부분*******************/
  .controller('SearchCtrl', function ($scope,AuthService,$state, HttpSvc, $location) {
      HttpSvc.getSearch($location.search().param)   //혜윤추가.. 수정이필요
        .success(function (values) {
          $scope.cosmeticsList = values;
        }).error(function (values, status) {
      });

    $scope.viewInterest = function() {  //관심리스트 보기
      $location.path('/tab/interest');
    };
    $scope.save = function (interest) {  //관심리스트 저장
      var interestVO = {
        member_index: AuthService.index(),
        cos_index: interest.cos_index
      };
      HttpSvc.addInterest(interestVO)
        .success(function (values) {
          if(values == 1)
            alert('저장하였습니다.');
          else
            alert('이미 저장되었습니다.');
        }).error(function (status) {
        alert('저장 실패');
        alert(status);
      });
    };

    $scope.selectToWriteReview = function (cos_index) { //정민추가부분
      HttpSvc.getCosInformation(cos_index)
        .success(function (values) {
          $scope.list2 = values;
          //클릭한 화장품의 cos_index를 가지고 검색 후 화장품등록 페이지로 이동
          $location.path('/tab/writeaftersearch').search({param: values.cos_index });

        }).error(function (values, status) {
        alert('Wrong access');
      });

    };
  })

  .controller('InterestCtrl', function($scope, HttpSvc, AuthService) { // 관심리스트 목록 불러오기
    $scope.getInterestList = function() {
      HttpSvc.getInterestList(AuthService.index())
         .success(function (values, status, headers) {
           $scope.cosmeticsList = values;
         }).error(function(values, status) {
          alert('실패');
         });
     };
    $scope.getInterestList();

    $scope.delete = function (query) {
      HttpSvc.deleteInterestCos(query)
        .success(function () {alert("삭제되었습니다.");
          location.reload();
        })
        .error(function (values) {alert("삭제실패!");
        })
    }
  })

/*******************예은부분끝*******************/

;
