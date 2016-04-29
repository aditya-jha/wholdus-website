var webapp = angular.module('webapp', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'ngProgress',
    'LocalStorageModule'
]);

webapp.config([
    '$routeProvider',
    '$locationProvider',
    '$mdThemingProvider',
    '$mdIconProvider',
    'localStorageServiceProvider',
    function($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, localStorageServiceProvider) {

        $routeProvider.when('/', {
            templateUrl: "views/homepage.html",
            controller: "HomeController"
        }).when('/:category', {
            templateUrl: "views/categorypage.html",
            controller: "CategoryController"
        });

        $locationProvider.html5Mode(true);

        $mdIconProvider.defaultIconSet('./images/icons.svg', 128);

        localStorageServiceProvider.setPrefix('probzip-webapp');
    }
]);
