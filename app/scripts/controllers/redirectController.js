(function() {
    webapp.controller('RedirectController', [
        '$scope',
        '$log',
        '$location',
        '$routeParams',
        'APIService',
        'LoginService',
        function($scope, $log, $location, $routeParams, APIService, LoginService) {

            function setCorrectPage(uniqueUrl, buyerProductID) {
                var params = {
                    buyer_panel_url: uniqueUrl
                };
                APIService.apiCall('GET', APIService.getAPIUrl('uniqueAccessToken'), null, params)
                .then(function(response) {
                    LoginService.setAccessToken(response);
                    var url = '/account/hand-picked-products?buyerproductID=' + buyerProductID;
                    $location.url(url);
                }, function(error) {
                    $log.log(error);
                });
                APIService.apiCall('POST', APIService.getAPIUrl('buyerProductsLanding'), {"buyerproductID":buyerproductID})
                .then(function(response) {
                    $log.log(response);
                }, function(error) {
                    $log.log(error);
                });
            }

            if($routeParams.uniqueUrl) {
                var uniqueUrl = $routeParams.uniqueUrl.split('-');
                if(uniqueUrl.length == 3) {
                    buyerproductID = uniqueUrl[2];
                    buyer_panel_url = uniqueUrl[0] + '-' + uniqueUrl[1];
                    setCorrectPage(buyer_panel_url, buyerproductID);
                } else {
                    $location.url('/account/hand-picked-products');
                }
            } else {
                var url = $location.url();
                if(url.indexOf('blog') >= 0) {
                    $location.url('/blog/home');
                } else if(url.indexOf('bp') >= 0) {
                    $location.url('/account/hand-picked-products');
                }
            }

        }
    ]);
})();
