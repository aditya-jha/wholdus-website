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
        function($scope, $log, $location, APIService, ngProgressBarService, $rootScope, UtilService, DialogService, localStorageService, ConstantKeyValueService, LoginService) {
            var listeners = [];
            var bpStatusApi = null;
            var instructionsPopup = {};

            $scope.pageSettings = {
                filter: '',
                productIndex: 0,
                totalPages: 0,
                currentPage: 1,
                responded: 0,
                buyer: LoginService.getBuyerInfo()
            };

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
                    }, true);
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

            function parseImages(obj) {
                angular.forEach(obj, function(value, key) {
                    value.product.images = UtilService.getImages(value.product);
                    if(value.product.images.length) {
                        value.product.imageUrl = UtilService.getImageUrl(value.product.images[0], '200x200');
                    }
                });
            }

            function fetchProducts() {
                $rootScope.$broadcast('showProgressbar');
                var params = {
                    page_number: $scope.pageSettings.currentPage,
                    items_per_page: 20,
                    is_active: 1,
                    responded: $scope.pageSettings.responded,
                };
                if($scope.buyerproductID) {
                    params.buyerproductID = $scope.buyerproductID;
                    params.landing = 1;
                }

                APIService.apiCall("GET", APIService.getAPIUrl('buyerProducts'), null, params)
                .then(function(response) {
                    $rootScope.$broadcast('endProgressbar');
                    $scope.pageSettings.totalPages = response.total_pages;

                    if(response.buyer_products.length) {
                        $scope.noProducts = false;
                        if($scope.pageSettings.responded === 0) {
                            $scope.products = response.buyer_products;
                            setProductToShow($scope.pageSettings.productIndex);
                        } else {
                            parseImages(response.buyer_products);
                            $scope.products = response.buyer_products;
                        }
                    } else {
                        $scope.noProducts = true;
                        $rootScope.$broadcast('showFeedActionButton', false);
                    }
                }, function(error) {
                    $location.url('/');
                });
            }

            function init() {
                $scope.products = [];
                $scope.productToShow = null;
                $scope.productLikeStatus = 0;
                parseSearchParams();
                fetchProducts();
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

            $scope.showFilledStatus = function(index) {
                if(index) $scope.showFilled = true;
                else $scope.showFilled = false;
            };

            function favButtonHelper(type, swiped) {
                bpStatusApi = APIService.apiCall("PUT", APIService.getAPIUrl("buyerProducts"), {
                    buyerproductID: $scope.products[$scope.pageSettings.productIndex].buyerproductID,
                    responded: type === 1 ? 1 : 2,
                    has_swiped: swiped
                });
                bpStatusApi.then(function(response) {
                    $log.log(response);
                    bpStatusApi = null;
                }, function(error) {
                    $log.log(error);
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

             $scope.imageLoaded= function(){
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
