(function (osd, $, undefined) {

    osd.config = {
        blurTimer: null,
        mobile: {
            width: 767
        }
    };

    osd.init = function () {

        //init scroll throttle
        $(window).throttle({
            throttleevent: 'scroll_throttle',
            throttle: 10
        });

        //add modernizr test for webkit browsers
        Modernizr.addTest('webkit', function () {
            return Modernizr.testProp('webkitAppearance');
        });

        $('body').addClass('has-js');

        //init scrollable
        $('[data-plugin=scrollable]').trigger('scrollable');

        //link scrollable with throttle
        $(document).on('scroll_throttle', function (e) {
            $('[data-plugin=scrollable]').trigger('scrollable');
        });

        //re-init scrollable on window resize event
        $(window).on('resize', function (e) {
            $('[data-plugin=scrollable]').scrollable('init');
        });

        //start custom scrolbars on open menu
        $('.menu-button, .overlay, .side-nav span').on('clickabled', function (event) {
            osd.util.initScrolls($('.side-nav'));
        });
        //kill custom scrolbars on open menu
        $('.menu-button, .overlay').on('unclickabled', function (event) {
            osd.util.killScrolls($('.side-nav'));
        });

        $('.search').clickable();

        //set search to focus into the search box when clicked
        $('.search').on('clickabled', function (e) {
            console.log("searching")
            typeof (e.event) == "object" && e.event.stopPropagation() && e.event.preventDefault();

            var input = $('.search-bar').find('input');
            input.focus();
        });

        $('.search').on('unclickabled', function () {
            $('body').removeClass('search-focus');
        });

        $('.search-bar input').on('focus', function () {
            $('.search-bar, #Overlay, body, .search-bar .cross, .search').addClass('active');
        });

        $('.search-dummy').click(function () {
            $('.search-bar input').focus();
        });


        //flexslider
        $(window).load(function () {
            $('.flexslider').flexslider({
                animation: "fade",
                selector: ".slides > .slide",
                start: function (slider) {
                    $(document).on('flex-pause', function () {
                        slider.pause();
                    });
                    $(document).on('flex-resume', function () {
                        slider.play();
                    });
                }
            });
        });

        //subnav mob
        $('.subnav-mob').on('click', function (e) {
            e.preventDefault;
            var nav = $(this).siblings('ul');
            if (nav.hasClass('open')){
                nav.removeClass('open')
                $(this).find('span').removeClass();
                $(this).find('span').addClass('icon-arrow-down');
            }
            else {
                nav.addClass('open')
                $(this).find('span').removeClass();
                $(this).find('span').addClass('icon-arrow-up');
            }
        });


        //init smooth scrolling for anchor links
        osd.util.smoothScroll();


        //equalheight
        $(window).load(function () {
            osd.util.equalheight('.equal-height');
        });
        $(window).resize(function () {
            osd.util.equalheight('.equal-height');
        });
        $('body').addClass('has-js');
    };

}(window.osd = window.osd || {}, jQuery))