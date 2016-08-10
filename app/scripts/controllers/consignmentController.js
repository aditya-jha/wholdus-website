(function() {
    webapp.controller('ConsignmentController', [
        '$scope',
        '$log',
        'UtilService',
        '$location',
        'APIService',
        'ngProgressBarService',
        'ConstantKeyValueService',
        function($scope, $log, UtilService, $location, APIService, ngProgressBarService, ConstantKeyValueService) {

            var listeners = [];

            function getStep() {
                var query = $location.search();
                if(query) {
                    var step = parseInt(query.step);
                    if(isNaN(step) || !step || step > 3) {
                        return 0;
                    } else {
                        return step;
                    }
                }
            }

            function setStep(step) {
                $location.search('step', step);
            }

            function parseCart(item) {
                item.final_price = Math.ceil(parseFloat(item.final_price) + parseFloat(item.shipping_charge));
                angular.forEach(item.sub_carts, function(value, key) {
                    value.final_price_calculated = Math.ceil(parseFloat(value.calculated_price) + parseFloat(value.shipping_charge));
                    angular.forEach(value.cart_items, function(v, k) {
                        v.product.image.absolute_path = v.product.image.absolute_path.replace('700x700', '200x200');
                    });
                });
                return item;
            }

            function updateCart(response) {
                if(response.carts.length) {
                    $scope.cart = parseCart(response.carts[0]);
                } else {
                    $scope.cart = [];
                }
            }

            function fetchCart() {
                ngProgressBarService.showProgressbar();
                APIService.apiCall("GET", APIService.getAPIUrl('cart'))
                .then(function(response) {
                    updateCart(response);
                    ngProgressBarService.endProgressbar();
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    $log.log(error);
                });
            }

            function updateLots(productID, lots) {
                ngProgressBarService.showProgressbar();
                APIService.apiCall("POST", APIService.getAPIUrl('cartItem'), {
                    productID: productID,
                    lots: lots,
                    added_from: ConstantKeyValueService.cartTrack.added_from.cart
                }).then(function(response) {
                    $log.log(response);
                    $scope.cart = parseCart(response.carts);
                    ngProgressBarService.endProgressbar();
                }, function(error) {
                    $log.log(error);
                    ToastService.showActionToast("Sorry! Couldn't modify consignment", 5000, "ok");
                    ngProgressBarService.endProgressbar();
                });
            }

            function init() {
                $scope.step = getStep();
                $scope.isMobile = UtilService.isMobileRequest();
                $scope.paymentMethod = 0;

                if(!$scope.step) {
                    fetchCart();
                } else if($scope.step == 1) {
                    $scope.toggleAddressEdit = function(status) {
                        if(status) {
                            $scope.addressEdit = true;
                        } else {
                            $scope.addressEdit = false;
                        }
                    };
                }
            }
            init();

            $scope.proceed = function() {
                $scope.step += 1;
                setStep($scope.step);
            };

            $scope.remove = function(productID) {
                updateLots(productID, 0);
            };

            var consignmentIconClickedListener = $scope.$on('consignmentIconClicked', function(event, data) {
                init();
            });
            listeners.push(consignmentIconClickedListener);

            var destroyListener = $scope.$on('destroy', function() {
                angular.forEach(listeners, function(value, key) {
                    if(value) value();
                });
            });
            listeners.push(destroyListener);
        }
    ]);
})();
