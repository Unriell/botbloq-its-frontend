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
            $log.debug(name, email);

            var signUpPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/students', {
                identification: {
                name: name,
                email: email
            }}).then(function(response) {
                $log.debug('token', response.data.token);
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

        function enrollStudent(idStudent,idCourse) { 
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse,{}).then(function(response) {
                    $log.debug('ok despues de matricular al estudiante '+idStudent+' a un curso', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     $log.debug('error despues intentar matricular un estudiante en un curso',err);
            });
            return coursesPromise.promise;     
        }

        function assignStudentToGroup(idStudent) {
            $log.debug('asignando estudiante con id: '+idStudent+' a grupo. (userApi).');

            var assignGroupPromise = $q.defer();

            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/group', {}).then(function(response) {
                $log.debug('assignado estudiante a grupo correctamente (userApi).');
            }, function(err) {
                logout();
                assignGroupPromise.reject(err);
            });
            return assignGroupPromise.promise;
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

            console.debug('USUARIO ACTIVO CON ID: '+user._id+' y nombre: '+user.identification.name);
        }

        var exports = {
            currentUser: null,
            signUp: signUp,
            getStudents, getStudents,
            logout: logout,
            getCurrentUser: getCurrentUser,
            enrollStudent: enrollStudent,
            assignStudentToGroup: assignStudentToGroup,
            activeUser : activeUser
        };


        return exports;

    });