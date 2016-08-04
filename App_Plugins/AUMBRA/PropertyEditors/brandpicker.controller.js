angular.module("umbraco").controller("AUMBRA.BrandPickerController",
	function ($scope) {

	    var unsubscribe = function () {
	        $scope.model.value = $scope.brand;
	    };

	    $scope.setBrand = function (brand) {
	        angular.forEach($scope.items, function(item) {
	            if (item.name == brand) {
	                $scope.brand = item;
	            }
	        });
	    };

	    //when the scope is destroyed we need to unsubscribe
	    $scope.$on("formSubmitting", function (ev, args) {
	        unsubscribe();
	    });

	    $scope.items = $scope.model.config.brandList;
	    $scope.brand = $scope.model.value;
	});