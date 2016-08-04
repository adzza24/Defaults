angular.module("umbraco").controller("AUMBRA.ListController",
	function ($scope) {

	    $scope.config = {
	        maxNumber: $scope.model.config.maxNumber || 0,
	        columnNumber: $scope.model.config.columnNumber || 1
	    };
	    var columnWidth = Math.floor(11 / (parseInt($scope.config.columnNumber)));
	    columnWidth = columnWidth * $scope.config.columnNumber <= 10 ? columnWidth : columnWidth - 1;
	    $scope.config.columnWidth = "span" + columnWidth;

	    $scope.addNewRow = function () {
	        var temp = $scope.columns.splice(0);
	        $scope.rows.push(temp);
	        engine.setupColumns();
	        console.log($scope.rows);
	    };

	    $scope.deleteRow = function (index) {
	        $scope.rows.splice(index, 1);
	    };

	    $scope.clear = function () {
	        $scope.model.value = [];
	    };


	    var engine = {
	        setupColumns: function () {
	            $scope.columns = engine.getRow();

	            engine.updateColumns();
	        },
	        getColumn: function (i) {
	            return {
	                value: "",
	                index: i || 0
	            };
	        },
	        checkRows: function (row) {
	            var valid = false;
	            angular.forEach(row, function (col) {
	                if (col.value != "") {
	                    valid = true;
	                }
	            });
	            return valid;
	        },
	        removeEmpties: function () {
	            var targetRows = [];
	            angular.forEach($scope.rows, function (row, i) {
	                var valid = engine.checkRows(row);
	                if (valid) {
	                    targetRows.push(row);
	                }
	            });
	            if (targetRows.length == 0) {
	                targetRows.push(engine.getRow());
	            }
	            $scope.rows = targetRows;
	        },
	        updateColumns: function () {
	            var rows = [];
	            angular.forEach($scope.rows, function (row) {
	                if (row.length < $scope.config.columnNumber) {
	                    for (var i = $scope.config.columnNumber - row.length; i < $scope.config.columnNumber; i++) {
	                        row.push(getColumn(i));
	                    }
	                }

	                rows.push(row.slice(0, $scope.config.columnNumber));
	            });
	            $scope.rows = rows;
	        },
	        getRow: function() {
	            var row = [];
	            for (var i = 0; i < $scope.config.columnNumber; i++) {
	                row.push(engine.getColumn(i));
	            }
	            return row;
	        },
	        unsubscribe: $scope.$on("formSubmitting", function (ev, args) {
	            engine.removeEmpties();
	            $scope.model.value = $scope.rows;
	        }),
	    };

	    

	    //when the scope is destroyed we need to unsubscribe
	    $scope.$on('$destroy', function () {
	        engine.unsubscribe();
	    });

	    $scope.columns = engine.getRow();
	    $scope.rows = angular.isArray($scope.model.value) && $scope.model.value.length > 0 ? $scope.model.value : [engine.getRow()];

	    engine.updateColumns();
	});