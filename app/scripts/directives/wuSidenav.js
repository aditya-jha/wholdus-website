    (function() {
        'use strict';
    webapp.directive('wuSidenav', function() {
         return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuSidenav.html',
            replace: true,
            controller: [
                '$scope',
                '$rootScope',
                '$log',
                'APIService',
                '$mdSidenav',
                '$timeout',
                '$location',
                function($scope, $rootScope, $log, APIService, $mdSidenav, $timeout, $location) {

                    var listeners = [];

                    $scope.links = [{
                        display_name: 'Hand Picked For You',
                        url: '/account/hand-picked-products'
                    }, {
                        display_name: 'My Store',
                        url: '/account/my-store'
                    }, {
                        display_name: 'Purchase Requests',
                        url: '/account/purchase-requests'
                    }, {
                        display_name: 'Orders',
                        url: '/account/orders'
                    }];

                    function getCategory(params) {
                        APIService.apiCall("GET", APIService.getAPIUrl("category"))
                            .then(function(response) {
                                $scope.categories = response.categories;
                            }, function(error) {
                                $scope.categories = [];
                        });
                    }
                    getCategory();

                    function closeSidenav() {
                        $mdSidenav('left').close();
                    }

                    $scope.goTo = function(event, url) {
                        event.preventDefault();
                        $location.url(url);
                        $timeout(function() {
                            closeSidenav();
                        }, 500);
                    };

                    $scope.toggleSidenav = function() {
                        closeSidenav();
                        $mdSidenav('left').toggle();
                    };

                    var destroyListener = $scope.$on("$destroy", function() {
                        angular.forEach(listeners, function(value, key) {
                            if(value) value();
                        });
                    });
                    listeners.push(destroyListener);
                }
            ]
        };
    });
})();
