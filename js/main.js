import navigation from './modules/navigation';
import sectionAnimation from './modules/section-animation';
import mobileFlipCardSupport from './modules/mobileFlipcardSupport';

function initPage() {
  navigation.init();
  sectionAnimation.init();
  mobileFlipCardSupport.init();
}

window.addEventListener( 'load', function () {
  initPage();
} );

