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
        function($scope, $log, APIService, ToastService, $rootScope, ngProgressBarService,
            DialogService,FormValidationService, UtilService) {

            $scope.formValidation=FormValidationService;

            $scope.settings = {
                isMobile: UtilService.isMobileRequest(),
                showLoading: false
            };

            $scope.contactus = {
                email: "",
                mobile_number: "",
                remarks: "",
                apiCall: null
            };

            function resetContactUs() {
                $scope.contactus = {
                    email: "",
                    mobile_number: "",
                    remarks: ""
                };
            }

            $scope.buyNow = function(event){
                DialogService.viewDialog(event, {
                    view: 'views/partials/buyNow.html'
                });
            };

            $scope.contactUs = function() {
                if($scope.contactus.apiCall) {
                    return;
                }
                if($scope.contactus.email && $scope.contactus.mobile_number) {
                    $scope.settings.showLoading = true;
                    $scope.contactus.apiCall = APIService.apiCall("POST", APIService.getAPIUrl('contactus'), $scope.contactus);
                    $scope.contactus.apiCall.then(function(response) {
                        ToastService.showActionToast("Thank you for reaching out to us. We will get back to you soon!", 0);
                        resetContactUs();
                        $scope.settings.showLoading = false;
                        $scope.contactus.apiCall = null;
                    }, function(error) {
                        ToastService.showActionToast("We are experiencing heavy traffic! Please try later", 0);
                        $rootScope.$broadcast('endProgressbar');
                        $scope.settings.showLoading = false;
                    });
                } else {
                    ToastService.showActionToast("Please fill required details", 0);
                }
            };
        }
    ]);
})();
