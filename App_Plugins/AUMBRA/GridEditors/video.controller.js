(function(ng) {
    angular.module("umbraco").controller("AUMBRA.GridEditors.MultiVideo", ['$scope', '$rootScope', '$timeout', 'dialogService', 'notificationsService', 'localizationService', 'AUMBRA.Services.ValidationService', 'AUMBRA.Services.VideoService', function ($scope, $rootScope, $timeout, dialogService, notificationsService, localizationService, validationService, videoService) {
        //private
        var config = {
            startNodeId: 0,
            multi: false,
            size: {
                width: 100,
                height: 200
            },
            rte: {
                stylesheets: ["rte"],
                dimensions: {
                    height: 10
                },
                entity_encoding: "named",
                toolbar: [
                    "bold",
                    "italic",
                    "link",
                    "subscript",
                    "superscript"
                ]
            },
        };

        var links = {
            youtube: [
                "https://www.youtube.com/embed/",
                "",
                "?wmode=opaque&rel=0&autohide=1&showinfo=0&wmode=transparent"
            ],
            vimeo: [
                "https://player.vimeo.com/video/",
                "",
                "?title=0&byline=0&portrait=0"
            ],
            screen9: [
                "//csp.screen9.com/video?a=",
                ""
            ]
        };

        var clearErrors = function () {
            try {
                var errors = $scope.newVideoForm.$error.required && $scope.newVideoForm.$error.required.splice(0);
                $scope.newVideoForm.url.$error.invalidUrl = false;
                ng.forEach(errors, function (err) {
                    var field = $scope.newVideoForm[err.$name];
                    if (!field.$modelValue) {
                        field.$setValidity("required", true);
                        field.$setPristine();
                    }
                });
            }
            catch(e) {
                console.warn("no errors to clear");
            }
        };
        var checkField = function (v, k) {
            $scope.errors.push(k);
            return false;
        };
        var video = {url: "",publisher: "",date: "",title: "",desc: "",time: ""};
        var i = 0;
        var unsubscribe = $scope.$on('formSubmitting', function () {
            clearErrors();
            ng.forEach($scope.videos, function (v, k) {
                v.editing = false;
            });
            $scope.control.value = $scope.videos;
        });

        //public
        $scope.config = angular.extend(config, $scope.control.editor.config);
        $scope.videos = [];
        $scope.errors = [];
        $scope.validUrl = false;
        //localizationService.localize("Topics").then(function (v) {
        //    console.log(v);
        //});
        $scope.addVideo = function () {
            if ($scope.checkVideo()) {
                console.log($scope.newVideo);
                $scope.videos.push($scope.newVideo);
                $scope.reset();
                notificationsService.success("Video Added Successfully", "<br />Don't forget to save this content page otherwise your changes will be lost.");
            }
            else {
                notificationsService.error("There were some errors in the form", "<br />Please correct the highlighted boxes and try again.");
            }
        };
        $scope.removeVideo = function (i) {
            $scope.videos.splice(i, 1);
        };
        $scope.getUrl = function (video, adding) {
            var url = video.url;
            var validUrl = false;
            console.log($scope.newVideoForm);
            $scope.newVideoForm.url.$error = ng.isObject($scope.newVideoForm.url.$error) ? $scope.newVideoForm.url.$error : {};
            if (!ng.isString(video.url)) {
                return;
            }
            if (url.indexOf('</') >= 0) {
                url = url.substring(url.indexOf('src="') + 5);
                url = url.substring(0, url.indexOf('"')).replace(/&amp;/g, "&");
            }
            videoService.getType(url).then(function (type) {
                video.type = type;
                if (video.type) {
                    links[video.type][1] = videoService.stripUrl(url);
                    if (validUrl = links[video.type][1] !== null) {
                        video.url = links[video.type].join("");
                        videoService.getThumbnail(video.url, video.type).then(function (thumb) {
                            thumb && (video.thumbnail = thumb);
                        });
                        adding && ($scope.newVideoForm.url.$error.invalidUrl = false);
                    }
                }
                if (!validUrl && adding) {
                    $scope.newVideoForm.url.$error.invalidUrl = "This is not a valid video URL.";
                }
                adding && ($scope.validUrl = validUrl);
            });
            console.log(video)
        };
        $scope.checkVideo = function () {
            $scope.newVideoForm.$setDirty();
            ng.forEach($scope.newVideoForm, function (v, k) {
                if (k.toString().indexOf('$') == -1) {
                    v.$dirty = true;
                }
            });
            console.log($scope.newVideoForm)
            return $scope.newVideoForm.$valid;
        };
        $scope.editVideo = function (i) {
            $scope.videos[i].editing = !$scope.videos[i].editing;
            console.log("editing");
            $(':focus').blur();
        };
        $scope.reset = function () {
            i++;
            $scope.rteId = "";
            $scope.newVideo = angular.extend({}, video);
            $scope.validUrl = false;
            $timeout(function () {
                clearErrors();
                $scope.rteId = $scope.control.$uniqueId.substring(0, $scope.control.$uniqueId.length - 2) + "-" + i;
            }, 10);
        };

        //bindings
        $scope.$on('destroy', function () {
            unsubscribe();
        });

        //init
        if (angular.isArray($scope.control.value)) $scope.videos = $scope.control.value;
        else $scope.control.value = $scope.videos;
        $scope.reset();
    }]);
}(angular));