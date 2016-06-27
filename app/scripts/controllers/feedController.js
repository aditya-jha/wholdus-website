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
                productIndex: 0
            };
            $scope.products = [];
            $scope.productToShow = null;
            $scope.noProducts = false;

            function parseSearchParams() {
                var search = $location.search();
                if(search.filter) {
                    $scope.pageSettings.filter = search.filter;
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
                    page_number: 1,
                    items_per_page: 20,
                    is_active: 1,
                    responded: 0
                })
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    $log.log(response);
                    if(response.buyer_products.length) {
                        $scope.products = response.buyer_products;
                        setProductToShow($scope.pageSettings.productIndex);
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
                if($scope.pageSettings.productIndex < $scope.products.length-1) {
                    APIService.apiCall("PUT", APIService.getAPIUrl("buyerProducts"), {
                        buyerproductID: $scope.products[$scope.pageSettings.productIndex].buyerproductID,
                        shortlisted: type === 1 ? 1 : null,
                        disliked: type === -1 ? 1 : null,
                    }).then(function(response) {
                        $log.log(response);
                    }, function(error) {
                        $log.log(error);
                    });
                    $scope.pageSettings.productIndex += 1;
                    setProductToShow($scope.pageSettings.productIndex);
                } else {
                    $scope.noProducts = true;
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
