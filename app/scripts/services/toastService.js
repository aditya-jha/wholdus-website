(function() {
    'use strict';

    webapp.factory('ToastService', [
        '$rootScope',
        '$mdToast',
        function($rootScope, $mdToast) {
            var factory = {};

            factory.showSimpleToast = function(content, delay) {
                $mdToast.show($mdToast
                    .simple()
                    .textContent(content)
                    .hideDelay(delay)
                );
            };

            factory.showActionToast = function(content, delay) {
               var toast = $mdToast.simple()
                                    .textContent(content)
                                    .action('OK')
                                    .hideDelay(delay)
                                    .highlightAction(true)
                                    .position('bottom left');
               $mdToast.show(toast);
            };

            return factory;
        }
    ]);
})();
