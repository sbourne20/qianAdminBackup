(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$window', 'AuthenticationService' ];
    function LoginController($location, $window, AuthenticationService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.USER_NAME, vm.PASSWORD, function (response) {

                if (response.success) {
                    AuthenticationService.SetCredentials(vm.USER_NAME, vm.PASSWORD);
                    $location.path('/home/dashboard');
                    //console.log ('success');

                } else {
                    //FlashService.Error(response.message);
                    vm.dataLoading = false;
                    vm.response = response.message;
                    //console.log ('unsuccess');
                }
            });
        };
    }

})();
