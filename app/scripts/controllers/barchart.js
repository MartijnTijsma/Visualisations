'use strict';

angular.module('visualisationsApp')
.controller('BarChartCtrl', ['$scope', function ($scope) {
    $scope.scoreData = [
        {name: "Greg", score: 98},
        {name: "Ari", score: 96},
        {name: "Martijn", score: 83},
        {name: 'Q', score: 75},
        {name: "Loser", score: 48}
    ];
}]);
