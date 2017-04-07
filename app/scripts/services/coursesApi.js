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

        function addCourse(courseName,courseCode,courseSummary,objectives, statistics, courseHistory) {
            $log.debug("Objetos para hacer post: "+ courseName,courseCode,courseSummary,
                                 objectives, statistics, courseHistory);

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
                },
                sections  : null,
                statistics: null,
                history: courseHistory
            }).then(function(response) {
                $log.debug('ok despues de post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post',err);
            });
            return coursesPromise.promise;
        }
        function addSection(idCourse) {
            $log.debug("Objetos para hacer post: "+ courseName,courseCode,courseSummary,
                                 objectives, statistics, courseHistory);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse, { 
                sections  : null
                history: courseHistory
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
        function getCourse(item) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+item._id );      
        }
        function removeItem(item) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses/"+item );      
        }
        function removeAllItem(item) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses");      
        }
       
        var exports = {
            addCourse : addCourse,
            getCourses : getCourses,
            getCourse : getCourse,
            removeItem : removeItem,
            removeAllItem : removeAllItem,
            editCourse : editCourse,
            asignLomsLesson : asignLomsLesson
        };

        return exports;

    });