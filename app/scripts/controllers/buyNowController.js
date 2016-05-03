(function() {
    'use strict';
    webapp.controller('buyNowController', [
        '$scope',
        '$mdDialog',
        'APIService',
        'ToastService',
        'ngProgressBarService',
        '$rootScope',
        'productID',
        function($scope, $mdDialog, APIService, ToastService, ngProgressBarService, $rootScope, productID) {
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.buyNow = function() {
                if($scope.name && $scope.mobile_number) {
                    $rootScope.$broadcast('showProgressbar');
                    var data = {
                        email: $scope.email,
                        mobile_number: $scope.mobile_number,
                        name: $scope.name,
                        productID: productID
                    };
                    APIService.apiCall("POST", APIService.getAPIUrl('buyerLeads'), data)
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        ToastService.showSimpleToast("You will soon recieve a call from our representatives!", 3000);
                        $mdDialog.hide();
                    }, function(error) {
                        $mdDialog.hide();
                        ToastService.showSimpleToast("Ops! Something went wrong", 2000);
                        $rootScope.$broadcast('endProgressbar');
                    });
                }
            };
        }
    ]);
})();
