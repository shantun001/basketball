app.controller('PlayerSearchController', ['$scope', '$rootScope', 'PlayerSearchService', '$location',
                function ($scope, $rootScope, PlayerSearchService, $location) {

    $scope.searchString = '';
    $scope.width = 320;
    $scope.height = 180;
    $scope.searching = false;
    $scope.data = null;


    $scope.choosePlayer = function(e){
        if(e.key !== "Enter") return;
        else if($scope.data.length === 1){
            $scope.foundPlayerId($scope.data[0]);
            $('#player-search-container').trigger('blur');
            $location.path('player' + '/' + $scope.data[0].id + '/' + $scope.data[0].last_name +'_' + $scope.data[0].first_name);
            $scope.lostFocus();
            document.getElementById('menu_container_3').style.display='none';
        }
    };

    $scope.foundPlayerId = function(obj){
            $rootScope.playerProfile = null;
            $rootScope.playerProfile = obj;

    };

    $scope.lostFocus = function(){
        $scope.searchString ='';
        $scope.data = null;
        $scope.height = 180;
        $scope.width = 320;
        $scope.searching = false;
    };


    $scope.getPlayers = function() {
        PlayerSearchService.getPlayers($scope.searchString)
            .then(function(data){
                $scope.data = null;
                if(!data.length){
                    data.push({first_name: 'No match found'});
                }
                $scope.data = data;
                $scope.width = 767;
                $scope.searching = true;
        });
    };
    $scope.getAge = function(birthdate){
        if(!birthdate) return '';
       return new Date().getFullYear() - new Date(birthdate).getFullYear() + ' y.o.';
    };
}]);

