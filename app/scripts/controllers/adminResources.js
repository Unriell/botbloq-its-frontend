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
        $log.debug('loading resources p ...');

        $scope.InfoResource=false;
        $scope.idItemToEdit;
       
        lomsApi.getResources().then(function(response){
                $scope.loms= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
        }); 

        $scope.showResources= function() {
            $log.debug('loading resources ...');
            lomsApi.getResources().then(function(response){
                   $scope.loms= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.showInfoResource = function(item){
            $scope.InfoResource=true;
            $log.debug('loading get info resource ...');
            lomsApi.getResource(item).then(function(response){
                $scope.generalSchema=response.data.general;
                $scope.lifecycleSchema=response.data.lifecycle;
                $scope.metadataSchema=response.data.metadata;
                $scope.technicalSchema=response.data.technical;
                $scope.useSchema=response.data.use;
            }, function myError(err) {
                $log.debug(err);
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
                $log.debug('adding...', $scope.technicalSchema);
                lomsApi.addResource($scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema).then(function(response) {
                    $log.debug('ok después de addResource', response);
                    $scope.showResources();
                }, function(error) {
                    $log.debug('error después de addResource', error);
                });
                $scope.showAdminResourcesForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            $scope.generalSchema={};
            $scope.lifecycleSchema={};
            $scope.metadataSchema={};
            $scope.technicalSchema={};
            $scope.useSchema={};
        };
        $scope.editResource = function(idItem) {
            if ($scope.adminResourcesForm.$valid) {
                $log.debug('editing...', $scope.technicalSchema);
                lomsApi.editResource(idItem,$scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema).then(function(response) {
                    $log.debug('ok después de editResource', response);
                    $scope.showResources();
                }, function(error) {
                    $log.debug('error después de editResource', error);
                });
                $scope.showAdminResourcesForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            $scope.generalSchema={};
            $scope.lifecycleSchema={};
            $scope.metadataSchema={};
            $scope.technicalSchema={};
            $scope.useSchema={};
        };
        $scope.addEditResource = function() {
            $log.debug('valor de edit: ', $scope.edit);
            if($scope.edit) $scope.editResource($scope.idItemToEdit);
            else $scope.addResource();
        };

        $scope.removeResource = function(item){
            $log.debug('eliminado item con id: ', item);
            lomsApi.removeItem(item).then(function(response) {
                    $log.debug('eliminado item con exito', response);
                    $scope.showResources();
                }, function(error) {
                    $log.debug('error al eliminar item', error);
             });
        };
        $scope.deleteAllLoms = function(item){
            $log.debug('eliminado loms');
            lomsApi.removeAllItem(item).then(function(response) {
                    $log.debug('eliminado todos los items con exito', response);
                }, function(error) {
                    $log.debug('error al eliminar todos los items', error);
             });
        };
        $scope.reset = function() {
            $scope.user = { name: '', password: '' };
        };
        
    });