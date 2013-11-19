'use strict';

angular.module('visualisationsApp')
.controller('AdlOverviewCtrl', ['$scope', 'LocationsService', '$timeout', function ($scope, LocationsService, $timeout) {
    $scope.data = {};

    $scope.refreshData = function(){
        console.log('refreshData');
        LocationsService.getDay({}, 
            function(response){
                $scope.data = response;
            },
            function(error){
                if(window.console){
                    console.log(error);
                }
            });    
    }

    $scope.refreshData();
}]);
