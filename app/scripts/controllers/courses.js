'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:CoursesCtrl
 * @description
 * # CoursesCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('coursesCtrl',
                         function($log, $scope,$http,$location,coursesApi) {
        $log.log('courses ctrl start');
        $log.debug('loading Cocurses p ...');

        $scope.InfoCourse=false;
        $scope.idItemToEdit;
       
        coursesApi.getCourses().then(function(response){
                $scope.courses= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
        }); 

        $scope.showCourses= function() {
            $log.debug('loading Courses ...');
            coursesApi.getCourses().then(function(response){
                   $scope.courses= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.showInfoCourse = function(item){
            $scope.InfoCourse=true;
            $log.debug('loading get info courses ...');
            coursesApi.getCourse(item).then(function(response){
                $scope.courseName=response.data.name;
                $scope.courseCode=response.data.code;
                $scope.courseSummary=response.data.summary;
                $scope.objectives=response.data.objetives;
                $scope.statistics=response.data.statistics;
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
            $scope.statistics=item.statistics;
            $scope.courseHistory=item.history;
        };
        $scope.addCourse = function() {
            if ($scope.coursesForm.$valid) {
                $log.debug('adding...');
                coursesApi.addCourse($scope.courseName,$scope.courseCode,$scope.courseSummary,$scope.objectives,$scope.statistics,$scope.courseHistory).then(function(response) {
                    $log.debug('ok después de addCourse', response);
                    $scope.showCourses();
                }, function(error) {
                    $log.debug('error después de addCourse', error);
                });
                $scope.showCoursesForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            $scope.courseName='';
            $scope.courseCode='';
            $scope.courseSummary='';
            $scope.objectives={};
            $scope.statistics={};
            $scope.courseHistory='';
        };
        $scope.editCourse = function(idItem) {
            if ($scope.coursesForm.$valid) {
                $log.debug('editing...');
                coursesApi.editCourse(idItem,$scope.courseName,$scope.courseCode,$scope.courseSummary,$scope.objectives,$scope.statistics,$scope.courseHistory).then(function(response) {
                    $log.debug('ok después de editCourse', response);
                    $scope.showCourses();
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
            $scope.statistics={};
            $scope.courseHistory='';
        };
        $scope.addEditCourse = function() {
            $log.debug('valor de edit: ', $scope.edit);
            if($scope.edit) $scope.editCourse($scope.idItemToEdit);
            else $scope.addCourse();
        };

        $scope.removeCourse = function(item){
            $log.debug('eliminado item con id: ', item);
            coursesApi.removeItem(item).then(function(response) {
                    $log.debug('eliminado item con exito', response);
                    $scope.showCourses();
                }, function(error) {
                    $log.debug('error al eliminar item', error);
             });
        };
        $scope.deleteAllCourses = function(item){
            $log.debug('eliminado courses');
            coursesApi.removeAllItem(item).then(function(response) {
                    $log.debug('eliminado todos los items con exito', response);
                }, function(error) {
                    $log.debug('error al eliminar todos los items', error);
             });
        };
        $scope.reset = function() {
            $scope.user = { name: '', password: '' };
        };
        
    });