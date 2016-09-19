(function() {
    'use strict';
    webapp.directive('wuBlognav', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuBlognav.html',
            controller: [
                '$scope',
                '$log',
                '$rootScope',
                '$location',
                'APIService',
                'ToastService',
                function($scope, $log, $rootScope, $location, APIService, ToastService) {
                    $scope.articles = [];

                    function getBlogNav(params){
                        APIService.apiCall('GET', APIService.getAPIUrl('blogarticle'), params)
                        .then(function(response){
                            $scope.articles = response.articles;
                        },function(error){
                            ToastService.showActionToast('Unable to load blogs list', 0);
                        });
                    }

                    getBlogNav();

                    $scope.openArticle = function(slug,id){
                        $location.url('/blog/'+slug+'-'+id);
                    };
                }
            ]
        };
    });
})();
