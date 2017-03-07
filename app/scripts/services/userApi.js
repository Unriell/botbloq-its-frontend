'use strict';

/**
 * @ngdoc service
 * @name botbloqItsFrontendApp.userApi
 * @description
 * # userApi
 * Service in the bitbloqApp.
 */
angular.module('botbloqItsFrontendApp')
    .service('userApi', function($log, $q, $http, common) {

        $log.log('userApi start');


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
            logout: logout,
            getCurrentUser: getCurrentUser
        };


        return exports;

    });