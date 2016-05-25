    (function() {
    webapp.directive('wuCatList', function() {
         return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuCatList.html',
            scope: {},
            link: function(scope, element, attributes) {},
            controller: [
                '$scope',
                '$rootScope',
                '$log',
                'APIService',
                '$mdSidenav',
                function($scope, $rootScope, $log, APIService, $mdSidenav) {
                    $log.log("wuheader directive loaded");

                    function getCategory(params) {
                APIService.apiCall("GET", APIService.getAPIUrl("category"))
                        .then(function(response) {
                            $scope.categories = response.categories;
                        }, function(error) {
                            $scope.categories = [];
                        });
            }
            getCategory();

      

             $rootScope.$on('catSidenav', function() {

                        $mdSidenav('left').toggle();
                    });
                }
            ]
        };
    });
})();
        