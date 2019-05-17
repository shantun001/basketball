
app.controller('PRController', ['$timeout','$rootScope','$scope','$compile','psService','PlayerSearchService','$location','headerService','$window', PlayerRankingsController]);
function PlayerRankingsController($timeout,$rootScope,$scope,$compile,psService,PlayerSearchService,$location,headerService,$window) {

    $scope.queryData = {
        season: '',
        league: '',
        positions: '',
        country: ''
    };


    $scope.playerListData = null;
    $scope.redirectToPlayers = function () {
        $location.path('/playersearch/players');
    };
    $("#loader-container-players").fadeOut(4500);
    $scope.setSeasonId = function (id, choiceSeason) {
        $scope.seasonId.id = id;
        $rootScope.choiceSeason = choiceSeason;
        $scope.tableParams = headerService.getParams();
    };

//player_search
    $scope.updateSeasonSelectRank = function () {
        psService.getSeasons().then(function (response) {
            var seasons = response;
            var htmlstring = '';
            for (var i = 0; i < seasons.length; i++) {
                htmlstring = htmlstring + '<option value="' + seasons[i].id + '">' + seasons[i].name + '</option>';
                var temp = $compile(htmlstring)($scope);
                $('#search-season').html(temp);
                $('#search-season').selectpicker('refresh');
                $('#search-league').selectpicker();
            }
            $('#search-season').on('changed.bs.select', function (e) {
                e.preventDefault();
                $scope.queryData.season = $('#search-season').val();
                $scope.updateLeagueSelect(Number(e.target.value));
            });
        });

    };
    $scope.updateLeagueSelect = function (season_id) {
        psService.getLeagues(season_id).then(function (data) {

            data.sort(function(a,b){
                if(a.name > b.name) return 1;
                if(a.name < b.name) return -1;
            });
            var htmlstring = '';
            for (var i = 0; i < data.length; i++) {
                htmlstring = htmlstring + '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                var temp = $compile(htmlstring)($scope);
                $('#search-league').html(temp).selectpicker('refresh');
            }
            $('#search-league').on('changed.bs.select', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $scope.queryData.league = $('#search-league').val() || [];

            });
        });
    };
    $scope.playerSortObj = {
        name: 'none',
        position: 'none',
        height: 'none',
        age: 'none',
        min:'none',
        pts: 'none',
        s4ur: 'none',
        oer:'none',
        vir:'none',
        val:'none',
        tr: 'none',
        astn: 'none',
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

        $scope.tableMarkup = '';
        var dataSourceName = fieldName + 'Sort';

        $scope.playerListData.length = 0;
        switch (fieldName) {
            case 'name':
                $scope.playerListData = $scope.nameSort.slice();
                break;
            case 'position':
                $scope.playerListData = $scope.positionSort.slice();
                break;
            case 'height':
                $scope.playerListData = $scope.heightSort.slice();
                break;
            case 'age':
                $scope.playerListData = $scope.ageSort.slice();
                break;
            case 'tr':
                $scope.playerListData = $scope.trSort.slice();
                break;
            case 'astn':
                $scope.playerListData = $scope.astnSort.slice();
                break;
            case 'min':
                $scope.playerListData = $scope.minSort.slice();
                break;
            case 'pts':
                $scope.playerListData = $scope.ptsSort.slice();
                break;
            case 's4ur':
                $scope.playerListData = $scope.s4urSort.slice();
                break;
            case 'oer':
                $scope.playerListData = $scope.oerSort.slice();
                break;
            case 'vir':
                $scope.playerListData = $scope.virSort.slice();
                break;
            case 'val':
                $scope.playerListData = $scope.valSort.slice();
                break;
            case 'team':
                $scope.playerListData = $scope.teamSort.slice();
                break;
            case 'video':
                $scope.playerListData = $scope.videoSort.slice();
                break;
            default:
                break;
        }
        switch($scope.playerSortObj[''  + fieldName + '']) {
            case 'none':
                $scope.playerListData = $scope.playerListData.slice();
                break;
            case 'up':
                $scope.playerListData = $scope.playerListData.reverse().slice();
                break;
            default:
                break;
        }
        loadPages();

    };

    $scope.startSearch=function (e) {
        e.originalEvent.stopImmediatePropagation();
        var seasonId = $('#search-season').val();
        var leagueId = $('#search-league').val();
            function showPlayers(data) {
                $scope.playerListData = data;
                $scope.tablePlayersData = $scope.playerListData.slice();
                $scope.nameSort = _.sortBy($scope.playerListData, 'player_last_name').slice();
                $scope.positionSort = _.sortBy($scope.playerListData, 'player_position').slice();
                $scope.heightSort = _.sortBy($scope.playerListData, 'player_height').slice();
                $scope.ageSort = _.sortBy($scope.playerListData, 'player_age').slice();
                $scope.trSort = _.sortBy($scope.playerListData, 'total_rebounds').slice();
                $scope.astnSort = _.sortBy($scope.playerListData, 'assists').slice();
                $scope.minSort = _.sortBy($scope.playerListData, 'minutes').slice();
                $scope.ptsSort = _.sortBy($scope.playerListData, 'points').slice();
                $scope.s4urSort = _.sortBy($scope.playerListData, 's4ur').slice();
                $scope.oerSort = _.sortBy($scope.playerListData, 'oer').slice();
                $scope.virSort = _.sortBy($scope.playerListData, 'vir').slice();
                $scope.valSort = _.sortBy($scope.playerListData, 'val').slice();
                $scope.teamSort = _.sortBy($scope.playerListData, 'team_name').slice();
                $scope.videoSort = _.sortBy($scope.playerListData, 'videos.length').slice();
                $scope.currentPage = 0;
                $scope.previousCount = 0;
                $scope.nextCount = 0;
                $scope.paging = {
                    total: Math.ceil(parseFloat($scope.playerListData.length / 20)),
                    current: 1,
                    onPageChanged: loadPages
                };
            }
            psService.searchPlayers(seasonId, leagueId, $scope.heightId, $scope.ageId,
                $scope.fgmId, $scope.fgaId, $scope.fgId, $scope.n3pmId, $scope.n3paId, $scope.n3pId, $scope.n2pmId, $scope.n2paId,
                $scope.n2pId, $scope.ftmId, $scope.ftaId, $scope.ftId, $scope.orId, $scope.drId, $scope.trId, $scope.asId, $scope.toId, $scope.stId,
                $scope.ptsId, $scope.minId, $scope.bsId, $scope.valId, $scope.oerId, $scope.virId).then(showPlayers);

            $scope.paging = $scope.playersPagin.slice(20);
        };
    function loadPages(){
        $scope.tempTableData = $scope.playerListData.slice();
        $scope.currentPage = $scope.paging.current;
        $scope.previousCount = $scope.currentPage * 20 - 20;
        $scope.nextCount = $scope.currentPage * 20;
        $scope.playersPagin = $scope.tempTableData.slice($scope.previousCount, $scope.nextCount);
        $timeout($scope.$apply);
    }

    $scope.getPlayerData = function(id) {
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
}

