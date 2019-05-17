app.controller('LeagueController',['$scope','LeaguesService','headerService','$compile','$sce','$timeout','TeamInformation', '$rootScope','PlayerSearchService','$location', '$window',
    function ($scope, LeaguesService, headerService, $compile, $sce, $timeout,  TeamInformation,
                                             $rootScope, PlayerSearchService, $location, $window){
    function parse(path) {
        path = path.slice(8);
        var tempArr = path.split('/');
        return {
            logo: '',
            seasonId: tempArr[0],
            id: tempArr[1],
            name: tempArr[2].replace(/_/g, ' ')
        };
    }
    $scope.openMenu = function () {
        $(".dropdown-content").toggle();
    };
    $scope.hideObj = function () {
        setTimeout(function () {
            $(".dropdown-content").hide("slow");
        }, 300);
    };
    $scope.tableParams = parse(window.location.pathname);
    $scope.leagueId = $scope.tableParams.id;
    $scope.seasonId = {
        id: $scope.tableParams.seasonId
    };
    $scope.leagueName = $scope.tableParams.name;


        $scope.print = function () {
            text = $(".comparison").html();
            print(text);
        };

    //onload data
    LeaguesService.getMainPage($scope.seasonId.id, $scope.leagueId)
        .then(function(responseData) {
        $scope.tableMainPageData = responseData;
        $scope.showTeamsTable();//it needed for the link to teams
    })
        .then(LeaguesService.getLeaders($scope.seasonId.id, $scope.leagueId).then(function(responseData) {
            $scope.tableLeadersData = responseData;

            $scope.tableLeadersData['2PA'] = $scope.tableLeadersData['2PA'].sort(function(a,b){return b.p2_attempts - a.p2_attempts});
            $scope.tableLeadersData['2PM'] = $scope.tableLeadersData['2PM'].sort(function(a,b){return b.p2_made - a.p2_made});
            $scope.tableLeadersData['2P_PERCENT'] = $scope.tableLeadersData['2P_PERCENT'].sort(function(a,b){return b.p2_percent - a.p2_percent});
            $scope.tableLeadersData['3PA'] = $scope.tableLeadersData['3PA'].sort(function(a,b){return b.p3_attempts - a.p3_attempts});
            $scope.tableLeadersData['3PM'] = $scope.tableLeadersData['3PM'].sort(function(a,b){return b.p3_made - a.p3_made});
            $scope.tableLeadersData['3P_PERCENT'] = $scope.tableLeadersData['3P_PERCENT'].sort(function(a,b){return b.p3_percent - a.p3_percent});
            $scope.tableLeadersData['AS'] = $scope.tableLeadersData['AS'].sort(function(a,b){return b.assists - a.assists});
            $scope.tableLeadersData['BS'] = $scope.tableLeadersData['BS'].sort(function(a,b){return b.block_shots - a.block_shots});
            $scope.tableLeadersData['DR'] = $scope.tableLeadersData['DR'].sort(function(a,b){return b.df_rebounds - a.df_rebounds});
            $scope.tableLeadersData['FGA'] = $scope.tableLeadersData['FGA'].sort(function(a,b){return b.fg_attempts - a.fg_attempts});
            $scope.tableLeadersData['FGM'] = $scope.tableLeadersData['FGM'].sort(function(a,b){return b.fg_made - a.fg_made});
            $scope.tableLeadersData['FG_PERCENT'] = $scope.tableLeadersData['FG_PERCENT'].sort(function(a,b){return b.fg_percent - a.fg_percent});
            $scope.tableLeadersData['FM'] = $scope.tableLeadersData['FM'].sort(function(a,b){return b.fouls_made - a.fouls_made});
            $scope.tableLeadersData['FR'] = $scope.tableLeadersData['FR'].sort(function(a,b){return b.fouls_received - a.fouls_received});
            $scope.tableLeadersData['FTA'] = $scope.tableLeadersData['FTA'].sort(function(a,b){return b.ft_attempts - a.ft_attempts});
            $scope.tableLeadersData['FTM'] = $scope.tableLeadersData['FTM'].sort(function(a,b){return b.ft_made - a.ft_made});
            $scope.tableLeadersData['FT_PERCENT'] = $scope.tableLeadersData['FT_PERCENT'].sort(function(a,b){return b.ft_percent - a.ft_percent});
            $scope.tableLeadersData['OER'] = $scope.tableLeadersData['OER'].sort(function(a,b){return b.oer - a.oer});
            $scope.tableLeadersData['OR'] = $scope.tableLeadersData['OR'].sort(function(a,b){return b.of_rebounds - a.of_rebounds});
            $scope.tableLeadersData['PTS'] = $scope.tableLeadersData['PTS'].sort(function(a,b){return b.points - a.points});
            $scope.tableLeadersData['ST'] = $scope.tableLeadersData['ST'].sort(function(a,b){return b.steals - a.steals});
            $scope.tableLeadersData['TO'] = $scope.tableLeadersData['TO'].sort(function(a,b){return b.turnovers - a.turnovers});
            $scope.tableLeadersData['TR'] = $scope.tableLeadersData['TR'].sort(function(a,b){return b.tr - a.tr});
            $scope.tableLeadersData['VAL'] = $scope.tableLeadersData['VAL'].sort(function(a,b){return b.val - a.val});
            $scope.tableLeadersData['VIR'] = $scope.tableLeadersData['VIR'].sort(function(a,b){return b.vir - a.vir});


        }))
        .then(LeaguesService.getAllTeams($scope.seasonId.id, $scope.leagueId)
            .then(function (responseData) {
            function customSort(data) {
                var sortedTeamsData = {};

                $scope.resultsCount = 0;

                sortedTeamsData[data[0].game_step_name] = [];
                sortedTeamsData[data[0].game_step_name].push(data[0]);
                for (var key in sortedTeamsData) {
                    for (var i = 1; i < data.length; i++) {
                        if (key === data[i].game_step_name) {
                            sortedTeamsData[key].push(data[i]);
                        }
                        else {
                            if (!sortedTeamsData[data[i].game_step_name]) {
                                sortedTeamsData[data[i].game_step_name] = [];
                            }
                            sortedTeamsData[data[i].game_step_name].push(data[i]);
                        }
                    }
                }
                for (key in sortedTeamsData) {
                    sortedTeamsData[key] = sortedTeamsData[key].slice(0, 10);
                    $scope.resultsCount += sortedTeamsData[key].length;
                }

                return sortedTeamsData;
            }
            $scope.allTeamsData = customSort(responseData);
        })
            .then(function () {
                $scope.carouselGameResult = {};
                var arrGame = [];
                for (var keyGame in $scope.allTeamsData) {
                    var number = Number($scope.allTeamsData[keyGame][0].game_step_id);
                    arrGame.push(number);
                }
                arrGame.sort((a,b) => new Date(a.game_date) - new Date(b.game_date));
                for (var i = 0; i < arrGame.length; i++) {
                    for (var keyGame1 in $scope.allTeamsData) {
                        if ($scope.allTeamsData[keyGame1][0].game_step_id === arrGame[i]) {
                            $scope.carouselGameResult[keyGame1] = $scope.allTeamsData[keyGame1];
                            break;
                        }
                    }
                }
                var temp = {};
                var counter = 0;
                for(var v in $scope.carouselGameResult) {
                    temp[v] = [];
                    for (var i = 0; i< $scope.carouselGameResult[v].length; i++) {
                        if(counter < 20) {
                            temp[v].push($scope.carouselGameResult[v][i]);
                            counter ++;
                        }
                        else
                            break;
                    }
                }
            })
        )
        .then(LeaguesService.getSeasons($scope.leagueId).then(function (responseData) {
            $scope.seasonsData = [];
            var seasonsTempData = _.sortBy(responseData, 'id').reverse().slice();

            if($rootScope.isAdmin || $rootScope.goldSubscription) {
                $scope.seasonsData = seasonsTempData.slice();
            } else {
                var accessibleSeasons = [];
                for(var i = 0; i < $rootScope.accessibleLeagues.length; i++ ) {
                    if($rootScope.accessibleLeagues[i].leagueId == $scope.leagueId) {
                        accessibleSeasons.push($rootScope.accessibleLeagues[i].seasonId);
                    }
                }
                for(var i = 0; i < seasonsTempData.length; i++ ) {
                    if(accessibleSeasons.includes(seasonsTempData[i].id)) {
                        $scope.seasonsData.push(seasonsTempData[i]);
                    }
                }
            }
            for (var i = 0; i < $scope.seasonsData.length; i++) {
                if ($scope.seasonsData[i].id == $scope.seasonId.id) {
                    $scope.correctCurrentSeasonName = $scope.seasonsData[i]['name'];
                    break;
                }
            }
        }))
        .then(function() {
            setTimeout(
                function () {
                    $(".league-table").fadeIn(1000)
                },
                0
            );
            $(".loader-container").fadeOut(500);

        });

        $scope.$on('$viewContentLoaded', function(){
            if(!$rootScope.selectedTabLeague) {
                $timeout(function () {
                    $scope.selectedTabLeague = 'Main';
                    $('#home').addClass('active');
                    $('#lihome').addClass('active');
                },1000);
            } else {
                $('#home').removeClass('active');
                $('#lihome').removeClass('active');
                if($rootScope.selectedTabLeague === 'Results') {
                    $scope.getResult();
                    addClasse('#menu1');
                } else if ($rootScope.selectedTabLeague === 'Main') {
                    addClasse('#home');
                }else if ($rootScope.selectedTabLeague === 'Stats') {
                    $timeout(function () {
                        $scope.showStatsTable();
                        addClasse('#menu2');
                    },1000);
                } else if ($rootScope.selectedTabLeague === 'Team Ranks') {
                    $timeout(function () {
                        $scope.teamRanksTable();
                        addClasse('#menu7');
                    },1500);
                } else if ($rootScope.selectedTabLeague === 'Teams') {
                    $timeout(function () {
                        $scope.showTeamsTable();
                        addClasse('#menu3');
                    },1000);
                } else if ($rootScope.selectedTabLeague === 'Players') {
                    $scope.showPlayersTable();
                    addClasse('#menu4');
                } else if ($rootScope.selectedTabLeague === 'Leaders') {
                    addClasse('#menu5');
                } else if ($rootScope.selectedTabLeague === 'Watch Video') {
                    $scope.showVideo();
                    addClasse('#menu6');
                }else if ($rootScope.selectedTabLeague === 'Premium') {
                    addClasse('#menu8');
                }
                    $rootScope.selectedTabTeam = null;
            }
            function addClasse(tabName) {
                var id = '#li' + tabName.substr(1);
                $(tabName).addClass('in');
                $(tabName).addClass('active');
                $(id).addClass('active');
            }
        });

        $scope.selectTab = function (tabName) {
            $scope.selectedTabLeague = tabName;
            $rootScope.selectedTabLeague = tabName;
        };


    //tab data binding
    $scope.changeStatsTableData = function(value) {
        switch(value) {
            case 'all' :
                $scope.tableStatsData = $scope.defaultTableStatsData;
                $scope.tableStatsDataOp = $scope.defaultTableStatsDataOp;
                break;
            case 'home' :
                $scope.tableStatsData = $scope.tableStatsDataHome;
                $scope.tableStatsDataOp = $scope.tableStatsDataHomeOp;
                break;
            case 'away' :
                $scope.tableStatsData = $scope.tableStatsDataAway;
                $scope.tableStatsDataOp = $scope.tableStatsDataAwayOp;
                break;
            case 'won' :
                $scope.tableStatsData = $scope.tableStatsDataWon;
                $scope.tableStatsDataOp = $scope.tableStatsDataWonOp;
                break;
            case 'lose' :
                $scope.tableStatsData = $scope.tableStatsDataLose;
                $scope.tableStatsDataOp = $scope.tableStatsDataLoseOp;
                break;
            default:
                break;
        }
    };
    $scope.showStatsTable = function(){
        /*LeaguesService.getOldStats($scope.seasonId.id, $scope.leagueId).then(function(responseData) {
            $scope.oldTableStatsDataHome = responseData;
        });*/
        LeaguesService.getStats($scope.seasonId.id, $scope.leagueId).then(function(responseData) {
            $scope.defaultTableStatsData = addStatsData(responseData);
            $scope.defaultTableStatsDataOp = addStatsDataOp(responseData);

            //addStatsData($scope.defaultTableStatsDataOp, $scope.defaultTableStatsData);
            $scope.tableStatsData = $scope.defaultTableStatsData;
            $scope.tableStatsDataOp = $scope.defaultTableStatsDataOp;
        });
        LeaguesService.getStatsHome($scope.seasonId.id, $scope.leagueId).then(function(responseData) {
            $scope.tableStatsDataHome = addStatsData(responseData);
            $scope.tableStatsDataHomeOp = addStatsDataOp(responseData);
            //addStatsData($scope.tableStatsDataHomeOp, $scope.tableStatsDataHome);
        });
        LeaguesService.getStatsAway($scope.seasonId.id, $scope.leagueId).then(function(responseData) {
            $scope.tableStatsDataAway = addStatsData(responseData);
            $scope.tableStatsDataAwayOp = addStatsDataOp(responseData);
            //addStatsData($scope.tableStatsDataAwayOp, $scope.tableStatsDataAway);
        });
        LeaguesService.getStatsWon($scope.seasonId.id, $scope.leagueId).then(function(responseData) {
            $scope.tableStatsDataWon = addStatsData(responseData);
            $scope.tableStatsDataWonOp = addStatsDataOp(responseData);
            //addStatsData($scope.tableStatsDataWonOp, $scope.tableStatsDataWon);
        });
        LeaguesService.getStatsLose($scope.seasonId.id, $scope.leagueId).then(function(responseData) {
            $scope.tableStatsDataLose = addStatsData(responseData);
            $scope.tableStatsDataLoseOp = addStatsDataOp(responseData);
            //addStatsData($scope.tableStatsDataLoseOp, $scope.tableStatsDataLose);
        });
        //this function is needed for preventing calculations of some stats values(as percents and tr) in the view
        function addStatsData(param1) {
            var param = param1.slice();
            for(var key in param) {
                param[key]['fgp'] = (param[key].fg_made / param[key].fg_attempts) * 100;
                param[key]['p3p'] = (param[key].p3_made / param[key].p3_attempts) * 100;
                param[key]['p2p'] = (param[key].p2_made / param[key].p2_attempts) * 100;
                param[key]['ftp'] = (param[key].ft_made / param[key].ft_attempts) * 100;
                param[key]['tr'] = (param[key].of_rebounds + param[key].df_rebounds);
            }
            return param;
        }
        function addStatsDataOp(paramOp1) {
            var paramOp = JSON.parse(JSON.stringify(paramOp1));
            for(var key in paramOp) {
                paramOp[key]['fgp'] = (paramOp[key].op_fg_made / paramOp[key].op_fg_attempts) * 100;
                paramOp[key]['p3p'] = (paramOp[key].op_p3_made / paramOp[key].op_p3_attempts) * 100;
                paramOp[key]['p2p'] = (paramOp[key].op_p2_made / paramOp[key].op_p2_attempts) * 100;
                paramOp[key]['ftp'] = (paramOp[key].op_ft_made / paramOp[key].op_ft_attempts) * 100;
                paramOp[key]['tr'] = (paramOp[key].op_of_rebounds + paramOp[key].op_df_rebounds);
            }
            return paramOp;
        }
    };

    $scope.statsSortObj = {
        team_name: false,
        gp: false,
        won: false,
        pts: false,
        fgm: false,
        fga: false,
        fgp: false,
        '3pm': false,
        '3pa': false,
        '3pp': false,
        '2pm': false,
        '2pa': false,
        '2pp': false,
        ftm: false,
        fta: false,
        ftp: false,
        or: false,
        dr: false,
        tr: false,
        as: false,
        to: false,
        st: false,
        bs: false,
        fm: false,
        fr: false
    }
    $scope.statsSort = function (param) {
        $scope.statsSortObj[param] = true;
        for(var key in $scope.statsSortObj) {
            if(key != param) {
                $scope.statsSortObj[key] = false;
            }
        }
        switch (param) {
            case 'team_name':
                $scope.statsSortParam = 'team_name';
                $scope.statsSortParamOp = 'team_name';
                break;
            case 'gp':
                $scope.statsSortParam = 'games_played';
                $scope.statsSortParamOp = 'games_played';
                break;
            case 'won':
                $scope.statsSortParam = 'won';
                $scope.statsSortParamOp = 'won';
                break;
            case 'pts':
                $scope.statsSortParam = 'points';
                $scope.statsSortParamOp = 'op_points';
                break;
            case 'fgm':
                $scope.statsSortParam = 'fg_made';
                $scope.statsSortParamOp = 'op_fg_made';
                break;
            case 'fga':
                $scope.statsSortParam = 'fg_attempts';
                $scope.statsSortParamOp = 'op_fg_attempts';
                break;
            case 'fgp':
                $scope.statsSortParam = 'fgp';
                $scope.statsSortParamOp = 'fgp';
                break;
            case '3pm':
                $scope.statsSortParam = 'p3_made';
                $scope.statsSortParamOp = 'op_p3_made';
                break;
            case '3pa':
                $scope.statsSortParam = 'p3_attempts';
                $scope.statsSortParamOp = 'op_p3_attempts';
                break;
            case '3pp':
                $scope.statsSortParam = 'p3p';
                $scope.statsSortParamOp = 'p3p';
                break;
            case '2pm':
                $scope.statsSortParam = 'p2_made';
                $scope.statsSortParamOp = 'op_p2_made';
                break;
            case '2pa':
                $scope.statsSortParam = 'p2_attempts';
                $scope.statsSortParamOp = 'op_p2_attempts';
                break;
            case '2pp':
                $scope.statsSortParam = 'p2p';
                $scope.statsSortParamOp = 'p2p';
                break;
            case 'ftm':
                $scope.statsSortParam = 'ft_made';
                $scope.statsSortParamOp = 'op_ft_made';
                break;
            case 'fta':
                $scope.statsSortParam = 'ft_attempts';
                $scope.statsSortParamOp = 'op_ft_attempts';
                break;
            case 'ftp':
                $scope.statsSortParam = 'ftp';
                $scope.statsSortParamOp = 'ftp';
                break;
            case 'or':
                $scope.statsSortParam = 'of_rebounds';
                $scope.statsSortParamOp = 'op_of_rebounds';
                break;
            case 'dr':
                $scope.statsSortParam = 'df_rebounds';
                $scope.statsSortParamOp = 'op_df_rebounds';
                break;
            case 'tr':
                $scope.statsSortParam = 'tr';
                $scope.statsSortParamOp = 'tr';
                break;
            case 'as':
                $scope.statsSortParam = 'assists';
                $scope.statsSortParamOp = 'op_assists';
                break;
            case 'to':
                $scope.statsSortParam = 'turnovers';
                $scope.statsSortParamOp = 'op_turnovers';
                break;
            case 'st':
                $scope.statsSortParam = 'steals';
                $scope.statsSortParamOp = 'op_steals';
                break;
            case 'bs':
                $scope.statsSortParam = 'block_shots';
                $scope.statsSortParamOp = 'op_block_shots';
                break;
            case 'fm':
                $scope.statsSortParam = 'fouls_made';
                $scope.statsSortParamOp = 'op_fouls_made';
                break;
            case 'fr':
                $scope.statsSortParam = 'fouls_received';
                $scope.statsSortParamOp = 'op_fouls_received';
                break;
            default:
                break;
        }

        if($scope.statsSortCount == 0) {
            $scope.firstSortParam = param;
        } else if(param != $scope.firstSortParam) {
            $scope.firstSortParam = param;
            $scope.statsSortCount = 0;
        }

        if($scope.statsSortCount == 1) {
            var temp = '-' + $scope.statsSortParam;
            var tempOp = '-' + $scope.statsSortParamOp;
            $scope.statsSortParam = temp;
            $scope.statsSortParamOp = tempOp;
        } else if($scope.statsSortCount == 2) {
            $scope.statsSortCount = 0;
            $scope.statsSortParam = '-won';
            $scope.statsSortParamOp = '-won';
            $scope.statsSortObj[param] = false;
            return;
        }
        $scope.statsSortCount ++;
    };
    $scope.statsSortParam = '-won';
    $scope.statsSortParamOp = '-won';
    $scope.statsSortCount = 0;

    $scope.showTeamsTable = function(){
        LeaguesService.getTeams($scope.seasonId.id, $scope.leagueId).then(function(responseData) {
            $scope.tableTeamsData = responseData;
        });
    };

    $scope.showPlayersTable = function(){
        LeaguesService.getPlayers($scope.seasonId.id, $scope.leagueId)
            .then(function(responseData) {
            $scope.defaultTablePlayersData = responseData;
            $scope.tablePlayersData = $scope.defaultTablePlayersData.slice();
            $scope.nameSort = _.sortBy($scope.defaultTablePlayersData, 'name').slice();
            $scope.positionSort = _.sortBy($scope.defaultTablePlayersData, 'position[0].short_name').slice();
            $scope.heightSort = _.sortBy($scope.defaultTablePlayersData, 'height').slice();
            $scope.ageSort = _.sortBy($scope.defaultTablePlayersData, 'age').slice();
            $scope.trSort = _.sortBy($scope.defaultTablePlayersData, 'tr').slice();
            $scope.astnSort = _.sortBy($scope.defaultTablePlayersData, 'assists').slice();
            $scope.ptsSort = _.sortBy($scope.defaultTablePlayersData, 'pts').slice();
            $scope.teamSort = _.sortBy($scope.defaultTablePlayersData, 'team').slice();
            $scope.videoSort = _.sortBy($scope.defaultTablePlayersData, 'videos').slice();

            $scope.currentPage = 0;
            $scope.previousCount = 0;
            $scope.nextCount = 0;

            $scope.paging = {
                total: Math.ceil(parseFloat($scope.tablePlayersData.length / 15)),
                current: 1,
                onPageChanged: loadPlayers
            };
        })
            .then(function() {
                setTimeout(
                    function () {
                        $(".table-players-content").fadeIn(1000)
                    }, 0
                );
                $(".loader-container-players").fadeOut(500);
            });
    };
    $scope.showVideo = function(){
        LeaguesService.getVideo($scope.seasonId.id, $scope.leagueId)
            .then(function(responseData) {
            $scope.tableVideoData = responseData;

            $scope.currentPage = 0;
            $scope.previousCount = 0;
            $scope.nextCount = 0;

            $scope.pagingVideo = {
                total: Math.ceil(parseFloat($scope.tableVideoData.length / 15)),
                current: 1,
                onPageChanged: loadVideos,
            };
        })
            .then(function() {
                setTimeout(
                    function () {
                        $(".league-table-videos").fadeIn(1000)
                    }, 0
                );
                $(".loader-container-videos").fadeOut(500);
            });
    };

    $scope.getResult = function () {
        LeaguesService.getResults($scope.seasonId.id, $scope.leagueId).then(function (response) {
            var newArray = [];
            var arrayelem = [];
            var newObject = {};
            var arrayKey = [];
            for (var i = 0; i < response.length; i++) {
                if (arrayKey.length === 0 || arrayKey[arrayKey.length - 1] !== response[i].step_name) {
                    arrayKey.push(response[i].step_name);
                }
            }
            for (var key = 0; key < arrayKey.length; key++) {
                for (var i = 0; i < response.length; i++) {
                    if (arrayKey[key] === response[i].step_name) {
                        arrayelem.push(response[i], response[i + 1]);
                        newArray.push(arrayelem);
                        arrayelem = [];
                        i++;
                        newObject[arrayKey[key]] = newArray;
                        if (response[i].q1_points === 0 && response[i].q2_points > 0 && response[i].q3_points === 0 && response[i].q4_points) {
                            newObject[arrayKey[key]]['flag'] = 'true';
                        } else {
                            newObject[arrayKey[key]]['flag'] = 'false';
                        }

                    } else {
                        newArray = [];
                    }
                }
            }

            var tempArray = [];

            for(var key in newObject) {
                // newObject[key].sort(function(a,b) {
                //     return new Date(a[0].game_date) - new Date(b[0].game_date);
                // });
                tempArray.push({obj: newObject[key], date: newObject[key][0][0].game_date, name: key});
            }
            tempArray.sort((a,b) => new Date(a.date) - new Date(b.date));
            newObject = {};
            for(var i = 0; i < tempArray.length; i++) {
                newObject[tempArray[i].name] = tempArray[i].obj;
            }
            $scope.resultTable = newObject;
            $(".loader-container-videos").fadeOut(500);
        });
    };

    //Players sort
    $scope.playerSortObj = {
        name: 'none',
        position: 'none',
        height: 'none',
        age: 'none',
        tr: 'none',
        astn: 'none',
        pts: 'none',
        team: 'none',
        video: 'none'
    };
    $scope.playerSort = function(fieldName) {
        //changing sort glyphicon
        if($scope.playerSortObj[fieldName] == 'none') {
            $scope.playerSortObj[fieldName] = 'down';
        } else if($scope.playerSortObj[fieldName] == 'down') {
            $scope.playerSortObj[fieldName] = 'up';
        } else {
            $scope.playerSortObj[fieldName] = 'none';
        }
        for(var key in $scope.playerSortObj) {
            if(key != fieldName) {
                $scope.playerSortObj[key] = 'none';
            }
        }
        //sorting

        $scope.tableMarkup = '';
        var dataSourceName = fieldName + 'Sort';

        $scope.tablePlayersData.length = 0;
        switch (fieldName) {
            case 'name':
                $scope.tablePlayersData = $scope.nameSort.slice();
                break;
            case 'position':
                $scope.tablePlayersData = $scope.positionSort.slice();
                break;
            case 'height':
                $scope.tablePlayersData = $scope.heightSort.slice();
                break;
            case 'age':
                $scope.tablePlayersData = $scope.ageSort.slice();
                break;
            case 'tr':
                $scope.tablePlayersData = $scope.trSort.slice();
                break;
            case 'astn':
                $scope.tablePlayersData = $scope.astnSort.slice();
                break;
            case 'pts':
                $scope.tablePlayersData = $scope.ptsSort.slice();
                break;
            case 'team':
                $scope.tablePlayersData = $scope.teamSort.slice();
                break;
            case 'video':
                $scope.tablePlayersData = $scope.videoSort.slice();
                break;
            default:
                break;
        }
        switch($scope.playerSortObj[''  + fieldName + '']) {
            case 'none':
                $scope.tablePlayersData = $scope.defaultTablePlayersData.slice();
                break;
            case 'up':
                $scope.tablePlayersData = $scope.tablePlayersData.reverse().slice();
                break;
            default:
                break;
        }
        loadPlayers();
    };

        // Team ranks start

        $scope.teamRanks = [];
        $scope.teamRanksTable = function () {
            LeaguesService.getTeamRanks($scope.seasonId.id, $scope.leagueId).then(function (response) {
                $scope.teamRanks = response;

                $scope.teamRanksColor = response.length;
                $scope.tableTeamsRanksData = $scope.teamRanks.slice();
                $scope.team_nameSort = _.sortBy($scope.tableTeamsRanksData, 'team_name').slice();
                $scope.ptsSort = _.sortBy($scope.tableTeamsRanksData, 'points_league_rank').slice();
                $scope.fgmSort = _.sortBy($scope.tableTeamsRanksData, 'fgm_league_rank').slice();
                $scope.fgaSort = _.sortBy($scope.tableTeamsRanksData, 'fga_league_rank').slice();
                $scope.fgpSort = _.sortBy($scope.tableTeamsRanksData, 'fg_percent_league_rank').slice();
                $scope.pm_3Sort = _.sortBy($scope.tableTeamsRanksData, 'p3m_league_rank').slice();
                $scope.pa_3Sort = _.sortBy($scope.tableTeamsRanksData, 'p3a_league_rank').slice();
                $scope.pp_3Sort = _.sortBy($scope.tableTeamsRanksData, 'p3_percent_league_rank').slice();
                $scope.pm_2Sort = _.sortBy($scope.tableTeamsRanksData, 'p2m_league_rank').slice();
                $scope.pa_2Sort = _.sortBy($scope.tableTeamsRanksData, 'p2a_league_rank').slice();
                $scope.pp_2Sort = _.sortBy($scope.tableTeamsRanksData, 'p2_percent_league_rank').slice();
                $scope.ftmSort = _.sortBy($scope.tableTeamsRanksData, 'ftm_league_rank').slice();
                $scope.ftaSort = _.sortBy($scope.tableTeamsRanksData, 'fta_league_rank').slice();
                $scope.ftpSort = _.sortBy($scope.tableTeamsRanksData, 'ft_percent_league_rank').slice();
                $scope.orSort = _.sortBy($scope.tableTeamsRanksData, 'or_league_rank').slice();
                $scope.drSort = _.sortBy($scope.tableTeamsRanksData, 'dr_league_rank').slice();
                $scope.trSort = _.sortBy($scope.tableTeamsRanksData, 'tr_league_rank').slice();
                $scope.asSort = _.sortBy($scope.tableTeamsRanksData, 'as_league_rank').slice();
                $scope.toSort = _.sortBy($scope.tableTeamsRanksData, 'to_league_rank').slice();
                $scope.stSort = _.sortBy($scope.tableTeamsRanksData, 'st_league_rank').slice();
                $scope.srSort = _.sortBy($scope.tableTeamsRanksData, 'sr_league_rank').slice();
                $scope.bsSort = _.sortBy($scope.tableTeamsRanksData, 'bs_league_rank').slice();
                $scope.fmSort = _.sortBy($scope.tableTeamsRanksData, 'fm_league_rank').slice();
                $scope.frSort = _.sortBy($scope.tableTeamsRanksData, 'fs_league_rank').slice();
                $scope.valSort = _.sortBy($scope.tableTeamsRanksData, 'val_league_rank').slice();
            });
        };

        $scope.teamRanksSortObj = {
            team_name: 'none',
            pts: 'none',
            fgm: 'none',
            fga: 'none',
            fgp: 'none',
            pm_3: 'none',
            pa_3: 'none',
            pp_3: 'none',
            pm_2: 'none',
            pa_2: 'none',
            pp_2: 'none',
            ftm: 'none',
            fta: 'none',
            ftp: 'none',
            or: 'none',
            dr: 'none',
            tr: 'none',
            as: 'none',
            to: 'none',
            st: 'none',
            sr: 'none',
            bs: 'none',
            fm: 'none',
            fr: 'none',
            val: 'none'
        };

        $scope.teamRanksSort = function(fieldName) {
            if($scope.teamRanksSortObj[fieldName] == 'none') {
                $scope.teamRanksSortObj[fieldName] = 'down';
            } else if($scope.teamRanksSortObj[fieldName] == 'down') {
                $scope.teamRanksSortObj[fieldName] = 'up';
            } else {
                $scope.teamRanksSortObj[fieldName] = 'none';
            }
            for(var key in $scope.teamRanksSortObj) {
                if(key != fieldName) {
                    $scope.teamRanksSortObj[key] = 'none';
                }
            }

            switch (fieldName) {
                case 'team_name':
                    $scope.teamRanks = $scope.team_nameSort.slice();
                    break;
                case 'pts':
                    $scope.teamRanks = $scope.ptsSort.slice();
                    break;
                case 'fgm':
                    $scope.teamRanks = $scope.fgmSort.slice();
                    break;
                case 'fga':
                    $scope.teamRanks = $scope.fgaSort.slice();
                    break;
                case 'fgp':
                    $scope.teamRanks = $scope.fgpSort.slice();
                    break;
                case 'pm_3':
                    $scope.teamRanks = $scope.pm_3Sort.slice();
                    break;
                case 'pa_3':
                    $scope.teamRanks = $scope.pa_3Sort.slice();
                    break;
                case 'pp_3':
                    $scope.teamRanks = $scope.pp_3Sort.slice();
                    break;
                case 'pm_2':
                    $scope.teamRanks = $scope.pm_2Sort.slice();
                    break;
                case 'pa_2':
                    $scope.teamRanks = $scope.pa_2Sort.slice();
                    break;
                case 'pp_2':
                    $scope.teamRanks = $scope.pp_2Sort.slice();
                    break;
                case 'ftm':
                    $scope.teamRanks = $scope.ftmSort.slice();
                    break;
                case 'fta':
                    $scope.teamRanks = $scope.ftaSort.slice();
                    break;
                case 'ftp':
                    $scope.teamRanks = $scope.ftpSort.slice();
                    break;
                case 'or':
                    $scope.teamRanks = $scope.orSort.slice();
                    break;
                case 'dr':
                    $scope.teamRanks = $scope.drSort.slice();
                    break;
                case 'tr':
                    $scope.teamRanks = $scope.trSort.slice();
                    break;
                case 'as':
                    $scope.teamRanks = $scope.asSort.slice();
                    break;
                case 'to':
                    $scope.teamRanks = $scope.toSort.slice();
                    break;
                case 'st':
                    $scope.teamRanks = $scope.stSort.slice();
                    break;
                case 'sr':
                    $scope.teamRanks = $scope.srSort.slice();
                    break;
                case 'bs':
                    $scope.teamRanks = $scope.bsSort.slice();
                    break;
                case 'fm':
                    $scope.teamRanks = $scope.fmSort.slice();
                    break;
                case 'fr':
                    $scope.teamRanks = $scope.frSort.slice();
                    break;
                case 'val':
                    $scope.teamRanks = $scope.valSort.slice();
                    break;
                default:
                    break;
            }
            switch($scope.teamRanksSortObj[''  + fieldName + '']) {
                case 'none':
                    $scope.teamRanks = $scope.tableTeamsRanksData.slice();
                    break;
                case 'up':
                    $scope.teamRanks = $scope.teamRanks.reverse().slice();
                    break;
                default:
                    break;
            }
        };

    $timeout(function () {
        $scope.currentTranslate = 0;
        $scope.carouselResults = $(".carousel-results");

        var dateContainers = document.getElementsByClassName("results-date");
        var dateContainersWidth = dateContainers[0].getBoundingClientRect().width * dateContainers.length;
        var resultsContainers = document.getElementsByClassName("results-container");
        var resultsContainersWidth = resultsContainers[0].getBoundingClientRect().width * resultsContainers.length;
        $scope.carouselResultsWidth = document.getElementsByClassName("carousel-results")[0].getBoundingClientRect().width;
        $scope.totalWidth =  dateContainersWidth + resultsContainersWidth;
    }, 3000);

    $scope.scrollLength = 0;

    $scope.scrollPrev = function(){
        var scrollStep = 745;
        if(Math.abs($scope.currentTranslate)-scrollStep > 0) {
            $scope.currentTranslate += scrollStep;
            $scope.carouselResults.css("transform", "translate(" + ($scope.currentTranslate ) + "px, 0px) translateZ(0px)");
        } else if(Math.abs($scope.currentTranslate) > 0) {
            $scope.currentTranslate = 28;
            $scope.carouselResults.css("transform", "translate(" + ($scope.currentTranslate) + "px, 0px) translateZ(0px)");
        }
    };
    $scope.scrollNext = function(){
        //var percent = $scope.totalWidth * 0.018;
        var rowWidth = 1094;
        var scrollStep = 745;
        if(Math.abs($scope.currentTranslate) + scrollStep + rowWidth < $scope.totalWidth) {
            $scope.currentTranslate -= scrollStep;
            $scope.carouselResults.css("transform", "translate(" + ($scope.currentTranslate) + "px, 0px) translateZ(0px)");
        } else if(Math.abs($scope.currentTranslate) < $scope.totalWidth) {
            $scope.currentTranslate -= $scope.totalWidth - rowWidth - 60 - Math.abs($scope.currentTranslate);
            $scope.carouselResults.css("transform", "translate(" + ($scope.currentTranslate ) + "px, 0px) translateZ(0px)");
        }
    };
    //dropdown menu
    $scope.openMenu = function() {
        $(".dropdown-content").toggle();
    };
    $scope.hideObj = function() {
        setTimeout(function(){
            $(".dropdown-content").fadeOut("slow")
        }, 300);
    };
    $scope.setSeasonId = function(id, choiceSeason, leagueId) {
        $scope.seasonId.id = id;
        $rootScope.choiceSeason = choiceSeason;
        headerService.addParams(leagueId, $scope.tableParams.name, $scope.seasonId.id, $scope.tableParams.logo);
        $scope.tableParams = headerService.getParams();
    };

    //pagination loaders
    function loadPlayers(){
        $scope.tempTableData = $scope.tablePlayersData.slice();
        $scope.currentPage = $scope.paging.current;

        $scope.previousCount = $scope.currentPage * 15 - 15;
        $scope.nextCount = $scope.currentPage * 15;
        $scope.playersPagin = $scope.tempTableData.slice($scope.previousCount, $scope.nextCount);
        $timeout(function () {
            $scope.$apply();
        });
    };
    $scope.getTeamData = function(name) {
        $('body').removeClass('modal-open');
            for(var key in $scope.tableTeamsData) {
                if($scope.tableTeamsData[key].name == name) {

                    $scope.sendTeamParams($scope.seasonId.id, $scope.leagueId, $scope.tableTeamsData[key].id,
                        ($scope.tableTeamsData[key].name).replace(' ','_'),$scope.tableTeamsData[key].logo);

                    break;
                }
            }
        $location.path('team' + '/' + $scope.tableteamsSearh.seasonId + '/' + $scope.tableteamsSearh.leagueId + '/' + $scope.tableteamsSearh.teamId + '/' + $scope.tableteamsSearh.nameTeam);

    };
    $scope.sendTeamParams = function (seasonId, leagueId, teamId, nameTeam, logo) {
        $scope.tableteamsSearh = {
            seasonId: seasonId,
            leagueId: leagueId,
            teamId: teamId,
            nameTeam: nameTeam
        };
        TeamInformation.addTeamParams(seasonId, leagueId, teamId, nameTeam, logo);
        $rootScope.choiceSeason = '';
    };
    $scope.getPlayerData = function(id) {
        //$('body').removeClass('modal-open');
        PlayerSearchService.getPlayerById(id).then(function (data) {
            $rootScope.playerProfile = data;
            if($rootScope.goldSubscription || $rootScope.isAdmin) {
                var path = 'player' + '/' + $rootScope.playerProfile.id + '/' + $rootScope.playerProfile.last_name + '_' + $rootScope.playerProfile.first_name;
                $window.open(path, '_blank');
            } else {
                $location.path('player' + '/' + $rootScope.playerProfile.id + '/' + $rootScope.playerProfile.last_name + '_' + $rootScope.playerProfile.first_name);
            }
        });
    };
    $scope.getPlayerDataNewTab = function(id, firstName, lastName) {
        var video = document.getElementById("watch_video_game");
        video.pause();
        var path = 'player' + '/' + id + '/' + lastName + '_' + firstName;
        $window.open(path, '_blank');
    };
    $scope.setPlayerId = function (id, firstName, lastName, height, position, age, country, photo) {
        $rootScope.playerProfile = {
            id: id,
            first_name: firstName,
            last_name: lastName,
            height: height,
            age: age,
            position: {
                name: position
            },
            main_nationality: {
                name: country
            },
            profile_photo: photo
        };
    };
    function loadVideos(){
        $scope.currentPage = $scope.pagingVideo.current;

        $scope.previousCount = $scope.currentPage * 15 - 15;
        $scope.nextCount = $scope.currentPage * 15;
        $scope.videosPagin = $scope.tableVideoData.slice($scope.previousCount, $scope.nextCount);
    };
    function compareNumeric(a, b) {
        return a > b ? -1 : 1;
    };
    $scope.addDate = function (date) {

        $scope.gameDate = date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0];
    };
    $scope.closeWatchVideo = function(){
        document.getElementById('watch_video_game').pause();
        $('.league-table').fadeIn(300);
    };

    /*video control buttons*/

    var speedIndex = 1.0;

    $scope.controlSecondButtons = function(sec){
        var video = document.getElementById("watch_video_game");
        video.currentTime += +sec;
    };
    $scope.controlSpeedButtons = function(x){
        speedIndex += +x;
        var video = document.getElementById("watch_video_game");
        if(speedIndex < 0.2){
            speedIndex = 0.2;
        }
        video.playbackRate = speedIndex;
    };
    $scope.controlSpeedNormalButtons = function(){
        speedIndex = 1.0;
        $scope.indexVideo = true;
        var video = document.getElementById("watch_video_game");
        video.playbackRate = speedIndex;
    };
    $scope.controlPlayPause = function(){
        var video = document.getElementById("watch_video_game");
        if($scope.indexVideo) {
            video.play();
        } else {
            video.pause();
        }
        $scope.indexVideo = !$scope.indexVideo;
    };
    //end controls
    $scope.addSrc = function (link, firstTeamId, secondTeamId, homeName, awayName) {
        $scope.indexVideo = true;
        $('#watch_video_game').attr('src', link);
        $('.league-table').fadeOut(1000);
        $(".loader-container").fadeIn(1000);

        $scope.homeName = homeName;
        $scope.awayName = awayName;
        TeamInformation.getTeamForVideo($scope.seasonId.id, $scope.leagueId, firstTeamId).then(function (data) {
            $scope.dataFirstTeam = data;
        });

        TeamInformation.getTeamForVideo($scope.seasonId.id, $scope.leagueId, secondTeamId).then(function (data) {
            $scope.dataSecondTeam = data;
        })
            .then(function () {
                setTimeout(
                    function () {
                        $("#see_video").fadeIn(300);
                        $("#see_video").modal('show');
                    },600

                );
                $(".loader-container").fadeOut(300);
            });
        $timeout(function () {
            $scope.controlPlayPause();
        });

    };
    $('.close-youtube').click(function () {
        $('#watch_video').attr('src', null);

    });
    $scope.setVideoId = function (id) {
        $scope.indexVideo = true;
        $('.league-table').fadeOut(1000);
        $(".loader-container").fadeIn(1000);

        TeamInformation.getVideoForId(id).then(function (response) {
            $('#watch_video_game').attr('src', response.video.video_server.http_path + response.video.link);
            $('#watch_video_game_2').attr('href', response.video.video_server.http_path + response.video.link);
            TeamInformation.getTeamForVideoNew(id,response.video.game.home_team.id).then(function (data) {
                $scope.dataFirstTeam = data;
                $scope.gameDate = response.video.game.game_date.split('-')[2] + '/' + response.video.game.game_date.split('-')[1] + '/' + response.video.game.game_date.split('-')[0];
                $scope.homeName = response.video.game.home_team.name;
                $scope.getLeagueName = response.video.game.league.name;
                $scope.getSeasonName = response.video.game.season.name;
            });
            TeamInformation.getTeamForVideoNew(id, response.video.game.away_team.id).then(function (data) {
                $scope.dataSecondTeam = data;
                $scope.awayName = response.video.game.away_team.name;
            })
                .then(function () {
                    setTimeout(
                        function () {
                            $("#see_video").fadeIn(300);
                            $("#see_video").modal('show');
                        },
                        600
                    );
                    $(".loader-container").fadeOut(300);
                });
            $timeout(function () {
                $scope.controlPlayPause();
            },300);
        });
    };
    $scope.openBoxScore = function (gameId) {
        TeamInformation.getBoxScore(gameId).then(function (response) {
            $scope.tableBox = response;
            if(response.game_stats[0].team === response.away_team.id){
                $scope.totalHomeTeam = response.game_stats[1];
                $scope.totalAwayTeam = response.game_stats[0];
            } else{
                $scope.totalHomeTeam = response.game_stats[0];
                $scope.totalAwayTeam = response.game_stats[1];
            }
        });
    };
}]);