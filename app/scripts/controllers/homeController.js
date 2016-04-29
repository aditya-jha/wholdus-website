(function() {
    'use strict';
    webapp.controller('HomeController', [
        '$scope',
        '$rootScope',
        '$log',
        'APIService',
        'ConstantKeyValueService',
        function($scope, $rootScope, $log, APIService, ConstantKeyValueService) {

            function categoriesToShow() {
                return $scope.categories[0].categoryID + ',' + $scope.categories[1].categoryID;
            }

            function arrangeProductsByCategory(products) {
                var index=0;
                $scope.products = {};
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
                            getProducts({categoryID:categoriesToShow()});
                        }, function(error) {
                            $scope.categories = [];
                        });
            }

            function getProducts(params) {
                APIService.apiCall("GET", APIService.getAPIUrl('products'), null, params)
                        .then(function(response) {
                            arrangeProductsByCategory(response.products);
                        }, function(error) {
                            $scope.products = [];
                        });
            }
            getCategory();
        }
    ]);
})();
