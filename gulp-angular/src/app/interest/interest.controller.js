/**
 * Created by Yeeun Jung on 2016-09-03.
 */

(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('InterestController',InterestController)
    .controller('InterestBrandController', InterestController)
  //////////////////
    .controller('SelectAsyncController', function($timeout, $scope, $location) {

      $scope.brand  = null;
      $scope.brands = null;
      $scope.loadBrands = function() {
        // Use timeout to simulate a 650ms request.
        return $timeout(function() {
          $scope.brands =  $scope.brands  || [
              { id: 1, name: '더페이스샵' },
              { id: 2, name: '로레알' },
              { id: 3, name: '메이블린' },
              { id: 4, name: '미샤' },
              { id: 5, name: '스킨푸드' },
              { id: 6, name: '아리따움' },
              { id: 7, name: '에뛰드하우스' },
              { id: 8, name: '이니스프리' },
              { id: 9, name: '크리니크' },
              { id: 10, name: '토니모리' }
            ];
        }, 650);
      };

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

      $scope.printSelectedBrands = function printSelectedBrands(query) {
                  alert(query);
        $location.path('/interest').arrange({param: query}); ///////////////////////////////이거해야함!!!!
        location.reload();

      }

      $scope.printSelectedTypes = function printSelectedTypes(query) {
        alert(query);
        $location.path('/interest').search({param: query}); ///////////////////////////////이거해야함!!!!
        location.reload();

      }

    });

  /** @ngInject */
  function InterestController(HttpSvc, HOST, $location, AuthService) { //관심리스트

    var vm = this;
    vm.host = HOST;

    //페이지 열자마자 회원에 해당하는 관심리스트 목록 불러오기
    vm.Test = function () {
      HttpSvc.getInterestList(AuthService.index())
        .success(function (values) {
          vm.cosmeticsList = values;
        }).error(function (values, status) {
        alert('실패');
      });
    };
    vm.Test();

    vm.arrange = function(query){
      alert("성공");
    };

    vm.delete = function (query) {
      HttpSvc.deleteInterestCos(query)
        .success(function () {alert("삭제되었습니다.");
        location.reload();
      }).error(function (values) {alert("삭제실패!");});
    }


  }

})();
