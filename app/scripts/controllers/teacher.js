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
      //console.log(common.newActivity);
      $scope.activity = common.newActivity;
      //console.log($scope.activity);
      console.log(response.data);
    }, function myError(err) {
      console.log(err);
      alert('Error al obtener los cursos: '+err.status);      
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
        teacherApi.addLom($scope.lesson.title, $scope.lom_url).then(function(response) {
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
             console.log("learning path", $scope.learningpath);
             try {
                $scope.lesson.learning_path = JSON.parse("[" + $scope.learningpath + "]");
              } catch (e) {
                $scope.lesson.learning_path = [];
              }
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
            teacherApi.editCourse(course).then(function(response) {
                console.log('ok después de editCourse', response);
                //$scope.updateCourses();
                alert("Curso editado con éxito!");
                $scope.refreshCourses();
                $location.path("/teacher");
            }, function(error) {
                console.log('error al crear curso editado', error);
             });
            $scope.showCoursesForm=false;
        } else {
            alert('Existen campos con valores no correctos');
        }

    };

    $scope.addLessonEdit=function(section, lesson){
      // search the section by name
      var enc = false;
      var i = 0;
      while (!enc) {
        if (section == common.courseSelected.sections[i].name) {
          enc = true;
        } else i++;

      }
      console.log(lesson);
      
      if (enc) {
        var newLesson = new Object();
        // setting attributes
        newLesson.name = lesson.name;
        newLesson.title = lesson.title;
        newLesson.photo = lesson.photo;
        newLesson.description = lesson.description;
        newLesson.difficulty = lesson.difficulty;
        newLesson.type = lesson.type;
        console.log("learning path", lesson.learningpath);
        try {
          newLesson.learning_path = JSON.parse("[" + lesson.learningpath + "]");
        } catch (e) {
          newLesson.learning_path = [];
        }
        // add objectives (section)
        newLesson.objectives = [];
        newLesson.objectives.push(common.courseSelected.sections[i].objectives[0]);
        // add loms
         // insert lom in bd
        console.log('url' + lesson.lom_url);
        teacherApi.addLom(newLesson.title, lesson.lom_url).then(function(response) {
          var oa = {lom_id: '', type : ''}; 
          console.log('lom añadido');
          oa.lom_id = common.lom;
          console.log(oa);
             
          common.lom = '';
          newLesson.loms = [];
          newLesson.loms.push(oa);
          // add lesson
          common.courseSelected.sections[i].lessons.push(newLesson);
          // reset fields
          lesson.name = "";
          lesson.title = "";
          lesson.photo = "";
          lesson.description = "";
          lesson.type = "";
          lesson.lom_url = "";
          lesson.learningpath = "";

        }, function(error) {
            console.log('error después de addLom', error);
        });
        

      }
    };

    /* course visualization */

    $scope.goCourse=function(course, idStudent){
      console.log("go course");
      common.courseSelected= course;
      $scope.courseSelected= course;
      console.log("curso seleccionado " );
      console.log(course);
      common.sectionsCourseSelected= course.sections;
      common.lessonsCourseSelected=  course.sections[0].lessons;
      $scope.coursePage = true;
      common.actualViewCourses='coursePage';
      $location.path("/viewCourse");
    };

    /* lesson visualization */

    $scope.goLesson= function(lesson,index){
      console.log('Go Lesson ---------');
      console.log(lesson);
      console.log("lom id " +lesson.loms[0].lom_id );
      
      
      teacherApi.getActivityLesson(lesson.loms[0].lom_id).then(function(response){
        $scope.activity= response.data;
        common.newActivity= $scope.activity; 
        console.log('Nueva actividad obtenida con éxito',$scope.activity.general);
        console.log('Nueva actividad obtenida con éxito (SERVICIO)',common.newActivity);
        $location.path("/viewActivity");
        
      
        }, function myError(err) {
                console.log(err);      
        });
      };
    
     /* trustSrcUrl */
     $scope.trustSrcurl = function(data) {
        return $sce.trustAsResourceUrl(data);
      };

    /* back to course visualization */
    $scope.backLesson = function() {
      console.log('vuelta atrás');
      $scope.coursePage = true;
      common.actualViewCourses='coursePage';
      $location.path("/viewCourse");
    };

});

