app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({ enabled: true, requireBase: false });
    $stateProvider.state('tools', {
        url: '/tools',
        controller: 'HeaderController',
        //template:'<h3>This is player template</h3>'
        templateUrl: baseUrl('/modules/tools/tools.html')
    });
});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({ enabled: true, requireBase: false });
    $stateProvider.state('about_us', {
        url: '/about_us',
        controller: 'HeaderController',
        //template:'<h3>This is player template</h3>'
        templateUrl: baseUrl('/modules/tools/aboutUs.html')
    });
});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({ enabled: true, requireBase: false });
    $stateProvider.state('terms_of_use', {
        url: '/terms_of_use',
        controller: 'HeaderController',
        //template:'<h3>This is player template</h3>'
        templateUrl: baseUrl('/modules/tools/termsOfUse.html')
    });
});

app.config(function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({ enabled: true, requireBase: false });
    $stateProvider.state('premium', {
        url: '/premium',
        controller: 'HeaderController',
        //template:'<h3>This is player template</h3>'
        templateUrl: baseUrl('/modules/tools/premiumTools.html')
    });
});