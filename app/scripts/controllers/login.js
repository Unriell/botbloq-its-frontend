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

        /* login del estudiante */

        $scope.login = function() {
        	console.log('Login usuario...');
        	console.log('is a teacher? :' + $scope.teacher);
        	if ($scope.signUpForm.$valid) {
        		if ($scope.teacher) {
        			var promise = loginTeacher($scope.user.name, $scope.user.email);
					promise.then(function() {
							console.log('Profesor logeado correctamente correctamente: ');
							$location.path('/teacher');
					}, function(error) {
							console.log('Se ha producido un error al obtener a los profesores: '+error);     
							alert('Usuario no registrado'); 
					});
				} else {
					var promise = loginStudent($scope.user.name, $scope.user.email);
					promise.then(function() {
							console.log('Estudiante logeado correctamente: ');
							common.actualViewCourses = "totalCoursesPage";
							$location.path('/courses');
					}, function(error) {
							console.log('Se ha producido un error al obtener a los estudiantes: '+error);     
							alert('Usuario no registrado'); 
					});

				}
			}

        }

        $scope.signUp = function() {
            console.log('Registrando usuario...');
			console.log('Teacher :' + $scope.teacher);
			
            if ($scope.signUpForm.$valid) {
				// if the user is a teacher
				if ($scope.teacher) {
					usersApi.signUpTeacher($scope.user.name, $scope.user.email).then(function(response) {
						console.log('Profesor registrado correctamente!');
						$location.path('/teacher');
					}, function(error) {
						alert('Error al registrar un usuario', error);
					});
						
				} else { // if the user is a student
					usersApi.signUpStudent($scope.user.name, $scope.user.email).then(function(response) {
						console.log('Estudiante registrado correctamente!');
						console.log(common.questionnaire.id_student);
						$scope.questionnaire=common.questionnaire;
						var promise=getStudent(common.questionnaire.id_student);
						promise.then(function() {
								console.log('Estudiante registrado correctamente: ', $scope.registeredStudent);
								usersApi.activeUser($scope.registeredStudent);
								$location.path("/questionnaire");
						}, function(error) {
								console.log('Se ha producido un error al obtener al estudiante: '+error);     
						});
							
					}, function(error) {
							alert('Error al registrar un usuario', error);
					});
				}
            } else {
                alert('Campos con valores inválidos');
            }
        };

        /**
		* retrieve student by id
		*/
		var getStudent= function(idStudent) {
            var defered = $q.defer(),
                promise = defered.promise;
            console.log('get student ...');        
            usersApi.getStudent(idStudent).then(function(response){
                $scope.registeredStudent=response.data
                console.log('Usuario se llama: ',$scope.registeredStudent.identification.name);
                defered.resolve();
            }, function myError(err) {
                console.log(err);
                alert('Error al bbtener datos del estudiante');      
            });
            return promise;
        };
		
		/**
		* retrieve all the students
		*/
		var loginStudent= function(name,email) {
            var defered = $q.defer(),
                promise = defered.promise;
            var students=[];
            usersApi.getStudents().then(function(response){
                students= response.data;
				var enc = false;
				for (var i = 0; i < students.length; i++) {
					if(students[i].identification.name == name) {
						enc = true;
						break;
					}
				}
				if (enc) {
					console.log(students[i]);
					$scope.registeredStudent = students[i];
					//exports.currentUser = response.data;
					usersApi.activeUser(students[i]);
					defered.resolve();
				} else {
					alert('Estudiante no Existente');   
				}
            }, function myError(err) {
                console.log(err);
                alert('Error al cargar a los estudiantes: '+err.status);      
            });
            return promise;
        };
		
		/*
		* -...
		*/
		var loginTeacher= function(name, email) {
            var defered = $q.defer(),
                promise = defered.promise;
            var teachers =[];
            usersApi.getTeachers().then(function(response){
                teachers = response.data;
				var enc = false;
				for (var i = 0; i < teachers.length; i++) {
					if(teachers[i].identification.name == name) {
						enc = true;
						break;
					}
				}
				if (enc) {
					console.log(teachers[i]);
					//exports.currentUser = response.data;
					usersApi.activeUser(teachers[i]);
					defered.resolve();
				} else {
					alert('Profesor no Existente');   
				}
            }, function myError(err) {
                console.log(err);
                alert('Error al cargar profesores: '+err.status);      
            });
            return promise;
        };

    });