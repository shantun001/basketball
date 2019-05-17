app.factory ('psService', ['$http', function ($http) {
    function getResponse(currentUrl) {
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

    function successCase(response) {
        return response.data;
    }

    function errorCase(response) {
        console.log("sorry, error!");
        return response.status;
    }

    var service ={};

//search
    service.getSeasons = function(){
        return $http(getResponse(APIBASEURL + '/seasons/')).then(successCase, errorCase);
    };
    service.getLeagues = function(season_id){
        return $http(getResponse(APIBASEURL + '/seasons/'+ season_id + '/leagues/')).then(successCase, errorCase);
    };
    service.getCountries = function(season_id, league_id){
        var url;
        if(season_id && !league_id){
            url = '/countries/?seasons='+ season_id;
        } else if(!season_id && league_id){
            url = Array.isArray(league_id) ? '/countries/?leagues=' + league_id.join(',') : '/countries/?leagues=' + league_id;
        } else if(season_id && league_id){
            var lid = Array.isArray(league_id) ? league_id.join(',') : league_id;
            url = '/countries/?seasons=' + season_id + '&leagues=' + lid;
        }
        return $http(getResponse(APIBASEURL + url)).then(successCase, errorCase);
    };

    service.searchPlayers = function(seasonId, leagueId, countryId, positionsId, heightId, ageId,
                                     fgmId, fgaId, fgId, n3pmId, n3paId, n3pId, n2pmId, n2paId,
                                     n2pId, ftmId, ftaId, ftId, orId, drId, trId, asId, toId, stId,
                                     ptsId, minId, bsId, valId, oerId, virId){
        var queries =[ '&country=','&positions=',  '&height=',
             '&ages=',  '&fgm=',  '&fga=',  '&fgp=', '&p3m=',  '&p3a=',
            '&p3p=',  '&p2m=',  '&p2a=',  '&p2p=', '&ftm=',  '&fta=',
             '&ftp=',  '&ofr=',  '&dfr=', '&tr=', '&ass=','&tr=',  '&st=',
             '&points=',  '&minutes=', '&bs=',  '&val=',  '&oer=', '&vir='
        ];

        var url = APIBASEURL + '/seasons/' + seasonId + '/players_search/?leagues=' + leagueId.toString();
        for(var i = 2; i < arguments.length; i++){
            if(!arguments[i]) continue;
            // console.log(i, queries[i-2], arguments[i]);
            if(Array.isArray(arguments[i])){

                url += queries[i-2] + arguments[i].toString();
            } else{
                url += queries[i-2] + arguments[i];
            }
        }
        return $http(getResponse(url)).then(successCase, errorCase);
    };
    return service;

}]);





