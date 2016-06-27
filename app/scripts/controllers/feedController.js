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

            function parseSearchParams() {
                var search = $location.search();
                if(search.filter) {
                    $scope.pageSettings.filter = search.filter;
                    if(search.filter == 'favorite') $scope.pageSettings.responded = 1;
                    else if(search.filter == 'dislikes') $scope.pageSettings.responded = 2;
                    else $scope.pageSettings.responded = 0;
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

            function fetchProducts() {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('buyerProducts'), null, {
                    page_number: $scope.pageSettings.currentPage,
                    items_per_page: 1,
                    is_active: 1,
                    responded: $scope.pageSettings.responded
                })
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    $log.log(response);
                    $scope.pageSettings.totalPages = response.total_pages;
                    if(response.buyer_products.length) {
                        $scope.products = response.buyer_products;
                        setProductToShow($scope.pageSettings.productIndex);
                    } else {
                        $scope.noProducts = true;
                        $rootScope.$broadcast('productToShow');
                    }
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
                        setProductToShow($scope.pageSettings.productIndex);
                    } else {
                        if($scope.pageSettings.currentPage < $scope.pageSettings.totalPages) {
                            $scope.pageSettings.currentPage += 1;
                            $scope.pageSettings.productIndex = 0;
                            fetchProducts();
                        } else {
                            $scope.noProducts = true;
                            $rootScope.$broadcast('productToShow');
                        }
                    }
                } else {
                    $scope.noProducts = true;
                    $rootScope.$broadcast('productToShow');
                }
            };

            $scope.$on('$destroy', function() {
                angular.forEach(listeners, function(value) {
                    if(value) value();
                });
            });
        }
    ]);
})();
