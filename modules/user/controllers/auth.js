app.controller('AuthController', function ($scope,$rootScope, UserService, AuthService, $timeout, LeaguesService) {
    $scope.authdata = {};
    $scope.userTypes = [];
    $scope.loginErrors = {};
    $scope.registerErrors = {};


    UserService.types().then(function(response) {
        // console.log('response', response);
        
        $scope.userTypes = response.data;
    }).catch(function(error) {

    });

//autologin

    var loginButton = document.getElementById('loginButton');
    var homeButton = document.querySelector('.homeLink');

    if(window.location.href.includes('www.s4upro.com/tools/demo_team')){
        $scope.authdata = {email:'team', password:'s4up2018'};
        var authData = $scope.authdata;
        setTimeout(function () {
            homeButton.click();
        }, 200);
        if(sessionStorage.user === undefined){
            setTimeout(function () {
                loginButton.click();
            }, 200);
        }

    }else if (window.location.href.includes('www.s4upro.com/tools/demo_player')) {
        $scope.authdata = {email: 'player', password: 's4up2018'};
        var authData = $scope.authdata;
        setTimeout(function () {
            homeButton.click();
        }, 200);
        if (sessionStorage.user === undefined) {
            setTimeout(function () {
                loginButton.click();
            }, 200);
        }
    }

// end autologin

//remember me

    $(function () {
        $('#checkBox').click(function () {
            if ($('#checkBox').is(':checked')) {
                var exp = new Date();
                exp.setSeconds(exp.getSeconds() + 60 * 60 * 48);
                document.cookie = 'name=remember; expires=' + exp.toUTCString();
            }else{
                document.cookie = 'name=remember; expires=' + new Date(0).toUTCString();
            }
        });
    });

    if(document.cookie.includes('name=remember')){
        $scope.authdata = {email:localStorage.userName, password:localStorage.password};
        var authData = $scope.authdata;
        // setTimeout(function () {
        //     homeButton.click();
        // });
        if(sessionStorage.user === undefined){
            setTimeout(function () {
                loginButton.click();
            });
        }
    }


//end remember me

    $scope.login = function() {
        var fingerprintOptions = {
            swfContainerId: true,
            swfPath: true,
            userDefinedFonts: true,
            excludeLanguage: true,
            excludeScreenResolution: true,
            excludeTimezoneOffset: true,
            excludeAddBehavior: true,
            excludeDoNotTrack: true,
            excludeAdBlock: true,
            excludeJsFonts: true,
            excludeFlashFonts: true,
            excludeIEPlugins: true,
            excludeAvailableScreenResolution: true,
            excludePixelRatio: true,
            excludeCanvas: true,
            excludeWebGL: true,
            excludeHasLiedResolution: true,
            excludeHardwareConcurrency: true,
            excludePlugins: true


            /*excludeAvailableScreenResolution: true,
            excludePixelRatio: true,
            excludeCanvas: true,
            excludeWebGL: true,
            excludeHasLiedResolution: true,
            excludeHardwareConcurrency: true,
            excludePlugins: true*/
            
    
        };
       var authData = $scope.authdata;
        localStorage.userName = $scope.authdata.email;
        localStorage.password = $scope.authdata.password;
        
        $scope.loginErrors = {};
        // console.log(localStorage.userName,localStorage.password );
        new Fingerprint2(fingerprintOptions).get(function(result) {
            authData.device_id = result;
            console.log('qqq',authData.device_id);
            localStorage.deviceID = result;
        });
        LeaguesService.getIp().then(function (response) {
            authData.ip = response.ip;
        }).then(function () {
            LeaguesService.getCountry(authData.ip).then(function (data) {
                authData.country = data.country_name;
            }).then(function () {
                AuthService.login(authData).then(function(response) {
                    if(response.status == 200) {
                        console.log('logged in');
                        $scope.authdata = {};
                        authData = {};
                        sessionStorage.user = JSON.stringify(response.data);
                        sessionStorage.token = response.data.token;
                        sessionStorage.publicUserName = response.data.user.email;
                        window.location.reload();
                    }

                }).catch(function(errors) {
                    $scope.loginErrors = errors.data;
                    console.log('errors, ',errors);
                });
            });
        });
    };

            function checkAccess() {
                console.log('in function');
                var userData = JSON.parse(sessionStorage.user);
                console.log(userData);
                $scope.accessVideoEditor = false;
                $scope.accessLeague = false;
                $scope.accessTeam = false;
                $scope.accessPlayer = false;
                if(userData.user.is_admin == true){
                    $scope.accessVideoEditor = true;
                    $scope.accessLeague = true;
                    $scope.accessTeam = true;
                    $scope.accessPlayer = true;
                } else {
                    for(var i = 0; i < userData.user.subsciptions; i++) {
                        if(notExpired(userData.user.subsciptions[i].end_date)) {
                            if(userData.user.subsciptions[i].package_name == 'Advanced Video Editor') {
                                $scope.accessVideoEditor = true;
                            } else if(userData.user.subsciptions[i].package_name == 'Gold') {
                                $scope.accessLeague = true;
                                $scope.accessTeam = true;
                                $scope.accessPlayer = true;
                            } else if(userData.user.subsciptions[i].package_name == 'League') {
                                $scope.accessLeague = true;
                            } else if(userData.user.subsciptions[i].package_name == 'Team') {
                                $scope.accessTeam = true;
                            } else if(userData.user.subsciptions[i].package_name == 'Player') {
                                $scope.accessPlayer = true;
                            }
                        }
                    }
                }
                console.log('Video: ',$scope.accessVideoEditor);
                console.log('League: ',$scope.accessLeague);
                console.log('Team: ',$scope.accessTeam);
                console.log('Player: ',$scope.accessPlayer);
            }
            function notExpired(date) {
                if(new Date(date) >= Date.now()) {
                    return true;
                } else return false;

            }

            //window.location.href = _BASEURL+'/?token='+JSON.parse(sessionStorage.user).token;

    $scope.create = function() {
        
        $scope.registerErrors = {};
        
        UserService.create($scope.user).then(function(response ,arg, arg2) {
            if(response.status == '201') {
                alert("Your account have been successfully crated. You will receive an email ones we activate it");
                $scope.updateSuccess = true;
                $timeout(function () {
                    $('#register-modal').fadeOut();
                },2000);
                $scope.user = {};
            } else if(response.status == '400'){
                alert("This password is too short. It must contain at least 8 characters.This password is entirely numeric.");
            }
            else {
                //$scope.updateError = true;
                alert('Error! ' + response.data.email.join());


            }
        }).catch(function(errors) {
            $scope.registerErrors = errors.data;
        });
    };

    $('#update-modal').on('hide.bs.modal', function () {
        $scope.updateError = false;
        $scope.updateSuccess = false;
    });
    $('#register-modal').on('hide.bs.modal', function () {
        $scope.updateError = false;
        $scope.updateSuccess = false;
    });

    $scope.updateError = false;
    $scope.updateSuccess = false;
    $scope.update = function() {
        $scope.updateError = false;
        $scope.updateSuccess = false;
        $scope.registerErrors = {};
        $scope.sendData = {
            email: $scope.user.email
        };
        if($scope.user.hasOwnProperty('password') && $scope.user.password != '') {
            $scope.sendData.password = $scope.user.password;
        }
        if($scope.user.first_name != '') {
            $scope.sendData.first_name = $scope.user.first_name;
        }
        if($scope.user.last_name != '') {
            $scope.sendData.last_name = $scope.user.last_name;
        }
        if($scope.user.hasOwnProperty('user_type')) {
            $scope.sendData.user_type = $scope.user.user_type;
        }
        if($scope.user.phone != '') {
            $scope.sendData.phone = $scope.user.phone;
        }
        if($scope.user.skype != '') {
            $scope.sendData.skype = $scope.user.skype;
        }
        if($scope.user.team != '') {
            $scope.sendData.team = $scope.user.team;
        }

        console.log('send obj', $scope.sendData);
       UserService.updateMe($scope.sendData).then(function(response) {
            console.log('response', response);
            if(response.status + ' ' + response.statusText == '200 OK') {
                $scope.updateSuccess = true;
                $timeout(function () {
                    $('#update-modal').fadeOut();
                },2000);
                for(var key in response.data) {
                    $scope.user[key] = response.data[key];
                }
                delete $scope.user.password;
                delete $scope.user.user_type;
            } else {
                $scope.updateError = true;
            }
        });
    };
});