(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('rateService', rateService);

    rateService.$inject = ['$http','DREAM_FACTORY_URL'];

    function rateService($http, DREAM_FACTORY_URL) {
        var service = {};
        $http.defaults.headers.common['X-DreamFactory-Application-Name'] = 'MetronicApp'; //default header for X-DreamFactory-Application-Name

        service.initData = initData;
        service.addedit = addedit;
        service.publishRate = publishRate;
        //service.deleteData = deleteData;

        return service;
        /*
        function deleteData(uid){
            var url = "";
            var data = {};

            url = DREAM_FACTORY_URL + '/rest/qian/currency?ids='+uid;
            data = {

                "record": [
                    {
                        "nstatus": "DELETE"

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
        }*/

        function publishRate(){
            var url = "";
            var data = {};

            url = DREAM_FACTORY_URL + '/rest/qian/_proc/publishRate'
            data = {
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

        function addedit(aemethod, rowid, rowdata){
            var url = "";

            if (aemethod == 'POST') {
                var data = {};
                url = DREAM_FACTORY_URL + '/rest/qian/_proc/insert_currency'
                data = {
                    "schema": {
                        "STATUS": "varchar",
                        "ERROR_CODE": "varchar",
                        "MESSAGE": "varchar"
                    }
                };
            }
            else
            {
                //console.log (rowdata);
                url = DREAM_FACTORY_URL + '/rest/qian/rates?ids='+rowdata.nid;
                data = {

                    "record": [
                        {
                            "stamp_dt" : rowdata.nstampdt,
                            "price_sell" : rowdata.nprice_sell,
                            "price_buy" : rowdata.nprice_buy
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

        function initData(){

            var source =
            {
                datatype: "json",
                type : "GET",

                datafields: [
                    { name: 'stamp_dt' },
                    { name: 'curname' },
                    { name: 'price_buy', type: 'int' },
                    { name: 'price_sell', type: 'int'},
                    { name: 'nid', type: 'int'},
                    { name: 'nstampdt' },
                    { name: 'nprice_buy' , type: 'int'},
                    { name: 'nprice_sell', type: 'int'},
                    { name: 'currency_id', type: 'int'}

                ],
                id: 'id',
                url: DREAM_FACTORY_URL+ "/rest/qian/_proc/retrieveAdminRates",
                root: 'record',
                updaterow: function (rowid, rowdata, commit) {
                    //console.log ("haha " + rowdata.uid);
                    addedit('PATCH',rowid, rowdata);
                    commit(true);
                }

            };

            var dataAdapter = new $.jqx.dataAdapter(source, {
                beforeSend: function (request) {
                    request.setRequestHeader("X-DreamFactory-Application-Name", "myapp");


                }
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
                    source: dataAdapter,
                    columnsresize: true,
                    editable: true,
                    selectionmode: 'multiplecellsadvanced',
                    editmode: 'click',
                    columns: [
                        { text: 'Mata Uang', dataField: 'curname', width: 100, editable:false },
                        { text: 'Tanggal/Jam Updt Trkhr', dataField: 'stamp_dt', width: 150, cellclassname: cellclass1, editable:false },
                        { text: 'Jual Terakhir', dataField: 'price_sell', width: 100 , editable:false,  cellclassname: cellclass1,cellsformat: 'd', cellsalign: 'right'},
                        { text: 'Beli Terakhir', dataField: 'price_buy', width: 100, editable:false ,  cellclassname: cellclass1,cellsformat: 'd', cellsalign: 'right'},
                        { text: 'Tanggal/Jam', dataField: 'nstampdt', width: 150, cellbeginedit : setEditableCells},
                        { text: 'Jual', dataField: 'nprice_sell', width: 100, cellsformat: 'd', cellsalign: 'right', cellbeginedit : setEditableCells },
                        { text: 'Beli',dataField: 'nprice_buy', width: 100, cellsformat: 'd', cellsalign: 'right', cellbeginedit : setEditableCells}

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
