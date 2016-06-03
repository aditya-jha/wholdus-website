(function() {
    'use strict';

    webapp.factory('DialogService', [
        '$mdMedia',
        '$mdDialog',
        function($mdMedia, $mdDialog) {
        	var factory = {};

            factory.viewDialog = function(event, productID) {
                var useFullScreen = $mdMedia('xs');
                $mdDialog.show({
                    controller: 'buyNowController',
                    templateUrl: 'views/partials/buyNow.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen,
                    locals: {
                        productID: productID
                    }
                });
            };

            return factory;
        }
    ]);
})();
