(function() {
    webapp.controller('StoreHomeController', [
        '$scope',
        '$log',
        '$routeParams',
        'UtilService',
        'APIService',
        '$rootScope',
        function($scope, $log, $routeParams, UtilService, APIService, $rootScope) {

            function getStoreDetails(storeUrl) {
                var params = {
                    store_url: storeUrl
                };
                APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                .then(function(response) {
                    if(response && response.buyers && response.buyers.length) {
                        response.buyers[0].mobileUrl = "tel:+91" + response.buyers[0].mobile_number;
                        $scope.store = response.buyers[0];
                        $rootScope.$broadcast('store', $scope.store);
                    } else {
                        $location.url('/');
                    }
                }, function(error) {
                    $log.log(error);
                    $location.url('/');
                });
            }

            function init() {
                getStoreDetails($routeParams.storeUrl);
            }
            init();
        }
    ]);
})();
