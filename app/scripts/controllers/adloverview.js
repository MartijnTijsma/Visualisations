'use strict';

angular.module('visualisationsApp')
.controller('AdlOverviewCtrl', ['$scope', 'LocationsService', 'SensorDataService', '$timeout', function ($scope, LocationsService, SensorDataService, $timeout) {
    $scope.locationData = {};
    $scope.sensorData = {};
    $scope.startTime    = "2013-11-19 00:00:00";
    $scope.endTime      = "2013-11-20 00:00:00";
    $scope.period       = 24;

    $scope.refreshLocationData = function(){
        console.log('refresh location Data');
        LocationsService.getDay({}, 
            function(response){
                $scope.locationData = response;
            },
            function(error){
                if(window.console){
                    console.log(error);
                }
            });    
    }

    $scope.refreshLocationData();

    $scope.refreshSensorData = function(){
        console.log('refresh sensor Data');
        SensorDataService.getDay({}, 
            function(response){
                $scope.sensorData = response;
            },
            function(error){
                if(window.console){
                    console.log(error);
                }
            });    
    }

    $scope.refreshSensorData();
}]);
