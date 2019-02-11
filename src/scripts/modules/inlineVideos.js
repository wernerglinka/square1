/* global jQuery, YT, window, videoAPIReady, youTubePromise */

// function to play inline youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-start-time="10" data-end-time="140"></div>

const inlineVideos = (function ($, undefined) {
  const allVideos = $('.inline-video');
  const allPlayers = [];

  // initialize all video links when the player is ready
  const initVideoLinks = function () {
    allVideos.each(function (i) {
      const thisTrigger = $(this);

      thisTrigger.on('click', () => {
        allPlayers[i].playVideo();
      });
    });
  };

  const onPlayerStateChange = function (event) {
    // player states
    // "unstarted"               = -1
    // YT.PlayerState.ENDED      =  0
    // YT.PlayerState.PLAYING    =  1
    // YT.PlayerState.PAUSED     =  2
    // YT.PlayerState.BUFFERING  =  3
    // YT.PlayerState.CUED       =  5

    switch (event.data) {
      case YT.PlayerState.PAUSED:
        break;

      case YT.PlayerState.PLAYING:
        break;

      case YT.PlayerState.ENDED:
        $(event.target.a.parentElement).fadeOut();
        $(event.target.a.parentElement).prev().fadeIn();
        break;

      case YT.PlayerState.CUED:
        break;

      default:
    }
  };

  const init = function () {
    if (!$('body').hasClass('hasVideo')) {
      return;
    }

    // add all videos to the DOM
    allVideos.each(function (i) {
      const thisVideo = $(this);
      const thisVideoIndex = i;
      // add the thumbnail
      const thisVideoTnHTML = `<div class='video-tn'><img src='${thisVideo.data('video-tn')}' alt='' /></div>`;
      thisVideo.append(thisVideoTnHTML);
      // and the video
      const thisVideoHTML = `<div class='video-wrapper'><div id='linearVideo${thisVideoIndex}'></div></div>`;
      thisVideo.append(thisVideoHTML);
    });

    // initialize all inline video players on this page
    // videoAPIReady is a promise object for when the Youtube API has been loaded
    videoAPIReady.then(() => {
      console.log('init inline videos');
      allVideos.each((i) => {
        const videoID = allVideos.eq(i).data('video-id');
        const startTime = allVideos.eq(i).data('start-time');
        const endTime = allVideos.eq(i).data('end-time');
        const videoTarget = `linearVideo${i}`;

        // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
        const playerVars = {
          autoplay: 0, // start/stop via js commands
          start: startTime || null, // if no start or end time is specified go trom 0 to end
          end: endTime || null,
          controls: 1, // show video controls
          enablejsapi: 1, // enable the js api so we can control then player with js
          wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
          origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
          rel: 0 // disable other video suggestions after video end
        };

        // create the video player objects
        allPlayers[i] = new YT.Player(videoTarget, {
          videoId: videoID,
          playerVars,
          events: {
            onReady: initVideoLinks,
            onStateChange: onPlayerStateChange
          }
        });
      });

      // initially the video thumbnail is visible. on click fadeout the tn, show and play the video
      allVideos.each(function (i) {
        const thisVideo = $(this);
        thisVideo.find('.video-tn').on('click', function () {
          const thisVideoTn = $(this);
          thisVideoTn.fadeOut();
          thisVideoTn.next().fadeIn();
          allPlayers[i].playVideo();
        });
      });
    });
  };

  return {
    init
  };
}(jQuery));
