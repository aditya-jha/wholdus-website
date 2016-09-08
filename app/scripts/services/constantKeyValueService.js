(function() {
    "use strict";
    webapp.factory("ConstantKeyValueService", [
        function() {
            var factory = {
                token: '',
                apiBaseUrl: 'http://api.wholdus.com/',
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
                    cartItem: 'cart/item',
                    cart: 'cart',
                    pincodeserviceability: 'logistics/pincodeserviceability',
                    checkout: 'checkout',
                    paymentMethods: 'checkout/paymentmethod'
                },
                accessTokenKey: 'randomData',
                buyerDetailKey: 'buyerDetails',
                bpInstructionsPopup: 'bpInstructionsPopup',
                favInstruct: 'favInstruct',
                sellerSite: 'http://seller.wholdus.com',
                cartTrack: {
                    added_from: {
                        tinder: 0,
                        category_page: 1,
                        product_page: 2,
                        shortlist: 3,
                        homepage: 4,
                        dislike: 5
                    }
                }
            };

            return factory;
        }
    ]);
})();
