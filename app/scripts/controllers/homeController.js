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
        function($scope, $rootScope, $log, APIService, ConstantKeyValueService, $timeout, $location, UtilService, ngProgressBarService, $q, DialogService) {

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
                    UtilService.setPaginationParams(params, 1, 4);
                } else {
                    UtilService.setPaginationParams(params, 1, 6);
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

            function getProductsByCategory() {
                ngProgressBarService.showProgressbar();
                var promises = [];
                angular.forEach($scope.settings.categoriesToShow, function(value, key) {
                    promises.push(getProducts({categoryID:value}));
                });

                $q.all(promises).then(function(response) {
                    $scope.products = {};
                    var products = [];
                    angular.forEach(response, function(value, key) {
                        angular.forEach(value, function(v,k) {
                            v.images = UtilService.getImages(v);
                            if(v.images.length){
                            v.imageUrl = UtilService.getImageUrl(v.images[0], '200x200');
                            }
                            else{
                                v.imageUrl = 'images/200.png';
                            }
                            products.push(v);
                        });
                    });
                    arrangeProductsByCategory(products);
                    ngProgressBarService.endProgressbar();
                });
            }
            getProductsByCategory();

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
