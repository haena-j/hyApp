angular.module('starter.services', [])

  .service('HttpSvc', function($http, HOST) {
    //Member table에 등록된 모든 정보 가져옴
    this.getMemberList = function () {
      return $http({
        url: HOST + '/api/memberList',
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });  };

      //화장품 정보 등록
    this.addCosmetics = function (query) {
      return  $http({
        url: HOST + '/api/cosmetics',
        method: 'POST',
        data: query,
        headers: {'Content-Type': 'application/json'}
      });  };

      //Daum api로 검색한 화장품 정보 가져옴 (관리자모드)
    this.getSearchResultList = function (query) {
      return $http({
        url : HOST + '/api/daumSearch',
        method: 'POST',
        data: query,
        headers: {'Content-Type': 'application/json'}
      });  };

      //사용자와 비슷한 화장품 갖고있는 회원 상위 3개 리스트 가져옴
      this.getRelatedMemberList = function (query) {
        return $http({
          url : HOST + '/api/getRelatedMemberList',
          method: 'POST',
          data: query,
          headers: {'Content-Type': 'application/json'}
        });  };

        //추천수 ++
        this.updateMemberStar = function (query) {
          return $http({
            url : HOST + '/api/updateMemberStar',
            method: 'POST',
            data: query,
            headers: {'Content-Type': 'application/json'}
          }); };

          //추천수 높은 순으로 회원정보 상위3개 리스트 가져옴
        this.getHighRankList = function (query) {
          return $http({
            url : HOST + '/api/getHighRankList',
            method: 'POST',
            data: query,
            headers: {'Content-Type': 'application/json'}
          });   };

    // MemberIndex 가 가지고있는 화장품들 데이터 가져오기
    this.getMyCosmeticsByMemberIndex= function (member_index) {
      return $http({
        url: HOST + '/api/mycostableList',
        method: 'POST',
        data: member_index,
        headers: {'Content-Type': 'application/json'}
      });
    };

  })

  //Authentication 을 위한 부분. 로그인&로그아웃 처리 등
  .service('AuthService', function($q, $http, USER_ROLES, HOST) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var id = '';
    var index = '';
    var password = '';
    var image = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    function useCredentials(token) {
      index = token.split(',')[0];
      id = token.split(',')[1];
      password = token.split(',')[2];
      image = token.split(',')[3];
      isAuthenticated = true;
      authToken = token;
      if (id == 'admin') {
        role = USER_ROLES.admin
      }
      else{
        role = USER_ROLES.public
      }

      // // Set the token as header for your requests!
      $http.defaults.headers.common['X-Auth-Token'] = token;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      index='';
      id = '';
      password='';
      image='';
      isAuthenticated = false;
      $http.defaults.headers.common['X-Auth-Token'] = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var login = function(id, pw) {
      return $q(function(resolve, reject) {
        var data={id : id, password: pw};
       var request = $http({
          url: HOST + '/api/login',
          method: 'POST',
          data: data,
          headers: {'Content-Type': 'application/json'}
        });
        request.success(function (values) {
          if (values != null && values != "") {
            storeUserCredentials(values.member_index + ',' + id + ',' + pw + ',' + values.image + ',yourServerToken');
            resolve('Login success.');
          } else {
            reject('Login Failed.');
          }
        }).error(function (value, status) {
          alert(value + " , " +  status);
        });
      });
    };

    var logout = function() {
      destroyUserCredentials();
    };

    var isAuthorized = function(authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };

    loadUserCredentials();

    return {
      login: login,
      logout: logout,
      isAuthorized: isAuthorized,
      isAuthenticated: function() {return isAuthenticated;},
      id: function() {return id;},
      role: function() {return role;},
      index: function () {return index;},
      image: function () {return image;}
    };
  })

  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function (response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated,
          403: AUTH_EVENTS.notAuthorized
        }[response.status], response);
        return $q.reject(response);
      }
    };
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  })

/************************************예은 코드*****************************************/
  .service('HttpSvc2', function ($http, HOST) {
    this.getCosmeticsList = function () {
      return $http({
        url: HOST + '/api/cosmeticsList',
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
    };

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

    this.getInterestList = function (query) {  //관심리스트 불러오기
      return $http({
        url: HOST + '/api/interestList',
        method: 'POST',
        data: query,
        headers: {'Content-Type': 'application/json'}
      });
    };
  })
/************************************예은 코드끝*****************************************/
;

