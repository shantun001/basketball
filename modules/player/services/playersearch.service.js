app
    .factory('PlayerSearchService', ['$http', function($http){
        var service = {};
        function request(currentUrl) {
            return {
                method: 'GET',
                url: currentUrl,
                headers: {'Content-Type': 'application/json', 'Authorization':'JWT ' + JSON.parse(sessionStorage.user).token}
            };
        }
        function postrequest(currentUrl, data){
            return {
                method: 'POST',
                url: currentUrl,
                headers: {'Content-Type': 'application/json', 'Authorization':'JWT ' + JSON.parse(sessionStorage.user).token},
                data: data
            };
        }
        function onResponse(response) {
            // console.log(response.data);
            return response.data;
        }
        function onError(response) {
            console.log("sorry, error!");
            return response.status;
        }

        service.getPlayers = function(searchString){
                return $http(request(APIBASEURL + '/players/?name=' +searchString )).then(onResponse, onError);
        };
        service.getPlayerById = function(id){
            return $http(request(APIBASEURL + '/players/' + id+'/')).then(onResponse, onError);
        };
        service.getCareer= function(id){
            return $http(request(APIBASEURL + '/stats/players/'+ id + '/career/')).then(onResponse, onError);
        };
        service.getPlayerRankData = function(playerId, string){
            var data = string.split(',');
            return $http(request(APIBASEURL +
                '/stats/players/'+playerId+'/rank/?season='+data[0]+'&league='+data[1]+'&team='
                +data[2]+'&avg_minutes=10&played_count=1')).then(onResponse, onError);
        };
        service.getPlayerStatData = function(id, criteria, seasonId, leagueId){
            return $http(request(APIBASEURL + '/stats/players/' + id + '/' + criteria + '/?season='
                + seasonId +'&league=' + leagueId)).then(onResponse, onError);
        };
        service.playerStatAnalysis = function(id,data,category){
            var slt = data.split(',');
            if(category === 'season_stats') slt[1] = 0;
            var url = APIBASEURL + '/stats/players/'+id+'/'+category+'/?season='+slt[0];
            if(slt.length>1) url = APIBASEURL + '/stats/players/'+id+'/'+category+'/?season='+slt[0]+'&league='+slt[1];
            return $http(request(url)).then(onResponse, onError);
        };
        service.getGameByGame = function(id, data, criteria){
            var slt = data.split(',');
            return $http(request(APIBASEURL + '/stats/players/'+id+'/'+criteria+'/?season='+slt[0]+'&league='+slt[1]))
                .then(onResponse, onError);
        };
        service.getPlayerVideo = function(id){
            return  $http(request(APIBASEURL + '/players/'+id+'/videos/')).then(onResponse, onError);
        };
        service.getPlayerGames = function(id){
            return $http(request(APIBASEURL + '/video_editor/players/'+id+'/individual_tags/games/')).then(onResponse, onError);
        };
        service.getActionTypes = function(){
            return $http(request(APIBASEURL + '/video_editor/individual_action_types/')).then(onResponse, onError);
        };
        service.getActionResults = function(){
            return $http(request(APIBASEURL + '/video_editor/individual_action_results/')).then(onResponse, onError);
        };
        service.getAction = function(){
            return $http(request(APIBASEURL + '/video_editor/individual_actions/')).then(onResponse, onError);
        };
        service.getPlayerVideos = function(id, season, games, actionid, actid){
            var data = {
                season: season,
                games: games,
                action: actionid,
                action_type: actid
            };
            return $http(postrequest(APIBASEURL + '/video_editor/players/'+id+'/individual_tags/', data)).then(onResponse, onError);
        };
        service.getActions = function(id, season, games){
            var data = {
                season: season,
                games: games
            };

            return $http(postrequest(APIBASEURL + '/video_editor/players/'+id+'/individual_tags/by_action/', data))
                .then(onResponse, onError);
        };
        service.getShotsAnalysis = function(id, season, games){
            var data ={
                season:season,
                games:games
            };
            return $http(postrequest(APIBASEURL +'/video_editor/players/'+id+'/individual_tags/shots_analysis/', data))
                .then(onResponse, onError);

        };
        service.getBasketPoints = function(id, season, games){
            var data ={
                season:season,
                games:games
            };
            return $http(postrequest(APIBASEURL +'/video_editor/players/'+id+'/individual_tags/baskets_points/', data))
                .then(onResponse, onError);
        };
        service.getAssistAnalysis = function(id, season,games){
            var data ={
                season:season,
                games:games
            };
            return $http(postrequest(APIBASEURL +'/video_editor/players/'+id+'/individual_tags/assists_analysis/', data))
                .then(onResponse, onError);
        };
        service.getTurnoverAnalysis = function(id, season, games){
            var data ={
                season:season,
                games:games
            };
            return $http(postrequest(APIBASEURL +'/video_editor/players/'+id+'/individual_tags/turnovers_analysis/', data))
                .then(onResponse, onError);
        };
        service.getTaggedSeasons = function(id){
            return $http(request(APIBASEURL +'/players/'+id+'/tagged_seasons/'))
                .then(onResponse, onError);
        };
        service.getGamesBySeason = function(id, seasonId){
            return $http(request(APIBASEURL +'/video_editor/players/'+id+'/individual_tags/games/?season='+ seasonId))
                .then(onResponse, onError);
        };
        service.getCounter = function(pid){
            return $http(request(APIBASEURL + '/players/'+ pid + '/page_views/'))
                .then(onResponse, onError);
        };
        service.setCounter = function(pid){
            return $http(postrequest(APIBASEURL + '/players/'+ pid + '/page_views/'))
                .then(onResponse, onError);
        };
        service.createFolder = function(name){
            return $http(postrequest(APIBASEURL + '/video_editor/folders/',
                {
                    "parent": null,
                    "name": name,
                    "order_num": 1
                })).then(onResponse, onError);
        };
        service.uploadVideosToFolder = function(folderId, videoName, videoUrl){
            return $http(postrequest(APIBASEURL + '/video_editor/folders/' + folderId + '/clips/',
                {
                    "title": videoName,
                    "file_name": videoUrl
                })).then(onResponse, onError);
        };
        return service;
    }]);