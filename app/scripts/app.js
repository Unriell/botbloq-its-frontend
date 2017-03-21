'use strict';

/**
 * @ngdoc overview
 * @name botbloqItsFrontendApp
 * @description
 * # botbloqItsFrontendApp
 *
 * Main module of the application.
 */
var botBloqApp= angular.module('botbloqItsFrontendApp', [
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/landing.html',
                controller: 'landingCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
            })
            .when('/students', {
                templateUrl: 'views/students.html',
                controller: 'studentsCtrl'
            })
            .when('/adminResources', {
                templateUrl: 'views/adminResources.html',
                controller: 'adminResourcesCtlr'
            })
            .otherwise({
                redirectTo: 'views/404'
            });
        $httpProvider.interceptors.push('authInterceptor');
    });

   