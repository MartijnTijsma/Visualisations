'use strict';

describe('Controller: TabBarCtrl', function () {

    // load the controller's module
    beforeEach(module('visualisationsApp'));

    var TabBarCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        TabBarCtrl = $controller('TabBarCtrl', {
            $scope: scope
        });
    }));

    it('should find the active menu', function () {
        //expect(scope.activeMenu).toBeDefined();
    });
});
