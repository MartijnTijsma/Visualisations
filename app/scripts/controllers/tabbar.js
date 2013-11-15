'use strict';

angular.module('visualisationsApp')
.controller('TabBarCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.activeMenu = $rootScope.activeMenu;

    $rootScope.$watch('activeMenu', function(newVal){
        $scope.activeMenu = newVal;
    });
}]);
