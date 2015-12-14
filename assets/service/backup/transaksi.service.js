(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('transaksiService', transaksiService);

    transaksiService.$inject = ['$http','DREAM_FACTORY_URL'];

    function transaksiService($http, DREAM_FACTORY_URL) {
        var service = {};
        $http.defaults.headers.common['X-DreamFactory-Application-Name'] = 'MetronicApp'; //default header for X-DreamFactory-Application-Name

        service.initData = initData;
        service.addedit = addedit;
        service.addtrxh_trxd = addtrxh_trxd;
        service.deleteData = deleteData;
        service.fetchNasab = fetchNasab;

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

        function fetchNasab(idnasabah){
            var url = "";
            var data = {};

            url = DREAM_FACTORY_URL + '/rest/qian/_proc/fetchNasabah'
            data = {
                "params": [
                    {
                        "name": "idnasab",
                        "param_type": "IN",
                        "value": idnasabah
                    }
                ],
                "schema": {
                    "STATUS": "varchar",
                    "ERROR_CODE": "varchar",
                    "MESSAGE": "varchar"
                }
            };

            return $http({
                method: "POST",
                url: url,
                headers: {
                    'X-DreamFactory-Application-Name': "myapp"
                },
                data: data


            }).then(handleSuccess, handleError('Error updating data'));
        }

        function addtrxh_trxd(nasabah_id){
            var url = "";
            var data = {};

            url = DREAM_FACTORY_URL + '/rest/qian/_proc/insertTrxhTrxd?wrapper=record',
            data = {
                "params": [
                    {
                        "name": "nasab_id",
                        "param_type": "IN",
                        "value": "111"
                    }
                ],
                "schema": {
                    "STATUS": "varchar",
                    "ERROR_CODE": "varchar",
                    "MESSAGE": "varchar"
                },
                "wrapper": "record"
            };

            return $http({
                method: "POST",
                url: url,
                headers: {
                    'X-DreamFactory-Application-Name': "myapp"
                },
                data: data


            }).then(handleSuccess, handleError('Error updating data'));

        }

        function addedit(aemethod, rowid, rowdata){
            var url = "";
            var data = {};
            var pMethod = "";

            if (aemethod == 'POSTNASAB') {
                pMethod = "POST"
                url = DREAM_FACTORY_URL + '/rest/qian/nasab'
                data = {
                    "record": rowdata
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
                        method: pMethod,
                        url: url,
                        headers: {
                            'X-DreamFactory-Application-Name': "myapp"
                        },
                        data: data


                    }).then(handleSuccess, handleError('Error updating data'));

        }

        function initData(trxhid, trxhjenis){

            var source =
            {
                datatype: "json",
                type : "POST",
                data : {
                    "params": [
                        {
                            "name": "trxhid",
                            "param_type": "IN",
                            "value": trxhid
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
                    { name: 'trxd_trxh_id' },
                    { name: 'akun_name' },
                    { name: 'trxd_currency_id'},
                    { name: 'trxd_pecahan_id'},
                    { name: 'trxd_satuan'},
                    { name: 'trxd_jumlah'},
                    { name: 'trxd_total'},
                    { name: 'curname'},
                    { name: 'description'},
                    { name: 'nstatus'},
                    { name: 'currency_id'},
                    { name: 'pecahan'},
                    { name: 'stats'}

                ],
                id: 'id',
                url: DREAM_FACTORY_URL+ "/rest/qian/_proc/fetchTrxd?wrapper=record",
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
