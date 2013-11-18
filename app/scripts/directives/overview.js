'use strict';

angular.module('visualisationsApp')
.directive('adlLocations', ['D3Service', '$window', function (d3Service, $window ) {
    return {
        restrict: 'EA',
        scope: {
            data: '=', //bi-directional
        },
        link: function postLink(scope, element, attrs) {
            element.text('this is the overview directive');
        }
    };
}]);
