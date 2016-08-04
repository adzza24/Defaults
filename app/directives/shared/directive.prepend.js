/* Copyright (c) 2016 Adam Anthony
 * Licensed under The MIT License (MIT) - http://opensource.org/licenses/MIT
 * ngPrepend - Directive to prepend an element with a dynamic HTML binding
 * Version 1.0
 */
(function (ng) {
    angular.module('directives').directive('ngPrepend', ['$timeout', function ($timeout) {

        var ngPrepend = function ($scope, element, attrs) {
            this.element = element;
            this.attrs = attrs;
            this.scope = $scope;
            this.template = $scope.$eval(this.attrs['bindHtml']);
            this.holder = ng.element("<div />");
            var self = this;
            $timeout(function () {
                self.init();
            }, 10);
            return this;
        };

        ngPrepend.prototype = ng.extend(ngPrepend.prototype, {
            init: function () {
                var self = this;
                this.holder.append(this.template);
                this.holder.find('p').last().append(this.element.clone());
                this.element.after(this.holder);
                this.element.remove();
            }
        });

        var link = function ($scope, element, attrs) {
            return new ngPrepend($scope, element, attrs);
        }

        return ({
            restrict: 'AEC',
            link: link
        });
    }])
}(angular));