angular.module('starter.services', [])

    .factory('MarinasSvc', ['$http', '$q', MarinasSvc])

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
            });


        return deferred.promise;
    }

    function _getMarina(pi_id) {
        return 0;
    }

    return service;
}
