(function() {
    'use strict';
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
                        consignment: 'consignment',
                        store: '/account/my-store'
                    };

                    function loginDialogCallback(redirect) {
                        if(LoginService.checkLoggedIn()) {
                            $scope.loginStatus = true;
                            setBuyerDetails();
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

                    function setBuyerDetails() {
                        var buyer = LoginService.getBuyerInfo();
                        var name = buyer.name.split(' ');
                        $scope.buyerName = name[0];
                        $scope.store_url = buyer.store_url;
                    }

                    function loginState() {
                        if(LoginService.checkLoggedIn()) {
                            $scope.loginStatus = true;
                            setBuyerDetails();
                        } else {
                            $scope.loginStatus = false;
                            $scope.buyerName = null;
                            logoutRedirect();
                        }
                    }

                    function checkStorePage() {
                        var url = $location.url();
                        if(url.indexOf('/store/') >= 0) {
                            return true;
                        }
                        return false;
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
                        $scope.isStorePage = checkStorePage();
                        loginState();
                    }
                    init();

                    var checkLoginStateListener = $rootScope.$on('checkLoginState', function(event, data) {
                        loginState();
                    });
                    listeners.push(checkLoginStateListener);

                    var locationChangeListener = $rootScope.$on('$locationChangeSuccess', function(event, data) {
                        $scope.isStorePage = checkStorePage();
                        loginState();
                    });
                    listeners.push(locationChangeListener);

                    var storeListener = $rootScope.$on('store', function(event, data) {
                        $scope.store = data;
                        $scope.isStorePage = checkStorePage();
                    });
                    listeners.push(storeListener);

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
