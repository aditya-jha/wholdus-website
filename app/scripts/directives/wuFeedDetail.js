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
                '$window',
                'DialogService',
                function($scope, $location, $log, $rootScope, $element, $window, DialogService) {
                    var listeners = [];

                    $scope.showFeedActionButton = false;
                    $scope.smallScreen = null;
                    $scope.showDetailsCard = false;
                    $scope.product = null;

                    function init() {
                        var url = $location.url();
                        if(url.indexOf('hand-picked') == -1) {
                            $scope.showFeedActionButton = false;
                        }
                    }

                    function isSmallScreen() {
                        if($window.screen.height <= 570) {
                            $scope.smallScreen = true;
                        }
                    }
                    isSmallScreen();

                    $scope.getDetailDivClass = function() {
                        if($scope.smallScreen) {
                            return 'small-font';
                        } else {
                            return '';
                        }
                    };

                    $scope.showDetails = function(event, type) {
                        if(type) $scope.showDetailsCard = true;
                        else $scope.showDetailsCard = false;
                    };

                    $scope.feedActionButton = function(type) {
                        $scope.$broadcast('feedActionButtonClicked', type);
                    };

                    var productToShowListener = $rootScope.$on('showFeedActionButton', function(event, data) {
                        if(data) {
                            $scope.showFeedActionButton = true;
                            $scope.product = data;
                        } else {
                            $scope.showFeedActionButton = false;
                            $scope.product = null;
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
