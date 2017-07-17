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
        /*$scope.activeUser="Usuariooo";*/
        
        $scope.changeInit=function(boolean) {
          $scope.init=boolean;
        }

        $scope.isActive =  function(currentPath){
       	  return currentPath === $location.path();
  		  }
  		
    });