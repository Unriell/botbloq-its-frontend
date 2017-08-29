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
            var coursesPromise = $q.defer();
             console.log();
            
            var myArray = [];

        
            for (var i = 0; i < course.objectives.length; i++) {
                var obj = new Object();
                obj.code = course.objectives[i].code;
                obj.description = course.objectives[i].description;
                obj.level = course.objectives[i].level;
                obj.bloom = course.objectives[i].bloom;
                myArray.push(obj);
            }
            var reqCourse = {
                name: course.name,
                code: course.code,
                summary: course.summary,
                objectives: myArray, 
                sections: course.sections,
                photo: course.photo,
                author: course.author, 
                statistics: course.statistics,
                history: course.history,
                solutions: course.solutions,

            };
            console.log(course._id);
            console.log(reqCourse);


             $http.put(common.bitbloqBackendUrl + '/courses/' + course._id + "/all", reqCourse).then(function(response) {
                console.log('ok después de añadir nuevo curso', response.data);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues dsdfsdfsdfsdde editar-post',err);
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

        /* obtener el objeto de aprendizaje de una lección */
        function getActivityLesson(idLom){
            console.log('Parámetros para solicitar LO de una lección: ',idLom);
            return $http.get( common.bitbloqBackendUrl + "/loms/" + idLom);
        }

        var exports = {
            getCourses : getCourses,
            addCourse : addCourse,
            removeCourse : removeCourse,
            editCourse : editCourse,
            addLom: addLom,
            getActivityLesson : getActivityLesson

        };

        return exports;

    });