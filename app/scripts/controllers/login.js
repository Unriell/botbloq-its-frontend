'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */
botBloqApp.controller('loginCtrl', function($log,$q, $scope,$location, usersApi, common) {
        $log.log('login ctrl start');
        $scope.changeInit(true); 
        $scope.registeredStudent={};
        $scope.questionnaire=common.questionnaire;

        $scope.save = function() {
            if ($scope.userForm.$valid) {
                console.log('saving...');
                usersApi.signUp($scope.user.name, $scope.user.password).then(function(response) {
                    console.log('ok', response);
                }, function(error) {
                    console.log('error', error);
                });
            } else {
                console.log('There are invalid fields');
            }
        };

        $scope.reset = function() {
            $scope.user = { name: '', password: '' };
        };

         $scope.signUp = function() {
            console.log('Registrando usuario...');
            if ($scope.signUpForm.$valid) {
                usersApi.signUp($scope.user.name, $scope.user.email).then(function(response) {
                    console.log('Usuario registrado correctamente!', response);
                    console.log('---------Cuestionario common:',common.questionnaire);
                    $scope.questionnaire=common.questionnaire;
                    var promise=getStudents();
                    promise.then(function() {
                        console.log('se actualizo el ultimo estudiante registrado correctamente: ', $scope.registeredStudent.identification.name);
                        usersApi.activeUser($scope.registeredStudent);
                        $location.path("/questionnaire");
                    }, function(error) {
                        console.log('Se ha producido un error al obtener los estudiantes: '+error);     
                    });
                }, function(error) {
                    console.log('Error al registrar un usuario', error);
                });
            } else {
                console.log('There are invalid fields');
            }
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
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
            return promise;
        };

    });