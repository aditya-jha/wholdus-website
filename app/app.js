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
        }).when('/404', {
            templateUrl: 'views/404.html',
            controller: "StaticPagesController"
        }).when('/aboutus', {
            templateUrl: "views/aboutus.html",
            controller: "StaticPagesController"
        }).when('/contactus', {
            templateUrl: "views/contactus.html",
            controller: "StaticPagesController"
        }).when('/faq',{
            templateUrl: "views/faq.html",
            controller: "StaticPagesController"
        }).when('/return-refund-policy', {
            templateUrl: "views/returnRefund.html",
            controller: "StaticPagesController"
        }).when('/we-are-social', {
            templateUrl: "views/we-are-social.html",
            controller: "StaticPagesController",
        }).when('/account/orders', {
            templateUrl: 'views/account/orders.html',
            controller: 'OrdersController'
        }).when('/account/profile', {
            templateUrl: 'views/account/profile.html',
            controller: 'ProfileController'
        }).when('/account/hand-picked-products', {
            templateUrl: 'views/account/feed.html',
            controller: 'FeedController',
            reloadOnSearch: false
        }).when('/:category', {
            templateUrl: "views/categorypage.html",
            controller: "CategoryController",
        }).when('/:category/:product', {
            templateUrl: "views/productpage.html",
            controller: "ProductController"
        });

        $locationProvider.html5Mode(true);

        $mdThemingProvider.theme('default')
                        .primaryPalette('deep-purple')
                        .accentPalette('deep-orange');

        localStorageServiceProvider.setPrefix('probzip-webapp');
    }
]);
