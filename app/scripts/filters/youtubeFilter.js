
'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   
botBloqApp.filter('scrurl', function($sce) {
    return function(text) {
        var text2 = text.replace("watch?v=", "embed/");
        return $sce.trustAsResourceUrl(text2);
    };
});