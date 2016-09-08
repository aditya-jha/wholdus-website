(function() {
    webapp.controller('PurchaseRequestsController', [
        '$scope',
        '$log',
        'APIService',
        'ngProgressBarService',
        '$q',
        'UtilService',
        function($scope, $log, APIService, ngProgressBarService, $q, UtilService) {

            function fetchPurchaseRequests(type) {
                var deferred = $q.defer();
                ngProgressBarService.showProgressbar();
                if(type == 2) {
                    type = "0,1";
                }
                var params = {
                    buyer_store_lead_status: type
                };
                APIService.apiCall("GET", APIService.getAPIUrl('storeLead'), null, params)
                .then(function(response) {
                    ngProgressBarService.endProgressbar();
                    deferred.resolve(response);
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    deferred.reject(error);
                });
                return deferred.promise;
            }

            function parseProducts(obj) {
                angular.forEach(obj, function(value, key) {
                    value.statusTest = value.status ? 'Resolved' : 'UnResolved';
                    value.status = value.status ? true : false;
                    value.product.images = UtilService.getImages(value.product);
                    if(value.product.images.length) {
                        value.product.imageUrl = UtilService.getImageUrl(value.product.images[0], '200x200');
                    }
                });
            }

            function fetchPurchaseRequestsHelper(response) {
                if(response && response.buyer_store_leads && response.buyer_store_leads.length) {
                    parseProducts(response.buyer_store_leads);
                    $scope.purchaseRequests = response.buyer_store_leads;
                } else {
                    $scope.purchaseRequests = [];
                }
            }

            function init() {
                $scope.isMobile = UtilService.isMobileRequest();
                $scope.selectedIndex = 0;
                // fetchPurchaseRequests($scope.selectedIndex);
            }
            init();

            $scope.tabSelected = function(type) {
                $scope.purchaseRequests = undefined;
                fetchPurchaseRequests(type).then(function(response) {
                    $log.log(response);
                    fetchPurchaseRequestsHelper(response);
                }, function(error) {
                    $log.log(error);
                });
            };
        }
    ]);
})();
