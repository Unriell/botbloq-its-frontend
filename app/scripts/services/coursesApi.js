'use strict';

/**
 * @ngdoc service
 * @name botbloqItsFrontendApp.coursesApi
 * @description
 * # coursesApi
 * Service in the bitbloqApp.
 */
botBloqApp.service('coursesApi', function($log, $q, $http, common) {

        $log.log('coursesApi start');

        function addCourse(courseName,courseCode,courseSummary,objectives) {
            $log.debug("Objetos para hacer post: "+ courseName,courseCode,courseSummary,
                                 objectives);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses', {
                name: courseName,
                code: courseCode,
                summary: courseSummary,
                objectives: {
                    code: objectives.code,
                    description: objectives.description,
                    level: objectives.level,
                    bloom: objectives.bloom
                }
                //sections  : null,
                //statistics: null,
                //history: null
            }).then(function(response) {
                $log.debug('ok despues de post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post',err);
            });
            return coursesPromise.promise;
        }
        function addSection(idCourse, sectionsName,sectionsSummary,sectionsObjectives) {
            $log.debug("Objetos para hacer post: "+ idCourse, sectionsName,sectionsSummary,sectionsObjectives);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse, { 
                name: sectionsName,
                summary: sectionsSummary,
                objectives: {
                    code: sectionsObjectives.code,
                    description: sectionsObjectives.description,
                    level: sectionsObjectives.level,
                    bloom: sectionsObjectives.bloom
                },              
                lessons:null
            }).then(function(response) {
                $log.debug('ok despues de post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post',err);
            });
            return coursesPromise.promise;
        }

        function addLesson(idCourse, idSection, lessonName,lessonSummary,lessonObjectives, learningPath, lessonDificulty, lessonType) {
            $log.debug("Objetos para hacer post: "+ idCourse,idSection,lessonName,lessonSummary,lessonObjectives,learningPath,lessonDificulty,lessonType);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse, { 
                name:lessonName, 
                summary: lessonSummary ,  
                 objectives: {
                    code: lessonObjectives.code,
                    description: lessonObjectives.description,
                    level: lessonObjectives.level,
                    bloom: lessonObjectives.bloom
                },  
                learning_path: learningPath,
                dificulty: lessonDificulty,
                type: lessonType,
                loms : null,
            }).then(function(response) {
                $log.debug('ok despues de post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post',err);
            });
            return coursesPromise.promise;
        }

        function asignLomsLesson(idCourse,idSection,idLesson,idLom) { 
            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+idSection+'/lesson/'+idLesson+'/lom/'+idLom, {
           
            }).then(function(response) {
                $log.debug('ok despues de post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post',err);
            });
            return coursesPromise.promise;     
        }
        
        function editCourse(idItem,courseName,courseCode,courseSummary,objectives, statistics, courseHistory) {
            $log.debug("Objetos para editar: "+ courseName,courseCode,courseSummary,
                                 objectives, statistics, courseHistory);

            var coursesPromise = $q.defer();
            $log.debug('id de item a editar (antes de llamada)', idItem);
            $http.put(common.bitbloqBackendUrl + '/courses/'+idItem, {
                name: courseName,
                code: courseCode,
                summary: courseSummary,
                objectives: {
                    code: objectives.code,
                    description: objectives.description,
                    level: objectives.level,
                    bloom: objectives.bloom
                },
                statistics: {
                    std_enrolled: statistics.std_enrolled,
                    std_finished: statistics.std_finished,
                    std_unenrolled: statistics.std_unenrolled     
                },
                history: courseHistory
            }).then(function(response) {
                $log.debug('ok despues de editar-post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de editar-post',err);
            });
            return coursesPromise.promise;
        }

        function getCourses() { 
          return $http.get( common.bitbloqBackendUrl + "/courses/" );      
        }
        function getCourse(idCourse) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse._id );      
        }
        function getSections(idCourse) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/course/"+idCourse+"/sections" );      
        }
        function getSection(idCourse,idSection) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/course/"+idCourse+"/section/"+idSection);      
        }
        function removeItem(idCourse) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses/"+idCourse);      
        }
        function removeAllItem(item) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses");      
        }
       
        var exports = {
            addCourse : addCourse,
            getCourses : getCourses,
            getSections :getSections,
            getSection :getSection,
            getCourse : getCourse,
            removeItem : removeItem,
            removeAllItem : removeAllItem,
            editCourse : editCourse,
            asignLomsLesson : asignLomsLesson,
            addSection : addSection,
            addLesson : addLesson
        };

        return exports;

    });