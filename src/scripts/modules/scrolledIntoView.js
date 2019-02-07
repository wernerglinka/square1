/*
  global jQuery, window
*/

const scrolledIntoView = (function ($, undefined) {
  const init = function () {
    const animateWhenInView = $('.initial');

    const intoView = (element) => {
      const docViewTop = $(window).scrollTop();
      const docViewBottom = docViewTop + $(window).height();
      const elementTop = $(element).offset().top;
      return ((elementTop <= docViewBottom) && (elementTop >= docViewTop));
    };

    $(window).scroll(() => {
      if (animateWhenInView.length) {
        animateWhenInView.each(function () {
          const thisElement = $(this);

          if (intoView(thisElement) && thisElement.hasClass('initial')) {
            thisElement.removeClass('initial');
          }
        });
      }
    });
  };

  return { init };
}(jQuery));
