(function() {
    webapp.controller('ConsignmentController', [
        '$scope',
        '$log',
        'UtilService',
        '$location',
        function($scope, $log, UtilService, $location) {

            var listeners = [];

            function getStep() {
                var query = $location.search();
                if(query) {
                    var step = parseInt(query.step);
                    if(isNaN(step) || !step || step > 3) {
                        return 0;
                    } else {
                        return step;
                    }
                }
            }

            function setStep(step) {
                $location.search('step', step);
            }

            $scope.proceed = function() {
                $scope.step += 1;
                setStep($scope.step);
            };

            function init() {
                $scope.step = getStep();
                $scope.isMobile = UtilService.isMobileRequest();
                $scope.repeat = [1,3];
                $scope.paymentMethod = 0;
            }
            init();

            var consignmentIconClickedListener = $scope.$on('consignmentIconClicked', function(event, data) {
                init();
            });
            listeners.push(consignmentIconClickedListener);

            var destroyListener = $scope.$on('destroy', function() {
                angular.forEach(listeners, function(value, key) {
                    if(value) value();
                });
            });
            listeners.push(destroyListener);
        }
    ]);
})();
