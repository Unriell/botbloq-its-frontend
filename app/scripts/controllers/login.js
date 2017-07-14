'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */
botBloqApp.controller('loginCtrl', function($log, $scope,$location, usersApi) {
        $log.log('login ctrl start');

        $scope.save = function() {
            if ($scope.userForm.$valid) {
                $log.debug('saving...');
                usersApi.signUp($scope.user.name, $scope.user.password).then(function(response) {
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