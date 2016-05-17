(function() {
    "use strict";
    webapp.controller('StaticPagesController', [
        '$scope',
        '$log',
        'APIService',
        'ToastService',
        function($scope, $log, APIService, ToastService) {

            $scope.contactus = {
                email: "",
                mobile_number: "",
                remarks: ""
            };

            function resetContactUs() {
                $scope.contactus = {
                    email: "",
                    mobile_number: "",
                    remarks: ""
                };
            }

            $scope.contactUs = function() {
                if($scope.contactus.email && $scope.contactus.mobile_number) {
                    APIService.apiCall("POST", APIService.getAPIUrl('contactus'), $scope.contactus).then(function(response) {
                        ToastService.showActionToast("Thank you for reaching out to us. We will get back to you soon!", 0);
                        resetContactUs();
                    }, function(error) {
                        ToastService.showActionToast("We are experiencing heavy traffic! Please try later", 0);
                    });
                } else {
                    ToastService.showActionToast("Please fill required details", 0);
                }
            };
        }
    ]);
})();
