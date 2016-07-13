(function() {
    webapp.directive('wuFeedDetail', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuFeedDetail.html',
            controller: [
                '$scope',
                '$location',
                '$log',
                '$rootScope',
                '$element',
                function($scope, $location, $log, $rootScope, $element) {
                    var listeners = [];

                    $scope.showFeedActionButton = false;

                    function init() {
                        var url = $location.url();
                        if(url.indexOf('hand-picked') == -1) {
                            $scope.showFeedActionButton = false;
                        }
                    }

                    $scope.feedActionButton = function(type) {
                        $scope.$broadcast('feedActionButtonClicked', type);
                    };

                    var productToShowListener = $rootScope.$on('showFeedActionButton', function(event, data) {
                        if(data) {
                            $scope.showFeedActionButton = true;
                        } else {
                            $scope.showFeedActionButton = false;
                        }
                    });
                    listeners.push(productToShowListener);

                    var locationChangeListener = $scope.$on('$locationChangeSuccess', function() {
                        init();
                    });
                    listeners.push(locationChangeListener);

                    init();

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
