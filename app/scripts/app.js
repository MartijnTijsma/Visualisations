'use strict';

angular.module('visualisationsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    //'ngTouch',
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
    .when('/adl', {
        templateUrl: 'views/adloverview.html',
        controller: 'AdlOverviewCtrl',
        menu: 'adl'
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
