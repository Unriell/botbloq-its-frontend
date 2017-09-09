'use strict';

/**
 * @ngdoc service
 * @name botbloqItsFrontendApp.usersApi
 * @description
 * # usersApi
 * Service in the bitbloqApp.
 */
botBloqApp.service('usersApi', function($log, $q, $http, common) {

        $log.log('usersApi start');

        function signUp(name, email) {
            console.log(name, email);

            var signUpPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/students', {
                identification: {
                name: name,
                email: email
            }}).then(function(response) {
                console.log('token', response.data);
                common.questionnaire=response.data;
                localStorage.userToken = response.data.token; 
                getCurrentUser().then(function() {
                    signUpPromise.resolve();
                }, function(err) {
                    logout();
                    signUpPromise.reject(err);
                });
            }, function(err) {
                logout();
                signUpPromise.reject(err);
            });
            return signUpPromise.promise;
        }

        function sendQuestionnaire(idStudent,answers) {
            console.log("Respuestas para enviar (API): ",idStudent,answers);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/students/'+idStudent+'/init',{answers}).then(function(response) {
                console.log('ok despues de enviar formulario', response.data);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de enviar formulario',err);
            });
            return coursesPromise.promise;
        }

        function enrollStudent(idStudent,idCourse) { 
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse,{}).then(function(response) {
                    console.log('(API) ok despues de matricular al estudiante '+idStudent+' a un curso', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     console.log('error despues intentar matricular un estudiante en un curso',err);
            });
            return coursesPromise.promise;     
        }

        function assignStudentToGroup(idStudent) {
            console.log('asignando estudiante con id: '+idStudent+' a grupo. (userApi).');

            var assignGroupPromise = $q.defer();

            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/group', {}).then(function(response) {
                console.log('assignado estudiante a grupo correctamente (userApi).');
            }, function(err) {
                logout();
                assignGroupPromise.reject(err);
            });
            return assignGroupPromise.promise;
        }

        function isEnrolledInCourse(idStudent,idCourse) {
            return $http.get(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse+'/isEnrolled');    
        }
        function getActivityLesson(idStudent,idCourse) {
            return $http.get(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse);     
        }

        function getStudents() { 
          return $http.get( common.bitbloqBackendUrl + "/students" );      
        }
       
        function logout() {
            localStorage.userToken = null;
            exports.currentUser = {};
        }

        function getCurrentUser() {
            return $http.get(common.bitbloqBackendUrl + '/students').then(function(response) {
                exports.currentUser = response.data;
            });
        }

        function activeUser(user){
            common.activeUSer=user;
            common.nameActiveUser=user.identification.name;

           console.log('USUARIO ACTIVO CON ID: '+user._id+' y nombre: '+user.identification.name);
        }

        var exports = {
            currentUser : null,
            signUp: signUp,
            sendQuestionnaire : sendQuestionnaire,
            getStudents : getStudents,
            logout : logout,
            getCurrentUser : getCurrentUser,
            enrollStudent : enrollStudent,
            assignStudentToGroup : assignStudentToGroup,
            isEnrolledInCourse : isEnrolledInCourse,
            getActivityLesson : getActivityLesson,
            activeUser : activeUser
        };


        return exports;

    });