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
                    var urls = {
                        fav: '/account/hand-picked-products?filter=favorite',
                        consignment: 'consignment'
                    };

                    function loginDialogCallback(redirect) {
                        if(LoginService.checkLoggedIn()) {
                            $scope.loginStatus = true;
                            setBuyerName();
                            if(redirect) {
                                $location.url(redirect);
                            } else {
                                $location.url('/account/hand-picked-products');
                            }
                        }
                    }

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
                                loginDialogCallback(redirect);
                                $rootScope.$broadcast('loginStateChange');
                            });
                        }
                    };

                    function logoutRedirect() {
                        var url = $location.url();
                        if(url.indexOf('account') > -1 || url.indexOf('consignment') > -1) {
                            $location.url('/');
                        }
                        $rootScope.$broadcast('loginStateChange');
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

                    $scope.goToUrl = function(ev, where) {
                        if($scope.loginStatus) {
                            $location.url(urls[where]);
                            if(where == 'consignment') {
                                $scope.$broadcast('consignmentIconClicked');
                            }
                        } else {
                            $scope.login(ev, urls[where]);
                        }
                    };

                    function init() {
                        $scope.isMobile = UtilService.isMobileRequest();
                        loginState();
                    }
                    init();

                    var checkLoginStateListener = $rootScope.$on('checkLoginState', function(event, data) {
                        loginState();
                    });
                    listeners.push(checkLoginStateListener);

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
