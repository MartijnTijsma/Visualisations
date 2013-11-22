'use strict';

angular.module('visualisationsApp')
.factory('SensorDataService',['$resource', 'ConfigurationService', function Locations($resource, ConfigurationService) {
    return $resource(ConfigurationService.server.url + '/Sensors.json/:type/:id/:action', ConfigurationService.server.params, {
        'getDay':   {method:'GET'}
    });
}]);