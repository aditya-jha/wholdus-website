(function() {
    'use strict';
    webapp.controller('ProductController', [
        '$scope',
        '$routeParams',
        '$log',
        'APIService',
        'UtilService',
        function($scope, $routeParams, $log, APIService, UtilService) {

            function getProducts() {
                var params = {
                    productID: UtilService.getIDFromSlug($routeParams.product)
                };
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                .then(function(response) {
                    if(response.products.length) {
                        $scope.product = response.products[0];
                    }
                }, function(error) {
                    $scope.product = [];
                });
            }
            getProducts();
        }
    ]);
})();
