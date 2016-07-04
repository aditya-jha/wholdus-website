(function() {
    webapp.controller('BlogController', [
        '$scope',
        '$log',
        '$routeParams',
        function($scope, $log, $routeParams) {
            $log.log($routeParams);
        }
    ]);
})();
