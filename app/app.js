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
    '$compileProvider',
     function($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, localStorageServiceProvider, $compileProvider) {

         $compileProvider.debugInfoEnabled(false);
         $compileProvider.aHrefSanitizationWhitelist(/^\s*(http?|https?|local|data|chrome-extension|whatsapp|mailto|tel):/);

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
         }).when('/privacy-policy', {
             templateUrl: "views/privacy-policy.html",
             controller: "StaticPagesController"
         }).when('/demo', {
             templateUrl: "views/demopage.html",
             controller: "StaticPagesController",
         }).when('/account/orders', {
             templateUrl: 'views/account/orders.html',
             controller: 'OrdersController'
         }).when('/account/profile', {
             templateUrl: 'views/account/profile.html',
             controller: 'ProfileController'
         }).when('/account/my-store', {
             templateUrl: 'views/account/store.html',
             controller: 'StoreHomeController'
         }).when('/account/purchase-requests', {
             templateUrl: 'views/account/purchaseRequests.html',
             controller: 'PurchaseRequestsController'
         }).when('/account/hand-picked-products', {
             templateUrl: 'views/account/feed.html',
             controller: 'FeedController',
             reloadOnSearch: false
         }).when('/store/:storeUrl', {
             templateUrl: 'views/store/homepage.html',
             controller: 'StoreHomeController'
         }).when('/store/:storeUrl/products', {
             templateUrl: 'views/store/allProducts.html',
             controller: 'StoreHomeController'
         }).when('/store/:storeUrl/:productUrl', {
             templateUrl: 'views/productpage.html',
             controller: 'StoreHomeController'
         }).when('/blog', {
             template: '<div></div>',
             controller: 'RedirectController'
         }).when('/blog/:article', {
             templateUrl: 'views/blog/blogPage.html',
             controller: 'BlogController'
         }).when('/bp', {
             template: '<div></div>',
             controller: 'RedirectController'
         }).when('/bp/:uniqueUrl', {
             template: '<div></div>',
             controller: 'RedirectController'
         }).when('/consignment', {
             templateUrl: 'views/checkout/consignment.html',
             controller: 'ConsignmentController',
             reloadOnSearch: false
         }).when('/:category', {
             templateUrl: "views/categorypage.html",
             controller: "CategoryController",
             reloadOnSearch: false
         }).when('/:category/:product', {
             templateUrl: "views/productpage.html",
             controller: "ProductController"
         });

         $routeProvider.otherwise('/');
         $locationProvider.html5Mode(true);

         $mdThemingProvider.theme('default')
                         .primaryPalette('deep-purple')
                         .accentPalette('deep-orange');

         localStorageServiceProvider.setPrefix('probzip-webapp');

    }
]);
