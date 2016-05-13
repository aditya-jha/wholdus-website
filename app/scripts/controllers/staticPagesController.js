(function() {
    "use strict";
    webapp.controller('StaticPagesController', [
        '$scope',
        '$log',
        function($scope, $log) {

            $scope.contactus = {
                email: "",
                mobile_number: "",
                remarks: ""
            };

            $scope.contactUs = function() {
                if($scope.email && $scope.mobile_number) {
                    
                }
            };
        }
    ]);
})();
