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


        initController();

        function initController() {
            //initData();
            transaksiService.initData();


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