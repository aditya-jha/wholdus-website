(function() {
    webapp.controller('OrdersController', [
        '$scope',
        '$log',
        'APIService',
        function($scope, $log, APIService) {

            $scope.orders = [];

            APIService.apiCall("GET", APIService.getAPIUrl('orders'))
            .then(function(response) {
                $log.log(response);
                $scope.orders = response.orders;
            }, function(error) {
                $log.log(error);
            });
        }
    ]);
})();
