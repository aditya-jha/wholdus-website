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

            factory.alert = function(event, title, content, buttonText) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('body')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(content)
                    .ariaLabel('Alert Dialog')
                    .ok(buttonText)
                    .targetEvent(event)
                );
            };

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
