'use strict';

/**
 * @ngdoc function
 * @name botbloqItsFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the botbloqItsFrontendApp
 */

   botBloqApp.controller('studentsCtrl',
                         function($log,$q,$scope,$http,$location,usersApi, knowledge, common) {
        $log.log('student ctrl start');
        $scope.changeInit(false); 

        $scope.questionnaire=common.questionnaire;

        $scope.questions=$scope.questionnaire.form[0].children;
        $scope.questionAnswer=[];
        $scope.answers=[];
        //Cosntruyo una estructura para recorrerla en el html y crear formulario
        angular.forEach($scope.questions,function(question,$index){
            var values_options=[];
            angular.forEach(question.children[0].choices,function(option){
                values_options.push(option.label.en);
            });
            $scope.questionAnswer[$index]={id:question.id,title:question.title.en,value:"",values:values_options};
        });

        usersApi.getStudents().then(function(response){
                $scope.students= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
        });

        $scope.updateStudents= function() {
            console.log('loading students ...');
            usersApi.getStudents().then(function(response){
                   $scope.students= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });
        };

        $scope.activeUser=function(user){
            usersApi.activeUser(user);
            common.activeUSer=user;
        };

        $scope.iSActiveUSer=function(user){
            return angular.equals(user, common.activeUSer);
        };

        var updateStudents=function(){
            console.log('Actualizando usuarios');
            usersApi.getStudents().then(function(response){
                $scope.students= response.data;
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });     
        };
        $scope.sendQuestionnaire=function(){
            createJsonAnswer();
            console.log('Enviando cuestionario: ',$scope.answers);
            var formatAnswers={answers:$scope.answers};
            usersApi.sendQuestionnaire(common.activeUSer._id,formatAnswers).then(function(response){
                console.log('Cuestionario enviado con éxito',response);
				$location.path("/courses");
            }, function myError(err) {
                console.log(err);
                alert('Error de tipo: '+err.status);      
            });     
        };

        //Cosntruyo el json con la estructura que debo enviarlo y lo guardo en answers.
        var createJsonAnswer=function(){
            angular.forEach($scope.questionAnswer,function(question,$index){
                $scope.answers[$index]={id_question:question.id,value:question.value};
            });     
        }
        
    });