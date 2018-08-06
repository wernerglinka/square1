/*jsLint es6 */
/* global YT*/

// reference: https://developers.google.com/youtube/iframe_api_reference
// useful tutorial: https://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript

var modalVideosNew = (function($, undefined) {
    "use strict";
    let modalVideoTriggers = $(".modal-video");
    let player;
    let videoOverlay;

    let init = function() {
        if (!$("body").hasClass("hasVideo")) {
            return;
        }

        // on videoAPIReady we add a video overlay and create a video player
        // in div#ytvideo
        $(window).on("videoAPIReady", function() {
            // create an video overlay
            $("body").append(`
            <div id="video-overlay" class="video-overlay">
                <i class="icon icon-x"></i>
                <div class="responsive-wrapper">
                    <div class="video-container">
                        <div id="ytvideo"></div>
                    </div>
                </div>
            </div>`);

            videoOverlay = $('#video-overlay');
            let videoID = modalVideoTriggers.eq(0).data('video-id'); // the first video link
            // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            let playerVars = {
                autoplay: 0,                    // start/stop via js commands
                controls: 1,                    // show video controls
                enablejsapi: 1,                 // enable the js api so we can control then player with js
                wmode: 'opaque',                // allow other elements to cover video, e.g. dropdowns or pop-ups
                origin: window.location.origin, // prevent Failed to execute 'postMessage' on 'DOMWindow' error
                rel: 0                          // disable other video suggestions after video end
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
    let initVideoLinks = function (event) {
        videoOverlay = $('#video-overlay');
        let closeVideoOverlay = videoOverlay.find('.icon-x');

        modalVideoTriggers.each( function (i) {
            let thisTrigger = $(this);
            let requestedVideoID = thisTrigger.data('video-id');

            // turn data-video-link into a href attribute and remove disabled attribute
            thisTrigger
                .attr('href', thisTrigger.data('video-link'))
                .removeAttr('data-video-link')
                .removeAttr('disabled');

            thisTrigger.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                videoOverlay.fadeIn(400);

                // load the appropriate video ID
                // if the requested videoID is equal to what the player has already loaded
                // then just play the video else load the new video and then play it
                if ( requestedVideoID === player.getVideoEmbedCode() ) {
                    player.playVideo();
                } else {
                    player.loadVideoById({videoId: requestedVideoID});
                }
                // we might have muted a previous video. set the default level
                player.setVolume(50);
            });
        });

        // fadeout sound as we close the overlay
        closeVideoOverlay.on('click', function () { 
            let currentVolume = player.getVolume();
            let fadeout = setInterval( function () {
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

    let onPlayerStateChange = function (event) {
        videoOverlay = $('#video-overlay');

        // player states
        // "unstarted"               = -1
        // YT.PlayerState.ENDED      =  0
        // YT.PlayerState.PLAYING    =  1
        // YT.PlayerState.PAUSED     =  2
        // YT.PlayerState.BUFFERING  =  3
        // YT.PlayerState.CUED       =  5

        console.log(event.data);

        switch ( event.data ) {
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
    }
})(jQuery);