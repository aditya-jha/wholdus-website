(function() {
    "use strict";
    webapp.factory('LoginService', [
        'ConstantKeyValueService',
        '$rootScope',
        'APIService',
        '$q',
        'localStorageService',
        function(ConstantKeyValueService, $rootScope, APIService, $q, localStorageService) {
            var factory = {};

            factory.loginStatus = false;
            factory.buyer = {};

            function loginSuccess(response) {
                factory.loginStatus = true;
                ConstantKeyValueService.token = response.token;
                localStorageService.set(ConstantKeyValueService.accessTokenKey, response.token);
            }

            factory.setAccessToken = function(response) {
                loginSuccess(response);
            };

            factory.checkLoggedIn = function() {
                var token = localStorageService.get(ConstantKeyValueService.accessTokenKey);
                if(token) {
                    factory.loginStatus = true;
                    ConstantKeyValueService.token = token;
                } else {
                    factory.loginStatus = false;
                }
                return factory.loginStatus;
            };

            factory.logout = function() {
                factory.loginStatus = false;
                ConstantKeyValueService.token = null;
                localStorageService.remove(ConstantKeyValueService.accessTokenKey);
            };

            factory.login = function(mobile, password) {
                var deferred = $q.defer();
                var data = {
                    mobile_number: mobile,
                    password: password
                };
                var apicall = APIService.apiCall("POST", APIService.getAPIUrl('buyerLogin'), data, null, true, false, true);
                apicall.then(function(response) {
                    loginSuccess(response);
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            return factory;
        }
    ]);
})();
