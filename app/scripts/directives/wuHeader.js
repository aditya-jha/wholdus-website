(function() {
    webapp.directive('wuHeader', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuHeader.html',
            scope: {},
            link: function(scope, element, attributes) {},
            controller: [
                '$scope',
                '$rootScope',
                '$log',
                function($scope, $rootScope, $log) {
                    $log.log("wuheader directive loaded");

                    $scope.catSidenav = function() {
                        $rootScope.$broadcast('catSidenav');
                    };
                }
            ]
        };
    });
})();
