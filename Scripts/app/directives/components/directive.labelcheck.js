/* Copyright (c) 2016 Adam Anthony
 * Licensed under The MIT License (MIT) - http://opensource.org/licenses/MIT
 * checkBox - Directive to make custom check boxes
 * Version 1.01 - included keydown event handler for spacebar and enter keys
 */
(function (ng) {
    angular.module('directives').directive('checkBox', function () {

        var CheckBox = function ($scope, element, attrs, ctrl) {
            this.element = element;
            this.attrs = attrs;
            this.ctrl = ctrl[0];
            this.ngModel = ctrl[1];
            this.scope = $scope;
            this.template = angular.element('<label for="' + this.attrs['id'] + '" class="label_' + this.attrs['type'] + '"><span></span>' + this.attrs['namedValue'] + '</label>');
            this.init();
            return this;
        };

        CheckBox.prototype = {

            init: function () {
                this.element.next("span").remove();
                this.element.after(this.template);
                this.element.remove();
                this.template.prepend(this.element);

                this.StartupFunctions();
                var self = this;
                if (self.ctrl.$name.length > 0) {
                    this.scope.$watch(self.ctrl.$name + '["' + self.attrs['name'] + '"].$valid',
                        function (validity) {
                            if (validity) {
                                self.template.addClass("ng-valid");
                                self.template.removeClass("ng-invalid");
                            }
                            else {
                                self.template.addClass("ng-invalid");
                                self.template.removeClass("ng-valid");
                            }
                        });
                    this.scope.$watch(self.ctrl.$name + '["' + self.attrs['name'] + '"].$touched',
                        function (touched) {
                            if (touched) {
                                self.template.addClass("ng-touched");
                                self.template.removeClass("ng-untouched");
                            }
                            else {
                                self.template.addClass("ng-untouched");
                                self.template.removeClass("ng-touched");
                            }
                        });
                }
                //else { throw new Error("The Form element requires a name value."); }
            },

            StartupFunctions: function () {
                var self = this;
                this.template.unbind('click');
                this.template.on('click', function (e) {
                    e.preventDefault();
                    self.labelClick();
                });
                this.template.on('keydown', function (e) {
                    if (e.which === 13 || e.which === 32) {
                        //if spacebar || enter key pressed
                        e.preventDefault();
                        self.labelClick();
                    }
                });
                this.setupLabel();
                this.template.addClass(this.attrs['type']);
                this.element.on('change', function () {
                    self.setupLabel();
                });
            },

            labelClick: function () {
                var self = this;

                var checked = this.element.is(':checkbox') ? this.setChecks() : this.setRadios();

                this.element.prop('checked', checked);
                this.ngModel.$setViewValue(checked);

                this.element.change();

                setTimeout(function () {
                    self.scope.$digest();
                }, 10);
            },

            setRadios: function () {
                this.group.prop('checked', false);
                return true;
            },

            setChecks: function () {
                if (this.element.prop('checked')) {
                    return false;
                }
                return true;
            },

            setupLabel: function () {
                var checks = [];
                var group = angular.element('input[name="' + this.attrs['name'] + '"]');
                group.length || (group = this.element);
                angular.forEach(group, function (v, k) {
                    v = angular.element(v);
                    var label = v.closest('label')
                    label.removeClass('c_on');
                    if (v.is(':checked')) { checks.push(label); }
                });
                this.group = group;

                checks.length && angular.forEach(checks, function (v, k) {
                    v = angular.element(v).addClass('c_on');
                });
            }
        };

        return ({
            restrict: 'AEC',
            require: ['^form', 'ngModel'],
            transclude: true,
            replace: true,
            link: function ($scope, element, attrs, ctrl) {
                return new CheckBox($scope, element, attrs, ctrl);
            }
        });
    })
}(angular));