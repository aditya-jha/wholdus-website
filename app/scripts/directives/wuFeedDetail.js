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

                    $scope.product = null;
                    $scope.showDetailsButton = true;

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

                    var productToShowListener = $rootScope.$on('productToShow', function(event, data) {
                        $scope.product = data;
                    });
                    listeners.push(productToShowListener);

                    $scope.showDetails = function(type) {
                        if(type==1) {
                            $scope.showDetailsButton = false;
                        } else {
                            $scope.showDetailsButton = true;
                        }
                    };

                    $scope.favButton = function() {
                        $rootScope.$broadcast('addToFav', $scope.product);
                    };

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
