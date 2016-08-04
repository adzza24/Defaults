angular.module("umbraco").controller("AUMBRA.GridEditors.Button", function ($scope, $timeout, dialogService, entityResource, contentResource, $routeParams, editorState) {
    var config = {
        multiPicker: false,
        entityType: "Document",
        type: "content",
        treeAlias: "content",
        startNode: {
            query: "$site",
            type: "content",
            id: -1
        },
        defaultText: "Click to change"
    };
    angular.extend(config, $scope.control.editor.config);

    var rootId = $routeParams.id;

    if (config.startNode.query) {
        entityResource.getByQuery(config.startNode.query, rootId, "Document").then(function (ent) {
            config.startNodeId = ent.id;
        });
    } else {
        config.startNodeId = config.startNode.id;
    }

    $scope.openContentPicker = function () {
        var d = dialogService.treePicker({
            section: config.type,
            treeAlias: config.treeAlias,
            multiPicker: config.multiPicker,
            callback: populate,
            startNodeId: config.startNode.id
        });
    };

    var unsubscribe = $scope.$on("formSubmitting", function () {
        angular.forEach($scope.urls, function (url) {
            if (url.selected) {
                $scope.control.value.url = url.link;
                $scope.control.value.type = url.name;
            }
        });
    });

    $scope.$on('$destroy', function () {
        unsubscribe();
    });

    function populate(data) {
        if (angular.isArray(data)) {
            data = data[0];
        }
        if (data) {
            angular.forEach($scope.urls, function (url, i) {
                if (url.name == "picker") {
                    url.selected = true;
                    contentResource.getNiceUrl(data.id).then(function (link) {
                        url.link = link;
                    });
                }
                else {
                    url.link = url.defaultText;
                }
            });
        }
    }

    function init() {
        if (!angular.isObject($scope.control.value)) {
            $scope.control.value = {};
        }
        else if (angular.isDefined($scope.control.value.type) && $scope.control.value.type !== "") {
            angular.forEach($scope.urls, function (url, i) {
                if (url.name == $scope.control.value.type) {
                    url.selected = true;
                    url.link = $scope.control.value.url;
                }
                else {
                    url.link = url.defaultText;
                }
            });
        }
        else {
            angular.forEach($scope.urls, function (url, i) {
                url.link = url.defaultText;
            });
        }
        if (!angular.isDefined($scope.control.value.text) || $scope.control.value.text == "") {
            $scope.control.value.text = config.defaultText;
        }
    }

    $scope.ctrl = function (index) {
        var cur = $scope.urls[index];
        dialogService.closeAll();
        angular.forEach($scope.urls, function (url, i) {
            if (i !== index) {
                url.selected = false;
                url.link = url.defaultText;
            }
        });
        cur.link == cur.defaultText && (cur.link = "");
        cur.selected = true;
        cur.callback && cur.callback(cur);
    }

    $scope.urls = [
        {
            name: "manual",
            link: "",
            defaultText: "Enter manual link",
            callback: false,
            selected: false,
            showinput: true
        },
        {
            name: "picker",
            link: "",
            defaultText: "Choose page",
            callback: $scope.openContentPicker,
            selected: false,
            showinput: false
        }
    ];
    init();
});