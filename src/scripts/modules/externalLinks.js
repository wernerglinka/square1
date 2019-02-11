/*
  global document, window
*/

/**
 *  Function to add "target='_blank'" to all external links
 *  We also add "rel='noopener noreferrer'" according to
 *  source: https://medium.com/@ali.dev/how-to-fix-target-blank-a-security-and-performance-issue-in-web-pages-2118eba1ce2f
 *  External links must include their protocol identifier, e.g. http or https
 */
const externalLinks = (function (d) {
  const allExternalLinks = Array.from(d.querySelectorAll('a[href^="http://"], a[href^="https://"]'));

  const init = function () {
    allExternalLinks.forEach((link) => {
      const targetAttr = link.getAttribute('target');

      console.log(targetAttr);
      console.log(link.getAttribute('href'));

      if (targetAttr === null) {
        link.setAttribute('target', '_blank');
      }
      link.setAttribute('rel', 'noopener noreferrer');
    });
  };
  return { init };
}(document));
