angular.module('app.chat', ['ngRoute', 'snap', 'chatDirecive', 'firebase', 'luegg.directives', 'mobile-angular-ui.components', 'ngCordova', 'ionic'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/chat/:name',
                        {
                            title: 'Chat',
                            templateUrl: 'chat/tv.html',
                            controller: ChatCtrl
                        });
                $routeProvider.when('/chat/:name/:childroom',
                        {
                            title: 'Chat',
                            templateUrl: 'chat/tv.html',
                            controller: ChatCtrl
                        });
            }])
        .service('ShareService', function ($cordovaSocialSharing) {

            var share = function (message, subject, file, link) {

                document.addEventListener("deviceready", function () {
                    $cordovaSocialSharing
                            .share(message, subject, file, link)
                            .then(function (result) {
                                // Success!
                                console.dir(result);
                            }, function (err) {
                                // An error occurred. Show a message to the user
                                alert('error');
                                console.dir(err);
                            });
                }, false);

            };
            return {
                share: share
            }
        });
function ChatCtrl($scope, snapRemote, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, ShareService, $cordovaToast) {

    $scope.settings = [];
    $scope.settings.push({name: "moderated", isTrue: true});
    $scope.settings.push({name: "private", isTrue: true});
    $scope.settings.push({name: "locked", isTrue: false});

    $scope.html5video = true;

    $scope.childRoom = $routeParams.childroom;
    if ($scope.childRoom === undefined)
        $scope.childRoom = "";
    else
        $scope.childRoom = "+" + $scope.childRoom;
    $scope.currentRoom = $routeParams.name + $scope.childRoom;

    /* var ref = new Firebase("https://uverse-social.firebaseio.com/chat");
     var chat = $firebaseObject(ref);
     if (chat === undefined) chat = {chat:{}};
     chat.$save();*/
    var ref = new Firebase("https://uverse-social.firebaseio.com/chat/rooms/" + $scope.currentRoom);

    $scope.rooms = $firebaseArray(ref.parent());
    var room = $firebaseObject(ref);
    room.$loaded().then(function () {
        if (room.name === undefined) {
            room.name = $scope.currentRoom;
            room.messages = {};
            room.users = {};
            room.childRooms = {};
            room.$save().then(function () {
                $scope.messages = $firebaseArray(ref.child('messages'));
                $scope.usersArray = $firebaseArray(ref.child('users'));
                $scope.childRooms = $firebaseArray(ref.child('childRooms'));
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
                $scope.msg = "";
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
            console.log("Logged in as:", authData.twitter.cachedUserProfile.name);

            $scope.user = {};
            $scope.user.name = authData.twitter.cachedUserProfile.name;
            $scope.user.icon = authData.twitter.cachedUserProfile.profile_image_url;

            $scope.messages.$add(
                    {message: authData.twitter.cachedUserProfile.name + 'has joined the chat', usericon: $scope.user.icon}
            );

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
    $scope.clickvideo = function () {
        /*
         $("#videobutton").css('opacity', '0');
         
         $("#select_logo").click(function (e) {
         e.preventDefault();
         $("#videobutton").trigger('click');
         });*/
    }


    $scope.shareLink = function ()
    {
        alert("TO SHARE");
        ShareService.share('Message', 'Title', null, 'link');

        /*
         $cordovaSocialSharing
         .share('message', 'subject', 'file', 'link') // Share via native share sheet
         .then(function (result) {
         alert('Success');
         }, function (err) {
         // An error occured. Show a message to the user
         alert('error');
         });*/
    }

    $scope.showToast = function (message, duration, location) {
        $cordovaToast.show(message, duration, location, function (returnmessage) {
            alert("GOODJOB: " + returnmessage);
        }, function (returnmessage) {
            alert("toobad: " + returnmessage);
        }).then(function (success) {
            alert("The toast was shown:" + success);
        }, function (error) {
            alert("The toast was not shown due to " + error);
        });
    }
    $scope.addRoom = function () {
        var newroomname = $scope.currentRoom+'+'+this.roomName;
        var newroom = $firebaseObject(ref.parent().child(newroomname));
        newroom.name = newroomname;
        this.addingRoom = false;
        newroom.messages = {};
        newroom.users = {};
        newroom.childRooms = {};
        newroom.$save().then(function () {
            $scope.messages = $firebaseArray(ref.parent().child(newroomname).child('messages'));
            $scope.usersArray = $firebaseArray(ref.parent().child(newroomname).child('users'));
            $scope.childRooms = $firebaseArray(ref.parent().child(newroomname).child('childRooms'));
        });
    }
}
