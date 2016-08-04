/* Copyright (c) 2016 Adam Anthony
 * Licensed under The MIT License (MIT) - http://opensource.org/licenses/MIT
 * ngSizer - Directive to integrate jQuery sizer plugin, so that adjacent elements can have equal heights
 * Version 1.0
 */
(function (ng) {
    ng.module('directives').directive('aaSizer', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {

                if (ng.isDefined(attrs["target"]) && attrs["target"] !== "") {
                    $timeout(function () {
                        element.sizer();
                    }, 100);
                }
                else if (attrs.aaSizer) {
                    element.data('target', attrs.aaSizer);
                    $timeout(function () {
                        element.sizer();
                    }, 100);
                }

            }
        };
    });
}(angular));