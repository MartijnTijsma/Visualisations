'use strict';

angular.module('visualisationsApp')
.factory('LocationsService',['$resource', 'ConfigurationService', function Locations($resource, ConfigurationService) {
    return $resource(ConfigurationService.server.url + '/Locations.json/:type/:id/:action', ConfigurationService.server.params, {
        'getDay':   {method:'GET'}
    });
}]);
