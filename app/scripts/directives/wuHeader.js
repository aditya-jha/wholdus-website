(function() {
    webapp.directive('wuHeader', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuHeader.html',
            controller: [
                '$scope',
                '$rootScope',
                function($scope, $rootScope) {

                    $scope.toggleSidenav = function() {
                        $rootScope.$broadcast('toggleSidenav');
                    };

                    $scope.login = function() {
                        
                    };
                }
            ]
        };
    });
})();
