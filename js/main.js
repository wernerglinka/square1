import navigation from './modules/navigation';
import sectionAnimation from './modules/section-animation';
import mobileFlipCardSupport from './modules/mobileFlipcardSupport';
import tabs from './modules/tabs';

function initPage() {
  navigation.init();
  sectionAnimation.init();

  if ( document.querySelector( '.flip-card-wrapper' ) ) {
    mobileFlipCardSupport.init();
  }
  if ( document.querySelector( '.js-tabs' ) ) {
    console.log( 'tabs init' );

    tabs.init();
  }
}

window.addEventListener( 'load', function () {
  initPage();
} );

