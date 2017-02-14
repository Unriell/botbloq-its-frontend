'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */
angular.module('botbloqItsFrontendApp')
    .controller('loginCtrl', function($log, $scope, userApi) {
        $log.log('login ctrl start');

        $scope.save = function() {
            if ($scope.userForm.$valid) {
                $log.debug('saving...');
                userApi.login($scope.user.name, $scope.user.password).then(function(response) {
                    $log.debug('ok', response);
                }, function(error) {
                    $log.debug('error', error);
                });
            } else {
                $log.debug('There are invalid fields');
            }
        };

        $scope.reset = function() {
            $scope.user = { name: '', password: '' };
        };
    });