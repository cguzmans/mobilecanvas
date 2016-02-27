angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $stateParams, $ionicPlatform, LocalDbSvc) {

        try {
            var vm = this;
            vm.marinalist = [];
            vm.vessellist = [];

            $ionicPlatform.ready(function () {

                document.addEventListener("deviceready", function () {

                    LocalDbSvc.createTables().then(function (data) {
                        console.info(data);

                        LocalDbSvc.allMarinas().then(function (data) {
                            console.info("local marina list: " + data);
                            vm.marinalist = data;

                        }).catch(function (error) {
                            console.error(error);
                            alert(error);
                        });

                        LocalDbSvc.allVessels().then(function (data) {
                            console.info("local vessel list: " + data);
                            vm.vessellist = data;

                        }).catch(function (error) {
                            console.error(error);
                            alert(error);
                        });

                    }).catch(function (error) {
                        console.error(error);
                        alert(error);
                    });
                });

            });

        } catch (error) {
            alert(error);
        }
    })

    .controller('DeviceInfoCtrl', function ($rootScope, $ionicPlatform, $scope, $cordovaDevice, $cordovaNetwork, $cordovaBatteryStatus) {

        try {
            var vm = this;

            vm.manufacturer = "manufacturer";
            vm.model = "model";
            vm.platform = "platform";
            vm.uuid = "uuid";

            vm.networkType = "networktype";
            vm.isOnline = "isOnline";
            vm.isOffline = "isOffline";

            document.addEventListener("deviceready", function () {
                // getting device infor from $cordovaDevice
                var device = $cordovaDevice.getDevice();

                vm.manufacturer = device.manufacturer;
                vm.model = device.model;
                vm.platform = device.platform;
                vm.uuid = device.uuid;

                vm.networkType = $cordovaNetwork.getNetwork();
                vm.isOnline = $cordovaNetwork.isOnline();
                vm.isOffline = $cordovaNetwork.isOffline();
                    
                // listen for Online event
                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    console.log('The device has come online!', networkState);
                    // Sync local data to your server here
                    vm.isOnline = $cordovaNetwork.isOnline();
                    vm.isOffline = $cordovaNetwork.isOffline();
                });
                     
                // listen for Offline event
                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    console.log('The device has gone offline!', networkState);
                    // the device is offline, we need to store the data locally
                    vm.isOnline = $cordovaNetwork.isOnline();
                    vm.isOffline = $cordovaNetwork.isOffline();
                });

                $ionicPlatform.ready(function () {
                    // getting device infor from $cordovaDevice
                    var device = $cordovaDevice.getDevice();

                    vm.manufacturer = device.manufacturer;
                    vm.model = device.model;
                    vm.platform = device.platform;
                    vm.uuid = device.uuid;

                    vm.networkType = $cordovaNetwork.getNetwork();
                    vm.isOnline = $cordovaNetwork.isOnline();
                    vm.isOffline = $cordovaNetwork.isOffline();


                    //             // This code never worked on my Samsung Note III
                    $rootScope.$on('$cordovaBatteryStatus:status', function (result) {
                        $scope.$apply(function () {
                            // sometimes binding does not work! :/
             
                            vm.batteryLevel = result.level; // (0 - 100)
                            vm.isPluggedIn = result.isPlugged; // bool
                        });
                    });

                    $scope.onBatteryStatus = function (result) {
                        vm.batteryLevel = result.level; // (0 - 100)
                        vm.isPluggedIn = result.isPlugged; // bool
                    };

                });
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

    .controller('SyncCtrl', function ($ionicPlatform, $cordovaNetwork, $cordovaSQLite, $rootScope, $scope, MarinasSvc, VesselSvc, LocalDbSvc, $q) {

        var vm = this;

        vm.localCount = 0;
        vm.remoteCount = 0;
        vm.Clear = onClear;
        vm.Download = onDownload;

        vm.activate = activate;

        $scope.localCount = 0;
        $scope.remoteCount = 0;
        $scope.Clear = onClear;
        $scope.Download = onDownload;

        $scope.activate = activate;

        activate();

        function activate() {
            var promises = [getlocalcount(), getremotecount()];
            $q.all(promises).then(function (args) {
                //continue
            });
        }

        function getlocalcount() {
            return LocalDbSvc.getMarinaCount().then(function (data) {
                console.info("marina localcount" + data);
                $scope.localCount = data;
            }).catch(function (error) {
                console.error(error);
            });
        }

        function getremotecount() {
            return MarinasSvc.getCount().then(function (data) {
                console.info("marina server count " + data);
                $scope.remoteCount = data;
            }).catch(function (error) {
                console.error(error);
            });
        }

        function onClear() {
            try {
                LocalDbSvc.clearLocalDb().then(function (data) {
                    console.info("database cleared " + data);
                }).catch(function (error) {
                    console.error(error);
                });

            } catch (error) {
                alert(error.message);
            }
        }

        function onDownload() {
            try {
                //alert('downloading...');

                MarinasSvc
                    .all()
                    .then(function (data) {
                        //      alert('finished downloading');

                        console.info(data);

                        if ((data.length > 0) && (data[0].Id > 0)) {
                            //now insert into the local database and see what happens
                            LocalDbSvc.addMarinas(data).then(function (data) {
                                //get the new count
                                LocalDbSvc.getMarinaCount().then(function (data) {
                                    console.info(data);
                                    $scope.localCount = data;
                                }).catch(function (error) {
                                    console.error(error);
                                });
                            }).catch(function (error) {
                                console.error(error);
                            });
                        }
                    })
                    .catch(function (error) {
                        alert(error.message);
                    });

                VesselSvc
                    .all()
                    .then(function (data) {
                        //      alert('finished downloading');

                        console.info(data);

                        if ((data.length > 0)) {
                            //now insert into the local database and see what happens
                            LocalDbSvc.addVessels(data).then(function (data) {
                                console.info('vessels inserterd ' + data);
                            }).catch(function (error) {
                                console.error(error);
                            });
                        }
                    }, function (error) {
                         alert(error.message);
                    }, function(data){
                        //progress
                         if ((data.length > 0)) {
                            //now insert into the local database and see what happens
                            LocalDbSvc.addVessels(data).then(function (data) {
                                console.info('vessels inserterd ' + data);
                            }).catch(function (error) {
                                console.error(error);
                            });
                        }
                    })
                    .catch(function (error) {
                       alert(error.message);
                    });
            } catch (error) {
                alert(error.Message);
            }
        }

        function onVesselDownload() {
            try {

                VesselSvc
                    .all()
                    .then(function (data) {
                        //      alert('finished downloading');

                        console.info(data);

                        if ((data.length > 0) && (data[0].Id > 0)) {
                            //now insert into the local database and see what happens
                            LocalDbSvc.addVessels(data).then(function (data) {
                                //get the new count
                                
                            }).catch(function (error) {
                                console.error(error);
                            });
                        }
                    })
                    .catch(function (error) {
                        alert(error.message);
                    });
            } catch (error) {
                alert(error.message);
            }
        }

    })

;