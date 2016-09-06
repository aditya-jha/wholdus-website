(function() {
    webapp.controller('StoreHomeController', [
        '$scope',
        '$log',
        '$routeParams',
        'UtilService',
        'APIService',
        '$rootScope',
        'ngProgressBarService',
        '$location',
        '$rootScope',
        function($scope, $log, $routeParams, UtilService, APIService, $rootScope, ngProgressBarService, $location, $rootScope) {

            $scope.pageSettings = {
                totalPages: 0,
                currentPage: UtilService.getPageNumber(),
                enablePagination: false
            };

            function setMobileUrl(mobile_number) {
                var url = $scope.isMobile ? "tel:+91" + mobile_number : null;
                return url;
            }

            function setCompleteAddress(add) {
                var address = "";
                if(add && add.length>0) {
                    add = add[0];
                    address += add.address + ', near ' + add.landmark + ", " + add.city + ', ' + add.state + ', ' + add.pincode;
                }
                return address;
            }

            function getStoreDetails(storeUrl) {
                ngProgressBarService.showProgressbar();
                var params = {
                    store_url: storeUrl
                };
                APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                .then(function(response) {
                    if(response && response.buyers && response.buyers.length) {
                        response.buyers[0].mobileUrl = setMobileUrl(response.buyers[0].mobile_number);
                        response.buyers[0].complete_address = setCompleteAddress(response.buyers[0].address);
                        $scope.store = response.buyers[0];
                        $rootScope.$broadcast('store', $scope.store);
                        ngProgressBarService.endProgressbar();
                    } else {
                        $location.url('/');
                    }
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    $log.log(error);
                    $location.url('/');
                });
            }

            function parseProducts(obj) {
                angular.forEach(obj, function(value, key) {
                    value.product.images = UtilService.getImages(value.product);
                    if(value.product.images.length) {
                        value.product.imageUrl = UtilService.getImageUrl(value.product.images[0], '300x300');
                    }
                });
            }

            function fetchProducts() {
                ngProgressBarService.showProgressbar();
                var params = {
                    page_number: $scope.pageSettings.currentPage,
                    items_per_page: $scope.isMobile ? 18 : 24,
                    is_active: 1,
                    responded: 1,
                };

                APIService.apiCall("GET", APIService.getAPIUrl('buyerProducts'), null, params)
                .then(function(response) {
                    ngProgressBarService.endProgressbar();
                    $scope.pageSettings.totalPages = response.total_pages;

                    if(response.buyer_products.length) {
                        $scope.noProducts = false;
                        if(response.total_pages > 1) {
                            $scope.pageSettings.enablePagination = true;
                            $rootScope.$broadcast('setPage', {
                                page: $scope.pageSettings.currentPage,
                                totalPages: response.total_pages
                            });
                        } else {
                            $scope.pageSettings.enablePagination = false;
                        }
                        parseProducts(response.buyer_products);
                        $scope.products = response.buyer_products;
                    } else {
                        $scope.pageSettings.enablePagination = false;
                        $scope.noProducts = true;
                    }
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    $location.url('/');
                });
            }

            function init() {
                $scope.isMobile = UtilService.isMobileRequest();
                getStoreDetails($routeParams.storeUrl);

                var url = $location.url();
                if(url.indexOf('/products') >= 0) {
                    $scope.pageSettings.currentPage = UtilService.getPageNumber();
                    fetchProducts();
                }
            }
            init();
        }
    ]);
})();
