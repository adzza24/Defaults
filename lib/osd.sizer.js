/* Copyright (c) 2015 Adam Anthony
 * Licensed under The MIT License (MIT) - http://opensource.org/licenses/MIT
*/

var Sizer = function (el, settings) {
    this.elem = $(el);
    settings = settings || {};
    this.config = $.extend({}, this.defaults, settings);
    this.init();
};
Sizer.prototype = {

    defaults: {
        target: null,
        height: 0,
        width: 0,
        timer: null,
        matchHeight: true,
        matchWidth: false,
        minwidth: 0,
        minheight: 0
    },

    init: function () {
        var self = this;
        var img = this.elem.find('img');
        if (img.length) {
            img.on('load.sizer', function () {
                self.resizer();
                clearTimeout(self.config.timer);
                self.config.timer = null;
            });
            this.config.timer = setTimeout(function () {
                img.unbind('load.sizer');
                self.resizer();
            }, 2000);
        }
        else {
            self.resizer();
        }
    },

    resizer: function (callback) {
        var self = this;

        self.controller();

        $(window, document).unbind('resize.sizer');
        $(window, document).one('resize.sizer', function () {
            clearTimeout(self.config.timer);
            self.config.timer = setTimeout(function () {
                self.resizer();
            }, 100);
        });

    },

    sizeHeight: function (height) {
        var self = this;
        this.config.height = 0;
        var targets = this.elem.add(this.config.target);
        targets.css({ "min-height": self.config.height + "px" });

        if (typeof height == "undefined") {
            targets.each(function () {
                self.config.height = $(this).outerHeight(true) > self.config.height ? $(this).outerHeight(true) : self.config.height;
            });
        } else {
            self.config.height = height;
        }


        targets.css({ "min-height": self.config.height + "px" });

    },
    sizeWidth: function (width) {
        var self = this;
        this.config.width = 0;
        var targets = this.elem.add(this.config.target);
        
        if (typeof width == "undefined") {
            targets.each(function () {
                self.config.width = $(this).outerWidth(true) > self.config.width ? $(this).outerWidth(true) : self.config.width;
            });
        } else {
            self.config.width = width;
        }

        
        targets.css({ "min-width": self.config.width + "px" });
    },

    controller: function () {
        if ( this.config.minwidth <= $(window).width() ) {
            this.config.matchHeight && this.sizeHeight();
            this.config.matchWidth && this.sizeWidth();
        } else {
            this.sizeWidth(0);
            this.sizeHeight(0);
        }
    }
};

$.fn.sizer = function (settings) {
    return this.each(function () {
        var el = $(this),
            s = el.data('sizer'),
            data = el.data();
        s ? s.init() : el.data('sizer', s = new Sizer(this, $.extend({}, settings, data)));
    });
};
