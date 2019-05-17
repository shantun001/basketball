app.service('PlayerService', ['$http', '$q', function ($http, $q) {
    var endpoint = APIBASEURL + '/users/';

	this.getPlayerInfo = function(data){
		console.log('data',data);
		//return $http.get(endpoint + 'me/',data);
		return $http({
			method: 'GET',
			url: endpoint + 'me/',
			data: "token=" + data,
			headers: {'Content-Type': 'application/json',
			'Authorization':'JWT '+data}
		});
	};
	this.getPlayerList = function(pname){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/players/?name='+pname,
			headers: {'Content-Type': 'application/json'}
		});
	};

	this.getCareerData = function(pid){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/stats/players/'+pid+'/career/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});	
	};

	this.playerRanksService = function(pid,pdata){
		var slt = pdata.split(',');
		return $http({
			method: 'GET',
			url: APIBASEURL + '/stats/players/'+pid+'/rank/?season='+slt[0]+'&league='+slt[1]+'&team='+slt[2]+'&avg_minutes=10&played_count=15',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.playerStatAnalysisService = function(pid,pdata,data_by){
		var slt = pdata.split(',');
		var api_url = APIBASEURL + '/stats/players/'+pid+'/'+data_by+'/?season='+slt[0];
		if(slt.length>1) api_url = APIBASEURL + '/stats/players/'+pid+'/'+data_by+'/?season='+slt[0]+'&league='+slt[1];
		return $http({
			method: 'GET',
			//url: APIBASEURL + '/stats/players/'+pid+'/'+data_by+'/?season='+slt[0],
			url: api_url,
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.playerGamesBySeasonAndleagueService = function(pid,pdata,data_by){
		var slt = pdata.split(',');
		return $http({
			method: 'GET',
			//url: APIBASEURL + '/stats/players/'+pid+'/'+data_by+'/?season='+slt[0],
			url: APIBASEURL + '/stats/players/'+pid+'/'+data_by+'/?season='+slt[0]+'&league='+slt[1],
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.getPlayerGamesService = function(pid){
		console.log('getPlayerGamesService called');
		return $http({
			method: 'GET',
			url: APIBASEURL + '/video_editor/players/'+pid+'/individual_tags/games/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.getPlayerVideoservice = function(pid){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/players/'+pid+'/videos/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.getIndActionsService = function(pid){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/video_editor/individual_actions/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.getIndActionTypesService = function(pid){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/video_editor/individual_action_types/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.getIndActionResultService = function(pid){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/video_editor/individual_action_results/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.fetchIndTagService = function(pid,career,games){
		if(!career || career<=0) { career = null;}
		var gm = [];
		if(Array.isArray(games))
			for(var i = 0;i<games.length; i++){
				gm.push(games[i]);
			}
		var Indata = {"season":career,"games":gm}
		return $http({
			method: 'POST',
			data: Indata,
			url: APIBASEURL + '/video_editor/players/'+pid+'/individual_tags/',
			headers: {'Content-Type': 'application/json','Content-Length': Indata.length,'Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.shotsIndTagsService = function(pid,career,games,shotid){
		// shotid is action type id
		if(!career || career<=0) { career = null;}
		var gm = [];
		if(Array.isArray(games))
			for(var i = 0;i<games.length; i++){
				gm.push(games[i]);
			}
		var Indata = {"season":career,"games":gm,"action":1,"action_type":shotid}
		return $http({
			method: 'POST',
			data: Indata,
			url: APIBASEURL + '/video_editor/players/'+pid+'/individual_tags/',
			headers: {'Content-Type': 'application/json','Content-Length': Indata.length,'Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.clipsByActionsService = function(pid,career,games){
		if(!career || career<=0) { career = null;}
		var gm = [];
		if(Array.isArray(games))
			for(var i = 0;i<games.length; i++){
				gm.push(games[i]);
			}

		var Indata = {"season":career,"games":gm}

		return $http({
			method: 'POST',
			data: Indata,
			url: APIBASEURL + '/video_editor/players/'+pid+'/individual_tags/by_action/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.groupClipsByShortsService = function(pid,career,games){
		if(!career || career<=0) { career = null;}
		var gm = [];
		if(Array.isArray(games))
			for(var i = 0;i<games.length; i++){
				gm.push(games[i]);
			}
		var Indata = {"season":career,"games":gm};

		return $http({
			method: 'POST',
			data: Indata,
			url: APIBASEURL + '/video_editor/players/'+pid+'/individual_tags/shots_analysis/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.groupClipsByAssistService = function(pid,career,games){
		if(!career || career<=0) { career = null;}
		var gm = [];
		if(Array.isArray(games))
			for(var i = 0;i<games.length; i++){
				gm.push(games[i]);
			}
		var Indata = {"season":career,"games":gm};

		return $http({
			method: 'POST',
			data: Indata,
			url: APIBASEURL + '/video_editor/players/'+pid+'/individual_tags/assists_analysis/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.groupClipsByTurnoverService = function(pid,career,games){
		if(!career || career<=0) { career = null;}
		var gm = [];
		if(Array.isArray(games))
			for(var i = 0;i<games.length; i++){
				gm.push(games[i]);
			}
		var Indata = {"season":career,"games":gm};

		return $http({
			method: 'POST',
			data: Indata,
			url: APIBASEURL + '/video_editor/players/'+pid+'/individual_tags/turnovers_analysis/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.playerBasketPointsService = function(pid,career,games){
		if(!career || career<=0) { career = null;}
		var gm = [];
		if(Array.isArray(games))
			for(var i = 0;i<games.length; i++){
				gm.push(games[i]);
			}
		var Indata = {"season":career,"games":gm};

		return $http({
			method: 'POST',
			data: Indata,
			url: APIBASEURL + '/video_editor/players/'+pid+'/individual_tags/baskets_points/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.getPlayerOfGameService = function(gameid){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/games/'+gameid+'/stats/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.getVideoByGame = function(gameid){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/games/'+gameid+'/video/',
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

	this.getGameVideoService = function(sid){
		return $http({
			method: 'GET',
			url: APIBASEURL + '/videos/?season='+sid,
			headers: {'Content-Type': 'application/json','Authorization':'JWT '+JSON.parse(sessionStorage.user).token}
		});
	};

}]);