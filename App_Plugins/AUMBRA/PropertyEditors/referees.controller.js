(function (ng) {
    angular.module("umbraco").controller("AUMBRA.RefereesController", ['$scope', 'dialogService', '$log', 'iconHelper', 'entityResource', 'contentResource', '$routeParams', 'editorState', "AUMBRA.Services.utilService", function ($scope, dialogService, $log, iconHelper, entityResource, contentResource, $routeParams, editorState, utilService) {

        var config = {
            entityType: "Document",
            type: "content",
            treeAlias: "content",
            startNodeId: -1,
            startNode: {
                query: "",
                type: "content",
                id: -1
            }
        };
        $scope.loading = true;
        $scope.referees = [];

        angular.extend(config, $scope.model.config);

        utilService.getContentPages().then(function (pages) {
            _.each(pages, function (page) {
                var grid = utilService.findGrid(page);
                _.each(grid, function (control) {
                    if (control.value == editorState.current.id) {
                        $scope.referees.push(page);
                    }
                });
            });
            $scope.loading = false;
        });

        var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {
            var value = "";
            var joiner = "";
            _.each($scope.referees, function (ref) {
                value += joiner + ref.id;
                joiner = ",";
            });

            $scope.model.value = value;
        });

        $scope.$on('$destroy', function () {
            unsubscribe();
        });

    }]);
}(angular));