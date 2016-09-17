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

    // vm.redial = function() {
    //   $mdDialog.show(
    //     $mdDialog.alert()
    //       .targetEvent(originatorEv)
    //       .clickOutsideToClose(true)
    //       .parent('body')
    //       .title('Suddenly, a redial')
    //       .textContent('You just called a friend; who told you the most amazing story. Have a cookie!')
    //       .ok('That was easy')
    //   );
    //
    //   originatorEv = null;
    // };

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

    // vm.editDetail = function() {
    //   $location.path('/mycostable-edit');
    //
    // };






  }


  //리뷰 수정 페이지 Controller
  function MyCosTableEditController($location, HttpSvc, HOST, $rootScope, Upload) {

  }
})();
