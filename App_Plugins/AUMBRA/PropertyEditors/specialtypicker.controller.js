(function (ng) {
    ng.module("umbraco").controller("AUMBRA.SpecialtyPickerController", ["$scope", "entityResource", "contentResource", "$routeParams", "AUMBRA.Services.utilService", function ($scope, entityResource, contentResource, $routeParams, utilService) {

        var config = {
            entityType: "Document",
            type: "content",
            treeAlias: "content",
            startNodeId: -1,
            startNode: {
                query: "$site/SiloGroup",
                type: "content",
                id: -1
            }
        };

        $scope.model.specialties = [];

        ng.extend(config, $scope.model.config);

        config.multiPicker = parseInt(config.multiPicker);

        if (config.multiPicker) {
            $scope.model.value = ng.isArray($scope.model.value) ? $scope.model.value : [];
        }

        if (config.startNode.query) {
            var rootId = $routeParams.id;
            entityResource.getByQuery(config.startNode.query, rootId, "Document").then(function (ent) {
                config.startNodeId = ent.id;
                callback();
            });
        } else {
            config.startNodeId = config.startNode.id;
        }
        function callback() {
            contentResource.getChildren(config.startNodeId).then(function (data) {
                _.each(data.items, function (item, i) {
                    var sp;
                    var page;
                    if (ng.isArray($scope.model.value)) {
                        page = $.grep($scope.model.value, function (v, i) {
                            return v.id === item.id;
                        })[0];
                    }
                    else if (ng.isObject($scope.model.value)) {
                        if ($scope.model.value.id == item.id) page = $scope.model.value;
                    }

                    if (!page) {
                        page = utilService.exposeProps(item)[0];
                        page.chosen = false;
                        page.title = page.name;
                    }
                    if (page.specialtyColor) {
                        sp = page.specialtyColor;
                        sp.title = page.title;
                        sp.id = page.id;
                        sp.chosen = page.chosen;
                    }
                    else {
                        sp = page;
                    }
                    $scope.model.specialties.push(sp);
                });
            });
        };

        $scope.select = function (specialty) {
            specialty.chosen = !specialty.chosen;
            if (!config.multiPicker) {
                if (specialty.chosen) {
                    _.each($scope.model.specialties, function (sp) {
                        if (sp != specialty) {
                            sp.chosen = false;
                        }
                    });
                    $scope.model.value = specialty;
                }
                else {
                    $scope.model.value = {};
                }
            }
            else {
                if (specialty.chosen) {
                    $scope.model.value.push(specialty);
                }
                else {
                    $scope.model.value = $.grep($scope.model.value, function (v, i) {
                        return v.id !== specialty.id;
                    });
                }
            }
        }



    }]);
}(angular));