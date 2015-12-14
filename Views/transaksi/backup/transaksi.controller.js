(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('transaksiController', transaksiController);

    transaksiController.$inject = [ '$rootScope','$location','$window','$scope','transaksiService', 'rateService', 'pecahanService'];
    function transaksiController( $rootScope,$location,$window,$scope,transaksiService, rateService, pecahanService) {



        var vm = this;

        vm.user = [];
        $scope.obj = {};
        $scope.nasabah = {};
        $scope.trxh = {};
        $scope.disableForm = true;

        //initController();



        function initController() {
            //initData();
            // transaksiService.initData();

            //$scope.nasabah.nama = "";
            // $scope.disableForm = false;

        }

        $scope.onBlur = function(ev){


            transaksiService.fetchNasab($scope.nasabah.idnasabah)
             .then(function (result) {

                    if (result.data.length > 0) {
                        $scope.nasabah = result.data[0];
                        $scope.nasabah.resultbox = "Pencarian ditemukan";
                        $scope.disableForm = true;

                    } else {
                        var idnasabahlama = $scope.nasabah.idnasabah;
                        $scope.nasabah = {
                            idnasabah : idnasabahlama
                        };
                        $scope.disableForm = false;
                        $scope.nasabah.resultbox = "Pencarian tidak ditemukan, Segera isi data."
                    }
                });


        }

        $scope.refreshData = function (id) {
            //$('#jqxgrid').jqxGrid('updatebounddata');
        }

        $scope.addNasabData = function () {
           transaksiService.addedit('POSTNASAB',0,$scope.nasabah)
            .then (function(result){
               $scope.disableForm = true;
           });



        }

        function prepareDetilTransaksi(dataAdapter){


            $("#jqxgrid").jqxGrid(
                {
                    width: "100%",
                    source: dataAdapter,
                    columnsresize: true,
                    editable: true,
                    selectionmode: 'multiplecellsadvanced',
                    editmode: 'click',
                    columns: [
                        { text: 'Mata Uang', dataField: 'trxd_currency_id', displayfield: 'curname',width: 150, columntype:'combobox',
                            createeditor: function (row, value, editor) {
                                editor.jqxComboBox({ source: rateService.fetchTRXRate("xa",0), displayMember: 'curname', valueMember: 'currency_id' });
                            },
                            initeditor: function (row, cellvalue, editor, celltext, pressedkey) {

                            },
                            cellvaluechanging:function (row, column, columntype, oldvalue, newvalue) {
                                var curid = newvalue.value;
                                 rateService.fetchTRXRateJB($scope.trxh.jenis, curid)
                                 .then (function(result){
                                     //console.log (result.data.record[0].harga);
                                     $("#jqxgrid").jqxGrid('setcellvalue', row, "trxd_satuan", result.data.record[0].harga);

                                 });
                            }

                        },
                        { text: 'Pecahan', dataField: 'trxd_pecahan_id', displayfield: 'pecahan',width: 150, columntype:'combobox',
                            initeditor: function (row, cellvalue, editor, celltext, pressedkey) {
                                var valueId = $('#jqxgrid').jqxGrid('getcellvalue', row, 'trxd_currency_id');
                                editor.jqxComboBox({ source: pecahanService.pecahanDataAdapter(valueId), displayMember: 'pecahan', valueMember: 'id' });

                            }
                        },
                        { text: 'Harga Satuan', dataField: 'trxd_satuan', width: 100 },
                        { text: 'Jumlah', dataField: 'trxd_jumlah', width: 100 },
                        { text: 'Total', dataField: 'trxd_total', width: 100 },

                    ]
                });
        }

        $scope.addDataTrxh = function(){
            transaksiService.addtrxh_trxd($scope.nasabah.idnasabah)
                .then (function(result){
                $scope.trxh = result.data.record[0];
                var transaksiDA = transaksiService.initData($scope.trxh.id, $scope.trxh.jenis);
                prepareDetilTransaksi(transaksiDA);

            });
        }

        $scope.deleteData = function (id) {
            /*var selcell = $("#jqxgrid").jqxGrid('getselectedcell');
            var valueId = $('#jqxgrid').jqxGrid('getcellvalue', selcell.rowindex, 'uid');

            if (transaksiService.deleteData(valueId)) {
                setTimeout(function() {
                    $('#jqxgrid').jqxGrid('updatebounddata')
                },500);


            }*/
        }

    }

})();