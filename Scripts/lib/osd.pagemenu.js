/* Copyright (c) 2016 Adam Anthony
 *  Script to create a sticky side nav and size the menu and content columns to a ratio of the document width
 */

(function ($, undefined) {

    var Pagemenu = function (elem, settings) {
        var self = this;
        this.elem = $(elem);
        this.options = $.extend({}, this.defaults, settings);
        this.content = $(this.options.target).children();
        this.items = this.elem.find(this.options.items);
        this.footer = $(this.options.footer);
        this.options.setSelected = this.setSelected;
        this.menu = this.elem.find('[data-sticky]').first();
        this.container = $(this.options.container);
        this.scrollable = this.container.scrollable(this.options);
        this.init();
    }

    $.extend(Pagemenu.prototype, {

        defaults: {
            container: ".menu",
            maxWidth: 1024,
            directional: true,
            adjust: 0,
            ambiguity: 0,
            depth: 0,
            manual: false,
            activeclass: "active",
            openclass: 'open',
            footer: ".footer",
            items: 'li a',
            itemparent: 'li',
            target: '.content',
            scrollevent: "scroll",
            scrolltarget: window,
            scrollable: null,
            internal: true,
            menutopadjustment: 0
        },

        init: function (settings) {
            var self = this;
            $(this.options.scrolltarget).on(this.options.scrollevent, function (e) {
                self.scrollable.init();
                self.checkBottom();
                self.setSelected();
            });
            if (this.options.internal) {
                this.items.each(function () {
                    var url = $(this).data("url");
                    if (url && url.indexOf("http") === 0) {
                        url = url.replace(/^https?:\/\//, '');
                        $(this).data("url", url.substring(url.indexOf('/')));
                    }
                });
            }
            this.items.filter('[data-url], [data-target]').on('click', function (e) {
                self.setUrl($(this));
            });
        },

        resetContent: function () {
            this.content = $(this.options.target).children();
        },

        setSelected: function () {
            var self = this;
            if (!this.options.manual) {
                var top = this.scrollable.options.scrollPos;
                var direction = this.scrollable.options.direction;
                var selected = this.items.filter('.' + this.options.activeclass);
                var adjustment = this.getAdjustment();
                var current = this.content.filter(function (i, el) {
                    return direction === "down"
                        ? $(this).offset().top + adjustment <= top
                        : $(this).offset().top + adjustment >= top;
                });
                var target = direction === "down" ? $(current.last().data('target')) : $(current.first().data('target'));
                if (target.length
                    && ((direction === "down" && target.index() > selected.index())
                        || (direction === "up" && target.index() < selected.index())
                        || (direction !== "down" && direction !== "up"))) {
                    this.select(target);
                }
            }
        },

        select: function (target) {
            var elem = target.closest(this.options.itemparent);
            var submenu = elem.find('ul');
            elem.siblings().removeClass(this.options.activeclass + ' ' + this.options.openclass).end().addClass(this.options.activeclass);
            elem.siblings().find('.' + this.options.openclass).removeClass(this.options.openclass);
            if (submenu.length) {
                var parent = submenu.closest(this.options.itemparent);
                var sibs = parent.siblings('.' + this.options.openclass);
                sibs.find('.' + this.options.openclass).addBack().removeClass(this.options.openclass);
                if (parent.hasClass(this.options.openclass)) {
                    parent.add(submenu).removeClass(this.options.openclass);
                }
                else {
                    parent.add(submenu).addClass(this.options.openclass);
                }
            }
        },

        getAdjustment: function () {
            return this.options.adjust;
        },

        setUrl: function (elem) {
            var self = this;
            this.options.manual = true;
            this.select(elem);
            var scrollTop = 0;

            osd.currentPage = elem.data("url");
            if (osd.currentPage) {
                $(document).trigger("update-view");
            }
            else {
                this.resetContent();
                var target = this.content.filter(elem.data('target'));
                if (target.length) {
                    scrollTop = target.offset().top + this.getAdjustment();
                }
            }

            $('html,body').animate({ scrollTop: scrollTop }, 200, function () {
                self.options.manual = false;
            });
        },
        checkBottom: function () {
            if (this.scrollable.options.reached) {
                var paddingB = parseInt(this.container.css('padding-bottom')),
                    bottom = this.container.offset().top + this.container.height(),
                    currentBot = this.scrollable.options.scrollPos + this.menu.outerHeight(true) + this.options.menutopadjustment;
                if (currentBot >= bottom) {
                    //this.menu.css('top', bottom - this.menu.height() + 'px');
                    this.menu.addClass('page-bottom');
                }
                else {
                    this.menu.removeClass('page-bottom');
                }
            }
            else {
                this.menu.removeAttr('style');
            }
        }
    });

    $.fn.pagemenu = function (settings) {
        this.each(function () {
            var elem = $(this),
                data = elem.data(),
                p = data.pagemenu;
            p || elem.data("pagemenu", new Pagemenu(this, $.extend({}, data, settings || {})));
        });
    };

    $(document).ready(function () {
        if ($('[data-plugin="pagemenu"]').length) {
            $('[data-plugin="pagemenu"]').pagemenu({});
        }
    });

}(jQuery));