(function() {
    'use strict';
    webapp.directive('wuProduct', function() {
        return {
            restrict: 'AE',
            scope: {
                product: '='
            },
            replace: true,
            templateUrl: 'views/directives/wuProduct.html',
            controller: [
                '$scope',
                '$log',
                function($scope, $log) {

                    var showShortlist = function(type) {
                        if(type==1) {
                            $scope.shortlisted = true;
                        } else {
                            $scope.shortlisted = false;
                        }
                    };

                    $scope.toggleShortlist = function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                    };

                    function init() {
                        $scope.shortlisted = false;
                        $scope.showShortlist = showShortlist;
                    }

                    init();
                }
            ]
        };
    });
})();
