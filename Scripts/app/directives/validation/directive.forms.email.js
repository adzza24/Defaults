(function (ng) {
    ng.module('directives').directive('ngValEmail', ['validationService', function (validationService) {

        var ngValEmail = function ($scope, element, attrs, ctrl) {
            var self = this;

            this.formElem = ctrl[attrs['name']];
            this.formElem.$validators.email = function (email) {
                return self.formElem.$isEmpty(email) || validationService.checkEmail(email);
            };
        };


        return {
            restrict: 'AEC',
            require: '^form',
            link: function ($scope, element, attrs, ctrl) {
                return new ngValEmail($scope, element, attrs, ctrl)
            }
        };
    }]);
}(angular));