angular.module("umbraco").controller("AUMBRA.GridEditors.PdfController",
	function ($scope, dialogService, entityResource, $log, iconHelper, entityResource, contentResource, $routeParams, editorState) {
	    $scope.ids = [];
	    $scope.control.templates = [];

	    var config = {
	        multiPicker: false,
	        entityType: "Media",
	        type: "media",
	        treeAlias: "media",
	        startNodeId: false,
	        filter: "",
	        filterCssClass: "not-allowed not-published",
	        startNode: {
	            query: "",
	            type: "content",
	            id: -1
	        },
	        defaultCaptionText: "Insert a caption"
	    };

	    angular.extend(config, $scope.control.editor.config);

	    $scope.openContentPicker = function () {
	        var d = dialogService.mediaPicker({
	            startNodeId: config.startNodeId,
	            multiPicker: false,
	            showDetails: true,
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
	        if ($scope.ids.indexOf(item.id) < 0) {
	            buildItem(item);
	            
	        }
	    };

	    function buildItem (arr) {
	        $scope.clear();
	        if (typeof arr != "undefined") {
	            if (angular.isArray(arr)) {
	                _.each(arr, function (item) {
	                    $scope.ids.push(item.id);
	                    $scope.renderModel.push(item);
	                });
	            }
	            else {
	                $scope.ids.push(arr.id);
	                $scope.renderModel.push(arr);
	            }
	            //console.log($scope.renderModel[0])
	        }
	    };

	    var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {
	        $scope.control.value = $scope.renderModel[0];
	        $scope.control.value.caption = $scope.caption;
	        $scope.control.value.bytes = $scope.control.value.kilobytes = "unknown ";
	        _.each($scope.renderModel[0].properties, function (prop) {
	            if (prop.alias == "umbracoBytes") {
	                $scope.control.value.bytes = prop.value;
	                $scope.control.value.kilobytes = (prop.value / 1024).toFixed(1);
	            }
	        });
	        //console.log($scope.caption, $scope.control.value)
	    });

	    //when the scope is destroyed we need to unsubscribe
	    $scope.$on('$destroy', function () {
	        unsubscribe();
	    });

	    function trim(str, chr) {
	        var rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^' + chr + '+|' + chr + '+$', 'g');
	        return str.replace(rgxtrim, '');
	    }

	    function populate(data) {
	        if (angular.isArray(data)) {
	            _.each(data, function (item, i) {
	                $scope.add(item);
	            });
	        } else {
	            $scope.clear();
	            $scope.add(data);
	        }
	    }


	    //init
	    if (config.startNode.query) {
	        var rootId = $routeParams.id;
	        entityResource.getByQuery(config.startNode.query, rootId, "Document").then(function (ent) {
	            config.startNodeId = ent.id;
	        });
	    }
	    else {
	        config.startNodeId = config.startNode.id;
	    }

	    if (typeof $scope.control.value == "object" && $scope.control.value !== null) {
	        buildItem($scope.control.value);
	        $scope.caption = $scope.control.value.caption;
	    }
	    else {
	        $scope.caption = config.defaultCaptionText;
	    }
	});