'use strict';

angular.module('visualisationsApp')
.controller('AdlOverviewCtrl', ['$scope', 'LocationsService', '$timeout', function ($scope, LocationsService, $timeout) {
    $scope.locationData = {};
    $scope.startTime    = "2013-11-19 00:00:00";
    $scope.endTime      = "2013-11-20 00:00:00";
    $scope.period       = 24;
    
    $scope.refreshData = function(){
        console.log('refreshData');
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

    $scope.refreshData();
}]);
