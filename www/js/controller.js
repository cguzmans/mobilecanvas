angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $stateParams, $ionicPlatform, LocalDbSvc) {

        try {
            var vm = this;
            vm.marinalist = [];
            vm.vessellist = [];

            $ionicPlatform.ready(function () {

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

        } catch (error) {
            alert(error);
        }
    })

    .controller('DeviceInfoCtrl', function ($ionicPlatform, $scope, $cordovaDevice) {

        try {
            var vm = this;

            // getting device infor from $cordovaDevice
            var device = $cordovaDevice.getDevice();

            vm.manufacturer = device.manufacturer;
            vm.model = device.model;
            vm.platform = device.platform;
            vm.uuid = device.uuid;

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

            document.addEventListener("deviceready", function () {

                $scope.networkType = $cordovaNetwork.getNetwork();
                $scope.isOnline = $cordovaNetwork.isOnline();
                $scope.isOffline = $cordovaNetwork.isOffline();
                    
                // listen for Online event
                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    console.log('The device has come online!', networkState);
                    // Sync local data to your server here
                });
                     
                // listen for Offline event
                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    console.log('The device has gone offline!', networkState);
                    // the device is offline, we need to store the data locally
                });

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
                    })
                    .catch(function (error) {
                        alert(error.message);
                    });
            } catch (error) {
                alert(error.message);
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