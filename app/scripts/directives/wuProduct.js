(function() {
    'use strict';
    webapp.directive('wuProduct', function() {
        return {
            restrict: 'AE',
            scope: {
                product: '='
            },
            templateUrl: 'views/directives/wuProduct.html',
            controller: [
                '$scope',
                '$log',
                '$location',
                function($scope, $log, $location) {

                    $scope.cardClicked = function() {
                        $location.url($scope.product.url);
                    };
                }
            ]
        };
    });
})();
