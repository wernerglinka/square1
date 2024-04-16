const mobileFlipCardSupport = ( function ( $ ) {
  const init = () => {
    const flipcards = document.querySelectorAll( '.flip-card-wrapper' );

    flipcards.forEach( ( flipcard ) => {
      flipcard.addEventListener( 'touchstart', function () {
        flipcard.classList.toggle( 'flip' );
      } );

      flipcard.addEventListener( 'mouseenter', function () {
        flipcard.classList.add( 'flip' );
      } );

      flipcard.addEventListener( 'mouseleave', function () {
        flipcard.classList.remove( 'flip' );
      } );
    } );
  };
  return {
    init,
  };
}() );

export default mobileFlipCardSupport;
