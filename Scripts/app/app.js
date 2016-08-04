/* Copyright (c) 2016 Adam Anthony */
osd.app = angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ngCookies',
        'ng',
        'controllers',
        'services',
        'directives',
        'filters'
]);

osd.app.controller(osd.ngControllers);

osd.app.run(['$rootElement', function ($rootElement) {
    $rootElement.off('click');
}]);

osd.app.config(['$locationProvider', function ($locationProvider) {

    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode(true);
    }
    else {
        $locationProvider.html5Mode(false);
    }
}]);


