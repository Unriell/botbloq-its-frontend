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
            actualViewCourses="totalCoursesPage",
            addingLom=true,
            lomSelected={},
            urlActivity = {src: "", title:"Loading activity."};;

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
            actualViewCourses : actualViewCourses,
            addingLom : addingLom,
            lomSelected : lomSelected,
            urlActivity : urlActivity
        };

    });