(function() {
    webapp.directive('wuHeader', function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'views/directives/wuHeader.html',
            controller: [
                '$scope',
                '$rootScope',
                'DialogService',
                'LoginService',
                '$location',
                'ToastService',
                'UtilService',
                '$window',
                '$element',
                '$mdInkRipple',
                function($scope, $rootScope, DialogService, LoginService, $location, ToastService, UtilService, $window, $element, $mdInkRipple) {

                    var listeners = [];
                    $scope.loginStatus = false;
                    $scope.buyerName = null;
                    $scope.isMobile = UtilService.isMobileRequest();
                    
                    $scope.toggleSidenav = function() {
                        $rootScope.$broadcast('toggleSidenav');
                    };

                    $scope.login = function(event, redirect) {
                        if($scope.loginStatus) {
                            LoginService.logout();
                            $scope.loginStatus = false;
                            ToastService.showSimpleToast("We hope you will be back soon!", 2000);
                            logoutRedirect();
                        } else {
                            DialogService.viewDialog(event, {
                                view: 'views/partials/loginPopup.html',
                            }).finally(function() {
                                if(LoginService.checkLoggedIn()) {
                                    $scope.loginStatus = true;
                                    setBuyerName();
                                    if(redirect) {
                                        $location.url('/account/hand-picked-products?filter=favorite');
                                    } else {
                                        $location.url('/account/hand-picked-products');
                                    }
                                }
                            });
                        }
                    };

                    function logoutRedirect() {
                        if($location.url().indexOf('account') > -1) {
                            $location.url('/');
                        }
                    }

                    function setBuyerName() {
                        var name = LoginService.getBuyerInfo().name;
                        name = name.split(' ');
                        $scope.buyerName = name[0];
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

                    $scope.goToFav = function(ev) {
                        if($scope.loginStatus) {
                            $location.url('/account/hand-picked-products?filter=favorite');
                        } else {
                            $scope.login(ev,true);
                        }
                    };

                    var locationChangeListener = $rootScope.$on('$locationChangeSuccess', function(event, data) {
                        loginState();
                    });
                    listeners.push(locationChangeListener);

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
