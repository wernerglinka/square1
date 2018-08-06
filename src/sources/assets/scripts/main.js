"use strict";

/*jslint browser: true*/
/*global jQuery, undefined, window */

// function for change nav background opacity when banner is scrolled up
var bannerBackground = function ($, undefined) {
    "use strict";

    var bannerHeight = $(".banner").height(),
        hasBanner = $(".has-page-banner").length,
        init = function init() {
        if (hasBanner) {
            $(window).scroll(function () {
                var thisWindow = $(window),
                    thisHeader = $("header");
                if (thisWindow.scrollTop() >= bannerHeight && !thisHeader.hasClass("noOpacity")) {
                    thisHeader.addClass("noOpacity");
                }
                if (thisWindow.scrollTop() < bannerHeight && thisHeader.hasClass("noOpacity")) {
                    thisHeader.removeClass("noOpacity");
                }
            });
        }
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*jslint browser: true, this: true*/
/*global jQuery, undefined, window */

// function to add "target='_blank'" to all external links
var externalLinks = function ($, undefined) {
    "use strict";

    var allExternalLinks = $('a[href^="http://"], a[href^="https://"]');
    var init = function init() {
        allExternalLinks.each(function () {
            var thisExternalLink = $(this);
            thisExternalLink.attr("target", "_blank");
        });
    };
    return {
        init: init
    };
}(jQuery);
"use strict";

/* global YT*/
/*eslint no-unused-vars: 0*/

var modalVideos = function ($, undefined) {
    "use strict";

    var init = function init() {
        var modalVideoTriggers = $(".modal-video");

        if (!$("body").hasClass("hasVideo")) return;
        var overlay = $('<div id="overlay"><i class="icon icon-x"></i><div class="responsive-wrapper"><div class="video-container"></div></div></div>');
        var allPlayers = [];

        // append the overlay html
        $("body").append(overlay);
        // attach click handler to each video link
        modalVideoTriggers.each(function (i) {
            var thisVideoTrigger = $(this);
            var videoIndex = i;

            thisVideoTrigger.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                // fade in overlay
                $("#overlay").fadeIn();
                var thisVideo = $(this);
                var videoID = thisVideo.data("video-id");
                var videoAttr = thisVideo.data("video-attr");
                var videoHTML = "<iframe id='playerModal" + videoIndex + "' src='https://www.youtube.com/embed/" + videoID + "?enablejsapi=1&rel=0&autoplay=1" + (videoAttr ? "&" + videoAttr : "") + "' frameborder='0'></iframe>";
                $(".video-container").append(videoHTML);
            });
        });

        // on click on close icon close overlay
        $("#overlay").find(".icon-x").on("click", function () {
            var thisOverlay = $(this).parent();
            // remove the current video
            thisOverlay.find(".video-container").empty();
            // and fadeout the overlay
            thisOverlay.fadeOut();
        });

        // initialize all video players on a page
        $(window).on("videoAPIReady", function () {
            modalVideoTriggers.each(function (i) {
                allPlayers[i] = new YT.Player("playerModal" + i, {
                    events: {
                        onStateChange: function onStateChange(event) {
                            //if (event.data === YT.PlayerState.PAUSED) {
                            //}
                            //if (event.data === YT.PlayerState.PLAYING) {
                            //}
                            if (event.data === YT.PlayerState.ENDED) {
                                // get the player ID
                                var currentPlayer = $("#" + event.target.a.id);
                                var videoTn = currentPlayer.parent().prev();
                                currentPlayer.parent().fadeOut();
                                videoTn.fadeIn();
                            }
                        }
                    }
                });
            });

            modalVideoTriggers.each(function (i) {
                var thisVideo = $(this);
                thisVideo.find(".video-tn").on("touchclick", function () {
                    allPlayers[i].playVideo();
                });
            });
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*jsLint es6 */
/* global YT*/

// reference: https://developers.google.com/youtube/iframe_api_reference
// useful tutorial: https://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript

var modalVideosNew = function ($, undefined) {
    "use strict";

    var modalVideoTriggers = $(".modal-video");
    var player = void 0;
    var videoOverlay = void 0;

    var init = function init() {
        if (!$("body").hasClass("hasVideo")) {
            return;
        }

        // on videoAPIReady we add a video overlay and create a video player
        // in div#ytvideo
        $(window).on("videoAPIReady", function () {
            // create an video overlay
            $("body").append("\n            <div id=\"video-overlay\" class=\"video-overlay\">\n                <i class=\"icon icon-x\"></i>\n                <div class=\"responsive-wrapper\">\n                    <div class=\"video-container\">\n                        <div id=\"ytvideo\"></div>\n                    </div>\n                </div>\n            </div>");

            videoOverlay = $('#video-overlay');
            var videoID = modalVideoTriggers.eq(0).data('video-id'); // the first video link
            // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            var playerVars = {
                autoplay: 0, // start/stop via js commands
                controls: 1, // show video controls
                enablejsapi: 1, // enable the js api so we can control then player with js
                wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
                origin: window.location.origin, // prevent Failed to execute 'postMessage' on 'DOMWindow' error
                rel: 0 // disable other video suggestions after video end
            };

            player = new YT.Player('ytvideo', {
                videoId: videoID,
                playerVars: playerVars,
                events: {
                    'onReady': initVideoLinks,
                    'onStateChange': onPlayerStateChange
                }
            });
            // store the current videoIOD for future use
            player.currentVideoID = videoID;
        });
    };

    // when the player is ready we initialize all video links
    var initVideoLinks = function initVideoLinks(event) {
        videoOverlay = $('#video-overlay');
        var closeVideoOverlay = videoOverlay.find('.icon-x');

        modalVideoTriggers.each(function (i) {
            var thisTrigger = $(this);
            var requestedVideoID = thisTrigger.data('video-id');

            // turn data-video-link into a href attribute and remove disabled attribute
            thisTrigger.attr('href', thisTrigger.data('video-link')).removeAttr('data-video-link').removeAttr('disabled');

            thisTrigger.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                videoOverlay.fadeIn(400);

                // load the appropriate video ID
                // if the requested videoID is equal to what the player has already loaded
                // then just play the video else load the new video and then play it
                if (requestedVideoID === player.getVideoEmbedCode()) {
                    player.playVideo();
                } else {
                    player.loadVideoById({ videoId: requestedVideoID });
                }
                // we might have muted a previous video. set the default level
                player.setVolume(50);
            });
        });

        // fadeout sound as we close the overlay
        closeVideoOverlay.on('click', function () {
            var currentVolume = player.getVolume();
            var fadeout = setInterval(function () {
                if (currentVolume <= 0) {
                    // use pauseVideo rather than stopVideo to minimize
                    // previous video flashes when starting the new video
                    player.pauseVideo();
                    clearInterval(fadeout);
                }
                currentVolume = currentVolume - 5;
                player.setVolume(currentVolume);
            }, 100);
            videoOverlay.fadeOut();
        });
    };

    var onPlayerStateChange = function onPlayerStateChange(event) {
        videoOverlay = $('#video-overlay');

        // player states
        // "unstarted"               = -1
        // YT.PlayerState.ENDED      =  0
        // YT.PlayerState.PLAYING    =  1
        // YT.PlayerState.PAUSED     =  2
        // YT.PlayerState.BUFFERING  =  3
        // YT.PlayerState.CUED       =  5

        console.log(event.data);

        switch (event.data) {
            case YT.PlayerState.PAUSED:
                break;

            case YT.PlayerState.PLAYING:
                break;

            case YT.PlayerState.ENDED:
                videoOverlay.fadeOut();
                break;

            case YT.PlayerState.CUED:
                console.log('I think I am ready again');
                break;
        }
    };

    return {
        init: init
    };
}(jQuery);
'use strict';

/*jslint es6*/
/*global jQuery, window*/

var scrolledIntoView = function ($, undefined) {
    "use strict";

    var init = function init() {
        var animateWhenInView = $('.initial');

        $(window).scroll(function () {

            if (animateWhenInView.length) {
                animateWhenInView.each(function () {
                    var thisElement = $(this);

                    if (intoView(thisElement) && thisElement.hasClass('initial')) {
                        thisElement.removeClass('initial');
                    }
                });
            }
        });
    };

    var intoView = function intoView(element) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elementTop = $(element).offset().top;
        return elementTop <= docViewBottom && elementTop >= docViewTop;
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// the scroll to top function for long pages
var scrollToTop = function ($, undefined) {
    var hasToTop = $("#toTop").length;
    var toTop = $("#toTop");
    var TO_TOP_VISIBLE = 400;

    var init = function init() {
        if (hasToTop) {
            toTop.on("touchclick", function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 500, "easeOutCubic");
                return false;
            });
            // hide scroll icon if content is at top already
            // normally we would check for $(window).scrollTop() but IE8 always return 0, what else is new
            if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                $("#toTop").hide();
            }
            // update scroll icon if window is resized
            $(window).resize(function () {
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $("#toTop").hide();
                }
            });
            // manage scroll icon when scrolling
            $(window).scroll(function () {
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $("#toTop").fadeOut(400);
                } else {
                    $("#toTop").fadeIn(400);
                }
            });
        }
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to extend jQuery event >> touchclick for touch and click
var touchClick = function ($, undefined) {
    "use strict";

    var init = function init() {
        var isMobile = false;
        if ($("html").hasClass("touch")) {
            isMobile = true;
        }
        //var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        var eventType = isMobile ? "touchstart" : "click";

        $.event.special.touchclick = {
            bindType: eventType,
            delegateType: eventType
        };
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*jslint es6*/
/*global jQuery, YT, window*/

// function to play youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-additional-attributes="?enablejsapi=1&rel=0"></div>
var youTubeVideos = function ($, undefined) {
    "use strict";

    var allVideos = $(".youtube-video");

    var _getTnHTML = function _getTnHTML(videoTn) {
        var videoHTML = "<div class='video-tn'>";
        videoHTML += "<img src='" + videoTn + "' alt='' />";
        videoHTML += "</div>";
        return videoHTML;
    };

    var _getVideoHTML = function _getVideoHTML(videoID, videoIndex, addAttr) {
        var videoHTML = "<div class='video-wrapper'>";
        var addAttributes = addAttr ? addAttr : "";
        videoHTML += "<iframe id='player" + videoIndex + "' src='https://www.youtube.com/embed/" + videoID + addAttributes + " frameborder='0'></iframe>";
        videoHTML += "</div>";
        return videoHTML;
    };

    var init = function init() {
        var allPlayers = [];

        // add all videos to the DOM
        allVideos.each(function (i) {
            var thisVideo = $(this);
            var thisVideoIndex = i;
            // add the thumbnail
            var thisVideoTnHTML = _getTnHTML(thisVideo.data("video-tn"));
            thisVideo.append(thisVideoTnHTML);
            // and the video
            var thisVideoHTML = _getVideoHTML(thisVideo.data("video-id"), thisVideoIndex, thisVideo.data("additional-attributes"));
            thisVideo.append(thisVideoHTML);
        });

        // initialize all video players on a page
        // videoAPIReady is a custom event triggered when the Youtube API has been loaded
        $(window).on("videoAPIReady", function () {
            allVideos.each(function (i) {
                allPlayers[i] = new YT.Player("player" + i, {
                    events: {
                        "onStateChange": function onStateChange(event) {
                            //if (event.data === YT.PlayerState.PAUSED) {}
                            //if (event.data == YT.PlayerState.PLAYING) {}
                            if (event.data == YT.PlayerState.ENDED) {
                                // get the player ID
                                var currentPlayer = $("#" + event.target.a.id);
                                var videoTn = currentPlayer.parent().prev();
                                currentPlayer.parent().fadeOut();
                                videoTn.fadeIn();
                            }
                        }
                    }
                });
            });

            // initially the video thumbnail is visible. on click fadeout the tn, show and play the video]
            allVideos.each(function (i) {
                var thisVideo = $(this);
                thisVideo.find(".video-tn").on("touchclick", function () {
                    var thisVideoTn = $(this);
                    thisVideoTn.fadeOut();
                    thisVideoTn.next().fadeIn();
                    allPlayers[i].playVideo();
                });
            });
        });
    };

    return {
        init: init
    };
}(jQuery);
'use strict';

/*jslint browser: true*/
/*global Event, jQuery, document, window, touchClick, hoverMenu, youTubeVideos, externalLinks, bannerBackground, scrollToTop, modalVideos, scrolledIntoView, modalVideosNew*/

(function ($) {
    'use strict';

    $(function () {
        touchClick.init();
        youTubeVideos.init();
        externalLinks.init();
        bannerBackground.init();
        scrollToTop.init();
        modalVideosNew.init();
        scrolledIntoView.init();
    });
    // end ready function
})(jQuery);
//# sourceMappingURL=main.js.map
