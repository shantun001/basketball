app.controller('TeamController',['$location', '$window', '$rootScope', '$scope', 'TeamService', 'TeamInformation',
    'PlayerSearchService','LeaguesService', '$timeout', '$compile',
    function ($location, $window, $rootScope, $scope, TeamService, TeamInformation, PlayerSearchService, LeaguesService, $timeout, $compile) {

        $scope.searchString = '';
        $scope.width = 320;
        $scope.searching = false;
        $scope.data = null;
        $scope.selectTC = "head_to_head";
        $scope.getTeams = function () {
            TeamService.getTeams($scope.searchString)
                .then(function (data) {
                    if (!data.length) {
                        data.push({name: 'No match found'});
                    }
                    $scope.data = data;
                    $scope.width = 852;
                    $scope.searching = true;
                });
        }

        $scope.closeWatchVideo = function(){
            document.getElementById('watch_video_game').pause();
        };
        var actiontypes = [];
        $scope.getAge = function(birthdate){
            if(!birthdate) return '';
            return new Date().getFullYear() - new Date(birthdate).getFullYear();
        };
        /*video control buttons*/

        var speedIndex = 1.0;
        $scope.indexVideo = true;
        $scope.controlSecondButtons = function(sec){
            var video = document.getElementById("watch_video_game");
            video.currentTime += +sec;
        }
        $scope.controlSpeedButtons = function(x){
            speedIndex += +x;
            var video = document.getElementById("watch_video_game");
            if(speedIndex < 0.2){
                speedIndex = 0.2;
            }
            video.playbackRate = speedIndex;
        }
        $scope.controlSpeedNormalButtons = function(){
            speedIndex = 1.0;
            $scope.indexVideo = true;
            var video = document.getElementById("watch_video_game");
            video.playbackRate = speedIndex;
        }
        $scope.controlPlayPause = function(){
            var video = document.getElementById("watch_video_game");
            if($scope.indexVideo) {
                video.play();
            } else {
                video.pause();
            }
            $scope.indexVideo = !$scope.indexVideo;
        };
        /*video control buttons END*/

        $scope.chooseTeam = function (e) {
            if (e.key !== "Enter") return;
            else if ($scope.data.length === 1) {
                $scope.sendTeamParams($scope.data[0].season, $scope.data[0].league, $scope.data[0].id, $scope.data[0].name, $scope.data[0].logo);
                $('#team-search-container').trigger('blur');
                $scope.searching = false;
                $rootScope.seasonId = null;
                $location.path('team' + '/' + $scope.data[0].season + '/' + $scope.data[0].league + '/' + $scope.data[0].id + '/' + $scope.data[0].name.replace($scope.regExp, '_'));
                $scope.lostFocus();
                document.getElementById('menu_container_2').style.display='none';
            }
        };

        $scope.print = function () {
            text = $(".comparison").html();
            print(text);
        };

        $scope.$on('$viewContentLoaded', function(){
            if(!$rootScope.selectedTabTeam) {
                $timeout(function () {
                    $scope.selectedTabTeam = 'Roster';
                    $('#roster').addClass('active');
                    $('#liroster').addClass('active');
                },500);
            } else {
                $('#roster').removeClass('active');
                $('#liroster').removeClass('active');
                if($rootScope.selectedTabTeam === 'Results') {
                    $scope.getResult();
                    addClasses('#result');
                } else if ($rootScope.selectedTabTeam === 'Roster') {
                    addClasses('#roster');
                } else if ($rootScope.selectedTabTeam === 'Game Stats') {
                    $timeout(function () {
                        $scope.getGame();
                        addClasses('#gameStats');
                    },2500);
                } else if ($rootScope.selectedTabTeam === 'Players Stats') {
                    $timeout(function () {
                        $scope.openPlayerStats();
                        addClasses('#players-stats');
                    },2500);
                } else if ($rootScope.selectedTabTeam === 'Stats2win') {
                    $scope.getResultStatsTwoWin();
                    $scope.getLastGameAndAverageForGraphs();
                    addClasses('#stats2win');
                } else if ($rootScope.selectedTabTeam === 'Team Comparison') {
                    $scope.getListTeams();
                    addClasses('#comparison');
                } else if ($rootScope.selectedTabTeam === 'Watch Video') {
                    $scope.getVideo();
                    addClasses('#video');
                }else if ($rootScope.selectedTabTeam === 'Game Video Analysis') {
                        addClasses('#gameAnalysis');
                        setTimeout(function () {
                            document.getElementById('ligameAnalysis').click();
                        },2000)
                }

            }
            function addClasses(tabName) {
                let id = '#li' + tabName.substr(1);
                $(tabName).addClass('in');
                $(tabName).addClass('active');
                $(id).addClass('active');
            }
        });

        $scope.selectTab = function (tabName) {
            $scope.selectedTabTeam = tabName;
            $rootScope.selectedTabTeam = tabName;
        };

        $scope.selectedRadio = 'Possession';

        $scope.lostFocus = function () {
            $scope.searchString = '';
            $scope.data = null;
            $scope.width = 320;
            $scope.searching = false;
        };

        $scope.sendTeamParams = function (seasonId, leagueId, teamId, nameTeam, logo) {
            TeamInformation.addTeamParams(seasonId, leagueId, teamId, nameTeam, logo);
            $rootScope.choiceSeasonTeam = '';
        };

        $scope.getTableTeam = TeamInformation.getTeamParams();
        $scope.seasonId = $scope.getTableTeam.seasonId;
        $scope.leagueId = $scope.getTableTeam.leagueId;
        $scope.teamId = $scope.getTableTeam.teamId;
        $scope.nameTeam = $scope.getTableTeam.teamName;
        $scope.logoImage = '';
        $scope.leagueName = $scope.getTableTeam.leagueName;
        $scope.seasonName = $scope.getTableTeam.seasonName;
        $scope.fullName = $scope.getTableTeam.fullName;

        function parse(path) {
            var seasonId = '';
            var leagueId = '';
            var teamId = '';
            var teamName = '';
            var fullName = '';
            path = path.split('/');
            for (var i = 0; i < 5; i++) {

                var val = path;
                switch (i) {
                    case 0:
                        seasonId = val[2];
                        break;
                    case 1:
                        leagueId = val[3];
                        break;
                    case 2:
                        teamId = val[4];
                        break;
                    case 3:
                        teamName = val[5];
                        break;
                    case 4:
                        fullName = val[6];
                        break;
                }
            }
            return {
                logo: '',
                seasonId: $scope.seasonId,
                leagueId: $scope.leagueId,
                teamId: teamId,
                teamName: teamName,
                fullName: fullName
            }
        }

    var url = $location.path();
        if( (url.indexOf('/team')) !== -1){
            var arr = url.split('/');
            $scope.seasonId = arr[2];
            $scope.leagueId = arr[3];
            $scope.teamId = arr[4];
            $scope.nameTeam = arr[5].replace('_',' ');
            $scope.seasonFullName = $rootScope.choiceSeasonTeam;
            var teamName = $scope.nameTeam.replace(/_/g,' ');
            TeamInformation.addTeamParams(arr[2], arr[3], arr[4], teamName, $scope.logoImage,  $rootScope.choiceSeasonTeam, $scope.seasonName, $scope.leagueName);
            $scope.getTableTeam = TeamInformation.getTeamParams();
            $scope.seasonId = $scope.getTableTeam.seasonId;
            $scope.leagueId = $scope.getTableTeam.leagueId;
            $scope.teamId = $scope.getTableTeam.teamId;
            $scope.nameTeam = $scope.getTableTeam.teamName;
            $scope.logoImage = '';
            $scope.leagueName = $scope.getTableTeam.leagueName;
            $scope.seasonName = $scope.getTableTeam.seasonName;
            $scope.fullName = $scope.getTableTeam.fullName;
            $rootScope.choiceSeasonTeam = arr[6];

            TeamInformation.getTeamsForLogo(teamName).then(function (response) {
                for (var i = 0; i < response.length; i++) {
                    if (response[i].id == $scope.teamId) {
                        $scope.logoImage = response[i].logo.replace(' ', '%20');
                    }
                }
            });
        }

        if($scope.teamId != undefined) {
            setTimeout(function () {
            TeamInformation.getAllSeasons($scope.teamId).then(function (response) {
                $scope.seasonsAllData = [];
                var seasonsTempData = response;
                $scope.correctCurrentSeasonName = '';

                if($rootScope.isAdmin || $rootScope.goldSubscription) {
                    $scope.seasonsAllData = response;
                } else {
                    var accessibleSeasons = [];
                    var accessibleLeagues = [];
                    for(var i = 0; i < $rootScope.accessibleTeams.length; i++ ) {
                        if($rootScope.accessibleTeams[i].teamId == $scope.teamId || $rootScope.accessTeamFromLeague) {
                            accessibleSeasons.push($rootScope.accessibleTeams[i].seasonId);
                            accessibleLeagues.push($rootScope.accessibleTeams[i].leagueId);
                        }
                    }
                    for(var i = 0; i < seasonsTempData.length ; i++ ) {
                        for(var j = 0; j < accessibleSeasons.length; j++) {
                            if(accessibleSeasons[j] == seasonsTempData[i].seasons_id && accessibleLeagues[j] == seasonsTempData[i].league_id ) {
                                $scope.seasonsAllData.push(seasonsTempData[i]);
                            }
                        }
                    }
                }
                $scope.seasonsAllData = $scope.seasonsAllData.sort(function (a, b) {
                    return b.seasons_id - a.seasons_id
                });
                for (var i = 0; i < $scope.seasonsAllData.length; i++) {
                    if ($scope.seasonsAllData[i].league_id == $scope.leagueId) {
                        $scope.correctCurrentSeasonName = $scope.seasonsAllData[i]['full_name'].replace(/_/g, ' ');
                        $scope.correctLeagueSeasonName = $scope.seasonsAllData[i]['league_name'].replace(/_/g, ' ');
                        break;
                    }
                }

                for (var i = 0; i < response.length; i++) {
                    if (response[i].seasons_id === $scope.seasonId && $scope.leagueId === response[i].league_id) {
                        $scope.leagueName = response[i].league_name;
                        $scope.seasonName = response[i].seasons_name;
                    }
                }
                $scope.getLeagueInCurrentSeason = [];
                for (var l = 0; l < $scope.seasonsAllData.length; l++) {
                    if ($scope.seasonsAllData[l].seasons_id == $scope.seasonId) {
                        $scope.getLeagueInCurrentSeason.push($scope.seasonsAllData[l]);
                    }
                }
            });
            },1000)
        }

        $scope.getLogo= function () {
            window.print();
        };

        $scope.pageUrl = $location.path();
        $scope.setSeason = function () {
            $scope.tableParams = parse(url);
            $scope.seasonId = $scope.tableParams.seasonId;
            $scope.leagueId = $scope.tableParams.leagueId;
            $scope.teamId = $scope.tableParams.teamId;
            $scope.nameTeam = $scope.tableParams.teamName;
            $scope.logoImage = $scope.tableParams.logo;
            $scope.seasonFullName = $scope.tableParams.fullName;
            $rootScope.choiceSeasonTeam = $scope.tableParams.fullName;
            TeamInformation.addTeamParams($scope.seasonId, $scope.leagueId, $scope.teamId, $scope.nameTeam, $scope.logoImage, $scope.seasonFullName, $scope.seasonName, $scope.leagueName);
            $scope.getTableTeam = TeamInformation.getTeamParams();
        };

        $scope.getResult = function () {

            TeamInformation.getResultTeam($scope.teamId, $scope.seasonId, $scope.leagueId).then(function (response) {

                response = response.sort(function (a,b) {
                    if(a.step_name == b.step_name) {
                        return a.game_id - b.game_id;
                    } else {
                        return a.step_name.localeCompare(b.step_name);
                    }
                });

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
                            if (response[i].q1_points === 0 && response[i].q2_points > 0 && response[i].q3_points === 0 && response[i].q4_points > 0) {
                                newObject[arrayKey[key]]['flag'] = 'true';
                            } else {
                                newObject[arrayKey[key]]['flag'] = 'false';
                            }
                        }
                        else {
                            newArray = [];
                        }
                    }
                }
                var tempArray = [];
                for(var key in newObject) {
                    newObject[key].sort(function(a,b) {
                       return new Date(a[0].game_date) - new Date(b[0].game_date);
                    });
                    //newObject[key].sort_date = newObject[key][0][0].game_date;
                    tempArray.push({obj: newObject[key], date: newObject[key][0][0].game_date, name: key});
                }
                tempArray.sort((a,b) => new Date(a.date) - new Date(b.date));
                newObject = {};
                for(var i = 0; i < tempArray.length; i++) {
                    newObject[tempArray[i].name] = tempArray[i].obj;
                }


                $scope.resultTableTeam = newObject;
            })
                .then(function () {
                    loader();

                });
        };

        $scope.getGame = function () {

            var getChartPoints = function(idGames) {
                TeamInformation.getGameStatsByGamesa(idGames).then(function (response) {
                    response.forEach(function (item,i) {
                    });
                    var opponentsPoints = [];
                    var teamPoints = [];
                    var opponentsName = [];
                    response.sort(function (a,b) {
                        return new Date(a.game_date) - new Date(b.game_date);
                    });
                    response.forEach(function (item,i) {
                    });
                    for (var i = 0; i < response.length; i++) {

                        if (response[i]['game_stats'][0].team == $scope.teamId) {
                            teamPoints.push(response[i]['game_stats'][0].points);
                        } else {
                            opponentsPoints.push(response[i]['game_stats'][0].points);
                        }
                        if (response[i]['game_stats'][1].team == $scope.teamId) {
                            teamPoints.push(response[i]['game_stats'][1].points);
                        } else {
                            opponentsPoints.push(response[i]['game_stats'][1].points);
                        }
                        if (response[i]['away_team']['id'] == $scope.teamId) {
                            opponentsName.push(response[i]['home_team']['name']);
                        } else {
                            opponentsName.push(response[i]['away_team']['name']);
                        }

                    }
                    drawGameStats(opponentsPoints, teamPoints, opponentsName);
                });
                //draw chart for Game Stats
                function drawGameStats(firstData, secondData, opName) {

                    var arr = [];
                    for (var i = 0; i < firstData.length; i++) {
                        arr.push({
                            data1: firstData[i],
                            data2: secondData[i],
                            Opponent: opName[i],
                            name2: $scope.nameTeam
                        });
                    }

                    $("#chartGameStats").kendoChart({
                        dataSource: {
                            data: arr
                        },
                        series: [{
                            name: "Opponent",
                            field: "data1",
                            color: '#3366cc'
                        },
                            {
                                name: $scope.nameTeam,
                                field: "data2",
                                color: '#c30000'
                            }],

                        seriesDefaults: {
                            type: "line"
                        },
                        labels: {
                            font: "10px Arial,Helvetica,sans-serif",
                            visible: true,
                            padding: 2
                        }, tooltip: {
                            visible: true,
                            border: {
                                width: 2,
                                radius: 5
                            },
                            top: 20,
                            color: '#fff',
                            /*template: "<b>${series.name}</b> ${value} Points",*/
                            template: "#=series.name == 'Opponent' ? dataItem.Opponent : series.name# ${value} Points",
                            width: 80,
                            height: 30,
                            padding: 5
                        },
                        categoryAxis: {
                            majorGridLines: {
                                visible: false
                            }, line: {
                                visible: false
                            }
                        },
                        legend: {
                            font: "10px Arial,Helvetica,sans-serif",
                            position: 'top'
                        }
                    });
                }

            };

            var leaguesGameStats = function () {
                var htmlstring = '';
                for (var i = 0; i < $scope.getLeagueInCurrentSeason.length; i++) {
                    if ($scope.getLeagueInCurrentSeason[i].league_id == $scope.leagueId) {
                        htmlstring = htmlstring + '<option selected value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    } else {
                        htmlstring = htmlstring + '<option value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    }
                }

                var temp = $compile(htmlstring)($scope);
                $('#game-stats-leagues').html(temp);
                $('#game-stats-leagues').selectpicker('refresh');
                /*$('#game-stats-leagues').selectpicker('selectAll');*/
                $('#game-stats-leagues').on('changed.bs.select', function (e) {
                    $scope.gameStatsLeagues = $('#game-stats-leagues').val() ? $('#game-stats-leagues').val().map(Number): [];
                    gamesGameStats($scope.gameStatsLeagues);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
                $scope.gameStatsLeagues = $('#game-stats-leagues').val() ? $('#game-stats-leagues').val().map(Number): [];
                gamesGameStats($scope.gameStatsLeagues);
            };

            var gamesGameStats = function (idLeagues) {
                TeamInformation.getResultTeam($scope.teamId, $scope.seasonId, idLeagues).then(function (response) {
                    var game = response.sort(function (a,b) {
                        return a.game_id - b.game_id;
                    });
                    $scope.homeGame = [];
                    $scope.awayGame = [];
                    for(var i=0; i < game.length; i++){
                        if(game[i]['place'] === "away"){
                            $scope.awayGame.push(game[i])
                        }else{
                            $scope.homeGame.push(game[i])
                        }
                    }

                    var htmlstring = '';
                    for(var i=0; i < $scope.awayGame.length; i++){
                        if (i === 0) {
                            htmlstring = htmlstring + '<option selected value="' + $scope.awayGame[i].game_id +  '">' + $scope.awayGame[i].game_date.split('-').reverse().join('-') + ' ' + $scope.homeGame[i].team_name + ' - '  + $scope.awayGame[i].team_name +'</option>';
                        } else {
                            htmlstring = htmlstring + '<option value="' + $scope.awayGame[i].game_id +  '">' + $scope.awayGame[i].game_date.split('-').reverse().join('-') + ' ' + $scope.homeGame[i].team_name + ' - '  + $scope.awayGame[i].team_name + '</option>';
                        }
                    }
                    var temp = $compile(htmlstring)($scope);
                    $('#game-stats-games').html(temp);
                    $('#game-stats-games').selectpicker('refresh');
                    $('#game-stats-games').selectpicker('selectAll');
                    $('#game-stats-games').on('changed.bs.select', function (e) {
                        var idGames = $('#game-stats-games').val() ? $('#game-stats-games').val().map(Number): [];
                        getChartPoints(idGames);
                        getGameStats(idGames);
                        e.stopImmediatePropagation();
                    });
                    var idGames = $('#game-stats-games').val() ? $('#game-stats-games').val().map(Number): [];
                    getChartPoints(idGames);
                    getGameStats(idGames);
                });
            };

            var getGameStats = function (idGames) {

                TeamInformation.getGameStatsByGames(idGames, +$scope.teamId).then(function (response) {
                    $scope.tableGameResult = {};
                    var arrGame = [];
                    var arrLastDate = [];
                    $scope.dataGameGraph = [];
                    $scope.dataAverageGraph = [];
                    for (var keyGame in response) {
                        var date = new Date(response[keyGame][0].game_date);
                        arrGame.push(date);
                        if (keyGame === 'SEASON ACCUMULATED') {
                            arrLastDate.push(keyGame);
                        }
                    }
                    arrGame.sort(compareNumber);
                    arrGame.push(arrLastDate[0]);
                    for (var i = 0; i < arrGame.length; i++) {
                        for (var key in response) {
                            var keyDate = new Date(response[key][0].game_date) + '';
                            if (key !== 'SEASON ACCUMULATED' && keyDate === (arrGame[i] + '')) {
                                $scope.tableGameResult[key] = response[key];
                                $scope.tableGameResult[key].sort(function (a,b) {
                                    return (a.game_date === null)-(b.game_date === null) || new Date(a.game_date) - new Date(b.game_date);
                                });

                            } else if (key === 'SEASON ACCUMULATED' && arrGame[i] === 'SEASON ACCUMULATED') {
                                $scope.tableGameResult[key] = response[key];
                            }
                        }
                    }
                    for(var key in $scope.tableGameResult) {
                        var temp1 = $scope.tableGameResult[key].filter((v) => {
                            if(v.team_id == $scope.teamId || v.team_name == 'AVERAGE' || v.team_name == 'OPPONENTS')
                                return true;
                            });
                        var temp2 = $scope.tableGameResult[key].filter(v => (v.team_id != $scope.teamId && v.team_id != 0 ) );

                        for (var i = 0; i < temp2.length; i++) {
                            temp1[i].team_name = temp2[i].team_name;
                        }
                        $scope.tableGameResult[key] = temp1;

                    }
                });
            }

            leaguesGameStats();
        };

        $scope.getLastGameAndAverageForGraphs = function() {
            TeamInformation.getLastGameAndAverage($scope.seasonId, $scope.leagueId, $scope.teamId).then(function (response) {
                $scope.dataAverageGraph = response;
                var drawing = kendo.drawing;
                var geometry = kendo.geometry;
                function createChart() {
                    $(".gameVsSeasonGrapthPTS").kendoChart({
                        title: {
                            text: "Points"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].points.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].points.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 10,
                        },
                        categoryAxis: {
                            categories: ["PTS"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthVAL").kendoChart({
                        title: {
                            text: "VAL"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].val.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].val.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 10,
                        },
                        categoryAxis: {
                            categories: ["VAL"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthOER").kendoChart({
                        title: {
                            text: "OER"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].oer.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].oer.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 1,
                        },
                        categoryAxis: {
                            categories: ["OER"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthFGM").kendoChart({
                        title: {
                            text: "FG Made"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].fg_made.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].fg_made.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["FGM"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthFGA").kendoChart({
                        title: {
                            text: "FG Attempts"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].fg_attempts.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].fg_attempts.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 6,
                        },
                        categoryAxis: {
                            categories: ["FGA"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthFGP").kendoChart({
                        title: {
                            text: "FG %"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].fg_percent.toFixed(1)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].fg_percent.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 5,
                        },
                        categoryAxis: {
                            categories: ["FG%"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapth3PM").kendoChart({
                        title: {
                            text: "3P Made"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].p3_made.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].p3_made.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["3PM"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });



                    $(".gameVsSeasonGrapth3PA").kendoChart({
                        title: {
                            text: "3P Attempts"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].p3_attempts.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].p3_attempts.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["3PA"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapth3PP").kendoChart({
                        title: {
                            text: "3P %"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].p3_percent.toFixed(1)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].p3_percent.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 5,
                        },
                        categoryAxis: {
                            categories: ["3P%"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapth2PM").kendoChart({
                        title: {
                            text: "2P Made"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].p2_made.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].p2_made.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["2PM"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapth2PA").kendoChart({
                        title: {
                            text: "2P Attempts"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].p2_attempts.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].p2_attempts.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 5,
                        },
                        categoryAxis: {
                            categories: ["2PA"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapth2PP").kendoChart({
                        title: {
                            text: "2P %"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].p2_percent.toFixed(1)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].p2_percent.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 5,
                        },
                        categoryAxis: {
                            categories: ["2P%"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthFTM").kendoChart({
                        title: {
                            text: "FT Made"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].ft_made.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].ft_made.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["FTM"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthFTA").kendoChart({
                        title: {
                            text: "FT Attempts"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].ft_attempts.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].ft_attempts.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["FTA"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthFTP").kendoChart({
                        title: {
                            text: "FT %"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].ft_percent.toFixed(1)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].ft_percent.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 8,
                        },
                        categoryAxis: {
                            categories: ["FT%"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthOR").kendoChart({
                        title: {
                            text: "Offensive Rebounds"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].of_rebounds.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].of_rebounds.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["OR"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthDR").kendoChart({
                        title: {
                            text: "Defensive Rebounds"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].df_rebounds.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].df_rebounds.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["DR"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthTR").kendoChart({
                        title: {
                            text: "Total Rebounds"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].tr.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].tr.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 5,
                        },
                        categoryAxis: {
                            categories: ["TR"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthAS").kendoChart({
                        title: {
                            text: "Assists"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].assists.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].assists.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["AS"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthTO").kendoChart({
                        title: {
                            text: "Turnovers"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].turnovers.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].turnovers.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["TO"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthST").kendoChart({
                        title: {
                            text: "Steals"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].steals.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].steals.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["ST"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthBS").kendoChart({
                        title: {
                            text: "Block Shots"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].block_shots.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].block_shots.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["BS"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthSR").kendoChart({
                        title: {
                            text: "Shots Rejected"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].shots_rejected.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].shots_rejected.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["SR"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthFM").kendoChart({
                        title: {
                            text: "Fouls Made"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].fouls_made.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].fouls_made.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["FM"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });

                    $(".gameVsSeasonGrapthFR").kendoChart({
                        title: {
                            text: "Fouls Received"
                        },
                        legend: {
                            position: "bottom",
                            item: {
                                visual: createLegendItem
                            }
                        },
                        chartArea: {
                            height: 330,
                            width: 270,
                        },
                        seriesDefaults: {
                            type: "column",
                            highlight: {
                                toggle: function (e) {
                                    e.preventDefault();

                                    var visual = e.visual;
                                    var opacity = e.show ? 0.8 : 1;

                                    visual.opacity(opacity);
                                }
                            },
                            visual: function (e) {
                                return createColumn(e.rect, e.options.color);
                            }
                        },
                        series: [{
                            name: "vs " + $scope.dataAverageGraph[0].team_name,
                            data: [$scope.dataAverageGraph[0].fouls_received.toFixed(0)]
                        }, {
                            name: "Average",
                            data: [$scope.dataAverageGraph[1].fouls_received.toFixed(1)]
                        }],
                        panes: [{
                            clip: false
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels: {
                                visible: true,
                                template: "#= Math.round(value) #"
                            },
                            majorUnit: 3,
                        },
                        categoryAxis: {
                            categories: ["FR"],
                            majorGridLines: {
                                visible: false
                            },
                            line: {
                                visible: false
                            }
                        },
                        tooltip: {
                            visible: true
                        }
                    });


                }

                // $(".gameVsSeasonGrapthFR").data('kendoChart').options.valueAxis.majorUnit = 1;

            function createColumn(rect, color) {
                var origin = rect.origin;
                var center = rect.center();
                var bottomRight = rect.bottomRight();
                var radiusX = rect.width() / 2;
                var radiusY = radiusX / 3;
                var gradient = new drawing.LinearGradient({
                    stops: [{
                        offset: 0,
                        color: color
                    }, {
                        offset: 0.5,
                        color: color,
                        opacity: 0.9
                    }, {
                        offset: 0.5,
                        color: color,
                        opacity: 0.9
                    }, {
                        offset: 1,
                        color: color
                    }]
                });

                var path = new drawing.Path({
                    fill: gradient,
                    stroke: {
                        color: "none"
                    }
                }).moveTo(origin.x, origin.y)
                    .lineTo(origin.x, bottomRight.y)
                    .arc(180, 0, radiusX, radiusY, true)
                    .lineTo(bottomRight.x, origin.y)
                    .arc(0, 180, radiusX, radiusY);

                var topArcGeometry = new geometry.Arc([center.x, origin.y], {
                    startAngle: 0,
                    endAngle: 360,
                    radiusX: radiusX,
                    radiusY: radiusY
                });

                var topArc = new drawing.Arc(topArcGeometry, {
                    fill: {
                        color: color
                    },
                    stroke: {
                        color: "#ebebeb"
                    }
                });
                var group = new drawing.Group();
                group.append(path, topArc);
                return group;
            }

            function createLegendItem(e) {
                var color = e.options.markers.background;
                var labelColor = e.options.labels.color;
                var rect = new geometry.Rect([0, 0], [115,  60]);
                var layout = new drawing.Layout(rect, {
                    spacing: 2,
                    alignItems: "center"
                });

                var overlay = drawing.Path.fromRect(rect, {
                    fill: {
                        color: "#fff",
                        opacity: 0,
                    },
                    stroke: {
                        color: "none"
                    },
                    cursor: "pointer"

                });

                var column = createColumn(new geometry.Rect([0, 0], [12, 9]), color);
                var label = new drawing.Text(e.series.name, [0, 0], {
                    font: '10px Arial,Helvetica,sans-serif',
                    fill: {
                        color: labelColor
                    }
                });
                layout.append(column, label);
                layout.reflow();

                var group = new drawing.Group().append(layout, overlay);

                return group;
            }

            $(document).ready(createChart);
            $(document).bind("kendo:skinChange", createChart);

            });
        };


        //Start Game Analysis tab

        $scope.Timeflag = false;

        $scope.setRadioValue = function(value){
            $scope.gameAnalysisInput = value;

        };
        $scope.setRadioValueClose = function(){
            $('#possessions')[0].checked = true;
        };
        $scope.updateSelectedTeamId = function (){
            TeamInformation.getTeamGames($scope.teamId).then(function (response) {
                var htmlstring = '';
                var games = response;
                for (var i = 0; i < games.length; i++) {
                    if (i === 0) {
                        htmlstring = htmlstring + '<option selected value="' + games[i].id + ':' + games[i].home_team.id + ':' + games[i].away_team.id + '">' + games[i].game_date.split('-').reverse().join('-') + ' ' + games[i].home_team.name + ' - ' + games[i].away_team.name + '</option>';
                    } else {
                        htmlstring = htmlstring + '<option value="' + games[i].id + ':' + games[i].home_team.id + ':' + games[i].away_team.id + '">' + games[i].game_date.split('-').reverse().join('-') + ' ' + games[i].home_team.name + ' - ' + games[i].away_team.name + '</option>';
                    }
                };
                $scope.homeTeamId = games[0].home_team.id;
                var temp = $compile(htmlstring)($scope);
                $('#games-search').html(temp);
                $('#games-search').selectpicker('refresh');
                $('#games-search').on('changed.bs.select', function (e) {
                    $scope.homeTeamId = $('#games-search').val().split(':')[1];
                    $('#possessions')[0].checked = true;
                    var gameId = Number(e.target.value.split(':')[0]);
                    $scope.updateTableAnalysisByQuarter(gameId);
                    $scope.gameAnalysisInput = 'Possessions';
                });
                $scope.updateTableAnalysisByQuarter(games[0].id);
                $scope.gameAnalysisInput = 'Possessions';
            }).then(function () {
                setTimeout(
                    function () {
                        $("#gameAnalyis").fadeIn(500);
                        $('#gameAnalyis').modal();
                    },0);
                $(".loader-container-team").fadeOut(400);

            });
        };

        $scope.currentGameId = [];
        $scope.analysisByQuarter = [];
        $scope.isGameAnalysisDraw = false;

        $scope.updateTableAnalysisByQuarter = function (gameId) {
            if ($scope.isGameAnalysisDraw) {
                return;
            } else {
                $scope.isGameAnalysisDraw = true;
                setTimeout(function () {
                    $scope.isGameAnalysisDraw = false;
                }, 1000);
                $scope.currentGameId = gameId;
                $scope.analysisByQuarter = [];
                TeamInformation.getAnalysisByQuarter(gameId).then(function (response) {
                    for (var i = 0; i < response.length; i += 2) {
                            var game = {team1: response[i], team2: response[i + 1]};
                            $scope.analysisByQuarter.push(game);
                        }

                        $scope.updateOffOrDeff(gameId);
                        $scope.updateDeff(gameId);
                        $scope.updateStartersAndBench(gameId);
                        $scope.updateBoxscoresInfo();
                        $scope.updateDefensiveTeamCombinationsByGame(gameId);
                        $scope.updateOffensiveCombinationsByGame(gameId);
                        $scope.fillVideos(gameId, $scope.analysisByQuarter[0].team1.team_id, $scope.analysisByQuarter[0].team2.team_id);
                        $scope.fillVideosPossessions(gameId, $scope.analysisByQuarter[0].team1.team_id, $scope.analysisByQuarter[0].team2.team_id);
                        $scope.fillVideosForBoxscore(gameId);
                        $scope.forRefreshShotChart1();
                        $scope.forRefreshShotChart2();
                        // $scope.videoForStarters(gameId, $scope.analysisByQuarter[0].team1.team_id);
                        // $scope.gameAnalysisInput = 'Possessions';
                    });
            }
        };
        $scope.offOrDeff = [];

        $scope.updateOffOrDeff = function (gameId) {
            $scope.offOrDeff = [];
                TeamInformation.getOffOrDeff(gameId).then(function (response) {
                    for (var i = 0; i < response.length; i += 2) {
                        var game = {team1: response[i], team2: response[i + 1]};
                        $scope.offOrDeff.push(game);
                    }
                });
        };

        $scope.Deff = [];

        $scope.updateDeff = function (gameId) {
            $scope.Deff = [];
                TeamInformation.getDeff(gameId).then(function (response) {
                    for (var i = 0; i < response.length; i += 2) {
                        var game = {team1: response[i], team2: response[i + 1]};
                        $scope.Deff.push(game);
                    }
                });
        };

        $scope.startersAndBench = [];

        $scope.updateStartersAndBench = function (gameId) {
            $scope.startersAndBench = [];
                TeamInformation.getStartersAndBench(gameId).then(function (response) {
                    for (var i = 0; i < response.length; i += 2) {
                        var game = {team1: response[i], team2: response[i + 1]};
                        $scope.startersAndBench.push(game);
                    }
                });
        };

        $scope.updateBoxscoresInfo = function () {
            $scope.boxscoresInfoHomeTeam = [];
            $scope.boxscoresInfoAwayTeam = [];
            var gameId = $('#games-search').val().split(':')[0];
            var team1Id = $('#games-search').val().split(':')[1];
            var team2Id = $('#games-search').val().split(':')[2];
            $scope.boxscoresInfoHomeTeam = [];
                TeamInformation.getBoxscoresInfo(gameId, team1Id).then(function (response) {
                    $scope.boxscoresInfoHomeTeam = response;
                });
            $scope.boxscoresInfoAwayTeam = [];
                TeamInformation.getBoxscoresInfo(gameId, team2Id).then(function (response) {
                    $scope.boxscoresInfoAwayTeam = response;
                });
        };

        $scope.offensiveNameteam1 = [];
        $scope.offensiveNameteam2 = [];


        $scope.updateOffensiveCombinationsByGame = function (gameId) {
            $scope.offensiveNameteam1 = [];
            $scope.offensiveNameteam2 = [];
            var team1Id = $('#games-search').val().split(':')[1];
                TeamInformation.getOffensiveCombinationsByGame(gameId).then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].off_team_id == team1Id) {
                            $scope.offensiveNameteam1.push(response[i]);

                        } else {
                            $scope.offensiveNameteam2.push(response[i]);
                        }
                    };
                });
        };

        $scope.defensiveNameteam1 = [];
        $scope.defensiveNameteam2 = [];

        $scope.updateDefensiveTeamCombinationsByGame = function (gameId) {
            $scope.defensiveNameteam1 = [];
            $scope.defensiveNameteam2 = [];
            var team1Id = $('#games-search').val().split(':')[1];
                TeamInformation.getDefensiveTeamCombinationsByGame(gameId).then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].def_team_id == team1Id) {
                            $scope.defensiveNameteam1.push(response[i]);
                        } else {
                            $scope.defensiveNameteam2.push(response[i]);
                        }
                    }
                    ;
                });
        };

        $scope.teamTagsInfoForEachPlayers = [];

        $scope.updateTeamTagsInfoForEachPlayers = function (gameId) {
                TeamInformation.getTeamTagsInfoForEachPlayers(gameId).then(function (response) {
                    $scope.teamTagsInfoForEachPlayers = response;
                });
        };

        $scope.defensiveCombinationByEachPlayer = [];

        $scope.updateDefensiveCombinationByEachPlayer = function (gameId) {
                TeamInformation.getDefensiveCombinationByEachPlayer(gameId).then(function (response) {
                    $scope.defensiveCombinationByEachPlayer = response;
                });
        };

        $scope.offensiveCombinationByEachPlayer = [];

        $scope.updateOffensiveCombinationByEachPlayer = function (gameId) {
                TeamInformation.getOffensiveCombinationByEachPlayer(gameId).then(function (response) {
                    $scope.offensiveCombinationByEachPlayer = response;
                });
        };

        // start modal

        $scope.team1Videos = [];
        $scope.team2Videos = [];
        $scope.videoNames = [];
        $scope.currentVideo = '';

        function sortVideos(response,quarterId, actionIds, actionResultIds) {
            var result = [];
            for (var tag in response) {
                if (response[tag].game_period_id === quarterId  && actionIds.includes(response[tag].action_id) && actionResultIds.includes(response[tag].action_result_id)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        //response[tag].img  = 'http://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' + response[tag].file_name +'/'+response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        //response[tag].img  = 'http://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' + response[tag].file_name+'/'+ response[tag].file_name + '.jpg';
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        //response[tag].img  = 'http://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' + response[tag].file_name + '.jpg';
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                     result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosForTotal(response, actionIds, actionResultIds) {
            var result = [];
            for (var tag in response) {
                if (actionIds.includes(response[tag].action_id) && actionResultIds.includes(response[tag].action_result_id)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        $scope.getVideosForPoints = function (team, quarterId) {
            var response = team == 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalPoints = function (team) {
            var response = team == 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFieldGoalsMade = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalFieldGoalsMade = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFieldGoalsAttempts = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalFieldGoalsAttempts = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor3PointsMade = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotal3PointsMade = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor3PointsAttempts = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotal3PointsAttempts = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2PointsMade = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1], [1, 2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotal2PointsMade = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1], [1, 2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2PointsAttempts = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1], [1, 2, 17, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotal2PointsAttempts = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1], [1, 2, 17, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFtMade = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalFtMade = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFtAttempts = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [2], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalFtAttempts = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [2], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForOfRebounds = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [12]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalOfRebounds = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [12]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForDfRebounds = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [11]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalDfRebounds = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [11]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForTotRebounds = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [11, 12]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotaTotfRebounds = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [11, 12]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForAssists = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1, 2], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalAssists = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForTurnovers = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalTurnovers = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSteals = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [7]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalSteals = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [7]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBlockShots = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [8]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalBlockShots = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [8]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForShotsRejected = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [9]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalShotsRejected = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [9]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFoulsMade = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [5]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalFoulsMade = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [5]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFoulsMade = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [5]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalFoulsMade = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [5]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFoulsReceived = function (team, quarterId) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideos(response, quarterId, [1,2], [6]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideoForTotalFoulsReceived = function (team) {
            var response = team === 'team1' ? $scope.team1Videos : $scope.team2Videos;
            $scope.videoNames = sortVideosForTotal(response, [1,2], [6]);
            handleVideo($scope.videoNames);
        };

        $scope.team1VideosForPoss = [];
        $scope.team2VideosForPoss = [];
        $scope.team1VideosForTeams = [];
        $scope.team2VideosForTeams = [];

        $scope.fillVideosPossessions = function (gameId, team1Id, team2Id){
            $scope.team1VideosForPoss = [];
            $scope.team2VideosForPoss = [];
                TeamInformation.getAllTeamTagsAboutGame(gameId, team1Id).then(function (response) {
                    $scope.team1VideosForPoss = response;
                    $scope.team2VideosForTeams = response;
                });
                TeamInformation.getAllTeamTagsAboutGame(gameId, team2Id).then(function (response) {
                    $scope.team2VideosForPoss = response;
                    $scope.team1VideosForTeams = response;
                });
        };




        // for teams start

        function sortVideosForTeamOffensive(response, teamTagsId, actionIds, actionResultIds) {
            var result = [];
            for (var tag in response) {
                if (teamTagsId.includes(response[tag].id)  && response[tag].action_ids.some(i => actionIds.indexOf(i) > -1) && response[tag].action_result_ids.some(i => actionResultIds.indexOf(i) > -1)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;

        };

        function sortVideosForTeamOffensiveTurnovers(response, teamTagsId, actionIds) {
            var result = [];
            for (var tag in response) {
                if (teamTagsId.includes(response[tag].id)  && response[tag].action_ids.some(i => actionIds.indexOf(i) > -1)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosForTeamOffensivePoss(response, teamTagsId) {
            var result = [];
            for (var tag in response) {
                if (teamTagsId.includes(response[tag].id)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        $scope.getVideosForPossOffensiveTeams = function (team, teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensivePoss(response, teamTagsId);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForPointsOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response, teamTagsId, [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor3pmOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response,teamTagsId, [1], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor3paOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response, teamTagsId, [1], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2pmOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response, teamTagsId, [1], [2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2paOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response, teamTagsId, [1], [2, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2pmpOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response, teamTagsId, [1], [1]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2papOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response, teamTagsId, [1], [1, 17]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFtmOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response, teamTagsId, [2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFtaOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensive(response, teamTagsId, [2], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForTurnoversOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensiveTurnovers(response, teamTagsId, [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForDrawFoulsOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensiveTurnovers(response, teamTagsId, [6]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForDeflectedOffensiveTeams = function (team,teamTagsId) {
            var response = team === 'team1' ? $scope.team1VideosForTeams : $scope.team2VideosForTeams;
            $scope.videoNames = sortVideosForTeamOffensiveTurnovers(response, teamTagsId, [15]);
            handleVideo($scope.videoNames);
        };

        // for teams end

        function sortVideosPossessions(response, possessionTypeId, actionIds, actionResultIds) {
            var result = [];
            for (var tag in response) {
                if (response[tag].possession_type_id === possessionTypeId  && response[tag].action_ids.some(i => actionIds.indexOf(i) > -1) && response[tag].action_result_ids.some(i => actionResultIds.indexOf(i) > -1)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2018') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }

                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosPossessionsForPoss(response, possessionTypeId) {
            var result = [];
            for (var tag in response) {
                if (response[tag].possession_type_id === possessionTypeId){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';


                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2018') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }


                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosPossessionsForTurnoversAndDrawFouls(response, possessionTypeId, actionIds) {
            var result = [];
            for (var tag in response) {
                if (response[tag].possession_type_id === possessionTypeId && response[tag].action_ids.some(i => actionIds.indexOf(i) > -1)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';

                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }


                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosPossessionsForStartOfaQuarter(response, possessionStartedOfId, actionIds, actionResultIds) {
            var result = [];
            for (var tag in response) {
                if (possessionStartedOfId.includes(response[tag].possession_started_of_id)  && response[tag].action_ids.some(i => actionIds.indexOf(i) > -1) && response[tag].action_result_ids.some(i => actionResultIds.indexOf(i) > -1))
                {
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';

                    if (response[tag].processed === 3 && response[tag].file_name.includes('/')) {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    } else if (response[tag].processed === 3) {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    } else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);

                }
            }
            return result;
        };

        function sortVideosPossessionsForStartOfaQuarterPoss(response, possessionStartedOfId) {
            var result = [];
            for (var tag in response) {
                if (possessionStartedOfId.includes(response[tag].possession_started_of_id)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosPossessionsForStartOfaQuarterTurnoversAndDrawFouls(response, possessionStartedOfId, actionIds) {
            var result = [];
            for (var tag in response) {
                if (possessionStartedOfId.includes(response[tag].possession_started_of_id) && response[tag].action_ids.some(i => actionIds.indexOf(i) > -1)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';

                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosPossessionsForSecondChance(response, actionIds, actionResultIds) {
            var result = [];
            for (var tag in response) {
                if (response[tag].action_ids.some(i => actionIds.indexOf(i) > -1) && response[tag].action_result_ids.some(i => actionResultIds.indexOf(i) > -1))
                {
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';

                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg' :
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' + response[tag].file_name + '.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosPossessionsForSecondChancePoss(response, actionIds) {
            var result = [];
            for (var tag in response) {
                if (response[tag].action_ids.some(i => actionIds.indexOf(i) > -1)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        $scope.getVideosForPoss = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForPoss(response, possessionTypeId);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterPoss = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarterPoss(response, [12]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutPoss = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarterPoss(response, [13]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChancePoss = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChancePoss(response, [12]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForPointsOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterPointsOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutPointsOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChancePointsOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFgmOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterFgmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutFgmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChanceFgmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFgaOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterFgaOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutFgaOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChanceFgaOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor3pmOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarter3pmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOut3pmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChance3pmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor3paOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarter3paOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOut3paOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChance3paOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2pmOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarter2pmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1], [2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOut2pmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1], [2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChance2pmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2paOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [2, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarter2paOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1], [2, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOut2paOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1], [2, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChance2paOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [2, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2pmpOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [1]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarter2pmpOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1], [1]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOut2pmpOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1], [1]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChance2pmpOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [1]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2papOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [1, 17]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarter2papOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [1], [1, 17]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOut2papOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [1], [1, 17]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChance2papOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [1, 17]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFtmOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterFtmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutFtmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChanceFtmOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFtaOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [2], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterFtaOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [12], [2], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutFtaOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarter(response, [13], [2], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChanceFtaOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForTurnoversOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForTurnoversAndDrawFouls(response, possessionTypeId, [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterTurnoversOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarterTurnoversAndDrawFouls(response, [12], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutTurnoversOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarterTurnoversAndDrawFouls(response, [13], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChanceTurnoversOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [24]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForDrawFoulsOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForTurnoversAndDrawFouls(response, possessionTypeId, [6]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterDrawFoulsOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarterTurnoversAndDrawFouls(response, [12], [6]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutDrawFoulsOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarterTurnoversAndDrawFouls(response, [13], [6]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChanceDrawFoulsOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [21, 25]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForDeflectedOffensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForTurnoversAndDrawFouls(response, possessionTypeId, [15]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaQuarterDeflectedOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarterTurnoversAndDrawFouls(response, [12], [15]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForStartOfaTimeOutDeflectedOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForStartOfaQuarterTurnoversAndDrawFouls(response, [13], [15]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForSecondChanceDeflectedOffensive = function (team) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessionsForSecondChance(response, [12], [23]);
            handleVideo($scope.videoNames);
        };


        function sortVideosDefensive(response, defensiveTypeId, actionIds, actionResultIds) {
            var result = [];
            for (var tag in response) {
                if (response[tag].defensive_type_id === defensiveTypeId  && response[tag].action_ids.some(i => actionIds.indexOf(i) > -1) && response[tag].action_result_ids.some(i => actionResultIds.indexOf(i) > -1)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosDefensiveForPoss(response, defensiveTypeId) {
            var result = [];
            for (var tag in response) {
                if (response[tag].defensive_type_id === defensiveTypeId){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosDefensiveForTurnoversAndDrawFouls(response, defensiveTypeId, actionIds) {
            var result = [];
            for (var tag in response) {
                if (response[tag].defensive_type_id === defensiveTypeId && response[tag].action_ids.some(i => actionIds.indexOf(i) > -1)){
                    response[tag].url = response[tag].processed === 3 ?
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '/original.mp4' :
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].file_name) + '.mp4';
                    if(response[tag].processed === 3 && response[tag].file_name.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name.slice(response[tag].file_name.indexOf('2') + 11) + '.jpg';
                    }else if(response[tag].processed === 3){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '/' + response[tag].file_name + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].file_name + '.jpg';
                    }
                    // response[tag].img = response[tag].processed === 3 ?
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'/'+ response[tag].file_name + '.jpg':
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].file_name +'.jpg';
                    // result.push(response[tag]);
                }
            }
            return result;
        };

        $scope.getVideosForDefensivePoss = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensiveForPoss(response, defensiveTypeId);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForPointsDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFgmDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [1], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFgaDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [1], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor3pmDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [1], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor3paDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [1], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2pmDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [1], [2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2paDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [1], [2, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2pmpDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, defensiveTypeId, [1], [1]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosFor2papDefensive = function (team,possessionTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosPossessions(response, possessionTypeId, [1], [1, 17]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFtmDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForFtaDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [2], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForTurnoversDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensiveForTurnoversAndDrawFouls(response, defensiveTypeId, [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForDrawFoulsDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensiveForTurnoversAndDrawFouls(response, defensiveTypeId, [6]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForDeflectedDefensive = function (team,defensiveTypeId) {
            var response = team === 'team1' ? $scope.team1VideosForPoss : $scope.team2VideosForPoss;
            $scope.videoNames = sortVideosDefensive(response, defensiveTypeId, [6], [25]);
            handleVideo($scope.videoNames);
        };

        //video for boxscore

        $scope.videosForBoxscore = [];

        $scope.fillVideosForBoxscore= function (gameId) {
            $scope.videosForBoxscore = [];
                TeamInformation.getTeamTagsInfoForEachPlayers(gameId).then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        var player = {
                            id: response[i].player_id,
                            teamName: response[i].team_name,
                            videos: [],
                            playerName: response[i].player_last_name
                        };
                        for (var j = 0; j < response[i].action_ids.length; j++) {
                            var video = {
                                actionId: response[i].action_ids[j],
                                fileName: response[i].filenames[j],
                                actionResultId: response[i].action_result_ids[j],
                                title: response[i].titles[j]
                            }
                            player.videos.push(video);
                        }
                        $scope.videosForBoxscore.push(player);
                    }
                });

            TeamInformation.getGameQuatersStats(gameId).then(function (response) {
                $scope.statsByQuaters = response;
                if ($scope.statsByQuaters[0][0].team_id != $scope.homeTeamId ) {
                        $scope.statsByQuaters = $scope.statsByQuaters.reverse();
                    }
            });
        };


        function sortVideosForBoxscore(response, actionId, actionResultId) {
            var result = [];
            for (var tag in response) {
                if (actionId.includes(response[tag].actionId) && actionResultId.includes(response[tag].actionResultId)){
                    response[tag].url =
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].fileName) + '/original.mp4';

                    if(response[tag].fileName.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].fileName + '/' + response[tag].fileName.slice(response[tag].fileName.indexOf('2') + 11) + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].fileName + '/' + response[tag].fileName + '.jpg';
                    }                   // response[tag].img =
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].fileName +'/'+ response[tag].fileName + '.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };

        function sortVideosForBoxscoreActionId(response, actionId) {
            var result = [];
            for (var tag in response) {
                if (actionId.includes(response[tag].actionId)){
                    response[tag].url =
                        "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].fileName) + '/original.mp4';
                    if(response[tag].fileName.includes('/')){
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].fileName + '/' + response[tag].fileName.slice(response[tag].fileName.indexOf('2') + 11) + '.jpg';
                    }else {
                        response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].fileName + '/' + response[tag].fileName + '.jpg';
                    }
                    // response[tag].img =
                    //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].fileName +'/'+ response[tag].fileName + '.jpg';
                    result.push(response[tag]);
                }
            }
            return result;
        };


        function sortVideosForBoxscorePoss(response) {

            var result = [];

            for (var tag in response) {
                response[tag].url =
                    "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(response[tag].fileName) + '/original.mp4';
                if(response[tag].fileName.includes('/')){
                    response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].fileName + '/' + response[tag].fileName.slice(response[tag].fileName.indexOf('2') + 11) + '.jpg';
                }else {
                    response[tag].img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + response[tag].fileName + '/' + response[tag].fileName + '.jpg';
                }
                // response[tag].img =
                //     'https://s4uvideos.s3-accelerate.dualstack.amazonaws.com/clips/' +response[tag].fileName +'/'+ response[tag].fileName + '.jpg';
                result.push(response[tag]);
            }
            return result;
        }


        $scope.getVideosForBoxscorePoss = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscorePoss(videos);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalPoss = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscorePoss(videos);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscorePoints = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalPoints = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1, 2], [1, 2, 3, 4]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreFgm = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalFgm = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [1, 2, 3]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreFga = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalFga = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [1, 2, 3, 17, 18, 19]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscore3pm = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotal3pm = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [3]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscore3pa = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [3, 19]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotal3pa = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [3, 19]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscore2pm = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [1, 2]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotal2pm = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [1, 2]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscore2pa = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [1, 2, 17, 18]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotal2pa = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [1], [1, 2, 17, 18]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreFtm = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [2], [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalFtm = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [2], [4]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreFta = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [2], [4, 16]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalFta = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscore(videos, [2], [4, 16]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreOfRebounds = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos,[12]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalOfRebounds = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos,[12]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreDfRebounds = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [11]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalDfRebounds = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [11]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreTotalRebounds = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [11, 12]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalTotalRebounds = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [11, 12]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreAssists = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [3]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalAssists = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [3]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreTurnovers = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [4]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalTurnovers = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [4]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreSteals = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [7]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalSteals = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [7]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreBlockShots = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [8]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalBlockShots = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [8]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreShotsRejected = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [9]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalShotsRejected = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [9]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreFoulsMade = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [5]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalFoulsMade = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [5]);
            handleVideo($scope.videoNames);
        };


        $scope.getVideosForBoxscoreFoulsReceived = function (playerId) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (playerId === $scope.videosForBoxscore[k].id){
                    videos = $scope.videosForBoxscore[k].videos;
                    break;
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [6]);
            handleVideo($scope.videoNames);
        };

        $scope.getVideosForBoxscoreTotalFoulsReceived = function (teamName) {
            var videos = [];
            for (var k in $scope.videosForBoxscore){
                if (teamName === $scope.videosForBoxscore[k].teamName){
                    videos = videos.concat($scope.videosForBoxscore[k].videos);
                }
            }
            $scope.videoNames = sortVideosForBoxscoreActionId(videos, [6]);
            handleVideo($scope.videoNames);
        };

        //end boxscore

        $scope.selectAllVideos = function () {
            $scope.selectedVideo = $scope.selectedVideo.map(v => true);
        };
        $scope.deSelectAllVideos = function () {
            $scope.selectedVideo = $scope.selectedVideo.map(v => false);
        };
        $scope.toggleSelectVideo = function (id) {
            $scope.selectedVideo[id] = !$scope.selectedVideo[id];
        };
        $scope.exportVideosToFolder = function () {
            var folderName = prompt('Please enter name of the folder here');
            var folderId = '';
            PlayerSearchService.createFolder(folderName).then(function (response) {
                folderId = response.id;
                var selectedVideos = $scope.videos.filter(function (item, index) { return $scope.selectedVideo[index]; });
                selectedVideos.forEach(function (item, index) {
                    var fileName = '';
                    if(item.url.includes('original')) {
                        fileName = item.url.slice(item.url.indexOf('clips/') + 6, item.url.indexOf('/original.mp4'));
                    } else {
                        fileName = item.url.slice(item.url.indexOf('clips/') + 6, item.url.indexOf('.mp4'));
                    }
                    PlayerSearchService.uploadVideosToFolder(folderId, item.title + ' ' + '-' + ' ' + (index + 1), fileName).then(function (response) {
                    });
                    console.log(fileName);
                });
            });
        };
        var listenerModal;
        function handleVideo(videos) {
            $scope.videos = videos;
            $scope.selectedVideo = new Array(videos.length).fill('').map(v => false);
            document.getElementById('playClipsModalGameAnalysis').classList.remove('full_screen_game_analysis');
            $scope.currentVideo = videos[0]
            var video = document.getElementById('clip_game_analysis');
            video.hidden = false;
            video.controls = true;
            video.style.width = '100%';
            video.autoplay = true;
            video.playbackRate = 1.0;
            video.onended = function () {
                $scope.nextClip();
                $timeout(function () {
                    $scope.$apply();
                });
            };
            listenerModal = document.addEventListener("click", function (e) {
                if (e.target === document.querySelector('div#playClipsModalGameAnalysis.modal.fade')){
                    $('#playClipsModalGameAnalysis').modal('hide');
                    video.pause();
                }
            });
        };

        // $(document).ready(function(){
        //     $(this).keydown(function(eventObject){
        //         if (eventObject.which == 27)
        //             document.getElementById('clip_game_analysis').pause();
        //     });
        // });

        $scope.closeClipGameAnalysis = function () {
            document.getElementById('clip_game_analysis').pause();
            $('#playClipsModalGameAnalysis').modal('hide');
        };
        $scope.removeScrollFullScreen = function () {
            $('#gameAnalysis').addClass('scroll');
        };
        $scope.changeClip = function (video) {
            $scope.currentVideo = video;
        };
        $scope.nextClip = function () {
            var idx = $scope.videoNames.indexOf($scope.currentVideo);
            $scope.currentVideo = $scope.videoNames[idx + 1];
        };
        $scope.prevClip = function () {
            var idx = $scope.videoNames.indexOf($scope.currentVideo);
            if (idx === 0) return;
            $scope.currentVideo = $scope.videoNames[idx - 1];
        };
        $scope.videofullscreen = function () {
            if (document.getElementById('playClipsModalGameAnalysis').classList.contains('full_screen_game_analysis')) {
                document.getElementById('playClipsModalGameAnalysis').classList.remove('full_screen_game_analysis');
                $('#gameAnalysis').removeClass('scroll_hidden');
            } else {
                document.getElementById('playClipsModalGameAnalysis').classList.add('full_screen_game_analysis');
                $('#gameAnalysis').addClass('scroll_hidden');
            }
        };


        $scope.dismissModal = function () {
            $scope.videoNames = [];
            $scope.currentVideo = '';
            var video = document.getElementById('clip_game_analysis');
            video.pause();
            video.hidden = true;
            document.removeEventListener('click', listenerModal);
        };

        // end modal

        // Shot Chart start

        $scope.fillVideos= function (gameId, team1Id, team2Id) {
            $scope.team1Videos = [];
            $scope.team2Videos = [];
                TeamInformation.getAllIndividualTagsAboutGame(gameId, team1Id).then(function (response) {
                    $scope.team1Videos = response;

                    for (var i = 0; i < $scope.team1Videos.length; i++) {
                        if ($scope.team1Videos[i].game_period_id === 1) {
                            $scope.team1Videos[i].game_period_name = 'Q1';

                        }
                        if ($scope.team1Videos[i].game_period_id === 2) {
                            $scope.team1Videos[i].game_period_name = 'Q2';
                        }
                        if ($scope.team1Videos[i].game_period_id === 3) {
                            $scope.team1Videos[i].game_period_name = 'Q3';
                        }
                        if ($scope.team1Videos[i].game_period_id === 4) {
                            $scope.team1Videos[i].game_period_name = 'Q4';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 1) {
                            $scope.team1Videos[i].possession_type_name = 'Fastbreak';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 2) {
                            $scope.team1Videos[i].possession_type_name = 'Transition';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 3) {
                            $scope.team1Videos[i].possession_type_name = 'Set Games';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 4) {
                            $scope.team1Videos[i].possession_type_name = 'Sideline Out Of Bound';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 5) {
                            $scope.team1Videos[i].possession_type_name = 'Baseline Out Of Bound';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 6) {
                            $scope.team1Videos[i].possession_type_name = 'Second Chance';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 7) {
                            $scope.team1Videos[i].possession_type_name = 'Quick Steal';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 9) {
                            $scope.team1Videos[i].possession_type_name = 'Other';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 12) {
                            $scope.team1Videos[i].possession_type_name = 'Start of a Quarter';
                        }
                        if ($scope.team1Videos[i].possession_type_id === 13) {
                            $scope.team1Videos[i].possession_type_name = 'Time Out';
                        }
                        if ($scope.team1Videos[i].defensive_type_id === 1) {
                            $scope.team1Videos[i].defensive_type_name = 'Other';
                        }
                        if ($scope.team1Videos[i].defensive_type_id === 3) {
                            $scope.team1Videos[i].defensive_type_name = 'Man To Man';
                        }
                        if ($scope.team1Videos[i].defensive_type_id === 16) {
                            $scope.team1Videos[i].defensive_type_name = 'Full Court Press - Back To MTM';
                        }
                        if ($scope.team1Videos[i].defensive_type_id === 20) {
                            $scope.team1Videos[i].defensive_type_name = 'Full Court Press - Back To ZD';
                        }
                        if ($scope.team1Videos[i].defensive_type_id === 21) {
                            $scope.team1Videos[i].defensive_type_name = 'Zone';
                        }
                        if ($scope.team1Videos[i].defensive_type_id === 22) {
                            $scope.team1Videos[i].defensive_type_name = 'Match-Up';
                        }
                    }
                    $scope.shotChartPlayers1 = [];
                    $scope.team1Videos.forEach(function (el) {
                        if (!$scope.shotChartPlayers1[el.player_name]) {
                            $scope.shotChartPlayers1[el.player_name] = [];
                        }
                        $scope.shotChartPlayers1[el.player_name].push(el);
                    });

                    $scope.shotChartQuarters1 = [];
                    $scope.team1Videos.forEach(function (el) {
                        if (!$scope.shotChartQuarters1[el.game_period_name]) {
                            $scope.shotChartQuarters1[el.game_period_name] = [];
                        }
                        $scope.shotChartQuarters1[el.game_period_name].push(el);
                    });

                    $scope.shotChartPossessions1 = [];
                    $scope.team1Videos.forEach(function (el) {
                        if (!$scope.shotChartPossessions1[el.possession_type_name]) {
                            $scope.shotChartPossessions1[el.possession_type_name] = [];
                        }
                        $scope.shotChartPossessions1[el.possession_type_name].push(el);
                    });

                    $scope.shotChartDefensive1 = [];
                    $scope.team1Videos.forEach(function (el) {
                        if (!$scope.shotChartDefensive1[el.defensive_type_name]) {
                            $scope.shotChartDefensive1[el.defensive_type_name] = [];
                        }
                        $scope.shotChartDefensive1[el.defensive_type_name].push(el);
                    });

                    $scope.forRefreshShotChart1();

                });

                TeamInformation.getAllIndividualTagsAboutGame(gameId, team2Id).then(function (response) {
                    $scope.team2Videos = response;
                    for (var i = 0; i < $scope.team2Videos.length; i++) {
                        if ($scope.team2Videos[i].game_period_id === 1) {
                            $scope.team2Videos[i].game_period_name = 'Q1';
                        }
                        if ($scope.team2Videos[i].game_period_id === 2) {
                            $scope.team2Videos[i].game_period_name = 'Q2';
                        }
                        if ($scope.team2Videos[i].game_period_id === 3) {
                            $scope.team2Videos[i].game_period_name = 'Q3';
                        }
                        if ($scope.team2Videos[i].game_period_id === 4) {
                            $scope.team2Videos[i].game_period_name = 'Q4';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 1) {
                            $scope.team2Videos[i].possession_type_name = 'Fastbreak';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 2) {
                            $scope.team2Videos[i].possession_type_name = 'Transition';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 3) {
                            $scope.team2Videos[i].possession_type_name = 'Set Games';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 4) {
                            $scope.team2Videos[i].possession_type_name = 'Sideline Out Of Bound';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 5) {
                            $scope.team2Videos[i].possession_type_name = 'Baseline Out Of Bound';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 6) {
                            $scope.team2Videos[i].possession_type_name = 'Second Chance';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 7) {
                            $scope.team2Videos[i].possession_type_name = 'Quick Steal';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 9) {
                            $scope.team2Videos[i].possession_type_name = 'Other';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 12) {
                            $scope.team2Videos[i].possession_type_name = 'Start of a Quarter';
                        }
                        if ($scope.team2Videos[i].possession_type_id === 13) {
                            $scope.team2Videos[i].possession_type_name = 'Time Out';
                        }
                        if ($scope.team2Videos[i].defensive_type_id === 1) {
                            $scope.team2Videos[i].defensive_type_name = 'Other';
                        }
                        if ($scope.team2Videos[i].defensive_type_id === 3) {
                            $scope.team2Videos[i].defensive_type_name = 'Man To Man';
                        }
                        if ($scope.team2Videos[i].defensive_type_id === 16) {
                            $scope.team2Videos[i].defensive_type_name = 'Full Court Press - Back To MTM';
                        }
                        if ($scope.team2Videos[i].defensive_type_id === 20) {
                            $scope.team2Videos[i].defensive_type_name = 'Full Court Press - Back To ZD';
                        }
                        if ($scope.team2Videos[i].defensive_type_id === 21) {
                            $scope.team2Videos[i].defensive_type_name = 'Zone';
                        }
                    }

                    $scope.shotChartPlayers2 = [];
                    $scope.team2Videos.forEach(function (el) {
                        if (!$scope.shotChartPlayers2[el.player_name]) {
                            $scope.shotChartPlayers2[el.player_name] = [];
                        }
                        $scope.shotChartPlayers2[el.player_name].push(el);
                    });

                    $scope.shotChartQuarters2 = [];
                    $scope.team2Videos.forEach(function (el) {
                        if (!$scope.shotChartQuarters2[el.game_period_name]) {
                            $scope.shotChartQuarters2[el.game_period_name] = [];
                        }
                        $scope.shotChartQuarters2[el.game_period_name].push(el);
                    });

                    $scope.shotChartPossessions2 = [];
                    $scope.team2Videos.forEach(function (el) {
                        if (!$scope.shotChartPossessions2[el.possession_type_name]) {
                            $scope.shotChartPossessions2[el.possession_type_name] = [];
                        }
                        $scope.shotChartPossessions2[el.possession_type_name].push(el);
                    });

                    $scope.shotChartDefensive2 = [];
                    $scope.team2Videos.forEach(function (el) {
                        if (!$scope.shotChartDefensive2[el.defensive_type_name]) {
                            $scope.shotChartDefensive2[el.defensive_type_name] = [];
                        }
                        $scope.shotChartDefensive2[el.defensive_type_name].push(el);
                    });

                    $scope.forRefreshShotChart2();

                });
        };
        $scope.forRefreshShotChart1 = function () {
            $scope.quarterSelectForShotCharts();
            $scope.playerSelectForShotCharts();
            $scope.possessionsSelectForShotCharts();
            $scope.defensiveSelectForShotCharts();
            $scope.madeOrMissSelectForShotCharts();
            sortDotsOrMark();
        };

        $scope.forRefreshShotChart2 = function () {
            $scope.quarterSelectForShotChartsTeam2();
            $scope.playerSelectForShotChartsTeam2();
            $scope.possessionsSelectForShotChartsTeam2();
            $scope.defensiveSelectForShotChartsTeam2();
            $scope.madeOrMissSelectForShotChartsTeam2();
            sortDotsOrMarkTeam2();
        };



        // getLeagueInCurrentSeason
        $scope.queryData = {
            league: '',
            games: '',
            SubReport: ''

        };
        $scope.openPlayerStats = function () {

            var drawGrafthPS = function () {
                $("#grafthPS").kendoChart({
                    legend: {
                        visible: true,
                        position: 'top'
                    },
                    chartArea: {
                        height: 400,
                        width: 1075
                    },
                    seriesDefaults: {
                        type: "column"
                    },
                    series: [{
                        name: "Points",
                        data: $scope.pointsRank,
                        color: '#3366cc'
                    }],
                    valueAxis: {
                        visible: true,
                        majorGridLines: {
                            visible: false
                        },
                        minorGridLines: {
                            visible: false
                        }
                    },
                    categoryAxis:{
                        labels: {
                            rotation: -45
                        },
                        categories: $scope.namePlayersOnTeam,
                        visible: true,
                        majorGridLines: {
                            visible: false
                        },
                        minorGridLines: {
                            visible: false
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: '${series.name} : ${value.toFixed(1)}',
                        color: '#ffffff',
                        padding: 5
                    }
                });
            };

            var leaguesStatsTwoWin = function () {
                $scope.playersStatsGames = {
                    home: true,
                    away: true,
                    won: true,
                    lose: true
                };
                var htmlstring = '';
                for (var i = 0; i < $scope.getLeagueInCurrentSeason.length; i++) {
                    if (i === 0) {
                        htmlstring = htmlstring + '<option selected value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    } else {
                        htmlstring = htmlstring + '<option value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    }
                }
                $scope.playerStatsLeagueId = $scope.getLeagueInCurrentSeason[0].league_id;
                var temp = $compile(htmlstring)($scope);
                $('#stats2win-leagues').html(temp);
                $('#stats2win-leagues').selectpicker('refresh');
                $('#stats2win-leagues').selectpicker('selectAll');
                $('#stats2win-games').selectpicker('refresh');
                $('#stats2win-games').selectpicker('selectAll');
                $('#stats2win-leagues').on('changed.bs.select', function (e) {
                    $scope.playerStatsLeagueId = $('#stats2win-leagues').val();
                    /*$scope.GamesStatsTwoWin(idLeague);*/
                    subReportPlayerStats();
                    e.stopImmediatePropagation();
                });
                /*$scope.GamesStatsTwoWin($scope.getLeagueInCurrentSeason[0].league_id);*/
                subReportPlayerStats();
            };
            var subReportPlayerStats = function () {
                var htmlstring = '';
                htmlstring = htmlstring + '<option value="1">' + 'Away Games' +'</option>';
                htmlstring = htmlstring + '<option value="2">' + 'Home Games' +'</option>';
                htmlstring = htmlstring + '<option value="3">' + 'Won Games' +'</option>';
                htmlstring = htmlstring + '<option value="4">' + 'Lost Games' +'</option>';
                var temp = $compile(htmlstring)($scope);
                $('#stats2win-sub-report').html(temp);
                $('#stats2win-sub-report').selectpicker('refresh');
                $('#stats2win-sub-report').selectpicker('selectAll');
                $('#stats2win-sub-report').on('changed.bs.select', function (e) {
                    $scope.playerStatsSubSelect($('#stats2win-sub-report').val());
                    gamesStatsTwoWin($scope.playerStatsLeagueId);
                    e.stopImmediatePropagation();
                });
                gamesStatsTwoWin($scope.playerStatsLeagueId);
            };
            $scope.playerStatsSubSelect = function (val) {
                $scope.playersStatsGames.away = false;
                $scope.playersStatsGames.home = false;
                $scope.playersStatsGames.won = false;
                $scope.playersStatsGames.lose = false;
                if(val != null) {
                    if(val.indexOf('1') != -1) {
                        littleToggle('away');
                    }
                    if(val.indexOf('2') != -1) {
                        littleToggle('home');
                    }
                    if(val.indexOf('3') != -1) {
                        littleToggle('won');
                    }
                    if(val.indexOf('4') != -1) {
                        littleToggle('lose');
                    }
                    function littleToggle(p) {
                        $scope.playersStatsGames[p] = true;
                    }

                } else {
                    $scope.playersStatsGames.away = false;
                    $scope.playersStatsGames.home = false;
                    $scope.playersStatsGames.won = false;
                    $scope.playersStatsGames.lose = false;
                }
            };
            var gamesStatsTwoWin = function (idLeague) {
                TeamInformation.getResultTeam($scope.teamId, $scope.seasonId, idLeague).then(function (response) {
                    var game = response.sort(function (a,b) {
                        return a.game_id - b.game_id;
                    });
                    $scope.homeGame = [];
                    $scope.awayGame = [];
                    $scope.homeGameTemp = [];
                    $scope.awayGameTemp = [];
                    for(var i=0; i < game.length; i++){
                        if(game[i]['place'] === "away"){
                            $scope.awayGame.push(game[i])
                        }else{
                            $scope.homeGame.push(game[i])
                        }
                    }

                    switch($scope.playersStatsGames.home + ' ' +  $scope.playersStatsGames.away + ' ' +
                    $scope.playersStatsGames.won + ' ' + $scope.playersStatsGames.lose) {
                        case 'true true true true' :
                            $scope.homeGameTemp = $scope.homeGame;
                            $scope.awayGameTemp = $scope.awayGame;
                            break;
                        case 'false false false false' :
                            $scope.homeGameTemp = [];
                            $scope.awayGameTemp = [];
                            break;
                        case 'true false false false' :
                            for (var i = 0; i < $scope.homeGame.length; i++) {
                                if($scope.homeGame[i].team_id == $scope.teamId) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false true false false':
                            for (var i = 0; i < $scope.awayGame.length; i++) {
                                if($scope.awayGame[i].team_id == $scope.teamId) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false false true false' :
                            for (var i=0; i < game.length-1; i+=2) {
                                if (game[i].team_id == $scope.teamId && game[i].won || game[i + 1].team_id == $scope.teamId && game[i + 1].won) {
                                    if (i % 2 == 0) {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i + 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i + 1]);
                                        }
                                    } else {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i - 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i - 1]);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'false false false true' :
                            for (var i=0; i < game.length-1; i+=2) {
                                if (game[i].team_id == $scope.teamId && !game[i].won || game[i + 1].team_id == $scope.teamId && !game[i + 1].won) {
                                    if (i % 2 == 0) {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i + 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i + 1]);
                                        }
                                    } else {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i - 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i - 1]);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'true true false false' :
                            $scope.homeGameTemp = $scope.homeGame;
                            $scope.awayGameTemp = $scope.awayGame;
                            break;
                        case 'true false true false' :
                            for (var i = 0; i < $scope.homeGame.length; i++) {
                                if($scope.homeGame[i].team_id == $scope.teamId && $scope.homeGame[i].won) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'true false false true' :
                            for (var i = 0; i < $scope.homeGame.length; i++) {
                                if($scope.homeGame[i].team_id == $scope.teamId && !$scope.homeGame[i].won) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'true true true false' :
                            for (var i=0; i < game.length-1; i+=2) {
                                if (game[i].team_id == $scope.teamId && game[i].won || game[i + 1].team_id == $scope.teamId && game[i + 1].won) {
                                    if (i % 2 == 0) {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i + 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i + 1]);
                                        }
                                    } else {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i - 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i - 1]);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'true true false true' :
                            for (var i=0; i < game.length-1; i+=2) {
                                if (game[i].team_id == $scope.teamId && game[i].won || game[i + 1].team_id == $scope.teamId && !game[i + 1].won) {
                                    if (i % 2 == 0) {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i + 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i + 1]);
                                        }
                                    } else {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i - 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i - 1]);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'true false true true' :
                            for (var i = 0; i < $scope.homeGame.length; i++) {
                                if($scope.homeGame[i].team_id == $scope.teamId) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false true true true' :
                            for (var i = 0; i < $scope.awayGame.length; i++) {
                                if($scope.awayGame[i].team_id == $scope.teamId) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false true true false' :
                            for (var i = 0; i < $scope.awayGame.length; i++) {
                                if($scope.awayGame[i].team_id == $scope.teamId && $scope.awayGame[i].won) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false true false true' :
                            for (var i = 0; i < $scope.awayGame.length; i++) {
                                if($scope.awayGame[i].team_id == $scope.teamId && !$scope.awayGame[i].won) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false false true true' :
                            $scope.homeGameTemp = $scope.homeGame;
                            $scope.awayGameTemp = $scope.awayGame;
                            break;
                        default:
                            $scope.homeGameTemp = [];
                            $scope.awayGameTemp = [];
                            break;
                    }

                    $scope.homeGame = [];
                    $scope.awayGame = [];
                    $scope.homeGame = $scope.homeGameTemp;
                    $scope.awayGame = $scope.awayGameTemp;
                    var htmlstring = '';
                    for(var i=0; i < $scope.awayGame.length; i++){
                        if (i === 0) {
                            htmlstring = htmlstring + '<option selected value="' + $scope.awayGame[i].game_id +  '">' + $scope.awayGame[i].game_date.split('-').reverse().join('-') + ' ' + $scope.homeGame[i].team_name + ' - '  + $scope.awayGame[i].team_name +'</option>';
                        } else {
                            htmlstring = htmlstring + '<option value="' + $scope.awayGame[i].game_id +  '">' + $scope.awayGame[i].game_date.split('-').reverse().join('-') + ' ' + $scope.homeGame[i].team_name + ' - '  + $scope.awayGame[i].team_name + '</option>';
                        }
                    }
                    var temp = $compile(htmlstring)($scope);
                    if(htmlstring == '') {
                        playerSelectForStats2win();

                    }
                        $('#stats2win-games').html(temp);
                        $('#stats2win-games').on('changed.bs.select', function (e) {
                            playerSelectForStats2win($('#stats2win-games').val());
                            $scope.gamesSelectPSLength = $('#stats2win-games').val().length;
                            e.stopImmediatePropagation();
                        });
                        $('#stats2win-games').selectpicker('refresh');
                        $('#stats2win-games').selectpicker('selectAll');
                        $timeout(function(){
                            $('#stats2win-games').selectpicker('deselectAll');
                            $('#stats2win-games').selectpicker('selectAll');
                        });

                });
            };
            var playerSelectForStats2win = function (gameIds) {
                if(!gameIds) {
                    $scope.isVisiblePlayerStatsData = false;
                    var htmlstring = '';
                    var temp = $compile(htmlstring)($scope);
                    $('#players-stats2win').html(temp);
                    $('#players-stats2win').selectpicker('refresh');
                    $('#players-stats2win').selectpicker('selectAll');
                } else {
                    $scope.isVisiblePlayerStatsData = true;
                    TeamInformation.getPlayerStatsByGamesNew($scope.teamId, gameIds).then(function (response) {
                        $scope.statsTwoWin = response;
                        $scope.statsTwoWinPS = JSON.parse(JSON.stringify($scope.statsTwoWin));
                        $scope.statsTwoWinPS.average = $scope.statsTwoWinPS.average.sort(function (a,b) {
                            return b.points - a.points;
                        });
                        var htmlstring = '';
                        var k = 0;
                        for (var i in $scope.statsTwoWinPS.average_40_minutes) {
                            if($scope.statsTwoWinPS.average_40_minutes[i]['first_name'] !== 'TEAM') {
                                htmlstring = htmlstring + '<option value="' + $scope.statsTwoWinPS.average_40_minutes[i].player_id + '">' + $scope.statsTwoWinPS.average_40_minutes[i].last_name + ' ' + $scope.statsTwoWinPS.average_40_minutes[i].first_name + '</option>';
                                k++;
                            }
                        };
                        console.log($scope.statsTwoWinPS.average);
                        var temp = $compile(htmlstring)($scope);
                        $('#players-stats2win').html(temp);
                        $('#players-stats2win').selectpicker('refresh');
                        $('#players-stats2win').selectpicker('selectAll');
                    });
                }
                $('#players-stats2win').on('changed.bs.select', function (e) {
                    var playersId = $('#players-stats2win').val() ? $('#players-stats2win').val().map(Number): [];
                    $scope.playerSelectPSLength = playersId.length;
                    changeDataPS(playersId);
                    e.stopImmediatePropagation();
                });

            };

            var changeDataPS = function (id) {
                $scope.pointsRank = [];
                $scope.namePlayersOnTeam = [];
                $scope.statsTwoWin.average = $scope.statsTwoWin.average.sort(function (a,b) {
                    return b.points - a.points;
                });
                for(var i = 0, j = 0; i < $scope.statsTwoWin.average.length; i++){
                    if(id.includes($scope.statsTwoWin.average[i]['player_id'])) {
                        $scope.pointsRank[j] = $scope.statsTwoWin.average[i]['points'];
                        $scope.namePlayersOnTeam[j] = $scope.statsTwoWin.average[i]['last_name'];
                        j++;
                    }
                }

                $timeout(function () {
                    drawGrafthPS();
                    $scope.drawGrafthPS2();
                },50);

                redrawTablePS(id);

                //$scope.statsTwoVin // original data
                //$scope.statsToWinPS //data which is being used in tables
            };
            var redrawTablePS = function (id) {
                $scope.statsTwoWinPS.average = [];
                $scope.statsTwoWinPS.average_40_minutes = [];
                $scope.statsTwoWinPS.total = [];
                // $scope.statsTwoWinPS.average[0] = $scope.statsTwoWin.average[0];
                // $scope.statsTwoWinPS.total[0] = $scope.statsTwoWin.total[0];
                for(var i = 0,j = 0; i < $scope.statsTwoWin.average.length; i++){
                    if(id.includes($scope.statsTwoWin.average[i].player_id)) {
                        $scope.statsTwoWinPS.average[j] = JSON.parse(JSON.stringify($scope.statsTwoWin.average[i]));
                        j++;
                    }
                }
                for(var i = 0,j = 0; i < $scope.statsTwoWin.average_40_minutes.length; i++){
                    if(id.includes($scope.statsTwoWin.average_40_minutes[i].player_id)) {
                        $scope.statsTwoWinPS.average_40_minutes[j] = JSON.parse(JSON.stringify($scope.statsTwoWin.average_40_minutes[i]));
                        j++;
                    }
                }
                for(var i = 0,j = 0; i < $scope.statsTwoWin.total.length; i++){
                    if(id.includes($scope.statsTwoWin.total[i].player_id)) {
                        $scope.statsTwoWinPS.total[j] = JSON.parse(JSON.stringify($scope.statsTwoWin.total[i]));
                        j++;
                    }
                }


                var temp = {
                    assists: 0,
                    block_shots: 0,
                    df_rebounds: 0,
                    fg_attempts: 0,
                    fg_made: 0,
                    fouls_made: 0,
                    fouls_received: 0,
                    ft_attempts: 0,
                    ft_made: 0,
                    oer: 0,
                    of_rebounds: 0,
                    p2_attempts: 0,
                    p2_made: 0,
                    p3_attempts: 0,
                    p3_made: 0,
                    points: 0,
                    shots_rejected: 0,
                    steals: 0,
                    turnovers: 0,
                    val: 0,
                    vir: 0
                };


                for(item in temp) {
                    var sum = 0;
                    for (var i = 0; i < $scope.statsTwoWinPS.total.length; i++) {
                        sum += $scope.statsTwoWinPS.total[i][item];
                    }
                    temp[item] = sum;
                    $scope.statsTwoWinPS.temp_total = temp;
                }

            };
            leaguesStatsTwoWin();


            //team tendency start select

            var leaguesTeamTendency = function () {
                $scope.teamTendencyGames = {
                    home: true,
                    away: true,
                    won: true,
                    lose: true
                };

                var htmlstring = '';
                for (var i = 0; i < $scope.getLeagueInCurrentSeason.length; i++) {
                    if (i === 0) {
                        htmlstring = htmlstring + '<option selected value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    } else {
                        htmlstring = htmlstring + '<option value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    }
                }
                $scope.teamTendencyLeagueId = $scope.getLeagueInCurrentSeason[0].league_id;
                var temp = $compile(htmlstring)($scope);
                $('#team_tendecy-leagues').html(temp);
                $('#team_tendecy-leagues').selectpicker('refresh');
                // $('#stats2win-leagues').selectpicker('selectAll');
                $('#team_tendecy-games').selectpicker('refresh');
                $('#team_tendecy-games').selectpicker('selectAll');
                $('#team_tendecy-leagues').on('changed.bs.select', function (e) {
                    $scope.teamTendencyLeagueId = $('#team_tendecy-leagues').val();
                    subReportTeamTendency();
                    e.stopImmediatePropagation();
                });
                subReportTeamTendency();
            };
            var subReportTeamTendency = function () {
                var htmlstring = '';
                htmlstring = htmlstring + '<option value="1">' + 'Away Games' +'</option>';
                htmlstring = htmlstring + '<option value="2">' + 'Home Games' +'</option>';
                htmlstring = htmlstring + '<option value="3">' + 'Won Games' +'</option>';
                htmlstring = htmlstring + '<option value="4">' + 'Lost Games' +'</option>';
                var temp = $compile(htmlstring)($scope);
                $('#team_tendecy-sub-report').html(temp);
                $('#team_tendecy-sub-report').selectpicker('refresh');
                $('#team_tendecy-sub-report').selectpicker('selectAll');
                $('#team_tendecy-sub-report').on('changed.bs.select', function (e) {
                    $scope.teamTendencySubSelect($('#team_tendecy-sub-report').val());
                    gamesTeamTendency($scope.teamTendencyLeagueId);
                    e.stopImmediatePropagation();
                });
                gamesTeamTendency($scope.teamTendencyLeagueId);
            };
            $scope.teamTendencySubSelect = function (val) {
                $scope.teamTendencyGames.away = false;
                $scope.teamTendencyGames.home = false;
                $scope.teamTendencyGames.won = false;
                $scope.teamTendencyGames.lose = false;
                if(val != null) {
                    if(val.indexOf('1') != -1) {
                        littleToggle('away');
                    }
                    if(val.indexOf('2') != -1) {
                        littleToggle('home');
                    }
                    if(val.indexOf('3') != -1) {
                        littleToggle('won');
                    }
                    if(val.indexOf('4') != -1) {
                        littleToggle('lose');
                    }
                    function littleToggle(p) {
                        $scope.teamTendencyGames[p] = true;
                    }

                } else {
                    $scope.teamTendencyGames.away = false;
                    $scope.teamTendencyGames.home = false;
                    $scope.teamTendencyGames.won = false;
                    $scope.teamTendencyGames.lose = false;
                }
            };
            var gamesTeamTendency = function (idLeague) {
                TeamInformation.getResultTeam($scope.teamId, $scope.seasonId, idLeague).then(function (response) {
                    var game = response.sort(function (a,b) {
                        return b.game_id - a.game_id;
                    });
                    $scope.homeGame = [];
                    $scope.awayGame = [];
                    $scope.homeGameTemp = [];
                    $scope.awayGameTemp = [];
                    for(var i=0; i < game.length; i++){
                        if(game[i]['place'] === "away"){
                            $scope.awayGame.push(game[i])
                        }else{
                            $scope.homeGame.push(game[i])
                        }
                    }

                    switch($scope.teamTendencyGames.home + ' ' +  $scope.teamTendencyGames.away + ' ' +
                    $scope.teamTendencyGames.won + ' ' + $scope.teamTendencyGames.lose) {
                        case 'true true true true' :
                            $scope.homeGameTemp = $scope.homeGame;
                            $scope.awayGameTemp = $scope.awayGame;
                            break;
                        case 'false false false false' :
                            $scope.homeGameTemp = [];
                            $scope.awayGameTemp = [];
                            break;
                        case 'true false false false' :
                            for (var i = 0; i < $scope.homeGame.length; i++) {
                                if($scope.homeGame[i].team_id == $scope.teamId) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false true false false':
                            for (var i = 0; i < $scope.awayGame.length; i++) {
                                if($scope.awayGame[i].team_id == $scope.teamId) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false false true false' :
                            for (var i=0; i < game.length-1; i+=2) {
                                if (game[i].team_id == $scope.teamId && game[i].won || game[i + 1].team_id == $scope.teamId && game[i + 1].won) {
                                    if (i % 2 == 0) {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i + 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i + 1]);
                                        }
                                    } else {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i - 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i - 1]);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'false false false true' :
                            for (var i=0; i < game.length-1; i+=2) {
                                if (game[i].team_id == $scope.teamId && !game[i].won || game[i + 1].team_id == $scope.teamId && !game[i + 1].won) {
                                    if (i % 2 == 0) {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i + 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i + 1]);
                                        }
                                    } else {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i - 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i - 1]);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'true true false false' :
                            $scope.homeGameTemp = $scope.homeGame;
                            $scope.awayGameTemp = $scope.awayGame;
                            break;
                        case 'true false true false' :
                            for (var i = 0; i < $scope.homeGame.length; i++) {
                                if($scope.homeGame[i].team_id == $scope.teamId && $scope.homeGame[i].won) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'true false false true' :
                            for (var i = 0; i < $scope.homeGame.length; i++) {
                                if($scope.homeGame[i].team_id == $scope.teamId && !$scope.homeGame[i].won) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'true true true false' :
                            for (var i=0; i < game.length-1; i+=2) {
                                if (game[i].team_id == $scope.teamId && game[i].won || game[i + 1].team_id == $scope.teamId && game[i + 1].won) {
                                    if (i % 2 == 0) {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i + 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i + 1]);
                                        }
                                    } else {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i - 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i - 1]);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'true true false true' :
                            for (var i=0; i < game.length-1; i+=2) {
                                if (game[i].team_id == $scope.teamId && game[i].won || game[i + 1].team_id == $scope.teamId && !game[i + 1].won) {
                                    if (i % 2 == 0) {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i + 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i + 1]);
                                        }
                                    } else {
                                        if (game[i].place == 'home') {
                                            $scope.homeGameTemp.push(game[i]);
                                            $scope.awayGameTemp.push(game[i - 1]);
                                        } else {
                                            $scope.awayGameTemp.push(game[i]);
                                            $scope.homeGameTemp.push(game[i - 1]);
                                        }
                                    }
                                }
                            }
                            break;
                        case 'true false true true' :
                            for (var i = 0; i < $scope.homeGame.length; i++) {
                                if($scope.homeGame[i].team_id == $scope.teamId) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false true true true' :
                            for (var i = 0; i < $scope.awayGame.length; i++) {
                                if($scope.awayGame[i].team_id == $scope.teamId) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false true true false' :
                            for (var i = 0; i < $scope.awayGame.length; i++) {
                                if($scope.awayGame[i].team_id == $scope.teamId && $scope.awayGame[i].won) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false true false true' :
                            for (var i = 0; i < $scope.awayGame.length; i++) {
                                if($scope.awayGame[i].team_id == $scope.teamId && !$scope.awayGame[i].won) {
                                    $scope.homeGameTemp.push($scope.homeGame[i]);
                                    $scope.awayGameTemp.push($scope.awayGame[i]);
                                }
                            }
                            break;
                        case 'false false true true' :
                            $scope.homeGameTemp = $scope.homeGame;
                            $scope.awayGameTemp = $scope.awayGame;
                            break;
                        default:
                            $scope.homeGameTemp = [];
                            $scope.awayGameTemp = [];
                            break;
                    }

                    $scope.homeGame = [];
                    $scope.awayGame = [];
                    $scope.homeGame = $scope.homeGameTemp;
                    $scope.awayGame = $scope.awayGameTemp;
                    var htmlstring = '';
                    for(var i=0; i < $scope.awayGame.length; i++){
                        if (i === 0) {
                            htmlstring = htmlstring + '<option selected value="' + $scope.awayGame[i].game_id +  '">' + $scope.awayGame[i].game_date.split('-').reverse().join('-') + ' ' + $scope.homeGame[i].team_name + ' - '  + $scope.awayGame[i].team_name +'</option>';
                        } else {
                            htmlstring = htmlstring + '<option value="' + $scope.awayGame[i].game_id +  '">' + $scope.awayGame[i].game_date.split('-').reverse().join('-') + ' ' + $scope.homeGame[i].team_name + ' - '  + $scope.awayGame[i].team_name + '</option>';
                        }
                    }
                    var temp = $compile(htmlstring)($scope);
                    if(htmlstring == '') {}
                    $('#team_tendecy-games').html(temp);
                    $('#team_tendecy-games').on('changed.bs.select', function (e) {
                        gameTendencyTeam($('#team_tendecy-games').val());
                        e.stopImmediatePropagation();
                    });
                    $('#team_tendecy-games').selectpicker('refresh');
                    $('#team_tendecy-games').selectpicker('selectAll');
                    // $timeout(function(){
                    //     $('#team_tendecy-games').selectpicker('deselectAll');
                    //     $('#team_tendecy-games').selectpicker('selectAll');
                    // });

                    function gameTendencyTeam(games) {
                        $scope.teamTendencyShotPercentage = [];
                        TeamInformation.getGameStatsTeamTendency(games,+$scope.teamId)
                            .then(function (data) {
                                $scope.statsGameTeamTendecy = data;
                                $scope.plusMinus = $scope.statsGameTeamTendecy[9].data.plus_minus.sort((a, b) => b.points - a.points);
                                $scope.defensive = $scope.statsGameTeamTendecy[9].data.defensive.sort((a, b) => b.points - a.points);
                                $scope.offensive = $scope.statsGameTeamTendecy[9].data.offensive.sort((a, b) => b.points - a.points);
                                response = $scope.statsGameTeamTendecy[2].data[0].shots;
                                var count = 0;
                                var made = [];
                                var attempt = [];
                                for (var j = 0; j < response.length; j++) {
                                    count++;
                                    if(response[j].results[0].name.includes('Attempt')) {
                                                attempt.push(response[j].position);
                                            } else {
                                                made.push(response[j].position);
                                            }
                                        }
                                        $scope.teamTendencyShotPercentage.push(drawPercentage(made, attempt, true));
                            })
                            .then(function () {
                                teamTendencyShotAnalysis();
                            })
                            .then(function () {
                                drawShotsTeamTendencyPie();
                            })
                            .then(function () {
                                teamTendencyDirectionChart();
                            })
                            .then(function () {
                                teamTendencyAssistAnalysis();
                            })
                            .then(function () {
                                teamTendencyTurnoverAnalysis();
                            });


                        function teamTendencyShotAnalysis() {
                            var charData = [];
                            ($scope.statsGameTeamTendecy[0].data.sort((a, b) => b.attempts - a.attempts)).forEach(function (obj) {
                                var object = {
                                    name: obj.name === null ? obj.attempts + ' other' : obj.attempts + ' ' + obj.name,
                                    data: [obj.attempts],
                                    color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                                    labels: {visible: true}
                                };
                                charData.push(object);
                            });

                            $('.team_shot-analysis').kendoChart({
                                valueAxis: {
                                    labels: {
                                        font: "10px Arial,Helvetica,sans-serif"
                                    }
                                },
                                title: {
                                    text: 'Shot Analysis',
                                    font: "15px Arial,Helvetica,sans-serif",
                                    color: 'black',
                                    align: "center"
                                },
                                legend: {
                                    font: "10px Arial,Helvetica,sans-serif",
                                    position: 'right'

                                },
                                series: charData,
                                tooltip: {
                                    visible: true,
                                    background: '#000000',
                                    color: '#ffffff',
                                    padding: 5,
                                    template: "${series.name.split(' ').slice(1).join(' ')} - ${value}",
                                    font: "11px Arial,Helvetica,sans-serif"
                                }
                            });
                        }

                        function drawShotsTeamTendencyPie() {
                            var temp={}, dataarr =[], dataVal = [];
                            var sum = 0;
                            for (var i = 0; i < $scope.statsGameTeamTendecy[1].data.length; i++){
                                sum += $scope.statsGameTeamTendecy[1].data[i].attempts;
                            }
                            $scope.statsGameTeamTendecy[1].data.forEach(function (obj) {

                                dataVal.push((obj.attempts*100 / sum).toFixed(0));
                                dataarr.push({
                                    category: obj.name,
                                    value: obj.attempts
                                })
                            });
                            var templink =[
                                {name:"2 Points Made In The Paint", id:1, color: '#efa144',value:dataVal[2] == 'Infinity'? '0': dataVal[2]},
                                {name:"2 Points Missed In The Paint", id:17, color: '#acb338', value:dataVal[1] == 'Infinity'? '0' : dataVal[1]},
                                {name:"2 Points Made Out Of The Paint",id:2, color:'#839f43', value:dataVal[3] == 'Infinity'? '0' : dataVal[3]},
                                {name:"2 Points Missed Out Of The Paint", id:18, color: '#577834',value:dataVal[5] == 'Infinity'? '0' : dataVal[5]},
                                {name:"3 Points Made", id:3, color: '#ec813d',value:dataVal[0] == 'Infinity'? '0' : dataVal[0]},
                                {name:"3 Points Missed",color:'#f3ba4e',id:19,value:dataVal[4] == 'Infinity'? '0' : dataVal[4]}
                            ];

                            $scope.links = templink;
                            $('#team_tendency-pie').kendoChart({
                                title: {
                                    position: "top",
                                    margin: {
                                        top: 1,
                                        right: 1,
                                        bottom: 1,
                                        left: 1
                                    },
                                    padding: {
                                        top: 1,
                                        right: 1,
                                        bottom: 1,
                                        left: 1
                                    }
                                },
                                legend: {
                                    visible: false
                                },
                                chartArea: {
                                    background: "transparent",
                                    height: 300,
                                    width: 320
                                },
                                seriesDefaults: {
                                    labels: {
                                        visible: false
                                    }
                                },
                                series: [{
                                    type: "pie",
                                    data: dataarr
                                }],
                                tooltip: {
                                    visible: true,
                                    background: '#000000',
                                    color: '#ffffff',
                                    padding: 5,
                                    template: "${value} shots - ${data.category}",
                                    font: "13px Arial,Helvetica,sans-serif"
                                }
                            });
                        }

                        function teamTendencyDirectionChart() {
                            $scope.shotGaugeData = $scope.statsGameTeamTendecy[0].data.filter(function(obj){return Boolean(obj.name);});
                            var right = 0,
                                left = 0,
                                nodirection = 0,
                                other = 0,
                                all;

                            for (var i = 0; i < $scope.statsGameTeamTendecy[0].data.length; i++) {
                                if ($scope.statsGameTeamTendecy[0].data[i].name === null) {
                                    other += $scope.statsGameTeamTendecy[0].data[i].made + $scope.statsGameTeamTendecy[0].data[i].attempts;
                                } else if ($scope.statsGameTeamTendecy[0].data[i].name.indexOf('Right') !== -1) {
                                    right += $scope.statsGameTeamTendecy[0].data[i].made + $scope.statsGameTeamTendecy[0].data[i].attempts;
                                } else if ($scope.statsGameTeamTendecy[0].data[i].name.indexOf('Left') !== -1) {
                                    left += $scope.statsGameTeamTendecy[0].data[i].made + $scope.statsGameTeamTendecy[0].data[i].attempts;
                                } else {
                                    nodirection += $scope.statsGameTeamTendecy[0].data[i].made + $scope.statsGameTeamTendecy[0].data[i].attempts;
                                }
                            }
                            all = right + left + nodirection;
                            $('.team_direction-chart').kendoChart({
                                valueAxis: {
                                    labels: {
                                        font: "10px Arial,Helvetica,sans-serif"
                                    }
                                },
                                title: {
                                    text: 'Direction Tendency',
                                    font: "15px Arial,Helvetica,sans-serif",
                                    color: 'black',
                                    align: "center"
                                },
                                legend: {
                                    font: "10px Arial,Helvetica,sans-serif",
                                    position: 'right'
                                },
                                series: [
                                    {
                                        name: Math.round(left / all * 100) + '% Going Left',
                                        data: [Math.round(left / all * 100)],
                                        color: 'red',
                                        labels: {visible: true}
                                    },
                                    {
                                        name: Math.round(right / all * 100) + '% Going Right',
                                        data: [Math.round(right / all * 100)],
                                        color: 'blue',
                                        labels: {visible: true}
                                    },
                                    {
                                        name: Math.round(nodirection / all * 100) + '% No direction',
                                        data: [Math.round(nodirection / all * 100)],
                                        color: '#d6d8d8',
                                        labels: {visible: true}
                                    }

                                ],
                                tooltip: {
                                    visible: true,
                                    background: '#000000',
                                    color: '#ffffff',
                                    padding: 5,
                                    template: "${series.name.split(' ').slice(1).join(' ')} - ${value}%",
                                    font: "11px Arial,Helvetica,sans-serif"
                                },
                                chartArea: {
                                    width: 447,
                                    height: 250
                                }
                            });
                        }


                        function teamTendencyAssistAnalysis() {
                            var chartData = [];
                            for (var i = 0; i < ($scope.statsGameTeamTendecy[3].data.sort((a, b) => b.count - a.count)).length; i++) {
                                var obj = {
                                    name: $scope.statsGameTeamTendecy[3].data[i].name === null ? $scope.statsGameTeamTendecy[3].data[i].count + ' other' : $scope.statsGameTeamTendecy[3].data[i].count + ' ' + $scope.statsGameTeamTendecy[3].data[i].name,
                                    data: [$scope.statsGameTeamTendecy[3].data[i].count],
                                    color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                                    labels: {visible: true}
                                };
                                chartData.push(obj);
                            }

                            $('.team_assist-analysis').kendoChart({
                                valueAxis: {
                                    labels: {
                                        font: "10px Arial,Helvetica,sans-serif"
                                    }
                                },
                                title: {
                                    text: 'Assists Analysis',
                                    font: "15px Arial,Helvetica,sans-serif",
                                    color: 'black',
                                },
                                legend: {
                                    font: "10px Arial,Helvetica,sans-serif",
                                    position: 'right',
                                },
                                series: chartData,
                                tooltip: {
                                    visible: true,
                                    background: '#000000',
                                    color: '#ffffff',
                                    padding: 5,
                                    template: "${series.name.split(' ').slice(1).join(' ')} - ${value}",
                                    font: "11px Arial,Helvetica,sans-serif"
                                }
                            });
                        }

                        function teamTendencyTurnoverAnalysis() {
                            var chartData = [];
                            for (var i = 0; i < ($scope.statsGameTeamTendecy[4].data.sort((a, b) => b.count - a.count)).length; i++) {
                                var obj = {
                                    name: $scope.statsGameTeamTendecy[4].data[i].name === null ? $scope.statsGameTeamTendecy[4].data[i].count + ' other' : $scope.statsGameTeamTendecy[4].data[i].count + ' ' + $scope.statsGameTeamTendecy[4].data[i].name,
                                    data: [$scope.statsGameTeamTendecy[4].data[i].count],
                                    color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                                    labels: {visible: true}
                                };
                                chartData.push(obj);
                            }

                            $('.team_turnover-analysis').kendoChart({
                                valueAxis: {
                                    labels: {
                                        font: "10px Arial,Helvetica,sans-serif"
                                    }
                                },
                                title: {
                                    text: 'Turnover Analysis',
                                    font: "15px Arial,Helvetica,sans-serif",
                                    color: 'black',
                                },
                                legend: {
                                    font: "10px Arial,Helvetica,sans-serif",
                                    position: 'right',
                                },
                                series: chartData,
                                tooltip: {
                                    visible: true,
                                    background: '#000000',
                                    color: '#ffffff',
                                    padding: 5,
                                    template: "${series.name.split(' ').slice(1).join(' ')} - ${value}",
                                    font: "11px Arial,Helvetica,sans-serif"
                                }
                            });
                        }


                    }

                });


            };
            leaguesTeamTendency();
            //end team tendency
        };
        //end PS

        $scope.quarterSelectForShotCharts = function () {
            var htmlstring = '';
            var k = 0;
            for(var i in $scope.shotChartQuarters1) {
                var id = $scope.shotChartQuarters1[i][0];
                htmlstring = htmlstring + '<option value="' + id.game_period_id + '">' + Object.keys($scope.shotChartQuarters1)[k] + '</option>';
                k++;
            };
            // console.log($scope.shotChartQuarters1);
            var temp = $compile(htmlstring)($scope);
            $('#quarter-search').html(temp);
            $('#quarter-search').selectpicker('refresh');
            $('#quarter-search').selectpicker('selectAll');
            $('#quarter-search').on('changed.bs.select', function (e) {
                var quartersId = $('#quarter-search').val() ? $('#quarter-search').val().map(Number): [];
                drawPlayerSelect(quartersId);
                drawPossessionsQuarterSelect(quartersId);
                drawDefensiveQuarterSelect(quartersId);
                e.stopPropagation();
            });
        };

        $scope.playerSelectForShotCharts = function () {
            var htmlstring = '';
            var k = 0;
            for(var i in $scope.shotChartPlayers1) {
                var id = $scope.shotChartPlayers1[i][0];
                htmlstring = htmlstring + '<option value="' + id.player_id +'">' + Object.keys($scope.shotChartPlayers1)[k] +'</option>';
                k++;
            };
            var temp = $compile(htmlstring)($scope);
            $('#player-search').html(temp);
            $('#player-search').selectpicker('refresh');
            $('#player-search').selectpicker('selectAll');
            $('#player-search').on('changed.bs.select', function (e) {
                var playersId = $('#player-search').val() ? $('#player-search').val().map(Number): [];
                drawPossessionsSelect(playersId);
                drawDefensiveSelect(playersId);
                e.stopPropagation();
            });
        };


        $scope.possessionsSelectForShotCharts = function () {
            var htmlstring = '';
            var k = 0;
            for(var i in  $scope.shotChartPossessions1) {
                var id = $scope.shotChartPossessions1[i][0];
                htmlstring = htmlstring + '<option value="' + id.possession_type_id +'">' + Object.keys($scope.shotChartPossessions1)[k] +'</option>';
                k++;
            };
            var temp = $compile(htmlstring)($scope);
            $('#possessions-search').html(temp);
            $('#possessions-search').selectpicker('refresh');
            $('#possessions-search').selectpicker('selectAll');
            $('#possessions-search').on('changed.bs.select', function (e) {
                var possessionsId = $('#possessions-search').val() ? $('#possessions-search').val().map(Number): [];
                drawDefensivePossSelect(possessionsId);
                e.stopPropagation();
            });
        };


        $scope.defensiveSelectForShotCharts = function () {
            var htmlstring = '';
            var k = 0;
            for(var i  in $scope.shotChartDefensive1) {
                var id = $scope.shotChartDefensive1[i][0];
                htmlstring = htmlstring + '<option selected value="' + id.defensive_type_id +'">' + Object.keys($scope.shotChartDefensive1)[k] +'</option>';
                k++;
            };
            var temp = $compile(htmlstring)($scope);
            $('#defensive-search').html(temp);
            $('#defensive-search').selectpicker('refresh');
            $('#defensive-search').selectpicker('selectAll');
            $('#defensive-search').on('changed.bs.select', function (e) {
                sortDotsOrMark();
                e.stopPropagation();
            });
        };

        $scope.madeOrMissSelectForShotCharts = function () {
            var htmlstring = '';
            htmlstring = htmlstring + '<option value="1">' + 'Shots made' +'</option>';
            htmlstring = htmlstring + '<option value="2">' + 'Shots missed' +'</option>';
            var temp = $compile(htmlstring)($scope);
            $('#shots-made-or-miss').html(temp);
            $('#shots-made-or-miss').selectpicker('refresh');
            $('#shots-made-or-miss').selectpicker('selectAll');
            $('#shots-made-or-miss').on('changed.bs.select', function () {
                if($('#shots-made-or-miss').val() == null){
                    $('.mark').hide();
                    $('.circle').hide();
                }else if($('#shots-made-or-miss').val() == 1){
                    $('.mark').hide();
                    $('.circle').show();
                }else if($('#shots-made-or-miss').val() == 2){
                    $('.mark').show();
                    $('.circle').hide();
                }else{
                    $('.mark').show();
                    $('.circle').show();
                }

            });
        };

        function drawPlayerSelect(quartersId){
            var possessions = [];
            for(var i in $scope.shotChartPlayers1) {
                var select = false;
                for (var j in $scope.shotChartPlayers1[i]){
                    if  (quartersId.includes($scope.shotChartPlayers1[i][j].game_period_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    possessions.push($scope.shotChartPlayers1[i][0].player_id);
                }
            };
            $('#player-search').selectpicker('val', possessions);
            $('#player-search').selectpicker('refresh');
        };

        function drawPossessionsSelect(playersId){
            var defensive = [];
            for(var i in $scope.shotChartPossessions1) {
                var select = false;
                for (var j in $scope.shotChartPossessions1[i]){
                    if  (playersId.includes($scope.shotChartPossessions1[i][j].player_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    defensive.push($scope.shotChartPossessions1[i][0].possession_type_id);
                }
            };
            $('#possessions-search').selectpicker('val', defensive);
            $('#possessions-search').selectpicker('refresh');
        };

        function drawPossessionsQuarterSelect(quartersId){
            var possessions = [];
            for(var i in $scope.shotChartPossessions1) {
                var select = false;
                for (var j in $scope.shotChartPossessions1[i]){
                    if  (quartersId.includes($scope.shotChartPossessions1[i][j].game_period_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    possessions.push($scope.shotChartPossessions1[i][0].possession_type_id);
                }
            };
            $('#possessions-search').selectpicker('val', possessions);
            $('#possessions-search').selectpicker('refresh');
        };


        function drawDefensiveSelect(playersId){
            var defensive = [];
            for(var i in $scope.shotChartDefensive1) {
                var select = false;
                for (var j in $scope.shotChartDefensive1[i]){
                    if  (playersId.includes($scope.shotChartDefensive1[i][j].player_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    defensive.push($scope.shotChartDefensive1[i][0].defensive_type_id);
                }
            };
            $('#defensive-search').selectpicker('val', defensive);
            $('#defensive-search').selectpicker('refresh');
            sortDotsOrMark();
        };

        function drawDefensiveQuarterSelect(quartersId){
            var defensive = [];
            for(var i in $scope.shotChartDefensive1) {
                var select = false;
                for (var j in $scope.shotChartDefensive1[i]){
                    if  (quartersId.includes($scope.shotChartDefensive1[i][j].game_period_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    defensive.push($scope.shotChartDefensive1[i][0].defensive_type_id);
                }
            };
            $('#defensive-search').selectpicker('val', defensive);
            $('#defensive-search').selectpicker('refresh');
            sortDotsOrMark();
        };

        function drawDefensivePossSelect(possessionsId){
            var defensive = [];
            for(var i in $scope.shotChartDefensive1) {
                var select = false;
                for (var j in $scope.shotChartDefensive1[i]){
                    if  (possessionsId.includes($scope.shotChartDefensive1[i][j].possession_type_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    defensive.push($scope.shotChartDefensive1[i][0].defensive_type_id);
                }
            };
            $('#defensive-search').selectpicker('val', defensive);
            $('#defensive-search').selectpicker('refresh');
            sortDotsOrMark();
        };

        function sortDotsOrMark(){
            $scope.shots2pm = [];
            $scope.shots2pa = [];
            var playerId = $('#player-search').val() ? $('#player-search').val().map(Number): [];
            var quarterId = $('#quarter-search').val() ? $('#quarter-search').val().map(Number) : [];
            var possessionId = $('#possessions-search').val() ? $('#possessions-search').val().map(Number) : [];
            var defensiveId = $('#defensive-search').val() ? $('#defensive-search').val().map(Number) : [];

            for(var i =0; i < $scope.team1Videos.length; i++) {
                if(playerId.includes($scope.team1Videos[i].player_id) && quarterId.includes($scope.team1Videos[i].game_period_id) && possessionId.includes($scope.team1Videos[i].possession_type_id) && defensiveId.includes($scope.team1Videos[i].defensive_type_id)){
                    drawDotsOrMark($scope.team1Videos[i]);
                }
            }
            $scope.team2Percentage = drawPercentage($scope.shots2pm, $scope.shots2pa);
        };

        $scope.shots2pm = [];
        $scope.shots2pa = [];

        function drawDotsOrMark(video) {
            if (video.action_id === 1 && video.action_result_id === 1 || video.action_result_id === 2 || video.action_result_id === 3) {
                $scope.shots2pm.push(video);
            }else if (video.action_id === 1 && video.action_result_id === 17 || video.action_result_id === 18 || video.action_result_id === 19) {
                $scope.shots2pa.push(video);
            }
        }

        // Shot Chart Team1 end

        // Shot Chart Team2
        $scope.quarterSelectForShotChartsTeam2 = function () {
            var htmlstring = '';
            var k = 0;
            for(var i in $scope.shotChartQuarters2) {
                var id = $scope.shotChartQuarters2[i][0];
                htmlstring = htmlstring + '<option value="' + id.game_period_id + '">' + Object.keys($scope.shotChartQuarters2)[k] + '</option>';
                k++;
            };
            var temp = $compile(htmlstring)($scope);
            $('#quarter-search-away').html(temp);
            $('#quarter-search-away').selectpicker('refresh');
            $('#quarter-search-away').selectpicker('selectAll');
            $('#quarter-search-away').on('changed.bs.select', function (e) {
                var quartersId = $('#quarter-search-away').val() ? $('#quarter-search-away').val().map(Number): [];
                drawPlayerQuarterSelectTeam2(quartersId);
                drawPossessionsQuarterSelectTeam2(quartersId);
                drawDefensiveQuarterSelectTeam2(quartersId);
                e.stopPropagation();
            });
        };

        $scope.playerSelectForShotChartsTeam2 = function () {
            var htmlstring = '';
            var k = 0;
            for(var i in $scope.shotChartPlayers2) {
                var id = $scope.shotChartPlayers2[i][0];
                htmlstring = htmlstring + '<option value="' + id.player_id +'">' + Object.keys($scope.shotChartPlayers2)[k] +'</option>';
                k++;
            };
            var temp = $compile(htmlstring)($scope);
            $('#player-search-away').html(temp);
            $('#player-search-away').selectpicker('refresh');
            $('#player-search-away').selectpicker('selectAll');
            $('#player-search-away').on('changed.bs.select', function (e) {
                var playersId = $('#player-search-away').val() ? $('#player-search-away').val().map(Number): [];
                drawPossessionsPlayersSelectTeam2(playersId);
                drawDefensiveSelectTeam2(playersId);
                e.stopPropagation();
            });
        };

        $scope.possessionsSelectForShotChartsTeam2 = function () {
            var htmlstring = '';
            var k = 0;
            for(var i in  $scope.shotChartPossessions2) {
                var id = $scope.shotChartPossessions2[i][0];
                htmlstring = htmlstring + '<option value="' + id.possession_type_id +'">' + Object.keys($scope.shotChartPossessions2)[k] +'</option>';
                k++;
            };
            var temp = $compile(htmlstring)($scope);
            $('#possessions-search-away').html(temp);
            $('#possessions-search-away').selectpicker('refresh');
            $('#possessions-search-away').selectpicker('selectAll');
            $('#possessions-search-away').on('changed.bs.select', function (e) {
                var possessionsId = $('#possessions-search-away').val() ? $('#possessions-search-away').val().map(Number): [];
                drawDefensivePossSelectTeam2(possessionsId);
                e.stopPropagation();
            });
        };

        $scope.defensiveSelectForShotChartsTeam2 = function () {
            var htmlstring = '';
            var k = 0;
            for(var i  in $scope.shotChartDefensive2) {
                var id = $scope.shotChartDefensive2[i][0];
                htmlstring = htmlstring + '<option selected value="' + id.defensive_type_id +'">' + Object.keys($scope.shotChartDefensive2)[k] +'</option>';
                k++;
            };
            var temp = $compile(htmlstring)($scope);
            $('#defensive-search-away').html(temp);
            $('#defensive-search-away').selectpicker('refresh');
            $('#defensive-search-away').selectpicker('selectAll');
            $('#defensive-search-away').on('changed.bs.select', function (e) {
                sortDotsOrMarkTeam2();

                e.stopPropagation();
            });
        };

        $scope.madeOrMissSelectForShotChartsTeam2 = function () {
            var htmlstring = '';
            htmlstring = htmlstring + '<option value="1">' + 'Shots made' +'</option>';
            htmlstring = htmlstring + '<option value="2">' + 'Shots missed' +'</option>';
            var temp = $compile(htmlstring)($scope);
            $('#shots-made-or-miss-away').html(temp);
            $('#shots-made-or-miss-away').selectpicker('refresh');
            $('#shots-made-or-miss-away').selectpicker('selectAll');
            $('#shots-made-or-miss-away').on('changed.bs.select', function () {
                if($('#shots-made-or-miss-away').val() == null){
                    $('.mark').hide();
                    $('.circle').hide();
                }else if($('#shots-made-or-miss-away').val() == 1){
                    $('.mark').hide();
                    $('.circle').show();
                }else if($('#shots-made-or-miss-away').val() == 2){
                    $('.mark').show();
                    $('.circle').hide();
                }else{
                    $('.mark').show();
                    $('.circle').show();
                }

            });
        };


        function drawPlayerQuarterSelectTeam2(quartersId){
            var possessions = [];
            for(var i in $scope.shotChartPlayers2) {
                var select = false;
                for (var j in $scope.shotChartPlayers2[i]){
                    if  (quartersId.includes($scope.shotChartPlayers2[i][j].game_period_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    possessions.push($scope.shotChartPlayers2[i][0].player_id);
                }
            };
            $('#player-search-away').selectpicker('val', possessions);
            $('#player-search-away').selectpicker('refresh');
        };

        function drawPossessionsQuarterSelectTeam2(quartersId){
            var possessions = [];
            for(var i in $scope.shotChartPossessions2) {
                var select = false;
                for (var j in $scope.shotChartPossessions2[i]){
                    if  (quartersId.includes($scope.shotChartPossessions2[i][j].game_period_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    possessions.push($scope.shotChartPossessions2[i][0].possession_type_id);
                }
            };
            $('#possessions-search-away').selectpicker('val', possessions);
            $('#possessions-search-away').selectpicker('refresh');
        };

        function drawPossessionsPlayersSelectTeam2(playersId){
            var defensive = [];
            for(var i in $scope.shotChartPossessions2) {
                var select = false;
                for (var j in $scope.shotChartPossessions2[i]){
                    if  (playersId.includes($scope.shotChartPossessions2[i][j].player_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    defensive.push($scope.shotChartPossessions2[i][0].possession_type_id);
                }
            };
            $('#possessions-search-away').selectpicker('val', defensive);
            $('#possessions-search-away').selectpicker('refresh');
        };


        function drawDefensiveSelectTeam2(playersId){
            var defensive = [];
            for(var i in $scope.shotChartDefensive2) {
                var select = false;
                for (var j in $scope.shotChartDefensive2[i]){
                    if  (playersId.includes($scope.shotChartDefensive2[i][j].player_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    defensive.push($scope.shotChartDefensive2[i][0].defensive_type_id);
                }
            };
            $('#defensive-search-away').selectpicker('val', defensive);
            $('#defensive-search-away').selectpicker('refresh');
            sortDotsOrMarkTeam2();
        };

        function drawDefensiveQuarterSelectTeam2(quartersId){
            var defensive = [];
            for(var i in $scope.shotChartDefensive2) {
                var select = false;
                for (var j in $scope.shotChartDefensive2[i]){
                    if  (quartersId.includes($scope.shotChartDefensive2[i][j].game_period_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    defensive.push($scope.shotChartDefensive2[i][0].defensive_type_id);
                }
            }
            $('#defensive-search-away').selectpicker('val', defensive);
            $('#defensive-search-away').selectpicker('refresh');
            sortDotsOrMarkTeam2();
        };

        function drawDefensivePossSelectTeam2(possessionsId){
            var defensive = [];
            for(var i in $scope.shotChartDefensive2) {
                var select = false;
                for (var j in $scope.shotChartDefensive2[i]){
                    if  (possessionsId.includes($scope.shotChartDefensive2[i][j].possession_type_id)){
                        select = true;
                        break;
                    }
                }
                if (select){
                    defensive.push($scope.shotChartDefensive2[i][0].defensive_type_id);
                }
            }
            $('#defensive-search-away').selectpicker('val', defensive);
            $('#defensive-search-away').selectpicker('refresh');
            sortDotsOrMarkTeam2();
        };

        function sortDotsOrMarkTeam2(){
            $scope.shots2pmTeam2 = [];
            $scope.shots2paTeam2 = [];
            $scope.shots2ppmTeam2 = [];
            $scope.shots2ppaTeam2 = [];
            $scope.shots3pmTeam2 = [];
            $scope.shots3paTeam2 = [];


            var playerId = $('#player-search-away').val() ? $('#player-search-away').val().map(Number): [];
            var quarterId = $('#quarter-search-away').val() ? $('#quarter-search-away').val().map(Number) : [];
            var possessionId = $('#possessions-search-away').val() ? $('#possessions-search-away').val().map(Number) : [];
            var defensiveId = $('#defensive-search-away').val() ? $('#defensive-search-away').val().map(Number) : [];

            for(var i =0; i < $scope.team2Videos.length; i++) {
                if(playerId.includes($scope.team2Videos[i].player_id) && quarterId.includes($scope.team2Videos[i].game_period_id) && possessionId.includes($scope.team2Videos[i].possession_type_id) && defensiveId.includes($scope.team2Videos[i].defensive_type_id)){
                    drawDotsOrMarkTeam2($scope.team2Videos[i]);
                }
            }
            //shot Percentage function call
            $scope.team2Percentage = drawPercentage($scope.shots2pmTeam2, $scope.shots2paTeam2);


            //shot Percentage end

            $scope.pointsArrMade = $scope.shots2pmTeam2.filter(function (t) { return{x: t.position_x, y: t.position_y} });
            $scope.pointsArrAtt = $scope.shots2paTeam2.filter(function (t) { return{x: t.position_x, y: t.position_y} });

        };

        $scope.shots2pmTeam2 = [];
        $scope.shots2paTeam2 = [];
        $scope.Allo = [];
        // $scope.shots2ppmTeam2 = [];
        // $scope.shots2ppaTeam2 = [];
        // $scope.shots3pmTeam2 = [];
        // $scope.shots3paTeam2 = [];
        function drawDotsOrMarkTeam2(video) {
            if (video.action_id === 1 && video.action_result_id === 1 || video.action_result_id === 2 || video.action_result_id === 3) {
                $scope.shots2pmTeam2.push(video);
            }else if (video.action_id === 1 && video.action_result_id === 17 || video.action_result_id === 18 || video.action_result_id === 19) {
                $scope.shots2paTeam2.push(video);
            }

        }
        function drawPercentage(shots2pm, shots2pa, tendency) {
            var pointInSvgPolygon = require("point-in-svg-polygon");
            var area1 = 'M1,174.027 1,1 36.989,1 35.012,174.972z';
            var area2 = 'M204.313,238.517c-56.438-29.461-93.308-72.306-109.594-127.363C81.502,66.472,85.463,26.396,87.366,7.137C87.609,4.673,87.81,2.642,87.934,1h18.95c0.713,0.694,1.564,4.945,2.463,9.44c4.76,23.794,17.396,86.981,94.078,129.385c1.077,1.61,2.273,15.612,2.147,50.013C205.49,212.214,204.852,233.435,204.313,238.517z';
            var area3 = 'M155.89,320.768c-49.676-29.915-79.611-68.209-95.996-95.12c-17.126-28.128-23.383-49.936-23.894-51.779L36.994,0.157C40.271,0.518,48.685,0.817,60.985,1c0.633,0.009,1.403,0.013,2.278,0.013c2.688,0,6.365-0.038,10.063-0.077c3.733-0.039,7.487-0.078,10.263-0.078c1.758,0,2.774,0.017,3.362,0.037c-0.077,1.231-0.208,2.828-0.367,4.739C75.125,144.33,143.909,208.315,203.929,237.591C201.32,244.959,161.301,314.253,155.89,320.768z';
            var area4 = 'M203,0c-0.847,0.763-97,0-97,0c15.667,107.33,99.524,143.453,99,139C204.333,133.333,203.222-0.2,203,0z';
            var area5 = 'M300.502,164.212c-51.953-0.002-90.866-22.037-95.51-24.783L203.014,0h190.989c0.142,46.153,0.322,131.302,0.044,138.4c-29.209,17.127-60.678,25.812-93.535,25.812C300.508,164.212,300.507,164.212,300.502,164.212z';
            var area6 = 'M394.81,136.518c-0.768-13.219,0.055-125.164,0.177-135.674c3.727-0.293,21.307-0.486,45.338-0.486c25.194,0,47.165,0.211,52.315,0.486c-1.468,4.15-2.908,8.401-4.427,12.879C474.05,55.501,456.443,107.43,394.81,136.518z';
            var area7 = 'M394.644,238.663c-0.779-6.467-0.652-43.71-0.567-68.854c0.056-16.263,0.099-29.109-0.081-30.909c0.212-0.648,3.361-2.431,6.406-4.154c18.377-10.403,67.191-38.037,92.565-133.489c0.011-0.042,0.087-0.138,0.292-0.257h13.87c2.478,0.315,4.638,0.661,5.782,0.846c0.007,0.78,0.067,1.984,0.162,3.893c0.74,14.823,2.992,59.933-11.011,108.291C484.418,174.967,448.283,216.893,394.644,238.663z';
            var area8 = 'M442.508,318.852c-0.865-1.487-3.169-5.181-8.62-13.889c-11.28-18.022-37.254-59.518-38.916-65.287c70.372-29.747,98.724-93.246,110.115-141.346C516.309,50.952,513.73,8.735,513.086,1h48.926c0.703,58.162,1.806,167.26,1.04,171.674c-24.715,57.622-55.558,94.042-77.085,114.454C463.317,308.604,445.911,317.504,442.508,318.852z';
            var area9 = 'M562.006,1 599,1 599,174.026 562.994,174.974z';
            var area10 = 'M204,238.005v-97.434c8.447,3.881,52.589,23.212,93.995,23.428l0.799,0.002c44.248-0.002,86.018-19.364,94.222-23.39l0.975,98.383L204,238.005z';
            var area11 = 'M294.506,361.791c-79.364-0.007-131.671-37.165-138.196-42.049l47.262-80.741l190.062,0.563c4.658,6.518,46.634,73.806,48.409,80.827c-48.974,27.47-98.607,41.4-147.516,41.4C294.518,361.791,294.516,361.791,294.506,361.791z';
            var area12 = 'M0.002,174.956c2.929-0.128,12.091-0.497,20.366-0.497c11.893,0,14.281,0.776,14.743,1.029c27.242,79.043,111.615,140.463,120.561,146.8L0.991,586.33L0.002,174.956z';
            var area13 = 'M599,585.895c-57.748-95.841-152.684-254.967-155.983-266.313C513.714,280.307,558.772,183.555,562.647,175H599V585.895z';
            var area14 = 'M1,589v-2.146l155.303-265.392c7.493,5.373,60.333,41.132,138.31,41.132c0.01,0,0.009,0,0.019,0c49.569-0.003,99.365-14.214,148.024-42.24c5.615,9.413,58.663,100.52,101.66,174.364c26.506,45.522,49.43,84.893,54.684,93.861V589H1z';

            if (shots2pm.length + shots2pa.length === 0) {
                return {
                    area1:  'NaN',
                    area2:  'NaN',
                    area3:  'NaN',
                    area4:  'NaN',
                    area5:  'NaN',
                    area6:  'NaN',
                    area7:  'NaN',
                    area8:  'NaN',
                    area9:  'NaN',
                    area10: 'NaN',
                    area11: 'NaN',
                    area12: 'NaN',
                    area13: 'NaN',
                    area14: 'NaN',
                    areasMade: {
                        area1:  0,
                        area2:  0,
                        area3:  0,
                        area4:  0,
                        area5:  0,
                        area6:  0,
                        area7:  0,
                        area8:  0,
                        area9:  0,
                        area10: 0,
                        area11: 0,
                        area12: 0,
                        area13: 0,
                        area14: 0
                    },
                    areasAtt: {
                        area1:  0,
                        area2:  0,
                        area3:  0,
                        area4:  0,
                        area5:  0,
                        area6:  0,
                        area7:  0,
                        area8:  0,
                        area9:  0,
                        area10: 0,
                        area11: 0,
                        area12: 0,
                        area13: 0,
                        area14: 0
                    }
                }
            }
            var shotsMade = [];
            var shotsAtt = [];
            if(tendency) {
                shots2pm.forEach(function (v) {
                    shotsMade.push({
                        area1:  pointInSvgPolygon.isInside([v['x'], v['y']], area1),
                        area2:  pointInSvgPolygon.isInside([v['x'], v['y']], area2),
                        area3:  pointInSvgPolygon.isInside([v['x'], v['y']], area3),
                        area4:  pointInSvgPolygon.isInside([v['x'], v['y']], area4),
                        area5:  pointInSvgPolygon.isInside([v['x'], v['y']], area5),
                        area6:  pointInSvgPolygon.isInside([v['x'], v['y']], area6),
                        area7:  pointInSvgPolygon.isInside([v['x'], v['y']], area7),
                        area8:  pointInSvgPolygon.isInside([v['x'], v['y']], area8),
                        area9:  pointInSvgPolygon.isInside([v['x'], v['y']], area9),
                        area10: pointInSvgPolygon.isInside([v['x'], v['y']], area10),
                        area11: pointInSvgPolygon.isInside([v['x'], v['y']], area11),
                        area12: pointInSvgPolygon.isInside([v['x'], v['y']], area12),
                        area13: pointInSvgPolygon.isInside([v['x'], v['y']], area13),
                        area14: pointInSvgPolygon.isInside([v['x'], v['y']], area14)
                    });
                });
                shots2pa.forEach(function (v) {
                    shotsAtt.push({
                        area1:  pointInSvgPolygon.isInside([v['x'], v['y']], area1),
                        area2:  pointInSvgPolygon.isInside([v['x'], v['y']], area2),
                        area3:  pointInSvgPolygon.isInside([v['x'], v['y']], area3),
                        area4:  pointInSvgPolygon.isInside([v['x'], v['y']], area4),
                        area5:  pointInSvgPolygon.isInside([v['x'], v['y']], area5),
                        area6:  pointInSvgPolygon.isInside([v['x'], v['y']], area6),
                        area7:  pointInSvgPolygon.isInside([v['x'], v['y']], area7),
                        area8:  pointInSvgPolygon.isInside([v['x'], v['y']], area8),
                        area9:  pointInSvgPolygon.isInside([v['x'], v['y']], area9),
                        area10: pointInSvgPolygon.isInside([v['x'], v['y']], area10),
                        area11: pointInSvgPolygon.isInside([v['x'], v['y']], area11),
                        area12: pointInSvgPolygon.isInside([v['x'], v['y']], area12),
                        area13: pointInSvgPolygon.isInside([v['x'], v['y']], area13),
                        area14: pointInSvgPolygon.isInside([v['x'], v['y']], area14)
                    });
                });
            }
            else {
                shots2pm.forEach(function (v) {
                    shotsMade.push({
                        area1:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area1),
                        area2:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area2),
                        area3:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area3),
                        area4:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area4),
                        area5:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area5),
                        area6:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area6),
                        area7:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area7),
                        area8:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area8),
                        area9:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area9),
                        area10: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area10),
                        area11: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area11),
                        area12: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area12),
                        area13: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area13),
                        area14: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area14)
                    });
                });
                shots2pa.forEach(function (v) {
                    shotsAtt.push({
                        area1:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area1),
                        area2:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area2),
                        area3:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area3),
                        area4:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area4),
                        area5:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area5),
                        area6:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area6),
                        area7:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area7),
                        area8:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area8),
                        area9:  pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area9),
                        area10: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area10),
                        area11: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area11),
                        area12: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area12),
                        area13: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area13),
                        area14: pointInSvgPolygon.isInside([v['position_x'], v['position_y']], area14)
                    });
                });
            }

            var areasMade = {
                area1:  shotsMade.map(function(val){return (val.area1 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area2:  shotsMade.map(function(val){return (val.area2 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area3:  shotsMade.map(function(val){return (val.area3 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area4:  shotsMade.map(function(val){return (val.area4 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area5:  shotsMade.map(function(val){return (val.area5 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area6:  shotsMade.map(function(val){return (val.area6 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area7:  shotsMade.map(function(val){return (val.area7 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area8:  shotsMade.map(function(val){return (val.area8 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area9:  shotsMade.map(function(val){return (val.area9 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area10: shotsMade.map(function(val){return (val.area10 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area11: shotsMade.map(function(val){return (val.area11 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area12: shotsMade.map(function(val){return (val.area12 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area13: shotsMade.map(function(val){return (val.area13 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area14: shotsMade.map(function(val){return (val.area14 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0)
            };
            var areasAtt = {
                area1:  shotsAtt.map(function(val){return (val.area1 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area2:  shotsAtt.map(function(val){return (val.area2 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area3:  shotsAtt.map(function(val){return (val.area3 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area4:  shotsAtt.map(function(val){return (val.area4 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area5:  shotsAtt.map(function(val){return (val.area5 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area6:  shotsAtt.map(function(val){return (val.area6 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area7:  shotsAtt.map(function(val){return (val.area7 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area8:  shotsAtt.map(function(val){return (val.area8 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area9:  shotsAtt.map(function(val){return (val.area9 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area10: shotsAtt.map(function(val){return (val.area10 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area11: shotsAtt.map(function(val){return (val.area11 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area12: shotsAtt.map(function(val){return (val.area12 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area13: shotsAtt.map(function(val){return (val.area13 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0),
                area14: shotsAtt.map(function(val){return (val.area14 === true) ? 1 : 0}).reduce(function (a, b) { return a + b },0)
            };
            return {
                area1: (areasMade['area1']/(areasMade['area1'] + areasAtt['area1'])* 100).toFixed(1),
                area2: (areasMade['area2']/(areasMade['area2'] + areasAtt['area2'])* 100).toFixed(1),
                area3: (areasMade['area3']/(areasMade['area3'] + areasAtt['area3'])* 100).toFixed(1),
                area4: (areasMade['area4']/(areasMade['area4'] + areasAtt['area4'])* 100).toFixed(1),
                area5: (areasMade['area5']/(areasMade['area5'] + areasAtt['area5'])* 100).toFixed(1),
                area6: (areasMade['area6']/(areasMade['area6'] + areasAtt['area6'])* 100).toFixed(1),
                area7: (areasMade['area7']/(areasMade['area7'] + areasAtt['area7'])* 100).toFixed(1),
                area8: (areasMade['area8']/(areasMade['area8'] + areasAtt['area8'])* 100).toFixed(1),
                area9: (areasMade['area9']/(areasMade['area9'] + areasAtt['area9'])* 100).toFixed(1),
                area10: (areasMade['area10']/(areasMade['area10'] + areasAtt['area10'])* 100).toFixed(1),
                area11: (areasMade['area11']/(areasMade['area11'] + areasAtt['area11'])* 100).toFixed(1),
                area12: (areasMade['area12']/(areasMade['area12'] + areasAtt['area12'])* 100).toFixed(1),
                area13: (areasMade['area13']/(areasMade['area13'] + areasAtt['area13'])* 100).toFixed(1),
                area14: (areasMade['area14']/(areasMade['area14'] + areasAtt['area14'])* 100).toFixed(1),
                areasMade: areasMade,
                areasAtt: areasAtt
            };
        }


        // Shot Chart Team2 end

        $('.close-modal-block').click(function () {
            $('#gameAnalysis').modal('hide');
            $('.modal-backdrop.in').css('display', 'none');
        });

        //End Game Analysis tab

        //random

        $scope.getPlayerDataNewTab = function(id, firstName, lastName) {
            var video = document.getElementById("watch_video_game");
            video.pause();
            var path = 'player' + '/' + id + '/' + lastName + '_' + firstName;
            $window.open(path, '_blank');
        };


        $scope.getAnalysisData = function () {
            TeamInformation.getAnalysis($scope.seasonId, $scope.teamId).then(function (response) {
                $scope.tableAnalysisData = response;
                $scope.tableAnalysisDataLenght = 0;
                for(var key in $scope.tableAnalysisData){
                    $scope.tableAnalysisDataLenght ++;
                }
                $scope.newObj = {};//main table
                $scope.newObjInfo = {};//strek table
                $scope.newObjArr = {};//what game table
                $scope.newObjArrWins = [];//how win and lost
                $scope.winGame = 0;
                $scope.loseGame = 0;
                $scope.gamesCount = [];
                $scope.gamesWin = [];
                $scope.gamesLose = [];
                var win = [],
                    lose = [];

                for (var i in $scope.tableAnalysisData){
                    if(!$scope.tableAnalysisData.hasOwnProperty(i))continue;
                    for (var j in $scope.tableAnalysisData[i]){
                        if(!$scope.tableAnalysisData[i].hasOwnProperty(j))continue;
                        if(j<=5){
                            if(!$scope.newObj[i]){
                                $scope.newObj[i] = [];
                            }
                            $scope.newObj[i].push($scope.tableAnalysisData[i][j]);
                        } else if (j>5 && j<14){
                            if(!$scope.newObjInfo[i]){
                                $scope.newObjInfo[i] = [];
                            }
                            $scope.newObjInfo[i].push($scope.tableAnalysisData[i][j]);
                            for(var k in $scope.tableAnalysisData[i][j]){
                                if( k !== 'percent'){
                                    if(k.indexOf('win')){
                                        if(!$scope.gamesWin[i]){
                                            $scope.gamesWin[i] = [];
                                        }
                                        $scope.gamesWin[i].push($scope.tableAnalysisData[i][j][k]);
                                    }
                                    else if(k.indexOf('lose')){
                                        if(!$scope.gamesLose[i]){
                                            $scope.gamesLose[i] = [];
                                        }
                                        $scope.gamesLose[i].push($scope.tableAnalysisData[i][j][k]);
                                    }
                                }
                            }
                        } else if (j>=16) {
                            if(!$scope.newObjArr[i]){
                                $scope.newObjArr[i] = [];
                            }
                            $scope.newObjArr[i].push($scope.tableAnalysisData[i][j]);
                        } else if (j==14) {
                            if(!$scope.gamesCount[i]){
                                $scope.gamesCount[i] = [];
                            }
                            $scope.gamesCount[i].push($scope.tableAnalysisData[i][j]);
                        } else if (j==15) {
                            if(!$scope.newObjArrWins[i]){
                                $scope.newObjArrWins[i] = [];
                            }
                            $scope.newObjArrWins[i].push($scope.tableAnalysisData[i][j]);
                            for (g in $scope.newObjArrWins[i][0]['last_10_games']){
                                if ($scope.newObjArrWins[i][0]['last_10_games'][g] === true)$scope.winGame++;
                                else $scope.loseGame++;
                            }
                            $scope.newObjArrWins[i][0]['last_10_games'].push($scope.winGame);$scope.winGame = 0;
                            $scope.newObjArrWins[i][0]['last_10_games'].push($scope.loseGame);$scope.loseGame = 0;
                        } else {
                            console.log("Error in api");
                        }
                    }
                }


            }).then(function(){
                for (let i in $scope.gamesWin){
                    $timeout(function(){
                        $(".chart"+i.slice(0,1)).kendoChart({
                            legend: {
                                visible: true,
                                position: 'top'
                            },
                            chartArea: {
                                height: 275
                                // width: 380
                            },
                            seriesDefaults: {
                                type: "bar"
                            },
                            series: [{
                                name: "L",
                                data: $scope.gamesWin[i],
                                color: '#0e2ab6'
                            }, {
                                name: "W",
                                data: $scope.gamesLose[i],
                                color: '#720208'
                            }],
                            valueAxis: {
                                line: {
                                    visible: false
                                },
                                minorGridLines: {
                                    visible: true
                                },
                                labels: {
                                    rotation: "auto"
                                },
                            },
                            tooltip: {
                                visible: true,
                                template: '${series.name} : ${value}',
                                color: '#fff',
                                padding: 5
                            }
                        });
                    },150);
                }
                $(".loader-container-team").fadeOut(0);
            });
        };

        $scope.getPlayers = function () {
            TeamInformation.getPlayersStat($scope.seasonId, $scope.leagueId, $scope.teamId).then(function (response) {
                $scope.tablePlayersState = {};
                $scope.chartDataPoints = [];
                $scope.chartDataName = [];
                var arrGame = [];
                for (var keyGame in response) {
                    arrGame.push(keyGame);
                }
                arrGame.sort();
                for (var i = 0; i < arrGame.length; i++) {
                    for (var keyGame1 in response) {
                        if (keyGame1 === arrGame[i]) {
                            if (keyGame1.indexOf('minutes_stats') != -1) {
                                $scope.tablePlayersState['40 ' + keyGame1] = response[keyGame1];
                            } else {
                                $scope.tablePlayersState[keyGame1] = response[keyGame1];
                            }
                            break;
                        }
                    }
                }
                for (var key in response.average_stats) {
                    $scope.chartDataPoints.push(response.average_stats[key].points.toFixed(1));
                    $scope.chartDataName.push(response.average_stats[key].last_name + ' ' + response.average_stats[key].first_name);
                }
                drawPlayersStats($scope.chartDataPoints, $scope.chartDataName);
            });
        };



        $scope.getVideo = function () {
            TeamInformation.getVideoGames($scope.seasonId, $scope.leagueId, $scope.teamId).then(function (data) {
                $scope.listVideos = data.sort(function (a,b) {
                    return (b.game.game_date === null)-(a.game.game_date === null) || new Date(b.game.game_date) - new Date(a.game.game_date);
                });
            }).then(function () {
                loader();
            });
        };


        $scope.setVideoId = function (id) {
            $(".loader-container-team").fadeIn(3500);
            TeamInformation.getVideoForId(id).then(function (response) {
                $('#watch_video_game').attr('src', response.video.video_server.http_path + response.video.link);
                $('#watch_video_game2').attr('href',response.video.video_server.http_path + response.video.link);

                TeamInformation.getTeamForVideoNew(id, response.video.game.home_team.id).then(function (data) {
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
                                $("#see_video").fadeIn(10);
                                $("#see_video").modal('show');
                            },
                            3000
                        );
                        $(".loader-container-team").fadeOut(1000);
                    });
            });
        };

        $scope.openBox = function (gameId) {
            $(".loader-container-team").fadeIn(800);
            TeamInformation.getBoxScore(gameId).then(function (response) {
                $scope.tableBoxScore = response;
                if (response.game_stats[0].team === response.away_team.id) {
                    $scope.totalHomeTeam = response.game_stats[1];
                    $scope.totalAwayTeam = response.game_stats[0];
                } else {
                    $scope.totalHomeTeam = response.game_stats[0];
                    $scope.totalAwayTeam = response.game_stats[1];
                }
            }).then(function () {
                setTimeout(
                    function () {
                        $("#boxScoreModalTeam").fadeIn(1000);
                        $('#boxScoreModalTeam').modal();
                    },
                    0
                );
                $(".loader-container-team").fadeOut(800);
            })
        };
        $scope.getListTeams = function () {
            LeaguesService.getTeams($scope.seasonId, $scope.leagueId).then(function (data) {
                var htmlstring = '';
                var teams = [];
                $scope.teamsInLeagues = data.length;
                for(var j =0; j < data.length; j++) {
                    if (data[j].id != $scope.teamId) {
                        teams.push(data[j]);
                    }
                }
                for(var i =0; i < teams.length; i++) {
                    if (i === 0) {
                        htmlstring = htmlstring + '<option selected value="' + teams[i].id +'">' + teams[i].name + '</option>';
                    } else {
                        htmlstring = htmlstring + '<option value="' + teams[i].id +'">' + teams[i].name + '</option>';
                    }
                };
                var temp = $compile(htmlstring)($scope);
                $('#selectTCompare').html(temp);
                $("#selectTCompare").selectpicker('refresh');
                $scope.compareTeamId = $('#selectTCompare').val();
                $('#selectTCompare').on('changed.bs.select', function (e) {
                    $scope.compareTeamId = $('#selectTCompare').val();
                    e.stopPropagation();
                });
            });
            $scope.drawSetComparisonSelect();
        };

        $scope.drawSetComparisonSelect = function(){
            var htmlstring = '';
            htmlstring = htmlstring + '<option value="head_to_head">' + 'Head to Head' +'</option>';
            htmlstring = htmlstring + '<option value="offensive_view">' + 'Self View' +'</option>';
            htmlstring = htmlstring + '<option value="defensive_view">' + 'Opponents View' +'</option>';
            var temp = $compile(htmlstring)($scope);
            $('#setComparison').html(temp);
            $('#setComparison').selectpicker('refresh');
            $scope.selectOption = $('#setComparison').val();
            $('#setComparison').on('changed.bs.select', function (e) {
                $scope.selectOption = $('#setComparison').val();
                e.stopPropagation();
            });

        }

        $scope.showTC = 0;
        $scope.compareHeads = function () {
            // if($scope.selectOption == 'offensive_view'){
            //     $('#offensive_view').show();
            // }
            $('#comparison').css('height', '790px');
            $scope.TCom = $scope.selectOption;
            $scope.showTC = 1;
            $scope.selectComparison =  $scope.selectOption || 'head_to_head';

            if($scope.seasonId != undefined && $scope.leagueId != undefined && $scope.teamId != undefined && $scope.selectComparison != undefined && $scope.compareTeamId !=undefined) {
                TeamInformation.compareHead($scope.seasonId, $scope.leagueId, $scope.teamId, $scope.selectComparison, $scope.compareTeamId).then(function (response) {
                    $scope.compareTeamList = response;

                    $scope.dataTompareGrafthHome = [];
                    $scope.dataTompareGrafthAway = [];
                    $scope.dataTompareGrafthHome[0] = $scope.compareTeamList[0]['fg_made'];
                    $scope.dataTompareGrafthHome[1] = $scope.compareTeamList[0]['fg_attempts'];
                    $scope.dataTompareGrafthHome[2] = $scope.compareTeamList[0]['fg_percent'];
                    $scope.dataTompareGrafthHome[3] = $scope.compareTeamList[0]['p3_made'];
                    $scope.dataTompareGrafthHome[4] = $scope.compareTeamList[0]['p3_attempts'];
                    $scope.dataTompareGrafthHome[5] = $scope.compareTeamList[0]['p3_percent'];
                    $scope.dataTompareGrafthHome[6] = $scope.compareTeamList[0]['p2_made'];
                    $scope.dataTompareGrafthHome[7] = $scope.compareTeamList[0]['p2_attempts'];
                    $scope.dataTompareGrafthHome[8] = $scope.compareTeamList[0]['p2_percent'];
                    $scope.dataTompareGrafthHome[9] = $scope.compareTeamList[0]['ft_made'];
                    $scope.dataTompareGrafthHome[10] = $scope.compareTeamList[0]['ft_attempts'];
                    $scope.dataTompareGrafthHome[11] = $scope.compareTeamList[0]['ft_percent'];

                    $scope.dataTompareGrafthAway[0] = $scope.compareTeamList[1]['fg_made'];
                    $scope.dataTompareGrafthAway[1] = $scope.compareTeamList[1]['fg_attempts'];
                    $scope.dataTompareGrafthAway[2] = $scope.compareTeamList[1]['fg_percent'];
                    $scope.dataTompareGrafthAway[3] = $scope.compareTeamList[1]['p3_made'];
                    $scope.dataTompareGrafthAway[4] = $scope.compareTeamList[1]['p3_attempts'];
                    $scope.dataTompareGrafthAway[5] = $scope.compareTeamList[1]['p3_percent'];
                    $scope.dataTompareGrafthAway[6] = $scope.compareTeamList[1]['p2_made'];
                    $scope.dataTompareGrafthAway[7] = $scope.compareTeamList[1]['p2_attempts'];
                    $scope.dataTompareGrafthAway[8] = $scope.compareTeamList[1]['p2_percent'];
                    $scope.dataTompareGrafthAway[9] = $scope.compareTeamList[1]['ft_made'];
                    $scope.dataTompareGrafthAway[10] = $scope.compareTeamList[1]['ft_attempts'];
                    $scope.dataTompareGrafthAway[11] = $scope.compareTeamList[1]['ft_percent'];
                    var homeName = $scope.compareTeamList[0]['team_name'];
                    var awayName = $scope.compareTeamList[1]['team_name'];

                    $timeout(function () {
                        $("#teamHeadGrafth").kendoChart({
                            legend: {
                                visible: false
                            },
                            chartArea: {
                                height: 400,
                                width: 1125
                            },
                            seriesDefaults: {
                                type: "column"
                            },
                            series: [{
                                name: homeName,
                                data: $scope.dataTompareGrafthHome,
                                color: '#0e2ab6'
                            }, {
                                name: awayName,
                                data: $scope.dataTompareGrafthAway,
                                color: '#720208'
                            }],
                            valueAxis: {
                                line: {
                                    visible: false
                                },
                                minorGridLines: {
                                    visible: false
                                },
                                labels: {
                                    rotation: "auto"
                                }
                            },
                            categoryAxis: {
                                categories: ['FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%', '2PM', '2PA', '2P%', 'FTM', 'FTA', 'FT%']
                            },
                            tooltip: {
                                visible: true,
                                template: '${series.name} - ${value.toFixed(1)} (${category})'
                            }
                        });
                    });

                });
            }

        };

        /*$('.close-modal-box').click(function () {
            $('#boxScoreModalTeam').modal('hide');
            $('.modal-backdrop.fade.in').css('display','none');
        });*/
        $('.close-modal-block').click(function () {
            $('#boxScoreModalTeam').modal('hide');
            $('.modal-backdrop.in').css('display', 'none');
        });
        //watch video

        $scope.addSrc = function (link, firstTeamId, secondTeamId, homeName, awayName, gameIds) {
            $('#watch_video_game').attr('src', link);
            $('#watch_video_game2').attr('href',link);
            $(".loader-container-team").fadeIn(400);
            $scope.homeName = homeName;
            $scope.awayName = awayName;
        TeamInformation.getTeamForVideoNew(gameIds, firstTeamId).then(function (data) {
                $scope.dataFirstTeam = data;
                //$scope.gameDate = data.video.game.game_date.split('-')[2] + '/' + data.video.game.game_date.split('-')[1] + '/' + data.video.game.game_date.split('-')[0];
            });
            TeamInformation.getTeamForVideoNew(gameIds, secondTeamId).then(function (data) {
                $scope.dataSecondTeam = data;
            })
                .then(function () {
                    setTimeout(
                        function () {
                            $("#see_video").fadeIn(10);
                            $("#see_video").modal('show');
                        },
                        500
                    );
                    $(".loader-container-team").fadeOut(400);
                });
        };
        $('.close-youtube').click(function () {
            $('#watch_video').attr('src', null);
        });
        $scope.addDate = function (date) {
            $scope.gameDate = date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0];
        };

        $scope.setGameId = function (gameId) {

            TeamInformation.getVideoTeam(gameId).then(function (response) {
            });
        };

        //dropdown menu
        $scope.openMenu = function () {
            $(".dropdown-content").toggle();
        };
        $scope.hideObj = function () {
            setTimeout(function () {
                $(".dropdown-content").hide("slow")
            }, 300);
        };

        //pagination list
        if($scope.seasonId != undefined && $scope.leagueId != undefined && $scope.teamId != undefined) {
            TeamInformation.getRosterPlayer($scope.seasonId, $scope.leagueId, $scope.teamId).then(function (response) {
                setTimeout(function () {
                    if (response == false) {
                        $scope.rosterFlag = true;
                     $scope.rosterFlag = true;
                    } else {
                        $scope.listPlayers = response;
                        TeamInformation.getRosterPlayerTab($scope.seasonId, $scope.leagueId, $scope.teamId).then(function (response) {
                            $scope.PlayerRoster = response;
                            $scope.PlayerRoster.forEach( (v) => {
                                $scope.listPlayers.push(v)
                            });
                            for (var i = 0; i < $scope.PlayerRoster.length; i++) {
                                $scope.PlayerRoster[i].disable = 'Waived'
                            }
                        });
                    }
                },1000)
            });

        }


        $scope.getResultStatsTwoWin = function(){


            TeamInformation.getStatsTwoWinPlayerR($scope.seasonId, $scope.leagueId, $scope.teamId).then(function(response){
                $scope.playersRanks = response;
            });

            /*TSAA*/

            TeamInformation.getPlayerStatsCombined($scope.seasonId, $scope.leagueId, $scope.teamId).then(function(response){
                $scope.playerStatsCombined = response;
            });


            $scope.statsAnalysisTable = [];
            $scope.TeamStatsAnalysisTable = function() {
                TeamInformation.getTeamStatsTable($scope.seasonId, $scope.leagueId).then(function (response) {
                    for (var i = 0; i < response.length; i++){
                        if(response[i]['team'] == $scope.nameTeam.replace($scope.regTeam,' ')){
                            $scope.statsAnalysisTable.push(response[i]);
                        }
                    }
                }).then(function () {
                    loader();
                });
            };

            TeamInformation.getStatsTwoWinPlayerT($scope.seasonId, $scope.leagueId, $scope.teamId).then(function(response){
                $scope.teamStatsAdAn = response;
                $scope.fiveTableWithTwoRow = {};
                $scope.bestWorst = {};
                for(var i in $scope.teamStatsAdAn){
                    if($scope.teamStatsAdAn[i].length == 2 && i != 'stats_breakdown'){
                        $scope.fiveTableWithTwoRow[i] = $scope.teamStatsAdAn[i];
                    }
                    else if ($scope.teamStatsAdAn[i].length == 2 && i == 'stats_breakdown'){
                        $scope.statsBreackDown = $scope.teamStatsAdAn[i];
                    }
                }
                for(var j in $scope.fiveTableWithTwoRow) {
                    $scope.fiveTableWithTwoRow[j] = $scope.fiveTableWithTwoRow[j].sort(function (a, b) {
                        return a.opponent - b.opponent
                    });
                }

                $scope.TeamStatsAnalysisTable();

                $("#for-factors-win").kendoChart({
                    legend: {
                        visible: true,
                        position: 'right'
                    },
                    chartArea: {
                        height: 400,
                        width: 1080
                    },
                    seriesDefaults: {
                        type: "column"
                    },
                    series: [{
                        name: $scope.nameTeam,
                        data: [(($scope.fiveTableWithTwoRow.all[0]['fg_made'] + 0.5 * $scope.fiveTableWithTwoRow.all[0]['p3_made'])/ $scope.fiveTableWithTwoRow.all[0]['fg_attempts']) * 100,
                                ($scope.fiveTableWithTwoRow.all[0]['turnovers']/($scope.fiveTableWithTwoRow.all[0]['fg_attempts'] + 0.44 * $scope.fiveTableWithTwoRow.all[0]['ft_attempts'] + $scope.fiveTableWithTwoRow.all[0]['turnovers'])) * 100,
                                ($scope.fiveTableWithTwoRow.all[0]['of_rebounds']/($scope.fiveTableWithTwoRow.all[0]['of_rebounds'] + $scope.fiveTableWithTwoRow.all[1]['df_rebounds'])) * 100,
                                ($scope.fiveTableWithTwoRow.all[0]['ft_made']/$scope.fiveTableWithTwoRow.all[0]['fg_attempts']) * 100],
                        color: '#0e2ab6'
                    }, {
                        name: 'Opponents',
                        data: [(($scope.fiveTableWithTwoRow.all[1]['fg_made'] + 0.5 * $scope.fiveTableWithTwoRow.all[1]['p3_made'])/ $scope.fiveTableWithTwoRow.all[1]['fg_attempts']) * 100,
                            ($scope.fiveTableWithTwoRow.all[1]['turnovers']/($scope.fiveTableWithTwoRow.all[1]['fg_attempts'] + 0.44 * $scope.fiveTableWithTwoRow.all[1]['ft_attempts'] + $scope.fiveTableWithTwoRow.all[1]['turnovers'])) * 100,
                            ($scope.fiveTableWithTwoRow.all[1]['of_rebounds']/($scope.fiveTableWithTwoRow.all[1]['of_rebounds'] + $scope.fiveTableWithTwoRow.all[0]['df_rebounds'])) * 100,
                            ($scope.fiveTableWithTwoRow.all[1]['ft_made']/$scope.fiveTableWithTwoRow.all[1]['fg_attempts']) * 100],
                        color: '#86060d'
                    }],
                    valueAxis: {
                        line: {
                            visible: false
                        },
                        minorGridLines: {
                            visible: false
                        },
                        labels: {
                            rotation: "auto"
                        }
                    },
                    categoryAxis: {
                        categories: ['Shooting (eFG%)', 'Ball Handling (TO%)', 'Rebound (OR%)', 'Shooting FTs (FT Rate)']
                    },
                    tooltip: {
                        visible: true,
                        template: '${series.name} - ${value.toFixed(1)}',
                        color: '#ffffff',
                        padding: 5
                    }
                });


                $('#team-perfomanse-pie').kendoChart({
                    title: {
                        position: "top",
                        margin: {
                            top: 1,
                            right: 1,
                            bottom: 1,
                            left: 1,
                        },
                        padding: {
                            top: 1,
                            right: 1,
                            bottom: 1,
                            left: 1,
                        },
                        color: "#000",
                        // text: Math.round($scope.actionChartData[0].player * 100 / $scope.actionChartData[0].team) + "% of team shots " + $scope.actionChartData[0].player + '/' + $scope.actionChartData[0].team,
                        text: $scope.nameTeam.replace(/_/g,' '),
                    },
                    legend: {
                        visible: true
                    },
                    chartArea: {
                        background: "transparent",
                        height: 300,
                        width: 400,
                    },
                    seriesDefaults: {
                        labels: {
                            visible: false
                        }
                    },
                    series: [{
                        type: "pie",
                        data: [{
                            category: ($scope.fiveTableWithTwoRow.all[0].ft_made).toFixed(1) + " " + "points from FT",
                            value: ($scope.fiveTableWithTwoRow.all[0].ft_made).toFixed(1),
                            color: "#1b4afd"
                        },{
                            category: ($scope.fiveTableWithTwoRow.all[0].p2_made).toFixed(1) + " "+ "from 2P for " + ($scope.fiveTableWithTwoRow.all[0].p2_made * 2).toFixed(1),
                            value: ($scope.fiveTableWithTwoRow.all[0].p2_made * 2).toFixed(1),
                            color: "#ff3100"
                        },{
                            category:($scope.fiveTableWithTwoRow.all[0].p3_made).toFixed(1) + " " + "from 3P for " + ($scope.fiveTableWithTwoRow.all[0].p3_made * 3).toFixed(1),
                            value: ($scope.fiveTableWithTwoRow.all[0].p3_made * 3).toFixed(1),
                            color: "orange"
                        }]
                    }],
                    tooltip: {
                        visible: true,
                        background: '#000000',
                        color: '#fff',
                        padding: 5,
                        template: "${data.category}",
                        font: "13px Arial,Helvetica,sans-serif"
                    }
                });

                $('#team-perfomanse-pie-opponents').kendoChart({
                    title: {
                        position: "top",
                        margin: {
                            top: 1,
                            right: 1,
                            bottom: 1,
                            left: 1,
                        },
                        padding: {
                            top: 1,
                            right: 1,
                            bottom: 1,
                            left: 1,
                        },
                        color: "#000",
                        // text: Math.round($scope.actionChartData[0].player * 100 / $scope.actionChartData[0].team) + "% of team shots " + $scope.actionChartData[0].player + '/' + $scope.actionChartData[0].team,
                        text: "Opponents",
                    },
                    legend: {
                        visible: true
                    },
                    chartArea: {
                        background: "transparent",
                        height: 300,
                        width: 400,
                    },
                    seriesDefaults: {
                        labels: {
                            visible: false
                        }
                    },
                    series: [{
                        type: "pie",
                        data: [{
                            category: ($scope.fiveTableWithTwoRow.all[1].ft_made).toFixed(1) + " " + "points from FT",
                            value: ($scope.fiveTableWithTwoRow.all[1].ft_made).toFixed(1),
                            color: "#1b4afd"
                        },{
                            category: ($scope.fiveTableWithTwoRow.all[1].p2_made).toFixed(1) + " " + "from 2P for " + ($scope.fiveTableWithTwoRow.all[1].p2_made * 2).toFixed(1),
                            value: ($scope.fiveTableWithTwoRow.all[1].p2_made * 2).toFixed(1),
                            color: "#ff3100"
                        },{
                            category: ($scope.fiveTableWithTwoRow.all[1].p3_made).toFixed(1) + " " + "from 3P for " + ($scope.fiveTableWithTwoRow.all[1].p3_made * 3).toFixed(1),
                            value: ($scope.fiveTableWithTwoRow.all[1].p3_made * 3).toFixed(1),
                            color: "orange"
                        }]
                    }],
                    tooltip: {
                        visible: true,
                        background: '#000000',
                        color: '#fff',
                        padding: 5,
                        template: "${data.category}",
                        font: "13px Arial,Helvetica,sans-serif"
                    }
                });

                $scope.drawGrafthPS2 = function () {
                        $("#grafthPS2").kendoChart({
                            legend: {
                                visible: true,
                                position: 'top'
                            },
                            chartArea: {
                                height: 400,
                                width: 1075
                            },
                            seriesDefaults: {
                                type: "column"
                            },
                            series: [{
                                name: "Points",
                                data: $scope.pointsRank,
                                color: '#3366cc'
                            }],
                            valueAxis: {
                                visible: true,
                                majorGridLines: {
                                    visible: false
                                },
                                minorGridLines: {
                                    visible: false
                                }
                            },
                            categoryAxis:{
                                labels: {
                                    rotation: -45
                                },
                                categories: $scope.namePlayersOnTeam,
                                visible: true,
                                majorGridLines: {
                                    visible: false
                                },
                                minorGridLines: {
                                    visible: false
                                }
                            },
                            tooltip: {
                                visible: true,
                                template: '${series.name} : ${value.toFixed(1)}',
                                color: '#ffffff',
                                padding: 5
                            }
                        });
                    };

                $scope.openPlayerStats();

                $scope.sumAllPoints = ($scope.fiveTableWithTwoRow.all[0].ft_made + $scope.fiveTableWithTwoRow.all[0].p2_made + $scope.fiveTableWithTwoRow.all[0].p3_made).toFixed(1);
                $scope.sumAllPointsOpponents = ($scope.fiveTableWithTwoRow.all[1].ft_made + $scope.fiveTableWithTwoRow.all[1].p2_made + $scope.fiveTableWithTwoRow.all[1].p3_made).toFixed(1);
                function getStringChart() {
                    $("#team-perfomanse-string_grapf").kendoChart({
                        legend: {
                            visible: false
                        },

                        title: {
                            position: "top",
                            margin: {
                                top: 1,
                                right: 1,
                                bottom: 1,
                                left: 1,
                            },
                            padding: {
                                top: 1,
                                right: 1,
                                bottom: 1,
                                left: 1,
                            },
                            color: "#000",
                            text: $scope.nameTeam.replace(/_/g,' '),
                        },

                        chartArea: {
                            height: 130,
                            width: 790
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: {
                                type: "100%"
                            }
                        },
                        series: [{
                            name: ($scope.fiveTableWithTwoRow.all[0].ft_made).toFixed(1) + " " + "points from FT",
                            data: [Math.round(($scope.fiveTableWithTwoRow.all[0].ft_made / 3) * 100)],
                            color: "#1b4afd"
                        }, {
                            name: ($scope.fiveTableWithTwoRow.all[0].p2_made).toFixed(1) + " "+ "from 2P for " + ($scope.fiveTableWithTwoRow.all[0].p2_made * 2).toFixed(1),
                            data: [Math.round(($scope.fiveTableWithTwoRow.all[0].p2_made / 3) * 100)],
                            color: "#ff3100"
                        }, {
                            name: ($scope.fiveTableWithTwoRow.all[0].p3_made).toFixed(1) + " " + "from 3P for " + ($scope.fiveTableWithTwoRow.all[0].p3_made * 3).toFixed(1),
                            data: [Math.round(($scope.fiveTableWithTwoRow.all[0].p3_made / 3) * 100)],
                            color: "orange"
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels:{
                                visible: false
                            }
                        },
                        axisDefaults: {
                            background: "#fff",
                            color: "#fff",
                            majorGridLines: {
                                visible: false
                            }

                        }
                    });

                    $("#team-perfomanse-opponents-string_grapf").kendoChart({
                        legend: {
                            visible: false
                        },
                        title: {
                            position: "top",
                            margin: {
                                top: 1,
                                right: 1,
                                bottom: 1,
                                left: 1,
                            },
                            padding: {
                                top: 1,
                                right: 1,
                                bottom: 1,
                                left: 1,
                            },
                            color: "#000",
                            text: "Opponents",
                        },
                        chartArea: {
                            height: 130,
                            width: 790
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: {
                                type: "100%"
                            }
                        },
                        series: [{
                            name: ($scope.fiveTableWithTwoRow.all[1].ft_made).toFixed(1) + " " + "points from FT",
                            data: [Math.round(($scope.fiveTableWithTwoRow.all[1].ft_made / 3) * 100)],
                            color: "#1b4afd"
                        }, {
                            name: ($scope.fiveTableWithTwoRow.all[1].p2_made).toFixed(1) + " " + "from 2P for " + ($scope.fiveTableWithTwoRow.all[1].p2_made * 2).toFixed(1),
                            data: [Math.round(($scope.fiveTableWithTwoRow.all[1].p2_made / 3) * 100)],
                            color: "#ff3100"
                        }, {
                            name: ($scope.fiveTableWithTwoRow.all[1].p3_made).toFixed(1) + " " + "from 3P for " + ($scope.fiveTableWithTwoRow.all[1].p3_made * 3).toFixed(1),
                            data: [Math.round(($scope.fiveTableWithTwoRow.all[1].p3_made / 3) * 100)],
                            color: "orange"
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels:{
                                visible: false
                            }
                        },
                        axisDefaults: {
                            background: "#fff",
                            color: "#fff",
                            majorGridLines: {
                                visible: false
                            }

                        }
                    });
                }

                $(document).ready(getStringChart);
                $(document).bind("kendo:skinChange", getStringChart);

            });


            /*TSAA END*/

            TeamInformation.getStatsTwoWinPlayerY($scope.seasonId, $scope.leagueId, $scope.teamId).then(function(response){
                LeaguesService.getTeams($scope.seasonId, $scope.leagueId).then(function (data) {
                    $scope.teamsInLeagues = data.length;
                });
                $scope.teamPErf = response;
                $scope.avaregeTPA = $scope.teamPErf[6];
                $scope.firstTableOnTPA = [];
                for (var i =0 ; i<4;i++){
                    $scope.firstTableOnTPA[i] = $scope.teamPErf[i];
                }
                var teamNames = [];
                var newArr = [];
                teamNames = $scope.firstTableOnTPA.map(function (item) {
                     return item.team_name
                });
                for (var c = 0; c < $scope.firstTableOnTPA.length; c++) {
                    teamNames[c]='';
                    if (teamNames.indexOf($scope.firstTableOnTPA[c].team_name) === -1){
                       newArr.push($scope.firstTableOnTPA[c])
                    }
                }

                $scope.firstTableOnTPA = newArr;


                // lose offensive
                var temp = $scope.teamPErf[8].games.slice();
                var temp2 = $scope.teamPErf[8].games.slice();


                var homeGames = $scope.teamPErf[8].games.slice().filter(function (t) { return t.place == 'home' });
                var awayGames = $scope.teamPErf[8].games.slice().filter(function (t) { return t.place == 'away' });

                var temp3 = homeGames.slice();
                var temp4 = homeGames.slice();
                var temp5 = awayGames.slice();
                var temp6 = awayGames.slice();

                temp = temp.sort(function (a,b) {
                    /*if(b.points == a.points) {
                        return a.won - b.won;
                    } else {
                        return a.points - b.points;
                    }*/
                    return a.points - b.points;
                });

                temp2 = temp2.sort(function (a, b) {
                    return b.op_points - a.op_points;
                });
                temp3 = temp3.sort(function (a,b) {
                    return a.points - b.points;
                });
                temp4 = temp4.sort(function (a, b) {
                    return b.op_points - a.op_points;
                });
                temp5 = temp5.sort(function (a,b) {
                    return a.points - b.points;
                });
                temp6 = temp6.sort(function (a, b) {
                    return b.op_points - a.op_points;
                });

                $scope.offensiveViewData = getDataForView(temp, 'points');
                $scope.defensiveViewData = getDataForView(temp2, 'op_points');

                $scope.offensiveViewDataHome = getDataForView(temp3, 'points');
                $scope.defensiveViewDataHome = getDataForView(temp4, 'op_points');
                $scope.offensiveViewDataAway = getDataForView(temp5, 'points');
                $scope.defensiveViewDataAway = getDataForView(temp6, 'op_points');



                function getDataForView (arr, pts) {

                    var gLose = 0;
                    var lastGamePoint = 0;
                    loop1:
                        for(var i = 0; i < arr.length; i++) {
                            if(i == 0 && arr[i].won === true) {
                                gLose = 0;
                                lastGamePoint = 0;
                                break;
                            } else if(arr[i].won === true) {
                                if(arr[i-1][pts] === arr[i][pts]) {
                                    var t = arr.slice(0, i).reverse();
                                    for(var j = 0; j < t.length; j++) {
                                        if(t[j][pts] !== arr[i][pts]) {
                                            gLose = i - j;
                                            lastGamePoint = t[j][pts];
                                            break loop1;
                                        }
                                    }
                                } else {
                                    gLose = i;
                                    lastGamePoint = arr[i-1][pts];
                                    break;
                                }
                            }
                        }

                    var won = 0;
                    var lose = 0;
                    var percentageArr = [];

                    for (var i = 0; i < arr.length; i++ ) {
                        if(arr[i].won) won ++;
                        else lose ++;

                        var percentage = lose / (won + lose) * 100;

                        if(percentage !== 100) {
                            percentageArr.push({
                                percentage: percentage,
                                point: arr[i][pts],
                                count: i + 1,
                                won: won,
                                lose: lose
                            });
                        }
                    };


                    for(var i= 0; i < percentageArr.length; i++) {
                        if(i != percentageArr.length-1) {
                            if (percentageArr[i].percentage > percentageArr[i + 1].percentage) {
                                percentageArr[i + 1] = percentageArr[i];
                            }
                        }
                    };

                    var maxLosePercentage = percentageArr[percentageArr.length-1];

                    // won offensive

                    arr.reverse();

                    var gWin = 0;
                    var lastGamePointWon = 0;


                    loop1:
                        for(var i = 0; i < arr.length; i++) {
                            if(i == 0 && arr[i].won === false) {
                                gWin = 0;
                                lastGamePointWon = 0;
                                break;
                            } else if(arr[i].won === false) {
                                if(arr[i-1][pts] === arr[i][pts]) {
                                    gWin = 0;
                                    lastGamePointWon = 0;
                                    break;
                                } else {
                                    gWin = i;
                                    lastGamePointWon = arr[i-1][pts];
                                    break;
                                }
                            }
                        }




                    var won = 0;
                    var lose = 0;
                    var percentageArr = [];

                    for (var i = 0; i < arr.length; i++ ) {
                        if(arr[i].won) won ++;
                        else lose ++;

                        var percentage = won / (won + lose) * 100;


                            percentageArr.push({
                                percentage: percentage,
                                point: arr[i][pts],
                                count: i + 1,
                                won: won,
                                lose: lose
                            });

                    };

                    for(var i= 0; i < percentageArr.length; i++) {
                        if(i != percentageArr.length-1) {
                            if (percentageArr[i].percentage > percentageArr[i + 1].percentage && percentageArr[i].percentage != 100) {
                                percentageArr[i + 1] = percentageArr[i];
                            }
                        }
                    };

                    var maxWonPercentage = percentageArr[percentageArr.length-1];

                    return {
                        gWin: gWin,
                        gLose: gLose,
                        lastGamePoint: lastGamePoint,
                        lastGamePointWon: lastGamePointWon,
                        maxLosePercentage: maxLosePercentage,
                        maxWonPercentage: maxWonPercentage
                    };
                }

                function createChartForView() {

                    $("#offensive-view").kendoChart({
                        legend: {
                            visible: false
                        },
                        chartArea: {
                            height: 100,
                            width: 490
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: {
                                type: "100%"
                            }
                        },
                        series: [{
                            name: "Lose",
                            data: [Math.round(($scope.offensiveViewData.maxLosePercentage.lose / temp.length) * 100 )] ,
                            color: "#ff3100"
                        }, {
                            name: "Rest",
                            data: [Math.round((temp.length - ($scope.offensiveViewData.maxWonPercentage.won + $scope.offensiveViewData.maxLosePercentage.lose)) / temp.length * 100 )],
                            color: "orange"
                        }, {
                            name: "Won",
                            data: [Math.round(($scope.offensiveViewData.maxWonPercentage.won / temp.length) * 100 )],
                            color: "green"
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels:{
                                visible: false
                            }
                        },
                        axisDefaults: {
                            background: "#fff",
                            color: "#fff",
                            majorGridLines: {
                                visible: false
                            }

                        }
                    });

                    $("#defensive-view").kendoChart({
                        legend: {
                            visible: false
                        },
                        chartArea: {
                            height: 100,
                            width: 490
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: {
                                type: "100%"
                            }
                        },
                        series: [{
                            name: "Lose",
                            data: [Math.round(($scope.defensiveViewData.maxLosePercentage.lose / temp.length) * 100 )] ,
                            color: "#ff3100"
                        }, {
                            name: "Rest",
                            data: [Math.round((temp.length - ($scope.defensiveViewData.maxWonPercentage.won + $scope.defensiveViewData.maxLosePercentage.lose)) / temp.length * 100 )],
                            color: "orange"
                        }, {
                            name: "Won",
                            data: [Math.round(($scope.defensiveViewData.maxWonPercentage.won / temp.length) * 100 )],
                            color: "green"
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels:{
                                visible: false
                            }
                        },
                        axisDefaults: {
                            background: "#fff",
                            color: "#fff",
                            majorGridLines: {
                                visible: false
                            }

                        }
                    });
                    //home charts
                    $("#offensive-view-home").kendoChart({
                        legend: {
                            visible: false
                        },
                        chartArea: {
                            height: 100,
                            width: 490
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: {
                                type: "100%"
                            }
                        },
                        series: [{
                            name: "Lose",
                            data: [Math.round(($scope.offensiveViewDataHome.maxLosePercentage.lose / homeGames.length) * 100 )] ,
                            color: "#ff3100"
                        }, {
                            name: "Rest",
                            data: [Math.round((homeGames.length - ($scope.offensiveViewDataHome.maxWonPercentage.won + $scope.offensiveViewDataHome.maxLosePercentage.lose)) / homeGames.length * 100 )],
                            color: "orange"
                        }, {
                            name: "Won",
                            data: [Math.round(($scope.offensiveViewDataHome.maxWonPercentage.won / homeGames.length) * 100 )],
                            color: "green"
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels:{
                                visible: false
                            }
                        },
                        axisDefaults: {
                            background: "#fff",
                            color: "#fff",
                            majorGridLines: {
                                visible: false
                            }

                        }
                    });

                    $("#defensive-view-home").kendoChart({
                        legend: {
                            visible: false
                        },
                        chartArea: {
                            height: 100,
                            width: 490
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: {
                                type: "100%"
                            }
                        },
                        series: [{
                            name: "Lose",
                            data: [Math.round(($scope.defensiveViewDataHome.maxLosePercentage.lose / homeGames.length) * 100 )] ,
                            color: "#ff3100"
                        }, {
                            name: "Rest",
                            data: [Math.round((homeGames.length - ($scope.defensiveViewDataHome.maxWonPercentage.won + $scope.defensiveViewDataHome.maxLosePercentage.lose)) / homeGames.length * 100 )],
                            color: "orange"
                        }, {
                            name: "Won",
                            data: [Math.round(($scope.defensiveViewDataHome.maxWonPercentage.won / homeGames.length) * 100 )],
                            color: "green"
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels:{
                                visible: false
                            }
                        },
                        axisDefaults: {
                            background: "#fff",
                            color: "#fff",
                            majorGridLines: {
                                visible: false
                            }

                        }
                    });
                    //Away charts
                    $("#offensive-view-away").kendoChart({
                        legend: {
                            visible: false
                        },
                        chartArea: {
                            height: 100,
                            width: 490
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: {
                                type: "100%"
                            }
                        },
                        series: [{
                            name: "Lose",
                            data: [Math.round(($scope.offensiveViewDataAway.maxLosePercentage.lose / awayGames.length) * 100 )] ,
                            color: "#ff3100"
                        }, {
                            name: "Rest",
                            data: [Math.round((awayGames.length - ($scope.offensiveViewDataAway.maxWonPercentage.won + $scope.offensiveViewDataAway.maxLosePercentage.lose)) / awayGames.length * 100 )],
                            color: "orange"
                        }, {
                            name: "Won",
                            data: [Math.round(($scope.offensiveViewDataAway.maxWonPercentage.won / awayGames.length) * 100 )],
                            color: "green"
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels:{
                                visible: false
                            }
                        },
                        axisDefaults: {
                            background: "#fff",
                            color: "#fff",
                            majorGridLines: {
                                visible: false
                            }

                        }
                    });

                    $("#defensive-view-away").kendoChart({
                        legend: {
                            visible: false
                        },
                        chartArea: {
                            height: 100,
                            width: 490
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: {
                                type: "100%"
                            }
                        },
                        series: [{
                            name: "Lose",
                            data: [Math.round(($scope.defensiveViewDataAway.maxLosePercentage.lose / awayGames.length) * 100 )] ,
                            color: "#ff3100"
                        }, {
                            name: "Rest",
                            data: [Math.round((awayGames.length - ($scope.defensiveViewDataAway.maxWonPercentage.won + $scope.defensiveViewDataAway.maxLosePercentage.lose)) / awayGames.length * 100 )],
                            color: "orange"
                        }, {
                            name: "Won",
                            data: [Math.round(($scope.defensiveViewDataAway.maxWonPercentage.won / awayGames.length) * 100 )],
                            color: "green"
                        }],
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            labels:{
                                visible: false
                            }
                        },
                        axisDefaults: {
                            background: "#fff",
                            color: "#fff",
                            majorGridLines: {
                                visible: false
                            }

                        }
                    });

                }

                $(document).ready(createChartForView);
                $(document).bind("kendo:skinChange", createChartForView);

            });
            TeamInformation.getStatsTwoWinPlayerI($scope.seasonId, $scope.leagueId, $scope.teamId).then(function(response){
                $scope.customCSKALeague = [];
                $scope.seriesInProgress = [];
                $scope.lastSevenGames = [];
                $scope.winLengthSeries = [];
                $scope.loseLengthSeries = [];
                for (var i = 0; i < response.length; i++) {
                    if(typeof response[i].league_name != 'undefined'){
                        $scope.customCSKALeague.push(response[i]);
                    }
                    if(typeof response[i].series_in_progress != 'undefined'){
                        $scope.seriesInProgress.push(response[i])
                    }
                    $scope.lastSevenGames = response[i]['last_7_games'];
                }
                for (var i = 0; i < $scope.seriesInProgress[0]['last_10_games'].length; i++) {
                    if($scope.seriesInProgress[0]['last_10_games'][i] === "W"){
                        $scope.winLengthSeries.push($scope.seriesInProgress[0]['last_10_games'][i]);
                    }else{
                        $scope.loseLengthSeries.push($scope.seriesInProgress[0]['last_10_games'][i]);
                    }
                }
                if($scope.customCSKALeague[1].league_name == "all_leagues"){
                   $scope.customCSKALeague.splice(1, 1);
                }
            });

            TeamInformation.getPlayerStats($scope.seasonId, $scope.leagueId, $scope.teamId).then(function(response){
                $scope.teamAverageCSKA = response;
            });



            TeamInformation.getTeamAdvancedCombined($scope.seasonId, $scope.leagueId, $scope.teamId).then(function(response){
                $scope.teamAdvancedCombined = response;
                for(var j in $scope.teamAdvancedCombined) {
                    $scope.teamAdvancedCombined[j] = $scope.teamAdvancedCombined[j].sort(function (a, b) {
                        return a.opponent - b.opponent
                    });
                }
            });

            TeamInformation.getTeamGames($scope.teamId).then(function(response){
                $scope.teamGamesAll = response;
            });
        };
        $scope.idTable = "MenuStatsTwoWin";
        $scope.whatTableOnStatsTwoWin = function(str){

            $scope.idTable = str;
        };

        $scope.stats2winPlayerComparison = function () {

            $scope.leaguesPSComparison = function () {
                var htmlstring = '';
                for (var i = 0; i < $scope.getLeagueInCurrentSeason.length; i++) {
                    if (i === 0) {
                        htmlstring = htmlstring + '<option selected value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    } else {
                        htmlstring = htmlstring + '<option value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    }
                }

                var temp = $compile(htmlstring)($scope);
                $('#player-comparison-leagues').html(temp);

                $('#player-comparison-leagues').on('changed.bs.select', function (e) {
                    $scope.PSComparisonLeagueId = $('#player-comparison-leagues').val();
                    if($scope.PSComparisonLeagueId !== null){
                        getGamesForPSComparison();
                    }else{
                        $scope.PSComparisonSubParam = {};
                    }
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
                $('#player-comparison-leagues').selectpicker('refresh');
                $('#player-comparison-leagues').selectpicker('selectAll');
                $scope.PSComparisonLeagueId = $('#player-comparison-leagues').val();

                getGamesForPSComparison();
            };

            function getGamesForPSComparison() {
                TeamInformation.getResultTeam($scope.teamId, $scope.seasonId, $scope.PSComparisonLeagueId).then(function (response) {
                    var game = response.sort(function (a, b) {
                        return a.game_id - b.game_id;
                    });
                    var awayGamesLose = [];
                    var awayGamesWon = [];
                    var homeGamesWon = [];
                    var homeGamesLose = [];
                    var allGames = [];
                    var last3 = [];
                    var last5 = [];
                    var last7 = [];
                    for (var i = 0; i < game.length; i++) {
                        if(game[i].team_id == $scope.teamId){
                            allGames.push(game[i].game_id);
                        }
                        if (game[i]['place'] === "home" && game[i].team_id == $scope.teamId && game[i].won) {
                            homeGamesWon.push(game[i].game_id);
                        }
                        if(game[i]['place'] === "home" && game[i].team_id == $scope.teamId && !game[i].won){
                            homeGamesLose.push(game[i].game_id);
                        }
                        if(game[i]['place'] === "away" && game[i].team_id == $scope.teamId && game[i].won){
                            awayGamesWon.push(game[i].game_id);
                        }
                        if(game[i]['place'] === "away" && game[i].team_id == $scope.teamId && !game[i].won){
                            awayGamesLose.push(game[i].game_id);
                        }
                    }
                    last3 = allGames.slice(-3);
                    last5 = allGames.slice(-5);
                    last7 = allGames.slice(-7);

                    var arrayelem = [];
                    var newObject = {};
                    var arrayKey = [];
                    TeamInformation.getPlayerStatsByGamesNew($scope.teamId, allGames).then(function (response) {
                        for(var i = 0; i < response.average.length; i++){
                            arrayKey.push(response.average[i]['last_name']);
                        }
                        for (var key = 0; key < arrayKey.length; key++) {
                            for (var i = 0; i < response.average.length; i++) {
                                if(arrayKey[key] === response.average[i].last_name){
                                    arrayelem['all'] = response.average[i];
                                    newObject[arrayKey[key]] = arrayelem;
                                    arrayelem = [];
                                    i++;

                                }
                            }
                        }
                        $scope.PSComparisonSubParam = newObject;
                    }).then(function () {
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, homeGamesWon.concat(homeGamesLose)).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['home'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, awayGamesWon.concat(awayGamesLose)).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['away'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, awayGamesWon.concat(homeGamesWon)).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['won'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, awayGamesLose.concat(homeGamesLose)).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['lose'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, homeGamesWon).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['home_won'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, homeGamesLose).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['home_lose'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, awayGamesWon).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['away_won'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, awayGamesLose).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['away_lose'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, last3).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['last3'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, last5).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['last5'] = response.average[i];
                                    }
                                }
                            }
                        });
                        TeamInformation.getPlayerStatsByGamesNew($scope.teamId, last7).then(function (response) {
                            for (var key in $scope.PSComparisonSubParam) {
                                for (var i = 0; i < response.average.length; i++) {
                                    if ($scope.PSComparisonSubParam[key]['all']['last_name'] === response.average[i]['last_name']) {
                                        $scope.PSComparisonSubParam[key]['last7'] = response.average[i];
                                    }
                                }
                            }
                        });
                    }).then(function () {
                        $scope.subReportPSComparison();
                        $scope.playerStatsComparisonDataConst = $scope.PSComparisonSubParam;
                    });
                });
            };

                $scope.subReportPSComparison = function () {
                    var htmlstring = '';
                    htmlstring = htmlstring + '<option selected value="home_away_won_lost">' + 'Home vs Away vs Won vs Lost' +'</option>';
                    htmlstring = htmlstring + '<option value="won_lost_together">' + 'Won vs Lost (together)' +'</option>';
                    htmlstring = htmlstring + '<option value="won_lost">' + 'Won vs Lost' +'</option>';
                    htmlstring = htmlstring + '<option value="home_away">' + 'Home vs Away' +'</option>';
                    htmlstring = htmlstring + '<option value="home_away_together">' + 'Home vs Away (together)' +'</option>';
                    htmlstring = htmlstring + '<option value="home_won_home_lost_together">' + 'Home-Won vs Home-Lost' +'</option>';
                    htmlstring = htmlstring + '<option value="away_won_away_lost_together">' + 'Away-Won vs Away-Lost' +'</option>';
                    htmlstring = htmlstring + '<option value="last_3">' + 'Last 3 Games vs All Games' +'</option>';
                    htmlstring = htmlstring + '<option value="last_5">' + 'Last 5 Games vs All Games' +'</option>';
                    htmlstring = htmlstring + '<option value="last_7">' + 'Last 7 Games vs All Games' +'</option>';
                    var temp = $compile(htmlstring)($scope);
                    $('#player-comparison-sub-report').html(temp);
                    $('#player-comparison-sub-report').on('changed.bs.select', function () {
                        var valueSubReport = $('#player-comparison-sub-report').val();
                        $scope.whatTable = valueSubReport;
                        $scope.playerSelectPSComparison(valueSubReport);
                    });
                    $('#player-comparison-sub-report').selectpicker('refresh');
                    $('#player-comparison-sub-report').selectpicker('selectAll');
                    $scope.whatTable = $('#player-comparison-sub-report').val();
                    $timeout(function () {
                        $scope.playerSelectPSComparison();
                    }, 550);
                };

                $scope.playerSelectPSComparison = function (valueSubReport) {
                        var htmlstring = '';
                        var k = 0;
                        for (var i in $scope.playerStatsComparisonDataConst) {
                            if($scope.playerStatsComparisonDataConst[i]['all'].last_name !== 'TEAM') {
                                htmlstring = htmlstring + '<option value=' + $scope.playerStatsComparisonDataConst[i]['all'].last_name + '>' + $scope.playerStatsComparisonDataConst[i]['all'].last_name + ' ' + $scope.playerStatsComparisonDataConst[i]['all'].first_name + '</option>';
                                k++;
                            }
                        }
                        var temp = $compile(htmlstring)($scope);
                        $('#player-comparison-players').html(temp);
                        $('#player-comparison-players').selectpicker('refresh');
                        $('#player-comparison-players').selectpicker('selectAll');
                        $('#player-comparison-players').on('changed.bs.select', function (e) {
                        var playersName = $('#player-comparison-players').val();
                        $scope.changeDataPSComparison(playersName);
                        e.stopImmediatePropagation();
                    });


                };

                $scope.changeDataPSComparison = function (name) {
                    var data = {};
                    data = $scope.playerStatsComparisonDataConst;
                    $scope.PSComparisonSubParam = {};
                    for(var key in data) {
                        if(name.includes(key.slice(0, key.includes(' ') ? key.indexOf(' ') : key.length))){
                            $scope.PSComparisonSubParam[key] = data[key];
                        }
                    }
                };

            $scope.leaguesPSComparison();
        };

//Start Players Tendency
        $scope.statsTwoWinTendency = function () {

            var leaguesStatsTwoWinTendency = function () {
                var htmlstring = '';
                for (var i = 0; i < $scope.getLeagueInCurrentSeason.length; i++) {
                    if (i === 0) {
                        htmlstring = htmlstring + '<option selected value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    } else {
                        htmlstring = htmlstring + '<option value="' + $scope.getLeagueInCurrentSeason[i].league_id + '">' + $scope.getLeagueInCurrentSeason[i].league_name + '</option>';
                    }
                }
                var temp = $compile(htmlstring)($scope);
                $('#player-tendency-leagues').html(temp);
                $('#player-tendency-leagues').selectpicker('refresh');
                // $('#player-tendency-leagues').selectpicker('selectAll');
                $('#player-tendency-leagues').on('changed.bs.select', function (e) {
                    $scope.playerTendencyLeagueId = $('#player-tendency-leagues').val();
                    gamesStatsTwoWinTendency();
                    e.stopImmediatePropagation();
                });

                $scope.playerTendencyLeagueId = $scope.getLeagueInCurrentSeason.map(function (item) {
                    return item.league_id
                });
                gamesStatsTwoWinTendency();
            };

            var gamesStatsTwoWinTendency = function () {
                TeamInformation.getResultTeam($scope.teamId, $scope.seasonId, $scope.playerTendencyLeagueId).then(function (response) {
                    var game = response.sort(function (a, b) {
                        return a.game_id - b.game_id;
                    });
                    $scope.homeGame = [];
                    $scope.awayGame = [];
                    for (var i = 0; i < game.length; i++) {
                        if (game[i]['place'] === "away") {
                            $scope.awayGame.push(game[i].game_id);
                        }
                    }
                    playerSelectForStats2winTendency($scope.awayGame);
                });
            };
            var playerSelectForStats2winTendency = function (gameIds) {
                if (gameIds == false) {
                    var htmlstring = '';
                    var temp = $compile(htmlstring)($scope);
                    $('#player-tendency-players').html(temp);
                    $('#player-tendency-players').selectpicker('refresh');
                    $('#player-tendency-players').selectpicker('deselectAll');
                    $('#player-tendency-players').selectpicker('selectAll');
                    displayPlayerData();
                } else {
                    TeamInformation.getPlayerStatsByGamesNew($scope.teamId, gameIds).then(function (response) {
                        $scope.statsTwoWin = response;
                        $scope.statsTwoWinPS = JSON.parse(JSON.stringify($scope.statsTwoWin));
                        $scope.statsTwoWinPS.average = $scope.statsTwoWinPS.average.sort(function (a, b) {
                            return b.points - a.points;
                        });

                        var htmlstring = '';
                        var k = 0;
                        for (var i in $scope.statsTwoWinPS.average_40_minutes) {
                            if ($scope.statsTwoWinPS.average_40_minutes[i]['first_name'] !== 'TEAM') {
                                htmlstring = htmlstring + '<option value="' + $scope.statsTwoWinPS.average_40_minutes[i].player_id + '">' + $scope.statsTwoWinPS.average_40_minutes[i].last_name + ' ' + $scope.statsTwoWinPS.average_40_minutes[i].first_name + '</option>';
                                k++;
                            }
                        }
                        ;
                        var temp = $compile(htmlstring)($scope);
                        $('#player-tendency-players').html(temp);
                        $('#player-tendency-players').selectpicker('refresh');
                        $('#player-tendency-players').on('changed.bs.select', function (e) {
                            e.stopImmediatePropagation();
                            var playersId = $('#player-tendency-players').val() ? $('#player-tendency-players').val().map(Number) : [];
                            displayPlayerData(playersId);
                        });
                        $('#player-tendency-players').selectpicker('deselectAll');
                        $('#player-tendency-players').selectpicker('selectAll');

                    });
                }

            };


            function displayPlayerData(ids) {

                TeamInformation.getPlayerStatsTendency(ids, $scope.seasonId, $scope.playerTendencyLeagueId, $scope.awayGame).then(function(data){
                    $scope.tendencyTabCareer = data;
                });
                TeamInformation.getTestData(ids, $scope.seasonId, $scope.playerTendencyLeagueId, $scope.awayGame).then(function (response) {
                    $scope.tendencyDirectionChartData = response;
                });

                $scope.tendencyPlayerData = [];

                ids.forEach(function (v) {
                    PlayerSearchService.getPlayerById(v)
                        .then(function (data) {
                            $scope.tendencyPlayerData.push(data);
                        });
                });

                $timeout(function () {
                    $scope.playerTendencyShotPercentage = [];
                    $scope.tendencyPlayerData.sort((a, b) =>  a.position.id - b.position.id);
                    var it = 0;
                    $scope.tendencyPlayerData.forEach(function (v) {
                        drawPlayerInfoChart(it, v.id);
                        drawDirectionChart(it, v.id);
                        drawAssistAnalysis(it, v.id);
                        it++;
                    });


                    var idNew = $scope.tendencyPlayerData.map(function (value) { return value.id });
                    TeamInformation.getTendencyChartData(idNew, $scope.seasonId, $scope.playerTendencyLeagueId, $scope.awayGame).then(function(response){
                        $scope.tendencyCareerTemp = [];
                        for (var i = 0; i < idNew.length; i++) {
                            for (var l = 0; l < $scope.tendencyTabCareer.length; l++) {
                                if($scope.tendencyTabCareer[l].player.id == idNew[i]) {
                                    $scope.tendencyCareerTemp.push($scope.tendencyTabCareer[l])
                                }
                            }
                            var count = 0;
                            for (var j = 0; j < response.length; j++) {
                                if(response[j].player_id === idNew[i]) {
                                    count++;
                                    var made = [];
                                    var attempt = [];
                                    for (var k = 0; k < response[j].shots.length; k++) {
                                        if(response[j].shots[k].results[0].name.includes('Attempt')) {
                                            attempt.push(response[j].shots[k].position);
                                        } else {
                                            made.push(response[j].shots[k].position);
                                        }
                                    }
                                    $scope.playerTendencyShotPercentage.push(drawPercentage(made, attempt, true));
                                } else if(j === response.length -1 && count != 1) {
                                    $scope.playerTendencyShotPercentage.push(drawPercentage([], [], true));
                                }

                            }
                        }
                        $scope.tendencyTabCareer = [];
                        $scope.tendencyTabCareer = $scope.tendencyCareerTemp;
                    });
                },1500);
            }
            function drawPlayerInfoChart(id, playerId) {
                setTimeout(function () {
                    var dataTemp = $scope.statsTwoWinPS.average.filter(function (obj) {
                        return obj.player_id === playerId;
                    });
                    var data = dataTemp[0];

                    var ft_color = data.ft_percent > 80 ? '#257f36' :
                        data.ft_percent < 80 && data.ft_percent > 70 ? '#cdc720' :
                            '#bc0202';

                    var p2_color = data.p2_percent > 60 ? '#257f36' :
                        data.p2_percent < 60 && data.p2_percent > 45 ? '#cdc720' :
                            '#bc0202';

                    var p3_color = data.p3_percent > 37 ? '#257f36' :
                        data.p3_percent < 37 && data.p3_percent > 30 ? '#cdc720' :
                            '#bc0202';

                    var fg_color = data.p3_percent > 55 ? '#257f36' :
                        data.p3_percent < 55 && data.p3_percent > 45 ? '#cdc720' :
                            '#bc0202';

                    var selector = '#player-info-chart-' + id;
                    $(selector)
                        .kendoChart({
                            series: [
                                {
                                    name: 'FT% = ' + data.ft_percent.toFixed(1),
                                    data: [data.ft_percent.toFixed(1)],
                                    color: ft_color,
                                    labels: {visible: true}
                                },
                                {
                                    name: '2P% = ' + data.p2_percent.toFixed(1),
                                    data: [data.p2_percent.toFixed(1)],
                                    color: p2_color,
                                    labels: {visible: true}
                                },
                                {
                                    name: '3P% = ' + data.p3_percent.toFixed(1),
                                    data: [data.p3_percent.toFixed(1)],
                                    color: p3_color,
                                    labels: {visible: true}
                                },
                                {
                                    name: 'FG% = ' + data.fg_percent.toFixed(1),
                                    data: [data.fg_percent.toFixed(1)],
                                    color: fg_color,
                                    labels: {visible: true}
                                }
                            ],
                            tooltip: {
                                visible: true,
                                background: '#000000',
                                color: '#ffffff',
                                padding: 5,
                                template: "${series.name}",
                                font: "11px Arial,Helvetica,sans-serif"
                            },
                            chartArea: {
                                width: 305,
                                height: 180
                            }
                        });
                }, 600)
            }
            function drawDirectionChart(ids, playerId) {
                setTimeout(function () {
                    var dataTemp1 = $scope.tendencyDirectionChartData.filter(function (obj) {
                        return obj.player_id === playerId;
                    });
                    var data = dataTemp1;
                    var right = 0,
                        left = 0,
                        nodirection = 0,
                        other = 0,
                        all;

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name === null) {
                            other += data[i].made + data[i].attempts;
                        } else if (data[i].name.indexOf('Right') !== -1) {
                            right += data[i].made + data[i].attempts;
                        } else if (data[i].name.indexOf('Left') !== -1) {
                            left += data[i].made + data[i].attempts;
                        } else {
                            nodirection += data[i].made + data[i].attempts;
                        }
                    }
                    all = right + left + nodirection;
                    $('#direction-chart-' + ids)
                        .kendoChart({
                            valueAxis: {
                                labels: {
                                    font: "10px Arial,Helvetica,sans-serif"
                                }
                            },
                            title: {
                                text: '',
                                font: "15px Arial,Helvetica,sans-serif",
                                color: 'black',
                                align: "center"
                            },
                            legend: {
                                font: "9px Arial,Helvetica,sans-serif",
                                position: 'right'
                            },
                            series: [
                                {
                                    // name: 40 +'% Going Left',
                                    name:Math.round(left / all * 100) + '% Going Left',
                                    // data: [40],
                                    data:[Math.round(left / all * 100)],
                                    color: 'red',
                                    labels: {visible: true}
                                },
                                {
                                    // name:70 + '% Going Right',
                                    name:Math.round(right / all * 100) + '% Going Right',
                                    // data: [70],
                                    data:[Math.round(right / all * 100)],
                                    color: 'blue',
                                    labels: {visible: true}
                                },
                                {
                                    // name:30 + '% No direction',
                                    name:Math.round(nodirection / all * 100) + '% No direction',
                                    // data: [30],
                                    data: [Math.round(nodirection / all * 100)],
                                    color: '#d6d8d8',
                                    labels: {visible: true}
                                }

                            ],
                            tooltip: {
                                visible: true,
                                background: '#000000',
                                color: '#ffffff',
                                padding: 5,
                                template: "${series.name.split(' ').slice(1).join(' ')} - ${value}%",
                                font: "11px Arial,Helvetica,sans-serif"
                            },
                            chartArea: {
                                width: 330,
                                height: 180
                            }
                        });
                }, 500)
            }
            function drawAssistAnalysis(ids, playerId) {
                setTimeout(function () {
                    var data = $scope.tendencyDirectionChartData.filter(function (obj) {
                        return obj.player_id === playerId;
                    }).sort((a, b) => b.attempts - a.attempts);
                    var chartData = [];
                    for (var i = 0; i < data.length; i++) {
                        var obj = {
                            name: data[i].attempts + ' ' +  data[i].name,
                            data: [data[i].attempts],
                            color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                            labels: {visible: true}
                        };
                        chartData.push(obj);
                    }
                    var select = '#assist-analysis-' + ids;
                    $(select).kendoChart({
                        series: chartData.slice(0,6),
                        chartArea: {
                            width: 405,
                            height: 180
                        }
                    });
                }, 400)
            }

            setTimeout(function () {
                leaguesStatsTwoWinTendency();
            },1600)
            //End Player Tendency
        }
            //player id
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
                $('body').removeClass('modal-open');
            };

            //compare function
            function compareNumber(a, b) {
                if (a > b) return 1;
                if (a < b) return -1;
            }

            //draw chart for Players Stats
            function drawPlayersStats(data, categories) {
                $("#chartPlayerStats").kendoChart({
                    series: [{
                        labels: {
                            font: "10px Arial,Helvetica,sans-serif",
                            visible: true,
                            padding: 2
                        },
                        name: "Points",
                        data: data,
                        color: '#3366cc'
                    }
                    ],
                    categoryAxis: {
                        categories: categories,
                        labels: {
                            rotation: '-30'
                        }
                    },
                    legend: {
                        font: "10px Arial,Helvetica,sans-serif",
                        position: 'top'
                    }
                });
            }

        $scope.regExp = /\s+/g;
        $scope.regTeam = /_/g;

        //setTimeOut loader
        function loader() {
            setTimeout(
                function () {
                    $(".panel-group").fadeIn(1000)
                },0
            );
            $(".loader-container-team").fadeOut(500);
        }

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

    }]);

