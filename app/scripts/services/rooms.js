'use strict';

angular.module('visualisationsApp')
.factory('RoomsService',['$resource', 'ConfigurationService', function Rooms($resource, ConfigurationService) {
    return $resource(ConfigurationService.server.url + '/Rooms/:name.json', ConfigurationService.server.params, {
        'getRooms':   {method:'GET'}
    });
}]);
