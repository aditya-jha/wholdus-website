(function() {
    'use strict';

    webapp.factory('DialogService', [
        '$mdMedia',
        '$mdDialog',
        function($mdMedia, $mdDialog) {
        	var factory = {};

            function getLocals(data) {
                var locals = {};
                locals.categoryID = data ? data.categoryID : null;
                locals.productID = data ? data.productID : null;
                locals.likeDislikeStatus = data ? data.type : null;

                return locals;
            }

            factory.viewDialog = function(event, data, noFullScreen) {
                var useFullScreen = noFullScreen ? null : $mdMedia('xs');
                return $mdDialog.show({
                    controller: data.controller ? data.controller : 'PopupController',
                    templateUrl: data.view,
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: getLocals(data)
                });
            };

            return factory;
        }
    ]);
})();
