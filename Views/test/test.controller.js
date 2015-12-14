var app = angular.module('MetronicApp');
app.controller('testController', function($scope){
    console.log('here');

    $scope.value = {
                            text : false
    };

    $scope.activate = function()
    {
        $scope.value.text = !$scope.value.text;
    };

});
