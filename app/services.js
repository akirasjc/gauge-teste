'use strict'

gaugeApp
    .factory('BrandService', function($http)
    {
        function getAll(callback) {
            $http({
                method: 'GET',
                url: baseURL + 'data/brands.json',
                cache:false,
                async: true,
                headers: {
                    'Content-Type': undefined
                }
            }).
            success(function(data) {
                callback(data);//your code when success
            }).
            error(function(data) {
                console.log("Error while making HTTP call.", data);
            });
        }

        return {
            getAll : getAll
        }
    })

    .factory('InteractionService', function($http)
    {
        function getAll(callback){
            $http({
                method: 'GET',
                url: baseURL + 'data/interactions.json',
                cache:false,
                async: true,
                headers: {
                    'Content-Type': undefined
                }
            }).
            success(function(data) {
                callback(data);//your code when success
            }).
            error(function(data) {
                console.log("Error while making HTTP call.", data);
            });
        }
        return {
            getAll : getAll
        }
    })

    .factory('UserService', function($http)
    {
        function getAll(callback)
        {
            $http({
                method: 'GET',
                url: baseURL + 'data/users.json',
                cache:false,
                async: true,
                headers: {
                    'Content-Type': undefined
                }
            }).
            success(function(data) {
                callback(data);//your code when success
            }).
            error(function(data) {
                console.log("Error while making HTTP call.", data);
            });
        }

        return {
            getAll : getAll
        }
    })