'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('lomsCtrl',
                         function($log, $scope,$http,$location,lomsApi,common) {
        $log.log('loms ctrl start');
        console.log('loading loms p ...');
        $scope.changeInit(false); 
        $scope.lomSelected=common.lomSelected;
        $scope.addingLom=common.addingLom;
        $scope.InfoLom=false;
        $scope.idItemToEdit;
        $scope.showFieldsGeneral=true;
        $scope.showFieldsLifecicle=true;
        $scope.showFieldsMetadata=true;
        $scope.showFieldsTechnical=true;
        $scope.showFieldsUse=true;
        if(!common.addingLom){
            $scope.generalSchema=common.lomSelected.general;
            $scope.lifecycleSchema=common.lomSelected.lifecycle;
            $scope.metadataSchema=common.lomSelected.metadata;
            $scope.technicalSchema=common.lomSelected.technical;
            $scope.useSchema=common.lomSelected.use;
        }
        $scope.backLoms=function(){
            $location.path("/loms");
        };
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
                console.log(err);
                alert('Error de tipo: '+err.status);      
        }); 

        $scope.showLoms= function() {
            console.log('loading Loms ...');
            lomsApi.getLoms().then(function(response){
                   $scope.loms= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
        };
        $scope.showInfoLom = function(item){
            $scope.InfoLom=true;
            console.log('loading get info lom ...');
            lomsApi.getLom(item).then(function(response){
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
        $scope.goAddEditLom= function(action,lom){
            common.lomSelected=lom;
            switch (action) {
                case 'add':
                    common.addingLom=true;
                    break;
                case 'edit':
                    common.addingLom=false;
                    break;
                default:
            }
            $location.path("/addEditLom");
        };
        
        $scope.addLom = function() {
            if ($scope.adminLomsForm.$valid) {
                console.log('adding...', $scope.technicalSchema);
                lomsApi.addLom($scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema).then(function(response) {
                    console.log('ok después de addLom', response);
                    $scope.showLoms();
                    $location.path("/loms");
                }, function(error) {
                    console.log('error después de addLom', error);
                });
                $scope.showAdminLomsForm=false;
            } else {
                console.log('There are invalid fields');
            }
            $scope.generalSchema={};
            $scope.lifecycleSchema={};
            $scope.metadataSchema={};
            $scope.technicalSchema={};
            $scope.useSchema={};
        };
        $scope.editLom = function(idItem) {
            if ($scope.adminLomsForm.$valid) {
                console.log('editing...', $scope.technicalSchema);
                lomsApi.editLom(idItem,$scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema).then(function(response) {
                    console.log('ok después de editLom', response);
                    $scope.showLoms();
                    confirm("Lom editado con éxito!");
                    $location.path("/loms");
                }, function(error) {
                    console.log('error después de editLom', error);
                });
                $scope.showAdminLomsForm=false;
            } else {
                console.log('There are invalid fields');
            }
        };
        $scope.addEditLom = function() {
            console.log('valor de edit: ', $scope.edit);
            if($scope.addingLom) $scope.addLom();
            else $scope.editLom($scope.lomSelected._id);
        };

        $scope.removeLom = function(idLom, e){
            console.log('eliminado item con id: ', idLom);
            if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTE LOM?") === false) {
                e.preventDefault();
                return;
            }
            lomsApi.removeItem(idLom).then(function(response) {
                    console.log('eliminado item con exito', response);
                    $scope.showLoms();
                }, function(error) {
                    console.log('error al eliminar item', error);
             });
        };
        $scope.deleteAllLoms = function(e){
            console.log('eliminado loms');
            if (confirm("¿ESTÁ DISPUESTO A ELIMINAR TODOS LOS LOMS?") === false) {
                e.preventDefault();
                return;
            }
            lomsApi.removeAllItem().then(function(response) {
                    console.log('eliminado todos los items con exito', response);
                }, function(error) {
                    console.log('error al eliminar todos los items', error);
             });
        };
        
        
    });