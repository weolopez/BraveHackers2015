'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Login',
		function() {

	    beforeEach(function() {
                            browser.get('#/login');
                        }, 50000);
                        
            it('should automatically redirect to /login', function() {
                expect(browser.getCurrentUrl()).toContain("#/login");
            }, 500000);

            it('should render login partial when user navigates to /login', function() {
                expect(element.all(by.css('[ng-view] header')).count()).toBe(1);
                expect(element.all(by.css('[ng-view] footer')).count()).toBe(1);
                expect(element.all(by.css('[ng-view] div')).count()).toBe(26);
                expect(element.all(by.css('[ng-view] form')).count()).toBe(1);

                expect(element.all(by.id('userId')).count()).toBe(1);
                expect(element.all(by.id('password')).count()).toBe(1);

            }, 500000);

            it('should contain no value in username and password fields by default', function() {
                expect(element(by.model('user.userId')).getText()).toMatch("");
                expect(element(by.model('user.password')).getText()).toMatch("");
                
            }, 500000);

            it('should not be visible userNamePopover by default', function() {
                expect(element(by.id('userNamePopover')).isDisplayed()).toBe(false);
            }, 500000);

            it('should be visible userNamePopover as soon as focus will be username field', function() {
                element(by.id('userId')).click();
                expect(element(by.id('userNamePopover')).isDisplayed()).toBe(true);
            });
        });
