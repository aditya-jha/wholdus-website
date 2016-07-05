(function() {
    "use strict";

    webapp.factory('UtilService', [
        '$rootScope',
        '$log',
        '$location',
        'ConstantKeyValueService',
        '$window',
        function($rootScope, $log, $location, ConstantKeyValueService, $window) {
            var factory = {};
            function initiliseFilters(){
            factory.priceRanges=[
            {id:1,min_value:1, max_value:199, active:false},
            {id:2,min_value:200, max_value:499, active:false},
            {id:3,min_value:500, max_value:799, active:false},
            {id:4,min_value:800, max_value:999, active:false},
            {id:5,min_value:1000, max_value:1499, active:false},
            {id:6,min_value:1500, max_value:1999, active:false},
            {id:7,min_value:2000, max_value:2499, active:false},
            {id:8,min_value:2500, max_value:2999, active:false},
            {id:9,min_value:3000, max_value:10000, active:false},
            ];

             factory.colours=[
             {name:'Red',colourCode:'#ff0000',active:false},
             {name:'Blue',colourCode:'#0000ff',active:false},
             {name:'Parrot',colourCode:'#00ff00',active:false},
             {name:'Green',colourCode:'#008000',active:false},
             {name:'Yellow',colourCode:'#ffff00',active:false},
             {name:'Black',colourCode:'#000000',active:false},
             {name:'White',colourCode:'#ffffff',active:false},
             {name:'Pink',colourCode:'#FF1493',active:false},
             {name:'Beige',colourCode:'#F5F5DC',active:false},
             {name:'Purple',colourCode:'#800080',active:false},
             {name:'Orange',colourCode:'#FFA500',active:false},
             ];

             factory.fabrics=[
             {name:'Cotton',active:false},
             {name:'Silk',active:false},
             {name:'Rayon',active:false},
             {name:'Georgette',active:false},
             {name:'Velvet',active:false},
             {name:'Net',active:false},
             {name:'Brasso',active:false},
             {name:'Chiffon',active:false},
             {name:'Crepe',active:false},
             {name:'Chanderi',active:false},
             {name:'Jacquard',active:false},
             ];

             factory.selectedColours='';
             factory.selectedFabrics='';
            }


            initiliseFilters();
            
            factory.getIDFromSlug = function(slug) {
                slug = slug.split('-');
                if(slug.length > 0) {
                    var id = parseInt(slug[slug.length-1]);
                    if(isNaN(id)) {
                        factory.redirectTo('/404');
                    }
                    return id;
                }
            };

            factory.getPageNumber = function() {
                var search = $location.search();
                if(search.page) {
                    return search.page;
                } else {
                    return 1;
                }
            };

            factory.isMobileRequest = function() {
                var userAgent = $window.navigator.userAgent;
                if(userAgent.match(/mobile/i)) {
                    return true;
                }
                return false;
            };

            factory.setPaginationParams = function(obj, page, items) {
                obj.page_number = page;
                obj.items_per_page = items;
            };

            factory.redirectTo = function(to) {
                $location.url(to);
            };

            factory.getImageUrl = function(image, size) {
                return image.base + size + '/' + image.end;
            };

            factory.getImages = function(item) {
                var image = item.image;
                if(image.image_count) {
                    var images = [];
                    var imageNumbers = image.image_numbers;
                    var imagePath = image.image_path;
                    if(imagePath.indexOf('static/') === 0) {
                        imagePath = imagePath.substr(7);
                    }
                    angular.forEach(image.image_numbers, function(value, key) {
                        var base = ConstantKeyValueService.apiBaseUrl + imagePath;
                        var end = image.image_name + '-' + value + '.jpg';
                        images.push({base:base, end:end});
                    });
                    return images;
                }
                return [];
            };

            factory.getNameFromSlug = function(slug) {
                slug = slug.split('-');
                slug.splice(slug.length-1, 1);
                var name = slug.join(' ');
                return name;
            };
             factory.sellerString='';
             // factory.maxPrice=5000;
             // factory.minPrice=0;
             
            factory.setFilterParams = function(sellerString,priceRangeIndex,minPrice,maxPrice) {
                 factory.priceRangeIndex=priceRangeIndex;
                factory.sellerString=sellerString;
                factory.maxPrice=maxPrice;
                factory.minPrice=minPrice;   
            };
            factory.setActiveFilterParams=function(colours,fabrics,selectedColours,selectedFabrics){
                factory.colours=colours;
                factory.fabrics=fabrics;
                factory.selectedColours=selectedColours;
                factory.selectedFabrics=selectedFabrics;
            }
            factory.resetFilterParams=function(){
                initiliseFilters();    
            }
            factory.currentCategoryID=null;
             factory.setCategory = function(categoryID) {
                factory.currentCategoryID=categoryID;
            };
       

            return factory;
        }
    ]);
})();
