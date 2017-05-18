'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('studentsCtrl',
                         function($log, $scope,$http,$location,usersApi, knowledge, common) {
        $log.log('student ctrl start');


        usersApi.getStudents().then(function(response){
                $scope.students= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
        });

        $scope.showStudents= function() {
            $log.debug('loading students ...');
            usersApi.getStudents().then(function(response){
                   $scope.students= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        $scope.activeUser=function(user){
            common.activeUSer=user;
            common.nameActiveUser=user.identification.name;

            $log.debug('USUARIO ACTIVO CON ID: '+user._id+' y nombre: '+user.identification.name);
        };
       
        $scope.iSActiveUSer=function(user){
            return angular.equals(user, common.activeUSer);
        };
        
    });