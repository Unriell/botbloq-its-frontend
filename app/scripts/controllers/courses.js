'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:CoursesCtrl
 * @description
 * # CoursesCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('coursesCtrl',function($log,$q,$scope,$http,$location,$timeout,coursesApi,usersApi,lomsApi,teacherApi,common, $sce) {
        $log.log('courses ctrl start');
        $scope.changeInit(false); 
        $scope.activeUser=common.activeUSer;
        $scope.userRole=$scope.activeUser.role;
        $scope.changeActiveUserHeader($scope.activeUser);
        $scope.loadCourses=[];
        $scope.enrolledCourses=[];
        $scope.doneCourses=[];
        $scope.lastIncludedCourses=[];
        $scope.relatedCourses=[];
        $scope.teacher=common.teacher;
        $scope.students=[];
        $scope.studentEnrolledInCourse=common.enrolledInCourse;

        var resetCourseViews=function(){
            $scope.coursePage=false;
            $scope.coursesPage=false;
            $scope.objectivesPage=false;       
        }
        var resetCoursesViews=function(){
            $scope.totalCoursesPage=false;  
            $scope.enrolledCoursesPage=false;
            $scope.completedCoursesPage=false;
            $scope.lastIncludedCoursesPage=false;
            $scope.relatedCoursesPage=false;
            $scope.coursesTeacherPage=false;          
        }
        resetCourseViews(); 
        resetCoursesViews(); 

        $scope.managementCourseViews= function(view){
            resetCourseViews();
            common.actualViewCourse=view;
            console.log("Vista de "+common.actualViewCourse);
            switch (view) {
                case 'coursesPage':
                    $scope.coursesPage=true;
                    break;
                case 'coursePage':
                    $scope.coursePage=true;
                    break;
                case 'objectivesPage':
                    $scope.objectivesPage=true;
                    break;   
                default:
            }
            /*getStudentsCoursesActives($scope.activeUser._id);*/
            //$scope.getStudentsCoursesUnfinished($scope.activeUser._id);
        }
        $scope.comeToCourses= function(){
            $scope.managementCoursesViews(common.actualViewCourses);
        }
        var updateCoursesTeacher=function(totalCourses){
            $scope.coursesTeacher=[];
            angular.forEach($scope.activeUser.elements.courses,function(idCourse){
                angular.forEach(totalCourses,function(course){
                    if(course._id==idCourse){
                        $scope.coursesTeacher.push(course);
                        return 0;
                    }
                });
            });
        }
        $scope.managementCoursesViews= function(view){
            resetCourseViews();
            resetCoursesViews();
            $scope.coursesPage=true;
            common.actualViewCourse='coursesPage';
            common.actualViewCourses=view;
            console.log("Vista de "+common.actualViewCourses);
            switch (view) {
                case 'coursesTeacherPage':
                    $scope.coursesTeacherPage=true;  
                    if($scope.userRole=='teacher'){
                        updateCoursesTeacher($scope.courses);
                        $scope.loadCourses=$scope.coursesTeacher;
                    }
                    /*$scope.getAllStudentsCourses($scope.activeUser._id);*/
                    break;
                case 'totalCoursesPage':
                    $scope.totalCoursesPage=true;  
                    $scope.loadCourses=$scope.courses;
                    /*$scope.getAllStudentsCourses($scope.activeUser._id);*/
                    break;
                case 'enrolledCoursesPage':
                    getStudentsEnrolledCourses($scope.activeUser._id);
                    $scope.enrolledCoursesPage=true; 
                    common.actualViewCourses="enrolledCoursesPage";
                    break;
                case 'completedCoursesPage':
                    getStudentsCoursesFinished($scope.activeUser._id);
                    $scope.completedCoursesPage=true;
                    common.actualViewCourses="completedCoursesPage";
                    break;
                case 'lastIncludedCoursesPage':
                    $scope.lastIncludedCoursesPage=true;
                    $scope.getLastInludedCourses($scope.activeUser._id);
                    $scope.loadCourses=[];
                    break;
                case 'relatedCoursesPage':
                    $scope.relatedCoursesPage=true;
                    $scope.getRelatedCourses($scope.activeUser._id);
                    $scope.loadCourses=[];
                    break;
                default:
                    $scope.totalCoursesPage=true;
                    common.actualViewCourses='totalCoursesPage';
                    break;
            }
            /*getStudentsCoursesActives($scope.activeUser._id);*/
            //$scope.getStudentsCoursesUnfinished($scope.activeUser._id);
        }

        console.log("Vista de "+common.actualViewCourses);

        $scope.coursesTeacher=[];

        $scope.courseSelected=common.courseSelected;
        $scope.objectivesCourseSelected=common.objectivesCourseSelected;
        $scope.sectionsSelected=common.sectionsCourseSelected;
        $scope.lessonsSelected=common.lessonsCourseSelected;
        $scope.lessonSelected=common.lessonSelected;
        $scope.indexLessonSelected=common.indexLessonSelected;

        $scope.sections=[];
        $scope.lesson=[];

        // --- EDIT COURSE ---
        $scope.editCourseName=common.courseSelected.name;
        $scope.editCourseCode=common.courseSelected.code;
        $scope.editCourseSummary=common.courseSelected.summary;
        $scope.editCoursePhoto=common.courseSelected.photo;

        $scope.editCourseObjectives=common.sectionsCourseSelected[0];
        $scope.editSections=common.sectionsCourseSelected[0];

        // --- END EDIT COURSE ---
        $scope.lomsTeacher=[];
        $scope.lomsAux=[];
        $scope.lomsToAdd=[];
        $scope.indexLomSelected=[0,0];
        $scope.indexLomSelectedCreate=[0,0];
        $scope.loms=[];
        $scope.listAuxLomsAdd=[];
        $scope.listAuxLomsAddCreate=[];
        $scope.listAuxLomsRemove=[];
        $scope.listAuxLomsRemoveCreate=[];

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

        $scope.objectives={};
        $scope.sectionObj={};
        $scope.lessonObj={};

        $scope.activity={};
        $scope.activity=common.newActivity;
        $scope.page = common.urlActivity;

        var objectivesCourse=[],
            objectivesSection=[],
            objectivesLesson=[];

        var actualCourseToAdd={};
        var actualSection={};

        var updateLomsTeacher=function(totalLoms){
            $scope.lomsTeacher=[];
            angular.forEach($scope.activeUser.elements.loms,function(idLom){
                angular.forEach(totalLoms,function(lom){
                    if(lom._id==idLom){
                        $scope.lomsTeacher.push(lom);
                        return 0;
                    }
                });
            });
        }

        lomsApi.getLoms().then(function(response){
                 if($scope.userRole=='teacher') updateLomsTeacher(response.data);
                 $scope.loms=response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        });
        /*lomsApi.getLoms().then(function(response){
                $scope.loms= response.data;
                angular.forEach($scope.loms, function(element) {
                    $scope.lomsAux.push(element);
                });
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        });

        /*$scope.updateLomsAux= function(){
            $scope.lomsAux=[];
            lomsApi.getLoms().then(function(response){
                $scope.loms= response.data;
                angular.forEach($scope.loms, function(element) {
                    $scope.lomsAux.push(element);
                });
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        };*/

        coursesApi.getCourses().then(function(response){
                $scope.coursesPage=true;
                $scope.totalCoursesPage=true;
                $scope.courses= response.data;
                $scope.results=document.getElementsByClassName("okResults");
                if($scope.courses.length>0)
                    actualCourseToAdd=$scope.courses[$scope.courses.length -1];
                if (actualCourseToAdd.sections.length >0)
                    $scope.updateActualSections(actualCourseToAdd._id);

                if($scope.userRole=='teacher'){
                    updateCoursesTeacher(response.data);
                    resetCoursesViews();
                    $scope.coursesTeacherPage=true;
                    $scope.loadCourses=$scope.coursesTeacher;
                    common.actualViewCourses='coursesTeacherPage';
                }else{
                    resetCoursesViews();
                    $scope.totalCoursesPage=true;
                    $scope.loadCourses=$scope.courses;
                }
                $scope.managementCourseViews(common.actualViewCourse);
                if(common.actualViewCourse !='coursePage'){
                    $scope.managementCoursesViews(common.actualViewCourses);
                }
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        }); 


        $scope.updateCourses= function() {
            console.log('loading Courses ...');
            coursesApi.getCourses().then(function(response){
                $scope.courses= response.data; 
                if($scope.activeUser.role=='teacher')
                    updateCoursesTeacher(response.data);  
                if($scope.coursesTeacherPage) $scope.loadCourses=$scope.coursesTeacher;
                else $scope.loadCourses=response.data;  
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        var updateLastCourse= function() {
            var defered=$q.defer(),
                promise=defered.promise;
            console.log('loading Courses ...');
            coursesApi.getCourses().then(function(response){
                $scope.courses= response.data; 
                if($scope.userRole=='teacher') updateCoursesTeacher(response.data);
                common.courseSelected=$scope.courses[$scope.courses.length -1]; 
                defered.resolve();
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
            return promise;
        };
        $scope.updateSections= function(idCourse) {
            console.log('loading Sections ...');
            coursesApi.getSections(idCourse).then(function(response){
                    $scope.sections= response.data;
                    $scope.sectionsSelected=$scope.sections;
                    actualSection=$scope.sections[$scope.sections.length -1];
                    console.log("numero de secciones actuales: "+$scope.sections.length);

                }, function myError(err) {
                    console.log(err);
                    alert('Error de tipo: '+err.status);      
            });
        };
        $scope.updateActualSections= function(idCourse) {        
            var sections=[];
            coursesApi.getSections(idCourse).then(function(response){
                    sections= response.data;
                    actualSection=sections[sections.length -1];
                }, function myError(err) {
                    console.log(err);
                    alert('Error de tipo: '+err.status);      
            });
        };
       
        var updateSectionsSelected= function(idCourse){
            var defered = $q.defer(),
                promise = defered.promise;
            coursesApi.getSections(idCourse).then(function(response){
                    common.sectionsCourseSelected=response.data;
                    console.log('numero de secciones en getSections dentro: ', common.sectionsCourseSelected.length);
                    defered.resolve();
                }, function myError(err) {
                    console.log(err);
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
                console.log('numero de lecciones en getLessons dentro: ', common.sectionsCourseSelected.length);
                defered.resolve();
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
            
            return promise;
        };

        var clearSelectedLoms = function(){//Elimino la clase selected de los seleccionados
            var selecteds=document.getElementsByClassName('formAddCourse__fieldset__contentFields__loms__element__link');
            for (var i = 0; i<selecteds.length; i++) {
               selecteds[i].setAttribute('class','formAddCourse__fieldset__contentFields__loms__element__link');
            }
        }
        
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
            console.log('loading get info courses ...');
            coursesApi.getCourse(item).then(function(response){
                $scope.courseName=response.data.name;
                $scope.courseCode=response.data.code;
                $scope.courseSummary=response.data.summary;
                $scope.objectives=response.data.objetives;
                $scope.sections=response.data.sections;
                $scope.courseHistory=response.data.history;
            }, function myError(err) {
                console.log(err);
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
            common.sectionsCourseSelected=item.sections;
            $location.path("/editCourse");
            console.log('edicion de ',common.courseSelected.name);
            /*resetCourseSelected();
            var promise=updateSectionsSelected(item._id);
            promise.then(function() {
                console.log('numero de secciones en goCourse: ', common.sectionsCourseSelected.length);
                $scope.sectionsSelected=common.sectionsCourseSelected;
                $location.path("/editCourse");
            }, function(error) {
                console.log('Se ha producido un error al obtener el dato: '+error);     
            });*/

        
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
            console.log('valor de edit: ', $scope.edit);
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
        $scope.addObjectiveEdit=function(breadCrumb,section,lesson,objSection,objLesson){
            console.log('datos para addObjective: ',section,lesson);
            var newObjectives=[];
            switch (breadCrumb) {
                case 1:
                    newObjectives.push($scope.objectives);
                    common.objectivesCourseSelected.push($scope.objectives);
                    coursesApi.addObjectivesToCourse(common.courseSelected._id,newObjectives).then(function(response) {
                        console.log('ok después añadir objetivo a curso en editar curso', response);
                        $scope.updateCourses(); 
                        $scope.objectives={};
                    }, function(error) {
                        $console.log('ERROR después añadir objetivo a curso en editar curso', error);      
                    });         
                    break;
                case 2:
                    newObjectives.push($scope.sectionObj);
                    objectivesSection.push($scope.sectionObj);
                    objSection.push($scope.sectionObj);
                    coursesApi.addObjectivesToSection(common.courseSelected._id,section,newObjectives).then(function(response) {
                        console.log('ok después añadir objetivo a sección en editar curso', response);
                        $scope.updateCourses(); 
                        $scope.sectionObj={};
                    }, function(error) {
                        $console.log('ERROR después añadir objetivo a sección en editar curso', error);      
                    });
                    break;
                case 3:
                    newObjectives.push($scope.lessonObj);
                    objectivesLesson.push($scope.lessonObj);
                    objLesson.push($scope.lessonObj);
                    coursesApi.addObjectivesToLesson(common.courseSelected._id,section,lesson,newObjectives).then(function(response) {
                        console.log('ok después añadir objetivo a lección en editar curso', response);
                        $scope.updateCourses(); 
                        $scope.lessonObj={};
                    }, function(error) {
                        $console.log('ERROR después añadir objetivo a lección en editar curso', error);      
                    });
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
                console.log('adding...');
                coursesApi.addCourse($scope.courseName,$scope.courseCode,$scope.courseSummary,$scope.coursePhoto, objectivesCourse,$scope.activeUser.identification.name).then(function(response) {
                    console.log('ok después de addCourse', response);
                   
                    var promise=updateLastCourse();
                    promise.then(function() {
                        common.courseSelected=$scope.courses[$scope.courses.length -1];
                        let idLastCourse=common.courseSelected._id;
                        assignCourseToTeacher($scope.activeUser._id,idLastCourse);
                        $location.path("/courses");
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar los loms: '+error);     
                    });

                }, function(error) {
                    console.log('error después de addCourse', error);
                });
                $scope.showCoursesForm=false;
            } else {
                console.log('There are invalid fields');
            }
            objectivesCourse=[];
        };

        $scope.addSection=function(){
            if ($scope.adminCoursesFormSection.$valid) {
                console.log('parametros addSection: ',common.courseSelected._id, $scope.sections.name, $scope.sections.summary,objectivesSection);
                coursesApi.addSection(common.courseSelected._id, $scope.sections.name, $scope.sections.summary,objectivesSection).then(function(response) {
                    console.log('ok después de addSection', response);
                    $scope.updateSections(common.courseSelected._id);
                    $location.path("/addLessons");
                }, function(error) {
                    console.log('error después de addSection', error);
                });
            } else {
                console.log('There are invalid fields');
            }
            objectivesSection=[];
        };
        $scope.addSectionEdit=function(){
            /*if ($scope.adminCoursesFormSection.$valid || $scope.addSectionEdit) {*/
                console.log('parametros addSection (EDIT): ',common.courseSelected._id, $scope.sections.name, $scope.sections.summary,objectivesSection);
                coursesApi.addSection(common.courseSelected._id, $scope.sections.name, $scope.sections.summary,objectivesSection).then(function(response) {
                    console.log('ok después de addSection', response);
                    $scope.updateSections(common.courseSelected._id);
                }, function(error) {
                    console.log('error después de addSection', error);
                });
            /*} else {*/
                /*console.log('There are invalid fields');*/
           /* }*/
                objectivesSection=[];
        };
        $scope.addLesson=function(){
            var learningPath=$scope.lesson.learningPath.split(',');
            if ($scope.adminCoursesFormSectionLesson.$valid) {
                coursesApi.addLesson(actualCourseToAdd._id,actualSection.name,$scope.lesson.name,$scope.lesson.title, $scope.lesson.description,objectivesLesson, learningPath, $scope.lesson.type,$scope.lesson.difficulty,$scope.lesson.photo).then(function(response) {
                    var promise=assignLomsToLesson(actualCourseToAdd._id,actualSection.name,$scope.lesson.name,$scope.lomsToAdd);
                    promise.then(function(){
                    $scope.resetLesson();

                    },function(err){
                        console.log('error: ',err);
                    });    
                }, function(error) {
                    console.log('error después de addLesson', error);
                });
            } else {
                console.log('There are invalid fields');
            }  
        };
        $scope.isInvalid =function(){
            var invalid=false;
            if(lesson.learningPath){
                invalid=true;
            }
            return invalid;
        }
        $scope.addLessonEdit=function(sectionName,indexSection,indexLesson){
           /* if ($scope.adminAddLesson.$valid) {*/
            var learningPath=$scope.lesson.learningPath.split(',').map(Number);
                coursesApi.addLesson(common.courseSelected._id,sectionName,$scope.lesson.name,$scope.lesson.title, $scope.lesson.description,objectivesLesson, learningPath, $scope.lesson.type,$scope.lesson.difficulty,$scope.lesson.photo).then(function(response) {
                    var promise=assignLomsToLesson(common.courseSelected._id,sectionName,$scope.lesson.name,$scope.lomsToAdd);
                    promise.then(function(){
                        $scope.resetLesson();
                        clearSelectedLoms();
                        updateEditLessons(common.courseSelected._id,sectionName,indexSection);     
                        updateLomsLessons(common.courseSelected._id,sectionName,indexSection,indexLesson);   
                        common.courseSelected.numLessons = common.courseSelected.numLessons+1;
                        coursesApi.editNumLessons(common.courseSelected._id,common.courseSelected.numLessons).then(function(response) {
                            console.log('ok después de decrementar numero de lecciones', response);
                        }, function(error) {
                            console.log('error después de decrementar numero de lecciones', error);
                        });
                    },function(err){
                        console.log('error: ',err);
                     }); 
                }, function(error) {
                    console.log('error después de addSection', error);
                });
            /*} else {
                console.log('There are invalid fields');
            }  */
        };
       var updateEditLessons= function(idCourse,sectionName,i) {
            console.log('uptading Lessons ...');
            coursesApi.getSection(idCourse,sectionName).then(function(response){
                var section=response.data;
                    $scope.sectionsSelected[i].lessons= section.lessons;  
                }, function myError(err) {
                    console.log(err);
                    alert('Error de tipo: '+err.status);      
            });
        };
        var updateLomsLessons= function(idCourse,sectionName,indexSection, indexLesson) {
            console.log('uptading Loms of lesson ...');
            coursesApi.getSection(idCourse,sectionName).then(function(response){
                var section=response.data;
                    $scope.sectionsSelected[indexSection].lessons[indexLesson].loms= section.lessons[indexLesson].loms;  
                }, function myError(err) {
                    console.log(err);
                    alert('Error de tipo: '+err.status);      
            });
        };

        $scope.resetLesson=function(){
            $scope.newLesson=false;
            $scope.newObjective=true;
            $scope.showSelectLoms=false;
            $scope.lesson=[];
            objectivesLesson=[];
            /*$scope.updateLomsAux(); */
            $scope.lomsToAdd=[];
        };

        $scope.asignLomToLesson=function(idCourse,section,lesson, lom){
            console.log('--- metodo que asigna un lom a una lección----');
            coursesApi.asignLomLesson(idCourse,section,lesson,lom._id).then(function(response) {
                    console.log('ok después de asignar el lom cuyo id es '+lom._id+' a una lección', response);
                    console.log('    -----    '); 
                }, function(error) {
                     console.log('error después de asignación de lom a una lección', error);
            }); 
        };
        var assignLomsToLesson=function(idCourse,sectionName,lesson, loms){
            var defered=$q.defer(),
                promise=defered.promise;
            console.log('--- metodo que asigna una lista de loms a una lección ----');
            console.log('Numero de loms para asignar: '+loms.length);
            var listIdLoms= $scope.listIdLoms(loms);
            coursesApi.assignLomsLesson(idCourse,sectionName,lesson,listIdLoms).then(function(response) {
                    console.log('ok después de asignar la lista de '+listIdLoms.length+' loms a una lección', response);
                    console.log('    -----    '); 
                    defered.resolve();
                    updateLessonsSelected(idCourse,sectionName);
                }, function(error) {
                     console.log('error después de asignación de lom a una lección', error);
            });
            return promise;
        };

        $scope.listIdLoms=function(listLoms){
            var listIdLoms=[];
            angular.forEach(listLoms,function(element){
                listIdLoms.push(element._id);
            });
            return listIdLoms;
        };
      
    
        $scope.deleteItemFromList=function(list,item){
            var listt=[];
            return listt=list.filter(function(element) {
                return element!== item;
            });
        };
        var activateLom=function(action,indexSection,indexLesson,indexLom,activate){ 
                var indexSection=indexSection.toString(),
                    indexLesson=indexLesson.toString(),
                    indexLom=indexLom.toString();

                var idLinkAddRemoveLom=action+"s"+indexSection+"_l"+indexLesson+"_l"+indexLom,
                    idLinkRemoveLom=action+"icon_"+"s"+indexSection+"_l"+indexLesson+"_l"+indexLom;

                var linkAddLom=document.getElementById(idLinkAddRemoveLom),
                    linkRemoveLom=document.getElementById(idLinkRemoveLom);

                if(activate){
                    linkAddLom.setAttribute('class','formAddCourse__fieldset__contentFields__loms__element__link active');
                    if(action=="remove_")
                        linkRemoveLom.setAttribute('class','formAddCourse__fieldset__contentFields__loms__element__link__link active');
                }else{
                    linkAddLom.setAttribute('class','formAddCourse__fieldset__contentFields__loms__element__link');
                    if(action=="remove_")
                        linkRemoveLom.setAttribute('class','formAddCourse__fieldset__contentFields__loms__element__link__link');
                }
        }

        $scope.selectLomsToAddToLesson=function(lom,indexSection, indexLesson, indexLom,eventClasses){
            var active=false;
            var action="add_";
            var classes=eventClasses.toString();
 
            if(($scope.indexLomSelected[0] != indexSection) || ( ($scope.indexLomSelected[0] == indexSection) && ($scope.indexLomSelected[1] != indexLesson) )){
                $scope.indexLomSelected=[indexSection, indexLesson];
                $scope.listAuxLomsAdd=[];
                $scope.listAuxLomsRemove=[];
                clearSelectedLoms();
            } 

            if(classes.indexOf("active") < 0){
                $scope.listAuxLomsAdd.push(lom);
                if((indexSection !=null) && (indexLesson != null))
                    activateLom(action,indexSection,indexLesson,indexLom,true);
            }    
            else{
                if((indexSection !=null) && (indexLesson != null))
                    activateLom(action,indexSection,indexLesson,indexLom,false);

                $scope.listAuxLomsAdd=$scope.listAuxLomsAdd.filter(function(element) {
                    return element!== lom;
                });
            }
        };
        $scope.selectLomsToDeleteFromLesson=function(lom,indexSection, indexLesson, indexLom,eventClasses){
            var active=false;
            var action="remove_";
            var classes=eventClasses.toString();
 
            if( ($scope.indexLomSelected[0] != indexSection) || (($scope.indexLomSelected[0] == indexSection) && ($scope.indexLomSelected[1] != indexLesson)) ){
                $scope.indexLomSelected=[indexSection, indexLesson];
                $scope.listAuxLomsRemove=[];
                clearSelectedLoms();
            } 

            if(classes.indexOf("active") < 0){
                $scope.listAuxLomsRemove.push(lom);
                if((indexSection !=null) && (indexLesson != null))
                    activateLom(action,indexSection,indexLesson,indexLom,true);
            }    
            else{
                if((indexSection !=null) && (indexLesson != null))
                    activateLom(action,indexSection,indexLesson,indexLom,false);
                $scope.listAuxLomsRemove=$scope.listAuxLomsRemove.filter(function(element) {
                    return element!== lom;
                });
            }
        };
        $scope.selectLomsToAddToLessonCreate=function(active,lom,indexSection, indexLesson){ 
             if( ($scope.indexLomSelectedCreate[0] != indexSection) || ( ($scope.indexLomSelectedCreate[0] == indexSection) && ($scope.indexLomSelectedCreate[1] != indexLesson) )){
                 $scope.indexLomSelectedCreate=[indexSection, indexLesson];
                 $scope.listAuxLomsAddCreate=[];
                 $scope.listAuxLomsRemoveCreate=[];
             } 
             if(active){
                $scope.listAuxLomsAddCreate.push(lom);
             }
             else{
                 $scope.listAuxLomsAddCreate=$scope.listAuxLomsAddCreate.filter(function(element) {
                     return element!== lom;
                 });
             }         
        };
        $scope.selectLomsToDeleteFromLessonCreate=function(active,lom,indexSection, indexLesson){
            if( ($scope.indexLomSelectedCreate[0] != indexSection) || ( ($scope.indexLomSelectedCreate[0] == indexSection) && ($scope.indexLomSelectedCreate[1] != indexLesson) )){
                $scope.indexLomSelectedCreate=[indexSection, indexLesson];
                $scope.listAuxLomsRemoveCreate=[];
                $scope.listAuxLomsAddCreate=[];
            } 
            if(active){
                $scope.listAuxLomsRemoveCreate.push(lom);
            }
            else{
                $scope.listAuxLomsRemoveCreate=$scope.listAuxLomsRemoveCreate.filter(function(element) {
                    return element!== lom;
                });
            }
        };
        $scope.addLomsToListAdd=function($event){
            $event.preventDefault();
            angular.forEach($scope.listAuxLomsAddCreate, function(element) {
                if(!isIn($scope.lomsToAdd,element)) $scope.lomsToAdd.push(element);
            });
            $scope.listAuxLomsAddCreate=[];
        };
        var isIn=function(list,element){
            var contains = false;
            for(var i = 0; i < list.length; i++) {
                if (list[i]._id == element._id) {
                    contains = true;
                    break;
                }
            }
            return contains;
        }
        $scope.removeLomsFromListAdd=function($event){
            $event.preventDefault();
            angular.forEach($scope.listAuxLomsRemoveCreate, function(element) {
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
        };
        
        $scope.addLomsToLesson=function(sectionName,lesson,indexSection,indexLesson,$event){
            $event.preventDefault();
            var lomsToAdd=[],
                lomsLesson=lesson.loms,
                lomsNotAdded=[];
            for (var i = 0, len = $scope.listAuxLomsAdd.length-1; i <= len; i++) {
                var add=true;
                for (var j = 0, len2 = lomsLesson.length-1; j <= len2; j++) {
                    console.log($scope.listAuxLomsAdd[i]._id, ' == ' ,lomsLesson[j].lom_id)
                    if($scope.listAuxLomsAdd[i]._id == lomsLesson[j].lom_id) {
                        add=false;
                        break
                    }
                }
                if(add) lomsToAdd.push($scope.listAuxLomsAdd[i]);
                else lomsNotAdded.push($scope.listAuxLomsAdd[i]);   
            }      

            clearSelectedLoms();
            
            $scope.listAuxLomsAdd=[]; 
            if(lomsToAdd.length >0){
                coursesApi.assignLomsLesson(common.courseSelected._id,sectionName,lesson.name,lomsToAdd).then(function(response) {
                        console.log('ok después de asignar la lista de '+lomsToAdd.length+' loms a una lección', response);
                        console.log('    -----    '); 
                        updateLomsLessons(common.courseSelected._id,sectionName,indexSection,indexLesson);      
                        if(lomsNotAdded.length >0)   alert('Los loms repetidos no se añadirán a continuación! ');
                    }, function(error) {
                         console.log('error después de asignación de lom a una lección', error);
                });
            }else if(lomsNotAdded.length >0)   alert('Los loms repetidos no se han añadido! ');
        };

        $scope.deleteLomsFromLesson=function(sectionName,lesson,indexSection,indexLesson,$event){
            $event.preventDefault();
            var lomsLesson=lesson.loms;
            var lomsToNotDelete=[];
            var lomsToAdd=[];           

            for (var i = 0, len = lomsLesson.length-1; i <= len; i++) {
                var add=true;
                for (var j = 0, len2 = $scope.listAuxLomsRemove.length-1; j <= len2; j++) {
                    if(lomsLesson[i].lom_id == $scope.listAuxLomsRemove[j].lom_id) {
                        add=false;
                        break
                    }
                }
                if(add) lomsToNotDelete.push(lomsLesson[i]);  
            }   

            for (var i = 0, len = lomsToNotDelete.length-1; i <= len; i++) {
                for (var j = 0, len2 = $scope.loms.length-1; j <= len2; j++) {
                    if(lomsToNotDelete[i].lom_id == $scope.loms[j]._id) {
                        lomsToAdd.push($scope.loms[j]);
                        break;
                    }
                }  
            }   

            $scope.listAuxLomsRemove=[];
            coursesApi.resetLomsLesson(common.courseSelected._id,sectionName,lesson.name).then(function(response) {
                    console.log('ok después eliminar loms de una lección', response);
                    var promise=assignLomsToLesson(common.courseSelected._id,sectionName,lesson.name,lomsToAdd);
                    promise.then(function(){
                        $scope.resetLesson();
                        clearSelectedLoms();
                        //updateEditLessons(common.courseSelected._id,sectionName,indexSection);
                        updateLomsLessons(common.courseSelected._id,sectionName,indexSection,indexLesson);  
                    },function(err){
                        console.log('error: ',err);
                    });
                }, function(error) {
                     console.log('error después de asignación de lom a una lección', error);
            });
        };

        $scope.deleteLomFromLesson=function(sectionName,lesson,indexSection,indexLesson,lom){
            var lomsLesson=lesson.loms;
            var lomsToNotDelete=[];
            var lomsToAdd=[];           

            for (var i = 0, len = lomsLesson.length-1; i <= len; i++) {
                if(lomsLesson[i].lom_id != lom.lom_id) {
                    lomsToNotDelete.push(lomsLesson[i]); 
                } 
            } 
             for (var i = 0, len = lomsToNotDelete.length-1; i <= len; i++) {
                for (var j = 0, len2 = $scope.loms.length-1; j <= len2; j++) {
                    if(lomsToNotDelete[i].lom_id == $scope.loms[j]._id) {
                        lomsToAdd.push($scope.loms[j]);
                        break;
                    }
                }  
            }   
            

            coursesApi.resetLomsLesson(common.courseSelected._id,sectionName,lesson.name).then(function(response) {
                    console.log('ok después eliminar lom de una lección', response);
                    var promise=assignLomsToLesson(common.courseSelected._id,sectionName,lesson.name,lomsToAdd);
                    promise.then(function(){
                        $scope.resetLesson();
                        //updateEditLessons(common.courseSelected._id,sectionName,indexSection); 
                        updateLomsLessons(common.courseSelected._id,sectionName,indexSection,indexLesson); 
                        $scope.listAuxLomsRemove=[]; 
                    },function(err){
                        console.log('error: ',err);
                    });
                }, function(error) {
                     console.log('error después de asignación de lom a una lección', error);
            });
        };
        $scope.cancelAddEditCourse=function(){
            $location.path('/courses')
        }
        $scope.editCourse = function(courseName, courseCode, courseSummary,coursePhoto,sectionsCourse,objs) {
            /**/
                console.log('editing...');
                console.log("parametros de entrada: ",common.courseSelected._id,courseName,courseCode,courseSummary,sectionsCourse,objs);
                coursesApi.editCourse(common.courseSelected._id,courseName,courseCode,courseSummary,coursePhoto,sectionsCourse,objs).then(function(response) {
                    console.log('ok después de editCourse', response);
                    $scope.updateCourses();
                    confirm("Curso editado con éxito!");
                    $location.path("/courses");
                }, function(error) {
                    console.log('error después de editCourse', error);
                    confirm("Error al editar el curso.");
                });
                $scope.showCoursesForm=false;
            /*} else {
                console.log('There are invalid fields');
            }*/
            $scope.courseName='';
            $scope.courseCode='';
            $scope.courseSummary='';
            $scope.objectives={};
            $scope.sections={};
            $scope.courseHistory='';
        };
        /*$scope.editSection = function(index,newSectionsName, sectionsSummary, sectionsObjectives,sectionsLessons) {
            console.log('editing section ...');
            var sections=[],sectionName="";
            var defered = $q.defer(),
                promise = defered.promise;
            coursesApi.getSections(common.courseSelected._id).then(function(response){
                sections=response.data;
                sectionName=sections[index].name;
                console.log("(GET SECTIONS) sections de "+common.courseSelected._id+": "+sections.length);
                defered.resolve();
                console.log('anterior nombre de seccion: ',sectionName);
                console.log('objetos para editar ',sectionName,newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons);
                coursesApi.editSection(common.courseSelected._id,sectionName,newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons).then(function(response) {
                    console.log('ok después de editSection', response);
                    confirm("Sección editada con éxito!");
                }, function(error) {
                    console.log('error después de editSection', error);
                    confirm("Error al editar la sección.");
                });
                $scope.showCoursesForm=false;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });    
        };*/

        $scope.removeCourse = function(course,e){
            console.log('eliminado course con id: ', course._id);
            if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTE CURSO?") === false) {
                e.preventDefault();
                return;
            }
            deleteCourseFromTeacher($scope.activeUser._id,$scope.coursesTeacher,course._id);
            coursesApi.removeItem(course._id).then(function(response) {
                    console.log('eliminado course con exito', response); 
                    $scope.updateCourses();
                    deleteCourseFromStudents(course._id)
                }, function(error) {
                    console.log('error al eliminar course', error);
             });
        };
        var deleteCourseFromStudents=function(idCourse){
            var studentsWithCourse=[];
            usersApi.getStudents().then(function(response){
                console.log('Get students con exito ',response.data);
                $scope.students= response.data; 
                
                angular.forEach($scope.students,function(student){
                    for (var i = 0, len = student.course.length; i < len; i++) {
                        if(student.course[i].idCourse == idCourse){
                            studentsWithCourse.push(student);
                            break;
                        } 
                    }
                });

                angular.forEach(studentsWithCourse,function(student){
                    var studentCourses=student.course.filter(function(curso) {
                        return curso.idCourse!== idCourse;
                    });
                    
                    //Hacer algo
                    
                });
                
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        }
     
        $scope.removeSection = function(sectionName,e){
            console.log('eliminando sección con id: ', sectionName);
            if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTA SECCIÓN?") === false) {
                e.preventDefault();
                return;
            }
            coursesApi.removeSection(common.courseSelected._id,sectionName).then(function(response) {
                    console.log('eliminada sección con exito', response);
                    $scope.updateSections(common.courseSelected._id);
                    //$scope.sectionsSelected=[];
                    /*var promise=updateSectionsSelected(common.courseSelected._id);
                    promise.then(function() {
                        console.log('Secciones actualizadas!'); 
                        $scope.updateCourses();    
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar las secciones: '+error);     
                    });*/
                }, function(error) {
                    console.log('error al eliminar sección', error);
             });
        };
        $scope.removeLesson = function(sectionName,lessonName,indexSection,e){
            console.log('eliminando lección con id: ', sectionName,lessonName,indexSection);
            if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTA LECCIÓN?") === false) {
                e.preventDefault();
                return;
            }
            coursesApi.removeLesson(common.courseSelected._id,sectionName,lessonName).then(function(response) {
                    console.log('eliminada lección con exito', response);
                    updateEditLessons(common.courseSelected._id,sectionName,indexSection);
                    if(common.courseSelected.numLessons>0){
                        common.courseSelected.numLessons = common.courseSelected.numLessons -1;
                        coursesApi.editNumLessons(common.courseSelected._id,common.courseSelected.numLessons).then(function(response) {
                            console.log('ok después de incrementar numero de lecciones', response);
                        }, function(error) {
                            console.log('error después de incrementar numero de lecciones', error);
                        });
                    }
                }, function(error) {
                    console.log('error al eliminar lección', error);
             });
        };
        var deleteCourseFromTeacher= function (idTeacher,courses,idCourse) {
            let filteredCourses=[];
            angular.forEach(courses,function(course){
                if(course._id!=idCourse){
                    filteredCourses.push(course);
                }
            });
            teacherApi.updateCoursesTeacher(idTeacher,filteredCourses,$scope.activeUser.identification).then(function(response){
                console.log('Actualizando cursos de profesor con éxito: ',response);
            }, function myError(err) {
                console.log(err);
                alert('Error actualizando cursos de profesor de tipo: '+err.status);      
            }); 
        }
        
        $scope.removeObj = function(obj,section,lesson,e){
            var breadCrumb= e.originalEvent.path[3].classList[0];
            console.log('-------------breadCrumb: ', breadCrumb);
            console.log('eliminado objetivo: ', obj);
            if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTE OBJETIVO?") === false) {
                e.preventDefault();
                return;
            }
            if(breadCrumb=="editCourse"){
                removeObjFromCourse(obj);
            }else if(breadCrumb=="editSection"){
                removeObjFromSection(obj,section);            
            }
            else if(breadCrumb=="editLesson"){
                removeObjFromLesson(obj,section.name,lesson);        
            } 
        };
        var removeObjFromCourse=function(obj){
            var index=-1,
                objsSelected=common.courseSelected.objectives;
            for (var i = 0, len = objsSelected.length; i < len; i++) {
                if(objsSelected[i].code === obj.code && objsSelected[i].description === obj.description &&
                  objsSelected[i].bloom === obj.bloom && objsSelected[i].level === obj.level){
                    index = i;
                    break;
                } 
            }
            if(index>-1){
                objsSelected.splice(index, 1);
            }
            coursesApi.updateObjetivesCourse(common.courseSelected._id,objsSelected).then(function(response) {
                    console.log('eliminado objetivo con exito de curso', response);
                    $scope.updateCourses();
                }, function(error) {
                    console.log('error al eliminar objetivo de curso', error);
            });                                                 
        }
        var removeObjFromSection=function(obj, section){
            var index=-1,
                objsSelected=section.objectives;
            for (var i = 0, len = objsSelected.length; i < len; i++) {
                if(objsSelected[i].code === obj.code && objsSelected[i].description === obj.description &&
                  objsSelected[i].bloom === obj.bloom && objsSelected[i].level === obj.level){
                    index = i;
                    break;
                } 
            }
            if(index>-1){
                objsSelected.splice(index, 1);
            }
            coursesApi.resetObjectivesSection(common.courseSelected._id,section.name).then(function(response) {
                    console.log('reseteados objetivos con exito de sección', response);
                    coursesApi.addObjectivesToSection(common.courseSelected._id,section.name,objsSelected).then(function(response) {
                        console.log('eliminado objetivo con exito de sección', response);
                        $scope.updateCourses();
                    }, function(error) {
                        console.log('error al eliminar objetivo de sección', error);
                    }); 
                }, function(error) {
                    console.log('error al resetear objetivos de sección', error);
            });                                                 
        }
        var removeObjFromLesson=function(obj,sectionName,lesson){
            var index=-1,
                objsSelected=lesson.objectives;
            for (var i = 0, len = objsSelected.length; i < len; i++) {
                if(objsSelected[i].code === obj.code && objsSelected[i].description === obj.description &&
                  objsSelected[i].bloom === obj.bloom && objsSelected[i].level === obj.level){
                    index = i;
                    break;
                } 
            }
            if(index>-1){
                objsSelected.splice(index, 1);
            }
            
            coursesApi.resetObjectivesLesson(common.courseSelected._id,sectionName,lesson.name).then(function(response) {
                    console.log('eliminado objetivos con exito de lección', response);

                    coursesApi.addObjectivesToLesson(common.courseSelected._id,sectionName,lesson.name,objsSelected).then(function(response) {
                        console.log('añadiendo objetivos con exito a lección', response);
                        $scope.updateCourses();
                    }, function(error) {
                        console.log('error al añadir objetivos a lección', error);
                    });
                    
                }, function(error) {
                    console.log('error al eliminar objetivos de lección', error);
            });                                                 
        }
        $scope.deleteAllCourses = function(e){
            console.log('eliminado courses');
            if (confirm("¿ESTÁ DISPUESTO A ELIMINAR TODOS LOS CURSOS?") === false) {
                e.preventDefault();
                return;
            }
            coursesApi.removeAllItem().then(function(response) {
                    console.log('eliminado todos los items con exito', response);
                }, function(error) {
                    console.log('error al eliminar todos los items', error);
             });
        };

        $scope.goCourse=function(course){
            resetCourseSelected();
            common.courseSelected= course;
            $scope.courseSelected=course;
            common.actualViewCourse='coursePage';
            $scope.managementCourseViews(common.actualViewCourse);
            var promise=updateSectionsSelected(course._id);
            promise.then(function() {
                console.log('numero de secciones en goCourse: ', common.sectionsCourseSelected.length);
                isEnrolledInCourse($scope.activeUser._id,$scope.courseSelected._id);
            }, function(error) {
                console.log('Se ha producido un error al obtener el dato: '+error);     
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

        $scope.okEndLesson = function() {
            console.log('Terminando lección...');
            console.log("Parametros de entrada de okEndLesson: ",$scope.activeUser._id,common.courseSelected._id,$scope.activity._id);
            coursesApi.okEndLesson($scope.activeUser._id,common.courseSelected._id,$scope.activity._id).then(function(response) {
                var promise=updateActiveUser($scope.activeUser._id);
                    promise.then(function() {
                        console.log('ok después finalizar correctamente una lección', response);
                        common.actualViewCourses='coursePage';
                        common.enrolledInCourse=true;
                        $location.path("/courses");    
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar el usuario activo: '+error);     
                    }); 
            }, function(error) {
                console.log('error después de finalizar correctamente una lección', error);
            });  
        };
        $scope.endActivity = function() {
            console.log('Terminando actividad...');
            console.log("Parametros de entrada de endActivity: ",$scope.activeUser._id,common.courseSelected._id,$scope.activity._id);
            coursesApi.endActivity($scope.activeUser._id,common.courseSelected._id,$scope.activity._id).then(function(response) {  
                var promise=updateActiveUser($scope.activeUser._id);
                    promise.then(function() {
                        console.log('ok después finalizar correctamente una lección', response);
                        $scope.okEndLesson();  
                        $scope.newActivity(); 
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar el usuario activo: '+error);     
                    }); 
            }, function(error) {
                console.log('error después de finalizar correctamente una lección', error);
            });      
        }; 
        $scope.correctActivity = function(score) {
            console.log('Corrigiendo actividad...');
            console.log("Parametros de entrada de correctActivity: ",$scope.activeUser._id,common.courseSelected._id,$scope.activity._id,score);
            coursesApi.correctActivity($scope.activeUser._id,common.courseSelected._id,$scope.activity._id).then(function(response) {
                console.log('ok después corregir correctamente una actividad', response);
                /*$scope.newActivity();*/
            }, function(error) {
                console.log('error después de corregir correctamente una actividad', error);
            });      
        };

        $scope.badEndLesson = function() {
            console.log('Terminando incorrectamente lección...');
            console.log("Parametros de entrada de badEndLesson: ",$scope.activeUser._id,common.courseSelected._id,$scope.activity._id);
            coursesApi.badEndLesson($scope.activeUser._id,common.courseSelected._id,$scope.activity._id).then(function(response) { 
                var promise=updateActiveUser($scope.activeUser._id);
                    promise.then(function() {
                        console.log('ok después finalizar incorrectamente una lección', response);
                        common.actualViewCourses='coursePage';
                        common.enrolledInCourse=true;
                        $location.path("/courses");
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar el usuario activo: '+error);     
                    });
            }, function(error) {
                console.log('error después de finalizar incorrectamente una lección', error);
            });      
        };

        $scope.backLesson = function() {
            console.log('vuelta atrás');
            common.actualViewCourses='coursePage';
            common.enrolledInCourse=true;
            $location.path("/courses");
        };
        $scope.pauseLesson = function() {
            console.log('Pausando una lección...');
            console.log("Parametros de entrada de pauseLesson: ",$scope.activeUser._id,common.courseSelected._id,$scope.activity._id);
            coursesApi.pauseLesson($scope.activeUser._id,common.courseSelected._id,$scope.activity._id).then(function(response) {
                var promise=updateActiveUser($scope.activeUser._id);
                    promise.then(function() {
                        console.log('ok después pausar una lección', response);
                        common.actualViewCourses='coursePage';
                        common.enrolledInCourse=true;
                        $location.path("/courses");
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar el usuario activo: '+error);     
                    });
            }, function(error) {
                console.log('error después de pausar una lección', error);
            });      
        };

        $scope.getNextLesson= function(lesson,index){
            console.log('Get de siguiente Lección, Parámetros',$scope.activeUser,common.courseSelected._id);
            usersApi.getNextLesson($scope.activeUser,common.courseSelected._id).then(function(response){
                console.log('Ok. Siguiente Lección: ',response.data);             
            }, function myError(err) {
                console.log(err);      
            });
        }

        // ----------------    STUDENT  ---------------
        $scope.assignStudentToGroup=function(idStudent){
            console.log('Asignando estudiante a grupo ...');
            usersApi.assignStudentToGroup(idStudent).then(function(response){
                console.log('Estudiante asignado correctamente ...'); 
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        $scope.enrollStudent=function(idStudent,idCourse){
            if (confirm("¿SEGURO QUE DESEA MATRICULARSE EN ESTE CURSO?") === false) {
                e.preventDefault();
                return;
            }
            console.log('Matriculando a alumno ...');
            var studentsEnrolled=[];
            usersApi.enrollStudent(idStudent,idCourse).then(function(response) {       
                confirm("MATRICULADO CON ÉXITO !!");
                console.log('ok después de enrollStudent', response);
                $scope.studentEnrolledInCourse=true;
                var promise=updateActiveUser(idStudent);
                    promise.then(function() {
                        $scope.updateCourses();    
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar el usuario activo: '+error);     
                    });
            }, function(error) {
                confirm("ERROR AL MATRICULARSE A ESTE CURSO !!");
                console.log('error después de enrollStudent', error);
            });   
        };
        $scope.unEnrollStudent=function(student,idCourse){
            if (confirm("¿SEGURO QUE DESEA DARSE DE BAJA EN ESTE CURSO?") === false) {
                e.preventDefault();
                return;
            }
            console.log('Eliminando Matricula de alumno sobre curso...');
            var studentCourses=[];
            var studentCourses= student.course.filter(function(course) {
                return course._idCourse!==idCourse;
            });
            var idStudent=student._id;
            usersApi.unEnrollStudent(idStudent,idCourse).then(function(response) {       
                confirm("SE HA DADO DE BAJA CORRECTAMENTE !!");
                $scope.studentEnrolledInCourse=false;
                console.log('ok después de eliminar un estudiante', response);
                    var promise=updateActiveUser(student._id);
                    promise.then(function() {
                        $scope.updateCourses(); 
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar el usuario activo: '+error);     
                    });    
            }, function(error) {
                confirm("ERROR AL DARSE DE BAJA EN ESTE CURSO !!");
                console.log('error después de unEnrollStudent', error);
            });   
        };

        var updateActiveUser=function(idStudent){
            var defered=$q.defer(),
                promise=defered.promise;                              
            usersApi.getStudent(idStudent).then(function(response) {
                console.log('ok después de consultar un estudiante', response);
                $scope.activeUser=response.data;
                common.activeUSer=$scope.activeUser;
                defered.resolve();
            }, function(error) {
                console.log('error después de consultar un estudiante', error);
            });
            return promise;
        }

        var isEnrolledInCourse=function(idStudent,idCourse){
             console.log("Función isEnrolled, parametros:",idStudent,idCourse);
            usersApi.isEnrolledInCourse(idStudent,idCourse).then(function(response){
                console.log('operación isEnrolledInCourse realizada con éxito',response.data);
                $scope.studentEnrolledInCourse=response.data;
            }, function myError(err) {
                console.log('operación isEnrolledInCourse fallida',err);      
            });
        }

        $scope.goLesson= function(lesson,index){
            console.log('Go Lesson ---------',common.activeUSer._id,common.courseSelected._id);
            lomsApi.getLom(lesson.loms[0].lom_id).then(function(response){
                console.log('---------- Lom - NUEVA ACTIVIDAD: ',response.data);  
                common.lessonSelected=lesson;
                $scope.lessonSelected=common.lessonSelected;
                common.indexLessonSelected=index;
                $scope.indexLessonSelected=common.indexLessonSelected;

                $scope.activity= response.data;
                common.newActivity= $scope.activity; 
                $scope.page = {src: $scope.activity.technical.url, title:$scope.activity.general.title};
                common.urlActivity =$scope.page;
                $location.path("/activity");
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        }
        $scope.existsAchievedObjectives=function(objectives,codeCourse){
            var achievedObjectives=false;
            for(var i = 0; i < objectives.length; i++) {
                if (objectives[i].code == codeCourse) {
                    achievedObjectives = true;
                    break;
                }
            }
            return achievedObjectives;
        }
        var getStudentsEnrolledCourses= function(idStudent) {
            var promise=updateActiveUser(idStudent);
                promise.then(function() {
                    
                    var enrolledCoursesStudent= $scope.activeUser.course;
                    $scope.enrolledCourses=[];
                    $scope.loadCourses=[];
                    angular.forEach($scope.courses,function(course){
                        angular.forEach(enrolledCoursesStudent,function(enrolledCoursed){
                            if(enrolledCoursed.idCourse==course._id){
                                $scope.enrolledCourses.push(course);
                            }
                        });
                    });
                    $scope.loadCourses=$scope.enrolledCourses;

                }, function(error) {
                    console.log('Se ha producido un error al actualizar el usuario activo: '+error);     
                });
        };

    
       var getStudentsCoursesFinished= function(idStudent) {
             console.log('loading cursos terminados ...',idStudent);
             coursesApi.getStudentsCoursesFinished(idStudent).then(function(response){
                var doneCourses=response.data;
                $scope.doneCourses= [];  

                $scope.loadCourses=[];
                for (var i = 0; i<doneCourses.length; i++) {
                    for (var j = 0; j<$scope.courses.length; j++) {
                        if(doneCourses[i]==$scope.courses[j]._id){
                            $scope.doneCourses.push($scope.courses[j]);
                            break;
                        }
                    }
                }
                $scope.loadCourses=$scope.doneCourses;

             }, function myError(err) {
                 console.log(err);
                 alert('Error de tipo: '+err.status);      
             }); 
        };
        $scope.getStudentsCoursesUnfinished= function(idStudent) {
            // console.log('loading cursos inacabados ...');
            // coursesApi.getStudentsCoursesUnfinished(idStudent).then(function(response){
            //     $scope.enrolledCourses= response.data;          
            // }, function myError(err) {
            //     console.log(err);
            //     alert('Error de tipo: '+err.status);      
            // }); 
        };
        $scope.getLastInludedCourses= function(idStudent) {
            // console.log('loading los últimos cursos incluidos ...');
            // coursesApi.getLastInludedCourses(idStudent).then(function(response){
            //     $scope.lastIncludedCourses= response.data;          
            // }, function myError(err) {
            //     console.log(err);
            //     alert('Error de tipo: '+err.status);      
            // }); 
        };
        $scope.getRelatedCourses= function(idStudent) {
            // console.log('loading todos los cursos relacionados...');
            // coursesApi.getRelatedCourses(idStudent).then(function(response){
            //     $scope.relatedCourses= response.data;          
            // }, function myError(err) {
            //     console.log(err);
            //     alert('Error de tipo: '+err.status);      
            // }); 
        };
        $scope.getAllStudentsCourses= function(idStudent) {
            // console.log('loading todos los cursos ...');
            // coursesApi.getAllStudentsCourses(idStudent).then(function(response){
            //     $scope.enrolledCourses= response.data;          
            // }, function myError(err) {
            //     console.log(err);
            //     alert('Error de tipo: '+err.status);      
            // }); 
        };
        
        $scope.newActivity=function(){
            console.log('Solicitando nueva actividad ...');
            console.log('Parámetros para solicitar nueva actividad: ',$scope.activeUser._id,common.courseSelected._id);
            coursesApi.getNewActivity($scope.activeUser._id,common.courseSelected._id).then(function(response){
                $scope.activity= response.data;
                common.newActivity= $scope.activity; 
                console.log('Nueva actividad obtenida con éxito',$scope.activity);
                
                $scope.page = {src: $scope.activity.technical.url, title:$scope.activity.general.title};
                common.urlActivity =$scope.page;
                $location.path("/activity");
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }
        var loadPage= function(){
            $scope.page = {src: $scope.activity.technical.url, title:"Loading activity."};
            common.urlActivity =$scope.page;
            /*var url = $scope.activity.technical.url + "&output=embed";
            window.location.replace(url);*/
        }

         // ----------------    FIN STUDENT METHODS ---------------



         // ----------------  TEACHER METHODS ---------------
         var assignCourseToTeacher=function(idTeacher,idCourse) {
            console.log("Objetos para asignar curso a profesor: "+ idTeacher,idCourse);
            var coursesTeacher=[];   
            coursesTeacher= $scope.activeUser.elements.courses;
            console.log('Obteniendo cursos de profesor: ',coursesTeacher);
            coursesTeacher.push(idCourse);
            teacherApi.updateCoursesTeacher(idTeacher,coursesTeacher,$scope.activeUser.identification).then(function(response){
                console.log('Actualizando curso a profesor con éxito: ',response);
            }, function myError(err) {
                console.log(err);
                alert('Error actualizando cursos a profesor de tipo: '+err.status);      
            });    
        }


        // ----------------    FIN TEACHER METHODS ---------------



        // -------------- LOAD IMAGES METHODS ---------------------
        $scope.thumbnail = {
            dataUrl: common.bitbloqBackendUrladsfas
        };
        $scope.fileReaderSupported = window.FileReader != null;
        $scope.photoChanged = function(files){
            if (files != null) {
                var file = files[0];
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function(){
                                $scope.thumbnail.dataUrl = e.target.result;
                            });
                        }
                    });
                }
            }
        };
        // 

    });

