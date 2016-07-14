(function() {
    'use strict';
    webapp.directive('imageOnLoad', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.addClass("ng-hide-remove");

                element.bind('load', function() {
                    scope.$apply(attrs.imageOnLoad);
                    element.addClass("ng-hide-add");
                });

                element.bind('error', function(){

                });
            },
        };
    });
})();
