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

        function addResource(generalSchema,lifecycleSchema,metadataSchema,technicalSchema, useSchema) {
            $log.debug("Objetos para hacer post: "+ generalSchema,lifecycleSchema,metadataSchema,
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
                $log.debug('ok despues de post', response.data.token);
                lomsPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de post',err);
            });
            return lomsPromise.promise;
        }
        function editResource(idItem,generalSchema,lifecycleSchema,metadataSchema,technicalSchema, useSchema) {
            $log.debug("Objetos para editar: "+ generalSchema,lifecycleSchema,metadataSchema,
                                 technicalSchema, useSchema);

            var lomsPromise = $q.defer();
            $log.debug('id de item a editar (antes de llamada)', idItem);
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
                $log.debug('ok despues de editar-post', response.data.token);
                lomsPromise.resolve();  
            }, function(err) {
                 $log.debug('error despues de editar-post',err);
            });
            return lomsPromise.promise;
        }

        function getResources() { 
          return $http.get( common.bitbloqBackendUrl + "/loms" );      
        }
        function getResource(item) { 
          return $http.get( common.bitbloqBackendUrl + "/loms/"+item._id );      
        }
        function removeItem(item) { 
          return $http.delete(common.bitbloqBackendUrl + "/loms/"+item );      
        }
        function removeAllItem(item) { 
          return $http.delete(common.bitbloqBackendUrl + "/loms");      
        }
       
      

        var exports = {
            addResource : addResource,
            getResources : getResources,
            getResource : getResource,
            removeItem : removeItem,
            removeAllItem : removeAllItem,
            editResource : editResource
        };


        return exports;

    });