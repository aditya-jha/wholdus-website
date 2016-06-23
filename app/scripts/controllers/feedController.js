(function() {
    'use strict';
    webapp.controller('FeedController', [
        '$scope',
        '$log',
        '$location',
        'APIService',
        'ngProgressBarService',
        '$rootScope',
        function($scope, $log, $location, APIService, ngProgressBarService, $rootScope) {
            var listeners = [];

            $scope.settings = {
                filter: ''
            };

            function parseSearchParams() {
                var search = $location.search();
                if(search.filter) {
                    $scope.settings.filter = search.filter;
                }
            }

            function fetchProducts() {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('products'), null, {
                    page_number: 1,
                    items_per_page: 20
                })
                    .then(function(response) {
                        $rootScope.$broadcast('endProgressbar');
                        $log.log(response);
                    });
            }

            function init() {
                parseSearchParams();
                fetchProducts();
            }
            // init();

            var favUrlListener = $scope.$on('favUrl', function(event, data) {
                $location.search('filter', data);
                init();
            });
            listeners.push(favUrlListener);

            $scope.$on('$destroy', function() {
                angular.forEach(listeners, function(value) {
                    if(value) value();
                });
            });
        }
    ]);
})();
