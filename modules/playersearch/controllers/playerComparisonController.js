app.controller('PlayerComparisonController', ['$scope', '$rootScope', 'PlayerSearchService', '$location',
    function ($scope, $rootScope, PlayerSearchService, $location) {

        $scope.searchString = '';
        $scope.selectedLeague = [{league: ''}, {league: ''}, {league: ''}, {league: ''}, {league: ''}];
        $scope.selectedSeason = [{season: ''}, {season: ''}, {season: ''}, {season: ''}, {season: ''}];
        $scope.width = 1150;
        $scope.top = -500;
        $scope.height = 0;
        $scope.data = null;
        $scope.chosenPlayers = [];
        $scope.chosenPlayersData = [];
        $scope.chosenPlayersLeagues = [];
        $scope.chosenPlayersSeasons = [];
        $scope.chosenPlayersDataTables = [];
        $scope.comparisonBubble = {};

        $scope.chosenPlayerCareer = {
            'Team': '',
            'GP': 0,
            'MIN': 0,
            'PTS': 0,
            'FGM': 0,
            'FGA': 0,
            'FG%': 0,
            '3PM': 0,
            '3PA': 0,
            '3P%': 0,
            '2PM': 0,
            '2PA': 0,
            '2P%': 0,
            'FTM': 0,
            'FTA': 0,
            'FT%': 0,
            'OR': 0,
            'DR': 0,
            'TR': 0,
            'AS': 0,
            'TO': 0,
            'ST': 0,
            'BS': 0,
            'FM': 0,
            'FR': 0,
            'VAL': 0,
            'VIR': 0,
            'OER': 0
        };

        $scope.choosePlayer = function(id){
            if($scope.data.length){
                var chosenPlayer = $scope.data.find(function(item, index){
                    if(item.id === id) {
                        return item;
                    }
                    });
                $scope.chosenPlayers.push(chosenPlayer);
                $scope.lostFocus();
                $scope.getCareer(id);
            }
        };

        $scope.choosePlayerEnter = function(e){
           if (e.key === 'Enter') {
               var chosenPlayer = $scope.data[0];
               $scope.chosenPlayers.push(chosenPlayer);
               $scope.getCareer($scope.data[0].id);
               $scope.lostFocus();

           }
        };

        $scope.deletePlayer = function (index) {
            $scope.chosenPlayers.splice(index, 1);
            $scope.chosenPlayersData.splice(index, 1);
            $scope.chosenPlayersLeagues.splice(index, 1);
            $scope.chosenPlayersSeasons.splice(index, 1);
            $scope.chosenPlayersDataTables.splice(index, 1);
            $scope.comparisonPlayers();
        };

        $scope.foundPlayerId = function(obj){
            $rootScope.playerProfile = null;
            $rootScope.playerProfile = obj;

        };

        $scope.lostFocus = function(){
            $scope.searchString ='';
            $scope.data = null;
            $scope.width = 320;
            $scope.searching = false;
            $scope.height = 0;
        };

        $scope.getPlayers = function() {
            PlayerSearchService.getPlayers($scope.searchString)
                .then(function(data){
                    if($scope.chosenPlayers.length !== 5) {
                        $scope.data = null;
                        if (!data.length) {
                            $scope.top = -500;
                        } else {
                            $scope.top = 0;
                            $scope.height = 300;
                        }
                        $scope.data = data;
                        $scope.width = 786;
                    }else{
                        $scope.lostFocus();
                        alert('You can compare upto five players only');
                    }
                });
            $(document).click(function (event) {
                if ($(event.target).closest(".comparison-search-result").length) return;
                $scope.searchString ='';
                $scope.data = null;
                $scope.width = 320;
                $scope.searching = false;
                $scope.height = 0;
                $scope.top = -500;
            });
        };

        $scope.getCareer = function(id) {
            PlayerSearchService.getCareer(id)
                .then(function(data) {
                    $scope.chosenPlayersData.push(data);
                    $scope.chosenPlayersLeagues.push([]);
                    $scope.chosenPlayersSeasons.push([]);
                    $('#comparison-select-season_0').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-season_1').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-season_2').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-season_3').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-season_4').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-league_0').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-league_1').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-league_2').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-league_3').selectpicker({
                        dropupAuto: false
                    });
                    $('#comparison-select-league_4').selectpicker({
                        dropupAuto: false
                    });
                    data.map(function (item) {
                        if ($scope.chosenPlayersSeasons[$scope.chosenPlayersSeasons.length-1].indexOf(item.season_name) === -1) {
                            $scope.chosenPlayersSeasons[$scope.chosenPlayersSeasons.length-1].push(item.season_name);
                    }
                        if (($scope.chosenPlayersLeagues[$scope.chosenPlayersLeagues.length-1].indexOf(item.league_name) === -1) && item.league_name !== 'average' && item.season_name === $scope.chosenPlayersSeasons[$scope.chosenPlayersSeasons.length-1][0]) {
                            $scope.chosenPlayersLeagues[$scope.chosenPlayersLeagues.length-1].push(item.league_name);
                        }

                    });
                    $scope.selectedSeason[$scope.chosenPlayers.length-1].season = $scope.chosenPlayersSeasons[$scope.chosenPlayers.length-1][0];
                    $scope.selectedLeague[$scope.chosenPlayers.length-1].league = $scope.chosenPlayersLeagues[$scope.chosenPlayers.length-1][0];$scope.chosenPlayersData[$scope.chosenPlayersData.length - 1].map(function (item) {
                        if ((item.season_name === $scope.selectedSeason[$scope.chosenPlayers.length-1].season) && (item.league_name === $scope.selectedLeague[$scope.chosenPlayers.length-1].league) && item.league_name !== 'average' ) {
                            $scope.chosenPlayerCareer['Team'] = item.team_name;
                            $scope.chosenPlayerCareer['GP'] = item.played;
                            $scope.chosenPlayerCareer['MIN'] = item.minutes;
                            $scope.chosenPlayerCareer['PTS'] = item.points;
                            $scope.chosenPlayerCareer['FGM'] = item.fg_made;
                            $scope.chosenPlayerCareer['FGA'] = item.fg_attempts;
                            $scope.chosenPlayerCareer['FG%'] = ($scope.chosenPlayerCareer['FGA']) ? ($scope.chosenPlayerCareer['FGM'] / $scope.chosenPlayerCareer['FGA']) * 100 : 0;
                            $scope.chosenPlayerCareer['3PM'] = item.p3_made;
                            $scope.chosenPlayerCareer['3PA'] = item.p3_attempts;
                            $scope.chosenPlayerCareer['3P%'] = ($scope.chosenPlayerCareer['3PA']) ? ($scope.chosenPlayerCareer['3PM'] / $scope.chosenPlayerCareer['3PA']) * 100 : 0;
                            $scope.chosenPlayerCareer['2PM'] = item.p2_made;
                            $scope.chosenPlayerCareer['2PA'] = item.p2_attempts;
                            $scope.chosenPlayerCareer['2P%'] = ($scope.chosenPlayerCareer['2PA']) ? ($scope.chosenPlayerCareer['2PM'] / $scope.chosenPlayerCareer['2PA']) * 100 : 0;
                            $scope.chosenPlayerCareer['FTM'] = item.ft_made;
                            $scope.chosenPlayerCareer['FTA'] = item.ft_attempts;
                            $scope.chosenPlayerCareer['FT%'] = ($scope.chosenPlayerCareer['FTA']) ? ($scope.chosenPlayerCareer['FTM'] / $scope.chosenPlayerCareer['FTA']) * 100 : 0;
                            $scope.chosenPlayerCareer['OR'] = item.of_rebounds;
                            $scope.chosenPlayerCareer['DR'] = item.df_rebounds;
                            $scope.chosenPlayerCareer['TR'] = $scope.chosenPlayerCareer['OR'] + $scope.chosenPlayerCareer['DR'];
                            $scope.chosenPlayerCareer['AS'] = item.assists;
                            $scope.chosenPlayerCareer['TO'] = item.turnovers;
                            $scope.chosenPlayerCareer['ST'] = item.steals;
                            $scope.chosenPlayerCareer['BS'] = item.block_shots;
                            $scope.chosenPlayerCareer['FM'] = item.fouls_made;
                            $scope.chosenPlayerCareer['FR'] = item.fouls_received;
                            $scope.chosenPlayerCareer['VAL'] = item.val;
                            $scope.chosenPlayerCareer['VIR'] = item.vir;
                            $scope.chosenPlayerCareer['OER'] = item.oer;
                            $scope.chosenPlayerCareer['timeInNum'] = $scope.timeToNum(item.minutes);
                        }

                    });

                    $scope.chosenPlayersDataTables.push({
                        'Nationality': $scope.chosenPlayers[$scope.chosenPlayers.length - 1].main_nationality.name,
                        'Height': $scope.chosenPlayers[$scope.chosenPlayers.length - 1].height,
                        'Age': $scope.getAge($scope.chosenPlayers[$scope.chosenPlayers.length - 1].birth_date),
                        'Position': $scope.chosenPlayers[$scope.chosenPlayers.length - 1].position.short_name,
                        'Team': $scope.chosenPlayerCareer['Team'],
                        'GP':  $scope.chosenPlayerCareer['GP'],
                        'MIN': $scope.chosenPlayerCareer['MIN'],
                        'PTS': $scope.chosenPlayerCareer['PTS'].toFixed(1),
                        'FGM': $scope.chosenPlayerCareer['FGM'].toFixed(1),
                        'FGA': $scope.chosenPlayerCareer['FGA'].toFixed(1),
                        'FG%': $scope.chosenPlayerCareer['FG%'].toFixed(1),
                        '3PM': $scope.chosenPlayerCareer['3PM'].toFixed(1),
                        '3PA': $scope.chosenPlayerCareer['3PA'].toFixed(1),
                        '3P%': $scope.chosenPlayerCareer['3P%'].toFixed(1),
                        '2PM': $scope.chosenPlayerCareer['2PM'].toFixed(1),
                        '2PA': $scope.chosenPlayerCareer['2PA'].toFixed(1),
                        '2P%': $scope.chosenPlayerCareer['2P%'].toFixed(1),
                        'FTM': $scope.chosenPlayerCareer['FTM'].toFixed(1),
                        'FTA': $scope.chosenPlayerCareer['FTA'].toFixed(1),
                        'FT%': $scope.chosenPlayerCareer['FT%'].toFixed(1),
                        'OR': $scope.chosenPlayerCareer['OR'].toFixed(1),
                        'DR': $scope.chosenPlayerCareer['DR'].toFixed(1),
                        'TR': $scope.chosenPlayerCareer['TR'].toFixed(1),
                        'AS': $scope.chosenPlayerCareer['AS'].toFixed(1),
                        'TO': $scope.chosenPlayerCareer['TO'].toFixed(1),
                        'ST': $scope.chosenPlayerCareer['ST'].toFixed(1),
                        'BS': $scope.chosenPlayerCareer['BS'].toFixed(1),
                        'FM': $scope.chosenPlayerCareer['FM'].toFixed(1),
                        'FR': $scope.chosenPlayerCareer['FR'].toFixed(1),
                        'VAL': $scope.chosenPlayerCareer['VAL'].toFixed(1),
                        'VIR': $scope.chosenPlayerCareer['VIR'].toFixed(2),
                        'OER': $scope.chosenPlayerCareer['OER'].toFixed(2),
                        'timeToNum': $scope.chosenPlayerCareer['timeInNum']
                    });
                    $scope.chosenPlayerCareer = {
                        'Team': '',
                        'GP': 0,
                        'MIN': 0,
                        'PTS': 0,
                        'FGM': 0,
                        'FGA': 0,
                        'FG%': 0,
                        '3PM': 0,
                        '3PA': 0,
                        '3P%': 0,
                        '2PM': 0,
                        '2PA': 0,
                        '2P%': 0,
                        'FTM': 0,
                        'FTA': 0,
                        'FT%': 0,
                        'OR': 0,
                        'DR': 0,
                        'TR': 0,
                        'AS': 0,
                        'TO': 0,
                        'ST': 0,
                        'BS': 0,
                        'FM': 0,
                        'FR': 0,
                        'VAL': 0,
                        'VIR': 0,
                        'OER': 0,
                        'timeInNum': 0
                    };

                    $scope.comparisonPlayers();
                    setTimeout( function () {
                        $('#comparison-select-season_0').selectpicker('refresh');
                        $('#comparison-select-season_1').selectpicker('refresh');
                        $('#comparison-select-season_2').selectpicker('refresh');
                        $('#comparison-select-season_3').selectpicker('refresh');
                        $('#comparison-select-season_4').selectpicker('refresh');
                        $('#comparison-select-league_0').selectpicker('refresh');
                        $('#comparison-select-league_1').selectpicker('refresh');
                        $('#comparison-select-league_2').selectpicker('refresh');
                        $('#comparison-select-league_3').selectpicker('refresh');
                        $('#comparison-select-league_4').selectpicker('refresh');
                    }, 0)


                });
        };

        $scope.selectSeason = function(index){
            $scope.chosenPlayersLeagues[index] = [];
            $scope.chosenPlayersData[index].map(function (item) {
                if(($scope.selectedSeason[index].season === item.season_name) && item.league_name !== 'average') {
                    $scope.chosenPlayersLeagues[index].push(item.league_name)
                }
            });
            $scope.selectedLeague[index].league = $scope.chosenPlayersLeagues[index][0];
            $scope.updateDataTable(index, $scope.selectedLeague[index].league, $scope.selectedSeason[index].season);
            $scope.comparisonPlayers();
        };

        $scope.selectLeague = function (index) {
            $scope.updateDataTable(index, $scope.selectedLeague[index].league, $scope.selectedSeason[index].season);
            $scope.comparisonPlayers();
        };

        $scope.updateDataTable = function (index, league, season) {

            setTimeout( function () {
                $('#comparison-select-season_0').selectpicker('refresh');
                $('#comparison-select-season_1').selectpicker('refresh');
                $('#comparison-select-season_2').selectpicker('refresh');
                $('#comparison-select-season_3').selectpicker('refresh');
                $('#comparison-select-season_4').selectpicker('refresh');
                $('#comparison-select-league_0').selectpicker('refresh');
                $('#comparison-select-league_1').selectpicker('refresh');
                $('#comparison-select-league_2').selectpicker('refresh');
                $('#comparison-select-league_3').selectpicker('refresh');
                $('#comparison-select-league_4').selectpicker('refresh');
            }, 0);
                    $scope.chosenPlayersData[index].map(function (item) {
                    if (item.league_name === league && item.season_name === season && item.league_name !== 'average') {

                        $scope.chosenPlayerCareer['Team'] = item.team_name;
                        $scope.chosenPlayerCareer['GP'] = item.played;
                        $scope.chosenPlayerCareer['MIN'] = item.minutes;
                        $scope.chosenPlayerCareer['PTS'] = item.points;
                        $scope.chosenPlayerCareer['FGM'] = item.fg_made;
                        $scope.chosenPlayerCareer['FGA'] = item.fg_attempts;
                        $scope.chosenPlayerCareer['FG%'] = ($scope.chosenPlayerCareer['FGA']) ? ($scope.chosenPlayerCareer['FGM'] / $scope.chosenPlayerCareer['FGA']) * 100 : 0;
                        $scope.chosenPlayerCareer['3PM'] = item.p3_made;
                        $scope.chosenPlayerCareer['3PA'] = item.p3_attempts;
                        $scope.chosenPlayerCareer['3P%'] = ($scope.chosenPlayerCareer['3PA']) ? ($scope.chosenPlayerCareer['3PM'] / $scope.chosenPlayerCareer['3PA']) * 100 : 0;
                        $scope.chosenPlayerCareer['2PM'] = item.p2_made;
                        $scope.chosenPlayerCareer['2PA'] = item.p2_attempts;
                        $scope.chosenPlayerCareer['2P%'] = ($scope.chosenPlayerCareer['2PA']) ? ($scope.chosenPlayerCareer['2PM'] / $scope.chosenPlayerCareer['2PA']) * 100 : 0;
                        $scope.chosenPlayerCareer['FTM'] = item.ft_made;
                        $scope.chosenPlayerCareer['FTA'] = item.ft_attempts;
                        $scope.chosenPlayerCareer['FT%'] = ($scope.chosenPlayerCareer['FTA']) ? ($scope.chosenPlayerCareer['FTM'] / $scope.chosenPlayerCareer['FTA']) * 100 : 0;
                        $scope.chosenPlayerCareer['OR'] = item.of_rebounds;
                        $scope.chosenPlayerCareer['DR'] = item.df_rebounds;
                        $scope.chosenPlayerCareer['TR'] = $scope.chosenPlayerCareer['OR'] + $scope.chosenPlayerCareer['DR'];
                        $scope.chosenPlayerCareer['AS'] = item.assists;
                        $scope.chosenPlayerCareer['TO'] = item.turnovers;
                        $scope.chosenPlayerCareer['ST'] = item.steals;
                        $scope.chosenPlayerCareer['BS'] = item.block_shots;
                        $scope.chosenPlayerCareer['FM'] = item.fouls_made;
                        $scope.chosenPlayerCareer['FR'] = item.fouls_received;
                        $scope.chosenPlayerCareer['VAL'] = item.val;
                        $scope.chosenPlayerCareer['VIR'] = item.vir;
                        $scope.chosenPlayerCareer['OER'] = item.oer;
                        $scope.chosenPlayerCareer['timeInNum'] = $scope.timeToNum(item.minutes);

                    }
                });

            $scope.chosenPlayersDataTables[index]['Team'] =  $scope.chosenPlayerCareer['Team'];
            $scope.chosenPlayersDataTables[index]['GP'] = $scope.chosenPlayerCareer['GP'];
            $scope.chosenPlayersDataTables[index]['MIN'] = $scope.chosenPlayerCareer['MIN'];
            $scope.chosenPlayersDataTables[index]['PTS'] = $scope.chosenPlayerCareer['PTS'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['FGM'] = $scope.chosenPlayerCareer['FGM'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['FGA'] = $scope.chosenPlayerCareer['FGA'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['FG%'] = $scope.chosenPlayerCareer['FG%'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['3PM'] = $scope.chosenPlayerCareer['3PM'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['3PA'] = $scope.chosenPlayerCareer['3PA'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['3P%'] = $scope.chosenPlayerCareer['3P%'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['2PM'] = $scope.chosenPlayerCareer['2PM'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['2PA'] = $scope.chosenPlayerCareer['2PA'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['2P%'] = $scope.chosenPlayerCareer['2P%'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['FTM'] = $scope.chosenPlayerCareer['FTM'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['FTA'] = $scope.chosenPlayerCareer['FTA'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['FT%'] = $scope.chosenPlayerCareer['FT%'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['OR'] = $scope.chosenPlayerCareer['OR'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['DR'] = $scope.chosenPlayerCareer['DR'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['TR'] = $scope.chosenPlayerCareer['TR'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['AS'] = $scope.chosenPlayerCareer['AS'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['TO'] = $scope.chosenPlayerCareer['TO'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['ST'] = $scope.chosenPlayerCareer['ST'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['BS'] = $scope.chosenPlayerCareer['BS'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['FM'] = $scope.chosenPlayerCareer['FM'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['FR'] = $scope.chosenPlayerCareer['FR'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['VAL'] = $scope.chosenPlayerCareer['VAL'].toFixed(1);
            $scope.chosenPlayersDataTables[index]['VIR'] = $scope.chosenPlayerCareer['VIR'].toFixed(2);
            $scope.chosenPlayersDataTables[index]['OER'] = $scope.chosenPlayerCareer['OER'].toFixed(2);

            $scope.chosenPlayerCareer = {
                'Team': '',
                'GP': 0,
                'MIN': 0,
                'PTS': 0,
                'FGM': 0,
                'FGA': 0,
                'FG%': 0,
                '3PM': 0,
                '3PA': 0,
                '3P%': 0,
                '2PM': 0,
                '2PA': 0,
                '2P%': 0,
                'FTM': 0,
                'FTA': 0,
                'FT%': 0,
                'OR': 0,
                'DR': 0,
                'TR': 0,
                'AS': 0,
                'TO': 0,
                'ST': 0,
                'BS': 0,
                'FM': 0,
                'FR': 0,
                'VAL': 0,
                'VIR': 0,
                'OER': 0,
                'timeInNum':0
            };

        };

        $scope.comparisonPlayers = function () {
            for (key in $scope.chosenPlayersDataTables[0]){
                $scope.comparisonBubble[key] = $scope.chosenPlayersDataTables[0][key]
            }
            for (var i = 0; i < $scope.chosenPlayersDataTables.length; i++) {
                for (key in $scope.comparisonBubble) {
                    $scope.comparisonBubble[key] = (($scope.comparisonBubble[key] - $scope.chosenPlayersDataTables[i][key]) < 0) ? $scope.chosenPlayersDataTables[i][key] : $scope.comparisonBubble[key];
                }
            }

        };

        $scope.timeToNum = function (time) {
            var minutes = time.slice(0, 2);
            var seconds = time.slice(3, 5);
            minutes = minutes * 60000;
            seconds = seconds * 1000;
            return minutes + seconds;
        };

        $scope.getAge = function(birthdate) {
            if(!birthdate) return '';
            return new Date().getFullYear() - new Date(birthdate).getFullYear() + ' years';
        };
    }]);

