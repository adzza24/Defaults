/* Copyright (c) 2016 Adam Anthony
 * Licensed under The MIT License (MIT) - http://opensource.org/licenses/MIT
 * aaViewLoader - Directive that emits a scope event when the DOM of a partial view is loaded
 * @usage  aa-view-loader should be applied to an element inside the partial view's scope as an attribute.
 *         Handlers can then be bound in the parent scope using: $scope.$on("PartialLoaded", handler)
 * Version 1.0
 */

(function (ng, $) {
    "use strict";
    angular.module('directives').directive('aaViewLoader', [function (animService) {
        var ViewLoader = function ($scope, element, attrs) {
            this.elem = element;
            this.scope = $scope;
            this.config = ng.extend({}, this.defaults, attrs);
            this.init();
            return this; 
        };

        ViewLoader.prototype = ng.extend(ViewLoader.prototype, {
            init: function () {
                this.scope.$emit("PartialLoaded");
            }
        });

        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                return new ViewLoader($scope, element, attrs);
            }
        };
    }])
}(angular, jQuery || angular.element));