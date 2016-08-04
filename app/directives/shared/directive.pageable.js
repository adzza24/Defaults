/* Copyright (c) 2016 Adam Anthony
 * @description  Simple wrapper directive for /scripts/lib/osd.pagemenu.js
 */
(function () {
    angular.module('directives').directive('aaPageable', function () {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                element.pagemenu({
                    scrollevent: 'scroll_throttle'
                });
            }
        };
    });
}());