'use strict';

angular.module('visualisationsApp')
.factory('ConfigurationService', function () {
    return {
        server: {
            url: "api"
        }
    };
});
