'use strict';

angular.module('visualisationsApp')
.controller('AdlOverviewCtrl', ['$scope', 'LocationsService', 'SensorDataService', 'RoomsService', '$timeout', function ($scope, LocationsService, SensorDataService, RoomsService, $timeout) {
    $scope.id = 69;
    $scope.rooms = [];
    $scope.locationData = {};
    $scope.sensorData = {};
    var date = moment('2013-11-21 00:00:00');
    calculateTimes();
    $scope.period       = 24;

    $scope.previousPeriod = function(){
        date.subtract('days', 1);
        calculateTimes();
        $scope.refreshLocationData();
        $scope.refreshSensorData();
    }

    $scope.nextPeriod = function(){
        date.add('days', 1);
        calculateTimes();
        $scope.refreshLocationData();
        $scope.refreshSensorData();
    }

    function calculateTimes() {
        $scope.startTime    = date.clone().format('YYYY-MM-DD 00:00:00');//"2013-11-21 00:00:00";
        $scope.endTime      = date.clone().add('days', 1).format("YYYY-MM-DD 00:00:00");
        $scope.displayDate = new Date($scope.startTime);
    }

    $scope.refreshRooms = function(){
        console.log('refresh room data');
        var name = 'Rooms-'+$scope.id;
        RoomsService.getRooms({
                name: name
            },
            function(response){
                console.log(response);
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
                $scope.locationData = {};
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
                $scope.sensorData = {};
            });
    }

    //$timeout($scope.refreshSensorData, 2000);
}]);
