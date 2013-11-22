'use strict';

describe('Service: Sensordata', function () {

  // load the service's module
  beforeEach(module('visualisationsApp'));

  // instantiate service
  var Sensordata;
  beforeEach(inject(function (_Sensordata_) {
    Sensordata = _Sensordata_;
  }));

  it('should do something', function () {
    expect(!!Sensordata).toBe(true);
  });

});
