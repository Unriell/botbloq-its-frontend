'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LandingCtrl
 * @description
 * # LandingCtrl
 * Controller of the botbloqItsFrontendApp
 */
angular.module('botbloqItsFrontendApp')
    .controller('landingCtrl', function($log, $scope) {
        $log.log('landing ctrl start');
        $scope.hi = 'hi';
    });