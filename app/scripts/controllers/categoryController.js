(function() {
    'use strict';
    webapp.controller('CategoryController', [
        '$scope',
        '$routeParams',
        '$route',
        '$http',
        '$window',
        '$mdDialog',
        '$location',
        '$log',
        'UtilService',
        'APIService',
        'ngProgressBarService',
        '$rootScope',
        'DialogService',
        function ($scope, $routeParams,$route, $http,$window,$mdDialog,$location, $log, UtilService, APIService, ngProgressBarService, $rootScope, DialogService) {

            $scope.categoryID = UtilService.getIDFromSlug($routeParams.category);
            $scope.settings = {
                isMobile: UtilService.isMobileRequest(),
                enablePagination: false,
                page: UtilService.getPageNumber(),
                noProduct: false,
                displayName: UtilService.getNameFromSlug($routeParams.category)
            };
            $scope.settings.itemsPerPage = $scope.settings.isMobile ? 16 : 21;
            $scope.sellers=[];
            $scope.selectedSellers=[];
            $scope.isShow=[];
            $scope.sellerString=null;
            $scope.filterID=1;
            $scope.activeFilterStyle={

                '-webkit-transition': 'all 0.4s ease',
                '-moz-transition': 'all 0.4s ease',
                '-o-transition': 'all 0.4s ease',
                '-ms-transition': 'all 0.4s ease',
                'transition': 'all 0.4s ease',
                'background-color': '#D8D8D8',
                // 'color':'#fff'
            };


            function getProducts() {
                if(UtilService.currentCategoryID!=null){
                    if(UtilService.currentCategoryID!=$scope.categoryID){
                        UtilService.setFilterParams(null,0,5000);
                    }
                }
                UtilService.setCategory($scope.categoryID); 
                $rootScope.$broadcast('showProgressbar');
                $scope.minPrice= UtilService.minPrice;
                $scope.maxPrice= UtilService.maxPrice;

                $scope.sellerString=UtilService.sellerString;
                var params = {categoryID: $scope.categoryID, 
                    sellerID:$scope.sellerString,
                    min_price_per_unit:$scope.minPrice,
                    max_price_per_unit:$scope.maxPrice,};

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
                        else{
                             $scope.settings.noProduct = false;
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
                            $scope.settings.enablePagination = false;
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                        $scope.products = [];
                        $scope.settings.noProduct = true;
                    });
                }

                function getSellers() {

                    $http.get('http://api.wholdus.com/users/seller/?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiaW50ZXJuYWx1c2VyIiwiaW50ZXJuYWx1c2VySUQiOjR9.3BOmXTwSrXJ_kT998Id5AC81OxrY1Aay79Orpxsw5L8')
                    .then(function (response) {
                        $scope.sellers = response.data.body.sellers;
                        var selectedSellers='';
                        if(UtilService.sellerString!=null){
                            selectedSellers=UtilService.sellerString.split(',');
                        }

                        angular.forEach($scope.sellers, function(value, key) {
                            if(selectedSellers.indexOf(value.sellerID.toString())>=0){
                                value.isShow=true;


                            }

                        });

                    });

                }


                function init(){
                   getSellers();
                   getProducts();

               }
               init();

               $scope.filterChanged=function(){
                $scope.selectedSellers=[];
                angular.forEach($scope.sellers, function(value, key) {
                    if(value.isShow){
                        $scope.selectedSellers.push(value.sellerID);
                    }
                    $scope.desktopFilterID=null;

                });
                $location.search('page', '1');
                UtilService.setFilterParams($scope.selectedSellers.toString(),$scope.minPrice,$scope.maxPrice);
                getSellers();
                getProducts();

            }

            $scope.applyFilters=function(){
                $scope.selectedSellers=[];
                angular.forEach($scope.sellers, function(value, key) {
                    if(value.isShow){
                        $scope.selectedSellers.push(value.sellerID);
                    }
                });
                 $location.search('page', '1');
                UtilService.setFilterParams($scope.selectedSellers.toString(),$scope.minPrice,$scope.maxPrice);


                $route.reload();
                $mdDialog.cancel();

            }

            $scope.showFilterDialog=function(){
               DialogService.viewDialog(event, {
                view: 'views/partials/filterDialog.html',
                controller:'CategoryController'
            });
           }

           $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.clear=function(){
            UtilService.setFilterParams(null,0,5000);
            angular.forEach($scope.sellers, function(value, key) {
                value.isShow=false;

            });
            $scope.maxPrice=5000;
            $scope.minPrice=0;
        }   


        $scope.buyNow = function(event, categoryID){
            DialogService.viewDialog(event, {
                categoryID: categoryID,
                view: 'views/partials/buyNow.html'
            });
        };
    }
    ]);
})();

