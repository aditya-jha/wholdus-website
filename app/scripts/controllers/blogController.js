(function() {
    webapp.controller('BlogController', [
        '$scope',
        '$log',
        '$routeParams',
        '$sce',
        function($scope, $log, $routeParams, $sce) {

            function init() {
                if($routeParams.article && $routeParams.article == 'home') {
                    
                }
            }
            $scope.article = {
                title: 'Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1 Blog post 1',
                author: 'Aditya Jha',
                url: '/blog/new',
                converImage: 'https://media.licdn.com/mpr/mpr/jc/AAEAAQAAAAAAAAdZAAAAJDE1YmU1NDRkLWI2ZGMtNGU4MC1hN2EyLWNhNDM4MTg2YzA0OA.jpg',
                content: $sce.trustAsHtml('<b>this is content</b>'),
                created_at: '1467387369461'
            };
        }
    ]);
})();
