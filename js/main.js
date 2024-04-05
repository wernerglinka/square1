import module1 from './modules/module1';
import module2 from './modules/module2';

function initPage() {
  module1.init();
  module2.init();
}

window.addEventListener( 'load', function () {
  initPage();
} );

