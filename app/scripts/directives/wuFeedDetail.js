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
                function($scope, $location, $log, $rootScope) {
                    $log.log("feed footer directive");

                    var listeners = [];

                    function init() {
                        $scope.showFooter = false;
                        setFooterStatus();
                    }

                    function setFooterStatus() {
                        var url = $location.url();
                        if(url.indexOf('hand-picked') >= 0) {
                            $scope.showFooter = true;
                        } else {
                            $scope.showFooter = false;
                        }
                    }


                    var locationChangeListener = $rootScope.$on('$locationChangeSuccess', function(event, data) {
                        setFooterStatus();
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
