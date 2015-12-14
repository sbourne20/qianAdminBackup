(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('rateController', rateController);

    rateController.$inject = [ '$rootScope','$location','$window','$scope','rateService'];
    function rateController( $rootScope,$location,$window,$scope,rateService) {



        var vm = this;

        vm.user = [];
        $scope.obj = {};


        initController();
        //initCurrency();

        function initController() {
            //initData();
            rateService.initData();


        }

        $scope.refreshData = function (id) {
                $('#jqxgrid').jqxGrid('updatebounddata');
        }

        $scope.addData = function (id) {
            if (rateService.addedit('POST',0,0)) {
                setTimeout(function () {
                    $('#jqxgrid').jqxGrid('updatebounddata')
                }, 500);
            }
        }

        $scope.publishRate = function(){
            if (rateService.publishRate()) {
                setTimeout(function () {
                    $('#jqxgrid').jqxGrid('updatebounddata')
                }, 500);
            }
        }

/*        $scope.deleteData = function (id) {
            var selcell = $("#jqxgrid").jqxGrid('getselectedcell');
            var valueId = $('#jqxgrid').jqxGrid('getcellvalue', selcell.rowindex, 'uid');
           if (currencyService.deleteData(valueId)) {
               setTimeout(function() {
                   $('#jqxgrid').jqxGrid('updatebounddata')
               },500);


           }
        }*/

    }

})();