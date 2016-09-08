(function() {
    webapp.controller('PlaceOrderPopupController', [
        '$scope',
        '$log',
        '$mdDialog',
        'FormValidationService',
        'APIService',
        '$routeParams',
        'UtilService',
        'ToastService',
        'product',
        function($scope, $log, $mdDialog, FormValidationService, APIService, $routeParams, UtilService, ToastService, product) {

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.placeOrder = function() {
                var data = {
                    buyerID: UtilService.getIDFromSlug($routeParams.storeUrl),
                    productID:$scope.product.productID,
                    name: $scope.name,
                    mobile_number: $scope.mobile_number,
                    email: $scope.email
                };
                $scope.apiCall = APIService.apiCall("POST", APIService.getAPIUrl('storeLead'), data, {
                    store_url: $routeParams.storeUrl
                });
                $scope.apiCall.then(function(response) {
                    $scope.apiCall = null;
                    $scope.cancel();
                    ToastService.showActionToast("Order successfully placed", 5000);
                }, function(error) {
                    $scope.apiCall = null;
                    $scope.cancel();
                    ToastService.showActionToast("Sorry! couldn't place order", 5000);
                });
            };

            function getSizes(size) {
                var sizes = size && size != 'None' ? size.split(',') : [];
                return sizes;
            }

            function init() {
                $scope.apiCall = null;
                $scope.product = product;
                $scope.allSizes = ['S', 'M', 'L', 'XL', 'XXL'];
                $scope.placeOrderForm = 'placeOrderForm';
                $scope.sizes = getSizes(product.details.sizes);
                $scope.formValidation = FormValidationService;
            }
            init();
        }
    ]);
})();
