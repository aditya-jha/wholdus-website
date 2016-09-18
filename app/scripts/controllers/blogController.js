(function() {
    'use strict';
    webapp.controller('BlogController', [
        '$scope',
        '$log',
        '$routeParams',
        '$sce',
        '$compile',
        'APIService',
        'UtilService',
        '$location',
        '$rootScope',
        'ngProgressBarService',
        function($scope, $log, $routeParams, $sce, $compile, APIService, UtilService, $location, $rootScope, ngProgressBarService) {

            // function init() {
            //     if($routeParams.article && $routeParams.article == 'home') {

            //     }
            // }

            $scope.data = {
                article: {},
                articles : [],
            };

            $scope.home = false;

            $scope.getBlogs = function(params){
                        ngProgressBarService.showProgressbar();
                        APIService.apiCall('GET', APIService.getAPIUrl('blogarticle'),null, params).
                        then(function(response){
                            ngProgressBarService.endProgressbar();
                            if($scope.home){
                                $scope.data.articles = response.articles;
                            }
                            else if (!$scope.home){
                                $scope.data.article = response.articles[0];
                                $scope.articleContent = $sce.trustAsHtml($scope.data.article.content);
                            }
                            $scope.data.article.cover_image_link= 'https://media.licdn.com/mpr/mpr/jc/AAEAAQAAAAAAAAdZAAAAJDE1YmU1NDRkLWI2ZGMtNGU4MC1hN2EyLWNhNDM4MTg2YzA0OA.jpg';
                        },function(error){
                            ngProgressBarService.endProgressbar();
                            ToastService.showSimpleToast('unable to load blog content', 3000);
                        });
                    };

            $scope.selectBlog = function(slug, id, title){
                $scope.articletitle = title;
                $location.url('/blog/'+slug+'-'+id);
            };

            // function showArticle(ID){

            //     var el = $compile("<div layout='row' flex='100' wu-blog-content md-whiteframe='2dp' id="+ID+" layout-wrap></div>")($scope);
            //     angular.element(document.querySelector("#blog-content")).append(el);
            // }

            function viewBlog(){
               if($routeParams.article && $routeParams.article!='home'){
                $scope.getBlogs({
                    articleID:UtilService.getIDFromSlug($routeParams.article),
                    article_details:1,
                });
               }
               else{
                        $scope.home = true;
                     $scope.getBlogs();
               }
            }

            viewBlog();
        }
    ]);
})();
