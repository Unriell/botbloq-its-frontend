'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('lomsCtrl',
                         function($log, $scope,$q,$http,$location,$filter,lomsApi,teacherApi,common) {
        $log.log('loms ctrl start');
        console.log('loading loms p ...');
        $scope.changeInit(false); 
        $scope.activeUser=common.activeUSer;
        $scope.loadLoms=[];
        $scope.lomsTeacher=[];
        $scope.lomSelected=common.lomSelected;
        $scope.addingLom=common.addingLom;
        $scope.selectLomsView=common.selectLomsView;
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
                $scope.results=document.getElementsByClassName("okResults");
                $scope.managementViewLoms();
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        }); 


        $scope.$watch('format','structure','difficulty','searchLom',function() {
            $scope.results=document.getElementsByClassName("okResults");     
        }); 

        var updateLomsTeacher=function(totalLoms){
            $scope.lomsTeacher=[];
            angular.forEach($scope.activeUser.elements.loms,function(idLom){
                angular.forEach(totalLoms,function(lom){
                    if(lom._id==idLom){
                        $scope.lomsTeacher.push(lom);
                        return 0;
                    }
                });
            });
            common.lomsTeacher=$scope.lomsTeacher;
        }

        $scope.managementViewLoms=function(){
            if($scope.selectLomsView == 'todos'){
                $scope.loadLoms=$scope.loms;
            }else{
                updateLomsTeacher($scope.loms);
                $scope.loadLoms=$scope.lomsTeacher;
            }
        }

        var updateLoms= function() {
            var defered = $q.defer(),
                promise = defered.promise;
            console.log('udpate Loms ...');
            lomsApi.getLoms().then(function(response){
                    $scope.loms= response.data;
                    updateLomsTeacher(response.data);
                    defered.resolve();
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            }); 
            return promise;
        };
        $scope.showInfoLom = function(item){
            $scope.InfoLom=true;
            console.log('loading get info lom ...');
            lomsApi.getLom(item._id).then(function(response){
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
                lomsApi.addLom($scope.generalSchema,$scope.lifecycleSchema,$scope.metadataSchema,$scope.technicalSchema, $scope.useSchema, $scope.activeUser.identification.name).then(function(response) {
                    console.log('ok después de addLom', response);
                    var promise=updateLoms();
                    promise.then(function() {
                        let idLastLom=$scope.loms[$scope.loms.length - 1]._id;
                        assignLomToTeacher($scope.activeUser._id,idLastLom);
                        common.selectLomsView="misLoms";
                        $location.path("/loms");
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar los loms: '+error);     
                    });
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
                    updateLoms();
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
        var requiredFieldsCompletedLom=function(){
            var completedFields=true;
            if (generalSchema_title.classList.contains('ng-empty') || generalSchema_structure.classList.contains('ng-empty') || lifecycleSchema_state.classList.contains('ng-empty') || technicalSchema_format.classList.contains('ng-empty') || technicalSchema_url.classList.contains('ng-empty')) {
                completedFields=false;
            }
            return completedFields;
        }
        var calculateScoreStringsLom =function(data1,data2){
            var arrayData1=data1.split(" "),
                arrayData2=data2.split(" "),
                scoreFormat=0,
                equals=0;
            for(var i=0;i<arrayData1.length;i++){
                for(var j=0;j<arrayData2.length;j++){
                    if(arrayData1[i]==arrayData2[j]){
                        equals=equals+1;
                    }
                }
            }
            scoreFormat=equals/arrayData1.length;                    
            return scoreFormat;
        }
        var parseDate=function(input) {
          var parts = input.match(/(\d+)/g);
          // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
          return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
        }
        var calculateDaysLomDate=function(date1Lom,date2Lom) {
            var date1=parseDate(date1Lom),
                date2=parseDate(date2Lom),
                daysDif = date1.getTime() - date2.getTime(),
                days = Math.abs(Math.round(daysDif/(1000 * 60 * 60 * 24)));

            return days;
        }
        $scope.autoCompleteSimilarLom=function(event){
            if (!true) {
                alert("Debes rellenar los campos requeridos para el autocompletado inteligente")
                event.preventDefault();
                return;
            }
            var similarLom=[],auxSimilarLom=[],similarLoms=[];
                for(var i=0;i<$scope.loms.length;i++){
                    var infoSimilLom=new Object();
                        infoSimilLom._id=$scope.loms[i]._id;
                        infoSimilLom.score=0;
                        //Use
                        if($scope.activeUser.identification.name!="unknown autor" && $scope.activeUser.identification.name==$scope.loms[i].author){
                            infoSimilLom.score=infoSimilLom.score+1;
                        }
                        if(!useSchema_resource_difficulty.classList.contains('ng-empty')){
                            if($scope.useSchema.resource_difficulty == $scope.loms[i].use.resource_difficulty){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        if(!useSchema_resource_context.classList.contains('ng-empty')){
                            if($scope.useSchema.resource_context == $scope.loms[i].use.resource_context){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        if(!useSchema_resource_target.classList.contains('ng-empty')){
                            infoSimilLom.score=infoSimilLom.score+calculateScoreStringsLom($scope.useSchema.resource_target,$scope.loms[i].use.resource_target);
                        }
                        if(!useSchema_resource_type.classList.contains('ng-empty')){
                            if($scope.useSchema.resource_type == $scope.loms[i].use.resource_type){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        if(!useSchema_language.classList.contains('ng-empty')){
                            if($scope.useSchema.language == $scope.loms[i].use.language){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        if(!useSchema_interactivity_level.classList.contains('ng-empty')){
                            if($scope.useSchema.interactivity_level == $scope.loms[i].use.interactivity_level){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        if(!useSchema_interactivity_type.classList.contains('ng-empty')){
                            if($scope.useSchema.interactivity_type == $scope.loms[i].use.interactivity_type){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        //Technical
                        if(!technicalSchema_url.classList.contains('ng-empty')){
                            infoSimilLom.score=infoSimilLom.score+calculateScoreStringsLom($scope.technicalSchema.url,$scope.loms[i].technical.url);
                        }
                        // --- number
                        if(!technicalSchema_size_kb.classList.contains('ng-empty') && $scope.loms[i].technical.size_kb!=null){
                            var scoreSize=0,
                                maxValue=1000;
                            if($scope.technicalSchema.size_kb==$scope.loms[i].technical.size_kb){
                                scoreSize=1;
                            }else{
                                scoreSize=1-(Math.abs($scope.technicalSchema.size_kb - $scope.loms[i].technical.size_kb)/maxValue);
                            }
                            infoSimilLom.score=infoSimilLom.score+scoreSize;
                        }
                        if(!technicalSchema_format.classList.contains('ng-empty')){
                            if($scope.technicalSchema.format == $scope.loms[i].technical.format){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        //Metadata
                         if(!metadataSchema_contribution_date.classList.contains('ng-empty')){
                            if($scope.loms[i].metadata.contribution_date !=null){
                                infoSimilLom.score=infoSimilLom.score+calculateDaysLomDate($scope.metadataSchema.contribution_date.toString(),$scope.loms[i].metadata.contribution_date);
                            }
                        }
                        if(!metadataSchema_contribution_entity.classList.contains('ng-empty')){
                            infoSimilLom.score=infoSimilLom.score+calculateScoreStringsLom($scope.metadataSchema.contribution_entity,$scope.loms[i].metadata.contribution_entity);
                        }
                        if(!metadataSchema_contribution_type.classList.contains('ng-empty')){
                            infoSimilLom.score=infoSimilLom.score+calculateScoreStringsLom($scope.metadataSchema.contribution_type,$scope.loms[i].metadata.contribution_type);
                        }
                        //lifecycle
                        if(!lifecycleSchema_contribution_date.classList.contains('ng-empty')){
                            if($scope.loms[i].lifecycle.contribution_date !=null){
                                infoSimilLom.score=infoSimilLom.score+calculateDaysLomDate($scope.lifecycleSchema.contribution_date.toString(),$scope.loms[i].lifecycle.contribution_date);
                            }
                        }
                        if(!lifecycleSchema_contribution_entity.classList.contains('ng-empty')){
                            infoSimilLom.score=infoSimilLom.score+calculateScoreStringsLom($scope.lifecycleSchema.contribution_entity,$scope.loms[i].lifecycle.contribution_entity);
                        }
                        if(!lifecycleSchema_contribution_type.classList.contains('ng-empty')){
                            if($scope.lifecycleSchema.contribution_type == $scope.loms[i].lifecycle.contribution_type){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        // --- enum
                        if(!lifecycleSchema_state.classList.contains('ng-empty')){
                            if($scope.lifecycleSchema.state == $scope.loms[i].lifecycle.state){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        // --- number
                        if(!lifecycleSchema_version.classList.contains('ng-empty') && $scope.loms[i].lifecycle.version!=null){
                            var scoreVersion=0, 
                                maxValue=10;
                            if($scope.lifecycleSchema.version == $scope.loms[i].lifecycle.version){
                                scoreVersion=1;
                            }else{
                                scoreVersion=1-(Math.abs($scope.lifecycleSchema.version - $scope.loms[i].lifecycle.version)/maxValue);
                            }
                            infoSimilLom.score=infoSimilLom.score+scoreVersion;
                        }
                        //general
                        //// --- number
                        if(!generalSchema_aggregation_level.classList.contains('ng-empty') && $scope.loms[i].general.aggregation_level!=null){
                            var scoreAgregationLevel=0, 
                                maxValue=10;
                            if($scope.generalSchema.aggregation_level==$scope.loms[i].general.aggregation_level){
                                scoreAgregationLevel=1;
                            }else{
                                scoreAgregationLevel=1-(Math.abs($scope.generalSchema.aggregation_level - $scope.loms[i].general.aggregation_level)/maxValue);
                            }
                            infoSimilLom.score=infoSimilLom.score+scoreAgregationLevel;
                        }
                        // --- enum
                        if(!generalSchema_structure.classList.contains('ng-empty')){
                                var scoreStructure=0;
                                //atomic
                                if($scope.generalSchema.structure == 'atomic' && $scope.loms[i].general.structure== 'atomic' ){
                                    scoreStructure=1;
                                }
                                if($scope.generalSchema.structure == 'atomic' && $scope.loms[i].general.structure== 'collection' ){
                                    scoreStructure=0;
                                }
                                if($scope.generalSchema.structure == 'atomic' && $scope.loms[i].general.structure== 'networked' ){
                                    scoreStructure=0;
                                }
                                if($scope.generalSchema.structure == 'atomic' && $scope.loms[i].general.structure== 'hierarchical' ){
                                    scoreStructure=0;
                                }
                                if($scope.generalSchema.structure == 'atomic' && $scope.loms[i].general.structure== 'linear' ){
                                    scoreStructure=0;
                                }
                                //collection
                                if($scope.generalSchema.structure == 'collection' && $scope.loms[i].general.structure== 'collection' ){
                                    scoreStructure=1;
                                }
                                if($scope.generalSchema.structure == 'collection' && $scope.loms[i].general.structure== 'networked' ){
                                    scoreStructure=0.5;
                                }
                                if($scope.generalSchema.structure == 'collection' && $scope.loms[i].general.structure== 'hierarchical' ){
                                    scoreStructure=0.5;
                                }
                                if($scope.generalSchema.structure == 'collection' && $scope.loms[i].general.structure== 'linear' ){
                                    scoreStructure=0.5;
                                }
                                //networked
                                if($scope.generalSchema.structure == 'networked' && $scope.loms[i].general.structure== 'networked' ){
                                    scoreStructure=1;
                                }
                                if($scope.generalSchema.structure == 'networked' && $scope.loms[i].general.structure== 'hierarchical' ){
                                    scoreStructure=0.8;
                                }
                                if($scope.generalSchema.structure == 'networked' && $scope.loms[i].general.structure== 'linear' ){
                                    scoreStructure=0.2;
                                }
                                //hierarchical
                                if($scope.generalSchema.structure == 'hierarchical' && $scope.loms[i].general.structure== 'hierarchical' ){
                                    scoreStructure=1;
                                }
                                if($scope.generalSchema.structure == 'hierarchical' && $scope.loms[i].general.structure== 'linear' ){
                                    scoreStructure=0.3;
                                }
                                //linear
                                if($scope.generalSchema.structure == 'linear' && $scope.loms[i].general.structure== 'linear' ){
                                    scoreStructure=1;
                                }
                                infoSimilLom.score=infoSimilLom.score+scoreStructure;
                        }
                        // --- enum
                        if(!generalSchema_language.classList.contains('ng-empty')){
                            if($scope.generalSchema.language == $scope.loms[i].general.language){
                                infoSimilLom.score=infoSimilLom.score+1;
                            }
                        }
                        if(!generalSchema_title.classList.contains('ng-empty')){
                            infoSimilLom.score=infoSimilLom.score+calculateScoreStringsLom($scope.generalSchema.title,$scope.loms[i].general.title);
                        }
                        if(!generalSchema_entry.classList.contains('ng-empty') && $scope.loms[i].general.id_entry!=null){
                            var scoreIdEntry=0, 
                                maxValue=50;
                            if($scope.generalSchema.id_entry==$scope.loms[i].general.id_entry){
                                scoreIdEntry=1;
                            }else{
                                scoreIdEntry=1-(Math.abs($scope.generalSchema.id_entry - $scope.loms[i].general.id_entry)/maxValue);
                            }
                            infoSimilLom.score=infoSimilLom.score+scoreIdEntry;
                        }
                        // --- number
                        if(!generalSchema_catalog.classList.contains('ng-empty')){
                            infoSimilLom.score=infoSimilLom.score+calculateScoreStringsLom($scope.generalSchema.id_catalog,$scope.loms[i].general.id_catalog);      
                        }
                        similarLoms.push(infoSimilLom);
                }
                if(similarLoms.length>0){
                    similarLoms.sort(function (a, b){
                     return (b.score - a.score)
                    })
                }
                auxSimilarLom=similarLoms[0];
                similarLom=$scope.loms.filter(function(element) {
                    return element._id == auxSimilarLom._id;
                });                  
                        
                loadFormLom(similarLom);
        }
        var loadFormLom=function(similarLom){
                        if(useSchema_resource_difficulty.classList.contains('ng-empty')){
                            useSchema_resource_difficulty.value=similarLom[0].use.resource_difficulty;
                        }
                        if(useSchema_resource_context.classList.contains('ng-empty')){
                            useSchema_resource_context.value=similarLom[0].use.resource_context;
                        }
                        if(useSchema_resource_target.classList.contains('ng-empty')){
                            useSchema_resource_target.value=similarLom[0].use.resource_target;
                        }
                        if(useSchema_resource_type.classList.contains('ng-empty')){
                            useSchema_resource_type.value=similarLom[0].use.resource_type;
                        }
                        if(useSchema_language.classList.contains('ng-empty')){
                            useSchema_language.value=similarLom[0].use.language;
                        }
                        if(useSchema_interactivity_level.classList.contains('ng-empty')){
                            useSchema_interactivity_level.value=similarLom[0].use.interactivity_level;
                        }
                        if(useSchema_interactivity_type.classList.contains('ng-empty')){
                            useSchema_interactivity_type.value=similarLom[0].use.interactivity_type;
                        }
                        //Technical
                        if(technicalSchema_url.classList.contains('ng-empty')){
                            technicalSchema_url.value=similarLom[0].technical.url;
                        }
                        if(technicalSchema_size_kb.classList.contains('ng-empty')){
                            technicalSchema_size_kb.value=similarLom[0].technical.size_kb;
                        }
                        if(technicalSchema_format.classList.contains('ng-empty')){
                            technicalSchema_format.value=similarLom[0].technical.format;
                        }
                        //Metadata
                        if(metadataSchema_contribution_date.classList.contains('ng-empty')){
                            metadataSchema_contribution_date.value=similarLom[0].metadata.contribution_date;
                        }
                        if(metadataSchema_contribution_entity.classList.contains('ng-empty')){
                            metadataSchema_contribution_entity.value=similarLom[0].metadata.contribution_entity;
                        }
                        if(metadataSchema_contribution_type.classList.contains('ng-empty')){
                            metadataSchema_contribution_type.value=similarLom[0].metadata.contribution_type;
                        }
                        //lifecycle
                        if(lifecycleSchema_contribution_date.classList.contains('ng-empty')){
                            lifecycleSchema_contribution_date.value=similarLom[0].lifecycle.contribution_date;
                        }
                        if(lifecycleSchema_contribution_entity.classList.contains('ng-empty')){
                            lifecycleSchema_contribution_entity.value=similarLom[0].lifecycle.contribution_entity;
                        }
                        if(lifecycleSchema_contribution_type.classList.contains('ng-empty')){
                            lifecycleSchema_contribution_type.value=similarLom[0].lifecycle.contribution_type;
                        }
                        if(lifecycleSchema_state.classList.contains('ng-empty')){
                            lifecycleSchema_state.value=similarLom[0].lifecycle.state;
                        }
                        if(lifecycleSchema_version.classList.contains('ng-empty')){
                            lifecycleSchema_version.value=similarLom[0].lifecycle.version;
                        }
                        //general
                        if(generalSchema_aggregation_level.classList.contains('ng-empty')){
                            generalSchema_aggregation_level.value=similarLom[0].general.aggregation_level;
                        }
                        if(generalSchema_structure.classList.contains('ng-empty')){
                            generalSchema_structure.value=similarLom[0].general.structure;
                        }
                        if(generalSchema_language.classList.contains('ng-empty')){
                            generalSchema_language.value=similarLom[0].general.language;
                        }
                        if(generalSchema_title.classList.contains('ng-empty')){
                            generalSchema_title.value=similarLom[0].general.title;
                        }
                        if(generalSchema_entry.classList.contains('ng-empty')){
                            generalSchema_entry.value=similarLom[0].general.id_entry;
                        }
                        if(generalSchema_catalog.classList.contains('ng-empty')){
                            generalSchema_catalog.value=similarLom[0].general.id_catalog;
                        }              
        }
         $scope.resetFormLom=function(){
            adminLomsForm.reset();
            //General
            $scope.generalSchema={};
            $scope.generalSchema.aggregation_level=null;
            $scope.generalSchema.structure="";
            $scope.generalSchema.language="";
            $scope.generalSchema.title="";
            $scope.generalSchema.id_entry=null;
            $scope.generalSchema.id_catalog="";
            //Lyfecycle
            $scope.lifecycleSchema={};
            $scope.lifecycleSchema.contribution_date=null;
            $scope.lifecycleSchema.contribution_entity="";
            $scope.lifecycleSchema.contribution_type="";
            $scope.lifecycleSchema.state="";
            $scope.lifecycleSchema.version=null;
            //Metadata
            $scope.metadataSchema={};
            $scope.metadataSchema.contribution_date=null;
            $scope.metadataSchema.contribution_entity="";
            $scope.metadataSchema.contribution_type="";
            //Technical
            $scope.technicalSchema={};
            $scope.technicalSchema.url="";
            $scope.technicalSchema.size_kb=null;
            $scope.technicalSchema.format="";
            //Usechema
            $scope.useSchema={};    
            $scope.useSchema.resource_difficulty="";
            $scope.useSchema.resource_context="";
            $scope.useSchema.resource_target="";
            $scope.useSchema.resource_type="";
            $scope.useSchema.language="";
            $scope.useSchema.interactivity_level="";
            $scope.useSchema.interactivity_type="";  
        }
        $scope.removeLom = function(idLom, e){
            console.log('eliminado item con id: ', idLom);
            if (confirm("¿SEGURO QUE QUIERE ELIMINAR ESTE LOM?") === false) {
                e.preventDefault();
                return;
            }
            deleteLomFromTeacher($scope.activeUser._id,$scope.lomsTeacher,idLom);
            lomsApi.removeItem(idLom).then(function(response) {
                    console.log('eliminado item con exito', response);
                    var promise=updateLoms();
                    promise.then(function() {  
                        $scope.managementViewLoms();   
                    }, function(error) {
                        console.log('Se ha producido un error al actualizar los loms: '+error);     
                    });
                }, function(error) {
                    console.log('error al eliminar item', error);
             });
        };
        var deleteLomFromTeacher= function (idTeacher,loms,idLom) {
            let filteredLoms=[];
            angular.forEach(loms,function(lom){
                if(lom._id!=idLom){
                    filteredLoms.push(lom);
                }
            });
            teacherApi.updateLomsTeacher(idTeacher,filteredLoms,$scope.activeUser.identification).then(function(response){
                console.log('Actualizando loms de profesor con éxito: ',response);
            }, function myError(err) {
                console.log(err);
                alert('Error actualizando loms de profesor de tipo: '+err.status);      
            }); 
        }


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

    
        var assignLomToTeacher=function(idTeacher,idLom) {
            console.log("Objetos para asignar lom a profesor: "+ idTeacher,idLom);
            var lomsTeacher=[];   
            lomsTeacher= $scope.activeUser.elements.loms;
            console.log('Obteniendo loms de profesor: ',lomsTeacher);
            lomsTeacher.push(idLom);
            teacherApi.updateLomsTeacher(idTeacher,lomsTeacher,$scope.activeUser.identification).then(function(response){
                console.log('Asignando loms a profesor con éxito: ',response);
            }, function myError(err) {
                console.log(err);
                alert('Error asignando loms a profesor de tipo: '+err.status);      
            });    
        }

        
        
        
    });