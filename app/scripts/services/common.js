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

  		var teacher=false,
            courseSelected={},
            objectivesCourse=[],
  			sectionsCourseSelected=[],
  			lessonsCourseSelected=[],
            lessonSelected={},
            indexLessonSelected='',
            activeUser={},
            nameActiveUser="",
            questionnaire={},
            newActivity={},
            actualViewCourses="",
            actualViewCourse="",
            selectLomsView="todos",
            addingLom=true,
            lomSelected={},
            lomsTeacher=[],
            enrolledInCourse=false,
            urlActivity = {src: "", title:"Loading activity."};

        $log.log('common start');

        return {
            bitbloqBackendUrl: bitbloqBackendUrl,
            teacher : teacher,
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
            actualViewCourse : actualViewCourse,
            selectLomsView : selectLomsView,
            addingLom : addingLom,
            lomSelected : lomSelected,
            lomsTeacher : lomsTeacher,
            enrolledInCourse : enrolledInCourse,
            urlActivity : urlActivity
        };

    });