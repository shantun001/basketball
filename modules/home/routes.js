app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: baseUrl('/modules/home/views/home.html')
    });

    
});