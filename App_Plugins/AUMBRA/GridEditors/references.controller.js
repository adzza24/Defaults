(function (ng) {
    angular.module("umbraco").controller("AUMBRA.GridEditors.ReferencesController", function ($scope, dialogService, entityResource, $log, iconHelper, entityResource, contentResource, $routeParams, editorState) {

        $scope.config = {
            maxNumber: $scope.control.editor.config.maxNumber || 0,
            columnNumber: $scope.control.editor.config.columnNumber || 1,
            rte: {
                stylesheets: ["rte"],
                dimensions: {
                    height: 50
                },
                entity_encoding: "named",
                toolbar: [
                    "bold",
                    "italic",
                    "link",
                    "subscript",
                    "superscript"
                ]
            },
            id: 0,
            name: ""
        };

        //$scope.config = ng.extend($scope.config, $scope.control.editor.config);

        $scope.addNewReference = function () {
            $scope.references.push(engine.getNewReference());
        };

        $scope.deleteReference = function (index) {
            $scope.references.splice(index, 1);
        };

        var engine = {
            getNewReference: function (i) {
                $scope.config.id++;
                return {
                    text: "",
                    symbol: "",
                    id: $scope.control.$uniqueId + "-" + $scope.config.id
                };
            },
            checkReference: function (ref) {
                var valid = true;
                if (ref.symbol === "" && ref.text === "") {
                    valid = false;
                }
                return valid;
            },
            removeEmpties: function () {
                var targetRows = [];
                angular.forEach($scope.references, function (ref, i) {
                    var valid = engine.checkReference(ref);
                    if (valid) {
                        targetRows.push(ref);
                    }
                });
                if (targetRows.length == 0) {
                    targetRows.push(engine.getNewReference());
                }
                $scope.references = targetRows;
            },
            unsubscribe: $scope.$on("formSubmitting", function (ev, args) {
                engine.removeEmpties();
                $scope.control.title = $scope.config.name;
                $scope.control.value = $scope.references;
                $scope.control.id = $scope.control.$uniqueId;
            }),
        };

        //when the scope is destroyed we need to unsubscribe
        $scope.$on('$destroy', function () {
            engine.unsubscribe();
        });

        $scope.references = angular.isArray($scope.control.value) && $scope.control.value.length > 0 ? $scope.control.value : [engine.getNewReference()];

        angular.forEach($scope.references, function (ref, i) {
            $scope.config.id++;
            ref.id = $scope.control.$uniqueId + "-" + $scope.config.id
        });
    });
}(angular));