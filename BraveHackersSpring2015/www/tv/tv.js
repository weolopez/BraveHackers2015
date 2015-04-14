angular.module('app.tv', [])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/tv',
                        {
                            title: 'TV',
                            templateUrl: 'tv/tv.html',
                            controller: TVCtrl
                        });    
}])
function TVCtrl($scope) {    

}