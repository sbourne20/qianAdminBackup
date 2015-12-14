(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('CurrencyController', CurrencyController);

    CurrencyController.$inject = [ '$rootScope','$location','$window','$scope','currencyService'];
    function CurrencyController( $rootScope,$location,$window,$scope,currencyService) {



        var vm = this;

        vm.user = [];
        $scope.obj = {};


        initController();
        //initCurrency();

        function initController() {
            //initCurrency();
            currencyService.initDataCurrency();


        }

        $scope.refreshData = function (id) {
                $('#jqxgrid').jqxGrid('updatebounddata');
        }

        $scope.addData = function (id) {
            if (currencyService.addedit('POST',0,0)) {
                setTimeout(function() {
                    $('#jqxgrid').jqxGrid('updatebounddata')
                },500);
            }
        }

        $scope.deleteData = function (id) {
            var selcell = $("#jqxgrid").jqxGrid('getselectedcell');
            var valueId = $('#jqxgrid').jqxGrid('getcellvalue', selcell.rowindex, 'uid');
           if (currencyService.deleteData(valueId)) {
               setTimeout(function() {
                   $('#jqxgrid').jqxGrid('updatebounddata')
               },500);


           }
        }

    }

})();