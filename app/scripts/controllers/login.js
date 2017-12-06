'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */
botBloqApp.controller('loginCtrl', function($log,$q, $scope,$location, usersApi,teacherApi, common) {
        $log.log('login ctrl start');
        
         var resetCommonServices=function(){
            common.teacher=false,
            common.courseSelected={},
            common.objectivesCourse=[],
            common.sectionsCourseSelected=[],
            common.lessonsCourseSelected=[],
            common.lessonSelected={},
            common.indexLessonSelected='',
            common.activeUser={},
            common.nameActiveUser="",
            common.questionnaire={},
            common.newActivity={},
            common.actualViewCourses="",
            common.actualViewCourse="",
            common.selectLomsView="misLoms",
            common.addingLom=true,
            common.lomSelected={},
            common.lomsTeacher=[],
            common.enrolledInCourse=false,
            common.urlActivity = {};
        }
        resetCommonServices();
        $scope.changeInit(true); 
        $scope.registeredStudent={};
        $scope.questionnaire=common.questionnaire;
        $scope.login=true;
        $scope.teacher=false;
        $scope.user={
            "name": "",
            "email": "",
            "password": ""
        }
        $scope.emailError="";
        $scope.nameError="";
        $scope.passError="";
        $scope.loginError="";
        $scope.students=[];
        $scope.teachers=[];

        /*$scope.save = function() {
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
        };*/

        $scope.signUpIn=function(){
            resetError();
            if($scope.login){
                signIn();
            }else{
                signUp();
            }
        }
        var signUp = function() {
            if ($scope.signUpForm.$valid) {
                console.log("metodo signUpIn con variable teacher: ", $scope.teacher);
                if($scope.teacher){
                    console.log('Registrando profesor...');
                    teacherApi.signUpTeacher($scope.user.name,$scope.user.email,$scope.user.password,'teacher').then(function(response) {
                        console.log('Profesor registrado correctamente!', response);
                        confirm("PROFESOR REGISTRADO CORRECTAMENTE!");
                        $scope.login=true;        
                        resetForm();
                        resetError();
                    }, function(error) {
                        console.log('Error al registrar un profesor', error.data);
                        errorForm(error.data);
                    });
                }else{
                    console.log('Registrando usuario...');
                    usersApi.signUpStudent($scope.user.name, $scope.user.email,$scope.user.password,'student').then(function(response){
                        console.log('Usuario registrado correctamente!', response);
                        confirm("USUARIO REGISTRADO CORRECTAMENTE!");
                        $scope.login=true;        
                        resetForm();
                        resetError();
                    }, function(error) {
                        console.log('Error al registrar un usuario', error.data);
                        errorForm(error.data);
                    });
                }    
            } else {
                console.log('There are invalid fields');
            }
        };
        var signIn = function() {
            console.log('Iniciando sesión ...');    
            if ( $scope.user.name && $scope.user.password ) {
                if($scope.teacher){
                    console.log('Buscando estudiante con los datos proporcionados');
                    var promise=signInTeacher();
                    promise.then(function() {
                        common.teacher=$scope.teacher;
                        $location.path("/courses");
                    }, function(error) {
                        console.log('Se ha producido un error al obtener los profesores: '+error);     
                    });  
                }else{
                    console.log('Buscando estudiante con los datos proporcionados');
                    var promise=signInStudent();
                    promise.then(function() {
                        common.teacher=$scope.teacher;
                        $location.path("/questionnaire");
                    }, function(error) {
                        console.log('Se ha producido un error al obtener los estudiantes: '+error);     
                    });                  
                }    
            } 
            else if(!$scope.user.name && !$scope.user.password){
                $scope.nameError="Debe introducir un nombre o usuario";
                $scope.passError="Debe introducir una contraseña";
            }
            else if(!$scope.user.name){
                $scope.nameError="Debe introducir un nombre o usuario";
            }
            else {
                $scope.passError="Debe introducir una contraseña";
            }
        };
        var signInStudent = function (){
            var defered = $q.defer(),
                promise = defered.promise;
            let students=[],
                activeUser=null,
                access=false;
            usersApi.getStudents().then(function(response){
                console.log('Lista de Estudiantes: ',response.data);
                students= response.data;
                for (let i = 0; i < students.length; i++) {
                    if( (students[i].identification.name == $scope.user.name || students[i].identification.email == $scope.user.name) && (students[i].identification.password == $scope.user.password) ){
                        access = true;
                        activeUser=students[i];
                        break;
                    }
                }
                if(access){
                    console.log('Estudiante logueado correctamente. Estudiante activo: ',activeUser);
                    common.activeUSer=activeUser;
                    common.nameActiveUser=activeUser.identification.name;
                    $scope.changeActiveUserHeader(activeUser);
                    defered.resolve();
                } else {
                    $scope.loginError="El usuario introducido y contraseña no coinciden";   
                }     
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
            return promise; 
        }
        var signInTeacher = function (){
            var defered = $q.defer(),
                promise = defered.promise;
            let teachers=[],
                activeUser=null,
                access=false;
            teacherApi.getTeachers().then(function(response){
                console.log('Lista de Profesores: ',response.data);
                teachers= response.data;
                for (let i = 0; i < teachers.length; i++) {
                    if( (teachers[i].identification.name == $scope.user.name || teachers[i].identification.email == $scope.user.name) && (teachers[i].identification.password == $scope.user.password) ){
                        access = true;
                        activeUser=teachers[i];
                        break;
                    }
                }
                if(access){
                    console.log('Profesor logueado correctamente. Profesor activo: ',activeUser);
                    common.activeUSer=activeUser;
                    common.nameActiveUser=activeUser.identification.name;
                    $scope.changeActiveUserHeader(activeUser);
                    defered.resolve();
                } else {
                    $scope.loginError="El profesor introducido y contraseña no coinciden";   
                } 
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
            return promise;     
        }

        $scope.LoginSignUP=function(){
            $scope.login = !$scope.login;
            resetForm();
            resetError()
        }
        var errorForm= function(error){
            if( (error.indexOf('Todos') > -1) ){
                $scope.nameError="El campo nombre es requerido";
                $scope.emailError="El campo email es requerido";
                $scope.passError="El campo password es requerido";
            }
            else if( !(error.indexOf('nombre') > -1) && (error.indexOf('email') > -1) && (error.indexOf('password') > -1) ){
                $scope.emailError="El campo email es requerido";
                $scope.passError="El campo password es requerido";
            }
            else if( (error.indexOf('nombre') > -1) && !(error.indexOf('email') > -1) && (error.indexOf('password') > -1) ){
                $scope.nameError="El campo nombre es requerido";
                $scope.passError="El campo password es requerido";
            }
            else if( (error.indexOf('nombre') > -1) && (error.indexOf('email') > -1) && !(error.indexOf('password') > -1) ){
                $scope.nameError="El campo nombre es requerido";
                $scope.emailError="El campo email es requerido";
            }
            else if( (error.indexOf('nombre') > -1) ){
                $scope.nameError=error;
            }
            else if( (error.indexOf('email') > -1) ){
                $scope.emailError=error;
            }
            else if( (error.indexOf('password') > -1) ){
                $scope.passError=error;
            }     
        }

        var resetForm= function(){
            $scope.user= {};
            $scope.teacher=false;
        }
        var resetError= function(){
            $scope.nameError= "";
            $scope.emailError= "";
            $scope.passError="";
            $scope.loginError="";
        }


        var getStudents= function() {
            var defered = $q.defer(),
                promise = defered.promise;
            console.log('loading students ...');        
            var students=[];
            usersApi.getStudents().then(function(response){
                console.log('Lista de Estudiantes: ',response.data);
                $scope.students= response.data;
                defered.resolve();
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
            return promise;
        };

        var getTeachers= function() {
            var defered = $q.defer(),
                promise = defered.promise;
            console.log('loading teachers ...');        
            var students=[];
            teacherApi.getTeachers().then(function(response){
                console.log('Lista de profesores: ',response.data);
                $scope.teachers= response.data;
                defered.resolve();
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
            return promise;
        };

        $scope.deleteAllStudents = function(e){
            console.log('eliminado estudiantes');
            if (confirm("¿ESTÁ DISPUESTO A ELIMINAR TODOS LOS ESTUDIANTES?") === false) {
                e.preventDefault();
                return;
            }
            usersApi.removeAllStudents().then(function(response) {
                    alert('Eliminados todos los estudiantes con éxito');
                }, function(error) {
                    console.log('error al eliminar todos los items', error);
             });
        };
        $scope.deleteAllTeachers = function(e){
            console.log('eliminado profesores');
            if (confirm("¿ESTÁ DISPUESTO A ELIMINAR TODOS LOS PROFESORES?") === false) {
                e.preventDefault();
                return;
            }
            teacherApi.removeAllTeachers().then(function(response) {
                    alert('Eliminados todos los profesores con éxito');
                }, function(error) {
                    console.log('error al eliminar todos los items', error);
             });
        };
    });