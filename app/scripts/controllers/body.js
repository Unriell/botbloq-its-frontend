'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:BodyCtrl
 * @description
 * # BodyCtrl
 * Controller of the botbloqItsFrontendApp
 */
botBloqApp.controller('BodyCtrl', function($scope, common, $log,usersApi,lomsApi, coursesApi, $location) {
        $log.log('body ctrl start');
        $scope.usersApi = usersApi;
        $scope.lomsApi = lomsApi;
        $scope.coursesApi= coursesApi;
        $scope.init= true;
        $scope.nameActiveUser=common.nameActiveUSer;
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