(function (ng) {
    angular.module("umbraco").controller("AUMBRA.GridEditors.MultiNodePicker", ['$scope', 'dialogService', 'contentResource', 'AUMBRA.Services.utilService', function ($scope, dialogService, contentResource, utilService) {

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
                console.log(e)
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