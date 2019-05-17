app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('league', {
        url: 'league/{seasonId}/{leagueId}/{leagueName}',
        controller: 'LeagueController',
        templateUrl: baseUrl('/modules/league/league.html')
    });
});