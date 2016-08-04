/* Copyright (c) 2016 Adam Anthony
* @description  Directive to make any element become an anchor tag and cause a page to load a new url
 */
(function (ng) {
    ng.module('directives').directive('dataHref', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs, ctrl) {
                element.on('click', function (e) {
                    var target = ng.element(e.target);
                    var href = target.data("href");
                    if (href) {
                        window.location.href = href;
                    }
                });

            }
        };
    }]);
}(angular));