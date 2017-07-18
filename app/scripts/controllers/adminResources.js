'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('adminResourcesCtrl',
                         function($log, $scope,$http,$location,lomsApi) {
        $log.log('adminResources ctrl start');
        console.log('loading resources p ...');

        $scope.InfoResource=false;
        $scope.idItemToEdit;
       
        lomsApi.getResources().then(function(response){
                $scope.loms= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        }); 

        $scope.showResources= function() {
            console.log('loading resources ...');
            lomsApi.getResources().then(function(response){
                   $scope.loms= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.showInfoResource = function(item){
            $scope.InfoResource=true;
            console.log('loading get info resource ...');
            lomsApi.getResource(item).then(function(response){
                $scope.generalSchema=response.data.general;
                $scope.lifecycleSchema=response.data.lifecycle;
                $scope.metadataSchema=response.data.metadata;
                $scope.technicalSchema=response.data.technical;
                $scope.useSchema=response.data.use;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        };
        $scope.hideInfoResource = function(){
            $scope.InfoResource=false;
        };
        $scope.showAddResourceForm = function() {
            $scope.showAdminResourcesForm=true;
            $scope.edit=false;
        };
        $scope.showEditResourceForm = function(item) {
            $scope.showAdminResourcesForm=true;
            $scope.edit=true;
            $scope.idItemToEdit=item._id;

            $scope.generalSchema=item.general;
            $scope.lifecycleSchema=item.lifecycle;
            $scope.metadataSchema=item.metadata;
            $scope.technicalSchema=item.technical;
            $scope.useSchema=item.use;
        };
        $scope.addResource = function() {
            if ($scope.adminResourcesForm.$valid) {
                console.log('adding...', $scope.technicalSchema);
                lomsApi.addResource($scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema).then(function(response) {
                    console.log('ok después de addResource', response);
                    $scope.showResources();
                }, function(error) {
                    console.log('error después de addResource', error);
                });
                $scope.showAdminResourcesForm=false;
            } else {
                console.log('There are invalid fields');
            }
            $scope.generalSchema={};
            $scope.lifecycleSchema={};
            $scope.metadataSchema={};
            $scope.technicalSchema={};
            $scope.useSchema={};
        };
        $scope.editResource = function(idItem) {
            if ($scope.adminResourcesForm.$valid) {
                console.log('editing...', $scope.technicalSchema);
                lomsApi.editResource(idItem,$scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema).then(function(response) {
                    console.log('ok después de editResource', response);
                    $scope.showResources();
                }, function(error) {
                    console.log('error después de editResource', error);
                });
                $scope.showAdminResourcesForm=false;
            } else {
                console.log('There are invalid fields');
            }
            $scope.generalSchema={};
            $scope.lifecycleSchema={};
            $scope.metadataSchema={};
            $scope.technicalSchema={};
            $scope.useSchema={};
        };
        $scope.addEditResource = function() {
            console.log('valor de edit: ', $scope.edit);
            if($scope.edit) $scope.editResource($scope.idItemToEdit);
            else $scope.addResource();
        };

        $scope.removeResource = function(item){
            console.log('eliminado item con id: ', item);
            lomsApi.removeItem(item).then(function(response) {
                    console.log('eliminado item con exito', response);
                    $scope.showResources();
                }, function(error) {
                    console.log('error al eliminar item', error);
             });
        };
        $scope.deleteAllLoms = function(item){
            console.log('eliminado loms');
            lomsApi.removeAllItem(item).then(function(response) {
                    console.log('eliminado todos los items con exito', response);
                }, function(error) {
                    console.log('error al eliminar todos los items', error);
             });
        };
        $scope.reset = function() {
            $scope.user = { name: '', password: '' };
        };
        
    });