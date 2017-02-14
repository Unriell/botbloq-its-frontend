'use strict';

/**
 * @ngdoc overview
 * @name botbloqItsFrontendApp
 * @description
 * # botbloqItsFrontendApp
 *
 * Main module of the application.
 */
angular
    .module('botbloqItsFrontendApp', [
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
            .otherwise({
                redirectTo: '/'
            });
        $httpProvider.interceptors.push('authInterceptor');
    });