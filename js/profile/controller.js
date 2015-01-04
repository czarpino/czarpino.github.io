(function () {
    'use strict';

    angular.module('MyApp')
           .controller('Profile', Profile);

    /**
     * Initialize profile information from JSON.
     */
    function Profile($http) {

        /* jshint validthis: true */
        var vm = this;

        $http.get('/profile-data.json')
             .then(function(res){
                  vm.data = res.data;
             });
    }
})();
