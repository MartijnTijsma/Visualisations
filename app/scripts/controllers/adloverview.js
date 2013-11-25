'use strict';

angular.module('visualisationsApp')
.controller('AdlOverviewCtrl', ['$scope', 'LocationsService', 'SensorDataService', 'RoomsService', '$timeout', function ($scope, LocationsService, SensorDataService, RoomsService, $timeout) {
    $scope.id = 69;
    $scope.rooms = [];
    $scope.locationData = {};
    $scope.sensorData = {};
    $scope.startTime    = "2013-11-21 00:00:00";
    $scope.endTime      = "2013-11-22 00:00:00";
    $scope.period       = 24;

    $scope.refreshRooms = function(){
        console.log('refresh room data');
        var name = 'Rooms-'+$scope.id;
        RoomsService.getRooms({
                name: name
            },
            function(response){
                $scope.rooms = response.rooms;
                $scope.refreshLocationData();
                $scope.refreshSensorData();
            },
            function(error){
                if(window.console){
                    console.log(error);
                }
            }
        );
    }
    $scope.refreshRooms();

    $scope.refreshLocationData = function(){
        console.log('refresh location Data');
        var name = 'Locations-'+$scope.id+'-'+$scope.startTime.substring(0,10);
        LocationsService.getDay({
                name: name
            },
            function(response){
                $scope.locationData = response;
            },
            function(error){
                if(window.console){
                    console.log(error);
                }
            }
        );
    }


    $scope.refreshSensorData = function(){
        console.log('refresh sensor Data');
        var name = 'Events-'+$scope.id+'-'+$scope.startTime.substring(0,10);
        SensorDataService.getDay({
                name : name
            },
            function(response){
                $scope.sensorData = response;
            },
            function(error){
                if(window.console){
                    console.log(error);
                }
            });
    }

    //$timeout($scope.refreshSensorData, 2000);
}]);
