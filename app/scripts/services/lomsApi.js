'use strict';

/**
 * @ngdoc service
 * @name botbloqItsFrontendApp.lomsApi
 * @description
 * # lomsApi
 * Service in the bitbloqApp.
 */
botBloqApp.service('lomsApi', function($log, $q, $http, common) {

        $log.log('lomsApi start');

        function addLom(generalSchema,lifecycleSchema,metadataSchema,technicalSchema, useSchema) {
            console.log("Objetos para hacer post: "+ generalSchema,lifecycleSchema,metadataSchema,
                                 technicalSchema, useSchema);

            var lomsPromise = $q.defer();

            $http.post(common.bitbloqBackendUrl + '/loms', {
                general: {
                    id_catalog: generalSchema.id_catalog,
                    id_entry: generalSchema.id_entry,
                    title: generalSchema.title,
                    language: generalSchema.language,
                    structure: generalSchema.structure,
                    aggregation_level: generalSchema.aggregation_level  
                },
                lifecycle: {
                    version: lifecycleSchema.version,
                    state: lifecycleSchema.state,
                    contribution_type: lifecycleSchema.contribution_type,
                    contribution_entity: lifecycleSchema.contribution_entity,
                    contribution_date: lifecycleSchema.contribution_date
                },
                metadata: {
                    contribution_type: metadataSchema.contribution_type,
                    contribution_entity: metadataSchema.contribution_entity,
                    contribution_date: metadataSchema.contribution_date     
                },
                technical: {
                    format: technicalSchema.format, 
                    size_kb: technicalSchema.size_kb, 
                    url: technicalSchema.url      
                },
                use: {
                    interactivity_type: useSchema.interactivity_type,
                    interactivity_level: useSchema.interactivity_level,
                    language: useSchema.language,
                    resource_type: useSchema.resource_type,
                    resource_target: useSchema.resource_target,
                    resource_context: useSchema.resource_context,
                    resource_difficulty: useSchema.resource_difficulty
                }
            }).then(function(response) {
                console.log('ok despues de post', response.data.token);
                lomsPromise.resolve();  
            }, function(err) {
                 console.log('error despues de post',err);
            });
            return lomsPromise.promise;
        }
        function editLom(idItem,generalSchema,lifecycleSchema,metadataSchema,technicalSchema, useSchema) {
            console.log("Objetos para editar: "+ generalSchema,lifecycleSchema,metadataSchema,
                                 technicalSchema, useSchema);

            var lomsPromise = $q.defer();
            console.log('id de item a editar (antes de llamada)', idItem);
            $http.put(common.bitbloqBackendUrl + '/loms/'+idItem, {
                general: {
                    id_catalog: generalSchema.id_catalog,
                    id_entry: generalSchema.id_entry,
                    title: generalSchema.title,
                    language: generalSchema.language,
                    structure: generalSchema.structure,
                    aggregation_level: generalSchema.aggregation_level  
                },
                lifecycle: {
                    version: lifecycleSchema.version,
                    state: lifecycleSchema.state,
                    contribution_type: lifecycleSchema.contribution_type,
                    contribution_entity: lifecycleSchema.contribution_entity,
                    contribution_date: lifecycleSchema.contribution_date
                },
                metadata: {
                    contribution_type: metadataSchema.contribution_type,
                    contribution_entity: metadataSchema.contribution_entity,
                    contribution_date: metadataSchema.contribution_date     
                },
                technical: {
                    format: technicalSchema.format, 
                    size_kb: technicalSchema.size_kb, 
                    url: technicalSchema.url      
                },
                use: {
                    interactivity_type: useSchema.interactivity_type,
                    interactivity_level: useSchema.interactivity_level,
                    language: useSchema.language,
                    resource_type: useSchema.resource_type,
                    resource_target: useSchema.resource_target,
                    resource_context: useSchema.resource_context,
                    resource_difficulty: useSchema.resource_difficulty
                }
            }).then(function(response) {
                console.log('ok despues de editar-post', response.data.token);
                lomsPromise.resolve();  
            }, function(err) {
                 console.log('error despues de editar-post',err);
            });
            return lomsPromise.promise;
        }

        function getLoms() { 
          return $http.get( common.bitbloqBackendUrl + "/loms" );      
        }
        function getLom(item) { 
          return $http.get( common.bitbloqBackendUrl + "/loms/"+item._id );      
        }
        function removeItem(item) { 
          return $http.delete(common.bitbloqBackendUrl + "/loms/"+item );      
        }
        function removeAllItem() { 
          return $http.delete(common.bitbloqBackendUrl + "/loms");      
        }
       
       function addLomsToCourse(){
            
       }
       function removeLomsOfLesson(idCourse,section,lesson,loms){+
            console.log('eliminare los siguientes lomloms.lenght');
            return $http.delete(common.bitbloqBackendUrl + "/courses/"+idCourse+'/section/'+section+'/lesson/'+lesson+'/delete_loms', loms); 
       }

        var exports = {
            addLom : addLom,
            getLoms : getLoms,
            getLom : getLom,
            removeItem : removeItem,
            removeAllItem : removeAllItem,
            editLom : editLom,
            addLomsToCourse: addLomsToCourse,
            removeLomsOfLesson: removeLomsOfLesson

        };


        return exports;

    });