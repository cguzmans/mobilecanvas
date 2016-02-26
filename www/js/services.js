angular.module('starter.services', [])

    .factory('MarinasSvc', ['$http', '$q', MarinasSvc])
    .factory('VesselSvc', ['$http', '$q', VesselSvc])
    .factory('LocalDbSvc', ['$ionicPlatform', '$cordovaSQLite', '$q', LocalDbSvc])
;

function LocalDbSvc($ionicPlatform, $cordovaSQLite, $q) {

    var commonQ = $q;
    var db;

    activate();

    function activate() {
        // $ionicPlatform.ready(function () {
        db = $cordovaSQLite.openDB({
            name: "marinaCanvas.db"
        });
        //});
    }

    var service = {
        createTables: _createTables,
        allMarinas: _getAllMarinas,
        allVessels: _getAllVessels,
        getMarina: _getMarina,
        getMarinaCount: _getMarinaCount,
        addMarinas: _addMarinas,
        addVessels: _addVessels,
        clearLocalDb: _clearLocalDb,
    };

    function nullHandler() {

    }
    function handleError(transaction, error) {
        console.error(error.message);
    }

    function _clearLocalMarinaTable() {
        var deferred = commonQ.defer();

        db.transaction(function (tx) {

            var q = 'DELETE FROM wtsgMarinas;';
            tx.executeSql(q, [],
                function (transaction, result) {
                    var results = result;

                    console.info("Delete wtsgMarina - success ");

                    deferred.resolve(results);

                    // tx.executeSql(" DELETE FROM sqlite_sequence WHERE name ='wtsgMarina'; ");
                },
                nullHandler,
                function (transaction, error) {
                    console.error("Delete wtsgMarina - error ");
                    console.error(error.message);
                    deferred.reject("Delete wtsgMarina - error: " + error.message);
                });
        }, function (err) {
            alert(err);
        }, function (s) {
            // alert(s);
        });

        return deferred.promise;
    }

    function _clearLocalVesselTable() {
        var deferred = commonQ.defer();

        db.transaction(function (tx) {

            var q = 'DELETE FROM wtsgVessels;';
            tx.executeSql(q, [],
                function (transaction, result) {
                    var results = result;

                    console.info("Delete wtsgVessels - success ");

                    deferred.resolve(results);

                    //  tx.executeSql(" DELETE FROM sqlite_sequence WHERE name ='wtsgVessels'; ");
                },
                nullHandler,
                function (transaction, error) {
                    console.log("Delete wtsgVessels - error ");
                    console.error(error.message);
                    deferred.reject("Delete wtsgVessels - error: " + error.message);
                });
        }, function (err) {
            alert(err);
        }, function (s) {
            // alert(s);
        });

        return deferred.promise;
    }

    function _createMarinaTable() {
        var deferred = commonQ.defer();

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

            // alert("creating marina table ");
            var q = sql.join('');
            tx.executeSql(q, [],
                function (transaction, result) {
                    var results = result;

                    console.info("Create wtsgMarina - success ");

                    deferred.resolve(results);
                },
                nullHandler,
                function (transaction, error) {
                    console.log("Create wtsgMarina - error ");
                    console.error(error.message);
                    deferred.reject("Create wtsgMarina - error: " + error.message);
                });
        }, function (err) {
            alert(err);
        }, function (s) {
            // alert(s);
        });

        return deferred.promise;
    }

    function _createVesselTable() {
        var deferred = commonQ.defer();

        db.transaction(function (tx) {
            var sql = [];

            sql.push("CREATE TABLE IF NOT EXISTS wtsgVessels ");
            sql.push("( vesselId INTEGER PRIMARY KEY, ");
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

            // alert("creating marina table ");
            var q = sql.join('');
            tx.executeSql(q, [],
                function (transaction, result) {
                    var results = result;

                    console.info("Create wtsgVessel - success ");

                    deferred.resolve(results);
                },
                nullHandler,
                function (transaction, error) {
                    console.log("Create wtsgVessel - error ");
                    console.error(error.message);
                    deferred.reject("Create wtsgVessel - error: " + error.message);
                });
        }, function (err) {
            alert(err);
        }, function (s) {
            // alert(s);
        });

        return deferred.promise;
    }

    function _clearLocalDb() {
        var deferred = commonQ.defer();

        try {
            _clearLocalMarinaTable()
                .then(function (data) {

                    _clearLocalVesselTable()
                        .then(function (data2) {
                            deferred.resolve(data2);
                        })
                        .catch(function (error2) {
                            console.error(error2.data);
                            deferred.reject("error: " + error2.data);
                        });

                }).catch(function (error) {
                    console.error(error.data);
                    deferred.reject("error: " + error.data);
                });

        } catch (error) {
            alert(error.message);
        }

        return deferred.promise;
    }

    function _createTables() {
        var deferred = commonQ.defer();

        try {
            _createMarinaTable()
                .then(function (data) {

                    _createVesselTable()
                        .then(function (data2) {
                            deferred.resolve(data2);
                        })
                        .catch(function (error2) {
                            console.error(error2.data);
                            deferred.reject("error: " + error2.data);
                        });

                }).catch(function (error) {
                    console.error(error.data);
                    deferred.reject("error: " + error.data);
                });

        } catch (error) {
            alert(error.message);
        }

        return deferred.promise;
    }

    function _addVessels(params) {
        var deferred = commonQ.defer();

        try {

            console.info("adding vessels" + params);
            if (params.length > 0) {

                db.transaction(function (tx) {
                    var sql = [];
                    var q = '';

                    params.forEach(function (element) {
                        sql = [];
                        sql.push(" INSERT INTO wtsgVessels(vesselId, marinaId, researchId, isNewBoat, slipNumber, vesselName, manufacturer, account, model, vin, inventoryDate, originalInventoryDate, bodyType, recordType, previousValue, hullMaterial, length, remark1, remark2, remark3, condition, rcYear, status, isSlipPar, updatedDate)");
                        sql.push(" VALUES (");
                        sql.push(element.vesselId);
                        sql.push(", '");
                        sql.push(element.marinaId);
                        sql.push("', '");
                        sql.push(element.researchId);
                        sql.push("', '");
                        sql.push(element.isNewBoat);
                        sql.push("', '");
                        sql.push(element.slipNumber);
                        sql.push("', '");
                        sql.push(element.vesselName);
                        sql.push("', '");
                        sql.push(element.manufacturer);
                        sql.push("', '");
                        sql.push(element.account);
                        sql.push("', '");
                        sql.push(element.model);
                        sql.push("', '");
                        sql.push(element.vin);
                        sql.push("', '");
                        sql.push(element.inventoryDate);
                        sql.push("', '");
                        sql.push(element.originalinventoryDate);
                        sql.push("', '");
                        sql.push(element.bodyType);
                        sql.push("', '");
                        sql.push(element.recordType);
                        sql.push("', '");
                        sql.push(element.previousValue);
                        sql.push("', '");
                        sql.push(element.hullMaterial);
                        sql.push("', '");
                        sql.push(element.length);
                        sql.push("', '");
                        sql.push(element.remark1);
                        sql.push("', '");
                        sql.push(element.remark2);
                        sql.push("', '");
                        sql.push(element.remark3);
                        sql.push("', '");
                        sql.push(element.condition);
                        sql.push("', '");
                        sql.push(element.rcYear);
                        sql.push("', '");
                        sql.push(element.status);
                        sql.push("', '");
                        sql.push(element.isSlipPar);
                        sql.push("', '");
                        sql.push(element.updatedDate);
                        sql.push("'");
                        sql.push("); ");

                        q = sql.join('');
                        tx.executeSql(q, [],
                            function (transaction, results) {
                                var result = results.rows.length;

                                console.info("wtsgVessels insert - " + result);

                                deferred.resolve(result);
                            },
                            nullHandler,
                            function (transaction, error) {
                                console.log("wtsgVessels insert - error ");
                                console.error(error.message);
                                deferred.reject("wtsgVessels insert - error: " + error.message);
                            });

                    }, this);
                }, function (err) {
                    alert(err);
                }, function (s) {
                    // alert(s);
                });

            }
        } catch (error) {
            alert(error.message);
        }

        return deferred.promise;
    }

    function _addMarinas(params) {
        var deferred = commonQ.defer();

        try {

            console.info("adding marinas" + params);
            if (params.length > 0) {

                db.transaction(function (tx) {
                    var sql = [];
                    var q = '';

                    params.forEach(function (element) {
                        sql = [];
                        sql.push(" INSERT INTO wtsgMarinas(Id, profileCode, marinaName, address1, address2, city, zip, phone, mapView, docMaster)");
                        sql.push(" VALUES (");
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
                        sql.push("); ");

                        q = sql.join('');
                        tx.executeSql(q, [],
                            function (transaction, results) {
                                var result = results.rows.length;

                                console.info("wtsgMarina insert - " + result);

                                deferred.resolve(result);
                            },
                            nullHandler,
                            function (transaction, error) {
                                console.log("wtsgMarina insert - error ");
                                console.error(error.message);
                                deferred.reject("wtsgMarina insert - error: " + error.message);
                            });

                    }, this);
                }, function (err) {
                    alert(err);
                }, function (s) {
                    // alert(s);
                });

            }
        } catch (error) {
            alert(error.message);
        }

        return deferred.promise;
    }

    function _getAllVessels() {
        var deferred = commonQ.defer();

        try {
            db.transaction(function (tx) {

                var q = "SELECT * FROM wtsgVessels";
                tx.executeSql(q, [],
                    function (transaction, results) {
                        var result = [];

                        for (var index = 0; index < results.rows.length; index++) {
                            var element = results.rows.item(index);
                            result.push(element);
                        }

                        console.info("wtsgVessels all - " + result);

                        deferred.resolve(result);
                    },
                    nullHandler,
                    function (transaction, error) {
                        console.error("wtsgVessels all - error ");
                        console.error(error.message);
                        deferred.reject("wtsgVessels all - error: " + error.message);
                    });
            }, function (err) {
                alert(err);
            }, function (s) {
                // alert(s);
            });

        } catch (error) {
            alert(error.message);
        }

        return deferred.promise;
    }
    function _getAllMarinas() {
        var deferred = commonQ.defer();

        try {
            db.transaction(function (tx) {

                var q = "SELECT * FROM wtsgMarinas";
                tx.executeSql(q, [],
                    function (transaction, results) {
                        var result = [];

                        for (var index = 0; index < results.rows.length; index++) {
                            var element = results.rows.item(index);
                            result.push(element);
                        }

                        console.info("wtsgMarina all - " + result);

                        deferred.resolve(result);
                    },
                    nullHandler,
                    function (transaction, error) {
                        console.error("wtsgMarina all - error ");
                        console.error(error.message);
                        deferred.reject("wtsgMarina all - error: " + error.message);
                    });
            }, function (err) {
                alert(err);
            }, function (s) {
                // alert(s);
            });

        } catch (error) {
            alert(error.message);
        }

        return deferred.promise;

    }

    function _getMarina(params) {

    }

    function _getMarinaCount() {
        var deferred = commonQ.defer();

        try {
            db.transaction(function (tx) {

                var q = "SELECT COUNT(Id) AS Total FROM wtsgMarinas";
                tx.executeSql(q, [],
                    function (transaction, results) {
                        var result = results.rows.item(0).Total;

                        console.info("wtsgMarina Count - " + result);

                        deferred.resolve(result);
                    },
                    nullHandler,
                    function (transaction, error) {
                        console.error("wtsgMarina Count - error ");
                        console.error(error.message);
                        deferred.reject("wtsgMarina Count - error: " + error.message);
                    });
            }, function (err) {
                alert(err);
            }, function (s) {
                // alert(s);
            });

        } catch (error) {
            alert(error.message);
        }

        return deferred.promise;
    }

    return service;
}

function VesselSvc($http, $q) {
    var commonQ = $q;

    activate();

    function activate() {

    }

    var service = {
        all: _getAllVessels,
        get: _getVessel,
        getCount: _getVesselCount,
    };

    function _getVesselCount() {
        var deferred = commonQ.defer();
        deferred.resolve(9);
        return deferred.promise;
    }

    function _getVessel(pi_id) {
        return 0;
    }

    function _getAllVessels() {
        var deferred = commonQ.defer();

        // var r =
        $http
            .post("http://10.10.16.87/mobile2/Home.aspx/GetVessels", { pi: '' })
            .then(function (data) {
                var l = JSON.parse(data.data.d);
                console.info("getAllVessels: ", l);
                deferred.resolve(l);
            })
            .catch(function (error) {
                alert(error.data);
                console.error(error.data);
                deferred.reject("error: " + error.data);
            });


        return deferred.promise;
    }
    return service;
}

function MarinasSvc($http, $q) {

    var commonQ = $q;

    activate();

    function activate() {

    }

    var service = {
        all: _getAllMarinas,
        get: _getMarina,
        getCount: _getMarinaCount,
    };

    function _getMarinaCount() {
        var deferred = commonQ.defer();
        deferred.resolve(9);
        // 
        //         
        //         $http
        //             .post("http://10.10.16.87/mobile2/Home.aspx/GetMarinaCount", { pi: '' })
        //             .then(function (data) {
        //                 var l = JSON.parse(data.data.d);
        //                 console.info("getMarinaCount: ", l);
        //                 deferred.resolve(l);
        //             })
        //             .catch(function (error) {
        //                 alert(error.data);
        //                 console.error(error.data);
        //                 deferred.reject("error: " + error.data);
        //             });
        // 
        return deferred.promise;
    }

    function _getAllMarinas() {
        var deferred = commonQ.defer();

        // var r =
        $http
            .post("http://10.10.16.87/mobile2/Home.aspx/GetMarinas", { pi: '' })
            .then(function (data) {
                var l = JSON.parse(data.data.d);
                console.info("getAllMarinas: ", l);
                deferred.resolve(l);
            })
            .catch(function (error) {
                alert(error.data);
                console.error(error.data);
                deferred.reject("error: " + error.data);
            });


        return deferred.promise;
    }

    function _getMarina(pi_id) {
        return 0;
    }

    return service;
}
