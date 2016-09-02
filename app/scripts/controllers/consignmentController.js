(function() {
    webapp.controller('ConsignmentController', [
        '$scope',
        '$log',
        'UtilService',
        '$location',
        'APIService',
        'ngProgressBarService',
        'ConstantKeyValueService',
        '$mdMedia',
        '$mdDialog',
        'FormValidationService',
        function($scope, $log, UtilService, $location, APIService, ngProgressBarService, ConstantKeyValueService, $mdMedia, $mdDialog, FormValidationService) {

            var listeners = [], oldAddress;

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
                item.final_price = Math.ceil(parseFloat(item.final_price));
                item.buyer.address[0].pincode = parseInt(item.buyer.address[0].pincode);
                item.buyer.address[0].contact_number = item.buyer.address[0].contact_number ? parseInt(item.buyer.address[0].contact_number) : '';
                angular.forEach(item.sub_carts, function(value, key) {
                    // value.final_price_calculated = Math.ceil(parseFloat(value.calculated_price) + parseFloat(value.shipping_charge));
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
                    if($scope.cart && $scope.cart.buyer) {
                        checkPincodeServiceAbility($scope.cart.buyer.address[0].pincode);
                    }
                    ngProgressBarService.endProgressbar();
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                });
            }

            function updateLots(productID, lots) {
                ngProgressBarService.showProgressbar();
                $scope.updateApi = APIService.apiCall("POST", APIService.getAPIUrl('cartItem'), {
                    productID: productID,
                    lots: lots,
                    added_from: ConstantKeyValueService.cartTrack.added_from.cart
                });
                $scope.updateApi.then(function(response) {
                    $scope.cart = parseCart(response.carts);
                    ngProgressBarService.endProgressbar();
                    $scope.updateApi = false;
                }, function(error) {
                    ToastService.showActionToast("Sorry! Couldn't modify consignment", 5000, "ok");
                    ngProgressBarService.endProgressbar();
                    $scope.updateApi = false;
                });
            }

            function checkPincodeServiceAbility(pincode) {
                APIService.apiCall("GET", APIService.getAPIUrl('pincodeserviceability'), null, {pincode_code:pincode})
                .then(function(response) {
                    if(response.serviceable_pincodes && response.serviceable_pincodes.length) {
                        var x = {};
                        angular.forEach(response.serviceable_pincodes, function(value, key) {
                            if(value.regular_delivery_available) x.delivery = true;
                            if(value.cod_available) x.cod = true;
                        });
                        $scope.pincodeService = x;
                    } else {
                        $scope.pincodeService = {};
                    }
                }, function(error) {
                    $scope.pincodeService = {};
                });
            }

            function getPaymentMethods() {
                APIService.apiCall("GET", APIService.getAPIUrl('paymentMethods'))
                .then(function(response) {
                    $scope.paymentMethod = {
                        options: response.payment_methods,
                        selected: 0
                    };
                }, function(error) {
                    $scope.paymentMethod = null;
                });
            }

            function proceedHelper(method, url, data) {
                ngProgressBarService.showProgressbar();
                APIService.apiCall(method, APIService.getAPIUrl(url), data)
                .then(function(response) {
                    $scope.checkout = response.checkout;
                    if(data.status == 1) {
                        data.status = 2;
                        proceedHelper(method, url, data);
                    } else {
                        $scope.step += 1;
                        setStep($scope.step);
                        ngProgressBarService.endProgressbar();
                    }
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    ToastService.showActionToast("Sorry! something went wrong. Please refresh!", 0, "ok");
                });
            }

            function init() {
                $scope.step = getStep();
                $scope.isMobile = UtilService.isMobileRequest();
                $scope.formValidation = FormValidationService;
                $scope.addressForm = 'addressForm';
                if($scope.step > 0) {
                    $scope.step = 0;
                    $location.url('/consignment');
                } else {
                    // fetchCart();
                    // getPaymentMethods();
                    // if($scope.step > 0) {
                    //     APIService.apiCall("GET", APIService.getAPIUrl('checkout'))
                    //     .then(function(response) {
                    //         $scope.checkout = response.checkout;
                    //         $scope.step += 1;
                    //         setStep($scope.step);
                    //     }, function(error) {
                    //         ToastService.showActionToast("Sorry! something went wrong. Please refresh!", 0, "ok");
                    //     });
                    // }
                }
                fetchCart();
                getPaymentMethods();
            }
            init();

            $scope.getCODAmount = function() {
                if($scope.paymentMethod && $scope.cart) {
                    var amount = ($scope.paymentMethod.options[0].cod_rate_percent*$scope.cart.final_price)/100;
                    return Math.ceil(amount);
                } else {
                    return 0;
                }
            };

            $scope.checkCODAvailable = function() {
                if($scope.pincodeService) {
                    if($scope.pincodeService.delivery && $scope.pincodeService.cod) {
                        return true;
                    } else {
                        $scope.paymentMethod.selected = 1;
                        return false;
                    }
                }
            };

            $scope.updateAddress = function() {
                APIService.apiCall("PUT", APIService.getAPIUrl('buyers'), {
                    address: $scope.cart.buyer.address[0],
                    buyerID: $scope.cart.buyer.buyerID
                }).then(function(response) {
                    $scope.addressEdit = false;
                }, function(error) {
                    $scope.cart.buyer.address[0] = oldAddress;
                    ToastService.showActionToast("Sorry! Couldn't update address", 5000, "ok");
                    $scope.addressEdit = false;
                });
                checkPincodeServiceAbility($scope.cart.buyer.address[0].pincode);
            };

            $scope.toggleAddressEdit = function(status) {
                if(status) {
                    $scope.addressEdit = true;
                } else {
                    oldAddress = angular.copy($scope.cart.buyer.address[0]);
                    $scope.addressEdit = false;
                }
            };

            $scope.proceed = function() {
                var method = "PUT", url = 'checkout', data = {};
                if($scope.step === 0) {
                    method = "POST";
                } else if($scope.step == 1) {
                    data.checkoutID = $scope.checkout.checkoutID;
                    data.status = 1;
                } else if($scope.step == 2) {
                    data.checkoutID = $scope.checkout.checkoutID;
                    data.status = 3;
                    data.payment_method = $scope.paymentMethod.selected;
                }
                proceedHelper(method, url, data);
            };

            $scope.remove = function(productID) {
                updateLots(productID, 0);
            };

            $scope.changeLots = function(ev, product, lots) {
                $mdDialog.show({
                    controller: 'LotPopupController',
                    templateUrl: 'views/partials/lotSelectPopup.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $mdMedia('xs') || $mdMedia('sm'),
                    locals: {
                        product: product,
                        lots: lots
                    }
                }).then(function(updatedLots) {
                    if(lots != updatedLots) {
                        updateLots(product.productID, updatedLots);
                    }
                });
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
