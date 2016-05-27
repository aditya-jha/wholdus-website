(function() {
    webapp.directive("wuScript", function() {
        return {
            restrict: 'AE',
            scope: false,
            link: function(scope, elem, attr) {
                if (attr.type === 'text/javascript-lazy') {
                    var code = elem.text();
                    var f = new Function(code);
                    f();
                }
            }
        };
    });
})();
