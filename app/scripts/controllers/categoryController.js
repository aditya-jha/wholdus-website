(function() {
    'use strict';
    webapp.controller('CategoryController', [
        '$scope',
        '$routeParams',
        '$location',
        '$log',
        'UtilService',
        'APIService',
        function ($scope, $routeParams, $location, $log, UtilService, APIService) {

            $scope.categoryID = UtilService.getIDFromSlug($routeParams.category);

            function getProducts() {
                var params = {categoryID: $scope.categoryID};
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                .then(function(response) {
                    $scope.products = response.products;
                    if($scope.products.length) {
                        $scope.category = response.products[0].category;
                    }
                }, function(error) {
                    $scope.products = [];
                });
            }
            getProducts();
        }
    ]);
})();
