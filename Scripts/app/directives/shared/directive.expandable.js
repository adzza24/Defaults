/* Copyright (c) 2016 Adam Anthony
 * @description  Directive to make images and other elements expand to fill the window when clicked
 */
(function (ng, $) {
    angular.module('directives').directive('ngExpandable', ['animService', function (animService) {

        var  ngExpandable = function (element, attrs) {
            this.elem = element;
            this.config = ng.extend({}, this.defaults, attrs);
            this.config.margin = ng.isString(this.config.margin) ? this.config.margin : this.config.margin + "";
            this.elem.addClass('expandable');
            this.elem.data('expandable', this);
            this.elem.parent().css('position', 'relative')
            this.placeholder = ng.element(this.config.placeholder);
            this.overlay = ng.element(this.config.overlay);
            this.elem.after(this.overlay)
            this.init();
            return this;
        };

        ngExpandable.prototype = {

            defaults: {
                placeholder: '<div class="expander-placeholder"/>',
                overlay: '<div class="expander-overlay"/>',
                position: 'absolute',
                ignore: '',
                target: false,
                scrolllog: 0,
                scrolltop: 0,
                scrollthreshold: 8,
                scroll: true,
                speed: 600,
                margin: '8%',
                activeclass: 'expanding',
                deactiveclass: 'reducing',
                easing: 'easeOutExpo',
                closeonscroll: true
            },

            init: function () {
                var self = this
                var target = this.config.target && this.elem.find(this.config.target).length ? this.elem.find(this.config.target) : this.elem;
                target.on('click', function (e) {
                    e.preventDefault();
                    if (!$(e.target).closest(self.config.ignore).length) {
                        self.elem.velocity("stop");
                        if (self.expanded) {
                            self.reverse();
                        }
                        else {
                            self.expand();
                        }
                    }
                });
                this.overlay.on('click', function (e) {
                    if ($(e.target).is(self.overlay)) {
                        e.preventDefault();
                        self.elem.velocity("stop");
                        if (self.expanded) {
                            self.reverse();
                        }
                    }
                });
            },
            setPlaceholder: function () {
                this.placeholder.css({
                    width: this.elem.outerWidth(true),
                    height: this.elem.outerHeight(true),
                    display: "block"
                });
                this.elem.after(this.placeholder);
            },
            stripMargin: function (v) {
                var margin = parseFloat(this.config.margin);
                var unit = this.config.margin.replace(/[0-9]/g, '');
                return v = unit === "%" ? v - (v * ((margin / 100) * 2)) : v - (2*margin);
            },
            getScale: function () {
                var adjust = this.getAdjustment();
                var w = this.elem.outerWidth(),
                    h = this.elem.outerHeight() + adjust,
                    vw = this.stripMargin($(window).width()) / w,
                    vh = this.stripMargin($(window).height()) / h;
                return vw > vh ? vh : vw;
            },
            getAdjustment: function (base) {
                return $(window).scrollTop() < $('header').height() ? $('header').height() : base || 0;
            },
            getTop: function () {
                var adjust = this.getAdjustment();
                var h = this.elem.outerHeight(), //element's base height
                    dif = (this.getScale() * h),//element's scaled height
                    top = this.elem.offset().top - adjust - $(window).scrollTop(), //get it to the very top of the screen
                    margin = ($(window).height() - dif) / 2, //measure the difference between the scaled element's height and the window.
                    altMargin = (dif - h) / 2; //find difference in top of base element and scaled element
                return (top - ((margin + altMargin)))*-1;
            },
            getLeft: function () {
                var w = this.elem.outerWidth(), //element's base height
                    dif = (this.getScale() * w),//element's scaled height
                    left = this.elem.offset().left, //get it to the very top of the screen
                    margin = ($(window).width() - dif) / 2, //measure the difference between the scaled element's height and the window.
                    altMargin = (dif - w) / 2; //find difference in top of base element and scaled element
                return (left - ((margin + altMargin))) * -1;
            },

            //animations
            grow: function () {
                var self = this;

                this.elem.css({
                    "position": 'absolute',
                    "width": this.elem.width() + 'px'
                });
                this.setPlaceholder();
                var left = this.elem.offset().left !== $(window).width() - (this.elem.offset().left + this.elem.width()) ? [this.getLeft(), 0] : 0;
                this.elem.velocity({
                    top: [this.getTop(), 0],
                    left: left,
                    scale: [this.getScale(), 1]
                }, {
                    duration: this.config.speed,
                    easing: this.config.easing
                });
            },
            shrink: function (callback) {
                this.elem.velocity("reverse", {
                    complete: function () {
                        callback && callback();
                    },
                    duration: this.config.speed,
                    easing: this.config.easing
                });
                this.elem.css('position', 'relative');
                this.placeholder.remove();
                this.expanded = false;
            },


            //scroll cancellation bindings
            scrollon: function () {
                var self = this;
                $(window).on('scroll.expander', function () {
                    if (self.config.scrolllog > self.config.scrollthreshold || self.config.scrolllog < -self.config.scrollthreshold) {
                        self.reverse();
                    }
                    else {
                        var scrolltop = $(window).scrollTop()
                        var increase = scrolltop > self.config.scrolltop ? !0 : !1;
                        increase ? self.config.scrolllog++ : self.config.scrolllog--;
                        self.config.scrolltop = scrolltop;
                    }
                });
            },
            scrolloff: function () {
                this.config.scrolllog = 0;
                $(window).off('scroll.expander');
            },
            getExpander: function () {
                return this.clone = this.clone || this.elem.clone();
            },
            hideExpander: function () {
                this.clone.remove();
            },

            //main functions
            expand: function () {
                var self = this;
                $(document).trigger('flex-pause');
                self.elem.add(self.overlay).removeClass(this.config.deactiveclass).addClass(this.config.activeclass);
                this.expanded = true;
                this.config.scroll && this.scrollon();
                this.grow();
                $(window).on('resize.expander', function () { self.reverse() })
            },
            reverse: function () {
                var self = this;
                $(window).off('resize.expander');
                self.elem.add(self.overlay).removeClass(self.config.activeclass).addClass(self.config.deactiveclass);
                this.shrink(function () {
                    $(document).trigger('flex-resume');
                    self.elem.add(self.overlay).removeClass(self.config.deactiveclass);
                    self.elem.removeAttr("style");
                });
                this.config.scroll && this.scrolloff();
            }
        };

        return ({
            restrict: 'A',
            link: function ($scope, element, attrs) {
                return new ngExpandable(element, attrs);
            }
        });
    }])
}(angular, jQuery || angular.element));