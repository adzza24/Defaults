(function (ng) {
    angular.module("umbraco").controller("AUMBRA.GridEditors.Timeline", ['$scope', '$rootScope', '$timeout', 'dialogService', 'AUMBRA.Services.MceService', function ($scope, $rootScope, $timeout, dialogService, MceService) {

        //Private
        var temp;
        var unsubscribe = $scope.$on("formSubmitting", function () {
            $scope.control.value = $scope.timeline;
        });
        var newItem = {
            title: "Title",
            text: "Description",
            $uniqueId: $scope.control.$uniqueId,
            index: 0,
            init: true
        };
        var reset = function (init) {
            if (!init) {
                MceService.kill($scope.newItem.$uniqueId);
                $timeout(function () {
                    MceService.restart($scope.newItem.$uniqueId);
                    $scope.$apply();
                }, 100);
            }
            var item = temp || newItem;
            $scope.newItem = ng.extend({}, item);
            $scope.newItem.index = $scope.timeline.length;
            temp = false;
            $scope.editing = false;
        };
        var validate = function () {
            $scope.newItem.valid = false;
            if ($scope.newItem.title !== newItem.title && $scope.newItem.text !== newItem.text && $scope.newItem.title !== "" && $scope.newItem.text !== "") {
                $scope.newItem.valid = true;
            }
            return $scope.newItem.valid;
        };
        
        //Public
        $scope.control.editor.config.rte = angular.extend({}, MceService.getConfig(), $scope.control.editor.config.rte);
        $scope.add = function () {
            var item = ng.extend({}, $scope.newItem);
            if ($scope.editing && ng.isDefined(_.findWhere($scope.timeline, {index: item.index}))) {
                ng.extend(_.findWhere($scope.timeline, {index: item.index}), item);
            } else {
                item.init = false;
                $scope.timeline.push(item);
            }
            reset();
        };
        $scope.cancel = function () {
            reset();
        };
        $scope.remove = function (i) {
            $scope.timeline.splice(i, 1);
        };
        $scope.edit = function (i) {
            if (!temp && $scope.newItem) {
                temp = $scope.newItem;
            }
            $scope.editing = true;
            var id = $scope.newItem.$uniqueId + "";
            MceService.kill($scope.newItem.$uniqueId);
            $timeout(function () {
                $scope.newItem = ng.extend({}, $scope.timeline[i]);
                $scope.newItem.$uniqueId = id;
                $scope.$apply();
                MceService.restart(id);
            }, 100);
        };
        //Init
        $scope.timeline = [];
        if (!ng.isArray($scope.control.value)) {
            $scope.control.value = [];
        }
        else {
            ng.forEach($scope.control.value, function (v, k) {
                v.$uniqueId = $scope.control.$uniqueId + k;
                $scope.timeline.push(v);
            });
        }

        reset(true);

        $scope.$on('$destroy', function () {
            unsubscribe();
        });

        $scope.$watch('newItem.title', function (newVal, oldVal) {
            validate();
        });
        $scope.$watch('newItem.text', function (newVal, oldVal) {
            validate();
        });

    }]);
}(angular));