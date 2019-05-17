app
    .factory('TeamService', ['$http', function ($http) {
        function request(currentUrl) {
            return {
                method: 'GET',
                url: currentUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + JSON.parse(sessionStorage.user).token,
                    // 'withCredentials': true
                }
            }
        }


        function onResponse(response) {
            return response.data;
        }

        function onError(response) {
            console.log("sorry, error!");
            return response.status;
        }

        return {
            getTeams: function (searchString) {
                return $http(request(APIBASEURL + '/teams/search/?name=' + searchString)).then(onResponse, onError);

            }
        }
    }])
    .factory('TeamInformation', ['$http', function ($http) {
        function request(currentUrl) {
            return {
                method: 'GET',
                url: currentUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + JSON.parse(sessionStorage.user).token,
                }
            }
        }

        function postRequest(currentUrl, data){
            return {
                method: 'POST',
                url: currentUrl,
                headers: {'Content-Type': 'application/json',
                    'Authorization':'JWT ' + JSON.parse(sessionStorage.user).token},
                    // 'withCredentials': true,
                data: data
            };
        }

        function patchRequest(currentUrl, data){
            return {
                method: 'PATCH',
                url: currentUrl,
                headers: {'Content-Type': 'application/json',
                    'Authorization':'JWT ' + JSON.parse(sessionStorage.user).token},
                    'withCredentials': true,
                data: data
            };
        }

        // function patchRequest(currentUrl, data){
        //     return new Promise( function(resolve,reject){
        //         var xhr = new XMLHttpRequest();
        //     xhr.open('PATCH', currentUrl);
        //     xhr.setRequestHeader('Content-Type', 'application/json');
        //     xhr.setRequestHeader('Authorization','JWT ' + JSON.parse(sessionStorage.user).token);
        //     xhr.onreadystatechange = function(){
        //         if (xhr.readyState != 4) return;
        //
        //         if (xhr.status != 200) {
        //             reject(xhr.status + ': ' + xhr.statusText);
        //         } else {
        //             resolve(xhr.responseText);
        //         }
        //     }
        //     xhr.send();
        //     });
        // }
        var params = {};

        function addTeamParams(seasonId, leagueId, teamId, teamName, logo, fullName, seasonName, leagueName, playerId) {
            params.teamName = teamName;
            params.teamId = teamId;
            params.seasonId = seasonId;
            params.leagueId = leagueId;
            params.logo = logo;
            params.seasonName = seasonName;
            params.leagueName = leagueName;
            params.fullName = fullName;
        }

        function getTeamParams() {
            return params;
        }


        function onResponse(response) {
            return response.data;
        }

        function onError(response) {
            console.log("sorry, error!");
            return response.status;
        }

        return {
            getRosterPlayer: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/players/')).then(onResponse, onError) ;
            },
            getRosterPlayerTab: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/players/?released=true')).then(onResponse, onError) ;
            },
            getResultTeam: function (teamId, seasonId, leagueId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId +  '/teams/' + teamId + '/results/' +'?leagues=' + leagueId)).then(onResponse, onError);
            },
            getGameStats: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/game_stats/')).then(onResponse, onError);
            },
            getAnalysis: function (seasonId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/teams/' + teamId + '/analysis/')).then(onResponse, onError)
            },
            getPlayersStat: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/players/stats/')).then(onResponse, onError)
            },
            getAllSeasons: function (teamId) {
                return $http(request(APIBASEURL + '/teams/' + teamId + '/')).then(onResponse, onError);
            },
            getTeamName: function (teamId) {
                return $http(request(APIBASEURL + '/teams/info/' + teamId + '/')).then(onResponse, onError);
            },
            getPointsChart: function (teamId, seasonId, leagueId) {
                return $http(request(APIBASEURL + '/stats/teams/' + teamId + '/team_stats/?season=' + seasonId + '&league=' + leagueId)).then(onResponse, onError)
            },
            getVideoGames: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/videos/')).then(onResponse, onError)
            },
            getBoxScore: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/stats/')).then(onResponse, onError)
            },
            getScoutReport: function (seasonId, leagueId, teamId) {
                return $http(postRequest(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId  + '/teams/' + teamId +  '/scout_report/')).then(onResponse, onError)
            },
            compareHead: function (seasonId, leagueId, teamId, typeComparison,comparedTeam) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId +'/leagues/'+ leagueId+ '/teams/' + teamId + '/team_comparison/'+typeComparison+'/?compared=' + comparedTeam)).then(onResponse, onError)
            },
            /*compareOffensive: function(seasonId, teamId){
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/teams/' + teamId + '/team_comparison/offensive_view/')).then(onResponse, onError)
            },
            compareDefensive: function(seasonId, teamId){
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/teams/' + teamId + '/team_comparison/defensive_view/')).then(onResponse, onError)
            },*/
            getVideoTeam: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/video/')).then(onResponse, onError)
            },
            getTeamsCompare: function (seasonId, leagueId , teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/'  +leagueId + '/teams/' + teamId + '/team_comparison/head_to_head/')).then(onResponse, onError)
            },
            getTeamForVideo:function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/players/')).then(onResponse, onError)
            },
            getTeamForVideoNew:function (gameId, teamId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/team/' + teamId + '/players/')).then(onResponse, onError)
            },
            getVideoForId: function(gameId){
                return $http(request(APIBASEURL + '/games/' + gameId + '/video/')).then(onResponse, onError)
            },
            getAllTeams: function () {
                return $http(request(APIBASEURL + '/video_editor/' + 'teams/' )).then(onResponse, onError)
            },
            getTeamGames: function (teamId) {
                return $http(request(APIBASEURL + '/video_editor/' + 'teams/' + teamId + '/games/')).then(onResponse, onError)
            },
            getAnalysisByQuarter: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/analytics/')).then(onResponse, onError)
            },
            getOffOrDeff: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/possessions/')).then(onResponse, onError)
            },
            getDeff: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/possessions/' + '?defensive=True')).then(onResponse, onError)
            },
            getStartersAndBench: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/starters_and_bench/')).then(onResponse, onError)
            },
            getAllTeamTagsAboutGame: function (gameId, teamId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/team_tags/' +'?team=' + teamId)).then(onResponse, onError)
            },
            getAllIndividualTagsAboutGame: function (gameId, teamId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/individual_tags/' +'?team=' + teamId)).then(onResponse, onError)
            },
            getBoxscoresInfo: function (gameId, teamId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/boxscore/'+'?team=' + teamId)).then(onResponse, onError)
            },
            getTeamTagsInfoForEachPlayers: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/boxscore_tags/')).then(onResponse, onError)
            },
            getOffensiveCombinationsByGame: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/offensive_team/')).then(onResponse, onError)
            },
            getDefensiveTeamCombinationsByGame: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/defensive_team/')).then(onResponse, onError)
            },
            getDefensiveCombinationByEachPlayer: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/defensive_players/')).then(onResponse, onError)
            },
            getOffensiveCombinationByEachPlayer: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/offensive_players/')).then(onResponse, onError)
            },
            getStatsTwoWinGames: function (seasonId, leagueId, teamId, gamesId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/players_stats/?games:' + gamesId + '/')).then(onResponse, onError)
            },
            getStatsTwoWinPlayerR: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/players_ranks/')).then(onResponse, onError)
            },
            getStatsTwoWinPlayerT: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/team_advanced/')).then(onResponse, onError)
            },
            getStatsTwoWinPlayerY: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/team_performance/')).then(onResponse, onError)
            },
            getStatsTwoWinPlayerI: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/customized_cska/')).then(onResponse, onError)
            },
            getTeamStatsTable: function(seasonId, leagueId){
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/')).then(onResponse, onError);
            },
            getTeamsForLogo: function (teamName) {
                return $http(request(APIBASEURL + '/teams/search/?name=' + teamName)).then(onResponse, onError);
            },
            getLastGameAndAverage: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/last_game_and_avg/')).then(onResponse, onError);
            },
            getTeamAdvancedCombined: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/team_advanced/?combined=true/')).then(onResponse, onError)
            },
            getPlayerStats: function (seasonId, leagueId, teamId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/players_stats/')).then(onResponse, onError)
            },
            getPlayerStatsByGames: function (seasonId, leagueId, teamId, gamesId) {
                return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/players_stats/?games=' + gamesId )).then(onResponse, onError)
            },
            getPlayerStatsByGamesNew: function (teamId, gamesId) {
                // console.log('getPlayerStatsByGamesNew',teamId, gamesId);
                return $http(postRequest(APIBASEURL + '/stats/teams/' + teamId + '/players_stats/' , { games: gamesId })).then(onResponse, onError);
            },
            getPlayerStatsCombined: function (seasonId, leagueId, teamId) {
            return $http(request(APIBASEURL + '/seasons/' + seasonId + '/leagues/' + leagueId + '/teams/' + teamId + '/stats2win/players_stats/?combined=true/')).then(onResponse, onError)
            },
            getPlayerStatsByGamesNewTendency: function (teamId, gamesId) {
                return $http(postRequest(APIBASEURL + '/stats/teams/' + teamId + '/players_stats/' , { games: gamesId })).then(onResponse, onError)
            },
            getPlayerStatsTendency: function (playerId, season, leagues, games) {
                // console.log('ids', playerId, 'season', season, 'leagues', leagues, 'games', games);
                return $http(postRequest(APIBASEURL + '/players/stats/' ,{players: playerId, season: season, leagues: leagues, games: games})).then(onResponse, onError);
            },
            getTendencyChartData: function (playerId, season, leagues, games) {
                /*console.log('ids', playerId);*/
                return $http(postRequest(APIBASEURL + '/video_editor/players/individual_tags/shots_analysis_by_position/',{players: playerId, season: season, leagues: leagues, games: games})).then(onResponse, onError);
            },
            // getTendencyShotChartData: function (playerId) {
            //     console.log('ids', playerId);
            //     return $http(postRequest(APIBASEURL + '/video_editor/players/individual_tags/shots_analysis_by_position/',{players: playerId})).then(onResponse, onError);
            // },
            getTestData: function (playerId, season, leagues, games) {
                return $http(postRequest(APIBASEURL + '/video_editor/players/individual_tags/shots_analysis/',{players: playerId, season: season, leagues: leagues, games: games})).then(onResponse, onError);
            },
            getGameStatsByGames: function (games, team) {
                return $http(postRequest(APIBASEURL + '/games/game_stats_by_games/',{games: games, team: team})).then(onResponse, onError);
            },
            getGameStatsByGamesa: function (games) {
                return $http(postRequest(APIBASEURL + '/games/all_info_about_games/',{games: games})).then(onResponse, onError);
            },
            getGameQuatersStats: function (gameId) {
                return $http(request(APIBASEURL + '/games/' + gameId + '/stats_by_quaters/')).then(onResponse, onError);
            },
            getGameStatsTeamTendency: function (games, team) {
                return $http(postRequest(APIBASEURL + '/games/team_tendency/',{games: games, team: team})).then(onResponse, onError);
            },
            addTeamParams: addTeamParams,
            getTeamParams: getTeamParams
        };
    }])
    .filter('orderObjectBy', function() {
    return function(items, field) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? -1 : 1);
        });
        return filtered;
    };

});
