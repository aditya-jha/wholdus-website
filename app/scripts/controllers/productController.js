(function() {
    'use strict';
    webapp.controller('ProductController', [
        '$scope',
        '$routeParams',
        '$log',
        'APIService',
        'UtilService',
        'ngProgressBarService',
        '$rootScope',
        '$mdMedia',
        '$mdDialog',
        function($scope, $routeParams, $log, APIService, UtilService, ngProgressBarService, $rootScope, $mdMedia, $mdDialog) {
            $scope.displayImageLoading=true;
            $scope.displayImageStyle={'opacity':'1.0'};
            function praseProductDetails(p) {
                p.images = UtilService.getImages(p);
                if(p.images.length) {
                    $scope.image = {
                        url: UtilService.getImageUrl(p.images[0], '400x400'),
                        index: 0,
                        showImage: true
                    };
                    $scope.allImages = [];
                    for(var i=0; i<p.images.length && i<10; i++) {
                        $scope.allImages.push(UtilService.getImageUrl(p.images[i], '200x200'));
                    }
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
                    $rootScope.$broadcast('endProgressbar');
                }, function(error) {
                    $scope.product = [];
                    $rootScope.$broadcast('endProgressbar');
                });
            }
            getProducts();

            $scope.buyNow = function(event) {
                var useFullScreen = $mdMedia('xs');
                $mdDialog.show({
                    controller: 'buyNowController',
                    templateUrl: 'views/partials/buyNow.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen,
                    locals: {
                        productID: $scope.product.productID
                    }
                });
            };

            $scope.changeDisplayImage = function(index) {
                if($scope.image.index != index) {
                    $scope.image.showImage = false;
                    $scope.image.index = index;
                    $scope.displayImageStyle={'opacity':'0.5'};
                    $scope.image.url = UtilService.getImageUrl($scope.product.images[index], '400x400');
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

            
        }
    ]);
})();