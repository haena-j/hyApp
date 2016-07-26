angular.module('starter.services', [])

  .service('LoginSvc', function($http, HOST) {   //해니꺼 로그인

    this.checkLoginInfo = function(data) {
      return $http({
        url: HOST + '/api/login',
        method: 'POST',
        data: data,
        headers: {'Content-Type': 'application/json'}
      });
    };
  })

  .service('HttpSvc', function($http, HOST) {  //화장품목록 가져오기

    this.getCosmeticsList = function () {
      return $http({
        url: HOST + '/api/cosmeticsList',
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
    };
  })

  .service('HttpSvc2', function ($http, HOST) {

    this.getSearch = function (query) { //화장품 검색하기,
      return $http({
        url: HOST + '/api/search',
        method: 'POST',
        data: query,
        headers: {'Content-Type': 'application/json'}
      });
    };

    this.addInterest = function (interest) { //관심리스트등록
      return $http({
        url: HOST + '/api/interest',
        method: 'POST',
        data: interest,
        headers: {'Content-Type': 'application/json'}
      });
    };

    this.deleteInterest = function (interest) { //관심리스트등록
      return $http({
        url: HOST + '/api/deleteInterest',
        method: 'POST',
        data: interest,
        headers: {'Content-Type': 'application/json'}
      });
    };

    this.getInterestList = function (query) {  //관심리스트 불러오기
      return $http({
        url: HOST + '/api/interestList',
        method: 'POST',
        data: query,
        headers: {'Content-Type': 'application/json'}
      });
    };

});
