'use strict';

angular.module('visualisationsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'd3'
])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        menu: 'dashboard'
    })
    .when('/detail', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl',
        menu: 'detail'
    })
    .when('/barchart', {
        templateUrl: 'views/barChart.html',
        controller: 'BarChartCtrl',
        menu: 'barchart'
    })
    .otherwise({
        redirectTo: '/'
    });
}])
.run(['$rootScope', function($rootScope){
    $rootScope.$on('$routeChangeStart', function(event, next){
        $rootScope.activeMenu = (next && next.$$route) ? next.$$route.menu : 'dashboard';
    });
}]);
