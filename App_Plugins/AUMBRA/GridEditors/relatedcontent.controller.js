(function (ng) {
    angular.module("umbraco").controller('AUMBRA.GridEditors.RelatedContent', ['$scope', 'dialogService', 'entityResource', 'iconHelper', 'contentResource', 'AUMBRA.Services.utilService', function ($scope, dialogService, entityResource, iconHelper, contentResource, utilService) {
        //idList = [];
        //$scope.renderModel = [{}, {}, {}];
        
        var config = {
            multiPicker: false,
            entityType: "Document",
            type: "content",
            treeAlias: "content",
            startNodeId: false,
            filter: "",
            filterCssClass: "not-allowed not-published",
            startNode: {
                query: "",
                type: "content",
                id: -1
            }
        };
        function init() {
            angular.extend(config, $scope.control.editor.config);
            clear();

            utilService.searchForNode(config.startNode.query, config.startNode.id).then(function (id) {
                config.startNodeId = id;
            });

            if (typeof $scope.control.value == "string") {
                var ids = $scope.control.value.split(',');
                _.each(ids, function (id, i) {
                    if (i < 3) {
                        idList[i] = parseInt(id);
                        buildItem(i);
                        $scope.$watch('renderModel[' + i + ']', function (newVal) {
                            _.each($scope.renderModel, function (v, i) {
                                idList[i] = v.id || 0;
                            });
                        });
                    }
                });
            }
        }

        $scope.openContentPicker = function ($index) {

            var d = dialogService.treePicker({
                section: config.type,
                treeAlias: config.treeAlias,
                multiPicker: config.multiPicker,
                filter: config.filter,
                filterCssClass: config.filterCssClass,
                callback: function (data) {
                    if (ng.isArray(data)) {
                        _.each(data, function (item, i) {
                            $scope.add(item, $index);
                        });
                    } else {
                        $scope.add(data, $index);
                    }
                },
                startNodeId: config.startNodeId
            });
        };

        $scope.remove = function ($index) {
            $scope.renderModel[$index] = {};
            idList[$index] = 0;
        };

        var clear = function () {
            $scope.renderModel = [{}, {}, {}];
            idList = [0, 0, 0];
        };

        $scope.add = function (item, $index) {
            if (idList.indexOf(item.id) < 0) {
                if (ng.isNumber($index)) {
                    idList[$index] = item.id;
                }
                else {
                    idList.push(item.id);
                }
                buildItem($index);
            }
            else {
                alert("You have already added this item!")
            }
        };


        //when the scope is destroyed we need to unsubscribe
        $scope.$on('$destroy', function () {
            unsubscribe();
        });

        var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {
            $scope.control.value = utilService.trim(idList.slice(0, 3).join(), ",");
        });

        var buildItem = function ($index) {
            //copy the idList to avoid changing the array
            var ids = idList.slice(0);
            if (ng.isNumber($index)) {
                ids = ids.splice($index, 1)
            }
            if (ids.length) {
                contentResource.getByIds(ids).then(function (data) {
                    _.each(data, function (item) {
                        item = utilService.sortContentNode(item);
                        if (ng.isNumber($index)) {
                            $scope.renderModel[$index] = item;
                        }
                        else {
                            $scope.renderModel.push(item);
                            //make sure the array is only 3 long. take the last 3 as these were added most recently
                            $scope.renderModel.splice($scope.renderModel.length - 3);
                        }
                    });
                    //console.log($scope.renderModel)
                });
            }
        }

        init();
    }]);
}(angular));