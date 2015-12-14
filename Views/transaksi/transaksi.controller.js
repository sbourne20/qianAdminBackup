(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('transaksiController', transaksiController);


    transaksiController.$inject = [ '$rootScope','$location','$window','$scope','transaksiService','$modal'];
    function transaksiController( $rootScope,$location,$window,$scope,transaksiService,$modal) {



        var vm = this;

        vm.user = [];
        vm.test = "test";
        $scope.obj = {};
        $scope.test = "test";

        var trxhdata = {};


        initController();

        function getTRXH(trxhid, data) {

            return data.filter( function(data) {
                return data.id == trxhid
            });
        }

        function refreshdataCon(){
            transaksiService.fetchTRXH("TRX",0)
                .then (function(result){
                trxhdata = result.data.record;
                //JSON.stringify (trxhdata);
            });

        }

        function initController() {

            refreshdataCon();

            var sourceTRXH =
            {
                datatype: "json",
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
                    {name: 'trxh_stats'}

                ],
                localdata: trxhdata
            };
            var trxhDA = new $.jqx.dataAdapter(sourceTRXH);

            $("#jqxgrid").jqxGrid(
                {
                    width: "100%",
                    source: transaksiService.initData(0,"TRX"),
                    columnsresize: true,
                    editable: false,
                    selectionmode: 'singlerow',
                    columns: [
                        { text: 'Kode', dataField: 'trxh_code', width: 150 },
                        { text: 'Tanggal Trx', dataField: 'trxh_date', width: 150 },
                        { text: 'Tipe Trx.', dataField: 'trxh_tipe', width: 80 },
                        { text: 'Indi/Perush', dataField: 'jenis', width: 100 },
                        { text: 'ID', dataField: 'idtype', width: 80 },
                        { text: 'ID #', dataField: 'idnasabah', width: 150 },
                        { text: 'Nama', dataField: 'nama', width: 200 },
                        { text: 'Total', dataField: 'trxh_total', width: 130, cellsformat: 'd', cellsalign: 'right' },
                        { text: 'Status TRX', dataField: 'trxh_stats', width: 100 },

                    ]
                });

            $("#jqxgrid").on("rowdoubleclick", function (event) {
                var args = event.args;
                var foundtrxh = getTRXH(args.row.bounddata.uid,trxhdata);

                transaksiService.fetchNasab(foundtrxh[0].idnasabah)
                    .then (function(result){
                      var trxhnasab = result.data[0];
                      //console.log (trxhnasab);

                var modalInstance = $modal.open({
                    templateUrl: './views/transaksi/transaksi.mdl.html',
                    windowClass: 'app-modal-window',
                    controller: "transaksiWinController",
                    resolve: {
                        trxhdata: function () {
                            return foundtrxh[0];
                        },
                        trxnasabah: function(){
                            return  trxhnasab;
                        }
                    }
                });
                    /*modalInstance.opened.then(function(){
                       transaksiService.prepForBroadcast("test");

                        $scope.$on('handleBroadcast', function() {
                            $scope.message = transaksiService.message;
                        });
                        //var elem = document.getElementById("fileinput-prev");
                        //console.log (elem);
                    });*/


                });
                //console.log (args.row.bounddata.uid);
            });
        }

        $scope.refreshData = function(){
            refreshdataCon();
            $('#jqxgrid').jqxGrid('updatebounddata');
        }

        $scope.addData = function(){
            //$scope.showModal = !$scope.showModal;
            var modalInstance = $modal.open({
                templateUrl: './views/transaksi/transaksi.mdl.html',
                windowClass: 'app-modal-window',
                controller: "transaksiWinController",
                resolve: {
                    trxhdata: function () {
                        return {};
                    },
                    trxnasabah: function(){
                        return  {};
                    }

                }
            });




        }




    }

})();
