/**
 * Created by ozkan gokturk on 25.02.2016.
 */

angular.module('app', ['preventMaxMin'])

    .controller('PreventMaxMinCtrl', function($scope) {
        $scope.number1 = 20;
        $scope.number2 = 20;
        $scope.number3 = 5;
        $scope.number4 = 40;
    });