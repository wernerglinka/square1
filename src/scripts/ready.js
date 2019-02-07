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
    const responsiveGridContainer = document.querySelector('#responsive-grid-container');
    // get the image list from server
    getImageList.init();
    // custom event 'grid_images_available' is fired when the image list has been received
    // and we can build the image grid
    responsiveGridContainer.addEventListener('grid_images_available', (event) => {
      buildImageGrid.init(event.detail);
    });
    // custom event 'images_widget_done' is fired when the image grid has been build
    // and we can start updating it
    responsiveGridContainer.addEventListener('images_widget_done', (event) => {
      autoUpdateImageGrid.loop(event.detail);
    });
  }
}());
