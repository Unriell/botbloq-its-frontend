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
                console.log('ok despues de post course', response.data);
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

        /* edit course */
        function editCourse(course) {
            console.log("Objeto para editar (SERVICE): "+course );
            var coursesPromise = $q.defer();
            console.log('id de item a editar (antes de llamada)', course._id);
            $http.put(common.bitbloqBackendUrl + '/courses/'+ course._id, {
                name: course.name,
                code: course.code,
                summary: course.summary,
                photo: course.photo,
                author: course.author, 
                //objectives: course.objectives,
                //sections: course.sections,
                //statistics:  course.statistics,
                //history: course.history
            }).then(function(response) {
                console.log('ok despues de editar-post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de editar-post',err);
            });
            return coursesPromise.promise;
        }
        /* add lom **/
        function addLom(lom_title, lom_url) {
        
            var lomsPromise = $q.defer();
            var lom_id = '';

            $http.post(common.bitbloqBackendUrl + '/loms', {
                general: {
                    title: lom_title,
                    language: 'es',
                    structure: 'complex',
                },
                metadata: {
                    contribution_type: 'web',
                },
                technical: {
                    format: "'application/html'", 
                    url: lom_url     
                },
                use: {
                    interactivity_type: 'expositive' ,
                    interactivity_level: 'medium',
                    language: 'Spanish',
                    resource_type: 'multimedia',
                    resource_context: 'school',
                    resource_difficulty: 'medium'
                }
            }).then(function(response) {
                console.log('lom creado', response.data);
                var result = response.data.split(" ");
                common.lom = result[result.length - 1];
                console.log("id : " + common.lom);
                lomsPromise.resolve();  
            }, function(err) {
                 console.log('error despues de post',err);
            });
            return lomsPromise.promise;
        }

        

        var exports = {
            getCourses : getCourses,
            addCourse : addCourse,
            removeCourse : removeCourse,
            editCourse : editCourse,
            addLom: addLom
      /*    getCourses : getCourses,
            getSections :getSections,
            getSection :getSection,
            getCourse : getCourse,
            getLessons: getLessons,
            removeItem : removeItem,
            removeAllItem : removeAllItem,
            
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