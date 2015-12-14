(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('ptransaksiController', ptransaksiController);

    ptransaksiController.$inject = [ '$rootScope','$location','$window','$scope','transaksiService'];
    function ptransaksiController( $rootScope,$location,$window,$scope,transaksiService) {
        var searchObject = $location.search();

        //alert(searchObject.hid);
        $scope.trx={};

        initData (searchObject.hid);
        function initData(trxhid){
                transaksiService.fetchTRXH('TRXHTRXD',trxhid)
                    .then(function(result){
                      $scope.trx = result.data.record;
                        //$window.print();
            });
        }

    }

})();