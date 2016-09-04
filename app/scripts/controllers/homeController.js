(function() {
    'use strict';
    webapp.controller('HomeController', [
        '$scope',
        '$rootScope',
        '$log',
        'APIService',
        'ConstantKeyValueService',
        '$timeout',
        '$location',
        'UtilService',
        'ngProgressBarService',
        '$q',
        'DialogService',
        'LoginService',
        function($scope, $rootScope, $log, APIService, ConstantKeyValueService, $timeout, $location, UtilService, ngProgressBarService, $q, DialogService, LoginService) {

            var listeners = [];

            $scope.settings = {
                isMobile: UtilService.isMobileRequest(),
                categoriesToShow: [10,1,7]
            };
            $scope.total = [];

            function arrangeProductsByCategory(products) {
                if(!products) return;
                var index=0;
                angular.forEach(products, function(value, key) {
                    var catID = value.category.categoryID;

                    if($scope.products[catID]) {
                        $scope.products[catID].products.push(value);
                    } else {
                        $scope.products[catID] = {
                            category: value.category,
                            products: [value]
                        };
                    }
                });
            }

            function getCategory(params) {
                APIService.apiCall("GET", APIService.getAPIUrl("category"))
                        .then(function(response) {
                            $scope.categories = response.categories;
                        }, function(error) {
                            $scope.categories = [];
                        });
            }

            function getProducts(params) {
                var deferred = $q.defer();
                if(!params) { params = {}; }
                if($scope.settings.isMobile) {
                    UtilService.setPaginationParams(params, 1, 6);
                } else {
                    UtilService.setPaginationParams(params, 1, 8);
                }

                APIService.apiCall("GET", APIService.getAPIUrl('products'), null, params)
                        .then(function(response) {
                            deferred.resolve(response.products);
                            $scope.total.push(response.total_products);
                        }, function(error) {
                            deferred.reject(error);
                        });
                return deferred.promise;
            }
            getCategory();

            function getProductsInCart() {
                var deferred = $q.defer();
                APIService.apiCall("GET", APIService.getAPIUrl('cartItem')).then(function(response) {
                    deferred.resolve(response.cart_items);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }

            function parseCartItems(items) {
                var cartItems = {};
                angular.forEach(items, function(value, key) {
                    cartItems[value.product.productID] = value.lots;
                });
                return cartItems;
            }

            function getProductsByCategory() {
                ngProgressBarService.showProgressbar();
                var promises = [], loggedIn = false;

                if(LoginService.checkLoggedIn()) {
                    loggedIn = true;
                    promises.push(getProductsInCart());
                }
                angular.forEach($scope.settings.categoriesToShow, function(value, key) {
                    promises.push(getProducts({categoryID:value}));
                });

                $q.all(promises).then(function(response) {
                    $scope.products = {};
                    var products = [], start = 0, cartItems = [];

                    if(loggedIn) {
                        start = 1;
                        cartItems = parseCartItems(response[0]);
                    }

                    for(var i=start;i<promises.length;i++) {
                        angular.forEach(response[i], function(v,k) {
                            v.lotsInCart = cartItems[v.productID] ? cartItems[v.productID] : 0;
                            v.images = UtilService.getImages(v);
                            if(v.images.length){
                                v.imageUrl = UtilService.getImageUrl(v.images[0], '300x300');
                            }
                            else{
                                v.imageUrl = 'images/200.png';
                            }
                            products.push(v);
                        });
                    }

                    arrangeProductsByCategory(products);
                    ngProgressBarService.endProgressbar();
                });
            }
            getProductsByCategory();

            var checkLoginStateListener = $rootScope.$on('checkLoginState', function() {
                getProductsByCategory();
            });
            listeners.push(checkLoginStateListener);

            var loginStateChangeListener = $rootScope.$on('loginStateChange', function() {
                getProductsByCategory();
            });
            listeners.push(loginStateChangeListener);

            var destroyListener = $scope.$on('$destroy', function() {
                angular.forEach(listeners, function(value, key) {
                    if(value) value();
                });
                $scope.products = undefined;
            });
            listeners.push(destroyListener);
        }
    ]);
})();
