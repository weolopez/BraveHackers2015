angular.module('chatDirecive', [])
        .directive('chat', function () {
            return {
                restrict: 'E',
                priority: -100,
                templateUrl: 'chat/chat.html',
                scope: {
                    mgs: '=messages'
                },
                controller: function ($scope) {

                },
                link: function (scope, ele, attr) {
                }
            };
        })
        .directive('myYoutube', function ($sce) {
            return {
                restrict: 'EA',
                scope: {code: '='},
                replace: true,
                template: '<div style="height:auto;"><iframe style="overflow:hidden;height:auto;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
                link: function (scope) {
                    scope.$watch('code', function (newVal) {
                        if (newVal) {
                            scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);                            
                        }
                    });
                }
            };
                   
        });