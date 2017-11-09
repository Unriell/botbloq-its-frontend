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
        
        /*function signUpTeacher(name, email) {
            console.log(name, email);

            var signUpPromise = $q.defer();
            $http.post(common.bitbloqBackendUrl + "/teachers", {
                identification: {
                name: name,
                email: email
            }}).then(function(response) {
                console.log('token', response.data);
                response.data.teacher = true;
                localStorage.userToken = response.data.token; 
                exports.currentUser = response.data;
                common.activeUSer= response.data;
                common.nameActiveUser= response.data.identification.name;
                        
                signUpPromise.resolve();
            }, function(err) {
                logout();
                signUpPromise.reject(err);
            });
            return signUpPromise.promise;
        }*/
        function signUpTeacher(name, email, pass, userRole) {
            
            var signUpPromise = $q.defer();
            $http.post(common.bitbloqBackendUrl + "/teachers", {
                identification: {
                    name: name,
                    email: email,
                    password: pass
                },
                role: userRole
            }).then(function(response) {
                console.log('token', response);
                signUpPromise.resolve(); 
            }, function(err) {
                signUpPromise.reject(err);
            });
            return signUpPromise.promise;
        }

        function getTeachers() { 
          return $http.get( common.bitbloqBackendUrl + "/teachers" );      
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
        function updateLomsTeacher(idTeacher,lomsTeacher,ident) {
            var coursesPromise = $q.defer();
            console.log("Objetos para asignar lom a profesor (SERVICE): "+ idTeacher,lomsTeacher);
            $http.put(common.bitbloqBackendUrl + '/teachers/'+idTeacher, {
                identification: ident,
                elements: {
                    loms: lomsTeacher
                }
            }).then(function(response) {
                console.log('ok despues actualizar los nuevos loms a profesor (SERVICE): ', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues actualizar los nuevos loms a profesor (SERVICE): ',err);
            });
            return coursesPromise.promise;
        }
        function updateCoursesTeacher(idTeacher,coursesTeacher,ident) {
            var coursesPromise = $q.defer();
            console.log("Objetos para actualizar cursos de profesor (SERVICE): "+ idTeacher,coursesTeacher);
            $http.put(common.bitbloqBackendUrl + '/teachers/'+idTeacher, {
                identification: ident,
                elements: {
                    courses: coursesTeacher
                }
            }).then(function(response) {
                console.log('ok despues actualizar los nuevos cursos a profesor (SERVICE): ', response.data.token);
                coursesPromise.resolve();  
            }, function(err) {
                 console.log('error despues actualizar los nuevos cursos a profesor (SERVICE): ',err);
            });
            return coursesPromise.promise;
        }
        
        function getTeacher(idTeacher) { 
          return $http.get( common.bitbloqBackendUrl + "/teachers/"+idTeacher);      
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
        function removeAllTeachers() { 
          return $http.delete(common.bitbloqBackendUrl + "/teachers");      
        }

        var exports = {
            updateLomsTeacher: updateLomsTeacher,
            updateCoursesTeacher : updateCoursesTeacher,
            getTeacher : getTeacher,
            signUpTeacher : signUpTeacher,
            getTeachers : getTeachers,
            getCourses : getCourses,
            addCourse : addCourse,
            removeCourse : removeCourse,
            editCourse : editCourse,
            addLom: addLom,
            removeAllTeachers : removeAllTeachers,
            getActivityLesson : getActivityLesson
        };

        return exports;

    });