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
        'ngTouch',
        'config'
    ])
    .config(function($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
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
            .when('/courses', {
                templateUrl: 'views/pages/courses.html',
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
            .when('/teacher', {
                templateUrl: 'views/pages/teacher.html',
                controller: 'teacherCtrl'
            })
            .when('/addCourse', {
                templateUrl: 'views/pages/addCourse.html',
                controller: 'teacherCtrl'
            })
            .when('/editCourse', {
                templateUrl: 'views/pages/editCourse.html',
                controller: 'teacherCtrl'
            })
            .when('/viewCourse', {
                templateUrl: 'views/pages/viewcourse.html',
                controller: 'teacherCtrl'
            }) 
            .when('/viewActivity', {
                templateUrl: 'views/pages/viewactivity.html',
                controller: 'teacherCtrl'
            }) 
            .otherwise({
                redirectTo: 'views/404.html'
            });
        $httpProvider.interceptors.push('authInterceptor');
    });

   