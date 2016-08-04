(function (osd, $, undefined) {

    //override console logging for incompatible browsers (i.e. IE)
    window.console = window.console || {
        log: function () { }
    }

    //trigger custom ready event
    $(document).trigger('osd_ready');

}(window.osd = window.osd || {}, jQuery));