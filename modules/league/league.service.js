app.factory('LeaguesService', function ($http) {
    function getResponse(currentUrl) {
        return {
            method: 'GET',
            url: currentUrl,
            headers: {'Content-Type': 'application/json','Authorization':'JWT ' + JSON.parse(sessionStorage.user).token}
        }
    }
    function getResp(currentUrl) {
        return {
            method: 'GET',
            url: currentUrl
            /*headers:{'Authorization':'JWT', 'Content-Type': 'application/json', 'WithCredentials': 'true', 'Access-Control-Allow-Origin': '*'}*/
            }
        };
    function errorCase(response) {
        console.log("sorry, error!");
        return response.status;
    }
    function successCase(response) {
        return response.data;
    }

    return {
        getMainPage: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + teamId + '/')).then(successCase, errorCase);
        },
        getAllTeams: function(seasonId, teamId){
        return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/'+   teamId + '/all_games/')).then(successCase, errorCase);
        },
        getResults: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/results/')).then(successCase, errorCase);
        },
        getOldStats: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/stats/')).then(successCase, errorCase);
        },
        getStats: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/stats_with_opponents/')).then(successCase, errorCase);
        },
        getStatsHome: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/stats_with_opponents/?home=true')).then(successCase, errorCase);
        },
        getStatsAway: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/stats_with_opponents/?away=true')).then(successCase, errorCase);
        },
        getStatsWon: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/stats_with_opponents/?won=true')).then(successCase, errorCase);
        },
        getStatsLose: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/stats_with_opponents/?lose=true')).then(successCase, errorCase);
        },
        getTeams: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/teams/')).then(successCase, errorCase);
        },
        getPlayers: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/players/')).then(successCase, errorCase);
        },
        getLeaders: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/seasons/'+ seasonId + '/leagues/' + teamId + '/leaders/')).then(successCase, errorCase);
        },
        getVideo: function(seasonId, teamId){
            return $http(getResponse(APIBASEURL + '/videos/?season=' + seasonId + '&league=' + teamId)).then(successCase, errorCase);
        },
        getSeasons: function(leagueId){
            return $http(getResponse(APIBASEURL + '/leagues/' + leagueId + '/seasons/')).then(successCase, errorCase);
        },
        getPlayerData: function (playerId) {
            return $http(getResponse(APIBASEURL +  '/players/' + playerId +'/')).then(successCase,errorCase);
        },
        getLeagues: function (leagueId) {
            return $http(getResponse(APIBASEURL +  '/leagues/' + leagueId + '/')).then(successCase,errorCase);
        },
        getTeamRanks: function (seasonId, leagueId) {
            return $http(getResponse(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams_ranks/')).then(successCase,errorCase);
        },
        getIp: function () {
            return $http(getResp('https://api.ipify.org?format=json')).then(successCase, errorCase);
        },
        getCountry: function (ip) {
            return $http(getResp('https://freegeoip.net/json/' + ip)).then(successCase, errorCase);
        }
    }
});

app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? -1 : 1);
        });
        console.log(filtered);
        if(reverse) filtered.reverse();
        return filtered;
    };
});