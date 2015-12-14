(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('transaksiController', transaksiController);

    transaksiController.$inject = [ '$rootScope','$location','$window','$scope','transaksiService'];
    function transaksiController( $rootScope,$location,$window,$scope,transaksiService) {



        var vm = this;

        vm.user = [];
        $scope.obj = {};
        $scope.nasabah = {};
        $scope.value = {text: false};

        $scope.disableForm = true;

        //initController();



        function initController() {
            //initData();
           // transaksiService.initData();

            //$scope.nasabah.nama = "";
           // $scope.disableForm = false;

        }
        $scope.activate = function()
        {

            $scope.value.text = true;
            console.log ($scope.value);

        };
        $scope.onBlur = function(ev){

           $scope.value.text = true;
            console.log ($scope.value);
            /*transaksiService.fetchNasab($scope.nasabah.search)
                .then(function (result) {

                if (result.data.length>0){
                    $scope.nasabah = result.data[0];
                    $scope.nasabah.resultbox = "Pencarian ditemukan";


                } else {
                    $scope.disableForm = false;
                    $scope.nasabah.resultbox = "Pencarian tidak ditemukan, Segera isi data."
                }
            });*/


        }

        $scope.refreshData = function (id) {
                $('#jqxgrid').jqxGrid('updatebounddata');
        }

        $scope.addData = function (id) {
            if (transaksiService.addedit('POST',0,0)) {
                setTimeout(function () {
                    $('#jqxgrid').jqxGrid('updatebounddata')
                }, 500);
            }
        }



        $scope.deleteData = function (id) {
            var selcell = $("#jqxgrid").jqxGrid('getselectedcell');
            var valueId = $('#jqxgrid').jqxGrid('getcellvalue', selcell.rowindex, 'uid');

           if (transaksiService.deleteData(valueId)) {
               setTimeout(function() {
                   $('#jqxgrid').jqxGrid('updatebounddata')
               },500);


           }
        }

    }

})();