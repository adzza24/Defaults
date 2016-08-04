angular.module("umbraco").controller("AUMBRA.GridEditors.Quote", function ($scope, $timeout) {
    var config = {
        rte: {
            stylesheets: ["rte"],
            dimensions: {
                height: 50
            },
            entity_encoding: "named",
            toolbar: [
                "bold",
                "link",
                "subscript",
                "superscript"
            ]
        },
    };
    $scope.config = angular.extend($scope.control.editor.config, config);

    if (!angular.isString($scope.control.value)) {
        $scope.control.value = "";
    }

    var unsubscribe = $scope.$on("formSubmitting", function () {
    });

    $scope.$on('$destroy', function () {
        unsubscribe();
    });

    
    function init() {
        
    }

    init();
});