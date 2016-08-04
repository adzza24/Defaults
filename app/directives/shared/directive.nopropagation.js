/* Copyright (c) 2016 Adam Anthony
 * @description  Directive to stop event propagation on the applied element
 */

(function () {
    angular.module('directives').directive('ngNoProp', function () {
        return {
            restrict: 'AEC',
            //templateUrl: function(elem, attr){
            //    return 'my-customer-' + attr.type + '.html'
            //},
            link: function (scope, element, attrs) {
                var init = function () {
                    element.on('click.noprop', function (e) {
                        e.stopPropagation();
                    });
                };
                init();
                element.data('ngNoProp.init', init);
                element.data('ngNoProp.destroy', function () {
                    element.off('click.noprop');
                });
            }
        };
    });
}());