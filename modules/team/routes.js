app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('team', {
        url: '/team/{seasonId}/{leagueId}/{teamId}/{teamName}',
        controller: 'TeamController',
        templateUrl: baseUrl('/modules/team/views/team.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('teamSelect', {
        url: '/team/{seasonId}/{leagueId}/{teamId}/{teamName}/{seasonName}',
        controller: 'TeamController',
        templateUrl: baseUrl('/modules/team/views/team.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('leagueSelect', {
        url: '/league/{seasonId}/{leagueId}/{leagueName}',
        controller: 'LeagueController',
        templateUrl: baseUrl('/modules/league/league.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('game1', {
        url: '/game_1',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/live/game1/Game01.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('game2', {
        url: '/game_2',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/live/game2/Game02.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('game3', {
        url: '/game_3',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/live/game3/Game03.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('game4', {
        url: '/game_4',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/live/game4/Game04.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('game5', {
        url: '/game_5',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/live/game5/Game05.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('header', {
        url: '/demo',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/header/header.html')
    });
});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('uploadTool', {
        url: '/tools/uploadTool',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/uploadTool/UTView.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('premiumpsc', {
        url: '/Premium/player_stats_comparison',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/PlayerStatsComparisonAll/PlayerStatsComparisonAll.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('premiumptsc', {
        url: '/Premium/team_stats_comparison',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/TeamStatsComparisonAll/TeamStatsComparisonAll.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('premiumlsc', {
        url: '/Premium/league_stats_comparison',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/LeagueStatsComparison/LeagueStatsComparison.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('premiumpa', {
        url: '/Premium/player_analysis',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/PlayerAnalysis/PlayerAnalysis.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('S4uVideoPlayer', {
        url: '/tools/S4uVideoPlayer',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/tools/S4uVideoPlayer.html')
    });

});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('demo', {
        url: '/tools/demo_team',
        controller: 'HeaderController',
        templateUrl: baseUrl('/modules/tools/demo.html')
    });

});