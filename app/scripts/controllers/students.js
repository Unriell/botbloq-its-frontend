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

        //Cuando usaba cuestionario dinámico necesitaba este codigo y el método createJsonAnswer de abajo.
                $scope.questionnaire=common.questionnaire;
                /*if($scope.questionnaire.form[0].children.length>1)
                    $scope.questions=$scope.questionnaire.form[0].children;*/
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
                "title":"¿Cuando deletrea una palabra ...",
                "answers":[
                    {
                        "title":"intenta visualizarla (se ve bien)?"
                    },
                    {
                        "title":"la sondea (es correcta)?"
                    },
                    {
                        "title":"la escribe (la siente bien)?"
                    }
                ]
            },
            {
                "title":"¿Cuando se esta concentrando ...",
                "answers":[
                    {
                        "title":"se distrae más por el desorden?"
                    },
                    {
                        "title":"se distrae más por el ruido?"
                    },
                    {
                        "title":"se distrae más por el movimiento o perturbación física?"
                    }
                ]
            },
            {
                "title":"¿Cuando elige una forma de arte favorita, ...",
                "answers":[
                    {
                        "title":"prefiere las pinturas?"
                    },
                    {
                        "title":"prefiere la música?"
                    },
                    {
                        "title":"prefiere la danza o la escultura?"
                    }
                ]
            },{
                "title":"¿Cuando recompensa a alguien, ...",
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
                "title":"¿Cuando se encuentra con gente, ...",
                "answers":[
                    {
                        "title":"recuerda principalmente cómo se veían / los alrededores?."
                    },
                    {
                        "title":"recuerda principalmente lo que se dijo / recuerda sus nombres?."
                    },
                    {
                        "title":"recuerda que hiciste con ellos / recuerda sus emociones?."
                    }
                ]
            },
            {
                "title":"¿Cuando ve una película, TV o lee una novela, ...",
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
            },{
                "title":"¿Cuando está aprendiendo, ...",
                "answers":[
                    {
                        "title":"prefiere leer, ver las palabras, ilustraciones o los diagramas; Dibujas?."
                    },
                    {
                        "title":"le gusta que le digan, asistir a conferencias, hablar de ello?."
                    },
                    {
                        "title":"le gusta involucrarse, ser práctico, probar, escribir notas?."
                    }
                ]
            },{
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
            },{
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
            },{
                "title":"¿Cuando está enfadado, ...",
                "answers":[
                    {
                        "title":"se queda en silencio y observa?."
                    },
                    {
                        "title":"se expresa con un estallido?."
                    },
                    {
                        "title":"se acobarda, apreta los puños y tira cosas?."
                    }
                ]
            },{
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
            },{
                "title":"¿Cuando está inactivo, ...",
                "answers":[
                    {
                        "title":"mira alrededor, mira algo?."
                    },
                    {
                        "title":"habla consigo mismo u otros?."
                    },
                    {
                        "title":"piensa, camina?."
                    }
                ]
            },
            {
                "title":"¿Cuando se expresa, ...",
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
            },{
                "title":"¿Cuando habla, ...",
                "answers":[
                    {
                        "title":"habla bastante rápido pero mantienes la conversación ociosa usando muchos símiles como 'una aguja en un pajar'?"
                    },
                    {
                        "title":"habla fluidamente con un ritmo uniforme, en un orden lógico y con pocas vacilaciones. Enuncia claramente?."
                    },
                    {
                        "title":"usa muchos movimientos de manos, habla de acciones y sentimientos. Hablar más despacio con pausas más largas?."
                    }
                ]
            },{
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
            }
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