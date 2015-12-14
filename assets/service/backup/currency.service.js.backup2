(function () {
    'use strict';

    angular
        .module('qianApp')
        .factory('CurrencyService', CurrencyService);

    CurrencyService.$inject = ['$http','DREAM_FACTORY_URL'];
    function CurrencyService($http, DREAM_FACTORY_URL) {
        var service = {};
        $http.defaults.headers.common['X-DreamFactory-Application-Name'] = 'qianApp'; //default header for X-DreamFactory-Application-Name

        service.GetListCurrency = GetListCurrency;
        return service;

        function GetListCurrency() {


            return  $http({
                method: 'Get',
                url: DREAM_FACTORY_URL + '/rest/qian/_proc/retrieve_rates',
                headers: {
                    'X-DreamFactory-Application-Name': "myapp"
                },
                data: {
                    "params": [
                        {
                            "name": "stats",
                            "param_type": "IN",
                            "value": "'ACTIVE'"
                        }
                    ],
                    "schema": {
                        "STATUS": "varchar",
                        "ERROR_CODE": "varchar",
                        "MESSAGE": "varchar"
                    },
                    "wrapper": "record"
                }


            }).then(handleSuccess, handleError('Error getting currency'));


        }

        function handleSuccess(data) {
            return data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }


    }

})();
