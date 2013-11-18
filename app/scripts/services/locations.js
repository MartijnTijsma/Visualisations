'use strict';

angular.module('visualisationsApp')
.factory('LocationsService',['$resource', 'ConfigurationService', function Locations($resource, ConfigurationService) {
    return $resource(ConfigurationService.server.url + '/Locations/:type/:id/:action', ConfigurationService.server.params, {
        'getAll':   {method:'GET', isArray:true}
    });
}]);
