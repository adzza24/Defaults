(function (util, $, undefined) {

    util.config = {
        animQueue: [],
        queueTimer: null
    };

    util.affix0IfLessThan10 = function (value) {
        return value < 10 ? '0' + value : value;
    };

    util.dateToUKString = function (date) {
        return util.affix0IfLessThan10(date.getDate()).toString().concat('/',
            util.affix0IfLessThan10(date.getMonth()), '/',
            date.getFullYear());
    };

    util.UKdateStringToUSDateString = function (dateString) {
        var fragments = dateString.split('/');
        return fragments[1].concat('/', fragments[0], '/', fragments[2]);
    };

    util.initDatePicker = function (elements, settings) {

        var config = {
            dateFormat: 'dd/mm/yy'
        };

        $.extend(config, settings);

        elements.prop('type', 'text').attr('data-input-type', 'date').attr('readonly', true);
        elements.datepicker(config);

        $('#ui-datepicker-div').hide();

    };

    util.smoothScroll = function () {
        $('a[href*=#]:not([href=#])').click(function () {

            if (!$(this).data('preventscroll')) {
                if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, 1000);
                        return false;
                    }
                }
            }
        });
    };

    util.queuePlay = function (settings) {
        var config = {
            delay: 0,
            override: false,
            speed: 600,

            runningQueue: false
        };
        $.extend(config, settings);
        if (!config.runningQueue || config.override) {
            clearTimeout(util.config.queueTimer);
            util.config.queueTimer = setTimeout(function () {
                config.runningQueue = true;
                $(util.config.animQueue[0]).animate({ 'opacity': '1' }, {
                    duration: config.speed,
                    start: function () {
                        util.config.animQueue.shift();
                        if (util.config.animQueue.length == 0) {
                            config.runningQueue = false;
                        }
                        else {
                            util.queuePlay({ delay: config.delay, override: true });
                        }
                    }
                });
            }, config.delay);
        }
    };

    util.preventPaste = function (selector) {
        $(selector).bind("paste", function (e) {
            e.preventDefault();
        });
    }

    util.validateOnBlur = function (formSelector) {
        var event = 'blur';

        $(formSelector).is('select') && (event = 'change');

        $(formSelector).on(event, function (e) {
            $(e.target).valid();
        });
    }

    util.validateOnSelect = function (formSelector) {

    }

    util.cleanSpaces = function (string) {
        return string.replace(/\s/g /* all kinds of spaces*/, " " /* ordinary space */);
    }

    util.initScrolls = function (elements, opts) {
        elements = typeof(elements) == "object" ? elements : $(elements);
        if (elements.length > 0) {

            //kill the scrolls
            util.killScrolls();
            
            opts = opts || {};

            //init the scrolls
            scroller = {};
            scroller.scrolls = elements.niceScroll(opts).hide();
            scroller.data = {};
            scroller.data.element = elements;
            
            //get the position of the elements - if absolute, then the top position won't work
            var pos = elements.parent().css('position');
            pos == "relative" && pos == elements.css('position');

            //Set to update on a timeout because otherwise chrome gets the wrong positioning
            window.setTimeout(function () {

                //check if the element needs scrollbars
                if (elements[0].offsetHeight < elements[0].scrollHeight) {
                    //find the scrollbars in the document
                    var scrollBars = $('.nicescroll-rails');
                    //if they exist
                    if (typeof (scrollBars.offset()) !== 'undefined' && scrollBars.length > 0) {
                        var top = elements.offset().top;
                        var left = elements.offset().left + elements.outerWidth(true) - $('.nicescroll-rails').width();
                        //if the position is absolute then we have to reset the top to be relative to the parent
                        if (pos === "absolute") {
                            top -= elements.offsetParent().offset().top;
                        }
                        if (pos === "fixed") {
                            top = elements.offsetParent().offset().top;
                            
                            left = elements.offsetParent().offset().left + elements.outerWidth(true);
                        }

                        scrollBars.css({ 'top': top, 'left': left });
                        //console.log(top)
                        scrollBars.fadeIn(100);
                    }
                    else if (typeof (scrollBars.offset) == 'undefined') {
                        console.log('scrollbars are undefined');
                    }
                }
            }, 500);
            $(window).one('resize', function () {
                util.initScrolls(elements);
            });
        }
    };

    util.killScrolls = function () {

        //console.log('kill scrolls');

        try {
            if (scroller.scrolls) {
                scroller.data.element.removeAttr('style');
                scroller.scrolls.remove();
                scroller = {};

            }
        }
        catch (e) { }
    };

    util.redirect = function (seconds, url) {
        if (url.length) {

            url = decodeURIComponent(url);
            
            var clock = typeof seconds == "object"
                            ? parseInt(seconds.html())
                            : typeof seconds == "number"
                                ? seconds
                                : 0;

            var timer = clock - 1;
            typeof seconds == "object" && seconds.html(timer) ||
            typeof seconds == "number" && (seconds = timer);
        
            window.setTimeout(function () {
                if (timer <= 0) {
                    window.location = url;
                }
                else {
                    util.redirect(seconds, url);
                }

            }, 1000);
        }
    };

    util.getQueryString = function () {
        var queryString = {};
        var query;
        var queries = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < queries.length; i++) {
            query = queries[i].split('=');
            queryString[query[0]] = query[1];
        }
        return queryString;
    };

    util.validateDate = function (day, month, year) {

        var date = new Date(year, month - 1, day);
        return (date.getFullYear() == year && date.getMonth() + 1 == month && date.getDate() == day);
    };

    util.getReturnURL = function () {
        var queryString = [];
        queryString = msd.util.getQueryString();

        if (queryString.length > 0) {
            for (var i in queryString) {
                if (queryString[i].name == "RedirectionUrl") {
                    return queryString[i].value;
                }
                else if (i == queryString.length - 1) {
                    return null;
                }
            }
        }
    };

    util.parseJsonDate = function (dateString) {
        if (typeof dateString === 'undefined' || dateString === null) {
            return '';
        }
        var date = new Date(dateString);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };

    util.equalheight = function (container) {
        var elems = $(container);
        if (elems.length) {
            var currentTallest = 0,
                currentRow,
                row;

            elems.each(function () {
                var $el = $(this);
                var topPosition = $el.position().top;
                $el.height('auto');

                if (currentRow != topPosition) {
                    //if we ran any elements already, set their height
                    row && row.length && row.height(currentTallest);

                    //reset the current row, tallest height and remove all elements from 'row'
                    row = $el, currentRow = topPosition, currentTallest = $el.height();
                } else {
                    //if we are still on the same row, add this element to the row and test its height
                    row = row.add($el);
                    currentTallest = currentTallest < $el.height() ? $el.height() : currentTallest;
                }
                //set the height if we have more than 1 element, otherwise it will already be the correct height
                if (row.length > 1) {
                    row.height(currentTallest);
                }
            });
        }
    };

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                  ? args[number]
                  : match
                ;
            });
        };
    }

}(window.osd.util = window.osd.util || {}, jQuery));