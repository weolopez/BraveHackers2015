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

                }
            };
        })
