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

            var apiCall;

            $scope.formValidation = FormValidationService;
            $scope.sellerSite = ConstantKeyValueService.sellerSite;

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.buyNow = function() {
                if($scope.name && $scope.mobile_number && !apiCall) {
                    $rootScope.$broadcast('showProgressbar');
                    var data = {
                        email: $scope.email,
                        mobile_number: $scope.mobile_number,
                        name: $scope.name,
                        productID: productID,
                        categoryID: categoryID
                    };
                    apiCall = APIService.apiCall("POST", APIService.getAPIUrl('buyerLeads'), data);
                    apiCall.then(function(response) {
                        apiCall = null;
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showSimpleToast("You will soon recieve a call from our representatives!", 3000);
                        $mdDialog.hide();
                    }, function(error) {
                        apiCall = null;
                        $mdDialog.hide();
                        ToastService.showSimpleToast("Ops! Something went wrong", 2000);
                        $rootScope.$broadcast('endProgressbar');
                    });
                }
            };

            $scope.login = function() {
                if($scope.mobile_number && $scope.password && !apiCall) {
                    apiCall = LoginService.login($scope.mobile_number, $scope.password);
                    apiCall.then(function(response) {
                        apiCall = null;
                        $mdDialog.hide();
                        ToastService.showSimpleToast("Welcome", 2000);
                        $rootScope.$broadcast('loggedIn');
                    }, function(error) {
                        $mdDialog.hide();
                        apiCall = null;
                        ToastService.showSimpleToast("Ops! Something went wrong", 2000);
                    });
                }
            };
        }
    ]);
})();
