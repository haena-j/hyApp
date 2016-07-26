angular.module('starter.controllers', [])

  .controller('CosmeticsCtrl', function($scope, HttpSvc) { //화장품리스트 전체 목록 불러오기
    $scope.getCosmeticsList = function() {
      HttpSvc.getCosmeticsList()
        .success(function (values, status, headers) {
          $scope.cosmeticsList = values;
        })
        .error(function(values, status) {

        });
    };
    $scope.getCosmeticsList();
  })

  .controller('InterestCtrl', function($scope, HttpSvc2, $rootScope) { // 관심리스트 목록 불러오기
    $scope.getInterestList = function() {
         HttpSvc2.getInterestList($rootScope.index)
            .success(function (values, status, headers) {
                 $scope.cosmeticsList = values;
              alert(values[0].cos_index);
            })
            .error(function(values, status) {
                  alert('실패');

            });
    };
    $scope.getInterestList();

    $scope.delete = function (interest) {  //관심리스트 삭제

      var interestVO = {
        member_index: $rootScope.index,
        cos_index: interest.cos_index
      };

      HttpSvc2.deleteInterest(interestVO)
        .success(function (values) {

            alert('삭제하였습니다.');

        }).error(function (status) {
        alert('삭제 실패');
        alert(status);
      });
    };

  })

  .controller('SearchCtrl', function ($scope, HttpSvc2, $rootScope, $location) {

    $scope.submit = function (cos_name) {  //화장품 검색
          HttpSvc2.getSearch(cos_name)
              .success(function (values) {
                  $scope.list = values;

               }).error(function (values, status) {
                    alert('Wrong stuff');
          });
    };

    $scope.viewInterest = function() {  //관심리스트 보기

        $location.path('/tab/interest');

    };

    $scope.save = function (interest) {  //관심리스트 저장

        var interestVO = {
            member_index: $rootScope.index,
            cos_index: interest.cos_index
        };


        HttpSvc2.addInterest(interestVO)
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

  })


  .controller('LoginCtrl', function ($scope, LoginSvc, $ionicPopup, $location, $rootScope) { //혜윤이 LOGIN
    $scope.login = function () {
      var memberVO = {
        id: $scope.id,
        password: $scope.password
      }
      LoginSvc.checkLoginInfo(memberVO)
        .success(function (values) {
          if (values != null && values != "") {
            $rootScope.index = values.member_index;
            $rootScope.id = values.id;
            $rootScope.password = values.password;
            $location.path('/tab/search');
          }
          else {
            var alertPopup = $ionicPopup.alert({
              title: '로그인 실패',
              template: '아이디와 비밀번호를 확인해주세요.\n' + values
            });
          }
        }).error(function (values) {
        var alertPopup = $ionicPopup.alert({
          title: '로그인 실패',
          template: '아이디와 비밀번호를 확인해주세요.\n' + values
        });
      });
    };

  });





