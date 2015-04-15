angular.module('chatDirecive', [])
        .directive('chat', function () {
            return {
                restrict: 'E',
                priority: -100,
                templateUrl: 'chat/chat.html',
                scope: {
                    mgs: '=messages'
                },
                link: function (scope) {
                    scope.$watch("mgs", function (newValue, oldValue) {
                        console.log(newValue);
                    });
                }
            };
        })
