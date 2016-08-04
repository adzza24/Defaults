$(document).ready(function () {

    /*Menu Expander*/
    $('.expander-js').click(function (event) {
        var t = $(this).next();
        var expElem = $(this);
        if (t.is('ul')) {
            var c = $(t).closest('ul.nav__subitem')
            if ($(c).is(":visible")) {
                $(c).velocity('slideUp', { duration: 300 });
                $(expElem).removeClass('open');
            } else {
                $(c).velocity('slideDown', { duration: 300 });
                $(expElem).addClass('open');
            }
        }
    });

    /*Main Nav Show/Hide*/
    $('.nav__toggle').click(function () {
        var navTog = $(this);
        var tS = $(navTog).data('toggle');
        var navElem = $('nav')
        if (tS == 'open') {
            $(navTog).data('toggle', 'closed').removeClass('open').velocity({
                rotateZ: "0deg"
            });
            $(navElem).velocity('slideUp', { duration: 300, easing: "easeIn" });
            $('header').removeClass('open');
        } else {
            $(navTog).data('toggle', 'open').addClass('open').velocity({
                rotateZ: "90deg"
            });
            $(navElem).velocity('slideDown', { duration: 300 });
            $('header').addClass('open');
        }
    });
});