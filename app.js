/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies",
    "fcsa-number"
]);

MetronicApp.constant('DREAM_FACTORY_URL', 'https://sgproject001.bit-clicks.com:443');

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:readyddd
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.

 To migrate, register your controllers with modules rather than exposing them
 as globals:

 Before:

 ```javascript
 function MyController() {
  // ...
}
 ```

 After:

 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

 Although it's not recommended, you can re-enable the old behavior like this:

 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
 **/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url

    $stateProvider

        // Dashboard
        .state('home.dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports'},
            controller: "DashboardController",
            /*resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './assets/global/plugins/morris/morris.css',
                            './assets/admin/pages/css/tasks.css',

                            './assets/global/plugins/morris/morris.min.js',
                            './assets/global/plugins/morris/raphael-min.js',
                            './assets/global/plugins/jquery.sparkline.min.js',

                            './assets/admin/pages/scripts/index3.js',
                            './assets/admin/pages/scripts/tasks.js',

                            'js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }*/
        })

        .state('home.currency', {
            url: "/currency",
            templateUrl: "./views/currency/currency.html",
            data: {pageTitle: 'Mata Uang', pageSubTitle: 'Tambah/Rubah mata uang terbaru'},
            controller: "CurrencyController",

        })

        .state('home.rate', {
            url: "/rate",
            templateUrl: "./views/rate/rate.html",
            data: {pageTitle: 'Kurs', pageSubTitle: 'Rubah kurs terbaru'},
            controller: "rateController",

        })
        .state('home.pecahan', {
            url: "/pecahan",
            templateUrl: "./views/pecahan/pecahan.html",
            data: {pageTitle: 'Pecahan', pageSubTitle: 'uang asing'},
            controller: "pecahanController",

        })
        .state('home.akun', {
            url: "/akun",
            templateUrl: "./views/akun/akun.html",
            data: {pageTitle: 'Akun', pageSubTitle: 'chart of account'},
            controller: "akunController",

        })
        .state('home.transaksi', {
            url: "/transaksi",
            templateUrl: "./views/transaksi/transaksi.html",
            data: {pageTitle: 'Transaksi', pageSubTitle: 'Jual / Beli Uang Asing'},
            controller: "transaksiController",
            controllerAs: 'vm'

        })
        .state('test', {
            url: "/test",
            templateUrl: "./views/test/test.html",
            controller: "testController",

        })
        .state('ptransaksi', {
            url: "/ptransaksi",
            templateUrl: "./views/ptransaksi/ptransaksi.html",
            controller: "ptransaksiController",

        })
        .state("login",{
            url: "/login",
            templateUrl:"views/login/login.html",
            css: 'assets/admin/pages/css/login.css',
            controller: "LoginController",
            controllerAs: 'vm'
        })

        .state("#tab_1_2",{
            url: "/#tab_1_2"
        })

        .state("home",{
            url: "/home",
            controller: 'HomeController',
            templateUrl: 'views/home/home.html',
            controllerAs: 'vm'
        })

    $urlRouterProvider.otherwise("/home/dashboard");
    //console.log ($stateProvider.state);
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "$location","$cookieStore","$http","$stateParams",
    function($rootScope, settings, $state, $location,$cookieStore,$http,$stateParams) {
    $rootScope.$state = $state; // state to be accessed from view

    $rootScope.$stateParams = $stateParams;

    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line

    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    });

}]);