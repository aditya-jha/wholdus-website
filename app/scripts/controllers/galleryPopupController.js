(function() {
    webapp.controller('GalleryPopupController' , [
        '$scope',
        '$log',
        '$mdDialog',
        'UtilService',
        function($scope, $log, $mdDialog, UtilService) {
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
        }
    ]);
})();
