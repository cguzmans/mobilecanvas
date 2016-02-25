function alerting(transaction, results){
    console.log(results);
    alert(results);
}
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

    .run(function ($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function () {
            
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {

                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                
                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            try {
                alert('appstart?');
                var db = $cordovaSQLite.openDB({
                    name: "marinaCanvas.db"
                });

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

alert("creating marina table ");
                    var q = sql.join('');
                    tx.executeSql(q, alerting, alerting);

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

                    q = sql.join('');

alert("creating vessel table ");

                    tx.executeSql(q, alerting, alerting);

                }, function (err) {
                                            alert(err);
                                        }, function (s) {
                                            alert(s);
                                        });

            } catch (error) {
                alert(error.message);
            }

        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider           
            
        // setup an abstract state for the tabs directive
            
            .state('tab', {
                url: '/home',
                abstract: true,
                templateUrl: 'templates/tab.menu.html',
            })

            .state('tab.home', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab.dash.html',
                    }
                }
            })

            .state('tab.filter', {
                url: '/filter',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/menu.filter.html',
                    }
                }
            })

            .state('tab.sync', {
                url: '/sync',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/menu.sync.html',
                        controller: 'SyncCtrl as vm',
                        controllerAs: 'vm',
                    }
                }
            })

        ;
        
        
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/home/dash');
    });
    