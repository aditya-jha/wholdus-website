(function() {
    webapp.controller('OrdersController', [
        '$scope',
        '$log',
        'APIService',
        'UtilService',
        function($scope, $log, APIService, UtilService) {

            $scope.orders = [];

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
                APIService.apiCall("GET", APIService.getAPIUrl('orders'))
                .then(function(response) {
                    $log.log(response);
                    parseOrders(response.orders);
                    $scope.orders = response.orders;
                }, function(error) {
                    $log.log(error);
                });
            }

            fetchOrders();
        }
    ]);
})();
