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
        'DialogService',
        function ($scope, $routeParams, $location, $log, UtilService, APIService, ngProgressBarService, $rootScope, DialogService) {

            $scope.categoryID = UtilService.getIDFromSlug($routeParams.category);
            $scope.settings = {
                isMobile: UtilService.isMobileRequest(),
                enablePagination: false,
                page: UtilService.getPageNumber(),
                noProduct: false,
                displayName: UtilService.getNameFromSlug($routeParams.category)
            };
            $scope.settings.itemsPerPage = $scope.settings.isMobile ? 16 : 21;

            function getProducts() {
                $rootScope.$broadcast('showProgressbar');
                var params = {categoryID: $scope.categoryID};

                UtilService.setPaginationParams(params, $scope.settings.page, $scope.settings.itemsPerPage);

                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                .then(function(response) {
                    $scope.settings.noProduct = false;
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
                        if(value.images.length){
                        value.imageUrl = UtilService.getImageUrl(value.images[0], '200x200');
                        }
                        else{
                            value.imageUrl = 'images/200.png';
                        }
                    });
                    $scope.products = response.products;
                    if($scope.products.length) {
                        $scope.category = response.products[0].category;
                    } else {
                        $scope.settings.noProduct = true;
                    }
                }, function(error) {
                    $rootScope.$broadcast('endProgressbar');
                    $scope.products = [];
                    $scope.settings.noProduct = true;
                });
            }
            getProducts();

            $scope.buyNow = function(event, categoryID){
                DialogService.viewDialog(event, {
                    categoryID: categoryID
                });
            };
        }
    ]);
})();
