'use strict';

angular.module('visualisationsApp')
.controller('DetailCtrl', ['$scope', 'PortService', function ($scope, PortService) {
    $scope.data = {};
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

    $scope.data = {
        start_time : '2013-11-21 00:00:00',
        end_time : '2013-11-22 00:00:00',
        data_history : [
            {timestamp: '2013-11-21 00:00:00', average: 800},
            {timestamp: '2013-11-21 01:00:00', average: 450},
            {timestamp: '2013-11-21 02:00:00', average: 677},
            {timestamp: '2013-11-21 03:00:00', average: 450},
            {timestamp: '2013-11-21 04:00:00', average: 575},
            {timestamp: '2013-11-21 05:00:00', average: 450},
            {timestamp: '2013-11-21 06:00:00', average: 450},
            {timestamp: '2013-11-21 07:00:00', average: 40},
            {timestamp: '2013-11-21 08:00:00', average: 34},
            {timestamp: '2013-11-21 09:00:00', average: 99},
            {timestamp: '2013-11-21 10:00:00', average: 79},
            {timestamp: '2013-11-21 11:00:00', average: 133},
            {timestamp: '2013-11-21 12:00:00', average: 666},
            {timestamp: '2013-11-21 13:00:00', average: 290},
            {timestamp: '2013-11-21 14:00:00', average: 535},
            {timestamp: '2013-11-21 15:00:00', average: 450},
            {timestamp: '2013-11-21 16:00:00', average: 450},
            {timestamp: '2013-11-21 17:00:00', average: 353},
            {timestamp: '2013-11-21 18:00:00', average: 450},
            {timestamp: '2013-11-21 19:00:00', average: 953},
            {timestamp: '2013-11-21 20:00:00', average: 450},
            {timestamp: '2013-11-21 21:00:00', average: 21},
            {timestamp: '2013-11-21 22:00:00', average: 231},
            {timestamp: '2013-11-21 22:00:00', average: 13},
            {timestamp: '2013-11-22 00:00:00', average: 477},
        ]
    }
}]);
