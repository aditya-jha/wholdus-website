(function() {
    'use strict';

    webapp.factory('APIService', [
        '$http',
        'ConstantKeyValueService',
        '$location',
        '$q',
        'LoginService',
        function($http, ConstantKeyValueService, $location, $q, LoginService) {
            var factory = {};

            function transform(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }

            factory.apiCall = function(method, url, data, params, headers, cache, transformRequest) {
                var deferred = $q.defer();

                if(!transformRequest) {
                    data = JSON.stringify(data);
                }

                if(!params) {
                    params = {};
                }
                params.access_token = ConstantKeyValueService.token;
                var apiPromise = $http({
                    method: method,
                    params: params,
                    url: url,
                    headers: headers ? {'Content-Type': 'application/x-www-form-urlencoded'} : undefined,
                    transformRequest: transformRequest ? transform : transformRequest,
                    data: data,
                    cache: cache ? cache : false
                });
                apiPromise.then(function(response) {
                    if(response.data.statusCode === '2XX') {
                        deferred.resolve(response.data.body);
                    } else {
                        if(response.data.body.error.error == 'Authentication failure') {
                            LoginService.logout();
                        }
                        deferred.reject(response.data.body);
                    }
                }, function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            factory.getAPIUrl = function(type) {
                return ConstantKeyValueService.apiBaseUrl + ConstantKeyValueService.apiUrl[type] + '/';
            };

            return factory;
        }
    ]);
})();
