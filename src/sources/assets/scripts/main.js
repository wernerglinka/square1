'use strict';

/*
    global window, document
*/

// function for change nav background opacity when banner is scrolled up
var bannerBackground = function (d) {
  var banner = d.querySelector('.banner');
  var bannerHeight = void 0;

  if (banner) {
    bannerHeight = d.querySelector('.banner').getBoundingClientRect().height;
  }

  var hasBanner = d.body.classList.contains('has-page-banner');

  var init = function init() {
    if (hasBanner) {
      window.addEventListener('scroll', function () {
        var doc = d.documentElement;
        var thisHeader = d.querySelector('header');

        if ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0) >= bannerHeight && !thisHeader.classList.contains('noOpacity')) {
          thisHeader.classList.add('noOpacity');
        }
        if ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0) < bannerHeight && thisHeader.classList.contains('noOpacity')) {
          thisHeader.classList.remove('noOpacity');
        }
      });
    }
  };

  return { init: init };
}(document);
'use strict';

/*
  global document, window
*/

/**
 *  Function to add "target='_blank'" to all external links
 *  External links must include their protocol identifier, e.g. http or https
 */
var externalLinks = function (d) {
  var allExternalLinks = Array.from(d.querySelectorAll('a[href^="http://"], a[href^="https://"]'));

  var init = function init() {
    allExternalLinks.forEach(function (link) {
      link.setAttribute('target', '_blank');
    });
  };
  return { init: init };
}(document);
'use strict';

/*
  global $, document, body, window, Event, YT, location, Image, setInterval, localStorage,
  fetch, CustomEvent
*/

/**
 * function to get an image list from the server
 */
var getImageList = function () {
  var init = function init() {
    var imagesFolder = '/assets/images/image-widget/imagelist.json';

    // get the image list
    fetch(imagesFolder).then(function (response) {
      return response.json();
    }).then(function (myJson) {
      // trigger images available event
      var imageAvailable = new CustomEvent('grid_images_available', { detail: myJson });
      var gridContainer = document.querySelector('#responsive-grid-container');
      gridContainer.dispatchEvent(imageAvailable);
    });
  };
  return { init: init };
}();

/**
 * function to build the image grid
 */
var buildImageGrid = function () {
  var init = function init(data) {
    var IMAGE_PATH = '/assets/images/image-widget/';

    // build array with path to all images
    var initilAllImageSCRs = data.map(function (imageName) {
      return IMAGE_PATH + imageName;
    });

    // shuffle array randomly - always start with a different image set
    // source: https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4
    var allImageSCRs = initilAllImageSCRs.map(function (a) {
      return [Math.random(), a];
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).map(function (a) {
      return a[1];
    });

    // load initial images into displayImagesArray
    var DISPLAY_ARRAY_SIZE = 9;
    var displayImagesArray = allImageSCRs.slice(0, DISPLAY_ARRAY_SIZE);

    // build widget HTML
    var imageGridHTML = "<ul class='image-grid'>";
    displayImagesArray.forEach(function (imageSRC) {
      imageGridHTML += '<li><img src="' + imageSRC + '"/></li>';
    });
    imageGridHTML += '</ul>';

    // reset local storage so we always start at undefined
    localStorage.removeItem('updateNext');

    // insert widget HTML into DOM
    // this will overwrite the loading animation with the image grid
    var responsiveImageGridContainer = document.querySelector('#responsive-grid-container');
    responsiveImageGridContainer.innerHTML = imageGridHTML;

    // create a new custom event 'images_widget_done' and dispatch on responsiveImageGridContainer
    var widgetDone = new CustomEvent('images_widget_done', { detail: { allImageSCRs: allImageSCRs, displayImagesArray: displayImagesArray } });
    responsiveImageGridContainer.dispatchEvent(widgetDone);
  };

  return { init: init };
}();

var autoUpdateImageGrid = function () {
  /**
   * function to update the image display grid
   * the following steps are taken:
   * 1 generate a new random display grid location index
   * 2 load the first image from the array "allImageSRCs" into the display grid
   *   this image will be placed behind the existing images at this location - using
   *   cycle time to load the image
   * 3 at the next cycle, we apply a transition animation class to the existing image
   *   to start a css transition making the new image visible
   *   also load the next new image for a different display grid location,
   *   starting the cycle for this image
   * 4 tag the existing image for deletion
   * 5 at the next cycle delete the previous image
    * @param {obj} data
   */
  var loop = function loop(data) {
    // array of all available images
    var displayImageSCRs = data.displayImagesArray.slice();
    // remove the image urls that are already in the display array
    var allImageSRCs = data.allImageSCRs.slice().filter(function (url) {
      return !displayImageSCRs.includes(url);
    });
    // indexArray is used to insure that we swap all images in the display within a 9 images cycle
    var indexArray = [];

    // function to provide a new index
    var newIndex = function newIndex(max) {
      var newPositionIndex = void 0;
      var getNewIndex = true;

      while (getNewIndex) {
        // generate a new index
        newPositionIndex = parseInt(Math.random() * max, 10);

        // check if we already used this index in this update cycle (9 image swaps)
        if (!indexArray.includes(newPositionIndex)) {
          // push this index to indexArray se don't use it again
          indexArray.push(newPositionIndex);

          if (indexArray.length === max) {
            indexArray = [];
          }
          getNewIndex = false;
        }
      }
      return newPositionIndex;
    };

    // we will always use the first element in the images array to add to the display array
    // then we will remove images[0] for this cycle
    var updateImage = function updateImage(images, display) {
      var displayArray = display;
      var imageGrid = document.querySelector('.image-grid');
      var imageGridIndex = 0;
      var allAnimations = ['zoom-out', 'slide-right', 'slide-left', 'slide-down', 'slide-up', 'fade-out', 'slide-out-top-right', 'slide-out-top-left', 'slide-out-bottom-right', 'slide-out-bottom-left'];

      // generate a new random index for the display
      imageGridIndex = newIndex(displayArray.length);

      // update displayImage array
      // we just use the first element in the images array
      // images[0] will them be rem,oved for this cycle
      displayArray[imageGridIndex] = images[0];

      // update the image
      // prepend image, browser stacking order will show last image
      var newImage = new Image();
      newImage.src = images[0];
      imageGrid.querySelectorAll('li')[imageGridIndex].prepend(newImage);

      // remove the new image from top of allImageSRCs as we do not want to
      // use it again in this display cycle
      images.splice(0, 1);

      // garbage time, remove image tagged for deletion
      var removeElement = imageGrid.querySelector('.to-be-deleted');
      if (removeElement) {
        removeElement.remove();
      }

      // we have loaded an image right behind the existing one and wait a cycle before we update
      // that spot, thus giving us time to download the image
      if (localStorage.updateNext) {
        var updateNow = parseInt(localStorage.updateNext, 10);
        var animationIndex = Math.floor(Math.random() * Math.floor(allAnimations.length));

        // js equavilent to jQuery "imageGrid.find('li').eq(updateNow).find('img').eq(1)
        var elementToBeRemoved = imageGrid.querySelectorAll('li')[updateNow].querySelectorAll('img')[1];

        // apply transition class and tag for deletion
        // first time around there will not be an "elementToBeRemoved"
        if (typeof elementToBeRemoved !== 'undefined') {
          elementToBeRemoved.classList.add(allAnimations[animationIndex], 'to-be-deleted');
        }
      }
      localStorage.updateNext = imageGridIndex;
    };

    // select the first image
    updateImage(allImageSRCs, displayImageSCRs);

    setInterval(function () {
      updateImage(allImageSRCs, displayImageSCRs);
      if (allImageSRCs.length === 0) {
        // reload all image scrs but exclude the images that are already in the display grid
        allImageSRCs = data.allImageSCRs.slice().filter(function (url) {
          return !displayImageSCRs.includes(url);
        });
      }
    }, 2000);
  };
  return {
    loop: loop
  };
}();
'use strict';

/* jslint es6, this:true */
/* global jQuery, YT, window */

// function to play inline youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-start-time="10" data-end-time="140"></div>

var inlineVideos = function ($, undefined) {
  var allVideos = $('.inline-video');
  var allPlayers = [];

  // initialize all video links when the player is ready
  var initVideoLinks = function initVideoLinks() {
    allVideos.each(function (i) {
      var thisTrigger = $(this);

      thisTrigger.on('click', function () {
        allPlayers[i].playVideo();
      });
    });
  };

  var onPlayerStateChange = function onPlayerStateChange(event) {
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

  var init = function init() {
    // add all videos to the DOM
    allVideos.each(function (i) {
      var thisVideo = $(this);
      var thisVideoIndex = i;
      // add the thumbnail
      var thisVideoTnHTML = '<div class=\'video-tn\'><img src=\'' + thisVideo.data('video-tn') + '\' alt=\'\' /></div>';
      thisVideo.append(thisVideoTnHTML);
      // and the video
      var thisVideoHTML = '<div class=\'video-wrapper\'><div id=\'linearVideo' + thisVideoIndex + '\'></div></div>';
      thisVideo.append(thisVideoHTML);
    });

    // initialize all video players on a page
    // videoAPIReady is a custom event triggered when the Youtube API has been loaded
    $(window).on('videoAPIReady', function () {
      allVideos.each(function (i) {
        var videoID = allVideos.eq(i).data('video-id');
        var startTime = allVideos.eq(i).data('start-time');
        var endTime = allVideos.eq(i).data('end-time');
        var videoTarget = 'linearVideo' + i;

        // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
        var playerVars = {
          autoplay: 0, // start/stop via js commands
          start: startTime || null, // if no start or end time is specified go trom 0 to end
          end: endTime || null,
          controls: 1, // show video controls
          enablejsapi: 1, // enable the js api so we can control then player with js
          wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
          origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
          rel: 0 // disable other video suggestions after video end
        };

        // create the video player object
        allPlayers[i] = new YT.Player(videoTarget, {
          videoId: videoID,
          playerVars: playerVars,
          events: {
            onReady: initVideoLinks,
            onStateChange: onPlayerStateChange
          }
        });
      });

      // initially the video thumbnail is visible. on click fadeout the tn, show and play the video
      allVideos.each(function (i) {
        var thisVideo = $(this);
        thisVideo.find('.video-tn').on('click', function () {
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

/* jsLint es6, this: true */
/* global YT, jQuery, window */

var marketoModal = function ($) {
  var init = function init() {
    var marketoTriggers = $('.marketo-modal-trigger');
    var marketoFormContainer = $('.marketo-form-container');

    // load the Marketo Forms2 library
    $.getScript('//app-sj13.marketo.com/js/forms2/js/forms2.min.js');

    // on touchclick we open on overlay and load the form
    marketoTriggers.on('touchclick', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var thisMarketoTrigger = $(this);
      var marketoFormTitle = thisMarketoTrigger.data('marketo-title');
      var marketoFormID = thisMarketoTrigger.data('marketo-id');
      var marketoTarget = '<div class="inner"><h2>' + marketoFormTitle + '</h2><form id=\'mktoForm_' + marketoFormID + '\' class=\'clearfix\'></form></div>';

      marketoFormContainer.append(marketoTarget);

      MktoForms2.loadForm('//app-sjst.marketo.com', '785-UHP-775', marketoFormID, function (form) {
        // >>>>> NEED TO ADD A THANK YOU MESSAGE

        // add onSuccess callback
        form.onSuccess(function () {
          // hide overlay after successful submission
          marketoFormContainer.find('.inner').remove();
          marketoFormContainer.fadeOut();

          // return false to prevent redirection to thank you page
          return false;
        });

        // add class so we can position the GDPR consent checkbox
        $('[for^="GDPR_Consent"]').parents('.mktoFormRow').addClass('gdpr-consent');

        // remove the external stylesheets
        var links = window.document.getElementsByTagName('link');
        $(links).each(function () {
          var thisLinkElement = $(this);
          var thisLinkURL = thisLinkElement.attr('href');
          if (thisLinkURL.indexOf('marketo.com') > 1) {
            thisLinkElement.remove();
          }
        });
        // and the inline styles
        var marketoForms = $("[id*='mktoForm']");
        marketoForms.each(function () {
          $(this).find('style').remove();
        });
        // and the style attributes
        marketoForms.each(function () {
          $(this).removeAttr('style');
          $(this).find('[style]').removeAttr('style');
        });

        marketoForms.each(function () {
          var thisMarketoForm = $(this);
          // thisMarketoForm.find('select').niceSelect();
          thisMarketoForm.find(':checkbox').after("<i class='icon icon-checkmark'></i>");
        });

        marketoFormContainer.fadeIn();
      });
    });

    marketoFormContainer.find('.icon-x').on('touchclick', function () {
      var thisMarketoContainer = $(this).parent();
      thisMarketoContainer.find('.inner').remove();
      thisMarketoContainer.fadeOut();
    });
  };

  return {
    init: init
  };
}(jQuery);
'use strict';

/*
global YT, jQuery, window, setInterval, clearInterval
*/

// reference: https://developers.google.com/youtube/iframe_api_reference
// useful tutorial: https://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript

// implements the YouTube iFrame API to display multiple videos - one-at-the-time - in a modal overlay.
// page must have body class hasVideo
// page may have multiple video links "<a class="modal-video" data-video-link="https://youtu.be/30sorJ54rdM" data-video-id="30sorJ54rdM"  data-video-attr="" disabled>Test Video Link 1</a>"
// initially, video links do not have "href" attribute but have attribute "disabled"
// once the api has been loaded and is ready to play videos, all links are activated by adding "href" attribute and removing "disabled" attribute
// the video object is given the first videoID. Videos will be played, after the overlay is active, by calling either videoPlay() when the video has been loaded
// or by loadVideoById() when a new video is requested
// when closing the overlay, the video sound is faded out prior to videoPause(). Do not use videoStop() as that produces strange transitions, e.g. before a
// new video starts, a few frames of the prior video might be visible. API docs recommend to use videoPause().

var modalVideos = function ($, undefined) {
  var modalVideoTriggers = $('.modal-video');
  var player = void 0;
  var videoOverlay = void 0;

  // initialize all video links when the player is ready
  var initVideoLinks = function initVideoLinks() {
    videoOverlay = $('#video-overlay');
    var closeVideoOverlay = videoOverlay.find('.icon-x');

    modalVideoTriggers.each(function () {
      var thisTrigger = $(this);
      var requestedVideoID = thisTrigger.data('video-id');
      var startTime = thisTrigger.data('start-time');
      var endTime = thisTrigger.data('end-time');

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
          player.loadVideoById({
            videoId: requestedVideoID,
            startSeconds: startTime || null,
            endSeconds: endTime || null
          });
        }
        // we might have muted a previous video. set the default level
        player.setVolume(50);
      });
    });

    closeVideoOverlay.on('click', function () {
      // fadeout sound as we close the overlay
      var currentVolume = player.getVolume();
      var fadeout = setInterval(function () {
        if (currentVolume <= 0) {
          // use pauseVideo rather than stopVideo to minimize
          // previous video flashes when starting the new video
          player.pauseVideo();
          clearInterval(fadeout);
        }
        currentVolume -= 5;
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

    switch (event.data) {
      case YT.PlayerState.PAUSED:
        break;

      case YT.PlayerState.PLAYING:
        break;

      case YT.PlayerState.ENDED:
        videoOverlay.fadeOut();
        break;

      case YT.PlayerState.CUED:
        break;

      default:
    }
  };

  var init = function init() {
    if (!$('body').hasClass('hasVideo')) {
      return;
    }

    // on videoAPIReady we add a video overlay and create a video player in div#ytvideo
    $(window).on('videoAPIReady', function () {
      // create an video overlay
      $('body').append('\n            <div id="video-overlay" class="video-overlay">\n                <i class="icon icon-x"></i>\n                <div class="responsive-wrapper">\n                    <div class="video-container">\n                        <div id="ytvideo"></div>\n                    </div>\n                </div>\n            </div>');

      videoOverlay = $('#video-overlay');
      var videoID = modalVideoTriggers.eq(0).data('video-id'); // the first video link
      var startTime = modalVideoTriggers.eq(0).data('start-time');
      var endTime = modalVideoTriggers.eq(0).data('end-time');

      // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
      var playerVars = {
        autoplay: 0,
        start: startTime || null, // if no start or end time is specified go trom 0 to end
        end: endTime || null, // start/stop via js commands
        controls: 1, // show video controls
        enablejsapi: 1, // enable the js api so we can control then player with js
        wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
        origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
        rel: 0 // disable other video suggestions after video end
      };

      // create the video player object
      player = new YT.Player('ytvideo', {
        videoId: videoID,
        playerVars: playerVars,
        events: {
          onReady: initVideoLinks,
          onStateChange: onPlayerStateChange
        }
      });
    });
  };

  return {
    init: init
  };
}(jQuery);
'use strict';

/*
  global jQuery, window
*/

var scrolledIntoView = function ($, undefined) {
  var init = function init() {
    var animateWhenInView = $('.initial');

    var intoView = function intoView(element) {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();
      var elementTop = $(element).offset().top;
      return elementTop <= docViewBottom && elementTop >= docViewTop;
    };

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

  return { init: init };
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

/*jsLint es6 */
/*global YT, jQuery, window */

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
'use strict';

/* jsLint es6 */
/* global YT, jQuery, window, setInterval, clearInterval */

// reference: https://developers.google.com/youtube/iframe_api_reference
// useful tutorial: https://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript

// implements the YouTube iFrame API to display a video background in a banner.
// page must have body class hasVideo
// initially, the video thumbnail is shown until the video has been loded
// once the api has been loaded the video object is given the videoID. The video will be played in a loop


var backgroundVideo = function ($, undefined) {
  var player = void 0;

  var onPlayerReady = function onPlayerReady(event) {
    // event.target.playVideo();
  };

  var onPlayerStateChange = function onPlayerStateChange(event) {
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
        // event.target.playVideo();
        break;

      case YT.PlayerState.CUED:
        break;
    }
  };

  var init = function init() {
    if (!$('body').hasClass('hasVideo')) {
      return;
    }

    var videoID = $('#video-background').data('video-id');

    // on videoAPIReady we add a video overlay and create a video player in div#ytvideo
    $(window).on('videoAPIReady', function () {
      // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
      var playerVars = {
        modestbranding: 1,
        showinfo: 0,
        controls: 0, // show video controls
        enablejsapi: 1, // enable the js api so we can control then player with js
        wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
        origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
        rel: 0,
        autoplay: 0 // disable other video suggestions after video end
      };

      // create the video player object
      player = new YT.Player('video-background-player', {
        videoId: videoID,
        playerVars: playerVars,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    });
  };

  return {
    init: init
  };
}(jQuery);
'use strict';

/* global jQuery, YT, window */

// function to play youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-additional-attributes="?enablejsapi=1&rel=0"></div>
var youTubeVideos = function ($, undefined) {
  var allVideos = $('.youtube-video');

  var _getTnHTML = function _getTnHTML(videoTn) {
    //eslint-disable-line
    var videoHTML = "<div class='video-tn'>";
    videoHTML += '<img src=\'' + videoTn + '\' alt=\'\' />';
    videoHTML += '</div>';
    return videoHTML;
  };

  var _getVideoHTML = function _getVideoHTML(videoID, videoIndex, addAttr) {
    //eslint-disable-line
    var videoHTML = "<div class='video-wrapper'>";
    var addAttributes = addAttr || '';
    videoHTML += '<iframe id=\'player' + videoIndex + '\' src=\'https://www.youtube.com/embed/' + videoID + addAttributes + ' frameborder=\'0\'></iframe>';
    videoHTML += '</div>';
    return videoHTML;
  };

  var init = function init() {
    var allPlayers = [];

    // add all videos to the DOM
    allVideos.each(function (i) {
      var thisVideo = $(this);
      var thisVideoIndex = i;
      // add the thumbnail
      var thisVideoTnHTML = _getTnHTML(thisVideo.data('video-tn'));
      thisVideo.append(thisVideoTnHTML);
      // and the video
      var thisVideoHTML = _getVideoHTML(thisVideo.data('video-id'), thisVideoIndex, thisVideo.data('additional-attributes'));
      thisVideo.append(thisVideoHTML);
    });

    // initialize all video players on a page
    // videoAPIReady is a custom event triggered when the Youtube API has been loaded
    $(window).on('videoAPIReady', function () {
      allVideos.each(function (i) {
        allPlayers[i] = new YT.Player('player' + i, {
          events: {
            onStateChange: function onStateChange(event) {
              // if (event.data === YT.PlayerState.PAUSED) {}
              // if (event.data == YT.PlayerState.PLAYING) {}
              if (event.data === YT.PlayerState.ENDED) {
                // get the player ID
                var currentPlayer = $('#' + event.target.a.id);
                var videoTn = currentPlayer.parent().prev();
                currentPlayer.parent().fadeOut();
                videoTn.fadeIn();
              }
            }
          }
        });
      });

      // initially the video thumbnail is visible. on click fadeout the tn, show and play the video
      allVideos.each(function (i) {
        var thisVideo = $(this);
        thisVideo.find('.video-tn').on('touchclick', function () {
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

/*
  global document, touchClick, inlineVideos,
  externalLinks, bannerBackground, scrollToTop, modalVideos, scrolledIntoView,
  getImageList, buildImageGrid, autoUpdateImageGrid, backgroundVideo, marketoModal
*/

// main.js is called at the end of the document body - no DOMContentLoaded event needed
(function () {
  touchClick.init();
  inlineVideos.init();
  externalLinks.init();
  bannerBackground.init();
  scrollToTop.init();
  modalVideos.init();
  scrolledIntoView.init();
  backgroundVideo.init();

  if (document.body.classList.contains('has-marketo-modal')) {
    marketoModal.init();
  }

  if (document.body.classList.contains('image-widget-page')) {
    var responsiveGridContainer = document.querySelector('#responsive-grid-container');
    // get the image list from server
    getImageList.init();
    // custom event 'grid_images_available' is fired when the image list has been received
    // and we can build the image grid
    responsiveGridContainer.addEventListener('grid_images_available', function (event) {
      buildImageGrid.init(event.detail);
    });
    // custom event 'images_widget_done' is fired when the image grid has been build
    // and we can start updating it
    responsiveGridContainer.addEventListener('images_widget_done', function (event) {
      autoUpdateImageGrid.loop(event.detail);
    });
  }
})();
//# sourceMappingURL=main.js.map
