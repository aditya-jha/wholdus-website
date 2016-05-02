(function() {
    'use strict';
    webapp.controller('CategoryController', [
        '$scope',
        '$routeParams',
        '$location',
        '$log',
        'UtilService',
        'APIService',
        'ngProgressBarService',
        '$rootScope',
        function ($scope, $routeParams, $location, $log, UtilService, APIService, ngProgressBarService, $rootScope) {

            $scope.categoryID = UtilService.getIDFromSlug($routeParams.category);
            $scope.settings = {
                isMobile: UtilService.isMobileRequest(),
                enablePagination: false,
                page: UtilService.getPageNumber(),
            };
            $scope.settings.itemsPerPage = $scope.settings.isMobile ? 16 : 21;

            function getProducts() {
                $rootScope.$broadcast('showProgressbar');
                var params = {categoryID: $scope.categoryID};

                UtilService.setPaginationParams(params, $scope.settings.page, $scope.settings.itemsPerPage);

                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    if(response.total_pages > 1) {
                        $scope.settings.enablePagination = true;
                        $rootScope.$broadcast('setPage', {
                            page: $scope.settings.page,
                            totalPages: Math.ceil(response.total_products/$scope.settings.itemsPerPage)
                        });
                    }
                    angular.forEach(response.products, function(value, key) {
                        value.images = UtilService.getImages(value);
                        value.imageUrl = UtilService.getImageUrl(value.images[0], '200x200');
                    });
                    $scope.products = response.products;
                    if($scope.products.length) {
                        $scope.category = response.products[0].category;
                    }
                }, function(error) {
                    $rootScope.$broadcast('endProgressbar');
                    $scope.products = [];
                });
            }
            getProducts();
        }
    ]);
})();
