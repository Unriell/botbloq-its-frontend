'use strict';

/**
 * @ngdoc service
 * @name bitbloqApp.common
 * @description
 * # common
 * Service in the bitbloqApp.
 */
botBloqApp.service('common', function($log, envData) {

        var bitbloqBackendUrl =  envData.serverUrl_; 
        console.log(bitbloqBackendUrl);
  		var courseSelected={},
            objectivesCourse=[],
  			sectionsCourseSelected=[],
  			lessonsCourseSelected=[],
            lessonSelected={},
            indexLessonSelected='',
            activeUser={},
            nameActiveUser="",
            questionnaire={},
            newActivity={},
            lom = "",
            actualViewCourses="totalCoursesPage";

        $log.log('common start');

        return {
            bitbloqBackendUrl: bitbloqBackendUrl,
            courseSelected: courseSelected, 
            sectionsCourseSelected: sectionsCourseSelected,
            lessonsCourseSelected: lessonsCourseSelected,
            lessonSelected : lessonSelected,
            indexLessonSelected : indexLessonSelected,
            activeUser: activeUser,
            nameActiveUser: nameActiveUser,
            objectivesCourse: objectivesCourse,
            questionnaire : questionnaire,
            newActivity : newActivity,
            lom: lom,
            actualViewCourses : actualViewCourses
        };

    });