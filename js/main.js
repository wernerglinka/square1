import navigation from './modules/navigation';
import sectionAnimation from './modules/section-animation';

function initPage() {
  navigation.init();
  sectionAnimation.init();
}

window.addEventListener( 'load', function () {
  initPage();
} );

