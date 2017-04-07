'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('studentsCtrl',
                         function($log, $scope,$http,$location,userApi, knowledge) {
        $log.log('student ctrl start');

        $scope.showStudents= function() {
            $log.debug('loading students ...');
            userApi.getStudents().then(function(response){
                   $scope.students= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
        };
       
        
    });