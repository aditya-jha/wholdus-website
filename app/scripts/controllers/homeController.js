(function() {
    'use strict';
    webapp.controller('HomeController', [
        '$scope',
        '$rootScope',
        '$log',
        function($scope, $rootScope, $log) {
            $log.log("home controller loaded");
        }
    ]);
})();
