(function() {
    'use strict';
    webapp.directive('wuShortlistButton', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuShortlistButton.html',
            controller: [
                '$scope',
                '$log',
                '$location',
                function($scope, $log, $location) {
                    var listeners = [];

                    $scope.settings = {
                        page: 0
                    };

                    function broadcastChange(type) {
                        $scope.$broadcast('favUrl', type);
                    }

                    function setPage() {
                        var search = $location.search();
                        if(search.filter === 'favorite') {
                            $scope.settings.page = 1;
                        } else if(search.filter === 'rejected') {
                            $scope.settings.page = 2;
                        } else {
                            $scope.settings.page = 0;
                        }
                        broadcastChange(search.filter);
                    }
                    setPage();

                    var locationChangeListener = $scope.$on('$locationChangeSuccess', function() {
                        setPage();
                    });

                    $scope.$on('$destroy', function() {
                        angular.forEach(listeners, function(value) {
                            if(value) value();
                        });
                    });
                }
            ]
        };
    });
})();
