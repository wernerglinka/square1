import debounce from './debounce.js';

const lottieAnimations = ( function ( $ ) {
  const playLottie = ( entries, observer ) => {
    // During initial page load the entries array contains all watched lotties. The
    // isIntersecting property for the individual object indicates visibility.
    for ( const entry of entries ) {
      if ( entry.isIntersecting ) {
        const thisLottie = entry.target;
        // play lottie when in viewport
        setTimeout( () => {
          thisLottie.play();
          // take this lottie off the observe list
          observer.unobserve( thisLottie );
        }, 500 );
      }
    }
  };

  const watchLottie = debounce( function () {
    const observer = new IntersectionObserver( playLottie );

    // loop over all lotties and add to intersection observer
    const allLotties = document.querySelectorAll( '.js-lottie' );

    for ( const lottie of allLotties ) {
      observer.observe( lottie );
    }
  }, 500 );

  const init = () => {
    const options = {
      threshold: 1.0
    };
    // lotties will update on page load and after a resize
    const resizeObserver = new ResizeObserver( watchLottie, options );
    const resizeElement = document.body;
    resizeObserver.observe( resizeElement );
  };

  return {
    init,
  };
}() );

export default lottieAnimations;
