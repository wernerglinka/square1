/*
    global window, document
*/

// function for change nav background opacity when banner is scrolled up
const bannerBackground = (function (d) {
  const banner = d.querySelector('.banner');
  let bannerHeight;

  if (banner) {
    bannerHeight = d.querySelector('.banner').getBoundingClientRect().height;
  }

  const hasBanner = d.body.classList.contains('has-page-banner');

  const init = function () {
    if (hasBanner) {
      window.addEventListener('scroll', () => {
        const doc = d.documentElement;
        const thisHeader = d.querySelector('header');

        if ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0) >= bannerHeight && !thisHeader.classList.contains('noOpacity')) {
          thisHeader.classList.add('noOpacity');
        }
        if ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0) < bannerHeight && thisHeader.classList.contains('noOpacity')) {
          thisHeader.classList.remove('noOpacity');
        }
      });
    }
  };

  return { init };
}(document));
