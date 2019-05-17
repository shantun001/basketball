app.config(function($sceProvider) {
    $sceProvider.enabled(false);
});
app.config(function(IdleProvider, KeepaliveProvider) {
    IdleProvider.idle(10800); //all configs are set in seconds
    IdleProvider.timeout(5);
    KeepaliveProvider.interval(2);
});

app.run(['Idle', function(Idle) {
    Idle.watch();
}]);

app.service('headerService', function() {
    var params = {};

    var addParams = function (id, name,seasonId, logo) {
        params.name = name;
        params.id = id;
        params.seasonId = seasonId;
        params.logo = logo;
    };

    var getParams = function () {
        return params;
    };

    return {
        addParams: addParams,
        getParams: getParams
    };

}).controller('HeaderController', ['$scope', '$http', '$rootScope','headerService', 'Idle', 'Keepalive', '$window', '$location', '$state',
    function ($scope, $http, $rootScope, headerService, Idle, Keepalive, $window, $location, $state) {

        // $scope.transitionToPlayerSearch = function () {
        //     $location.path('/playersearch');
        //     console.log('transition');
        // };

        $scope.$on('IdleTimeout', function() {
            window.sessionStorage.removeItem('user');
            Idle.unwatch();
            window.location.reload();
        });
    try {
    if(sessionStorage.user != undefined) {
        try {
            //console.log('USER DATA',JSON.parse(sessionStorage.user));
            $rootScope.user         = JSON.parse(sessionStorage.user).user;
            $rootScope.isLoggedIn   = true;
            $rootScope.authToken    = JSON.parse(sessionStorage.user).token;

            $http(getResponse(APIBASEURL + '/leagues/')).then(successCase, errorCase).then(function(responseData) {
                if($rootScope.user.is_admin || $rootScope.goldSubscription) {
                    $scope.dataLeagues = responseData;
                }
                else {
                    if($rootScope.leagueIds != undefined) {
                        $scope.dataLeagues = [];
                        for (var i = 0; i < responseData.length; i++) {
                            $scope.dataLeagues.push({
                                id: responseData[i].id,
                                leagues: [],
                                name: responseData[i].name
                            });
                            for (var j = 0; j < responseData[i].leagues.length; j++) {
                                if ($rootScope.leagueIds.includes(responseData[i].leagues[j].pk)) {
                                    $scope.dataLeagues[i].leagues.push(responseData[i].leagues[j]);
                                }
                            }
                        }
                    }
                }
            });
            function getResponse(currentUrl) {
                return {
                    method: 'GET',
                    url: currentUrl,
                    headers: {'Content-Type': 'application/json','Authorization':'JWT ' + $rootScope.authToken}
                }
            }
            function errorCase(response) {
                console.log("sorry, error!");
                return response.status;
            }
            function successCase(response) {
                return response.data;
            }

        } catch(e) {}
    }
    } catch (e) {console.log(e);}

    $scope.goToUploadTool = function () {
        $location.path('/uploadTool');
    };

    $scope.sendParams =  function(id, name,seasonId, logo){
        headerService.addParams(id, name,seasonId, logo);
        $rootScope.choiceSeason = '';
    };
    $scope.logout = function() {
        $scope.loginErrors = {};
        $scope.authdata = {};
        localStorage.userName = '';
        localStorage.password = '';
        document.cookie = 'name=remember; expires=' + new Date(0).toUTCString();
        sessionStorage.user = '';
        sessionStorage.clear();
        $rootScope.isLoggedIn   = false;
        /*window.location.reload();*/
        $location.path("/");
    };

    $rootScope.frame ={
        frameEditorFlag : false,
        frameReportFlag: false,
        getEditorLink: function(){
            if(!$rootScope.authToken) return 'https://tool.s4upro.com/';
            else return 'https://tool.s4upro.com/angular-moviemasher/app/?token=' + $rootScope.authToken;
        },
        getReportLink: function(){
            if(!$rootScope.authToken) return 'https://app.s4upro.com/';
            else return 'https://app.s4upro.com/team-scout-report?accessToken=' + $rootScope.authToken;
        },
        getScoutLink: function( seasonId, seasonName, leagueId, leagueName, teamId, teamName){
            if(!$rootScope.authToken) return 'https://app.s4upro.com/';
            else return 'https://app.s4upro.com/'+ seasonId + '/' + seasonName + '/' + leagueId + '/' + leagueName + '/' +teamId + '/'+teamName+ '/scout-report?accessToken=' + $rootScope.authToken;
        }
 
        };

        $scope.hideFooter = function () {
            $('.footer').css({'display': 'none'})
        };
        $scope.showFooter = function () {
            $('.footer').css({'display': 'block'})
        };
        $scope.refreshRegisterForm = function () {
            $('.reset-register-form').val('');
        };

        $scope.openEditor = function(){
        console.log('sessionStorage ', sessionStorage);
        if(sessionStorage.length>0 && sessionStorage.user != '')
            $scope.editor_url = 'https://tool.s4upro.com/angular-moviemasher/app/?token='+JSON.parse(sessionStorage.user).token;
        else $scope.editor_url = 'https://tool.s4upro.com/angular-moviemasher/app/';
        $('#editor iframe').attr('src',$scope.editor_url);
    };
    $scope.checkRegexPassword = function() {
        if($rootScope.user) {
            if(!$rootScope.user.hasOwnProperty('password') || $rootScope.user.password == '' ) {
                return true;
            }
            return $rootScope.user.hasOwnProperty('password') && $rootScope.user.password.length >= 8 && /(?:[A-Za-z]\d|\d[A-Za-z])/i.test($rootScope.user.password);
        }
    };
    $scope.goHome = function () {
        $window.open('/', '_self');
    };

    $scope.openScoutReport = function(){
        $scope.sr_url = 'https://app.s4upro.com/team-scout-report';
        //$sce.trustAsResourceUrl($scope.tracks);
        $('#scout_report iframe').attr('src',$scope.sr_url);
    };

        $scope.openDemo = function () {
            $location.path('/demo');
        };

    $scope.openTools = function () {
        $location.path('/tools');
    };

    $scope.openPremium = function () {
         $location.path('/premium');
    };

    $scope.noAccess = function(){
        $('.head_overlay').html('<h5>Access Danied ! </h5>').animate({background:'rgba(0,0,0,0.6)'},2000,function(){
            $('.head_overlay').html('').css('{background:rgba(0,0,0,0)}');
        });
    };
    var originatorEv;
    $scope.openMenu = function($mdMenu, ev)     {
        originatorEv = ev;
        $mdMenu(ev);
    };
    var Wwindow = $(window),
        lastScrollTop = 0,
        headerElement = $('.show_up');
    function onScroll (e) {
        var top = Wwindow.scrollTop();
        if(lastScrollTop < 100){
            headerElement.slideUp();
            lastScrollTop = 0;
        }else if (lastScrollTop > top) {
            headerElement.slideDown();
        } else if (lastScrollTop < top) {
            headerElement.slideUp();
        }
        lastScrollTop = top;
    }
    Wwindow.on('scroll', onScroll);
    $scope.goToAbout = function() {
        $location.path('/about_us');
    };
    $scope.goToTerms = function() {
        $location.path('/terms_of_use');
    };

    $scope.setOverflow = function(){
      /*  $('.search-result.inside-menu-league').css('height','380px');*/
       $('.inside-menu-league').parent().css('overflow-y','auto');
     /*  setTimeout(function(){
           $('.search-result.inside-menu-league').css('height','100%');
       },1000);*/
    };
    /*$scope.setHeightMouseleave = function(){
        $('.search-result.inside-menu-league').css('height','380px');
    };
    $scope.setHeightForMenu = function(){
        $('.search-result.inside-menu-league').css('height','100%');
    };*/
   /* $scope.getHeight = function(){
        var elementWidth = $('#menu_container_1').find('.inside-menu-all').css('height');
        var parentElement =  $('._md.md-open-menu-container.md-whiteframe-z2.md-active.md-clickable');
        if(parentElement.has('.inside-menu-league')){
            parentElement.css('height',elementWidth);
            parentElement.css('overflow-y','auto');
        }
    };*/
   $scope.regExp= /\s+/g;
        $("#loader-container-home").fadeOut(4500);
        $scope.setSeasonId = function (id, choiceSeason) {
            $scope.seasonId.id = id;
            $rootScope.choiceSeason = choiceSeason;
            $scope.tableParams = headerService.getParams();
        };


}]);