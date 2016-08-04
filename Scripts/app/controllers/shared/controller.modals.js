(function (ng) {
    ng.module('controllers').controller('modalController', ['$scope', '$timeout', '$location', '$rootScope', 'modalFactory', function ($scope, $timeout, $location, $rootScope, modalFactory) {

        //private
        var modalChange = modalFactory.addHook(function (modal) {
                $scope.current = modal.current;
                $scope.modal.open = modal.open;
            });
        var initialise = function () {
            var q = $location.search().modal;
            if (q) {
                $scope.open(q);
            }
        };
        $rootScope.body = ng.element('header, main, footer');

        //public
        $scope.modal = {
            open: modalFactory.modal.open
        };
        $scope.open = function (modal) {
            modalFactory.open(modal);
        };
        $scope.close = function () {
            modalFactory.close();
        };

        initialise();
    }]);
}(angular));
