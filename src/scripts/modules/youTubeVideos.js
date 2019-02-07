/* global jQuery, YT, window */

// function to play youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-additional-attributes="?enablejsapi=1&rel=0"></div>
const youTubeVideos = (function ($, undefined) {
  const allVideos = $('.youtube-video');

  const _getTnHTML = function (videoTn) {   //eslint-disable-line
    let videoHTML = "<div class='video-tn'>";
    videoHTML += `<img src='${videoTn}' alt='' />`;
    videoHTML += '</div>';
    return videoHTML;
  };

  const _getVideoHTML = function (videoID, videoIndex, addAttr) {   //eslint-disable-line
    let videoHTML = "<div class='video-wrapper'>";
    const addAttributes = addAttr || '';
    videoHTML += `<iframe id='player${videoIndex}' src='https://www.youtube.com/embed/${videoID}${addAttributes} frameborder='0'></iframe>`;
    videoHTML += '</div>';
    return videoHTML;
  };

  const init = function () {
    const allPlayers = [];

    // add all videos to the DOM
    allVideos.each(function (i) {
      const thisVideo = $(this);
      const thisVideoIndex = i;
      // add the thumbnail
      const thisVideoTnHTML = _getTnHTML(thisVideo.data('video-tn'));
      thisVideo.append(thisVideoTnHTML);
      // and the video
      const thisVideoHTML = _getVideoHTML(thisVideo.data('video-id'), thisVideoIndex, thisVideo.data('additional-attributes'));
      thisVideo.append(thisVideoHTML);
    });

    // initialize all video players on a page
    // videoAPIReady is a custom event triggered when the Youtube API has been loaded
    $(window).on('videoAPIReady', () => {
      allVideos.each((i) => {
        allPlayers[i] = new YT.Player(`player${i}`, {
          events: {
            onStateChange(event) {
              // if (event.data === YT.PlayerState.PAUSED) {}
              // if (event.data == YT.PlayerState.PLAYING) {}
              if (event.data === YT.PlayerState.ENDED) {
                // get the player ID
                const currentPlayer = $(`#${event.target.a.id}`);
                const videoTn = currentPlayer.parent().prev();
                currentPlayer.parent().fadeOut();
                videoTn.fadeIn();
              }
            }
          }
        });
      });

      // initially the video thumbnail is visible. on click fadeout the tn, show and play the video
      allVideos.each(function (i) {
        const thisVideo = $(this);
        thisVideo.find('.video-tn').on('touchclick', function () {
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
