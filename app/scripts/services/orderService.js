(function() {
    'use strict';
    webapp.factory('OrderService', [
        '$rootScope',
        'ConstantKeyValueService',
        'APIService',
        '$q',
        function($rootScope, ConstantKeyValueService, APIService, $q) {
            var factory = {};

            factory.fetchOrders = function(params) {
                var deferred = $q.defer();

                var apicall = APIService.apiCall("GET", APIService.getAPIUrl("orders"), null, params);
                apicall.then(function(response) {
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
