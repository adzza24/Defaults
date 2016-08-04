(function (ng) {
    angular.module("umbraco.directives").directive("ngSticky", ['$timeout', 'tinyMceService', function ($timeout, tinyMceService) {

        var ScrollCheck = function($scope, element, attrs) {
            this.$scope = $scope;
            this.element = element;
            this.config = ng.extend({}, this.defaults, attrs);
            this.target = this.element.closest(this.config.target);
            this.target.css("position", "relative");
            this.element.css({
                "position": "absolute",
                "transition": "none"
            });
            this.threshhold = {};
            this.timer = null;
            this.scrollCheck();
        };

        ScrollCheck.prototype = ng.extend(ScrollCheck.prototype, {
            active: true,
            defaults: {
                delay: 10,
                target: ".inner",
                panel: ".umb-panel-body"
            },
            scrollCheck: function () {
                var self = this;
                if (this.active) {
                    var loc = this.getCurrentLocation();
                    if (loc.target.top <= 0 && loc.target.top > (loc.target.height*-1)) {
                        this.config._delay = this.config.delay;
                        this.config.delay = 0;
                        this.stickTo((loc.target.top *-1));
                    }
                    else if (loc.target.top <= ((loc.target.height - loc.elem.height)* -1)) {
                        this.config.delay = this.config._delay;
                        this.stickTo(loc.target.height - loc.elem.height);
                    }
                    else {
                        this.unstick();
                    }
                }

                $(this.config.panel).one("scroll", function () {
                    self.timer = $timeout(function () {
                        self.scrollCheck();
                    }, self.config.delay);
                });

            },
            stickTo: function (loc) {
                this.element.removeClass("sticky").css({
                    "top": loc,
                    "position": "absolute",
                    "-moz-transition": "none",
                    "-webkit-transition": "none",
                    "transition": "none"
                });
            },
            unstick: function (scrollTop) {
                this.config.delay = this.config._delay;
                this.element.removeClass("sticky").removeAttr("style");
            },
            getCurrentLocation: function () {
                return {
                    panel: {
                        top: $(this.config.panel).offset().top,
                    },
                    elem: {
                        height: this.element.height()
                    },
                    target: {
                        top: this.target.offset().top - $(this.config.panel).offset().top,
                        height: this.target.height() - this.element.height()
                    },
                    scrollTop: $(this.config.panel).scrollTop()
                };
            }

        });


        return {
            restrict: "A",
            link: function ($scope, element, attrs) {
                return new ScrollCheck($scope, element, attrs);
            }
        };
    }]);
}(angular));