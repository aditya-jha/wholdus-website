(function() {
    webapp.controller('ProfileController', [
        '$scope',
        '$log',
        'APIService',
        'ToastService',
        '$location',
        'ngProgressBarService',
        '$rootScope',
        function($scope, $log, APIService, ToastService, $location, ngProgressBarService, $rootScope) {

            $scope.buyer = {};

            function fetchBuyer(params) {
                ngProgressBarService.showProgressbar();
                APIService.apiCall("GET", APIService.getAPIUrl('buyers'), params)
                .then(function(response) {
                    if(response.buyers && response.buyers.length) {
                        if(response.buyers[0].address.length === 0) {
                            response.buyers[0].address = [];
                        }
                        $scope.buyer = response.buyers[0];
                    }
                    ngProgressBarService.endProgressbar();
                }, function(error) {
                    ToastService.showActionToast("Something went wrong. Please login again", 0)
                    .then(function(response) {
                        $location.url('/');
                    });
                    ngProgressBarService.endProgressbar();
                });
            }

            fetchBuyer();
        }
    ]);
})();
