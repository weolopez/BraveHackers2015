function LoginCtrl($scope, $location, $log) {
    $log.info('AngularScope :: in LoginCtrl');
    $scope.user = {};
    $scope.login = function () {
        $scope.errorText = [];
        if ($scope.user.userId === undefined || $scope.user.password === undefined) {
            if ($scope.user.userId === undefined) {
                $log.warn('User ID empty');
                $scope.errorText.push("User ID is mandatory.");
            }
            if ($scope.user.password === undefined) {
                $log.warn('Password empty');
                $scope.errorText.push("Password is mandatory.");
            }
        } else {
           alert("success");
        }
    };
}

function showPopover() {
    $('#userNamePopover').slideDown('slow');
}

function hidePopover() {
    $('#userNamePopover').slideUp('slow');
}

function clearIt(idValue) {
    $("#" + idValue).value = "";
}

