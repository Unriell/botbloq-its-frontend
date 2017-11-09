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

        function signUpStudent(name, email, pass,userRole) {
            
            var signUpPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/students', {
                identification: {
                    name: name,
                    email: email,
                    password: pass
                },
                role: userRole
            }).then(function(response) {
                console.log('token', response);
                signUpPromise.resolve();
            }, function(err) {
                logout();
                signUpPromise.reject(err);
            });
            return signUpPromise.promise;
        } 

        function signInStudent(name, pass) {
            console.log(name, pass);

            var signUpPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/students', {
                identification: {
                name: name,
                email: pass
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
        function unEnrollStudent(idStudent,idCourse) { 
            var coursesPromise = $q.defer();
            $http.delete(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse,{}).then(function(response) {
                    console.log('(API) ok despues de desmatricular al estudiante '+idStudent+' a un curso', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     console.log('error despues intentar desmatricular un estudiante en un curso',err);
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

        function editStudent(idStudent,studentName,studentEmail,studentPassword) {
            var coursesPromise = $q.defer();      
            //Si no estan repeditos este nombres y email
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent, {
                identification: {
                    name: studentName,
                    email: studentEmail,
                    password: studentPassword,
                }
            }).then(function(response) {
                console.log('ok despues de editar-post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de editar-post',err);
            });
            return coursesPromise.promise;
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
        function getStudent(idStudent) { 
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent );      
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

        function removeAllStudents() { 
          return $http.delete(common.bitbloqBackendUrl + "/students");      
        }

        var exports = {
            currentUser : null,
            signUpStudent: signUpStudent,
            sendQuestionnaire : sendQuestionnaire,
            getStudent :getStudent,
            getStudents : getStudents,
            logout : logout,
            getCurrentUser : getCurrentUser,
            enrollStudent : enrollStudent,
            unEnrollStudent : unEnrollStudent,
            assignStudentToGroup : assignStudentToGroup,
            isEnrolledInCourse : isEnrolledInCourse,
            editStudent : editStudent,
            getActivityLesson : getActivityLesson,
            removeAllStudents : removeAllStudents
        };


        return exports;

    });