(function() {
    webapp.directive('wuBlognav', function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/wuBlognav.html',
            controller: [
                '$scope',
                '$log',
                '$rootScope',
                function($scope, $log, $rootScope) {
                    $log.log("wublog directive");
                    $scope.articles = [
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new',
                            converImage: 'https://media.licdn.com/mpr/mpr/jc/AAEAAQAAAAAAAAdZAAAAJDE1YmU1NDRkLWI2ZGMtNGU4MC1hN2EyLWNhNDM4MTg2YzA0OA.jpg',
                            content: 'this is content'
                        },
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new'
                        },
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new'
                        },
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new'
                        },
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new'
                        },
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new'
                        },
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new'
                        },
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new'
                        },
                        {
                            title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                            author: 'Aditya Jha',
                            url: '/blog/new'
                        },
                    ];
                }
            ]
        };
    });
})();
