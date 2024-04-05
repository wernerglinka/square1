const module1 = ( function module1() {
  const init = () => {
    console.log( 'module1.js loaded' );
  };
  return {
    init
  };
}() );

export default module1;

