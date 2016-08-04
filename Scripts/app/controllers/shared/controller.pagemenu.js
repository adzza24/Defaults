/* Copyright (c) 2016 Adam Anthony */
(function (ng) {
    ng.module('controllers').controller('pagemenuController', ['$scope', '$timeout', '$rootScope', 'locationService', function ($scope, $timeout, $rootScope, locationService) {

        var startUrl;
        var activeClass = "active";

        //update-view event is triggered by scripts/osd/osd.pagemenu.js when page link is clicked
        ng.element(document).on("update-view", function (e) {
            locationService.set(osd.currentPage, $scope);
        });

        //use start URL if nothing in the url.search
        if (!locationService.get()) {
            var url = ng.element('[data-plugin="pagemenu"]').data("starting-url");
            if (url && url.indexOf("http") === 0) {
                url = url.replace(/^https?:\/\//, '');
                url = url.substring(url.indexOf('/'));
            }
            locationService.set(url, $scope);
        }

        $rootScope.$on('$locationChangeSuccess', function () {
            locationService.set(false, $scope);
        });

    }]);
}(angular));