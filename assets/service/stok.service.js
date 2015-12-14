(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('stokService', stokService);

    stokService.$inject = ['$http','DREAM_FACTORY_URL'];

    function stokService($http, DREAM_FACTORY_URL) {
        var service = {};

        service.initData = initData;
        service.addedit = addedit;
        service.deleteData = deleteData;
        service.fetchStok = fetchStok;

        return service;

        function deleteData(uid){
            var url = "";
            var data = {};

            url = DREAM_FACTORY_URL + '/rest/qian/akun?ids='+uid;
            data = {

                "record": [
                    {
                        "stats": "DELETE"

                    }

                ],
                "schema": {
                    "STATUS": "varchar",
                    "ERROR_CODE": "varchar",
                    "MESSAGE": "varchar"
                },
                "wrapper": "record"
            };

            return  $http({
                method: "PATCH",
                url: url,
                headers: {
                    'X-DreamFactory-Application-Name': "myapp"
                },
                data: data


            }).then(handleSuccess, handleError('Error updating currency'));
        }



        function addedit(aemethod, rowid, rowdata){
            var url = "";

            if (aemethod == 'POST') {
                var data = {};
                url = DREAM_FACTORY_URL + '/rest/qian/akun'
                data = {
                    "record": [
                        {
                            "stats":"ACTIVE"
                        }
                    ]
                };
            }
            else
            {

                url = DREAM_FACTORY_URL + '/rest/qian/akun?ids='+rowdata.uid;
                data = {

                    "record": [
                        {
                            "akun_code" : rowdata.akun_code,
                            "akun_group" : rowdata.akun_group,
                            "akun_name" : rowdata.akun_name

                        },


                    ],
                    "schema": {
                        "STATUS": "varchar",
                        "ERROR_CODE": "varchar",
                        "MESSAGE": "varchar"
                    },
                    "wrapper": "record"
                };

            }


                return $http({
                        method: aemethod,
                        url: url,
                        headers: {
                            'X-DreamFactory-Application-Name': "myapp"
                        },
                        data: data


                    }).then(handleSuccess, handleError('Error updating data'));

        }

        function initData(curid){

            var source =
            {
                datatype: "json",
                type : "GET",
                data : {
                    "params": [
                        {
                            "name": "curid",
                            "param_type": "IN",
                            "value": curid
                        }
                    ],
                    "schema": {
                        "STATUS": "varchar",
                        "ERROR_CODE": "varchar",
                        "MESSAGE": "varchar"
                    },
                    "wrapper": "record"
                },
                datafields: [
                    { name: 'id' },
                    { name: 'pecahan_id' },
                    { name: 'qty' },
                    { name: 'pecahan' },
                    { name: 'curname' }

                ],
                id: 'id',
                url: DREAM_FACTORY_URL+ "/rest/qian/_proc/fetchStok",
                root: 'record',
                updaterow: function (rowid, rowdata, commit) {

                    //addedit('PATCH',rowid, rowdata);
                    //commit(true);
                }

            };
            var dataAdapter = new $.jqx.dataAdapter(source, {
                beforeSend: function (request) {
                    request.setRequestHeader("X-DreamFactory-Application-Name", "myapp");


                }
            });

            return dataAdapter;
        }

        function fetchStok(){


                var data = {
                    "params": [
                        {
                            "name": "curid",
                            "param_type": "IN",
                            "value": 0
                        }
                    ],
                    "schema": {
                        "STATUS": "varchar",
                        "ERROR_CODE": "varchar",
                        "MESSAGE": "varchar"
                    },
                    "wrapper": "record"
                };


            var url =  DREAM_FACTORY_URL+ "/rest/qian/_proc/fetchStok";

            return $http({
                method: "POST",
                url: url,
                headers: {
                    'X-DreamFactory-Application-Name': "myapp"
                },
                data: data


            }).then(handleSuccessData, handleError('Error updating data'));
        }

        function handleSuccessData(data) {
            return data;
        }


        function handleSuccess(data) {
            return true;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }


    }

})();
