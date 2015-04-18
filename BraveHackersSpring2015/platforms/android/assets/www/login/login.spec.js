describe('LoginCtrl controllers', function () {

    var scope, ctrl, location;
    beforeEach(inject(function ($rootScope, $controller, $location) {
        location = $location;
        scope = $rootScope.$new();

        ctrl = $controller(LoginCtrl, {$scope: scope});

    }));
    
    it('LoginCtrl userId and password black field vaidation ', function () {

        expect(scope.user.userId).toBeUndefined();
        expect(scope.user.password).toBeUndefined();
        scope.login();
        expect(scope.errorText[0]).toEqual('User ID is mandatory.');
        expect(scope.errorText[1]).toEqual('Password is mandatory.');

    
    });
    
    it('LoginCtrl userId blank field vaidation ', function () {

        expect(scope.user.userId).toBeUndefined();
        scope.user.password = 'test';
        scope.login();
        expect(scope.errorText.length).toEqual(1);
        expect(scope.errorText[0]).toEqual('User ID is mandatory.');
        expect(scope.user.password).toEqual('test');
    });

    it('LoginCtrl Password blank field vaidation ', function () {

        expect(scope.user.password).toBeUndefined();
        scope.user.userId = 'test';
        scope.login();
        expect(scope.errorText.length).toEqual(1);
        expect(scope.errorText[0]).toEqual('Password is mandatory.');
        expect(scope.user.userId).toEqual('test');
    });
    

});