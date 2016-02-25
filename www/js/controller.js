// function alerting(transaction, results) {
//     console.log(results);
//     alert(results);
// }

angular.module('starter.controllers', [])
    .controller('AppCtrl', function ($ionicPlatform, $cordovaSQLite) {
        try {
            $ionicPlatform.ready(function () {
                try {
                    alert('appstart?');
                    var db = $cordovaSQLite.openDB({
                        name: "marinaCanvas.db"
                    });
                    var sql = [];

                    sql.push("CREATE TABLE IF NOT EXISTS wtsgMarinas ");
                    sql.push("( Id INTEGER PRIMARY KEY, ");
                    sql.push(" profileCode TEXT, ");
                    sql.push(" marinaName TEXT, ");
                    sql.push(" address1 TEXT, ");
                    sql.push(" address2 TEXT, ");
                    sql.push(" city TEXT, ");
                    sql.push(" zip TEXT, ");
                    sql.push(" phone TEXT, ");
                    sql.push(" mapView TEXT, ");
                    sql.push(" docMaster TEXT ");
                    sql.push(" );");

                    db.transaction(function (tx) {
                        tx.executeSql(sql.join());
                    });

                    sql = [];

                    sql.push("CREATE TABLE IF NOT EXISTS wtsgVessels ");
                    sql.push("vesselId INTEGER PRIMARY KEY, ");
                    sql.push(" marinaId INTEGER, ");
                    sql.push(" researchId INTEGER, ");
                    sql.push(" isNewBoat INTEGER, ");
                    sql.push(" slipNumber TEXT, ");
                    sql.push(" vesselName TEXT, ");
                    sql.push(" manufacturer TEXT, ");
                    sql.push(" account TEXT, ");
                    sql.push(" model TEXT, ");
                    sql.push(" vin TEXT, ");
                    sql.push(" inventoryDate TEXT, ");
                    sql.push(" originalInventoryDate TEXT, ");
                    sql.push(" bodyType TEXT, ");
                    sql.push(" recordType TEXT, ");
                    sql.push(" previousValue INTEGER, ");
                    sql.push(" hullMaterial TEXT, ");
                    sql.push(" length INTEGER, ");
                    sql.push(" remark1 TEXT, ");
                    sql.push(" remark2 TEXT, ");
                    sql.push(" remark3 TEXT, ");
                    sql.push(" condition TEXT, ");
                    sql.push(" rcYear INTEGER, ");
                    sql.push(" status TEXT, ");
                    sql.push(" isSlipPar INTEGER, ");
                    sql.push(" updatedDate TEXT ");

                    sql.push(" );");

                    db.transaction(function (tx) {
                        tx.executeSql(sql.join());
                    });



                } catch (error) {
                    alert(error.message);
                }
            });
        } catch (error) {
            alert(error.message);
        }
    })

    .controller('DeviceInfoCtrl', function ($ionicPlatform, $scope, $cordovaDevice) {

        try {
            var vm = this;

            $ionicPlatform.ready(function () {
                // getting device infor from $cordovaDevice
                var device = $cordovaDevice.getDevice();

                vm.manufacturer = device.manufacturer;
                vm.model = device.model;
                vm.platform = device.platform;
                vm.uuid = device.uuid;

            });
        } catch (error) {
            alert(error.message);
        }
    })

    .controller('NavCtrl', function ($scope, $stateParams, $ionicSideMenuDelegate) {
        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
    })

    .controller('zzSyncCtrl', function ($ionicPlatform, $scope, $cordovaSQLite, $sce) {
        $ionicPlatform.ready(function () {

            var vm = this;

            vm.localCount = 0;
            vm.remoteCount = 0;

            vm.Clear = function () {
                alert('clear');
            };
            vm.Download = function () {
                alert('download');
            };



            $scope.messages = '';


            var db = $cordovaSQLite.openDB({
                name: "demo.db"
            });

            $scope.messages = '';
            $scope.showMessage = function (msg) {
                $scope.messages += $sce.trustAsHtml('> ' + msg);
            };

            $scope.showMessage('<b>Opened new DB</b><br/>');

            db.transaction(function (tx) {
 
                // Drop demo_table if it exists 
                tx.executeSql('DROP TABLE IF EXISTS demo_table');
                $scope.showMessage('<b>Dropped exsiting demo_table</b><br/>');
 
                // create table 
                tx.executeSql('CREATE TABLE IF NOT EXISTS demo_table (id integer primary key, data text, data_num integer)');
                $scope.showMessage('<b>Created demo_table</b><br/>');

                $scope.showMessage('<b>Inserting Sample Data</b><br/>');
                // insert sample data
                tx.executeSql("INSERT INTO demo_table (data, data_num) VALUES (?,?)", ["demo", 100], function (tx, res) {

                    $scope.showMessage('&nbsp;&nbsp;&nbsp;insertId: ' + res.insertId + '<br/>');
                    $scope.showMessage('&nbsp;&nbsp;&nbsp;rowsAffected: ' + res.rowsAffected + '<br/>');

                });
            });

        });
    })

    .controller('SyncCtrl', function ($ionicPlatform, $cordovaNetwork, $cordovaSQLite, $rootScope, $scope, MarinasSvc) {
        $ionicPlatform.ready(
            function () {
                try {
                   // var vm = this;

                    $scope.localCount = 0;
                    $scope.remoteCount = 0;

                    var db = $cordovaSQLite.openDB({
                        name: "marinaCanvas.db"
                    });
                    db.transaction(function (tx) {
                        tx.executeSql("SELECT COUNT(Id) FROM wtsgMarinas", [], function (tx, results) {
                            $scope.remoteCount = results.rows.length;
                            alert("table length: " + $scope.remoteCount);
                        }, alerting, alerting);
                    }, function (err) {
                        alert(err);
                    }, function (s) {
                        alert(s);
                    });
                    
                    $scope.Clear = function () {
                        try {
                            alert('clearing');

                            //                             var sql = [];
                            //                             sql.push("DELETE FROM wtsgMarinas; ");
                            //                             sql.push(" DELETE FROM sqlite_sequence WHERE name ='wtsgMarinas'; ");
                            // 
                            //                             db.transaction(function (tx) {
                            //                                 tx.executeSql(sql.join());
                            //                             });
                            // 
                            //                             sql = [];
                            // 
                            //                             sql.push("DELETE FROM wtsgVessels; ");
                            //                             sql.push(" DELETE FROM sqlite_sequence WHERE name ='wtsgVessels'; ");
                            // 
                            //                             db.transaction(function (tx) {
                            //                                 tx.executeSql(sql.join());
                            //                             });

                        } catch (error) {
                            alert(error.message);
                        }
                    };

                    $scope.Download = function () {
                        try {
                            alert('downloading...');

                            MarinasSvc
                                .all()
                                .then(function (data) {
                                    alert('finished downloading');

                                    console.log(data);

                                    if ((data.length > 0) && (data[0].Id > 0)) {

                                        //now insert into the local database and see what happens
                                        
                                        db.transaction(function (tx) {
                                            var sql = [];

                                            sql.push("CREATE TABLE IF NOT EXISTS wtsgMarinas ");
                                            sql.push("( Id INTEGER PRIMARY KEY, ");
                                            sql.push(" profileCode TEXT, ");
                                            sql.push(" marinaName TEXT, ");
                                            sql.push(" address1 TEXT, ");
                                            sql.push(" address2 TEXT, ");
                                            sql.push(" city TEXT, ");
                                            sql.push(" zip TEXT, ");
                                            sql.push(" phone TEXT, ");
                                            sql.push(" mapView TEXT, ");
                                            sql.push(" docMaster TEXT ");
                                            sql.push(" );");

                                            var q = sql.join('');
                                            tx.executeSql(q, alerting, alerting);

                                            data.forEach(function (element) {
                                                sql = [];
                                                sql.push("INSERT INTO wtsgMarinas(Id, profileCode, marinaName, address1, address2, city, zip, phone, mapView, docMaster)");
                                                sql.push("VALUES (");
                                                sql.push(element.Id);
                                                sql.push(", '");
                                                sql.push(element.profileCode);
                                                sql.push("', '");
                                                sql.push(element.name);
                                                sql.push("', '");
                                                sql.push(element.address1);
                                                sql.push("', '");
                                                sql.push(element.address2);
                                                sql.push("', '");
                                                sql.push(element.city);
                                                sql.push("', '");
                                                sql.push(element.zip);
                                                sql.push("', '");
                                                sql.push(element.phone);
                                                sql.push("', '");
                                                sql.push(element.mapView);
                                                sql.push("', '");
                                                sql.push(element.docMaster);
                                                sql.push("'");
                                                sql.push(");");
                                            }, this);

                                            q = sql.join('');
                                            tx.executeSql(q, alerting, alerting);

                                            tx.executeSql("SELECT COUNT(Id) FROM wtsgMarinas", [], function (tx, results) {
                                                $scope.remoteCount = results.rows.length;
                                                alert("table length: " + $scope.remoteCount);
                                            }, alerting, alerting);


                                        }, function (err) {
                                            alert(err);
                                        }, function (s) {
                                            alert(s);
                                        });

                                    }
                                    //vm.remoteCount = data.length;
                                    alert(data.length);
                                })
                                .catch(function (error) {
                                    alert(error.message);
                                });


                        } catch (error) {
                            alert(error.message);
                        }
                    };

                    //                     document.addEventListener("deviceready", function () {
                    // 
                    //                         vm.networkType = $cordovaNetwork.getNetwork();
                    //                         vm.isOnline = $cordovaNetwork.isOnline();
                    //                         vm.isOffline = $cordovaNetwork.isOffline();
                    // 
                    //                         // listen for Online event
                    //                         $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    //                             console.log('The device has come online!', networkState);
                    //                             // Sync local data to your server here
                    //                         });
                    //  
                    //                         // listen for Offline event
                    //                         $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    //                             console.log('The device has gone offline!', networkState);
                    //                             // the device is offline, we need to store the data locally
                    //                         });
                    // 
                    //                     });


                } catch (error) {
                    alert(error.message);
                }

            });
    })

;