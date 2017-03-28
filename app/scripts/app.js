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
            .when('/loms', {
                templateUrl: 'views/loms.html',
                controller: 'lomsCtrl'
            })
            .when('/courses', {
                templateUrl: 'views/courses.html',
                controller: 'coursesCtrl'
            })
            .otherwise({
                redirectTo: 'views/404'
            });
        $httpProvider.interceptors.push('authInterceptor');
    });

   