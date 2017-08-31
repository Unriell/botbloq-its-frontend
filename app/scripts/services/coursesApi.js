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

        
        function okEndLesson(idStudent,idCourse,idLom) {
            console.log("Objetos para finalizar correctamente una lección(SERVICE) : ",idStudent,idCourse,idLom);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse+'/lom/'+idLom+'/ok', { 
                
            }).then(function(response) {
                console.log('ok despues finalizar correctamente una lección', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues finalizar correctamente una lección',err);
            });
            return coursesPromise.promise;
        }
  
        function badEndLesson(idStudent,idCourse,idLom) {
            console.log("Objetos para finalizar incorrectamente una lección(SERVICE) : ",idStudent,idCourse,idLom);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse+'/lom/'+idLom+'/nok', { 
                
            }).then(function(response) {
                console.log('ok despues finalizar incorrectamente una lección', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues finalizar incorrectamente una lección',err);
            });
            return coursesPromise.promise;
        }

        function pauseLesson(idStudent,idCourse,idLom) {
            console.log("Objetos para pausar una lección(SERVICE) : ",idStudent,idCourse,idLom);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse+'/lom/'+idLom+'/idle', { 
                
            }).then(function(response) {
                console.log('ok despues pausar una lección', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues pausar una lección',err);
            });
            return coursesPromise.promise;
        }
		
		

        function getNewActivity(idStudent,idCourse){
            console.log('Parámetros para solicitar nueva actividad coursesAPI: ',common.bitbloqBackendUrl, idStudent,idCourse);
            return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+"/course/"+idCourse);
        }
		
		/* obtener el objeto de aprendizaje de una lección */
		function getActivityLesson(idLom){
            console.log('Parámetros para solicitar LO de una lección: ',idLom);
            return $http.get( common.bitbloqBackendUrl + "/loms/" + idLom);
        }
		
		/* comprobar si el estudiante está matriculado */
		function isEnrolled(idStudent,idCourse) {
			console.log(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse+'/isEnrolled');
            return $http.get(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse+'/isEnrolled');    
        }
		
        function getCourses() { 
          return $http.get( common.bitbloqBackendUrl + "/courses/" );      
        }
        function getCourse(idCourse) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse._id );      
        }
     
        function removeItem(idCourse) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses/"+idCourse);      
        }
        function removeAllItem() { 
          return $http.delete(common.bitbloqBackendUrl + "/courses");      
        }

   
        function getStudentsCoursesActives(idStudent) { 
          console.log("getStudentsCoursesActives");
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/active-courses' );      
        }

        function getStudentsCoursesFinished(idStudent) { 
            console.log("getStudentsCoursesFinished");
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/courses-done' );      
        }

        function getStudentsCoursesUnfinished(idStudent) { 
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/courses-not-done' );      
        }


        var exports = {
            getCourses : getCourses,
            getCourse : getCourse,
            okEndLesson : okEndLesson,
            badEndLesson : badEndLesson,
            pauseLesson : pauseLesson,
            getNewActivity : getNewActivity,
            getActivityLesson : getActivityLesson,
            getStudentsCoursesActives: getStudentsCoursesActives,
            getStudentsCoursesFinished: getStudentsCoursesFinished,
            getStudentsCoursesUnfinished: getStudentsCoursesUnfinished,
            removeItem : removeItem,
            removeAllItem : removeAllItem
           
        };

        return exports;

    });