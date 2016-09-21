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
      .controller('MyCosTableDetailController', MyCosTableDetailController);

  /** @ngInject */

  //내 리뷰 목록 페이지 Controller
  function MyCosTableController (HttpSvc, $location, HOST, AuthService, $mdDialog) {
    var vm = this;
    var originatorEv;
    vm.host = HOST;
    var member_index = AuthService.index();

    //내 화장대 접근했을 때 바로 실행되는 함수 Test 정의
    vm.Test = function () {
      HttpSvc.findByMemIndex(member_index)
          .success(function (values) {
            vm.mycosmeticsList = values;

          })
          .error(function () {

          })
      

    }; vm.Test(); //함수 Test 실행



    vm.Test2 = function() {
      HttpSvc.findUserByMIndex(member_index)
          .success(function(values) {
            vm.memberInfo = values;
          })
          .error(function() {

          })
    };
    vm.Test2(); //함수 Test2 실행

    vm.cards = [
      {
        title: "escheresque-dark",
        icon:"",
        imageUrl:"http://subtlepatterns.com/patterns/escheresque_ste.png",
        description:"Sublte Pattern Source image below...",
        source: "http://subtlepatterns.com/escheresque-dark/"
      },
      {
        title: "dark sharp edges",
        icon:"",
        imageUrl:"http://subtlepatterns.com/patterns/footer_lodyas.png",
        description:"Sublte Pattern Source image below...",
        source: "http://subtlepatterns.com/dark-sharp-edges/"
      },
      {
        title: "Grey Washed Wall",
        icon:"",
        imageUrl:"http://subtlepatterns.com/patterns/grey_wash_wall.png",
        description:"Sublte Pattern Source image below...",
        source: "http://subtlepatterns.com/grey-washed-wall/"
      }
    ];

    vm.currentCard = {};
    vm.isCardRevealed = false;
    vm.flipCard = function () {
      vm.isCardRevealed = !vm.isCardRevealed;
      if (vm.isCardRevealed) {
        vm.generateCard();
      } else {
        vm.currentCard = {};
      }
    };

    vm.generateCard = function () {
      vm.currentCard = {};
      var index = Math.floor((Math.random()*vm.cards.length));
      vm.currentCard = vm.cards[index];
    };

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
            .error(function(values) {
              alert("error" + values);
            })


      })

    }

    //리뷰 상세보기
    vm.detailOfMycosTable = function(query) {
      $location.path('/mycostable-detail').search({param: query});
      //여기서 누른 리뷰의 번호를 가지고 detail 페이지로 이동함
    };

    //그 리뷰를 삭제
    // vm.deleteReview = function(query) {
    // $mdDialog.show(
    //   $mdDialog.alert()
    //     .clickOutsideToClose(true)
    //     .parent('body')
    //     .title('정말 삭제하시겠습니까?')
    //     .textContent('You just called a friend; who told you the most amazing story. Have a cookie!')
    //     .ok('네')
    //     .cancel('아니요')
    //     .targetEvent(originatorEv)
    // );


    // };


    //plusIcon을 누르면 리뷰쓰기 페이지로 이동
    vm.submit = function () {
      $location.path('/write')

    };

    //내 화장대 각 리뷰 상세페이지로 이동
    // vm.detailOfMycosTable = function(query) {
    //   $location.path('/mycostable-detail').search({param: query});
    //   //여기서 누른 리뷰의 번호를 가지고 detail 페이지로 이동함
    //   location.reload();
    // };


  }

  //리뷰 상세 페이지 Controller
  function MyCosTableDetailController($location, HttpSvc, HOST, $rootScope) {
    var vm = this;
    var m_index = $location.search().param;
    vm.host = HOST;
    var cos_index = null;

    vm.Test1 = function() {
      HttpSvc.findByMIndex(m_index)
          .success(function (values) {
            vm.mycostabledetail = values;
            var openDate = vm.mycostabledetail.m_open_date;
            var expireDate = vm.mycostabledetail.m_expire_date;

            var expireYear = expireDate.substring(0,4) + '년 ';
            var openYear = openDate.substring(0,4) + '년 ';

            var expireMonth = expireDate.substring(4,6) + '월  ';
            var openMonth = openDate.substring(4,6) + '월 ';

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
  function MyCosTableEditController($location, HttpSvc, $mdDialog, HOST, $rootScope, Upload, $timeout) {
    var vm = this;
    vm.host = HOST;

    var m_index = $location.search().param;
    var cos_index;
    var member_index;
    alert("수정할 리뷰번호 : " + m_index);
    $rootScope.m_index = m_index;
    HttpSvc.findByMIndex(m_index)
        .success(function (values) {
          vm.editMyCosTable = values;
          alert("editmycostable" + values.cos_index);
          cos_index = values.cos_index;
          member_index = values.member_index;
        })

    vm.submit3 = function(editForm) {
      var m_open_date_toString = editForm.m_open_date.toString();
      alert("수정하기 전 개봉일자" + m_open_date_toString);
      var yearString = m_open_date_toString.substring(11,15);
      var monthString = m_open_date_toString.substring(4,7);

      if (monthString == 'Jan')
        monthString = '01';
      else if (monthString == 'Feb')
        monthString = '02';
      else if (monthString == 'Mar')
        monthString = '03';
      else if (monthString == 'Apr')
        monthString = '04';
      else if (monthString == 'May')
        monthString = '05';
      else if (monthString == 'Jun')
        monthString = '06';
      else if (monthString == 'Jul')
        monthString = '07';
      else if (monthString == 'Aug')
        monthString = '08';
      else if (monthString == 'Sep')
        monthString = '09';
      else if (monthString == 'Oct')
        monthString = '10';
      else if (monthString == 'Nov')
        monthString = '11';
      else if (monthString == 'Dec')
        monthString = '12';
      var DateString = m_open_date_toString.substring(8, 10);
      var selectedOpenDate = yearString + monthString + DateString;


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
        url: HOST + '/api/mCosdetailEdit',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {
          m_index: $rootScope.m_index,
          m_open_date: selectedOpenDate,
          m_expire_date: resultExpireDate,
          cos_index: cos_index,
          member_index:member_index,
          m_review: editForm.m_review,
          files: editForm.picFile
        }
      });
      file.then(function(response) {
        $timeout(function() {
          alert(response.data);
        })}, function (response) {
        if (response.status > 0)
          vm.errorMsg = response.status + ': ' + response.data;
      }, function(evt) {
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
