angular.module("umbraco").controller("AUMBRA.FormFieldsController",
	function ($scope) {

	    var unsubscribe = $scope.$on("formSubmitting", function (ev, args) {
	        var model = {};
	        angular.forEach($scope.model.config.fields, function (field, k) {
	            model[field]
	        });
	    });
	    
	    //when the scope is destroyed we need to unsubscribe
	    $scope.$on('$destroy', function () {
	        unsubscribe();
	    });

	    if (!angular.isObject($scope.model.value)) {
	        $scope.model.value = {};
	    }

	    $scope.model.value.Required = !!$scope.model.value.Required;

	    angular.forEach($scope.model.config.fields, function (field, k) {
	        field.alias = field.value.replace(/[\s\W]/g, "");
	    });
	});