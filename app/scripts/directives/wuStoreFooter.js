(function() {
    webapp.directive('wuStoreFooter', function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'views/store/storeFooter.html',
            controller: [
                '$scope',
                '$log',
                function($scope, $log) {
                }
            ]
        };
    });
})();
