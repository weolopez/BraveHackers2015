angular.module('app.login', [])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login',
                        {
                            title: 'Login',
                            templateUrl: 'login/loginView.html',
                            controller: LoginCtrl
                        });
    
    $routeProvider.otherwise({redirectTo: '/chat/bravehackers'});
}])

.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        if (current.$route !== undefined) {
            $rootScope.title = current.$route.title;
        }
    });
}])

.config(function ($logProvider) {
    $logProvider.debugEnabled(false);
});
