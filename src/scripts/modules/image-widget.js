/*
  global $, document, body, window, Event, YT, location, Image, setInterval, localStorage,
  fetch, CustomEvent
*/

/**
 * function to get an image list from the server
 */
const getImageList = (function () {
  const init = function () {
    const imagesFolder = '/assets/images/image-widget/imagelist.json';

    // get the image list
    fetch(imagesFolder)
      .then(response => response.json())
      .then((myJson) => {
        // trigger images available event
        const imageAvailable = new CustomEvent('grid_images_available', { detail: myJson });
        const gridContainer = document.querySelector('#responsive-grid-container');
        gridContainer.dispatchEvent(imageAvailable);
      });
  };
  return { init };
}());

/**
 * function to build the image grid
 */
const buildImageGrid = (function () {
  const init = function (data) {
    const IMAGE_PATH = '/assets/images/image-widget/';

    // build array with path to all images
    const initilAllImageSCRs = data.map(imageName => IMAGE_PATH + imageName);

    // shuffle array randomly - always start with a different image set
    // source: https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4
    const allImageSCRs = initilAllImageSCRs.map(a => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map(a => a[1]);

    // load initial images into displayImagesArray
    const DISPLAY_ARRAY_SIZE = 9;
    const displayImagesArray = allImageSCRs.slice(0, DISPLAY_ARRAY_SIZE);

    // build widget HTML
    let imageGridHTML = "<ul class='image-grid'>";
    displayImagesArray.forEach((imageSRC) => {
      imageGridHTML += `<li><img src="${imageSRC}"/></li>`;
    });
    imageGridHTML += '</ul>';

    // reset local storage so we always start at undefined
    localStorage.removeItem('updateNext');

    // insert widget HTML into DOM
    // this will overwrite the loading animation with the image grid
    const responsiveImageGridContainer = document.querySelector('#responsive-grid-container');
    responsiveImageGridContainer.innerHTML = imageGridHTML;

    // create a new custom event 'images_widget_done' and dispatch on responsiveImageGridContainer
    const widgetDone = new CustomEvent('images_widget_done', { detail: { allImageSCRs, displayImagesArray } });
    responsiveImageGridContainer.dispatchEvent(widgetDone);
  };

  return { init };
}());

const autoUpdateImageGrid = (function () {
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
  const loop = function (data) {
    // array of all available images
    const displayImageSCRs = data.displayImagesArray.slice();
    // remove the image urls that are already in the display array
    let allImageSRCs = data.allImageSCRs.slice().filter(url => !displayImageSCRs.includes(url));
    // indexArray is used to insure that we swap all images in the display within a 9 images cycle
    let indexArray = [];

    // function to provide a new index
    const newIndex = function (max) {
      let newPositionIndex;
      let getNewIndex = true;

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
    const updateImage = function (images, display) {
      const displayArray = display;
      const imageGrid = document.querySelector('.image-grid');
      let imageGridIndex = 0;
      const allAnimations = [
        'zoom-out',
        'slide-right',
        'slide-left',
        'slide-down',
        'slide-up',
        'fade-out',
        'slide-out-top-right',
        'slide-out-top-left',
        'slide-out-bottom-right',
        'slide-out-bottom-left'
      ];

      // generate a new random index for the display
      imageGridIndex = newIndex(displayArray.length);

      // update displayImage array
      // we just use the first element in the images array
      // images[0] will them be rem,oved for this cycle
      displayArray[imageGridIndex] = images[0];

      // update the image
      // prepend image, browser stacking order will show last image
      const newImage = new Image();
      newImage.src = images[0];
      imageGrid.querySelectorAll('li')[imageGridIndex].prepend(newImage);

      // remove the new image from top of allImageSRCs as we do not want to
      // use it again in this display cycle
      images.splice(0, 1);

      // garbage time, remove image tagged for deletion
      const removeElement = imageGrid.querySelector('.to-be-deleted');
      if (removeElement) {
        removeElement.remove();
      }

      // we have loaded an image right behind the existing one and wait a cycle before we update
      // that spot, thus giving us time to download the image
      if (localStorage.updateNext) {
        const updateNow = parseInt(localStorage.updateNext, 10);
        const animationIndex = Math.floor(Math.random() * Math.floor(allAnimations.length));

        // js equavilent to jQuery "imageGrid.find('li').eq(updateNow).find('img').eq(1)
        const elementToBeRemoved = imageGrid
          .querySelectorAll('li')[updateNow]
          .querySelectorAll('img')[1];

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

    setInterval(() => {
      updateImage(allImageSRCs, displayImageSCRs);
      if (allImageSRCs.length === 0) {
        // reload all image scrs but exclude the images that are already in the display grid
        allImageSRCs = data.allImageSCRs.slice().filter(url => !displayImageSCRs.includes(url));
      }
    }, 2000);
  };
  return {
    loop
  };
}());
