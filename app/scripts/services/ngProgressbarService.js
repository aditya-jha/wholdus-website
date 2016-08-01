(function() {
    "use strict";

    webapp.factory("ngProgressBarService", [
        '$rootScope',
        'ngProgressFactory',
        '$timeout',
        function($rootScope, ngProgressFactory, $timeout) {
            var factory = {};
            var progressbar, element;

            var init = function() {
                progressbar = ngProgressFactory.createInstance();
                progressbar.setColor('red');
                progressbar.setHeight('3px');
                element = document.getElementById("progressBar");
                progressbar.setParent(element);
                element.style.display = 'none';
            };
            init();

            factory.showProgressbar = function() {
                element.style.display = 'block';
                progressbar.start();
            };

            factory.endProgressbar = function() {
                progressbar.complete();
                $timeout(function() {
                    element.style.display = 'none';
                }, 500);
            };
            
            return factory;
        }
    ]);
})();
