'use strict';

angular.module('visualisationsApp')
.factory('PortService',['$resource', 'ConfigurationService', function Locations($resource, ConfigurationService) {
    return $resource(ConfigurationService.server.url + '/Ports/:id/data.json', ConfigurationService.server.params, {
        'getData':   {method:'GET'}
    });
}]);
