(function (ng) {
    angular.module("umbraco").controller("AUMBRA.GridEditors.ModulePicker", ['$scope', '$rootScope', 'dialogService', 'contentResource', 'AUMBRA.Services.utilService', '$routeParams', 'contentEditingHelper', function ($scope, $rootScope, dialogService, contentResource, utilService, $routeParams, contentEditingHelper) {

        //Private
        var config = angular.extend({
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
        }, $scope.control.editor.config);

        var init = function () {
            utilService.searchForNode(config.startNode.query, config.startNode.id).then(function (id) {
                config.startNodeId = id;
            });
            if (typeof $scope.control.value == "string" && $scope.control.value.length) {
                var ids = $scope.control.value.split(',');
                if (ids.length) {
                    populate(ids);
                }
            }
            iframeCtrl();
        };

        var iframeCtrl = function () {
            //listen for iframe resize events
            if (window.addEventListener) {
                window.addEventListener('message', ctrl, false);
            } else if (window.attachEvent) {
                window.attachEvent('onmessage', ctrl);
            }
            else {
                window.onmessage = ctrl;
            }

            function ctrl(e) {
                try {
                    var data = e.data.split(",");
                    var h = parseInt(data[0]);
                    if (data[1] == $scope.control.$uniqueId && $scope.ids.indexOf(data[2]) > -1) {
                        var iframe = $('iframe#' + $scope.control.$uniqueId); //  + data[2]
                        //console.log(h)
                        if (h > 0) {
                            iframe.height(h);
                        }
                        //ctrl = function () { };
                    }
                }
                catch (e) {
                    console.warn(e)
                }
            };
        };

        var populate = function (data) {
            data = ng.isArray(data) ? data : [data];
            _.each(data, function (item) {
                var id = ng.isObject(item) ? item.id : item;

                if ($scope.ids.indexOf(id) < 0) {
                    $scope.ids.push(id.toString());
                    $scope.add(id);
                }
            });
        };

        var updateContent = function (origContent, savedContent) {
            contentEditingHelper.reBindChangedProperties(origContent, savedContent);
            $rootScope.$emit("tags-updated", savedContent);
            $rootScope.$broadcast("tags-updated", savedContent);
        };

        var getTags = function (page) {
            var tagging = _.find(page.tabs, function (tab) {
                return tab.alias === "Tagging";
            });

            var searchTerms = _.find(tagging.properties, function (prop) {
                return prop.alias === "searchTerms";
            });

            setTags(searchTerms.value)
        }

        var setTags = function (tags, id) {
            console.log(tags)
            id = ng.isDefined(id) ? id : $routeParams.id;
            return contentResource.getById(id).then(function (res) {
                var origContent = $.extend(true, {}, res);
                _.each(res.tabs, function (tab) {
                    if (tab.alias === "Tagging") {
                        _.each(tab.properties, function (prop) {
                            if (prop.alias === "searchTerms") {
                                if (ng.isString(prop.value)) {
                                    var joiner = prop.value.length > 0 ? "," : "";
                                    prop.value += joiner + tags;
                                    $rootScope.tags = prop.value;
                                }
                            }
                        });
                    }
                });
                console.log(res)
                updateContent(origContent, res);
            });
        };

        //public
        $scope.renderModel = [];
        $scope.ids = [];
        $scope.templates = [];
        $scope.openContentPicker = function (id) {
            var d = dialogService.treePicker({
                multiPicker: config.multiPicker,
                section: config.type,
                filter: config.filter,
                filterCssClass: config.filterCssClass,
                treeAlias: config.treeAlias,
                startNodeId: id || parseInt(config.startNodeId),
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

        $scope.add = function (id) {
            contentResource.getById(id).then(function (page) {
                page = utilService.sortContentNode(page);
                page.previewUrl = '/' + page.id + '?AltTemplate=Preview&bg=#f2f3f4&id=' + $scope.control.$uniqueId;
                $scope.renderModel.push(page);
                getTags(page);
            });
        };

        //when the scope is destroyed we need to unsubscribe
        $scope.$on('$destroy', function () {
            unsubscribe();
        });

        var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {
            $scope.control.value = utilService.trim($scope.ids.join(), ",");
        });

        ////when the scope is destroyed we need to unsubscribe
        //$scope.$on('$destroy', function () {
        //    unsubscribe();
        //});

        init();
    }]);
}(angular));