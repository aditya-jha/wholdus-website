(function() {
    webapp.controller('ConsignmentController', [
        '$scope',
        '$log',
        'UtilService',
        function($scope, $log, UtilService) {

            var listeners = [];

            $scope.proceed = function() {
                $scope.step += 1;
            };

            function init() {
                $scope.step = 0;
                $scope.isMobile = UtilService.isMobileRequest();
                $scope.repeat = [1,3];
                $scope.paymentMethod = 0;
            }
            init();

            var destroyListener = $scope.$on('destroy', function() {
                angular.forEach(listeners, function(value, key) {
                    if(value) value();
                });
            });
            listeners.push(destroyListener);
        }
    ]);
})();
