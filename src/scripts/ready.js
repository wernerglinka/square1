/*jslint browser: true*/
/*global Event, jQuery, document, window, touchClick, hoverMenu, youTubeVideos, externalLinks, bannerBackground, scrollToTop, modalVideos, scrolledIntoView*/

(function ($) {
    'use strict';

    $(function () {
        touchClick.init();
        youTubeVideos.init();
        externalLinks.init();
        bannerBackground.init();
        scrollToTop.init();
        modalVideos.init();
        scrolledIntoView.init();
    });
    // end ready function
}(jQuery));


