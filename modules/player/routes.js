'use strict'

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({ enabled: true, requireBase: false });
    $stateProvider.state('playersearch', {
        url: '/playersearch',
        controller: 'PSController',
        //template:'<h3>This is player template</h3>'
        templateUrl: baseUrl('/modules/playersearch/view/playersearch.html')
    });

    $stateProvider.state('player', {
        url: '/player/{pid}/{lastName}_{firstName}',
        // controller: 'PlayerSearchController1',
        //template:'<h3>This is player template</h3>',
        templateUrl: baseUrl('/modules/player/views/player_info1.html')
    });
    // $stateProvider.state('searchedplayer', {
    //     url: '/searchedplayer/{pid}/{lastName}_{firstName}',
    //     controller: 'PlayerSearchController1',
    //     //template:'<h3>This is player template</h3>',
    //     templateUrl: baseUrl('/modules/player/views/player_info1.html')
    // });
    //$urlRouterProvider.otherwise('/');
    //$locationProvider.html5Mode(true);
});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('players', {
        url: '/playersearch/players',
        controller: 'PSController',
        templateUrl: baseUrl('/modules/playersearch/view/players.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('player_comparison', {
        url: '/playersearch/player_comparison',
        controller: 'PSController',
        templateUrl: baseUrl('/modules/playersearch/view/player_comparison.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('player_rankings', {
        url: '/playersearch/player_rankings',
        controller: 'PSController',
        templateUrl: baseUrl('/modules/playersearch/view/player_rankings.html')
    });
});

