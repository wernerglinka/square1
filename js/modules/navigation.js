const navigation = ( function () {
  'use strict';

  const init = () => {
    console.log( 'enter init navigation' );
    if ( !document.querySelector( '.js-header' ) ) {
      return;
    }
    console.log( 'init navigation' );
    const header = document.querySelector( '.js-header' );
    const mainMenu = document.querySelector( '.js-main-menu' );
    const page = document.body;
    const main = document.querySelector( '#main' );

    header.addEventListener( 'click', ( e ) => {
      // click on hamburger opens/closes the overlay and the main navigation
      if ( e.target.matches( '.js-hamburger, .js-hamburger *' ) ) {
        page.classList.toggle( 'hamburger-active' );
      }
    } );

    mainMenu.addEventListener( 'click', ( e ) => {
      // click on any menu link fades-out the main navigation and the overlay
      if ( e.target.matches( 'a' ) ) {
        // close overlay and menu
        page.classList.add( 'menu-fadeout' );
      }
    } );

    window.addEventListener( 'scroll', ( e ) => {
      // Check if the window has scrolled for about 100px
      if ( window.scrollY >= 100 ) {
        document.body.classList.add( 'is-scrolling' );
      } else {
        document.body.classList.remove( 'is-scrolling' );
      }
    } );
  };

  return { init };
}() );

export default navigation;
