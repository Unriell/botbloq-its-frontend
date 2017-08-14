'use strict';

/**
 * @ngdoc service
 * @name botbloqItsFrontendApp.coursesApi
 * @description
 * # coursesApi
 * Service in the bitbloqApp.
 */
botBloqApp.service('teacherApi', function($log, $q, $http, common) {

        $log.log('teacherApi start');

        /* retrieve the full set of courses */
        function getCourses() { 
          return $http.get( common.bitbloqBackendUrl + "/courses/" );      
        }
        
        

        var exports = {
            getCourses : getCourses
    /*
            addCourse : addCourse,
            getCourses : getCourses,
            getSections :getSections,
            getSection :getSection,
            getCourse : getCourse,
            getLessons: getLessons,
            removeItem : removeItem,
            removeAllItem : removeAllItem,
            editCourse : editCourse,
            editSection: editSection,
            addObjectivesToCourse : addObjectivesToCourse,
            addObjectivesToSection : addObjectivesToSection,
            addObjectivesToLesson : addObjectivesToLesson,
            assignLomsLesson : assignLomsLesson,
            addSection : addSection,
            addLesson : addLesson,
            okEndLesson : okEndLesson,
            badEndLesson : badEndLesson,
            pauseLesson : pauseLesson,
            getNextLesson : getNextLesson,
            getNewActivity : getNewActivity,
			getActivityLesson : getActivityLesson,
            getStudentsCoursesActives: getStudentsCoursesActives,
            getStudentsCoursesFinished: getStudentsCoursesFinished,
            getStudentsCoursesUnfinished: getStudentsCoursesUnfinished,
            getAllStudentsCourses: getAllStudentsCourses
            */
        };

        return exports;

    });