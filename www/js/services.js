angular.module('starter.services', [])

    .factory('MarinasSvc', ['$http', '$q', MarinasSvc])
    .factory('LocalDbSvc', ['$ionicPlatform', '$cordovaSQLite', '$q', LocalDbSvc])

    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
                id: 1,
                name: 'Max Lynx',
                lastText: 'Hey, it\'s me',
                face: 'img/max.png'
            }, {
                id: 2,
                name: 'Adam Bradleyson',
                lastText: 'I should buy a boat',
                face: 'img/adam.jpg'
            }, {
                id: 3,
                name: 'Perry Governor',
                lastText: 'Look at my mukluks!',
                face: 'img/perry.png'
            }, {
                id: 4,
                name: 'Mike Harrington',
                lastText: 'This is wicked good ice cream.',
                face: 'img/mike.png'
            }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    });

function LocalDbSvc($ionicPlatform, $cordovaSQLite, $q) {

    var commonQ = $q;
    var db;

    activate();

    function activate() {
        db = $cordovaSQLite.openDB({
            name: "marinaCanvas.db"
        });
    }

    var service = {
        createTables: _createTables,
        allMarinas: _getAllMarinas,
        getMarina: _getMarina,
        getMarinaCount: _getMarinaCount,
        addMarina: _addMarina,
    };

    function nullHandler() {

    }
    function handleError(transaction, error) {
        console.log(error.message);
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

                    console.log("Create wtsgMarina - success ");

                    deferred.resolve(results);
                },
                nullHandler,
                function (transaction, error) {
                    console.log("Create wtsgMarina - error ");
                    console.log(error.message);
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

                    console.log("Create wtsgVessel - success ");

                    deferred.resolve(results);
                },
                nullHandler,
                function (transaction, error) {
                    console.log("Create wtsgVessel - error ");
                    console.log(error.message);
                    deferred.reject("Create wtsgVessel - error: " + error.message);
                });
        }, function (err) {
            alert(err);
        }, function (s) {
            // alert(s);
        });

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
                            console.log(error2.data);
                            deferred.reject("error: " + error2.data);
                        });

                }).catch(function (error) {
                    console.log(error.data);
                    deferred.reject("error: " + error.data);
                });

        } catch (error) {
            alert(error.message);
        }

        return deferred.promise;
    }

    function _addMarina(params) {

    }

    function _getAllMarinas() {


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

                        console.log("wtsgMarina Count - " + result);

                        deferred.resolve(result);
                    },
                    nullHandler,
                    function (transaction, error) {
                        console.log("wtsgMarina Count - error ");
                        console.log(error.message);
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

function MarinasSvc($http, $q) {

    var commonQ = $q;

    activate();

    function activate() {

    }

    var service = {
        all: _getAllMarinas,
        get: _getMarina,
    };

    function _getAllMarinas() {
        var deferred = commonQ.defer();

        // var r =
        $http
            .post("http://10.10.16.87/mobile2/Home.aspx/GetMarinas", { pi: '' })
            .then(function (data) {
                var l = JSON.parse(data.data.d);
                console.log("getAllMarinas: ", l);
                deferred.resolve(l);
            })
            .catch(function (error) {
                alert(error.data);
                console.log(error.data);
                deferred.reject("error: " + error.data);
            });


        return deferred.promise;
    }

    function _getMarina(pi_id) {
        return 0;
    }

    return service;
}
