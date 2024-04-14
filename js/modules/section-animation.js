import debounce from './debounce.js';

const sectionAnimations = ( function () {
  'use strict';
  const showSection = ( entries, observer ) => {
    // During initial page load the entries array contains all watched objects. The
    // isIntersecting property for the individual object indicates visibility.
    for ( const entry of entries ) {
      if ( entry.isIntersecting ) {
        const thisSection = entry.target;
        // add class to trigger animation
        thisSection.classList.remove( 'is-hidden' );
        // take this section off the observe list
        observer.unobserve( thisSection );
      }
    }
  };

  const updateSections = debounce( function () {
    const observer = new IntersectionObserver( showSection );

    // loop over all image wrappers and add to intersection observer
    const allSections = document.querySelectorAll( '.js-is-animated' );
    for ( const section of allSections ) {
      observer.observe( section );
    }
  }, 500 );

  const init = () => {
    console.log( 'init section animations' );
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // hide all sections that are out of the view port
    const allSections = document.querySelectorAll( '.js-is-animated' );
    for ( const section of allSections ) {
      // get position of section, if it is already partly visible, don't hide it
      const rect = section.getBoundingClientRect();
      if ( rect.top > viewportHeight ) {
        console.log( 'hide section' );
        section.classList.add( 'is-hidden' );
      }
    }

    // images will update on page load and after a resize
    const resizeObserver = new ResizeObserver( updateSections );
    const resizeElement = document.body;
    resizeObserver.observe( resizeElement );
  };

  return {
    init,
  };
}() );

export default sectionAnimations;
