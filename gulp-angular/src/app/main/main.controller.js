(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, AuthService, HOST, toastr, HttpSvc, $mdDialog) {
    var vm = this;
    vm.host = HOST;

    vm.userImage = AuthService.image();
    vm.username = AuthService.name();
    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1472374677463;
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }



    HttpSvc.getCountReview(AuthService.index()) // 내가 등록한 화장품 갯수
      .success(function (values) {
        vm.countReview = values;
      }).error(function () {
        alert("실패");
      });

    var typeIndex = 4;
    var cosTypeStarListArr = ["마스카라","아이섀도우", "립스틱", "블러셔", "아이브로우"];
    vm.cosType = '아이브로우';

    HttpSvc.getCosTypeStarAvg(cosTypeStarListArr[typeIndex]) // 타입별 상위 별점 불러오기
      .success(function (values) {
        vm.cosTypeStarList = values;
      }).error(function () {
      alert("타입별실패");
    });

    vm.prevSlide = function () {
      if(typeIndex==0){
        typeIndex = 5;
      }
      HttpSvc.getCosTypeStarAvg(cosTypeStarListArr[--typeIndex])
        .success(function (values) {
          vm.cosTypeStarList = values;
          vm.cosType  = cosTypeStarListArr[typeIndex];
        }).error(function () {
        alert("타입별실패");
      });
    };

    vm.nextSlide = function () {
      if(typeIndex==4){
        typeIndex = -1;
      }
      HttpSvc.getCosTypeStarAvg(cosTypeStarListArr[++typeIndex])
        .success(function (values) {
          vm.cosTypeStarList = values;
          vm.cosType  = cosTypeStarListArr[typeIndex];
        }).error(function () {
      });
    };

    var timer;
    var sliderFunc=function(){
      timer=$timeout(function(){
        vm.nextSlide();
        timer=$timeout(sliderFunc,1500);
      },1500);
    };
    sliderFunc();

    HttpSvc.getInterestList(AuthService.index()) // 내가 등록한 관심리스트 갯수
      .success(function (values) {
        vm.countInterest = values.length;
      }).error(function () {
      alert("실패");
    });

      HttpSvc.interestFindAll()  // 최근 관심리스트로 등록된 화장품 가져오기
        .success(function (values) {
          vm.interestList = values;

          vm.tiles = buildGridModel({
            cos_name : "",
            cos_brand : "",
            cos_price : "",
            background : "",
            cos_pic : "",
            cos_starrateAvg: ""
        });

        function buildGridModel(tileTmpl){
          var it, results = [ ];

          for (var i=0; i<9; i++) {
            it = angular.extend({},tileTmpl);
            it.cos_pic = vm.interestList[i].cos_pic;
            it.cos_name = vm.interestList[i].cos_name;
            it.cos_brand = vm.interestList[i].cos_brand;
            it.cos_price = vm.interestList[i].cos_price;
            it.cos_starrateAvg = vm.interestList[i].cos_starrateAvg;
            it.span  = { row : 1, col : 1 };


            results.push(it);
          }
          return results;
       }
      }).error(function () {

    });




    HttpSvc.findByMemIndex(AuthService.index()) // 유통기한 D-DAY
      .success(function (values) {
        vm.cosExpireList = values;
        vm.latestExpire=0;
        vm.ddate=100000000;

        for(var i = 0; i < vm.cosExpireList.length; i++) {
          var date = new Date();
          var str = vm.cosExpireList[i].m_expire_date;
          var str2 = str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6, 8);

          var d_day = new Date(str2);
          var gap = d_day.getTime() - date.getTime();
          var aa = Math.ceil(gap / (1000 * 60 * 60 * 24));

          vm.cosExpireList[i].newList = aa;

          if (vm.cosExpireList[i].newList <= vm.ddate) {
              vm.latestExpire = i;
            vm.ddate=vm.cosExpireList[i].newList;
          }

        }

        vm.openExpire = function(ev) {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('D - '+ vm.cosExpireList[vm.latestExpire].newList)
              .textContent(vm.cosExpireList[vm.latestExpire].cos_name)
              .ariaLabel('Alert Dialog Demo')
              .ok('확인')
              .targetEvent(ev)
          );
        };
      }).error(function () {

    });



  }
})();
