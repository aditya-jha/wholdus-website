(function() {
    'use strict';
    webapp.controller('FeedController', [
        '$scope',
        '$log',
        '$location',
        'APIService',
        'ngProgressBarService',
        '$rootScope',
        'UtilService',
        'DialogService',
        'localStorageService',
        'ConstantKeyValueService',
        'LoginService',
        '$timeout',
        '$q',
        function($scope, $log, $location, APIService, ngProgressBarService, $rootScope, UtilService, DialogService, localStorageService, ConstantKeyValueService, LoginService, $timeout, $q) {
            var listeners = [];
            var bpStatusApi = null;
            var instructionsPopup = {};

            $scope.pageSettings = {
                filter: '',
                productIndex: 0,
                totalPages: 0,
                currentPage: UtilService.getPageNumber(),
                responded: 0,
                buyer: LoginService.getBuyerInfo(),
                enablePagination: false
            };
            $scope.instructNavPattern = 0;

            function togglePullRefresh(disable) {
                var ref = angular.element(document.querySelector('body'));
                if(disable) {
                    ref.css('overflow-y', 'hidden');
                } else {
                    ref.css('overflow-y', '');
                }
            }
            togglePullRefresh(1);

            function getInstructionsPopup() {
                instructionsPopup = localStorageService.get($scope.pageSettings.buyer.id) || {};
            }
            getInstructionsPopup();

            function setInstructionsPopup() {
                localStorageService.set($scope.pageSettings.buyer.id, instructionsPopup);
            }

            function openInstructionsPopup() {
                if(!instructionsPopup.instructions) {
                    DialogService.viewDialog(null, {
                        view: 'views/partials/bpInstructions.html'
                    }, true).finally(function() {
                        var data = {
                            buyerID: $scope.pageSettings.buyer.id,
                            page_closed: $scope.instructNavPattern
                        };
                        APIService.apiCall("POST", APIService.getAPIUrl('instructTrack'), data);
                    });
                    instructionsPopup.instructions = true;
                    setInstructionsPopup();
                }
            }
            openInstructionsPopup();

            function parseSearchParams() {
                $scope.noProducts = false;
                var search = $location.search();
                if(search.filter) {
                    $scope.pageSettings.filter = search.filter;
                    if(search.filter == 'favorite') {
                        $rootScope.$broadcast('showFeedActionButton', false);
                        $scope.pageSettings.responded = 1;
                    }
                    else if(search.filter == 'dislikes') {
                        $rootScope.$broadcast('showFeedActionButton', false);
                        $scope.pageSettings.responded = 2;
                    }
                    else {
                        $location.url('/account/hand-picked-products');
                    }
                } else {
                    $scope.pageSettings.responded = 0;
                }
                if(search.buyerproductID) {
                    $scope.buyerproductID = search.buyerproductID;
                } else {
                    $scope.buyerproductID = null;
                }
            }

            function setProductToShow(index) {
                if(index <= $scope.products.length) {
                    $scope.products[index].product.images = UtilService.getImages($scope.products[index].product);
                    if($scope.products[index].product.images.length) {
                        $scope.products[index].product.imageUrl = UtilService.getImageUrl($scope.products[index].product.images[0], '400x400');
                    }
                    $scope.productToShow = $scope.products[index].product;
                    $rootScope.$broadcast('showFeedActionButton', $scope.productToShow);
                }
            }

            function parseProducts(obj, cartItems) {
                angular.forEach(obj, function(value, key) {
                    value.product.lotsInCart = cartItems[value.product.productID] ? cartItems[value.product.productID] : 0;
                    value.product.images = UtilService.getImages(value.product);
                    if(value.product.images.length) {
                        value.product.imageUrl = UtilService.getImageUrl(value.product.images[0], '300x300');
                    }
                });
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

            function fetchProducts() {
                var deferred = $q.defer(), url = 'buyerProducts';
                ngProgressBarService.showProgressbar();
                var params = {
                    page_number: $scope.pageSettings.currentPage,
                    items_per_page: 18,
                    is_active: 1,
                    responded: $scope.pageSettings.responded,
                };
                if($scope.buyerproductID) {
                    params.buyerproductID = $scope.buyerproductID;
                    params.landing = 1;
                }
                if($scope.pageSettings.responded === 0) {
                    url = 'allBuyerProducts';
                }
                APIService.apiCall("GET", APIService.getAPIUrl(url), null, params)
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

            function init() {
                $scope.products = [];
                $scope.productToShow = null;
                $scope.productLikeStatus = 0;
                $scope.pageSettings.currentPage = UtilService.getPageNumber();
                parseSearchParams();

                var promises = [], cartItems = {}, loggedIn = false;

                if(LoginService.checkLoggedIn()) {
                    loggedIn = true;
                    promises.push(getProductsInCart());
                }
                promises.push(fetchProducts());

                $q.all(promises).then(function(response) {
                    if(loggedIn) {
                        cartItems = parseCartItems(response[0]);
                        response = response[1];
                    } else {
                        response = response[0];
                    }

                    $scope.pageSettings.totalPages = response.total_pages;

                    if(response.buyer_products.length) {
                        $scope.noProducts = false;
                        if($scope.pageSettings.responded === 0) {
                            $scope.products = response.buyer_products;
                            setProductToShow($scope.pageSettings.productIndex);
                        } else {
                            if(response.total_pages > 1) {
                                $scope.pageSettings.enablePagination = true;
                                $rootScope.$broadcast('setPage', {
                                    page: $scope.pageSettings.currentPage,
                                    totalPages: response.total_pages
                                });
                            } else {
                                $scope.pageSettings.enablePagination = false;
                            }
                            parseProducts(response.buyer_products, cartItems);
                            $scope.products = response.buyer_products;
                        }
                    } else {
                        $scope.pageSettings.enablePagination = false;
                        $scope.noProducts = true;
                        $rootScope.$broadcast('showFeedActionButton', false);
                    }
                });
            }
            init();

            var favUrlListener = $scope.$on('favUrl', function(event, data) {
                init();
            });
            listeners.push(favUrlListener);

            var locationChangeListener = $scope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
                if(newUrl.indexOf('hand-picked') > -1) {
                    init();
                } else {
                    $rootScope.$broadcast('showFeedActionButton', false);
                }
            });
            listeners.push(locationChangeListener);

            var feedActionButtonClickedListener = $scope.$on('feedActionButtonClicked', function(event, data) {
                $scope.favButton(event, data);
            });
            listeners.push(feedActionButtonClickedListener);

            var instructNavPatternListener = $rootScope.$on('instructNavPattern', function(event, data) {
                $scope.instructNavPattern += (',' + data);
            });
            listeners.push(instructNavPatternListener);

            $scope.showFilledStatus = function(index) {
                if(index) $scope.showFilled = true;
                else $scope.showFilled = false;
            };

            function favButtonHelper(type, swiped) {
                bpStatusApi = APIService.apiCall("PUT", APIService.getAPIUrl("buyerProducts"), {
                    //buyerproductID: $scope.products[$scope.pageSettings.productIndex].buyerproductID,
                    buyerID: $scope.pageSettings.buyer.id,
                    productID: $scope.products[$scope.pageSettings.productIndex].product.productID,
                    responded: type === 1 ? 1 : 2,
                    has_swiped: swiped
                });
                bpStatusApi.then(function(response) {
                    bpStatusApi = null;
                }, function(error) {
                    bpStatusApi = null;
                });
                $scope.pageSettings.productIndex += 1;

                if($scope.pageSettings.productIndex < $scope.products.length) {
                    if(type == 1) {
                        $scope.productLikeStatus = 2;
                    } else {
                        $scope.productLikeStatus = 1;
                    }
                    setProductToShow($scope.pageSettings.productIndex);
                } else {
                    if($scope.pageSettings.currentPage < $scope.pageSettings.totalPages) {
                        $scope.pageSettings.currentPage += 1;
                        $scope.pageSettings.productIndex = 0;
                        fetchProducts();
                    } else {
                        if($scope.buyerproductID) {
                            $scope.buyerproductID = null;
                            $location.search('buyerproductID', null);
                            init();
                        } else {
                            $location.search('buyerproductID', null);
                            $scope.noProducts = true;
                            $rootScope.$broadcast('showFeedActionButton', false);
                        }
                    }
                }
            }

            function favButtonPopup(event, type, swiped) {
                DialogService.viewDialog(event, {
                    type: type,
                    view: 'views/partials/favButtonFeeback.html'
                }, true).finally(function() {
                    favButtonHelper(type, swiped);
                });
            }

            $scope.favButton = function(event, type, swiped) {
                if($scope.pageSettings.productIndex < $scope.products.length) {
                    if(!bpStatusApi) {
                        if(type == 1 && !instructionsPopup.fav) {
                            favButtonPopup(event, type, swiped);
                            instructionsPopup.fav = true;
                            setInstructionsPopup();
                        } else if(type == -1 && !instructionsPopup.dislike) {
                            favButtonPopup(event, type, swiped);
                            instructionsPopup.dislike = true;
                            setInstructionsPopup();
                        } else {
                            favButtonHelper(type, swiped);
                        }
                    }
                } else {
                    $scope.noProducts = true;
                    $rootScope.$broadcast('showFeedActionButton', false);
                }
            };

             $scope.imageLoaded = function(){
                $scope.productLikeStatus = 0;
            };

            $scope.$on('$destroy', function() {
                angular.forEach(listeners, function(value) {
                    if(value) value();
                });
            });

            $scope.$on('$destroy', function(event) {
                angular.forEach(listeners, function(v,k) {
                    if(v) v();
                });
                togglePullRefresh();
            });
        }
    ]);
})();
