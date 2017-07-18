'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('studentsCtrl',
                         function($log,$q,$scope,$http,$location,usersApi, knowledge, common) {
        $log.log('student ctrl start');
        $scope.changeInit(false); 

        $scope.questionnaire=common.questionnaire;
        console.log('----- Valor de cuestionario: ',common.questionnaire.id_student);

        usersApi.getStudents().then(function(response){
                $scope.students= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        });

        $scope.updateStudents= function() {
            console.log('loading students ...');
            usersApi.getStudents().then(function(response){
                   $scope.students= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        $scope.activeUser=function(user){
            usersApi.activeUser(user);
        };

        $scope.iSActiveUSer=function(user){
            return angular.equals(user, common.activeUSer);
        };

        var updateStudents=function(){
            console.log('Actualizando usuarios');
            usersApi.getStudents().then(function(response){
                $scope.students= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });     
        };
        
    });