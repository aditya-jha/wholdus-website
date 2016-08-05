(function() {
    "use strict";
    webapp.factory("ConstantKeyValueService", [
        function() {
            var factory = {
                token: '',
                apiBaseUrl: 'http://api-test.wholdus.com/',
                apiUrl: {
                    login: 'admin/login',
                    internalUsers: 'users/internal-users',
                    users: 'users',
                    buyers: 'users/buyer',
                    sellers: 'users/seller',
                    orders: 'orders',
                    shipments: 'shipments',
                    payments: 'payments',
                    products: 'products',
                    buyerLogin: 'users/buyer/login',
                    category: 'category',
                    buyerLeads: 'leads/buyer',
                    contactus: 'leads/contactus',
                    buyerProducts: 'users/buyer/buyerproducts',
                    buyerProductsLanding: 'users/buyer/buyerproducts/landing',
                    blogarticle: 'blog/articles',
                    uniqueAccessToken: 'users/buyer/accesstoken',
                    colour_type:'products/colour_type',
                    fabric_type:'products/fabric_type',
                    instructTrack: 'users/buyer/buyerpanel/instructionstracking',
                    cartItem: 'cart/item'
                },
                accessTokenKey: 'randomData',
                buyerDetailKey: 'buyerDetails',
                bpInstructionsPopup: 'bpInstructionsPopup',
                favInstruct: 'favInstruct',
                sellerSite: 'http://seller.wholdus.com',
                cartTrack: {
                    added_from: {
                        category_page: 0,
                        product_page: 1,
                        shortlist: 2,
                        homepage: 3
                    }
                }
            };

            return factory;
        }
    ]);
})();
