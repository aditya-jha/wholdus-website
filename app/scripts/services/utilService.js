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

            factory.getImageUrl = function(item) {
                var images = [];
                var imageNumbers = JSON.parse(item.image_numbers);
                var imagePath = item.image_path;

                return images;
            };
            return factory;
        }
    ]);
})();
