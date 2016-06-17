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
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('buyers'), params)
                .then(function(response) {
                    $log.log(response);
                    if(response.buyers && response.buyers.length) {
                        if(response.buyers[0].address.length === 0) {
                            $response.buyers[0].address = [];
                        }
                        $scope.buyer = response.buyers[0];
                    }
                    $rootScope.$broadcast('endProgressbar');
                }, function(error) {
                    $log.log(error);
                    ToastService.showActionToast("Something went wrong. Please login again", 0)
                    .then(function(response) {
                        $location.url('/');
                    });
                    $rootScope.$broadcast('endProgressbar');
                });
            }

            fetchBuyer();
        }
    ]);
})();
