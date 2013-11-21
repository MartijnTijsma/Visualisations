'use strict';

describe('Service: Port', function () {

  // load the service's module
  beforeEach(module('visualisationsApp'));

  // instantiate service
  var Port;
  beforeEach(inject(function(_Port_) {
    Port = _Port_;
  }));

  it('should do something', function () {
    expect(!!Port).toBe(true);
  });

});
