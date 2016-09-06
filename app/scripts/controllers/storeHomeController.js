(function() {
    webapp.controller('StoreHomeController', [
        '$scope',
        '$log',
        '$routeParams',
        'UtilService',
        'APIService',
        '$rootScope',
        'ngProgressBarService',
        function($scope, $log, $routeParams, UtilService, APIService, $rootScope, ngProgressBarService) {

            function setMobileUrl() {
                var url = $scope.isMobile ? "tel:+91" + response.buyers[0].mobile_number : null;
                return url;
            }

            function setCompleteAddress(add) {
                var address = "";
                if(add && add.length>0) {
                    add = add[0];
                    address += add.address + ', near ' + add.landmark + ", " + add.city + ', ' + add.state + ', ' + add.pincode;
                }
                return address;
            }

            function getStoreDetails(storeUrl) {
                ngProgressBarService.showProgressbar();
                var params = {
                    store_url: storeUrl
                };
                APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                .then(function(response) {
                    if(response && response.buyers && response.buyers.length) {
                        response.buyers[0].mobileUrl = setMobileUrl();
                        response.buyers[0].complete_address = setCompleteAddress(response.buyers[0].address);
                        $scope.store = response.buyers[0];
                        $rootScope.$broadcast('store', $scope.store);
                        ngProgressBarService.endProgressbar();
                    } else {
                        $location.url('/');
                    }
                }, function(error) {
                    ngProgressBarService.endProgressbar();
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
