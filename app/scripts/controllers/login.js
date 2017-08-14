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
			console.log('Teacher :' + $scope.teacher);
			
            if ($scope.signUpForm.$valid) {
				// if the user is a teacher
				if ($scope.teacher) {
					usersApi.signUpTeacher($scope.user.name, $scope.user.email).then(function(response) {
						console.log('Profesor registrado correctamente!');
						$location.path('/courses');
					}, function(error) {
						console.log('Error al registrar un usuario', error);
					});
					
				} else { // if the user is a student
					usersApi.signUpStudent($scope.user.name, $scope.user.email).then(function(response) {
						console.log('Estudiante registrado correctamente!');
						console.log(common.questionnaire.id_student);
						$scope.questionnaire=common.questionnaire;
						var defaultpath = "/questionnaire"
						if (common.questionnaire.nuevo == 0) {
							defaultpath = "/courses";
						}
						var promise=getStudent(common.questionnaire.id_student);
						promise.then(function() {
							console.log('se actualizo el ultimo estudiante registrado correctamente: ', $scope.registeredStudent);
							usersApi.activeUser($scope.registeredStudent);
							$location.path(defaultpath);
						}, function(error) {
							console.log('Se ha producido un error al obtener los estudiantes: '+error);     
						});
						
					}, function(error) {
						console.log('Error al registrar un usuario', error);
					});
				}
            } else {
                console.log('There are invalid fields');
            }
        };

         
		var getStudent= function(idStudent) {
            var defered = $q.defer(),
                promise = defered.promise;
            console.log('get student ...');        
            var students=[];
            usersApi.getStudent(idStudent).then(function(response){
                $scope.registeredStudent=response.data
                console.log('Usuario se llama: ',$scope.registeredStudent.identification.name);
                defered.resolve();
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
            return promise;
        };

    });