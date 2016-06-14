(function() {
    webapp.directive('wuHeader', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuHeader.html',
            controller: [
                '$scope',
                '$rootScope',
                'DialogService',
                'LoginService',
                '$location',
                'ToastService',
                function($scope, $rootScope, DialogService, LoginService, $location, ToastService) {
                    var listeners = [];
                    $scope.loginStatus = false;

                    $scope.toggleSidenav = function() {
                        $rootScope.$broadcast('toggleSidenav');
                    };

                    $scope.login = function(event) {
                        if($scope.loginStatus) {
                            LoginService.logout();
                            $scope.loginStatus = false;
                            ToastService.showSimpleToast("We hope you will be back soon!", 2000);
                        } else {
                            DialogService.viewDialog(event, {
                                view: 'views/partials/loginPopup.html',
                            });
                        }
                    };

                    function loginState() {
                        if(LoginService.checkLoggedIn()) {
                            $scope.loginStatus = true;
                        } else {
                            $scope.loginStatus = false;
                        }
                    }
                    loginState();

                    var locationChangeListener = $rootScope.$on('$locationChangeSuccess', function(event, data) {
                        loginState();
                    });
                    listeners.push(locationChangeListener);

                    var loggedInListener = $rootScope.$on('loggedIn', function(event) {
                        $scope.loginStatus = true;
                    });
                    listeners.push(loggedInListener);

                    $scope.$on('$destroy', function() {
                        angular.forEach(listeners, function(value, key) {
                            if(value) value();
                        });
                    });
                }
            ]
        };
    });
})();
