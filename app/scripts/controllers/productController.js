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
        function($scope, $routeParams, $log, $window,$location,APIService, UtilService, ngProgressBarService, $rootScope, DialogService) {

            var listeners = [];

            function praseProductDetails(p) {
                var product = {
                    category: p.category,
                    display_name: p.display_name,
                    min_price_per_unit: p.min_price_per_unit,
                    price_per_unit: p.price_per_unit,
                    margin: p.margin,
                    lot_size: p.lot_size,
                    seller: {
                        company_name: p.seller.company_name,
                        address: p.seller.address[0]
                    },
                    details: {
                        seller_catalog_number: p.details.seller_catalog_number,
                    },
                    product_lot: p.product_lot,
                    image: p.image
                };

                var productDetailsKeys = [{
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
                $scope.product = product;
                $scope.productDetailsKeys = productDetailsKeys;
            }

            function getProducts() {
                var params = {
                    productID: UtilService.getIDFromSlug($routeParams.product)
                };
                ngProgressBarService.showProgressbar();
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, params)
                .then(function(response) {
                    ngProgressBarService.endProgressbar();
                    if(response.products.length) {
                        praseProductDetails(response.products[0]);
                    }
                    else{
                        $location.url('/404');
                    }
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    $location.url('/404');
                });
            }

            function init() {
                getProducts();
            }
            init();

            $scope.buyNow = function(event, productID) {
                 DialogService.viewDialog(event, {
                     productID: productID,
                     view: 'views/partials/buyNow.html'
                 });
            };
            
            var destroyListener = $scope.$on('$destroy', function() {
                angular.forEach(listeners, function(value, key) {
                    if(value) value();
                });
            });
            listeners.push(destroyListener);
        }
    ]);
})();
