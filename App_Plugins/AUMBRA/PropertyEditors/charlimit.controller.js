angular.module("umbraco").controller("AUMBRA.CharLimitController", function ($scope, dialogService) {

    $scope.limitChars = function () {
        var limit = $scope.model.config.limit;
        $scope.model.info = "You have " + (limit - $scope.model.value.length) + " character remaining";
        if ($scope.model.value.length >= limit) {
            $scope.model.value = $scope.model.value.substr(0, limit);
            $scope.model.info = "You have used the maximum number of characters allowed";
        }
    };

});