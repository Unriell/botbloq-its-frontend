'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('lomsCtrl',
                         function($log, $scope,$http,$location,lomsApi) {
        $log.log('loms ctrl start');
        $log.debug('loading loms p ...');

        $scope.InfoLom=false;
        $scope.idItemToEdit;
        $scope.showFieldsGeneral=true;
        $scope.showFieldsLifecicle=true;
        $scope.showFieldsMetadata=true;
        $scope.showFieldsTechnical=true;
        $scope.showFieldsUse=true;
        $scope.showHideFields= function(fieldset) {
            if (fieldset==1){
                if($scope.showFieldsGeneral) $scope.showFieldsGeneral=false;
                else $scope.showFieldsGeneral=true;
            }else if(fieldset==2){
                if($scope.showFieldsLifecicle) $scope.showFieldsLifecicle=false;
                else $scope.showFieldsLifecicle=true;
            }else if(fieldset==3){
                if($scope.showFieldsMetadata) $scope.showFieldsMetadata=false;
                else $scope.showFieldsMetadata=true;
            }else if(fieldset==4){
                if($scope.showFieldsTechnical) $scope.showFieldsTechnical=false;
                else $scope.showFieldsTechnical=true;
            }else if(fieldset==5){
                if($scope.showFieldsUse) $scope.showFieldsUse=false;
                else $scope.showFieldsUse=true;
            }
        };
       
        lomsApi.getLoms().then(function(response){
                $scope.loms= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
        }); 

        $scope.showLoms= function() {
            $log.debug('loading Loms ...');
            lomsApi.getLoms().then(function(response){
                   $scope.loms= response.data;
            }, function myError(err) {
                $log.debug(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.showInfoLom = function(item){
            $scope.InfoLom=true;
            $log.debug('loading get info lom ...');
            lomsApi.getLom(item).then(function(response){
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
        $scope.hideInfoLom = function(){
            $scope.InfoLom=false;
            $scope.generalSchema={};
            $scope.lifecycleSchema={};
            $scope.metadataSchema={};
            $scope.technicalSchema={};
            $scope.useSchema={};
        };
        $scope.showAddLomForm = function() {
            $scope.showAdminLomsForm=true;
            $scope.edit=false;
        };
        $scope.showEditLomForm = function(item) {
            $scope.showAdminLomsForm=true;
            $scope.edit=true;
            $scope.idItemToEdit=item._id;

            $scope.generalSchema=item.general;
            $scope.lifecycleSchema=item.lifecycle;
            $scope.metadataSchema=item.metadata;
            $scope.technicalSchema=item.technical;
            $scope.useSchema=item.use;
        };
        $scope.goAddLom= function(){
            $location.path("/addLom");
        };
        $scope.addLom = function() {
            if ($scope.adminLomsForm.$valid) {
                $log.debug('adding...', $scope.technicalSchema);
                lomsApi.addLom($scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema).then(function(response) {
                    $log.debug('ok después de addLom', response);
                    $scope.showLoms();
                    $location.path("/loms");
                }, function(error) {
                    $log.debug('error después de addLom', error);
                });
                $scope.showAdminLomsForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            $scope.generalSchema={};
            $scope.lifecycleSchema={};
            $scope.metadataSchema={};
            $scope.technicalSchema={};
            $scope.useSchema={};
        };
        $scope.editLom = function(idItem) {
            if ($scope.adminLomsForm.$valid) {
                $log.debug('editing...', $scope.technicalSchema);
                lomsApi.editLom(idItem,$scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema).then(function(response) {
                    $log.debug('ok después de editLom', response);
                    $scope.showLoms();
                }, function(error) {
                    $log.debug('error después de editLom', error);
                });
                $scope.showAdminLomsForm=false;
            } else {
                $log.debug('There are invalid fields');
            }
            $scope.generalSchema={};
            $scope.lifecycleSchema={};
            $scope.metadataSchema={};
            $scope.technicalSchema={};
            $scope.useSchema={};
        };
        $scope.addEditLom = function() {
            $log.debug('valor de edit: ', $scope.edit);
            if($scope.edit) $scope.editLom($scope.idItemToEdit);
            else $scope.addLom();
        };

        $scope.removeLom = function(item){
            $log.debug('eliminado item con id: ', item);
            lomsApi.removeItem(item).then(function(response) {
                    $log.debug('eliminado item con exito', response);
                    $scope.showLoms();
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