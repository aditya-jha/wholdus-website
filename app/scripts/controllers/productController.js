(function() {
    'use strict';
    webapp.controller('ProductController', [
        '$scope',
        '$routeParams',
        '$log',
        'APIService',
        'UtilService',
        function($scope, $routeParams, $log, APIService, UtilService) {

            function praseProductDetails(p) {
                $scope.productDetailsKeys = [{
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
                    label: 'Work Decor',
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
                }];
            }

            function getProducts() {
                var params = {
                    productID: UtilService.getIDFromSlug($routeParams.product)
                };
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                .then(function(response) {
                    if(response.products.length) {
                        $scope.product = response.products[0];
                        praseProductDetails($scope.product);
                    }
                }, function(error) {
                    $scope.product = [];
                });
            }
            getProducts();
        }
    ]);
})();
