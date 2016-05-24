(function() {
    'use strict';
    webapp.directive('imageOnLoad', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.bind('load', function() {

                    scope.$apply(attrs.imageOnLoad)(true);
                });
                element.bind('error', function(){
                  scope.$apply(attrs.imageOnLoad)(false);
                });
            }
        };
    })
})();