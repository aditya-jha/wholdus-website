(function() {
    'use strict';
    webapp.controller('PopupController', [
        '$scope',
        '$mdDialog',
        'APIService',
        'ToastService',
        'ngProgressBarService',
        '$rootScope',
        'FormValidationService',
        'ConstantKeyValueService',
        'LoginService',
        'productID',
        'categoryID',
        function($scope, $mdDialog, APIService, ToastService, ngProgressBarService, $rootScope, FormValidationService, ConstantKeyValueService, LoginService, productID, categoryID) {

            $scope.apiCall = null;
            $scope.loading = {
                show: false,
                message: 'verifying credentials...'
            };
            $scope.errorMessage = false;

            $scope.formValidation = FormValidationService;
            $scope.sellerSite = ConstantKeyValueService.sellerSite;

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.buyNow = function() {
                if($scope.name && $scope.mobile_number && !$scope.apiCall) {
                    $rootScope.$broadcast('showProgressbar');
                    var data = {
                        email: $scope.email,
                        mobile_number: $scope.mobile_number,
                        name: $scope.name,
                        productID: productID,
                        categoryID: categoryID
                    };
                    $scope.apiCall = APIService.apiCall("POST", APIService.getAPIUrl('buyerLeads'), data);
                    $scope.apiCall.then(function(response) {
                        $scope.apiCall = null;
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showSimpleToast("You will soon recieve a call from our representatives!", 3000);
                        $mdDialog.hide();
                    }, function(error) {
                        $scope.apiCall = null;
                        $mdDialog.hide();
                        ToastService.showSimpleToast("Ops! Something went wrong", 2000);
                        $rootScope.$broadcast('endProgressbar');
                    });
                }
            };

            $scope.login = function() {
                if($scope.mobile_number && $scope.password && !$scope.apiCall) {
                    $scope.errorMessage = false;
                    $scope.loading.show = true;
                    $scope.apiCall = LoginService.login($scope.mobile_number, $scope.password);
                    $scope.apiCall.then(function(response) {
                        $scope.loading.show = false;
                        $scope.apiCall = null;
                        $mdDialog.hide();
                        ToastService.showSimpleToast("Welcome", 2000);
                        $rootScope.$broadcast('loggedIn');
                    }, function(error) {
                        $scope.loading.show = false;
                        $scope.apiCall = null;
                        $scope.errorMessage = true;
                    });
                }
            };
        }
    ]);
})();
