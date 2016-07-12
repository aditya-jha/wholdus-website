(function() {
    'use strict';
    webapp.controller('FeedController', [
        '$scope',
        '$log',
        '$location',
        'APIService',
        'ngProgressBarService',
        '$rootScope',
        'UtilService',
        function($scope, $log, $location, APIService, ngProgressBarService, $rootScope, UtilService) {
            var listeners = [];

            $scope.pageSettings = {
                filter: '',
                productIndex: 0,
                totalPages: 0,
                currentPage: 1,
                responded: 0
            };
            $scope.products = [];
            $scope.productToShow = null;
            $scope.displayImageLoading=true;
            $scope.displayImageStyle={'opacity':'1.0'};

            function parseSearchParams() {
                $scope.noProducts = false;
                var search = $location.search();
                if(search.filter) {
                    $scope.pageSettings.filter = search.filter;
                    if(search.filter == 'favorite') {
                        $rootScope.$broadcast('productToShow');
                        $scope.pageSettings.responded = 1;
                    }
                    else if(search.filter == 'dislikes') {
                        $rootScope.$broadcast('productToShow');
                        $scope.pageSettings.responded = 2;
                    }
                    else {
                        $location.url('/account/hand-picked-products');
                    }
                } else {
                    $scope.pageSettings.responded = 0;
                }
                if(search.buyerproductID) {
                    $scope.buyerproductID = search.buyerproductID;
                } else {
                    $scope.buyerproductID = null;
                }
            }

            function setProductToShow(index) {
                if(index <= $scope.products.length) {
                    $scope.products[index].product.images = UtilService.getImages($scope.products[index].product);
                    if($scope.products[index].product.images.length) {
                        $scope.products[index].product.imageUrl = UtilService.getImageUrl($scope.products[index].product.images[0], '400x400');
                    }
                    $scope.productToShow = $scope.products[index].product;
                    $rootScope.$broadcast('productToShow', $scope.productToShow);
                }
            }

            function parseImages(obj) {
                angular.forEach(obj, function(value, key) {
                    value.product.images = UtilService.getImages(value.product);
                    if(value.product.images.length) {
                        value.product.imageUrl = UtilService.getImageUrl(value.product.images[0], '200x200');
                    }
                });
            }

            function fetchProducts() {
                $rootScope.$broadcast('showProgressbar');
                var params = {
                    page_number: $scope.pageSettings.currentPage,
                    items_per_page: 20,
                    is_active: 1,
                    responded: $scope.pageSettings.responded,
                };
                if($scope.buyerproductID) {
                    params.buyerproductID = $scope.buyerproductID;
                }
                APIService.apiCall("GET", APIService.getAPIUrl('buyerProducts'), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    $scope.pageSettings.totalPages = response.total_pages;

                    if(response.buyer_products.length) {
                        $scope.noProducts = false;
                        if($scope.pageSettings.responded === 0) {
                            $scope.products = response.buyer_products;
                            setProductToShow($scope.pageSettings.productIndex);
                        } else {
                            parseImages(response.buyer_products);
                            $scope.products = response.buyer_products;
                        }
                    } else {
                        $scope.noProducts = true;
                        $rootScope.$broadcast('productToShow');
                    }
                }, function(error) {
                    $location.url('/');
                });
            }

            function init() {
                parseSearchParams();
                fetchProducts();
            }
            init();

            var favUrlListener = $scope.$on('favUrl', function(event, data) {
                init();
            });
            listeners.push(favUrlListener);

            var locationChangeListener = $scope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
                if(newUrl.indexOf('hand-picked') > -1) {
                    init();
                } else {
                    $rootScope.$broadcast('productToShow');
                }
            });
            listeners.push(locationChangeListener);

            $scope.showFilledStatus = function(index) {
                if(index) $scope.showFilled = true;
                else $scope.showFilled = false;
            };

            $scope.favButton = function(type) {

                if($scope.pageSettings.productIndex < $scope.products.length) {
                    APIService.apiCall("PUT", APIService.getAPIUrl("buyerProducts"), {
                        buyerproductID: $scope.products[$scope.pageSettings.productIndex].buyerproductID,
                        responded: type === 1 ? 1 : 2,
                    }).then(function(response) {
                        $log.log(response);
                    }, function(error) {
                        $log.log(error);
                    });
                    $scope.pageSettings.productIndex += 1;

                    if($scope.pageSettings.productIndex < $scope.products.length) {
                        $scope.displayImageLoading=true;
                        $scope.displayImageStyle={'opacity':'0.5'};
                        setProductToShow($scope.pageSettings.productIndex);
                    } else {
                        if($scope.pageSettings.currentPage < $scope.pageSettings.totalPages) {
                            $scope.pageSettings.currentPage += 1;
                            $scope.pageSettings.productIndex = 0;
                            fetchProducts();
                        } else {
                            if($scope.buyerproductID) {
                                $scope.buyerproductID = null;
                                $location.search('buyerproductID', null);
                                init();
                            } else {
                                $location.search('buyerproductID', null);
                                $scope.noProducts = true;
                                $rootScope.$broadcast('productToShow');
                            }
                        }
                    }
                } else {
                    $scope.noProducts = true;
                    $rootScope.$broadcast('productToShow');
                }
            };

             $scope.imageLoaded= function(){
                    $scope.displayImageLoading=false;
                    $scope.displayImageStyle={'opacity':'1.0'};
            };

            $scope.$on('$destroy', function() {
                angular.forEach(listeners, function(value) {
                    if(value) value();
                });
            });
        }
        ]);
})();
