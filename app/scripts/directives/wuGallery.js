(function() {
    webapp.directive('wuGallery', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuGallery.html',
            scope: {
                image: '='
            },
            controller: [
                '$scope',
                '$log',
                'ConstantKeyValueService',
                'UtilService',
                '$element',
                '$mdDialog',
                '$mdMedia',
                function($scope, $log, ConstantKeyValueService, UtilService, $element, $mdDialog, $mdMedia) {

                    var baseUrl;

                    function setBaseUrl() {
                        return ConstantKeyValueService.apiBaseUrl + $scope.image.image_path;
                    }

                    function getUrl(size, index) {
                        return baseUrl + size + '/' + $scope.image.image_name + '-' + index + '.jpg';
                    }

                    function generateThumbnailUrls(size, image) {
                        var images = [];
                        angular.forEach(image.image_numbers, function(value, key) {
                            images.push(getUrl(size, value));
                        });
                        return images;
                    }

                    function setLimit(total) {
                        if(total <= 6) {
                            return total;
                        } else return 5;
                    }

                    function setActiveImageHelper(ref, index) {
                        angular.forEach(ref, function(value, key) {
                            if(key == index) {
                                value.classList.add('active');
                            } else {
                                value.classList.remove('active');
                            }
                        });
                    }

                    $scope.setActiveImage = function(index, popup) {
                        $scope.activeImage = index;

                        var tbDivs = document.querySelector('.tbImage-container').querySelectorAll('div.thumbnail-image'),
                            mdDivs = document.querySelector('.gallery-image-container').querySelectorAll('.gallery-main');

                        setActiveImageHelper(tbDivs, index);
                        setActiveImageHelper(mdDivs, index);

                        if(popup) {
                            var mainRef = document.querySelector('.gallery-popup-container');
                            mdDivs = mainRef.querySelectorAll('.gallery-main');
                            tbDivs = mainRef.querySelectorAll('.thumbnail-image');

                            setActiveImageHelper(tbDivs, index);
                            setActiveImageHelper(mdDivs, index);
                        }
                    };

                    $scope.openGallery = function(event) {
                        $mdDialog.show({
                            controller: 'GalleryPopupController',
                            templateUrl: 'views/partials/galleryPopup.html',
                            parent: angular.element(document.body),
                            targetEvent: event,
                            clickOutsideToClose: true,
                            fullscreen: true,
                            scope: $scope,
                            preserveScope: true
                        }).finally(function() {
                            if($scope.activeImage >= $scope.imageLimit) {
                                $scope.setActiveImage(0);
                            }
                        });
                    };

                    function init() {
                        $scope.activeImage = 0;
                        $scope.isMobile = UtilService.isMobileRequest();
                        $scope.imageLimit = setLimit($scope.image.image_count);
                        baseUrl = setBaseUrl();
                        $scope.tbImage = generateThumbnailUrls('100x100', $scope.image);
                        $scope.mdImage = generateThumbnailUrls('400x400', $scope.image);
                        $scope.lgImage = generateThumbnailUrls('700x700', $scope.image);
                    }
                    init();
                }
            ]
        };
    });
})();
