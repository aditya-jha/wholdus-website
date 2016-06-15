(function() {
    webapp.directive('wuAccountSidenav', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuAccountSidenav.html',
            controller: [
                '$scope',
                '$log',
                function($scope, $log) {
                    $log.log("account sidenav directive");
                }
            ]
        };
    });
})();
