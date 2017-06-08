'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:CoursesCtrl
 * @description
 * # CoursesCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('coursesCtrl',function($log,$q,$scope,$http,$location,coursesApi,usersApi,lomsApi,common) {
        $log.log('courses ctrl start');
        
        $scope.activeUser=common.activeUSer;
        $scope.enrolledCourses=[];
        $scope.doneCourses=[];

        $scope.totalCoursesPage=true;
        $scope.enrolledCoursesPage=false;
        $scope.coursePage=false;
        $scope.objectivesPage=false;
        $scope.completedCoursesPage=false;

        $scope.courseSelected=common.courseSelected;
        $scope.objectivesCourseSelected=common.courseSelected.objectives;
        $scope.sectionsSelected=common.sectionsCourseSelected;
        $scope.lessonsSelected=common.lessonsCourseSelected;

        // --- EDIT COURSE ---
        $scope.editCourseName=common.courseSelected.name;
        $scope.editCourseCode=common.courseSelected.code;
        $scope.editCourseSummary=common.courseSelected.summary;

        $scope.editCourseObjectives=common.sectionsCourseSelected[0];
        $scope.editSections=common.sectionsCourseSelected[0];
        // --- END EDIT COURSE ---
        
        $scope.lomsAux=[];
        $scope.lomsToAdd=[];
        $scope.listAuxLomsAdd=[];
        $scope.listAuxLomsRemove=[];

        $scope.InfoCourse=false;
        $scope.idItemToEdit;
        $scope.showFieldsGeneral=true;
        $scope.showFieldsObjectives=true;
        $scope.showFieldsSections=true;
        $scope.showFieldsSectionsObj=true;
        $scope.showFieldsSectionsLesson=true;
        $scope.showFieldsSectionsLessonObj=true;

        $scope.newObjective=true;
        $scope.newSection=true;
        $scope.newLesson=true;
        $scope.showSelectLoms=false;

        $scope.viewCoursesInfo=false;

        $scope.objectives={};
        $scope.sectionObj={};
        $scope.lessonObj={};

        var objectivesCourse=[],
            objectivesSection=[],
            objectivesLesson=[];

        var idActualCourse;
        var actualSection;

        lomsApi.getLoms().then(function(response){
                $scope.loms= response.data;
                angular.forEach($scope.loms, function(element) {
                    $scope.lomsAux.push(element);
                });
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
        });

        $scope.updateLomsAux= function(){
            $scope.lomsAux=[];
            lomsApi.getLoms().then(function(response){
                $scope.loms= response.data;
                angular.forEach($scope.loms, function(element) {
                    $scope.lomsAux.push(element);
                });
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        coursesApi.getCourses().then(function(response){
                $scope.courses= response.data;
                if($scope.courses.length>0)
                    idActualCourse=$scope.courses[$scope.courses.length -1]._id;
                if ($scope.courses[$scope.courses.length -1].sections.length >0)
                    $scope.updateSections(idActualCourse);
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
        }); 

        var navegationCourses= function(){

        };

        $scope.updateCourses= function() {
            $log.debug('loading Courses ...');
            coursesApi.getCourses().then(function(response){
                $scope.courses= response.data;          
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.updateSections= function(idCourse) {
            $log.debug('loading Sections ...');
            coursesApi.getSections(idCourse).then(function(response){
                    $scope.sections= response.data;
                    actualSection=$scope.sections[$scope.sections.length -1];
                    $log.debug("numero de secciones actuales: "+$scope.sections.length);
                }, function myError(err) {
                    $log.debug(err);
                    alert('Error de tipo: '+err.status);      
            });
        };
        $scope.pru= function(idCourse) {
            $log.debug('loading Sections ...'); 
        };

        var updateSectionsSelected= function(idCourse){
            var defered = $q.defer(),
                promise = defered.promise;
            coursesApi.getSections(idCourse).then(function(response){
                    common.sectionsCourseSelected=response.data;
                    $log.debug('numero de secciones en getSections dentro: ', common.sectionsCourseSelected.length);
                    defered.resolve();
                }, function myError(err) {
                    $log.debug(err);
                    alert('Error de tipo: '+err.status);      
            });
            return promise;
        };

        var updateLessonsSelected= function(idCourse,section){
            var defered = $q.defer(),
                promise = defered.promise,
                lessonsSection={};
            coursesApi.getLessons(idCourse,section).then(function(response){
                lessonsSection= response.data;
                angular.forEach(lessonsSection,function(lesson){
                    common.lessonsCourseSelected.push(lesson);
                });
                $log.debug('numero de lecciones en getLessons dentro: ', common.sectionsCourseSelected.length);
                defered.resolve();
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
            
            return promise;
        };

        
        $scope.showHideFields= function(fieldset) {
            if (fieldset==1){
                if($scope.showFieldsGeneral) $scope.showFieldsGeneral=false;
                else $scope.showFieldsGeneral=true;
            }else if(fieldset==2){
                if($scope.showFieldsObjectives) $scope.showFieldsObjectives=false;
                else $scope.showFieldsObjectives=true;
            }else if(fieldset==3){
                if($scope.showFieldsSections) $scope.showFieldsSections=false;
                else $scope.showFieldsSections=true;
            }else if(fieldset==4){
                if($scope.showFieldsSectionsObj) $scope.showFieldsSectionsObj=false;
                else $scope.showFieldsSectionsObj=true;
            }else if(fieldset==5){
                if($scope.showFieldsSectionsLesson) $scope.showFieldsSectionsLesson=false;
                else $scope.showFieldsSectionsLesson=true;
            }else if(fieldset==6){
                if($scope.showFieldsSectionsLessonObj) $scope.showFieldsSectionsLessonObj=false;
                else $scope.showFieldsSectionsLessonObj=true;
            }
        };

        $scope.showInfoCourse = function(item){
            $scope.InfoCourse=true;
            $log.debug('loading get info courses ...');
            coursesApi.getCourse(item).then(function(response){
                $scope.courseName=response.data.name;
                $scope.courseCode=response.data.code;
                $scope.courseSummary=response.data.summary;
                $scope.objectives=response.data.objetives;
                $scope.sections=response.data.sections;
                $scope.courseHistory=response.data.history;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
        };
        $scope.hideInfoCourse = function(){
            $scope.InfoCourse=false;
        };
        $scope.showAddCourseForm = function() {
            $scope.showCoursesForm=true;
            $scope.edit=false;
        };
        $scope.showEditCourseForm = function(item) {
            $scope.showCoursesForm=true;
            $scope.edit=true;
            $scope.idItemToEdit=item._id;

            $scope.courseName=item.name;
            $scope.courseCode=item.code;
            $scope.courseSummary=item.summary;
            $scope.objectives=item.objetives;
            $scope.sections=item.sections;
            $scope.courseHistory=item.history;
        };
        $scope.goEditCourse = function(item) {
            common.courseSelected=item;
            common.objectivesCourseSelected=item.objectives;

            resetCourseSelected();
            var promise=updateSectionsSelected(item._id);
            promise.then(function() {
                $log.debug('numero de secciones en goCourse: ', common.sectionsCourseSelected.length);
                $scope.sectionsSelected=common.sectionsCourseSelected;
                $location.path("/editCourse");
            }, function(error) {
                $log.debug('Se ha producido un error al obtener el dato: '+error);     
            });

        
            $scope.editObjectives=item.objetives;
           
            $scope.editSections=item.sections;
            $scope.editCourseHistory=item.history;
            $scope.showCoursesForm=true;
            $scope.edit=true;
            $scope.idItemToEdit=item._id;

        };
        $scope.goAddCourse= function(){
            $location.path("/addCourse");
        };
        $scope.viewCourseWithInfo= function(){
             $scope.viewCoursesInfo=true;
        };
        $scope.viewCourseWithoutInfo= function(){
             $scope.viewCoursesInfo=false;
        };
        $scope.showNewObjective=function(){
            $scope.newObjective=true;
        };
        $scope.showNewSection=function(){
            $scope.newSection=true;
        };
        $scope.showNewLesson=function(){
            $scope.newLesson=true;
        };
        $scope.finAddCourse=function(){
            $location.path("/courses");
            $scope.updateCourses();
        };
        $scope.finAddObjectives=function(){
            $location.path("/addSections");
        };
        $scope.finNewObjective=function(){
            $scope.newObjective=false;
        };
        $scope.finAddLesson=function(){
            $location.path("/addSections");
        };


        $scope.addEditCourse = function() {
            $log.debug('valor de edit: ', $scope.edit);
            if($scope.edit) $scope.editCourse($scope.idItemToEdit);
            else $scope.addCourse();
        };

        $scope.addNewObjective=function(breadCrumb){
            switch (breadCrumb) {
                case 1:
                    objectivesCourse.push($scope.objectives);
                    $scope.objectives={};
                    break;
                case 2:
                    objectivesSection.push($scope.sectionObj);
                    $scope.sectionObj={};
                    break;
                case 3:
                    objectivesLesson.push($scope.lessonObj);
                    $scope.lessonObj={};
                    break;
                default:
            }
            $scope.newObjective=false;
        };
        $scope.addObjectiveEdit=function(breadCrumb){
            switch (breadCrumb) {
                case 1:
                    //common.objectivesCourseSelected.push($scope.objectives);
                    coursesApi.addObjectiveEdit(common.courseSelected,common.objectivesCourseSelected).then(function(response) {
                        $log.debug('ok después de editCourse', response);
                        $scope.updateCourses(); 
                        $scope.objectives={};
                    }, function(error) {
                        $log.debug('error después de editCourse', error);
                    });         
                    break;
                case 2:
                    objectivesSection.push($scope.sectionObj);
                    $scope.sectionObj={};
                    break;
                case 3:
                    objectivesLesson.push($scope.lessonObj);
                    $scope.lessonObj={};
                    break;
                default:
            }
            $scope.newObjective=false;
        };

        $scope.hideSelectLoms= function(){
            $scope.selectLoms=true;
        };

        $scope.addCourse = function() {
            if ($scope.adminCoursesForm.$valid) {
                $log.debug('adding...');
                coursesApi.addCourse($scope.courseName,$scope.courseCode,$scope.courseSummary, objectivesCourse).then(function(response) {
                    $log.debug('ok después de addCourse', response);
                    $scope.updateCourses();
                    $location.path("/addSections");
                }, function(error) {
                    $log.debug('error después de addCourse', error);
                });
                $scope.showCoursesForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            objectivesCourse=[];
        };

        $scope.addSection=function(){
            if ($scope.adminCoursesFormSection.$valid) {
                coursesApi.addSection(idActualCourse, $scope.sections.name, $scope.sections.summary,objectivesSection).then(function(response) {
                    $log.debug('ok después de addSection', response);
                    $scope.updateSections(idActualCourse);
                    $location.path("/addLessons");
                }, function(error) {
                    $log.debug('error después de addSection', error);
                });
            } else {
                $log.debug('There are invalid fields');
            }
            objectivesSection=[];
        };
        $scope.addLesson=function(){
            if ($scope.adminCoursesFormSectionLesson.$valid) {
                coursesApi.addLesson(idActualCourse,actualSection.name, $scope.lesson.name, $scope.lesson.summary,objectivesLesson, $scope.lesson.learningPath, $scope.lesson.type).then(function(response) {
                    $scope.assignLomsToLesson(idActualCourse,actualSection.name,$scope.lesson.name,$scope.lomsToAdd);
                    $scope.resetLesson();
                }, function(error) {
                    $log.debug('error después de addSection', error);
                });
            } else {
                $log.debug('There are invalid fields');
            }  
        };

        $scope.resetLesson=function(){
            $scope.newLesson=false;
            $scope.newObjective=true;
            $scope.showSelectLoms=false;
            $scope.lesson=[];
            objectivesLesson=[];
            $scope.updateLomsAux(); 
            $scope.lomsToAdd=[];
        };

        $scope.asignLomToLesson=function(idCourse,section,lesson, lom){
            $log.debug('--- metodo que asigna un lom a una lección----');
            coursesApi.asignLomLesson(idCourse,section,lesson,lom._id).then(function(response) {
                    $log.debug('ok después de asignar el lom cuyo id es '+lom._id+' a una lección', response);
                    $log.debug('    -----    '); 
                }, function(error) {
                     $log.debug('error después de asignación de lom a una lección', error);
            }); 
        };
        $scope.assignLomsToLesson=function(idCourse,section,lesson, loms){
            $log.debug('--- metodo que asigna una lista de loms a una lección ----');
            $log.debug('Numero de loms para asignar: '+loms.length);
            var listIdLoms= $scope.listIdLoms(loms);
            coursesApi.assignLomsLesson(idCourse,section,lesson,listIdLoms).then(function(response) {
                    $log.debug('ok después de asignar la lista de '+listIdLoms.length+' loms a una lección', response);
                    $log.debug('    -----    '); 
                }, function(error) {
                     $log.debug('error después de asignación de lom a una lección', error);
            });
        };

        $scope.listIdLoms=function(listLoms){
            var listIdLoms=[];
            angular.forEach(listLoms,function(element){
                listIdLoms.push(element._id);
            });
            return listIdLoms;
        };
        $scope.calcNumLessons = function(course){
            var sections={};
            sections=coursesApi.getSections(course._id);
            var numLessons=0;
            angular.forEach(sections,function(section){
                numLessons= numLessons + section.lessons.length;
            });
            return numLessons;
        };
    
        $scope.deleteItemFromList=function(list,item){
            var listt=[];
            return listt=list.filter(function(element) {
                return element!== item;
            });
        };

        $scope.addToListAux=function(lom,active){
            if(active){
                $scope.listAuxLomsAdd.push(lom);
            }    
            else{
                $scope.listAuxLomsAdd=$scope.listAuxLomsAdd.filter(function(element) {
                    return element!== lom;
                });
            }
        };
        $scope.addToListAdd=function($event){
            $event.preventDefault();
            angular.forEach($scope.listAuxLomsAdd, function(element) {
                $scope.lomsAux=$scope.lomsAux.filter(function(el) {
                    return el!== element;
                }); 
                $scope.lomsToAdd.push(element);
            });
            $scope.listAuxLomsAdd=[];
        };
        $scope.addToListEditLom=function(section,lesson,$event){
            $event.preventDefault();
            var lomsToAdd=[];
            angular.forEach($scope.listAuxLomsAdd, function(element) {
                lomsToAdd.push(element);
            });
            $scope.listAuxLomsAdd=[];
            coursesApi.assignLomsLesson(common.courseSelected._id,section,lesson,lomsToAdd).then(function(response) {
                    $log.debug('ok después de asignar la lista de '+lomsToAdd.length+' loms a una lección', response);
                    $log.debug('    -----    '); 
                }, function(error) {
                     $log.debug('error después de asignación de lom a una lección', error);
            });
        };
        $scope.deleteFromListEditLom=function(section,lesson,$event){
            $event.preventDefault();
            var lomsToDelete=[];
            angular.forEach($scope.listAuxLomsRemove, function(element) {
                lomsToDelete.push(element);
            });
            $scope.listAuxLomsAdd=[];
            lomsApi.removeLomsOfLesson(common.courseSelected._id,section,lesson,lomsToDelete).then(function(response) {
                    $log.debug('ok después eliminar loms de una lección', response);
                    $log.debug('    -----    '); 
                }, function(error) {
                     $log.debug('error después de asignación de lom a una lección', error);
            });
        };

        $scope.removeFromListAux=function(lom,active){
            if(active){
                $scope.listAuxLomsRemove.push(lom);
            }    
            else{
                $scope.listAuxLomsRemove=$scope.listAuxLomsRemove.filter(function(element) {
                    return element!== lom;
                });
            }
        };
        $scope.removeLomsFromListAdd=function($event){
            $event.preventDefault();
            angular.forEach($scope.listAuxLomsRemove, function(element) {
                $scope.lomsToAdd=$scope.lomsToAdd.filter(function(el) {
                    return el!== element;
                }); 
                $scope.lomsAux.push(element);
            });
            $scope.listAuxLomsRemove=[];
        };
        $scope.removeLomFromListAdd=function(lom){
            $scope.lomsToAdd=$scope.lomsToAdd.filter(function(element) {
                return element!== lom;
            }); 
            $scope.lomsAux.push(lom);
        };

        $scope.editCourse = function(course) {
            if ($scope.coursesEditForm.$valid ) {
                $log.debug('editing...');
                coursesApi.editCourse(course._id,$scope.courseName,$scope.courseCode,$scope.courseSummary,$scope.objectives).then(function(response) {
                    $log.debug('ok después de editCourse', response);
                    $scope.updateCourses();
                }, function(error) {
                    $log.debug('error después de editCourse', error);
                });
                $scope.showCoursesForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            $scope.courseName='';
            $scope.courseCode='';
            $scope.courseSummary='';
            $scope.objectives={};
            $scope.sections={};
            $scope.courseHistory='';
        };
        $scope.editSection = function(index,newSectionsName, sectionsSummary, sectionsObjectives,sectionsLessons) {
            $log.debug('editing section ...');
            var sectionName=getSectiontByIndex(common.courseSelected,index);
            coursesApi.editSection(common.courseSelected._id,sectionName,newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons).then(function(response) {
                $log.debug('ok después de editSection', response);
                confirm("Sección editada!");
            }, function(error) {
                $log.debug('error después de editSection', error);
                confirm("Error al editar la sección.");
            });
            $scope.showCoursesForm=false; 
        };

        var getSectiontByIndex=function(course, index){
            return course.sections[index].name;
        };
     
        $scope.removeCourse = function(course,e){
            $log.debug('eliminado course con id: ', course);
            if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTE CURSO?") === false) {
                e.preventDefault();
                return;
            }
            coursesApi.removeItem(course._id).then(function(response) {
                    $log.debug('eliminado course con exito', response);
                    $scope.updateCourses();
                }, function(error) {
                    $log.debug('error al eliminar course', error);
             });
        };
        $scope.deleteAllCourses = function(e){
            $log.debug('eliminado courses');
            if (confirm("¿ESTÁ DISPUESTO A ELIMINAR TODOS LOS CURSOS?") === false) {
                e.preventDefault();
                return;
            }
            coursesApi.removeAllItem().then(function(response) {
                    $log.debug('eliminado todos los items con exito', response);
                }, function(error) {
                    $log.debug('error al eliminar todos los items', error);
             });
        };

        $scope.goCourse=function(course){
            common.courseSelected= course;
            $scope.courseSelected=course;
            resetCourseSelected();
            var promise=updateSectionsSelected(course._id);
            promise.then(function() {
                $log.debug('numero de secciones en goCourse: ', common.sectionsCourseSelected.length);
                calculateNumLessons(course._id);

            }, function(error) {
                $log.debug('Se ha producido un error al obtener el dato: '+error);     
            });
            $scope.coursePage=true;
            $scope.totalCoursesPage=false;
            $scope.enrolledCoursesPage=false;
            $scope.objectivesPage=false;
        };

        var calculateNumLessons=function(idCourse){
            angular.forEach(common.sectionsCourseSelected,function(section){
                updateLessonsSelected(idCourse,section.name);
            });
        };
        var resetCourseSelected=function(){
            common.sectionsCourseSelected=[];
            common.lessonsCourseSelected=[];
            $scope.sectionsSelected=common.sectionsCourseSelected;
            $scope.lessonsSelected=common.lessonsCourseSelected;
        };
        var searchCourse= function(id){
            var courseSelected=null;
            angular.forEach($scope.courses, function(element) {
                if(element._id==id){
                    courseSelected=element;
                }
            });
            return courseSelected;
        };

        $scope.showEnrolledCourses=function(){
            $scope.totalCoursesPage=false;
            $scope.enrolledCoursesPage=true;
            $scope.coursePage=false;
            $scope.objectivesPage=false;
            $scope.completedCoursesPage=false;
            $scope.getStudentsCoursesActives($scope.activeUser._id);
            //$scope.getAllStudentsCourses($scope.activeUser._id);
            //$scope.getStudentsCoursesUnfinished($scope.activeUser._id);
            //$scope.getStudentsCoursesFinished($scope.activeUser._id);
        };
        $scope.showCompletedCourses=function(){
            $scope.totalCoursesPage=false;
            $scope.enrolledCoursesPage=false;
            $scope.coursePage=false;
            $scope.objectivesPage=false;
            $scope.completedCoursesPage=true;
            $scope.getStudentsCoursesActives($scope.activeUser._id);
            //$scope.getAllStudentsCourses($scope.activeUser._id);
            //$scope.getStudentsCoursesUnfinished($scope.activeUser._id);
            //$scope.getStudentsCoursesFinished($scope.activeUser._id);
        };

        $scope.showTotalCourses=function(){
            $scope.totalCoursesPage=true;
            $scope.enrolledCoursesPage=false;
            $scope.coursePage=false;
            $scope.objectivesPage=false;
        };

        // ----------------    STUDENT  ---------------
        $scope.assignStudentToGroup=function(idStudent){
            $log.debug('Asignando estudiante a grupo ...');
            usersApi.assignStudentToGroup(idStudent).then(function(response){
                $log.debug('Estudiante asignado correctamente ...'); 
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        $scope.enrollStudent=function(idStudent,idCourse){
            $log.debug('Matriculando a alumno ...');
            usersApi.enrollStudent(idStudent,idCourse).then(function(response) {
                $log.debug('ok después de enrollStudent', response);
            }, function(error) {
                $log.debug('error después de enrollStudent', error);
            });   
        };

        $scope.getStudentsCoursesActives= function(idStudent) {
            $log.debug('loading cursos activos ...');
            /*coursesApi.getStudentsCoursesActives(idStudent).then(function(response){
                $scope.enrolledCourses= response.data;          
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            });*/ 
            $scope.enrolledCourses=$scope.activeUser.course[0];
        };
        $scope.getStudentsCoursesFinished= function(idStudent) {
            $log.debug('loading cursos terminados ...');
            coursesApi.getStudentsCoursesFinished(idStudent).then(function(response){
                $scope.doneCourses= response.data;          
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.getStudentsCoursesUnfinished= function(idStudent) {
            $log.debug('loading cursos inacabados ...');
            coursesApi.getStudentsCoursesUnfinished(idStudent).then(function(response){
                $scope.enrolledCourses= response.data;          
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.getAllStudentsCourses= function(idStudent) {
            $log.debug('loading todos los cursos ...');
            coursesApi.getAllStudentsCourses(idStudent).then(function(response){
                $scope.enrolledCourses= response.data;          
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        

         // ----------------    FIN STUDENT METHODS ---------------

    

    });