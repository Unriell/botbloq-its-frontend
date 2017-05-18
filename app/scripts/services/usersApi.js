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

        function login(email, password) {
            $log.debug(email, password);

            var loginPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/students', {
                identification: {
                email: email,
                name: password
            }}).then(function(response) {
                $log.debug('token', response.data.token);
                localStorage.userToken = response.data.token; 
                getCurrentUser().then(function() {
                    loginPromise.resolve();
                }, function(err) {
                    logout();
                    loginPromise.reject(err);
                });
            }, function(err) {
                logout();
                loginPromise.reject(err);
            });
            return loginPromise.promise;
        }

        function enrollStudent(idStudent,idCourse) { 
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse,
                {}).then(function(response) {
                    $log.debug('ok despues de matricular al estudiante '+idStudent+' a un curso', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     $log.debug('error despues intentar matricular un estudiante en un curso',err);
            });
            return coursesPromise.promise;     
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

        var exports = {
            currentUser: null,
            login: login,
            getStudents, getStudents,
            logout: logout,
            getCurrentUser: getCurrentUser,
            enrollStudent: enrollStudent
        };


        return exports;

    });