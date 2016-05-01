(function() {
    'use strict';
    webapp.controller('CategoryController', [
        '$scope',
        '$routeParams',
        '$location',
        '$log',
        'UtilService',
        'APIService',
        'ngProgressBarService',
        '$rootScope',
        function ($scope, $routeParams, $location, $log, UtilService, APIService, ngProgressBarService, $rootScope) {

            $scope.categoryID = UtilService.getIDFromSlug($routeParams.category);

            function getProducts() {
                $rootScope.$broadcast('showProgressbar');
                var params = {categoryID: $scope.categoryID};
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    $scope.products = response.products;
                    if($scope.products.length) {
                        $scope.category = response.products[0].category;
                    }
                }, function(error) {
                    $rootScope.$broadcast('endProgressbar');
                    $scope.products = [];
                });
            }
            getProducts();
        }
    ]);
})();
