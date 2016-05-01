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
                function($scope, $log) {
                    $log.log("directive loaded");
                    $log.log($scope.product);
                }
            ]
        };
    });
})();
