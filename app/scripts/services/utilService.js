(function() {
    "use strict";

    webapp.factory('UtilService', [
        '$rootScope',
        '$log',
        '$location',
        'ConstantKeyValueService',
        function($rootScope, $log, $location, ConstantKeyValueService) {
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
