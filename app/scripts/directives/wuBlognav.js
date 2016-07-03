(function() {
    webapp.directive('wuBlognav', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuBlognav.html',
            controller: [
                '$scope',
                '$log',
                '$rootScope',
                '$location',
                'APIService',
                'ToastService',
                function($scope, $log, $rootScope, $location, APIService, ToastService) {
                    $log.log("wublog directive");
                    $scope.articles = [
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new',
                        //     articleID: 1,
                        //     converImage: 'https://media.licdn.com/mpr/mpr/jc/AAEAAQAAAAAAAAdZAAAAJDE1YmU1NDRkLWI2ZGMtNGU4MC1hN2EyLWNhNDM4MTg2YzA0OA.jpg',
                        //     content: 'this is content'
                        // },
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new',
                        //     articleID: 2,
                        // },
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new',
                        //     articleID: 3,
                        // },
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new'
                        // },
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new'
                        // },
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new'
                        // },
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new'
                        // },
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new'
                        // },
                        // {
                        //     title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                        //     author: 'Aditya Jha',
                        //     url: '/blog/new'
                        // },
                    ];

                    function getBlogNav(params){
                        APIService.apiCall('GET', APIService.getAPIUrl('blogarticle'), params)
                        .then(function(response){
                            $scope.articles = response.articles;
                        },function(error){
                            ToastService.showActionToast('Unable to load blogs list', 0);
                        })
                    }

                    getBlogNav();

                    $scope.openArticle = function(slug,id){
                        $location.url('/blog/'+slug+'-'+id);
                    };
                }
            ]
        };
    });
})();
