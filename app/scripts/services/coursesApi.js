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

        function addCourse(courseName,courseCode,courseSummary,coursePhoto, obj, authorCourse) {
            console.log("Objetos para hacer post course: "+ courseName,courseCode,courseSummary,obj);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/', {
                name: courseName,
                code: courseCode,
                summary: courseSummary,
                photo: coursePhoto,
                objectives: obj,
                statistics:  {},
                history: '',
                author: authorCourse
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
        
        function addLesson(idCourse, sectionName, lessonName,lessonTitle,lessonDescription,lessonObjectives, learningPath, lessonType,lessonDifficulty,lessonImage) {
            console.log("Objetos para hacer post lesson: "+ idCourse,sectionName,lessonName,lessonDescription,lessonObjectives,learningPath,lessonType);

            var coursesPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+sectionName, { 
                name:lessonName,
                title:lessonTitle, 
                description: lessonDescription ,  
                objectives: lessonObjectives,  
                learning_path: learningPath,
                type: lessonType,
                difficulty:lessonDifficulty,
                photo:lessonImage,
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

        function assignLomsLesson(idCourse,sectionName,lesson,listLoms) { 
            var coursesPromise = $q.defer();
            console.log("Objetos para hacer post asign lom: "+ idCourse,sectionName,lesson,listLoms);
            $http.post(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+sectionName+'/lesson/'+lesson+'/assign_loms', 
              listLoms
                ).then(function(response) {
                    console.log('ok despues de asignar una lista de '+listLoms.length+' loms a una leccion', response.data.token);
                    coursesPromise.resolve();  
                }, function(err) {
                     console.log('error despues intentar asignar la lista de loms a una leccion',err);
            });
            return coursesPromise.promise;     
        }

        function resetLomsLesson(idCourse, sectionsName,lessonName) {
            console.log("Objetos para actualizar objs de section(SERVICE) : ", idCourse,sectionsName,lessonName);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+sectionsName+'/lesson/'+lessonName, { 
                loms:[]
            }).then(function(response) {
                console.log('ok resetear objs de lección', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error resetear objs de lección',err);
            });
            return coursesPromise.promise;
        }
        
        function editCourse(idCourse,courseName,courseCode,courseSummary,coursePhoto,sectionsCourse,objs) {
            console.log("Objetos para editar (SERVICE): "+ courseName,courseCode,courseSummary,objs);
            var coursesPromise = $q.defer();
            console.log('id de item a editar (antes de llamada)', idCourse);
            
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+"/all", {
                name: courseName,
                code: courseCode,
                summary: courseSummary,
                photo: coursePhoto,
                sections: sectionsCourse,
                objectives: objs
            }).then(function(response) {
                console.log('ok despues de editar-post', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de editar-post',err);
            });
            return coursesPromise.promise;
        }
        
        function editNumLessons(idCourse,numLessons) {
            var coursesPromise = $q.defer();            
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+"/all", {
                numLessons: numLessons
            }).then(function(response) {
                console.log('ok despues de editar el numero de lecciones del curso', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de editar el numero de lecciones del curso',err);
            });
            return coursesPromise.promise;
        }
        function setStudentsEnrolled(idCourse,listStudents,studentsUnEnrolled) {
            var coursesPromise = $q.defer();            
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+"/all", {
                statistics:{
                    std_enrolled: listStudents,
                    std_unenrolled: studentsUnEnrolled
                }
            }).then(function(response) {
                console.log('ok despues de editar el numero de estudiantes del curso', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de editar el numero de estudiantes del curso',err);
            });
            return coursesPromise.promise;
        }
        
        function updateObjetivesCourse(idCourse,objs) {
            console.log("Objetos para atualizar objetivos (SERVICE): "+ idCourse,objs);
            var coursesPromise = $q.defer();       
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+"/all", {
                objectives: objs
            }).then(function(response) {
                console.log('ok despues de actualizar objetivos de curso (SERVICE)', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues de actualizar objetivos de curso (SERVICE)',err);
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
        function resetObjectivesSection(idCourse, sectionsName) {
            console.log("Objetos para actualizar objs de section(SERVICE) : ", idCourse,sectionsName);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+sectionsName, { 
                objectives:[]
            }).then(function(response) {
                console.log('ok actualizar objs de section', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error actualizar objs de section',err);
            });
            return coursesPromise.promise;
        }
        function resetObjectivesLesson(idCourse, sectionsName,lessonName) {
            console.log("Objetos para actualizar objs de section(SERVICE) : ", idCourse,sectionsName,lessonName);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/courses/'+idCourse+'/section/'+sectionsName+'/lesson/'+lessonName, { 
                objectives:[]
            }).then(function(response) {
                console.log('ok resetear objs de lección', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error resetear objs de lección',err);
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
        function endActivity(idStudent,idCourse,idLom) {
            console.log("Objetos para finalizar correctamente una actividad(SERVICE) : ",idStudent,idCourse,idLom);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse+'/lom/'+idLom+'/finalize', { 
                
            }).then(function(response) {
                console.log('ok despues finalizar correctamente una actividad', response.data.token);

                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues finalizar correctamente una actividad',err);
            });
            return coursesPromise.promise;
        }
        function correctActivity(idStudent,idCourse,idLom,score) {
            console.log("Objetos para corregir correctamente una actividad(SERVICE) : ",idStudent,idCourse,idLom,score);
            var coursesPromise = $q.defer();
            $http.put(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse+'/lom/'+idLom+score, { 
                
            }).then(function(response) {
                console.log('ok despues corregir correctamente una actividad', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues corregir correctamente una actividad',err);
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

        //¿Hace falta esta funciom getNewLesson pudiendose utilizar la funcion getNewActivity?
        function getNextLesson(idStudent,idCourse) {     
            return $http.get(common.bitbloqBackendUrl + '/students/'+idStudent+'/course/'+idCourse);      
        }
        function getNewActivity(idStudent,idCourse){
            console.log('Parámetros para solicitar nueva actividad: (SERVICE)',idStudent,idCourse);
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
        function removeSection(idCourse,sectionName) { 
          return $http.delete(common.bitbloqBackendUrl + '/courses/'+idCourse+"/section/"+sectionName);      
        }
        function removeLesson(idCourse,sectionName,lessonName) { 
          return $http.delete(common.bitbloqBackendUrl + '/courses/'+idCourse+"/section/"+sectionName+"/lesson/"+lessonName);      
        }
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

        function getLastInludedCourses(idStudent) { 
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/last-included' );      
        }

        function getRelatedCourses(idStudent) { 
          return $http.get( common.bitbloqBackendUrl + "/students/"+idStudent+'/related-courses' );      
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
            editCourse : editCourse,
            editNumLessons : editNumLessons,
            setStudentsEnrolled : setStudentsEnrolled,
            editSection: editSection,
            resetObjectivesSection : resetObjectivesSection,
            resetObjectivesLesson : resetObjectivesLesson,
            addObjectivesToCourse : addObjectivesToCourse,
            addObjectivesToSection : addObjectivesToSection,
            addObjectivesToLesson : addObjectivesToLesson,
            assignLomsLesson : assignLomsLesson,
            resetLomsLesson : resetLomsLesson,
            addSection : addSection,
            removeSection : removeSection,
            removeLesson : removeLesson,
            addLesson : addLesson,
            okEndLesson : okEndLesson,
            endActivity : endActivity,
            correctActivity : correctActivity,
            badEndLesson : badEndLesson,
            pauseLesson : pauseLesson,
            getNextLesson : getNextLesson,
            getNewActivity : getNewActivity,
            getStudentsCoursesActives: getStudentsCoursesActives,
            getStudentsCoursesFinished: getStudentsCoursesFinished,
            getStudentsCoursesUnfinished: getStudentsCoursesUnfinished,
            getLastInludedCourses : getLastInludedCourses,
            getRelatedCourses : getRelatedCourses,
            getAllStudentsCourses: getAllStudentsCourses,
            updateObjetivesCourse : updateObjetivesCourse
        };

        return exports;

    });