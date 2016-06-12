(function() {
    'use strict';

    webapp.factory('DialogService', [
        '$mdMedia',
        '$mdDialog',
        function($mdMedia, $mdDialog) {
        	var factory = {};

            factory.viewDialog = function(event, data) {
                var useFullScreen = $mdMedia('xs');
                $mdDialog.show({
                    controller: 'buyNowController',
                    templateUrl: 'views/partials/buyNow.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen,
                    locals: {
                        productID: data && data.productID? data.productID : null,
                        categoryID: data && data.categoryID ? data.categoryID : null
                    }
                });
            };

            return factory;
        }
    ]);
})();
