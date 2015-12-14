(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('pecahanService', pecahanService);

    pecahanService.$inject = ['$http','DREAM_FACTORY_URL', 'rateService'];

    function pecahanService($http, DREAM_FACTORY_URL,rateService) {
        var service = {};
        $http.defaults.headers.common['X-DreamFactory-Application-Name'] = 'MetronicApp'; //default header for X-DreamFactory-Application-Name

        service.initData = initData;
        service.addedit = addedit;
        service.deleteData = deleteData;
        service.pecahanDataAdapter = pecahanDataAdapter;
        return service;

        var TRXRate = {};

        function deleteData(uid){
            var url = "";
            var data = {};

            url = DREAM_FACTORY_URL + '/rest/qian/pecahan?ids='+uid;
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
                url = DREAM_FACTORY_URL + '/rest/qian/_func/insertPecahan',
                    data = {
                        "schema": {
                            "STATUS": "varchar",
                            "ERROR_CODE": "varchar",
                            "MESSAGE": "varchar"
                        },
                        "wrapper": "record"
                    };
            }
            else
            {
                //console.log (rowdata);
                url = DREAM_FACTORY_URL + '/rest/qian/pecahan?ids='+rowdata.id;
                data = {

                    "record": [
                        {
                            "pecahan" : rowdata.pecahan,
                            "currency_id" : rowdata.currency_id

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

        function pecahanDataAdapter(xid){
            if (xid == "all"){
                var source =
                {
                    datatype: "json",
                    type : "GET",
                    data : {
                        "params": [
                            {
                                "name": "currencid",
                                "param_type": "IN",
                                "value": "0"
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
                        { name: 'curname' },
                        { name: 'id' },
                        { name: 'currency_id' },
                        { name: 'pecahan' }

                    ],
                    id: 'id',
                    url: DREAM_FACTORY_URL+ "/rest/qian/_proc/fetchPecahan",
                    root: 'record',
                    updaterow: function (rowid, rowdata, commit) {

                        addedit('PATCH',rowid, rowdata);
                        commit(true);
                    }

                };


            } else {
                var source =
                {
                    datatype: "json",
                    type : "GET",
                    data : {
                        "params": [
                            {
                                "name": "currencid",
                                "param_type": "IN",
                                "value": xid
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
                        { name: 'curname' },
                        { name: 'id' },
                        { name: 'currency_id' },
                        { name: 'pecahan' }

                    ],
                    id: 'id',
                    url: DREAM_FACTORY_URL+ "/rest/qian/_proc/fetchPecahan",
                    root: 'record',
                    updaterow: function (rowid, rowdata, commit) {

                        addedit('PATCH',rowid, rowdata);
                        commit(true);
                    }

                };
            }


            var dataAdapter = new $.jqx.dataAdapter(source, {
                beforeSend: function (request) {
                    request.setRequestHeader("X-DreamFactory-Application-Name", "myapp");
                autoBind : true

                }
            });
            return dataAdapter;

        }

        function initData(){


            rateService.fetchTRXRate2()
                .then (function(result){
                    TRXRate = result.data.record;
                JSON.stringify(TRXRate);

            });


            var cellclass1 = function (row, columnfield, value) {
                    return "noeditedCell";
            }

            var setEditableCells = function(row, datafield, columntype) {
                var xstatus = $('#jqxgrid').jqxGrid('getcellvalue', row, "nstampdt");
                //console.log (xstatus);
                if (xstatus==null){
                    return false;
                } else{
                    return true;
                }

            }


            $("#jqxgrid").jqxGrid(
                {
                    width: "100%",
                    source: pecahanDataAdapter('all'),
                    columnsresize: true,
                    editable: true,
                    selectionmode: 'multiplecellsadvanced',
                    editmode: 'click',
                    columns: [
                        { text: 'Mata Uang', dataField: 'currency_id', width: 100, displayfield:'curname', columntype: 'combobox',
                            createeditor: function (row, value, editor) {
                                //editor.jqxComboBox({ source: dataAdapterCurrency, displayMember: 'curname', valueMember: 'id' });
                                editor.jqxComboBox({ source: TRXRate, displayMember: 'curname', valueMember: 'currency_id' });
                            }
                        },
                        { text: 'Pecahan', dataField: 'pecahan', width: 150 },

                    ]
                });


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
