(function() {
    webapp.directive('wuFooter', function() {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/wuFooter.html',
            scope: {},
            controller: [
                '$scope',
                'DialogService',
                function($scope, DialogService) {
                    $scope.buyNow = function(event){
                        DialogService.viewDialog(event, {
                            view: 'views/partials/buyNow.html'
                        });
                    };
                }
            ]
        };
    });
})();
