angular.module('app.tv', ['snap'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/tv',
                        {
                            title: 'TV',
                            templateUrl: 'tv/tv.html',
                            controller: TVCtrl
                        });
            }])
function TVCtrl($scope, snapRemote) {
    $scope.showMenu = function() {
        snapRemote.toggle('right');
    }
}