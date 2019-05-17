app.service('UserService', ['$http', '$q', function ($http, $q) {

    var endpoint = APIBASEURL + '/users/';

    function onResponse(response) {
        return response;
    }
    function onError(response) {
        return response;
    }

    this.me = function () {
        return $http.get(endpoint + 'me/');
    };
    
    this.create = function (data) {
        return $http.post(endpoint, data).then(onResponse, onError);
    };
    
    this.update = function (id, data) {
        return $http.put(endpoint +  id, data);
    };
    
    this.updateMe = function (data) {
        return $http({
            method: 'PUT',
            url: endpoint + 'me/',
            headers: {'Content-Type': 'application/json', 'Authorization':'JWT ' + JSON.parse(sessionStorage.user).token},
            data: data
        }).then(onResponse, onError);
        // return $http.put(, data);
    };
    
    this.types = function() {
        return $http.get(endpoint + 'user_types/');
    }
    
}]);