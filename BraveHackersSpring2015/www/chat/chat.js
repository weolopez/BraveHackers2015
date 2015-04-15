angular.module('app.chat', ['snap', 'chatDirecive'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/chat',
                        {
                            title: 'Chat',
                            templateUrl: 'chat/tv.html',
                            controller: ChatCtrl
                        });
            }])
        .service("AngularFireBase", function () {
            this.init = function () {
                this.chatRef = new Firebase('https://whoison.firebaseio.com/chat');
                this.chat = new Firechat(this.chatRef);
                this.chat.resumeSession();
            }
            this.setUser = function (authData) {
                try {
                    this.chat.setUser(authData.uid, authData[authData.provider].displayName, function (user) {
                        console.dir(user);
                    });

                } catch (err) {
                    console.log("ERROR: " + err)
                }
            }

        });



function ChatCtrl($scope, snapRemote, AngularFireBase) {
    AngularFireBase.init();

    $scope.m = [
    ];

    $scope.login = function (provider) {
        $scope.m.push({message: "message1", usericon: "https://pbs.twimg.com/profile_images/587986635788193794/3Q85Cofv_bigger.jpg"});


        AngularFireBase.chatRef.authWithOAuthPopup(provider, function (error, authData) {
            $scope.m.push({message: "message-1", usericon: "https://pbs.twimg.com/profile_images/587986635788193794/3Q85Cofv_bigger.jpg"});

            if (error) {
                console.log("TEST:" + error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                AngularFireBase.setUser(authData);

                AngularFireBase.chat.resumeSession();
                AngularFireBase.chat.enterRoom("Jmwouux_vzJOIqoS0JY");

            }
        });

        /*      */

        AngularFireBase.chat.on('user-update', function (user) {

            // Update our current user state and render latest user name.
            $scope._user = user;

            // Update our interface to reflect which users are muted or not.
            // Ensure that all messages from muted users are removed.
        });

        AngularFireBase.chat.on('message-add', function (roomId, message) {
            $scope.m.push({message: "message4", usericon: "https://pbs.twimg.com/profile_images/587986635788193794/3Q85Cofv_bigger.jpg"});

            var userId = message.userId;
            $scope.m.push({message: "message5", usericon: "https://pbs.twimg.com/profile_images/587986635788193794/3Q85Cofv_bigger.jpg"});

            if (!$scope._user || !$scope._user.muted || !$scope._user.muted[userId]) {
                $scope.m.push({message: "message6", usericon: "https://pbs.twimg.com/profile_images/587986635788193794/3Q85Cofv_bigger.jpg"});

                var msg = {
                    id: message.id,
                    localtime: formatTime(message.timestamp),
                    message: message.message || '',
                    userId: message.userId,
                    name: message.name,
                    usericon: "https://pbs.twimg.com/profile_images/587986635788193794/3Q85Cofv_bigger.jpg",
                    type: message.type || 'default',
                    isSelfMessage: ($scope._user && message.userId == $scope._user.id),
                    disableActions: (!$scope._user || message.userId == $scope._user.id)
                };
                $scope.m.push(msg);
                $scope.m.push({message: "message7", usericon: "https://pbs.twimg.com/profile_images/587986635788193794/3Q85Cofv_bigger.jpg"});

            }
        });
        function formatTime(timestamp) {
            var date = (timestamp) ? new Date(timestamp) : new Date(),
                    hours = date.getHours() || 12,
                    minutes = '' + date.getMinutes(),
                    ampm = (date.getHours() >= 12) ? 'pm' : 'am';

            hours = (hours > 12) ? hours - 12 : hours;
            minutes = (minutes.length < 2) ? '0' + minutes : minutes;
            return '' + hours + ':' + minutes + ampm;
        }
        ;
    }

    $scope.showMenu = function () {
        snapRemote.toggle('right');
    }
}