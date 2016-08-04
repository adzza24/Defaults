(function (ng) {
    ng.module('directives').directive('ngValPassword', ['validationService', function (validationService) {

        var ngValPassword = function ($scope, element, attrs, ctrl) {
            var self = this;

            this.formElem = ctrl[attrs['name']];
            this.formElem.$validators.password = function (password) {
                return self.formElem.$isEmpty(password) || validationService.checkPassword(password);
            };
        };


        return {
            restrict: 'AEC',
            require: '^form',
            link: function ($scope, element, attrs, ctrl) {
                return new ngValPassword($scope, element, attrs, ctrl)
            }
        };
    }]);
}(angular));