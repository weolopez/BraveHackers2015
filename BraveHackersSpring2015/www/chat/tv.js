angular.module('app.chat', ['snap'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/chat',
                        {
                            title: 'Chat',
                            templateUrl: 'chat/tv.html',
                            controller: ChatCtrl
                        });
            }])
        .service("AngularFireBase", function () {
            if (this.chatRef === undefined) {
                // Create a new Firebase reference, and a new instance of the Login client
                this.chatRef = new Firebase('https://whoison.firebaseio.com/chat');
                this.chat = new Firechat(this.chatRef);
            }

        });

function ChatCtrl($scope, snapRemote, AngularFireBase) {
    /*
     AngularFireBase.chatRef.onAuth(function (authData) {
     // Once authenticated, instantiate Firechat with our user id and user name
     if (authData) {
     var chat = new FirechatUI(AngularFireBase.chatRef, document.getElementById('firechat-wrapper'));
     chat.setUser(authData.uid, authData[authData.provider].displayName);
     }
     });*/
    $scope.login = function (provider) {
        AngularFireBase.chatRef.authWithOAuthPopup(provider, function (error, authData) {
            if (error) {
                console.log(error);
            } else {
                AngularFireBase.chat.setUser(authData.uid, authData[authData.provider].displayName, function (user) {
                    AngularFireBase.chat.resumeSession();
                });
            }
        });
    }

    $scope.showMenu = function () {
        snapRemote.toggle('right');
    }
}