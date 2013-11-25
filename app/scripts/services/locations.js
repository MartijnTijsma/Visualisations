'use strict';

angular.module('visualisationsApp')
.factory('LocationsService',['$resource', 'ConfigurationService', function Locations($resource, ConfigurationService) {
    return $resource(ConfigurationService.server.url + '/Locations/:name.json', ConfigurationService.server.params, {
        'getDay':   {method:'GET'}
    });
}]);
