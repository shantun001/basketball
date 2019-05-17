
app.controller('PSController', ['$timeout','$rootScope','$scope','$compile','psService','PlayerSearchService','$location','headerService','$window', PlayerSearchController]);
function PlayerSearchController($timeout,$rootScope,$scope,$compile,psService,PlayerSearchService,$location,headerService,$window) {

    $scope.queryData = {
        season: '',
        league: '',
        positions: '',
        country: ''
    };
    $scope.querData= {
        season: '',
        league: ''
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
    $scope.updateSeasonSelect = function () {
        psService.getSeasons().then(function (response) {
            var seasons = response;
            var htmlstring = '';
            for (var i = 0; i < seasons.length; i++) {
                htmlstring = htmlstring + '<option value="' + seasons[i].id + '">' + seasons[i].name + '</option>';
                var temp = $compile(htmlstring)($scope);
                $('#search-season').html(temp);
                $('#search-season').selectpicker('refresh');
                $('#search-position').selectpicker();
                $('#search-country').selectpicker();
                $('#search-league').selectpicker();
            }
            $('#search-season').on('changed.bs.select', function (e) {
                e.preventDefault();
                $scope.queryData.season = $('#search-season').val();
                $scope.updateLeagueSelect(Number(e.target.value));
                $scope.updateCountriesSelect();
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
                    $scope.updateCountriesSelect();
            });
        });
    };

    $scope.updateCountriesSelect = function(){
        $('#search-country').html('').selectpicker('refresh');

        var seasonid = $scope.queryData.season || null;
        var leagueid = $scope.queryData.league || null;

        psService.getCountries(seasonid, leagueid).then(function (data) {
            var htmlstring = '';

            for (var i = 0; i < data.length; i++) {
                htmlstring = htmlstring + '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                var temp = $compile(htmlstring)($scope);
                $('#search-country').html(temp).selectpicker('refresh');
            }
            $('#search-country').on('changed.bs.select', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $scope.queryData.country = $('#search-country').val() || [];

            });
        });
    };

    $('#search-position').on('changed.bs.select', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $scope.queryData.positions = $('#search-position').val() || [];

    });

   var sliderheight = $("#rangeslider").kendoRangeSlider({
        min: 150,
        max: 220,
        smallStep: 1,
        largeStep: 10,
        tickPlacement: "both",
        tooltip: {
            format: ""
        },
       change: function(e){$scope.heightId = sliderheight.value()}
    }).data('kendoRangeSlider');

    var sliderage = $("#rangeslider2").kendoRangeSlider({
        min: 15,
        max: 45,
        smallStep: 1,
        largeStep: 10,
        tickPlacement: "both",
        tooltip: {
            format: ""
        },
        change: function(e){$scope.ageId = sliderage.value()}
    }).data('kendoRangeSlider');

    var slider1 = $('#slider1').kendoSlider({
            increaseButtonTitle: "Right",
            decreaseButtonTitle: "Left",
            min:0,
            max: 15,
            smallStep: 0.5,
            largeStep: 5,
            change: function(){$scope.fgmId = slider1.value()},
            width:300,
        }).data("kendoSlider");

    var slider2 = $('#slider2').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.fgaId = slider2.value()},
        width:300,
    }).data("kendoSlider");

    var slider3 = $('#slider3').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 100,
        smallStep: 1,
        largeStep: 25,
        change: function(){$scope.fgId = slider3.value()},
        width:300,
    }).data("kendoSlider");

    var slider4 = $('#slider4').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.n3pmId = slider4.value()},
        width:300,
    }).data("kendoSlider");

    var slider5 = $('#slider5').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.n3paId = slider5.value()},
        width:300,
    }).data("kendoSlider");

    var slider6 = $('#slider6').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 100,
        smallStep: 1,
        largeStep: 25,
        change: function(){$scope.n3pId = slider6.value()},
        width:300,
    }).data("kendoSlider");

    var slider7 = $('#slider7').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.n2pmId = slider7.value()},
        width:300,
    }).data("kendoSlider");

    var slider8 = $('#slider8').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.n2paId = slider8.value()},
        width:300,
    }).data("kendoSlider");

    var slider9 = $('#slider9').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 100,
        smallStep: 1,
        largeStep: 25,
        change: function(){$scope.n2pId = slider9.value()},
        width:300,
    }).data("kendoSlider");

    var slider10 = $('#slider10').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.ftmId = slider10.value()},
        width:300,
    }).data("kendoSlider");

    var slider11 = $('#slider11').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.ftaId = slider11.value()},
        width:300,
    }).data("kendoSlider");

    var slider12 = $('#slider12').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 100,
        smallStep: 1,
        largeStep: 25,
        change: function(){$scope.ftId = slider12.value()},
        width:300,
    }).data("kendoSlider");

    var slider13 = $('#slider13').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.orId = slider13.value()},
        width:300,
    }).data("kendoSlider");

    var slider14 = $('#slider14').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.drId = slider14.value()},
        width:300,
    }).data("kendoSlider");

    var slider15 = $('#slider15').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.trId = slider15.value()},
        width:300,
    }).data("kendoSlider");

    var slider16 = $('#slider16').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.asId = slider16.value()},
        width:300,
    }).data("kendoSlider");

    var slider17 = $('#slider17').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.toId = slider17.value()},
        width:300,
    }).data("kendoSlider");

    var slider18 = $('#slider18').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.stId = slider18.value()},
        width:300,
    }).data("kendoSlider");

    var slider19 = $('#slider19').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.ptsId = slider19.value()},
        width:300,
    }).data("kendoSlider");


    var slider20 = $('#slider20').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 40,
        smallStep: 1,
        largeStep: 10,
        change: function(){$scope.minId = slider20.value()},
        width:300,
    }).data("kendoSlider");

    var slider21 = $('#slider21').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.bsId = slider21.value()},
        width:300,
    }).data("kendoSlider");

    var slider22 = $('#slider22').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 15,
        smallStep: 0.5,
        largeStep: 5,
        change: function(){$scope.valId = slider22.value()},
        width:300,
    }).data("kendoSlider");

    var slider23 = $('#slider23').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 2,
        smallStep: 0.01,
        largeStep: 0.05,
        change: function(){$scope.oerId = slider23.value()},
        width:500,
    }).data("kendoSlider");

    var slider24 = $('#slider24').kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min:0,
        max: 2,
        smallStep: 0.01,
        largeStep: 0.05,
        change: function(){$scope.virId = slider24.value();},
        width:500,
    }).data("kendoSlider");

    $scope.playerSortObj = {
        name: 'none',
        position: 'none',
        height: 'none',
        age: 'none',
        pts: 'none',
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
            case 'pts':
                $scope.playerListData = $scope.ptsSort.slice();
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
//search players
     $scope.startSearch=function (e) {
         e.preventDefault();
         e.stopImmediatePropagation();
      var seasonId = $('#search-season').val();
      var leagueId = $('#search-league').val();
      var countryId = $('#search-country').val();
      var positionId = $('#search-position').val();

      function showPlayers(data){
              $scope.playerListData = data;
              $scope.tablePlayersData = $scope.playerListData.slice();
              $scope.nameSort = _.sortBy($scope.playerListData, 'player_last_name').slice();
              $scope.positionSort = _.sortBy($scope.playerListData, 'player_position').slice();
              $scope.heightSort = _.sortBy($scope.playerListData, 'player_height').slice();
              $scope.ageSort = _.sortBy($scope.playerListData, 'player_age').slice();
              $scope.trSort = _.sortBy($scope.playerListData, 'total_rebounds').slice();
              $scope.astnSort = _.sortBy($scope.playerListData, 'assists').slice();
              $scope.ptsSort = _.sortBy($scope.playerListData, 'points').slice();
              $scope.teamSort = _.sortBy($scope.playerListData, 'team_name').slice();
              $scope.videoSort = _.sortBy($scope.playerListData, 'videos.length').slice();
              $scope.currentPage = 0;
              $scope.previousCount = 0;
              $scope.nextCount = 0;
              $scope.paging = {
              total: Math.ceil(parseFloat($scope.playerListData.length / 10)),
              current: 1,
              onPageChanged: loadPages
          };
      }

         psService.searchPlayers(seasonId, leagueId, countryId, positionId, $scope.heightId, $scope.ageId,
            $scope.fgmId, $scope.fgaId, $scope.fgId, $scope.n3pmId, $scope.n3paId, $scope.n3pId, $scope.n2pmId, $scope.n2paId,
            $scope.n2pId, $scope.ftmId, $scope.ftaId, $scope.ftId, $scope.orId, $scope.drId, $scope.trId, $scope.asId, $scope.toId, $scope.stId,
            $scope.ptsId, $scope.minId, $scope.bsId, $scope.valId, $scope.oerId, $scope.virId).then(showPlayers);
         $scope.paging = $scope.playersPagin.slice(10);
     };

    function loadPages(){
        $scope.tempTableData = $scope.playerListData.slice();
        $scope.currentPage = $scope.paging.current;
        $scope.previousCount = $scope.currentPage * 10 - 10;
        $scope.nextCount = $scope.currentPage * 10;
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

