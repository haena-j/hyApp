/**
 * Created by JUNGMIN on 2016-09-03.
 */

(function() {
  'use strict';

  angular
      .module('gulpAngular')
      .config(function($mdIconProvider) {
        $mdIconProvider
            .iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
            .iconSet("social", 'img/icons/sets/social-icons.svg', 24);
      })
      .controller('MyCosTableController', MyCosTableController)
      .controller('MyCosTableEditController', MyCosTableEditController)
      .controller('MyCosTableDetailController', MyCosTableDetailController)
      .controller('SelectTypeController', SelectTypeController);

  /** @ngInject */

  //내 리뷰 목록 페이지 Controller
  function MyCosTableController (HttpSvc, $location, HOST, AuthService, $mdDialog, $rootScope) {
    var vm = this;
    var originatorEv;
    vm.host = HOST;
    var member_index = AuthService.index();
    vm.listType = "list";

    vm.changeListType = function(type) {
      vm.listType = type;
    };


    //내 화장대 접근했을 때 바로 실행되는 함수 Test 정의
    vm.Test = function () {
      HttpSvc.findByMemIndex(member_index)
          .success(function (values) {
            vm.mycosmeticsList = values;

          })

    };
    vm.Test(); //함수 Test 실행

    vm.Test2 = function() {
      HttpSvc.findUserByMIndex(member_index)
          .success(function(values) {
            vm.memberInfo = values;
          })
          .error(function() {

          })
    };
    vm.Test2(); //함수 Test2 실행


    vm.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);

    };
    vm.notificationsEnabled = true;
    vm.toggleNotifications = function() {
      vm.notificationsEnabled = !vm.notificationsEnabled;
    };

    vm.showConfirm = function(values, ev) {
      var confirm = $mdDialog.confirm()
          .title('삭제')
          .textContent('정말로 삭제하시겠습니까?')
          .targetEvent(ev)
          .ok('네')
          .cancel('아니오');

      $mdDialog.show(confirm).then(function() {
        HttpSvc.deleteReview(values)
            .success(function() {
              var alert = $mdDialog.alert()
                  .clickOutsideToClose(true)
                  .title('삭제성공')
                  .textContent('삭제되었습니다')
                  .ok('확인');

              $mdDialog.show(alert).then(function() {
                location.reload();

              })
            })


      })

    };

    //리뷰 상세보기
    vm.detailOfMycosTable = function(query) {
      $location.path('/mycostable-detail').search({param: query});
      //여기서 누른 리뷰의 번호를 가지고 detail 페이지로 이동함
    };


    //plusIcon을 누르면 리뷰쓰기 페이지로 이동
    vm.submit = function () {
      $location.path('/write')

    };

  }

  function SelectTypeController(HttpSvc, HOST, $timeout, $location, $scope, AuthService) {
    var vm = this;
    vm.host = HOST;
    var member_index = AuthService.index();


    $scope.type = null;
    $scope.types = null;
    $scope.loadTypes = function() {
      // Use timeout to simulate a 650ms request.
      return $timeout(function() {
        $scope.types =  $scope.types  || [
            { id: 1, name: '마스카라' },
            { id: 2, name: '아이섀도우' },
            { id: 3, name: '립스틱' },
            { id: 4, name: '블러셔' },
            { id: 5, name: '아이브로우' }
          ];
      }, 650);
    };

    $scope.printSelectedTypes = function printSelectedTypes(cos_type) {
      //query 에는 선택된 화장품 타입이 담겨옴

      vm.MemAndType = ({
        cos_type: "",
        member_index : ""

      });
      vm.MemAndType.cos_type = null;
      vm.MemAndType.member_index = null;


      vm.MemAndType.cos_type = cos_type;
      vm.MemAndType.member_index = member_index;

      var MemAndTypeVO = vm.MemAndType;

      HttpSvc.getCosInfoByType(MemAndTypeVO)
        .success(function(values) {
          vm.getCosInfoByTypeList = values;
        });

      $location.path('/mycostable').search({param: cos_type});


    };
  }

  //리뷰 상세 페이지 Controller
  function MyCosTableDetailController($location, HttpSvc, HOST, $rootScope) {
    var vm = this;
    var m_index = $location.search().param;
    vm.host = HOST;
    var cos_index = null;
    $rootScope.DetailM_open_date = null;
    $rootScope.DetailM_review = null;
    $rootScope.DetailM_starrate = null;


    vm.Test1 = function() {
      HttpSvc.findByMIndex(m_index)
          .success(function (values) {
            vm.mycostabledetail = values;
            $rootScope.DetailM_review = vm.mycostabledetail.m_review;
            $rootScope.DetailM_open_date = vm.mycostabledetail.m_open_date;
            $rootScope.DetailM_starrate = vm.mycostabledetail.m_starrate;

            var expireDate = vm.mycostabledetail.m_expire_date;

            var expireYear = expireDate.substring(0,4) + '년 ';
            var openYear = $rootScope.DetailM_open_date.substring(0,4) + '년 ';

            var expireMonth = expireDate.substring(4,6) + '월  ';
            var openMonth = $rootScope.DetailM_open_date.substring(4,6) + '월 ';

            var expireDay = expireDate.substring(6,8) + '일';
            var openDay = expireDate.substring(6,8) + '일';

            var reUnionDate = expireYear + expireMonth + expireDay;
            var reUnionOpenDate = openYear + openMonth + openDay;

            vm.mycostabledetail.m_expire_date = reUnionDate;
            vm.mycostabledetail.m_open_date = reUnionOpenDate;

            cos_index = vm.mycostabledetail.cos_index;
            $rootScope.cos_index = cos_index;
            vm.Test2();
          });
    };
    vm.Test1();


    vm.Test2 = function() {

      HttpSvc.getCosInformation($rootScope.cos_index)

          .success(function (values) {
            vm.cosmeticInfomation = values;


          });
    };

    vm.editDetail = function() {
      $location.path('/mycostable-edit').search({param: m_index});

    };






  }


  //리뷰 수정 페이지 Controller
  function MyCosTableEditController(HttpSvc, $location, HOST, $rootScope, Upload, $timeout, $mdDialog) {
    var vm = this;
    vm.host = HOST;
    var m_index = $location.search().param;
    var selectedOpenDate;


    $rootScope.m_index = m_index;
    var cos_indexAtEdit;
    var member_indexAtEdit;
    var cos_type;

    vm.Test = function() {
      HttpSvc.findByMIndex(m_index)
        .success(function (values) {
          vm.editMyCosTable = values;
          cos_indexAtEdit = values.cos_index;
          member_indexAtEdit = values.member_index;

          selectedOpenDate = vm.editMyCosTable.m_open_date.substring(0,4) + vm.editMyCosTable.m_open_date.substring(4,6) + vm.editMyCosTable.m_open_date.substring(6.8);

          vm.Test2();


        })
        .error(function () {

        });

    };

    vm.Test();


    vm.Test2 = function() {
        HttpSvc.getCosInformation(cos_indexAtEdit)
          .success(function(values) {
            vm.cosTypeByCosIndex = values;
            cos_type = values.cos_type;

          })
      };

    vm.Test2();






    vm.submit = function (editForm, ev) {
      var yearString;
      var monthString;
      var DateString;


        yearString = vm.editMyCosTable.m_open_date.substring(0,4);
        monthString = vm.editMyCosTable.m_open_date.substring(4,6);
        DateString = vm.editMyCosTable.m_open_date.substring(6.8);
        // selectedOpenDate = yearString + monthString + DateString;


      // cos_type 별로 사용기한 차별두어 저장
      if (cos_type == '마스카라') {
        var expireMonthDateforMaskara = Number(monthString); //월을 숫자로 바꿈
        var expireYearDateforMaskara = Number(yearString); //년을 숫자로 바꿈
        var editedExpireDateforMaskara = expireMonthDateforMaskara + 6; //마스카라 사용기한은 +6개월
        var resultExpireDate;

        if (editedExpireDateforMaskara > 12) {
          expireMonthDateforMaskara = editedExpireDateforMaskara - 12;
          expireYearDateforMaskara = expireYearDateforMaskara + 1;
          var editedExpireMonthDateforMaskaraToString = 0 + expireMonthDateforMaskara.toString();
          var editedExpireYearDateforMaskaraToString = expireYearDateforMaskara.toString();
          resultExpireDate = editedExpireYearDateforMaskaraToString + editedExpireMonthDateforMaskaraToString + DateString;
        }

        else {
          resultExpireDate = yearString + editedExpireDateforMaskara.toString() + DateString;

        }
      }

      else if (cos_type == '아이섀도우' || '블러셔' || '아이브로우') {
        var expireYearDate = Number(yearString); // 아이섀도우, 블러셔, 아이브로우의 개봉날짜의 년도
        var editedExpireDate = expireYearDate + 2; // 아이섀도우, 블러셔, 아이브로우의 사용기한은  +2년
        var editedExpireYearDateToString = editedExpireDate.toString();

        resultExpireDate = editedExpireYearDateToString + monthString + DateString;

      }

      else if (cos_type == '립스틱') {
        var expireYearDateForLipstic = Number(yearString);
        var expireMonthDateForLipstic = Number(monthString);
        var editedExpireYearDateForLipstic = expireYearDateForLipstic + 1;
        var editedExpireMonthDateForLipstic = expireMonthDateForLipstic + 6;

        if (editedExpireMonthDateForLipstic > 12) {
          expireMonthDateForLipstic = editedExpireMonthDateForLipstic - 12;
          editedExpireYearDateForLipstic = editedExpireYearDateForLipstic + 1;
          var expireYearDateForLipsticToString = editedExpireYearDateForLipstic.toString();
          var expireMonthDateForLipsticToString = expireMonthDateForLipstic.toString();

          resultExpireDate = expireYearDateForLipsticToString + expireMonthDateForLipsticToString + DateString;

        }

        else {
          resultExpireDate = editedExpireYearDateForLipstic + editedExpireMonthDateForLipstic + DateString;
        }

      }


        var file = Upload.upload({
          url: HOST + "/api/mCosdetailEdit",
          method: "POST",
          data: {
            m_index: $rootScope.m_index,
            m_open_date: selectedOpenDate,
            m_expire_date: resultExpireDate,
            cos_index: cos_indexAtEdit,
            member_index: member_indexAtEdit,
            m_review: editForm.m_review,
            m_starrate: editForm.m_starrate,
            files: editForm.picFile
          }
        }).then(function (response) {
          $timeout(function () {
            alert(response.data);
          })
        }, function (response) {
          if (response.status > 0)
            vm.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        var alert = $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('수정성공')
            .textContent('수정되었습니다')
            .ok('확인');

        $mdDialog.show(alert).then(function() {
        $location.path('/mycostable');
        location.reload();

      })
    };


  }
})();
