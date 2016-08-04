(function (ng) {
    angular.module("umbraco").controller("AUMBRA.MultiNodePicker", ['$scope', 'dialogService', 'contentResource', 'AUMBRA.Services.utilService', function ($scope, dialogService, contentResource, utilService) {
       
        //Private
        var config = angular.extend({
            multiPicker: false,
            entityType: "Document",
            type: "content",
            treeAlias: "content",
            startNodeId: 0,
        }, $scope.model.config);

        var init = function () {
            if (typeof $scope.model.value == "string" && $scope.model.value.length) {
                $scope.ids = $scope.model.value.split(',');
                if ($scope.ids.length) {
                    _.each($scope.ids, function (id) {
                        $scope.add({ id: id });
                    });
                }
            }
        };

        var populate = function (data) {
            if (angular.isArray(data)) {
                _.each(data, function (item, i) {
                    if ($scope.ids.indexOf(item.id) < 0) {
                        $scope.add(item);
                    }
                });
            }
            else {
                $scope.clear();
                if ($scope.ids.indexOf(data.id) < 0) {
                    $scope.add(data);
                }
            }
        };

        //public
        $scope.renderModel = [];
        $scope.ids = [];
        $scope.templates = [];
        $scope.openContentPicker = function () {
            var d = dialogService.treePicker({
                multiPicker: config.multiPicker,
                section: config.type,
                treeAlias: config.treeAlias,
                startNodeId: parseInt(config.startNodeId),
                callback: populate
            });
        };

        $scope.remove = function (index) {
            $scope.renderModel.splice(index, 1);
            $scope.ids.splice(index, 1);
        };

        $scope.clear = function () {
            $scope.renderModel = [];
            $scope.ids = [];
        };

        $scope.add = function (item) {
            contentResource.getById(item.id).then(function (page) {
                page = utilService.sortContentNode(page);
                page.imageUrl = ng.isObject(page.img) && page.img.src || "";
                $scope.ids.push(page.id);
                $scope.renderModel.push(page);
            });
        };

        //when the scope is destroyed we need to unsubscribe
        utilService.unsubscribe($scope, function () {
            $scope.model.value = utilService.trim($scope.ids.join(), ",");
        });

        init();
    }]);
}(angular));