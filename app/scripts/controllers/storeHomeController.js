(function() {
    webapp.controller('StoreHomeController', [
        '$scope',
        '$log',
        '$routeParams',
        'UtilService',
        'APIService',
        '$rootScope',
        function($scope, $log, $routeParams, UtilService, APIService, $rootScope) {

            function setMobileUrl() {
                var url = $scope.isMobile ? "tel:+91" + response.buyers[0].mobile_number : null;
                return url;
            }

            function getStoreDetails(storeUrl) {
                var params = {
                    store_url: storeUrl
                };
                APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                .then(function(response) {
                    if(response && response.buyers && response.buyers.length) {
                        response.buyers[0].mobileUrl = setMobileUrl();
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
                $scope.isMobile = UtilService.isMobileRequest();
                getStoreDetails($routeParams.storeUrl);
            }
            init();
        }
    ]);
})();
