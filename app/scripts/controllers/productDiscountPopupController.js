(function() {
    webapp.controller('ProductDiscountPopupController', [
        '$scope',
        '$log',
        '$mdDialog',
        'APIService',
        'ToastService',
        'product',
        function($scope, $log, $mdDialog, APIService, ToastService, product) {

            function validDiscount(discount) {
                if(!discount) return 0;
                var ret = parseFloat(discount);
                if(isNaN(ret)) {
                    return 0;
                }
                return ret;
            }

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.setProductDiscount = function() {
                var discount = validDiscount($scope.product.buyerstore.buyer_store_discount);
                if($scope.apiCall || !discount) return;
                var data = {
                    store_discount: discount,
                    productID: $scope.product.productID
                };
                $scope.apiCall = APIService.apiCall("PUT", APIService.getAPIUrl('buyerProducts'), data);
                $scope.apiCall.then(function(response) {
                    $log.log(response);
                    ToastService.showActionToast("Successfully updated!", 3000, "ok");
                    $mdDialog.hide(response.buyer_product_response);
                }, function(error) {
                    $log.log(error);
                    ToastService.showActionToast("Sorry! Something went wrong", 0, "ok");
                });
            };

            function getDiscountPrice(price, discount) {
                price = parseFloat(price);
                discount = parseFloat(discount);

                var discountedPrice = price - ((price*discount))/100;
                return discountedPrice;
            }

            function init() {
                $scope.storeDiscountForm = 'productDiscountForm';
                $scope.product = product;
                $scope.apiCall = null;
            }
            init();

            $scope.$watch('product.buyerstore.buyer_store_discount', function(newValue, oldValue) {
                if(newValue != oldValue) {
                    var discount = validDiscount(newValue);
                    if(discount) {
                        $scope.product.buyerstore.buyer_store_discounted_price = getDiscountPrice($scope.product.price_per_unit, discount);
                    }
                }
            });
        }
    ]);
})();
