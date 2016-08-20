(function() {
    'use strict';
    webapp.directive('wuProduct', function() {
        return {
            restrict: 'AE',
            scope: {
                product: '='
            },
            replace: true,
            templateUrl: 'views/directives/wuProduct.html',
        };
    });
})();
