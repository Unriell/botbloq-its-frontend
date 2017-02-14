'use strict';

/**
 * @ngdoc service
 * @name bitbloqApp.common
 * @description
 * # common
 * Service in the bitbloqApp.
 */
angular.module('botbloqItsFrontendApp')
    .service('common', function($log) {

        var bitbloqBackendUrl = 'http://localhost:8000/bitbloq/v1/';

        $log.log('common start');

        return {
            bitbloqBackendUrl: bitbloqBackendUrl
        };

    });