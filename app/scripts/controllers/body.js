'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:BodyCtrl
 * @description
 * # BodyCtrl
 * Controller of the botbloqItsFrontendApp
 */
angular.module('botbloqItsFrontendApp')
    .controller('BodyCtrl', function($scope, common, $log, userApi) {
        $log.log('body ctrl start');
        $scope.userApi = userApi;
    });