/**
 * Created By JUNGMIN on 2016-09-03.
 */
(function() {
  'use strict';

  angular
    .module('gulpAngular')
    .controller('WriteController', WriteController)
    .controller('SearchAtWriteController', SearchAtWriteController)
    .controller('DemoController', DemoController)
    .controller('SelectAsyncController,',  SelectAsyncController);
  /** @ngInject */
  function WriteController(HOST, HttpSvc, $location, AuthService, Upload, $timeout, $mdDialog) {
    var cos_index = $location.search().param;
    var member_index = AuthService.index();
    var vm = this;
    vm.host = HOST;

    vm.searchCosByBrand = function () {
      $location.path('/searchAtWrite');
    };

    vm.writeAfterSearch = function () {
      HttpSvc.getCosInformation(cos_index)
        .success(function (values) {
          vm.cosmeticsinformList = values;
        })
    };

    // cos_index 가 null 이 아닐때만 writeAfterSearch 함수 실행
    if (cos_index != null) {
      vm.writeAfterSearch();
    }

    vm.submitAtWrite = function (write, cos_type, ev) {
      if (cos_index == null || write.m_open_date == null || write.m_review == null || write.picFile == null)
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#writeContainer')))
            .clickOutsideToClose(true)
            .title('저장 실패')
            .textContent('모든 정보를 입력해주세요')
            .ariaLabel('Alert Dialog')
            .ok('확인')
            .targetEvent(ev)
        );

      var cos_type = cos_type;
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


      // var expireDate2 = expireDateforMaskara.toString();
      // resultExpireDate = expireDate2 + monthString + DateString;

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

      file.then(function (response) {
        $timeout(function () {
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
      location.reload();

    };

    // star rating
    var starRating = function () {
      var $star = $(".star-input"),
        $result = $star.find("output>b");
      $(document)
        .on("focusin", ".star-input>.input", function () {
          $(this).addClass("focus");
        })
        .on("focusout", ".star-input>.input", function () {
          var $this = $(this);
          setTimeout(function () {
            if ($this.find(":focus").length === 0) {
              $this.removeClass("focus");
            }
          }, 100);
        })
        .on("change", ".star-input :radio", function () {
          $result.text($(this).next().text());
        })
        .on("mouseover", ".star-input label", function () {
          $result.text($(this).text());
        })
        .on("mouseleave", ".star-input>.input", function () {
          var $checked = $star.find(":checked");
          if ($checked.length === 0) {
            $result.text("0");
          } else {
            $result.text($checked.next().text());
          }
        });
    };
    starRating();
  }

  function SelectAsyncController(HOST, $timeout, $location) {
    var vm = this;
    vm.host = HOST;

    vm.type = null;
    vm.types = null;
    vm.loadTypes = function() {
      return $timeout(function() {
        vm.types = vm.types || [
            { id: 1, name: '마스카라' },
            { id: 2, name: '아이섀도우' },
            { id: 3, name: '립스틱' },
            { id: 4, name: '블러셔' },
            { id: 5, name: '아이브로우' }
          ];
      }, 650);
    };

    vm.printSelectedTypes = function printSelectedTypes(query) {
      alert(query);
      $location.path('/searchAtWrite').search({param2: query}); ///////////////////////////////이거해야함!!!!
      location.reload();
    }
  }


  function DemoController($mdDialog, HttpSvc, HOST, $rootScope) {
    var self = this;
    var vm = this;
    vm.host = HOST;
    vm.cosBrandNameList = null;
    $rootScope.cosBrandNameList = null;


    // 화장품 브랜드이름 가져오는 함수
    vm.getCosBrandName = function() {
      HttpSvc.getCosBrandName()
        .success(function(values) {
          $rootScope.cosBrandNameList = values;
        })
        .error(function() {
        })

    };
    vm.getCosBrandName(); // 브랜드이름가져오는함수 실행


    self.openDialog = function ($event) {
      $mdDialog.show({
        controller: DialogCtrl,
        controllerAs: 'ctrl',
        templateUrl: 'app/write/dialog.tmpl.html',
        //다이얼로그 창을 구성하는 html
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose: true

      })
    }
  }




  // 다이얼로그 창을 제어하는 컨트롤러
  function DialogCtrl($timeout, $q, $mdDialog, $rootScope, $location) {
    var self = this;

    // state의 리스트 객체들 불러오는 함수
    self.states        = loadAll();
    self.querySearch   = querySearch;
    // ******************************
    // Template methods
    // ******************************

    self.cancel = function ($event) {
      $mdDialog.cancel();
    };

    self.finish = function ($event, selectedBrand) {
      $mdDialog.hide();
      $location.path('/searchAtWrite').search({param1: selectedBrand});

    };

    // ******************************
    // Internal methods  내부 메소드
    // ******************************

    //state에 저장된 정보를 하나씩 불러오는것
    function querySearch (query) {
      return query ? self.states.filter( createFilterFor(query) ) : self.states;
    }

    function loadAll() {
      //List로 넘어온 화장품브랜드이름 리스트를 문자열로 바꿔줘야함
      var allBrandName = $rootScope.cosBrandNameList.toString();

      // 콤마(,)를 기준으로 나누어준다
      return allBrandName.split(',').map(function (state) {
        return {
          value: state,
          display: state
        };
      });
    }


    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
  }

  //다이얼로그 관련 컨트롤러 끝

  function SearchAtWriteController(HOST, HttpSvc, $location) {
    var vm = this;
    vm.host = HOST;
    var selectedBrand = $location.search().param1;
    var selectedType = $location.search().param2;

    if (selectedType != null) {
      alert("Type이 있음");
      vm.Test3 = function() {
        HttpSvc.getCosByBrandAndType(selectedType, selectedBrand)
          .success(function(values) {
            vm.CosListByBrandAndType = values;
            alert("CosListByBrandAndType" + vm.CosListByBrandAndType);
          })
          .error(function() {

          });

      };
      vm.Test3();
    }


    // 화장품 검색에서 찾은 쿼리
    vm.Test = function() {
      HttpSvc.getSearch(selectedBrand)
          .success(function (values) {
            vm.list = values;
          })
          .error(function (values) {
            alert("error" + values);
          });
      };
    vm.Test();

    // 다시 검색할때 작동하는 메소드
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
