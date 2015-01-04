(function () {
    'use strict';

    angular.module('MyApp')
           .controller('Profile', ['$http', Profile]);

    /**
     * Initialize profile information from JSON.
     */
    function Profile($http) {

        /* jshint validthis: true */
        var vm = this;

        $http.get('/profile-data.json')
             .then(function (response) { vm.data = response.data; });
    }
})();
