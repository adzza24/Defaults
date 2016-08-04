(function (ng) {

    ng.module("umbraco").controller("AUMBRA.GridEditors.TableController", ['$scope', 'AUMBRA.Services.MceService', 'tinyMceService', function ($scope, MceService, tinyMceService) {
        //private
        var engine = {
            setupColumns: function () {
                $scope.columns = engine.getRow();
                engine.updateColumns();
            },
            getColumn: function (i) {
                $scope.config.id++;
                return {
                    value: "",
                    index: i || 0,
                    $uniqueId: $scope.control.$uniqueId.substring(0, $scope.control.$uniqueId.length - $scope.config.id.toString().length) + $scope.config.id
                };
            },
            checkRows: function (row) {
                var valid = false;
                ng.forEach(row, function (col) {
                    if (col.value != "") {
                        valid = true;
                    }
                });
                return valid;
            },
            removeEmpties: function () {
                var targetRows = [];
                ng.forEach($scope.rows, function (row, i) {
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
                $scope.rows.push($scope.headers[0]);

                engine.forEachRow(function (row) {
                    if (row.length < $scope.config.columnNumber) {
                        for (var i = $scope.config.columnNumber - row.length; row.length < $scope.config.columnNumber; i++) {
                            row.push(engine.getColumn(i - 1));
                        }
                    }
                    row = row.slice(0, $scope.config.columnNumber);
                });
                $scope.headers = [$scope.rows.pop()];
                engine.setIds();
            },
            getRow: function () {
                var row = [];
                for (var i = 0; i < $scope.config.columnNumber; i++) {
                    var col = engine.getColumn(i);
                    row.push(col);
                }
                return row;
            },
            setIds: function () {
                engine.forEachColumn(function (col) {
                    if (col.$uniqueId && tinyMCE.editors[col.$uniqueId]) {
                        MceService.restart(col.$uniqueId);
                    }
                    else {
                        $scope.config.id++;
                        col.$uniqueId = $scope.control.$uniqueId + $scope.config.id;
                    }
                });
            },
            forEachRow: function (callback) {
                ng.forEach($scope.rows, function (row, k) {
                    callback(row, k);
                });
            },
            forEachColumn: function (callback) {
                ng.forEach($scope.rows, function (row) {
                    ng.forEach(row, function (col, k) {
                        callback(col, k);
                    });
                });
            },
            unsubscribe: $scope.$on("formSubmitting", function (ev, args) {
                engine.removeEmpties();
                $scope.control.value = {
                    rows: $scope.rows,
                    headers: $scope.headers
                };
            })
        };

        //public
        $scope.config = {
            maxNumber: $scope.control.editor.config.maxNumber || 0,
            columnNumber: $scope.control.editor.config.columnNumber || 1,
            defRte: tinyMceService.defaultPrevalues(),
            rte: {
                stylesheets: ["rte"],
                dimensions: {
                    height: 50
                },
                entity_encoding: "named",
                toolbar: [
                    "bold",
                    "italic",
                    "link",
                    "subscript",
                    "superscript",
                    "charmap",
                    "alignleft",
                    "alignright",
                    "aligncenter",
                    "outdent",
                    "indent"
                ]
            },
            id: 0
        };

        $scope.config.rte = ng.extend($scope.config.defRte, $scope.config.rte);

        var columnWidth = Math.floor(11 / (parseInt($scope.config.columnNumber)));
        columnWidth = columnWidth * $scope.config.columnNumber <= 10 ? columnWidth : columnWidth - 1;
        $scope.config.columnWidth = "span" + columnWidth;

        $scope.addNewRow = function () {
            var temp = $scope.columns.splice(0);
            $scope.rows.push(temp);
            engine.setupColumns();
        };
        $scope.addNewColumn = function () {
            $scope.config.columnNumber = $scope.config.columnNumber > 0 ? $scope.config.columnNumber + 1 : 1;
            engine.setupColumns();
        };

        $scope.deleteRow = function (index) {
            $scope.rows.splice(index, 1);
        };

        $scope.deleteColumn = function (index) {
            $scope.rows.push($scope.headers[0]);
            ng.forEach($scope.rows, function (row) {
                row.splice(index, 1);
            });
            $scope.headers = [$scope.rows.pop()];
            $scope.config.columnNumber = $scope.config.columnNumber > 1 ? $scope.config.columnNumber - 1 : 1;
            engine.updateColumns();
        };

        $scope.moveColumn = function (i, n) {
            engine.forEachRow(function (row) {
                var curCol = row[i];
                var newCol = row[i + n];
                row[i] = newCol;
                row[i + n] = curCol;
            });
            engine.updateColumns();
        };

        $scope.clear = function () {
            $scope.control.value = [];
        };


        //when the scope is destroyed we need to unsubscribe
        $scope.$on('$destroy', function () {
            engine.unsubscribe();
        });

        $scope.headers = $scope.control.value !== null && ng.isArray($scope.control.value.headers) && $scope.control.value.headers.length > 0
                        ? $scope.control.value.headers
                        : [engine.getRow()];
        $scope.config.columnNumber = $scope.headers[0].length;
        $scope.rows = $scope.control.value !== null && ng.isArray($scope.control.value.rows) && $scope.control.value.rows.length > 0
                        ? $scope.control.value.rows
                        : [engine.getRow()];
        $scope.columns = engine.getRow();

        engine.updateColumns();
    }]);
}(angular))