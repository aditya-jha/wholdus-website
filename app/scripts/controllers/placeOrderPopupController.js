(function() {
    webapp.controller('PlaceOrderPopupController', [
        '$scope',
        '$log',
        '$mdDialog',
        'FormValidationService',
        'product',
        function($scope, $log, $mdDialog, FormValidationService, product) {

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.placeOrder = function() {
                $log.log('placeOrder');
            };

            function getSizes(size) {
                var sizes = size && size != 'None' ? size.split(',') : [];
                return sizes;
            }

            function init() {
                $scope.apiCall = null;
                $scope.product = product;
                $scope.size = '';
                $scope.placeOrderForm = 'placeOrderForm';
                $scope.sizes = getSizes(product.details.sizes);
                $scope.formValidation = FormValidationService;
            }
            init();
        }
    ]);
})();
