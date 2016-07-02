(function() {
    "use strict";

    webapp.factory('UtilService', [
        '$rootScope',
        '$log',
        '$location',
        'ConstantKeyValueService',
        '$window',
        function($rootScope, $log, $location, ConstantKeyValueService, $window) {
            var factory = {};

            factory.getIDFromSlug = function(slug) {
                slug = slug.split('-');
                if(slug.length > 0) {
                    var id = parseInt(slug[slug.length-1]);
                    if(isNaN(id)) {
                        factory.redirectTo('/404');
                    }
                    return id;
                }
            };

            factory.getPageNumber = function() {
                var search = $location.search();
                if(search.page) {
                    return search.page;
                } else {
                    return 1;
                }
            };

            factory.isMobileRequest = function() {
                var userAgent = $window.navigator.userAgent;
                if(userAgent.match(/mobile/i)) {
                    return true;
                }
                return false;
            };

            factory.setPaginationParams = function(obj, page, items) {
                obj.page_number = page;
                obj.items_per_page = items;
            };

            factory.redirectTo = function(to) {
                $location.url(to);
            };

            factory.getImageUrl = function(image, size) {
                return image.base + size + '/' + image.end;
            };

            factory.getImages = function(item) {
                var image = item.image;
                if(image.image_count) {
                    var images = [];
                    var imageNumbers = image.image_numbers;
                    var imagePath = image.image_path;
                    if(imagePath.indexOf('static/') === 0) {
                        imagePath = imagePath.substr(7);
                    }
                    angular.forEach(image.image_numbers, function(value, key) {
                        var base = ConstantKeyValueService.apiBaseUrl + imagePath;
                        var end = image.image_name + '-' + value + '.jpg';
                        images.push({base:base, end:end});
                    });
                    return images;
                }
                return [];
            };

            factory.getNameFromSlug = function(slug) {
                slug = slug.split('-');
                slug.splice(slug.length-1, 1);
                var name = slug.join(' ');
                return name;
            };
             factory.sellerString='';
             factory.maxPrice=5000;
             factory.minPrice=0;
             
            factory.setFilterParams = function(sellerString,minPrice,maxPrice) {
                 factory.minPrice=minPrice;
                factory.maxPrice=maxPrice;
                factory.sellerString=sellerString;
            };
            factory.currentCategoryID=null;
             factory.setCategory = function(categoryID) {
                factory.currentCategoryID=categoryID;
            };
       

            return factory;
        }
    ]);
})();
