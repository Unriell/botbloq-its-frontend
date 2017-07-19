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
                templateUrl: 'views/pages/signUp.html',
                controller: 'loginCtrl'
            })
            .when('/login', {
                templateUrl: 'views/pages/login.html',
                controller: 'loginCtrl'
            })
            .when('/signUp', {
                templateUrl: 'views/pages/signUp.html',
                controller: 'loginCtrl'
            })
            .when('/questionnaire', {
                templateUrl: 'views/pages/questionnaire.html',
                controller: 'studentsCtrl'
            })
            .when('/students', {
                templateUrl: 'views/pages/students.html',
                controller: 'studentsCtrl'
            })
            .when('/loms', {
                templateUrl: 'views/pages/loms.html',
                controller: 'lomsCtrl'
            })
            .when('/addLom', {
                templateUrl: 'views/pages/addLom.html',
                controller: 'lomsCtrl'
            })
            .when('/courses', {
                templateUrl: 'views/pages/courses.html',
                controller: 'coursesCtrl'
            })
            .when('/addCourse', {
                templateUrl: 'views/pages/addCourse.html',
                controller: 'coursesCtrl'
            })
            .when('/addSections', {
                templateUrl: 'views/pages/addSections.html',
                controller: 'coursesCtrl'
            })
            .when('/addLessons', {
                templateUrl: 'views/pages/addLessons.html',
                controller: 'coursesCtrl'
            })
            .when('/editCourse', {
                templateUrl: 'views/pages/editCourse.html',
                controller: 'coursesCtrl'
            })
            .when('/lesson', {
                templateUrl: 'views/pages/lesson.html',
                controller: 'coursesCtrl'
            })
            .when('/activity', {
                templateUrl: 'views/pages/activity.html',
                controller: 'coursesCtrl'
            })
            .otherwise({
                redirectTo: 'views/pages/404'
            });
        $httpProvider.interceptors.push('authInterceptor');
    });

   