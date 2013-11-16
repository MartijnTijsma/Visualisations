'use strict';

angular.module('visualisationsApp')
.controller('DashboardCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var timer;
    var interval = 5000;

    $scope.value1 = 50;
    $scope.min1 = 0;
    $scope.max1 = 1000;

    $scope.value2 = 6;
    $scope.min2 = -25;
    $scope.max2 = 50;

    $scope.value3 = 75;
    $scope.min3 = -500;
    $scope.max3 = 1000;

    function calculateValues(){
        $scope.value1 = Math.round(Math.random() * ($scope.max1 + $scope.min1) - $scope.min1);
        $scope.value2 = Math.round(Math.random() * ($scope.max2 + $scope.min2) - $scope.min2);
        $scope.value3 = Math.round(Math.random() * ($scope.max3 + $scope.min3) - $scope.min3);

        timer = $timeout(calculateValues, interval);
    }

    timer = $timeout(calculateValues, interval);

    $scope.$on('$destroy', function(){
        $timeout.cancel(timer);
    });

}]);
