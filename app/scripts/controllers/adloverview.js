'use strict';

angular.module('visualisationsApp')
.controller('AdlOverviewCtrl', ['$scope', 'LocationsService', 'SensorDataService', 'RoomsService', '$timeout', function ($scope, LocationsService, SensorDataService, RoomsService, $timeout) {
    $scope.id = 69;
    $scope.period       = 24;
    $scope.rooms = [];
    $scope.locationData = {};
    $scope.sensorData = {};
    var date = moment('2013-11-21 00:00:00');
    calculateTimes();

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
        $scope.startTime    = date.clone().format('YYYY-MM-DD HH:mm:ss');//"2013-11-21 00:00:00";
        $scope.endTime      = date.clone().add('hours', $scope.period).format("YYYY-MM-DD HH:mm:ss");
        console.log('calculateTimes: '+$scope.startTime+' - '+$scope.endTime);
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


    $scope.showPeriod = function(time){
        $scope.$apply(function(){
            if($scope.period < 24){
                date.hours(0)
                date.minutes(0)
                date.seconds(0)
                $scope.period = 24;
                calculateTimes();
            } else {
                var range = Math.floor(time / 6);
                date.add('hours', range * 6);
                $scope.period = 6;
                calculateTimes();
            }
        });
    }
}]);
