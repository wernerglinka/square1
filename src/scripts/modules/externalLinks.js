/*
  global document, window
*/

/**
 *  Function to add "target='_blank'" to all external links
 *  External links must include their protocol identifier, e.g. http or https
 */
const externalLinks = (function (d) {
  const allExternalLinks = Array.from(d.querySelectorAll('a[href^="http://"], a[href^="https://"]'));

  const init = function () {
    allExternalLinks.forEach((link) => {
      link.setAttribute('target', '_blank');
    });
  };
  return { init };
}(document));
