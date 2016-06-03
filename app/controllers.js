'use strict';

gaugeApp
    .controller('SiteCtrl', function($scope, BrandService, InteractionService, UserService, $linq)
    {
        $scope.data = {};
        $scope.data.brands;
        $scope.data.users;

        //Configuracao grafico por usuario
        $scope.chartInteractionPeerUser =
        {
            options: {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            //The below properties are watched separately for changes.

            //Series object (optional) - a list of series using normal Highcharts series options.
            series: [],
            //Title configuration (optional)
            title: {
                text: 'Total de iterações por usuário'
            },
            //Boolean to control showing loading status on chart (optional)
            //Could be a string if you want to show specific loading text.
            loading: false,
            //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
            //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
            xAxis: {
                title: {text: 'values'}
            },
            //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
            useHighStocks: false
        };

        //Configuracao grafico por tipo
        $scope.chartInteractionPeerType =
        {
            options: {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                chart: {
                    type: 'column'
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            //The below properties are watched separately for changes.

            //Series object (optional) - a list of series using normal Highcharts series options.
            series: [],
            //Title configuration (optional)
            title: {
                text: 'Total de iterações por tipo'
            },
            //Boolean to control showing loading status on chart (optional)
            //Could be a string if you want to show specific loading text.
            loading: false,
            //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
            //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
            xAxis: {
                title: {text: 'values'}
            },
            //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
            useHighStocks: false
        };

        //Cria lista de usuarios
        getUsers();

        //Cria lista com as marcas
        BrandService.getAll(function(brands)
        {
            $scope.data.brands = $linq.Enumerable().From(brands)
                .Select(function(x) {
                    return x
                })
                .OrderBy(function(x){
                    x.name
                })
                .Distinct()
                .ToArray()
        })

        //Evento quando selecionar uma marca
        $scope.selectedBrand = function(brand)
        {
            //Pega as interacoes filtrando pela marca e agrupando e contabilizando o total por usuario.
            InteractionService.getAll(function(interactions)
            {
                var dataBrandGroupUser = $linq.Enumerable().From(interactions)
                    .Where(function (x) {
                        return x.brand == brand.id
                    })
                    .GroupBy(function (x) {
                        return x.user
                    })
                    .Select(function (x) {
                        return  [x.Count(), x.source[0].user, x.source]
                    })
                    .Distinct()
                    .OrderByDescending(function(x){
                        return x
                    })
                    .ToArray()

                var series = {
                    data: [],
                    name: '',
                    description: ''
                };

                var brandPeerUser = {
                    total: 0,
                    user: null,
                    interaction: null
                }

                //Crio uma lista de objetos quantidade por usuario
                $scope.chartInteractionPeerUser.series = [];
                angular.forEach(dataBrandGroupUser, function(value, key)
                {
                    brandPeerUser             = {};
                    brandPeerUser.total       = value[0]; //total por usuario
                    brandPeerUser.user        = findUserById(value[1]); //objeto usuario
                    brandPeerUser.interaction = value[2]; //objeto interacao

                    series = {};
                    series.data = [brandPeerUser.total];
                    series.name = brandPeerUser.user.name.first;
                    series.description = brandPeerUser.interaction.text;

                    $scope.chartInteractionPeerUser.series.push(series);
                });

                var brandPeerType = {
                    total: 0,
                    type: '',
                    interaction: null
                }

                var dataBrandPeerType = $linq.Enumerable().From(interactions)
                    .Where(function (x) {
                        return x.brand == brand.id
                    })
                    .GroupBy(function (x) {
                        return x.type
                    })
                    .Select(function (x) {
                        return  [x.Count(), x.source[0].type, x.source]
                    })
                    .Distinct()
                    .OrderByDescending(function(x){
                        return x
                    })
                    .ToArray()

                //Crio uma lista de objetos quantidade por tipo
                $scope.chartInteractionPeerType.series = [];
                angular.forEach(dataBrandPeerType, function(value, key)
                {
                    brandPeerType             = {};
                    brandPeerType.total       = value[0]; //total por tipo
                    brandPeerType.type        = value[1]; //Tipo
                    brandPeerType.interaction = value[2]; //objeto interacao

                    series = {};
                    series.data = [brandPeerType.total];
                    series.name = brandPeerType.type;
                    series.description = brandPeerType.interaction.text;

                    $scope.chartInteractionPeerType.series.push(series);
                });

            })
        }

        //Cria lista com todos os usuarios
        function getUsers(){
            UserService.getAll(function(users)
            {
                $scope.data.users = users;
            })
        }

        //Recupera um unico objeto usuario pelo id
        function findUserById(id)
        {
            return $linq.Enumerable().From($scope.data.users)
                .Where(function (x) {
                    return x.id == id
                })
                .FirstOrDefault();
        }
    })