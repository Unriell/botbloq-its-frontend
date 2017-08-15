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
        

        /* add new course */
        function addCourse(course) {
            console.log("Objeto para hacer el post course: " +  course);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/', {
                name: course.name,
                code: course.code,
                summary: course.summary,
                photo: course.photo,
                author: course.author, 
                objectives: course.objectives,
                sections: course.sections,
                statistics:  {},
                history: ''
            }).then(function(response) {
                console.log('ok despues de post course', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de post course',err);
            });
            return coursesPromise.promise;
        }

        /* remove course */
        function removeCourse(idCourse) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses/"+idCourse);      
        }
        

        var exports = {
            getCourses : getCourses,
            addCourse : addCourse,
            removeCourse : removeCourse
      /*    getCourses : getCourses,
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