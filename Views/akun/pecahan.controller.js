(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('pecahanController', pecahanController);

    pecahanController.$inject = [ '$rootScope','$location','$window','$scope','pecahanService'];
    function pecahanController( $rootScope,$location,$window,$scope,pecahanService) {



        var vm = this;

        vm.user = [];
        $scope.obj = {};


        initController();

        function initController() {
            //initData();
            pecahanService.initData();


        }

        $scope.refreshData = function (id) {
                $('#jqxgrid').jqxGrid('updatebounddata');
        }

        $scope.addData = function (id) {
            if (pecahanService.addedit('POST',0,0)) {
                setTimeout(function () {
                    $('#jqxgrid').jqxGrid('updatebounddata')
                }, 500);
            }
        }



        $scope.deleteData = function (id) {
            var selcell = $("#jqxgrid").jqxGrid('getselectedcell');
            var valueId = $('#jqxgrid').jqxGrid('getcellvalue', selcell.rowindex, 'uid');

           if (pecahanService.deleteData(valueId)) {
               setTimeout(function() {
                   $('#jqxgrid').jqxGrid('updatebounddata')
               },500);


           }
        }

    }

})();