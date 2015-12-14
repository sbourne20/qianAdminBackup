(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('currencyService', currencyService);

    currencyService.$inject = ['$http','DREAM_FACTORY_URL'];

    function currencyService($http, DREAM_FACTORY_URL) {
        var service = {};
        $http.defaults.headers.common['X-DreamFactory-Application-Name'] = 'MetronicApp'; //default header for X-DreamFactory-Application-Name

        service.initDataCurrency = initDataCurrency;
        service.addedit = addedit;
        service.deleteData = deleteData;
        service.currencyDataAdapter = currencyDataAdapter;

        return service;

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
        }

        function addedit(aemethod, rowid, rowdata){
            var url = "";
            var data = {};

            if (rowid==0) {

                url = DREAM_FACTORY_URL + '/rest/qian/currency';
                data = {
                    "record": [
                        {
                            "nstatus": "ACTIVE"
                        }

                    ],
                    "schema": {
                        "STATUS": "varchar",
                        "ERROR_CODE": "varchar",
                        "MESSAGE": "varchar"
                    },
                    "wrapper": "record"
                }
            } else {
                url = DREAM_FACTORY_URL + '/rest/qian/currency?ids='+rowdata.uid;
                data = {

                    "record": [
                        {
                            "curname": rowdata.curname,
                            "description": rowdata.description
                        }

                    ],
                    "schema": {
                        "STATUS": "varchar",
                        "ERROR_CODE": "varchar",
                        "MESSAGE": "varchar"
                    },
                    "wrapper": "record"
                };

            }

            return  $http({
                method: aemethod,
                url: url,
                headers: {
                    'X-DreamFactory-Application-Name': "myapp"
                },
                data: data


            }).then(handleSuccess, handleError('Error updating data'));
        }


        function currencyDataAdapter(){
            var source =
            {
                datatype: "json",
                type : "GET",

                datafields: [
                    { name: 'id' },
                    { name: 'curname' },
                    { name: 'description' },
                    { name: 'status'}

                ],
                id: 'id',
                url: DREAM_FACTORY_URL+ "/rest/qian/currency?filter=nstatus%3D'ACTIVE'&order=curname",
                root: 'record',

                updaterow: function (rowid, rowdata, commit) {
                    //console.log (rowdata.uid);
                    addedit('PATCH',rowid, rowdata);
                    commit(true);
                }
            };

            var dataAdapter = new $.jqx.dataAdapter(source, {
                beforeSend: function (request) {
                    request.setRequestHeader("X-DreamFactory-Application-Name", "myapp");


                }
            });

            return dataAdapter;
        }

        function initDataCurrency(){

            $("#jqxgrid").jqxGrid(
                {
                    width: "100%",
                    source: currencyDataAdapter(),
                    columnsresize: true,
                    editable: true,
                    selectionmode: 'singlecell',
                    editmode: 'click',
                    columns: [
                        { text: 'Mata Uang', dataField: 'curname', width: 100 },
                        { text: 'Deskripsi', dataField: 'description', width: 200 },
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
