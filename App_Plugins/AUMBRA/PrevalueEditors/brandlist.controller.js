﻿angular.module("umbraco").controller("AUMBRA.PrevalueEditors.MultiValuesController",
    function ($scope, $timeout) {

        //NOTE: We need to make each item an object, not just a string because you cannot 2-way bind to a primitive.
        $scope.newItem = {
            name: "",
            colors: {
                primary: "",
                secondary: "",
                third: ""
            }
        };
        $scope.hasError = false;

        if (!angular.isArray($scope.model.value)) {

            //make an array from the dictionary
            var items = [];
            for (var i in $scope.model.value) {
                items.push($scope.model.value[i]);
                items[i].sortOrder = $scope.model.value[i].sortOrder;
                items[i].id = i;
            }

            //ensure the items are sorted by the provided sort order
            items.sort(function (a, b) { return (a.sortOrder > b.sortOrder) ? 1 : ((b.sortOrder > a.sortOrder) ? -1 : 0); });

            //now make the editor model the array
            $scope.model.value = items;
        }

        $scope.remove = function (item, evt) {
            evt.preventDefault();

            $scope.model.value = _.reject($scope.model.value, function (x) {
                return x.name === item.name;
            });

        };

        $scope.add = function (evt) {
            evt.preventDefault();

            console.log($scope.newItem)
            if ($scope.newItem) {
                if (!_.contains($scope.model.value, $scope.newItem)) {
                    $scope.model.value.push($scope.newItem);
                    console.log($scope.newItem)
                    $scope.newItem = {
                        name: "",
                        colors: {
                            primary: "",
                            secondary: "",
                            third: ""
                        }
                    };
                    console.log($scope.newItem)
                    console.log($scope.model.value)
                    $scope.hasError = false;
                    return;
                }
            }

            //there was an error, do the highlight (will be set back by the directive)
            $scope.hasError = true;
        };

        $scope.sortableOptions = {
            axis: 'y',
            containment: 'parent',
            cursor: 'move',
            items: '> div.control-group',
            tolerance: 'pointer',
            update: function (e, ui) {
                // Get the new and old index for the moved element (using the text as the identifier, so 
                // we'd have a problem if two prevalues were the same, but that would be unlikely)
                var newIndex = ui.item.index();
                var movedPrevalueText = $('input.model-name', ui.item).val();
                var originalIndex = getElementIndexByPrevalueText(movedPrevalueText);

                // Move the element in the model
                if (originalIndex > -1) {
                    var movedElement = $scope.model.value[originalIndex];
                    $scope.model.value.splice(originalIndex, 1);
                    $scope.model.value.splice(newIndex, 0, movedElement);
                }
            }
        };

        function getElementIndexByPrevalueText(value) {
            for (var i = 0; i < $scope.model.value.length; i++) {
                if ($scope.model.value[i].name === value) {
                    return i;
                }
            }

            return -1;
        }

    });