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

        function addCourse(courseName,courseCode,courseSummary, obj) {
            console.log("Objetos para hacer post course: "+ courseName,courseCode,courseSummary,obj);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/', {
                name: courseName,
                code: courseCode,
                summary: courseSummary,
                objectives: obj,
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
        function addSection(idCourse, sectionsName,sectionsSummary,sectionsObjectives) {
            console.log("Objetos para hacer post section: "+ idCourse, sectionsName,sectionsSummary,sectionsObjectives);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse, { 
                name: sectionsName,
                summary: sectionsSummary,
                objectives:sectionsObjectives
            }).then(function(response) {
                console.log('ok despues de post section', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de post section',err);
            });
            return coursesPromise.promise;
        }
        
        function addLesson(idCourse, section, lessonName,lessonSummary,lessonObjectives, learningPath, lessonType) {
            console.log("Objetos para hacer post lesson: "+ idCourse,section,lessonName,lessonSummary,lessonObjectives,learningPath,lessonType);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+section, { 
                name:lessonName, 
                summary: lessonSummary ,  
                objectives: lessonObjectives,  
                learning_path: learningPath,
                type: lessonType,
                loms:[]
            }).then(function(response) {
                console.log('ok despues de post lesson', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de post lesson',err);
            });
            return coursesPromise.promise;
        }

        function asignLomLesson(idCourse,section,lesson,idLom) { 
            var coursesPromise = $q.defer();
            console.log("Objetos para hacer post asign lom: "+ idCourse,section,lesson,idLom);
            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+section+'/lesson/'+lesson+'/lom/'+idLom, {
                }).then(function(response) {
                    console.log('ok despues de asignar un lom '+idLom+' a una leccion', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     console.log('error despues intentar asignar el lom '+idLom+' a una leccion',err);
                });
            return coursesPromise.promise;     
        }

        function assignLomsLesson(idCourse,section,lesson,listLoms) { 
            var coursesPromise = $q.defer();
            console.log("Objetos para hacer post asign lom: "+ idCourse,section,lesson,listLoms);
            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+section+'/lesson/'+lesson+'/assign_loms', 
              listLoms
                ).then(function(response) {
                    console.log('ok despues de asignar una lista de '+listLoms.length+' loms a una leccion', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     console.log('error despues intentar asignar la lista de loms a una leccion',err);
            });
            return coursesPromise.promise;     
        }
        
        function editCourse(idCourse,courseName,courseCode,courseSummary,objs) {
            console.log("Objetos para editar (SERVICE): "+ courseName,courseCode,courseSummary,objs);
            var coursesPromise = $q.defer();
            console.log('id de item a editar (antes de llamada)', idCourse);
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse, {
                name: courseName,
                code: courseCode,
                summary: courseSummary/*,
                objectives: objs*/
            }).then(function(response) {
                console.log('ok despues de editar-post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de editar-post',err);
            });
            return coursesPromise.promise;
        }
        function addObjectivesToCourse(idCourse,objs) {
            console.log("Objetos para editar (API): ", idCourse,objs);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+'/includeObjectives',objs).then(function(response) {
                console.log('ok despues de añadir obj a curso (API)', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                console.log('error despues de añadir obj a curso (API)',err);
            });
            return coursesPromise.promise;
        }
        function addObjectivesToSection(idCourse,section,objs) {
            console.log("Objetos para editar (API): ", idCourse,objs);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+section+'/includeObjectives',objs).then(function(response) {
                console.log('ok despues de añadir obj a sección (API)', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                console.log('error despues de añadir obj a sección (API)',err);
            });
            return coursesPromise.promise;
        }
        
        function addObjectivesToLesson(idCourse,section,lesson,objs) {
            console.log("Objetos para editar (API): ", idCourse,objs);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+section+'/lesson/'+lesson+'/includeObjectives',objs).then(function(response) {
                console.log('ok despues de añadir obj a lección (API)', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                console.log('error despues de añadir obj a lección (API)',err);
            });
            return coursesPromise.promise;
        }

        function editSection(idCourse, sectionsName,newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons) {
            console.log("Objetos para hacer put section(SERVICE) : "+ newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+sectionsName, { 
                name: newSectionsName,
                summary: sectionsSummary,
                objectives:sectionsObjectives,
                lessons:sectionsLessons
            }).then(function(response) {
                console.log('ok despues de put section', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de put section',err);
            });
            return coursesPromise.promise;
        }
        
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

        function getNextLesson(idStudent,idCourse) {     
            return $http.get(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse);      
        }
        function getNewActivity(idStudent,idCourse){
            console.log('Parámetros para solicitar nueva actividad: ',idStudent,idCourse);
            return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+"/course/"+idCourse);
        }
        function getCourses() { 
          return $http.get( common.bitbloqBackendUrl + "/courses/" );      
        }
        function getCourse(idCourse) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse._id );      
        }
        function getSections(idCourse) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse+"/sections" );
        }
        function getSection(idCourse,section) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse+"/section/"+section);      
        }
        function getLessons(idCourse,section) { 
          return $http.get( common.bitbloqBackendUrl + "/courses/"+idCourse+"/section/"+section+"/lessons");      
        }
        function removeItem(idCourse) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses/"+idCourse);      
        }
        function removeObjFromCourse(idCourse, objsToDelete) { 
            var coursesPromise = $q.defer();
                console.log("Objetos para eliminar objetivos de un curso: "+idCourse, objsToDelete);
                $http.delete(common.bitbloqBackendUrl + "/courses/"+idCourse+'/deleteObjectives', 
                    objsToDelete
                ).then(function(response) {
                    console.log('ok despues de intentar eliminar una lista de objetivos de un curso', response.data);
                    coursesPromise.resolve();  
                }, function(err) {
                     console.log('error despues de intentar eliminar una lista de objetivos de un curso',err);
            });
            return coursesPromise.promise;     
        }
        /*function removeObjFromCourse(idCourse, deleteObjectives) { 
          return $http.delete(common.bitbloqBackendUrl + "/courses/"+idCourse+'/'+deleteObjectives);      
        }*/
        function removeAllItem() { 
          return $http.delete(common.bitbloqBackendUrl + "/courses");      
        }
        function getStudentsCoursesActives(idStudent) { 
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/active-courses' );      
        }

        function getStudentsCoursesFinished(idStudent) { 
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/courses-done' );      
        }

        function getStudentsCoursesUnfinished(idStudent) { 
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/courses-not-done' );      
        }

        function getAllStudentsCourses(idStudent) { 
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/all' );      
        }

        var exports = {
            addCourse : addCourse,
            getCourses : getCourses,
            getSections :getSections,
            getSection :getSection,
            getCourse : getCourse,
            getLessons: getLessons,
            removeItem : removeItem,
            removeAllItem : removeAllItem,
            removeObjFromCourse : removeObjFromCourse,
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
            getStudentsCoursesActives: getStudentsCoursesActives,
            getStudentsCoursesFinished: getStudentsCoursesFinished,
            getStudentsCoursesUnfinished: getStudentsCoursesUnfinished,
            getAllStudentsCourses: getAllStudentsCourses
        };

        return exports;

    });