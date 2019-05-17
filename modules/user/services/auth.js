app.service('AuthService', ['$http', '$q', function ($http, $q) {
    
    var endpoint = APIBASEURL;

    this.login = function (data) {
		//console.log('data',data);
        return $http.post(endpoint + '/api-token-auth/', data);
    };

}]);