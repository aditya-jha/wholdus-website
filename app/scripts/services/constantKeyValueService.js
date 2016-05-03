(function() {
    "use strict";
    webapp.factory("ConstantKeyValueService", [
        function() {
            var factory = {
                token: '',
                apiBaseUrl: 'http://api.probzip.com/',
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
                    sellerLogin: 'users/seller/login',
                    category: 'category',
                    buyerLeads: 'leads/buyer'
                },
                accessTokenKey: 'randomData',
                sellerSuccessSignup: "Your application has been sent for approval. You will soon be contacted by our executive",
                hideProductMessage: 'This product has now been hidden from the online store',
                showProductMessage: 'The product will go live on the website once the changes have been verified',
                noProductsMessage: 'Upload products and start distribution',
                deleteProductMessage: 'This product has successfully been deleted',
                sellerSignup: [
                    {
                        label: 'Personal Details',
                        formItems: {
                            name: {
                                label: 'Full Name',
                                type: 'text',
                                required: true,
                                value: ''
                            },
                            email: {
                                label: 'Email ID',
                                type: 'email',
                                required: true,
                                value: ''
                            },
                            mobile_number: {
                                label: 'Mobile No.',
                                type: 'number',
                                required: true,
                                value: ''
                            },
                            alternate_phone_number: {
                                label: 'Alt. Phone No.',
                                type: 'text',
                                required: false,
                                value: ''
                            },
                            password: {
                                label: 'Password',
                                type: 'password',
                                required: true,
                                value: ''
                            }
                        }
                    },
                    {
                        label: 'Company Details',
                        formItems: {
                            company_name: {
                                label: 'Store/Company Name',
                                type: 'text',
                                required: true,
                                value: '',
                            },
                            company_profile: {
                                label: 'Company Profile',
                                type: 'textarea',
                                required: true,
                                value: '',
                            },
                            pan: {
                                label: 'PAN',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            name_on_pan: {
                                label: 'Nam on PAN',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            dob_on_pan: {
                                label: 'DOB on pan',
                                type: 'date',
                                required: false,
                                value: '',
                            },
                            vat_tin: {
                                label: 'VAT / TINs',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            cst: {
                                label: 'CST',
                                type: 'text',
                                required: false,
                                value: '',
                            }
                        }
                    },
                    {
                        label: 'Pickup Address',
                        formItems: {
                            address: {
                                label: 'Address',
                                type: 'textarea',
                                required: false,
                                value: '',
                            },
                            pincode: {
                                label: 'Pincode',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            landmark: {
                                label: 'Landmark',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            state: {
                                label: 'State',
                                type: 'text',
                                required: false,
                                value: '',
                            },
                            city: {
                                label: 'City',
                                type: 'text',
                                required: false,
                                value: '',
                            }
                        }
                    },
                    {
                        label: 'Bank Account Details',
                        formItems: {
                            account_holders_name: {
                                label: "Account Holders Name",
                                type: 'text',
                                required: true,
                                value: ''
                            },
                            account_number: {
                                label: "Account Number",
                                type: 'text',
                                required: true,
                                value: ''
                            },
                            bank_name: {
                                label: "Bank Name",
                                type: 'text',
                                required: true,
                                value: ''
                            },
                            branch_name: {
                                label: "Bank Branch",
                                type: 'text',
                                required: true,
                                value: ''
                            },
                            branch_pincode: {
                                label: "branch pincode",
                                type: 'text',
                                required: true,
                                value: ''
                            },
                            ifsc: {
                                label: "IFSC",
                                type: 'text',
                                required: true,
                                value: ''
                            },
                            branch_city: {
                                label: "Branch City",
                                type: 'text',
                                required: true,
                                value: ''
                            }
                        }
                    }
                ]
            };

            factory.getSellerSignupFormItems = function() {
                return angular.copy(factory.sellerSignup);
            };

            return factory;
        }
    ]);
})();
