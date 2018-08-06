/*jslint browser: true*/
/*global Event, jQuery, document, window, touchClick, hoverMenu, inlineVideos, externalLinks, bannerBackground, scrollToTop, modalVideos, scrolledIntoView, modalVideosNew*/

(function ($) {
    'use strict';

    $(function () {
        touchClick.init();
        inlineVideos.init();
        externalLinks.init();
        bannerBackground.init();
        scrollToTop.init();
        modalVideos.init();
        scrolledIntoView.init();
    });
    // end ready function
}(jQuery));


