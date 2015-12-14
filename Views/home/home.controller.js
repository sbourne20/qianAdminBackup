(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = [ '$rootScope','$location','$window','$scope'];
    function HomeController( $rootScope,$location,$window,$scope ) {

        //init Metronic Layout
        /*$(document).ready(function() {
         Metronic.init(); // Run metronic theme
         Metronic.initComponents();
         });


         $scope.$on('$includeContentLoaded', function() {
         Layout.initHeader(); // init header
         });*/


        var vm = this;

        vm.user = [];

        initController();

        function initController() {
            loadCurrentUser();

        }

        function loadCurrentUser() {
          /*  UserService.GetById($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                    $rootScope.user = user;
                    if (vm.user.data.record[0].STATUS == "NEW"){
                        $location.path('/home/initial');
                    }

                });*/
        }
    }

})();