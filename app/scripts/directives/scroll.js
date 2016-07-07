(function() {
    'use strict';

webapp.directive('scroll', function ($window) {
    var $win = angular.element($window); // wrap window object as jQuery object

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var topClass = attrs.scroll, // get CSS class from directive's attribute value
                // offsetTop = element.offset().top;
                offsetTop = 120; // get element's top relative to the document

            $win.on('scroll', function (e) {
                console.log('scroll');
                if ($win.scrollTop() >= offsetTop) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
})
})();