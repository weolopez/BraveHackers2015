angular.module('app.chat', ['ngRoute', 'snap', 'chatDirecive', 'firebase', 'luegg.directives', 'youtube-embed'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/chat/:name',
                        {
                            title: 'Chat',
                            templateUrl: 'chat/tv.html',
                            controller: ChatCtrl
                        });
            }])

function ChatCtrl($scope, snapRemote, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $interval) {
    $scope.html5video = true;
    $scope.currentRoom = $routeParams.name;
    /* var ref = new Firebase("https://uverse-social.firebaseio.com/chat");
     var chat = $firebaseObject(ref);
     if (chat === undefined) chat = {chat:{}};
     chat.$save();*/
    var ref = new Firebase("https://uverse-social.firebaseio.com/chat/rooms/" + $scope.currentRoom);
    var room = $firebaseObject(ref);
    room.$loaded().then(function () {
        if (room.name === undefined) {
            room.name = $scope.currentRoom;
            room.messages = {};
            room.users = {};
            room.$save().then(function () {
                $scope.messages = $firebaseArray(ref.child('messages'));
                $scope.usersArray = $firebaseArray(ref.child('users'));
            });
        } else {
            $scope.messages = $firebaseArray(ref.child('messages'));
            $scope.usersArray = $firebaseArray(ref.child('users'));
        }
    });

    $scope.addMessage = function () {
        if ($scope.msg.substring(0, 1) === "/") {
            if ($scope.msg.substring(0, 6) === "/video") {
                $scope.html5video = false;             
                $scope.videolink = $scope.msg.substring(7);
            }
        } else {
            $scope.messages.$add(
                    {message: $scope.msg, usericon: $scope.user.icon}
            ).then(function () {
                $scope.msg = "";
            });
            $scope.msg = "";
        }
    }

    $scope.login = function (provider) {
        // create an instance of the authentication service
        var auth = $firebaseAuth(ref);
        // login with Facebook
        auth.$authWithOAuthPopup(provider).then(function (authData) {
            console.log("Logged in as:", authData.uid);
            $scope.user = {};
            
            $scope.msg = authData.twitter.cachedUserProfile.name+" has joined the chat";
            $scope.addMessage();
            
            $scope.user.name = authData.twitter.cachedUserProfile.name;           
            $scope.user.icon = authData.twitter.cachedUserProfile.profile_image_url;

                
            if (!room.users)
                room.users = {};
            if (!room.users[$scope.user.name]) {
                room.users[$scope.user.name] = $scope.user;
                room.$save().then(function (reference) {
                    console.dir(reference);
                });
            }
        }).catch(function (error) {
            console.log("Authentication failed:", error);
        });
    }
    $scope.showMenu = function () {
        snapRemote.toggle('right');
    }

}