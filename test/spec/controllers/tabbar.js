'use strict';

describe('Controller: TabBarCtrl', function () {

  // load the controller's module
  beforeEach(module('visualisationsApp'));

  var TabbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TabBarCtrl = $controller('TabBarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
