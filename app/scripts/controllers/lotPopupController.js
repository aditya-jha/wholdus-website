(function() {
    webapp.controller('LotPopupController', [
        '$scope',
        '$log',
        '$mdDialog',
        'product',
        'lots',
        function($scope, $log, $mdDialog, product, lots) {

            var minLots;

            function setActiveLot(lots) {
                var activeLot = -1;
                if(lots < minLots) return 0;
                angular.forEach(product.product_lot, function(pl, key) {
                    if(lots>=pl.lot_size_from && lots<=pl.lot_size_to) {
                        activeLot = key;
                    }
                });
                return activeLot === -1 ? product.product_lot.length-1 : activeLot;
            }

            function setDetails(lots) {
                var activeLot = setActiveLot(lots);
                var details = {
                    lots: lots < minLots ? minLots : lots,
                    tp: product.product_lot[activeLot].price_per_unit*lots,
                    pieces: lots*product.lot_size,
                    activeLot: activeLot,
                    ppp: product.product_lot[activeLot].price_per_unit
                };
                $scope.details = details;
            }

            function init() {
                minLots = parseInt(product.product_lot[0].lot_size_from);
                $scope.product = product;
                setDetails(lots);
            }

            $scope.modifyLots = function(by) {
                lots += by;
                if(lots < minLots) lots = minLots;
                setDetails(lots);
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.done = function() {
                $mdDialog.hide(lots);
            };

            init();
        }
    ]);
})();
