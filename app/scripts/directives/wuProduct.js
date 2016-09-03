(function() {
    'use strict';
    webapp.directive('wuProduct', function() {
        return {
            restrict: 'AE',
            scope: {
                product: '='
            },
            replace: true,
            templateUrl: 'views/directives/wuProduct.html',
            controller: [
                '$scope',
                '$log',
                'APIService',
                'LoginService',
                '$rootScope',
                'DialogService',
                function($scope, $log, APIService, LoginService, $rootScope, DialogService) {

                    $scope.shortlistApiCall = null;

                    function toggleShortlistHelper() {
                        $scope.shortlisted = !$scope.shortlisted;
                        if(!$scope.shortlistApiCall) {
                            $scope.shortlistApiCall = APIService.apiCall('PUT', APIService.getAPIUrl('buyerProducts'), {
                                productID: $scope.product.productID,
                                responded: $scope.shortlisted ? 1 : 2
                            });
                            $scope.shortlistApiCall.then(function(response) {
                                $scope.shortlistApiCall = null;
                            }, function(error) {
                                $scope.shortlistApiCall = null;
                            });
                        }
                    }

                    $scope.toggleShortlist = function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        if(LoginService.checkLoggedIn()) {
                            toggleShortlistHelper();
                        } else {
                            DialogService.viewDialog(ev, {
                                view: 'views/partials/loginPopup.html',
                            }).finally(function() {
                                if(LoginService.checkLoggedIn()) {
                                    $rootScope.$broadcast('checkLoginState');
                                    // toggleShortlistHelper();
                                }
                            });
                        }
                    };

                    function init() {
                        if(LoginService.checkLoggedIn()) {
                            $scope.shortlisted = $scope.product.response.response_code == 1;
                            $scope.loggedIn = true;
                        } else {
                            $scope.shortlisted = false;
                            $scope.loggedIn = false;
                        }
                    }
                    init();

                }
            ]
        };
    });
})();
