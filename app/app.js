'use strict';
var baseURL = "http://t4kira.com/gauge-teste/app/";

var gaugeApp = angular.module('gaugeApp', ['ngSanitize', 'highcharts-ng', 'ui.select', 'angular-linq']);

//filtro remover duplicados por uma propriedade
gaugeApp.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});