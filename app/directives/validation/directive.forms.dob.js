(function (ng) {
    ng.module('directives').directive('ngValDob', ['validationService', function (validationService) {

        var ngValDob = function ($scope, element, attrs, ctrl) {
            var self = this;
            this.formElem = ctrl[attrs['name']];
            this.formElem.$validators.dob = function (date) {
                return self.formElem.$isEmpty(date) || validationService.checkDob(date);
            };
        };


        return {
            restrict: 'AEC',
            require: '^form',
            link: function ($scope, element, attrs, ctrl) {
                return new ngValDob($scope, element, attrs, ctrl)
            }
        };
    }]);
}(angular));