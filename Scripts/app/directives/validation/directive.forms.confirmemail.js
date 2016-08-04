/* Copyright (c) 2016 Adam Anthony */
(function (ng) {
    ng.module('directives').directive('ngConfirmEmail', function () {

        var ngConfirmEmail = function ($scope, element, attrs, ctrl) {
            var self = this;

            this.formElem = ctrl[attrs['name']];
            this.email = ctrl.EmailAddress || ctrl.Email || ctrl.email || ctrl.emailaddress || ctrl.EmailAddressValue;
            this.formElem.$validators.confirmemail = function (email) {
                return self.formElem.$isEmpty(email) || email === self.email.$viewValue;
            };

            $scope.$watch(ctrl.$name + '.' + self.email.$name + '.$viewValue', function (value) {
                self.formElem.$validate("confirmemail", value);
            });
        };


        return {
            restrict: 'AEC',
            require: '^form',
            link: function ($scope, element, attrs, ctrl) {
                return new ngConfirmEmail($scope, element, attrs, ctrl)
            }
        };
    });
}(angular));