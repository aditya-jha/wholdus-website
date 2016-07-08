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
            $scope.selectedcolours='';
            $scope.filterChange=false;
            $scope.activeFilterStyle={
                '-webkit-transition': 'all 0.4s ease',
                '-moz-transition': 'all 0.4s ease',
                '-o-transition': 'all 0.4s ease',
                '-ms-transition': 'all 0.4s ease',
                'transition': 'all 0.4s ease',
                'background-color': '#D8D8D8',
            };


        function getProducts() {
                $scope.filterChange=false;
                if(UtilService.currentCategoryID!=null){
                    if(UtilService.currentCategoryID!=$scope.categoryID){
                        UtilService.setFilterParams(null);
                        UtilService.resetFilterParams();
                    }
                }
                UtilService.setCategory($scope.categoryID);
                $scope.sellerString=UtilService.sellerString;
                $scope.colours=UtilService.colours;
                $scope.fabrics=UtilService.fabrics;
                $scope.priceRanges=UtilService.priceRanges;
                $scope.selectedColours=UtilService.selectedColours; 
                $scope.selectedFabrics=UtilService.selectedFabrics; 
        

                $rootScope.$broadcast('showProgressbar');
            
                var params = {categoryID: $scope.categoryID, 
                    sellerID:$scope.sellerString,
                    min_price_per_unit:UtilService.minPrice,
                    max_price_per_unit:UtilService.maxPrice,
                    colour:$scope.selectedColours,
                    fabric:$scope.selectedFabrics};

                UtilService.setPaginationParams(params, $scope.settings.page, $scope.settings.itemsPerPage);
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                    .then(function(response) {
                        $scope.settings.noProduct = false;
                        
                        if(UtilService.priceRangeIndex!=null){
                            var pos=UtilService.priceRangeIndex;
                            if($scope.priceRanges[pos].min_value == UtilService.minPrice && 
                                $scope.priceRanges[pos].max_value == UtilService.maxPrice){
                                $scope.priceRanges[pos].active=true;
                            } 
                            else{
                                $scope.priceRanges[pos].active=false;
                            }
                        }
                        $scope.minPrice=UtilService.minPrice;
                        $scope.maxPrice=UtilService.maxPrice;
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
                           $scope.settings.enablePagination = false;
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
                        } 
                        else {
                            $scope.settings.noProduct = true;
                            $scope.settings.enablePagination = false;
                        }
                    }, function(error) {
                        $rootScope.$broadcast('endProgressbar');
                        $scope.products = [];
                        $scope.settings.noProduct = true;
                        $scope.settings.enablePagination = false;
                    });
                }

        function getSellers() {
                $http.get('http://api.wholdus.com/users/seller/?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiaW50ZXJuYWx1c2VyIiwiaW50ZXJuYWx1c2VySUQiOjR9.3BOmXTwSrXJ_kT998Id5AC81OxrY1Aay79Orpxsw5L8')
                    .then(function (response) {
                        $scope.sellers = response.data.body.sellers;
                        checkSelectedSellers();
                    });
         }


        function init(){
            getSellers();
            getProducts();

        }

        init();

        function checkSelectedSellers(){
            var selectedSellers='';
                        if(UtilService.sellerString!=null){
                            selectedSellers=UtilService.sellerString.split(',');
                        }

                        angular.forEach($scope.sellers, function(value, key) {
                            if(selectedSellers.indexOf(value.sellerID.toString())>=0){
                                value.isShow=true;
                            }
                            else{
                                value.isShow=false;   
                            }

                        });

        }

        $scope.updatePrice = function(position) {
              angular.forEach($scope.priceRanges, function(p, index) {
                if (position != index) 
                    p.active = false;
                });
              $scope.priceRangeIndex=position;
              $scope.minPrice=$scope.priceRanges[position].min_value;
              $scope.maxPrice=$scope.priceRanges[position].max_value;    
          } 

        $scope.updateColour=function(position){
               $scope.filterChange=true;
            if(!$scope.colours[position].active){
                $scope.colours[position].active=true;
            }
            else{
                $scope.colours[position].active=false;   
            }
        } 

        $scope.updateFabric=function(position){
            if(!$scope.fabrics[position].active){
                $scope.fabrics[position].active=true;
            }
            else{
                $scope.fabrics[position].active=false;   
            }
        }  
        $scope.filterChanged=function(){
            $scope.filterChange=true;
        }

        $scope.applyFilters=function(type){
            $scope.selectedSellers=[];
            
            var colours=[];
            var fabrics=[];
            angular.forEach($scope.colours, function(value, index) {
                if(value.active){
                    colours.push(value.name);
                }
            });
            angular.forEach($scope.fabrics, function(value, index) {
                if(value.active){
                    fabrics.push(value.name);
                }
            });
            $scope.selectedFabrics=fabrics.toString(); 
            $scope.selectedColours=colours.toString();
            angular.forEach($scope.sellers, function(value, key) {
                if(value.isShow){
                    $scope.selectedSellers.push(value.sellerID);
                }
                

            });    

            $location.search('page', '1');
            $scope.settings.page=UtilService.getPageNumber();
            UtilService.setFilterParams($scope.selectedSellers.toString(),
                $scope.priceRangeIndex,$scope.minPrice,$scope.maxPrice);
            UtilService.setActiveFilterParams($scope.colours, $scope.fabrics,$scope.selectedColours,$scope.selectedFabrics);
            if(type=='desktop'){
                  $scope.desktopFilterID=null;
                 checkSelectedSellers();
                    getProducts();
            }
            else if(type=='mobile'){

            $route.reload();
            $mdDialog.cancel();
            }    

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
        UtilService.setFilterParams(null,null);
        angular.forEach($scope.sellers, function(value, key) {
            value.isShow=false;

        });
        UtilService.setFilterParams(null);
        UtilService.resetFilterParams();
         $scope.sellerString=UtilService.sellerString;
        $scope.colours=UtilService.colours;
        $scope.fabrics=UtilService.fabrics;
        $scope.priceRanges=UtilService.priceRanges; 
        $scope.selectedColours=UtilService.selectedColours; 
        $scope.selectedFabrics=UtilService.selectedFabrics; 
        $scope.minPrice=UtilService.minPrice;
        $scope.maxPrice=UtilService.maxPrice
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

