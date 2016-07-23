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
        '$log',
        'productID',
        'categoryID',
        'likeDislikeStatus',
        function($scope, $mdDialog, APIService, ToastService, ngProgressBarService, $rootScope, FormValidationService, ConstantKeyValueService, LoginService, $log, productID, categoryID, likeDislikeStatus) {

            $scope.apiCall = null;
            $scope.loading = {
                show: false,
                message: 'verifying credentials...'
            };
            $scope.bpInstructions = {
                total: 4,
                selectedIndex: 0,
                buyer: LoginService.getBuyerInfo(),
                instructNavPattern: 0
            };
            $scope.favButtonFeeback = likeDislikeStatus;
            $scope.errorMessage = false;

            $scope.formValidation = FormValidationService;
            $scope.sellerSite = ConstantKeyValueService.sellerSite;

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.buyNow = function() {
                if($scope.name && $scope.mobile_number && !$scope.apiCall) {
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
                        ToastService.showSimpleToast("You will soon recieve a call from our representatives!", 3000);
                        $mdDialog.hide();
                    }, function(error) {
                        $scope.apiCall = null;
                        $mdDialog.hide();
                        ToastService.showSimpleToast("Ops! Something went wrong", 2000);
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
                        ToastService.showSimpleToast("Welcome " + response.buyer.name, 2000);
                        $rootScope.$broadcast('loggedIn');
                    }, function(error) {
                        $scope.loading.show = false;
                        $scope.apiCall = null;
                        $scope.errorMessage = true;
                    });
                }
            };

            $scope.nextInstruction = function(direction) {
                if(direction>0) {
                    if($scope.bpInstructions.selectedIndex + 1 >= $scope.bpInstructions.total) {
                        return;
                    }
                    $scope.bpInstructions.selectedIndex += 1;
                } else {
                    if($scope.bpInstructions.selectedIndex <= 0) {
                        return;
                    }
                    $scope.bpInstructions.selectedIndex -= 1;
                }
                // $scope.bpInstructions.instructNavPattern += (', ' + $scope.bpInstructions.selectedIndex);
                $rootScope.$broadcast('instructNavPattern', $scope.bpInstructions.selectedIndex);
            };
        }
    ]);
})();
