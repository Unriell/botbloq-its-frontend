'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:CoursesCtrl
 * @description
 * # CoursesCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('coursesCtrl',function($log,$q,$scope,$http,$location,$timeout,$sce, coursesApi,usersApi,lomsApi,common) {
        $log.log('courses ctrl start');
        $scope.changeInit(false); 
    
        $scope.activeUser=common.activeUSer;
		$scope.changeActiveUserHeader($scope.activeUser);
        $scope.totalCourses = [];
        $scope.enrolledCourses=[];
        $scope.doneCourses=[];
		
		$scope.courseSelected=common.courseSelected;
        $scope.objectivesCourseSelected=common.objectivesCourseSelected;
        $scope.sectionsSelected=common.sectionsCourseSelected;
        $scope.lessonsSelected=common.lessonsCourseSelected;
        $scope.lessonSelected=common.lessonSelected;
        $scope.indexLessonSelected=common.indexLessonSelected;

	    $scope.sections=[];
        $scope.lesson=[];
     

        $scope.activity={};
        $scope.activity=common.newActivity;
    

        coursesApi.getCourses().then(function(response){
                $scope.courses= response.data;
                $scope.totalCourses = response.data;
        }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        }); 

        /* VIEWS MANAGEMENT*/
        var resetCourseViews=function(){
            $scope.coursePage=false;
            $scope.totalCoursesPage=false;  
            $scope.enrolledCoursesPage=false;
        };
        
        $scope.managementCourseViews= function(view){
            resetCourseViews();
            switch (view) {
                case 'coursePage':
                    $scope.coursePage=true;
                    break;
                case 'totalCoursesPage':
                    $scope.totalCoursesPage=true;  
                    break;
                case 'enrolledCoursesPage':
                    $scope.enrolledCoursesPage=true;
                    break;
                default:
            }
            console.log("esta matriculado? " + $scope.studentEnrolledInCourse);
            if (common.activeUSer && $scope.courseSelected ) {
                usersApi.isEnrolled(common.activeUSer._id,$scope.courseSelected._id).then(function(response){
                    console.log('operación isEnrolledInCourse realizada con éxito',response.data);
                    $scope.studentEnrolledInCourse=response.data;
                }, function myError(err) {
                    console.log('operación isEnrolledInCourse fallida',err);      
                });
            }
            
        };
        $scope.managementCourseViews(common.actualViewCourses);


        /** COURSES FILTERS **/


        $scope.showTotalCourses=function(){
            console.log("showTotalCourses")
            $scope.totalCoursesPage=true;
            $scope.enrolledCoursesPage=false;
            $scope.coursePage=false; 
            $scope.completedCoursesPage=false;
            coursesApi.getCourses().then(function(response){
                console.log(response.data);
                $scope.courses= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error al obtener los cursos'+err.status);      
            }); 

        };

        $scope.showEnrolledCourses=function(){
            $scope.totalCoursesPage=false;
            $scope.enrolledCoursesPage=true;
            $scope.coursePage=false;
            $scope.completedCoursesPage=false;
            $scope.getStudentsCoursesActives($scope.activeUser._id);
        };

        /* remove course from total courses that not exists in a list of id's */
        $scope.filterCourses = function (idsFiltered) {

            var courses = [];
            for (var i = 0; i < $scope.totalCourses.length; i++) {
                if (idsFiltered.indexOf($scope.totalCourses[i]._id ) != -1 ) {
                    courses.push($scope.totalCourses[i]);
                }
            }
            console.log(courses);
            $scope.courses = courses;

        }

        $scope.getStudentsCoursesActives= function(idStudent) {
            console.log('loading cursos activos ........');
            coursesApi.getStudentsCoursesActives(idStudent).then(function(response){
                console.log(response.data);
                $scope.filterCourses(response.data);

            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };

        $scope.showCompletedCourses=function(){
            $scope.totalCoursesPage=false;
            $scope.enrolledCoursesPage=false;
            $scope.coursePage=false;
            $scope.completedCoursesPage=true;
            $scope.getStudentsCoursesFinished($scope.activeUser._id);
        };



        $scope.getStudentsCoursesFinished= function(idStudent) {
            console.log('loading cursos completados ........');
            coursesApi.getStudentsCoursesFinished(idStudent).then(function(response){
                console.log("returning");
                console.log(response.data);
                $scope.filterCourses(response.data);
            }, function myError(err) {
                console.log(err);
                alert('Error al filtrar los cursos: '+err.status);      
            }); 
        };


        /* go course **/
        $scope.goCourse=function(course, idStudent){
            console.log("go course");
            common.courseSelected= course;
            $scope.courseSelected= course;
            console.log("curso seleccionado " );
            console.log(course);
            common.sectionsCourseSelected= course.sections;
            common.lessonsCourseSelected=  course.sections[0].lessons;
            usersApi.isEnrolled(idStudent,course._id).then(function(response){
                console.log('operación isEnrolledInCourse realizada con éxito',response.data);
                $scope.studentEnrolledInCourse=response.data;
            }, function myError(err) {
                console.log('operación isEnrolledInCourse fallida',err);      
            });
            common.actualViewCourses='coursePage';
            $scope.managementCourseViews(common.actualViewCourses);
            // $location.path("/viewCourse");
        };


    	$scope.goLesson= function(lesson,index){
            console.log('Go Lesson ---------');
            console.log(lesson);
            console.log("lom id " +lesson.loms[0].lom_id );
            
            
            coursesApi.getActivityLesson(lesson.loms[0].lom_id).then(function(response){
                $scope.activity= response.data;
                common.newActivity= $scope.activity; 
                console.log('Nueva actividad obtenida con éxito',$scope.activity.general);
                $location.path("/activity");
                
            
            }, function myError(err) {
                console.log(err);      
            });
        }


       

        //--------------------------------------
   


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
            coursesApi.okEndLesson($scope.activeUser._id,common.courseSelected._id,$scope.activity._id).then(function(response) {
                console.log('ok después finalizar correctamente una lección', response);
				common.actualViewCourses='coursePage';
				$scope.studentEnrolledInCourse = true;
                $location.path("/courses");
            }, function(error) {
                console.log('error después de finalizar correctamente una lección', error);
            });      
        };
		
		$scope.trustSrcurl = function(data) {
			return $sce.trustAsResourceUrl(data);
		};

        $scope.badEndLesson = function() {
            
            coursesApi.badEndLesson($scope.activeUser._id,common.courseSelected._id,$scope.activity._id).then(function(response) {
                console.log('ok después finalizar incorrectamente una lección', response);
				common.actualViewCourses='coursePage';
				$scope.studentEnrolledInCourse = true;
				$location.path("/courses");
            }, function(error) {
                console.log('error después de finalizar incorrectamente una lección', error);
            });      
        };

        $scope.pauseLesson = function() {
            console.log('Pausando una lección...');
            console.log("Parametros de entrada de pauseLesson: ",$scope.activeUser._id,common.courseSelected._id,$scope.activity._id);
            coursesApi.pauseLesson($scope.activeUser._id,common.courseSelected._id,$scope.activity._id).then(function(response) {
                console.log('ok después pausar una lección', response);
				common.actualViewCourses='coursePage';
				$scope.studentEnrolledInCourse = true;
				$location.path("/courses");
            }, function(error) {
                console.log('error después de pausar una lección', error);
            });      
        };
		
		$scope.backLesson = function() {
            console.log('vuelta atrás');
			common.actualViewCourses='coursePage';
			$scope.studentEnrolledInCourse = true;
			$location.path("/courses");
        };

        

        // ----------------    STUDENT  ---------------

        $scope.enrollStudent=function(idStudent,idCourse){
            console.log('Matriculando a alumno ...');
            usersApi.enrollStudent(idStudent,idCourse).then(function(response) {       
                confirm("MATRICULADO CON ÉXITO !!");
				 $scope.studentEnrolledInCourse=true;
                console.log('ok después de enrollStudent', response);
            }, function(error) {
                confirm("ERROR AL MATRICULARSE A ESTE CURSO !!");
                console.log('error después de enrollStudent', error);
            });   
        };

   
        /* new activity request */
        $scope.newActivity=function(){
            console.log('Solicitando nueva actividad ...');
            console.log('Parámetros para solicitar nueva actividad: ',common.activeUser._id,common.courseSelected._id);
            coursesApi.getNewActivity($scope.activeUser._id,common.courseSelected._id).then(function(response){
                $scope.activity= response.data;
                common.newActivity= $scope.activity; 
                console.log('Nueva actividad obtenida con éxito (SERVICIO)',common.newActivity);
				if (!common.newActivity._id) {
					confirm("Curso Finalizado");
					common.courseSelected.finished = true;
				} else {
					$location.path("/activity");
					common.courseSelected.finished = false;
				}
				
               
            }, function myError(err) {
                console.log(err);
                alert('Error al solicitar una nueva actividad: '+err.status);      
            }); 
        };

         // ----------------    FIN STUDENT METHODS ---------------
    });

