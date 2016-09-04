(function() {
    'use strict';
    webapp.controller('ProductController', [
        '$scope',
        '$routeParams',
        '$log',
        '$window',
        '$location',
        'APIService',
        'UtilService',
        'ngProgressBarService',
        '$rootScope',
        'DialogService',
        'ToastService',
        '$mdMedia',
        '$mdDialog',
        'ConstantKeyValueService',
        'LoginService',
        '$q',
        '$timeout',
        function($scope, $routeParams, $log, $window,$location,APIService, UtilService, ngProgressBarService, $rootScope, DialogService, ToastService, $mdMedia, $mdDialog, ConstantKeyValueService, LoginService, $q, $timeout) {

            var listeners = [];

            $scope.atcAPICall = null;
            $scope.loggedIn = false;

            function praseProductDetails(p) {
                var product = {
                    productID: p.productID,
                    category: p.category,
                    display_name: p.display_name,
                    min_price_per_unit: p.min_price_per_unit,
                    price_per_unit: p.price_per_unit,
                    margin: p.margin,
                    brand: p.details.brand,
                    fabric_gsm: p.details.fabric_gsm,
                    colors: p.details.colours,
                    sizes: p.details.sizes,
                    lot_size: p.lot_size,
                    seller: {
                        company_name: p.seller.company_name,
                        address: p.seller.address[0]
                    },
                    details: {
                        seller_catalog_number: p.details.seller_catalog_number,
                    },
                    product_lot: p.product_lot,
                    image: p.image
                };

                var productDetailsKeys = [{
                    label: 'Brand',
                    value: p.details.brand
                }, {
                    label: 'Pattern',
                    value: p.details.pattern
                }, {
                    label: 'Style',
                    value: p.details.style
                }, {
                    label: 'Fabric/GSM',
                    value: p.details.fabric_gsm
                }, {
                    label: 'Sleeve',
                    value: p.details.sleeve
                }, {
                    label: 'Neck/Collar',
                    value: p.details.neck_collar_type
                }, {
                    label: 'Length',
                    value: p.details.length
                }, {
                    label: 'Work/Decor',
                    value: p.details.work_decoration_type
                }, {
                    label: 'Colors',
                    value: p.details.colours
                }, {
                    label: 'Sizes',
                    value: p.details.sizes
                }, {
                    label: 'Features',
                    value: p.details.special_feature
                },{
                    label: 'Lot Description',
                    value: p.details.lot_description.length>0?p.details.lot_description:'None'
                }];
                $scope.product = product;
                $scope.productDetailsKeys = productDetailsKeys;
            }

            function getProducts(productID) {
                ngProgressBarService.showProgressbar();
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, {
                    productID: productID
                })
                .then(function(response) {
                    ngProgressBarService.endProgressbar();
                    if(response.products.length) {
                        praseProductDetails(response.products[0]);
                    }
                    else{
                        $location.url('/404');
                    }
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    $location.url('/404');
                });
            }

            function getCartStatus(productID) {
                APIService.apiCall("GET", APIService.getAPIUrl('cartItem'), null, {
                    productID: productID
                }).then(function(response) {
                    if(response.cart_items.length) {
                        $scope.pdInCart = true;
                    }
                }, function(error) {});
            }

            function openLotPopup(event, product, lots) {
                return $mdDialog.show({
                    controller: 'LotPopupController',
                    templateUrl: 'views/partials/lotSelectPopup.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: $mdMedia('xs') || $mdMedia('sm'),
                    locals: {
                        product: product,
                        lots: lots
                    }
                });
            }

            function addToCartHelper(product, lots) {
                if($scope.atcAPICall) return;
                var deferred = $q.defer();
                if($scope.pdInCart) {
                    $timeout(function() {
                        deferred.resolve();
                    }, 10);
                } else {
                    var data = {
                        productID: product.productID,
                        lots: lots,
                        added_from: ConstantKeyValueService.cartTrack.added_from.product_page
                    };
                    $scope.atcAPICall = APIService.apiCall("POST", APIService.getAPIUrl('cartItem'), data);
                    $scope.atcAPICall.then(function(response) {
                        $scope.atcAPICall = null;
                        $scope.pdInCart = true;
                        deferred.resolve();
                    }, function(error) {
                        $scope.atcAPICall = null;
                        ToastService.showActionToast("Sorry! Couldn't add product to consignment", 5000, "ok");
                        deferred.reject();
                    });
                }
                return deferred.promise;
            }

            function init() {
                var productID = UtilService.getIDFromSlug($routeParams.product);
                $scope.isMobile = UtilService.isMobileRequest();
                getProducts(productID);
                if(LoginService.checkLoggedIn()) {
                    $scope.loggedIn = true;
                    getCartStatus(productID);
                }
            }
            init();

            function addToCartAfterLogin(event, product, buyNow) {
                if(buyNow && $scope.pdInCart) {
                    $location.url('/consignment');
                } else {
                    openLotPopup(event, product, 1).then(function(lots) {
                        addToCartHelper(product, lots).then(function() {
                            if(buyNow) {
                                $location.url('/consignment');
                            }
                        });
                    });
                }
            }

            $scope.openLoginPopup = function(event) {
                DialogService.viewDialog(event, {
                    view: 'views/partials/loginPopup.html',
                }).finally(function() {
                    if(LoginService.checkLoggedIn()) {
                        $scope.loggedIn = true;
                        $rootScope.$broadcast('checkLoginState');
                        getCartStatus(UtilService.getIDFromSlug($routeParams.product));
                    }
                });
            };

            $scope.addToCart = function(event, product, buyNow) {
                if(LoginService.checkLoggedIn()) {
                    addToCartAfterLogin(event, product, buyNow);
                } else {
                    DialogService.viewDialog(event, {
                        view: 'views/partials/loginPopup.html',
                    }).finally(function() {
                        if(LoginService.checkLoggedIn()) {
                            $scope.loggedIn = true;
                            $rootScope.$broadcast('checkLoginState');
                            addToCartAfterLogin(event, product, buyNow);
                        }
                    });
                }
            };

            var loginStateChange = $rootScope.$on('loginStateChange', function(event, data) {
                if(LoginService.checkLoggedIn()) {
                    $scope.loggedIn = true;
                    getCartStatus($scope.product.productID);
                } else {
                    $scope.loggedIn = false;
                    $scope.pdInCart = null;
                }
            });
            listeners.push(loginStateChange);

            var destroyListener = $scope.$on('$destroy', function() {
                angular.forEach(listeners, function(value, key) {
                    if(value) value();
                });
            });
            listeners.push(destroyListener);
        }
    ]);
})();
