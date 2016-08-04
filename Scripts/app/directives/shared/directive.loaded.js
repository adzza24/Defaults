/* Copyright (c) 2016 Adam Anthony
 * @description  Directive to hide images that have an incorrect path or do not exist
 */
(function () {
    angular.module('directives').directive('ngLoaded', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs, ctrl) {

                //hide the element until we determine that it is loaded
                element.velocity({ "opacity": 0, "width": "1" }, { duration: 0, display: "none" });
                element.css("transition", "none");
                //bind to the onload event
                element.on('load', function () {
                    $scope.$eval(attrs["ngLoaded"], $scope);
                    $scope.$digest();
                    timer && $timeout.cancel(timer);
                    fadeIn();
                    //emit this to other scopes so they can update if they need to
                    $scope.$emit("ng.loaded");
                });

                //force a reload of the element after the binding is applied
                //to avoid elements that have already loaded before this script getting removed
                element.attr("src", "");
                $timeout(function () {
                    element.attr("src", attrs.src);
                }, 100);

                //Set a timeout to remove the element after the max number of seconds
                var max = attrs.max ? attrs.max : 5000;
                var timer = attrs["remove"] !== "false" && $timeout(function () {
                    //console.error("Did not load source " + attrs["src"])
                    element.remove();
                    $scope.$emit("ng.loaded");
                }, max);

                function fadeIn() {
                    element.velocity(
                        {
                            p: {
                                "opacity": 1,
                                "width": "100%"
                            },
                            o: {
                                duration: Math.random(100),
                                display: "",
                                easing: "easeInOutExpo",
                                complete: function (elements) {
                                    $(elements).removeAttr("style");
                                }
                            }
                        });
                }

            }
        };
    }]);
}());