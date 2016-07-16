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
                'UtilService',
                function($scope, $rootScope, DialogService, LoginService, $location, ToastService, UtilService) {

                    var listeners = [];
                    $scope.loginStatus = false;
                    $scope.buyerName = null;

                    $scope.toggleSidenav = function() {
                        $rootScope.$broadcast('toggleSidenav');
                    };

                    $scope.login = function(event) {
                        if($scope.loginStatus) {
                            LoginService.logout();
                            $scope.loginStatus = false;
                            ToastService.showSimpleToast("We hope you will be back soon!", 2000);
                            logoutRedirect();
                        } else {
                            DialogService.viewDialog(event, {
                                view: 'views/partials/loginPopup.html',
                            });
                        }
                    };

                    function logoutRedirect() {
                        if($location.url().indexOf('account') > -1) {
                            $location.url('/');
                        }
                    }

                    function setBuyerName() {
                        var name = LoginService.getBuyerName();
                        if(name && (UtilService.isMobileRequest() || name.length > 12)) {
                            name = name.split(' ');
                            name = name[0];
                        }
                        $scope.buyerName = name;
                    }

                    function loginState() {
                        if(LoginService.checkLoggedIn()) {
                            $scope.loginStatus = true;
                            setBuyerName();
                        } else {
                            $scope.loginStatus = false;
                            $scope.buyerName = null;
                            logoutRedirect();
                        }
                    }
                    loginState();

                    var locationChangeListener = $rootScope.$on('$locationChangeSuccess', function(event, data) {
                        loginState();
                    });
                    listeners.push(locationChangeListener);

                    var loggedInListener = $rootScope.$on('loggedIn', function(event) {
                        $scope.loginStatus = true;
                        setBuyerName();
                        $location.url('/account/hand-picked-products');
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
