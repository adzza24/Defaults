(function (ng) {
    angular.module("umbraco").controller("AUMBRA.GridEditors.Slider", ['$scope', '$rootScope', '$timeout', 'dialogService', 'AUMBRA.Services.MceService', 'AUMBRA.Services.utilService', function ($scope, $rootScope, $timeout, dialogService, MceService, utilService) {

        //Private
        
        var getImages = function(callback) {
            dialogService.mediaPicker({
                startNodeId: $scope.control.editor.config && $scope.control.editor.config.startNodeId ? $scope.control.editor.config.startNodeId : undefined,
                multiPicker: false,
                cropSize: $scope.control.editor.config && $scope.control.editor.config.size ? $scope.control.editor.config.size : undefined,
                showDetails: true,
                callback: function (data) {
                    console.log(data);
                    data = ng.isArray(data) ? data : [data];
                    ng.forEach(data, function (image) {
                        image.$uniqueId = $scope.control.$uniqueId + $scope.control.value.length;
                        image.croppedPath = utilService.getCropUrl(image, $scope.control.editor.config && $scope.control.editor.config.size);
                        callback && callback(image);
                    });
                }
            });
        };

        //Public

        $scope.control.editor.config.rte = MceService.getConfig();;

        $scope.changeImage = function (i) {
            var _multiPicker = !!$scope.control.editor.config.multiPicker;
            $scope.control.editor.config.multiPicker = false;
            getImages(function (image) {
                ng.extend($scope.control.value[i], image);
                $scope.control.editor.config.multiPicker = _multiPicker;
            });
        };

        $scope.addImage = function (front) {
            var add = front ? 'unshift' : 'push';

            getImages(function (image) {
                $scope.control.value[add](image);
            });
            
        };

        $scope.removeImage = function (i) {
            MceService.kill($scope.control.value[i].$uniqueId);
            $scope.control.value.splice(i, 1);
        };
        $scope.clearAll = function (i) {
            $scope.control.value = [];
        };
        //Init
        if (!ng.isArray($scope.control.value)) {
            $scope.control.value = [];
        }
        else {
            ng.forEach($scope.control.value, function (v, k) {
                v.$uniqueId = $scope.control.$uniqueId + (k);
            });
        }
        $timeout(function () {
            if ($scope.control.$initializing) {
                $scope.addImage();
            }
        }, 200);
    }]);
}(angular));