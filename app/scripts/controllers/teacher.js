'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:CoursesCtrl
 * @description
 * # CoursesCtrl
 * Controller of the botbloqItsFrontendApp
 */

  botBloqApp.controller('teacherCtrl',function($log,$q,$scope,$http,$location,$timeout,$sce, teacherApi,common) {
    $log.log('teacher ctrl start');
    $scope.changeInit(false); 
    
    $scope.activeUser=common.activeUSer;
		$scope.changeActiveUserHeader($scope.activeUser);
     	
		
            

    // --- EDIT COURSE --- ????
    $scope.courseSelected=common.courseSelected;
    $scope.objectivesCourseSelected=common.objectivesCourseSelected;
    $scope.sectionsSelected=common.sectionsCourseSelected;
    $scope.lessonsSelected=common.lessonsCourseSelected;
    $scope.lessonSelected=common.lessonSelected;
    $scope.indexLessonSelected=common.indexLessonSelected;

        // $scope.sections=[];
        // $scope.lesson=[];

        // $scope.editCourseName=common.courseSelected.name;
        // $scope.editCourseCode=common.courseSelected.code;
        // $scope.editCourseSummary=common.courseSelected.summary;

        // $scope.editCourseObjectives=common.sectionsCourseSelected[0];
        // $scope.editSections=common.sectionsCourseSelected[0];

        // --- END EDIT COURSE ---
      
    /* listado de cursos **/
    teacherApi.getCourses().then(function(response){
      $scope.courses= response.data;
      console.log(response.data);
    }, function myError(err) {
      console.log(err);
      alert('Error de tipo: '+err.status);      
    }); 

    /* crear curso nuevo */
    $scope.goAddCourse= function(){
      $location.path("/addCourse");
    };

    $scope.showAddCourseForm = function() {
      $scope.showCoursesForm=true;
      $scope.edit=false;
    };

    $scope.addEditCourse = function() {
      console.log('valor de edit: ', $scope.edit);
      //if($scope.edit) $scope.editCourse($scope.idItemToEdit);
      //else  {
        $scope.addCourse();
    };

    /* add new course */
    $scope.addCourse = function() {
      if ($scope.adminCoursesForm.$valid) {

        var oa = {
          lom_id: '',
          type : ''
        }; 
        // insert lom in bd
        teacherApi.addLom($scope.lesson.name, $scope.lom_url).then(function(response) {
              console.log('lom añadido');
             oa.lom_id = common.lom;
             console.log(oa);
             
             common.lom = '';
             $scope.lesson.loms = [];
             $scope.lesson.loms.push(oa);
               
             // add objectives
             $scope.course.objectives = []
             $scope.course.objectives.push($scope.objectives);
             
             // add default section 
             var section = 
                       {name: 'Sección por defecto',
                        summary: 'Sección que aglutina todas las secciones del curso',
                        objectives: [],
                        lessons : []};
             // add section objectives
             section.objectives.push($scope.objectives);
             // add lesson objectives
             $scope.lesson.objectives = [];
             $scope.lesson.objectives.push($scope.objectives); // TODO level distribution
             $scope.lesson.learning_path = JSON.parse("[" + $scope.learningpath + "]");
             // add lesson
             section.lessons.push($scope.lesson);
             // push
             $scope.course.sections = [];
             $scope.course.sections.push(section);
             // add author
             $scope.course.author = $scope.activeUser.identification.name;
             // send request
             console.log($scope.course);
             teacherApi.addCourse($scope.course).then(function(response) {
                 console.log('ok después de addCourse', response);
                 $location.path("/teacher");
             }, function(error) {
                 console.log('error después de addCourse', error);
             });
             $scope.showCoursesForm=false; // ??

          }, function(error) {
              console.log('error después de addLom', error);
          });
        
      } else {
          alert('Existen valores incorrectos');
      }
    };

    /* remove a course */
    $scope.removeCourse = function(course,e){
      console.log('eliminado course con id: ', course);
      if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTE CURSO?") === false) {
        e.preventDefault();
        return;
      }
      teacherApi.removeCourse(course._id).then(function(response) {
        console.log('eliminado course con exito', response);
        $scope.refreshCourses();
      }, function(error) {
        console.log('error al eliminar course', error);
      });
    };

    /* refresh courses visualization */
    $scope.refreshCourses= function() {
      console.log('loading Courses ...');
      teacherApi.getCourses().then(function(response){
        $scope.courses= response.data;        
      }, function myError(err) {
        console.log(err);
        alert('Error al recuperar los cursos: '+err.status);      
      }); 
    };

/* edición de cursos */

  $scope.goEditCourse = function(item) {
    common.courseSelected=item;
    console.log(item);
    
    common.objectivesCourseSelected=item.objectives;
    common.sectionsCourseSelected=item.sections;
    
    console.log('edicion de ',common.courseSelected.name);
    $scope.editObjectives=item.objectives;
           
    $scope.editSections=item.sections;
    $scope.editCourseHistory=item.history;
    $scope.showCoursesForm=true;
    $scope.edit=true;
    $scope.idItemToEdit=item._id;
    $location.path("/editCourse");
        
  };

  $scope.editCourse = function(course) {
        if ($scope.coursesEditForm.$valid ) {
            console.log('editing...');
            console.log("parametros de entrada: ",course); 
            teacherApi.removeCourse(course._id).then(function(response) {
                  console.log('eliminado course con exito', response);
                  teacherApi.editCourse(course).then(function(response) {
                      console.log('ok después de editCourse', response);
                      //$scope.updateCourses();
                      alert("Curso editado con éxito!");
                      $scope.refreshCourses();
                      $location.path("/teacher");
                }, function(error) {
                  console.log('error al crear curso editado', error);
                });
            }, function(error) {
                console.log('error después de remove course', error); 
                confirm("Error al editar el curso.");
            });
            $scope.showCoursesForm=false;
        } else {
            console.log('There are invalid fields');
        }

    };


        // $scope.showInfoCourse = function(item){
        //     $scope.InfoCourse=true;
        //     console.log('loading get info courses ...');
        //     coursesApi.getCourse(item).then(function(response){
        //         $scope.courseName=response.data.name;
        //         $scope.courseCode=response.data.code;
        //         $scope.courseSummary=response.data.summary;
        //         $scope.objectives=response.data.objetives;
        //         $scope.sections=response.data.sections;
        //         $scope.courseHistory=response.data.history;
        //     }, function myError(err) {
        //         console.log(err);
        //         alert('Error de tipo: '+err.status);      
        //     });
        // };
        // $scope.hideInfoCourse = function(){
        //     $scope.InfoCourse=false;
        // };



   //      $scope.updateLastCourse= function() {
   //          console.log('loading Courses ...');
   //          coursesApi.getCourses().then(function(response){
   //              $scope.courses= response.data; 
   //              common.courseSelected=$scope.courses[$scope.courses.length -1];         
   //          }, function myError(err) {
   //              console.log(err);
   //              alert('Error de tipo: '+err.status);      
   //          }); 
   //      };
        
   //      $scope.showHideFields= function(fieldset) {
   //          if (fieldset==1){
   //              if($scope.showFieldsGeneral) $scope.showFieldsGeneral=false;
   //              else $scope.showFieldsGeneral=true;
   //          }else if(fieldset==2){
   //              if($scope.showFieldsObjectives) $scope.showFieldsObjectives=false;
   //              else $scope.showFieldsObjectives=true;
   //          }else if(fieldset==3){
   //              if($scope.showFieldsSections) $scope.showFieldsSections=false;
   //              else $scope.showFieldsSections=true;
   //          }else if(fieldset==4){
   //              if($scope.showFieldsSectionsObj) $scope.showFieldsSectionsObj=false;
   //              else $scope.showFieldsSectionsObj=true;
   //          }else if(fieldset==5){
   //              if($scope.showFieldsSectionsLesson) $scope.showFieldsSectionsLesson=false;
   //              else $scope.showFieldsSectionsLesson=true;
   //          }else if(fieldset==6){
   //              if($scope.showFieldsSectionsLessonObj) $scope.showFieldsSectionsLessonObj=false;
   //              else $scope.showFieldsSectionsLessonObj=true;
   //          }
   //      };

  

   //      $scope.showEditCourseForm = function(item) {
   //          $scope.showCoursesForm=true;
   //          $scope.edit=true;
   //          $scope.idItemToEdit=item._id;

   //          $scope.courseName=item.name;
   //          $scope.courseCode=item.code;
   //          $scope.courseSummary=item.summary;
   //          $scope.objectives=item.objetives;
   //          $scope.sections=item.sections;
   //          $scope.courseHistory=item.history;
   //      };

 
        
   //          $scope.editObjectives=item.objetives;
           
   //          $scope.editSections=item.sections;
   //          $scope.editCourseHistory=item.history;
   //          $scope.showCoursesForm=true;
   //          $scope.edit=true;
   //          $scope.idItemToEdit=item._id;

   //      };

  


       


   
       
       
   //      $scope.editCourse = function(courseName, courseCode, courseSummary,objs) {
   //          if ($scope.coursesEditForm.$valid ) {
   //              console.log('editing...');
   //              console.log("parametros de entrada: ",common.courseSelected._id,courseName,courseCode,courseSummary,objs);
   //              coursesApi.editCourse(common.courseSelected._id,courseName,courseCode,courseSummary,common.objectivesCourseSelected).then(function(response) {
   //                  console.log('ok después de editCourse', response);
   //                  $scope.updateCourses();
   //                  confirm("Curso editado con éxito!");
   //                  $location.path("/courses");
   //              }, function(error) {
   //                  console.log('error después de editCourse', error);
   //                  confirm("Error al editar el curso.");
   //              });
   //              $scope.showCoursesForm=false;
   //          } else {
   //              console.log('There are invalid fields');
   //          }
   //          $scope.courseName='';
   //          $scope.courseCode='';
   //          $scope.courseSummary='';
   //          $scope.objectives={};
   //          $scope.sections={};
   //          $scope.courseHistory='';
   //      };
   //      $scope.editSection = function(index,newSectionsName, sectionsSummary, sectionsObjectives,sectionsLessons) {
   //          console.log('editing section ...');
   //          var sections=[],sectionName="";
   //          var defered = $q.defer(),
   //              promise = defered.promise;
   //          coursesApi.getSections(common.courseSelected._id).then(function(response){
   //              sections=response.data;
   //              sectionName=sections[index].name;
   //              console.log("(GET SECTIONS) sections de "+common.courseSelected._id+": "+sections.length);
   //              defered.resolve();
   //              console.log('anterior nombre de seccion: ',sectionName);
   //              console.log('objetos para editar ',sectionName,newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons);
   //              coursesApi.editSection(common.courseSelected._id,sectionName,newSectionsName,sectionsSummary,sectionsObjectives,sectionsLessons).then(function(response) {
   //                  console.log('ok después de editSection', response);
   //                  confirm("Sección editada con éxito!");
   //              }, function(error) {
   //                  console.log('error después de editSection', error);
   //                  confirm("Error al editar la sección.");
   //              });
   //              $scope.showCoursesForm=false;
   //          }, function myError(err) {
   //              console.log(err);
   //              alert('Error de tipo: '+err.status);      
   //          });    
   //      };

   //      $scope.removeCourse = function(course,e){
   //          console.log('eliminado course con id: ', course);
   //          if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTE CURSO?") === false) {
   //              e.preventDefault();
   //              return;
   //          }
   //          coursesApi.removeItem(course._id).then(function(response) {
   //                  console.log('eliminado course con exito', response);
   //                  $scope.updateCourses();
   //              }, function(error) {
   //                  console.log('error al eliminar course', error);
   //           });
   //      };
       

   //      $scope.goCourse=function(course, idStudent){
   //          common.courseSelected= course;
   //          $scope.courseSelected=course;
			// console.log("curso seleccionado " );
			// console.log(course);
   //          resetCourseSelected();
			// usersApi.isEnrolled(idStudent,course._id).then(function(response){
			// 	console.log('operación isEnrolledInCourse realizada con éxito',response.data);
   //              $scope.studentEnrolledInCourse=response.data;
   //          }, function myError(err) {
   //              console.log('operación isEnrolledInCourse fallida',err);      
   //          });
			
   //          var promise=updateSectionsSelected(course._id);
   //          promise.then(function() {
   //              console.log('numero de secciones en goCourse: ', common.sectionsCourseSelected.length);
   //              calculateNumLessons(course._id);
   //          }, function(error) {
   //              console.log('Se ha producido un error al obtener el dato: '+error);     
   //          });
			// common.actualViewCourses='coursePage';
   //          $scope.managementCourseViews(common.actualViewCourses);
   //      };

   //      var calculateNumLessons=function(idCourse){
   //          angular.forEach(common.sectionsCourseSelected,function(section){
   //              updateLessonsSelected(idCourse,section.name);
   //          });
   //      };
   //      var resetCourseSelected=function(){
   //          common.sectionsCourseSelected=[];
   //          common.lessonsCourseSelected=[];
   //          $scope.sectionsSelected=common.sectionsCourseSelected;
   //          $scope.lessonsSelected=common.lessonsCourseSelected;
   //      };
   //      var searchCourse= function(id){
   //          var courseSelected=null;
   //          angular.forEach($scope.courses, function(element) {
   //              if(element._id==id){
   //                  courseSelected=element;
   //              }
   //          });
   //          return courseSelected;
   //      };

   //      $scope.showEnrolledCourses=function(){
   //          $scope.totalCoursesPage=false;
   //          $scope.enrolledCoursesPage=true;
   //          $scope.coursePage=false;
   //          $scope.objectivesPage=false;
   //          $scope.completedCoursesPage=false;
   //          $scope.getStudentsCoursesActives($scope.activeUser._id);
   //          //$scope.getAllStudentsCourses($scope.activeUser._id);
   //          //$scope.getStudentsCoursesUnfinished($scope.activeUser._id);
   //          //$scope.getStudentsCoursesFinished($scope.activeUser._id);
   //      };
   //      $scope.showCompletedCourses=function(){
   //          $scope.totalCoursesPage=false;
   //          $scope.enrolledCoursesPage=false;
   //          $scope.coursePage=false;
   //          $scope.objectivesPage=false;
   //          $scope.completedCoursesPage=true;
   //          $scope.getStudentsCoursesActives($scope.activeUser._id);
   //          //$scope.getAllStudentsCourses($scope.activeUser._id);
   //          //$scope.getStudentsCoursesUnfinished($scope.activeUser._id);
   //          //$scope.getStudentsCoursesFinished($scope.activeUser._id);
   //      };

    
    

    });

