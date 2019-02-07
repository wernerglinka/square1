/*jslint regexp: true, nomen: true, vars: true, plusplus: true, unparam: true*/
/*global jQuery, document, body, window, Event, YT, location, Image, setInterval, localStorage*/

(function ($) {

    'use strict';

    // function to get an image list from the server
    var getImageList = (function () {
        var init = function () {
            var imagesFolder = "/assets/images/image-widget/imagelist.json";
            // get the image list
            $.ajax({
                url: imagesFolder,
                success: function (data) {
                    // trigger images available event
                    $('#responsive-grid-container').trigger('grid_images_available', [data]);

                    console.log(data);
                }
            });
        };
        return {
            init: init
        };
    }());

    // function to build the image grid
    var buildImageGrid = (function () {
        var init = function (data) {
            var responsiveImageGridContainer = $('#responsive-grid-container');
            var imagePath = "/assets/images/image-widget/";
            // build array with path to all images
            var allImageSCRs = data.map(function (imageName) {
                return imagePath + imageName;
            });

            // cache all images
            var imageCache = [];
            allImageSCRs.forEach(function (imageSRC, i) {
                imageCache[i] = new Image();
                imageCache[i].src = imageSRC;
            });

            // function to shuffle an array
            // that’s a Fisher-Yates shuffle
            var shuffleArray = function (array) {
                var i = 0, j = 0, temp = null;

                for (i = array.length - 1; i > 0; i -= 1) {
                    j = Math.floor(Math.random() * (i + 1));
                    temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            };

            // always start with a different image set
            shuffleArray(allImageSCRs);

            // init widget
            var displayImagesArrayLength = 9;
            var displayImagesArray = [];
            var i;

            for (i = 0; displayImagesArrayLength > i; i++) {
                displayImagesArray[i] = allImageSCRs[i];
            }

            var imageGridHTML = "<ul class='image-grid'>";
            displayImagesArray.forEach(function (imageSRC, i) {
                imageGridHTML += '<li><img src="' + allImageSCRs[i] + '"/></li>';
            });
            imageGridHTML += "</ul>";
            responsiveImageGridContainer.append(imageGridHTML);
            $('#image-loader').hide();

            console.log("grid ready");

            // trigger images widget done event
            $('#responsive-grid-container').trigger('images_widget_done', [{allImageSCRs, displayImagesArray}]);
        };

        return {
            init: init
        };
    }());

    var autoUpdateImageGrid = (function () {
        var loop = function (data) {

            var allImageSRCs = data.allImageSCRs.slice();
            var displayImageSCRs = data.displayImagesArray.slice();

            // function to provide a new index
            // but prevent the same index in succession
            var newIndex = function (max) {
                var newPositionIndex;
                var getNewIndex = true;
                // localStorage stores strings
                var lastIndex = parseInt(localStorage.lastIndex, 10);

                while (getNewIndex) {
                    newPositionIndex = parseInt(Math.random() * max, 10);
                    if (lastIndex !== newPositionIndex) {
                        getNewIndex = false;
                    }
                }
                localStorage.lastIndex = newPositionIndex;
                return newPositionIndex;
            };

            var updateImage = function (data) {
                var imageGrid = $('.image-grid');
                var imageGridIndex = 0;
                var newImage, newImageSCR;
                var findNewImage = true;
                var allImageSRCsIndex;
                var allAnimations = [
                    {width: 0, height: 0, left: "50%", top: "50%"}, // zoom out
                    {left: "100%"}, // slide right
                    {right: "100%"}, // slide left
                    {top: "100%"}, // slide down
                    {bottom: "100%"}, // slide up
                    {opacity: 0}, // fadeOut
                    {top: "100%", right: "100%"},
                    {top: "100%", left: "100%"},
                    {bottom: "100%", right: "100%"},
                    {bottom: "100%", left: "100%"}
                ];

                while (findNewImage) {
                    // get index into allImageSRCs
                    allImageSRCsIndex = newIndex(allImageSRCs.length);
                    // insure that the new image is not already displayed
                    if (!displayImageSCRs.includes(allImageSRCs[allImageSRCsIndex])) {
                        newImageSCR = allImageSRCs[allImageSRCsIndex];
                        findNewImage = false;
                    }
                }

                // generate a new random index for the display
                imageGridIndex = newIndex(displayImageSCRs.length);
                // update displayImage array
                displayImageSCRs[imageGridIndex] = newImageSCR;
                // update the image
                newImage = "<img src='" + newImageSCR + "' alt='' />";
                // prepend image, browser stacking order will show last image
                imageGrid.find('li').eq(imageGridIndex).prepend(newImage);

                // remove the new image from allImageSRCs as we do not want to 
                // use it again in this display cycle
                allImageSRCs.splice(allImageSRCsIndex, 1);
                // when we are down to 9 elements we refill allImageSRCs
                // since we always check a new image against what is already
                // in the display array, when we have 9 left, allImageSCRs
                // and displayImageSCRs should be the same
                // this way we will cycle through every image in a cycle
                if (allImageSRCs.length === 8) {
                    allImageSRCs = data.allImageSCRs.slice();
                }

                // we load an image right behind the existing one and wait a cycle before we update
                // that spot, thus giving us time to download the image
                if (localStorage.updateNext) {
                    var updateNow = parseInt(localStorage.updateNext, 10);
                    var animationIndex = newIndex(allAnimations.length);
                    imageGrid.find('li').eq(updateNow).find('img').eq(1).animate(allAnimations[animationIndex], function () {
                        $(this).remove();
                    });
                }
                localStorage.updateNext = imageGridIndex;
            };

            // select the first image
            updateImage(data);

            setInterval(function () {
                updateImage(data);
            }, 2000);

        };
        return {
            loop: loop
        };
    }());

    //the document ready function
    $(function () {

        var responsiveGridContainer = $('#responsive-grid-container');

        getImageList.init();

        /**
        responsiveGridContainer.on('grid_images_available', function (event, data) {
            buildImageGrid.init(data);
        });

        responsiveGridContainer.on('images_widget_done', function (event, data) {
            //autoUpdateImageGrid.loop(data);
        });

        */

    });
    // end ready function

}(jQuery));
