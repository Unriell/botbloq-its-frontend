'use strict';
angular.module('botbloqItsFrontendApp')
    .service('authInterceptor', function($log, $q) {
        return {
            // Add authorization token to headers
            'request': function(config) {
                config.headers = config.headers || {};
                if (localStorage.userToken) {
                    if (!config.skipAuthorization) {
                        config.headers.Authorization = 'Bearer ' + localStorage.userToken;
                    }
                }
                return config;
            },
            'responseError': function(rejection) {
                // do something on error
                $log.debug('responseError', rejection);
                switch (rejection.status) {
                    case 0: //server null

                        break;
                    case 500: //Internal Server Error

                        break;
                    case 504: //Gateway Timeout

                        break;
                }
                return $q.reject(rejection);
            }
        };
    });