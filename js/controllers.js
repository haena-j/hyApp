angular.module('starter.controllers', [])

//App 실행시 사용자 인증 -> 저장된 ID 있을경우 바로 접속, 없을 경우 login.html 로 이동 등....
  .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
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
  .controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
    $scope.data = {};
    if(AuthService.isAuthenticated() == true){
      $state.go('tab.member');
    }
    $scope.login = function(data) {
      AuthService.login(data.id, data.password).then(function(authenticated) {
        $state.go('tab.member', {}, {reload: true});
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
  .controller('JoinCtrl', function($scope, JoinSvc, $ionicPopup, $log,HOST, Upload, $timeout, $location){
    $scope.submit = function(join) {
      //사진 파일 업로드를위해 Upload 이용. 값들을 data에 담아 전송
      var file = Upload.upload({
        url: HOST + "/api/member",
        method: "POST",
        data: {
          id: join.id,
          password: join.password,
          name: join.name,
          birth: join.birth,
          files: join.picFile
        }
      });
      file.then(function (response) {
        $timeout(function () {
        });
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        join.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
      alert("가입이 완료되었습니다. 로그인 해주세요");
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
      $location.path('/userSharedPage-detail').search({param: result.index});
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
  .controller('SharedPageDetailCtrl', function ($scope, $location, HttpSvc) {
    var member_index = $location.search().param;
    HttpSvc.getMyCosmeticsByMemberIndex(member_index)
      .success(function (values) {
        $scope.cosmeticsInfoList = values;
      })
      .error(function (values) {alert("error" + values);});
  })


  //설정 (settings.html)
  .controller('SettingCtrl', function ($scope, AuthService, $location) {
    $scope.logout = function () {     //로그아웃기능
      AuthService.logout();
      $location.path('/login');
    };
  })

  //메인 (tab-member.html) -  로그인시 바로 뜨는 화면
  .controller('MemberCtrl', function($scope, HttpSvc, $location, $rootScope, HOST, AuthService) {

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




    /************************* 관리자 로그인시 가능한 기능 부분*****************************/
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
;
