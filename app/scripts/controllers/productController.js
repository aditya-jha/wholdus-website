(function() {
    'use strict';
    webapp.controller('ProductController', [
        '$scope',
        '$routeParams',
        '$log',
        '$window',
        '$location',
        'APIService',
        'UtilService',
        'ngProgressBarService',
        '$rootScope',
        'DialogService',
        function($scope, $routeParams, $log, $window,$location,APIService,
            UtilService, ngProgressBarService, $rootScope, DialogService) {
            $scope.displayImageLoading=true;
            $scope.start=0;
            $scope.displayImageStyle={'opacity':'1.0'};
            $scope.largeImageDisplay=false;
            $scope.largeImageLoading=false;
            $scope.mobileDisplay=false;
            $scope.largeImageIndex=0;

            if($window.innerWidth<=760)
            {
                 $scope.mobileDisplay=true;
            }

            function praseProductDetails(p) {
                p.images = UtilService.getImages(p);
                if(p.images.length) {
                    $scope.image = {
                        url: UtilService.getImageUrl(p.images[0], '400x400'),
                        urlLarge:UtilService.getImageUrl(p.images[0], '700x700'),
                        index: 0,
                        showImage: true
                    };
                    $scope.allImages = [];
                    for(var i=0; i<p.images.length && i<10; i++) {
                        $scope.allImages.push(UtilService.getImageUrl(p.images[i], '200x200'));
                    }
                } else {
                    $scope.image = {
                        url: 'images/400.png',
                        showImage: true,
                    };
                }
                $scope.productDetailsKeys = [{
                    label: 'Brand',
                    value: p.details.brand
                }, {
                    label: 'Pattern',
                    value: p.details.pattern
                }, {
                    label: 'Style',
                    value: p.details.style
                }, {
                    label: 'Fabric/GSM',
                    value: p.details.fabric_gsm
                }, {
                    label: 'Sleeve',
                    value: p.details.sleeve
                }, {
                    label: 'Neck/Collar',
                    value: p.details.neck_collar_type
                }, {
                    label: 'Length',
                    value: p.details.length
                }, {
                    label: 'Work/Decor',
                    value: p.details.work_decoration_type
                }, {
                    label: 'Colors',
                    value: p.details.colours
                }, {
                    label: 'Sizes',
                    value: p.details.sizes
                }, {
                    label: 'Features',
                    value: p.details.special_feature
                },{
                    label: 'Colours',
                    value: p.details.colours
                },{
                    label: 'Lot Description',
                    value: p.details.lot_description.length>0?p.details.lot_description:'None'
                }];
            }

            function getProducts() {
                var params = {
                    productID: UtilService.getIDFromSlug($routeParams.product)
                };
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                .then(function(response) {
                    if(response.products.length) {
                       $scope.product = response.products[0];
                        praseProductDetails($scope.product);
                     }
                    else{
                        $location.url('/404');
                    }
                    $rootScope.$broadcast('endProgressbar');
                }, function(error) {
                    $scope.product = [];
                    $rootScope.$broadcast('endProgressbar');
                });
            }
            getProducts();

            $scope.buyNow = function(event, productID) {
                 DialogService.viewDialog(event, {
                     productID: productID,
                     view: 'views/partials/buyNow.html'
                 });
            };

            $scope.changeDisplayImage = function(index) {
                if($scope.image.index != index) {
                    $scope.image.showImage = false;
                    $scope.image.index = index;
                    $scope.displayImageStyle={'opacity':'0.5'};
                    $scope.image.url = UtilService.getImageUrl($scope.product.images[index], '400x400');
                    $scope.image.urlLarge = UtilService.getImageUrl($scope.product.images[index], '700x700');
                    $scope.displayImage=new Image();
                    $scope.displayImage.src=$scope.image.url;
                    $scope.image.showImage = true;
                    $scope.displayImageLoading=true;
                }

            };
            $scope.imageLoaded= function(){
                    $scope.displayImageLoading=false;
                    $scope.displayImageStyle={'opacity':'1.0'};
            };
            $scope.largeImageLoaded= function(){
                   $scope.largeImageLoading=false;
            };
            $scope.sliderPrevious= function(){
                if($scope.start>0){
                    $scope.start-=1;
                    changeDisplayImage($scope.start);
                } else {
                    $scope.start=0;
                }
            };

            $scope.sliderNext= function(){
                if($scope.start<$scope.allImages.length-6){
                    $scope.start+=1;
                    changeDisplayImage($scope.start);
                }
            };

            $scope.largeSliderPrevious= function(){
                if($scope.largeImageIndex>0){
                    $scope.largeImageIndex-=1;
                   displayLargeImage();

                }
            };

            $scope.largeSliderNext= function(){
                if($scope.largeImageIndex<($scope.allImages.length-1)){
                    $scope.largeImageIndex+=1;
                    displayLargeImage();
                }
            };

            $scope.zoomImage=function(){
                $scope.largeImageIndex=$scope.image.index;
                displayLargeImage();
            };

            function displayLargeImage(){
                $scope.image.urlLarge = UtilService.getImageUrl($scope.product.images[$scope.largeImageIndex], '700x700');
                if($window.innerWidth>760){
                    $scope.largeImageLoading=true;
                    $scope.largeImageDisplay=true;
                } else{
                    $window.location.href=$scope.image.urlLarge;
                }
            }

            $scope.closeLargeImage=function(){
                  $scope.largeImageDisplay=false;
                  $scope.largeImageIndex=0;
            };
         }
    ]);
})();
