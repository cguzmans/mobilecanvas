function alerting(transaction, results) {
    console.log(results);
    alert(results);
}
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova']);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            request: function (config) {
                config.timeOut = 1000;
                $rootScope.$broadcast('loading:show');
                return config;
            },
            response: function (response) {
                $rootScope.$broadcast('loading:hide');
                return response;
            },
            responseError: function (rejection) {
                switch (rejection.request) {
                    case 408:
                        console.log("Connection time out");
                        break;
                }
                return $q.reject(rejection);
            },
        };
    });
});


app.run(function ($ionicPlatform, $cordovaSQLite, $rootScope, $ionicLoading) {
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

        $rootScope.$on('loading:show', function () {
            $ionicLoading.show({
                template: 'loading...',
            });
        });

        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide();
        });
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
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab.dash.html',
                        controller: 'AppCtrl as vm',
                        controllerAs: 'vm',
                    }
                }
            })

            .state('tab.filter', {
                url: '/filter',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/menu.filter.html',
                        controller: 'DeviceInfoCtrl as vm',
                        controllerAs: 'vm',
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
    