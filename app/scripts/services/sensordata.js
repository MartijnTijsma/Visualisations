'use strict';

angular.module('visualisationsApp')
.factory('SensorDataService',['$resource', 'ConfigurationService', function Events($resource, ConfigurationService) {
    return $resource(ConfigurationService.server.url + '/Events/:name.json', ConfigurationService.server.params, {
        'getDay':   {method:'GET'}
    });
}]);