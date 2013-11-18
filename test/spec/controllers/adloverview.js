'use strict';

describe('Controller: AdloverviewCtrl', function () {

  // load the controller's module
  beforeEach(module('visualisationsApp'));

  var AdloverviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdloverviewCtrl = $controller('AdloverviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
