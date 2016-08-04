/* Copyright (c) 2016 Adam Anthony */
(function (ng) {
    ng.module('directives').directive('ngConfirmPassword', function () {

        var ngConfirmPassword = function ($scope, element, attrs, ctrl) {
            var self = this;

            this.formElem = ctrl[attrs['name']];
            this.password = ctrl.Password || ctrl.PasswordValue || ctrl.password || ctrl.NewPassword;
            this.formElem.$validators.confirmpassword = function (password) {
                return self.formElem.$isEmpty(password) || password === self.password.$viewValue;
            };

            $scope.$watch(ctrl.$name + '.' + self.password.$name + '.$viewValue', function (value) {
                self.formElem.$validate("confirmpassword", value);
            });
        };


        return {
            restrict: 'AEC',
            require: '^form',
            link: function ($scope, element, attrs, ctrl) {
                return new ngConfirmPassword($scope, element, attrs, ctrl)
            }
        };
    });
}(angular));