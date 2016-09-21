/**
 * Created by Yeeun Jung on 2016-09-03.
 */

(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('SearchController',SearchController);
  /** @ngInject */
  function SearchController(HttpSvc, HOST, $location, AuthService, $mdDialog) { //화장품 검색

    var vm = this;
    vm.host = HOST;
    // //검색
    //   HttpSvc.getSearch($location.search().param)
    //     .success(function (values) {
    //       vm.cosmeticsList = values;
    //       vm.searchText = $location.search().param;
    //     }).error(function () {
    //   });

    HttpSvc.getSearch($location.search().param)
      .success(function (values) {
        vm.cosmeticsList = values;
        vm.searchText = $location.search().param;
        var a = vm.cosmeticsList.length;
        vm.tiles = buildGridModel({
          cos_name : "",
          cos_brand : "",
          cos_price : "",
          background : "black",
          cos_pic : ""
        });

        function buildGridModel(tileTmpl){
          var it, results = [ ];

          for (var i=0; i< a; i++) {
            it = angular.extend({},tileTmpl);
            it.cos_name = vm.cosmeticsList[i].cos_name;
            it.cos_brand = vm.cosmeticsList[i].cos_brand;
            it.cos_price = vm.cosmeticsList[i].cos_price;
            it.span  = { row : 1, col : 1 };
            it.cos_pic = vm.cosmeticsList[i].cos_pic;

            results.push(it);
          }
          return results;
        }



      }).error(function () {

    });


    //관심리스트 추가하기
    vm.save = function(interest, ev) {
      var interestVO = {
            member_index: AuthService.index(),
            cos_index: interest.cos_index
          };
      var confirm = $mdDialog.confirm()
        .title('관심리스트')
        .textContent('관심리스트로 추가하시겠습니까?')
        .targetEvent(ev)
        .ok('네')
        .cancel('아니오');

      $mdDialog.show(confirm).then(function() {
        HttpSvc.addInterest(interestVO)

          .success(function (values) {
                  if(values == 1) {
                    alert('저장하였습니다.');
                    $location.path('/interest');
                  }
                  else
                    alert('이미 저장되었습니다.');
                }).error(function (status) {
                alert('저장 실패');
                alert(status);
              });
      })
    };

  }
    })();
