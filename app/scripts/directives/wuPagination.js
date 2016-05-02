(function() {
    webapp.directive('wuPagination', function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuPagination.html',
            scope: {},
            controller: [
                '$scope',
                '$location',
                '$rootScope',
                function($scope, $location, $rootScope) {
                    var listeners = [];
                    $scope.page = {
                        current: 0,
                        total: 0
                    };

                    var setPage = $rootScope.$on('setPage', function(event, data) {
                        $scope.page.current = parseInt(data.page);
                        $scope.page.total = data.totalPages;
                    });
                    listeners.push(setPage);

                    $scope.btnClicked = function(event, step) {
                        event.preventDefault();
                        if(($scope.page.current === 1 && step == -1) || ($scope.page.current === $scope.page.total && step == 1)) {
                            return;
                        }
                        if(step > 0) {
                            $scope.page.current += 1;
                        } else {
                            $scope.page.current -= 1;
                        }
                        $location.search('page', $scope.page.current);
                    };

                    $scope.$on('$destroy', function() {
                        angular.forEach(listeners, function(value, key) {
                            value();
                        });
                    });
                }
            ]
        };
    });
})();
