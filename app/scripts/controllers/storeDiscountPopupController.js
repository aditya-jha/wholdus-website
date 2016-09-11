(function() {
    webapp.controller('StoreDiscountPopupController', [
        '$scope',
        '$log',
        'APIService',
        'ToastService',
        '$mdDialog',
        'store',
        function($scope, $log, APIService, ToastService, $mdDialog, store) {

            function init() {
                $scope.storeDiscountForm = 'storeDiscountForm';
                $scope.store = store;
                $scope.apiCall = null;
            }
            init();

            function validDiscountValue(discount) {
                if(discount) {
                    var value = parseFloat(discount);
                    if(!isNaN(value)) {
                        return true;
                    }
                }
                return false;
            }

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.setStoreDiscount = function() {
                if(validDiscountValue($scope.storeDiscount)) {
                    $scope.apiCall = APIService.apiCall("PUT", APIService.getAPIUrl('buyers'), {
                        store_global_discount: $scope.storeDiscount
                    });
                    $scope.apiCall.then(function(response) {
                        $scope.apiCall = null;
                        $mdDialog.hide($scope.storeDiscount);
                    }, function(error) {
                        $scope.apiCall = null;
                        ToastService.showActionToast("Sorry! Something went wrong", 0, "ok");
                    });
                } else if($scope.storeDiscount){
                    ToastService.showActionToast("Enter Valid Value", 5000, "ok");
                }
            };
        }
    ]);
})();
