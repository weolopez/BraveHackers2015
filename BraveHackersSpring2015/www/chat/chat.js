angular.module('app.chat', ['ngRoute', 'snap', 'chatDirecive', 'firebase'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/chat/:name',
                        {
                            title: 'Chat',
                            templateUrl: 'chat/tv.html',
                            controller: ChatCtrl
                        });
            }])

function ChatCtrl($scope, snapRemote, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth) {

    $scope.currentRoom = $routeParams.name;
    /* var ref = new Firebase("https://uverse-social.firebaseio.com/chat");
     var chat = $firebaseObject(ref);
     if (chat === undefined) chat = {chat:{}};
     chat.$save();*/
    var ref = new Firebase("https://uverse-social.firebaseio.com/chat/rooms/" + $scope.currentRoom);
    var room = $firebaseObject(ref);
    room.$loaded().then(function () {
        console.log("loaded record:", room.$id);
        if (room.name === undefined) {
            room.name = $scope.currentRoom;
            room.messages = {};
            room.$save().then(function () {
                $scope.messages = $firebaseArray(ref.child('messages'));
                $scope.users = $firebaseArray(ref.child('messages'));
            });
        } else {
            $scope.messages = $firebaseArray(ref.child('messages'));
            $scope.users = $firebaseArray(ref.child('messages'));
        }
    });


    $scope.addMessage = function () {
        $scope.messages.$add(
                {message: $scope.msg, usericon: $scope.user.icon}
        );
    }

    $scope.login = function (provider) {
        // create an instance of the authentication service
        var auth = $firebaseAuth(ref);
        // login with Facebook
        auth.$authWithOAuthPopup(provider).then(function (authData) {
            console.log("Logged in as:", authData.uid);
            $scope.user = {};
            $scope.user.name = authData.twitter.cachedUserProfile.name;
            $scope.user.icon = authData.twitter.cachedUserProfile.profile_image_url;
            $scope.users.$add($scope.user);
        }).catch(function (error) {
            console.log("Authentication failed:", error);
        });
    }
}