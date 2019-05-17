var app = angular.module('main_app', [
	"angularjs-dropdown-multiselect",
    "ui.router",
    "ngSanitize",
    'ngAnimate',
    'ngMaterial',
    'cl.paging',
    "angular-loading-bar",
    'ngIdle'
]).config(function($mdThemingProvider) {
    var customRedMap = $mdThemingProvider.extendPalette('red', {
        '500': '#c30000',
        'contrastDefaultColor': 'light'
    });
    var customGreyMap = $mdThemingProvider.extendPalette('grey', {
        '500': '#545454',
        'contrastDefaultColor': 'light'
    });

    $mdThemingProvider.definePalette('customRed', customRedMap);
    $mdThemingProvider.definePalette('customGrey', customGreyMap);

    $mdThemingProvider.theme('default').primaryPalette('customRed');
    $mdThemingProvider.theme('default').warnPalette('customGrey');
})
    .constant('_',window._)
    .run(function($rootScope, $state) {
    $rootScope.user         = null;
    $rootScope.isLoggedIn  = false;
    $rootScope._ = window._;

        $(window).on('load', function(e){
            if(e.target.URL !== e.target.baseURI){
                $state.go(window.location.pathname);
            }
        });
})
    .run(function ($rootScope, $location, PlayerSearchService, TeamInformation, LeaguesService) {
        $rootScope.$on("$locationChangeSuccess", function (event, next, current) {

            var url = next.slice(next.indexOf('com/') + 4);
            var arr = url.split('/');
            var first = arr[0];
            var second = arr[1];
            var third = arr[2];
            var fourth = arr[3];

            var urlFrom = current.slice(current.indexOf('com/') + 4);
            var arrFrom = urlFrom.split('/');
            var firstFrom = arrFrom[0];
            var secondFrom = arrFrom[1];
            var thirdFrom = arrFrom[2];
            var fourthFrom = arrFrom[3];

            if(sessionStorage.user) {
                var userData = JSON.parse(sessionStorage.user);
                var isAdmin = false;
                var goldSubscription = false;
                var accessVideoEditor = false;
                var accessLeague = false;
                var accessTeam = false;
                var accessPlayer = false;
                var accessScoutReport = false;
                var leagues = [];
                var leagueIds = [];
                var teams = [];
                var teamIds = [];
                var players = [];


                var checkPath = true;

                var demoMenu = document.querySelector('.demo');

                if (userData.user.last_name == 'Demo') {
                    var demoPrem = document.querySelector('.demoPrem');
                     // demoPrem.addClass('menu-disabled');
                }

                if (userData.user.is_admin == true) {
                    isAdmin = true;
                    accessVideoEditor = true;
                    accessLeague = true;
                    accessTeam = true;
                    accessPlayer = true;
                    accessScoutReport = true;
                } else {
                    for (var i = 0; i < userData.user.subscriptions.length; i++) {
                            if (userData.user.subscriptions[i].package_name == 'Advanced Video Editor') {
                                accessVideoEditor = true;
                            } else if (userData.user.subscriptions[i].package_name == 'Gold') {
                                goldSubscription = true;
                                accessLeague = true;
                                accessTeam = true;
                                accessPlayer = true;
                                accessScoutReport = true;
                                if(first == '') {
                                    $location.path('league/29/2/Euroleague');//////TO FIX
                                }
                            } else if (userData.user.subscriptions[i].package_name == 'League') {
                                accessLeague = true;
                                leagueIds.push(userData.user.subscriptions[i].league);
                                leagues.push({
                                    leagueId: userData.user.subscriptions[i].league,
                                    seasonId: userData.user.subscriptions[i].season
                                });
                            } else if (userData.user.subscriptions[i].package_name == 'Team') {

                                    teamIds.push(userData.user.subscriptions[i].team);
                                    teams.push({
                                        teamId: userData.user.subscriptions[i].team,
                                        seasonId: userData.user.subscriptions[i].season,
                                        leagueId: userData.user.subscriptions[i].league
                                    });


                            } else if (userData.user.subscriptions[i].package_name == 'Player') {
                                players.push({
                                    playerId: userData.user.subscriptions[i].player
                                });
                            }else if(userData.user.last_name == 'Demo'){
                                
                            }
                    }
                    //redirect
                    if(players.length == 1) {
                        PlayerSearchService.getPlayerById(players[0].playerId).then(function (data) {
                            var playerProfile = data;
                            if(!(first == 'player' && second == players[0].playerId) && first != 'about_us'  && first != 'tools') {
                                $location.path('player' + '/' + playerProfile.id + '/' + playerProfile.last_name + '_' + playerProfile.first_name);
                            }
                        });
                    }
                    else if(leagues.length == 1 && teams.length == 0) {
                        $rootScope.leagueIds = leagueIds;
                        LeaguesService.getLeagues(leagues[0].leagueId).then(function (data) {
                            if((first != 'league' && second != leagues[0].seasonId && third != leagues[0].leagueId)
                                && first != 'about_us' && first != 'tools') {
                                if((first == 'team' || first == 'player') && firstFrom == 'league' ) {
                                    checkPath = false;
                                }
                                else {
                                    $location.path('league/' + leagues[0].seasonId + '/' + leagues[0].leagueId + '/' + data.name + '/');
                                }
                            }
                        });
                    } else if(teams.length == 1 && leagues.length == 0) {
                        $rootScope.teamIds = teamIds;
                        TeamInformation.getTeamName(teams[0].teamId).then(function (data) {
                            if((first != 'team' && second != teams[0].seasonId && third != teams[0].leagueId && fourth != teams[0].teamId)
                                && first != 'about_us' && first != 'tools') {
                                if(first == 'player' && firstFrom == 'team') {
                                    checkPath = false;
                                } else {
                                    $location.path('team/' + teams[0].seasonId + '/' + teams[0].leagueId + '/' + data.id + '/' + data.name);
                                }
                            }
                        });
                    } else if(leagues.length > 1 || teams.length > 1) {
                        if(leagues.length > 1) {
                            $rootScope.leagueIds = leagueIds;
                        }
                        if(teams.length > 1) {
                            $rootScope.teamIds = teamIds;
                        }
                    }
                    if(checkPath) {
                        if (!goldSubscription) {
                            if (first == 'league') {
                                var access = false;
                                for (var i = 0; i < leagues.length; i++) {
                                    if (leagues[i].leagueId == third && (leagues[i].seasonId == '' || leagues[i].seasonId == second))
                                        access = true;
                                }
                                if (!access) {
                                    $location.path('/');
                                }
                            } else if (first == 'team') {
                                var access = false;
                                if(firstFrom == 'league') {
                                    access = true;
                                } else {
                                    for (var i = 0; i < teams.length; i++) {
                                        if (teams[i].teamId == fourth && ((teams[i].seasonId == '' && teams[i].leagueId == '') ||
                                                (teams[i].seasonId == '' && teams[i].leagueId == third) || (teams[i].seasonId == second && teams[i].leagueId == '') ||
                                                (teams[i].seasonId == second && teams[i].leagueId == third)))
                                            access = true;
                                    }
                                }
                                if (!access) {
                                    $location.path('/');
                                }
                            } else if (first == 'player') {
                                var access = false;
                                if(firstFrom == 'team' || firstFrom == 'league') {
                                    access = true;
                                } else {
                                    for (var i = 0; i < players.length; i++) {
                                        if (players[i].playerId == second)
                                            access = true;
                                    }
                                }
                                if (!access ) {
                                    $location.path('/');
                                }
                            }
                        }
                    }
                    //redirect end
                }

                $rootScope.accessTeamFromLeague = false;
                if(teams.length > 0) {
                    $rootScope.accessibleTeams = teams;
                }
                if(leagues.length > 0) {
                    $rootScope.accessibleLeagues = leagues;
                    $rootScope.accessibleTeams = leagues;
                    $rootScope.accessTeamFromLeague = true;
                }
                $rootScope.goldSubscription = goldSubscription;
                $rootScope.isAdmin = isAdmin;
                $rootScope.accessConfig = {};
                $rootScope.accessConfig.video = accessVideoEditor;
                $rootScope.accessConfig.league = accessLeague;
                $rootScope.accessConfig.team = accessTeam;
                $rootScope.accessConfig.player = accessPlayer;
                $rootScope.accessConfig.scoutReport = accessScoutReport;
            } else {
                console.log(first);
                // if(first === 'player') {
                //     PlayerSearchService.getPlayerById(second).then(function (data) {
                //         if(notExpired(data.free_profile_access_until)) {}
                //         else {
                //             $location.path('/');
                //         }
                //     })
                // } else
                    if(first === 'tools') {}
                else {
                    $location.path('/');
                }
            }
            function notExpired(date) {
                var now = new Date();
                if(new Date(date) >= new Date(now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate())) {
                    return true;
                } else {
                    //alert('Your subscription has been expired');
                    //return false;
                    //Chnaged by Daniel temporally
                    return true;
                }
            }
        })
    });