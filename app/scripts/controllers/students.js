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
        
        $scope.registeredStudent={};
        usersApi.getStudents().then(function(response){
                $scope.students= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
        });

        $scope.updateStudents= function() {
            $log.debug('loading students ...');
            usersApi.getStudents().then(function(response){
                   $scope.students= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        var getStudents= function() {
            var defered = $q.defer(),
                promise = defered.promise;
            console.log('loading students ...');        
            var students=[];
            usersApi.getStudents().then(function(response){
                students= response.data;
                $scope.registeredStudent=students[students.length -1];
                console.log('Usuario nuevo se llama: ',$scope.registeredStudent.identification.name);
                defered.resolve();
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
            return promise;
        };

        $scope.signUp = function() {
            console.log('Registrando usuario...');
            if ($scope.signUpForm.$valid) {
                usersApi.signUp($scope.user.name, $scope.user.email).then(function(response) {
                    console.log('Usuario registrado correctamente!', response);
                    var promise=getStudents();
                    promise.then(function() {
                        $log.debug('se actualizo el ultimo estudiante registrado correctamente: ', $scope.registeredStudent.identification.name);
                        $scope.activeUser($scope.registeredStudent);
                        $location.path("/courses");
                    }, function(error) {
                        $log.debug('Se ha producido un error al obtener los estudiantes: '+error);     
                    });
                }, function(error) {
                    console.log('Error al registrar un usuario', error);
                });
            } else {
                console.log('There are invalid fields');
            }
        };

        $scope.activeUser=function(user){
            common.activeUSer=user;
            common.nameActiveUser=user.identification.name;

           console.debug('USUARIO ACTIVO CON ID: '+user._id+' y nombre: '+user.identification.name);
        };

        $scope.iSActiveUSer=function(user){
            return angular.equals(user, common.activeUSer);
        };

        var updateStudents=function(){
            $log.debug('Actualizando usuarios');
            usersApi.getStudents().then(function(response){
                $scope.students= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });     
        };
        
    });