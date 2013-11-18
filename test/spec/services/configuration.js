'use strict';

describe('Service: Configuration', function () {

  // load the service's module
  beforeEach(module('visualisationsApp'));

  // instantiate service
  var Configuration;
  beforeEach(inject(function(_Configuration_) {
    Configuration = _Configuration_;
  }));

  it('should do something', function () {
    expect(!!Configuration).toBe(true);
  });

});
