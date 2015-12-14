(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('pecahanService', pecahanService);

    pecahanService.$inject = ['$http','DREAM_FACTORY_URL'];

    function pecahanService($http, DREAM_FACTORY_URL) {
        var service = {};
        $http.defaults.headers.common['X-DreamFactory-Application-Name'] = 'MetronicApp'; //default header for X-DreamFactory-Application-Name

        service.initData = initData;
        service.addedit = addedit;

        service.deleteData = deleteData;

        return service;

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
                url = DREAM_FACTORY_URL + '/rest/qian/pecahan'
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

        function initData(){

            var sourceCurrency =
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
                root: 'record'
            };

            var dataAdapterCurrency = new $.jqx.dataAdapter(sourceCurrency, {
                beforeSend: function (request) {
                    request.setRequestHeader("X-DreamFactory-Application-Name", "myapp");


                }
            });



            var source =
            {
                datatype: "json",
                type : "GET",

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
                        { text: 'Mata Uang', dataField: 'currency_id', width: 100, displayfield:'curname', columntype: 'combobox',
                            createeditor: function (row, value, editor) {
                                editor.jqxComboBox({ source: dataAdapterCurrency, displayMember: 'curname', valueMember: 'id' });
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
