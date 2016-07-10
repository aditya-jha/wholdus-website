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
                    blogarticle: 'blog/articles'
                },
                accessTokenKey: 'randomData',
                sellerSite: 'http://seller.wholdus.com'
            };

            return factory;
        }
    ]);
})();
