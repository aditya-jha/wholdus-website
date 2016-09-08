(function() {
    webapp.directive('wuPurchaseRequestStatus', function() {
        return {
            restrict: 'AE',
            template: '<md-switch aria-label="Purchase Request Status" ng-model="lead.status" ng-change="onStatusChange()">Status : {{lead.statusTest}}</md-switch>',
            scope: {
                lead: '='
            },
            controller: [
                '$scope',
                '$log',
                'APIService',
                'ToastService',
                function($scope, $log, APIService, ToastService) {

                    function setLeadTest() {
                        $scope.lead.statusTest = $scope.lead.status ? 'Resolved' : 'Un-resolved';
                    }

                    function updateStatus() {
                        APIService.apiCall("PUT", APIService.getAPIUrl('storeLead'), {
                            buyerstoreleadID: $scope.lead.buyerstoreleadID,
                            status: $scope.lead.status ? 1 : 0
                        }).then(function(response) {
                            ToastService.showActionToast("Successfully Saved!", 3000, "ok");
                        }, function(error) {
                            $scope.lead.status = $scope.lead.oldStatus;
                            setLeadTest();
                            ToastService.showActionToast("Something went wrong!", 5000, "ok");
                        });
                    }

                    $scope.onStatusChange = function() {
                        $scope.lead.oldStatus = !$scope.lead.status;
                        setLeadTest();
                        updateStatus();
                    };

                    $scope.lead.oldStatus = $scope.lead.status;

                }
            ]
        };
    });
})();
