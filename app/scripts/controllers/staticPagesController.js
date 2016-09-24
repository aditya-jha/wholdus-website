(function() {
    "use strict";
    webapp.controller('StaticPagesController', [
        '$scope',
        '$log',
        'APIService',
        'ToastService',
        '$rootScope',
        'ngProgressBarService',
        'DialogService',
        'FormValidationService',
        'UtilService',
        '$mdMedia',
        function($scope, $log, APIService, ToastService, $rootScope, ngProgressBarService,
            DialogService,FormValidationService, UtilService, $mdMedia) {

            function resetContactUsFrom() {
                $scope.contactusForm.$setPristine();
                $scope.contactusForm.$setUntouched();
                $scope.contactus = {
                    email: "",
                    mobile_number: "",
                    remarks: "",
                };
            }

            $scope.buyNow = function(event){
                DialogService.viewDialog(event, {
                    view: 'views/partials/buyNow.html'
                });
            };

            $scope.contactUs = function() {
                $scope.settings.showLoading = true;
                APIService.apiCall("POST", APIService.getAPIUrl('contactus'), $scope.contactus)
                .then(function(response) {
                    ToastService.showActionToast("Thank you for reaching out to us. We will get back to you soon!", 0);
                    $scope.settings.showLoading = false;
                    resetContactUsFrom();
                }, function(error) {
                    ToastService.showActionToast("We are experiencing heavy traffic! Please try later", 0);
                    $scope.settings.showLoading = false;
                });
            };

            function init() {
                $scope.settings = {
                    isMobile: UtilService.isMobileRequest(),
                    showLoading: false
                };

                $scope.formValidation=FormValidationService;
                $scope.contactusForm = "contactusForm";

                $scope.contactus = {
                    email: "",
                    mobile_number: "",
                    remarks: "",
                };

                if($mdMedia('xs')) {
                    $scope.settings.demoVideoHeight = '200px';
                } else {
                    $scope.settings.demoVideoHeight = '300px';
                }
            }
            init();
        }
    ]);
})();
