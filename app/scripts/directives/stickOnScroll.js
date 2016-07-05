(function() {
    'use strict';

webapp.directive("scroll", function ($window) {
      return function(scope, element, attrs) {
          element.on("scroll", function() {
               if (this.scrollTop >= 100) {
                   scope.boolChangeClass = true;
                   console.log('Scrolled below header.');
               } else {
                   scope.boolChangeClass = false;
                   console.log('Header is in view.');
               }
              scope.$apply(); // Prefer scope.$digest()!
          });
        
        scope.$on('$destroy', function () {
          element.off('scroll');
        });
      };
  });
})();