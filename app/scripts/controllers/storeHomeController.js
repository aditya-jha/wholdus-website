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
        '$mdDialog',
        '$mdMedia',
        '$q',
        'DialogService',
        '$route',
        function($scope, $log, $routeParams, UtilService, APIService, $rootScope, ngProgressBarService, $location, $mdDialog, $mdMedia, $q, DialogService, $route) {

            $scope.pageSettings = {
                totalPages: 0,
                currentPage: UtilService.getPageNumber(),
                enablePagination: false,
                myStoreUrl: false
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

            function setStoreText(buyer) {
                var storeText = "whatsapp://send?text=Hey!+Check+out+" + buyer.name + "'s+online+store+" + buyer.company_name + "+on:+" + $location.protocol() + "://" + $location.host() + "/store/" + buyer.store_url;
                return storeText;
            }

            function setProductShareText(product) {
                var productText = "whatsapp://send?text=Hey!+Buy+" + product.name + "+on+my+online+store+" + $location.protocol() + "://" + $location.host() + "/store/" + $scope.storeUrl + '/' + product.slug + '-' + product.productID;
                return productText;
            }

            function praseProductDetails(p) {
                var product = {
                    productID: p.productID,
                    category: p.category,
                    display_name: p.display_name,
                    min_price_per_unit: p.min_price_per_unit,
                    price_per_unit: p.price_per_unit,
                    margin: p.margin,
                    brand: p.details.brand,
                    fabric_gsm: p.details.fabric_gsm,
                    colors: p.details.colours,
                    sizes: p.details.sizes,
                    lot_size: p.lot_size,
                    seller: {
                        company_name: p.seller.company_name,
                        address: p.seller.address[0]
                    },
                    details: {
                        seller_catalog_number: p.details.seller_catalog_number,
                    },
                    product_lot: p.product_lot,
                    image: p.image,
                    productShareText: setProductShareText(p)
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
                    label: 'Lot Description',
                    value: p.details.lot_description.length>0?p.details.lot_description:'None'
                }];
                $scope.product = product;
                $scope.productDetailsKeys = productDetailsKeys;
            }

            function fetchProductByID(productID) {
                ngProgressBarService.showProgressbar();
                APIService.apiCall("GET", APIService.getAPIUrl("products"), null, {
                    productID: productID
                }).then(function(response) {
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

            function getStoreDetails(storeUrl) {
                var deferred = $q.defer();
                ngProgressBarService.showProgressbar();
                var params = {
                    store_url: storeUrl
                };
                APIService.apiCall('GET', APIService.getAPIUrl('buyers'), null, params)
                .then(function(response) {
                    if(response && response.buyers && response.buyers.length) {
                        response.buyers[0].mobileUrl = setMobileUrl(response.buyers[0].mobile_number);
                        response.buyers[0].complete_address = setCompleteAddress(response.buyers[0].address);
                        response.buyers[0].storeText = setStoreText(response.buyers[0]);
                        $scope.storeUrl = response.buyers[0].store_url;
                        $scope.store = response.buyers[0];
                        $rootScope.$broadcast('store', $scope.store);
                        ngProgressBarService.endProgressbar();
                        deferred.resolve(response);
                    } else {
                        $location.url('/');
                        deferred.reject();
                    }
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    $log.log(error);
                    $location.url('/');
                    deferred.reject();
                });
                return deferred.promise;
            }

            function parseProducts(obj, cartItems, storeUrl) {
                angular.forEach(obj, function(value, key) {
                    value.product.images = UtilService.getImages(value.product);
                    value.product.storeUrl = storeUrl;
                    if(cartItems) {
                        value.product.lotsInCart = cartItems[value.product.productID] ? cartItems[value.product.productID] : 0;
                    }
                    if(value.product.images.length) {
                        value.product.imageUrl = UtilService.getImageUrl(value.product.images[0], '300x300');
                    }
                    value.product.productShareText = setProductShareText(value.product);
                });
            }

            function fetchProducts() {
                var deferred = $q.defer();
                ngProgressBarService.showProgressbar();
                var params = {
                    page_number: $scope.pageSettings.currentPage,
                    items_per_page: $scope.isMobile ? 18 : 24,
                    is_active: 1,
                    responded: 1,
                    store_url: $routeParams.storeUrl
                };

                APIService.apiCall("GET", APIService.getAPIUrl('buyerProducts'), null, params)
                .then(function(response) {
                    ngProgressBarService.endProgressbar();
                    deferred.resolve(response);
                }, function(error) {
                    ngProgressBarService.endProgressbar();
                    deferred.reject(error);
                    $location.url('/');
                });

                return deferred.promise;
            }

            function getProductsInCart() {
                var deferred = $q.defer();
                APIService.apiCall("GET", APIService.getAPIUrl('cartItem')).then(function(response) {
                    deferred.resolve(response.cart_items);
                }, function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }

            function parseCartItems(items) {
                var cartItems = {};
                angular.forEach(items, function(value, key) {
                    cartItems[value.product.productID] = value.lots;
                });
                return cartItems;
            }

            function fetchProductsParser(response, cartItems, storeUrl) {
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
                    parseProducts(response.buyer_products, cartItems, storeUrl);
                    $scope.products = response.buyer_products;
                } else {
                    $scope.pageSettings.enablePagination = false;
                    $scope.noProducts = true;
                }
            }

            function init() {
                var promises = [], cartItems = {};
                $scope.isMobile = UtilService.isMobileRequest();
                promises.push(getStoreDetails($routeParams.storeUrl));

                var url = $location.url();

                if($routeParams.productUrl) {
                    $scope.storePage = true;
                    var productID = UtilService.getIDFromSlug($routeParams.productUrl);
                    promises.push(fetchProductByID(productID));
                } else if(url.indexOf('/products') >= 0) {
                    $scope.pageSettings.currentPage = UtilService.getPageNumber();
                    promises.push(fetchProducts());

                    $q.all(promises).then(function(response) {
                        fetchProductsParser(response[1]);
                    });
                } else if(url.indexOf('/account/my-store') >= 0) {
                    $scope.pageSettings.currentPage = UtilService.getPageNumber();
                    promises.push(getProductsInCart());
                    promises.push(fetchProducts());

                    $q.all(promises).then(function(response) {
                        cartItems = parseCartItems(response[1]);
                        fetchProductsParser(response[2], cartItems, true);
                    });
                }
            }
            init();

            $scope.placeOrder = function(event, product) {
                return $mdDialog.show({
                    controller: 'PlaceOrderPopupController',
                    templateUrl: 'views/store/placeOrder.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: $mdMedia('xs'),
                    locals: {
                        product: product,
                    }
                });
            };

            $scope.openDiscountPopup = function(event) {
                return $mdDialog.show({
                    controller: 'StoreDiscountPopupController',
                    templateUrl: 'views/partials/storeDiscountPopup.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: $mdMedia('xs'),
                    locals: {
                        store: $scope.store,
                    }
                }).then(function(discount) {
                    $scope.store.store_global_discount = discount;
                    $route.reload();
                });
            };
        }
    ]);
})();
