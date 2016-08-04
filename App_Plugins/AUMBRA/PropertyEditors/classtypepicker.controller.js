angular.module("umbraco").controller("AUMBRA.ClassTypePicker",
	function ($scope, dialogService, entityResource, $log, iconHelper, entityResource) {
	    $scope.renderModel = [];
	    $scope.ids = [];
	    $scope.templates = [];
	    var preview = function (id) {
	        entityResource.getByid(id, "Document").then(function(template) {
	            console.log(template, id);
	            $scope.templates.push(template);
	        });
	    };
	    var config = {
	        multiPicker: false,
	        entityType: "Document",
	        type: "content",
	        treeAlias: "content",
	        startNodeId: 0,
	    };
	    angular.extend(config, $scope.model.config);
	    console.log($scope.model.value)
	    if (typeof($scope.model.value) !== "object") {
	        $scope.model.value = {};
	        $scope.model.value.Primary = [];
	        $scope.model.value.Secondary = [];
	    }

	    $scope.addPrimary = function () {
	        $scope.openContentPicker(function (data) {
	            $scope.addPrimaryItem(data);
	        }, false);
	    };

	    $scope.addSecondary = function () {
	        $scope.openContentPicker(function (data) {
	            if (angular.isArray(data)) {
	                _.each(data, function (item, i) {
	                    $scope.addSecondaryItem(item);
	                });
	            } else {
	                $scope.clear();
	                $scope.addSecondaryItem(data);
	            }
	        }, true);

	    };

	    $scope.addPrimaryItem = function (item) {
	        var sid = -1;
	        angular.forEach($scope.model.value.Secondary, function (v, k) {
	            v.id == item.id && (sid = k);
	        });
	        if (sid >= 0) {
	            $scope.model.value.Secondary.splice(sid, 1);
	        }
	        item.icon = iconHelper.convertFromLegacyIcon(item.icon);
	        item.className = item.name.replace(/ /g, "");
	        item.PreviewUrl = '/' + item.id + '?AltTemplate=ClassType';
	        $scope.model.value.Primary = [];
	        $scope.model.value.Primary.push(item);
	        
	    };


	    $scope.addSecondaryItem = function (item) {
	        var exists = false;
	        angular.forEach($scope.model.value.Secondary, function (v, k) {
	            v.id == item.id && (exists = true);
	        });
	        exists = exists || $scope.model.value.Primary.length && $scope.model.value.Primary[0].id == item.id;
	        
	        if (!exists) {
	            item.icon = iconHelper.convertFromLegacyIcon(item.icon);
	            item.className = item.name.replace(/ /g, "").replace("&", "");
	            item.PreviewUrl = '/' + item.id + '?AltTemplate=ClassType';
	            $scope.model.value.Secondary.push(item);
	        }
	    };

	    $scope.openContentPicker = function (callback, multi) {
	        var d = dialogService.treePicker({
	            multiPicker: multi,
	            section: config.type,
	            treeAlias: config.treeAlias,
	            startNodeId: parseInt(config.startNodeId),
	            callback: callback
	        });
	    };

	    $scope.remove = function (index, model) {
	        model.splice(index, 1);
	    };

	    $scope.clear = function () {
	        $scope.model.value = "";
	        $scope.model.value.Primary = [];
	        $scope.model.value.Secondary = [];
	        $scope.ids = [];
	    };

	    var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {
	        $scope.model.value = $scope.model.value;
	    });

	    //when the scope is destroyed we need to unsubscribe
	    $scope.$on('$destroy', function () {
	        unsubscribe();
	    });
	});