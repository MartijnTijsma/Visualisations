'use strict';

angular.module('visualisationsApp')
.controller('DetailCtrl', ['$scope', 'PortService', function ($scope, PortService) {
    $scope.ports = [];

    /*var portId = 97;

    $scope.refreshData = function(pId){
        PortService.getData({
            'id' : pId
        }, function(response){
            $scope.data = response.device_port;
            $scope.data.startTime = '2012-11-19 00:00:00';
            $scope.data.endTime = '2012-11-20 00:00:00';
        },
        function(error){
            if(window.console){
                console.log(error);
            }
        })
    }

    $scope.refreshData(portId);
    */

    $scope.startTime = '2013-11-21 00:00:00';
    $scope.endTime = '2013-11-22 00:00:00';
    var port = {
        data_history : [
            {timestamp: '2013-11-21 00:00:00', average: 800, minimum: 644, maximum: 910},
            {timestamp: '2013-11-21 01:00:00', average: 450, minimum: 402, maximum: 633},
            {timestamp: '2013-11-21 02:00:00', average: 677, minimum: 544, maximum: 702},
            {timestamp: '2013-11-21 03:00:00', average: 450, minimum: 200, maximum: 763},
            {timestamp: '2013-11-21 04:00:00', average: 575, minimum: 555, maximum: 577},
            {timestamp: '2013-11-21 05:00:00', average: 450, minimum: 230, maximum: 788},
            {timestamp: '2013-11-21 06:00:00', average: 450, minimum: 379, maximum: 677},
            {timestamp: '2013-11-21 07:00:00', average: 40, minimum: 10, maximum: 55},
            {timestamp: '2013-11-21 08:00:00', average: 34, minimum: 22, maximum: 43},
            {timestamp: '2013-11-21 09:00:00', average: 99, minimum: 66, maximum: 107},
            {timestamp: '2013-11-21 10:00:00', average: 79, minimum: 32, maximum: 123},
            {timestamp: '2013-11-21 11:00:00', average: 133, minimum: 43, maximum: 334},
            {timestamp: '2013-11-21 12:00:00', average: 666, minimum: 567, maximum: 677},
            {timestamp: '2013-11-21 13:00:00', average: 290, minimum: 109, maximum: 323},
            {timestamp: '2013-11-21 14:00:00', average: 535, minimum: 454, maximum: 875},
            {timestamp: '2013-11-21 15:00:00', average: 450, minimum: 345, maximum: 764},
            {timestamp: '2013-11-21 16:00:00', average: 450, minimum: 55, maximum: 888},
            {timestamp: '2013-11-21 17:00:00', average: 353, minimum: 221, maximum: 753},
            {timestamp: '2013-11-21 18:00:00', average: 450, minimum: 45, maximum: 764},
            {timestamp: '2013-11-21 19:00:00', average: 953, minimum: 864, maximum: 1000},
            {timestamp: '2013-11-21 20:00:00', average: 450, minimum: 341, maximum: 854},
            {timestamp: '2013-11-21 21:00:00', average: 21, minimum: 10, maximum: 66},
            {timestamp: '2013-11-21 22:00:00', average: 231, minimum: 22, maximum: 554},
            {timestamp: '2013-11-21 23:00:00', average: 13, minimum: 0, maximum: 24},
            {timestamp: '2013-11-22 00:00:00', average: 477, minimum: 10, maximum: 900},
        ]
    }

    $scope.ports.push(port)
}]);
