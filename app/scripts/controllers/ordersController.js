(function() {
    webapp.controller('OrdersController', [
        '$scope',
        '$log',
        'APIService',
        'UtilService',
        'ngProgressBarService',
        '$rootScope',
        function($scope, $log, APIService, UtilService, ngProgressBarService, $rootScope) {

            $scope.orders = [];
            $scope.noOrders = false;

            function parseOrders(orders) {
                angular.forEach(orders, function(order, orderKey) {
                    angular.forEach(order.sub_orders, function(subOrder, subOrderKey) {
                        angular.forEach(subOrder.order_items, function(orderItem, orderItemKey) {
                            var images = UtilService.getImages(orderItem.product);
                            if(images.length) {
                                orderItem.product.imageUrl = UtilService.getImageUrl(images[0], '200x200');
                            }
                        });
                    });
                });
            }

            function fetchOrders() {
                $rootScope.$broadcast('showProgressbar');
                APIService.apiCall("GET", APIService.getAPIUrl('orders'))
                .then(function(response) {
                    parseOrders(response.orders);
                    $scope.orders = response.orders;
                    if($scope.orders.length === 0) {
                        $scope.noOrders = true;
                    }
                    $rootScope.$broadcast('endProgressbar');
                }, function(error) {
                    $rootScope.$broadcast('endProgressbar');
                });
            }

            fetchOrders();
        }
    ]);
})();
