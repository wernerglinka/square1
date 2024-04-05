const module2 = ( function module2() {
  const init = () => {
    console.log( 'module2.js loaded' );
  };
  return {
    init
  };
}() );

export default module2;
