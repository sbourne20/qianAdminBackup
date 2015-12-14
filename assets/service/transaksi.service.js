(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('transaksiService', transaksiService);

    transaksiService.$inject = ['$http','DREAM_FACTORY_URL','$rootScope'];

    function transaksiService($http, DREAM_FACTORY_URL, $rootScope) {
        var service = {};
        $http.defaults.headers.common['X-DreamFactory-Application-Name'] = 'MetronicApp'; //default header for X-DreamFactory-Application-Name

        service.initData = initData;
        service.addedit = addedit;
        service.addtrxh_trxd = addtrxh_trxd;
        service.deleteData = deleteData;
        service.fetchNasab = fetchNasab;
        service.changeJenis = changeJenis;
        service.saveTrxh = saveTrxh;
        service.fetchTRXH = fetchTRXH;
        service.postTRXH = postTRXH;
        return service;

        function changeJenis (trhid, jenis){
            var url = "";
            var data = {};

            url = DREAM_FACTORY_URL + '/rest/qian/_func/changeTRXJenis',
                data = {
                    "params": [
                        {
                            "name": "jenis",
                            "param_type": "IN",
                            "value": jenis
                        },
                        {
                            "name": "idtrxh",
                            "param_type": "IN",
                            "value": trhid
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

        function deleteData(uid){
            var url = "";


            url = DREAM_FACTORY_URL + '/rest/qian/trxd/'+uid;


            return  $http({
                method: "DELETE",
                url: url,
                headers: {
                    'X-DreamFactory-Application-Name': "myapp"
                },

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

        function saveTrxh(trxh){
            var url = DREAM_FACTORY_URL + '/rest/qian/trxh?ids='+trxh.id;
            var x = {
                a : "aa",
                b : "bb"
            }

            var data = {

                "record": [
                    {
                        "trxh_nasab_id" :  trxh.trxh_nasab_id,
                        "trxh_date" :  trxh.trxh_date,
                        "trxh_tipe" :  trxh.trxh_tipe,
                        "trxh_total" : trxh.trxh_total,
                        "trxh_amount" : trxh.trxh_amount,
                        "trxh_kembali" : trxh.trxh_kembali,
                        "trxh_notes" : trxh.trxh_notes


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
                method: "PATCH",
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
                        "value": nasabah_id
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

            if (aemethod == 'POST') {
                pMethod = "POST"
                url = DREAM_FACTORY_URL + '/rest/qian/trxd'
                data = {
                    "record": [{
                        "trxd_trxh_id" : rowid,
                        "trxd_jumlah": 0
                    }
                    ]
                };

            }
            else if (aemethod == 'POSTNASAB') {
                pMethod = "POST"
                url = DREAM_FACTORY_URL + '/rest/qian/nasab'
                data = {
                    "record": rowdata
                };

            } else
            {

                pMethod = aemethod;
                url = DREAM_FACTORY_URL + '/rest/qian/trxd?ids='+rowdata.uid;
                data = {

                    "record":
                        {
                            "trxd_currency_id" : rowdata.trxd_currency_id,
                            "trxd_stok_id" : rowdata.trxd_stok_id,
                            "trxd_satuan" : rowdata.trxd_satuan,
                            "trxd_jumlah" : rowdata.trxd_jumlah

                        }
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

        function postTRXH(idtrxh){
            var url = DREAM_FACTORY_URL + "/rest/qian/_func/postTRX?wrapper=record";
            var data = {
                "params": [
                    {
                        "name": "idtrxh",
                        "param_type": "IN",
                        "value": idtrxh
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


        function fetchTRXH(stats,idtrxh){
            var url = DREAM_FACTORY_URL + "/rest/qian/_proc/fetchTrxh?wrapper=record";
            var data = {
                    "params": [
                        {
                            "name": "stats",
                            "param_type": "IN",
                            "value": stats
                        },
                        {
                            "name": "idtrxh",
                            "param_type": "IN",
                            "value": idtrxh
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

        function initData(trxhid,stats){
        if (trxhid==0){

            var source =
            {
                datatype: "json",
                type: "POST",
                data: {
                    "params": [
                        {
                            "name": "stats",
                            "param_type": "IN",
                            "value": stats
                        },
                        {
                            "name": "idtrxh",
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
                    {name: 'id'},
                    {name: 'trxh_code'},
                    {name: 'trxh_date'},
                    {name: 'trxh_tipe'},
                    {name: 'jenis'},
                    {name: 'idtype'},
                    {name: 'idnasabah'},
                    {name: 'nama'},
                    {name: 'trxh_total', type: 'int'},
                    {name: 'trxh_stats'},
                    {name: 'idcopy', type: 'binary'},

                ],
                id: 'id',
                url: DREAM_FACTORY_URL + "/rest/qian/_proc/fetchTrxh?wrapper=record",
                root: 'record'
            };

        } else {
            var source =
            {
                datatype: "json",
                type: "POST",
                data: {
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
                    {name: 'id'},
                    {name: 'trxd_trxh_id'},
                    {name: 'trxd_currency_id'},
                    {name: 'trxd_stok_id'},
                    {name: 'trxd_satuan', type: 'int'},
                    {name: 'trxd_jumlah', type: 'int'},
                    {name: 'trxd_total', type: 'int'},
                    {name: 'curname'},
                    {name: 'pecahan', type: 'int'},
                    {name: 'pecahanID', type: 'int'}

                ],
                id: 'id',
                url: DREAM_FACTORY_URL + "/rest/qian/_proc/fetchTrxd?wrapper=record",
                root: 'record',
                updaterow: function (rowid, rowdata, commit) {
                    if (addedit('PATCH', rowid, rowdata))
                        setTimeout(function () {
                            commit(true)
                        }, 700);
                    else  setTimeout(function () {
                        commit(false)
                    }, 700);


                }

            };
        }
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
