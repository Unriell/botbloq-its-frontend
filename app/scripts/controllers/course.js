
   botBloqApp.controller('courseCtrl',
                         function($log, $scope,$http,$location,coursesApi, lomsApi) {
        $log.log('course ctrl start');

        $scope.actualCourse=courseSelected;


    });