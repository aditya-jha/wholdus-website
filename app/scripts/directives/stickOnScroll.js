(function() {
    'use strict';

webapp.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
            // console.log('scroll in action');
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 100) {
                 scope.boolChangeClass = true;
                 console.log('Scrolled below header.');
             } else {
                 scope.boolChangeClass = false;
                 console.log('Header is in view.');
             }
            scope.$apply();
        });
    };
});
})();