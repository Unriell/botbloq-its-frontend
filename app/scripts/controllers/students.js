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
        if($scope.questionnaire.form[0].children.length>1)
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

        //Cuestionario estático 2
        $scope.questionnaire2=[
            {
                "title":"¿Cuando deletreas una palabra ...",
                "answers":[
                    {
                        "title":"intentas visualizarla (se ve bien)?"
                    },
                    {
                        "title":"la sondeas (es correcta)?"
                    },
                    {
                        "title":"la escribes (la sientes bien)?"
                    }
                ]
            },
            {
                "title":"¿Cuando te estas concentrando ...",
                "answers":[
                    {
                        "title":"te distraes más por el desorden?"
                    },
                    {
                        "title":"te distraes más por el ruido?"
                    },
                    {
                        "title":"te distraes más por el movimiento o perturbación física?"
                    }
                ]
            },
            {
                "title":"¿Cuando eliges una forma de arte favorita, ...",
                "answers":[
                    {
                        "title":"prefieres las pinturas?"
                    },
                    {
                        "title":"prefieres la música?"
                    },
                    {
                        "title":"prefieres la danza o la escultura?"
                    }
                ]
            },{
                "title":"¿Cuando recompensas a alguien, ...",
                "answers":[
                    {
                        "title":"tiende a escribir alabanzas en su trabajo en una nota?"
                    },
                    {
                        "title":"tiende a darle elogios oralmente?"
                    },
                    {
                        "title":"tiende a darle una palmadita en la espalda?"
                    }
                ]
            },{
                "title":"¿Cuando hablas, ...",
                "answers":[
                    {
                        "title":"hablas bastante rápido, pero mantienes la conversación ociosa y limitada?. Usando muchos símiles; p.ej. Es como una aguja en un pajar?"
                    },
                    {
                        "title":"hablas fluidamente con un ritmo uniforme, en un orden lógico y con pocas vacilaciones. Enuncia claramente?."
                    },
                    {
                        "title":"usas muchos movimientos de manos, habla de acciones y sentimientos. Hablar más despacio con pausas más largas?."
                    }
                ]
            },{
                "title":"¿Cuando te encuentras con gente, ...",
                "answers":[
                    {
                        "title":"recuerdas principalmente cómo se veían / los alrededoresturas?."
                    },
                    {
                        "title":"recuerdas principalmente lo que se dijo / recuerdas sus nombres?."
                    },
                    {
                        "title":"recuerdas que hiciste con ellos / recuerdas sus emociones?."
                    }
                ]
            },
            {
                "title":"¿Cuando ves una película, TV o lees una novela, ...",
                "answers":[
                    {
                        "title":"recuerda las mejores escenas que le parecían a la gente?."
                    },
                    {
                        "title":"recuerda lo mejor que se dijo / como la música sonaba?."
                    },
                    {
                        "title":"recuerda lo mejor que sucedió / la emoción del personaje?."
                    }
                ]
            },
            {
                "title":"¿Cuando intenta interpretar el estado de ánimo de alguien, ...",
                "answers":[
                    {
                        "title":"principalmente nota sus expresiones faciales?."
                    },
                    {
                        "title":"escucha el tono de su voz?."
                    },
                    {
                        "title":"ve sus movimientos corporales?."
                    }
                ]
            },
            {
                "title":"¿Cuando está recordando algo, ...",
                "answers":[
                    {
                        "title":"recuerda lo que viste / las caras de las personas / como se veían las cosas?."
                    },
                    {
                        "title":"recuerda que se dijo / los nombres de las personas / las bromas?."
                    },
                    {
                        "title":"recuerda lo que se hizo / como se sentía?."
                    }
                ]
            },
            {
                "title":"¿Cuando está memorizando algo, ...",
                "answers":[
                    {
                        "title":"prefiere memorizar escribiendo algo repetidamente?."
                    },
                    {
                        "title":"prefiere memorizar repitiendo palabras en voz alta?."
                    },
                    {
                        "title":"prefiere memorizar haciendo algo repetidamente?."
                    }
                ]
            },
            {
                "title":"¿Cuando está enfadado, ...",
                "answers":[
                    {
                        "title":"se queda en silencio y observa?."
                    },
                    {
                        "title":"se expresa con un estallido?."
                    },
                    {
                        "title":"te acobardas, apretas los puños y tiras cosas?."
                    }
                ]
            },
            {
                "title":"¿Cuando está inactivo, ...",
                "answers":[
                    {
                        "title":"mira alrededor, mira algo?."
                    },
                    {
                        "title":"habla consigo mismo u otros?."
                    },
                    {
                        "title":"piensas, caminas?."
                    }
                ]
            },
            {
                "title":"¿Cuando te expresas, ...",
                "answers":[
                    {
                        "title":"a menudo usa frases como: 'Yo veo', 'Tengo la imagen', 'Vamos a ver', 'Puedo imaginarlo'?."
                    },
                    {
                        "title":"a menudo usa frases como: 'Eso suena bien', 'Te oigo', 'Suena la campana', 'Algo me dice', 'De repente'?."
                    },
                    {
                        "title":"a menudo usa frases como: 'Eso sienta bien', 'Estoy buscando a tientas una respuesta', 'Necesito un ejemplo concreto'?."
                    }
                ]
            },
            {
                "title":"¿Cuando está aprendiendo, ...",
                "answers":[
                    {
                        "title":"prefieres leer, ver las palabras, ilustraciones o los diagramas; Dibujas?."
                    },
                    {
                        "title":"le gusta que le digan, asistir a conferencias, hablar de ello?."
                    },
                    {
                        "title":"le gusta involucrarse, ser práctico, probar, escribir notas?."
                    }
                ]
            },
            {
                "title":"¿Cuando monta un equipo nuevo, ...",
                "answers":[
                    {
                        "title":"primero mira los diagramas, lee las instrucciones?."
                    },
                    {
                        "title":"primero pregunta a alguien que hacer, despúes plantea como montarlo?."
                    },
                    {
                        "title":"primero trabajas con las piezas?."
                    }
                ]
            },
        ];
        //
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
            console.log('Enviando cuestioanario');
            createJsonAnswer();
            console.log('RESPUESTAS para enviar: ',$scope.answers);
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