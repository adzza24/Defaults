/* Copyright (c) 2016 Adam Anthony */
(function (ng) {
    var animService = function ($timeout, $q) {
        this.$timeout = $timeout;
        this.activated = false;
        this.$q = $q;
        
        //Velocity defaults
        //$element.velocity({
        //    width: "500px",
        //    property2: value2,
        //    width: "+=5rem", // Add 5rem to the current rem value
        //    height: "*=2" // Double the current height
        //}, {
        //    /* Velocity's default options */
        //    duration: 400,
        //    easing: "swing",
        //    queue: "",
        //    begin: undefined, 
        //    progress: undefined,
        //    complete: undefined,
        //    display: undefined,
        //    visibility: undefined,
        //    loop: false,
        //    delay: false,
        //    mobileHA: true
        //});

    };
    animService.prototype = {
        scrollWindow: function (delay, $element, duration, easing) {
            var deferred = this.$q.defer();
            this.$timeout(function () {
                $element = $element && $element.length ? $element : ng.element('main');
                $element.velocity("scroll", { duration: duration || 700, easing: easing || "easeOutExpo", complete: function () { deferred.resolve(); } });
            }, delay || 10);
            return deferred.promise;
        },
        blurIn: function ($element) {
            if (!this.activated) {
                $element.velocity("stop")
                        .css({ "transition-delay": "0s"})
                        .velocity({
                            p: { blur: ['5px', '0px'] },
                            o: {
                                duration: 500,
                                easing: "easeOutExpo"
                            }
                        });
                this.activated = true;
            }
        },
        blurOut: function ($element) {
            if (this.activated) {
                $element.velocity("stop")
                    .css({ "transition": "none" })
                    .velocity({
                        p: { blur: ['', '5px'] },
                        o: {
                            duration: 100,
                            easing: "ease-in",
                            complete: function () {
                                $element.removeAttr("style");
                            }
                        }
                    });
                this.activated = false;
            }
        },
        formular: function (size, pos, count, parentSide, elemSide, diff, pos2, count2) {
            //console.log("position: " + pos, "count: " + count)
            var base = elemSide - parentSide;
            if (pos === 1) {
                return base;
            }
            if (pos !== count && ng.isNumber(diff)) {
                base -= diff;
            }
            if (ng.isNumber(pos2)) {
                return base + (size * ((pos2) / count2));
            }
            return base + (size * ((pos - 0.5) / count));
        },

        determinePos: function (size, offset) {
            return Math.ceil(offset / size);
        },

        updateSlider: function (i) {
            var l = $('.image-slider-preview').data("flexslider");
            var speed = l.vars.animationSpeed;
            l.vars.animationSpeed = 0;
            l.flexAnimate(i, l.vars.pauseOnAction);
            setTimeout(function () {
                l.vars.animationSpeed = speed;
                $(document).trigger('flex-resume');
            }, speed);
        },

        getLeft: function (elem) {
            var parent = elem.closest('.flexslider'),
                eW = elem.outerWidth(true),
                pW = parent.innerWidth(),
                pL = parent.offset().left,
                eL = elem.offset().left,
                pos = this.determinePos(eW, eL - pL),
                colCount = Math.floor(pW / eW);
            return this.formular(eW, pos, colCount, pL, eL, parseInt(elem.css("margin-right")));
        },
        getTop: function (elem) {
            var parentV = elem.closest('.flex-viewport'),
                parent = elem.closest('.flexslider'),
                diff = parent.offset().top - parentV.offset().top,
                eH = elem.outerHeight(true),
                pH = parentV.height(),
                pT = parentV.offset().top,
                eT = elem.offset().top,
                pos = this.determinePos(eH, (eT - pT)),
                innerPos = this.determinePos(eH, (eT - parent.offset().top)),
                rowCount = Math.floor(pH / eH),
                innerRowCount = Math.floor(parent.height() / eH);
            return this.formular(eH, pos, rowCount, pT, eT, 0, innerPos, innerRowCount);
        },

        setTransformOrigin: function (elem) {
            var left = this.getLeft(elem);
            var top = this.getTop(elem);
            ng.element('.animate-zoom .flex-viewport, .carousel .flex-viewport').css({
                "transform-origin": left + 'px ' + top + 'px'
            });
        }
    };
    ng.module('services').service('animService', ['$timeout', '$q', animService]);
}(angular));