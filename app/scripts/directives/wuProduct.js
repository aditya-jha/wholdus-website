(function() {
    'use strict';
    webapp.directive('wuProduct', function() {
        return {
            restrict: 'AE',
            scope: {
                product: '='
            },
            templateUrl: 'views/directives/wuProduct.html',
        };
    });
})();
