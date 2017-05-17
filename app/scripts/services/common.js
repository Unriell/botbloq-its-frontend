'use strict';

/**
 * @ngdoc service
 * @name bitbloqApp.common
 * @description
 * # common
 * Service in the bitbloqApp.
 */
botBloqApp.service('common', function($log) {

        var bitbloqBackendUrl = 'http://localhost:8000/botbloq/v1/its';

  		var courseSelected=null,
  			sectionsCourseSelected=[],
  			lessonsCourseSelected=[];

        $log.log('common start');

        return {
            bitbloqBackendUrl: bitbloqBackendUrl,
            courseSelected: courseSelected, 
            sectionsCourseSelected: sectionsCourseSelected,
            lessonsCourseSelected: lessonsCourseSelected
        };

    });