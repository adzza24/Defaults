/* Copyright (c) 2016 Adam Anthony
 * @description  Directive to integrate able.droppable.js into an Angular application. Handles load and validation.
 */
(function (ng) {
    angular.module('directives').directive('aaDrop', function () {
        return {
            restrict: 'AEC',
            require: '^form',
            link: function ($scope, element, attrs, ctrl) {

                element.droppable();

                var Drop = element.data('droppable');
                var dropwrap = Drop.dropwrap;
                var formElem = ctrl[attrs['name']];

                var _isEmpty = formElem.$isEmpty;
                formElem.$isEmpty = function (value) {
                    return _isEmpty(value) || value === 0 || value !== value;
                };


                typeof(ctrl) == "object" && $scope.$watch(ctrl.$name + '.' + attrs['name'] + '.$valid',
                        function (validity) {
                            if (validity) {
                                dropwrap.addClass("ng-valid");
                                dropwrap.removeClass("ng-invalid");
                            }
                            else {
                                dropwrap.addClass("ng-invalid");
                                dropwrap.removeClass("ng-valid");
                            }
                        });
                typeof (ctrl) == "object" && $scope.$watch(ctrl.$name + '.' + attrs['name'] + '.$touched',
                        function (validity) {
                            if (validity) {
                                dropwrap.addClass("ng-touched");
                                dropwrap.removeClass("ng-untouched");
                            }
                            else {
                                dropwrap.addClass("ng-untouched");
                                dropwrap.removeClass("ng-touched");
                            }
                        });
            }
        };
    });
}(angular));