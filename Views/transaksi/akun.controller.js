(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('akunController', akunController);

    akunController.$inject = [ '$rootScope','$location','$window','$scope','akunService'];
    function akunController( $rootScope,$location,$window,$scope,akunService) {



        var vm = this;

        vm.user = [];
        $scope.obj = {};


        initController();

        function initController() {
            //initData();
            akunService.initData();


        }

        $scope.refreshData = function (id) {
                $('#jqxgrid').jqxGrid('updatebounddata');
        }

        $scope.addData = function (id) {
            if (akunService.addedit('POST',0,0)) {
                setTimeout(function () {
                    $('#jqxgrid').jqxGrid('updatebounddata')
                }, 500);
            }
        }



        $scope.deleteData = function (id) {
            var selcell = $("#jqxgrid").jqxGrid('getselectedcell');
            var valueId = $('#jqxgrid').jqxGrid('getcellvalue', selcell.rowindex, 'uid');

           if (akunService.deleteData(valueId)) {
               setTimeout(function() {
                   $('#jqxgrid').jqxGrid('updatebounddata')
               },500);


           }
        }

    }

})();