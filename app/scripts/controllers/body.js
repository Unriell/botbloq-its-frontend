'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:BodyCtrl
 * @description
 * # BodyCtrl
 * Controller of the botbloqItsFrontendApp
 */
botBloqApp.controller('BodyCtrl', function($scope, common, $log,usersApi, coursesApi, teacherApi, $location) {
        $log.log('body ctrl start');
        $scope.usersApi = usersApi;
        $scope.coursesApi= coursesApi;
        $scope.teacherApi= teacherApi;
        $scope.init= true;
        $scope.nameActiveUser=common.nameActiveUser;
        $scope.activeUserHeader=common.activeUSer;
        /*$scope.activeUser="Usuariooo";*/
        
        
        $scope.changeInit=function(boolean) {
          $scope.init=boolean;
        }
        $scope.changeActiveUserHeader=function(user) {
          $scope.activeUserHeader=user;
        }
        $scope.showTotalCourses=function(view){
          common.actualViewCourses=view;
        }
        $scope.isActive =  function(currentPath){
       	  return currentPath === $location.path();
  		  }

   
  		
    });