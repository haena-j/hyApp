/**
 * Created By JUNGMIN on 2016-09-03.
 */
(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('WriteController', WriteController)
    .controller('SearchAtWriteController', SearchAtWriteController);
  /** @ngInject */
  function WriteController(HOST, HttpSvc, $location, AuthService, Upload, $timeout, $state) {
    var cos_index = $location.search().param;
    var member_index = AuthService.index();
    var vm = this;
    vm.host = HOST;

    vm.searchCosByBrand = function() {
      $location.path('/searchAtWrite');
    };

    vm.writeAfterSearch = function() {
      HttpSvc.getCosInformation2(cos_index)
        .success(function (values) {
          vm.cosmeticsinformList = values;
        })
    };

    // cos_index 가 null 이 아닐때만 writeAfterSearch 함수 실행
    if (cos_index != null) {
      vm.writeAfterSearch();
    }

    vm.submitAtWrite = function(write) {
      var m_open_date_toString = write.m_open_date.toString();
      var yearString = m_open_date_toString.substring(11, 15);
      var monthString = m_open_date_toString.substring(4, 7);

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
      var editedExpireDate = Number(yearString);
      var expireDate = editedExpireDate + 2;
      var expireDate2 = expireDate.toString();
      var resultExpireDate = expireDate2 + monthString + DateString;

      var file = Upload.upload({
        url: HOST + '/api/myCosmetics',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {
          m_open_date: selectedOpenDate,
          m_expire_date: resultExpireDate,
          cos_index: cos_index,
          member_index: member_index,
          m_review: write.m_review,
          files: write.picFile
        }
      });

      file.then(function(response) {
        $timeout(function() {
          alert(response.data);
        });
      }, function (response) {
        if (response.status > 0)
          vm.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        file.progress = Math.min(100, parseInt(100.0 *
          evt.loaded / evt.total));
      });

      $location.path('/mycostable');
      // location.reload();

    };
  }

  function SearchAtWriteController(HOST, HttpSvc, $location) {
    var vm = this;
    vm.host = HOST;
    vm.searchAtWriteSubmit = function(cos_brand) {
      HttpSvc.getSearch(cos_brand)
        .success(function (values) {
          vm.list = values;
        })
        .error(function (values) {
          alert("error" + values);
        });
    };

    vm.selectToWriteReview = function(cos_index) {
      HttpSvc.getCosInformation(cos_index)
        .success(function (values) {
          vm.list2 = values;
          //클릭한 화장품의 cos_index를 가지고 검색 후 화장품등록 페이지로 이동
          $location.path('/write').search({param: values.cos_index });
          location.reload();
        })
        .error(function (values) {
          alert("error" + values);
        });
    };
  }


})();
