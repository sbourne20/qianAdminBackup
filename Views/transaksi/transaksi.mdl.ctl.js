function transaksiWinController($scope,$modal, $modalInstance, transaksiService, rateService, pecahanService, $location,
                                stokService, trxhdata, trxnasabah, $window,$interval,$http) {
    $scope.disableForm = true;
    $scope.disableButtonTRX = true;
    $scope.nasabah = trxnasabah;
    $scope.trxh = trxhdata;
    $scope.TRXrate = {};
    $scope.pecahan = {};


    if (typeof $scope.nasabah.id!=="undefined") {
        $scope.trxh.mode = "Edit";
        $scope.disableButtonTRX = false;


        //var elem = document.getElementsByClassName(".fileinput-preview");

        showIDCopy();

    }


    $scope.addNasabData = function () {
        var elem = document.getElementById("fileinput-prev");
        var f = document.getElementById('file').files[0],
            r = new FileReader();

        r.onloadend = function(e) {
            if (e.target.result !== null) {
                $scope.nasabah.idcopy = e.target.result;
                transaksiService.addedit('POSTNASAB', 0, $scope.nasabah)
                    .then(function (result) {

                        $scope.nasabah.id = result.data.record[0].id;
                        $scope.disableForm = true;
                        $scope.disableButtonTRX = false;
                        $scope.trxh.nama = $scope.nasabah.nama;
                        $scope.trxh.trxh_nasab_id = $scope.nasabah.id;
                        $scope.trxh.idnasabah = $scope.nasabah.id;
                    });
            }
        }
        r.readAsBinaryString(f);
    }


    function showIDCopy(){
        window.setTimeout(function () {
            if ($scope.nasabah.idcopy!== null) {
                var elem = document.getElementById("fileinput-prev");
                var DOM_img = document.createElement("img");
                DOM_img.setAttribute("id","IMGidcopy");
                var data = btoa($scope.nasabah.idcopy);
                DOM_img.src = "data:image/png;base64," + data;
                elem.appendChild(DOM_img);
            }
        },500);
    }

    function getRateTRX(curid, data) {

        return data.filter( function(data) {
            return data.currency_id == curid
        });
    }


    function getPecahanTRX(curid, pecahanid, data) {
        if (pecahanid==0) {
            return data.filter(function (data) {
                return (data.currency_id == curid)
            });
        } else{
            return data.filter(function (data) {
                return (data.currency_id == curid) && (data.pecahan_id == pecahanid)
            });
        }
    }

    $scope.refreshDataTrxd = function(){
       setTimeout(function () {
            $('#jqxgridDetil').jqxGrid('updatebounddata')
        }, 500);


    }


    function prepareDetilTransaksi(){

        var transaksiDA = transaksiService.initData($scope.trxh.id, 0);
        rateService.fetchTRXRate2()
            .then(function (result) {
                $scope.TRXRate = result.data.record;
                JSON.stringify($scope.TRXRate);
            });

        stokService.fetchStok()
            .then(function (result) {
                $scope.pecahan = result.data.record;
                JSON.stringify($scope.pecahan);
            });

        $("#jqxgridDetil").jqxGrid(
            {
                width: "100%",
                source: transaksiDA,
                columnsresize: true,
                editable: true,
                selectionmode: 'singlecell',
                editmode: 'selectedcell',
                showstatusbar: true,
                showaggregates: true,
                columns: [
                    { text: 'Mata Uang', dataField: 'trxd_currency_id', displayfield: 'curname',width: 150, columntype:'combobox',
                        createeditor: function (row, value, editor) {
                            //editor.jqxComboBox({ source: rateService.fetchTRXRate("xa",0), displayMember: 'curname', valueMember: 'currency_id' });
                            editor.jqxComboBox({ source: $scope.TRXRate, displayMember: 'curname', valueMember: 'currency_id' });
                        },

                        cellendedit : function (row, datafield, columntype, oldvalue, newvalue) {
                            var curid = newvalue.value;
                            var found = getRateTRX(curid, $scope.TRXRate);

                            if ($scope.trxh.trxh_tipe=="Jual")
                                var hsatuan = found[0].price_sell;
                            else
                                var hsatuan = found[0].price_buy;

                            setTimeout(function () {
                                $("#jqxgridDetil").jqxGrid('setcellvalue', row, "trxd_satuan", hsatuan);
                            },700);

                            var valueId = $('#jqxgridDetil').jqxGrid('getcellvalue', row, 'trxd_jumlah');
                            $("#jqxgridDetil").jqxGrid('setcellvalue', row, "trxd_total", valueId * hsatuan);

                            setTimeout(function () {
                                $("#jqxgridDetil").jqxGrid('setcellvalue', row, "trxd_stok_id","120");
                            },700);
                        }

                    },
                    {
                        text: 'Stok', datafield: 'trxd_stok_id', width: 80, columntype: 'button', cellsrenderer: function () {
                            return "Cari Stok";
                        }, buttonclick: function (row) {


                            var valueId = $('#jqxgridDetil').jqxGrid('getcellvalue', row, 'trxd_currency_id');
                            $('.nav-tabs a[href="#tab_2_2"]').tab('show');

                            var sourceStok =
                            {
                                datatype: "json",
                                datafields: [
                                    { name: 'id' },
                                    { name: 'pecahan_id' },
                                    { name: 'qty' },
                                    { name: 'pecahan', type: 'INT' },
                                    { name: 'curname' }

                                ],
                                localdata: getPecahanTRX(valueId,0,$scope.pecahan)
                            };
                            var stokDA = new $.jqx.dataAdapter(sourceStok);

                            $("#jqxgridStok").jqxGrid(
                                {
                                    width: "100%",
                                    //source: stokService.initData(valueId),
                                    source: stokDA,
                                    columnsresize: true,
                                    editable: false,
                                    selectionmode: 'singlerow',
                                    columns: [
                                        { text: 'Mata Uang', displayfield: 'curname',width: 100,editable:false},
                                        { text: 'Pecahan', displayfield: 'pecahan',width: 100,editable:false},
                                        { text: 'QTY', displayfield: 'qty',width: 100,editable:false}
                                    ]
                                });

                        }
                    },
                    { text: 'Pecahan', displayfield: 'pecahan',width: 100,cellsformat: 'd', cellsalign: 'right',editable:false},
                    { text: 'PecahanID', hidden: 'true', displayfield: 'pecahanID',width: 100,cellsformat: 'd', cellsalign: 'right',editable:false},
                    { text: 'Harga Satuan', dataField: 'trxd_satuan', width: 100,cellsformat: 'd', cellsalign: 'right',
                        cellendedit:function (row, column, columntype, oldvalue, newvalue) {
                            var valueId = $('#jqxgridDetil').jqxGrid('getcellvalue', row, 'trxd_jumlah');
                            setTimeout(function () {
                                $("#jqxgridDetil").jqxGrid('setcellvalue', row, "trxd_total", valueId * newvalue);
                            }, 700);
                        }
                    },
                    { text: 'Jumlah', dataField: 'trxd_jumlah', width: 100,cellsformat: 'd', cellsalign: 'right',
                        cellendedit:function (row, column, columntype, oldvalue, newvalue) {
                            var curid = $('#jqxgridDetil').jqxGrid('getcellvalue', row, 'trxd_currency_id');
                            var pecahanid = $('#jqxgridDetil').jqxGrid('getcellvalue', row, 'pecahanID');
                            var foundstok = getPecahanTRX(curid,pecahanid,$scope.pecahan);
                            if ((newvalue<=foundstok[0].qty) || ($scope.trxh.trxh_tipe=="Beli")) {
                                var valueId = $('#jqxgridDetil').jqxGrid('getcellvalue', row, 'trxd_satuan');
                                setTimeout(function () {
                                    $("#jqxgridDetil").jqxGrid('setcellvalue', row, "trxd_total", valueId * newvalue);
                                }, 700);
                            } else return false;
                        }},
                    //{ text: 'Total', dataField: 'trxd_total', width: 150, editable:false, cellsformat: 'd', cellsalign: 'right',aggregates: ['sum'] },
                    { text: 'Total', dataField: 'trxd_total', width: 150, editable:false, cellsformat: 'd', cellsalign: 'right',
                        aggregates: [{ 'Total':
                            function (aggregatedValue, currentValue, column, record) {
                                //var total = currentValue * parseInt(record['trxd_jumlah']);
                                var av = aggregatedValue + parseInt(record['trxd_total']);;
                                $scope.trxh.trxh_total = av;
                                if ($scope.trxh.trxh_tipe=='Beli') {
                                    $scope.trxh.trxh_amount = av;
                                }
                                return av;
                            }
                        }]
                    },

                ]
            });



    }

    $scope.pilihStok = function(){
        var rowindexStok = $('#jqxgridStok').jqxGrid('getselectedrowindex');
        var cell = $('#jqxgridDetil').jqxGrid('getselectedcell');
        var rowindexTrxd = cell.rowindex;

        var stokID = $('#jqxgridStok').jqxGrid('getcellvalue', rowindexStok, 'id');
        var valuePecahan = $('#jqxgridStok').jqxGrid('getcellvalue', rowindexStok, 'pecahan');
        var valuePecahanID = $('#jqxgridStok').jqxGrid('getcellvalue', rowindexStok, 'pecahan_id');
        $("#jqxgridDetil").jqxGrid('setcellvalue', rowindexTrxd, "trxd_stok_id", stokID);
        $("#jqxgridDetil").jqxGrid('setcellvalue', rowindexTrxd, "pecahan", valuePecahan);
        $("#jqxgridDetil").jqxGrid('setcellvalue', rowindexTrxd, "pecahanID", valuePecahanID);
        $("#jqxgridDetil").jqxGrid('setcellvalue', rowindexTrxd, "trxd_jumlah", 0);
        $("#jqxgridDetil").jqxGrid('setcellvalue', rowindexTrxd, "trxd_total", 0);
        /*$scope.trxh.trxh_amount = 0;
        $scope.trxh.trxh_kembali = 0;
        $scope.trxh.trxh_total = 0;*/

        $('.nav-tabs a[href="#tab_2_1"]').tab('show');

    }

    $scope.addDataTrxd = function(){
        transaksiService.addedit('POST',$scope.trxh.id,0)
            .then (function(result){
            setTimeout(function () {
                $('#jqxgridDetil').jqxGrid('updatebounddata')
            }, 500);

        });
    }



    $scope.deleteDataTrxd = function(){
        var cell = $('#jqxgridDetil').jqxGrid('getselectedcell');
        var valueId = $('#jqxgridDetil').jqxGrid('getcellvalue', cell.rowindex, 'id');

        transaksiService.deleteData(valueId)
            .then (function(result){
            setTimeout(function () {
                $('#jqxgridDetil').jqxGrid('updatebounddata')
            }, 500);

        });
    }

    $scope.changeJenis = function(njenis){

        transaksiService.changeJenis($scope.trxh.id,njenis)
            .then (function(result){
            setTimeout(function () {
                $('#jqxgridDetil').jqxGrid('updatebounddata')
            }, 500);
            $scope.trxh.trxh_amount = 0;
            $scope.trxh.trxh_kembali = 0;

            if ($scope.trxh.trxh_tipe=='Beli')
                $scope.disabledTerimaSerah=true;
            else
                $scope.disabledTerimaSerah=false;
        });
    }

    function prepareTrx(){

        if (typeof $scope.nasabah.id!=="undefined") {
            if ($scope.trxh.mode == "Edit") {
                $scope.trxh.mode = "Edit";
                $scope.trxh.nama = $scope.nasabah.nama;
                $scope.trxh.trxh_nasab_id = $scope.nasabah.id;
                transaksiService.saveTrxh($scope.trxh);
                $scope.disableButtonTRX = true;
                if ($scope.trxh.trxh_tipe=='Beli')
                    $scope.disabledTerimaSerah=true;
                else
                    $scope.disabledTerimaSerah=false;
                prepareDetilTransaksi();
            } else {
                transaksiService.addtrxh_trxd($scope.nasabah.id)
                    .then(function (result) {
                        $scope.trxh = result.data.record[0];
                        $scope.trxh.trxh_tipe = 'Jual';
                        $scope.trxh.trxh_amount = 0;
                        $scope.trxh.trxh_kembali = 0;
                        $scope.trxh.mode = "Edit";
                        $scope.trxh.nama = $scope.nasabah.nama;
                        $scope.trxh.trxh_nasab_id = $scope.nasabah.id;
                        $scope.disableButtonTRX = true;
                        prepareDetilTransaksi();
                    });
            }
        }
    }

    $scope.addTrx = function () {
        $('.nav-tabs a[href="#tab_1_2"]').tab('show');

    }

    $scope.onBlur = function(ev){

        transaksiService.fetchNasab($scope.nasabah.idnasabah)
            .then(function (result) {

                if (result.data.length > 0) {
                    $scope.nasabah = result.data[0];
                    $scope.nasabah.resultbox = "Pencarian ditemukan";
                    $scope.disableForm = true;
                    $scope.disableButtonTRX = false;
                    showIDCopy();
                } else {
                    var idnasabahlama = $scope.nasabah.idnasabah;
                    $scope.nasabah = {
                        idnasabah : idnasabahlama
                    };
                    $scope.disableForm = false;
                    $scope.disableButtonTRX = true;
                    var elem = document.getElementById("IMGidcopy");
                    if (elem!==null) elem.remove();
                    $scope.nasabah.resultbox = "Pencarian tidak ditemukan, Segera isi data."
                }
            });


    }

    $scope.changeJumlah = function(){
        if ($scope.trxh.trxh_tipe=="Jual")
          $scope.trxh.trxh_kembali= $scope.trxh.trxh_amount - $scope.trxh.trxh_total;
        else
          $scope.trxh.trxh_kembali = 0;

    }

    $scope.saveClose = function(){
        transaksiService.saveTrxh($scope.trxh)
            .then (function(result){
            $modalInstance.dismiss();
            setTimeout(function () {
                $('#jqxgrid').jqxGrid('updatebounddata');
            }, 500);
        });
    }

    $scope.tabClick = function(idtab){

        if (idtab=="1_2"){

            prepareTrx();
        }

    }

    $scope.post = function() {
        transaksiService.saveTrxh($scope.trxh)
            .then (function(result) {
            transaksiService.postTRXH($scope.trxh.id)
                .then(function (result) {
                $modalInstance.dismiss();
                setTimeout(function () {
                    $('#jqxgrid').jqxGrid('updatebounddata');
                }, 500);
            });
        });

    }

    $scope.print = function(){
        transaksiService.saveTrxh($scope.trxh)
            .then (function(result) {
            $window.$scope = $scope;
            var //left = screen.width/2 - 400
                left = screen.width/2 - 400
                , top = screen.height / 2 - 250
                , popup = $window.open('#ptransaksi?hid=' + $scope.trxh.id, '', "top=" + top + ",left=" + left + ",width=1000,height=500")
                , interval = 1000;

        });


    }

    $scope.disabledTerimaSerah = function(){
        if ($scope.trxh.trxh_tipe=='Beli')
            return true;
        else
            return false;


    }



}
