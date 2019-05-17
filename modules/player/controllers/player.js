
app.controller('PlayerSearchController1',
    ['$location','$timeout','$rootScope','$scope','$compile','PlayerSearchService', 'TeamInformation','$window',
        PlayerProfileController]);
function PlayerProfileController($location, $timeout,$rootScope, $scope, $compile, PlayerSearchService, TeamInformation, $window) {

    if(!$rootScope.playerProfile){
        PlayerSearchService.getPlayerById(parseUrl(window.location.pathname)).then(function(data){
            $scope.playerInfo = data;
            $('#loader-container-player').fadeOut(200);
            playerCounter();
        });

    } else {
        $scope.playerInfo = $rootScope.playerProfile;
        $('#loader-container-player').fadeOut(200);
        playerCounter();
    }
    function playerCounter() {
        PlayerSearchService.getCounter($scope.playerInfo.id)
            .then(function(data){
                $scope.playerId = data.page_views;
                PlayerSearchService.setCounter($scope.playerInfo.id);
            });
        // TeamInformation.getTendencyShotChartData($scope.playerInfo.id).then(function(response){
        //     console.log(response);
        // });
    }

    $scope.player = $rootScope.playerProfile ? $rootScope.playerProfile.id :  parseUrl(window.location.pathname);
    $scope.careerData = {};
    $scope.selectedTab = 'career stats';
    $scope.seasonAverages ={};
    $scope.rankOptions ={};
    $scope.rankOptSelected ={};
    $scope.selectedRank = '';
    $scope.seasonOptions =[];
    $scope.statOptions = {};
    $scope.selectedSeason ='';
    $rootScope.isTendencyDrawn = false;
    $scope.tendencyInitiated = false;
    $scope.tendencyObj ={
        tendencySelected: -1,
        startSearch: false,
        games: [],
        isDef: function(actionnum){
            if( [1,2,3,4,6,9,12,17,19,21,25,26,29,30,33].indexOf(actionnum) !== -1 ) return 'offence';
            else if(actionnum === 24) return 'other';
            else return 'defence';
        },
        seasons:[],
    };
    $scope.videos = [];
    $scope.currentVideo = '';
    $scope.statTablesArr = [];
//helper functions
    function parseUrl(url){
        return url.slice(8, url.indexOf('/',8));
    };
    
    var actiontypes = [];
    $scope.getAge = function(birthdate){
        if(!birthdate) return '';
        return new Date().getFullYear() - new Date(birthdate).getFullYear();
    };
    function getBiggerDate(dt1,dt2){
        if(typeof dt2 === "undefined" || dt2 == '') return dt1.toString();
        var d1 = dt1.split('-');
        var d2 = dt2.split('-');

        var dateOne = new Date(d1[0], d1[1], d1[2]); //Year, Month, Date
        var dateTwo = new Date(d2[0], d2[1], d2[2]); //Year, Month, Date
        if (dateOne > dateTwo) {
            return dt1.toString();
        }else {
            return dt2.toString();
        }

    }
    function CalculateMadeAttemptPer(m,a){
        var percentag = (m/a)*100;
        if(isNaN(percentag)) return 0;
        else if(Number.isInteger(percentag)) return percentag;
        else return parseFloat(percentag.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0]);
    }
    function sortVideo(name){

        $scope.videos =  $scope.videos.map(function(obj){
            var result = {};
            result.url = obj.processed === 3?
                "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(obj.file_name) + '/original.mp4' :
                "https://d3hkpco91lv4dz.cloudfront.net/clips/" + encodeURI(obj.file_name) + '.mp4';
            result.actionname = name? name : actiontypes[obj.action];

            if(obj.processed === 3 && obj.file_name.includes('/')){
                result.img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + obj.file_name + '/' + obj.file_name.slice(obj.file_name.indexOf('/') + 7) + '.jpg';
            }else if(obj.processed === 3){
                result.img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + obj.file_name + '/' + obj.file_name + '.jpg';
            }else {
                result.img = 'https://d3hkpco91lv4dz.cloudfront.net/clips/' + obj.file_name + '.jpg';
            }

            return result;
        });
    }

    var listenerModal;

    $scope.selectAllVideos = function () {
        $scope.selectedVideo = $scope.selectedVideo.map(function (elem, index) {
            if(index <=19 ){
                return true;
            }
            else{
                return false;
            }
        });
        console.log($scope.selectedVideo);
    };
    $scope.deSelectAllVideos = function () {
        $scope.selectedVideo = $scope.selectedVideo.map(function(){
            return false;
        });
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
                PlayerSearchService.uploadVideosToFolder(folderId, item.actionname + ' ' + '-' + ' ' + (index + 1), fileName).then(function (response) {
                });
            });
        });
    };
    function handleVideo(data, name){
        document.getElementById('playClipsModal').classList.remove('full_screen');
        $scope.videos = data;
        $scope.selectedVideo = new Array(data.length).fill('').map(function () {
            return false;
        });
        sortVideo(name);
        $scope.currentVideo = $scope.videos[0];
        var video = document.getElementById('clip');
        video.hidden = false;
        video.controls = true;
        video.style.width = '100%';
        video.autoplay = true;
        video.playbackRate = 1.0;
        video.onended = function(){
            $scope.nextClip();
            $timeout(function(){$scope.$apply()});
        };
        listenerModal = document.addEventListener("click", function (e) {
                if (e.target === document.querySelector('div#playClipsModal.modal.fade')){
                    $('#playClipsModal').modal('hide');
                    video.pause();
            }
        });
    }

//function initiates the CareerTab View
    $scope.initiateCareerView = function() {
        //receive career tab content and sort the data
        PlayerSearchService.getCareer($scope.player)
            .then(function (data) {

                $scope.playerInfoChartData = data.filter(function(obj){return obj.league_name === "average" || obj.country_name === "average"})[0];
                $scope.rankOptions = data.filter(function(obj){return obj.league_name !== "average" || obj.country_name !== "average"});

                $scope.selectedRank = $scope.rankOptions[0].season+","+$scope.rankOptions[0].league+","+$scope.rankOptions[0].team;
//reformat data into an object 'season_name':[{},{}]
                var tempObj = {};
                data.forEach(function (el) {
                    if (!$scope.careerData.hasOwnProperty(el.season_name)) {
                        $scope.careerData[el.season_name] = [];
                        $scope.careerData[el.season_name].push(el);
                    } else {
                        $scope.careerData[el.season_name].push(el);
                    }
                });

//add property containing array of seasons
                $scope.careerData.seasons = Object.keys($scope.careerData);
                $scope.selectedSeason = $scope.careerData.seasons[0];

                function drawPlayerInfoChart(){
                    var data = $scope.playerInfoChartData;
                    data.ft_percent = data.ft_attempts ? ((data.ft_made * 100) / data.ft_attempts).toFixed(1) : 0;
                    data.p2_percent = data.p2_attempts ? ((data.p2_made * 100) / data.p2_attempts).toFixed(1) : 0;
                    data.p3_percent = data.p3_attempts ? ((data.p3_made * 100) / data.p3_attempts).toFixed(1) : 0;
                    data.fg_percent = data.fg_attempts ? ((data.fg_made * 100) / data.fg_attempts).toFixed(1) : 0;

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

                    $('.player-info-chart')
                        .kendoChart({

                            series:[
                                {name: 'FT% = ' + data.ft_percent, data: [data.ft_percent],color: ft_color, labels: {visible: true}},
                                {name: '2P% = ' + data.p2_percent, data: [data.p2_percent],color: p2_color, labels: {visible: true}},
                                {name: '3P% = ' + data.p3_percent, data: [data.p3_percent],color: p3_color, labels: {visible: true}},
                                {name: 'FG% = ' + data.fg_percent, data: [data.fg_percent],color: fg_color, labels: {visible: true}}
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
                                width: 500,
                                height: 200
                            }
                        });
                }
                drawPlayerInfoChart();
                var checkarr = [];
                var s = 0;
                for(b in data){
                    var c = data[b];
                    if($.inArray(c.season,checkarr) == -1){
                        checkarr.push(c.season);
                        $scope.seasonOptions.push({
                            dist:true,
                            value:c.season+','+c.league+','+c.team,
                            label:c.season_name
                        });
                    }
                }
            });
    };
    //initiation
    angular.element(document).ready(function(){
        $scope.initiateCareerView();
    });

    PlayerSearchService.getTaggedSeasons($scope.player)
        .then(function(data){$scope.tendencyObj.seasons = data.sort(function(a,b){return a.id - b.id})});
    $scope.initiateRankView = function(){
        $('#rank-select').selectpicker();
        $('#rank-select').on('changed.bs.select', function (e) {
            $scope.drawRank(e.target.value);
        });
        $scope.drawRank();
    };
    $scope.drawRank = function(val){
        var value = val? val :  $('#rank-select').val();
        PlayerSearchService.getPlayerRankData($scope.player, value)
            .then(function(data){drawRankCharts(data)});
        function drawRankCharts(data){
            var info = data[0];
            var chartData = [];
            if(info.player.points) {chartData.push([info.player.points.toFixed(1),info.player.points_league_rank, info.player.points_team_rank, 'PTS',info.league.points.toFixed(1), info.team.points.toFixed(1)])};
            if(info.player.val) {chartData.push([info.player.val.toFixed(1) ,info.player.val_league_rank, info.player.val_team_rank, 'VAL',info.league.val.toFixed(1), info.team.val.toFixed(1)])};
            if(info.player.oer) {chartData.push([info.player.oer.toFixed(2) ,info.player.oer_league_rank, info.player.oer_team_rank, 'OER',info.league.oer.toFixed(2), info.team.oer.toFixed(2)])};
            if(info.player.vir) {chartData.push([info.player.vir.toFixed(2) ,info.player.vir_league_rank, info.player.vir_team_rank, 'VIR',info.league.vir.toFixed(2), info.team.vir.toFixed(2)])};
            if(info.player.ft_percent) {chartData.push([info.player.ft_percent.toFixed(1) ,info.player.ft_percent_league_rank, info.player.ft_percent_team_rank, 'FT%',info.league.ft_percent.toFixed(1), info.team.ft_percent.toFixed(1)])};
            if(info.player.p2_percent) {chartData.push([info.player.p2_percent.toFixed(1) ,info.player.p2_percent_league_rank, info.player.p2_percent_team_rank, '2P%',info.league.p2_percent.toFixed(1), info.team.p2_percent.toFixed(1)])};
            if(info.player.p3_percent) {chartData.push([info.player.p3_percent.toFixed(1) ,info.player.p3_percent_league_rank, info.player.p3_percent_team_rank, '3P%',info.league.p3_percent.toFixed(1), info.team.p3_percent.toFixed(1)])};
            if(info.player.fg_percent) {chartData.push([info.player.fg_percent.toFixed(1) ,info.player.fg_percent_league_rank, info.player.fg_percent_team_rank, 'FG%',info.league.fg_percent.toFixed(1), info.team.fg_percent.toFixed(1)])};
            if(info.player.ft_made) {chartData.push([info.player.ft_made.toFixed(1) ,info.player.ft_made_league_rank, info.player.ft_made_team_rank, 'FTM',info.league.ft_made.toFixed(1), info.team.ft_made.toFixed(1)])};
            if(info.player.p2_made) {chartData.push([info.player.p2_made.toFixed(1) ,info.player.p2_made_league_rank, info.player.p2_made_team_rank, '2PM',info.league.p2_made.toFixed(1), info.team.p2_made.toFixed(1)])};
            if(info.player.p3_made) {chartData.push([info.player.p3_made.toFixed(1) ,info.player.p3_made_league_rank, info.player.p3_made_team_rank, '3PM',info.league.p3_made.toFixed(1), info.team.p3_made.toFixed(1)])};
            if(info.player.fg_made) {chartData.push([info.player.fg_made.toFixed(1) ,info.player.fg_made_league_rank, info.player.fg_made_team_rank, 'FGM',info.league.fg_made.toFixed(1), info.team.fg_made.toFixed(1)])};
            if(info.player.ft_attempts) {chartData.push([info.player.ft_attempts.toFixed(1) ,info.player.ft_attempts_league_rank, info.player.ft_attempts_team_rank, 'FTA',info.league.ft_attempts.toFixed(1), info.team.ft_attempts.toFixed(1)])};
            if(info.player.p2_attempts) {chartData.push([info.player.p2_attempts.toFixed(1) ,info.player.p2_attempts_league_rank, info.player.p2_attempts_team_rank, '2PA',info.league.p2_attempts.toFixed(1), info.team.p2_attempts.toFixed(1)])};
            if(info.player.p3_attempts) {chartData.push([info.player.p3_attempts.toFixed(1) ,info.player.p3_attempts_league_rank, info.player.p3_attempts_team_rank, '3PA',info.league.p3_attempts.toFixed(1), info.team.p3_attempts.toFixed(1)])};
            if(info.player.fg_attempts) {chartData.push([info.player.fg_attempts.toFixed(1) ,info.player.fg_attempts_league_rank, info.player.fg_attempts_team_rank, 'FGA',info.league.fg_attempts.toFixed(1), info.team.fg_attempts.toFixed(1)])};
            if(info.player.assists) { chartData.push([info.player.assists.toFixed(1) ,info.player.assists_league_rank, info.player.assists_team_rank, 'AS',info.league.assists.toFixed(1), info.team.assists.toFixed(1)])};
            if(info.player.turnovers) {chartData.push([info.player.turnovers.toFixed(1) ,info.player.turnovers_league_rank, info.player.turnovers_team_rank, 'TO',info.league.turnovers.toFixed(1), info.team.turnovers.toFixed(1)])};
            if(info.player.steals) {chartData.push([info.player.steals.toFixed(1) ,info.player.steals_league_rank, info.player.steals_team_rank, 'ST',info.league.steals.toFixed(1), info.team.steals.toFixed(1)])};
            if(info.player.block_shots) {chartData.push([info.player.block_shots.toFixed(1),info.player.block_shots_league_rank, info.player.block_shots_team_rank, 'BS',info.league.block_shots.toFixed(1), info.team.block_shots.toFixed(1)])};
            if(info.player.df_rebounds) { chartData.push([info.player.df_rebounds.toFixed(1) ,info.player.df_rebounds_league_rank, info.player.df_rebounds_team_rank, 'DR',info.league.df_rebounds.toFixed(1), info.team.df_rebounds.toFixed(1)])};
            if(info.player.of_rebounds) { chartData.push([info.player.of_rebounds.toFixed(1) ,info.player.of_rebounds_league_rank, info.player.of_rebounds_team_rank, 'OR',info.league.of_rebounds.toFixed(1), info.team.of_rebounds.toFixed(1)])};
            if(info.player.fouls_made) { chartData.push([info.player.fouls_made.toFixed(1) ,info.player.fouls_made_league_rank, info.player.fouls_made_team_rank, 'FM',info.league.fouls_made.toFixed(1), info.team.fouls_made.toFixed(1)])};
            if(info.player.fouls_received) { chartData.push([info.player.fouls_received.toFixed(1) ,info.player.fouls_received_league_rank, info.player.fouls_received_team_rank, 'FR',info.league.fouls_received.toFixed(1), info.team.fouls_received.toFixed(1)])};
            for(var i = 0; i < chartData.length; i++){
                var color = parseFloat(chartData[i][0]) > parseFloat(chartData[i][4]) && parseFloat(chartData[i][0]) >parseFloat(chartData[i][5]) ? '#257f36' :
                    parseFloat(chartData[i][0]) > parseFloat(chartData[i][4]) || parseFloat(chartData[i][0]) >parseFloat(chartData[i][5]) ? '#cdc720':
                        '#bc0202';
                var link = color === '#257f36' ? 'https://s3.amazonaws.com/s4usitesimages/images/Green.png' :
                    color === '#cdc720'? 'https://s3.amazonaws.com/s4usitesimages/images/Yellow.png' :
                        'https://s3.amazonaws.com/s4usitesimages/images/Red.png';
                $('.rank-chart-' + (i+1))
                    .kendoChart({
                        valueAxis: {
                            labels: {
                                font: "10px Arial,Helvetica,sans-serif"
                            }
                        },
                        title: {
                            text: 'League rank: # ' + chartData[i][1] + ' in ' + chartData[i][3] + '\nTeam rank: # ' + chartData[i][2] + ' in ' + chartData[i][3],
                            font: "13px Arial,Helvetica,sans-serif",
                            color: 'black',
                            align: "left",
                            margin: {
                                left: 57
                            }
                        },
                        legend: {
                            font: "10px Arial,Helvetica,sans-serif",
                            position: 'bottom',
                        },
                        series:[
                            {name: 'League', data: [chartData[i][4]], color: '#d6d8d8', labels: {visible: true}},
                            {name: 'Team', data: [chartData[i][5]],  color: '#545555', labels: {visible: true}},
                            {name: 'Player', data: [chartData[i][0]],  color: color, labels: {visible: true}},
                        ]
                    });
                $('.chart-rank-cont-' + (i+1) +' img').attr({
                    src: link});
                $('.chart-rank-cont-' + (i+1) +' img').show();
            }
        }
    };
    $scope.initiateStatView = function(){
        $('#stat-select').selectpicker();
        $('#stat-select').on('changed.bs.select', function (e) {
            $scope.drawStat(e.target.value);
        });
        $scope.drawStat();
    };
    $scope.drawStat = function(val){
        var inputdata = val? val.split(',') : $('#stat-select').val().split(',');
        function playerStatsData(pstats){
            if(pstats.length>0)
            {
                var sa = pstats;
                var minutes = [];
                var points = [];
                var pointsperm = [];
                var opteams = []
                for(var i = 0;i<sa.length;i++){
                    minutes.push(sa[i].minutes_numeral.toFixed(1));
                    points.push(sa[i].points.toFixed(1));
                    pointsperm.push(((40*sa[i].points)/sa[i].minutes_numeral).toFixed(1));
                    opteams.push(sa[i].op_team_name);
                }

                $("#chartContainerTab3").kendoChart({
                    series: [{
                        name: "Minutes",
                        type: "column",
                        color: "#000000",
                        data: minutes
                    }, {
                        name: "Points",
                        type: "line",
                        color: 'blue',
                        data: points
                    },{
                        name: "Points per 40 min",
                        type: "line",
                        color: 'grey',
                        data: pointsperm
                    }],
                    categoryAxis: {
                        categories: opteams
                    },
                    chartArea: {
                        width: 1100,
                        height: 400
                    },
                    tooltip: {
                        visible: true,
                        shared: true,
                        background: '#000000',
                        color: '#ffffff',
                        padding: 5,
                        font: "11px Arial,Helvetica,sans-serif"
                    },
                    legend: {
                        position: "bottom"
                    },
                });
            }
        }
        function drawStatTables(sa){
            var data = [];
            sa.forEach(function(obj){
                if(!obj.fg_percent){
                    obj.fg_percent = obj.fg_attempts ? (obj.fg_made * 100) / obj.fg_attempts : 0.0;
                }
                if(!obj.p3_percent){
                    obj.p3_percent = obj.p3_attempts ? (obj.p3_made * 100) / obj.p3_attempts : 0.0 ;
                }
                if(!obj.p2_percent){
                    obj.p2_percent = obj.p2_attempts ? (obj.p2_made * 100) / obj.p2_attempts : 0.0;
                }
                if(!obj.ft_percent){
                    obj.ft_percent = obj.ft_attempts ? (obj.ft_made * 100) / obj.ft_attempts : 0.0;
                }
            });
            sa.forEach(function(obj){
                if(obj.row_type === 'home'){
                    data[0] = obj;
                } else if(obj.row_type === "away"){
                    data[1] = obj;
                } else if(obj.row_type === "lost"){
                    data[3] = obj;
                } else{
                    data[2] = obj;
                }
            });
            data.push($scope.seasonAverages[inputdata[0]]);
            $scope.statTablesArr[0] = {name: 'BREAKDOWN', data: data};
        }
        function drawMonthStatTable(sa){
            sa.forEach(function(obj){
                if(!obj.fg_percent){
                    obj.fg_percent = obj.fg_attempts ? (obj.fg_made * 100) / obj.fg_attempts : 0.0;
                }
                if(!obj.p3_percent){
                    obj.p3_percent = obj.p3_attempts ? (obj.p3_made * 100) / obj.p3_attempts : 0.0 ;
                }
                if(!obj.p2_percent){
                    obj.p2_percent = obj.p2_attempts ? (obj.p2_made * 100) / obj.p2_attempts : 0.0;
                }
                if(!obj.ft_percent){
                    obj.ft_percent = obj.ft_attempts ? (obj.ft_made * 100) / obj.ft_attempts : 0.0;
                }
            });
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            sa.forEach(function(obj){
               obj.row_type = monthNames[obj.month -1];
            });
             sa.push($scope.seasonAverages[inputdata[0]]);
            $scope.statTablesArr[1] = {name: "STATS PER MONTH", data: sa};
        }
        function drawLeagueAnalysisTable(data){
            data.forEach(function(obj){
                if(!obj.fg_percent){
                    obj.fg_percent = obj.fg_attempts ? (obj.fg_made * 100) / obj.fg_attempts : 0.0;
                }
                if(!obj.p3_percent){
                    obj.p3_percent = obj.p3_attempts ? (obj.p3_made * 100) / obj.p3_attempts : 0.0 ;
                }
                if(!obj.p2_percent){
                    obj.p2_percent = obj.p2_attempts ? (obj.p2_made * 100) / obj.p2_attempts : 0.0;
                }
                if(!obj.ft_percent){
                    obj.ft_percent = obj.ft_attempts ? (obj.ft_made * 100) / obj.ft_attempts : 0.0;
                }
            });
            var tempObj = {};
            data.forEach(function(obj){
                if(!tempObj[obj.league_name]){
                    tempObj[obj.league_name] = [];
                }
                tempObj[obj.league_name].push(obj);
            });

            $scope.leagueStatsData = tempObj;
        }
        function drawStatByMinutes(sa, minutes){
            var snbrk_tbl = '';
            for(j in sa){
                var convert=1;
                if(sa[j].minutes_numeral>0){
                    convert = convert*(1/sa[j].minutes_numeral);
                    if(minutes == 40) convert = convert*(40);
                }
                snbrk_tbl = snbrk_tbl+'<tr><td>'+(convert*sa[j].points).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].fg_made).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].fg_attempts).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].p3_made).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].p3_attempts).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].p2_made).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].p2_attempts).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].ft_made).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].ft_attempts).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].of_rebounds).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].df_rebounds).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].points).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].assists).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].turnovers).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].steals).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].block_shots).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].fouls_made).toFixed(1)+'</td>'+
                    '<td>'+(convert*sa[j].fouls_received).toFixed(1)+'</td>'
            }
            return snbrk_tbl;
        }


        PlayerSearchService.playerStatAnalysis($scope.player,inputdata[0],'by_game')
            .then(function(data){playerStatsData(data);});

        PlayerSearchService.playerStatAnalysis($scope.player,inputdata[0],'season_breakdown')
            .then(function(data){drawStatTables(data);});

        PlayerSearchService.playerStatAnalysis($scope.player,inputdata[0],'by_month')
            .then(function(data){drawMonthStatTable(data);});

        PlayerSearchService.playerStatAnalysis($scope.player,inputdata[0],'league_breakdown')
            .then(function(data){drawLeagueAnalysisTable(data)});

        PlayerSearchService.playerStatAnalysis($scope.player,$('#stat-select').val(),'season_stats')
            .then(function(data){
                if(data.length>0){
                    var statperm = drawStatByMinutes(data,1);
                    $('#stat_per_min').html(statperm);

                    var statper40 = drawStatByMinutes(data,40);
                    $('#stat_per_40min').html(statper40);
                }
            });
    };
    $scope.initiateBestWorstView = function(){
        $('#best-worst-select').selectpicker();
        $('#best-worst-select').on('changed.bs.select', function (e) {
            $scope.drawBestWorstView(e.target.value);
        });
        $scope.drawBestWorstView();
    };
    $scope.drawBestWorstView = function(val){
        var value = val? val : $('#best-worst-select').val();
        PlayerSearchService.playerStatAnalysis($scope.player, value, 'by_game')
            .then(function(data){drawBestWorst(data)});
        function drawBestWorst(data) {
            var table_arr = {max:{},min:{}};
            $('.best_worst_game_wpr').html('');
            var table = "<table class='table'>" +
                "<thead><tr class='how_gm'>" +
                "<td colspan='4'><span class='glyphicon glyphicon-thumbs-up'></span> " +
                "<span>Best</span></td><td colspan='3'><span class='glyphicon glyphicon-thumbs-down'>" +
                "</span> <span>Worst</span></td></tr><tr><td></td><td>Value</td><td>Date</td>" +
                "<td>Opponent Team</td><td>Value</td><td>Date</td><td>Opponent Team</td>" +
                "</tr></thead><tbody></tbody></table>";
            $('.best_worst_game_wpr').html(table);
            if(data.length>0){
                for(var w in data){
                    var bw = data[w];
                    var fg_per = 0,ft_per=0,p3_per=0,p2_per=0;
                    if(bw.fg_attempts>=2){
                        fg_per = CalculateMadeAttemptPer(bw.fg_made,bw.fg_attempts);
                    }
                    if(bw.p3_attempts>=2){
                        p3_per = CalculateMadeAttemptPer(bw.p3_made,bw.p3_attempts);
                    }
                    if(bw.p2_attempts>=2){
                        p2_per = CalculateMadeAttemptPer(bw.p2_made,bw.p2_attempts);
                    }
                    if(bw.ft_attempts>=2){
                        ft_per = CalculateMadeAttemptPer(bw.ft_made,bw.ft_attempts);
                    }
                    bw['fg_per'] = fg_per;
                    bw['p3_per'] = p3_per;
                    bw['p2_per'] = p2_per;
                    bw['ft_per'] = ft_per;
                    bw['fg_per_unit'] = '% ('+bw.fg_made+'/'+bw.fg_attempts+')';
                    bw['p3_per_unit'] = '% ('+bw.p3_made+'/'+bw.p3_attempts+')';
                    bw['p2_per_unit'] = '% ('+bw.p2_made+'/'+bw.p2_attempts+')';
                    bw['ft_per_unit'] = '% ('+bw.ft_made+'/'+bw.ft_attempts+')';
                    bw['fg_per_made'] = bw.fg_made;
                    bw['p3_per_made'] = bw.p3_made;
                    bw['p2_per_made'] = bw.p2_made;
                    bw['ft_per_made'] = bw.ft_made;
                    bw['fg_per_attempts'] = bw.fg_attempts;
                    bw['p3_per_attempts'] = bw.p3_attempts;
                    bw['p2_per_attempts'] = bw.p2_attempts;
                    bw['ft_per_attempts'] = bw.ft_attempts;
                    bw['total_rebound'] = bw.of_rebounds+bw.df_rebounds;
                    bw['id'] = bw.game_id;
                    for(var key in bw){
                        if(key === 'id'){
                            continue;
                        }
                        if(typeof table_arr['max'][key] === "undefined")
                            table_arr['max'][key] = {val: 0, date: '', team: '',made : '',attempts:'',pre_date:'', id: bw.id};
                        if(typeof table_arr['min'][key] === "undefined")
                            table_arr['min'][key] = {val: bw[key], date: '', team: '',made : '',attempts:'',pre_date:'', id: bw.id};

                        if(table_arr['min'][key]['val'] >= bw[key]){
                            table_arr['min'][key]['val'] = bw[key];
                            table_arr['min'][key]['date'] = bw['game_date'];
                            table_arr['min'][key]['team'] = bw['op_team_name'];
                            table_arr['min'][key].id = bw.id;
                            if(key == 'fg_per' || key == 'p3_per' || key == 'p2_per' || key == 'ft_per')
                                table_arr['min'][key]['unit'] = bw[key+'_unit'];
                                table_arr['min'][key].id = bw.id;
                        }
                        if(table_arr['max'][key]['val'] <= bw[key]){
                            table_arr['max'][key]['val'] = bw[key];
                            table_arr['max'][key]['date'] = bw['game_date'];
                            table_arr['max'][key]['team'] = bw['op_team_name'];
                            table_arr['max'][key].id = bw.id;
                            if(key == 'fg_per' || key == 'p3_per' || key == 'p2_per' || key == 'ft_per') {
                                if(bw[key+'_made']>table_arr['max'][key]['made'] && bw[key+'_attempts']>table_arr['max'][key]['made']){
                                    table_arr['max'][key]['made'] = bw[key+'_made'];
                                    table_arr['max'][key]['attempts'] = bw[key+'_attempts'];
                                    table_arr['max'][key]['unit'] = '% ('+bw[key+'_made']+'/'+bw[key+'_attempts']+')';
                                    table_arr['max'][key].id = bw.id;

                                    if((table_arr['max'][key]['made']/table_arr['max'][key]['attempts']) == (bw[key+'_made']/bw[key+'_attempts'])){
                                        table_arr['max'][key]['date'] = getBiggerDate(bw['game_date'],table_arr['max'][key]['pre_date']);
                                        table_arr['max'][key]['pre_date'] = bw['game_date'];
                                        table_arr['max'][key].id = bw.id;
                                    }
                                }
                            }
                        }
                    }
                }
                var ordered_arr = {'points': "PTS",
                    'fg_made':'FGM',
                    'fg_attempts':'FGA',
                    'fg_per':'FG%',
                    'p3_made':'3PM',
                    'p3_attempts':'3PA',
                    'p3_per':'3P%',
                    'p2_made':'2PM',
                    'p2_attempts':'2PA',
                    'p2_per':'2P%',
                    'ft_made':'FTM',
                    'ft_attempts':'FTA',
                    'ft_per':'FT%',
                    'of_rebounds':'OR',
                    'df_rebounds':'DR',
                    'total_rebound':'TR',
                    'assists':'AS',
                    'turnovers':'TO',
                    'steals':'ST',
                    'block_shots':'BS',
                    'shots_rejected':'SR',
                    'fouls_made':'FM',
                    'fouls_received':'FR',
                    'val':'VAL',
                    'vir':'VIR',
                    'oer':'OER'
                };
            }
            else var ordered_arr = {};
            if(data.length>0)
                for(var key in ordered_arr){
                    var dt_arr = table_arr['min'][key]['date'].split('-');
                    var dt_min = dt_arr[2]+'/'+dt_arr[1]+'/'+dt_arr[0];

                    var dt = table_arr['max'][key]['date'].split('-');
                    var dt_max = dt[2]+'/'+dt[1]+'/'+dt[0];

                    if(key == 'fg_per' || key == 'p3_per' || key == 'p2_per' || key == 'ft_per')
                        table = "<tr data-toggle='modal' data-target='#boxScoreModalPlayer' ng-click='handleModal($event, true)'><td>"+ordered_arr[key]+"</td><td data-id=" + table_arr.max[key].id+">"+table_arr['max'][key]['val']+""+table_arr['max'][key]['unit']+"</td><td data-id=" + table_arr.max[key].id+">"+dt_max+"</td><td data-id=" + table_arr.max[key].id+">"+table_arr['max'][key]['team']+"</td>"+
                            "<td data-id=" + table_arr.min[key].id+">"+table_arr['min'][key]['val']+""+table_arr['min'][key]['unit']+"</td><td data-id=" + table_arr.min[key].id+">"+dt_min+"</td><td data-id=" + table_arr.min[key].id+">"+table_arr['min'][key]['team']+"</td></tr>";

                    else if(key =='vir' || key == 'oer')
                        table = "<tr data-toggle='modal' data-target='#boxScoreModalPlayer' ng-click='handleModal($event, true)'><td >"+ordered_arr[key]+"</td><td data-id=" + table_arr.max[key].id+">"+table_arr['max'][key]['val'].toFixed(2)+"</td><td data-id=" + table_arr.max[key].id+">"+dt_max+"</td><td data-id=" + table_arr.max[key].id+">"+table_arr['max'][key]['team']+"</td>"+
                            "<td data-id=" + table_arr.min[key].id+">"+table_arr['min'][key]['val'].toFixed(2)+"</td><td data-id=" + table_arr.min[key].id+">"+dt_min+"</td><td data-id=" + table_arr.min[key].id+">"+table_arr['min'][key]['team']+"</td></tr>";

                    else
                        table = "<tr data-toggle='modal' data-target='#boxScoreModalPlayer' ng-click='handleModal($event, true)'><td>"+ordered_arr[key]+"</td><td data-id=" + table_arr.max[key].id+">"+table_arr['max'][key]['val']+"</td><td data-id=" + table_arr.max[key].id+">"+dt_max+"</td><td data-id=" + table_arr.max[key].id+">"+table_arr['max'][key]['team']+"</td>"+
                            "<td data-id=" + table_arr.min[key].id+">"+table_arr['min'][key]['val']+"</td><td data-id=" + table_arr.min[key].id+">"+dt_min+"</td><td data-id=" + table_arr.min[key].id+">"+table_arr['min'][key]['team']+"</td></tr>";
                    var rw =  $compile(table)($scope);

                    $('.best_worst_game_wpr table').find('tbody').append(rw);
                }
            else {
                $('.best_worst_game_wpr table').find('tbody').append('<tr><td colspan="7">empty</tr>');
            }
        }
    };
    $scope.initiateGameByGameView = function(){
        $('#game-by-game-select').selectpicker();
        $('#game-by-game-select').on('changed.bs.select', function (e) {
            $scope.drawGameByGame(e.target.value);
        });
        $scope.drawGameByGame();
    };
    $scope.drawGameByGame = function(val){
        var value = val? val : $('#game-by-game-select').val();
        PlayerSearchService.getGameByGame($scope.player, value, 'by_game')
            .then(function(data){drawGbG(data)});
        function drawGbG(data){
            var tableData = {},
                totalAverage = $scope.rankOptions.filter(function(obj){
                   return obj.season === Number(value.split(',')[0]) && obj.league === Number(value.split(',')[1]);
                })[0],
                temp = [];

            data.forEach(function(el){
                if(!tableData[el.step_name]){
                    tableData[el.step_name] = [];
                    temp.push(el.step_name);
                }
                tableData[el.step_name].push(el);
            });
            for(var arr in tableData) {
                tableData[arr].forEach(function(obj){
                   if(!obj.fg_percent) obj.fg_percent = obj.fg_attempts ? obj.fg_made / obj.fg_attempts * 100 : 0.0;
                   if(!obj.p3_percent) obj.p3_percent = obj.p3_attempts ? obj.p3_made / obj.p3_attempts * 100 : 0.0;
                   if(!obj.p2_percent) obj.p2_percent =  obj.p2_attempts ? obj.p2_made  / obj.p2_attempts * 100 : 0.0;
                   if(!obj.ft_percent) obj.ft_percent = obj.ft_attempts ? obj.ft_made  / obj.ft_attempts * 100 : 0.0;
                });
            }

            for (var i = 0; i < temp.length; i++) {
                var arr = tableData[temp[i]];
                    var summary = {};
                    var sum = 0;
                    var aver = 0;
                    for(var j=0; j<arr.length; j++){

                        for(var prop in arr[j]){
                            if(arr[j].hasOwnProperty(prop) && typeof arr[j][prop] === 'number'){
                                summary[prop] = summary[prop] || 0;
                                summary[prop] = summary[prop]  + (arr[j][prop] / arr.length) ;
                            } else if(prop === 'minutes'){
                                var arrMin = arr[j][prop].split(":");
                                sum = sum + Number(new Date(0, 0, 0, 0, Number(arrMin[1]), Number(arrMin[2]), 0)) ;
                                aver = sum / arr.length;
                            }
                        }
                    }
                    summary.op_team_name = 'Average';
                    summary.minutes = new Date(aver).toString().split(' ')[4].split(':').slice(1).join(':');
                    arr.push(summary);
            }
            totalAverage.op_team_name = 'Average';
            totalAverage.average = true;
            tableData.Total = [totalAverage];
            tableData.leagueId = value.split(',')[1].trim();
            tableData.seasonId = value.split(',')[0].trim();
            $scope.gameByGameData = tableData;
        }
    };
    $scope.initiateWatchGamesView = function(){
        $('#watch-games-select').selectpicker();
        $('#watch-games-select').on('changed.bs.select', function (e) {
            $scope.drawWatchGames(e.target.value);
        });
        $scope.drawWatchGames();
    };
    $scope.drawWatchGames = function(val){
        var slt = val ? val.split(',') : $('#watch-games-select').val().split(',');
        PlayerSearchService.getPlayerVideo($scope.player)
            .then(function(data){ drawWatchTable(data)});
        function drawWatchTable(data){
            data = data.sort(function(a,b){
                return new Date(a.game_date) - new Date(b.game_date);
            });
            var watchvideo_pgarr = [];
            $scope.nodata = true;
            // console.log('pgarr',watchvideo_pgarr);
            var isexist = false;
            for(var i = 0; i < data.length; i++){
                if(data[i].season_id == slt[0] && data[i].league_id == slt[1]){
                    isexist = true;
                    var gdt = data[i].game_date.split('-');

                    // item.video_server.http_path+item.link,
                    watchvideo_pgarr.push({
                        'sid':data[i].season_id,
                        'league_name':data[i].leagues_name,
                        'game_date':gdt[2]+'/'+gdt[1]+'/'+gdt[0],
                        'home_team_id': data[i].home_team_id,
                        'home_team_name':data[i].home_team_name,
                        'away_team_name':data[i].away_team_name,
                        'away_team_id': data[i].away_team_id,
                        'game_id': data[i].game_id,
                        'season_id': data[i].season_id,
                        'league_id': data[i].league_id
                    })
                }
            }
            $timeout(function(){
                $scope.norow = isexist;
                $scope.wgvideo = watchvideo_pgarr;
                $scope.$apply();
            },0);
        }
    };
    $scope.watchVideo = function(id, seasonId, leagueId, gamedate,game_id){
        TeamInformation.getVideoTeam(id).then(function(data){drawModal(data)});
        function drawModal(data){
            $scope.addSrc(data.video.video_server.http_path +  data.video.link,
                data.video.game.home_team.id,
                data.video.game.away_team.id,
                data.video.game.home_team.name,
                data.video.game.away_team.name,
                seasonId, leagueId, gamedate, game_id);
        }
    };
    $scope.closeWatchVideo = function(){
        document.getElementById('game_video_watch').pause();
    };
    $scope.addSrc = function (link, firstTeamId, secondTeamId, homeName, awayName, seasonId, leagueId, gamedate, game_id) {
        $('#game_video_watch').attr('src', link);
        $('#game_video_watch2').attr('href', link);
        $scope.homeName = homeName;
        $scope.awayName = awayName;
        TeamInformation.getTeamForVideoNew(game_id, firstTeamId).then(function (data) {
            $scope.dataFirstTeam = data;
            $scope.gameDate = gamedate;
        });
        TeamInformation.getTeamForVideoNew(game_id, secondTeamId).then(function (data) {
            $scope.dataSecondTeam = data;
        })
            .then(function () {
                setTimeout(
                    function () {
                        $("#open_video").fadeIn(10);
                        $("#open_video").modal('show');
                    },
                    500
                );
            });
    };
    $scope.changeGauge = function(str){
        switch(str){
            case 'all':
                $scope.tendencyObj.ofactions.show();
                $scope.tendencyObj.defactions.show();
                $('[ng-class="other"]').show();
                $('.offence').show();
                break;
            case 'def':
                $scope.tendencyObj.ofactions.hide();
                $scope.tendencyObj.defactions.show();
                $('.offence').hide();
                $('[ng-class="other"]').hide();
                break;
            case 'off':
                $scope.tendencyObj.defactions.hide();
                $scope.tendencyObj.ofactions.show();
                $('.offence').show();
                $('[ng-class="other"]').hide();
                break;
        }
    };
    $scope.initiateTendencyView = function(){
        if(!$scope.tendencyInitiated){
            $scope.tendencyInitiated = true;
            var seasons = $scope.tendencyObj.seasons;
            var htmlstring = '';
            for(var i =0; i < seasons.length; i++){
                htmlstring = htmlstring  + '<option value="'+ seasons[i].id + '">' +seasons[i].name+'</option>';
            }
            var temp = $compile(htmlstring)($scope);
            $('.tend-select').html(temp);
            $('.tend-select').selectpicker('refresh');
            var timeflag = false;
            $('.tend-select').on('changed.bs.select', function (e) {
                var season = Number(e.target.value);
                if(!timeflag){
                    timeflag = true;
                    setTimeout(function(){timeflag = false}, 50);
                    $scope.tendencyObj.tendencySelected = season;
                    $scope.handleSeasonChange(season);
                }
            });

            PlayerSearchService.getPlayerGames($scope.player).then(function(data){
                var games = data;

                var htmlstring = '';
                for(var val in games){
                    var obj = games[val];
                    htmlstring = htmlstring+'<option value="'+obj.id+'">'+obj.game_date+' '
                        +obj.home_team.name+' vs '+obj.away_team.name+'</option>';
                }

                $('#profile-games-search').html('').selectpicker('refresh').selectpicker('val', null);

                var temp = $compile(htmlstring)($scope);
                $('#profile-games-search').html(temp);
                $('#profile-games-search').selectpicker('refresh');
                $('#profile-games-search').selectpicker('selectAll');

                $scope.drawTendency(-1);
            });
        }


    };
    $scope.handleSeasonChange = function(season){
        if(season === -1){
            PlayerSearchService.getPlayerGames($scope.player).then(function(data){
                var games = data;

                var htmlstring = '';
                for(var val in games){
                    var obj = games[val];
                    htmlstring = htmlstring+'<option value="'+obj.id+'">'+obj.game_date+' '
                        +obj.home_team.name+' vs '+obj.away_team.name+'</option>';
                }
                $('#profile-games-search').html('').selectpicker('refresh').selectpicker('val', null);
                var temp = $compile(htmlstring)($scope);
                $('#profile-games-search').html(temp);
                $('#profile-games-search').selectpicker('refresh');
                $('#profile-games-search').selectpicker('selectAll');
                $('#profile-games-search').selectpicker('refresh');
                $scope.drawTendency(-1);
            });
        } else {
            PlayerSearchService.getGamesBySeason($scope.player, season)
                .then(function(data){drawSeasonSelect(data)});
        }
        function drawSeasonSelect(data){
            var htmlstring = '';
            for(var i = 0; i < data.length; i++){
                htmlstring = htmlstring + '<option value="'+data[i].id+'">'+ data[i].game_date+' '
                    +data[i].home_team.name+' vs '+data[i].away_team.name+'</option>';
            }
            var temp = $compile(htmlstring)($scope);
            $('#profile-games-search').html(temp);
            $('#profile-games-search').selectpicker('refresh');
            $('#profile-games-search').selectpicker('selectAll');
            $('#profile-games-search').selectpicker('refresh');
            $scope.drawTendency(season);
        }
    }
    $scope.drawTendency = function(seasonval){

        if($rootScope.isTendencyDrawn){
            return;
        } else {
            $rootScope.isTendencyDrawn = true;
            setTimeout(function () {
                $rootScope.isTendencyDrawn = false
            }, 500)
            var season,
                games = $('#profile-games-search').val() || [];

            if (seasonval) {
                season = seasonval === -1 ? null : seasonval;
            } else {
                season = $scope.tendencyObj.tendencySelected === -1 ? null : $scope.tendencyObj.tendencySelected;
            }
            $scope.seasonquery = season;
            $scope.gamesquery = games;
            if($scope.gamesquery.length){
                document.querySelector('.display_none').style.display='block';
                function drawFirstChart(data) {
                    var charData = [];
                    $scope.actionChartData = data.filter(function(obj)
                    {
                        return obj.player > 0
                    });
                    $scope.actionChartData.forEach(function (obj) {
                        charData.push({
                            name: obj.player + ' ' + obj.name,
                            data: [obj.player],
                            labels: {visible: true},
                            color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16)
                        });
                    });

                    $('.action-chart').kendoChart({
                        valueAxis: {
                            labels: {
                                font: "1px Arial,Helvetica,sans-serif",
                            }
                        },
                        title: {
                            text: 'Actions',
                            font: "15px Arial,Helvetica,sans-serif",
                            color: 'black',
                            align: "center",
                        },
                        legend: {
                            font: "10px Arial,Helvetica,sans-serif",

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
            }else{
                document.querySelector('.display_none').style.display='none';
            }
            function drawGauges() {
                setTimeout(function () {
                    for (var i = 0; i < $scope.actionChartData.length; i++) {
                        new JustGage({
                            id: 'action-chart-' + i,
                            value: (($scope.actionChartData[i].player)*100 / ($scope.actionChartData[i].team)),
                            min: 0,
                            max: 100,
                            // ($scope.actionChartData[i].team)
                            label: "%",
                            levelColors: ["#bc0202","#cdc720","#257f36"],
                        });
                    }
                    $('.action-chart-title').show();
                    $('.action-chart-footer').show();

                    $scope.tendencyObj.defactions = $('[ng-class="defence"]');
                    $scope.tendencyObj.ofactions = $('[ng-class="offence"]');
                }, 0);
            }
            function drawShotsPie() {
                $('.shot-pie').kendoChart({
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
                        text: Math.round($scope.actionChartData[0].player * 100 / $scope.actionChartData[0].team) + "% of team shots " + $scope.actionChartData[0].player + '/' + $scope.actionChartData[0].team,
                    },
                    legend: {
                        visible: true
                    },
                    chartArea: {
                        background: "transparent",
                        height: 200,
                        width: 300,
                    },
                    seriesDefaults: {
                        labels: {
                            visible: false
                        }
                    },
                    series: [{
                        type: "pie",
                        data: [{
                            category: "Player Shots",
                            value: $scope.actionChartData[0].player,
                            color: "blue"
                        }, {
                            category: "Team Shots",
                            value: $scope.actionChartData[0].team,
                            color: "red"
                        }]
                    }],
                    tooltip: {
                        visible: true,
                        background: '#000000',
                        color: '#ffffff',
                        padding: 5,
                        template: "${data.category} - ${value}",
                        font: "13px Arial,Helvetica,sans-serif"
                    }
                });
            }

            function drawShotsTypePie(data) {
                var temp={}, dataarr =[];
                data.forEach(function (obj) {
                    obj.result_names.forEach(function (string) {
                        if(!temp[string]){
                            temp[string] = 0;
                        }
                        temp[string]+=1;
                    });
                });
                var templink =[
                    {name:"2 Points Made In The Paint", id:1, color: '#ffbc4e'},
                    {name:"2 Points Attempt In The Paint", id:17, color: '#7a9720'},
                    {name:"2 Points Made Out Of The Paint",id:2, color:'#ff832e'},
                    {name:"2 Points Attempt Out Of The Paint", id:18, color: '#ffa22f'},
                    {name:"3 Points Made", id:3, color: '#597a2a'},
                    {name:"3 Points Attempt",color:'#adb325',id:19}
                ];
                var sum = 0;
                for (var prop in temp){

                    sum += temp[prop];
                }

                for(var prop in temp){
                    // if(!temp.hasOwnProperty(temp)) return;
                    dataarr.push({
                        category: prop,
                        value: temp[prop]
                    });

                    var link = templink.filter(function(obj){return obj.name === prop})[0];
                    link['sum'] = temp[prop]*100/sum;

                }
                $scope.links = templink;

                $('#shot_type-pie').kendoChart({
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
                        width: 500
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

            function drawDirectionChart(data) {
                $scope.shotGaugeData = data.filter(function(obj){return Boolean(obj.name);});
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
                $('.direction-chart').kendoChart({
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
            function drawShotAnalysis(data) {
                setTimeout(function () {
                var charData = [];
                data.forEach(function (obj) {
                    var object = {
                        name: obj.name === null ? obj.attempts + ' other' : obj.attempts + ' ' + obj.name,
                        data: [obj.attempts],
                        color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                        labels: {visible: true}
                    };
                    charData.push(object);
                });

                $('.shot-analysis').kendoChart({
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
                        font: "11px Arial,Helvetica,sans-serif",
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
                }, 1000)
            }
            function drawShotGauge(data) {
                setTimeout(function () {
                    for (var i = 0; i < data.length; i++) {
                        new JustGage({
                            id: 'shot-chart-' + i,
                            value: (data[i].made / data[i].attempts)*100,
                            min: 0,
                            max: 100,
                            label: " % ",
                            levelColors: ["#bc0202","#cdc720","#257f36"],
                        });
                    }
                    $('.shot-chart-title').show();
                    $('.shot-chart-footer').show();
                }, 1100);
            }
            function drawPointShotChart(data) {
                $('.point-shots-chart').kendoChart({
                    valueAxis: {
                        labels: {
                            font: "10px Arial,Helvetica,sans-serif"
                        }
                    },
                    title: {
                        text: 'Points and Shots',
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
                            name: data[0].shots + ' Shots',
                            data: [data[0].shots],
                            color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                            labels: {visible: true}
                        },
                        {
                            name: data[0].points + ' Points',
                            data: [data[0].points],
                            color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                            labels: {visible: true}
                        },
                        {
                            name: data[0].baskets + ' Baskets',
                            data: [data[0].baskets],
                            color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                            labels: {visible: true}
                        },
                        {
                            name: data[0].ft_made + ' FT Made',
                            data: [data[0].ft_made],
                            color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                            labels: {visible: true}
                        },
                        {
                            name: data[0].ft_attempt + ' FT Miss',
                            data: [data[0].ft_attempt],
                            color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                            labels: {visible: true}
                        }
                    ],
                    tooltip: {
                        visible: true,
                        background: '#000000',
                        color: '#ffffff',
                        padding: 5,
                        template: "${series.name.split(' ').slice(1).join(' ')} - ${value}",
                        font: "11px Arial,Helvetica,sans-serif"
                    },
                    chartArea: {
                        width: 400,
                        height: 250
                    },
                });
            }
            function drawAssistAnalysis(data) {
                setTimeout(function () {
                var chartData = [];
                for (var i = 0; i < data.length; i++) {
                    var obj = {
                        name: data[i].name === null ? data[i].count + ' other' : data[i].count + ' ' + data[i].name,
                        data: [data[i].count],
                        color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                        labels: {visible: true}
                    };
                    chartData.push(obj);
                }

                $('.assist-analysis').kendoChart({
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
                }, 1000)
            }
            function drawTurnoverAnalysis(data) {
                setTimeout(function () {
                var chartData = [];
                for (var i = 0; i < data.length; i++) {
                    var obj = {
                        name: data[i].name === null ? data[i].count + ' other' : data[i].count + ' ' + data[i].name,
                        data: [data[i].count],
                        color: "#" + (Math.random() * 0xFFFFFF << 0).toString(16),
                        labels: {visible: true}
                    };
                    chartData.push(obj);
                }

                $('.turnover-analysis').kendoChart({
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
                },1000)
            }
            PlayerSearchService.getActions($scope.player, season, games)
                .then(function (data) {
                    $scope.tendencyObj.actionsData = data;
                    actiontypes = [];
                    $scope.tendencyObj.actionsData.forEach(function(obj) {
                        actiontypes[obj.action] = obj.name;
                    });
                    drawFirstChart(data);
                })
                .then(function (data) {
                    drawShotsPie();
                    return data;
                })
                .then(function (data) {
                    drawGauges();
                    return data;
                });
            PlayerSearchService.getShotsAnalysis($scope.player, season, games)
                .then(function (data) {
                    drawDirectionChart(data);
                    return data;
                })
                .then(function (data) {
                    drawShotsTypePie(data);
                    return data;
                })
                .then(function (data) {
                    drawShotAnalysis(data);
                    return data;
                })
                .then(function (data) {
                    drawShotGauge(data.filter(function(obj){return Boolean(obj.name);}));
                });

            PlayerSearchService.getBasketPoints($scope.player, season, games)
                .then(function (data) {
                    drawPointShotChart(data);
                });

            PlayerSearchService.getAssistAnalysis($scope.player, season, games)
                .then(function (data) {
                    drawAssistAnalysis(data);
                });
            PlayerSearchService.getTurnoverAnalysis($scope.player, season, games)
                .then(function (data) {
                    drawTurnoverAnalysis(data);
                });
        }
    };
    $scope.speedIndex = 1.0;
    $scope.indexVideo= true;
    $scope.controlSecondButtons = function(sec){
        var video = document.getElementById("game_video_watch");
        video.currentTime += Number(sec);
    };
    $scope.controlSpeedButtons = function(x){
        $scope.speedIndex += Number(x);
        var video = document.getElementById("game_video_watch");
        if($scope.speedIndex < 0.2){
            $scope.speedIndex = 0.2;
        }
        video.playbackRate = $scope.speedIndex;
    };
    $scope.controlSpeedNormalButtons = function(){
        $scope.speedIndex = 1.0;
        $scope.indexVideo = true;
        var video = document.getElementById("game_video_watch");
        video.playbackRate = $scope.speedIndex;
    };
    $scope.controlPlayPause = function(){
        var video = document.getElementById("game_video_watch");
        if($scope.indexVideo) {
            video.play();
        } else {
            video.pause();
        }
        $scope.indexVideo = !$scope.indexVideo;
    };
    $scope.handleModal = function(id, flag){
        id = flag? id.target.dataset.id : id;

        TeamInformation.getBoxScore(id).then(function (data) {
            $scope.boxScore = data;
            if(data.game_stats[0].team === data.away_team.id){
                $scope.bsHomeTeam = data.game_stats[1];
                $scope.bsAwayTeam = data.game_stats[0];
            } else{
                $scope.bsHomeTeam = data.game_stats[0];
                $scope.bsAwayTeam = data.game_stats[1];
            }
        });
    };
    $scope.playClips = function(id, actid, name){
        if(id && !actid){
            PlayerSearchService.getPlayerVideos($scope.player, $scope.seasonquery, $scope.gamesquery, id)
                .then(function(data){handleVideo(data)});
        } else if(actid && name){
            PlayerSearchService.getPlayerVideos($scope.player, $scope.seasonquery, $scope.gamesquery, id, actid)
                .then(function(data){
                    var video = data.filter(function (obj){ return obj.action === 1 });
                    handleVideo(video,name)});
        }else{
            PlayerSearchService.getPlayerVideos($scope.player, $scope.seasonquery, $scope.gamesquery)
                .then(function(data){handleVideo(data)});
        }
    };
    $scope.playClipsPlayer = function(id, actid, name){
            PlayerSearchService.getPlayerVideos($scope.player, $scope.seasonquery, $scope.gamesquery, id)
                .then(function(data){
                    var video = data.filter(function (obj){ return obj.action === 1 && obj.action_result === actid});
                    handleVideo(video,name)});

    };
    $scope.changeClip = function(obj){
        $scope.currentVideo = obj;
    };
    $scope.nextClip = function(){
        var idx = $scope.videos.indexOf($scope.currentVideo);
        if(idx >= 19) return;
        $scope.currentVideo = $scope.videos[idx+1];
    };
    $scope.prevClip = function(){
        var idx = $scope.videos.indexOf($scope.currentVideo);
        if(idx === 0) return;
        $scope.currentVideo = $scope.videos[idx-1];
    };
    $scope.videofullscreen = function(){
        if(document.getElementById('playClipsModal').classList.contains('full_screen')){
            document.getElementById('playClipsModal').classList.remove('full_screen');
        } else {
            document.getElementById('playClipsModal').classList.add('full_screen');
        }
    };
    $scope.dismissModal=function(){
        $scope.videos = [];
        $scope.currentVideo = '';
        var video = document.getElementById('clip');
        video.pause();
        video.hidden = true;
        document.removeEventListener('click', listenerModal);
    };

    $scope.getLeagueDataNewTab = function(league_id, season_id,league_name) {
        var path = 'league' + '/' + season_id + '/' + league_id + '/' + league_name.replace(/ /g, '_');
        $window.open(path, '_blank');
    };

    $scope.getTeamDataNewTab = function(team_id,league_id,season_id,team_name) {

        var path = 'team' + '/' + season_id + '/' + league_id + '/' + team_id + '/' + team_name.replace(/ /g, '_');
        $window.open(path, '_blank');
    };

    $scope.getLeagueNameTab = function(league_id, season_id,league_name) {
        var path = 'league' + '/'+ season_id + '/' + league_id + '/' + league_name.replace(/ /g, '_');
        $window.open(path, '_blank');
    };

    $scope.getHomeTeamNameTab = function(home_team_id,league_id,season_id,home_team_name) {
        var path = 'team' + '/' + season_id + '/' + league_id + '/' + home_team_id + '/' + home_team_name.replace(/ /g, '_');
        $window.open(path, '_blank');
    };
    //
    $scope.getAwayTeamNameTab = function(away_team_id,league_id,season_id,away_team_name) {
        var path = 'team' + '/' + season_id + '/' + league_id + '/' + away_team_id + '/' + away_team_name.replace(/ /g, '_');
        $window.open(path, '_blank');
    };
    // $scope.getTeamDataTab = function(op_team,leagueId,seasonId,op_team_name) {
    //     var path = 'team' + '/' + season_id + '/' + league_id + '/' + op_team + '/' + op_team_name.replace(/ /g, '_');
    //     $window.open(path, '_blank');
    // };

    // playerTendencyShotPercentage


} // end of controller


