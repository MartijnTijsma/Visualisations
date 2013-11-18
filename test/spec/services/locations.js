'use strict';

describe('Service: Locations', function () {

  // load the service's module
  beforeEach(module('visualisationsApp'));

  // instantiate service
  var Locations;
  beforeEach(inject(function(_Locations_) {
    Locations = _Locations_;
  }));

  it('should do something', function () {
    expect(!!Locations).toBe(true);
  });

});
